import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Square,
  Activity,
  AlertTriangle,
  ShieldCheck,
  Zap,
  RotateCw,
  Thermometer,
  Gauge,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Server,
  Download,
  Info,
  Clock,
  Radio,
  Sliders,
  ChevronDown,
  Layers,
  Sparkles,
  RefreshCw,
  Cpu,
  Lock
} from 'lucide-react';
import {
  SimulationSession,
  SCENARIOS,
  DEFAULT_SEEDS,
  runModelInference,
  checkBackendHealth,
  MODEL_FEATURE_NAMES
} from '../../services/simulationService';

export const MachineSimulationDashboard = ({
  asset,
  currentUser,
  userRole,
  isAuthorized = true,
  activeWorkOrder = null,
  onSwitchToLiveActual = null
}) => {
  // Scenario & playback state
  const [scenario, setScenario] = useState(SCENARIOS.LOW);
  const [simState, setSimState] = useState('stopped'); // 'stopped' | 'running' | 'paused'
  const [intervalMs, setIntervalMs] = useState(1000);
  const [currentReading, setCurrentReading] = useState(null);
  const [latestPrediction, setLatestPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeChartTab, setActiveChartTab] = useState('all'); // 'all' | 'rpm' | 'temp' | 'current' | 'vibration' | 'risk'

  // Backend connection state
  const [backendHealth, setBackendHealth] = useState({ status: 'checking', model_loaded: false });
  const [backendError, setBackendError] = useState(null);

  // Simulation Session ref
  const sessionRef = useRef(null);
  const timerRef = useRef(null);

  // Initialize or re-initialize session on scenario or asset change
  useEffect(() => {
    sessionRef.current = new SimulationSession({
      machineId: asset?.id || 'SEC1M1',
      scenario: scenario,
      seed: DEFAULT_SEEDS[scenario] || 1001
    });

    // Generate an initial nominal preview reading so dashboard is not completely blank before Start
    const initialPreview = sessionRef.current.nextReading();
    setCurrentReading(initialPreview);
    sessionRef.current.reset(); // reset to step 0 for clean Start

    // Check backend health
    checkBackendHealth().then((health) => {
      setBackendHealth(health);
      if (!health.model_loaded) {
        setBackendError(
          health.model_error ||
          'Python backend model not loaded. Run "py server/inference_server.py" on port 5000.'
        );
      } else {
        setBackendError(null);
      }
    });

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [asset?.id]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Simulation step execution
  const executeStep = async () => {
    if (!sessionRef.current) return;

    try {
      // 1. Generate deterministic sensor reading
      const reading = sessionRef.current.nextReading();

      // 2. Perform actual ML inference via backend
      const infResult = await runModelInference(reading.modelFeatures);

      // 3. Package merged record
      const fullRecord = {
        ...reading,
        prediction: infResult.prediction,
        predictionLabel: infResult.predictionLabel,
        failureProbability: infResult.failureProbability,
        normalProbability: infResult.normalProbability,
        riskPercentage: infResult.riskPercentage,
        modelVersion: infResult.modelVersion,
        inferenceError: infResult.error
      };

      setCurrentReading(reading);
      setLatestPrediction(infResult);

      if (infResult.error) {
        setBackendError(infResult.error);
      } else {
        setBackendError(null);
      }

      setHistory((prev) => {
        const next = [fullRecord, ...prev];
        return next.slice(0, 100); // retain last 100 readings
      });
    } catch (err) {
      console.error('Simulation step error:', err);
    }
  };

  // Playback Control Handlers
  const handleStart = () => {
    if (!isAuthorized) return;
    if (simState === 'running') return;

    setSimState('running');
    // Run first step immediately
    executeStep();
    timerRef.current = setInterval(executeStep, intervalMs);
  };

  const handlePause = () => {
    if (!isAuthorized) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSimState('paused');
  };

  const handleResume = () => {
    if (!isAuthorized) return;
    if (simState !== 'paused') return;

    setSimState('running');
    timerRef.current = setInterval(executeStep, intervalMs);
  };

  const handleStop = () => {
    if (!isAuthorized) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSimState('stopped');
  };

  const handleReset = () => {
    if (!isAuthorized) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSimState('stopped');

    if (sessionRef.current) {
      sessionRef.current.reset(DEFAULT_SEEDS[scenario]);
      const initialPreview = sessionRef.current.nextReading();
      setCurrentReading(initialPreview);
      sessionRef.current.reset();
    }
    setHistory([]);
    setLatestPrediction(null);
  };

  const handleReplay = () => {
    if (!isAuthorized) return;
    handleReset();
    setTimeout(() => {
      handleStart();
    }, 100);
  };

  const handleScenarioChange = (newScenario) => {
    if (!isAuthorized) return;
    if (newScenario === scenario) return;

    const wasRunning = simState === 'running';
    if (timerRef.current) clearInterval(timerRef.current);

    setScenario(newScenario);
    sessionRef.current = new SimulationSession({
      machineId: asset?.id || 'SEC1M1',
      scenario: newScenario,
      seed: DEFAULT_SEEDS[newScenario]
    });

    const initialPreview = sessionRef.current.nextReading();
    setCurrentReading(initialPreview);
    sessionRef.current.reset();
    setHistory([]);
    setLatestPrediction(null);

    if (wasRunning) {
      setSimState('running');
      timerRef.current = setInterval(executeStep, intervalMs);
    } else {
      setSimState('stopped');
    }
  };

  const handleIntervalChange = (newInterval) => {
    setIntervalMs(newInterval);
    if (simState === 'running') {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(executeStep, newInterval);
    }
  };

  // Export history to CSV
  const handleExportCSV = () => {
    if (history.length === 0) return;

    const headers = [
      'Step',
      'Timestamp',
      'Scenario',
      'RPM',
      'Temperature_C',
      'Current_A',
      'Current_Abs_A',
      'X_g',
      'Y_g',
      'Z_g',
      'Vibration_Magnitude_g',
      'Vibration_Mean_g',
      'Vibration_Std_g',
      'Vibration_Peak_g',
      'Vibration_Anomaly',
      'ML_Prediction_Class',
      'ML_Prediction_Label',
      'Failure_Probability',
      'Risk_Percentage',
      'Data_Source'
    ];

    const rows = history.map((r) => [
      r.step,
      r.timestamp,
      r.scenario,
      r.rpm,
      r.temperature,
      r.current,
      r.current_abs,
      r.synthetic_sensors?.x || '',
      r.synthetic_sensors?.y || '',
      r.synthetic_sensors?.z || '',
      r.synthetic_sensors?.vibration_magnitude || '',
      r.synthetic_sensors?.vibration_mean || '',
      r.synthetic_sensors?.vibration_std || '',
      r.synthetic_sensors?.vibration_peak || '',
      r.synthetic_sensors?.vibration_anomaly !== undefined ? r.synthetic_sensors.vibration_anomaly : '',
      r.prediction !== null ? r.prediction : '',
      r.predictionLabel || '',
      r.failureProbability !== null ? r.failureProbability : '',
      r.riskPercentage !== null ? r.riskPercentage : '',
      'simulation'
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${asset?.id || 'Machine'}_Simulated_Telemetry_${scenario}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // SVG Sparkline Helper for Live Trend Charts
  const renderSparkline = (dataPoints, color, minVal, maxVal, height = 48, width = 180) => {
    if (!dataPoints || dataPoints.length < 2) {
      return (
        <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)', fontSize: '0.725rem' }}>
          Waiting for reading sequence...
        </div>
      );
    }

    const min = minVal !== undefined ? minVal : Math.min(...dataPoints);
    const max = maxVal !== undefined ? maxVal : Math.max(...dataPoints);
    const range = max - min || 1;

    const points = dataPoints
      .map((val, idx) => {
        const x = (idx / (dataPoints.length - 1)) * width;
        const normalized = (val - min) / range;
        const y = height - normalized * (height - 8) - 4;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} style={{ overflow: 'visible', display: 'block' }}>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {/* Latest dot */}
        {dataPoints.length > 0 && (
          <circle
            cx={width}
            cy={
              height -
              ((dataPoints[dataPoints.length - 1] - min) / range) * (height - 8) -
              4
            }
            r="3.5"
            fill={color}
          />
        )}
      </svg>
    );
  };

  // Reverse chronological history for trend charts (oldest to newest)
  const chartHistory = useMemo(() => [...history].reverse(), [history]);
  const rpmPoints = useMemo(() => chartHistory.map((h) => h.rpm), [chartHistory]);
  const tempPoints = useMemo(() => chartHistory.map((h) => h.temperature), [chartHistory]);
  const currPoints = useMemo(() => chartHistory.map((h) => h.current_abs), [chartHistory]);
  const vibPoints = useMemo(
    () => chartHistory.map((h) => h.synthetic_sensors?.vibration_magnitude || 0),
    [chartHistory]
  );
  const riskPoints = useMemo(
    () => chartHistory.map((h) => (h.riskPercentage !== null ? h.riskPercentage : 0)),
    [chartHistory]
  );

  return (
    <div className="machine-simulation-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* ============================================================== */}
      {/* 1. TOP HEADER & TELEMETRY MODE SWITCH BAR                      */}
      {/* ============================================================== */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          padding: '0.85rem 1.1rem',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              backgroundColor: '#fef3c7',
              color: '#b45309',
              border: '1px solid #fde68a'
            }}
          >
            <Radio size={13} className="animate-pulse" /> SIMULATED DATA
          </span>

          <span
            style={{
              fontSize: '0.825rem',
              fontWeight: 700,
              color: 'var(--text-main)'
            }}
          >
            Virtual ESP32 Telemetry Engine • {asset?.id} ({asset?.name})
          </span>

          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Cpu size={12} /> Seed: #{DEFAULT_SEEDS[scenario]} (Deterministic Replayable)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Backend Status Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.725rem',
              fontWeight: 600,
              backgroundColor: backendHealth.model_loaded ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)',
              color: backendHealth.model_loaded ? '#16a34a' : '#dc2626',
              border: `1px solid ${backendHealth.model_loaded ? 'rgba(22, 163, 74, 0.25)' : 'rgba(220, 38, 38, 0.25)'}`
            }}
            title={backendHealth.model_loaded ? 'RandomForestClassifier loaded on backend' : backendHealth.model_error}
          >
            <Server size={12} />
            {backendHealth.model_loaded ? 'ML Model: RandomForest-v1.0' : 'ML Backend Disconnected'}
          </div>

          {onSwitchToLiveActual && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={onSwitchToLiveActual}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
              title="Return to physical edge IoT gateway telemetry stream"
            >
              Exit Demo & Return to Actual Mode
            </button>
          )}
        </div>
      </div>

      {/* Backend Error Alert if Python server is not reachable */}
      {backendError && (
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem',
            color: '#991b1b',
            fontSize: '0.8rem'
          }}
        >
          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong>Inference Pipeline Warning:</strong> {backendError}
            <div style={{ fontSize: '0.75rem', color: '#b91c1c', marginTop: '0.2rem' }}>
              Real machine learning inference requires the backend service running at <code>http://127.0.0.1:5000</code>. No hardcoded or mock predictions will be substituted.
            </div>
          </div>
        </div>
      )}

      {/* Technician / Read-Only Warning Notice if unauthorized */}
      {!isAuthorized && (
        <div
          style={{
            padding: '0.65rem 0.9rem',
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-secondary)',
            fontSize: '0.775rem'
          }}
        >
          <Lock size={14} style={{ color: 'var(--text-muted)' }} />
          <span>
            <strong>Read-Only Observer Mode:</strong> You are authenticated as {currentUser?.title || userRole}. Demonstration scenario controls are restricted to System Administrator and Sector Heads.
          </span>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. SCENARIO CONTROLS & PLAYBACK TOOLBAR                        */}
      {/* ============================================================== */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          padding: '1rem',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          {/* A. 3 SCENARIO BUTTONS: Low, Medium, High */}
          <div>
            <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
              Select Demonstration Scenario Profile:
            </div>
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`btn btn-sm ${scenario === SCENARIOS.LOW ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleScenarioChange(SCENARIOS.LOW)}
                disabled={!isAuthorized}
                style={{
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  borderColor: scenario === SCENARIOS.LOW ? 'var(--primary-600)' : undefined
                }}
              >
                <ShieldCheck size={14} /> Low Scenario (Stable Baseline)
              </button>

              <button
                type="button"
                className={`btn btn-sm ${scenario === SCENARIOS.MEDIUM ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleScenarioChange(SCENARIOS.MEDIUM)}
                disabled={!isAuthorized}
                style={{
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  borderColor: scenario === SCENARIOS.MEDIUM ? '#d97706' : undefined,
                  backgroundColor: scenario === SCENARIOS.MEDIUM ? '#d97706' : undefined,
                  color: scenario === SCENARIOS.MEDIUM ? '#ffffff' : undefined
                }}
              >
                <Activity size={14} /> Medium Scenario (Gradual Drift)
              </button>

              <button
                type="button"
                className={`btn btn-sm ${scenario === SCENARIOS.HIGH ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleScenarioChange(SCENARIOS.HIGH)}
                disabled={!isAuthorized}
                style={{
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  borderColor: scenario === SCENARIOS.HIGH ? '#dc2626' : undefined,
                  backgroundColor: scenario === SCENARIOS.HIGH ? '#dc2626' : undefined,
                  color: scenario === SCENARIOS.HIGH ? '#ffffff' : undefined
                }}
              >
                <AlertTriangle size={14} /> High Scenario (Progressive Distress)
              </button>
            </div>
          </div>

          {/* B. PLAYBACK CONTROLS: Start, Pause, Resume, Stop, Reset Demo */}
          <div>
            <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
              Telemetry Playback Controls:
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {simState === 'stopped' && (
                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  onClick={handleStart}
                  disabled={!isAuthorized}
                  style={{ fontWeight: 700, fontSize: '0.8rem' }}
                >
                  <Play size={14} /> Start
                </button>
              )}

              {simState === 'running' && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handlePause}
                  disabled={!isAuthorized}
                  style={{ fontWeight: 700, fontSize: '0.8rem' }}
                >
                  <Pause size={14} /> Pause
                </button>
              )}

              {simState === 'paused' && (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleResume}
                  disabled={!isAuthorized}
                  style={{ fontWeight: 700, fontSize: '0.8rem' }}
                >
                  <Play size={14} /> Resume
                </button>
              )}

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleStop}
                disabled={!isAuthorized || simState === 'stopped'}
                style={{ fontSize: '0.8rem' }}
                title="Stop current simulation loop"
              >
                <Square size={13} /> Stop
              </button>

              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={handleReset}
                disabled={!isAuthorized}
                style={{ fontSize: '0.8rem' }}
                title="Reset simulation to step 0 and clear history"
              >
                <RotateCcw size={13} /> Reset Demo
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleReplay}
                disabled={!isAuthorized}
                style={{ fontSize: '0.8rem' }}
                title="Replay this scenario from step 0 using identical seed"
              >
                <RefreshCw size={13} /> Replay
              </button>
            </div>
          </div>
        </div>

        {/* Telemetry Stream Settings Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid var(--border-light)',
            paddingTop: '0.65rem',
            fontSize: '0.775rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Update Interval:</span>
            {[
              { label: '500ms (Fast)', val: 500 },
              { label: '1s (Live ESP32)', val: 1000 },
              { label: '2s', val: 2000 },
              { label: '3s', val: 3000 }
            ].map((opt) => (
              <button
                key={opt.val}
                type="button"
                onClick={() => handleIntervalChange(opt.val)}
                disabled={!isAuthorized}
                style={{
                  padding: '0.15rem 0.45rem',
                  fontSize: '0.725rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid',
                  borderColor: intervalMs === opt.val ? 'var(--primary-600)' : 'var(--border-light)',
                  backgroundColor: intervalMs === opt.val ? 'var(--primary-50)' : 'transparent',
                  color: intervalMs === opt.val ? 'var(--primary-700)' : 'var(--text-muted)',
                  fontWeight: intervalMs === opt.val ? 700 : 500,
                  cursor: isAuthorized ? 'pointer' : 'not-allowed'
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>
              Engine Status:{' '}
              <strong style={{ color: simState === 'running' ? '#16a34a' : simState === 'paused' ? '#d97706' : 'var(--text-muted)' }}>
                {simState.toUpperCase()}
              </strong>
            </span>
            <span>
              Step Count: <strong>{currentReading?.step || 0}</strong>
            </span>
            {history.length > 0 && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleExportCSV}
                style={{ fontSize: '0.725rem', padding: '0.15rem 0.45rem' }}
              >
                <Download size={12} /> Export CSV ({history.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. FOUR DISTINCT STATUS DIMENSIONS (REQUIREMENT 5)             */}
      {/* Clearly separates:                                             */}
      {/* 1. Sensor operating status                                     */}
      {/* 2. ML-predicted failure risk                                   */}
      {/* 3. Confirmed machine failure                                   */}
      {/* 4. Maintenance request status                                  */}
      {/* Never shows RUL unless validated model provides it            */}
      {/* ============================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '0.75rem'
        }}
      >
        {/* Dimension 1: Sensor Operating Status */}
        <div
          style={{
            padding: '0.9rem',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            borderLeft: '4px solid #3b82f6'
          }}
        >
          <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            1. Sensor Operating Status
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.25rem 0' }}>
            {simState === 'running' ? (
              <span style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#16a34a' }} className="animate-pulse" />
                Live Feed Streaming
              </span>
            ) : simState === 'paused' ? (
              <span style={{ color: '#d97706' }}>Feed Paused</span>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>Idle / Stopped</span>
            )}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Profile: <strong>{scenario}</strong> • Step #{currentReading?.step || 0} • Interval {intervalMs / 1000}s
          </div>
        </div>

        {/* Dimension 2: ML-Predicted Failure Risk */}
        <div
          style={{
            padding: '0.9rem',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            borderLeft: `4px solid ${
              latestPrediction?.prediction === 1
                ? '#dc2626'
                : latestPrediction?.riskPercentage > 30
                ? '#d97706'
                : '#16a34a'
            }`
          }}
        >
          <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            2. ML-Predicted Failure Risk
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0.25rem 0' }}>
            {latestPrediction?.prediction !== undefined && latestPrediction?.prediction !== null ? (
              <span
                style={{
                  color: latestPrediction.prediction === 1 ? '#dc2626' : '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                {latestPrediction.prediction === 1 ? (
                  <>
                    <AlertTriangle size={16} /> Failure Predicted ({latestPrediction.riskPercentage}%)
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} /> Normal ({latestPrediction.riskPercentage}% Risk)
                  </>
                )}
              </span>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>Awaiting Model Evaluation</span>
            )}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Model: <strong>RandomForestClassifier-v1.0</strong> (Real Inference)
          </div>
        </div>

        {/* Dimension 3: Confirmed Machine Failure */}
        <div
          style={{
            padding: '0.9rem',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            borderLeft: '4px solid #64748b'
          }}
        >
          <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            3. Confirmed Machine Failure
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.25rem 0' }}>
            <span style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ShieldCheck size={16} /> No Physical Failure
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Hardware: <strong>ESP32 Simulation Isolated</strong> (Physical equipment unaffected)
          </div>
        </div>

        {/* Dimension 4: Maintenance Request Status */}
        <div
          style={{
            padding: '0.9rem',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            borderLeft: '4px solid #8b5cf6'
          }}
        >
          <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            4. Maintenance Request Status
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.25rem 0' }}>
            {activeWorkOrder ? (
              <span style={{ color: 'var(--primary-700)' }}>
                {activeWorkOrder.id} ({activeWorkOrder.status})
              </span>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>No Ticket Active</span>
            )}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Safety Guard: <strong>Simulated Data Does Not Create Tickets</strong>
          </div>
        </div>
      </div>

      {/* RUL Boundary Note */}
      <div
        style={{
          padding: '0.55rem 0.85rem',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px dashed var(--border-medium)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem'
        }}
      >
        <Info size={14} style={{ color: 'var(--primary-600)', flexShrink: 0 }} />
        <span>
          <strong>RUL Governance Rule:</strong> Remaining Useful Life (RUL) estimation is intentionally disabled because the loaded model is a single-row binary <code>RandomForestClassifier</code>. RUL displays are strictly suppressed until a validated regression model is configured.
        </span>
      </div>

      {/* ============================================================== */}
      {/* 4. CURRENT SENSOR TELEMETRY METRICS CARDS                     */}
      {/* ============================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '0.85rem'
        }}
      >
        {/* Metric 1: RPM */}
        <div className="telemetry-metric-card" style={{ padding: '0.9rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Motor / Fan Speed
            </span>
            <RotateCw size={16} style={{ color: 'var(--primary-600)' }} />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.2rem 0' }}>
            {currentReading?.rpm !== undefined ? (
              <>
                {currentReading.rpm.toLocaleString()}{' '}
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>RPM</span>
              </>
            ) : (
              '--'
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
            <span>Target: 4200 - 5000 RPM</span>
            {renderSparkline(rpmPoints, '#2563eb', 0, 5200, 24, 75)}
          </div>
        </div>

        {/* Metric 2: Temperature */}
        <div className="telemetry-metric-card" style={{ padding: '0.9rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Casing Temperature
            </span>
            <Thermometer size={16} style={{ color: currentReading?.temperature > 38 ? '#dc2626' : '#ea580c' }} />
          </div>
          <div
            style={{
              fontSize: '1.65rem',
              fontWeight: 800,
              color: currentReading?.temperature > 38 ? '#dc2626' : currentReading?.temperature > 36 ? '#d97706' : 'var(--text-main)',
              margin: '0.2rem 0'
            }}
          >
            {currentReading?.temperature !== undefined ? (
              <>
                {currentReading.temperature}°{' '}
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>C</span>
              </>
            ) : (
              '--'
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
            <span>Limit: &lt; 38.0°C</span>
            {renderSparkline(tempPoints, '#ea580c', 30, 43, 24, 75)}
          </div>
        </div>

        {/* Metric 3: Current Draw */}
        <div className="telemetry-metric-card" style={{ padding: '0.9rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Current Draw
            </span>
            <Zap size={16} style={{ color: '#eab308' }} />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.2rem 0' }}>
            {currentReading?.current !== undefined ? (
              <>
                {currentReading.current}{' '}
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  A (|{currentReading.current_abs}|A)
                </span>
              </>
            ) : (
              '--'
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
            <span>Nominal: -11A to -14A</span>
            {renderSparkline(currPoints, '#ca8a04', 10, 25, 24, 75)}
          </div>
        </div>

        {/* Metric 4: Vibration Magnitude */}
        <div className="telemetry-metric-card" style={{ padding: '0.9rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Vibration Magnitude
            </span>
            <Activity size={16} style={{ color: '#8b5cf6' }} />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.2rem 0' }}>
            {currentReading?.synthetic_sensors?.vibration_magnitude !== undefined ? (
              <>
                {currentReading.synthetic_sensors.vibration_magnitude}{' '}
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>g</span>
              </>
            ) : (
              '--'
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
            <span>
              Peak: {currentReading?.synthetic_sensors?.vibration_peak || '--'}g • Anomaly:{' '}
              {currentReading?.synthetic_sensors?.vibration_anomaly === 1 ? 'YES' : 'NO'}
            </span>
            {renderSparkline(vibPoints, '#8b5cf6', 0, 7, 24, 75)}
          </div>
        </div>
      </div>

      {/* Synthetic Feature Notice Banner (Requirement 3: "clearly marked as synthetic") */}
      <div
        style={{
          padding: '0.65rem 0.9rem',
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.75rem',
          color: '#1e40af',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Sliders size={14} style={{ color: '#2563eb' }} />
          <span>
            <strong>Synthetic Input Vectors:</strong> Accelerometer components (
            <code>x: {currentReading?.synthetic_sensors?.x}</code>,{' '}
            <code>y: {currentReading?.synthetic_sensors?.y}</code>,{' '}
            <code>z: {currentReading?.synthetic_sensors?.z}</code>) and rolling statistics (
            <code>mean: {currentReading?.synthetic_sensors?.vibration_mean}</code>,{' '}
            <code>std: {currentReading?.synthetic_sensors?.vibration_std}</code>) are computed synthetically for full model input compatibility.
          </span>
        </div>
        <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
          Exact 12 Features Provided to RandomForest
        </span>
      </div>

      {/* ============================================================== */}
      {/* 5. LIVE-UPDATING TREND CHARTS                                  */}
      {/* ============================================================== */}
      <div
        style={{
          padding: '1rem',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Activity size={15} style={{ color: 'var(--primary-600)' }} /> Live-Updating Demonstration Telemetry Charts
          </h4>

          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
            {['all', 'rpm', 'temp', 'current', 'vibration', 'risk'].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`btn btn-sm ${activeChartTab === tab ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveChartTab(tab)}
                style={{ fontSize: '0.725rem', padding: '0.15rem 0.5rem', textTransform: 'capitalize' }}
              >
                {tab === 'all' ? 'All Metrics' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: activeChartTab === 'all' ? 'repeat(auto-fit, minmax(280px, 1fr))' : '1fr',
            gap: '1rem'
          }}
        >
          {/* Chart 1: RPM */}
          {(activeChartTab === 'all' || activeChartTab === 'rpm') && (
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                <span>RPM (Motor Speed)</span>
                <span style={{ color: '#2563eb' }}>{currentReading?.rpm || 0} RPM</span>
              </div>
              <div style={{ height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {renderSparkline(rpmPoints, '#2563eb', 0, 5200, 65, 360)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                <span>0 RPM</span>
                <span>Normal Band: 4200 - 5000 RPM</span>
                <span>5200 RPM</span>
              </div>
            </div>
          )}

          {/* Chart 2: Temperature */}
          {(activeChartTab === 'all' || activeChartTab === 'temp') && (
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                <span>Temperature (°C)</span>
                <span style={{ color: '#ea580c' }}>{currentReading?.temperature || 0}°C</span>
              </div>
              <div style={{ height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {renderSparkline(tempPoints, '#ea580c', 30, 43, 65, 360)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                <span>30.0°C</span>
                <span>Threshold: 38.0°C</span>
                <span>43.0°C</span>
              </div>
            </div>
          )}

          {/* Chart 3: Absolute Current */}
          {(activeChartTab === 'all' || activeChartTab === 'current') && (
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                <span>Current Magnitude (|A|)</span>
                <span style={{ color: '#ca8a04' }}>{currentReading?.current_abs || 0} A</span>
              </div>
              <div style={{ height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {renderSparkline(currPoints, '#ca8a04', 10, 25, 65, 360)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                <span>10.0 A</span>
                <span>Nominal: 12.0 - 14.0 A</span>
                <span>25.0 A</span>
              </div>
            </div>
          )}

          {/* Chart 4: Vibration Magnitude */}
          {(activeChartTab === 'all' || activeChartTab === 'vibration') && (
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                <span>Vibration Magnitude (g)</span>
                <span style={{ color: '#8b5cf6' }}>{currentReading?.synthetic_sensors?.vibration_magnitude || 0} g</span>
              </div>
              <div style={{ height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {renderSparkline(vibPoints, '#8b5cf6', 0, 7, 65, 360)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                <span>0.0 g</span>
                <span>Anomaly Threshold: &gt; 2.5 g</span>
                <span>7.0 g</span>
              </div>
            </div>
          )}

          {/* Chart 5: ML Predicted Failure Probability (%) */}
          {(activeChartTab === 'all' || activeChartTab === 'risk') && (
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                <span>Real ML Failure Probability (%)</span>
                <span style={{ color: latestPrediction?.riskPercentage > 50 ? '#dc2626' : '#16a34a', fontWeight: 800 }}>
                  {latestPrediction?.riskPercentage !== null && latestPrediction?.riskPercentage !== undefined ? `${latestPrediction.riskPercentage}%` : '--'}
                </span>
              </div>
              <div style={{ height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {renderSparkline(riskPoints, '#dc2626', 0, 100, 65, 360)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                <span>0% (Safe)</span>
                <span>Decision Cutoff: 50%</span>
                <span>100% (High Risk)</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 6. SCROLLING SENSOR-READING & INFERENCE HISTORY TABLE           */}
      {/* ============================================================== */}
      <div
        style={{
          padding: '1rem',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              Live Telemetry & Prediction Sequence Log
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Every reading is evaluated through <code>predictive_maintenance_model.pkl</code> via backend REST API.
            </div>
          </div>

          <span className="badge badge-neutral" style={{ fontSize: '0.725rem' }}>
            Showing {history.length} Readings in Session Buffer
          </span>
        </div>

        <div style={{ maxHeight: '280px', overflowY: 'auto', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-light)', zIndex: 1 }}>
              <tr>
                <th style={{ padding: '0.45rem 0.6rem' }}>Step</th>
                <th style={{ padding: '0.45rem 0.6rem' }}>Timestamp</th>
                <th style={{ padding: '0.45rem 0.6rem' }}>RPM</th>
                <th style={{ padding: '0.45rem 0.6rem' }}>Temp</th>
                <th style={{ padding: '0.45rem 0.6rem' }}>Current (A)</th>
                <th style={{ padding: '0.45rem 0.6rem' }}>Vib Mag (g)</th>
                <th style={{ padding: '0.45rem 0.6rem' }}>x, y, z [Synthetic]</th>
                <th style={{ padding: '0.45rem 0.6rem' }}>Vib Anom</th>
                <th style={{ padding: '0.45rem 0.6rem' }}>ML Output</th>
                <th style={{ padding: '0.45rem 0.6rem' }}>Failure Prob</th>
                <th style={{ padding: '0.45rem 0.6rem' }}>Source</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>
                    No telemetry sequence generated yet. Click <strong>Start</strong> to begin live ESP32 demonstration.
                  </td>
                </tr>
              ) : (
                history.map((row, idx) => (
                  <tr
                    key={row.step}
                    style={{
                      borderBottom: '1px solid var(--border-light)',
                      backgroundColor: idx === 0 ? 'var(--primary-50)' : idx % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)'
                    }}
                  >
                    <td style={{ padding: '0.4rem 0.6rem', fontWeight: 700 }}>#{row.step}</td>
                    <td style={{ padding: '0.4rem 0.6rem', color: 'var(--text-muted)' }}>
                      {new Date(row.timestamp).toLocaleTimeString()}
                    </td>
                    <td style={{ padding: '0.4rem 0.6rem', fontWeight: 600 }}>{row.rpm}</td>
                    <td style={{ padding: '0.4rem 0.6rem' }}>{row.temperature}°C</td>
                    <td style={{ padding: '0.4rem 0.6rem' }}>{row.current}A</td>
                    <td style={{ padding: '0.4rem 0.6rem', fontWeight: 600 }}>
                      {row.synthetic_sensors?.vibration_magnitude}g
                    </td>
                    <td style={{ padding: '0.4rem 0.6rem', color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.7rem' }}>
                      {row.synthetic_sensors?.x}, {row.synthetic_sensors?.y}, {row.synthetic_sensors?.z}
                    </td>
                    <td style={{ padding: '0.4rem 0.6rem' }}>
                      {row.synthetic_sensors?.vibration_anomaly === 1 ? (
                        <span style={{ color: '#dc2626', fontWeight: 700 }}>1 (Yes)</span>
                      ) : (
                        <span style={{ color: 'var(--text-light)' }}>0 (No)</span>
                      )}
                    </td>
                    <td style={{ padding: '0.4rem 0.6rem' }}>
                      {row.prediction !== null && row.prediction !== undefined ? (
                        <span
                          style={{
                            fontWeight: 700,
                            color: row.prediction === 1 ? '#dc2626' : '#16a34a'
                          }}
                        >
                          {row.prediction === 1 ? '1 [Failure]' : '0 [Normal]'}
                        </span>
                      ) : (
                        <span style={{ color: '#b45309' }}>Error</span>
                      )}
                    </td>
                    <td style={{ padding: '0.4rem 0.6rem', fontWeight: 700 }}>
                      {row.riskPercentage !== null && row.riskPercentage !== undefined ? (
                        <span style={{ color: row.riskPercentage > 50 ? '#dc2626' : '#16a34a' }}>
                          {row.riskPercentage}%
                        </span>
                      ) : (
                        '--'
                      )}
                    </td>
                    <td style={{ padding: '0.4rem 0.6rem' }}>
                      <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                        {row.data_source}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
