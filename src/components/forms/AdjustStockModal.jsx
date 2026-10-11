import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Package, PlusCircle, MinusCircle } from 'lucide-react';

export const AdjustStockModal = ({ isOpen, onClose, part, mode, onAdjustStock }) => {
  const [quantity, setQuantity] = useState(mode === 'add' ? 5 : 1);
  const [referenceNote, setReferenceNote] = useState(
    mode === 'add' ? 'Restock shipment received from supplier.' : 'Consumed for maintenance repair task.'
  );

  if (!part) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const qtyNum = Number(quantity);
    if (qtyNum <= 0) return;

    onAdjustStock(part.id, mode, qtyNum, referenceNote);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'add' ? `Stock Addition: ${part.name}` : `Log Part Usage: ${part.name}`}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', marginBottom: '1.25rem' }}>
          <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
            {part.name} ({part.id})
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Current Stock: <strong style={{ color: 'var(--primary-600)' }}>{part.stockQuantity} units</strong> • Min Req: {part.minThreshold}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            {mode === 'add' ? 'Quantity to Add (+)' : 'Quantity Consumed (-)'}
          </label>
          <input
            type="number"
            className="form-control"
            min="1"
            max={mode === 'use' ? part.stockQuantity : 100}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Work Order / Supplier Reference Note</label>
          <input
            type="text"
            className="form-control"
            value={referenceNote}
            onChange={(e) => setReferenceNote(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className={`btn ${mode === 'add' ? 'btn-primary' : 'btn-danger'}`}
          >
            {mode === 'add' ? <PlusCircle size={16} /> : <MinusCircle size={16} />}
            {mode === 'add' ? `Add ${quantity} Units to Stock` : `Log ${quantity} Units Consumed`}
          </button>
        </div>
      </form>
    </Modal>
  );
};
