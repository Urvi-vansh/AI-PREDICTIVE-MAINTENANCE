import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Activity, Save, Info } from 'lucide-react';

export const ManualReadingsModal = ({ isOpen, onClose, asset, onSaveReadings }) => {
  const [readings, setReadings] = useState([]);
  const [note, setNote] = useState('Routine manual gauge reading entry.');

  useEffect(() => {
    if (asset && asset.readings) {
      setReadings(JSON.parse(JSON.stringify(asset.readings)));
    } else {
      setReadings([
        { name: 'Vibration', value: '2.10', unit: 'mm/s', range: '0.5 - 4.5', status: 'Normal' },
        { name: 'Temperature', value: '45.0', unit: '°C', range: '20 - 75', status: 'Normal' },
        { name: 'Operating Pressure', value: '6.5', unit: 'bar', range: '2.0 - 10.0', status: 'Normal' }
      ]);
    }
  }, [asset]);

  const handleReadingsChange = (index, field, value) => {
    setReadings((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddMetric = () => {
    setReadings((prev) => [
      ...prev,
      { name: 'New Telemetry Metric', value: '1.0', unit: 'unit', range: '0 - 10', status: 'Normal' }
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    onSaveReadings(asset.id, readings, timestamp, 'Manual Entry');
    onClose();
  };

  if (!asset) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Manual Sample Readings Entry: ${asset.name} (${asset.id})`}>
      <form onSubmit={handleSubmit}>
        <div style={{ backgroundColor: 'var(--primary-50)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-100)', marginBottom: '1.25rem', fontSize: '0.825rem', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Info size={18} style={{ color: 'var(--primary-600)', flexShrink: 0 }} />
          <div>
            <strong>Manual Field Data Entry:</strong> Sample values entered here will update the machine profile telemetry label to <strong>Manual Entry</strong> with current timestamp.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {readings.map((reading, idx) => (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1.2fr',
                gap: '0.6rem',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)'
              }}
            >
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.2rem' }}>Metric Parameter</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ fontSize: '0.825rem' }}
                  value={reading.name}
                  onChange={(e) => handleReadingsChange(idx, 'name', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.2rem' }}>Value</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ fontSize: '0.825rem' }}
                  value={reading.value}
                  onChange={(e) => handleReadingsChange(idx, 'value', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.2rem' }}>Unit</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ fontSize: '0.825rem' }}
                  value={reading.unit}
                  onChange={(e) => handleReadingsChange(idx, 'unit', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.2rem' }}>Normal Range</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ fontSize: '0.825rem' }}
                  value={reading.range}
                  onChange={(e) => handleReadingsChange(idx, 'range', e.target.value)}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.2rem' }}>Evaluation</label>
                <select
                  className="form-control form-select"
                  style={{ fontSize: '0.825rem' }}
                  value={reading.status}
                  onChange={(e) => handleReadingsChange(idx, 'status', e.target.value)}
                >
                  <option value="Normal">Normal</option>
                  <option value="Warning">Warning</option>
                  <option value="Critical">Critical</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <button type="button" className="btn btn-outline-blue btn-sm" onClick={handleAddMetric}>
            + Add Another Telemetry Parameter
          </button>
        </div>

        <div className="form-group">
          <label className="form-label">Manual Inspection Notes</label>
          <input
            type="text"
            className="form-control"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Reason for manual entry or technician observations..."
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <Save size={16} /> Save & Log Sample Readings
          </button>
        </div>
      </form>
    </Modal>
  );
};
