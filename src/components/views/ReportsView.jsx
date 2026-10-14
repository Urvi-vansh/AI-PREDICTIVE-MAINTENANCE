import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import {
  BarChart3,
  Download,
  Building2,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  PowerOff,
  FileSpreadsheet,
  Clock,
  Activity,
  Layers,
  Wrench,
  Zap,
  Filter,
  Calendar,
  ShieldAlert,
  Search
} from 'lucide-react';
import { exportToCSV } from '../../utils/csvExport';
import { isSectorAllowedForUser, ROLES } from '../../config/permissions';

export const ReportsView = ({
  assets = [],
  alerts = [],
  workOrders = [],
  downtimeLogs = [],
  userRole = 'admin',
  currentUser = null
}) => {
  const [activeReportTab, setActiveReportTab] = useState('overview'); // 'overview', 'alerts', 'overdue', 'completed', 'downtime', 'history'
  const [sectorFilter, setSectorFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const allSectors = [
    { name: 'Sector 1', title: 'Sector 1 (Production & Manufacturing)' },
    { name: 'Sector 2', title: 'Sector 2 (Heavy Machining & Fabrication)' },
    { name: 'Sector 3', title: 'Sector 3 (Assembly & Packaging)' },
    { name: 'Sector 4', title: 'Sector 4 (Material Handling & Logistics)' }
  ];

  // RBAC Filter: Sector Heads can only view their designated sector
  const standardSectors = allSectors.filter(
    (sec) => !currentUser || currentUser.role === ROLES.ADMIN || isSectorAllowedForUser(sec.title, currentUser)
  );

  // Filtered Assets based on user filters
  const filteredAssets = assets.filter((a) => {
    const matchesSector = sectorFilter === 'All' || a.sector === sectorFilter || (a.sector && a.sector.startsWith(sectorFilter.split(' ')[0]));
    const matchesDept = deptFilter === 'All' || a.department === deptFilter || (a.department && a.department.toLowerCase().includes(deptFilter.toLowerCase().replace(' department', '')));
    return matchesSector && matchesDept;
  });

  // Filtered Alerts based on user filters
  const filteredAlerts = alerts.filter((alt) => {
    const matchesSector = sectorFilter === 'All' || alt.sector === sectorFilter || (alt.sector && alt.sector.startsWith(sectorFilter.split(' ')[0]));
    const matchesDept = deptFilter === 'All' || alt.department === deptFilter;
    const matchesDate = (!startDate || (alt.createdTime || alt.date) >= startDate) && (!endDate || (alt.createdTime || alt.date) <= endDate);
    return matchesSector && matchesDept && matchesDate;
  });

  // Filtered Work Orders based on user filters
  const filteredWorkOrders = workOrders.filter((wo) => {
    const matchesSector = sectorFilter === 'All' || wo.sector === sectorFilter || (wo.sector && wo.sector.startsWith(sectorFilter.split(' ')[0]));
    const matchesDept = deptFilter === 'All' || wo.department === deptFilter || wo.assignedDepartment === deptFilter;
    const matchesDate = (!startDate || (wo.createdAt || '') >= startDate) && (!endDate || (wo.createdAt || '') <= endDate);
    return matchesSector && matchesDept && matchesDate;
  });

  // Filtered Downtime Logs based on user filters
  const filteredDowntime = downtimeLogs.filter((log) => {
    const matchesSector = sectorFilter === 'All' || log.sector === sectorFilter || (log.sector && log.sector.startsWith(sectorFilter.split(' ')[0]));
    const matchesDept = deptFilter === 'All' || log.department === deptFilter;
    const matchesDate = (!startDate || (log.startTime || '') >= startDate) && (!endDate || (log.startTime || '') <= endDate);
    return matchesSector && matchesDept && matchesDate;
  });

  // 1. Machine Status Summaries
  const totalMachines = filteredAssets.length;
  const totalOperational = filteredAssets.filter((a) => a.status === 'Operational').length;
  const totalWarning = filteredAssets.filter((a) => a.status === 'Warning' || a.status === 'Maintenance Required').length;
  const totalCritical = filteredAssets.filter((a) => a.status === 'Critical').length;
  const totalOffline = filteredAssets.filter((a) => a.status === 'Offline').length;
  const overallHealthIndex = totalMachines > 0 ? Math.round((totalOperational / totalMachines) * 100) : 100;

  // Sector breakdown report
  const sectorReport = standardSectors.map((sec) => {
    const secAssets = filteredAssets.filter(
      (a) => a.sector === sec.title || (a.sector && a.sector.startsWith(sec.name))
    );
    const total = secAssets.length;
    const operational = secAssets.filter((a) => a.status === 'Operational').length;
    const warning = secAssets.filter((a) => a.status === 'Warning' || a.status === 'Maintenance Required').length;
    const critical = secAssets.filter((a) => a.status === 'Critical').length;
    const offline = secAssets.filter((a) => a.status === 'Offline').length;
    const healthIndex = total > 0 ? Math.round((operational / total) * 100) : 100;

    return {
      name: sec.name,
      total,
      operational,
      warning,
      critical,
      offline,
      healthIndex
    };
  });

  // 2. Alert Counts & Metrics
  const totalAlertsCount = filteredAlerts.length;
  const criticalAlertsCount = filteredAlerts.filter((a) => a.severity === 'Critical').length;
  const warningAlertsCount = filteredAlerts.filter((a) => a.severity === 'Warning').length;
  const resolvedAlertsCount = filteredAlerts.filter((a) => a.status === 'Resolved' || a.status === 'Closed').length;

  // 3. Overdue Maintenance
  const overdueWorkOrders = filteredWorkOrders.filter(
    (wo) => wo.status !== 'Closed' && wo.dueDate && new Date(wo.dueDate) < new Date()
  );

  // 4. Completed Work Orders & Productivity
  const completedWorkOrders = filteredWorkOrders.filter(
    (wo) => wo.status === 'Closed' || wo.status === 'Verified and Resolved'
  );
  const totalLaborHoursLogged = completedWorkOrders.reduce((acc, wo) => acc + (Number(wo.laborHours) || 0), 0);

  // 5. Downtime Analytics
  const totalDowntimeHoursLogged = filteredDowntime.reduce((acc, log) => acc + (Number(log.downtimeHours) || 0), 0);
  const ongoingDowntimeCount = filteredDowntime.filter((log) => log.status === 'Ongoing').length;

  // 6. Maintenance History Log (Aggregated from Work Orders Audit Timelines)
  const maintenanceHistoryEntries = [];
  filteredWorkOrders.forEach((wo) => {
    if (Array.isArray(wo.auditTimeline)) {
      wo.auditTimeline.forEach((audit) => {
        maintenanceHistoryEntries.push({
          ticketId: wo.id,
          machineId: wo.assetId,
          machineName: wo.assetName,
          sector: wo.sector,
          department: wo.assignedDepartment || wo.department,
          timestamp: audit.timestamp || wo.createdAt,
          action: audit.action || audit.status,
          user: audit.user || 'Personnel',
          role: audit.role || 'Maintenance',
          reason: audit.reason || wo.description
        });
      });
    }
  });
  // Sort chronological descending
  maintenanceHistoryEntries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // CSV Export Handlers (Strictly exports filtered records)
  const handleExportFleet = () => {
    exportToCSV('Plant_Machinery_Fleet_Report', filteredAssets, [
      { label: 'Machine ID', accessor: (r) => r.id },
      { label: 'Machine Name', accessor: (r) => r.name },
      { label: 'Sector', accessor: (r) => r.sector },
      { label: 'Department', accessor: (r) => r.department },
      { label: 'Location', accessor: (r) => r.location },
      { label: 'Operational Status', accessor: (r) => r.status },
      { label: 'Health Score', accessor: (r) => r.healthScore },
      { label: 'RPM', accessor: (r) => r.readings?.rpm || '' },
      { label: 'Temp (C)', accessor: (r) => r.readings?.temperature || '' },
      { label: 'Vibration (mm/s)', accessor: (r) => r.readings?.vibration || '' },
      { label: 'Current (A)', accessor: (r) => r.readings?.current || '' },
      { label: 'Data Source', accessor: (r) => r.dataSource || 'Simulated Telemetry' },
      { label: 'Last Updated', accessor: (r) => r.lastUpdated || '' }
    ]);
  };

  const handleExportAlerts = () => {
    exportToCSV('Incident_Alerts_Report', filteredAlerts, [
      { label: 'Alert ID', accessor: (r) => r.id },
      { label: 'Title', accessor: (r) => r.title },
      { label: 'Machine ID', accessor: (r) => r.machineId },
      { label: 'Machine Name', accessor: (r) => r.machineName },
      { label: 'Sector', accessor: (r) => r.sector },
      { label: 'Department', accessor: (r) => r.department },
      { label: 'Alert Source', accessor: (r) => r.alertSource || '' },
      { label: 'Risk Rating', accessor: (r) => r.risk || '' },
      { label: 'Severity', accessor: (r) => r.severity },
      { label: 'Status', accessor: (r) => r.status },
      { label: 'Assigned Tech', accessor: (r) => r.assignedTech || 'Unassigned' },
      { label: 'Created Time', accessor: (r) => r.createdTime || r.date },
      { label: 'Target Deadline', accessor: (r) => r.deadline || '' },
      { label: 'Overdue Flag', accessor: (r) => (r.overdue ? 'YES' : 'NO') }
    ]);
  };

  const handleExportOverdue = () => {
    exportToCSV('Overdue_Maintenance_Report', overdueWorkOrders, [
      { label: 'Work Order ID', accessor: (r) => r.id },
      { label: 'Machine ID', accessor: (r) => r.assetId },
      { label: 'Machine Name', accessor: (r) => r.assetName },
      { label: 'Sector', accessor: (r) => r.sector },
      { label: 'Department', accessor: (r) => r.assignedDepartment || r.department },
      { label: 'Priority', accessor: (r) => r.priority },
      { label: 'Target Due Date', accessor: (r) => r.dueDate },
      { label: 'Status', accessor: (r) => r.status },
      { label: 'Assigned Specialist', accessor: (r) => r.assignedTech || 'Unassigned' },
      { label: 'Description', accessor: (r) => r.description }
    ]);
  };

  const handleExportCompleted = () => {
    exportToCSV('Completed_Work_Orders_Report', completedWorkOrders, [
      { label: 'Work Order ID', accessor: (r) => r.id },
      { label: 'Machine ID', accessor: (r) => r.assetId },
      { label: 'Machine Name', accessor: (r) => r.assetName },
      { label: 'Sector', accessor: (r) => r.sector },
      { label: 'Department', accessor: (r) => r.assignedDepartment || r.department },
      { label: 'Maintenance Type', accessor: (r) => r.type },
      { label: 'Resolved Date', accessor: (r) => r.resolvedAt || r.createdAt },
      { label: 'Resolution Period', accessor: (r) => r.resolutionPeriod || 'Completed' },
      { label: 'Labor Hours Logged', accessor: (r) => r.laborHours || 0 },
      { label: 'Replaced Parts', accessor: (r) => (r.replacedParts ? r.replacedParts.join('; ') : '') },
      { label: 'Verified By', accessor: (r) => r.verifiedBy || 'Sector Head' },
      { label: 'Technician Notes', accessor: (r) => r.technicianNotes || '' }
    ]);
  };

  const handleExportDowntime = () => {
    exportToCSV('Machine_Downtime_Incidents_Report', filteredDowntime, [
      { label: 'Downtime ID', accessor: (r) => r.id },
      { label: 'Machine ID', accessor: (r) => r.machineId },
      { label: 'Machine Name', accessor: (r) => r.machineName },
      { label: 'Sector', accessor: (r) => r.sector },
      { label: 'Department', accessor: (r) => r.department },
      { label: 'Stoppage Reason', accessor: (r) => r.reason },
      { label: 'Status', accessor: (r) => r.status },
      { label: 'Downtime Hours', accessor: (r) => r.downtimeHours || 0 },
      { label: 'Start Time', accessor: (r) => r.startTime || '' },
      { label: 'End Time', accessor: (r) => r.endTime || '' },
      { label: 'Notes', accessor: (r) => r.notes || '' }
    ]);
  };

  return (
    <div>
      {/* Header Info & Export Buttons Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
            Operational Reports & Export Center
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Live machine status summaries, alert counts, overdue maintenance, downtime tracking, & CSV exports
          </p>
        </div>

        {/* Multi-Export Actions */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={handleExportAlerts} title="Export filtered alerts to CSV">
            <Download size={14} /> Alerts CSV
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleExportOverdue} title="Export overdue maintenance to CSV">
            <Download size={14} /> Overdue CSV
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleExportCompleted} title="Export completed work orders to CSV">
            <Download size={14} /> Completed CSV
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleExportDowntime} title="Export downtime logs to CSV">
            <Download size={14} /> Downtime CSV
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleExportFleet} title="Export full machine fleet to CSV">
            <FileSpreadsheet size={14} /> Export Fleet CSV
          </button>
        </div>
      </div>

      {/* Global Filter Toolbar: Sector, Department, Date Range */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          {/* Sector Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Sector:</span>
            <select
              className="form-control form-select"
              style={{ width: '180px', fontSize: '0.825rem' }}
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
            >
              <option value="All">All Sectors</option>
              {standardSectors.map((s) => (
                <option key={s.name} value={s.title}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Department:</span>
            <select
              className="form-control form-select"
              style={{ width: '180px', fontSize: '0.825rem' }}
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="All">All Departments</option>
              <option value="Mechanical Department">Mechanical Department</option>
              <option value="Electrical Department">Electrical Department</option>
            </select>
          </div>

          {/* Date Range Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>From:</span>
            <input
              type="date"
              className="form-control"
              style={{ width: '135px', fontSize: '0.825rem', padding: '0.35rem 0.5rem' }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>To:</span>
            <input
              type="date"
              className="form-control"
              style={{ width: '135px', fontSize: '0.825rem', padding: '0.35rem 0.5rem' }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {(sectorFilter !== 'All' || deptFilter !== 'All' || startDate || endDate) && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSectorFilter('All');
                setDeptFilter('All');
                setStartDate('');
                setEndDate('');
              }}
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </Card>

      {/* Report Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          className={`btn btn-sm ${activeReportTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveReportTab('overview')}
        >
          <Layers size={14} /> Machine Status Summaries
        </button>
        <button
          className={`btn btn-sm ${activeReportTab === 'alerts' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveReportTab('alerts')}
        >
          <Activity size={14} /> Alert Counts & Incidents ({totalAlertsCount})
        </button>
        <button
          className={`btn btn-sm ${activeReportTab === 'overdue' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveReportTab('overdue')}
        >
          <Clock size={14} /> Overdue Maintenance ({overdueWorkOrders.length})
        </button>
        <button
          className={`btn btn-sm ${activeReportTab === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveReportTab('completed')}
        >
          <CheckCircle2 size={14} /> Completed Work Orders ({completedWorkOrders.length})
        </button>
        <button
          className={`btn btn-sm ${activeReportTab === 'downtime' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveReportTab('downtime')}
        >
          <PowerOff size={14} /> Downtime Analytics ({filteredDowntime.length})
        </button>
        <button
          className={`btn btn-sm ${activeReportTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveReportTab('history')}
        >
          <Calendar size={14} /> Maintenance History Log ({maintenanceHistoryEntries.length})
        </button>
      </div>

      {/* 1. MACHINE STATUS SUMMARIES */}
      {activeReportTab === 'overview' && (
        <div>
          {/* Summary KPI Cards Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Plant Machinery</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>{totalMachines}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Overall Health: <strong>{overallHealthIndex}%</strong></div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--status-success-text)' }}>Operational Status</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-success-text)', marginTop: '0.2rem' }}>{totalOperational}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{Math.round((totalOperational / (totalMachines || 1)) * 100)}% of active plant fleet</div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--status-warning-text)' }}>Warning Status</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-warning-text)', marginTop: '0.2rem' }}>{totalWarning}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Require preventive inspection</div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--status-danger-text)' }}>Critical Status</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-danger-text)', marginTop: '0.2rem' }}>{totalCritical}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Immediate repair required</div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--status-offline-text)' }}>Offline Equipment</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-offline-text)', marginTop: '0.2rem' }}>{totalOffline}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Deactivated / scheduled overhaul</div>
            </div>
          </div>

          {/* Sector Breakdown Table */}
          <Card title="Sector Operational Health & Machinery Breakdown">
            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Industry Sector</th>
                    <th>Total Machines</th>
                    <th>Operational</th>
                    <th>Warning</th>
                    <th>Critical</th>
                    <th>Offline</th>
                    <th>Health Index</th>
                  </tr>
                </thead>
                <tbody>
                  {sectorReport.map((sec) => (
                    <tr key={sec.name}>
                      <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{sec.name}</td>
                      <td style={{ fontWeight: 800 }}>{sec.total}</td>
                      <td>
                        <span style={{ color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          <CheckCircle2 size={14} /> {sec.operational}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: '#ca8a04', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          <AlertTriangle size={14} /> {sec.warning}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: '#dc2626', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          <XCircle size={14} /> {sec.critical}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: '#64748b', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          <PowerOff size={14} /> {sec.offline}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: 80, height: 6, backgroundColor: 'var(--bg-secondary)', borderRadius: 3, overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${sec.healthIndex}%`,
                                height: '100%',
                                backgroundColor: sec.healthIndex >= 80 ? '#16a34a' : sec.healthIndex >= 60 ? '#ca8a04' : '#dc2626'
                              }}
                            />
                          </div>
                          <strong style={{ fontSize: '0.825rem' }}>{sec.healthIndex}%</strong>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* 2. ALERT COUNTS & INCIDENTS */}
      {activeReportTab === 'alerts' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Failure Alerts</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>{totalAlertsCount}</div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--status-danger-border)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--status-danger-text)' }}>Critical Severity</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-danger-text)', marginTop: '0.2rem' }}>{criticalAlertsCount}</div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--status-warning-border)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--status-warning-text)' }}>Warning Deviations</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-warning-text)', marginTop: '0.2rem' }}>{warningAlertsCount}</div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--status-success-border)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--status-success-text)' }}>Resolved & Closed</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a', marginTop: '0.2rem' }}>{resolvedAlertsCount}</div>
            </div>
          </div>

          <Card title="Telemetry Anomaly Incidents Log">
            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Alert ID & Headline</th>
                    <th>Source & Risk Rating</th>
                    <th>Target Machine</th>
                    <th>Sector & Dept</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Target Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAlerts.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No alerts match the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAlerts.map((alt) => (
                      <tr key={alt.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.85rem' }}>{alt.title}</div>
                          <div style={{ fontSize: '0.725rem', color: 'var(--primary-600)', fontFamily: 'monospace' }}>{alt.id}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{alt.alertSource || 'IoT Stream'}</div>
                          <div style={{ fontSize: '0.725rem', color: alt.severity === 'Critical' ? '#dc2626' : 'var(--status-warning-dark)' }}>{alt.risk || alt.severity}</div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, color: 'var(--primary-700)', fontSize: '0.825rem' }}>{alt.machineId}</span>
                          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{alt.machineName}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.8rem' }}>{alt.sector}</div>
                          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{alt.department}</div>
                        </td>
                        <td>
                          <span className={`badge ${alt.severity === 'Critical' ? 'badge-critical' : alt.severity === 'Warning' ? 'badge-warning' : 'badge-info'}`}>
                            {alt.severity}
                          </span>
                        </td>
                        <td>
                          <Badge status={alt.status} />
                        </td>
                        <td>
                          <div style={{ fontSize: '0.775rem' }}>{alt.deadline || 'N/A'}</div>
                          {alt.overdue && (
                            <span className="badge badge-critical" style={{ fontSize: '0.65rem' }}>
                              OVERDUE
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* 3. OVERDUE MAINTENANCE */}
      {activeReportTab === 'overdue' && (
        <div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--status-danger-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--status-danger-border)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldAlert size={24} style={{ color: 'var(--status-danger-text)', flexShrink: 0 }} />
            <div>
              <strong style={{ fontSize: '0.95rem', color: 'var(--status-danger-text)' }}>
                {overdueWorkOrders.length} Overdue Maintenance Requests Require Immediate Attention
              </strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '0.15rem' }}>
                These tickets exceeded their compliance resolution deadline without closure. Sector Heads can revise deadlines with mandatory justification or dispatch escalated follow-ups.
              </div>
            </div>
          </div>

          <Card title="Overdue Maintenance Tickets">
            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Work Order ID</th>
                    <th>Target Machine</th>
                    <th>Sector Location</th>
                    <th>Department</th>
                    <th>Priority</th>
                    <th>Due Date & Expired</th>
                    <th>Assigned Specialist</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueWorkOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: '#16a34a', fontWeight: 600 }}>
                        <CheckCircle2 size={32} style={{ display: 'block', margin: '0 auto 0.5rem', color: '#16a34a' }} />
                        Zero Overdue Maintenance Tasks! All plant requests are within compliance windows.
                      </td>
                    </tr>
                  ) : (
                    overdueWorkOrders.map((wo) => {
                      const daysOverdue = Math.floor((new Date() - new Date(wo.dueDate)) / (1000 * 60 * 60 * 24));
                      return (
                        <tr key={wo.id}>
                          <td>
                            <div style={{ fontWeight: 700, color: 'var(--primary-600)', fontFamily: 'monospace' }}>{wo.id}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{wo.type}</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.825rem' }}>{wo.assetName}</div>
                            <div style={{ fontSize: '0.725rem', color: 'var(--primary-600)', fontFamily: 'monospace' }}>{wo.assetId}</div>
                          </td>
                          <td>{wo.sector}</td>
                          <td>{wo.assignedDepartment || wo.department}</td>
                          <td>
                            <span className="badge badge-critical">{wo.priority}</span>
                          </td>
                          <td>
                            <div style={{ color: '#dc2626', fontWeight: 700, fontSize: '0.825rem' }}>{wo.dueDate}</div>
                            <span className="badge badge-critical" style={{ fontSize: '0.65rem' }}>
                              {daysOverdue > 0 ? `${daysOverdue} days overdue` : 'Overdue today'}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>{wo.assignedTech || 'Unassigned'}</span>
                          </td>
                          <td>
                            <Badge status={wo.status} />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* 4. COMPLETED WORK ORDERS */}
      {activeReportTab === 'completed' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completed Work Orders</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a', marginTop: '0.2rem' }}>{completedWorkOrders.length}</div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Labor Hours Logged</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-600)', marginTop: '0.2rem' }}>{totalLaborHoursLogged} hrs</div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Avg Labor per Ticket</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                {completedWorkOrders.length > 0 ? (totalLaborHoursLogged / completedWorkOrders.length).toFixed(1) : 0} hrs
              </div>
            </div>
          </div>

          <Card title="Completed Maintenance Archive">
            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Work Order ID</th>
                    <th>Target Machine</th>
                    <th>Maintenance Type</th>
                    <th>Resolution Period</th>
                    <th>Labor Hours</th>
                    <th>Replaced Parts</th>
                    <th>Verified By</th>
                  </tr>
                </thead>
                <tbody>
                  {completedWorkOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No completed work orders match the filter criteria.
                      </td>
                    </tr>
                  ) : (
                    completedWorkOrders.map((wo) => (
                      <tr key={wo.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--primary-600)', fontFamily: 'monospace' }}>{wo.id}</div>
                          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{wo.resolvedAt || wo.createdAt}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, fontSize: '0.825rem', color: 'var(--text-main)' }}>{wo.assetName}</div>
                          <div style={{ fontSize: '0.725rem', color: 'var(--primary-600)', fontFamily: 'monospace' }}>{wo.assetId}</div>
                        </td>
                        <td>{wo.type}</td>
                        <td>
                          <span style={{ color: '#16a34a', fontWeight: 600, fontSize: '0.825rem' }}>
                            {wo.resolutionPeriod || 'Completed'}
                          </span>
                        </td>
                        <td>
                          <strong style={{ fontSize: '0.85rem' }}>{wo.laborHours ? `${wo.laborHours} hrs` : 'N/A'}</strong>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                            {wo.replacedParts && wo.replacedParts.length > 0 ? wo.replacedParts.join(', ') : 'None'}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{wo.verifiedBy || 'Sector Head'}</div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* 5. DOWNTIME ANALYTICS */}
      {activeReportTab === 'downtime' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Plant Stoppages</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>{filteredDowntime.length}</div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--status-danger-border)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--status-danger-text)' }}>Cumulative Downtime</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-danger-text)', marginTop: '0.2rem' }}>{totalDowntimeHoursLogged.toFixed(1)} hrs</div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--status-warning-border)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--status-warning-text)' }}>Ongoing Stoppages</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-warning-text)', marginTop: '0.2rem' }}>{ongoingDowntimeCount}</div>
            </div>
          </div>

          <Card title="Machine Stoppage & Downtime Incidents">
            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Downtime ID</th>
                    <th>Target Machine</th>
                    <th>Sector & Dept</th>
                    <th>Stoppage Reason</th>
                    <th>Hours Offline</th>
                    <th>Status</th>
                    <th>Start Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDowntime.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No downtime incidents logged.
                      </td>
                    </tr>
                  ) : (
                    filteredDowntime.map((log) => (
                      <tr key={log.id}>
                        <td>
                          <span style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary-600)' }}>{log.id}</span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, fontSize: '0.825rem', color: 'var(--text-main)' }}>{log.machineName}</div>
                          <div style={{ fontSize: '0.725rem', color: 'var(--primary-600)', fontFamily: 'monospace' }}>{log.machineId}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.8rem' }}>{log.sector}</div>
                          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{log.department}</div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>{log.reason}</span>
                        </td>
                        <td>
                          <strong style={{ fontSize: '0.875rem', color: '#dc2626' }}>{log.downtimeHours} hrs</strong>
                        </td>
                        <td>
                          <span className={`badge ${log.status === 'Ongoing' ? 'badge-critical' : 'badge-success'}`}>
                            {log.status}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{log.startTime}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* 6. MAINTENANCE HISTORY LOG */}
      {activeReportTab === 'history' && (
        <Card title={`Chronological Maintenance History Audit (${maintenanceHistoryEntries.length} Events)`}>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Ticket & Machine</th>
                  <th>Action / Workflow Transition</th>
                  <th>Actor & Functional Role</th>
                  <th>Justification / Technical Notes</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceHistoryEntries.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No maintenance audit entries recorded yet.
                    </td>
                  </tr>
                ) : (
                  maintenanceHistoryEntries.map((item, idx) => (
                    <tr key={`${item.ticketId}-${idx}`}>
                      <td>
                        <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{item.timestamp}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--primary-600)', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                          {item.ticketId}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>
                          {item.machineName} ({item.machineId})
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, fontSize: '0.825rem', color: 'var(--text-main)' }}>
                          {item.action}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{item.user}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{item.role}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                          {item.reason}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
