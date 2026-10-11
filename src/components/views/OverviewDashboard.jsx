import React from 'react';
import { Card, KPICard } from '../common/Card';
import { Badge } from '../common/Badge';
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Clock,
  CheckSquare,
  Building2,
  Plus,
  Wrench,
  Users,
  ArrowUpRight,
  Eye,
  Info,
  ChevronRight
} from 'lucide-react';
import { ADMIN_KPI_STATS, MOCK_SECTORS_SUMMARY, MOCK_ALERTS } from '../../mockData/industrialData';

export const OverviewDashboard = ({
  assets,
  workOrders,
  alerts,
  onSelectAsset,
  onNavigateTab,
  onOpenAddMachineModal,
  onOpenWorkOrderModal,
  onSelectSectorFilter
}) => {
  // Compute counts from state
  const totalMachines = assets.length;
  const healthyMachines = assets.filter(a => a.status === 'Operational').length;
  const attentionMachines = assets.filter(a => a.status === 'Warning' || a.status === 'Maintenance Required').length;
  const openFailures = alerts.filter(a => a.status === 'Open' || a.status === 'Investigating').length;
  const overdueTasks = workOrders.filter(w => new Date(w.dueDate) < new Date('2026-10-10') && w.status !== 'Completed').length;
  const resolvedFailures = alerts.filter(a => a.status === 'Resolved').length + 32;

  // Custom overview cards data
  const overviewCards = [
    {
      title: 'Total Machines',
      value: totalMachines,
      subtext: 'Monitored across 3 sectors',
      trend: 'positive',
      trendValue: '100% Active',
      iconName: 'Cpu'
    },
    {
      title: 'Healthy Machines',
      value: healthyMachines,
      subtext: `${Math.round((healthyMachines / totalMachines) * 100)}% of total fleet`,
      trend: 'positive',
      trendValue: 'Optimal',
      iconName: 'CheckCircle2'
    },
    {
      title: 'Requires Attention',
      value: attentionMachines,
      subtext: 'Minor warnings or inspections',
      trend: 'neutral',
      trendValue: '8.6% Fleet',
      iconName: 'AlertTriangle'
    },
    {
      title: 'Open Critical Failures',
      value: openFailures,
      subtext: 'Urgent technician response',
      trend: 'negative',
      trendValue: 'Action Req.',
      iconName: 'ShieldAlert'
    },
    {
      title: 'Overdue Maintenance',
      value: overdueTasks,
      subtext: 'Exceeded target deadline',
      trend: 'negative',
      trendValue: 'Pending',
      iconName: 'Clock'
    },
    {
      title: 'Resolved Failures (30d)',
      value: resolvedFailures,
      subtext: 'Repaired & verified',
      trend: 'positive',
      trendValue: '+18% Speed',
      iconName: 'CheckSquare'
    }
  ];

  return (
    <div>
      {/* Demo Data Banner & Quick Action Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span className="badge badge-neutral" style={{ fontSize: '0.8rem', border: '1px solid var(--border-medium)' }}>
            <Info size={14} className="text-blue" /> Demo Data Mode
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Plant Facility #04 • Admin Control Center
          </span>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={onOpenAddMachineModal}>
            <Plus size={16} /> + Add Machine
          </button>
          <button className="btn btn-primary btn-sm" onClick={onOpenWorkOrderModal}>
            <Wrench size={16} /> + Create Maintenance Task
          </button>
          <button className="btn btn-outline-blue btn-sm" onClick={() => onNavigateTab('users')}>
            <Users size={16} /> Manage Users
          </button>
        </div>
      </div>

      {/* 6 Key Overview Metric Cards */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '1.75rem' }}>
        {overviewCards.map((item, idx) => (
          <KPICard key={idx} {...item} />
        ))}
      </div>

      {/* Sector-Wise Summary Section (3 Industry Sectors) */}
      <Card
        title="Industry Sectors Operational Summary"
        subtitle="Real-time machinery distribution and health score per department"
        style={{ marginBottom: '1.75rem' }}
        action={
          <button className="btn btn-outline-blue btn-sm" onClick={() => onNavigateTab('sectors')}>
            View All Sectors <ArrowUpRight size={14} />
          </button>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {MOCK_SECTORS_SUMMARY.map((sec) => (
            <div
              key={sec.id}
              onClick={() => {
                onSelectSectorFilter(sec.name);
                onNavigateTab('assets');
              }}
              style={{
                padding: '1.15rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-secondary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              className="kpi-card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building2 size={18} className="text-blue" />
                  <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>{sec.name}</span>
                </div>
                <span className="badge badge-operational">{sec.healthIndex}% Health</span>
              </div>

              <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                Head: <strong>{sec.headName}</strong>
              </div>

              {/* Health Bar */}
              <div style={{ width: '100%', height: 6, backgroundColor: 'var(--border-light)', borderRadius: 3, overflow: 'hidden', marginBottom: '0.85rem' }}>
                <div style={{ width: `${sec.healthIndex}%`, height: '100%', backgroundColor: '#16a34a' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                <span><strong>{sec.totalMachines}</strong> Machines</span>
                <span><strong style={{ color: '#16a34a' }}>{sec.healthyMachines}</strong> Healthy</span>
                <span><strong style={{ color: '#dc2626' }}>{sec.criticalMachines}</strong> Critical</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Visual Charts Section: Machine Status & Maintenance Tasks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.75rem' }}>
        {/* Machine Status Visual Chart */}
        <Card title="Machine Status Distribution" subtitle="Fleet operational status breakdown (Demo Visualization)">
          <div style={{ padding: '1rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '1.5rem' }}>
              {/* CSS Donut Chart */}
              <div
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  background: 'conic-gradient(#16a34a 0% 87.5%, #d97706 87.5% 96%, #dc2626 96% 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-md)',
                  flexShrink: 0
                }}
              >
                <div
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-primary)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>87.5%</span>
                  <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>Healthy Fleet</span>
                </div>
              </div>

              {/* Legend List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#16a34a' }} />
                    Operational / Healthy
                  </span>
                  <strong style={{ color: '#16a34a' }}>112 (87.5%)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#d97706' }} />
                    Warning / Attention
                  </span>
                  <strong style={{ color: '#d97706' }}>11 (8.6%)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#dc2626' }} />
                    Critical Failure
                  </span>
                  <strong style={{ color: '#dc2626' }}>5 (3.9%)</strong>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Maintenance Tasks Bar Chart */}
        <Card title="Monthly Maintenance Activity" subtitle="Preventative vs Corrective task executions">
          <div style={{ height: 180, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '0.75rem', padding: '1rem 0.5rem 0 0.5rem' }}>
            {[
              { month: 'May', prev: 38, corr: 12 },
              { month: 'Jun', prev: 42, corr: 9 },
              { month: 'Jul', prev: 45, corr: 14 },
              { month: 'Aug', prev: 40, corr: 8 },
              { month: 'Sep', prev: 48, corr: 11 },
              { month: 'Oct', prev: 52, corr: 6 }
            ].map((d) => (
              <div key={d.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '0.35rem', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', width: '100%', justifyContent: 'center' }}>
                  <div style={{ width: '14px', height: `${d.prev * 2.5}px`, backgroundColor: 'var(--primary-600)', borderRadius: '3px 3px 0 0' }} title={`Preventative: ${d.prev}`} />
                  <div style={{ width: '14px', height: `${d.corr * 2.5}px`, backgroundColor: '#d97706', borderRadius: '3px 3px 0 0' }} title={`Corrective: ${d.corr}`} />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{d.month}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '0.75rem', fontSize: '0.775rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: 10, height: 10, backgroundColor: 'var(--primary-600)', borderRadius: 2 }} /> Preventative Tasks
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: 10, height: 10, backgroundColor: '#d97706', borderRadius: 2 }} /> Corrective Tasks
            </span>
          </div>
        </Card>
      </div>

      {/* Recent Telemetry Alerts Table */}
      <Card
        title="Recent Machine Failure & Telemetry Alerts"
        subtitle="Machine ID, sector, department, severity, date, and status"
        action={
          <button className="btn btn-outline-blue btn-sm" onClick={() => onNavigateTab('alerts')}>
            View All Alerts Log <ArrowUpRight size={14} />
          </button>
        }
      >
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Machine ID & Name</th>
                <th>Sector</th>
                <th>Department</th>
                <th>Severity</th>
                <th>Event Date</th>
                <th>Status</th>
                <th>Inspect</th>
              </tr>
            </thead>
            <tbody>
              {alerts.slice(0, 5).map((alt) => {
                const targetAsset = assets.find(a => a.id === alt.machineId);
                return (
                  <tr
                    key={alt.id}
                    onClick={() => targetAsset && onSelectAsset(targetAsset)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <div>
                        <span style={{ fontWeight: 700, color: 'var(--primary-600)', fontFamily: 'monospace' }}>
                          {alt.machineId}
                        </span>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{alt.machineName}</div>
                      </div>
                    </td>
                    <td>{alt.sector}</td>
                    <td>{alt.department}</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: alt.severity === 'Critical' ? 'var(--status-danger-bg)' : alt.severity === 'Warning' ? 'var(--status-warning-bg)' : 'var(--status-info-bg)',
                          color: alt.severity === 'Critical' ? 'var(--status-danger-text)' : alt.severity === 'Warning' ? 'var(--status-warning-text)' : 'var(--status-info-text)'
                        }}
                      >
                        {alt.severity}
                      </span>
                    </td>
                    <td>{alt.date}</td>
                    <td><Badge status={alt.status} /></td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (targetAsset) onSelectAsset(targetAsset);
                        }}
                      >
                        <Eye size={14} /> Inspect Machine
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
