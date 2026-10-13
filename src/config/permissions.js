/* Centralized Role & Permission Configuration - IndustrialCare */

export const SECTORS = {
  SECTOR_1: 'Sector 1 (Production & Manufacturing)',
  SECTOR_2: 'Sector 2 (Heavy Machining & Fabrication)',
  SECTOR_3: 'Sector 3 (Assembly & Packaging)',
  SECTOR_4: 'Sector 4 (Material Handling & Logistics)',
  MECHANICAL: 'Mechanical Department',
  ELECTRICAL: 'Electrical Department'
};

export const ROLES = {
  ADMIN: 'admin',
  SECTOR_HEAD_1: 'sector_head_1',
  SECTOR_HEAD_2: 'sector_head_2',
  SECTOR_HEAD_3: 'sector_head_3',
  SECTOR_HEAD_4: 'sector_head_4',
  PRODUCTION_HEAD: 'sector_head_1', // alias for backward compatibility
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
      'sectors',
      'departments',
      'alerts',
      'users',
      'reports'
    ],
    allowedCategories: ['Machining', 'Stamping', 'Fluid Systems', 'Material Handling', 'Thermal Systems', 'Robotics', 'Pneumatics', 'Electrical Distribution', 'Assembly', 'Packaging', 'Inspection'],
    defaultTab: 'sectors',
    canAddMachines: true,
    canEditMachines: true,
    canDeactivateMachines: true,
    canCreateWorkOrders: true,
    canUpdateWOStatus: true,
    canManageUsers: true,
    canApproveHeads: true,
    canApproveTechs: false,
    canAccessSettings: true
  },

  [ROLES.SECTOR_HEAD_1]: {
    label: 'Sector Head 1 (Production & Manufacturing)',
    sector: SECTORS.SECTOR_1,
    sectorId: 'sector-1',
    sectorPrefix: 'SEC1',
    permittedTabs: ['sectors', 'departments', 'alerts', 'reports'],
    allowedCategories: ['Machining', 'Stamping', 'Robotics'],
    defaultTab: 'sectors',
    canAddMachines: false,
    canEditMachines: false,
    canDeactivateMachines: false,
    canCreateWorkOrders: true,
    canUpdateWOStatus: true,
    canReviseDeadlines: true,
    canReRequestMaintenance: true,
    canVerifyResolutions: true,
    canManageUsers: false,
    canAccessSettings: false
  },

  [ROLES.SECTOR_HEAD_2]: {
    label: 'Sector Head 2 (Heavy Machining & Fabrication)',
    sector: SECTORS.SECTOR_2,
    sectorId: 'sector-2',
    sectorPrefix: 'SEC2',
    permittedTabs: ['sectors', 'departments', 'alerts', 'reports'],
    allowedCategories: ['Machining', 'Thermal Systems', 'Robotics'],
    defaultTab: 'sectors',
    canAddMachines: false,
    canEditMachines: false,
    canDeactivateMachines: false,
    canCreateWorkOrders: true,
    canUpdateWOStatus: true,
    canReviseDeadlines: true,
    canReRequestMaintenance: true,
    canVerifyResolutions: true,
    canManageUsers: false,
    canAccessSettings: false
  },

  [ROLES.SECTOR_HEAD_3]: {
    label: 'Sector Head 3 (Assembly & Packaging)',
    sector: SECTORS.SECTOR_3,
    sectorId: 'sector-3',
    sectorPrefix: 'SEC3',
    permittedTabs: ['sectors', 'departments', 'alerts', 'reports'],
    allowedCategories: ['Assembly', 'Packaging', 'Inspection', 'Robotics'],
    defaultTab: 'sectors',
    canAddMachines: false,
    canEditMachines: false,
    canDeactivateMachines: false,
    canCreateWorkOrders: true,
    canUpdateWOStatus: true,
    canReviseDeadlines: true,
    canReRequestMaintenance: true,
    canVerifyResolutions: true,
    canManageUsers: false,
    canAccessSettings: false
  },

  [ROLES.SECTOR_HEAD_4]: {
    label: 'Sector Head 4 (Material Handling & Logistics)',
    sector: SECTORS.SECTOR_4,
    sectorId: 'sector-4',
    sectorPrefix: 'SEC4',
    permittedTabs: ['sectors', 'departments', 'alerts', 'reports'],
    allowedCategories: ['Material Handling', 'Robotics'],
    defaultTab: 'sectors',
    canAddMachines: false,
    canEditMachines: false,
    canDeactivateMachines: false,
    canCreateWorkOrders: true,
    canUpdateWOStatus: true,
    canReviseDeadlines: true,
    canReRequestMaintenance: true,
    canVerifyResolutions: true,
    canManageUsers: false,
    canAccessSettings: false
  },

  [ROLES.MECHANICAL_HEAD]: {
    label: 'Mechanical Department Head',
    sector: SECTORS.MECHANICAL,
    department: 'Mechanical Department',
    permittedTabs: ['sectors', 'departments', 'alerts', 'users', 'reports'],
    allowedCategories: ['Machining', 'Stamping', 'Fluid Systems', 'Pneumatics', 'Thermal Systems', 'Material Handling'],
    defaultTab: 'departments',
    canAddMachines: false,
    canEditMachines: false,
    canDeactivateMachines: false,
    canCreateWorkOrders: true,
    canUpdateWOStatus: true,
    canManageUsers: true,
    canApproveTechs: true,
    canAssignTechs: true,
    canManageSpareParts: true,
    canAccessSettings: false
  },

  [ROLES.ELECTRICAL_HEAD]: {
    label: 'Electrical Department Head',
    sector: SECTORS.ELECTRICAL,
    department: 'Electrical Department',
    permittedTabs: ['sectors', 'departments', 'alerts', 'users', 'reports'],
    allowedCategories: ['Electrical Distribution', 'Robotics', 'Pneumatics', 'Thermal Systems'],
    defaultTab: 'departments',
    canAddMachines: false,
    canEditMachines: false,
    canDeactivateMachines: false,
    canCreateWorkOrders: true,
    canUpdateWOStatus: true,
    canManageUsers: true,
    canApproveTechs: true,
    canAssignTechs: true,
    canManageSpareParts: true,
    canAccessSettings: false
  },

  [ROLES.MECHANICAL_TECH]: {
    label: 'Mechanical Technician',
    sector: SECTORS.MECHANICAL,
    department: 'Mechanical Department',
    permittedTabs: ['sectors', 'departments', 'alerts', 'reports'],
    allowedCategories: ['Machining', 'Stamping', 'Fluid Systems', 'Pneumatics', 'Material Handling'],
    defaultTab: 'departments',
    assignedTechName: 'Marcus Vance',
    onlyAssignedWorkOrders: true,
    canAddMachines: false,
    canCreateWorkOrders: false,
    canUpdateWOStatus: true,
    canAcknowledgeWork: true,
    canUpdateProgress: true,
    canSubmitResolution: true,
    canManageUsers: false,
    canAccessSettings: false
  },

  [ROLES.ELECTRICAL_TECH]: {
    label: 'Electrical Technician',
    sector: SECTORS.ELECTRICAL,
    department: 'Electrical Department',
    permittedTabs: ['sectors', 'departments', 'alerts', 'reports'],
    allowedCategories: ['Electrical Distribution', 'Robotics', 'Pneumatics'],
    defaultTab: 'departments',
    assignedTechName: 'Elena Rostova',
    onlyAssignedWorkOrders: true,
    canAddMachines: false,
    canCreateWorkOrders: false,
    canUpdateWOStatus: true,
    canAcknowledgeWork: true,
    canUpdateProgress: true,
    canSubmitResolution: true,
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
 * Check if a given role is any Sector Head
 */
export function isSectorHeadRole(role) {
  return [
    ROLES.SECTOR_HEAD_1,
    ROLES.SECTOR_HEAD_2,
    ROLES.SECTOR_HEAD_3,
    ROLES.SECTOR_HEAD_4,
    'production_head'
  ].includes(role);
}

/**
 * Determine the machine prefix associated with a user
 */
export function getUserSectorPrefix(user) {
  if (!user) return null;
  const role = user.role;
  if (role === ROLES.SECTOR_HEAD_1 || role === 'production_head') return 'SEC1';
  if (role === ROLES.SECTOR_HEAD_2) return 'SEC2';
  if (role === ROLES.SECTOR_HEAD_3) return 'SEC3';
  if (role === ROLES.SECTOR_HEAD_4) return 'SEC4';

  if (user.sector) {
    if (user.sector.includes('Sector 1')) return 'SEC1';
    if (user.sector.includes('Sector 2')) return 'SEC2';
    if (user.sector.includes('Sector 3')) return 'SEC3';
    if (user.sector.includes('Sector 4')) return 'SEC4';
  }
  return null;
}

/**
 * Check if a sector is allowed for a user (strict boundary enforcement)
 */
export function isSectorAllowedForUser(sectorIdOrName, user) {
  if (!user || user.role === ROLES.ADMIN) return true;

  const prefix = getUserSectorPrefix(user);
  if (prefix) {
    // Sector Head is strictly locked to their sector
    if (typeof sectorIdOrName === 'string') {
      const s = sectorIdOrName.toLowerCase();
      if (prefix === 'SEC1') return s.includes('sector 1') || s.includes('sec1') || s.includes('sector-1');
      if (prefix === 'SEC2') return s.includes('sector 2') || s.includes('sec2') || s.includes('sector-2');
      if (prefix === 'SEC3') return s.includes('sector 3') || s.includes('sec3') || s.includes('sector-3');
      if (prefix === 'SEC4') return s.includes('sector 4') || s.includes('sec4') || s.includes('sector-4');
    }
    return false;
  }

  // Department Heads & Technicians can view cross-sector machinery belonging to their discipline
  return true;
}

/**
 * Check if an asset is allowed for a user (strict data-level security guard)
 */
export function isAssetAllowedForUser(asset, user) {
  if (!asset || !user) return false;
  if (user.role === ROLES.ADMIN) return true;

  const prefix = getUserSectorPrefix(user);
  if (prefix) {
    // Sector Head can view ONLY their sector's machines
    if (asset.id && asset.id.startsWith(prefix)) return true;
    if (asset.sector) {
      if (prefix === 'SEC1' && asset.sector.includes('Sector 1')) return true;
      if (prefix === 'SEC2' && asset.sector.includes('Sector 2')) return true;
      if (prefix === 'SEC3' && asset.sector.includes('Sector 3')) return true;
      if (prefix === 'SEC4' && asset.sector.includes('Sector 4')) return true;
    }
    return false;
  }

  // Mechanical discipline
  if (user.role === ROLES.MECHANICAL_HEAD || user.role === ROLES.MECHANICAL_TECH) {
    const isMechDept = asset.department?.toLowerCase().includes('machin') ||
      asset.department?.toLowerCase().includes('stamp') ||
      asset.department?.toLowerCase().includes('mech') ||
      asset.department?.toLowerCase().includes('fabricat') ||
      asset.category === 'Machining' ||
      asset.category === 'Stamping';
    return isMechDept || asset.assignedTech?.toLowerCase().includes('marcus');
  }

  // Electrical discipline
  if (user.role === ROLES.ELECTRICAL_HEAD || user.role === ROLES.ELECTRICAL_TECH) {
    const isElecDept = asset.department?.toLowerCase().includes('electr') ||
      asset.department?.toLowerCase().includes('robot') ||
      asset.category === 'Electrical Distribution' ||
      asset.category === 'Robotics' ||
      asset.category === 'Thermal Systems';
    return isElecDept || asset.assignedTech?.toLowerCase().includes('elena');
  }

  return true;
}

/**
 * Filter machinery asset list according to role's authorized equipment clearance
 */
export function filterAssetsByRole(assets, role, user = null) {
  if (!assets || !Array.isArray(assets)) return [];
  if (!role || role === ROLES.ADMIN) return assets;

  if (user) {
    return assets.filter(asset => isAssetAllowedForUser(asset, user));
  }

  const perm = ROLE_PERMISSIONS[role];
  if (!perm) return [];
  return assets.filter(asset => perm.allowedCategories.includes(asset.category));
}

/**
 * Filter alerts by role permissions (Sector heads see ONLY their sector's alerts)
 */
export function filterAlertsByRole(alerts, user) {
  if (!alerts || !Array.isArray(alerts)) return [];
  if (!user || user.role === ROLES.ADMIN) return alerts;

  const prefix = getUserSectorPrefix(user);
  if (prefix) {
    return alerts.filter(a => {
      if (a.machineId && a.machineId.startsWith(prefix)) return true;
      if (a.sector) {
        if (prefix === 'SEC1' && a.sector.includes('Sector 1')) return true;
        if (prefix === 'SEC2' && a.sector.includes('Sector 2')) return true;
        if (prefix === 'SEC3' && a.sector.includes('Sector 3')) return true;
        if (prefix === 'SEC4' && a.sector.includes('Sector 4')) return true;
      }
      return false;
    });
  }

  if (user.role === ROLES.MECHANICAL_HEAD || user.role === ROLES.MECHANICAL_TECH) {
    return alerts.filter(a =>
      a.department?.toLowerCase().includes('machin') ||
      a.department?.toLowerCase().includes('stamp') ||
      a.department?.toLowerCase().includes('mech') ||
      a.category === 'Mechanical' ||
      a.category === 'Machining'
    );
  }

  if (user.role === ROLES.ELECTRICAL_HEAD || user.role === ROLES.ELECTRICAL_TECH) {
    return alerts.filter(a =>
      a.department?.toLowerCase().includes('electr') ||
      a.department?.toLowerCase().includes('robot') ||
      a.category === 'Electrical' ||
      a.category === 'Power'
    );
  }

  return alerts;
}

/**
 * Filter work orders based on role permissions:
 * - Admin sees all
 * - Sector Heads see work orders for their sector
 * - Department Heads see work orders for their department
 * - Technicians see only work orders assigned to them
 */
export function filterWorkOrdersByRole(workOrders, user) {
  if (!workOrders || !Array.isArray(workOrders)) return [];
  if (!user || user.role === ROLES.ADMIN) return workOrders;

  const prefix = getUserSectorPrefix(user);
  if (prefix) {
    return workOrders.filter(wo => {
      if (wo.assetId && wo.assetId.startsWith(prefix)) return true;
      if (wo.sector) {
        if (prefix === 'SEC1' && wo.sector.includes('Sector 1')) return true;
        if (prefix === 'SEC2' && wo.sector.includes('Sector 2')) return true;
        if (prefix === 'SEC3' && wo.sector.includes('Sector 3')) return true;
        if (prefix === 'SEC4' && wo.sector.includes('Sector 4')) return true;
      }
      return false;
    });
  }

  if (user.role === ROLES.MECHANICAL_HEAD) {
    return workOrders.filter(wo =>
      wo.assignedDepartment?.toLowerCase().includes('mech') ||
      wo.department?.toLowerCase().includes('mech') ||
      wo.department?.toLowerCase().includes('machin') ||
      wo.department?.toLowerCase().includes('stamp')
    );
  }

  if (user.role === ROLES.ELECTRICAL_HEAD) {
    return workOrders.filter(wo =>
      wo.assignedDepartment?.toLowerCase().includes('electr') ||
      wo.department?.toLowerCase().includes('electr') ||
      wo.department?.toLowerCase().includes('robot')
    );
  }

  if (user.role === ROLES.MECHANICAL_TECH || user.role === ROLES.ELECTRICAL_TECH) {
    const techName = user.name?.toLowerCase() || '';
    const assignedTag = ROLE_PERMISSIONS[user.role]?.assignedTechName?.toLowerCase() || '';
    return workOrders.filter(wo => {
      const assigned = (wo.assignedTech || wo.assignedTo || '').toLowerCase();
      if (techName && assigned.includes(techName)) return true;
      if (assignedTag && assigned.includes(assignedTag)) return true;
      // also show unassigned in their department
      if (user.role === ROLES.MECHANICAL_TECH && wo.assignedDepartment?.includes('Mechanical')) return true;
      if (user.role === ROLES.ELECTRICAL_TECH && wo.assignedDepartment?.includes('Electrical')) return true;
      return false;
    });
  }

  return workOrders;
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
 * - Sector heads (1, 2, 3, 4) & Department heads -> System Administrator
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
export function canUserApproveTarget(currentUser, targetUser) {
  if (!currentUser || !targetUser) return false;
  const currentRole = typeof currentUser === 'string' ? currentUser : currentUser.role;

  // Mechanical Department Head approves ONLY Mechanical Technicians
  if (currentRole === ROLES.MECHANICAL_HEAD) {
    return targetUser.role === ROLES.MECHANICAL_TECH;
  }

  // Electrical Department Head approves ONLY Electrical Technicians
  if (currentRole === ROLES.ELECTRICAL_HEAD) {
    return targetUser.role === ROLES.ELECTRICAL_TECH;
  }

  // System Administrator approves ONLY Sector Heads & Department Heads (NOT technicians)
  if (currentRole === ROLES.ADMIN) {
    return [
      ROLES.SECTOR_HEAD_1,
      ROLES.SECTOR_HEAD_2,
      ROLES.SECTOR_HEAD_3,
      ROLES.SECTOR_HEAD_4,
      'production_head',
      ROLES.MECHANICAL_HEAD,
      ROLES.ELECTRICAL_HEAD
    ].includes(targetUser.role);
  }

  return false;
}
