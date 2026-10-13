import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Edit3, CheckCircle } from 'lucide-react';

export const EditMachineModal = ({ isOpen, onClose, onSubmit, asset }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    type: '',
    sector: 'Production & Manufacturing',
    department: 'Machining Line 1',
    category: 'Machining',
    location: '',
    status: 'Operational',
    healthScore: 90,
    assignedTech: 'Marcus Vance',
    manufacturer: '',
    modelYear: ''
  });

  useEffect(() => {
    if (asset) {
      setFormData({
        id: asset.id || '',
        name: asset.name || '',
        type: asset.type || asset.category || '',
        sector: asset.sector || 'Production & Manufacturing',
        department: asset.department || 'Plant Operations',
        category: asset.category || 'Machining',
        location: asset.location || '',
        status: asset.status || 'Operational',
        healthScore: asset.healthScore ?? 90,
        assignedTech: asset.assignedTech || 'Marcus Vance',
        manufacturer: asset.specs?.manufacturer || '',
        modelYear: asset.specs?.modelYear || '2023'
      });
    }
  }, [asset]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedAsset = {
      ...asset,
      name: formData.name,
      type: formData.type,
      sector: formData.sector,
      department: formData.department,
      category: formData.category,
      location: formData.location,
      status: formData.status,
      healthScore: Number(formData.healthScore),
      assignedTech: formData.assignedTech,
      lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19),
      specs: {
        ...(asset?.specs || {}),
        manufacturer: formData.manufacturer,
        modelYear: formData.modelYear
      }
    };
    onSubmit(updatedAsset);
    onClose();
  };

  if (!asset) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Machine Record: ${asset.id}`}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Machine ID (System)</label>
            <input
              type="text"
              className="form-control"
              value={formData.id}
              disabled
              style={{ backgroundColor: 'var(--bg-secondary)', cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Machine Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Machine Type</label>
            <input
              type="text"
              name="type"
              className="form-control"
              value={formData.type}
              onChange={handleChange}
              placeholder="e.g. CNC Milling Machine, Hydraulic Press"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Sector</label>
            <select
              name="sector"
              className="form-control form-select"
              value={formData.sector}
              onChange={handleChange}
              required
            >
              <option value="Sector 1 (Production & Manufacturing)">Sector 1 (Production & Manufacturing)</option>
              <option value="Sector 2 (Heavy Machining & Fabrication)">Sector 2 (Heavy Machining & Fabrication)</option>
              <option value="Sector 3 (Assembly & Packaging)">Sector 3 (Assembly & Packaging)</option>
              <option value="Sector 4 (Material Handling & Logistics)">Sector 4 (Material Handling & Logistics)</option>
              <option value="Mechanical Department">Mechanical Department</option>
              <option value="Electrical Department">Electrical Department</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Maintenance Department / Line</label>
            <input
              type="text"
              name="department"
              className="form-control"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Plant Location</label>
            <input
              type="text"
              name="location"
              className="form-control"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Operational Status</label>
            <select
              name="status"
              className="form-control form-select"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Operational">Operational (Normal)</option>
              <option value="Warning">Warning (Attention Required)</option>
              <option value="Critical">Critical Failure</option>
              <option value="Offline">Offline / Deactivated</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Health Score (0 - 100%)</label>
            <input
              type="number"
              name="healthScore"
              className="form-control"
              min="0"
              max="100"
              value={formData.healthScore}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Assigned Technician</label>
            <input
              type="text"
              name="assignedTech"
              className="form-control"
              value={formData.assignedTech}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Manufacturer</label>
            <input
              type="text"
              name="manufacturer"
              className="form-control"
              value={formData.manufacturer}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <CheckCircle size={16} /> Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};
