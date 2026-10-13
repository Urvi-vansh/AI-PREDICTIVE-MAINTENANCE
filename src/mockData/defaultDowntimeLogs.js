/* IndustrialCare - Machine Downtime Tracking Shared Dataset */

export const DEFAULT_DOWNTIME_LOGS = [
  {
    id: 'DWN-2026-01',
    machineId: 'SEC1M8',
    machineName: 'Multi-Spindle Drilling Machine DrillMaster-12',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Mechanical Department',
    reason: 'Unplanned Mechanical Breakdown',
    status: 'Ongoing',
    downtimeHours: 6.5,
    startTime: '2026-10-10 09:30',
    endTime: null,
    notes: 'Spindle bearing failure teardown and rebuild in progress.'
  },
  {
    id: 'DWN-2026-02',
    machineId: 'SEC2M8',
    machineName: 'Rotary Pipe & Tube Profiler TubeCut-360',
    sector: 'Sector 2 (Heavy Machining & Fabrication)',
    department: 'Electrical Department',
    reason: 'Electrical Power Outage / Trip',
    status: 'Ongoing',
    downtimeHours: 3.2,
    startTime: '2026-10-13 10:15',
    endTime: null,
    notes: 'Plasma cutting inverter bus thermal trip.'
  },
  {
    id: 'DWN-2026-03',
    machineId: 'SEC3M8',
    machineName: 'High-Speed Case Packing Cell PackBot-800',
    sector: 'Sector 3 (Assembly & Packaging)',
    department: 'Electrical Department',
    reason: 'Unplanned Mechanical Breakdown',
    status: 'Ongoing',
    downtimeHours: 5.0,
    startTime: '2026-10-09 14:00',
    endTime: null,
    notes: 'Delta packbot robot axis 3 encoder cable communication fault.'
  },
  {
    id: 'DWN-2026-04',
    machineId: 'SEC1M6',
    machineName: 'CNC Lathe & Turning Center TurnPro-80',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Mechanical Department',
    reason: 'Scheduled Preventive Servicing',
    status: 'Resolved',
    downtimeHours: 3.5,
    startTime: '2026-10-11 11:20',
    endTime: '2026-10-11 14:50',
    notes: 'Spindle chuck bearing replacement and laser balance.'
  },
  {
    id: 'DWN-2026-05',
    machineId: 'SEC1M1',
    machineName: 'CNC Vertical Machining Center VMC-1000',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Mechanical Department',
    reason: 'Scheduled Preventive Servicing',
    status: 'Resolved',
    downtimeHours: 5.0,
    startTime: '2026-09-18 08:00',
    endTime: '2026-09-18 13:00',
    notes: 'Quarterly hydraulic fluid flush and filter replacement.'
  }
];
