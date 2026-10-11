import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Cpu, CheckCircle } from 'lucide-react';
import { SECTORS } from '../../config/permissions';

export const AddMachineModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: `AST-${Math.floor(109 + Math.random() * 900)}`,
    name: '',
    sector: SECTORS.PRODUCTION,
    department: 'Machining Line 2',
    category: 'Machining',
    location: 'Bay A - Line 2',
    status: 'Operational',
    healthScore: 100,
    manufacturer: 'Haas Automation',
    power: '18 kW'
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMachine = {
      ...formData,
      lastMaintenance: new Date().toISOString().split('T')[0],
      nextScheduled: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
      sensorsCount: 4,
      specs: {
        power: formData.power || '20 kW',
        manufacturer: formData.manufacturer || 'Industrial Automation',
        modelYear: '2026'
      }
    };

    onSubmit(newMachine);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register New Machine Asset">
      {submitted ? (
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
          <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Machine Successfully Registered!</h3>
          <p style={{ color: 'var(--text-muted)' }}>Asset telemetry profile initialized and added to plant fleet.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Asset ID Tag</label>
              <input
                type="text"
                name="id"
                className="form-control"
                value={formData.id}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Machine Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="e.g. Servo Lathe SL-800"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Industry Sector</label>
              <select
                name="sector"
                className="form-control form-select"
                value={formData.sector}
                onChange={handleChange}
              >
                <option value={SECTORS.PRODUCTION}>{SECTORS.PRODUCTION}</option>
                <option value={SECTORS.MECHANICAL}>{SECTORS.MECHANICAL}</option>
                <option value={SECTORS.ELECTRICAL}>{SECTORS.ELECTRICAL}</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Equipment Category</label>
              <select
                name="category"
                className="form-control form-select"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Machining">Machining</option>
                <option value="Stamping">Stamping</option>
                <option value="Fluid Systems">Fluid Systems</option>
                <option value="Material Handling">Material Handling</option>
                <option value="Thermal Systems">Thermal Systems</option>
                <option value="Robotics">Robotics</option>
                <option value="Pneumatics">Pneumatics</option>
                <option value="Electrical Distribution">Electrical Distribution</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Department / Floor Location</label>
              <input
                type="text"
                name="location"
                className="form-control"
                placeholder="e.g. Bay A - Line 2"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Initial Status</label>
              <select
                name="status"
                className="form-control form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Operational">Operational</option>
                <option value="Warning">Warning</option>
                <option value="Maintenance Required">Maintenance Required</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Manufacturer</label>
              <input
                type="text"
                name="manufacturer"
                className="form-control"
                placeholder="e.g. Bosch / Haas / Siemens"
                value={formData.manufacturer}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Power / Capacity Rating</label>
              <input
                type="text"
                name="power"
                className="form-control"
                placeholder="e.g. 25 kW / 50 bar"
                value={formData.power}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              Save Machine to Fleet
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
