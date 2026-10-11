import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ShieldAlert, PlusCircle, CheckCircle } from 'lucide-react';
import { MOCK_ASSETS } from '../../mockData/industrialData';

export const CreateAlertModal = ({ isOpen, onClose, onSubmitAlert }) => {
  const [selectedMachineId, setSelectedMachineId] = useState(MOCK_ASSETS[0]?.id || 'AST-101');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('Warning');
  const [assignedTech, setAssignedTech] = useState('Marcus Vance');
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );

  const currentMachine = MOCK_ASSETS.find((a) => a.id === selectedMachineId) || MOCK_ASSETS[0];

  const handleMachineChange = (e) => {
    const id = e.target.value;
    setSelectedMachineId(id);
    const mac = MOCK_ASSETS.find((a) => a.id === id);
    if (mac) {
      if (mac.sector === 'Electrical Department') setAssignedTech('Elena Rostova');
      else if (mac.sector === 'Mechanical Department') setAssignedTech('David Miller');
      else setAssignedTech('Marcus Vance');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAlertId = `ALT-${Math.floor(900 + Math.random() * 90)}`;
    const nowTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // Automatic Sector Head Routing
    let sectorHeadName = 'Robert Chen';
    if (currentMachine.sector === 'Mechanical Department') sectorHeadName = 'David Miller';
    if (currentMachine.sector === 'Electrical Department') sectorHeadName = 'Sarah Jenkins';

    const newAlert = {
      id: newAlertId,
      machineId: currentMachine.id,
      machineName: currentMachine.name,
      sector: currentMachine.sector,
      department: currentMachine.department,
      title: title,
      description: description,
      severity: severity,
      status: 'New',
      assignedTech: assignedTech,
      createdTime: nowTimestamp,
      date: nowTimestamp,
      deadline: deadline,
      overdue: false,
      escalated: false,
      technicianNotes: '',
      auditTimeline: [
        {
          id: `TL-${Date.now()}`,
          timestamp: nowTimestamp,
          actor: 'Manual User Input',
          role: 'Operations Lead',
          action: 'Created Alert',
          notes: `Demo alert logged. Auto-routed to ${sectorHeadName} (${currentMachine.sector}).`
        }
      ],
      escalationHistory: []
    };

    onSubmitAlert(newAlert);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Demo Failure Alert">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Select Target Machine Asset</label>
          <select
            className="form-control form-select"
            value={selectedMachineId}
            onChange={handleMachineChange}
            required
          >
            {MOCK_ASSETS.map((ast) => (
              <option key={ast.id} value={ast.id}>
                {ast.id} — {ast.name} ({ast.sector})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', fontSize: '0.8rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Assigned Sector:</span>
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{currentMachine.sector}</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Responsible Dept:</span>
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{currentMachine.department}</div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Alert Title / Fault Headline</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. High Bearing Vibration Threshold Exceeded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Detailed Description</label>
          <textarea
            className="form-control"
            rows={3}
            placeholder="Describe observed telemetry anomaly or physical fault..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Severity Level</label>
            <select
              className="form-control form-select"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              required
            >
              <option value="Critical">Critical Failure</option>
              <option value="Warning">Warning</option>
              <option value="Info">Info / Inspection</option>
            </select>
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

          <div className="form-group">
            <label className="form-label">Target Deadline</label>
            <input
              type="date"
              className="form-control"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <PlusCircle size={16} /> Create & Route Demo Alert
          </button>
        </div>
      </form>
    </Modal>
  );
};
