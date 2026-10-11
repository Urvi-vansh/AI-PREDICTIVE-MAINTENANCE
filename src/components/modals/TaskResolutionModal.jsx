import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Wrench, CheckCircle2, Package } from 'lucide-react';

export const TaskResolutionModal = ({ isOpen, onClose, task, onSubmitResolution }) => {
  const [notes, setNotes] = useState('');
  const [partsUsed, setPartsUsed] = useState('');
  const [hoursSpent, setHoursSpent] = useState('1.5');

  if (!task) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitResolution(task.id, {
      notes: notes || 'Technician completed repair inspection and component calibration.',
      partsUsed: partsUsed || 'None (Standard calibration)',
      hoursSpent: hoursSpent || '1.5',
      resolvedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Submit Task Resolution: ${task.id}`}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.25rem', padding: '0.85rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
            {task.assetName} ({task.assetId})
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Fault: {task.description}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Technician Repair & Action Notes</label>
          <textarea
            className="form-control"
            rows={3}
            placeholder="Describe actions taken, cause identified, alignment adjustments, or test results..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Replacement Parts Installed</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Viscosity Filter PRT-502 / Bearing Bushing"
              value={partsUsed}
              onChange={(e) => setPartsUsed(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Labor Time Spent (Hours)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 2.0"
              value={hoursSpent}
              onChange={(e) => setHoursSpent(e.target.value)}
              required
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            Submit for Sector Head Verification
          </button>
        </div>
      </form>
    </Modal>
  );
};
