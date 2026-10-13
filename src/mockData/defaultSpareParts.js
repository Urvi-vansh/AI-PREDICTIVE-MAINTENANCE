/* IndustrialCare - Spare Parts Inventory Shared Dataset */

export const DEFAULT_SPARE_PARTS = [
  {
    id: 'PRT-6205',
    name: 'Angular Contact Bearing Set 6205-2RS',
    category: 'Bearings',
    department: 'Mechanical Department',
    compatibleMachine: 'SEC1M8 (DrillMaster-12), SEC1M1 (VMC-1000)',
    stockQuantity: 12,
    minThreshold: 5,
    unitCost: 145,
    location: 'Warehouse Bay B-12',
    status: 'In Stock'
  },
  {
    id: 'PRT-7010',
    name: 'Hybrid Ceramic Spindle Bearing 7010-C-TPA',
    category: 'Bearings',
    department: 'Mechanical Department',
    compatibleMachine: 'SEC1M6 (TurnPro-80), SEC2M5 (Gantry-M8)',
    stockQuantity: 4,
    minThreshold: 6,
    unitCost: 480,
    location: 'Cleanroom Cabinet C-02',
    status: 'Low Stock'
  },
  {
    id: 'PRT-TC100',
    name: 'Tool Changer Claw Return Spring Set TC-100',
    category: 'Tooling',
    department: 'Mechanical Department',
    compatibleMachine: 'SEC1M1 (VMC-1000), SEC2M1 (Milling Cell)',
    stockQuantity: 28,
    minThreshold: 10,
    unitCost: 35,
    location: 'Warehouse Bay A-04',
    status: 'In Stock'
  },
  {
    id: 'PRT-ENC10',
    name: 'M12 Shielded Robotic Encoder Cable 10M',
    category: 'Robotics',
    department: 'Electrical Department',
    compatibleMachine: 'SEC3M8 (PackBot-800), SEC3M4 (Palletizer)',
    stockQuantity: 3,
    minThreshold: 5,
    unitCost: 165,
    location: 'Electrical Stores Shelf E-09',
    status: 'Low Stock'
  },
  {
    id: 'PRT-HYD20',
    name: 'Microglass Hydraulic Return Filter Cartridge HF-200',
    category: 'Hydraulics',
    department: 'Mechanical Department',
    compatibleMachine: 'SEC1M1, SEC1M8, SEC2M3',
    stockQuantity: 18,
    minThreshold: 8,
    unitCost: 85,
    location: 'Fluid Systems Bay F-01',
    status: 'In Stock'
  },
  {
    id: 'PRT-IGBT45',
    name: 'High-Power Dual IGBT Inverter Module 1200V/150A',
    category: 'Electrical Distribution',
    department: 'Electrical Department',
    compatibleMachine: 'SEC2M8 (TubeCut-360), SEC2M2 (Plasma Table)',
    stockQuantity: 5,
    minThreshold: 4,
    unitCost: 340,
    location: 'Electrical Stores Shelf E-03',
    status: 'In Stock'
  }
];
