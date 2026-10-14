/* IndustrialCare - Factory Equipment Fleet: Exactly 10 Machines per Sector (40 Total)
   Stable Machine IDs:
   - Sector 1: SEC1M1 through SEC1M10
   - Sector 2: SEC2M1 through SEC2M10
   - Sector 3: SEC3M1 through SEC3M10
   - Sector 4: SEC4M1 through SEC4M10
*/

const RAW_DEFAULT_SECTOR_MACHINES = [
  // ==========================================
  // SECTOR 1: Production & Manufacturing (10 Machines)
  // ==========================================
  {
    id: 'SEC1M1',
    seatNumber: 1,
    bayNumber: 'Bay 01',
    name: 'CNC Vertical Machining Center VMC-1000',
    type: 'CNC Milling Machine',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Machining Line 1',
    category: 'Machining',
    location: 'Bay A - Row 1',
    status: 'Operational',
    predictionRisk: 'Low Risk',
    maintenancePending: false,
    healthScore: 94,
    sensorsCount: 4,
    lastMaintenance: '2026-09-20',
    nextScheduled: '2026-11-10',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '30 kW',
      manufacturer: 'Haas Automation',
      modelYear: '2024'
    },
    readings: {
      temperature: 58.4,
      vibration: 1.4,
      pressure: 5.2,
      power: 24.1,
      rpm: 1750,
      current: 36.8
    },
    lastReadingTimestamp: '2026-10-13 16:45:00',
    dataSource: 'Edge IoT Gateway (Modbus TCP/IP) • Real-Time Stream',
    predictionModel: 'RUL-DeepWeibull-v1.2',
    predictedFailureWindow: '1200+ Operating Hours (Nominal)',
    faultClassificationModel: null,
    faultType: null
  },
  {
    id: 'SEC1M2',
    seatNumber: 2,
    bayNumber: 'Bay 02',
    name: 'High-Speed Robotic Stamping Press SP-400',
    type: 'Robotic Stamping Press',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Stamping Bay 1',
    category: 'Stamping',
    location: 'Bay A - Row 1',
    status: 'Operational',
    predictionRisk: 'Low Risk',
    maintenancePending: false,
    healthScore: 91,
    sensorsCount: 4,
    lastMaintenance: '2026-09-18',
    nextScheduled: '2026-11-12',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '55 kW',
      manufacturer: 'Schuler Group',
      modelYear: '2023'
    },
    readings: {
      temperature: 64.2,
      vibration: 2.1,
      pressure: 16.5,
      power: 48.0
    }
  },
  {
    id: 'SEC1M3',
    seatNumber: 3,
    bayNumber: 'Bay 03',
    name: 'Precision 5-Axis CNC Milling Center Mill-5X',
    type: '5-Axis CNC Mill',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Machining Line 1',
    category: 'Machining',
    location: 'Bay A - Row 2',
    status: 'Operational',
    predictionRisk: 'Low Risk',
    maintenancePending: false,
    healthScore: 96,
    sensorsCount: 4,
    lastMaintenance: '2026-09-25',
    nextScheduled: '2026-11-20',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '42 kW',
      manufacturer: 'DMG Mori',
      modelYear: '2025'
    },
    readings: {
      temperature: 52.8,
      vibration: 1.1,
      pressure: 6.0,
      power: 32.5
    }
  },
  {
    id: 'SEC1M4',
    seatNumber: 4,
    bayNumber: 'Bay 04',
    name: 'Robotic Spot Welding Cell RobWeld-01',
    type: 'Spot Welding Cell',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Fabrication Line 2',
    category: 'Robotics',
    location: 'Bay A - Row 2',
    status: 'Operational',
    predictionRisk: 'Medium Risk',
    maintenancePending: false,
    healthScore: 88,
    sensorsCount: 4,
    lastMaintenance: '2026-09-15',
    nextScheduled: '2026-11-05',
    assignedTech: 'Elena Rostova',
    specs: {
      power: '28 kW',
      manufacturer: 'FANUC Robotics',
      modelYear: '2023'
    },
    readings: {
      temperature: 61.5,
      vibration: 2.4,
      pressure: 5.8,
      power: 26.0
    }
  },
  {
    id: 'SEC1M5',
    seatNumber: 5,
    bayNumber: 'Bay 05',
    name: 'Automated Sheet Metal Laser Cutter LC-6000',
    type: 'Fiber Laser Cutter',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Stamping Bay 1',
    category: 'Stamping',
    location: 'Bay A - Row 3',
    status: 'Operational',
    predictionRisk: 'Low Risk',
    maintenancePending: false,
    healthScore: 93,
    sensorsCount: 4,
    lastMaintenance: '2026-09-22',
    nextScheduled: '2026-11-15',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '60 kW',
      manufacturer: 'Trumpf',
      modelYear: '2024'
    },
    readings: {
      temperature: 49.3,
      vibration: 0.9,
      pressure: 25.0,
      power: 51.2
    }
  },
  {
    id: 'SEC1M6',
    seatNumber: 6,
    bayNumber: 'Bay 06',
    name: 'CNC Lathe & Turning Center TurnPro-80',
    type: 'CNC Turning Center',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Machining Line 2',
    category: 'Machining',
    location: 'Bay A - Row 3',
    status: 'Warning',
    predictionRisk: 'High Risk',
    maintenancePending: true,
    healthScore: 68,
    sensorsCount: 4,
    lastMaintenance: '2026-08-30',
    nextScheduled: '2026-10-18',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '25 kW',
      manufacturer: 'Mazak Corporation',
      modelYear: '2022'
    },
    readings: {
      temperature: 78.6,
      vibration: 4.8,
      pressure: 4.5,
      power: 23.8,
      rpm: 2150,
      current: 54.6
    },
    lastReadingTimestamp: '2026-10-13 16:40:05',
    dataSource: 'Edge IoT Gateway (Modbus TCP/IP) • Real-Time Stream',
    predictionModel: 'RUL-RandomForest-v1.8',
    predictedFailureWindow: '3 - 5 Operating Days',
    faultClassificationModel: 'Vibration-FFT-Spectral-Classifier-v3.0',
    faultType: 'Main Chuck Spindle Unbalance & Bearing Play'
  },
  {
    id: 'SEC1M7',
    seatNumber: 7,
    bayNumber: 'Bay 07',
    name: 'Heavy Hydraulic Press Brake HPB-320',
    type: 'Hydraulic Press Brake',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Stamping Bay 2',
    category: 'Stamping',
    location: 'Bay A - Row 4',
    status: 'Operational',
    predictionRisk: 'Low Risk',
    maintenancePending: false,
    healthScore: 90,
    sensorsCount: 4,
    lastMaintenance: '2026-09-12',
    nextScheduled: '2026-11-08',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '37 kW',
      manufacturer: 'Amada',
      modelYear: '2023'
    },
    readings: {
      temperature: 55.1,
      vibration: 1.6,
      pressure: 18.0,
      power: 31.0,
      rpm: null,
      current: 42.1
    },
    lastReadingTimestamp: '2026-10-13 16:44:12',
    dataSource: 'Edge IoT Gateway (Modbus TCP/IP) • Hydraulic Telemetry Bus',
    predictionModel: null,
    predictedFailureWindow: null,
    faultClassificationModel: null,
    faultType: null
  },
  {
    id: 'SEC1M8',
    seatNumber: 8,
    bayNumber: 'Bay 08',
    name: 'Multi-Spindle Drilling Machine DrillMaster-12',
    type: 'Multi-Spindle Drill',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Machining Line 2',
    category: 'Machining',
    location: 'Bay A - Row 4',
    status: 'Critical',
    predictionRisk: 'Critical Risk',
    maintenancePending: true,
    healthScore: 42,
    sensorsCount: 4,
    lastMaintenance: '2026-08-15',
    nextScheduled: '2026-10-14',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '22 kW',
      manufacturer: 'Kaufman Mfg',
      modelYear: '2021'
    },
    readings: {
      temperature: 89.4,
      vibration: 7.2,
      pressure: 3.8,
      power: 26.5,
      rpm: 2850,
      current: 68.2
    },
    lastReadingTimestamp: '2026-10-13 16:42:10',
    dataSource: 'Edge IoT Gateway (Modbus TCP/IP) • High-Frequency Accelerometer',
    predictionModel: 'RUL-XGBoost-Regressor-v2.4',
    predictedFailureWindow: 'Within 24 - 48 Hours',
    faultClassificationModel: 'Vibration-FFT-Spectral-Classifier-v3.0',
    faultType: 'Multi-Spindle Gearbox Tooth Flank Pitting'
  },
  {
    id: 'SEC1M9',
    seatNumber: 9,
    bayNumber: 'Bay 09',
    name: 'Automatic Surface Grinding Machine Grinder-GS',
    type: 'Surface Grinder',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Machining Line 2',
    category: 'Machining',
    location: 'Bay A - Row 5',
    status: 'Operational',
    predictionRisk: null,
    maintenancePending: false,
    healthScore: 95,
    sensorsCount: 4,
    lastMaintenance: '2026-09-28',
    nextScheduled: '2026-11-25',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '15 kW',
      manufacturer: 'Okamoto',
      modelYear: '2024'
    },
    readings: {
      temperature: 46.2,
      vibration: 0.8,
      pressure: 4.9,
      power: 12.4,
      rpm: 1450,
      current: 24.1
    },
    lastReadingTimestamp: '2026-10-13 16:38:22',
    dataSource: 'Manual Calibration Log & Local PLC',
    predictionModel: null,
    predictedFailureWindow: null,
    faultClassificationModel: null,
    faultType: null
  },
  {
    id: 'SEC1M10',
    seatNumber: 10,
    bayNumber: 'Bay 10',
    name: 'High-Tonnage Blanking Press BKP-500',
    type: 'Mechanical Blanking Press',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Stamping Bay 2',
    category: 'Stamping',
    location: 'Bay A - Row 5',
    status: 'Offline',
    predictionRisk: null,
    maintenancePending: true,
    healthScore: 0,
    sensorsCount: 4,
    lastMaintenance: '2026-07-20',
    nextScheduled: '2026-10-16',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '75 kW',
      manufacturer: 'Aida Engineering',
      modelYear: '2020'
    },
    readings: {
      temperature: 24.0,
      vibration: 0.0,
      pressure: 0.0,
      power: 0.0,
      rpm: 0,
      current: 0.0
    },
    lastReadingTimestamp: '2026-10-13 14:15:00',
    dataSource: 'PLC Lockout Circuit (E-Stop Active)',
    predictionModel: null,
    predictedFailureWindow: null,
    faultClassificationModel: null,
    faultType: null
  },

  // ==========================================
  // SECTOR 2: Heavy Machining & Fabrication (10 Machines)
  // ==========================================
  {
    id: 'SEC2M1',
    seatNumber: 1,
    bayNumber: 'Bay 01',
    name: 'Heavy Duty Horizontal Boring Mill HBM-200',
    type: 'Horizontal Boring Mill',
    sector: 'Sector 2 (Heavy Machining & Fabrication)',
    department: 'Heavy Machining Bay',
    category: 'Machining',
    location: 'Heavy Hall A - Row 1',
    status: 'Operational',
    predictionRisk: 'Low Risk',
    maintenancePending: false,
    healthScore: 92,
    sensorsCount: 4,
    lastMaintenance: '2026-09-21',
    nextScheduled: '2026-11-14',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '65 kW',
      manufacturer: 'Pama SpA',
      modelYear: '2023'
    },
    readings: {
      temperature: 60.1,
      vibration: 1.8,
      pressure: 7.2,
      power: 54.0
    }
  },
  {
    id: 'SEC2M2',
    seatNumber: 2,
    bayNumber: 'Bay 02',
    name: 'High-Definition Plasma Cutting Table PlasCut-4K',
    type: 'Plasma Cutting Table',
    sector: 'Sector 2 (Heavy Machining & Fabrication)',
    department: 'Thermal Cutting Cell',
    category: 'Thermal Systems',
    location: 'Heavy Hall A - Row 1',
    status: 'Operational',
    predictionRisk: 'Low Risk',
    maintenancePending: false,
    healthScore: 94,
    sensorsCount: 4,
    lastMaintenance: '2026-09-24',
    nextScheduled: '2026-11-19',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '45 kW',
      manufacturer: 'Hypertherm',
      modelYear: '2024'
    },
    readings: {
      temperature: 53.4,
      vibration: 1.2,
      pressure: 6.8,
      power: 39.5
    }
  },
  {
    id: 'SEC2M3',
    seatNumber: 3,
    bayNumber: 'Bay 03',
    name: 'Submerged Arc Welding Station SAW-800',
    type: 'Submerged Arc Welder',
    sector: 'Sector 2 (Heavy Machining & Fabrication)',
    department: 'Heavy Fabrication Bay',
    category: 'Fluid Systems',
    location: 'Heavy Hall A - Row 2',
    status: 'Operational',
    predictionRisk: 'Low Risk',
    maintenancePending: false,
    healthScore: 89,
    sensorsCount: 4,
    lastMaintenance: '2026-09-17',
    nextScheduled: '2026-11-09',
    assignedTech: 'Elena Rostova',
    specs: {
      power: '50 kW',
      manufacturer: 'Lincoln Electric',
      modelYear: '2023'
    },
    readings: {
      temperature: 63.8,
      vibration: 1.5,
      pressure: 5.5,
      power: 42.0
    }
  },
  {
    id: 'SEC2M4',
    seatNumber: 4,
    bayNumber: 'Bay 04',
    name: 'Hydraulic Plate Bending Roller RollBend-40',
    type: '4-Roll Plate Bender',
    sector: 'Sector 2 (Heavy Machining & Fabrication)',
    department: 'Heavy Fabrication Bay',
    category: 'Fluid Systems',
    location: 'Heavy Hall A - Row 2',
    status: 'Operational',
    predictionRisk: 'Medium Risk',
    maintenancePending: false,
    healthScore: 87,
    sensorsCount: 4,
    lastMaintenance: '2026-09-14',
    nextScheduled: '2026-11-04',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '35 kW',
      manufacturer: 'Davi Promau',
      modelYear: '2022'
    },
    readings: {
      temperature: 65.2,
      vibration: 2.2,
      pressure: 22.0,
      power: 30.5
    }
  },
  {
    id: 'SEC2M5',
    seatNumber: 5,
    bayNumber: 'Bay 05',
    name: 'Heavy Gantry CNC Milling Center Gantry-M8',
    type: 'Gantry CNC Mill',
    sector: 'Sector 2 (Heavy Machining & Fabrication)',
    department: 'Heavy Machining Bay',
    category: 'Machining',
    location: 'Heavy Hall A - Row 3',
    status: 'Warning',
    predictionRisk: 'High Risk',
    maintenancePending: true,
    healthScore: 65,
    sensorsCount: 4,
    lastMaintenance: '2026-08-28',
    nextScheduled: '2026-10-19',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '70 kW',
      manufacturer: 'Waldrich Coburg',
      modelYear: '2022'
    },
    readings: {
      temperature: 82.5,
      vibration: 5.1,
      pressure: 6.2,
      power: 63.0
    }
  },
  {
    id: 'SEC2M6',
    seatNumber: 6,
    bayNumber: 'Bay 06',
    name: 'Dual-Ram Hydraulic Press DRP-1000',
    type: 'Hydraulic Press',
    sector: 'Sector 2 (Heavy Machining & Fabrication)',
    department: 'Heavy Fabrication Bay',
    category: 'Fluid Systems',
    location: 'Heavy Hall A - Row 3',
    status: 'Operational',
    predictionRisk: 'Low Risk',
    maintenancePending: false,
    healthScore: 92,
    sensorsCount: 4,
    lastMaintenance: '2026-09-22',
    nextScheduled: '2026-11-16',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '90 kW',
      manufacturer: 'Siempelkamp',
      modelYear: '2024'
    },
    readings: {
      temperature: 57.0,
      vibration: 1.6,
      pressure: 28.5,
      power: 74.0
    }
  },
  {
    id: 'SEC2M7',
    seatNumber: 7,
    bayNumber: 'Bay 07',
    name: 'Heavy Structural Beam Punching Line BeamPunch-P3',
    type: 'Beam Punching Line',
    sector: 'Sector 2 (Heavy Machining & Fabrication)',
    department: 'Heavy Fabrication Bay',
    category: 'Machining',
    location: 'Heavy Hall A - Row 4',
    status: 'Operational',
    predictionRisk: 'Low Risk',
    maintenancePending: false,
    healthScore: 95,
    sensorsCount: 4,
    lastMaintenance: '2026-09-26',
    nextScheduled: '2026-11-21',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '32 kW',
      manufacturer: 'Peddinghaus',
      modelYear: '2024'
    },
    readings: {
      temperature: 51.3,
      vibration: 1.3,
      pressure: 8.5,
      power: 27.2
    }
  },
  {
    id: 'SEC2M8',
    seatNumber: 8,
    bayNumber: 'Bay 08',
    name: 'Rotary Pipe & Tube Profiler TubeCut-360',
    type: 'CNC Pipe Profiler',
    sector: 'Sector 2 (Heavy Machining & Fabrication)',
    department: 'Thermal Cutting Cell',
    category: 'Thermal Systems',
    location: 'Heavy Hall A - Row 4',
    status: 'Critical',
    predictionRisk: 'Critical Risk',
    maintenancePending: true,
    healthScore: 38,
    sensorsCount: 4,
    lastMaintenance: '2026-08-10',
    nextScheduled: '2026-10-15',
    assignedTech: 'Elena Rostova',
    specs: {
      power: '40 kW',
      manufacturer: 'Muller Opladen',
      modelYear: '2021'
    },
    readings: {
      temperature: 92.1,
      vibration: 8.0,
      pressure: 4.1,
      power: 45.0
    }
  },
  {
    id: 'SEC2M9',
    seatNumber: 9,
    bayNumber: 'Bay 09',
    name: 'Industrial Shot Blasting Chamber BlastPro-X',
    type: 'Shot Blasting Chamber',
    sector: 'Sector 2 (Heavy Machining & Fabrication)',
    department: 'Surface Preparation Cell',
    category: 'Fluid Systems',
    location: 'Heavy Hall A - Row 5',
    status: 'Operational',
    predictionRisk: null,
    maintenancePending: false,
    healthScore: 91,
    sensorsCount: 4,
    lastMaintenance: '2026-09-19',
    nextScheduled: '2026-11-11',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '55 kW',
      manufacturer: 'Wheelabrator',
      modelYear: '2023'
    },
    readings: {
      temperature: 54.6,
      vibration: 2.0,
      pressure: 7.0,
      power: 46.8
    }
  },
  {
    id: 'SEC2M10',
    seatNumber: 10,
    bayNumber: 'Bay 10',
    name: 'Large Heavy Fabrication Positioner PosTurn-50T',
    type: 'Welding Positioner',
    sector: 'Sector 2 (Heavy Machining & Fabrication)',
    department: 'Heavy Fabrication Bay',
    category: 'Machining',
    location: 'Heavy Hall A - Row 5',
    status: 'Offline',
    predictionRisk: null,
    maintenancePending: true,
    healthScore: 0,
    sensorsCount: 4,
    lastMaintenance: '2026-07-15',
    nextScheduled: '2026-10-17',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '20 kW',
      manufacturer: 'Koike Aronson',
      modelYear: '2020'
    },
    readings: {
      temperature: 22.0,
      vibration: 0.0,
      pressure: 0.0,
      power: 0.0
    }
  },

  // ==========================================
  // SECTOR 3: Assembly & Packaging (10 Machines)
  // ==========================================
  {
    id: 'SEC3M1',
    seatNumber: 1,
    bayNumber: 'Bay 01',
    name: 'High-Speed Pick & Place Robot PPR-120',
    type: 'Pick & Place Robot',
    sector: 'Sector 3 (Assembly & Packaging)',
    department: 'Assembly Line 1',
    category: 'Robotics',
    location: 'Packaging Hall A - Row 1',
    status: 'Operational',
    predictionRisk: 'Low Risk',
    maintenancePending: false,
    healthScore: 97,
    sensorsCount: 4,
    lastMaintenance: '2026-09-30',
    nextScheduled: '2026-11-28',
    assignedTech: 'Elena Rostova',
    specs: {
      power: '10 kW',
      manufacturer: 'ABB Robotics',
      modelYear: '2025'
    },
    readings: {
      temperature: 44.5,
      vibration: 0.7,
      pressure: 6.2,
      power: 8.4
    }
  },
  {
    id: 'SEC3M2',
    seatNumber: 2,
    bayNumber: 'Bay 02',
    name: 'Automated Carton Erector & Sealer CES-60',
    type: 'Carton Erector',
    sector: 'Sector 3 (Assembly & Packaging)',
    department: 'Packaging Line 1',
    category: 'Pneumatics',
    location: 'Packaging Hall A - Row 1',
    status: 'Operational',
    predictionRisk: 'Low Risk',
    maintenancePending: false,
    healthScore: 93,
    sensorsCount: 4,
    lastMaintenance: '2026-09-23',
    nextScheduled: '2026-11-17',
    assignedTech: 'Elena Rostova',
    specs: {
      power: '12 kW',
      manufacturer: 'Wexxar Packaging',
      modelYear: '2024'
    },
    readings: {
      temperature: 47.8,
      vibration: 1.1,
      pressure: 6.5,
      power: 9.8
    }
  },
  {
    id: 'SEC3M3',
    seatNumber: 3,
    bayNumber: 'Bay 03',
    name: 'Ultrasonic Welding Station USW-20',
    type: 'Ultrasonic Welder',
    sector: 'Sector 3 (Assembly & Packaging)',
    department: 'Assembly Line 1',
    category: 'Pneumatics',
    location: 'Packaging Hall A - Row 2',
    status: 'Operational',
    predictionRisk: 'Low Risk',
    maintenancePending: false,
    healthScore: 91,
    sensorsCount: 4,
    lastMaintenance: '2026-09-20',
    nextScheduled: '2026-11-13',
    assignedTech: 'Elena Rostova',
    specs: {
      power: '8 kW',
      manufacturer: 'Branson Ultrasonics',
      modelYear: '2023'
    },
    readings: {
      temperature: 49.0,
      vibration: 0.9,
      pressure: 5.8,
      power: 6.5
    }
  },
  {
    id: 'SEC3M4',
    seatNumber: 4,
    bayNumber: 'Bay 04',
    name: 'Automated Optical Inspection Scanner AOI-900',
    type: 'Vision Inspection System',
    sector: 'Sector 3 (Assembly & Packaging)',
    department: 'Quality Inspection Cell',
    category: 'Robotics',
    location: 'Packaging Hall A - Row 2',
    status: 'Operational',
    predictionRisk: 'Medium Risk',
    maintenancePending: false,
    healthScore: 89,
    sensorsCount: 4,
    lastMaintenance: '2026-09-18',
    nextScheduled: '2026-11-10',
    assignedTech: 'Elena Rostova',
    specs: {
      power: '6 kW',
      manufacturer: 'Cognex',
      modelYear: '2024'
    },
    readings: {
      temperature: 42.1,
      vibration: 0.4,
      pressure: 5.0,
      power: 4.8
    }
  },
  {
    id: 'SEC3M5',
    seatNumber: 5,
    bayNumber: 'Bay 05',
    name: 'Multi-Axis Fastener Insertion Machine FastenPro-6',
    type: 'Fastener Insertion Machine',
    sector: 'Sector 3 (Assembly & Packaging)',
    department: 'Assembly Line 2',
    category: 'Robotics',
    location: 'Packaging Hall A - Row 3',
    status: 'Warning',
    predictionRisk: 'High Risk',
    maintenancePending: true,
    healthScore: 71,
    sensorsCount: 4,
    lastMaintenance: '2026-09-02',
    nextScheduled: '2026-10-20',
    assignedTech: 'Elena Rostova',
    specs: {
      power: '14 kW',
      manufacturer: 'Haeger',
      modelYear: '2022'
    },
    readings: {
      temperature: 73.2,
      vibration: 4.2,
      pressure: 7.8,
      power: 15.6
    }
  },
  {
    id: 'SEC3M6',
    seatNumber: 6,
    bayNumber: 'Bay 06',
    name: 'Rotary Indexing Assembly Table RotaryTable-12',
    type: 'Rotary Dial Assembly Table',
    sector: 'Sector 3 (Assembly & Packaging)',
    department: 'Assembly Line 2',
    category: 'Pneumatics',
    location: 'Packaging Hall A - Row 3',
    status: 'Operational',
    predictionRisk: 'Low Risk',
    maintenancePending: false,
    healthScore: 94,
    sensorsCount: 4,
    lastMaintenance: '2026-09-25',
    nextScheduled: '2026-11-22',
    assignedTech: 'Elena Rostova',
    specs: {
      power: '18 kW',
      manufacturer: 'Weiss GmbH',
      modelYear: '2023'
    },
    readings: {
      temperature: 52.0,
      vibration: 1.4,
      pressure: 6.2,
      power: 14.0
    }
  },
  {
    id: 'SEC3M7',
    seatNumber: 7,
    bayNumber: 'Bay 07',
    name: 'Shrink Wrap Packaging Tunnel ShrinkTunnel-40',
    type: 'Shrink Wrap Heat Tunnel',
    sector: 'Sector 3 (Assembly & Packaging)',
    department: 'Packaging Line 2',
    category: 'Material Handling',
    location: 'Packaging Hall A - Row 4',
    status: 'Operational',
    predictionRisk: 'Low Risk',
    maintenancePending: false,
    healthScore: 92,
    sensorsCount: 4,
    lastMaintenance: '2026-09-21',
    nextScheduled: '2026-11-15',
    assignedTech: 'Elena Rostova',
    specs: {
      power: '26 kW',
      manufacturer: 'ARPAC',
      modelYear: '2024'
    },
    readings: {
      temperature: 68.4,
      vibration: 1.2,
      pressure: 5.5,
      power: 22.0
    }
  },
  {
    id: 'SEC3M8',
    seatNumber: 8,
    bayNumber: 'Bay 08',
    name: 'High-Speed Case Packing Cell PackBot-800',
    type: 'Robotic Case Packer',
    sector: 'Sector 3 (Assembly & Packaging)',
    department: 'Packaging Line 2',
    category: 'Robotics',
    location: 'Packaging Hall A - Row 4',
    status: 'Critical',
    predictionRisk: 'Critical Risk',
    maintenancePending: true,
    healthScore: 45,
    sensorsCount: 4,
    lastMaintenance: '2026-08-18',
    nextScheduled: '2026-10-16',
    assignedTech: 'Elena Rostova',
    specs: {
      power: '24 kW',
      manufacturer: 'KUKA Robotics',
      modelYear: '2021'
    },
    readings: {
      temperature: 86.5,
      vibration: 6.9,
      pressure: 7.5,
      power: 28.0
    }
  },
  {
    id: 'SEC3M9',
    seatNumber: 9,
    bayNumber: 'Bay 09',
    name: 'Automated Label Applicator & Verifier LabelMaster-L1',
    type: 'High-Speed Label Applicator',
    sector: 'Sector 3 (Assembly & Packaging)',
    department: 'Packaging Line 2',
    category: 'Material Handling',
    location: 'Packaging Hall A - Row 5',
    status: 'Operational',
    predictionRisk: null,
    maintenancePending: false,
    healthScore: 96,
    sensorsCount: 4,
    lastMaintenance: '2026-09-27',
    nextScheduled: '2026-11-24',
    assignedTech: 'Elena Rostova',
    specs: {
      power: '5 kW',
      manufacturer: 'Markem-Imaje',
      modelYear: '2025'
    },
    readings: {
      temperature: 38.6,
      vibration: 0.5,
      pressure: 5.2,
      power: 3.9
    }
  },
  {
    id: 'SEC3M10',
    seatNumber: 10,
    bayNumber: 'Bay 10',
    name: 'Pallet Wrapping & Stacking Cell WrapMaster-P2',
    type: 'Rotary Arm Stretch Wrapper',
    sector: 'Sector 3 (Assembly & Packaging)',
    department: 'Packaging Line 2',
    category: 'Material Handling',
    location: 'Packaging Hall A - Row 5',
    status: 'Offline',
    predictionRisk: null,
    maintenancePending: true,
    healthScore: 0,
    sensorsCount: 4,
    lastMaintenance: '2026-07-28',
    nextScheduled: '2026-10-18',
    assignedTech: 'Elena Rostova',
    specs: {
      power: '16 kW',
      manufacturer: 'Lantech',
      modelYear: '2020'
    },
    readings: {
      temperature: 21.5,
      vibration: 0.0,
      pressure: 0.0,
      power: 0.0
    }
  },

  // ==========================================
  // SECTOR 4: Material Handling & Logistics (10 Machines)
  // ==========================================
  {
    id: 'SEC4M1',
    seatNumber: 1,
    bayNumber: 'Bay 01',
    name: 'Autonomous Guided Vehicle Fleet AGV-01',
    type: 'Autonomous Vehicle Fleet',
    sector: 'Sector 4 (Material Handling & Logistics)',
    department: 'Internal Logistics Line 1',
    category: 'Material Handling',
    location: 'Logistics Bay A - Row 1',
    status: 'Operational',
    predictionRisk: 'Low Risk',
    maintenancePending: false,
    healthScore: 94,
    sensorsCount: 4,
    lastMaintenance: '2026-09-23',
    nextScheduled: '2026-11-18',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '15 kW',
      manufacturer: 'Toyota Material Handling',
      modelYear: '2024'
    },
    readings: {
      temperature: 46.2,
      vibration: 1.0,
      pressure: 4.8,
      power: 12.0
    }
  },
  {
    id: 'SEC4M2',
    seatNumber: 2,
    bayNumber: 'Bay 02',
    name: 'Overhead Bridge Crane System Crane-50T',
    type: 'Double Girder Bridge Crane',
    sector: 'Sector 4 (Material Handling & Logistics)',
    department: 'Heavy Lifting Bay',
    category: 'Material Handling',
    location: 'Logistics Bay A - Row 1',
    status: 'Operational',
    predictionRisk: 'Low Risk',
    maintenancePending: false,
    healthScore: 92,
    sensorsCount: 4,
    lastMaintenance: '2026-09-21',
    nextScheduled: '2026-11-14',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '45 kW',
      manufacturer: 'Konecranes',
      modelYear: '2023'
    },
    readings: {
      temperature: 56.4,
      vibration: 1.5,
      pressure: 6.0,
      power: 38.0
    }
  },
  {
    id: 'SEC4M3',
    seatNumber: 3,
    bayNumber: 'Bay 03',
    name: 'High-Bay Automated Storage Crane AS/RS-Crane-01',
    type: 'Automated Stacker Crane',
    sector: 'Sector 4 (Material Handling & Logistics)',
    department: 'Automated High-Bay Storage',
    category: 'Material Handling',
    location: 'Logistics Bay A - Row 2',
    status: 'Warning',
    predictionRisk: 'Medium Risk',
    maintenancePending: true,
    healthScore: 73,
    sensorsCount: 4,
    lastMaintenance: '2026-09-05',
    nextScheduled: '2026-10-22',
    assignedTech: 'Elena Rostova',
    specs: {
      power: '55 kW',
      manufacturer: 'Daifuku',
      modelYear: '2022'
    },
    readings: {
      temperature: 74.5,
      vibration: 3.9,
      pressure: 5.5,
      power: 49.0
    }
  },
  {
    id: 'SEC4M4',
    seatNumber: 4,
    bayNumber: 'Bay 04',
    name: 'Powered Roller Pallet Conveyor RollerLine-400',
    type: 'Pallet Conveyor System',
    sector: 'Sector 4 (Material Handling & Logistics)',
    department: 'Internal Logistics Line 1',
    category: 'Material Handling',
    location: 'Logistics Bay A - Row 2',
    status: 'Operational',
    predictionRisk: 'Low Risk',
    maintenancePending: false,
    healthScore: 95,
    sensorsCount: 4,
    lastMaintenance: '2026-09-28',
    nextScheduled: '2026-11-25',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '22 kW',
      manufacturer: 'Interroll',
      modelYear: '2024'
    },
    readings: {
      temperature: 48.1,
      vibration: 0.9,
      pressure: 5.0,
      power: 18.4
    }
  },
  {
    id: 'SEC4M5',
    seatNumber: 5,
    bayNumber: 'Bay 05',
    name: 'Electric Forklift Fast Charging Station ChargeHub-4',
    type: 'High-Voltage DC Fast Charger',
    sector: 'Sector 4 (Material Handling & Logistics)',
    department: 'Vehicle Maintenance & Charging',
    category: 'Electrical Distribution',
    location: 'Logistics Bay A - Row 3',
    status: 'Operational',
    predictionRisk: 'Low Risk',
    maintenancePending: false,
    healthScore: 97,
    sensorsCount: 4,
    lastMaintenance: '2026-09-29',
    nextScheduled: '2026-11-26',
    assignedTech: 'Elena Rostova',
    specs: {
      power: '80 kW',
      manufacturer: 'Delta Electronics',
      modelYear: '2025'
    },
    readings: {
      temperature: 42.0,
      vibration: 0.2,
      pressure: 0.0,
      power: 72.0
    }
  },
  {
    id: 'SEC4M6',
    seatNumber: 6,
    bayNumber: 'Bay 06',
    name: 'Vertical Reciprocating Lift VRL-1500',
    type: 'Freight Elevator Lift',
    sector: 'Sector 4 (Material Handling & Logistics)',
    department: 'Internal Logistics Line 2',
    category: 'Pneumatics',
    location: 'Logistics Bay A - Row 3',
    status: 'Warning',
    predictionRisk: 'High Risk',
    maintenancePending: true,
    healthScore: 69,
    sensorsCount: 4,
    lastMaintenance: '2026-08-29',
    nextScheduled: '2026-10-21',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '30 kW',
      manufacturer: 'Pflow Industries',
      modelYear: '2022'
    },
    readings: {
      temperature: 76.8,
      vibration: 4.6,
      pressure: 7.2,
      power: 28.5
    }
  },
  {
    id: 'SEC4M7',
    seatNumber: 7,
    bayNumber: 'Bay 07',
    name: 'Automatic Guided Tugger Tugger-AGV-02',
    type: 'Heavy Towing AGV',
    sector: 'Sector 4 (Material Handling & Logistics)',
    department: 'Internal Logistics Line 2',
    category: 'Material Handling',
    location: 'Logistics Bay A - Row 4',
    status: 'Operational',
    predictionRisk: 'Low Risk',
    maintenancePending: false,
    healthScore: 91,
    sensorsCount: 4,
    lastMaintenance: '2026-09-20',
    nextScheduled: '2026-11-12',
    assignedTech: 'Elena Rostova',
    specs: {
      power: '18 kW',
      manufacturer: 'Dematic',
      modelYear: '2024'
    },
    readings: {
      temperature: 51.5,
      vibration: 1.2,
      pressure: 4.5,
      power: 15.0
    }
  },
  {
    id: 'SEC4M8',
    seatNumber: 8,
    bayNumber: 'Bay 08',
    name: 'Automated Sorter & Diverter Hub SortDivert-90',
    type: 'High-Speed Shoe Sorter',
    sector: 'Sector 4 (Material Handling & Logistics)',
    department: 'Dispatch Sorting Cell',
    category: 'Material Handling',
    location: 'Logistics Bay A - Row 4',
    status: 'Critical',
    predictionRisk: 'Critical Risk',
    maintenancePending: true,
    healthScore: 40,
    sensorsCount: 4,
    lastMaintenance: '2026-08-14',
    nextScheduled: '2026-10-15',
    assignedTech: 'Elena Rostova',
    specs: {
      power: '28 kW',
      manufacturer: 'Honeywell Intelligrated',
      modelYear: '2021'
    },
    readings: {
      temperature: 91.2,
      vibration: 7.8,
      pressure: 6.8,
      power: 32.4
    }
  },
  {
    id: 'SEC4M9',
    seatNumber: 9,
    bayNumber: 'Bay 09',
    name: 'Pneumatic Tube Transport Dispatcher PneuTransfer-8',
    type: 'Pneumatic Capsule Dispatcher',
    sector: 'Sector 4 (Material Handling & Logistics)',
    department: 'Rapid Parts Transport',
    category: 'Pneumatics',
    location: 'Logistics Bay A - Row 5',
    status: 'Operational',
    predictionRisk: null,
    maintenancePending: false,
    healthScore: 96,
    sensorsCount: 4,
    lastMaintenance: '2026-09-27',
    nextScheduled: '2026-11-23',
    assignedTech: 'Elena Rostova',
    specs: {
      power: '12 kW',
      manufacturer: 'Aerocom',
      modelYear: '2024'
    },
    readings: {
      temperature: 44.0,
      vibration: 0.8,
      pressure: 8.5,
      power: 10.2
    }
  },
  {
    id: 'SEC4M10',
    seatNumber: 10,
    bayNumber: 'Bay 10',
    name: 'Hydraulic Dock Leveler & Loading Ramp DockLeveler-DR3',
    type: 'Hydraulic Dock Leveler',
    sector: 'Sector 4 (Material Handling & Logistics)',
    department: 'Outbound Dispatch Bay',
    category: 'Material Handling',
    location: 'Logistics Bay A - Row 5',
    status: 'Offline',
    predictionRisk: null,
    maintenancePending: true,
    healthScore: 0,
    sensorsCount: 4,
    lastMaintenance: '2026-07-22',
    nextScheduled: '2026-10-16',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '10 kW',
      manufacturer: 'Rite-Hite',
      modelYear: '2020'
    },
    readings: {
      temperature: 20.0,
      vibration: 0.0,
      pressure: 0.0,
      power: 0.0
    }
  }
];

// All machines initially start in 'Offline' state with NO static or fake readings
// Equipment becomes active only when live telemetry demonstration is started.
export const DEFAULT_SECTOR_MACHINES = RAW_DEFAULT_SECTOR_MACHINES.map((machine) => ({
  ...machine,
  status: 'Offline',
  predictionRisk: 'Offline',
  healthScore: 0,
  readings: null,
  lastReadingTimestamp: 'Offline',
  dataSource: 'Offline',
  predictedFailureWindow: 'Awaiting Demonstration'
}));
