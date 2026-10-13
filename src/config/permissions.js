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

export const DEMO_ACCOUNTS = [];

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    label: 'System Administrator',
    sector: 'All Sectors',
    permittedTabs: [
      'dashboard',
      'sectors',
      'assets',
      'alerts',
      'users',
      'analytics',
      'notifications',
      'settings'
    ],
    allowedCategories: ['Machining', 'Stamping', 'Fluid Systems', 'Material Handling', 'Thermal Systems', 'Robotics', 'Pneumatics', 'Electrical Distribution'],
    defaultTab: 'dashboard',
    canAddMachines: true,
    canCreateWorkOrders: false,
    canUpdateWOStatus: false,
    canManageUsers: true,
    canAccessSettings: true
  },
  [ROLES.PRODUCTION_HEAD]: {
    label: 'Production Sector Head',
    sector: SECTORS.PRODUCTION,
    permittedTabs: ['dashboard', 'sectors', 'assets', 'alerts', 'work-orders', 'analytics', 'notifications'],
    allowedCategories: ['Machining', 'Stamping', 'Material Handling', 'Robotics', 'Fluid Systems', 'Thermal Systems', 'Pneumatics', 'Electrical Distribution'],
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
    permittedTabs: ['dashboard', 'sectors', 'assets', 'alerts', 'work-orders', 'users', 'spare-parts', 'analytics', 'notifications'],
    allowedCategories: ['Machining', 'Stamping', 'Fluid Systems', 'Pneumatics', 'Thermal Systems', 'Material Handling'],
    defaultTab: 'dashboard',
    canAddMachines: true,
    canCreateWorkOrders: true,
    canUpdateWOStatus: true,
    canManageUsers: true,
    canAccessSettings: false
  },
  [ROLES.ELECTRICAL_HEAD]: {
    label: 'Electrical Sector Head',
    sector: SECTORS.ELECTRICAL,
    permittedTabs: ['dashboard', 'sectors', 'assets', 'alerts', 'work-orders', 'users', 'spare-parts', 'analytics', 'notifications'],
    allowedCategories: ['Electrical Distribution', 'Robotics', 'Pneumatics', 'Thermal Systems'],
    defaultTab: 'dashboard',
    canAddMachines: true,
    canCreateWorkOrders: true,
    canUpdateWOStatus: true,
    canManageUsers: true,
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
export function filterAssetsByRole(assets, role, user = null) {
  const perm = ROLE_PERMISSIONS[role];
  if (!perm) return [];
  if (role === ROLES.ADMIN) return assets;
  if (user && user.sector && user.sector.startsWith('Sector')) {
    const secPrefix = user.sector.split(' ')[0] + ' ' + user.sector.split(' ')[1];
    return assets.filter(
      (asset) =>
        asset.sector === user.sector ||
        (asset.sector && asset.sector.startsWith(secPrefix))
    );
  }
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

/**
 * Determine required approver hierarchy based on applicant's requested role:
 * - Mechanical technician -> Mechanical Department Head
 * - Electrical technician -> Electrical Department Head
 * - Sector heads & Department heads -> System Administrator
 */
export function getRequiredApprover(role) {
  if (role === ROLES.MECHANICAL_TECH) {
    return {
      role: ROLES.MECHANICAL_HEAD,
      title: 'Mechanical Department Head',
      shortTitle: 'Mechanical Head',
      department: 'Mechanical Department'
    };
  }
  if (role === ROLES.ELECTRICAL_TECH) {
    return {
      role: ROLES.ELECTRICAL_HEAD,
      title: 'Electrical Department Head',
      shortTitle: 'Electrical Head',
      department: 'Electrical Department'
    };
  }
  return {
    role: ROLES.ADMIN,
    title: 'System Administrator',
    shortTitle: 'Admin',
    department: 'Plant Administration'
  };
}

/**
 * Check if the active viewer has permission to approve the target user
 */
export function canUserApproveTarget(currentUserRole, targetUser) {
  if (!currentUserRole || !targetUser) return false;
  // Mechanical Department Head approves ONLY Mechanical Technicians
  if (currentUserRole === ROLES.MECHANICAL_HEAD) {
    return targetUser.role === ROLES.MECHANICAL_TECH;
  }
  // Electrical Department Head approves ONLY Electrical Technicians
  if (currentUserRole === ROLES.ELECTRICAL_HEAD) {
    return targetUser.role === ROLES.ELECTRICAL_TECH;
  }
  // System Administrator approves ONLY Sector Heads & Department Heads (NOT technicians)
  if (currentUserRole === ROLES.ADMIN) {
    return [
      ROLES.PRODUCTION_HEAD,
      ROLES.MECHANICAL_HEAD,
      ROLES.ELECTRICAL_HEAD
    ].includes(targetUser.role);
  }
  return false;
}

