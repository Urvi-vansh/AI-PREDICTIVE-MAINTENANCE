import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Clock, PlusCircle, AlertOctagon } from 'lucide-react';

export const RecordDowntimeModal = ({ isOpen, onClose, onRecordDowntime, user, assets = [] }) => {
  const [selectedMachineId, setSelectedMachineId] = useState(assets[0]?.id || '');
  const [startTime, setStartTime] = useState(
    new Date(Date.now() - 3600000 * 2).toISOString().replace('T', ' ').substring(0, 16)
  );
  const [endTime, setEndTime] = useState(
    new Date().toISOString().replace('T', ' ').substring(0, 16)
  );
  const [isOngoing, setIsOngoing] = useState(false);
  const [reason, setReason] = useState('Unplanned Mechanical Breakdown');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (assets.length > 0 && (!selectedMachineId || !assets.some(a => a.id === selectedMachineId))) {
      setSelectedMachineId(assets[0].id);
    }
  }, [assets, selectedMachineId]);

  const currentMachine = assets.find((a) => a.id === selectedMachineId) || assets[0];

  const calculateHours = (startStr, endStr, ongoing) => {
    if (ongoing) return 0;
    try {
      const s = new Date(startStr.replace(' ', 'T'));
      const e = new Date(endStr.replace(' ', 'T'));
      const diffMs = e - s;
      return Math.max(0, Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10);
    } catch {
      return 1.0;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentMachine) return;
    const hours = calculateHours(startTime, endTime, isOngoing);
    const newLog = {
      id: `DT-${Math.floor(300 + Math.random() * 90)}`,
      machineId: currentMachine.id,
      machineName: currentMachine.name,
      sector: currentMachine.sector,
      department: currentMachine.department || currentMachine.sector,
      startTime,
      endTime: isOngoing ? 'Ongoing' : endTime,
      downtimeHours: isOngoing ? 0 : hours,
      reason,
      notes,
      status: isOngoing ? 'Ongoing' : 'Resolved',
      recordedBy: user ? user.name : 'Authorized User'
    };

    onRecordDowntime(newLog);
    onClose();
  };

  const computedHours = calculateHours(startTime, endTime, isOngoing);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Machine Stoppage / Downtime Log">
      <form onSubmit={handleSubmit}>
        {assets.length === 0 ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              No machines registered in the system yet. Please add a machine before logging downtime.
            </p>
          </div>
        ) : (
          <div className="form-group">
            <label className="form-label">Select Target Stopped Machine</label>
            <select
              className="form-control form-select"
              value={selectedMachineId}
              onChange={(e) => setSelectedMachineId(e.target.value)}
              required
            >
              {assets.map((ast) => (
                <option key={ast.id} value={ast.id}>
                  {ast.id} — {ast.name} ({ast.sector})
                </option>
              ))}
            </select>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Stoppage Start Timestamp</label>
            <input
              type="text"
              className="form-control"
              placeholder="YYYY-MM-DD HH:MM"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Return to Service Time</label>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isOngoing}
                  onChange={(e) => setIsOngoing(e.target.checked)}
                /> Active Ongoing Stoppage
              </label>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="YYYY-MM-DD HH:MM"
              value={isOngoing ? 'Ongoing' : endTime}
              disabled={isOngoing}
              onChange={(e) => setEndTime(e.target.value)}
              required={!isOngoing}
            />
          </div>
        </div>

        {!isOngoing && (
          <div style={{ padding: '0.65rem 0.85rem', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-200)', marginBottom: '1rem', fontSize: '0.825rem', color: 'var(--primary-800)' }}>
            Calculated Downtime Duration: <strong>{computedHours} Hours</strong>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Stoppage Reason / Category</label>
          <select
            className="form-control form-select"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          >
            <option value="Unplanned Mechanical Breakdown">Unplanned Mechanical Breakdown</option>
            <option value="Electrical Power Outage / Trip">Electrical Power Outage / Trip</option>
            <option value="Scheduled Preventive Servicing">Scheduled Preventive Servicing</option>
            <option value="Material Shortage / Line Stop">Material Shortage / Line Stop</option>
            <option value="Tooling Changeover & Setup">Tooling Changeover & Setup</option>
            <option value="Major Equipment Overhaul">Major Equipment Overhaul</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Stoppage Explanation / Observations</label>
          <textarea
            className="form-control"
            rows={3}
            placeholder="Record cause of machine halt and corrective actions taken..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={assets.length === 0}>
            <PlusCircle size={16} /> Log Downtime Record
          </button>
        </div>
      </form>
    </Modal>
  );
};
