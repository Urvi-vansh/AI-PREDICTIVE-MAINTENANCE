/* IndustrialCare - Comprehensive Maintenance Work Orders & Lifecycle Requests
   Workflow Stages:
   Open → Acknowledged → In Progress → Resolution Submitted → Verified and Resolved → Closed
*/

export const DEFAULT_MAINTENANCE_WORK_ORDERS = [
  {
    id: 'REQ-2026-101',
    assetId: 'SEC1M8',
    assetName: 'Multi-Spindle Drilling Machine DrillMaster-12',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Machining Line 2',
    assignedDepartment: 'Mechanical Department',
    assignedTech: 'Marcus Vance',
    status: 'In Progress',
    priority: 'Critical',
    type: 'Emergency Spindle Rebuild',
    createdAt: '2026-10-10 09:30:00',
    dueDate: '2026-10-12 18:00:00', // Expired deadline to demonstrate "Request Maintenance Again"
    description: 'Critical vibration spike (7.2 mm/s) and gearbox housing temperature reached 89.4°C. Spindle play detected in arbor assembly.',
    laborHours: 4.5,
    technicianNotes: 'Teardown initiated. Removed spindle head casting, extracted sheared bearing cage fragments. Mesh backlash requires reshimming.',
    replacedParts: ['Angular Contact Bearing Set 6205-2RS', 'Shaft Oil Seal Nitrile-25'],
    resolutionPeriod: null, // Unresolved, never invented
    resolvedAt: null,
    verifiedBy: null,
    verificationFeedback: null,
    parentRequestId: null,
    followUpRequestId: null,
    hasActiveFollowUp: false,
    auditTimeline: [
      {
        id: 'AUD-101-1',
        status: 'Open',
        action: 'Maintenance Request Created',
        timestamp: '2026-10-10 09:30:00',
        user: 'Urvi (Admin)',
        role: 'Administrator',
        reason: 'Automated telemetry threshold breach: Spindle temperature 89.4°C and vibration 7.2 mm/s.'
      },
      {
        id: 'AUD-101-2',
        status: 'Acknowledged',
        action: 'Work Order Acknowledged',
        timestamp: '2026-10-10 10:15:00',
        user: 'Marcus Vance',
        role: 'Mechanical Technician',
        reason: 'Ticket accepted. Spindle lockout scheduled for shift handover.'
      },
      {
        id: 'AUD-101-3',
        status: 'In Progress',
        action: 'Physical Disassembly Commenced',
        timestamp: '2026-10-10 14:00:00',
        user: 'Marcus Vance',
        role: 'Mechanical Technician',
        reason: 'Lockout-tagout verified. Head stock teardown underway.'
      }
    ]
  },
  {
    id: 'REQ-2026-102',
    assetId: 'SEC1M6',
    assetName: 'CNC Lathe & Turning Center TurnPro-80',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Machining Line 2',
    assignedDepartment: 'Mechanical Department',
    assignedTech: 'Marcus Vance',
    status: 'Resolution Submitted', // Demonstrates Sector Head Verify/Reject action
    priority: 'High',
    type: 'Bearing Overhaul & Dynamic Balancing',
    createdAt: '2026-10-11 11:20:00',
    dueDate: '2026-10-14 17:00:00',
    description: 'Main chuck spindle vibration elevated to 4.8 mm/s with harmonic frequency peaks at 120 Hz.',
    laborHours: 3.5,
    technicianNotes: 'Spindle chuck dismantled. Replaced worn front ceramic hybrid ball bearing set. Housing cleaned of oxidized grease, repacked with Kluber high-speed spindle lubricant. Dual-plane dynamic balancing completed; test spun at 2500 RPM.',
    replacedParts: ['Hybrid Ceramic Bearing 7010-C-TPA', 'Fluoroelastomer Dynamic Seal Ring'],
    resolutionPeriod: null, // Awaiting verification
    resolvedAt: null,
    verifiedBy: null,
    verificationFeedback: null,
    parentRequestId: null,
    followUpRequestId: null,
    hasActiveFollowUp: false,
    auditTimeline: [
      {
        id: 'AUD-102-1',
        status: 'Open',
        action: 'Maintenance Request Created',
        timestamp: '2026-10-11 11:20:00',
        user: 'Sector Head - Sector 1',
        role: 'Production Sector Head',
        reason: 'Scheduled investigation for persistent vibration warnings on Turning Center TurnPro-80.'
      },
      {
        id: 'AUD-102-2',
        status: 'Acknowledged',
        action: 'Request Acknowledged',
        timestamp: '2026-10-11 11:55:00',
        user: 'Marcus Vance',
        role: 'Mechanical Technician',
        reason: 'Dispatched to machining bay 6 with laser alignment kit.'
      },
      {
        id: 'AUD-102-3',
        status: 'In Progress',
        action: 'Spindle Servicing Underway',
        timestamp: '2026-10-11 13:30:00',
        user: 'Marcus Vance',
        role: 'Mechanical Technician',
        reason: 'Spindle cartridge removed for bearing press-fitting.'
      },
      {
        id: 'AUD-102-4',
        status: 'Resolution Submitted',
        action: 'Technician Resolution Submitted',
        timestamp: '2026-10-12 16:45:00',
        user: 'Marcus Vance',
        role: 'Mechanical Technician',
        reason: 'New bearings installed and test run successfully. Submitted for Sector Head verification and closure.'
      }
    ]
  },
  {
    id: 'REQ-2026-103',
    assetId: 'SEC2M8',
    assetName: 'Rotary Pipe & Tube Profiler TubeCut-360',
    sector: 'Sector 2 (Heavy Machining & Fabrication)',
    department: 'Thermal Cutting Cell',
    assignedDepartment: 'Electrical Department',
    assignedTech: 'Elena Rostova',
    status: 'Open', // Demonstrates Technician "Acknowledge" action
    priority: 'Critical',
    type: 'Thermal Power Inverter Repair',
    createdAt: '2026-10-13 10:15:00',
    dueDate: '2026-10-15 12:00:00',
    description: 'Plasma cutting bed coolant temperature critical (92.1°C), power draw spike to 45 kW and emergency arc shutdown.',
    laborHours: null,
    technicianNotes: null,
    replacedParts: [],
    resolutionPeriod: null,
    resolvedAt: null,
    verifiedBy: null,
    verificationFeedback: null,
    parentRequestId: null,
    followUpRequestId: null,
    hasActiveFollowUp: false,
    auditTimeline: [
      {
        id: 'AUD-103-1',
        status: 'Open',
        action: 'Maintenance Request Created',
        timestamp: '2026-10-13 10:15:00',
        user: 'Urvi (Admin)',
        role: 'Administrator',
        reason: 'Automated thermal trip. High priority alert escalated to Electrical Department.'
      }
    ]
  },
  {
    id: 'REQ-2026-104',
    assetId: 'SEC2M5',
    assetName: 'Heavy Gantry CNC Milling Center Gantry-M8',
    sector: 'Sector 2 (Heavy Machining & Fabrication)',
    department: 'Heavy Machining Bay',
    assignedDepartment: 'Mechanical Department',
    assignedTech: 'Marcus Vance',
    status: 'Acknowledged', // Demonstrates Technician "Start Work" action
    priority: 'High',
    type: 'Y-Axis Linear Way Guideway Servicing',
    createdAt: '2026-10-12 08:45:00',
    dueDate: '2026-10-16 16:00:00',
    description: 'Y-axis gantry guideway lubrication line pressure dropped to 6.2 bar. Temperature warning 82.5°C during continuous pass.',
    laborHours: null,
    technicianNotes: null,
    replacedParts: [],
    resolutionPeriod: null,
    resolvedAt: null,
    verifiedBy: null,
    verificationFeedback: null,
    parentRequestId: null,
    followUpRequestId: null,
    hasActiveFollowUp: false,
    auditTimeline: [
      {
        id: 'AUD-104-1',
        status: 'Open',
        action: 'Maintenance Request Created',
        timestamp: '2026-10-12 08:45:00',
        user: 'Sector Head - Sector 2',
        role: 'Heavy Machining Sector Head',
        reason: 'Scheduled repair for linear guide pressure sensor anomaly.'
      },
      {
        id: 'AUD-104-2',
        status: 'Acknowledged',
        action: 'Technician Acknowledged Work Order',
        timestamp: '2026-10-12 11:30:00',
        user: 'Marcus Vance',
        role: 'Mechanical Technician',
        reason: 'Tools and high-pressure manifold seals requisitioned from stores.'
      }
    ]
  },
  {
    id: 'REQ-2026-105',
    assetId: 'SEC1M1',
    assetName: 'CNC Vertical Machining Center VMC-1000',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Machining Line 1',
    assignedDepartment: 'Mechanical Department',
    assignedTech: 'Marcus Vance',
    status: 'Closed', // Demonstrates verified completed request with actual resolution period
    priority: 'Medium',
    type: 'Preventive Spindle Calibration & Flush',
    createdAt: '2026-09-18 08:00:00',
    dueDate: '2026-09-20 18:00:00',
    description: 'Quarterly hydraulic fluid change, spindle alignment laser check, and tool changer gripper tension test.',
    laborHours: 5.0,
    technicianNotes: 'Drained 40L hydraulic fluid, installed micro-glass return filter. Replaced tool changer claw springs and verified tool seat repeatability within 0.003mm.',
    replacedParts: ['Hydraulic Filter Cartridge HF-200', 'Tool Changer Spring Set TC-100'],
    resolutionPeriod: '1 day 6 hours 30 mins', // Calculated from actual completion, never invented
    resolvedAt: '2026-09-19 14:30:00',
    verifiedBy: 'Sector Head - Sector 1',
    verificationFeedback: 'Inspection report signed. Spindle vibration baseline measured at nominal 1.4 mm/s. Machine returned to full production status.',
    parentRequestId: null,
    followUpRequestId: null,
    hasActiveFollowUp: false,
    auditTimeline: [
      {
        id: 'AUD-105-1',
        status: 'Open',
        action: 'Maintenance Request Created',
        timestamp: '2026-09-18 08:00:00',
        user: 'Sector Head - Sector 1',
        role: 'Production Sector Head',
        reason: 'Quarterly planned servicing cycle.'
      },
      {
        id: 'AUD-105-2',
        status: 'Acknowledged',
        action: 'Work Order Acknowledged',
        timestamp: '2026-09-18 08:30:00',
        user: 'Marcus Vance',
        role: 'Mechanical Technician',
        reason: 'Assigned to morning maintenance slot.'
      },
      {
        id: 'AUD-105-3',
        status: 'In Progress',
        action: 'Servicing Started',
        timestamp: '2026-09-18 09:15:00',
        user: 'Marcus Vance',
        role: 'Mechanical Technician',
        reason: 'Machine isolated and fluid draining initiated.'
      },
      {
        id: 'AUD-105-4',
        status: 'Resolution Submitted',
        action: 'Technician Resolution Submitted',
        timestamp: '2026-09-19 12:00:00',
        user: 'Marcus Vance',
        role: 'Mechanical Technician',
        reason: 'All checklist items completed; test cycles verified.'
      },
      {
        id: 'AUD-105-5',
        status: 'Verified and Resolved',
        action: 'Sector Head Verification Approved',
        timestamp: '2026-09-19 14:00:00',
        user: 'Sector Head - Sector 1',
        role: 'Production Sector Head',
        reason: 'Quality control tolerance verified. Ready for closure.'
      },
      {
        id: 'AUD-105-6',
        status: 'Closed',
        action: 'Work Order Closed',
        timestamp: '2026-09-19 14:30:00',
        user: 'Sector Head - Sector 1',
        role: 'Production Sector Head',
        reason: 'Ticket officially archived. Operational status restored.'
      }
    ]
  },
  {
    id: 'REQ-2026-106',
    assetId: 'SEC3M8',
    assetName: 'High-Speed Case Packing Cell PackBot-800',
    sector: 'Sector 3 (Assembly & Packaging)',
    department: 'Packaging Line 2',
    assignedDepartment: 'Electrical Department',
    assignedTech: 'Elena Rostova',
    status: 'In Progress', // Overdue deadline
    priority: 'Critical',
    type: 'Robotic Servo Drive Synchronization',
    createdAt: '2026-10-09 14:00:00',
    dueDate: '2026-10-11 12:00:00', // Expired deadline
    description: 'Robotic arm axis 3 servo motor thermal overload and intermittent packet drop on packaging line.',
    laborHours: 2.0,
    technicianNotes: 'Axis 3 servo motor encoder harness loose; harness connector repinned, diagnostic communication active.',
    replacedParts: ['M12 Encoder Shielded Cable Cable-10M'],
    resolutionPeriod: null,
    resolvedAt: null,
    verifiedBy: null,
    verificationFeedback: null,
    parentRequestId: null,
    followUpRequestId: null,
    hasActiveFollowUp: false,
    auditTimeline: [
      {
        id: 'AUD-106-1',
        status: 'Open',
        action: 'Maintenance Request Created',
        timestamp: '2026-10-09 14:00:00',
        user: 'Sector Head - Sector 3',
        role: 'Packaging Sector Head',
        reason: 'High-speed packer stoppage during shift 2.'
      },
      {
        id: 'AUD-106-2',
        status: 'Acknowledged',
        action: 'Work Order Acknowledged',
        timestamp: '2026-10-09 14:45:00',
        user: 'Elena Rostova',
        role: 'Electrical Technician',
        reason: 'Dispatched with robotic controller programmer.'
      },
      {
        id: 'AUD-106-3',
        status: 'In Progress',
        action: 'Servo Inspection Commenced',
        timestamp: '2026-10-09 16:00:00',
        user: 'Elena Rostova',
        role: 'Electrical Technician',
        reason: 'Controller error log extracted. Cable continuity test underway.'
      }
    ]
  }
];
