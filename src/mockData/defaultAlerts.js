/* IndustrialCare - Plant Anomaly & Failure Alerts Shared Dataset
   Links directly to Sector Machinery Fleet and Maintenance Work Orders
*/

export const DEFAULT_ALERTS = [
  {
    id: 'ALT-101',
    machineId: 'SEC1M8',
    machineName: 'Multi-Spindle Drilling Machine DrillMaster-12',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Mechanical Department',
    title: 'Severe Spindle Bearing Vibration Spike (7.2 mm/s)',
    description: 'Continuous accelerometry detected harmonic peak at 120 Hz and spindle vibration exceeding ISO 10816 Class II threshold. Spindle housing temperature 89.4°C.',
    severity: 'Critical',
    alertSource: 'IoT Vibration Sensor (ISO 10816)',
    risk: 'Critical - 94% Failure Probability',
    status: 'In Progress',
    assignedTech: 'Marcus Vance',
    createdTime: '2026-10-10 09:30',
    date: '2026-10-10 09:30',
    deadline: '2026-10-12 18:00', // Expired deadline to demonstrate overdue indicator
    overdue: true,
    escalated: true,
    escalatedReason: 'Deadline expired without resolution; vibration continuing on main drilling head.',
    maintenanceStatus: 'In Progress',
    laborHours: 4.5,
    technicianNotes: 'Teardown initiated. Removed spindle head casting, extracted sheared bearing cage fragments. Mesh backlash requires reshimming.',
    replacedParts: ['Angular Contact Bearing Set 6205-2RS', 'Shaft Oil Seal Nitrile-25'],
    linkedWorkOrderId: 'REQ-2026-101',
    auditTimeline: [
      {
        id: 'TL-101-1',
        timestamp: '2026-10-10 09:30',
        actor: 'IoT Vibration Sensor',
        role: 'Automated Telemetry',
        action: 'Alert Triggered',
        notes: 'Velocity RMS 7.2 mm/s breached critical threshold (4.5 mm/s).'
      },
      {
        id: 'TL-101-2',
        timestamp: '2026-10-10 10:15',
        actor: 'Marcus Vance',
        role: 'Mechanical Technician',
        action: 'Acknowledged Alert',
        notes: 'Specialist accepted alert. Work order REQ-2026-101 created.'
      },
      {
        id: 'TL-101-3',
        timestamp: '2026-10-10 14:00',
        actor: 'Marcus Vance',
        role: 'Mechanical Technician',
        action: 'Status Changed to In Progress',
        notes: 'Physical disassembly commenced in Bay 8.'
      },
      {
        id: 'TL-101-4',
        timestamp: '2026-10-12 18:30',
        actor: 'Sector Head - Sector 1',
        role: 'Production Sector Head',
        action: 'Escalated to Admin',
        notes: 'Target deadline 2026-10-12 exceeded without completion. High priority intervention requested.'
      }
    ],
    escalationHistory: [
      {
        id: 'ESC-101-1',
        timestamp: '2026-10-12 18:30',
        escalatedBy: 'Sector Head - Sector 1',
        role: 'Production Sector Head',
        reason: 'Target deadline 2026-10-12 exceeded without completion.'
      }
    ]
  },
  {
    id: 'ALT-102',
    machineId: 'SEC1M6',
    machineName: 'CNC Lathe & Turning Center TurnPro-80',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Mechanical Department',
    title: 'Main Chuck Spindle Harmonic Oscillation',
    description: 'Chucking drive vibration elevated to 4.8 mm/s with bearing cage frequency modulation. Predictive classification suggests outer race micro-spalling.',
    severity: 'Warning',
    alertSource: 'ML Failure Classifier (Random Forest)',
    risk: 'High Risk - Outer Race Spall Pattern',
    status: 'Resolved',
    assignedTech: 'Marcus Vance',
    createdTime: '2026-10-11 11:20',
    date: '2026-10-11 11:20',
    deadline: '2026-10-14 17:00',
    overdue: false,
    escalated: false,
    maintenanceStatus: 'Resolution Submitted',
    laborHours: 3.5,
    technicianNotes: 'Spindle chuck dismantled. Replaced worn front ceramic hybrid ball bearing set. Dynamic dual-plane balancing completed; test spun at 2500 RPM.',
    replacedParts: ['Hybrid Ceramic Bearing 7010-C-TPA', 'Fluoroelastomer Dynamic Seal Ring'],
    linkedWorkOrderId: 'REQ-2026-102',
    auditTimeline: [
      {
        id: 'TL-102-1',
        timestamp: '2026-10-11 11:20',
        actor: 'ML Failure Classifier',
        role: 'Predictive Diagnostic Model',
        action: 'Alert Triggered',
        notes: 'Random Forest model classified high risk of mechanical spalling (82% probability).'
      },
      {
        id: 'TL-102-2',
        timestamp: '2026-10-11 11:55',
        actor: 'Marcus Vance',
        role: 'Mechanical Technician',
        action: 'Acknowledged Alert',
        notes: 'Technician dispatched with diagnostic instrumentation.'
      },
      {
        id: 'TL-102-3',
        timestamp: '2026-10-11 13:30',
        actor: 'Marcus Vance',
        role: 'Mechanical Technician',
        action: 'Status Changed to In Progress',
        notes: 'Bearing replacement and precision re-torquing in progress.'
      },
      {
        id: 'TL-102-4',
        timestamp: '2026-10-12 16:45',
        actor: 'Marcus Vance',
        role: 'Mechanical Technician',
        action: 'Status Changed to Resolved',
        notes: 'Resolution submitted. Ready for Sector Head inspection and closure.'
      }
    ],
    escalationHistory: []
  },
  {
    id: 'ALT-103',
    machineId: 'SEC2M8',
    machineName: 'Rotary Pipe & Tube Profiler TubeCut-360',
    sector: 'Sector 2 (Heavy Machining & Fabrication)',
    department: 'Electrical Department',
    title: 'Plasma Cutting Arc Inverter Overheat & Voltage Drop',
    description: 'High-frequency IGBT inverter bank junction temperature reached 92.1°C with 45 kW current surge during plasma arc piercing cycle.',
    severity: 'Critical',
    alertSource: 'SCADA Current Transducer',
    risk: 'Critical - Thermal Runaway Risk',
    status: 'New',
    assignedTech: 'Elena Rostova',
    createdTime: '2026-10-13 10:15',
    date: '2026-10-13 10:15',
    deadline: '2026-10-15 12:00',
    overdue: false,
    escalated: false,
    maintenanceStatus: 'Open',
    laborHours: null,
    technicianNotes: null,
    replacedParts: [],
    linkedWorkOrderId: 'REQ-2026-103',
    auditTimeline: [
      {
        id: 'TL-103-1',
        timestamp: '2026-10-13 10:15',
        actor: 'SCADA Current Transducer',
        role: 'Automated Telemetry',
        action: 'Alert Triggered',
        notes: 'Inverter bus voltage instability and thermal cutoff tripped.'
      }
    ],
    escalationHistory: []
  },
  {
    id: 'ALT-104',
    machineId: 'SEC2M5',
    machineName: 'Heavy Gantry CNC Milling Center Gantry-M8',
    sector: 'Sector 2 (Heavy Machining & Fabrication)',
    department: 'Mechanical Department',
    title: 'Y-Axis Linear Guideway Lubrication Pressure Drop',
    description: 'Centralized lubrication distributor sensor detected line pressure drop below 6.5 bar. Axis guideway friction temperature increasing.',
    severity: 'Warning',
    alertSource: 'IoT Pressure Transducer',
    risk: 'Warning - Lubrication Starvation Risk',
    status: 'Acknowledged',
    assignedTech: 'Marcus Vance',
    createdTime: '2026-10-12 08:45',
    date: '2026-10-12 08:45',
    deadline: '2026-10-16 16:00',
    overdue: false,
    escalated: false,
    maintenanceStatus: 'Acknowledged',
    laborHours: null,
    technicianNotes: null,
    replacedParts: [],
    linkedWorkOrderId: 'REQ-2026-104',
    auditTimeline: [
      {
        id: 'TL-104-1',
        timestamp: '2026-10-12 08:45',
        actor: 'IoT Pressure Transducer',
        role: 'Automated Telemetry',
        action: 'Alert Triggered',
        notes: 'Line pressure drop to 6.2 bar logged during heavy continuous machining.'
      },
      {
        id: 'TL-104-2',
        timestamp: '2026-10-12 11:30',
        actor: 'Marcus Vance',
        role: 'Mechanical Technician',
        action: 'Acknowledged Alert',
        notes: 'Technician scheduled line purge and metering valve check.'
      }
    ],
    escalationHistory: []
  },
  {
    id: 'ALT-105',
    machineId: 'SEC3M8',
    machineName: 'High-Speed Case Packing Cell PackBot-800',
    sector: 'Sector 3 (Assembly & Packaging)',
    department: 'Electrical Department',
    title: 'Axis 3 Servo Motor Encoder Comm Loss & Thermal Rise',
    description: 'Articulated delta robot arm axis 3 servo reported communication jitter, CRC errors, and motor housing temperature 74.2°C.',
    severity: 'Critical',
    alertSource: 'Robotics Controller Diagnostics',
    risk: 'Critical - Packaging Line Stoppage',
    status: 'In Progress',
    assignedTech: 'Elena Rostova',
    createdTime: '2026-10-09 14:00',
    date: '2026-10-09 14:00',
    deadline: '2026-10-11 12:00', // Expired deadline
    overdue: true,
    escalated: true,
    escalatedReason: 'Packaging line throughput impacted. Target deadline 2026-10-11 expired.',
    maintenanceStatus: 'In Progress',
    laborHours: 2.0,
    technicianNotes: 'Axis 3 encoder cable harness inspected; pin corrosion identified on connector shell. Harness replacement ongoing.',
    replacedParts: ['M12 Encoder Shielded Cable Cable-10M'],
    linkedWorkOrderId: 'REQ-2026-106',
    auditTimeline: [
      {
        id: 'TL-105-1',
        timestamp: '2026-10-09 14:00',
        actor: 'Robotics Controller',
        role: 'Automated Telemetry',
        action: 'Alert Triggered',
        notes: 'Delta packbot line stoppage caused by axis 3 encoder checksum mismatch.'
      },
      {
        id: 'TL-105-2',
        timestamp: '2026-10-09 14:45',
        actor: 'Elena Rostova',
        role: 'Electrical Technician',
        action: 'Acknowledged Alert',
        notes: 'Electrical specialist dispatched with digital scope and replacement cabling.'
      },
      {
        id: 'TL-105-3',
        timestamp: '2026-10-09 16:00',
        actor: 'Elena Rostova',
        role: 'Electrical Technician',
        action: 'Status Changed to In Progress',
        notes: 'Cable harness pin extraction underway.'
      },
      {
        id: 'TL-105-4',
        timestamp: '2026-10-11 12:30',
        actor: 'Sector Head - Sector 3',
        role: 'Packaging Sector Head',
        action: 'Escalated to Admin',
        notes: 'Overdue task escalated due to packaging cell downtime.'
      }
    ],
    escalationHistory: [
      {
        id: 'ESC-105-1',
        timestamp: '2026-10-11 12:30',
        escalatedBy: 'Sector Head - Sector 3',
        role: 'Packaging Sector Head',
        reason: 'Overdue task escalated due to packaging cell downtime.'
      }
    ]
  },
  {
    id: 'ALT-106',
    machineId: 'SEC3M4',
    machineName: 'Carton Erector & Bottom Sealer BoxMaster-40',
    sector: 'Sector 3 (Assembly & Packaging)',
    department: 'Mechanical Department',
    title: 'Vacuum Suction Cup Pneumatic Pressure Degradation',
    description: 'Carton blank pickup vacuum level degraded to -0.45 bar (nominal -0.85 bar). Sporadic carton drop rate 4.2%.',
    severity: 'Warning',
    alertSource: 'IoT Vacuum Pressure Transducer',
    risk: 'Warning - Sporadic Carton Jam',
    status: 'New',
    assignedTech: 'David Miller',
    createdTime: '2026-10-13 08:00',
    date: '2026-10-13 08:00',
    deadline: '2026-10-16 18:00',
    overdue: false,
    escalated: false,
    maintenanceStatus: 'Open',
    laborHours: null,
    technicianNotes: null,
    replacedParts: [],
    linkedWorkOrderId: null,
    auditTimeline: [
      {
        id: 'TL-106-1',
        timestamp: '2026-10-13 08:00',
        actor: 'IoT Vacuum Pressure Transducer',
        role: 'Automated Telemetry',
        action: 'Alert Triggered',
        notes: 'Vacuum pickup manifold pressure below baseline.'
      }
    ],
    escalationHistory: []
  },
  {
    id: 'ALT-107',
    machineId: 'SEC4M7',
    machineName: 'Automated Guided Vehicle AGV Heavy-1200',
    sector: 'Sector 4 (Material Handling & Logistics)',
    department: 'Electrical Department',
    title: 'Lithium Battery Pack Cell Imbalance & High Temp',
    description: '48V LiFePO4 traction battery cell #6 temperature reached 58.2°C during high-bay pallet transfer; BMS reported 320mV cell delta.',
    severity: 'Warning',
    alertSource: 'BMS Telemetry Stream',
    risk: 'Warning - Traction Cell Degradation',
    status: 'Acknowledged',
    assignedTech: 'Sarah Jenkins',
    createdTime: '2026-10-12 14:15',
    date: '2026-10-12 14:15',
    deadline: '2026-10-15 17:00',
    overdue: false,
    escalated: false,
    maintenanceStatus: 'Acknowledged',
    laborHours: null,
    technicianNotes: null,
    replacedParts: [],
    linkedWorkOrderId: null,
    auditTimeline: [
      {
        id: 'TL-107-1',
        timestamp: '2026-10-12 14:15',
        actor: 'BMS Telemetry Stream',
        role: 'Automated Telemetry',
        action: 'Alert Triggered',
        notes: 'BMS cell imbalance warning during continuous pallet transport.'
      },
      {
        id: 'TL-107-2',
        timestamp: '2026-10-12 15:00',
        actor: 'Sarah Jenkins',
        role: 'Electrical Technician',
        action: 'Acknowledged Alert',
        notes: 'Technician routed AGV to maintenance bay for balancing cycle.'
      }
    ],
    escalationHistory: []
  },
  {
    id: 'ALT-108',
    machineId: 'SEC1M1',
    machineName: 'CNC Vertical Machining Center VMC-1000',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Mechanical Department',
    title: 'Routine Spindle Hydraulic Return Pressure Check',
    description: 'Scheduled quarterly hydraulic filter and fluid return pressure verification completed with nominal baseline restored.',
    severity: 'Info',
    alertSource: 'Operator Inspection Log',
    risk: 'Low Risk - Routine Servicing',
    status: 'Closed',
    assignedTech: 'Marcus Vance',
    createdTime: '2026-09-18 08:00',
    date: '2026-09-18 08:00',
    deadline: '2026-09-20 18:00',
    overdue: false,
    escalated: false,
    maintenanceStatus: 'Closed',
    laborHours: 5.0,
    technicianNotes: 'Drained 40L hydraulic fluid, installed micro-glass return filter. Replaced tool changer claw springs and verified tool seat repeatability.',
    replacedParts: ['Hydraulic Filter Cartridge HF-200', 'Tool Changer Spring Set TC-100'],
    linkedWorkOrderId: 'REQ-2026-105',
    auditTimeline: [
      {
        id: 'TL-108-1',
        timestamp: '2026-09-18 08:00',
        actor: 'Operator Inspection Log',
        role: 'Maintenance Lead',
        action: 'Alert Triggered',
        notes: 'Routine quarterly servicing scheduled.'
      },
      {
        id: 'TL-108-2',
        timestamp: '2026-09-18 08:30',
        actor: 'Marcus Vance',
        role: 'Mechanical Technician',
        action: 'Acknowledged Alert',
        notes: 'Accepted ticket and requisitioned filters.'
      },
      {
        id: 'TL-108-3',
        timestamp: '2026-09-19 12:00',
        actor: 'Marcus Vance',
        role: 'Mechanical Technician',
        action: 'Status Changed to Resolved',
        notes: 'Servicing checklist complete.'
      },
      {
        id: 'TL-108-4',
        timestamp: '2026-09-19 14:30',
        actor: 'Sector Head - Sector 1',
        role: 'Production Sector Head',
        action: 'Verified & Closed Incident',
        notes: 'Inspection signed off. Machine operational.'
      }
    ],
    escalationHistory: []
  }
];
