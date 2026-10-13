/* IndustrialCare - Default Factory Equipment Fleet: Exactly 10 Machines per Sector (40 Total) */

export const DEFAULT_SECTOR_MACHINES = [
  // ==========================================
  // SECTOR 1: Production & Manufacturing (10 Machines)
  // ==========================================
  {
    id: 'MCH-S1-01',
    name: 'CNC Vertical Machining Center VMC-1000',
    type: 'CNC Milling Machine',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Machining Line 1',
    category: 'Machining',
    location: 'Bay A - Cell 1',
    status: 'Operational',
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
      power: 24.1
    }
  },
  {
    id: 'MCH-S1-02',
    name: 'High-Speed Robotic Stamping Press SP-400',
    type: 'Robotic Stamping Press',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Stamping Bay 1',
    category: 'Stamping',
    location: 'Bay A - Cell 2',
    status: 'Operational',
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
    id: 'MCH-S1-03',
    name: '6-Axis Articulated Welding Robot AR-60',
    type: 'Articulated Robot',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Robotics Assembly',
    category: 'Robotics',
    location: 'Bay A - Cell 3',
    status: 'Operational',
    healthScore: 96,
    sensorsCount: 4,
    lastMaintenance: '2026-09-25',
    nextScheduled: '2026-11-20',
    assignedTech: 'Elena Rostova',
    specs: {
      power: '15 kW',
      manufacturer: 'FANUC Robotics',
      modelYear: '2025'
    },
    readings: {
      temperature: 48.1,
      vibration: 0.9,
      pressure: 4.8,
      power: 12.3
    }
  },
  {
    id: 'MCH-S1-04',
    name: 'Precision Surface Grinder PSG-450',
    type: 'Surface Grinder',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Machining Line 2',
    category: 'Machining',
    location: 'Bay A - Cell 4',
    status: 'Operational',
    healthScore: 89,
    sensorsCount: 4,
    lastMaintenance: '2026-09-12',
    nextScheduled: '2026-11-05',
    assignedTech: 'David Miller',
    specs: {
      power: '22 kW',
      manufacturer: 'Okamoto Machine',
      modelYear: '2023'
    },
    readings: {
      temperature: 55.7,
      vibration: 1.7,
      pressure: 6.0,
      power: 18.5
    }
  },
  {
    id: 'MCH-S1-05',
    name: 'Automated Sheet Metal Bender SMB-220',
    type: 'Metal Bender',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Fabrication Cell',
    category: 'Stamping',
    location: 'Bay B - Cell 1',
    status: 'Operational',
    healthScore: 92,
    sensorsCount: 4,
    lastMaintenance: '2026-09-22',
    nextScheduled: '2026-11-18',
    assignedTech: 'David Miller',
    specs: {
      power: '28 kW',
      manufacturer: 'TRUMPF',
      modelYear: '2024'
    },
    readings: {
      temperature: 51.0,
      vibration: 1.2,
      pressure: 12.0,
      power: 21.4
    }
  },
  {
    id: 'MCH-S1-06',
    name: 'Dual-Spindle CNC Lathe DSL-850',
    type: 'CNC Lathe',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Machining Line 1',
    category: 'Machining',
    location: 'Bay B - Cell 2',
    status: 'Warning',
    healthScore: 78,
    sensorsCount: 4,
    lastMaintenance: '2026-08-30',
    nextScheduled: '2026-10-25',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '35 kW',
      manufacturer: 'Mazak Corp',
      modelYear: '2022'
    },
    readings: {
      temperature: 74.3,
      vibration: 3.4,
      pressure: 7.1,
      power: 31.8
    }
  },
  {
    id: 'MCH-S1-07',
    name: 'Hydraulic Deep Drawing Press HDP-500',
    type: 'Hydraulic Press',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Stamping Bay 2',
    category: 'Stamping',
    location: 'Bay B - Cell 3',
    status: 'Operational',
    healthScore: 90,
    sensorsCount: 4,
    lastMaintenance: '2026-09-15',
    nextScheduled: '2026-11-08',
    assignedTech: 'David Miller',
    specs: {
      power: '60 kW',
      manufacturer: 'Aida Engineering',
      modelYear: '2023'
    },
    readings: {
      temperature: 61.2,
      vibration: 1.9,
      pressure: 18.2,
      power: 52.0
    }
  },
  {
    id: 'MCH-S1-08',
    name: 'Robotic Laser Cutting System RLC-3000',
    type: 'Laser Cutter',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Robotics Assembly',
    category: 'Robotics',
    location: 'Bay B - Cell 4',
    status: 'Operational',
    healthScore: 95,
    sensorsCount: 4,
    lastMaintenance: '2026-09-28',
    nextScheduled: '2026-11-25',
    assignedTech: 'Elena Rostova',
    specs: {
      power: '40 kW',
      manufacturer: 'Bystronic',
      modelYear: '2025'
    },
    readings: {
      temperature: 46.8,
      vibration: 0.8,
      pressure: 5.5,
      power: 34.0
    }
  },
  {
    id: 'MCH-S1-09',
    name: 'Rotary Indexing Assembly Table RIA-12',
    type: 'Rotary Table',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Machining Line 2',
    category: 'Machining',
    location: 'Bay C - Cell 1',
    status: 'Operational',
    healthScore: 93,
    sensorsCount: 4,
    lastMaintenance: '2026-09-24',
    nextScheduled: '2026-11-19',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '12 kW',
      manufacturer: 'Weiss Automation',
      modelYear: '2024'
    },
    readings: {
      temperature: 49.5,
      vibration: 1.1,
      pressure: 4.5,
      power: 9.8
    }
  },
  {
    id: 'MCH-S1-10',
    name: 'Multi-Axis Wire EDM Machine EDM-600',
    type: 'EDM Machine',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Precision Tooling',
    category: 'Machining',
    location: 'Bay C - Cell 2',
    status: 'Operational',
    healthScore: 88,
    sensorsCount: 4,
    lastMaintenance: '2026-09-10',
    nextScheduled: '2026-11-02',
    assignedTech: 'David Miller',
    specs: {
      power: '18 kW',
      manufacturer: 'Mitsubishi Electric',
      modelYear: '2023'
    },
    readings: {
      temperature: 53.0,
      vibration: 1.3,
      pressure: 6.2,
      power: 15.1
    }
  },

  // ==========================================
  // SECTOR 2: Heavy Machining & Fabrication (10 Machines)
  // ==========================================
  {
    id: 'MCH-S2-01',
    name: 'Heavy Duty Horizontal Boring Mill HBM-200',
    type: 'Horizontal Boring Mill',
    sector: 'Sector 2 (Heavy Machining & Fabrication)',
    department: 'Heavy Machining Bay',
    category: 'Machining',
    location: 'Heavy Hall A - Cell 1',
    status: 'Operational',
    healthScore: 92,
    sensorsCount: 4,
    lastMaintenance: '2026-09-21',
    nextScheduled: '2026-11-14',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '65 kW',
      manufacturer: 'Toshiba Machine',
      modelYear: '2023'
    },
    readings: {
      temperature: 63.8,
      vibration: 1.8,
      pressure: 8.5,
      power: 54.0
    }
  },
  {
    id: 'MCH-S2-02',
    name: 'CNC Plasma Arc Cutting Bed PAC-4000',
    type: 'Plasma Cutting Bed',
    sector: 'Sector 2 (Heavy Machining & Fabrication)',
    department: 'Thermal & Cutting Bay',
    category: 'Thermal Systems',
    location: 'Heavy Hall A - Cell 2',
    status: 'Operational',
    healthScore: 89,
    sensorsCount: 4,
    lastMaintenance: '2026-09-17',
    nextScheduled: '2026-11-11',
    assignedTech: 'David Miller',
    specs: {
      power: '80 kW',
      manufacturer: 'Hypertherm',
      modelYear: '2024'
    },
    readings: {
      temperature: 72.1,
      vibration: 1.5,
      pressure: 9.0,
      power: 68.2
    }
  },
  {
    id: 'MCH-S2-03',
    name: 'Hydraulic Shear & Guillotine HSG-320',
    type: 'Hydraulic Shear',
    sector: 'Sector 2 (Heavy Machining & Fabrication)',
    department: 'Heavy Fabrication',
    category: 'Machining',
    location: 'Heavy Hall A - Cell 3',
    status: 'Operational',
    healthScore: 94,
    sensorsCount: 4,
    lastMaintenance: '2026-09-26',
    nextScheduled: '2026-11-22',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '45 kW',
      manufacturer: 'Durma',
      modelYear: '2024'
    },
    readings: {
      temperature: 56.4,
      vibration: 1.6,
      pressure: 22.0,
      power: 38.0
    }
  },
  {
    id: 'MCH-S2-04',
    name: 'Industrial Submerged Arc Welder SAW-1200',
    type: 'Submerged Arc Welder',
    sector: 'Sector 2 (Heavy Machining & Fabrication)',
    department: 'Heavy Fabrication',
    category: 'Thermal Systems',
    location: 'Heavy Hall A - Cell 4',
    status: 'Operational',
    healthScore: 90,
    sensorsCount: 4,
    lastMaintenance: '2026-09-14',
    nextScheduled: '2026-11-09',
    assignedTech: 'David Miller',
    specs: {
      power: '50 kW',
      manufacturer: 'Lincoln Electric',
      modelYear: '2023'
    },
    readings: {
      temperature: 68.0,
      vibration: 1.2,
      pressure: 5.0,
      power: 42.5
    }
  },
  {
    id: 'MCH-S2-05',
    name: 'Heavy Plate Rolling Machine PRM-80',
    type: 'Plate Rolling Machine',
    sector: 'Sector 2 (Heavy Machining & Fabrication)',
    department: 'Plate Forming',
    category: 'Machining',
    location: 'Heavy Hall B - Cell 1',
    status: 'Warning',
    healthScore: 76,
    sensorsCount: 4,
    lastMaintenance: '2026-08-28',
    nextScheduled: '2026-10-24',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '55 kW',
      manufacturer: 'Faccin',
      modelYear: '2022'
    },
    readings: {
      temperature: 78.5,
      vibration: 3.8,
      pressure: 24.5,
      power: 49.3
    }
  },
  {
    id: 'MCH-S2-06',
    name: 'High-Pressure Hydraulic Power Unit HPU-350',
    type: 'Hydraulic Power Unit',
    sector: 'Sector 2 (Heavy Machining & Fabrication)',
    department: 'Fluid Systems Station',
    category: 'Fluid Systems',
    location: 'Heavy Hall B - Cell 2',
    status: 'Operational',
    healthScore: 95,
    sensorsCount: 4,
    lastMaintenance: '2026-09-29',
    nextScheduled: '2026-11-26',
    assignedTech: 'David Miller',
    specs: {
      power: '75 kW',
      manufacturer: 'Bosch Rexroth',
      modelYear: '2025'
    },
    readings: {
      temperature: 54.2,
      vibration: 1.0,
      pressure: 31.0,
      power: 62.0
    }
  },
  {
    id: 'MCH-S2-07',
    name: 'Induction Hardening Heat Furnace IHF-150',
    type: 'Induction Furnace',
    sector: 'Sector 2 (Heavy Machining & Fabrication)',
    department: 'Thermal & Heat Treatment',
    category: 'Thermal Systems',
    location: 'Heavy Hall B - Cell 3',
    status: 'Operational',
    healthScore: 91,
    sensorsCount: 4,
    lastMaintenance: '2026-09-19',
    nextScheduled: '2026-11-15',
    assignedTech: 'Elena Rostova',
    specs: {
      power: '110 kW',
      manufacturer: 'Inductotherm Group',
      modelYear: '2024'
    },
    readings: {
      temperature: 88.0,
      vibration: 0.8,
      pressure: 6.5,
      power: 94.0
    }
  },
  {
    id: 'MCH-S2-08',
    name: 'Gantry Milling Machining Center GMC-5000',
    type: 'Gantry Milling Machine',
    sector: 'Sector 2 (Heavy Machining & Fabrication)',
    department: 'Heavy Machining Bay',
    category: 'Machining',
    location: 'Heavy Hall B - Cell 4',
    status: 'Operational',
    healthScore: 93,
    sensorsCount: 4,
    lastMaintenance: '2026-09-23',
    nextScheduled: '2026-11-17',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '90 kW',
      manufacturer: 'DMG MORI',
      modelYear: '2025'
    },
    readings: {
      temperature: 60.1,
      vibration: 1.4,
      pressure: 7.2,
      power: 74.5
    }
  },
  {
    id: 'MCH-S2-09',
    name: 'Heavy Duty Radial Drilling Machine RDM-100',
    type: 'Radial Drilling Machine',
    sector: 'Sector 2 (Heavy Machining & Fabrication)',
    department: 'Heavy Machining Bay',
    category: 'Machining',
    location: 'Heavy Hall C - Cell 1',
    status: 'Operational',
    healthScore: 87,
    sensorsCount: 4,
    lastMaintenance: '2026-09-08',
    nextScheduled: '2026-11-01',
    assignedTech: 'David Miller',
    specs: {
      power: '25 kW',
      manufacturer: 'Gildemeister',
      modelYear: '2023'
    },
    readings: {
      temperature: 59.3,
      vibration: 2.0,
      pressure: 5.8,
      power: 20.4
    }
  },
  {
    id: 'MCH-S2-10',
    name: 'Industrial Cooling Tower Chiller CTC-800',
    type: 'Industrial Chiller',
    sector: 'Sector 2 (Heavy Machining & Fabrication)',
    department: 'Fluid Systems Station',
    category: 'Fluid Systems',
    location: 'Heavy Hall C - Cell 2',
    status: 'Operational',
    healthScore: 96,
    sensorsCount: 4,
    lastMaintenance: '2026-09-27',
    nextScheduled: '2026-11-23',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '45 kW',
      manufacturer: 'Carrier Industrial',
      modelYear: '2025'
    },
    readings: {
      temperature: 42.0,
      vibration: 0.7,
      pressure: 8.0,
      power: 36.8
    }
  },

  // ==========================================
  // SECTOR 3: Assembly & Packaging (10 Machines)
  // ==========================================
  {
    id: 'MCH-S3-01',
    name: 'High-Speed Pick & Place Robot PPR-120',
    type: 'Pick & Place Robot',
    sector: 'Sector 3 (Assembly & Packaging)',
    department: 'Assembly Line 1',
    category: 'Robotics',
    location: 'Packaging Hall A - Cell 1',
    status: 'Operational',
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
      vibration: 0.6,
      pressure: 6.0,
      power: 8.2
    }
  },
  {
    id: 'MCH-S3-02',
    name: 'Automated Carton Erecting System ACE-50',
    type: 'Carton Erector',
    sector: 'Sector 3 (Assembly & Packaging)',
    department: 'Packaging Line 1',
    category: 'Material Handling',
    location: 'Packaging Hall A - Cell 2',
    status: 'Operational',
    healthScore: 93,
    sensorsCount: 4,
    lastMaintenance: '2026-09-22',
    nextScheduled: '2026-11-16',
    assignedTech: 'Sarah Jenkins',
    specs: {
      power: '14 kW',
      manufacturer: 'Lantech',
      modelYear: '2024'
    },
    readings: {
      temperature: 48.0,
      vibration: 1.1,
      pressure: 5.5,
      power: 11.4
    }
  },
  {
    id: 'MCH-S3-03',
    name: 'Rotary Capping & Sealing Machine RCS-300',
    type: 'Capping & Sealing Unit',
    sector: 'Sector 3 (Assembly & Packaging)',
    department: 'Packaging Line 2',
    category: 'Pneumatics',
    location: 'Packaging Hall A - Cell 3',
    status: 'Operational',
    healthScore: 90,
    sensorsCount: 4,
    lastMaintenance: '2026-09-16',
    nextScheduled: '2026-11-12',
    assignedTech: 'Sarah Jenkins',
    specs: {
      power: '16 kW',
      manufacturer: 'Krones AG',
      modelYear: '2023'
    },
    readings: {
      temperature: 52.3,
      vibration: 1.4,
      pressure: 6.8,
      power: 13.0
    }
  },
  {
    id: 'MCH-S3-04',
    name: 'Vision-Guided Assembly Robot VAR-80',
    type: 'Vision-Guided Robot',
    sector: 'Sector 3 (Assembly & Packaging)',
    department: 'Assembly Line 1',
    category: 'Robotics',
    location: 'Packaging Hall A - Cell 4',
    status: 'Operational',
    healthScore: 95,
    sensorsCount: 4,
    lastMaintenance: '2026-09-25',
    nextScheduled: '2026-11-21',
    assignedTech: 'Elena Rostova',
    specs: {
      power: '12 kW',
      manufacturer: 'KUKA Robotics',
      modelYear: '2025'
    },
    readings: {
      temperature: 46.1,
      vibration: 0.8,
      pressure: 5.2,
      power: 9.7
    }
  },
  {
    id: 'MCH-S3-05',
    name: 'Automated Heat Shrink Tunnel HST-240',
    type: 'Heat Shrink Tunnel',
    sector: 'Sector 3 (Assembly & Packaging)',
    department: 'Packaging Line 2',
    category: 'Material Handling',
    location: 'Packaging Hall B - Cell 1',
    status: 'Warning',
    healthScore: 79,
    sensorsCount: 4,
    lastMaintenance: '2026-08-29',
    nextScheduled: '2026-10-26',
    assignedTech: 'Sarah Jenkins',
    specs: {
      power: '32 kW',
      manufacturer: 'Sealed Air',
      modelYear: '2023'
    },
    readings: {
      temperature: 82.4,
      vibration: 2.2,
      pressure: 4.8,
      power: 27.5
    }
  },
  {
    id: 'MCH-S3-06',
    name: 'Precision Torque Fastening Cell TFC-16',
    type: 'Fastening Cell',
    sector: 'Sector 3 (Assembly & Packaging)',
    department: 'Assembly Line 2',
    category: 'Pneumatics',
    location: 'Packaging Hall B - Cell 2',
    status: 'Operational',
    healthScore: 94,
    sensorsCount: 4,
    lastMaintenance: '2026-09-24',
    nextScheduled: '2026-11-19',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '8 kW',
      manufacturer: 'Atlas Copco',
      modelYear: '2024'
    },
    readings: {
      temperature: 41.2,
      vibration: 0.9,
      pressure: 6.5,
      power: 6.5
    }
  },
  {
    id: 'MCH-S3-07',
    name: 'Ultrasonic Plastic Welding Station UPW-70',
    type: 'Ultrasonic Welder',
    sector: 'Sector 3 (Assembly & Packaging)',
    department: 'Assembly Line 2',
    category: 'Pneumatics',
    location: 'Packaging Hall B - Cell 3',
    status: 'Operational',
    healthScore: 91,
    sensorsCount: 4,
    lastMaintenance: '2026-09-18',
    nextScheduled: '2026-11-13',
    assignedTech: 'David Miller',
    specs: {
      power: '15 kW',
      manufacturer: 'Branson Ultrasonics',
      modelYear: '2024'
    },
    readings: {
      temperature: 50.8,
      vibration: 1.3,
      pressure: 5.8,
      power: 12.1
    }
  },
  {
    id: 'MCH-S3-08',
    name: 'Rotary Drum Blister Packaging Unit BPU-180',
    type: 'Blister Packaging Unit',
    sector: 'Sector 3 (Assembly & Packaging)',
    department: 'Packaging Line 1',
    category: 'Material Handling',
    location: 'Packaging Hall B - Cell 4',
    status: 'Operational',
    healthScore: 88,
    sensorsCount: 4,
    lastMaintenance: '2026-09-11',
    nextScheduled: '2026-11-04',
    assignedTech: 'Sarah Jenkins',
    specs: {
      power: '24 kW',
      manufacturer: 'Uhlmann Pac-Systeme',
      modelYear: '2023'
    },
    readings: {
      temperature: 57.0,
      vibration: 1.7,
      pressure: 6.2,
      power: 19.8
    }
  },
  {
    id: 'MCH-S3-09',
    name: 'Vacuum Leak Testing Chamber VLC-40',
    type: 'Testing Chamber',
    sector: 'Sector 3 (Assembly & Packaging)',
    department: 'Quality Control Cell',
    category: 'Pneumatics',
    location: 'Packaging Hall C - Cell 1',
    status: 'Operational',
    healthScore: 96,
    sensorsCount: 4,
    lastMaintenance: '2026-09-28',
    nextScheduled: '2026-11-24',
    assignedTech: 'Sarah Jenkins',
    specs: {
      power: '11 kW',
      manufacturer: 'Pfeiffer Vacuum',
      modelYear: '2025'
    },
    readings: {
      temperature: 43.6,
      vibration: 0.5,
      pressure: 2.1,
      power: 8.9
    }
  },
  {
    id: 'MCH-S3-10',
    name: 'Inline Checkweigher & Rejector CWR-600',
    type: 'Checkweigher',
    sector: 'Sector 3 (Assembly & Packaging)',
    department: 'Quality Control Cell',
    category: 'Material Handling',
    location: 'Packaging Hall C - Cell 2',
    status: 'Operational',
    healthScore: 92,
    sensorsCount: 4,
    lastMaintenance: '2026-09-21',
    nextScheduled: '2026-11-15',
    assignedTech: 'Elena Rostova',
    specs: {
      power: '6 kW',
      manufacturer: 'Mettler Toledo',
      modelYear: '2024'
    },
    readings: {
      temperature: 40.0,
      vibration: 0.7,
      pressure: 5.0,
      power: 4.8
    }
  },

  // ==========================================
  // SECTOR 4: Material Handling & Logistics (10 Machines)
  // ==========================================
  {
    id: 'MCH-S4-01',
    name: 'Autonomous Guided Vehicle Fleet AGV-01',
    type: 'Autonomous Vehicle Fleet',
    sector: 'Sector 4 (Material Handling & Logistics)',
    department: 'Internal Logistics Line 1',
    category: 'Material Handling',
    location: 'Logistics Bay A - Track 1',
    status: 'Operational',
    healthScore: 94,
    sensorsCount: 4,
    lastMaintenance: '2026-09-23',
    nextScheduled: '2026-11-18',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '15 kW',
      manufacturer: 'Toyota Material Handling',
      modelYear: '2025'
    },
    readings: {
      temperature: 45.2,
      vibration: 0.9,
      pressure: 4.2,
      power: 12.0
    }
  },
  {
    id: 'MCH-S4-02',
    name: 'High-Bay Automated Storage Crane ASC-10',
    type: 'Storage Crane System',
    sector: 'Sector 4 (Material Handling & Logistics)',
    department: 'Automated Warehouse',
    category: 'Material Handling',
    location: 'Logistics Bay A - Aisle 3',
    status: 'Operational',
    healthScore: 91,
    sensorsCount: 4,
    lastMaintenance: '2026-09-17',
    nextScheduled: '2026-11-12',
    assignedTech: 'David Miller',
    specs: {
      power: '48 kW',
      manufacturer: 'Dematic Group',
      modelYear: '2024'
    },
    readings: {
      temperature: 53.6,
      vibration: 1.4,
      pressure: 6.0,
      power: 39.5
    }
  },
  {
    id: 'MCH-S4-03',
    name: 'Variable Speed Belt Conveyor Trunk BC-450',
    type: 'Belt Conveyor',
    sector: 'Sector 4 (Material Handling & Logistics)',
    department: 'Sorting & Dispatch',
    category: 'Material Handling',
    location: 'Logistics Bay A - Line 2',
    status: 'Operational',
    healthScore: 89,
    sensorsCount: 4,
    lastMaintenance: '2026-09-13',
    nextScheduled: '2026-11-07',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '22 kW',
      manufacturer: 'Interroll',
      modelYear: '2023'
    },
    readings: {
      temperature: 58.0,
      vibration: 1.8,
      pressure: 5.5,
      power: 18.2
    }
  },
  {
    id: 'MCH-S4-04',
    name: 'Electric Forklift Fast-Charge Station ECS-150',
    type: 'Fast-Charge Power Station',
    sector: 'Sector 4 (Material Handling & Logistics)',
    department: 'Fleet Charging Depot',
    category: 'Electrical Distribution',
    location: 'Logistics Bay B - Depot 1',
    status: 'Operational',
    healthScore: 98,
    sensorsCount: 4,
    lastMaintenance: '2026-10-01',
    nextScheduled: '2026-11-29',
    assignedTech: 'Elena Rostova',
    specs: {
      power: '150 kW',
      manufacturer: 'Siemens Energy',
      modelYear: '2025'
    },
    readings: {
      temperature: 48.9,
      vibration: 0.3,
      pressure: 3.5,
      power: 128.0
    }
  },
  {
    id: 'MCH-S4-05',
    name: 'Heavy Palletizing Robotic Arm PRA-700',
    type: 'Palletizing Robot',
    sector: 'Sector 4 (Material Handling & Logistics)',
    department: 'Palletizing Bay',
    category: 'Material Handling',
    location: 'Logistics Bay B - Cell 1',
    status: 'Operational',
    healthScore: 93,
    sensorsCount: 4,
    lastMaintenance: '2026-09-22',
    nextScheduled: '2026-11-16',
    assignedTech: 'Elena Rostova',
    specs: {
      power: '25 kW',
      manufacturer: 'Yaskawa Motoman',
      modelYear: '2024'
    },
    readings: {
      temperature: 49.8,
      vibration: 1.2,
      pressure: 6.4,
      power: 20.6
    }
  },
  {
    id: 'MCH-S4-06',
    name: 'Pneumatic Diverter Sorting System PDS-80',
    type: 'Pneumatic Diverter',
    sector: 'Sector 4 (Material Handling & Logistics)',
    department: 'Sorting & Dispatch',
    category: 'Pneumatics',
    location: 'Logistics Bay B - Junction 2',
    status: 'Warning',
    healthScore: 77,
    sensorsCount: 4,
    lastMaintenance: '2026-08-31',
    nextScheduled: '2026-10-27',
    assignedTech: 'David Miller',
    specs: {
      power: '18 kW',
      manufacturer: 'Festo Pneumatics',
      modelYear: '2023'
    },
    readings: {
      temperature: 69.4,
      vibration: 2.8,
      pressure: 7.8,
      power: 15.5
    }
  },
  {
    id: 'MCH-S4-07',
    name: 'Spiral Roller Elevator Conveyor SRC-120',
    type: 'Spiral Conveyor',
    sector: 'Sector 4 (Material Handling & Logistics)',
    department: 'Internal Logistics Line 2',
    category: 'Material Handling',
    location: 'Logistics Bay C - Tower 1',
    status: 'Operational',
    healthScore: 92,
    sensorsCount: 4,
    lastMaintenance: '2026-09-20',
    nextScheduled: '2026-11-14',
    assignedTech: 'Marcus Vance',
    specs: {
      power: '16 kW',
      manufacturer: 'AmbaFlex',
      modelYear: '2024'
    },
    readings: {
      temperature: 51.5,
      vibration: 1.3,
      pressure: 4.8,
      power: 13.4
    }
  },
  {
    id: 'MCH-S4-08',
    name: 'Automated Stretch Wrapper Ring SWR-90',
    type: 'Stretch Wrapper',
    sector: 'Sector 4 (Material Handling & Logistics)',
    department: 'Palletizing Bay',
    category: 'Material Handling',
    location: 'Logistics Bay C - Dock 2',
    status: 'Operational',
    healthScore: 90,
    sensorsCount: 4,
    lastMaintenance: '2026-09-15',
    nextScheduled: '2026-11-10',
    assignedTech: 'Sarah Jenkins',
    specs: {
      power: '12 kW',
      manufacturer: 'Signode Industrial',
      modelYear: '2023'
    },
    readings: {
      temperature: 54.0,
      vibration: 1.5,
      pressure: 5.0,
      power: 10.2
    }
  },
  {
    id: 'MCH-S4-09',
    name: 'Dock Leveler Hydraulic Lift System DLL-50',
    type: 'Hydraulic Dock Leveler',
    sector: 'Sector 4 (Material Handling & Logistics)',
    department: 'Shipping & Receiving',
    category: 'Pneumatics',
    location: 'Logistics Bay C - Loading Dock 4',
    status: 'Operational',
    healthScore: 95,
    sensorsCount: 4,
    lastMaintenance: '2026-09-27',
    nextScheduled: '2026-11-23',
    assignedTech: 'David Miller',
    specs: {
      power: '14 kW',
      manufacturer: 'Rite-Hite',
      modelYear: '2025'
    },
    readings: {
      temperature: 46.5,
      vibration: 0.8,
      pressure: 16.0,
      power: 11.8
    }
  },
  {
    id: 'MCH-S4-10',
    name: 'Motorized Overhead Bridge Crane OBC-20',
    type: 'Overhead Bridge Crane',
    sector: 'Sector 4 (Material Handling & Logistics)',
    department: 'Heavy Cargo Loading',
    category: 'Electrical Distribution',
    location: 'Logistics Bay C - Overhead Rail',
    status: 'Operational',
    healthScore: 88,
    sensorsCount: 4,
    lastMaintenance: '2026-09-09',
    nextScheduled: '2026-11-03',
    assignedTech: 'Elena Rostova',
    specs: {
      power: '40 kW',
      manufacturer: 'Konecranes',
      modelYear: '2023'
    },
    readings: {
      temperature: 62.0,
      vibration: 1.9,
      pressure: 6.2,
      power: 33.5
    }
  }
];
