import React, { useState, useEffect } from 'react';
import './styles/index.css';
import './styles/components.css';

import {
  ROLES,
  ROLE_PERMISSIONS,
  hasTabPermission,
  filterAssetsByRole,
  filterWorkOrdersByRole,
  filterAlertsByRole,
  filterSensorsByRole,
  getRequiredApprover,
  canUserApproveTarget,
  isSectorHeadRole,
  getUserSectorPrefix,
  isAssetAllowedForUser,
  isSectorAllowedForUser
} from './config/permissions';

import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { AssetDetailsModal } from './components/common/AssetDetailsModal';
import { WorkOrderFormModal } from './components/forms/WorkOrderFormModal';
import { AddMachineModal } from './components/forms/AddMachineModal';
import { UnauthorizedAccess } from './components/common/UnauthorizedAccess';
import { DEFAULT_SECTOR_MACHINES } from './mockData/defaultMachines';
import { DEFAULT_MAINTENANCE_WORK_ORDERS } from './mockData/defaultWorkOrders';
import { DEFAULT_ALERTS } from './mockData/defaultAlerts';
import { DEFAULT_DOWNTIME_LOGS } from './mockData/defaultDowntimeLogs';
import { DEFAULT_SPARE_PARTS } from './mockData/defaultSpareParts';
import { DEFAULT_INITIAL_USERS } from './mockData/defaultUsers';

import { LoginView } from './components/views/LoginView';
import { OverviewDashboard } from './components/views/OverviewDashboard';
import { SectorHeadDashboard } from './components/views/SectorHeadDashboard';
import { TechnicianDashboard } from './components/views/TechnicianDashboard';

import { SectorsView } from './components/views/SectorsView';
import { DepartmentsView } from './components/views/DepartmentsView';
import { AlertsView } from './components/views/AlertsView';
import { UsersManagementView } from './components/views/UsersManagementView';
import { ReportsView } from './components/views/ReportsView';
import { EquipmentFleetView } from './components/views/EquipmentFleetView';
import { WorkOrdersView } from './components/views/WorkOrdersView';
import { SparePartsView } from './components/views/SparePartsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { NotificationsView } from './components/views/NotificationsView';
import { SettingsView } from './components/views/SettingsView';
import { PendingApprovalView } from './components/views/PendingApprovalView';

export default function App() {
  // Auth state - default to logged out (Sign In page on initial load)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Navigation state - default landing tab is Sectors
  const [activeTab, setActiveTab] = useState('sectors');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sectorFilterOverride, setSectorFilterOverride] = useState('All');
  const [selectedSectorId, setSelectedSectorId] = useState(null);

  // Helper to compute pending approval count tailored to active user's approval authority
  const getPendingApprovalCountForUser = (currentUser) => {
    if (!currentUser) return 0;
    if (currentUser.role === ROLES.ADMIN) {
      // Admin ONLY authorizes Sector Heads and Department Heads (technicians route only to department heads)
      return usersList.filter(
        (u) =>
          (u.status === 'Pending Approval' || (!u.isApproved && u.role !== ROLES.ADMIN)) &&
          [
            ROLES.SECTOR_HEAD_1,
            ROLES.SECTOR_HEAD_2,
            ROLES.SECTOR_HEAD_3,
            ROLES.SECTOR_HEAD_4,
            ROLES.PRODUCTION_HEAD,
            ROLES.MECHANICAL_HEAD,
            ROLES.ELECTRICAL_HEAD
          ].includes(u.role)
      ).length;
    }
    if (currentUser.role === ROLES.MECHANICAL_HEAD) {
      return usersList.filter((u) => (u.status === 'Pending Approval' || !u.isApproved) && u.role === ROLES.MECHANICAL_TECH).length;
    }
    if (currentUser.role === ROLES.ELECTRICAL_HEAD) {
      return usersList.filter((u) => (u.status === 'Pending Approval' || !u.isApproved) && u.role === ROLES.ELECTRICAL_TECH).length;
    }
    return 0;
  };

  // Helper for localStorage persistence
  const loadStored = (key, fallback) => {
    try {
      const saved = localStorage.getItem(`industrialcare_${key}`);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  const saveStored = (key, data) => {
    try {
      localStorage.setItem(`industrialcare_${key}`, JSON.stringify(data));
    } catch {}
  };

  const getInitialUsers = () => {
    try {
      const saved = localStorage.getItem('industrialcare_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 5) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_INITIAL_USERS;
  };

  const getInitialAssets = () => {
    // Purge obsolete local storage caches that contained static/fake operational telemetry
    try {
      localStorage.removeItem('industrialcare_assets');
      localStorage.removeItem('industrialcare_assets_v2');
      localStorage.removeItem('industrialcare_assets_v3');
      localStorage.removeItem('industrialcare_assets_v4');
    } catch {}

    try {
      const saved = localStorage.getItem('industrialcare_assets_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.length >= 40 &&
          parsed.some(a => a.id === 'SEC1M1') &&
          parsed.some(a => a.id === 'SEC2M1') &&
          parsed.some(a => a.id === 'SEC3M1') &&
          parsed.some(a => a.id === 'SEC4M1')
        ) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_SECTOR_MACHINES;
  };

  const getInitialWorkOrders = () => {
    try {
      const saved = localStorage.getItem('industrialcare_work_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed.some(wo => wo.id === 'REQ-2026-101')) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_MAINTENANCE_WORK_ORDERS;
  };

  const getInitialAlerts = () => {
    try {
      const saved = localStorage.getItem('industrialcare_alerts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_ALERTS;
  };

  const getInitialSpareParts = () => {
    try {
      const saved = localStorage.getItem('industrialcare_spare_parts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_SPARE_PARTS;
  };

  const getInitialDowntimeLogs = () => {
    try {
      const saved = localStorage.getItem('industrialcare_downtime_logs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_DOWNTIME_LOGS;
  };

  // Operational Data States (persisted in localStorage, default 10 machines per sector)
  const [rawAssets, setRawAssets] = useState(getInitialAssets);
  const [rawWorkOrders, setRawWorkOrders] = useState(getInitialWorkOrders);
  const [rawSensors, setRawSensors] = useState(() => loadStored('sensors', []));
  const [rawAlerts, setRawAlerts] = useState(getInitialAlerts);
  const [rawSpareParts, setRawSpareParts] = useState(getInitialSpareParts);
  const [rawPreventiveSchedules, setRawPreventiveSchedules] = useState(() => loadStored('preventive_schedules', []));
  const [rawDowntimeLogs, setRawDowntimeLogs] = useState(getInitialDowntimeLogs);
  const [notifications, setNotifications] = useState(() => loadStored('notifications', []));
  const [usersList, setUsersList] = useState(getInitialUsers);

  // Synchronous users state and localStorage updater
  const updateUsersList = (updater) => {
    setUsersList((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveStored('users', next);
      return next;
    });
  };

  useEffect(() => {
    try { localStorage.setItem('industrialcare_assets_v5', JSON.stringify(rawAssets)); } catch {}
  }, [rawAssets]);
  useEffect(() => {
    try { localStorage.setItem('industrialcare_work_orders', JSON.stringify(rawWorkOrders)); } catch {}
  }, [rawWorkOrders]);
  useEffect(() => {
    try { localStorage.setItem('industrialcare_sensors', JSON.stringify(rawSensors)); } catch {}
  }, [rawSensors]);
  useEffect(() => {
    try { localStorage.setItem('industrialcare_alerts', JSON.stringify(rawAlerts)); } catch {}
  }, [rawAlerts]);
  useEffect(() => {
    try { localStorage.setItem('industrialcare_spare_parts', JSON.stringify(rawSpareParts)); } catch {}
  }, [rawSpareParts]);
  useEffect(() => {
    try { localStorage.setItem('industrialcare_preventive_schedules', JSON.stringify(rawPreventiveSchedules)); } catch {}
  }, [rawPreventiveSchedules]);
  useEffect(() => {
    try { localStorage.setItem('industrialcare_downtime_logs', JSON.stringify(rawDowntimeLogs)); } catch {}
  }, [rawDowntimeLogs]);
  useEffect(() => {
    try { localStorage.setItem('industrialcare_notifications', JSON.stringify(notifications)); } catch {}
  }, [notifications]);
  useEffect(() => {
    saveStored('users', usersList);
  }, [usersList]);

  // Comprehensive cross-tab synchronization via storage event listener
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (!e.newValue) return;
      try {
        const parsed = JSON.parse(e.newValue);
        if (e.key === 'industrialcare_assets_v5' && Array.isArray(parsed)) {
          setRawAssets(parsed);
        } else if (e.key === 'industrialcare_work_orders' && Array.isArray(parsed)) {
          setRawWorkOrders(parsed);
        } else if (e.key === 'industrialcare_alerts' && Array.isArray(parsed)) {
          setRawAlerts(parsed);
        } else if (e.key === 'industrialcare_users' && Array.isArray(parsed)) {
          setUsersList(parsed);
        } else if (e.key === 'industrialcare_spare_parts' && Array.isArray(parsed)) {
          setRawSpareParts(parsed);
        } else if (e.key === 'industrialcare_downtime_logs' && Array.isArray(parsed)) {
          setRawDowntimeLogs(parsed);
        } else if (e.key === 'industrialcare_preventive_schedules' && Array.isArray(parsed)) {
          setRawPreventiveSchedules(parsed);
        } else if (e.key === 'industrialcare_notifications' && Array.isArray(parsed)) {
          setNotifications(parsed);
        }
      } catch {}
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Modals state
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isWorkOrderModalOpen, setIsWorkOrderModalOpen] = useState(false);
  const [isAddMachineModalOpen, setIsAddMachineModalOpen] = useState(false);

  // Compute Role-Filtered Data (Strict RBAC Data-Level Boundary Enforcement)
  const roleAssets = user ? filterAssetsByRole(rawAssets, user.role, user) : [];
  const roleWorkOrders = user ? filterWorkOrdersByRole(rawWorkOrders, user) : [];
  const roleAlerts = user ? filterAlertsByRole(rawAlerts, user) : [];
  const roleSensors = user ? filterSensorsByRole(rawSensors, user.role, rawAssets) : [];

  // Security-Enforced Asset Selection Handler: prevents cross-sector access
  const handleSelectAsset = (asset) => {
    if (!asset) return;
    if (user && !isAssetAllowedForUser(asset, user)) {
      setNotifications((prev) => [
        {
          id: `NTF-${Date.now()}`,
          title: 'Security Boundary Violation: Sector Clearance Denied',
          desc: `User ${user?.name} (${user?.title}) attempted to access equipment ${asset.id} in ${asset.sector} without clearance.`,
          time: 'Just now',
          type: 'critical',
          read: false
        },
        ...prev
      ]);
      alert(`Security Access Restriction: You are authenticated as ${user?.title || user?.name} (${user?.sector}). You do not have clearance to inspect machinery or telemetry in ${asset.sector}.`);
      return;
    }
    setSelectedAsset(asset);
  };

  // Auth Handlers
  const handleLogin = (userInfo) => {
    // If logging in as System Administrator, access is granted immediately
    if (userInfo.role === ROLES.ADMIN) {
      const adminUser = {
        ...userInfo,
        status: 'Active',
        isApproved: true
      };
      // Always pull latest users list from storage so any pending requests are refreshed
      const latestUsers = getInitialUsers();
      setUsersList(latestUsers);
      setUser(adminUser);
      setIsLoggedIn(true);
      setActiveTab('sectors');
      return;
    }

    // For operational roles (technician, sector head, department head)
    const latestUsers = getInitialUsers();
    const existingUser = latestUsers.find(
      (u) => u.email && u.email.toLowerCase() === userInfo.email.toLowerCase()
    );

    if (existingUser) {
      const mergedUser = {
        ...userInfo,
        ...existingUser,
        role: existingUser.role || userInfo.role,
        title: existingUser.title || userInfo.title,
        sector: existingUser.sector || userInfo.sector,
        status: existingUser.status || 'Pending Approval',
        isApproved: Boolean(existingUser.isApproved)
      };
      setUser(mergedUser);
      setIsLoggedIn(true);
      const defaultTab = ROLE_PERMISSIONS[mergedUser.role]?.defaultTab || 'sectors';
      setActiveTab(defaultTab);
    } else {
      // New user logging in for the first time: route to proper approver
      const approver = getRequiredApprover(userInfo.role);
      const newUserRecord = {
        ...userInfo,
        status: 'Pending Approval',
        isApproved: false,
        approverRole: approver.role,
        approverTitle: approver.title,
        requestedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        description: `Access requested as ${userInfo.title} (${userInfo.sector}). Authorization required from ${approver.title}.`
      };

      updateUsersList((prev) => [
        newUserRecord,
        ...prev.filter((u) => u.email.toLowerCase() !== newUserRecord.email.toLowerCase())
      ]);

      const newNotif = {
        id: `NTF-${Date.now()}`,
        title: `New Access Request: ${approver.shortTitle} Approval Required`,
        desc: `${userInfo.name} (${userInfo.email}) requested access as ${userInfo.title} (${userInfo.sector}). Routed to ${approver.title} for authorization.`,
        time: 'Just now',
        type: 'warning',
        targetRole: approver.role,
        read: false
      };
      setNotifications((prev) => {
        const next = [newNotif, ...prev];
        saveStored('notifications', next);
        return next;
      });

      setUser(newUserRecord);
      setIsLoggedIn(true);
    }
  };

  const handleRegisterUser = (newUser) => {
    const isApprovalNeeded = newUser.role !== ROLES.ADMIN;
    const approver = getRequiredApprover(newUser.role);
    const userToSave = {
      ...newUser,
      status: isApprovalNeeded ? 'Pending Approval' : 'Active',
      isApproved: !isApprovalNeeded,
      approverRole: isApprovalNeeded ? approver.role : null,
      approverTitle: isApprovalNeeded ? approver.title : null,
      requestedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      description: isApprovalNeeded
        ? `Registered as ${newUser.title} (${newUser.sector}). Routed to ${approver.title} for authorization.`
        : 'Active administrator.'
    };

    updateUsersList((prev) => [
      userToSave,
      ...prev.filter((u) => u.email.toLowerCase() !== userToSave.email.toLowerCase())
    ]);

    const newNotif = {
      id: `NTF-${Date.now()}`,
      title: isApprovalNeeded
        ? `New Access Request: ${approver.shortTitle} Approval Required`
        : 'Admin Account Registered',
      desc: isApprovalNeeded
        ? `${newUser.name} (${newUser.email}) requested access as ${newUser.title} (${newUser.sector}). Routed to ${approver.title} for authorization.`
        : `${newUser.name} registered as System Administrator.`,
      time: 'Just now',
      type: isApprovalNeeded ? 'warning' : 'info',
      targetRole: isApprovalNeeded ? approver.role : ROLES.ADMIN,
      read: false
    };
    setNotifications((prev) => {
      const next = [newNotif, ...prev];
      saveStored('notifications', next);
      return next;
    });
  };

  const handleApproveUser = (userEmail) => {
    const targetUser = usersList.find((u) => u.email.toLowerCase() === userEmail.toLowerCase());
    if (!targetUser) return;

    // Strict Backend/API Permission Guard: check designated approver authority
    if (!canUserApproveTarget(user, targetUser)) {
      alert(`Security Access Restriction: You (${user?.title || user?.role}) do not have authorization to approve ${targetUser.name} (${targetUser.title}). Approval must be performed by ${targetUser.approverTitle || 'designated approver'}.`);
      setNotifications((prev) => [
        {
          id: `NTF-${Date.now()}`,
          title: 'Unauthorized Approval Attempt Blocked',
          desc: `${user?.title || user?.name} attempted to approve ${targetUser.name} (${targetUser.title}) without designated authority.`,
          time: 'Just now',
          type: 'critical',
          read: false
        },
        ...prev
      ]);
      return;
    }

    const approverName = user ? user.name : 'Authorized Approver';
    const approverRole = user ? (user.title || user.role) : 'Department Head / Admin';

    updateUsersList((prev) =>
      prev.map((u) => {
        if (u.email.toLowerCase() === userEmail.toLowerCase()) {
          return {
            ...u,
            status: 'Active',
            isApproved: true,
            approvedBy: approverName,
            approvedByRole: approverRole,
            approvedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
          };
        }
        return u;
      })
    );

    if (user && user.email.toLowerCase() === userEmail.toLowerCase()) {
      setUser((prev) => ({ ...prev, status: 'Active', isApproved: true }));
      const defaultTab = ROLE_PERMISSIONS[user.role]?.defaultTab || 'sectors';
      setActiveTab(defaultTab);
    }

    setNotifications((prev) => {
      const next = [
        {
          id: `NTF-${Date.now()}`,
          title: 'User Access Approved',
          desc: `${approverRole} approved operational access for ${targetUser.name} (${targetUser.title || 'Personnel'}).`,
          time: 'Just now',
          type: 'info',
          read: false
        },
        ...prev
      ];
      saveStored('notifications', next);
      return next;
    });
  };

  const handleRejectUser = (userEmail) => {
    const targetUser = usersList.find((u) => u.email.toLowerCase() === userEmail.toLowerCase());
    if (!targetUser) return;

    // Strict Backend/API Permission Guard: check designated rejector authority
    if (!canUserApproveTarget(user, targetUser)) {
      alert(`Security Access Restriction: You (${user?.title || user?.role}) do not have authorization to reject ${targetUser.name} (${targetUser.title}).`);
      return;
    }

    const rejectorName = user ? user.name : 'Authorized Approver';
    const rejectorRole = user ? (user.title || user.role) : 'Department Head / Admin';

    updateUsersList((prev) =>
      prev.map((u) => {
        if (u.email.toLowerCase() === userEmail.toLowerCase()) {
          return {
            ...u,
            status: 'Rejected',
            isApproved: false,
            rejectedBy: rejectorName,
            rejectedByRole: rejectorRole,
            rejectedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
          };
        }
        return u;
      })
    );

    if (user && user.email.toLowerCase() === userEmail.toLowerCase()) {
      setUser((prev) => ({ ...prev, status: 'Rejected', isApproved: false }));
    }

    setNotifications((prev) => {
      const next = [
        {
          id: `NTF-${Date.now()}`,
          title: 'User Access Request Rejected',
          desc: `${rejectorRole} rejected access request for ${targetUser.name}.`,
          time: 'Just now',
          type: 'warning',
          read: false
        },
        ...prev
      ];
      saveStored('notifications', next);
      return next;
    });
  };

  const handleCheckApprovalStatus = () => {
    if (!user) return;
    const currentStored = loadStored('users', usersList);
    const updated = currentStored.find((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (updated) {
      setUser(updated);
      if (updated.isApproved || updated.status === 'Active') {
        const defaultTab = ROLE_PERMISSIONS[updated.role]?.defaultTab || 'dashboard';
        setActiveTab(defaultTab);
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  // Machine Management Handlers (Admin Only Clearance Required)
  const handleAddMachine = (newMachine) => {
    if (user?.role !== ROLES.ADMIN) {
      alert('Security Access Restriction: Only System Administrator has clearance to add new machinery to the plant fleet.');
      return;
    }
    setRawAssets((prev) => {
      const next = [newMachine, ...prev];
      saveStored('assets', next);
      return next;
    });
    const newNotif = {
      id: `NTF-${Date.now()}`,
      title: 'New Machine Asset Registered',
      desc: `Asset ${newMachine.id} (${newMachine.name}) added to ${newMachine.sector}.`,
      time: 'Just now',
      type: 'info',
      read: false
    };
    setNotifications((prev) => {
      const next = [newNotif, ...prev];
      saveStored('notifications', next);
      return next;
    });
  };

  const handleEditMachine = (updatedAsset) => {
    if (user?.role !== ROLES.ADMIN) {
      alert('Security Access Restriction: Only System Administrator has clearance to modify machinery technical specifications.');
      return;
    }
    setRawAssets((prev) => {
      const next = prev.map((ast) => (ast.id === updatedAsset.id ? updatedAsset : ast));
      saveStored('assets', next);
      return next;
    });
    if (selectedAsset && selectedAsset.id === updatedAsset.id) {
      setSelectedAsset(updatedAsset);
    }
    setNotifications((prev) => {
      const next = [
        {
          id: `NTF-${Date.now()}`,
          title: 'Machine Record Updated',
          desc: `Asset ${updatedAsset.id} (${updatedAsset.name}) profile updated.`,
          time: 'Just now',
          type: 'info',
          read: false
        },
        ...prev
      ];
      saveStored('notifications', next);
      return next;
    });
  };

  const handleDeactivateMachine = (assetId) => {
    if (user?.role !== ROLES.ADMIN) {
      alert('Security Access Restriction: Only System Administrator has clearance to deactivate or reactivate equipment.');
      return;
    }
    setRawAssets((prev) => {
      const next = prev.map((ast) => {
        if (ast.id === assetId) {
          const newStatus = ast.status === 'Offline' ? 'Operational' : 'Offline';
          const newHealth = newStatus === 'Offline' ? 0 : 90;
          return { ...ast, status: newStatus, healthScore: newHealth };
        }
        return ast;
      });
      saveStored('assets', next);
      return next;
    });
    if (selectedAsset && selectedAsset.id === assetId) {
      setSelectedAsset((prev) => {
        const newStatus = prev.status === 'Offline' ? 'Operational' : 'Offline';
        const newHealth = newStatus === 'Offline' ? 0 : 90;
        return { ...prev, status: newStatus, healthScore: newHealth };
      });
    }
  };

  const handleSaveReadings = (assetId, newReadings, timestamp, dataSource) => {
    setRawAssets((prev) =>
      prev.map((ast) => {
        if (ast.id === assetId) {
          return {
            ...ast,
            readings: newReadings,
            lastUpdated: timestamp,
            dataSource: dataSource || 'Manual Entry'
          };
        }
        return ast;
      })
    );
    if (selectedAsset && selectedAsset.id === assetId) {
      setSelectedAsset((prev) => ({
        ...prev,
        readings: newReadings,
        lastUpdated: timestamp,
        dataSource: dataSource || 'Manual Entry'
      }));
    }
    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title: 'Manual Readings Logged',
        desc: `Sample telemetry readings logged for ${assetId}. Data source set to Manual Entry.`,
        time: 'Just now',
        type: 'info',
        read: false
      },
      ...prev
    ]);
  };

  // Live demonstration state updater - synchronizes simulated telemetry, healthScore, status, and prediction risk across entire app
  const handleUpdateSimulationState = (machineId, updateData) => {
    if (!machineId) return;
    setRawAssets((prevAssets) =>
      prevAssets.map((asset) => {
        if (asset.id === machineId) {
          return {
            ...asset,
            ...updateData,
            _wasDemonstrated: updateData.status !== 'Offline'
          };
        }
        return asset;
      })
    );
    setSelectedAsset((prev) => {
      if (prev && prev.id === machineId) {
        return {
          ...prev,
          ...updateData,
          _wasDemonstrated: updateData.status !== 'Offline'
        };
      }
      return prev;
    });
  };

  // Work Order & Task Handlers
  const handleAddWorkOrder = (newWO) => {
    const fullWO = { ...newWO, sector: newWO.sector || (user ? user.sector : 'Plant Floor') };
    setRawWorkOrders((prev) => [fullWO, ...prev]);
    const newNotif = {
      id: `NTF-${Date.now()}`,
      title: 'New Work Order Dispatched',
      desc: `Ticket ${newWO.id} logged for ${newWO.assetName}.`,
      time: 'Just now',
      type: 'info',
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleUpdateWOStatus = (woId, newStatus) => {
    setRawWorkOrders((prev) =>
      prev.map((wo) => (wo.id === woId ? { ...wo, status: newStatus } : wo))
    );
  };

  // Sector Head & Department Head Task Actions with Strict RBAC Guards
  const handleAssignTask = (taskId, techName) => {
    const targetWO = rawWorkOrders.find((w) => w.id === taskId);
    if (targetWO && user && user.role !== ROLES.ADMIN) {
      if (user.role === ROLES.MECHANICAL_HEAD && !targetWO.department?.toLowerCase().includes('mech') && !targetWO.assignedDepartment?.toLowerCase().includes('mech')) {
        alert('Security Access Restriction: Mechanical Department Head can only assign technicians to mechanical tasks.');
        return;
      }
      if (user.role === ROLES.ELECTRICAL_HEAD && !targetWO.department?.toLowerCase().includes('elec') && !targetWO.assignedDepartment?.toLowerCase().includes('elec')) {
        alert('Security Access Restriction: Electrical Department Head can only assign technicians to electrical tasks.');
        return;
      }
      if (isSectorHeadRole(user.role) && !isSectorAllowedForUser(targetWO.sector, user)) {
        alert(`Security Access Restriction: Sector Head can only assign tasks in their own sector (${user.sector}).`);
        return;
      }
    }
    setRawWorkOrders((prev) =>
      prev.map((w) => (w.id === taskId ? { ...w, assignedTo: techName } : w))
    );
    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title: 'Task Reassigned',
        desc: `Task ${taskId} reassigned to ${techName}.`,
        time: 'Just now',
        type: 'info',
        read: false
      },
      ...prev
    ]);
  };

  const handleSendReminder = (taskId, techName) => {
    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title: 'Task Reminder Sent',
        desc: `Reminder sent to ${techName} for task ${taskId}.`,
        time: 'Just now',
        type: 'warning',
        read: false
      },
      ...prev
    ]);
  };

  const handleReviseDeadline = (taskId, newDate, reason) => {
    const targetWO = rawWorkOrders.find((w) => w.id === taskId);
    if (!targetWO) return;

    if (user && user.role !== ROLES.ADMIN) {
      const isAuthorizedSectorHead = isSectorHeadRole(user.role) && isSectorAllowedForUser(targetWO.sector, user);
      if (!isAuthorizedSectorHead) {
        alert(`Security Access Restriction: Only the Sector Head of ${targetWO.sector} has authority to revise maintenance deadlines.`);
        return;
      }
    }

    if (!reason || !reason.trim()) {
      alert('A mandatory justification reason is required to revise a maintenance deadline.');
      return;
    }

    setRawWorkOrders((prev) =>
      prev.map((w) => (w.id === taskId ? { ...w, dueDate: newDate, deadlineRevisionReason: reason } : w))
    );
    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title: 'Deadline Revised',
        desc: `Deadline for ${taskId} extended to ${newDate}. Reason: ${reason}`,
        time: 'Just now',
        type: 'info',
        read: false
      },
      ...prev
    ]);
  };

  const handleEscalateTask = (taskId) => {
    const targetWO = rawWorkOrders.find((w) => w.id === taskId);
    if (!targetWO) return;

    if (user && user.role !== ROLES.ADMIN) {
      const isAuthorizedSectorHead = isSectorHeadRole(user.role) && isSectorAllowedForUser(targetWO.sector, user);
      if (!isAuthorizedSectorHead) {
        alert(`Security Access Restriction: Only the Sector Head of ${targetWO.sector} has authority to escalate tasks.`);
        return;
      }
    }

    setRawWorkOrders((prev) =>
      prev.map((w) => (w.id === taskId ? { ...w, priority: 'High' } : w))
    );
    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title: 'Task Escalated',
        desc: `Task ${taskId} priority escalated to High.`,
        time: 'Just now',
        type: 'critical',
        read: false
      },
      ...prev
    ]);
  };

  const handleVerifyCloseTask = (taskId, feedback) => {
    const targetWO = rawWorkOrders.find((w) => w.id === taskId);
    if (!targetWO) return;

    if (user && user.role !== ROLES.ADMIN) {
      const isAuthorizedSectorHead = isSectorHeadRole(user.role) && isSectorAllowedForUser(targetWO.sector, user);
      if (!isAuthorizedSectorHead) {
        alert(`Security Access Restriction: Only the Sector Head of ${targetWO.sector} has authority to verify and close tasks.`);
        return;
      }
    }

    setRawWorkOrders((prev) =>
      prev.map((w) => (w.id === taskId ? { ...w, status: 'Completed', verificationFeedback: feedback } : w))
    );
    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title: 'Incident Verified & Closed',
        desc: `Sector Head approved resolution for ${taskId}. Incident closed.`,
        time: 'Just now',
        type: 'info',
        read: false
      },
      ...prev
    ]);
  };

  const handleReopenTask = (taskId, feedback) => {
    const targetWO = rawWorkOrders.find((w) => w.id === taskId);
    if (!targetWO) return;

    if (user && user.role !== ROLES.ADMIN) {
      const isAuthorizedSectorHead = isSectorHeadRole(user.role) && isSectorAllowedForUser(targetWO.sector, user);
      if (!isAuthorizedSectorHead) {
        alert(`Security Access Restriction: Only the Sector Head of ${targetWO.sector} has authority to reject and reopen tasks.`);
        return;
      }
    }

    setRawWorkOrders((prev) =>
      prev.map((w) => (w.id === taskId ? { ...w, status: 'In Progress', verificationFeedback: feedback } : w))
    );
    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title: 'Task Reopened',
        desc: `Task ${taskId} reopened by Sector Head. Feedback: ${feedback}`,
        time: 'Just now',
        type: 'warning',
        read: false
      },
      ...prev
    ]);
  };

  // Technician Actions
  const handleAcknowledgeTask = (taskId) => {
    setRawWorkOrders((prev) =>
      prev.map((w) => (w.id === taskId ? { ...w, status: 'In Progress' } : w))
    );
  };

  const handleSubmitResolution = (taskId, resolutionDetails) => {
    setRawWorkOrders((prev) =>
      prev.map((w) => (w.id === taskId ? { ...w, status: 'Pending Verification', resolutionDetails } : w))
    );
    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title: 'Repair Submitted for Verification',
        desc: `Technician submitted resolution for ${taskId}. Pending Head review.`,
        time: 'Just now',
        type: 'info',
        read: false
      },
      ...prev
    ]);
  };

  // Detailed 6-Stage Maintenance Workflow Transition Handler
  // Workflow: Open -> Acknowledged -> In Progress -> Resolution Submitted -> Verified and Resolved -> Closed
  const handleWorkflowTransition = (workOrderId, targetStatus, payload = {}) => {
    const wo = rawWorkOrders.find((w) => w.id === workOrderId);
    if (!wo) return;

    // Strict Permission Guard 1: Verify sector clearance for Sector Head
    if (user && isSectorHeadRole(user.role)) {
      if (!isSectorAllowedForUser(wo.sector, user)) {
        alert(`Security Access Restriction: You are authenticated as Sector Head for ${user.sector}. You do not have clearance to update work orders in ${wo.sector}.`);
        return;
      }
    }

    // Strict Permission Guard 2: Only Sector Head of that sector (or Admin) can verify/close or reject resolutions
    if (targetStatus === 'Closed' || (targetStatus === 'In Progress' && payload.reason)) {
      const isAuthorizedSectorHead = user?.role === ROLES.ADMIN || (
        isSectorHeadRole(user?.role) && isSectorAllowedForUser(wo.sector, user)
      );
      if (!isAuthorizedSectorHead) {
        alert(`Security Access Restriction: Only the designated Sector Head for ${wo.sector} (or Administrator) has authority to verify or reject repair resolutions.`);
        return;
      }
    }

    // Strict Permission Guard 3: Technicians cannot verify and close repair tickets
    if ((user?.role === ROLES.MECHANICAL_TECH || user?.role === ROLES.ELECTRICAL_TECH) && targetStatus === 'Closed') {
      alert('Security Access Restriction: Technicians cannot verify and close repair tickets. A Sector Head must inspect and approve.');
      return;
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const actorName = user ? user.name : (payload.actorName || 'Authorized User');
    const actorRole = user ? (user.title || user.role) : (payload.actorRole || 'Maintenance Staff');

    let affectedAssetId = null;

    setRawWorkOrders((prev) =>
      prev.map((item) => {
        if (item.id === workOrderId) {
          affectedAssetId = item.assetId;

          let updatedLaborHours = item.laborHours;
          let updatedNotes = item.technicianNotes;
          let updatedParts = item.replacedParts || [];
          let updatedResolutionPeriod = item.resolutionPeriod;
          let updatedResolvedAt = item.resolvedAt;
          let updatedVerifiedBy = item.verifiedBy;
          let updatedFeedback = item.verificationFeedback;

          if (payload.laborHours !== undefined) updatedLaborHours = payload.laborHours;
          if (payload.technicianNotes !== undefined) updatedNotes = payload.technicianNotes;
          if (payload.replacedParts !== undefined) updatedParts = payload.replacedParts;
          if (payload.verificationFeedback !== undefined) updatedFeedback = payload.verificationFeedback;

          // When transitioning to Verified and Resolved or Closed: calculate REAL resolution period (never invented)
          if (targetStatus === 'Closed' || targetStatus === 'Verified and Resolved') {
            updatedResolvedAt = timestamp;
            updatedVerifiedBy = actorName;
            if (item.createdAt) {
              const start = new Date(item.createdAt.replace(' ', 'T')).getTime();
              const end = new Date().getTime();
              const diffMs = Math.max(0, end - start);
              const diffHrs = Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10;
              if (diffHrs >= 24) {
                const days = Math.floor(diffHrs / 24);
                const remHrs = Math.round((diffHrs % 24) * 10) / 10;
                updatedResolutionPeriod = `${days} day${days > 1 ? 's' : ''} ${remHrs} hrs`;
              } else {
                updatedResolutionPeriod = `${diffHrs} hours`;
              }
            } else {
              updatedResolutionPeriod = 'Completed';
            }
          }

          const newTimelineEntry = {
            id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            status: targetStatus,
            action: payload.actionTitle || `Workflow Advanced to ${targetStatus}`,
            timestamp,
            user: actorName,
            role: actorRole,
            reason: payload.reason || payload.notes || `Request transitioned to ${targetStatus}.`,
            laborHours: payload.laborHours || undefined
          };

          return {
            ...item,
            status: targetStatus,
            laborHours: updatedLaborHours,
            technicianNotes: updatedNotes,
            replacedParts: updatedParts,
            resolutionPeriod: updatedResolutionPeriod,
            resolvedAt: updatedResolvedAt,
            verifiedBy: updatedVerifiedBy,
            verificationFeedback: updatedFeedback,
            auditTimeline: [newTimelineEntry, ...(item.auditTimeline || [])]
          };
        }
        return item;
      })
    );

    // If ticket is closed, restore machine operational status from Warning/Critical to Operational
    if (targetStatus === 'Closed' && affectedAssetId) {
      setRawAssets((prev) =>
        prev.map((a) => {
          if (a.id === affectedAssetId) {
            return {
              ...a,
              status: 'Operational',
              maintenancePending: false,
              healthScore: Math.min(100, Math.max(90, (a.healthScore || 70) + 25))
            };
          }
          return a;
        })
      );
      if (selectedAsset && selectedAsset.id === affectedAssetId) {
        setSelectedAsset((prev) => ({
          ...prev,
          status: 'Operational',
          maintenancePending: false,
          healthScore: Math.min(100, Math.max(90, (prev.healthScore || 70) + 25))
        }));
      }
    }

    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title: `Work Order ${workOrderId}: ${targetStatus}`,
        desc: `${actorName} transitioned ticket to ${targetStatus}. ${payload.notes || ''}`,
        time: 'Just now',
        type: targetStatus === 'Closed' ? 'success' : targetStatus === 'In Progress' ? 'warning' : 'info',
        read: false
      },
      ...prev
    ]);
  };

  // Re-request maintenance when deadline expired: creates linked follow-up while preserving original request
  const handleRequestMaintenanceAgain = (originalRequestId, { reason, dueDate, priority = 'Critical', assignedDepartment, assignedTech }) => {
    const originalTicket = rawWorkOrders.find((w) => w.id === originalRequestId);
    if (!originalTicket) return;

    // Strict Permission Guard: Sector Head can only request maintenance again for their own sector
    if (user && user.role !== ROLES.ADMIN) {
      const isAuthorized = isSectorHeadRole(user.role) && isSectorAllowedForUser(originalTicket.sector, user);
      if (!isAuthorized) {
        alert(`Security Access Restriction: Only the Sector Head of ${originalTicket.sector} has authority to issue follow-up maintenance requests.`);
        return;
      }
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const actorName = user ? user.name : 'Authorized Requester';
    const actorRole = user ? (user.title || user.role) : 'Sector Head / Maintenance Lead';

    let followUpId = `REQ-2026-${Math.floor(200 + Math.random() * 800)}`;
    while (rawWorkOrders.some((w) => w.id === followUpId)) {
      followUpId = `REQ-2026-${Math.floor(200 + Math.random() * 800)}`;
    }

    const newFollowUpTicket = {
      id: followUpId,
      assetId: originalTicket.assetId,
      assetName: originalTicket.assetName,
      sector: originalTicket.sector,
      department: originalTicket.department,
      assignedDepartment: assignedDepartment || originalTicket.assignedDepartment || originalTicket.department,
      assignedTech: assignedTech || originalTicket.assignedTech || 'Unassigned',
      status: 'Open',
      priority: priority,
      type: `Escalated Follow-Up: ${originalTicket.type || 'Corrective Servicing'}`,
      createdAt: timestamp,
      dueDate: dueDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      description: `Follow-up work order created following deadline expiration of parent ticket ${originalRequestId}. Escalation Reason: ${reason}`,
      laborHours: null,
      technicianNotes: null,
      replacedParts: [],
      resolutionPeriod: null,
      resolvedAt: null,
      verifiedBy: null,
      verificationFeedback: null,
      parentRequestId: originalRequestId,
      followUpRequestId: null,
      hasActiveFollowUp: false,
      auditTimeline: [
        {
          id: `AUD-${Date.now()}-1`,
          status: 'Open',
          action: 'Escalated Follow-Up Request Dispatched',
          timestamp,
          user: actorName,
          role: actorRole,
          reason: `Linked follow-up dispatched for parent request ${originalRequestId}. Escalation justification: ${reason}`
        }
      ]
    };

    // Update parent work order: link followUpRequestId and mark hasActiveFollowUp: true, preserving original and its audit log
    setRawWorkOrders((prev) => [
      newFollowUpTicket,
      ...prev.map((w) => {
        if (w.id === originalRequestId) {
          const updatedTimeline = [
            {
              id: `AUD-${Date.now()}-2`,
              status: w.status,
              action: `Linked Follow-Up Request Generated (${followUpId})`,
              timestamp,
              user: actorName,
              role: actorRole,
              reason: `Deadline expired (${w.dueDate}). User requested maintenance again: ${reason}`
            },
            ...(w.auditTimeline || [])
          ];
          return {
            ...w,
            followUpRequestId: followUpId,
            hasActiveFollowUp: true,
            auditTimeline: updatedTimeline
          };
        }
        return w;
      })
    ]);

    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title: 'Linked Maintenance Re-Requested',
        desc: `New follow-up work order ${followUpId} dispatched for ${originalTicket.assetName}. Parent ticket ${originalRequestId} preserved in audit.`,
        time: 'Just now',
        type: 'warning',
        read: false
      },
      ...prev
    ]);
  };

  // Alert Handlers for Incident & Failure Resolution
  const handleResolveAlert = (alertId, resolutionNotes, resolutionDetails = {}) => {
    handleUpdateAlertStatus(alertId, 'Resolved', resolutionNotes || 'Technician submitted resolution.', resolutionDetails);
  };

  const handleAcknowledgeAlert = (alertId) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const actorName = user ? user.name : 'Authorized Specialist';
    const actorRole = user ? (user.title || user.role) : 'Technician';

    setRawAlerts((prev) =>
      prev.map((alt) => {
        if (alt.id === alertId) {
          const updatedTimeline = [
            ...(alt.auditTimeline || []),
            {
              id: `TL-${Date.now()}`,
              timestamp,
              actor: actorName,
              role: actorRole,
              action: 'Acknowledged Alert',
              notes: `${actorRole} acknowledged alert assignment.`
            }
          ];
          return {
            ...alt,
            status: 'Acknowledged',
            maintenanceStatus: 'Acknowledged',
            auditTimeline: updatedTimeline
          };
        }
        return alt;
      })
    );

    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title: 'Alert Acknowledged',
        desc: `${actorName} acknowledged failure alert ${alertId}.`,
        time: 'Just now',
        type: 'info',
        read: false
      },
      ...prev
    ]);
  };

  const handleAssignAlert = (alertId, techName, notes) => {
    const targetAlert = rawAlerts.find((a) => a.id === alertId);
    if (!targetAlert) return;

    // RBAC Clearance Check: Admin, Dept Head (for their dept), Sector Head (for their sector)
    if (user && user.role !== ROLES.ADMIN) {
      if (user.role === ROLES.MECHANICAL_HEAD && !targetAlert.department?.toLowerCase().includes('mech')) {
        alert('Security Access Restriction: Mechanical Department Head can only assign mechanical alerts.');
        return;
      }
      if (user.role === ROLES.ELECTRICAL_HEAD && !targetAlert.department?.toLowerCase().includes('elec')) {
        alert('Security Access Restriction: Electrical Department Head can only assign electrical alerts.');
        return;
      }
      if (isSectorHeadRole(user.role) && !isSectorAllowedForUser(targetAlert.sector, user)) {
        alert(`Security Access Restriction: Sector Head can only assign alerts in their own sector (${user.sector}).`);
        return;
      }
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const actorName = user ? user.name : 'Operations Lead';
    const actorRole = user ? (user.title || user.role) : 'Department Head';

    setRawAlerts((prev) =>
      prev.map((alt) => {
        if (alt.id === alertId) {
          const updatedTimeline = [
            ...(alt.auditTimeline || []),
            {
              id: `TL-${Date.now()}`,
              timestamp,
              actor: actorName,
              role: actorRole,
              action: `Assigned to ${techName}`,
              notes: notes || `Technician ${techName} assigned to resolve anomaly.`
            }
          ];
          return {
            ...alt,
            assignedTech: techName,
            auditTimeline: updatedTimeline
          };
        }
        return alt;
      })
    );

    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title: 'Technician Assigned',
        desc: `Alert ${alertId} assigned to specialist ${techName}.`,
        time: 'Just now',
        type: 'info',
        read: false
      },
      ...prev
    ]);
  };

  const handleCreateFollowUpAlert = (originalAlertId, { reason, dueDate, priority = 'Critical', assignedDepartment, assignedTech }) => {
    const parentAlert = rawAlerts.find((a) => a.id === originalAlertId);
    if (!parentAlert) return;

    if (user && user.role !== ROLES.ADMIN) {
      const isAuthorized = isSectorHeadRole(user.role) && isSectorAllowedForUser(parentAlert.sector, user);
      if (!isAuthorized) {
        alert(`Security Access Restriction: Only the Sector Head of ${parentAlert.sector} has authority to issue follow-up alerts.`);
        return;
      }
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const actorName = user ? user.name : 'Sector Head';
    const actorRole = user ? (user.title || user.role) : 'Sector Head';

    const followUpId = `ALT-FLW-${Math.floor(100 + Math.random() * 900)}`;

    const newFollowUpAlert = {
      ...parentAlert,
      id: followUpId,
      title: `Escalated Follow-Up: ${parentAlert.title}`,
      description: `Escalated follow-up issued following parent alert ${originalAlertId}. Reason: ${reason}`,
      severity: priority === 'Critical' ? 'Critical' : 'Warning',
      status: 'New',
      createdTime: timestamp,
      date: timestamp,
      deadline: dueDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      overdue: false,
      escalated: true,
      escalatedReason: reason,
      maintenanceStatus: 'Open',
      parentAlertId: originalAlertId,
      hasActiveFollowUp: false,
      followUpAlertId: null,
      auditTimeline: [
        {
          id: `TL-${Date.now()}-1`,
          timestamp,
          actor: actorName,
          role: actorRole,
          action: 'Escalated Follow-Up Alert Generated',
          notes: `Linked follow-up dispatched for parent alert ${originalAlertId}. Escalation: ${reason}`
        }
      ]
    };

    setRawAlerts((prev) => [
      newFollowUpAlert,
      ...prev.map((alt) => {
        if (alt.id === originalAlertId) {
          const updatedTimeline = [
            ...(alt.auditTimeline || []),
            {
              id: `TL-${Date.now()}-2`,
              timestamp,
              actor: actorName,
              role: actorRole,
              action: `Linked Follow-Up Generated (${followUpId})`,
              notes: `Overdue/unresolved task escalated: ${reason}`
            }
          ];
          return {
            ...alt,
            hasActiveFollowUp: true,
            followUpAlertId: followUpId,
            auditTimeline: updatedTimeline
          };
        }
        return alt;
      })
    ]);

    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title: 'Linked Follow-Up Alert Dispatched',
        desc: `Follow-up ${followUpId} generated for ${parentAlert.machineName}. Parent alert ${originalAlertId} preserved in audit.`,
        time: 'Just now',
        type: 'warning',
        read: false
      },
      ...prev
    ]);
  };

  const handleCreateAlert = (newAlert) => {
    setRawAlerts((prev) => [newAlert, ...prev]);
    const newNotif = {
      id: `NTF-${Date.now()}`,
      title: 'New Failure Alert Created',
      desc: `Alert ${newAlert.id} (${newAlert.title}) routed to ${newAlert.sector}.`,
      time: 'Just now',
      type: newAlert.severity === 'Critical' ? 'critical' : 'warning',
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleUpdateAlertStatus = (alertId, newStatus, techNotes, resolutionPayload = {}) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setRawAlerts((prev) =>
      prev.map((alt) => {
        if (alt.id === alertId) {
          const updatedTimeline = [
            ...(alt.auditTimeline || []),
            {
              id: `TL-${Date.now()}`,
              timestamp,
              actor: user ? user.name : 'Authorized User',
              role: user ? user.title : 'Technician',
              action: `Status Changed to ${newStatus}`,
              notes: techNotes || `Alert status updated to ${newStatus}`
            }
          ];

          let laborHours = alt.laborHours;
          let replacedParts = alt.replacedParts || [];
          if (resolutionPayload.laborHours !== undefined) laborHours = resolutionPayload.laborHours;
          if (resolutionPayload.replacedParts !== undefined) replacedParts = resolutionPayload.replacedParts;

          return {
            ...alt,
            status: newStatus,
            maintenanceStatus: newStatus === 'Resolved' ? 'Resolution Submitted' : newStatus,
            laborHours,
            replacedParts,
            technicianNotes: techNotes || alt.technicianNotes,
            auditTimeline: updatedTimeline
          };
        }
        return alt;
      })
    );

    if (newStatus === 'Resolved') {
      setNotifications((prev) => [
        {
          id: `NTF-${Date.now()}`,
          title: 'Repair Submitted for Verification',
          desc: `Technician ${user ? user.name : 'Specialist'} submitted resolution for ${alertId}. Pending Sector Head review.`,
          time: 'Just now',
          type: 'info',
          read: false
        },
        ...prev
      ]);
    }
  };

  const handleSendAlertReminder = (alertId, techName) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setRawAlerts((prev) =>
      prev.map((alt) => {
        if (alt.id === alertId) {
          const updatedTimeline = [
            ...(alt.auditTimeline || []),
            {
              id: `TL-${Date.now()}`,
              timestamp,
              actor: user ? user.name : 'Sector Head',
              role: user ? user.title : 'Head of Sector',
              action: 'Reminder Sent',
              notes: `Urgent task reminder dispatched to ${techName || alt.assignedTech}.`
            }
          ];
          return { ...alt, auditTimeline: updatedTimeline };
        }
        return alt;
      })
    );

    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title: 'Task Reminder Dispatched',
        desc: `Reminder sent to ${techName || 'assigned technician'} for ${alertId}.`,
        time: 'Just now',
        type: 'warning',
        read: false
      },
      ...prev
    ]);
  };

  const handleReviseAlertDeadline = (alertId, newDate, reason) => {
    const targetAlert = rawAlerts.find((a) => a.id === alertId);
    if (!targetAlert) return;

    // Strict Permission Guard: Sector Head can only revise deadlines for their sector
    if (user && user.role !== ROLES.ADMIN) {
      const isAuthorizedSectorHead = isSectorHeadRole(user.role) && isSectorAllowedForUser(targetAlert.sector, user);
      if (!isAuthorizedSectorHead) {
        alert(`Security Access Restriction: Only the Sector Head of ${targetAlert.sector} has authority to revise alert deadlines.`);
        return;
      }
    }

    if (!reason || !reason.trim()) {
      alert('A mandatory reason is required to revise an alert deadline.');
      return;
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setRawAlerts((prev) =>
      prev.map((alt) => {
        if (alt.id === alertId) {
          const updatedTimeline = [
            ...(alt.auditTimeline || []),
            {
              id: `TL-${Date.now()}`,
              timestamp,
              actor: user ? user.name : 'Sector Head',
              role: user ? user.title : 'Head of Sector',
              action: 'Deadline Revised',
              notes: `Deadline extended to ${newDate}. Reason: ${reason}`
            }
          ];
          return { ...alt, deadline: newDate, overdue: false, auditTimeline: updatedTimeline };
        }
        return alt;
      })
    );

    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title: 'Alert Deadline Extended',
        desc: `Deadline for ${alertId} revised to ${newDate}. Reason: ${reason}`,
        time: 'Just now',
        type: 'info',
        read: false
      },
      ...prev
    ]);
  };

  const handleEscalateAlert = (alertId, reason) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setRawAlerts((prev) =>
      prev.map((alt) => {
        if (alt.id === alertId) {
          const updatedTimeline = [
            ...(alt.auditTimeline || []),
            {
              id: `TL-${Date.now()}`,
              timestamp,
              actor: user ? user.name : 'Sector Head',
              role: user ? user.title : 'Head of Sector',
              action: 'Escalated to Admin',
              notes: reason || 'Overdue task escalated to Admin.'
            }
          ];
          const updatedEscalations = [
            ...(alt.escalationHistory || []),
            {
              id: `ESC-${Date.now()}`,
              timestamp,
              escalatedBy: user ? user.name : 'Sector Head',
              role: user ? user.title : 'Head of Sector',
              reason: reason || 'Target deadline exceeded.'
            }
          ];
          return {
            ...alt,
            escalated: true,
            escalatedReason: reason,
            severity: 'Critical',
            auditTimeline: updatedTimeline,
            escalationHistory: updatedEscalations
          };
        }
        return alt;
      })
    );

    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title: 'Overdue Alert Escalated to Admin',
        desc: `Alert ${alertId} escalated to System Admin. Reason: ${reason}`,
        time: 'Just now',
        type: 'critical',
        read: false
      },
      ...prev
    ]);
  };

  const handleVerifyCloseAlert = (alertId, feedback) => {
    const targetAlert = rawAlerts.find((a) => a.id === alertId);
    if (!targetAlert) return;

    // Strict RBAC Guard: Admin or designated Sector Head
    if (user && user.role !== ROLES.ADMIN) {
      const isAuthorizedSectorHead = isSectorHeadRole(user.role) && isSectorAllowedForUser(targetAlert.sector, user);
      if (!isAuthorizedSectorHead) {
        alert(`Security Access Restriction: Only the Sector Head of ${targetAlert.sector} (or Administrator) has clearance to verify and close alerts.`);
        return;
      }
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const actorName = user ? user.name : 'Sector Head';
    const actorRole = user ? (user.title || user.role) : 'Sector Head';

    setRawAlerts((prev) =>
      prev.map((alt) => {
        if (alt.id === alertId) {
          const updatedTimeline = [
            ...(alt.auditTimeline || []),
            {
              id: `TL-${Date.now()}`,
              timestamp,
              actor: actorName,
              role: actorRole,
              action: 'Verified & Closed Incident',
              notes: feedback || 'Repair verified and approved by Sector Head.'
            }
          ];
          return {
            ...alt,
            status: 'Closed',
            maintenanceStatus: 'Closed',
            auditTimeline: updatedTimeline
          };
        }
        return alt;
      })
    );

    // If machine has no other open critical alerts, restore machine status to Operational
    if (targetAlert.machineId) {
      setRawAssets((prev) =>
        prev.map((ast) => {
          if (ast.id === targetAlert.machineId) {
            return {
              ...ast,
              status: 'Operational',
              maintenancePending: false,
              healthScore: Math.min(100, Math.max(90, (ast.healthScore || 70) + 20))
            };
          }
          return ast;
        })
      );
    }

    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title: 'Incident Verified & Closed',
        desc: `${actorRole} approved resolution for ${alertId}. Incident closed.`,
        time: 'Just now',
        type: 'info',
        read: false
      },
      ...prev
    ]);
  };

  const handleReopenAlert = (alertId, feedback) => {
    const targetAlert = rawAlerts.find((a) => a.id === alertId);
    if (!targetAlert) return;

    if (user && user.role !== ROLES.ADMIN) {
      const isAuthorizedSectorHead = isSectorHeadRole(user.role) && isSectorAllowedForUser(targetAlert.sector, user);
      if (!isAuthorizedSectorHead) {
        alert(`Security Access Restriction: Only the Sector Head of ${targetAlert.sector} (or Administrator) has clearance to reopen alerts.`);
        return;
      }
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const actorName = user ? user.name : 'Sector Head';
    const actorRole = user ? (user.title || user.role) : 'Sector Head';

    setRawAlerts((prev) =>
      prev.map((alt) => {
        if (alt.id === alertId) {
          const updatedTimeline = [
            ...(alt.auditTimeline || []),
            {
              id: `TL-${Date.now()}`,
              timestamp,
              actor: actorName,
              role: actorRole,
              action: 'Reopened Incident',
              notes: feedback || 'Repair rejected; reopened for further technician servicing.'
            }
          ];
          return {
            ...alt,
            status: 'Reopened',
            maintenanceStatus: 'In Progress',
            auditTimeline: updatedTimeline
          };
        }
        return alt;
      })
    );

    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title: 'Incident Reopened',
        desc: `Alert ${alertId} reopened by Sector Head. Feedback: ${feedback}`,
        time: 'Just now',
        type: 'warning',
        read: false
      },
      ...prev
    ]);
  };

  // Preventive Maintenance Handlers for Part 7
  const handleCreatePreventiveSchedule = (newSchedule) => {
    setRawPreventiveSchedules((prev) => [newSchedule, ...prev]);
    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title: 'Preventive Servicing Scheduled',
        desc: `Routine ${newSchedule.id} (${newSchedule.title}) scheduled for ${newSchedule.machineName}.`,
        time: 'Just now',
        type: 'info',
        read: false
      },
      ...prev
    ]);
  };

  const handleCompletePreventiveTask = (scheduleId, notes, completedDate, nextDueDate, hours, parts) => {
    setRawPreventiveSchedules((prev) =>
      prev.map((s) => {
        if (s.id === scheduleId) {
          return {
            ...s,
            status: 'Upcoming',
            lastCompletedDate: completedDate,
            nextDueDate: nextDueDate,
            servicingNotes: notes
          };
        }
        return s;
      })
    );

    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title: 'Preventive Maintenance Completed',
        desc: `Technician completed servicing task ${scheduleId}. Next due date advanced to ${nextDueDate}.`,
        time: 'Just now',
        type: 'info',
        read: false
      },
      ...prev
    ]);
  };

  // Downtime Tracking Handlers for Part 7
  const handleRecordDowntime = (newLog) => {
    setRawDowntimeLogs((prev) => [newLog, ...prev]);
    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title: 'Machine Stoppage Logged',
        desc: `Downtime recorded for ${newLog.machineId} (${newLog.reason}).`,
        time: 'Just now',
        type: newLog.status === 'Ongoing' ? 'critical' : 'warning',
        read: false
      },
      ...prev
    ]);
  };

  // Spare Parts Handlers (Admin & Department Heads Authority)
  const handleAddSparePart = (newPart) => {
    const canManageSpares = user?.role === ROLES.ADMIN || user?.role === ROLES.MECHANICAL_HEAD || user?.role === ROLES.ELECTRICAL_HEAD;
    if (!canManageSpares) {
      alert('Security Access Restriction: Only Department Heads and System Administrator have clearance to register new spare parts.');
      return;
    }
    setRawSpareParts((prev) => [newPart, ...prev]);
    const newNotif = {
      id: `NTF-${Date.now()}`,
      title: 'New Spare Component Registered',
      desc: `Component ${newPart.id} (${newPart.name}) added to stock inventory.`,
      time: 'Just now',
      type: 'info',
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleEditSparePart = (updatedPart) => {
    const canManageSpares = user?.role === ROLES.ADMIN || user?.role === ROLES.MECHANICAL_HEAD || user?.role === ROLES.ELECTRICAL_HEAD;
    if (!canManageSpares) {
      alert('Security Access Restriction: Only Department Heads and System Administrator have clearance to edit spare parts.');
      return;
    }
    setRawSpareParts((prev) =>
      prev.map((p) => (p.id === updatedPart.id ? updatedPart : p))
    );
  };

  const handleAdjustSparePartStock = (partId, mode, quantity, note) => {
    const canManageSpares = user?.role === ROLES.ADMIN || user?.role === ROLES.MECHANICAL_HEAD || user?.role === ROLES.ELECTRICAL_HEAD;
    if (!canManageSpares) {
      alert('Security Access Restriction: Only Department Heads and System Administrator have clearance to adjust spare parts inventory.');
      return;
    }
    setRawSpareParts((prev) =>
      prev.map((part) => {
        if (part.id === partId) {
          const newQty = mode === 'add' ? part.stockQuantity + quantity : Math.max(0, part.stockQuantity - quantity);
          let status = 'In Stock';
          if (newQty === 0) status = 'Out of Stock';
          else if (newQty <= part.minThreshold) status = 'Low Stock';
          return { ...part, stockQuantity: newQty, status };
        }
        return part;
      })
    );

    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title: mode === 'add' ? 'Spare Part Restocked' : 'Spare Part Stock Consumed',
        desc: `${quantity} unit(s) ${mode === 'add' ? 'added to' : 'drawn from'} component ${partId}.`,
        time: 'Just now',
        type: 'info',
        read: false
      },
      ...prev
    ]);
  };

  // Spare Parts Reorder Handler
  const handleReorderPart = (partId) => {
    handleAdjustSparePartStock(partId, 'add', 5, 'Quick reorder stock added.');
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Check tab permission
  const isTabAllowed = user ? hasTabPermission(user.role, activeTab) : false;

  const isSectorHead = user && [ROLES.PRODUCTION_HEAD, ROLES.MECHANICAL_HEAD, ROLES.ELECTRICAL_HEAD].includes(user.role);
  const isTechnician = user && [ROLES.MECHANICAL_TECH, ROLES.ELECTRICAL_TECH].includes(user.role);

  const isPendingApproval = user && user.role !== ROLES.ADMIN && (!user.isApproved || user.status === 'Pending Approval' || user.status === 'Rejected');

  if (!isLoggedIn) {
    return <LoginView onLogin={handleLogin} onRegisterUser={handleRegisterUser} />;
  }

  // If new user requires admin approval, show ONLY the Admin Approval Required screen (no data, no other options visible)
  if (isPendingApproval) {
    return (
      <PendingApprovalView
        user={user}
        onLogout={handleLogout}
        onCheckStatus={handleCheckApprovalStatus}
      />
    );
  }

  // Filter notifications relevant to active user's role and sector
  const roleNotifications = notifications.filter((n) => {
    if (!user) return true;
    // Strict target role routing: notifications targeted to department heads go ONLY to that head
    if (n.targetRole) {
      return n.targetRole === user.role;
    }
    if (user.role === ROLES.ADMIN) return true;
    if (n.sector) {
      return n.sector === user.sector || n.sector === 'All Plant Sectors';
    }
    return true;
  });

  return (
    <div className="app-container">
      {/* Role-Aware Collapsible Left Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        user={user}
        pendingApprovalCount={getPendingApprovalCountForUser(user)}
        openAlertsCount={rawAlerts.filter(a => a.status === 'Active' || a.status === 'Open').length}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Top Navigation Header */}
        <Header
          activeTab={activeTab}
          onOpenWorkOrderModal={() => setIsWorkOrderModalOpen(true)}
          notifications={roleNotifications}
          onMarkAllRead={handleMarkAllRead}
          user={user}
          onLogout={handleLogout}
          setMobileOpen={setMobileOpen}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />

        {/* View Pages Router & Access Protection Guard */}
        <main className="content-area">
          {!isTabAllowed ? (
            <UnauthorizedAccess
              userRole={user.title || user.role}
              onReturnHome={() => setActiveTab(ROLE_PERMISSIONS[user.role]?.defaultTab || 'sectors')}
            />
          ) : (
            <>
              {/* Dashboard Router based on Role */}
              {activeTab === 'dashboard' && (
                isSectorHead ? (
                  <SectorHeadDashboard
                    user={user}
                    assets={rawAssets}
                    workOrders={rawWorkOrders}
                    alerts={rawAlerts}
                    usersList={usersList}
                    onApproveUser={handleApproveUser}
                    onRejectUser={handleRejectUser}
                    onUpdateWOStatus={handleUpdateWOStatus}
                    onAssignTask={handleAssignTask}
                    onSendReminder={handleSendReminder}
                    onReviseDeadline={handleReviseDeadline}
                    onEscalateTask={handleEscalateTask}
                    onVerifyCloseTask={handleVerifyCloseTask}
                    onReopenTask={handleReopenTask}
                    onOpenWorkOrderModal={() => setIsWorkOrderModalOpen(true)}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                  />
                ) : isTechnician ? (
                  <TechnicianDashboard
                    user={user}
                    workOrders={rawWorkOrders}
                    onAcknowledgeTask={handleAcknowledgeTask}
                    onSubmitResolution={handleSubmitResolution}
                    onSelectAsset={(asset) => setSelectedAsset(asset)}
                  />
                ) : (
                  <OverviewDashboard
                    assets={roleAssets}
                    workOrders={roleWorkOrders}
                    alerts={roleAlerts}
                    onSelectAsset={handleSelectAsset}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                    onOpenAddMachineModal={() => setIsAddMachineModalOpen(true)}
                    onOpenWorkOrderModal={() => setIsWorkOrderModalOpen(true)}
                    onSelectSectorFilter={(sectorName) => setSectorFilterOverride(sectorName)}
                    pendingApprovalCount={getPendingApprovalCountForUser(user)}
                  />
                )
              )}

              {activeTab === 'sectors' && (
                <SectorsView
                  assets={rawAssets}
                  alerts={rawAlerts}
                  selectedSectorId={selectedSectorId}
                  onSelectSectorId={setSelectedSectorId}
                  onSelectAsset={handleSelectAsset}
                  onSelectSectorFilter={(sectorName) => setSectorFilterOverride(sectorName)}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onOpenAddMachineModal={() => setIsAddMachineModalOpen(true)}
                  userRole={user ? user.role : 'admin'}
                  currentUser={user}
                />
              )}

              {activeTab === 'departments' && (
                <DepartmentsView
                  assets={roleAssets}
                  workOrders={roleWorkOrders}
                  usersList={usersList}
                  spareParts={rawSpareParts}
                  onSelectAsset={handleSelectAsset}
                  onAssignTask={handleAssignTask}
                  onApproveUser={handleApproveUser}
                  onRejectUser={handleRejectUser}
                  onOpenWorkOrderModal={() => setIsWorkOrderModalOpen(true)}
                  userRole={user ? user.role : 'admin'}
                  currentUser={user}
                />
              )}

              {activeTab === 'assets' && (
                <EquipmentFleetView
                  assets={roleAssets}
                  onSelectAsset={handleSelectAsset}
                  onOpenWorkOrderModal={() => setIsWorkOrderModalOpen(true)}
                  onOpenAddMachineModal={() => setIsAddMachineModalOpen(true)}
                  onEditMachine={handleEditMachine}
                  onDeactivateMachine={handleDeactivateMachine}
                  userRole={user ? user.role : 'admin'}
                  initialSectorFilter={sectorFilterOverride}
                  currentUser={user}
                />
              )}

              {activeTab === 'alerts' && (
                <AlertsView
                  alerts={roleAlerts}
                  assets={roleAssets}
                  usersList={usersList}
                  onResolveAlert={handleResolveAlert}
                  onCreateAlert={handleCreateAlert}
                  onUpdateAlertStatus={handleUpdateAlertStatus}
                  onAcknowledgeAlert={handleAcknowledgeAlert}
                  onAssignAlert={handleAssignAlert}
                  onSendReminder={handleSendAlertReminder}
                  onReviseDeadline={handleReviseAlertDeadline}
                  onEscalateTask={handleEscalateAlert}
                  onVerifyCloseAlert={handleVerifyCloseAlert}
                  onReopenAlert={handleReopenAlert}
                  onCreateFollowUpAlert={handleCreateFollowUpAlert}
                  userRole={user ? user.role : 'admin'}
                  currentUser={user}
                />
              )}

              {activeTab === 'work-orders' && (
                isTechnician ? (
                  <TechnicianDashboard
                    user={user}
                    workOrders={rawWorkOrders}
                    onAcknowledgeTask={handleAcknowledgeTask}
                    onSubmitResolution={handleSubmitResolution}
                    onSelectAsset={handleSelectAsset}
                  />
                ) : (
                  <WorkOrdersView
                    workOrders={roleWorkOrders}
                    assets={roleAssets}
                    onUpdateWOStatus={handleUpdateWOStatus}
                    onOpenWorkOrderModal={() => setIsWorkOrderModalOpen(true)}
                    preventiveSchedules={rawPreventiveSchedules}
                    onCreatePreventiveSchedule={handleCreatePreventiveSchedule}
                    onCompletePreventiveTask={handleCompletePreventiveTask}
                    downtimeLogs={rawDowntimeLogs}
                    onRecordDowntime={handleRecordDowntime}
                    onSelectAsset={handleSelectAsset}
                    user={user}
                  />
                )
              )}

              {activeTab === 'users' && (
                <UsersManagementView
                  usersList={usersList}
                  currentUser={user}
                  onAddUser={handleRegisterUser}
                  onApproveUser={handleApproveUser}
                  onRejectUser={handleRejectUser}
                />
              )}

              {activeTab === 'reports' && (
                <ReportsView
                  assets={roleAssets}
                  alerts={roleAlerts}
                  workOrders={roleWorkOrders}
                  downtimeLogs={rawDowntimeLogs}
                  userRole={user ? user.role : 'admin'}
                  currentUser={user}
                />
              )}

              {activeTab === 'spare-parts' && (
                <SparePartsView
                  spareParts={rawSpareParts}
                  assets={roleAssets}
                  onAddPart={handleAddSparePart}
                  onEditPart={handleEditSparePart}
                  onAdjustStock={handleAdjustSparePartStock}
                  userRole={user ? user.role : 'admin'}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsView
                  assets={rawAssets}
                  alerts={rawAlerts}
                  workOrders={rawWorkOrders}
                  downtimeLogs={rawDowntimeLogs}
                  preventiveSchedules={rawPreventiveSchedules}
                  spareParts={rawSpareParts}
                  userRole={user ? user.role : 'admin'}
                />
              )}

              {activeTab === 'notifications' && (
                <NotificationsView
                  notifications={roleNotifications}
                  onMarkAllRead={handleMarkAllRead}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  userRole={user ? user.role : 'admin'}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsView user={user} />
              )}
            </>
          )}
        </main>

        {/* Footer with IndustrialCare Tagline Branding */}
        <footer style={{ padding: '1rem 2rem', textAlign: 'center', borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <strong>IndustrialCare</strong> — Smarter Maintenance. Better Productivity. © 2026 Plant Operations.
        </footer>
      </div>

      {/* Modals */}
      <AssetDetailsModal
        isOpen={Boolean(selectedAsset)}
        onClose={() => setSelectedAsset(null)}
        asset={selectedAsset ? (rawAssets.find((a) => a.id === selectedAsset.id) || selectedAsset) : null}
        alerts={rawAlerts}
        workOrders={rawWorkOrders}
        downtimeLogs={rawDowntimeLogs}
        spareParts={rawSpareParts}
        userRole={user ? user.role : 'admin'}
        currentUser={user}
        onWorkflowTransition={handleWorkflowTransition}
        onRequestMaintenanceAgain={handleRequestMaintenanceAgain}
        onCreateWorkOrder={handleAddWorkOrder}
        onEditMachine={handleEditMachine}
        onDeactivateMachine={handleDeactivateMachine}
        onSaveReadings={handleSaveReadings}
        onUpdateSimulationState={handleUpdateSimulationState}
      />

      <WorkOrderFormModal
        isOpen={isWorkOrderModalOpen}
        onClose={() => setIsWorkOrderModalOpen(false)}
        onSubmit={handleAddWorkOrder}
        assets={roleAssets}
      />

      <AddMachineModal
        isOpen={isAddMachineModalOpen}
        onClose={() => setIsAddMachineModalOpen(false)}
        onSubmit={handleAddMachine}
      />
    </div>
  );
}
