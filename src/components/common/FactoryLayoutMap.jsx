import React, { useState } from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Cpu, MapPin, Activity, Clock, ShieldCheck, Filter, Search, ArrowUpRight, CheckCircle2, AlertTriangle, ShieldAlert, Power } from 'lucide-react';

export const FactoryLayoutMap = ({ assets, onSelectAsset, userRole }) => {
  const [selectedSector, setSelectedSector] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const sectorsList = [
    { name: 'Sector 1', fullName: 'Sector 1 (Production & Manufacturing)', code: 'SEC-1', color: 'var(--primary-600)', bg: 'var(--primary-50)' },
    { name: 'Sector 2', fullName: 'Sector 2 (Heavy Machining & Fabrication)', code: 'SEC-2', color: '#d97706', bg: '#fffbeb' },
    { name: 'Sector 3', fullName: 'Sector 3 (Assembly & Packaging)', code: 'SEC-3', color: '#7c3aed', bg: '#f5f3ff' },
    { name: 'Sector 4', fullName: 'Sector 4 (Material Handling & Logistics)', code: 'SEC-4', color: '#059669', bg: '#ecfdf5' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Operational':
      case 'Low':
        return '#16a34a';
      case 'Warning':
      case 'Medium':
      case 'Maintenance Required':
        return '#eab308';
      case 'Critical':
      case 'High':
        return '#dc2626';
      case 'Offline':
      default:
        return '#64748b';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Operational':
      case 'Low':
        return 'badge-operational';
      case 'Warning':
      case 'Medium':
      case 'Maintenance Required':
        return 'badge-warning';
      case 'Critical':
      case 'High':
        return 'badge-critical';
      case 'Offline':
      default:
        return 'badge-offline';
    }
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSector =
      selectedSector === 'All' ||
      asset.sector === selectedSector ||
      (asset.sector && selectedSector && asset.sector.startsWith(selectedSector)) ||
      (selectedSector && asset.sector && selectedSector.startsWith(asset.sector));
    const matchesStatus =
      statusFilter === 'All' ||
      asset.status === statusFilter ||
      (statusFilter === 'Operational' && (asset.status === 'Low' || asset.status === 'Operational')) ||
      (statusFilter === 'Warning' && (asset.status === 'Medium' || asset.status === 'Warning' || asset.status === 'Maintenance Required')) ||
      (statusFilter === 'Critical' && (asset.status === 'High' || asset.status === 'Critical')) ||
      (statusFilter === 'Offline' && (asset.status === 'Offline' || !asset.status));
    return matchesSector && matchesStatus;
  });

  const totalNormal = assets.filter(a => a.status === 'Operational' || a.status === 'Low').length;
  const totalWarning = assets.filter(a => a.status === 'Warning' || a.status === 'Medium' || a.status === 'Maintenance Required').length;
  const totalCritical = assets.filter(a => a.status === 'Critical' || a.status === 'High').length;
  const totalOffline = assets.filter(a => a.status === 'Offline' || !a.status).length;

  return (
    <div className="factory-layout-container">
      {/* Top Banner & Control Bar */}
      <Card className="mb-6" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)' }}>Interactive Visual Factory Floor Layout</h3>
              <span className="badge badge-neutral" style={{ fontSize: '0.75rem', border: '1px solid var(--border-medium)' }}>
                Operational Plant Floor
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Real-time plant wing status floor plan • Click machine nodes to view telemetry, manual entry, & maintenance history
            </p>
          </div>

          {/* Sector & Status Filter Selectors */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Wing:</span>
              <select
                className="form-control form-select"
                style={{ width: '190px', fontSize: '0.825rem' }}
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
              >
                <option value="All">All Plant Sectors</option>
                {sectorsList.map((s) => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>State:</span>
              <select
                className="form-control form-select"
                style={{ width: '150px', fontSize: '0.825rem' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Operational">Normal (Operational)</option>
                <option value="Warning">Attention Required</option>
                <option value="Critical">Critical Failure</option>
                <option value="Offline">Offline / Deactivated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Status Legend & Summary Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justify: 'space-between',
            gap: '1rem',
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-light)',
            fontSize: '0.825rem'
          }}
        >
          {/* Status Indicators Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.8rem' }}>Status Key:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#16a34a', display: 'inline-block' }} />
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Normal ({totalNormal})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#eab308', display: 'inline-block' }} />
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Attention Required ({totalWarning})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#dc2626', display: 'inline-block' }} />
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Critical ({totalCritical})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#64748b', display: 'inline-block' }} />
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Offline ({totalOffline})</span>
            </div>
          </div>

          {/* Data Source Label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
            <span className="nav-badge" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
              Source: Active Fleet Registry
            </span>
          </div>
        </div>
      </Card>

      {/* Visual Plant Wings Layout Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {sectorsList
          .filter(s => selectedSector === 'All' || s.name === selectedSector)
          .map((sec) => {
            const sectorAssets = filteredAssets.filter(
              (a) => a.sector === sec.name || a.sector === sec.fullName || (a.sector && a.sector.startsWith(sec.name))
            );
            return (
              <div
                key={sec.name}
                style={{
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-primary)',
                  boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden'
                }}
              >
                {/* Sector Floor Wing Header */}
                <div
                  style={{
                    padding: '0.85rem 1.25rem',
                    backgroundColor: sec.bg,
                    borderBottom: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div
                      style={{
                        padding: '0.35rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: sec.color,
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {sec.code}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', margin: 0 }}>
                        {sec.name} Floor Layout
                      </h4>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {sectorAssets.length} Monitored Equipment Units
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="nav-badge" style={{ fontSize: '0.725rem' }}>
                      {sectorAssets.filter(a => a.status === 'Operational').length} Operational
                    </span>
                    {sectorAssets.some(a => a.status === 'Critical') && (
                      <span className="badge badge-critical" style={{ fontSize: '0.7rem' }}>
                        Critical Alert Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Sector Machine Cards / Floor Nodes Grid */}
                <div style={{ padding: '1.25rem' }}>
                  {sectorAssets.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      No machines registered in this sector matching current status filters.
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                      {sectorAssets.map((asset) => {
                        const statusColor = getStatusColor(asset.status);
                        return (
                          <div
                            key={asset.id}
                            onClick={() => onSelectAsset(asset)}
                            style={{
                              padding: '1rem',
                              borderRadius: 'var(--radius-md)',
                              border: `1.5px solid ${statusColor}`,
                              backgroundColor: 'var(--bg-primary)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              position: 'relative',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                          >
                            {/* Card Top Indicator */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <div
                                  style={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    backgroundColor: statusColor,
                                    boxShadow: `0 0 8px ${statusColor}88`
                                  }}
                                />
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-700)' }}>
                                  {asset.id}
                                </span>
                              </div>
                              <span className={`badge ${getStatusBadgeClass(asset.status)}`} style={{ fontSize: '0.7rem' }}>
                                {asset.status}
                              </span>
                            </div>

                            {/* Machine Name & Category */}
                            <h5 style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                              {asset.name}
                            </h5>
                            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                              Type: {asset.type || asset.category}
                            </div>

                            {/* Department & Location */}
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                              <div><strong>Dept:</strong> {asset.department}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
                                <MapPin size={12} /> {asset.location}
                              </div>
                            </div>

                            {/* Health Bar */}
                            <div style={{ marginBottom: '0.75rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', marginBottom: '0.25rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Health Score:</span>
                                <strong style={{ color: statusColor }}>{asset.status === 'Offline' ? '--' : `${asset.healthScore}%`}</strong>
                              </div>
                              <div style={{ width: '100%', height: 6, backgroundColor: 'var(--border-light)', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ width: asset.status === 'Offline' ? '0%' : `${asset.healthScore}%`, height: '100%', backgroundColor: statusColor }} />
                              </div>
                            </div>

                            {/* Footer Data Tag & Action Link */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)', fontSize: '0.725rem' }}>
                              <span style={{ color: 'var(--text-light)', fontWeight: 600 }}>
                                Source: {asset.dataSource || 'Manual Entry'}
                              </span>
                              <span style={{ color: 'var(--primary-600)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                Profile <ArrowUpRight size={12} />
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
