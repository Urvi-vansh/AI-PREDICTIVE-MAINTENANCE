import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Package, CheckCircle } from 'lucide-react';
import { MOCK_ASSETS } from '../../mockData/industrialData';

export const SparePartFormModal = ({ isOpen, onClose, onSubmit, initialPart }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'Electrical / Motors',
    compatibleMachine: MOCK_ASSETS[0]?.name || 'CNC Milling Machine #04',
    compatibleMachineId: MOCK_ASSETS[0]?.id || 'AST-101',
    stockQuantity: 5,
    minThreshold: 2,
    unitPrice: '$150.00',
    location: 'Shelf A-01'
  });

  useEffect(() => {
    if (initialPart) {
      setFormData({
        id: initialPart.id || '',
        name: initialPart.name || '',
        category: initialPart.category || 'Belts & Bearings',
        compatibleMachine: initialPart.compatibleMachine || '',
        compatibleMachineId: initialPart.compatibleMachineId || 'AST-101',
        stockQuantity: initialPart.stockQuantity ?? 5,
        minThreshold: initialPart.minThreshold ?? 2,
        unitPrice: initialPart.unitPrice || '$100.00',
        location: initialPart.location || 'Shelf A-01'
      });
    } else {
      setFormData({
        id: `PRT-${Math.floor(500 + Math.random() * 90)}`,
        name: '',
        category: 'Belts & Bearings',
        compatibleMachine: MOCK_ASSETS[0]?.name || 'CNC Milling Machine #04',
        compatibleMachineId: MOCK_ASSETS[0]?.id || 'AST-101',
        stockQuantity: 5,
        minThreshold: 2,
        unitPrice: '$100.00',
        location: 'Shelf A-01'
      });
    }
  }, [initialPart]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'compatibleMachineId') {
      const mac = MOCK_ASSETS.find((a) => a.id === value);
      setFormData((prev) => ({
        ...prev,
        compatibleMachineId: value,
        compatibleMachine: mac ? mac.name : prev.compatibleMachine
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const qty = Number(formData.stockQuantity);
    const min = Number(formData.minThreshold);
    let status = 'In Stock';
    if (qty === 0) status = 'Out of Stock';
    else if (qty <= min) status = 'Low Stock';

    const partObj = {
      ...formData,
      stockQuantity: qty,
      minThreshold: min,
      status
    };

    onSubmit(partObj);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialPart ? `Edit Component: ${initialPart.id}` : 'Register New Spare Component'}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Part ID</label>
            <input
              type="text"
              name="id"
              className="form-control"
              value={formData.id}
              disabled={Boolean(initialPart)}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Component Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Servo Motor 2.2kW"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              name="category"
              className="form-control form-select"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="Belts & Bearings">Belts & Bearings</option>
              <option value="Electrical / Motors">Electrical / Motors</option>
              <option value="Hydraulics & Filters">Hydraulics & Filters</option>
              <option value="IoT Sensors">IoT Sensors</option>
              <option value="Valves & Fittings">Valves & Fittings</option>
              <option value="Pneumatics">Pneumatics</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Compatible Target Machine</label>
            <select
              name="compatibleMachineId"
              className="form-control form-select"
              value={formData.compatibleMachineId}
              onChange={handleChange}
              required
            >
              {MOCK_ASSETS.map((ast) => (
                <option key={ast.id} value={ast.id}>
                  {ast.id} — {ast.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">In-Stock Quantity</label>
            <input
              type="number"
              name="stockQuantity"
              className="form-control"
              min="0"
              value={formData.stockQuantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Minimum Stock Threshold</label>
            <input
              type="number"
              name="minThreshold"
              className="form-control"
              min="1"
              value={formData.minThreshold}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Unit Price ($)</label>
            <input
              type="text"
              name="unitPrice"
              className="form-control"
              value={formData.unitPrice}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Warehouse / Bin Location</label>
            <input
              type="text"
              name="location"
              className="form-control"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Shelf B-12"
              required
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <CheckCircle size={16} /> Save Component
          </button>
        </div>
      </form>
    </Modal>
  );
};
