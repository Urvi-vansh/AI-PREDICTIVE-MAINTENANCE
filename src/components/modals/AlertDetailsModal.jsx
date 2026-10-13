import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  UserCheck,
  CheckCircle2,
  RotateCcw,
  FileText,
  Building2,
  Users,
  Send,
  Calendar,
  AlertCircle,
  PlusCircle,
  Eye,
  Activity,
  Cpu
} from 'lucide-react';
import { AuditTimelineView } from '../common/AuditTimelineView';
import { TaskResolutionModal } from './TaskResolutionModal';
import { ReviseDeadlineModal } from './ReviseDeadlineModal';
import { VerifyIncidentModal } from './VerifyIncidentModal';
import { AssignTechnicianModal } from './AssignTechnicianModal';
import { FollowUpRequestModal } from './FollowUpRequestModal';
import { isSectorAllowedForUser, isSectorHeadRole, ROLES } from '../../config/permissions';

export const AlertDetailsModal = ({
  isOpen,
  onClose,
  alert,
  userRole,
  currentUser = null,
  usersList = [],
  onUpdateAlertStatus,
  onAcknowledgeAlert,
  onAssignAlert,
  onSendReminder,
  onReviseDeadline,
  onEscalateTask,
  onVerifyCloseAlert,
  onReopenAlert,
  onCreateFollowUpAlert
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);
  const [isReviseDeadlineOpen, setIsReviseDeadlineOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);

  if (!alert) return null;

  const isOverdue =
    alert.status !== 'Closed' &&
    alert.deadline &&
    new Date(alert.deadline) < new Date();

  const role = currentUser?.role || userRole;
  const isAdmin = role === ROLES.ADMIN;
  const isSectorHead = isSectorHeadRole(role);
  const isDeptHead = role === ROLES.MECHANICAL_HEAD || role === ROLES.ELECTRICAL_HEAD;
  const isTechnician = role === ROLES.MECHANICAL_TECH || role === ROLES.ELECTRICAL_TECH;

  // Sector clearance check for Sector Heads
  const isSectorAllowed = !isSectorHead || isSectorAllowedForUser(alert.sector, currentUser);

  // Can verify or close repairs: Admin or designated Sector Head for that sector
  const canVerifyOrClose = isAdmin || (isSectorHead && isSectorAllowed);

  // Can assign technicians: Admin, Department Heads, or designated Sector Head
  const canAssignTechnician = isAdmin || isDeptHead || (isSectorHead && isSectorAllowed);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={`Incident & Failure Alert: ${alert.id}`}>
        <div>
          {/* Header Summary Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-light)', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                <span className={`badge ${alert.severity === 'Critical' ? 'badge-critical' : alert.severity === 'Warning' ? 'badge-warning' : 'badge-info'}`}>
                  {alert.severity} Severity
                </span>
                {isOverdue && (
                  <span className="badge badge-critical" style={{ backgroundColor: '#dc2626', color: '#fff', fontWeight: 700 }}>
                    ⚠️ OVERDUE
                  </span>
                )}
                {alert.escalated && (
                  <span className="badge badge-warning" style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                    Escalated to Admin
                  </span>
                )}
                {alert.hasActiveFollowUp && (
                  <span className="badge badge-info" style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                    Linked Follow-Up Dispatched ({alert.followUpAlertId})
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginTop: '0.2rem', marginBottom: '0.25rem' }}>
                {alert.title}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                <span>Machine: <strong style={{ color: 'var(--primary-600)' }}>{alert.machineName} ({alert.machineId})</strong></span>
                <span>Sector: <strong>{alert.sector}</strong></span>
                <span>Dept: <strong>{alert.department}</strong></span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
              <Badge status={alert.status} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={12} /> Target Deadline: <strong style={{ color: isOverdue ? '#dc2626' : 'var(--text-main)' }}>{alert.deadline || 'N/A'}</strong>
              </div>
            </div>
          </div>

          {/* Telemetry Source & Risk Highlight Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Activity size={13} style={{ color: 'var(--primary-600)' }} /> Alert Source Channel
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)', marginTop: '0.15rem' }}>
                {alert.alertSource || 'Automated Telemetry Stream'}
              </div>
            </div>

            <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Cpu size={13} style={{ color: 'var(--status-warning-text)' }} /> Calculated Risk Rating
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: alert.severity === 'Critical' ? 'var(--status-danger-text)' : 'var(--status-warning-text)', marginTop: '0.15rem' }}>
                {alert.risk || 'Elevated Anomaly Deviation'}
              </div>
            </div>

            <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Assigned Specialist</div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)', marginTop: '0.15rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{alert.assignedTech || 'Unassigned'}</span>
                {canAssignTechnician && (
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}
                    onClick={() => setIsAssignModalOpen(true)}
                  >
                    Change
                  </button>
                )}
              </div>
            </div>

            <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Maintenance Status</div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--primary-600)', marginTop: '0.15rem' }}>
                {alert.maintenanceStatus || alert.status}
              </div>
            </div>
          </div>

          {/* Escalation Warning Banner */}
          {alert.escalated && (
            <div style={{ backgroundColor: 'var(--status-warning-bg)', border: '1px solid var(--status-warning-border)', color: 'var(--status-warning-text)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong>Escalated to Administrator:</strong> {alert.escalatedReason || 'This incident was escalated for priority intervention.'}
              </div>
            </div>
          )}

          {/* Tabs Selector */}
          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
            <button
              className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview & Resolution
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'audit' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('audit')}
            >
              Audit Timeline Log ({alert.auditTimeline?.length || 0})
            </button>
          </div>

          {/* TAB 1: OVERVIEW & RESOLUTION */}
          {activeTab === 'overview' && (
            <div>
              {/* Fault Description */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Observed Anomaly & Description
                </div>
                <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  {alert.description}
                </div>
              </div>

              {/* Resolution Details & Parts Logged */}
              {alert.technicianNotes && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--primary-700)', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FileText size={16} /> Technician Repair Resolution Notes
                  </div>
                  <div style={{ padding: '0.85rem', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-200)', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                    <p style={{ margin: 0, fontStyle: 'italic' }}>"{alert.technicianNotes}"</p>
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {alert.laborHours && <span>Labor Hours: <strong>{alert.laborHours} hrs</strong></span>}
                      {alert.replacedParts && alert.replacedParts.length > 0 && (
                        <span>Replaced Parts: <strong>{alert.replacedParts.join(', ')}</strong></span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AUDIT TIMELINE */}
          {activeTab === 'audit' && (
            <div>
              <AuditTimelineView auditTimeline={alert.auditTimeline} />
            </div>
          )}

          {/* Dynamic Action Buttons Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {/* Technician Actions */}
              {isTechnician && (
                <>
                  {alert.status === 'New' && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onAcknowledgeAlert ? onAcknowledgeAlert(alert.id) : onUpdateAlertStatus(alert.id, 'Acknowledged', 'Technician acknowledged alert assignment.')}
                    >
                      <UserCheck size={14} /> Acknowledge Alert
                    </button>
                  )}

                  {alert.status === 'Acknowledged' && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onUpdateAlertStatus(alert.id, 'In Progress', 'Technician initiated physical repair work.')}
                    >
                      <Clock size={14} /> Start Repair Work
                    </button>
                  )}

                  {(alert.status === 'In Progress' || alert.status === 'Reopened') && (
                    <button
                      className="btn btn-success btn-sm"
                      style={{ backgroundColor: '#16a34a', borderColor: '#16a34a', color: '#fff' }}
                      onClick={() => setIsResolutionModalOpen(true)}
                    >
                      <CheckCircle2 size={14} /> Submit Repair Resolution
                    </button>
                  )}
                </>
              )}

              {/* Department Head Actions (Assign Technicians) */}
              {canAssignTechnician && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsAssignModalOpen(true)}
                  title="Assign or reassign qualified technician"
                >
                  <Users size={14} /> Assign Specialist
                </button>
              )}

              {/* Sector Head & Admin Actions */}
              {(isSectorHead || isAdmin) && isSectorAllowed && (
                <>
                  {alert.status === 'New' && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onAcknowledgeAlert ? onAcknowledgeAlert(alert.id) : onUpdateAlertStatus(alert.id, 'Acknowledged', 'Sector Head acknowledged alert.')}
                    >
                      <UserCheck size={14} /> Acknowledge Alert
                    </button>
                  )}

                  {alert.status !== 'Closed' && (
                    <>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => onSendReminder(alert.id, alert.assignedTech)}
                        title="Send Reminder"
                      >
                        <Send size={14} /> Send Reminder
                      </button>

                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setIsReviseDeadlineOpen(true)}
                        title="Revise Deadline"
                      >
                        <Calendar size={14} /> Revise Deadline
                      </button>

                      {isOverdue && !alert.escalated && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => onEscalateTask(alert.id, 'Task exceeded target deadline without completion.')}
                          title="Escalate Overdue Task"
                        >
                          <ShieldAlert size={14} /> Escalate to Admin
                        </button>
                      )}

                      {/* Dispatch Follow-Up Request for Overdue/Unresolved work */}
                      {(isOverdue || alert.status === 'In Progress' || alert.status === 'Reopened') && !alert.hasActiveFollowUp && (
                        <button
                          className="btn btn-warning btn-sm"
                          style={{ backgroundColor: 'var(--status-warning-bg)', borderColor: 'var(--status-warning-border)', color: 'var(--status-warning-text)' }}
                          onClick={() => setIsFollowUpModalOpen(true)}
                          title="Create linked follow-up request"
                        >
                          <PlusCircle size={14} /> Create Follow-Up
                        </button>
                      )}
                    </>
                  )}

                  {alert.status === 'Resolved' && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setIsVerifyModalOpen(true)}
                    >
                      <CheckCircle2 size={14} /> Verify & Close / Reopen
                    </button>
                  )}
                </>
              )}
            </div>

            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              Close Window
            </button>
          </div>
        </div>
      </Modal>

      {/* Task Resolution Modal for Technician */}
      {isResolutionModalOpen && (
        <TaskResolutionModal
          isOpen={isResolutionModalOpen}
          onClose={() => setIsResolutionModalOpen(false)}
          task={alert}
          onSubmitResolution={(taskId, resolutionDetails) => {
            onUpdateAlertStatus(taskId, 'Resolved', resolutionDetails.notes, resolutionDetails);
            setIsResolutionModalOpen(false);
          }}
        />
      )}

      {/* Revise Deadline Modal for Sector Head */}
      {isReviseDeadlineOpen && (
        <ReviseDeadlineModal
          isOpen={isReviseDeadlineOpen}
          onClose={() => setIsReviseDeadlineOpen(false)}
          task={alert}
          onConfirm={(taskId, newDate, reason) => {
            onReviseDeadline(taskId, newDate, reason);
            setIsReviseDeadlineOpen(false);
          }}
        />
      )}

      {/* Verify Incident Modal for Sector Head */}
      {isVerifyModalOpen && (
        <VerifyIncidentModal
          isOpen={isVerifyModalOpen}
          onClose={() => setIsVerifyModalOpen(false)}
          task={alert}
          onVerifyClose={(taskId, feedback) => {
            onVerifyCloseAlert(taskId, feedback);
            setIsVerifyModalOpen(false);
          }}
          onReopenTask={(taskId, feedback) => {
            onReopenAlert(taskId, feedback);
            setIsVerifyModalOpen(false);
          }}
        />
      )}

      {/* Assign Specialist Modal */}
      {isAssignModalOpen && (
        <AssignTechnicianModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          targetItem={alert}
          usersList={usersList}
          currentUser={currentUser}
          onAssign={(alertId, techName, notes) => {
            if (onAssignAlert) onAssignAlert(alertId, techName, notes);
            setIsAssignModalOpen(false);
          }}
        />
      )}

      {/* Create Linked Follow-Up Request Modal */}
      {isFollowUpModalOpen && (
        <FollowUpRequestModal
          isOpen={isFollowUpModalOpen}
          onClose={() => setIsFollowUpModalOpen(false)}
          targetItem={alert}
          onSubmitFollowUp={(alertId, payload) => {
            if (onCreateFollowUpAlert) onCreateFollowUpAlert(alertId, payload);
            setIsFollowUpModalOpen(false);
          }}
        />
      )}
    </>
  );
};
