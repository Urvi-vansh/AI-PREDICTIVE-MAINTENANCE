import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Calendar, PlusCircle, CheckCircle } from 'lucide-react';
import { MOCK_ASSETS } from '../../mockData/industrialData';

export const CreatePreventiveScheduleModal = ({ isOpen, onClose, onSubmitSchedule }) => {
  const [selectedMachineId, setSelectedMachineId] = useState(MOCK_ASSETS[0]?.id || 'AST-101');
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState('Monthly');
  const [nextDueDate, setNextDueDate] = useState(
    new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0]
  );
  const [assignedTech, setAssignedTech] = useState('Marcus Vance');
  const [instructions, setInstructions] = useState('');

  const currentMachine = MOCK_ASSETS.find((a) => a.id === selectedMachineId) || MOCK_ASSETS[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSchedule = {
      id: `PM-${Math.floor(700 + Math.random() * 90)}`,
      machineId: currentMachine.id,
      machineName: currentMachine.name,
      sector: currentMachine.sector,
      department: currentMachine.department,
      title,
      frequency,
      nextDueDate,
      assignedTech,
      instructions,
      status: 'Upcoming',
      lastCompletedDate: 'Never',
      servicingNotes: 'New schedule initiated.'
    };
    onSubmitSchedule(newSchedule);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Preventive Servicing Schedule">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Select Target Machine Asset</label>
          <select
            className="form-control form-select"
            value={selectedMachineId}
            onChange={(e) => setSelectedMachineId(e.target.value)}
            required
          >
            {MOCK_ASSETS.map((ast) => (
              <option key={ast.id} value={ast.id}>
                {ast.id} — {ast.name} ({ast.sector})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Inspection / Servicing Task Title</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Monthly Spindle Lubrication & Axis Alignment"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Frequency</label>
            <select
              className="form-control form-select"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              required
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Bi-weekly">Bi-weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Annual">Annual</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">First Target Due Date</label>
            <input
              type="date"
              className="form-control"
              value={nextDueDate}
              onChange={(e) => setNextDueDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Assigned Technician</label>
            <select
              className="form-control form-select"
              value={assignedTech}
              onChange={(e) => setAssignedTech(e.target.value)}
              required
            >
              <option value="Marcus Vance">Marcus Vance (Senior Tech)</option>
              <option value="Elena Rostova">Elena Rostova (Electrical Tech)</option>
              <option value="David Miller">David Miller (Mechanical Tech)</option>
              <option value="Sarah Jenkins">Sarah Jenkins (Electrical Head)</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Step-by-Step Servicing Instructions</label>
          <textarea
            className="form-control"
            rows={4}
            placeholder="1. Flush coolant lines...&#10;2. Check bearing torque specs..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <PlusCircle size={16} /> Save & Schedule Servicing
          </button>
        </div>
      </form>
    </Modal>
  );
};
