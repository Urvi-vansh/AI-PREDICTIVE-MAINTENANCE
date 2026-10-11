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
  Eye
} from 'lucide-react';
import { AuditTimelineView } from '../common/AuditTimelineView';
import { TaskResolutionModal } from './TaskResolutionModal';
import { ReviseDeadlineModal } from './ReviseDeadlineModal';
import { VerifyIncidentModal } from './VerifyIncidentModal';

export const AlertDetailsModal = ({
  isOpen,
  onClose,
  alert,
  userRole,
  onUpdateAlertStatus,
  onSendReminder,
  onReviseDeadline,
  onEscalateTask,
  onVerifyCloseAlert,
  onReopenAlert
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);
  const [isReviseDeadlineOpen, setIsReviseDeadlineOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  if (!alert) return null;

  const isOverdue =
    alert.status !== 'Closed' &&
    alert.deadline &&
    new Date(alert.deadline) < new Date('2026-10-10');

  const isSectorHead = ['production_head', 'mechanical_head', 'electrical_head', 'admin'].includes(userRole);
  const isTechnician = ['mechanical_tech', 'electrical_tech'].includes(userRole);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={`Incident & Failure Alert: ${alert.id}`}>
        <div>
          {/* Header Summary Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-light)', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span className={`badge ${alert.severity === 'Critical' ? 'badge-critical' : alert.severity === 'Warning' ? 'badge-warning' : 'badge-info'}`}>
                  {alert.severity} Severity
                </span>
                {isOverdue && (
                  <span className="badge badge-critical" style={{ backgroundColor: '#dc2626', color: '#fff' }}>
                    OVERDUE
                  </span>
                )}
                {alert.escalated && (
                  <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                    Escalated to Admin
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

          {/* Escalation Warning Banner */}
          {alert.escalated && (
            <div style={{ backgroundColor: 'var(--status-warning-bg)', border: '1px solid var(--status-warning-border)', color: 'var(--status-warning-text)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong>Overdue Task Escalated to Admin:</strong> {alert.escalatedReason || 'This incident was escalated for priority intervention.'}
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
                <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                  {alert.description}
                </div>
              </div>

              {/* Assignment & Timestamps */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Assigned Specialist</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{alert.assignedTech || 'Unassigned'}</div>
                </div>

                <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Logged Timestamp</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{alert.createdTime || alert.date}</div>
                </div>

                <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Target Deadline</div>
                  <div style={{ fontWeight: 600, color: isOverdue ? '#dc2626' : 'var(--text-main)' }}>
                    {alert.deadline} {isOverdue && '(Overdue)'}
                  </div>
                </div>
              </div>

              {/* Technician Repair Notes Log */}
              {alert.technicianNotes && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--primary-700)', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FileText size={16} /> Technician Repair Resolution Notes
                  </div>
                  <div style={{ padding: '0.85rem', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-200)', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                    "{alert.technicianNotes}"
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
            {/* Technician Actions */}
            {isTechnician && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {alert.status === 'New' && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onUpdateAlertStatus(alert.id, 'Acknowledged', 'Technician acknowledged alert assignment.')}
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
              </div>
            )}

            {/* Sector Head Actions */}
            {isSectorHead && (
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
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
              </div>
            )}

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
            onUpdateAlertStatus(taskId, 'Resolved', resolutionDetails.notes);
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
    </>
  );
};
