import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { CheckCircle2, FileText, Clock } from 'lucide-react';

export const CompletePreventiveTaskModal = ({ isOpen, onClose, schedule, onCompleteTask }) => {
  const [servicingNotes, setServicingNotes] = useState('');
  const [hoursSpent, setHoursSpent] = useState('1.5');
  const [partsUsed, setPartsUsed] = useState('None');

  if (!schedule) return null;

  const calculateNextDueDate = (currentDueDate, frequency) => {
    const d = new Date(currentDueDate || Date.now());
    switch (frequency) {
      case 'Daily':
        d.setDate(d.getDate() + 1);
        break;
      case 'Weekly':
        d.setDate(d.getDate() + 7);
        break;
      case 'Bi-weekly':
        d.setDate(d.getDate() + 14);
        break;
      case 'Monthly':
        d.setMonth(d.getMonth() + 1);
        break;
      case 'Quarterly':
        d.setMonth(d.getMonth() + 3);
        break;
      case 'Annual':
        d.setFullYear(d.getFullYear() + 1);
        break;
      default:
        d.setMonth(d.getMonth() + 1);
    }
    return d.toISOString().split('T')[0];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const newNextDue = calculateNextDueDate(schedule.nextDueDate, schedule.frequency);

    onCompleteTask(schedule.id, servicingNotes, today, newNextDue, hoursSpent, partsUsed);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Mark Servicing Complete: ${schedule.id}`}>
      <form onSubmit={handleSubmit}>
        <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', marginBottom: '1.25rem' }}>
          <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
            {schedule.title}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--primary-600)', marginTop: '0.2rem' }}>
            Machine: {schedule.machineName} ({schedule.machineId}) • Frequency: {schedule.frequency}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Technician Execution & Servicing Notes</label>
          <textarea
            className="form-control"
            rows={3}
            placeholder="Record technician inspection findings, torque adjustments, or lubricant additions..."
            value={servicingNotes}
            onChange={(e) => setServicingNotes(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Labor Duration (Hours)</label>
            <input
              type="text"
              className="form-control"
              value={hoursSpent}
              onChange={(e) => setHoursSpent(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Replacement Parts Consumed</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. ISO VG 46 filter seal"
              value={partsUsed}
              onChange={(e) => setPartsUsed(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-success" style={{ backgroundColor: '#16a34a', borderColor: '#16a34a', color: '#fff' }}>
            <CheckCircle2 size={16} /> Save & Advance Schedule
          </button>
        </div>
      </form>
    </Modal>
  );
};
