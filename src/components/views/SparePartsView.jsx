import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import {
  Wrench,
  Search,
  Package,
  Plus,
  AlertTriangle,
  PlusCircle,
  MinusCircle,
  Edit3,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { SparePartFormModal } from '../forms/SparePartFormModal';
import { AdjustStockModal } from '../forms/AdjustStockModal';

export const SparePartsView = ({
  spareParts = [],
  onAddPart,
  onEditPart,
  onAdjustStock,
  userRole = 'admin'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedPartForEdit, setSelectedPartForEdit] = useState(null);
  const [selectedPartForStock, setSelectedPartForStock] = useState(null);
  const [stockMode, setStockMode] = useState('add'); // 'add' or 'use'

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = ['All', ...new Set(spareParts.map((p) => p.category).filter(Boolean))];
  const statuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

  const filteredParts = spareParts.filter((part) => {
    const matchesSearch =
      part.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (part.compatibleMachine && part.compatibleMachine.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || part.status === statusFilter;
    const matchesCat = categoryFilter === 'All' || part.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCat;
  });

  const lowStockCount = spareParts.filter((p) => p.stockQuantity <= p.minThreshold).length;

  const totalPages = Math.ceil(filteredParts.length / itemsPerPage) || 1;
  const paginatedParts = filteredParts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isAdmin = userRole === 'admin';

  return (
    <div>
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Spare Parts Inventory Management</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Replacement component stock tracking, machine compatibility, and stock movements
          </p>
        </div>

        {isAdmin && (
          <button className="btn btn-primary btn-sm" onClick={() => { setSelectedPartForEdit(null); setIsFormModalOpen(true); }}>
            <Plus size={16} /> Register New Component
          </button>
        )}
      </div>

      {/* Low-Stock Alert Warning Banner */}
      {lowStockCount > 0 && (
        <div style={{ backgroundColor: 'var(--status-danger-bg)', border: '1px solid var(--status-danger-border)', color: 'var(--status-danger-text)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.825rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <div>
              <strong>Low-Stock Warning:</strong> {lowStockCount} critical spare part(s) are below minimum required thresholds! Reorder required.
            </div>
          </div>
          <button className="btn btn-danger btn-sm" onClick={() => setStatusFilter('Low Stock')} style={{ fontSize: '0.75rem' }}>
            Filter Low Stock
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.4rem' }}
              placeholder="Search component name, ID, or compatible machine..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Category:</span>
            <select
              className="form-control form-select"
              style={{ width: '170px' }}
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Stock Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Stock Status:</span>
            <select
              className="form-control form-select"
              style={{ width: '160px' }}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {statuses.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Spare Parts Inventory Table */}
      <Card title={`Component Stock Inventory (${filteredParts.length} Components)`}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Part ID & Component Name</th>
                <th>Category</th>
                <th>Compatible Machine</th>
                <th>In Stock Qty</th>
                <th>Unit Price</th>
                <th>Bin Location</th>
                <th>Status</th>
                <th>Stock Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedParts.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <Package size={36} style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: 600 }}>No Spare Parts Found</div>
                    <div style={{ fontSize: '0.8rem' }}>No inventory items match your current filter settings.</div>
                  </td>
                </tr>
              ) : (
                paginatedParts.map((part) => {
                  const isLow = part.stockQuantity <= part.minThreshold;
                  return (
                    <tr key={part.id} style={{ backgroundColor: isLow ? 'rgba(239, 68, 68, 0.03)' : undefined }}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.875rem' }}>
                          {part.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--primary-600)', fontFamily: 'monospace', fontWeight: 700 }}>
                          {part.id}
                        </div>
                      </td>

                      <td>{part.category}</td>

                      <td>
                        <strong style={{ color: 'var(--text-main)', fontSize: '0.825rem' }}>
                          {part.compatibleMachine}
                        </strong>
                      </td>

                      <td>
                        <span
                          style={{
                            fontWeight: 700,
                            color: isLow ? '#dc2626' : '#16a34a',
                            fontSize: '0.95rem'
                          }}
                        >
                          {part.stockQuantity} units
                        </span>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                          Min Threshold: {part.minThreshold}
                        </div>
                      </td>

                      <td>{part.unitPrice}</td>
                      <td>{part.location}</td>

                      <td>
                        <span
                          className={`badge ${part.stockQuantity === 0 ? 'badge-critical' : isLow ? 'badge-warning' : 'badge-operational'}`}
                        >
                          {part.status}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            title="Add Stock (+)"
                            onClick={() => {
                              setSelectedPartForStock(part);
                              setStockMode('add');
                            }}
                          >
                            <PlusCircle size={14} /> Add Stock
                          </button>

                          <button
                            className="btn btn-secondary btn-sm"
                            title="Log Usage (-)"
                            onClick={() => {
                              setSelectedPartForStock(part);
                              setStockMode('use');
                            }}
                          >
                            <MinusCircle size={14} /> Log Usage
                          </button>

                          {isAdmin && (
                            <button
                              className="btn btn-secondary btn-sm"
                              title="Edit Record"
                              onClick={() => {
                                setSelectedPartForEdit(part);
                                setIsFormModalOpen(true);
                              }}
                            >
                              <Edit3 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Page {currentPage} of {totalPages} ({filteredParts.length} components)
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <button
                className="btn btn-secondary btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Spare Part Form Modal */}
      {isFormModalOpen && (
        <SparePartFormModal
          isOpen={isFormModalOpen}
          onClose={() => { setIsFormModalOpen(false); setSelectedPartForEdit(null); }}
          initialPart={selectedPartForEdit}
          onSubmit={(partObj) => {
            if (selectedPartForEdit) onEditPart(partObj);
            else onAddPart(partObj);
          }}
        />
      )}

      {/* Stock Adjustment Modal */}
      {selectedPartForStock && (
        <AdjustStockModal
          isOpen={Boolean(selectedPartForStock)}
          onClose={() => setSelectedPartForStock(null)}
          part={selectedPartForStock}
          mode={stockMode}
          onAdjustStock={onAdjustStock}
        />
      )}
    </div>
  );
};
