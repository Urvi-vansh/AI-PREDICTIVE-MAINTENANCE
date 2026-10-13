import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  Search,
  Filter,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Clock,
  Eye,
  Send,
  Calendar,
  RotateCcw,
  UserCheck
} from 'lucide-react';
import { CreateAlertModal } from '../forms/CreateAlertModal';
import { AlertDetailsModal } from '../modals/AlertDetailsModal';

export const AlertsView = ({
  alerts = [],
  assets = [],
  onResolveAlert,
  onCreateAlert,
  onUpdateAlertStatus,
  onSendReminder,
  onReviseDeadline,
  onEscalateTask,
  onVerifyCloseAlert,
  onReopenAlert,
  userRole = 'admin'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const departments = ['All', ...new Set(alerts.map((a) => a.department).filter(Boolean))];
  const sectors = ['All', 'Production & Manufacturing', 'Mechanical Department', 'Electrical Department'];
  const statuses = ['All', 'New', 'Acknowledged', 'In Progress', 'Resolved', 'Closed', 'Reopened'];
  const severities = ['All', 'Critical', 'Warning', 'Info'];

  const filteredAlerts = alerts.filter((alt) => {
    const matchesSearch =
      alt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alt.machineId && alt.machineId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (alt.machineName && alt.machineName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      alt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alt.description && alt.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSector = sectorFilter === 'All' || alt.sector === sectorFilter;
    const matchesDept = deptFilter === 'All' || alt.department === deptFilter;
    const matchesSeverity = severityFilter === 'All' || alt.severity === severityFilter;
    const matchesStatus = statusFilter === 'All' || alt.status === statusFilter;
    const matchesDate = !dateFilter || (alt.createdTime || alt.date || '').includes(dateFilter);

    return matchesSearch && matchesSector && matchesDept && matchesSeverity && matchesStatus && matchesDate;
  });

  // KPI Metrics
  const totalOpen = alerts.filter((a) => a.status !== 'Closed').length;
  const totalCritical = alerts.filter((a) => a.severity === 'Critical' && a.status !== 'Closed').length;
  const totalOverdue = alerts.filter(
    (a) => a.status !== 'Closed' && a.deadline && new Date(a.deadline) < new Date()
  ).length;
  const totalPendingVerification = alerts.filter((a) => a.status === 'Resolved').length;

  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage) || 1;
  const paginatedAlerts = filteredAlerts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {/* Header Info Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Alerts & Failure Resolution Module</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Plant telemetry anomaly tracking, failure routing, resolution verification, & audit logs
          </p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle size={16} /> + Create Alert
        </button>
      </div>

      {/* KPI Overview Summary Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Open Alerts</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary-600)', marginTop: '0.1rem' }}>
            {totalOpen} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ {alerts.length} total</span>
          </div>
        </div>

        <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--status-danger-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--status-danger-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--status-danger-text)' }}>Critical Telemetry Failures</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--status-danger-text)', marginTop: '0.1rem' }}>
            {totalCritical} Urgent
          </div>
        </div>

        <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--status-warning-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--status-warning-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--status-warning-text)' }}>Overdue Failure Tasks</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--status-warning-text)', marginTop: '0.1rem' }}>
            {totalOverdue} Overdue
          </div>
        </div>

        <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-200)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary-700)' }}>Pending Verification</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary-700)', marginTop: '0.1rem' }}>
            {totalPendingVerification} Awaiting Head Review
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.4rem' }}
              placeholder="Search alert ID, machine, title..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Sector Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Sector:</span>
            <select
              className="form-control form-select"
              style={{ width: '170px' }}
              value={sectorFilter}
              onChange={(e) => {
                setSectorFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {sectors.map((sec) => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Dept:</span>
            <select
              className="form-control form-select"
              style={{ width: '160px' }}
              value={deptFilter}
              onChange={(e) => {
                setDeptFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Severity:</span>
            <select
              className="form-control form-select"
              style={{ width: '130px' }}
              value={severityFilter}
              onChange={(e) => {
                setSeverityFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {severities.map((sev) => (
                <option key={sev} value={sev}>{sev}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status:</span>
            <select
              className="form-control form-select"
              style={{ width: '140px' }}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {statuses.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Alerts Table */}
      <Card title={`Failure Incident Stream (${filteredAlerts.length} Events)`}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Alert ID & Headline</th>
                <th>Target Machine</th>
                <th>Sector & Dept</th>
                <th>Severity</th>
                <th>Assigned Tech</th>
                <th>Logged & Deadline</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAlerts.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <ShieldAlert size={36} style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>No Alerts Match Your Filters</div>
                    <div style={{ fontSize: '0.8rem' }}>Try broadening your search query or status criteria.</div>
                  </td>
                </tr>
              ) : (
                paginatedAlerts.map((alt) => {
                  const isOverdue =
                    alt.status !== 'Closed' &&
                    alt.deadline &&
                    new Date(alt.deadline) < new Date();

                  return (
                    <tr
                      key={alt.id}
                      onClick={() => setSelectedAlert(alt)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: isOverdue ? 'rgba(239, 68, 68, 0.03)' : undefined
                      }}
                    >
                      <td>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.875rem' }}>
                            {alt.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--primary-600)', fontFamily: 'monospace', fontWeight: 700 }}>
                            {alt.id}
                          </div>
                        </div>
                      </td>

                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.825rem' }}>
                          {alt.machineName}
                        </span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {alt.machineId}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{alt.sector}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{alt.department}</div>
                      </td>

                      <td>
                        <span
                          className={`badge ${alt.severity === 'Critical' ? 'badge-critical' : alt.severity === 'Warning' ? 'badge-warning' : 'badge-info'}`}
                        >
                          {alt.severity}
                        </span>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                          {alt.assignedTech || 'Unassigned'}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                          {alt.createdTime || alt.date}
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isOverdue ? '#dc2626' : 'var(--text-muted)' }}>
                          Target: {alt.deadline || 'N/A'} {isOverdue && '⚠️ OVERDUE'}
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <Badge status={alt.status} />
                          {alt.escalated && (
                            <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>
                              Escalated
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAlert(alt);
                          }}
                        >
                          <Eye size={14} /> Profile & Audit
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Page {currentPage} of {totalPages} ({filteredAlerts.length} items)
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <button
                className="btn btn-secondary btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateAlertModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmitAlert={onCreateAlert}
          assets={assets}
        />
      )}

      {selectedAlert && (
        <AlertDetailsModal
          isOpen={Boolean(selectedAlert)}
          onClose={() => setSelectedAlert(null)}
          alert={selectedAlert}
          userRole={userRole}
          onUpdateAlertStatus={onUpdateAlertStatus}
          onSendReminder={onSendReminder}
          onReviseDeadline={onReviseDeadline}
          onEscalateTask={onEscalateTask}
          onVerifyCloseAlert={onVerifyCloseAlert}
          onReopenAlert={onReopenAlert}
        />
      )}
    </div>
  );
};
