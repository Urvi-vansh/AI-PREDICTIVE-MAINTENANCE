import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import {
  Clock,
  PlusCircle,
  Search,
  Filter,
  BarChart3,
  PieChart,
  ChevronLeft,
  ChevronRight,
  AlertOctagon,
  Building2
} from 'lucide-react';
import { RecordDowntimeModal } from '../forms/RecordDowntimeModal';

export const DowntimeTrackingView = ({
  downtimeLogs = [],
  assets = [],
  onRecordDowntime,
  user
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [reasonFilter, setReasonFilter] = useState('All');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const sectors = ['All', 'Production & Manufacturing', 'Mechanical Department', 'Electrical Department'];
  const reasons = [
    'All',
    'Unplanned Mechanical Breakdown',
    'Electrical Power Outage / Trip',
    'Scheduled Preventive Servicing',
    'Material Shortage / Line Stop',
    'Tooling Changeover & Setup',
    'Major Equipment Overhaul'
  ];

  const filteredLogs = downtimeLogs.filter((log) => {
    const matchesSearch =
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.machineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.machineId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.notes.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSector = sectorFilter === 'All' || log.sector === sectorFilter;
    const matchesReason = reasonFilter === 'All' || log.reason === reasonFilter;

    return matchesSearch && matchesSector && matchesReason;
  });

  // Calculate Summary Statistics
  const totalStoppages = downtimeLogs.length;
  const totalDowntimeHours = downtimeLogs.reduce((acc, log) => acc + (log.downtimeHours || 0), 0);
  const ongoingStoppages = downtimeLogs.filter((log) => log.status === 'Ongoing').length;
  const avgMTTR = (totalDowntimeHours / (totalStoppages || 1)).toFixed(1);

  // Sector Downtime Breakdown
  const sectorDowntime = {
    'Production & Manufacturing': downtimeLogs.filter(l => l.sector === 'Production & Manufacturing').reduce((acc, l) => acc + (l.downtimeHours || 0), 0),
    'Mechanical Department': downtimeLogs.filter(l => l.sector === 'Mechanical Department').reduce((acc, l) => acc + (l.downtimeHours || 0), 0),
    'Electrical Department': downtimeLogs.filter(l => l.sector === 'Electrical Department').reduce((acc, l) => acc + (l.downtimeHours || 0), 0)
  };

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Machine Downtime & Stoppage Tracking</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Recorded machine halt logs, start/end timestamps, downtime duration, and sector summary charts
          </p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => setIsRecordModalOpen(true)}>
          <PlusCircle size={16} /> + Record Stoppage Log
        </button>
      </div>

      {/* KPI Overview Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Machine Stoppages</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary-600)', marginTop: '0.1rem' }}>
            {totalStoppages} Recorded Logs
          </div>
        </div>

        <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--status-warning-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--status-warning-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--status-warning-text)' }}>Total Downtime Duration</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--status-warning-text)', marginTop: '0.1rem' }}>
            {totalDowntimeHours.toFixed(1)} Hours
          </div>
        </div>

        <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-200)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary-700)' }}>Avg Time to Service (MTTR)</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary-700)', marginTop: '0.1rem' }}>
            {avgMTTR} Hrs / Stoppage
          </div>
        </div>

        <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--status-danger-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--status-danger-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--status-danger-text)' }}>Active Ongoing Stoppages</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--status-danger-text)', marginTop: '0.1rem' }}>
            {ongoingStoppages} Machine Halted
          </div>
        </div>
      </div>

      {/* Visual Downtime Summary Charts Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <Card title="Downtime Hours by Industry Sector" subtitle="Distribution across plant wings">
          <div style={{ padding: '0.5rem 0' }}>
            {Object.entries(sectorDowntime).map(([secName, hours]) => {
              const maxHours = Math.max(...Object.values(sectorDowntime), 1);
              const pct = Math.round((hours / maxHours) * 100);
              return (
                <div key={secName} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{secName}</span>
                    <strong style={{ color: 'var(--primary-600)' }}>{hours.toFixed(1)} hrs</strong>
                  </div>
                  <div style={{ width: '100%', height: 10, backgroundColor: 'var(--border-light)', borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', backgroundColor: 'var(--primary-600)', borderRadius: 5 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Stoppage Cause Categories Breakdown" subtitle="Recorded operational stoppage reasons">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.25rem 0' }}>
            {reasons.filter(r => r !== 'All').map((r) => {
              const count = downtimeLogs.filter(l => l.reason === r).length;
              return (
                <div key={r} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{r}</span>
                  <span className="nav-badge" style={{ fontSize: '0.75rem' }}>{count} events</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

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
              placeholder="Search machine ID, name, or stoppage reason..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Sector Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Sector:</span>
            <select
              className="form-control form-select"
              style={{ width: '170px' }}
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

          {/* Reason Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Reason:</span>
            <select
              className="form-control form-select"
              style={{ width: '180px' }}
              value={reasonFilter}
              onChange={(e) => {
                setReasonFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {reasons.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Downtime Log Table */}
      <Card title={`Recorded Stoppage Log History (${filteredLogs.length} Events)`}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Log ID & Machine</th>
                <th>Sector & Dept</th>
                <th>Start Timestamp</th>
                <th>End Timestamp</th>
                <th>Total Duration</th>
                <th>Stoppage Reason</th>
                <th>Status</th>
                <th>Recorded By</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <Clock size={36} style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: 600 }}>No Stoppage Logs Found</div>
                    <div style={{ fontSize: '0.8rem' }}>No machine stoppage records match your current criteria.</div>
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.875rem' }}>
                        {log.machineName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary-600)', fontFamily: 'monospace', fontWeight: 700 }}>
                        {log.id} • {log.machineId}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{log.sector}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{log.department}</div>
                    </td>

                    <td style={{ fontSize: '0.8rem' }}>{log.startTime}</td>
                    <td style={{ fontSize: '0.8rem' }}>{log.endTime}</td>

                    <td>
                      <strong style={{ color: log.status === 'Ongoing' ? '#dc2626' : 'var(--text-main)' }}>
                        {log.status === 'Ongoing' ? 'Ongoing' : `${log.downtimeHours} hrs`}
                      </strong>
                    </td>

                    <td>
                      <span className="nav-badge" style={{ fontSize: '0.725rem' }}>
                        {log.reason}
                      </span>
                    </td>

                    <td>
                      <span className={`badge ${log.status === 'Ongoing' ? 'badge-critical' : 'badge-operational'}`}>
                        {log.status}
                      </span>
                    </td>

                    <td style={{ fontSize: '0.8rem' }}>{log.recordedBy}</td>
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
              Page {currentPage} of {totalPages} ({filteredLogs.length} logs)
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

      {/* Record Downtime Modal */}
      {isRecordModalOpen && (
        <RecordDowntimeModal
          isOpen={isRecordModalOpen}
          onClose={() => setIsRecordModalOpen(false)}
          onRecordDowntime={onRecordDowntime}
          user={user}
          assets={assets}
        />
      )}
    </div>
  );
};
