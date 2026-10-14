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
  Users,
  ArrowUpRight,
  Eye,
  Info,
  ChevronRight
} from 'lucide-react';

export const OverviewDashboard = ({
  assets,
  workOrders,
  alerts,
  onSelectAsset,
  onNavigateTab,
  onOpenAddMachineModal,
  onOpenWorkOrderModal,
  onSelectSectorFilter,
  pendingApprovalCount = 0
}) => {
// Dynamic counts from state
  const totalMachines = assets.length;
  const healthyMachines = assets.filter(a => a.status === 'Operational').length;
  const attentionMachines = assets.filter(a => a.status === 'Warning' || a.status === 'Maintenance Required').length;
  const criticalMachines = assets.filter(a => a.status === 'Critical' || a.status === 'Offline').length;
  const openFailures = alerts.filter(a => a.status === 'Open' || a.status === 'Investigating').length;
  const resolvedFailures = alerts.filter(a => a.status === 'Resolved' || a.status === 'Closed').length;

  const healthyPct = totalMachines > 0 ? Math.round((healthyMachines / totalMachines) * 100) : 0;
  const attentionPct = totalMachines > 0 ? Math.round((attentionMachines / totalMachines) * 100) : 0;
  const criticalPct = totalMachines > 0 ? Math.max(0, 100 - healthyPct - attentionPct) : 0;

  // Custom overview cards data
  const overviewCards = [
    {
      title: 'Total Machines',
      value: totalMachines,
      subtext: `${totalMachines} monitored machine assets`,
      trend: 'positive',
      trendValue: totalMachines > 0 ? '100% Monitored' : 'No Assets',
      iconName: 'Cpu'
    },
    {
      title: 'Healthy Machines',
      value: healthyMachines,
      subtext: `${healthyPct}% of total fleet`,
      trend: 'positive',
      trendValue: healthyPct > 80 ? 'Optimal' : 'Needs Review',
      iconName: 'CheckCircle2'
    },
    {
      title: 'Requires Attention',
      value: attentionMachines,
      subtext: `${attentionPct}% of total fleet`,
      trend: attentionMachines > 0 ? 'neutral' : 'positive',
      trendValue: `${attentionMachines} Active`,
      iconName: 'AlertTriangle'
    },
    {
      title: 'Open Critical Failures',
      value: openFailures,
      subtext: 'Actionable technician response',
      trend: openFailures > 0 ? 'negative' : 'positive',
      trendValue: openFailures > 0 ? 'Action Req.' : 'All Clear',
      iconName: 'ShieldAlert'
    },
    {
      title: 'Operational Sectors',
      value: 4,
      subtext: 'Sectors 1, 2, 3 & 4 monitored',
      trend: 'positive',
      trendValue: '4 Active',
      iconName: 'Building2'
    },
    {
      title: 'Resolved Incidents',
      value: resolvedFailures,
      subtext: 'Repaired & verified incidents',
      trend: 'positive',
      trendValue: `${resolvedFailures} Total`,
      iconName: 'CheckSquare'
    }
  ];

  // Dynamic sector summaries
  const standardSectors = [
    { id: 'sec-1', name: 'Sector 1', headName: 'Sector Head - Sector 1' },
    { id: 'sec-2', name: 'Sector 2', headName: 'Sector Head - Sector 2' },
    { id: 'sec-3', name: 'Sector 3', headName: 'Sector Head - Sector 3' },
    { id: 'sec-4', name: 'Sector 4', headName: 'Sector Head - Sector 4' }
  ];

  const sectorSummaries = standardSectors.map((sec) => {
    const secAssets = assets.filter(
      (a) => a.sector === sec.name || (a.sector && a.sector.startsWith(sec.name))
    );
    const secTotal = secAssets.length;
    const secHealthy = secAssets.filter((a) => a.status === 'Operational').length;
    const secCritical = secAssets.filter(
      (a) => a.status === 'Critical' || a.status === 'Warning' || a.status === 'Maintenance Required'
    ).length;
    const secHealthIndex = secTotal > 0 ? Math.round((secHealthy / secTotal) * 100) : 100;

    return {
      ...sec,
      totalMachines: secTotal,
      healthyMachines: secHealthy,
      criticalMachines: secCritical,
      healthIndex: secHealthIndex
    };
  });



  const conicGrad = totalMachines === 0
    ? 'conic-gradient(var(--border-medium) 0% 100%)'
    : `conic-gradient(#16a34a 0% ${healthyPct}%, #eab308 ${healthyPct}% ${healthyPct + attentionPct}%, #dc2626 ${healthyPct + attentionPct}% 100%)`;

  return (
    <div>
      {/* Quick Action Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span className="badge badge-neutral" style={{ fontSize: '0.8rem', border: '1px solid var(--border-medium)' }}>
            Plant Facility #04 • Live Operations
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Admin Control Center
          </span>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={onOpenAddMachineModal}>
            <Plus size={16} /> + Add Machine
          </button>
          <button className="btn btn-outline-blue btn-sm" onClick={() => onNavigateTab('alerts')}>
            <ShieldAlert size={16} /> Failure Alerts
          </button>
          <button className="btn btn-outline-blue btn-sm" onClick={() => onNavigateTab('users')}>
            <Users size={16} /> Manage Users
            {pendingApprovalCount > 0 && (
              <span
                style={{
                  backgroundColor: 'var(--status-warning-text)',
                  color: '#ffffff',
                  borderRadius: '10px',
                  padding: '0.1rem 0.45rem',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  marginLeft: '0.35rem'
                }}
              >
                {pendingApprovalCount} Pending
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Pending Access Approvals Banner for Admin */}
      {pendingApprovalCount > 0 && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            backgroundColor: 'var(--status-warning-bg)',
            border: '1px solid var(--status-warning-border)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.1rem' }}>⚠️</span>
            <div>
              <strong style={{ color: 'var(--status-warning-dark)', fontSize: '0.9rem' }}>
                {pendingApprovalCount} Personnel Access {pendingApprovalCount === 1 ? 'Request' : 'Requests'} Pending Approval
              </strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                New technician or sector head accounts require Administrator authorization before accessing plant data.
              </div>
            </div>
          </div>
          <button
            className="btn btn-sm btn-primary"
            style={{ backgroundColor: 'var(--status-warning-dark)', borderColor: 'var(--status-warning-dark)', fontSize: '0.8rem' }}
            onClick={() => onNavigateTab('users')}
          >
            Review & Approve Requests →
          </button>
        </div>
      )}

      {/* 6 Key Overview Metric Cards */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '1.75rem' }}>
        {overviewCards.map((item, idx) => (
          <KPICard key={idx} {...item} />
        ))}
      </div>

      {/* Sector-Wise Summary Section */}
      <Card
        title="Industry Sectors Operational Summary"
        subtitle="Real-time machinery distribution and health score per sector"
        style={{ marginBottom: '1.75rem' }}
        action={
          <button className="btn btn-outline-blue btn-sm" onClick={() => onNavigateTab('sectors')}>
            View All Sectors <ArrowUpRight size={14} />
          </button>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {sectorSummaries.map((sec) => (
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
        <Card title="Machine Status Distribution" subtitle="Fleet operational status breakdown">
          <div style={{ padding: '1rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '1.5rem' }}>
              {/* CSS Donut Chart */}
              <div
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  background: conicGrad,
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
                  <span style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>{healthyPct}%</span>
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
                  <strong style={{ color: '#16a34a' }}>{healthyMachines} ({healthyPct}%)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#eab308' }} />
                    Warning / Attention
                  </span>
                  <strong style={{ color: 'var(--status-warning-dark, #a16207)' }}>{attentionMachines} ({attentionPct}%)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#dc2626' }} />
                    Critical Failure
                  </span>
                  <strong style={{ color: '#dc2626' }}>{criticalMachines} ({criticalPct}%)</strong>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Machinery Distribution by Sector */}
        <Card title="Machinery Distribution by Sector" subtitle="Monitored equipment inventory across plant zones">
          <div style={{ height: 180, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '1rem', padding: '1rem 0.5rem 0 0.5rem' }}>
            {sectorSummaries.map((sec) => {
              const maxCount = Math.max(1, ...sectorSummaries.map(s => s.totalMachines));
              const barHeight = sec.totalMachines > 0 ? Math.max(16, Math.round((sec.totalMachines / maxCount) * 110)) : 8;
              return (
                <div key={sec.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '0.45rem', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-600)' }}>
                    {sec.totalMachines}
                  </div>
                  <div
                    style={{
                      width: '32px',
                      height: `${barHeight}px`,
                      backgroundColor: 'var(--primary-600)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease'
                    }}
                    title={`${sec.name}: ${sec.totalMachines} machines`}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{sec.name}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '0.75rem', fontSize: '0.775rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
              <span style={{ width: 10, height: 10, backgroundColor: 'var(--primary-600)', borderRadius: 2 }} /> Plant Floor Machinery Assets
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
              {alerts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No alerts currently logged in the system.
                  </td>
                </tr>
              ) : (
                alerts.slice(0, 5).map((alt) => {
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
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
