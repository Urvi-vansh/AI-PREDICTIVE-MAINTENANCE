import React, { useState } from 'react';
import { Card, KPICard } from '../common/Card';
import { Badge } from '../common/Badge';
import {
  Cpu,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Users,
  Wrench,
  Send,
  AlertTriangle,
  RotateCcw,
  Calendar,
  CheckSquare,
  ArrowUpRight,
  UserCheck,
  Building2
} from 'lucide-react';
import { ReviseDeadlineModal } from '../modals/ReviseDeadlineModal';
import { VerifyIncidentModal } from '../modals/VerifyIncidentModal';

export const SectorHeadDashboard = ({
  user,
  assets,
  workOrders,
  alerts,
  onUpdateWOStatus,
  onAssignTask,
  onSendReminder,
  onReviseDeadline,
  onEscalateTask,
  onVerifyCloseTask,
  onReopenTask,
  onOpenWorkOrderModal,
  onNavigateTab
}) => {
  const [selectedTaskForDeadline, setSelectedTaskForDeadline] = useState(null);
  const [selectedTaskForVerification, setSelectedTaskForVerification] = useState(null);
  const [assigningTaskId, setAssigningTaskId] = useState(null);
  const [assignedTechName, setAssignedTechName] = useState('');

  // Filter machines, work orders, alerts strictly for this sector
  const sectorAssets = assets.filter(a => a.sector === user.sector);
  const sectorWorkOrders = workOrders.filter(w => w.sector === user.sector);
  const sectorAlerts = alerts.filter(a => a.sector === user.sector);

  // Sector Metrics
  const openFailuresCount = sectorAlerts.filter(a => a.status === 'Open' || a.status === 'Investigating').length;
  const overdueTasksCount = sectorWorkOrders.filter(w => new Date(w.dueDate) < new Date('2026-10-10') && w.status !== 'Completed').length;
  const completedRepairsCount = sectorWorkOrders.filter(w => w.status === 'Completed').length + 12;
  const pendingVerificationCount = sectorWorkOrders.filter(w => w.status === 'Pending Verification').length;

  // Sector Team Technicians Workload
  const teamTechnicians = [
    { name: 'Marcus Vance', role: 'Senior Mechanical Tech', activeTasks: sectorWorkOrders.filter(w => w.assignedTo.includes('Marcus') && w.status !== 'Completed').length },
    { name: 'David Miller', role: 'Mechanical Tech', activeTasks: sectorWorkOrders.filter(w => w.assignedTo.includes('David') && w.status !== 'Completed').length },
    { name: 'Sarah Jenkins', role: 'Instrumentation Tech', activeTasks: sectorWorkOrders.filter(w => w.assignedTo.includes('Sarah') && w.status !== 'Completed').length },
    { name: 'Elena Rostova', role: 'Electrical Specialist', activeTasks: sectorWorkOrders.filter(w => w.assignedTo.includes('Elena') && w.status !== 'Completed').length }
  ];

  return (
    <div>
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>{user.sector} Head Control Dashboard</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Authorized Sector Head: <strong>{user.name}</strong> • Sector Machine Fleet & Task Dispatch</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={onOpenWorkOrderModal}>
          + Dispatch Sector Task
        </button>
      </div>

      {/* 4 Sector KPI Cards */}
      <div className="kpi-grid" style={{ marginBottom: '1.75rem' }}>
        <KPICard
          title="Open Sector Failures"
          value={openFailuresCount}
          subtext="Actionable failure telemetry alerts"
          trend="negative"
          trendValue="Active"
          iconName="ShieldAlert"
        />
        <KPICard
          title="Overdue Tasks"
          value={overdueTasksCount}
          subtext="Requires deadline or escalation"
          trend="negative"
          trendValue="Attention"
          iconName="Clock"
        />
        <KPICard
          title="Completed Repairs"
          value={completedRepairsCount}
          subtext="Verified & closed by sector head"
          trend="positive"
          trendValue="30d Record"
          iconName="CheckSquare"
        />
        <KPICard
          title="Pending Head Verification"
          value={pendingVerificationCount}
          subtext="Tech resolutions awaiting sign-off"
          trend="neutral"
          trendValue="Review Req."
          iconName="UserCheck"
        />
      </div>

      {/* Main Grid: Pending Verification Queue & Team Workload */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.75rem' }}>
        {/* Incident Verification Queue (Tech Submitted Resolutions) */}
        <Card
          title="Incident Verification & Sign-Off Queue"
          subtitle="Technician repair submissions awaiting Sector Head review"
        >
          {sectorWorkOrders.filter(w => w.status === 'Pending Verification').length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <CheckCircle2 size={32} style={{ color: '#16a34a', marginBottom: '0.4rem' }} />
              <div style={{ fontWeight: 600 }}>All Submitted Repairs Verified</div>
              <div style={{ fontSize: '0.775rem' }}>No pending incident resolutions awaiting your review.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {sectorWorkOrders.filter(w => w.status === 'Pending Verification').map(wo => (
                <div
                  key={wo.id}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--primary-200)',
                    backgroundColor: 'var(--primary-50)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary-700)', fontFamily: 'monospace' }}>{wo.id}</span>
                    <Badge status="Maintenance">Pending Review</Badge>
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>{wo.assetName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Assigned Tech: <strong>{wo.assignedTo}</strong></div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setSelectedTaskForVerification(wo)}
                      style={{ flex: 1 }}
                    >
                      <UserCheck size={14} /> Review & Sign Off
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Technician Workload Widget */}
        <Card title="Authorized Team Workload" subtitle="Active tasks assigned per field technician">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {teamTechnicians.map((tech) => (
              <div
                key={tech.name}
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>{tech.name}</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{tech.role}</div>
                </div>
                <span className="nav-badge" style={{ backgroundColor: tech.activeTasks > 2 ? 'var(--status-warning-bg)' : 'var(--primary-100)', color: tech.activeTasks > 2 ? 'var(--status-warning-text)' : 'var(--primary-700)' }}>
                  {tech.activeTasks} Active Tasks
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Sector Maintenance Tasks & Head Control Table */}
      <Card title={`Sector Maintenance Schedule & Head Controls (${sectorWorkOrders.length} Tasks)`}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Task Ticket ID</th>
                <th>Target Machine</th>
                <th>Assigned Technician</th>
                <th>Priority</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Sector Head Action</th>
              </tr>
            </thead>
            <tbody>
              {sectorWorkOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No work order tasks currently dispatched in {user.sector}.
                  </td>
                </tr>
              ) : (
                sectorWorkOrders.map((wo) => {
                  const isOverdue = new Date(wo.dueDate) < new Date('2026-10-10') && wo.status !== 'Completed';
                  return (
                    <tr key={wo.id}>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--primary-600)', fontFamily: 'monospace' }}>
                          {wo.id}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{wo.assetName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{wo.assetId}</div>
                      </td>
                      <td>
                        {assigningTaskId === wo.id ? (
                          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                            <select
                              className="form-control form-select"
                              style={{ width: '130px', padding: '0.2rem', fontSize: '0.75rem' }}
                              value={assignedTechName}
                              onChange={(e) => setAssignedTechName(e.target.value)}
                            >
                              <option value="">Select Tech...</option>
                              <option value="Marcus Vance">Marcus Vance</option>
                              <option value="David Miller">David Miller</option>
                              <option value="Sarah Jenkins">Sarah Jenkins</option>
                              <option value="Elena Rostova">Elena Rostova</option>
                            </select>
                            <button
                              className="btn btn-primary btn-sm"
                              style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}
                              onClick={() => {
                                if (assignedTechName) {
                                  onAssignTask(wo.id, assignedTechName);
                                  setAssigningTaskId(null);
                                }
                              }}
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span>{wo.assignedTo}</span>
                            <button
                              style={{ fontSize: '0.7rem', color: 'var(--primary-600)', textDecoration: 'underline' }}
                              onClick={() => {
                                setAssigningTaskId(wo.id);
                                setAssignedTechName(wo.assignedTo);
                              }}
                            >
                              Change
                            </button>
                          </div>
                        )}
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: wo.priority === 'High' ? '#dc2626' : wo.priority === 'Medium' ? '#d97706' : '#2563eb'
                          }}
                        >
                          {wo.priority}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: isOverdue ? '#dc2626' : 'var(--text-main)', fontWeight: isOverdue ? 700 : 400 }}>
                          {wo.dueDate}
                          {isOverdue && <span style={{ fontSize: '0.675rem', color: '#dc2626', display: 'block' }}>Overdue</span>}
                        </span>
                      </td>
                      <td><Badge status={wo.status} /></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {/* Send Reminder */}
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.2rem 0.45rem', fontSize: '0.725rem' }}
                            onClick={() => onSendReminder(wo.id, wo.assignedTo)}
                            title="Send notification reminder to technician"
                          >
                            <Send size={12} /> Reminder
                          </button>

                          {/* Revise Deadline */}
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.2rem 0.45rem', fontSize: '0.725rem' }}
                            onClick={() => setSelectedTaskForDeadline(wo)}
                            title="Revise target deadline with operational reason"
                          >
                            <Calendar size={12} /> Deadline
                          </button>

                          {/* Escalate Task */}
                          {isOverdue && wo.priority !== 'High' && (
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.2rem 0.45rem', fontSize: '0.725rem', backgroundColor: 'var(--status-danger-bg)', color: 'var(--status-danger-text)' }}
                              onClick={() => onEscalateTask(wo.id)}
                              title="Escalate task priority to High"
                            >
                              <AlertTriangle size={12} /> Escalate
                            </button>
                          )}

                          {/* Verify or Review */}
                          {wo.status === 'Pending Verification' && (
                            <button
                              className="btn btn-outline-blue btn-sm"
                              style={{ padding: '0.2rem 0.45rem', fontSize: '0.725rem' }}
                              onClick={() => setSelectedTaskForVerification(wo)}
                            >
                              <UserCheck size={12} /> Review
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modals */}
      <ReviseDeadlineModal
        isOpen={Boolean(selectedTaskForDeadline)}
        onClose={() => setSelectedTaskForDeadline(null)}
        task={selectedTaskForDeadline}
        onConfirm={onReviseDeadline}
      />

      <VerifyIncidentModal
        isOpen={Boolean(selectedTaskForVerification)}
        onClose={() => setSelectedTaskForVerification(null)}
        task={selectedTaskForVerification}
        onVerifyClose={onVerifyCloseTask}
        onReopenTask={onReopenTask}
      />
    </div>
  );
};
