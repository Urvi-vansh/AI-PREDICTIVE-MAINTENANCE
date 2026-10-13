import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import {
  BarChart3,
  Download,
  TrendingUp,
  ShieldCheck,
  Clock,
  FileSpreadsheet,
  Building2,
  Calendar,
  AlertTriangle,
  Wrench,
  Package,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { exportToCSV } from '../../utils/csvExport';

export const AnalyticsView = ({
  assets = [],
  alerts = [],
  workOrders = [],
  downtimeLogs = [],
  preventiveSchedules = [],
  spareParts = [],
  userRole = 'admin'
}) => {
  const [selectedReportTab, setSelectedReportTab] = useState('failures');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [dateRange, setDateRange] = useState('30d');

  const isAdmin = userRole === 'admin';

  // Filter raw data by sector
  const filteredAssets = assets.filter(a => sectorFilter === 'All' || a.sector === sectorFilter);
  const filteredAlerts = alerts.filter(a => sectorFilter === 'All' || a.sector === sectorFilter);
  const filteredWorkOrders = workOrders.filter(w => sectorFilter === 'All' || w.sector === sectorFilter);
  const filteredDowntimes = downtimeLogs.filter(d => sectorFilter === 'All' || d.sector === sectorFilter);
  const filteredPreventive = preventiveSchedules.filter(p => sectorFilter === 'All' || p.sector === sectorFilter);

  // Compute Metrics
  const totalFailures = filteredAlerts.length;
  const criticalFailures = filteredAlerts.filter(a => a.severity === 'Critical').length;
  const resolvedIncidents = filteredAlerts.filter(a => a.status === 'Resolved' || a.status === 'Closed').length;
  const overdueTasks = filteredWorkOrders.filter(w => new Date(w.dueDate) < new Date() && w.status !== 'Completed').length;
  const totalDowntimeHours = filteredDowntimes.reduce((acc, d) => acc + (d.downtimeHours || 0), 0);
  const preventiveOnTime = filteredPreventive.filter(p => p.status === 'Upcoming' || p.status === 'Completed').length;
  const preventiveCompliancePct = filteredPreventive.length > 0 ? Math.round((preventiveOnTime / filteredPreventive.length) * 100) : 0;
  const lowStockPartsCount = spareParts.filter(p => p.stockQuantity <= p.minThreshold).length;

  // CSV Export Handlers
  const handleExportCSV = () => {
    if (selectedReportTab === 'failures') {
      exportToCSV('IndustrialCare_Failures_Report', filteredAlerts, [
        { label: 'Alert ID', accessor: (r) => r.id },
        { label: 'Title', accessor: (r) => r.title },
        { label: 'Machine ID', accessor: (r) => r.machineId },
        { label: 'Machine Name', accessor: (r) => r.machineName },
        { label: 'Sector', accessor: (r) => r.sector },
        { label: 'Department', accessor: (r) => r.department },
        { label: 'Severity', accessor: (r) => r.severity },
        { label: 'Status', accessor: (r) => r.status },
        { label: 'Logged Time', accessor: (r) => r.createdTime || r.date },
        { label: 'Assigned Tech', accessor: (r) => r.assignedTech }
      ]);
    } else if (selectedReportTab === 'downtime') {
      exportToCSV('IndustrialCare_Downtime_Report', filteredDowntimes, [
        { label: 'Log ID', accessor: (r) => r.id },
        { label: 'Machine ID', accessor: (r) => r.machineId },
        { label: 'Machine Name', accessor: (r) => r.machineName },
        { label: 'Sector', accessor: (r) => r.sector },
        { label: 'Start Time', accessor: (r) => r.startTime },
        { label: 'End Time', accessor: (r) => r.endTime },
        { label: 'Duration (Hrs)', accessor: (r) => r.downtimeHours },
        { label: 'Reason', accessor: (r) => r.reason },
        { label: 'Status', accessor: (r) => r.status }
      ]);
    } else if (selectedReportTab === 'preventive') {
      exportToCSV('IndustrialCare_Preventive_Maintenance_Report', filteredPreventive, [
        { label: 'Schedule ID', accessor: (r) => r.id },
        { label: 'Title', accessor: (r) => r.title },
        { label: 'Machine Name', accessor: (r) => r.machineName },
        { label: 'Sector', accessor: (r) => r.sector },
        { label: 'Frequency', accessor: (r) => r.frequency },
        { label: 'Next Due Date', accessor: (r) => r.nextDueDate },
        { label: 'Assigned Tech', accessor: (r) => r.assignedTech },
        { label: 'Status', accessor: (r) => r.status }
      ]);
    } else if (selectedReportTab === 'spare-parts') {
      exportToCSV('IndustrialCare_Spare_Parts_Report', spareParts, [
        { label: 'Part ID', accessor: (r) => r.id },
        { label: 'Part Name', accessor: (r) => r.name },
        { label: 'Category', accessor: (r) => r.category },
        { label: 'Compatible Machine', accessor: (r) => r.compatibleMachine },
        { label: 'Stock Quantity', accessor: (r) => r.stockQuantity },
        { label: 'Min Threshold', accessor: (r) => r.minThreshold },
        { label: 'Unit Price', accessor: (r) => r.unitPrice },
        { label: 'Status', accessor: (r) => r.status }
      ]);
    } else {
      exportToCSV('IndustrialCare_Work_Orders_Report', filteredWorkOrders, [
        { label: 'Ticket ID', accessor: (r) => r.id },
        { label: 'Machine ID', accessor: (r) => r.assetId },
        { label: 'Machine Name', accessor: (r) => r.assetName },
        { label: 'Sector', accessor: (r) => r.sector },
        { label: 'Type', accessor: (r) => r.type },
        { label: 'Priority', accessor: (r) => r.priority },
        { label: 'Status', accessor: (r) => r.status },
        { label: 'Assigned Tech', accessor: (r) => r.assignedTo },
        { label: 'Due Date', accessor: (r) => r.dueDate }
      ]);
    }
  };

  return (
    <div>
      {/* Header & Export Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Plant Operational Performance Analytics</h2>
            <span className="badge badge-neutral" style={{ fontSize: '0.7rem', border: '1px solid var(--border-medium)' }}>
              Operational Analytics
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {isAdmin
              ? 'Comprehensive reporting for failures, telemetry incidents, and machine stoppage downtime'
              : 'Comprehensive reporting for failures, resolved incidents, overdue SLA tasks, downtime, preventive compliance, & spare parts'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button className="btn btn-outline-blue btn-sm" onClick={handleExportCSV}>
            <FileSpreadsheet size={16} /> Export Report CSV
          </button>
        </div>
      </div>

      {/* Date & Sector Filter Toolbar */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Sector Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Sector Filter:</span>
            <select
              className="form-control form-select"
              style={{ width: '220px' }}
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
            >
              <option value="All">All Industry Sectors</option>
              <option value="Production & Manufacturing">Production & Mfg</option>
              <option value="Mechanical Department">Mechanical Dept</option>
              <option value="Electrical Department">Electrical Dept</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Date Period:</span>
            <select
              className="form-control form-select"
              style={{ width: '160px' }}
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Quarterly (90 Days)</option>
              <option value="1y">Full Year 2026</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Analytics Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <Card title="Mean Time To Repair (MTTR)" subtitle="Target: < 3.0 Hours">
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.3rem' }}>
            2.4 <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>hours</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a', fontSize: '0.825rem', marginTop: '0.4rem', fontWeight: 600 }}>
            <TrendingUp size={16} /> 12.5% faster repair response vs last month
          </div>
        </Card>

        <Card title="Mean Time Between Failures (MTBF)" subtitle="Target: > 450 Hours">
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.3rem' }}>
            512 <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>hours</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a', fontSize: '0.825rem', marginTop: '0.4rem', fontWeight: 600 }}>
            <TrendingUp size={16} /> +5.4% reliability increase across lines
          </div>
        </Card>

        {!isAdmin ? (
          <Card title="Preventive Compliance Rate" subtitle="Servicing Schedules On-Time">
            <div style={{ fontSize: '2.2rem', fontWeight: 700, color: preventiveCompliancePct > 80 ? '#16a34a' : '#d97706', marginTop: '0.3rem' }}>
              {preventiveCompliancePct}%
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              {preventiveOnTime} of {filteredPreventive.length} schedules on track
            </div>
          </Card>
        ) : (
          <Card title="Operational Availability" subtitle="Fleet In-Service Rate">
            <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#16a34a', marginTop: '0.3rem' }}>
              {filteredAssets.length > 0 ? Math.round((filteredAssets.filter(a => a.status === 'Operational').length / filteredAssets.length) * 100) : 100}%
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              {filteredAssets.filter(a => a.status === 'Operational').length} of {filteredAssets.length} machines operational
            </div>
          </Card>
        )}

        <Card title="Facility Downtime Hours" subtitle="Recorded Stoppages">
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#dc2626', marginTop: '0.3rem' }}>
            {totalDowntimeHours.toFixed(1)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>hrs</span>
          </div>
          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            {filteredDowntimes.length} total stoppage events logged
          </div>
        </Card>
      </div>

      {/* Reports Module Selector Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '2px solid var(--border-light)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        <button
          className={`btn btn-sm ${selectedReportTab === 'failures' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSelectedReportTab('failures')}
        >
          <ShieldAlert size={15} /> Failures & Telemetry Alerts ({totalFailures})
        </button>

        <button
          className={`btn btn-sm ${selectedReportTab === 'resolved' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSelectedReportTab('resolved')}
        >
          <CheckCircle2 size={15} /> Resolved Incidents ({resolvedIncidents})
        </button>

        {!isAdmin && (
          <button
            className={`btn btn-sm ${selectedReportTab === 'overdue' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedReportTab('overdue')}
          >
            <AlertTriangle size={15} /> Overdue Tasks & SLA ({overdueTasks})
          </button>
        )}

        <button
          className={`btn btn-sm ${selectedReportTab === 'downtime' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSelectedReportTab('downtime')}
        >
          <Clock size={15} /> Machine Downtime ({filteredDowntimes.length})
        </button>

        {!isAdmin && (
          <button
            className={`btn btn-sm ${selectedReportTab === 'preventive' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedReportTab('preventive')}
          >
            <Calendar size={15} /> Preventive Maintenance ({filteredPreventive.length})
          </button>
        )}

        {!isAdmin && (
          <button
            className={`btn btn-sm ${selectedReportTab === 'spare-parts' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedReportTab('spare-parts')}
          >
            <Package size={15} /> Spare Parts Risk ({lowStockPartsCount} Low)
          </button>
        )}
      </div>

      {/* REPORT CONTENT DISPLAY */}
      {selectedReportTab === 'failures' && (
        <Card title={`Failures & Telemetry Alerts Report (${filteredAlerts.length} Events)`}>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Alert ID & Title</th>
                  <th>Machine ID & Name</th>
                  <th>Sector</th>
                  <th>Department</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Logged Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map((alt) => (
                  <tr key={alt.id}>
                    <td>
                      <strong>{alt.title}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary-600)' }}>{alt.id}</div>
                    </td>
                    <td>{alt.machineName} ({alt.machineId})</td>
                    <td>{alt.sector}</td>
                    <td>{alt.department}</td>
                    <td>
                      <span className={`badge ${alt.severity === 'Critical' ? 'badge-critical' : alt.severity === 'Warning' ? 'badge-warning' : 'badge-info'}`}>
                        {alt.severity}
                      </span>
                    </td>
                    <td><Badge status={alt.status} /></td>
                    <td>{alt.createdTime || alt.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {selectedReportTab === 'resolved' && (
        <Card title={`Resolved Incidents Report (${resolvedIncidents} Resolved & Verified)`}>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Alert ID</th>
                  <th>Incident Title</th>
                  <th>Machine Name</th>
                  <th>Sector</th>
                  <th>Technician Repair Notes</th>
                  <th>Resolved Date</th>
                  <th>Verification Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.filter(a => a.status === 'Resolved' || a.status === 'Closed').map((alt) => (
                  <tr key={alt.id}>
                    <td><strong>{alt.id}</strong></td>
                    <td>{alt.title}</td>
                    <td>{alt.machineName}</td>
                    <td>{alt.sector}</td>
                    <td style={{ fontSize: '0.8rem' }}>"{alt.technicianNotes || 'Standard maintenance resolution.'}"</td>
                    <td>{alt.date}</td>
                    <td><Badge status={alt.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {selectedReportTab === 'overdue' && !isAdmin && (
        <Card title={`Overdue Tasks & SLA Violations Report (${overdueTasks} Overdue Tickets)`}>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Target Asset</th>
                  <th>Sector</th>
                  <th>Priority</th>
                  <th>Target Deadline</th>
                  <th>Assigned Specialist</th>
                  <th>Escalated Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkOrders.filter(w => new Date(w.dueDate) < new Date() && w.status !== 'Completed').length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No maintenance tasks are currently overdue.
                    </td>
                  </tr>
                ) : (
                  filteredWorkOrders.filter(w => new Date(w.dueDate) < new Date() && w.status !== 'Completed').map((wo) => (
                    <tr key={wo.id}>
                      <td><strong>{wo.id}</strong></td>
                      <td>{wo.assetName} ({wo.assetId})</td>
                      <td>{wo.sector || 'Plant Floor'}</td>
                      <td><span style={{ color: '#dc2626', fontWeight: 700 }}>{wo.priority}</span></td>
                      <td><strong style={{ color: '#dc2626' }}>{wo.dueDate} (Overdue)</strong></td>
                      <td>{wo.assignedTo}</td>
                      <td>
                        <span className="badge badge-critical">SLA Overdue</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {selectedReportTab === 'downtime' && (
        <Card title={`Machine Stoppages & Downtime Hours Report (${filteredDowntimes.length} Stoppages)`}>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Stoppage Log ID</th>
                  <th>Machine Name</th>
                  <th>Sector</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Duration</th>
                  <th>Cause Category</th>
                </tr>
              </thead>
              <tbody>
                {filteredDowntimes.map((dt) => (
                  <tr key={dt.id}>
                    <td><strong>{dt.id}</strong></td>
                    <td>{dt.machineName} ({dt.machineId})</td>
                    <td>{dt.sector}</td>
                    <td>{dt.startTime}</td>
                    <td>{dt.endTime}</td>
                    <td><strong style={{ color: '#dc2626' }}>{dt.downtimeHours} hrs</strong></td>
                    <td><span className="nav-badge">{dt.reason}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {selectedReportTab === 'preventive' && !isAdmin && (
        <Card title={`Preventive Maintenance Compliance Report (${filteredPreventive.length} Schedules)`}>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Schedule ID</th>
                  <th>Routine Title</th>
                  <th>Target Machine</th>
                  <th>Frequency</th>
                  <th>Next Due Date</th>
                  <th>Assigned Specialist</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPreventive.map((sch) => (
                  <tr key={sch.id}>
                    <td><strong>{sch.id}</strong></td>
                    <td>{sch.title}</td>
                    <td>{sch.machineName}</td>
                    <td>{sch.frequency}</td>
                    <td><strong>{sch.nextDueDate}</strong></td>
                    <td>{sch.assignedTech}</td>
                    <td><Badge status={sch.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {selectedReportTab === 'spare-parts' && !isAdmin && (
        <Card title={`Spare Parts Inventory Risk & Turnover Report (${spareParts.length} Components)`}>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Part ID & Name</th>
                  <th>Category</th>
                  <th>Compatible Machine</th>
                  <th>In Stock Qty</th>
                  <th>Min Threshold</th>
                  <th>Unit Price</th>
                  <th>Stock Risk Status</th>
                </tr>
              </thead>
              <tbody>
                {spareParts.map((prt) => {
                  const isLow = prt.stockQuantity <= prt.minThreshold;
                  return (
                    <tr key={prt.id}>
                      <td>
                        <strong>{prt.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--primary-600)' }}>{prt.id}</div>
                      </td>
                      <td>{prt.category}</td>
                      <td>{prt.compatibleMachine}</td>
                      <td><strong style={{ color: isLow ? '#dc2626' : '#16a34a' }}>{prt.stockQuantity} units</strong></td>
                      <td>{prt.minThreshold}</td>
                      <td>{prt.unitPrice}</td>
                      <td><Badge status={prt.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
