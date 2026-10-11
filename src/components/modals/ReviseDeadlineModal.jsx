import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Calendar, AlertCircle } from 'lucide-react';

export const ReviseDeadlineModal = ({ isOpen, onClose, task, onConfirm }) => {
  const [newDate, setNewDate] = useState(
    task?.dueDate || new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0]
  );
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!task) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a valid operational reason for extending the deadline.');
      return;
    }
    setError('');
    onConfirm(task.id, newDate, reason);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Revise Deadline: ${task.id}`}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Target Machine: {task.assetName}
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            Current Deadline: <strong style={{ color: '#dc2626' }}>{task.dueDate}</strong>
          </div>
        </div>

        {error && (
          <div style={{ padding: '0.65rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--status-danger-bg)', border: '1px solid var(--status-danger-border)', color: 'var(--status-danger-text)', fontSize: '0.8rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">New Revised Deadline Date</label>
          <input
            type="date"
            className="form-control"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Reason for Deadline Revision</label>
          <textarea
            className="form-control"
            rows={3}
            placeholder="e.g. Spare part arrival delay / Production line schedule shift..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            Confirm Deadline Extension
          </button>
        </div>
      </form>
    </Modal>
  );
};
