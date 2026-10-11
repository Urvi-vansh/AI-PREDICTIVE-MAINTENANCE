import React, { useState } from 'react';
import './styles/index.css';
import './styles/components.css';

import {
  MOCK_ASSETS,
  MOCK_WORK_ORDERS,
  MOCK_SENSORS,
  MOCK_NOTIFICATIONS,
  MOCK_ALERTS,
  MOCK_SPARE_PARTS,
  MOCK_PREVENTIVE_SCHEDULES,
  MOCK_DOWNTIME_LOGS
} from './mockData/industrialData';

import {
  DEMO_ACCOUNTS,
  ROLES,
  ROLE_PERMISSIONS,
  hasTabPermission,
  filterAssetsByRole,
  filterWorkOrdersByRole,
  filterSensorsByRole
} from './config/permissions';

import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { AssetDetailsModal } from './components/common/AssetDetailsModal';
import { WorkOrderFormModal } from './components/forms/WorkOrderFormModal';
import { AddMachineModal } from './components/forms/AddMachineModal';
import { UnauthorizedAccess } from './components/common/UnauthorizedAccess';

import { LoginView } from './components/views/LoginView';
import { OverviewDashboard } from './components/views/OverviewDashboard';
import { SectorHeadDashboard } from './components/views/SectorHeadDashboard';
import { TechnicianDashboard } from './components/views/TechnicianDashboard';

import { SectorsView } from './components/views/SectorsView';
import { EquipmentFleetView } from './components/views/EquipmentFleetView';
import { AlertsView } from './components/views/AlertsView';
import { WorkOrdersView } from './components/views/WorkOrdersView';
import { UsersManagementView } from './components/views/UsersManagementView';
import { SparePartsView } from './components/views/SparePartsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { NotificationsView } from './components/views/NotificationsView';
import { SettingsView } from './components/views/SettingsView';

export default function App() {
  // Auth state - default to logged out (Sign In page on initial load)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Navigation state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sectorFilterOverride, setSectorFilterOverride] = useState('All');

  // Raw Mock Data States
  const [rawAssets, setRawAssets] = useState(MOCK_ASSETS);
  const [rawWorkOrders, setRawWorkOrders] = useState(MOCK_WORK_ORDERS);
  const [rawSensors, setRawSensors] = useState(MOCK_SENSORS);
  const [rawAlerts, setRawAlerts] = useState(MOCK_ALERTS);
  const [rawSpareParts, setRawSpareParts] = useState(MOCK_SPARE_PARTS);
  const [rawPreventiveSchedules, setRawPreventiveSchedules] = useState(MOCK_PREVENTIVE_SCHEDULES);
  const [rawDowntimeLogs, setRawDowntimeLogs] = useState(MOCK_DOWNTIME_LOGS);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [usersList, setUsersList] = useState(DEMO_ACCOUNTS);

  // Modals state
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isWorkOrderModalOpen, setIsWorkOrderModalOpen] = useState(false);
  const [isAddMachineModalOpen, setIsAddMachineModalOpen] = useState(false);

  // Compute Role-Filtered Data
  const roleAssets = user ? filterAssetsByRole(rawAssets, user.role) : [];
  const roleWorkOrders = user ? filterWorkOrdersByRole(rawWorkOrders, user.role, rawAssets) : [];
  const roleSensors = user ? filterSensorsByRole(rawSensors, user.role, rawAssets) : [];

  // Auth Handlers
  const handleLogin = (userInfo) => {
    setUser(userInfo);
    setIsLoggedIn(true);
    const defaultTab = ROLE_PERMISSIONS[userInfo.role]?.defaultTab || 'dashboard';
    setActiveTab(defaultTab);
  };

  const handleRegisterUser = (newUser) => {
    setUsersList((prev) => [newUser, ...prev]);
    const newNotif = {
      id: `NTF-${Date.now()}`,
      title: 'New Account Registered',
      desc: `${newUser.name} registered as ${newUser.title} (${newUser.sector}). Welcome to IndustrialCare!`,
      time: 'Just now',
      type: 'info',
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  // Machine Management Handlers
  const handleAddMachine = (newMachine) => {
    setRawAssets((prev) => [newMachine, ...prev]);
    const newNotif = {
      id: `NTF-${Date.now()}`,
      title: 'New Machine Asset Registered',
      desc: `Asset ${newMachine.id} (${newMachine.name}) added to ${newMachine.sector}.`,
      time: 'Just now',
      type: 'info',
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleEditMachine = (updatedAsset) => {
    setRawAssets((prev) =>
      prev.map((ast) => (ast.id === updatedAsset.id ? updatedAsset : ast))
    );
    if (selectedAsset && selectedAsset.id === updatedAsset.id) {
      setSelectedAsset(updatedAsset);
    }
    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title: 'Machine Record Updated',
        desc: `Asset ${updatedAsset.id} (${updatedAsset.name}) profile updated.`,
        time: 'Just now',
        type: 'info',
        read: false
      },
      ...prev
    ]);
  };

  const handleDeactivateMachine = (assetId) => {
    setRawAssets((prev) =>
      prev.map((ast) => {
        if (ast.id === assetId) {
          const newStatus = ast.status === 'Offline' ? 'Operational' : 'Offline';
          const newHealth = newStatus === 'Offline' ? 0 : 90;
          return { ...ast, status: newStatus, healthScore: newHealth };
        }
        return ast;
      })
    );
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

  // Sector Head Actions
  const handleAssignTask = (taskId, techName) => {
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

  // Alert Handlers for Part 6
  const handleResolveAlert = (alertId) => {
    handleUpdateAlertStatus(alertId, 'Resolved', 'Resolved via quick action.');
  };

  const handleCreateAlert = (newAlert) => {
    setRawAlerts((prev) => [newAlert, ...prev]);
    const newNotif = {
      id: `NTF-${Date.now()}`,
      title: 'New Demo Failure Alert Created',
      desc: `Alert ${newAlert.id} (${newAlert.title}) routed to ${newAlert.sector}.`,
      time: 'Just now',
      type: newAlert.severity === 'Critical' ? 'critical' : 'warning',
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleUpdateAlertStatus = (alertId, newStatus, techNotes) => {
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
          return {
            ...alt,
            status: newStatus,
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
              action: 'Verified & Closed Incident',
              notes: feedback || 'Repair verified and approved by Sector Head.'
            }
          ];
          return { ...alt, status: 'Closed', auditTimeline: updatedTimeline };
        }
        return alt;
      })
    );

    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title: 'Incident Verified & Closed',
        desc: `Sector Head approved resolution for ${alertId}. Incident closed.`,
        time: 'Just now',
        type: 'info',
        read: false
      },
      ...prev
    ]);
  };

  const handleReopenAlert = (alertId, feedback) => {
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
              action: 'Reopened Incident',
              notes: feedback || 'Repair rejected; reopened for further technician servicing.'
            }
          ];
          return { ...alt, status: 'Reopened', auditTimeline: updatedTimeline };
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

  // Spare Parts Handlers for Part 7
  const handleAddSparePart = (newPart) => {
    setRawSpareParts((prev) => [newPart, ...prev]);
    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title: 'New Spare Component Registered',
        desc: `Component ${newPart.id} (${newPart.name}) added to stock inventory.`,
        time: 'Just now',
        type: 'info',
        read: false
      },
      ...prev
    ]);
  };

  const handleEditSparePart = (updatedPart) => {
    setRawSpareParts((prev) =>
      prev.map((p) => (p.id === updatedPart.id ? updatedPart : p))
    );
  };

  const handleAdjustSparePartStock = (partId, mode, quantity, note) => {
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

  if (!isLoggedIn) {
    return <LoginView onLogin={handleLogin} onRegisterUser={handleRegisterUser} />;
  }

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
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Top Navigation Header */}
        <Header
          activeTab={activeTab}
          onOpenWorkOrderModal={() => setIsWorkOrderModalOpen(true)}
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
          user={user}
          onLogout={handleLogout}
          setMobileOpen={setMobileOpen}
        />

        {/* View Pages Router & Access Protection Guard */}
        <main className="content-area">
          {!isTabAllowed ? (
            <UnauthorizedAccess
              userRole={user.title || user.role}
              onReturnHome={() => setActiveTab(ROLE_PERMISSIONS[user.role]?.defaultTab || 'dashboard')}
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
                    alerts={rawAlerts}
                    onSelectAsset={(asset) => setSelectedAsset(asset)}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                    onOpenAddMachineModal={() => setIsAddMachineModalOpen(true)}
                    onOpenWorkOrderModal={() => setIsWorkOrderModalOpen(true)}
                    onSelectSectorFilter={(sectorName) => setSectorFilterOverride(sectorName)}
                  />
                )
              )}

              {activeTab === 'sectors' && (
                <SectorsView
                  onSelectSectorFilter={(sectorName) => setSectorFilterOverride(sectorName)}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'assets' && (
                <EquipmentFleetView
                  assets={roleAssets}
                  onSelectAsset={(asset) => setSelectedAsset(asset)}
                  onOpenWorkOrderModal={() => setIsWorkOrderModalOpen(true)}
                  onOpenAddMachineModal={() => setIsAddMachineModalOpen(true)}
                  onEditMachine={handleEditMachine}
                  onDeactivateMachine={handleDeactivateMachine}
                  userRole={user ? user.role : 'admin'}
                  initialSectorFilter={sectorFilterOverride}
                />
              )}

              {activeTab === 'alerts' && (
                <AlertsView
                  alerts={rawAlerts.filter(a => user.role === ROLES.ADMIN ? true : a.sector === user.sector)}
                  onResolveAlert={handleResolveAlert}
                  onCreateAlert={handleCreateAlert}
                  onUpdateAlertStatus={handleUpdateAlertStatus}
                  onSendReminder={handleSendAlertReminder}
                  onReviseDeadline={handleReviseAlertDeadline}
                  onEscalateTask={handleEscalateAlert}
                  onVerifyCloseAlert={handleVerifyCloseAlert}
                  onReopenAlert={handleReopenAlert}
                  userRole={user ? user.role : 'admin'}
                />
              )}

              {activeTab === 'work-orders' && (
                isTechnician ? (
                  <TechnicianDashboard
                    user={user}
                    workOrders={rawWorkOrders}
                    onAcknowledgeTask={handleAcknowledgeTask}
                    onSubmitResolution={handleSubmitResolution}
                    onSelectAsset={(asset) => setSelectedAsset(asset)}
                  />
                ) : (
                  <WorkOrdersView
                    workOrders={roleWorkOrders}
                    onUpdateWOStatus={handleUpdateWOStatus}
                    onOpenWorkOrderModal={() => setIsWorkOrderModalOpen(true)}
                    preventiveSchedules={rawPreventiveSchedules}
                    onCreatePreventiveSchedule={handleCreatePreventiveSchedule}
                    onCompletePreventiveTask={handleCompletePreventiveTask}
                    downtimeLogs={rawDowntimeLogs}
                    onRecordDowntime={handleRecordDowntime}
                    user={user}
                  />
                )
              )}

              {activeTab === 'users' && (
                <UsersManagementView
                  usersList={usersList}
                  onAddUser={handleRegisterUser}
                />
              )}

              {activeTab === 'spare-parts' && (
                <SparePartsView
                  spareParts={rawSpareParts}
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
                />
              )}

              {activeTab === 'notifications' && (
                <NotificationsView
                  notifications={notifications}
                  onMarkAllRead={handleMarkAllRead}
                  onNavigateTab={(tab) => setActiveTab(tab)}
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
        asset={selectedAsset}
        alerts={rawAlerts}
        workOrders={rawWorkOrders}
        downtimeLogs={rawDowntimeLogs}
        spareParts={rawSpareParts}
        userRole={user ? user.role : 'admin'}
        onEditMachine={handleEditMachine}
        onDeactivateMachine={handleDeactivateMachine}
        onSaveReadings={handleSaveReadings}
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
