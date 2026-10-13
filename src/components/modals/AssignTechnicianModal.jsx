import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { UserCheck, ShieldAlert } from 'lucide-react';
import { ROLES } from '../../config/permissions';

export const AssignTechnicianModal = ({
  isOpen,
  onClose,
  targetItem, // alert or work order
  usersList = [],
  currentUser,
  onAssign
}) => {
  if (!targetItem) return null;

  // Determine relevant department
  const dept = targetItem.department || targetItem.assignedDepartment || 'Mechanical Department';
  const isMech = dept.toLowerCase().includes('mech');
  const isElec = dept.toLowerCase().includes('elec');

  // Filter available technicians from usersList
  const candidateTechnicians = usersList.filter((u) => {
    // Only approved/active technicians
    const isApproved = u.status === 'Active' || u.isApproved;
    if (!isApproved) return false;

    if (isMech) return u.role === ROLES.MECHANICAL_TECH || (u.sector && u.sector.toLowerCase().includes('mech'));
    if (isElec) return u.role === ROLES.ELECTRICAL_TECH || (u.sector && u.sector.toLowerCase().includes('elec'));
    return u.role === ROLES.MECHANICAL_TECH || u.role === ROLES.ELECTRICAL_TECH;
  });

  // Fallback defaults if candidate list is empty
  const defaultTechName = candidateTechnicians[0]?.name || (isElec ? 'Elena Rostova' : 'Marcus Vance');
  const [selectedTech, setSelectedTech] = useState(targetItem.assignedTech || defaultTechName);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTech) return;
    onAssign(targetItem.id, selectedTech, notes);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Assign Specialist: ${targetItem.id}`}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {targetItem.title || targetItem.assetName}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Target Machine: <strong>{targetItem.machineId || targetItem.assetId}</strong> • Dept: <strong>{dept}</strong>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label">Select Qualified Technician</label>
          <select
            className="form-control form-select"
            value={selectedTech}
            onChange={(e) => setSelectedTech(e.target.value)}
          >
            {candidateTechnicians.length > 0 ? (
              candidateTechnicians.map((t) => (
                <option key={t.email} value={t.name}>
                  {t.name} ({t.title || t.role}) - {t.sector}
                </option>
              ))
            ) : (
              <>
                <option value="Marcus Vance">Marcus Vance (Mechanical Technician)</option>
                <option value="David Miller">David Miller (Mechanical Technician)</option>
                <option value="Elena Rostova">Elena Rostova (Electrical Technician)</option>
                <option value="Sarah Jenkins">Sarah Jenkins (Electrical Technician)</option>
              </>
            )}
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
          <label className="form-label">Assignment Instructions / Dispatch Notes</label>
          <textarea
            className="form-control"
            rows={3}
            placeholder="Provide specific technical instructions or safety cautions..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-sm">
            <UserCheck size={14} /> Confirm Assignment
          </button>
        </div>
      </form>
    </Modal>
  );
};
