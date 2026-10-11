/* IndustrialCare - Industrial Maintenance Management System Mock Data */

export const MOCK_USER = {
  name: 'Alex Vance',
  role: 'admin',
  title: 'System Administrator',
  email: 'admin@industrialcare.io',
  avatar: 'AV',
  sector: 'All Plant Sectors',
  department: 'Plant Operations'
};

export const ADMIN_KPI_STATS = [
  {
    id: 'total-machines',
    title: 'Total Monitored Machines',
    value: '128',
    subtext: '+4 new units this month',
    trend: 'positive',
    trendValue: '100% Monitored',
    iconName: 'Cpu',
    color: 'primary'
  },
  {
    id: 'healthy-machines',
    title: 'Healthy Machines',
    value: '112',
    subtext: '87.5% of total fleet',
    trend: 'positive',
    trendValue: '94.2% Health Avg',
    iconName: 'CheckCircle2',
    color: 'success'
  },
  {
    id: 'attention-machines',
    title: 'Requires Attention',
    value: '11',
    subtext: 'Minor warnings or scheduled checks',
    trend: 'neutral',
    trendValue: '8.6% Fleet',
    iconName: 'AlertTriangle',
    color: 'warning'
  },
  {
    id: 'open-failures',
    title: 'Open Critical Failures',
    value: '5',
    subtext: 'Immediate technician action needed',
    trend: 'negative',
    trendValue: '3 Urgent',
    iconName: 'ShieldAlert',
    color: 'danger'
  },
  {
    id: 'overdue-tasks',
    title: 'Overdue Maintenance Tasks',
    value: '2',
    subtext: 'Exceeded target deadline',
    trend: 'negative',
    trendValue: 'Action Req.',
    iconName: 'Clock',
    color: 'warning'
  },
  {
    id: 'resolved-failures',
    title: 'Resolved Failures (30d)',
    value: '34',
    subtext: 'Successfully repaired & verified',
    trend: 'positive',
    trendValue: '+18% MTTR Efficiency',
    iconName: 'CheckSquare',
    color: 'info'
  }
];

export const MOCK_SECTORS_SUMMARY = [
  {
    id: 'SEC-PROD',
    name: 'Production & Manufacturing',
    code: 'PRODUCTION',
    headName: 'Robert Chen',
    headTitle: 'Production Sector Head',
    totalMachines: 52,
    healthyMachines: 47,
    attentionMachines: 3,
    criticalMachines: 2,
    openTasks: 5,
    healthIndex: 94.8,
    categories: ['Machining', 'Stamping', 'Material Handling', 'Robotics']
  },
  {
    id: 'SEC-MECH',
    name: 'Mechanical Department',
    code: 'MECHANICAL',
    headName: 'David Miller',
    headTitle: 'Mechanical Sector Head',
    totalMachines: 44,
    healthyMachines: 38,
    attentionMachines: 5,
    criticalMachines: 1,
    openTasks: 6,
    healthIndex: 91.2,
    categories: ['Fluid Systems', 'Pneumatics', 'Thermal Systems', 'Machining']
  },
  {
    id: 'SEC-ELEC',
    name: 'Electrical Department',
    code: 'ELECTRICAL',
    headName: 'Sarah Jenkins',
    headTitle: 'Electrical Sector Head',
    totalMachines: 32,
    healthyMachines: 27,
    attentionMachines: 3,
    criticalMachines: 2,
    openTasks: 3,
    healthIndex: 92.5,
    categories: ['Electrical Distribution', 'Robotics', 'Pneumatics']
  }
];

export const MOCK_ASSETS = [
  {
    id: 'AST-101',
    name: 'CNC Milling Machine #04',
    type: 'CNC Milling Machine',
    sector: 'Production & Manufacturing',
    department: 'Machining Line 1',
    category: 'Machining',
    location: 'Bay A - Line 1',
    status: 'Operational',
    healthScore: 96,
    lastMaintenance: '2026-09-28',
    nextScheduled: '2026-10-28',
    sensorsCount: 6,
    assignedTech: 'Marcus Vance',
    dataSource: 'Demo Data',
    lastUpdated: '2026-10-10 14:35:00',
    coordinates: { x: 20, y: 35 },
    specs: {
      power: '22 kW',
      maxRpm: '12,000 RPM',
      manufacturer: 'Haas Automation',
      modelYear: '2023'
    },
    readings: [
      { name: 'Vibration', value: '1.42', unit: 'mm/s', range: '0.5 - 4.5', status: 'Normal' },
      { name: 'Spindle Temperature', value: '42.5', unit: '°C', range: '20 - 75', status: 'Normal' },
      { name: 'Coolant Pressure', value: '4.2', unit: 'bar', range: '2.0 - 6.0', status: 'Normal' },
      { name: 'Motor Load', value: '58.4', unit: '%', range: '10 - 90', status: 'Normal' }
    ],
    maintenanceHistory: [
      { id: 'MH-101', date: '2026-09-28', type: 'Preventive Inspection', technician: 'Marcus Vance', details: 'Replaced coolant filter & calibrated spindle axis.', status: 'Completed' },
      { id: 'MH-102', date: '2026-07-15', type: 'Routine Servicing', technician: 'David Miller', details: 'Lubricated drive screws and verified thermal sensor.', status: 'Completed' }
    ]
  },
  {
    id: 'AST-102',
    name: 'Hydraulic Press HP-200',
    type: 'Hydraulic Press',
    sector: 'Mechanical Department',
    department: 'Stamping & Heavy Press',
    category: 'Stamping',
    location: 'Bay B - Line 3',
    status: 'Warning',
    healthScore: 78,
    lastMaintenance: '2026-09-14',
    nextScheduled: '2026-10-15',
    sensorsCount: 8,
    assignedTech: 'David Miller',
    dataSource: 'Manual Entry',
    lastUpdated: '2026-10-10 11:05:00',
    coordinates: { x: 50, y: 30 },
    specs: {
      pressureCap: '200 Tons',
      fluidType: 'ISO VG 46',
      manufacturer: 'Schuler Group',
      modelYear: '2021'
    },
    readings: [
      { name: 'Vibration', value: '3.85', unit: 'mm/s', range: '0.5 - 4.5', status: 'Normal' },
      { name: 'Oil Temperature', value: '74.5', unit: '°C', range: '40 - 70', status: 'Warning' },
      { name: 'Hydraulic Pressure', value: '185.0', unit: 'bar', range: '150 - 210', status: 'Normal' },
      { name: 'Pump Current', value: '42.1', unit: 'A', range: '20 - 45', status: 'Normal' }
    ],
    maintenanceHistory: [
      { id: 'MH-201', date: '2026-09-14', type: 'Oil Line Seal Replacement', technician: 'David Miller', details: 'Flushed reservoir oil and replaced primary seal ring.', status: 'Completed' }
    ]
  },
  {
    id: 'AST-103',
    name: 'Centrifugal Water Pump CP-12',
    type: 'Centrifugal Pump',
    sector: 'Mechanical Department',
    department: 'Cooling & Fluids',
    category: 'Fluid Systems',
    location: 'Utility Room 2',
    status: 'Operational',
    healthScore: 92,
    lastMaintenance: '2026-10-02',
    nextScheduled: '2026-11-02',
    sensorsCount: 4,
    assignedTech: 'Marcus Vance',
    dataSource: 'Demo Data',
    lastUpdated: '2026-10-10 13:20:00',
    coordinates: { x: 75, y: 65 },
    specs: {
      flowRate: '1,200 L/min',
      headHeight: '45m',
      manufacturer: 'Grundfos',
      modelYear: '2022'
    },
    readings: [
      { name: 'Vibration', value: '1.15', unit: 'mm/s', range: '0.5 - 3.5', status: 'Normal' },
      { name: 'Bearing Temperature', value: '38.2', unit: '°C', range: '20 - 65', status: 'Normal' },
      { name: 'Flow Rate', value: '1,180', unit: 'L/min', range: '1,000 - 1,300', status: 'Normal' }
    ],
    maintenanceHistory: [
      { id: 'MH-301', date: '2026-10-02', type: 'Impeller Alignment', technician: 'Marcus Vance', details: 'Greased motor bearings and verified flow sensor output.', status: 'Completed' }
    ]
  },
  {
    id: 'AST-104',
    name: 'Conveyor Assembly Belt Line B',
    type: 'Conveyor System',
    sector: 'Production & Manufacturing',
    department: 'Material Logistics',
    category: 'Material Handling',
    location: 'Assembly Floor',
    status: 'Warning',
    healthScore: 64,
    lastMaintenance: '2026-08-19',
    nextScheduled: '2026-10-11',
    sensorsCount: 5,
    assignedTech: 'David Miller',
    dataSource: 'Manual Entry',
    lastUpdated: '2026-10-09 16:40:00',
    coordinates: { x: 70, y: 60 },
    specs: {
      beltWidth: '800mm',
      speed: '1.2 m/s',
      manufacturer: 'Bosch Rexroth',
      modelYear: '2020'
    },
    readings: [
      { name: 'Drive Speed', value: '0.98', unit: 'm/s', range: '1.1 - 1.3', status: 'Warning' },
      { name: 'Roller Vibration', value: '4.10', unit: 'mm/s', range: '0.5 - 4.0', status: 'Warning' },
      { name: 'Motor Current', value: '26.8', unit: 'A', range: '15 - 30', status: 'Normal' }
    ],
    maintenanceHistory: [
      { id: 'MH-401', date: '2026-08-19', type: 'Belt Tensioning', technician: 'David Miller', details: 'Replaced section 2 roller bearing.', status: 'Completed' }
    ]
  },
  {
    id: 'AST-105',
    name: 'Industrial Boiler Unit BL-01',
    type: 'Steam Boiler',
    sector: 'Mechanical Department',
    department: 'Thermal Utilities',
    category: 'Thermal Systems',
    location: 'Powerhouse',
    status: 'Operational',
    healthScore: 98,
    lastMaintenance: '2026-10-05',
    nextScheduled: '2026-12-05',
    sensorsCount: 12,
    assignedTech: 'Elena Rostova',
    dataSource: 'Demo Data',
    lastUpdated: '2026-10-10 12:00:00',
    coordinates: { x: 25, y: 70 },
    specs: {
      steamOutput: '5,000 kg/h',
      maxPressure: '16 bar',
      manufacturer: 'Viessmann',
      modelYear: '2024'
    },
    readings: [
      { name: 'Steam Pressure', value: '14.2', unit: 'bar', range: '10 - 16', status: 'Normal' },
      { name: 'Flue Gas Temp', value: '182.0', unit: '°C', range: '140 - 210', status: 'Normal' },
      { name: 'Water Level', value: '78.0', unit: '%', range: '60 - 90', status: 'Normal' }
    ],
    maintenanceHistory: [
      { id: 'MH-501', date: '2026-10-05', type: 'Safety Inspection', technician: 'Elena Rostova', details: 'Relief valve tested and pressure certified.', status: 'Completed' }
    ]
  },
  {
    id: 'AST-106',
    name: '6-Axis Robotic Arm RA-09',
    type: 'Robotic Arm',
    sector: 'Electrical Department',
    department: 'Robotic Welding Automation',
    category: 'Robotics',
    location: 'Bay C - Welding',
    status: 'Critical',
    healthScore: 48,
    lastMaintenance: '2026-09-01',
    nextScheduled: '2026-10-12',
    sensorsCount: 7,
    assignedTech: 'Elena Rostova',
    dataSource: 'Manual Entry',
    lastUpdated: '2026-10-10 14:22:00',
    coordinates: { x: 30, y: 40 },
    specs: {
      payload: '20 kg',
      reach: '1,811 mm',
      manufacturer: 'FANUC Robotics',
      modelYear: '2022'
    },
    readings: [
      { name: 'Joint 3 Vibration', value: '7.82', unit: 'mm/s', range: '0.5 - 4.5', status: 'Critical' },
      { name: 'Servo Motor Temp', value: '88.4', unit: '°C', range: '20 - 75', status: 'Critical' },
      { name: 'Drive Current', value: '28.6', unit: 'A', range: '10 - 22', status: 'Critical' }
    ],
    maintenanceHistory: [
      { id: 'MH-601', date: '2026-09-01', type: 'Axis Lubrication', technician: 'Elena Rostova', details: 'Greased joint 1 and joint 2 gearboxes.', status: 'Completed' }
    ]
  },
  {
    id: 'AST-107',
    name: 'Screw Compressor AC-88',
    type: 'Air Compressor',
    sector: 'Mechanical Department',
    department: 'Pneumatics Distribution',
    category: 'Pneumatics',
    location: 'Compressor Room',
    status: 'Operational',
    healthScore: 89,
    lastMaintenance: '2026-09-20',
    nextScheduled: '2026-10-25',
    sensorsCount: 5,
    assignedTech: 'Marcus Vance',
    dataSource: 'Demo Data',
    lastUpdated: '2026-10-10 10:15:00',
    coordinates: { x: 60, y: 25 },
    specs: {
      capacity: '15 m³/min',
      rating: '75 kW',
      manufacturer: 'Atlas Copco',
      modelYear: '2021'
    },
    readings: [
      { name: 'Air Pressure', value: '8.4', unit: 'bar', range: '6.0 - 10.0', status: 'Normal' },
      { name: 'Discharge Temp', value: '76.0', unit: '°C', range: '50 - 95', status: 'Normal' }
    ],
    maintenanceHistory: [
      { id: 'MH-701', date: '2026-09-20', type: 'Filter Replacement', technician: 'Marcus Vance', details: 'Replaced intake air filter cartridge.', status: 'Completed' }
    ]
  },
  {
    id: 'AST-108',
    name: 'Step-down Transformer TR-02',
    type: 'Power Transformer',
    sector: 'Electrical Department',
    department: 'High Voltage Power',
    category: 'Electrical Distribution',
    location: 'Substation East',
    status: 'Operational',
    healthScore: 95,
    lastMaintenance: '2026-07-15',
    nextScheduled: '2027-01-15',
    sensorsCount: 6,
    assignedTech: 'Sarah Jenkins',
    dataSource: 'Demo Data',
    lastUpdated: '2026-10-10 09:15:00',
    coordinates: { x: 75, y: 35 },
    specs: {
      rating: '2.5 MVA',
      primaryVoltage: '11 kV',
      manufacturer: 'ABB Electric',
      modelYear: '2019'
    },
    readings: [
      { name: 'Core Temperature', value: '52.0', unit: '°C', range: '30 - 85', status: 'Normal' },
      { name: 'Oil Level', value: '94.0', unit: '%', range: '80 - 100', status: 'Normal' },
      { name: 'Secondary Voltage', value: '415.2', unit: 'V', range: '400 - 430', status: 'Normal' }
    ],
    maintenanceHistory: [
      { id: 'MH-801', date: '2026-07-15', type: 'Annual Substation Inspection', technician: 'Sarah Jenkins', details: 'Oil dielectric breakdown test passed.', status: 'Completed' }
    ]
  },
  {
    id: 'AST-109',
    name: 'Precision Lathe Unit L-50',
    type: 'Industrial Lathe',
    sector: 'Production & Manufacturing',
    department: 'Machining Line 2',
    category: 'Machining',
    location: 'Bay A - Line 2',
    status: 'Offline',
    healthScore: 0,
    lastMaintenance: '2026-06-10',
    nextScheduled: '2026-11-01',
    sensorsCount: 3,
    assignedTech: 'Marcus Vance',
    dataSource: 'Manual Entry',
    lastUpdated: '2026-10-01 08:00:00',
    coordinates: { x: 50, y: 70 },
    specs: {
      power: '15 kW',
      maxRpm: '4,500 RPM',
      manufacturer: 'Mazak',
      modelYear: '2018'
    },
    readings: [
      { name: 'Vibration', value: '0.00', unit: 'mm/s', range: '0.5 - 4.0', status: 'Offline' },
      { name: 'Motor Current', value: '0.00', unit: 'A', range: '10 - 30', status: 'Offline' }
    ],
    maintenanceHistory: [
      { id: 'MH-901', date: '2026-06-10', type: 'Scheduled Deactivation', technician: 'Marcus Vance', details: 'Unit decommissioned pending motor overhaul.', status: 'Deactivated' }
    ]
  }
];


export const MOCK_ALERTS = [
  {
    id: 'ALT-901',
    machineId: 'AST-106',
    machineName: '6-Axis Robotic Arm RA-09',
    sector: 'Electrical Department',
    department: 'Robotic Welding Automation',
    severity: 'Critical',
    date: '2026-10-10 14:22',
    createdTime: '2026-10-10 14:22',
    deadline: '2026-10-12',
    status: 'In Progress',
    assignedTech: 'Elena Rostova',
    title: 'High Servo Motor Vibration',
    description: 'Joint 3 vibration telemetry exceeded safety limit (7.82 mm/s). Immediate gear alignment check required.',
    overdue: false,
    escalated: false,
    technicianNotes: 'Inspected joint 3 drive motor housing. Ordered replacement servo gear bearing.',
    auditTimeline: [
      { id: 'TL-101', timestamp: '2026-10-10 14:22', actor: 'IoT Vibration Node', role: 'System', action: 'Alert Created', notes: 'Vibration threshold exceeded (7.82 mm/s).' },
      { id: 'TL-102', timestamp: '2026-10-10 14:30', actor: 'Sarah Jenkins', role: 'Electrical Sector Head', action: 'Assigned Technician', notes: 'Routed to Elena Rostova for high priority inspection.' },
      { id: 'TL-103', timestamp: '2026-10-10 15:00', actor: 'Elena Rostova', role: 'Electrical Technician', action: 'Acknowledged Task', notes: 'Technician acknowledged work order assignment.' },
      { id: 'TL-104', timestamp: '2026-10-10 15:30', actor: 'Elena Rostova', role: 'Electrical Technician', action: 'Status Changed to In Progress', notes: 'Disassembled motor cover; checking gear alignment.' }
    ],
    escalationHistory: []
  },
  {
    id: 'ALT-902',
    machineId: 'AST-102',
    machineName: 'Hydraulic Press HP-200',
    sector: 'Mechanical Department',
    department: 'Stamping & Heavy Press',
    severity: 'Warning',
    date: '2026-10-10 11:05',
    createdTime: '2026-10-10 11:05',
    deadline: '2026-10-09', // Overdue for test
    status: 'New',
    assignedTech: 'David Miller',
    title: 'Elevated Fluid Temperature',
    description: 'Hydraulic oil reservoir reached 74.5°C threshold.',
    overdue: true,
    escalated: true,
    escalatedReason: 'Overdue task escalated to System Admin due to unacknowledged delay.',
    technicianNotes: '',
    auditTimeline: [
      { id: 'TL-201', timestamp: '2026-10-10 11:05', actor: 'Temperature Sensor 204', role: 'System', action: 'Alert Created', notes: 'Fluid temp warning threshold reached (74.5°C).' },
      { id: 'TL-202', timestamp: '2026-10-10 12:00', actor: 'David Miller', role: 'Mechanical Sector Head', action: 'Reminder Sent', notes: 'Dispatched urgent reminder to assigned team.' },
      { id: 'TL-203', timestamp: '2026-10-10 13:30', actor: 'David Miller', role: 'Mechanical Sector Head', action: 'Escalated to Admin', notes: 'Overdue task escalated to Admin for priority reassignment.' }
    ],
    escalationHistory: [
      { id: 'ESC-01', timestamp: '2026-10-10 13:30', escalatedBy: 'David Miller', role: 'Mechanical Sector Head', reason: 'Target deadline 2026-10-09 exceeded without acknowledgment.' }
    ]
  },
  {
    id: 'ALT-903',
    machineId: 'AST-104',
    machineName: 'Conveyor Assembly Belt Line B',
    sector: 'Production & Manufacturing',
    department: 'Material Logistics',
    severity: 'Warning',
    date: '2026-10-09 16:40',
    createdTime: '2026-10-09 16:40',
    deadline: '2026-10-11',
    status: 'Resolved',
    assignedTech: 'Marcus Vance',
    title: 'Drive Belt Slippage Detected',
    description: 'Line speed dropped 14% below target operational velocity.',
    overdue: false,
    escalated: false,
    technicianNotes: 'Adjusted belt tensioner and replaced section 2 roller bearing. Velocity restored to 1.2 m/s.',
    auditTimeline: [
      { id: 'TL-301', timestamp: '2026-10-09 16:40', actor: 'Conveyor Speed Sensor', role: 'System', action: 'Alert Created', notes: 'Belt speed slippage detected.' },
      { id: 'TL-302', timestamp: '2026-10-09 17:00', actor: 'Robert Chen', role: 'Production Sector Head', action: 'Assigned Technician', notes: 'Assigned to Marcus Vance.' },
      { id: 'TL-303', timestamp: '2026-10-10 09:15', actor: 'Marcus Vance', role: 'Mechanical Technician', action: 'Status Changed to Resolved', notes: 'Submitted repair resolution pending Sector Head verification.' }
    ],
    escalationHistory: []
  },
  {
    id: 'ALT-904',
    machineId: 'AST-108',
    machineName: 'Step-down Transformer TR-02',
    sector: 'Electrical Department',
    department: 'High Voltage Power',
    severity: 'Info',
    date: '2026-10-08 09:15',
    createdTime: '2026-10-08 09:15',
    deadline: '2026-10-08',
    status: 'Closed',
    assignedTech: 'Sarah Jenkins',
    title: 'Routine Harmonic Inspection',
    description: 'Grid voltage balance verified within 0.5% deviation.',
    overdue: false,
    escalated: false,
    technicianNotes: 'Harmonic analyzer readings normal. Primary winding insulation verified.',
    auditTimeline: [
      { id: 'TL-401', timestamp: '2026-10-08 09:15', actor: 'Substation Inspector', role: 'System', action: 'Alert Created', notes: 'Scheduled harmonic test.' },
      { id: 'TL-402', timestamp: '2026-10-08 11:30', actor: 'Sarah Jenkins', role: 'Electrical Sector Head', action: 'Verified & Closed Incident', notes: 'Verified compliance log; incident officially closed.' }
    ],
    escalationHistory: []
  },
  {
    id: 'ALT-905',
    machineId: 'AST-105',
    machineName: 'Industrial Boiler Unit BL-01',
    sector: 'Mechanical Department',
    department: 'Thermal Utilities',
    severity: 'Info',
    date: '2026-10-06 18:30',
    createdTime: '2026-10-06 18:30',
    deadline: '2026-10-07',
    status: 'Closed',
    assignedTech: 'Elena Rostova',
    title: 'Valve Recalibration Completed',
    description: 'Pressure relief valve test passed compliance check.',
    overdue: false,
    escalated: false,
    technicianNotes: 'Relief valve pop test passed at 16.0 bar limit.',
    auditTimeline: [
      { id: 'TL-501', timestamp: '2026-10-06 18:30', actor: 'Boiler Monitor', role: 'System', action: 'Alert Created', notes: 'Annual safety valve check.' },
      { id: 'TL-502', timestamp: '2026-10-07 10:00', actor: 'David Miller', role: 'Mechanical Sector Head', action: 'Verified & Closed Incident', notes: 'Pressure certificate uploaded; closed.' }
    ],
    escalationHistory: []
  },
  {
    id: 'ALT-906',
    machineId: 'AST-101',
    machineName: 'CNC Milling Machine #04',
    sector: 'Production & Manufacturing',
    department: 'Machining Line 1',
    severity: 'Critical',
    date: '2026-10-10 08:30',
    createdTime: '2026-10-10 08:30',
    deadline: '2026-10-13',
    status: 'Reopened',
    assignedTech: 'Marcus Vance',
    title: 'Spindle Axis Thermal Overload',
    description: 'Spindle bearings reached 82°C during high-speed milling operation.',
    overdue: false,
    escalated: false,
    technicianNotes: 'Flushed coolant line and lubricated spindle housing.',
    auditTimeline: [
      { id: 'TL-601', timestamp: '2026-10-10 08:30', actor: 'Robert Chen', role: 'Production Sector Head', action: 'Alert Created', notes: 'Manual demo alert logged.' },
      { id: 'TL-602', timestamp: '2026-10-10 11:00', actor: 'Marcus Vance', role: 'Mechanical Technician', action: 'Submitted Resolution', notes: 'Flushed coolant lines.' },
      { id: 'TL-603', timestamp: '2026-10-10 12:30', actor: 'Robert Chen', role: 'Production Sector Head', action: 'Reopened Incident', notes: 'Reopened: Spindle temp remains above 78°C under test load. Further diagnosis required.' }
    ],
    escalationHistory: []
  }
];

export const MOCK_WORK_ORDERS = [
  {
    id: 'WO-2026-089',
    assetId: 'AST-106',
    assetName: '6-Axis Robotic Arm RA-09',
    sector: 'Electrical Department',
    type: 'Corrective Maintenance',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'Marcus Vance (Senior Tech)',
    createdDate: '2026-10-09',
    dueDate: '2026-10-11',
    description: 'Joint 3 servo motor vibration exceeds safety threshold. Inspect gearbox alignment and lubricate drive gears.'
  },
  {
    id: 'WO-2026-088',
    assetId: 'AST-102',
    assetName: 'Hydraulic Press HP-200',
    sector: 'Mechanical Department',
    type: 'Preventive Inspection',
    priority: 'Medium',
    status: 'Pending',
    assignedTo: 'Sarah Jenkins',
    createdDate: '2026-10-08',
    dueDate: '2026-10-13',
    description: 'Check fluid viscosity level and replace return oil line seal filter.'
  },
  {
    id: 'WO-2026-087',
    assetId: 'AST-104',
    assetName: 'Conveyor Assembly Belt Line B',
    sector: 'Production & Manufacturing',
    type: 'Routine Maintenance',
    priority: 'High',
    status: 'Pending',
    assignedTo: 'David Miller',
    createdDate: '2026-10-07',
    dueDate: '2026-10-05', // Overdue
    description: 'Adjust drive belt tension and inspect roller bearing wear along Section 4.'
  },
  {
    id: 'WO-2026-085',
    assetId: 'AST-101',
    assetName: 'CNC Milling Machine #04',
    sector: 'Production & Manufacturing',
    type: 'Calibration',
    priority: 'Low',
    status: 'Completed',
    assignedTo: 'Marcus Vance',
    createdDate: '2026-09-27',
    dueDate: '2026-09-28',
    description: 'Quarterly spindle axis calibration and coolant flow rate check.'
  },
  {
    id: 'WO-2026-084',
    assetId: 'AST-105',
    assetName: 'Industrial Boiler Unit BL-01',
    sector: 'Mechanical Department',
    type: 'Safety Compliance',
    priority: 'Medium',
    status: 'Completed',
    assignedTo: 'Elena Rostova',
    createdDate: '2026-10-04',
    dueDate: '2026-10-05',
    description: 'Pressure relief valve testing and thermal sensor recalibration.'
  }
];

export const MOCK_SPARE_PARTS = [
  {
    id: 'PRT-501',
    name: 'FANUC Joint 3 Servo Motor 2.2kW',
    category: 'Electrical / Motors',
    compatibleMachine: '6-Axis Robotic Arm RA-09',
    compatibleMachineId: 'AST-106',
    stockQuantity: 3,
    minThreshold: 2,
    unitPrice: '$1,450.00',
    location: 'Shelf B-12',
    status: 'In Stock'
  },
  {
    id: 'PRT-502',
    name: 'Hydraulic High-Viscosity Filter Element ISO 46',
    category: 'Hydraulics & Filters',
    compatibleMachine: 'Hydraulic Press HP-200',
    compatibleMachineId: 'AST-102',
    stockQuantity: 1,
    minThreshold: 4,
    unitPrice: '$180.00',
    location: 'Shelf H-04',
    status: 'Low Stock'
  },
  {
    id: 'PRT-503',
    name: 'Reinforced Rubber Conveyor Belt 800mm (25m)',
    category: 'Belts & Bearings',
    compatibleMachine: 'Conveyor Belt Line B',
    compatibleMachineId: 'AST-104',
    stockQuantity: 5,
    minThreshold: 2,
    unitPrice: '$620.00',
    location: 'Bay M Warehouse',
    status: 'In Stock'
  },
  {
    id: 'PRT-504',
    name: 'Tri-Axial Industrial Vibration Sensor Node',
    category: 'IoT Sensors',
    compatibleMachine: 'CNC Milling Machine #04',
    compatibleMachineId: 'AST-101',
    stockQuantity: 8,
    minThreshold: 5,
    unitPrice: '$340.00',
    location: 'Cabinet S-01',
    status: 'In Stock'
  },
  {
    id: 'PRT-505',
    name: 'High Pressure Boiler Relief Valve 16 bar',
    category: 'Valves & Fittings',
    compatibleMachine: 'Industrial Boiler Unit BL-01',
    compatibleMachineId: 'AST-105',
    stockQuantity: 0,
    minThreshold: 1,
    unitPrice: '$890.00',
    location: 'Shelf V-08',
    status: 'Out of Stock'
  }
];

export const MOCK_PREVENTIVE_SCHEDULES = [
  {
    id: 'PM-701',
    machineId: 'AST-101',
    machineName: 'CNC Milling Machine #04',
    sector: 'Production & Manufacturing',
    department: 'Machining Line 1',
    title: 'Monthly Spindle Lubrication & Axis Alignment',
    frequency: 'Monthly',
    nextDueDate: '2026-10-15',
    assignedTech: 'Marcus Vance',
    instructions: '1. Flush coolant lines.\n2. Inspect spindle belt tension.\n3. Greasing drive screw bearings.\n4. Run 5-axis zero calibration routine.',
    status: 'Upcoming',
    lastCompletedDate: '2026-09-15',
    servicingNotes: 'Replaced secondary seal ring. Axis alignment verified.'
  },
  {
    id: 'PM-702',
    machineId: 'AST-102',
    machineName: 'Hydraulic Press HP-200',
    sector: 'Mechanical Department',
    department: 'Stamping & Heavy Press',
    title: 'Bi-Weekly Fluid Viscosity & Pressure Test',
    frequency: 'Bi-weekly',
    nextDueDate: '2026-10-10',
    assignedTech: 'David Miller',
    instructions: '1. Sample hydraulic fluid from main reservoir.\n2. Verify pump pressure output at 200 tons limit.\n3. Inspect return line seal fittings.',
    status: 'Due Today',
    lastCompletedDate: '2026-09-26',
    servicingNotes: 'Fluid viscosity within normal range ISO VG 46.'
  },
  {
    id: 'PM-703',
    machineId: 'AST-104',
    machineName: 'Conveyor Assembly Belt Line B',
    sector: 'Production & Manufacturing',
    department: 'Material Logistics',
    title: 'Weekly Roller Bearing & Belt Inspection',
    frequency: 'Weekly',
    nextDueDate: '2026-10-08',
    assignedTech: 'David Miller',
    instructions: '1. Check drive belt tension along section 4.\n2. Lubricate roller bearings.\n3. Measure motor thermal output.',
    status: 'Overdue',
    lastCompletedDate: '2026-10-01',
    servicingNotes: 'Slight belt slack detected on roller 2.'
  },
  {
    id: 'PM-704',
    machineId: 'AST-105',
    machineName: 'Industrial Boiler Unit BL-01',
    sector: 'Mechanical Department',
    department: 'Thermal Utilities',
    title: 'Quarterly Safety Relief Valve Testing',
    frequency: 'Quarterly',
    nextDueDate: '2026-12-05',
    assignedTech: 'Elena Rostova',
    instructions: '1. Perform pop test on safety relief valve.\n2. Calibrate thermal flue gas sensor.\n3. Inspect water feed check valves.',
    status: 'Upcoming',
    lastCompletedDate: '2026-09-05',
    servicingNotes: 'Relief valve pop test passed compliance check.'
  },
  {
    id: 'PM-705',
    machineId: 'AST-108',
    machineName: 'Step-down Transformer TR-02',
    sector: 'Electrical Department',
    department: 'High Voltage Power',
    title: 'Annual Oil Dielectric Breakdown Test',
    frequency: 'Annual',
    nextDueDate: '2027-01-15',
    assignedTech: 'Sarah Jenkins',
    instructions: '1. Draw insulating oil sample.\n2. Measure dielectric breakdown voltage.\n3. Verify primary terminal torque.',
    status: 'Upcoming',
    lastCompletedDate: '2026-01-15',
    servicingNotes: 'Dielectric breakdown voltage 45 kV passed.'
  }
];

export const MOCK_DOWNTIME_LOGS = [
  {
    id: 'DT-301',
    machineId: 'AST-106',
    machineName: '6-Axis Robotic Arm RA-09',
    sector: 'Electrical Department',
    department: 'Robotic Welding Automation',
    startTime: '2026-10-10 09:15',
    endTime: '2026-10-10 11:45',
    downtimeHours: 2.5,
    reason: 'Unplanned Mechanical Breakdown',
    notes: 'Servo motor joint 3 vibration lock trip. Machine halted for gearbox disassembly.',
    status: 'Resolved',
    recordedBy: 'Elena Rostova'
  },
  {
    id: 'DT-302',
    machineId: 'AST-102',
    machineName: 'Hydraulic Press HP-200',
    sector: 'Mechanical Department',
    department: 'Stamping & Heavy Press',
    startTime: '2026-10-09 14:00',
    endTime: '2026-10-09 16:30',
    downtimeHours: 2.5,
    reason: 'Preventive Servicing',
    notes: 'Scheduled fluid seal replacement and reservoir flush.',
    status: 'Resolved',
    recordedBy: 'David Miller'
  },
  {
    id: 'DT-303',
    machineId: 'AST-104',
    machineName: 'Conveyor Assembly Belt Line B',
    sector: 'Production & Manufacturing',
    department: 'Material Logistics',
    startTime: '2026-10-08 10:30',
    endTime: '2026-10-08 12:00',
    downtimeHours: 1.5,
    reason: 'Material Shortage / Line Stop',
    notes: 'Line halted due to raw material batch supply delay.',
    status: 'Resolved',
    recordedBy: 'Marcus Vance'
  },
  {
    id: 'DT-304',
    machineId: 'AST-109',
    machineName: 'Precision Lathe Unit L-50',
    sector: 'Production & Manufacturing',
    department: 'Machining Line 2',
    startTime: '2026-10-01 08:00',
    endTime: 'Ongoing',
    downtimeHours: 224.0,
    reason: 'Major Equipment Overhaul',
    notes: 'Unit decommissioned pending main motor replacement.',
    status: 'Ongoing',
    recordedBy: 'Robert Chen'
  }
];

export const MOCK_SENSORS = [
  {
    id: 'SNS-VIB-401',
    assetName: 'CNC Milling Spindle',
    type: 'Tri-axial Vibration',
    currentValue: '3.42 mm/s',
    normalRange: '0.5 - 4.5 mm/s',
    status: 'Normal',
    lastPing: '2 mins ago'
  },
  {
    id: 'SNS-TMP-204',
    assetName: 'Hydraulic Oil Reservoir',
    type: 'Temperature Sensor',
    currentValue: '72.8 °C',
    normalRange: '40.0 - 75.0 °C',
    status: 'Warning',
    lastPing: '1 min ago'
  },
  {
    id: 'SNS-PRS-109',
    assetName: 'Air Compressor Tank',
    type: 'Pressure Transmitter',
    currentValue: '8.4 bar',
    normalRange: '6.0 - 10.0 bar',
    status: 'Normal',
    lastPing: 'Just now'
  },
  {
    id: 'SNS-CUR-502',
    assetName: 'Robotic Arm Motor 3',
    type: 'Current Transducer',
    currentValue: '28.6 A',
    normalRange: '10.0 - 22.0 A',
    status: 'Critical',
    lastPing: '3 mins ago'
  },
  {
    id: 'SNS-FLW-301',
    assetName: 'Boiler Feedwater Pipe',
    type: 'Ultrasonic Flow Meter',
    currentValue: '185 L/min',
    normalRange: '150 - 220 L/min',
    status: 'Normal',
    lastPing: '4 mins ago'
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 'NTF-1',
    title: 'High Vibration Alert',
    desc: 'Robotic Arm RA-09 Motor 3 vibration level exceeded 7.2 mm/s.',
    time: '12 mins ago',
    type: 'critical',
    read: false
  },
  {
    id: 'NTF-2',
    title: 'Work Order Updated',
    desc: 'Marcus Vance marked WO-2026-089 as In Progress.',
    time: '45 mins ago',
    type: 'info',
    read: false
  },
  {
    id: 'NTF-3',
    title: 'Temperature Warning',
    desc: 'Hydraulic Press HP-200 oil temp reached 72.8°C.',
    time: '2 hours ago',
    type: 'warning',
    read: true
  },
  {
    id: 'NTF-4',
    title: 'Scheduled Inspection Reminder',
    desc: 'Conveyor Line B inspection due in 24 hours.',
    time: '5 hours ago',
    type: 'info',
    read: true
  }
];
