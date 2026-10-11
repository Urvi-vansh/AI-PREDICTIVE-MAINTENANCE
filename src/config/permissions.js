/* Centralized Role & Permission Configuration - IndustrialCare */

export const SECTORS = {
  PRODUCTION: 'Production & Manufacturing',
  MECHANICAL: 'Mechanical Department',
  ELECTRICAL: 'Electrical Department'
};

export const ROLES = {
  ADMIN: 'admin',
  PRODUCTION_HEAD: 'production_head',
  MECHANICAL_HEAD: 'mechanical_head',
  ELECTRICAL_HEAD: 'electrical_head',
  MECHANICAL_TECH: 'mechanical_tech',
  ELECTRICAL_TECH: 'electrical_tech'
};

export const DEMO_ACCOUNTS = [
  {
    role: ROLES.ADMIN,
    name: 'Alex Vance',
    title: 'System Administrator',
    sector: 'All Plant Sectors',
    email: 'admin@industrialcare.io',
    avatar: 'AV',
    description: 'Full administrative access across all sectors, machines, failure alerts, work orders, analytics, user management, spare parts, and settings.'
  },
  {
    role: ROLES.PRODUCTION_HEAD,
    name: 'Robert Chen',
    title: 'Production Sector Head',
    sector: SECTORS.PRODUCTION,
    email: 'prod.head@industrialcare.io',
    avatar: 'RC',
    description: 'Manages Production & Manufacturing sector lines, machining equipment, failure alerts, and sector work orders.'
  },
  {
    role: ROLES.MECHANICAL_HEAD,
    name: 'David Miller',
    title: 'Mechanical Sector Head',
    sector: SECTORS.MECHANICAL,
    email: 'mech.head@industrialcare.io',
    avatar: 'DM',
    description: 'Oversees Mechanical Department machinery (Presses, Pumps, Hydraulics, Pneumatics) and mechanical tasks.'
  },
  {
    role: ROLES.ELECTRICAL_HEAD,
    name: 'Sarah Jenkins',
    title: 'Electrical Sector Head',
    sector: SECTORS.ELECTRICAL,
    email: 'elec.head@industrialcare.io',
    avatar: 'SJ',
    description: 'Oversees Electrical Department assets (Transformers, Robotics, Control Panels, Power Grids) and electrical tasks.'
  },
  {
    role: ROLES.MECHANICAL_TECH,
    name: 'Marcus Vance',
    title: 'Mechanical Technician',
    sector: SECTORS.MECHANICAL,
    email: 'mech.tech@industrialcare.io',
    avatar: 'MV',
    description: 'Field Technician assigned to mechanical equipment maintenance, inspections, and assigned tickets.'
  },
  {
    role: ROLES.ELECTRICAL_TECH,
    name: 'Elena Rostova',
    title: 'Electrical Technician',
    sector: SECTORS.ELECTRICAL,
    email: 'elec.tech@industrialcare.io',
    avatar: 'ER',
    description: 'Field Technician assigned to electrical infrastructure, robotic arms, sensor diagnostics, and assigned tickets.'
  }
];

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    label: 'System Administrator',
    sector: 'All Sectors',
    permittedTabs: [
      'dashboard',
      'sectors',
      'assets',
      'alerts',
      'work-orders',
      'users',
      'spare-parts',
      'analytics',
      'notifications',
      'settings'
    ],
    allowedCategories: ['Machining', 'Stamping', 'Fluid Systems', 'Material Handling', 'Thermal Systems', 'Robotics', 'Pneumatics', 'Electrical Distribution'],
    defaultTab: 'dashboard',
    canAddMachines: true,
    canCreateWorkOrders: true,
    canUpdateWOStatus: true,
    canManageUsers: true,
    canAccessSettings: true
  },
  [ROLES.PRODUCTION_HEAD]: {
    label: 'Production Sector Head',
    sector: SECTORS.PRODUCTION,
    permittedTabs: ['dashboard', 'sectors', 'assets', 'alerts', 'work-orders', 'analytics', 'notifications'],
    allowedCategories: ['Machining', 'Stamping', 'Material Handling', 'Robotics'],
    defaultTab: 'dashboard',
    canAddMachines: true,
    canCreateWorkOrders: true,
    canUpdateWOStatus: true,
    canManageUsers: false,
    canAccessSettings: false
  },
  [ROLES.MECHANICAL_HEAD]: {
    label: 'Mechanical Sector Head',
    sector: SECTORS.MECHANICAL,
    permittedTabs: ['dashboard', 'sectors', 'assets', 'alerts', 'work-orders', 'spare-parts', 'analytics', 'notifications'],
    allowedCategories: ['Machining', 'Stamping', 'Fluid Systems', 'Pneumatics', 'Thermal Systems', 'Material Handling'],
    defaultTab: 'dashboard',
    canAddMachines: true,
    canCreateWorkOrders: true,
    canUpdateWOStatus: true,
    canManageUsers: false,
    canAccessSettings: false
  },
  [ROLES.ELECTRICAL_HEAD]: {
    label: 'Electrical Sector Head',
    sector: SECTORS.ELECTRICAL,
    permittedTabs: ['dashboard', 'sectors', 'assets', 'alerts', 'work-orders', 'spare-parts', 'analytics', 'notifications'],
    allowedCategories: ['Electrical Distribution', 'Robotics', 'Pneumatics', 'Thermal Systems'],
    defaultTab: 'dashboard',
    canAddMachines: true,
    canCreateWorkOrders: true,
    canUpdateWOStatus: true,
    canManageUsers: false,
    canAccessSettings: false
  },
  [ROLES.MECHANICAL_TECH]: {
    label: 'Mechanical Technician',
    sector: SECTORS.MECHANICAL,
    permittedTabs: ['dashboard', 'work-orders', 'assets', 'alerts', 'spare-parts', 'notifications'],
    allowedCategories: ['Machining', 'Stamping', 'Fluid Systems', 'Pneumatics', 'Material Handling'],
    defaultTab: 'work-orders',
    assignedTechName: 'Marcus Vance',
    onlyAssignedWorkOrders: true,
    canAddMachines: false,
    canCreateWorkOrders: false,
    canUpdateWOStatus: true,
    canManageUsers: false,
    canAccessSettings: false
  },
  [ROLES.ELECTRICAL_TECH]: {
    label: 'Electrical Technician',
    sector: SECTORS.ELECTRICAL,
    permittedTabs: ['dashboard', 'work-orders', 'assets', 'alerts', 'spare-parts', 'notifications'],
    allowedCategories: ['Electrical Distribution', 'Robotics', 'Pneumatics'],
    defaultTab: 'work-orders',
    assignedTechName: 'Elena Rostova',
    onlyAssignedWorkOrders: true,
    canAddMachines: false,
    canCreateWorkOrders: false,
    canUpdateWOStatus: true,
    canManageUsers: false,
    canAccessSettings: false
  }
};

/**
 * Check if a given user role is permitted to access a specific tab navigation ID
 */
export function hasTabPermission(role, tabId) {
  const perm = ROLE_PERMISSIONS[role];
  if (!perm) return false;
  return perm.permittedTabs.includes(tabId);
}

/**
 * Filter machinery asset list according to role's authorized equipment categories
 */
export function filterAssetsByRole(assets, role) {
  const perm = ROLE_PERMISSIONS[role];
  if (!perm) return [];
  if (role === ROLES.ADMIN) return assets;
  return assets.filter(asset => perm.allowedCategories.includes(asset.category));
}

/**
 * Filter work orders based on role permissions:
 * - Admin sees all
 * - Sector Heads see work orders matching their sector equipment categories
 * - Technicians see only work orders assigned to them
 */
export function filterWorkOrdersByRole(workOrders, role, assets) {
  const perm = ROLE_PERMISSIONS[role];
  if (!perm) return [];

  if (role === ROLES.ADMIN) {
    return workOrders;
  }

  if (perm.onlyAssignedWorkOrders && perm.assignedTechName) {
    return workOrders.filter(wo =>
      wo.assignedTo.toLowerCase().includes(perm.assignedTechName.toLowerCase())
    );
  }

  const allowedAssetIds = assets
    .filter(asset => perm.allowedCategories.includes(asset.category))
    .map(asset => asset.id);

  return workOrders.filter(wo => allowedAssetIds.includes(wo.assetId));
}

/**
 * Filter IoT sensors by role permissions
 */
export function filterSensorsByRole(sensors, role, assets) {
  const perm = ROLE_PERMISSIONS[role];
  if (!perm) return [];
  if (role === ROLES.ADMIN) return sensors;

  const allowedAssetNames = assets
    .filter(asset => perm.allowedCategories.includes(asset.category))
    .map(asset => asset.name.toLowerCase());

  return sensors.filter(s =>
    allowedAssetNames.some(name => s.assetName.toLowerCase().includes(name) || name.includes(s.assetName.toLowerCase()))
  );
}
