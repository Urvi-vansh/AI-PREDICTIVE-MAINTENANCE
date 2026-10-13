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
  UserCheck,
  Activity,
  Cpu,
  Users,
  X
} from 'lucide-react';
import { CreateAlertModal } from '../forms/CreateAlertModal';
import { AlertDetailsModal } from '../modals/AlertDetailsModal';
import { AssignTechnicianModal } from '../modals/AssignTechnicianModal';
import { FollowUpRequestModal } from '../modals/FollowUpRequestModal';
import { isSectorAllowedForUser, isSectorHeadRole, ROLES } from '../../config/permissions';

export const AlertsView = ({
  alerts = [],
  assets = [],
  usersList = [],
  onResolveAlert,
  onCreateAlert,
  onUpdateAlertStatus,
  onAcknowledgeAlert,
  onAssignAlert,
  onSendReminder,
  onReviseDeadline,
  onEscalateTask,
  onVerifyCloseAlert,
  onReopenAlert,
  onCreateFollowUpAlert,
  userRole = 'admin',
  currentUser = null
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [machineFilter, setMachineFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [assignAlertTarget, setAssignAlertTarget] = useState(null);
  const [followUpAlertTarget, setFollowUpAlertTarget] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const departments = ['All', 'Mechanical Department', 'Electrical Department'];
  const sectors = [
    'All',
    'Sector 1 (Production & Manufacturing)',
    'Sector 2 (Heavy Machining & Fabrication)',
    'Sector 3 (Assembly & Packaging)',
    'Sector 4 (Material Handling & Logistics)',
    'Mechanical Department',
    'Electrical Department'
  ];
  const statuses = ['All', 'New', 'Acknowledged', 'In Progress', 'Resolved', 'Closed', 'Reopened'];
  const severities = ['All', 'Critical', 'Warning', 'Info'];

  // Unique machines list for filter dropdown
  const machineOptions = [
    'All',
    ...Array.from(new Set(assets.map((a) => a.id))).sort()
  ];

  const filteredAlerts = alerts.filter((alt) => {
    const matchesSearch =
      alt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alt.machineId && alt.machineId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (alt.machineName && alt.machineName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      alt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alt.description && alt.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (alt.alertSource && alt.alertSource.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSector = sectorFilter === 'All' || alt.sector === sectorFilter;
    const matchesDept = deptFilter === 'All' || alt.department === deptFilter;
    const matchesMachine = machineFilter === 'All' || alt.machineId === machineFilter;
    const matchesSeverity = severityFilter === 'All' || alt.severity === severityFilter;
    const matchesStatus = statusFilter === 'All' || alt.status === statusFilter;
    const matchesDate = !dateFilter || (alt.createdTime || alt.date || '').includes(dateFilter);

    return (
      matchesSearch &&
      matchesSector &&
      matchesDept &&
      matchesMachine &&
      matchesSeverity &&
      matchesStatus &&
      matchesDate
    );
  });

  // KPI Metrics calculated strictly from the shared alerts data
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

  const role = currentUser?.role || userRole;
  const isAdmin = role === ROLES.ADMIN;
  const isSectorHead = isSectorHeadRole(role);
  const isDeptHead = role === ROLES.MECHANICAL_HEAD || role === ROLES.ELECTRICAL_HEAD;
  const isTechnician = role === ROLES.MECHANICAL_TECH || role === ROLES.ELECTRICAL_TECH;

  return (
    <div>
      {/* Header Info Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0 }}>Alerts & Failure Resolution Module</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Plant telemetry anomaly tracking, risk assessment, failure routing, & audit timeline logs
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

      {/* Filter Controls Bar: Sector, Department, Machine, Severity, Status, Date */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '180px' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.2rem', fontSize: '0.85rem' }}
              placeholder="Search alert, machine, source..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Sector Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)' }}>Sector:</span>
            <select
              className="form-control form-select"
              style={{ width: '150px', fontSize: '0.825rem' }}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)' }}>Dept:</span>
            <select
              className="form-control form-select"
              style={{ width: '150px', fontSize: '0.825rem' }}
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

          {/* Machine Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)' }}>Machine:</span>
            <select
              className="form-control form-select"
              style={{ width: '140px', fontSize: '0.825rem' }}
              value={machineFilter}
              onChange={(e) => {
                setMachineFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {machineOptions.map((mId) => {
                const macObj = assets.find((a) => a.id === mId);
                return (
                  <option key={mId} value={mId}>
                    {mId === 'All' ? 'All Machines' : `${mId}${macObj ? ` (${macObj.name.substring(0, 15)}...)` : ''}`}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Severity Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)' }}>Severity:</span>
            <select
              className="form-control form-select"
              style={{ width: '110px', fontSize: '0.825rem' }}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status:</span>
            <select
              className="form-control form-select"
              style={{ width: '130px', fontSize: '0.825rem' }}
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

          {/* Date Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)' }}>Date:</span>
            <input
              type="date"
              className="form-control"
              style={{ width: '135px', fontSize: '0.825rem', padding: '0.35rem 0.5rem' }}
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
            {dateFilter && (
              <button
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.2rem 0.4rem' }}
                onClick={() => setDateFilter('')}
                title="Clear date filter"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Alerts Table with Source, Risk, Machine ID, Assigned Person, Deadline, and Maintenance Status */}
      <Card title={`Incident Telemetry Stream (${filteredAlerts.length} Events)`}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Alert ID & Headline</th>
                <th>Source & Risk</th>
                <th>Target Machine</th>
                <th>Sector & Dept</th>
                <th>Assigned Specialist</th>
                <th>Target Deadline</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAlerts.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <ShieldAlert size={36} style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>No Alerts Match Your Filters</div>
                    <div style={{ fontSize: '0.8rem' }}>Try clearing filters or search criteria.</div>
                  </td>
                </tr>
              ) : (
                paginatedAlerts.map((alt) => {
                  const isOverdue =
                    alt.status !== 'Closed' &&
                    alt.deadline &&
                    new Date(alt.deadline) < new Date();

                  const isSectorAllowed = !isSectorHead || isSectorAllowedForUser(alt.sector, currentUser);
                  const canAssign = isAdmin || isDeptHead || (isSectorHead && isSectorAllowed);
                  const canVerify = isAdmin || (isSectorHead && isSectorAllowed);

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
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-main)', fontWeight: 600 }}>
                          {alt.alertSource || 'IoT Telemetry'}
                        </div>
                        <div style={{ fontSize: '0.725rem', color: alt.severity === 'Critical' ? '#dc2626' : '#d97706', fontWeight: 700 }}>
                          {alt.risk || alt.severity}
                        </div>
                      </td>

                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--primary-700)', fontSize: '0.825rem' }}>
                          {alt.machineId}
                        </span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {alt.machineName}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{alt.sector}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{alt.department}</div>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: alt.assignedTech ? 'var(--text-main)' : 'var(--text-muted)' }}>
                          {alt.assignedTech || 'Unassigned'}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontSize: '0.775rem', color: isOverdue ? '#dc2626' : 'var(--text-muted)', fontWeight: isOverdue ? 700 : 500 }}>
                          {alt.deadline || 'N/A'}
                        </div>
                        {isOverdue && (
                          <span className="badge badge-critical" style={{ fontSize: '0.65rem', backgroundColor: '#dc2626', color: '#fff', padding: '0.1rem 0.35rem' }}>
                            OVERDUE
                          </span>
                        )}
                      </td>

                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <Badge status={alt.status} />
                          {alt.escalated && (
                            <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>
                              Escalated
                            </span>
                          )}
                          {alt.hasActiveFollowUp && (
                            <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>
                              Follow-Up Sent
                            </span>
                          )}
                        </div>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }} onClick={(e) => e.stopPropagation()}>
                          {/* Quick Acknowledge for Tech or Sector Head */}
                          {alt.status === 'New' && (isTechnician || canVerify) && (
                            <button
                              className="btn btn-primary btn-sm"
                              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                              onClick={() => onAcknowledgeAlert ? onAcknowledgeAlert(alt.id) : onUpdateAlertStatus(alt.id, 'Acknowledged')}
                              title="Acknowledge Alert"
                            >
                              <UserCheck size={13} /> Ack
                            </button>
                          )}

                          {/* Quick Assign Button for Dept Head or Sector Head */}
                          {canAssign && alt.status !== 'Closed' && (
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                              onClick={() => setAssignAlertTarget(alt)}
                              title="Assign qualified technician"
                            >
                              <Users size={13} />
                            </button>
                          )}

                          {/* Follow-up button if overdue or unresolved */}
                          {(isOverdue || alt.status === 'In Progress' || alt.status === 'Reopened') && canVerify && !alt.hasActiveFollowUp && (
                            <button
                              className="btn btn-warning btn-sm"
                              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--status-warning-bg)', color: 'var(--status-warning-text)' }}
                              onClick={() => setFollowUpAlertTarget(alt)}
                              title="Dispatch linked follow-up request"
                            >
                              Follow-Up
                            </button>
                          )}

                          {/* Profile & Audit Modal */}
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                            onClick={() => setSelectedAlert(alt)}
                          >
                            <Eye size={13} /> Profile
                          </button>
                        </div>
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
          currentUser={currentUser}
          usersList={usersList}
          onUpdateAlertStatus={onUpdateAlertStatus}
          onAcknowledgeAlert={onAcknowledgeAlert}
          onAssignAlert={onAssignAlert}
          onSendReminder={onSendReminder}
          onReviseDeadline={onReviseDeadline}
          onEscalateTask={onEscalateTask}
          onVerifyCloseAlert={onVerifyCloseAlert}
          onReopenAlert={onReopenAlert}
          onCreateFollowUpAlert={onCreateFollowUpAlert}
        />
      )}

      {assignAlertTarget && (
        <AssignTechnicianModal
          isOpen={Boolean(assignAlertTarget)}
          onClose={() => setAssignAlertTarget(null)}
          targetItem={assignAlertTarget}
          usersList={usersList}
          currentUser={currentUser}
          onAssign={(alertId, techName, notes) => {
            if (onAssignAlert) onAssignAlert(alertId, techName, notes);
            setAssignAlertTarget(null);
          }}
        />
      )}

      {followUpAlertTarget && (
        <FollowUpRequestModal
          isOpen={Boolean(followUpAlertTarget)}
          onClose={() => setFollowUpAlertTarget(null)}
          targetItem={followUpAlertTarget}
          onSubmitFollowUp={(alertId, payload) => {
            if (onCreateFollowUpAlert) onCreateFollowUpAlert(alertId, payload);
            setFollowUpAlertTarget(null);
          }}
        />
      )}
    </div>
  );
};
