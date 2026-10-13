import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ShieldAlert, Calendar, Send } from 'lucide-react';

export const FollowUpRequestModal = ({
  isOpen,
  onClose,
  targetItem,
  onSubmitFollowUp
}) => {
  if (!targetItem) return null;

  const [reason, setReason] = useState(
    `Deadline expired (${targetItem.deadline || targetItem.dueDate}). Urgent follow-up servicing required.`
  );
  const [newDueDate, setNewDueDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [priority, setPriority] = useState('Critical');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('A justification reason is required to issue an escalated follow-up request.');
      return;
    }
    onSubmitFollowUp(targetItem.id, {
      reason,
      dueDate: newDueDate,
      priority,
      assignedDepartment: targetItem.department || targetItem.assignedDepartment,
      assignedTech: targetItem.assignedTech
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Dispatch Follow-Up Request: ${targetItem.id}`}>
      <form onSubmit={handleSubmit}>
        <div style={{ backgroundColor: 'var(--status-warning-bg)', border: '1px solid var(--status-warning-border)', borderRadius: 'var(--radius-md)', padding: '0.85rem', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--status-warning-text)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldAlert size={16} /> Overdue / Unresolved Maintenance Escalation
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-main)', marginTop: '0.25rem' }}>
            Target Machine: <strong>{targetItem.machineName || targetItem.assetName} ({targetItem.machineId || targetItem.assetId})</strong>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Parent Ticket: {targetItem.id} • Original Target: {targetItem.deadline || targetItem.dueDate}
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label">
            Escalation Justification Reason <span style={{ color: 'var(--status-danger-text)' }}>*</span>
          </label>
          <textarea
            className="form-control"
            rows={3}
            required
            placeholder="Explain why the parent request was not resolved and describe immediate requirements..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Revised Target Due Date</label>
            <input
              type="date"
              className="form-control"
              required
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Escalated Priority</label>
            <select
              className="form-control form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Critical">Critical Priority</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-sm" style={{ backgroundColor: '#dc2626', borderColor: '#dc2626', color: '#fff' }}>
            <Send size={14} /> Dispatch Linked Follow-Up
          </button>
        </div>
      </form>
    </Modal>
  );
};
