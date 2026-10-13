import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Building2, Cpu, ShieldAlert, Wrench, ArrowUpRight, CheckCircle2, User, Plus } from 'lucide-react';

export const SectorsView = ({
  assets = [],
  alerts = [],
  onSelectSectorFilter,
  onNavigateTab,
  onOpenAddMachineModal,
  userRole = 'admin'
}) => {
  const standardSectors = [
    {
      id: 'sec-1',
      name: 'Sector 1',
      fullName: 'Sector 1 (Production & Manufacturing)',
      headName: 'Sector Head - Sector 1',
      categories: ['Machining', 'Stamping', 'Robotics']
    },
    {
      id: 'sec-2',
      name: 'Sector 2',
      fullName: 'Sector 2 (Heavy Machining & Fabrication)',
      headName: 'Sector Head - Sector 2',
      categories: ['Machining', 'Fluid Systems', 'Thermal Systems']
    },
    {
      id: 'sec-3',
      name: 'Sector 3',
      fullName: 'Sector 3 (Assembly & Packaging)',
      headName: 'Sector Head - Sector 3',
      categories: ['Material Handling', 'Robotics', 'Pneumatics']
    },
    {
      id: 'sec-4',
      name: 'Sector 4',
      fullName: 'Sector 4 (Material Handling & Logistics)',
      headName: 'Sector Head - Sector 4',
      categories: ['Material Handling', 'Pneumatics', 'Electrical Distribution']
    }
  ];

  // Dynamic sector aggregation from real asset records
  const sectorsSummary = standardSectors.map((sec) => {
    const secAssets = assets.filter(
      (a) => a.sector === sec.name || a.sector === sec.fullName || (a.sector && a.sector.startsWith(sec.name))
    );
    const total = secAssets.length;
    const healthy = secAssets.filter((a) => a.status === 'Operational').length;
    const critical = secAssets.filter(
      (a) => a.status === 'Critical' || a.status === 'Warning' || a.status === 'Maintenance Required'
    ).length;
    const healthIndex = total > 0 ? Math.round((healthy / total) * 100) : 100;

    return {
      ...sec,
      totalMachines: total,
      healthyMachines: healthy,
      criticalMachines: critical,
      healthIndex
    };
  });

  return (
    <div>
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Plant Industry Sectors Overview</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Authorized operational management across Sectors 1, 2, 3, and 4</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="badge badge-neutral" style={{ fontSize: '0.8rem', border: '1px solid var(--border-medium)' }}>
            4 Operational Sectors
          </span>
          {userRole === 'admin' && onOpenAddMachineModal && (
            <button className="btn btn-secondary btn-sm" onClick={onOpenAddMachineModal}>
              <Plus size={16} /> + Add Machine
            </button>
          )}
        </div>
      </div>

      {/* Sector Summary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {sectorsSummary.map((sec) => (
          <Card
            key={sec.id}
            title={sec.name}
            subtitle={`Sector Head: ${sec.headName}`}
            action={
              <button
                className="btn btn-outline-blue btn-sm"
                onClick={() => {
                  onSelectSectorFilter(sec.name);
                  onNavigateTab('assets');
                }}
              >
                Inspect Fleet <ArrowUpRight size={14} />
              </button>
            }
          >
            {/* Health Score Progress Bar */}
            <div style={{ margin: '0.75rem 0 1.25rem 0', padding: '0.85rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Building2 size={16} className="text-blue" /> Sector Health Index
                </span>
                <span style={{ fontWeight: 700, color: '#16a34a' }}>{sec.healthIndex}%</span>
              </div>
              <div style={{ width: '100%', height: 8, backgroundColor: 'var(--border-light)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${sec.healthIndex}%`, height: '100%', backgroundColor: '#16a34a' }} />
              </div>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.6rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Machines</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>{sec.totalMachines}</div>
              </div>
              <div style={{ padding: '0.6rem', backgroundColor: 'var(--status-success-bg)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--status-success-text)' }}>Healthy</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--status-success-text)' }}>{sec.healthyMachines}</div>
              </div>
              <div style={{ padding: '0.6rem', backgroundColor: 'var(--status-danger-bg)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--status-danger-text)' }}>Critical</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--status-danger-text)' }}>{sec.criticalMachines}</div>
              </div>
            </div>

            {/* Category Tags */}
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
              Authorized Machinery Categories:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {sec.categories.map((cat) => (
                <span key={cat} className="nav-badge" style={{ fontSize: '0.7rem', backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)' }}>
                  {cat}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
