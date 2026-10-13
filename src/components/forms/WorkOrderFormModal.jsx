import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Wrench, CheckCircle } from 'lucide-react';

export const WorkOrderFormModal = ({ isOpen, onClose, onSubmit, assets }) => {
  const [formData, setFormData] = useState({
    assetId: assets[0]?.id || '',
    type: 'Corrective Maintenance',
    priority: 'Medium',
    assignedTo: 'Marcus Vance (Senior Tech)',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    description: ''
  });

  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedAsset = assets.find((a) => a.id === formData.assetId);

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const assignedDept = (selectedAsset?.department?.toLowerCase().includes('elec') || formData.assignedTo.toLowerCase().includes('elena'))
      ? 'Electrical Department'
      : 'Mechanical Department';

    const newWO = {
      id: `WO-2026-${Math.floor(100 + Math.random() * 900)}`,
      assetId: formData.assetId,
      assetName: selectedAsset ? selectedAsset.name : 'Selected Machinery',
      sector: selectedAsset ? selectedAsset.sector : 'Sector 1 (Production & Manufacturing)',
      department: selectedAsset ? selectedAsset.department : 'Production Machinery',
      assignedDepartment: assignedDept,
      type: formData.type,
      priority: formData.priority,
      status: 'Open',
      assignedTo: formData.assignedTo,
      assignedTech: formData.assignedTo,
      createdDate: new Date().toISOString().split('T')[0],
      createdAt: timestamp,
      dueDate: formData.dueDate,
      description: formData.description || 'Routine maintenance and inspection requested.',
      laborHours: null,
      technicianNotes: null,
      replacedParts: [],
      resolutionPeriod: null,
      auditTimeline: [
        {
          id: `AUD-${Date.now()}`,
          status: 'Open',
          action: 'Work Order Dispatched',
          timestamp,
          user: 'Plant Supervisor',
          role: 'Maintenance Coordinator',
          reason: formData.description || 'Routine maintenance requested.'
        }
      ]
    };

    onSubmit(newWO);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log New Maintenance Work Order"
    >
      {submittedSuccess ? (
        <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: 'var(--status-success-bg)',
              color: 'var(--status-success-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}
          >
            <CheckCircle size={32} />
          </div>
          <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Work Order Created!</h3>
          <p style={{ color: 'var(--text-muted)' }}>Ticket has been dispatched to assigned technician.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Target Equipment / Asset</label>
            <select
              name="assetId"
              className="form-control form-select"
              value={formData.assetId}
              onChange={handleChange}
              required
            >
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.id} - {asset.name} ({asset.location})
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Maintenance Type</label>
              <select
                name="type"
                className="form-control form-select"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="Corrective Maintenance">Corrective Maintenance</option>
                <option value="Preventive Inspection">Preventive Inspection</option>
                <option value="Routine Maintenance">Routine Maintenance</option>
                <option value="Calibration">Calibration & Alignment</option>
                <option value="Safety Compliance">Safety Compliance Check</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority Level</label>
              <select
                name="priority"
                className="form-control form-select"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority / Urgent</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Assigned Field Tech</label>
              <select
                name="assignedTo"
                className="form-control form-select"
                value={formData.assignedTo}
                onChange={handleChange}
              >
                <option value="Marcus Vance (Senior Tech)">Marcus Vance (Senior Tech)</option>
                <option value="Sarah Jenkins">Sarah Jenkins (Instrumentation)</option>
                <option value="David Miller">David Miller (Mechanical)</option>
                <option value="Elena Rostova">Elena Rostova (Electrical)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Target Completion Date</label>
              <input
                type="date"
                name="dueDate"
                className="form-control"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Issue & Task Details</label>
            <textarea
              name="description"
              className="form-control"
              rows={3}
              placeholder="Describe symptoms, requested action, or replacement parts..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', justifyRight: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              Dispatch Work Order
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
