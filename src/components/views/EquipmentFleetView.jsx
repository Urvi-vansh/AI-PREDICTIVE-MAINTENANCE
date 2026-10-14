import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import {
  Cpu,
  Search,
  Filter,
  Eye,
  Plus,
  Wrench,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Edit3,
  Power,
  Clock
} from 'lucide-react';
import { FactoryLayoutMap } from '../common/FactoryLayoutMap';

export const EquipmentFleetView = ({
  assets,
  onSelectAsset,
  onOpenWorkOrderModal,
  onOpenAddMachineModal,
  onEditMachine,
  onDeactivateMachine,
  userRole = 'admin',
  initialSectorFilter = 'All'
}) => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'visual'
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState(initialSectorFilter);
  const [typeFilter, setTypeFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const machineTypes = ['All', ...new Set(assets.map((a) => a.type || a.category).filter(Boolean))];
  const departments = ['All', ...new Set(assets.map((a) => a.department).filter(Boolean))];
  const sectors = ['All', 'Sector 1', 'Sector 2', 'Sector 3', 'Sector 4', 'Mechanical Department', 'Electrical Department'];
  const statuses = ['All', 'Operational', 'Warning', 'Critical', 'Offline'];

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSector =
      sectorFilter === 'All' ||
      asset.sector === sectorFilter ||
      (asset.sector && sectorFilter && asset.sector.startsWith(sectorFilter)) ||
      (sectorFilter && asset.sector && sectorFilter.startsWith(asset.sector));
    const matchesType = typeFilter === 'All' || (asset.type || asset.category) === typeFilter;
    const matchesDept = deptFilter === 'All' || asset.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || asset.status === statusFilter;

    return matchesSearch && matchesSector && matchesType && matchesDept && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage) || 1;
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isAdmin = userRole === 'admin';

  return (
    <div>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Plant Machinery Fleet & Industrial Layout</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Comprehensive machinery profiles, maintenance department assignments, and interactive factory floor plan
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* View Mode Toggle Switch */}
          <div style={{ display: 'flex', backgroundColor: 'var(--bg-secondary)', padding: '0.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <button
              className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ border: 'none' }}
              onClick={() => setViewMode('list')}
            >
              <List size={15} /> List View
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'visual' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ border: 'none' }}
              onClick={() => setViewMode('visual')}
            >
              <LayoutGrid size={15} /> Visual Factory Layout
            </button>
          </div>

          {isAdmin && (
            <button className="btn btn-secondary btn-sm" onClick={onOpenAddMachineModal}>
              <Plus size={16} /> + Add Machine
            </button>
          )}

          {!isAdmin && (
            <button className="btn btn-primary btn-sm" onClick={onOpenWorkOrderModal}>
              <Wrench size={16} /> Log Maintenance Task
            </button>
          )}
        </div>
      </div>

      {/* RENDER VISUAL FACTORY LAYOUT VIEW */}
      {viewMode === 'visual' ? (
        <FactoryLayoutMap
          assets={filteredAssets}
          onSelectAsset={onSelectAsset}
          userRole={userRole}
        />
      ) : (
        /* RENDER LIST / TABLE VIEW */
        <>
          {/* Fleet Controls Header Bar */}
          <Card className="mb-6" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Search Input */}
              <div style={{ position: 'relative', minWidth: '220px', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="Search machine ID, name, or location..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              {/* Sector Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>Sector:</span>
                <select
                  className="form-control form-select"
                  style={{ width: '175px' }}
                  value={sectorFilter}
                  onChange={(e) => {
                    setSectorFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  {sectors.map((sec) => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </div>

              {/* Machine Type Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>Type:</span>
                <select
                  className="form-control form-select"
                  style={{ width: '160px' }}
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  {machineTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Maintenance Department Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>Dept:</span>
                <select
                  className="form-control form-select"
                  style={{ width: '160px' }}
                  value={deptFilter}
                  onChange={(e) => {
                    setDeptFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status:</span>
                <select
                  className="form-control form-select"
                  style={{ width: '140px' }}
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

          {/* Machinery Assets Table */}
          <Card title={`Monitored Machinery Fleet (${filteredAssets.length} Records)`}>
            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Unique ID & Name</th>
                    <th>Type</th>
                    <th>Sector</th>
                    <th>Location</th>
                    <th>Maintenance Department</th>
                    <th>Status</th>
                    <th>Health Score</th>
                    <th>Data Source</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAssets.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        <Cpu size={36} style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }} />
                        <div style={{ fontWeight: 600 }}>No Machinery Records Match Your Filters</div>
                        <div style={{ fontSize: '0.8rem' }}>Try resetting sector, type, or status dropdowns.</div>
                      </td>
                    </tr>
                  ) : (
                    paginatedAssets.map((asset) => (
                      <tr
                        key={asset.id}
                        onClick={() => onSelectAsset(asset)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>
                          <div className="asset-name-cell">
                            <div className="asset-icon-box">
                              <Cpu size={20} />
                            </div>
                            <div>
                              <div className="asset-title">{asset.name}</div>
                              <div className="asset-code">{asset.id}</div>
                            </div>
                          </div>
                        </td>
                        <td>{asset.type || asset.category}</td>
                        <td>{asset.sector}</td>
                        <td>{asset.location}</td>
                        <td>
                          <strong style={{ color: 'var(--text-main)', fontSize: '0.825rem' }}>
                            {asset.department}
                          </strong>
                        </td>
                        <td><Badge status={asset.status} /></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ flex: 1, width: '50px', height: '6px', backgroundColor: 'var(--border-light)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div
                                style={{
                                  width: `${asset.healthScore}%`,
                                  height: '100%',
                                  backgroundColor: asset.healthScore > 80 ? '#16a34a' : asset.healthScore > 60 ? '#eab308' : '#dc2626'
                                }}
                              />
                            </div>
                            <span style={{ fontWeight: 600, fontSize: '0.775rem' }}>{asset.healthScore}%</span>
                          </div>
                        </td>
                        <td>
                          <span className="nav-badge" style={{ fontSize: '0.7rem' }}>
                            {asset.dataSource || 'Manual Entry'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem' }} onClick={(e) => e.stopPropagation()}>
                            <button
                              className="btn btn-secondary btn-sm"
                              title="View Full Profile"
                              onClick={() => onSelectAsset(asset)}
                            >
                              <Eye size={14} /> Profile
                            </button>
                            {isAdmin && (
                              <button
                                className={`btn btn-sm ${asset.status === 'Offline' ? 'btn-success' : 'btn-danger'}`}
                                title={asset.status === 'Offline' ? 'Reactivate Machine' : 'Deactivate Machine'}
                                onClick={() => {
                                  if (onDeactivateMachine) {
                                    onDeactivateMachine(asset.id);
                                  }
                                }}
                              >
                                <Power size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Page {currentPage} of {totalPages} ({filteredAssets.length} machines)
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
        </>
      )}
    </div>
  );
};
