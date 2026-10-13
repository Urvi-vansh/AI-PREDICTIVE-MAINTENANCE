/**
 * Sensor Simulation Service for IoT Predictive Maintenance
 * ---------------------------------------------------------
 * Generates deterministic, reproducible sequences of sensor readings for machine demonstrations
 * without requiring a physical ESP32 connected.
 * 
 * Scenario Profiles:
 *  - LOW: Stable RPM, temperature, current, vibration; small realistic fluctuations.
 *  - MEDIUM: Gradual changes, moderate fluctuations, occasional abnormal readings.
 *  - HIGH: Progressive changes, larger fluctuations, sustained abnormalities, occasional spikes.
 * 
 * Model Integration:
 *  - Packages exact 12-feature schema expected by trained RandomForestClassifier:
 *    ['x', 'y', 'z', 'vibration_magnitude', 'vibration_mean', 'vibration_std',
 *     'vibration_peak', 'vibration_anomaly', 'rpm', 'current', 'current_abs', 'temperature']
 *  - Marks synthetic features (x, y, z, vibration components) explicitly.
 *  - Forwards readings to backend inference server (http://127.0.0.1:5000/api/predict).
 *  - NEVER hardcodes predictions or probabilities based on scenario names.
 *  - Surfacing clear error if backend model is offline.
 */

// Canonical feature schema matching predictive_maintenance_features.pkl
export const MODEL_FEATURE_NAMES = [
  'x',
  'y',
  'z',
  'vibration_magnitude',
  'vibration_mean',
  'vibration_std',
  'vibration_peak',
  'vibration_anomaly',
  'rpm',
  'current',
  'current_abs',
  'temperature'
];

export const SCENARIOS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
};

// Seed constants for reproducibility
export const DEFAULT_SEEDS = {
  LOW: 1001,
  MEDIUM: 2002,
  HIGH: 3003
};

/**
 * Deterministic Mulberry32 32-bit pseudo-random number generator
 * Produces reproducible floating-point numbers in [0, 1) given a seed.
 */
export function createPrng(seed) {
  let s = (seed >>> 0) || 12345;
  return function nextRandom() {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Standard Gaussian/Normal distributed noise using Box-Muller transform
 */
export function nextGaussian(prng, mean = 0, stdDev = 1) {
  let u1 = prng();
  let u2 = prng();
  while (u1 === 0) u1 = prng(); // Avoid log(0)
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return mean + z0 * stdDev;
}

/**
 * Simulation Engine Instance per Machine Session
 */
export class SimulationSession {
  constructor(options = {}) {
    this.machineId = options.machineId || 'SEC1M1';
    this.scenario = options.scenario || SCENARIOS.LOW;
    this.seed = options.seed || DEFAULT_SEEDS[this.scenario] || 1001;
    this.prng = createPrng(this.seed);
    this.stepIndex = 0;
    this.windowSize = options.windowSize || 10;
    this.vibrationBuffer = []; // rolling history of magnitudes for sequence statistics

    // Internal continuous state for smooth physical transitions
    this.state = this._initScenarioState(this.scenario);
  }

  _initScenarioState(scenario) {
    switch (scenario) {
      case SCENARIOS.HIGH:
        return {
          rpm: 3800.0,
          current: -15.5,
          temperature: 36.5,
          vibX: 0.8,
          vibY: -0.6,
          vibZ: 1.1
        };
      case SCENARIOS.MEDIUM:
        return {
          rpm: 4650.0,
          current: -13.2,
          temperature: 34.8,
          vibX: 0.2,
          vibY: -0.2,
          vibZ: 0.9
        };
      case SCENARIOS.LOW:
      default:
        return {
          rpm: 4820.0,
          current: -12.4,
          temperature: 34.0,
          vibX: 0.05,
          vibY: 0.04,
          vibZ: 0.98
        };
    }
  }

  /**
   * Reset the simulation to step 0 with a fresh seeded PRNG
   */
  reset(seed = null) {
    this.seed = seed !== null ? seed : (DEFAULT_SEEDS[this.scenario] || 1001);
    this.prng = createPrng(this.seed);
    this.stepIndex = 0;
    this.vibrationBuffer = [];
    this.state = this._initScenarioState(this.scenario);
  }

  /**
   * Change scenario and reset engine cleanly
   */
  setScenario(newScenario, seed = null) {
    this.scenario = newScenario;
    this.reset(seed);
  }

  /**
   * Generates the next deterministic telemetry reading according to the scenario profile.
   * NOTE: Influences sensor inputs ONLY; does not compute predictions.
   */
  nextReading() {
    this.stepIndex += 1;
    const t = this.stepIndex;
    const prng = this.prng;

    let rpm, current, temperature, x, y, z;

    if (this.scenario === SCENARIOS.LOW) {
      // LOW: Mostly stable RPM, temperature, current, vibration; small realistic fluctuations
      const rpmNoise = nextGaussian(prng, 0, 18);
      rpm = Math.max(4400, Math.min(5050, this.state.rpm + rpmNoise * 0.3));
      this.state.rpm = rpm;

      const currNoise = nextGaussian(prng, 0, 0.15);
      current = Math.max(-13.5, Math.min(-11.5, this.state.current + currNoise * 0.2));
      this.state.current = current;

      const tempNoise = nextGaussian(prng, 0, 0.05);
      temperature = Math.max(33.0, Math.min(35.2, this.state.temperature + tempNoise * 0.1));
      this.state.temperature = temperature;

      // Small realistic 3-axis vibration around nominal 1g gravity/rotation
      x = Number((nextGaussian(prng, 0, 0.06)).toFixed(4));
      y = Number((nextGaussian(prng, 0, 0.05)).toFixed(4));
      z = Number((0.95 + nextGaussian(prng, 0, 0.06)).toFixed(4));

    } else if (this.scenario === SCENARIOS.MEDIUM) {
      // MEDIUM: Gradual drift in parameters, moderate fluctuations, occasional abnormal readings
      // Gradual drift downward in RPM, upward in temperature and current draw
      const driftProgress = Math.min(1.0, t / 45); // drifts over ~45 readings
      const baseTargetRpm = 4650 - driftProgress * 800; // down towards ~3850
      const rpmNoise = nextGaussian(prng, 0, 65);
      rpm = Math.max(3200, Math.min(4900, baseTargetRpm + rpmNoise));
      this.state.rpm = rpm;

      const baseTargetCurr = -13.2 - driftProgress * 2.8; // towards -16.0
      const currNoise = nextGaussian(prng, 0, 0.45);
      current = Math.max(-18.0, Math.min(-12.0, baseTargetCurr + currNoise));
      this.state.current = current;

      const baseTargetTemp = 34.8 + driftProgress * 2.2; // towards 37.0°C
      const tempNoise = nextGaussian(prng, 0, 0.12);
      temperature = Math.max(33.5, Math.min(38.2, baseTargetTemp + tempNoise));
      this.state.temperature = temperature;

      // Occasional abnormal vibration reading (every ~12-16 steps)
      const isOccasionalAbnormal = (t % 14 === 0) || (prng() < 0.08);
      const vibScale = isOccasionalAbnormal ? 2.4 : (1.1 + driftProgress * 0.5);
      x = Number((nextGaussian(prng, 0, 0.25 * vibScale)).toFixed(4));
      y = Number((nextGaussian(prng, 0, 0.22 * vibScale)).toFixed(4));
      z = Number((0.95 + nextGaussian(prng, 0, 0.3 * vibScale)).toFixed(4));

    } else {
      // HIGH: Progressive changes, larger fluctuations, sustained abnormalities, occasional spikes
      // Progressively advances towards severe stall, high current surges, and extreme vibration
      const progress = Math.min(1.0, t / 35); // severe deterioration over ~35 readings

      // Progressively collapsing RPM towards stall (< 200 RPM)
      const baseRpm = Math.max(50, 3600 - progress * 3500);
      const rpmJitter = nextGaussian(prng, 0, 140 * (1 - progress * 0.7));
      rpm = Math.max(0, Math.min(4200, baseRpm + rpmJitter));
      this.state.rpm = rpm;

      // Current draw surges towards -21A to -23.8A
      const baseCurrent = -15.5 - progress * 7.5;
      const currJitter = nextGaussian(prng, 0, 0.8);
      // Occasional spike
      const spikeCurrent = (t % 7 === 0 || prng() < 0.15) ? -1.8 : 0;
      current = Math.max(-24.5, Math.min(-14.0, baseCurrent + currJitter + spikeCurrent));
      this.state.current = current;

      // Temperature progressively climbs towards 39.5°C - 41.5°C
      const baseTemp = 36.5 + progress * 4.2;
      const tempJitter = nextGaussian(prng, 0, 0.25);
      temperature = Math.max(35.0, Math.min(42.5, baseTemp + tempJitter));
      this.state.temperature = temperature;

      // Severe multi-axis vibration, sustained abnormalities, occasional high spikes
      const isSevereSpike = (t % 5 === 0) || (prng() < 0.22);
      const vibIntensity = isSevereSpike ? 5.2 : (2.5 + progress * 2.8);
      x = Number((nextGaussian(prng, 1.2 * progress, 0.7 * vibIntensity)).toFixed(4));
      y = Number((nextGaussian(prng, -0.9 * progress, 0.65 * vibIntensity)).toFixed(4));
      z = Number((1.1 + nextGaussian(prng, 0.8 * progress, 0.8 * vibIntensity)).toFixed(4));
    }

    // -------------------------------------------------------------------------
    // Compute Sequence-Buffered Vibration Features for Model Inference
    // -------------------------------------------------------------------------
    const current_abs = Number(Math.abs(current).toFixed(4));
    const vibration_magnitude = Number(Math.sqrt(x * x + y * y + z * z).toFixed(4));

    // Append to rolling window buffer
    this.vibrationBuffer.push(vibration_magnitude);
    if (this.vibrationBuffer.length > this.windowSize) {
      this.vibrationBuffer.shift();
    }

    // Calculate rolling window statistics
    const bufLen = this.vibrationBuffer.length;
    const sum = this.vibrationBuffer.reduce((acc, v) => acc + v, 0);
    const vibration_mean = Number((sum / bufLen).toFixed(4));

    const variance = this.vibrationBuffer.reduce((acc, v) => acc + Math.pow(v - vibration_mean, 2), 0) / bufLen;
    const vibration_std = Number(Math.sqrt(variance).toFixed(4));

    const vibration_peak = Number(Math.max(...this.vibrationBuffer).toFixed(4));

    // Feature vibration_anomaly: model uses binary indicator
    // Anomaly threshold: peak > 2.5 or magnitude > 2.8 or std > 0.8
    const vibration_anomaly = (vibration_magnitude > 2.6 || vibration_peak > 2.5 || vibration_std > 0.75) ? 1 : 0;

    const timestamp = new Date().toISOString();

    // Package the exact 12-feature input vector required by predictive_maintenance_model.pkl
    const modelFeatures = {
      x: Number(x.toFixed(4)),
      y: Number(y.toFixed(4)),
      z: Number(z.toFixed(4)),
      vibration_magnitude,
      vibration_mean,
      vibration_std,
      vibration_peak,
      vibration_anomaly,
      rpm: Number(rpm.toFixed(1)),
      current: Number(current.toFixed(2)),
      current_abs: Number(current_abs.toFixed(2)),
      temperature: Number(temperature.toFixed(2))
    };

    return {
      machineId: this.machineId,
      step: this.stepIndex,
      timestamp,
      scenario: this.scenario,
      seed: this.seed,
      data_source: 'simulation',
      is_simulated: true,

      // Display readings
      rpm: Number(rpm.toFixed(1)),
      current: Number(current.toFixed(2)),
      current_abs: Number(current_abs.toFixed(2)),
      temperature: Number(temperature.toFixed(2)),

      // Mark synthetic readings explicitly as per specification
      synthetic_sensors: {
        x,
        y,
        z,
        vibration_magnitude,
        vibration_mean,
        vibration_std,
        vibration_peak,
        vibration_anomaly,
        is_synthetic: true,
        note: 'Synthetic 3-axis accelerometer & rolling window statistics for ESP32 demo'
      },

      // Full model feature payload
      modelFeatures
    };
  }
}

/**
 * Executes actual ML Model Inference by calling the backend inference server.
 * Returns the true model prediction and probability without any hardcoding.
 */
export async function runModelInference(features) {
  // Support either direct backend port 5000 or Vite proxy /api
  const endpoints = [
    '/api/predict',
    'http://127.0.0.1:5000/api/predict'
  ];

  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ features })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      if (result.status === 'success') {
        return {
          success: true,
          prediction: result.prediction,
          predictionLabel: result.prediction_label,
          failureProbability: result.failure_probability,
          normalProbability: result.normal_probability,
          riskPercentage: result.risk_percentage,
          modelVersion: result.model_version || 'RandomForestClassifier-v1.0',
          featuresUsed: result.features_used || MODEL_FEATURE_NAMES,
          timestamp: result.timestamp || new Date().toISOString(),
          error: null
        };
      } else {
        throw new Error(result.message || 'Unknown inference error');
      }
    } catch (err) {
      lastError = err;
      // Try next endpoint if available
    }
  }

  // Model backend unavailable: return explicit error without mock predictions
  return {
    success: false,
    prediction: null,
    predictionLabel: 'Inference Unavailable',
    failureProbability: null,
    normalProbability: null,
    riskPercentage: null,
    modelVersion: null,
    featuresUsed: MODEL_FEATURE_NAMES,
    timestamp: new Date().toISOString(),
    error: `ML Backend Inference Unreachable: ${lastError ? lastError.message : 'Connection refused'}. Ensure Python inference_server.py is running on port 5000.`
  };
}

/**
 * Checks backend model health status
 */
export async function checkBackendHealth() {
  const endpoints = ['/api/health', 'http://127.0.0.1:5000/api/health'];
  for (const ep of endpoints) {
    try {
      const resp = await fetch(ep);
      if (resp.ok) {
        return await resp.json();
      }
    } catch {}
  }
  return { status: 'offline', model_loaded: false };
}
