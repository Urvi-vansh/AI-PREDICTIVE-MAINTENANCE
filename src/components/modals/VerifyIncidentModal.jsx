import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ShieldCheck, RotateCcw, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export const VerifyIncidentModal = ({ isOpen, onClose, task, onVerifyClose, onReopenTask }) => {
  const [feedback, setFeedback] = useState('');

  if (!task) return null;

  const resolution = task.resolutionDetails || {
    notes: 'Technician conducted preliminary mechanical inspection and torque recalibration.',
    partsUsed: 'Standard seal gasket',
    hoursSpent: '1.5 hrs',
    resolvedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };

  const handleCloseIncident = () => {
    onVerifyClose(task.id, feedback || 'Verified & approved by Sector Head.');
    onClose();
  };

  const handleReopenIncident = () => {
    onReopenTask(task.id, feedback || 'Reopened: Vibration telemetry exceeds safety limits after repair.');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Incident Verification: ${task.id}`}>
      <div>
        <div style={{ marginBottom: '1rem', padding: '0.85rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
            {task.assetName} ({task.assetId})
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Fault: {task.description}
          </div>
        </div>

        {/* Technician Notes Box */}
        <div style={{ padding: '0.85rem', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-200)', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-700)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
            <FileText size={16} /> Technician Resolution Log ({task.assignedTo})
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            "{resolution.notes}"
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <div>Parts Installed: <strong style={{ color: 'var(--text-main)' }}>{resolution.partsUsed}</strong></div>
            <div>Labor Time: <strong style={{ color: 'var(--text-main)' }}>{resolution.hoursSpent}</strong></div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Sector Head Verification / Reopen Feedback</label>
          <textarea
            className="form-control"
            rows={2}
            placeholder="Add verification notes or instructions if reopening..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReopenIncident}
            style={{ flex: 1, backgroundColor: 'var(--status-warning-bg)', color: 'var(--status-warning-text)', borderColor: 'var(--status-warning-border)' }}
          >
            <RotateCcw size={16} /> Reopen Unresolved Task
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCloseIncident}
            style={{ flex: 1, backgroundColor: '#16a34a', borderColor: '#16a34a' }}
          >
            <CheckCircle2 size={16} /> Verify & Close Incident
          </button>
        </div>
      </div>
    </Modal>
  );
};
