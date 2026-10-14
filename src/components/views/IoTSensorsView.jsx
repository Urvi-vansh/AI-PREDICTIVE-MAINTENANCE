import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Radio, ShieldAlert, CheckCircle2, Info, Search, Filter } from 'lucide-react';

export const IoTSensorsView = ({ sensors }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredSensors = sensors.filter((s) => {
    const matchesSearch =
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Disclaimer / Mock Telemetry Info Banner */}
      <div
        style={{
          backgroundColor: 'var(--primary-50)',
          border: '1px solid var(--primary-200)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}
      >
        <Info size={22} className="text-blue" style={{ flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
            Static IoT Telemetry Overview (Mock Data)
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            This panel displays static simulated sensor readings for industrial telemetry monitoring.
          </div>
        </div>
      </div>

      {/* Sensor Fleet Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Gateways</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>12 Gateways</div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginTop: '0.2rem' }}>100% Operational</div>
        </div>
        <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Connected Sensors</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>452 Nodes</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Vibration, Temp, Pressure</div>
        </div>
        <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Normal State</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#16a34a', marginTop: '0.2rem' }}>444 Sensors</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Within safety limits</div>
        </div>
        <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Attention Thresholds</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--status-warning-dark)', marginTop: '0.2rem' }}>8 Sensors</div>
          <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600, marginTop: '0.2rem' }}>1 Critical Threshold</div>
        </div>
      </div>

      {/* Filter controls */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.4rem' }}
              placeholder="Search sensor ID, equipment name, or sensor type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status:</span>
            <select
              className="form-control form-select"
              style={{ width: '160px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Readings</option>
              <option value="Normal">Normal</option>
              <option value="Warning">Warning</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Sensor Table */}
      <Card title={`IoT Telemetry Sensor Readings (${filteredSensors.length} Nodes)`}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Sensor Node ID</th>
                <th>Installed Machine</th>
                <th>Parameter Type</th>
                <th>Current Telemetry Reading</th>
                <th>Normal Safe Range</th>
                <th>Reading Status</th>
                <th>Last Gateway Ping</th>
              </tr>
            </thead>
            <tbody>
              {filteredSensors.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Radio size={16} className="text-blue" />
                      <span style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-main)' }}>
                        {s.id}
                      </span>
                    </div>
                  </td>
                  <td>{s.assetName}</td>
                  <td>{s.type}</td>
                  <td>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: s.status === 'Critical' ? '#dc2626' : s.status === 'Warning' ? 'var(--status-warning-dark)' : '#0f172a' }}>
                      {s.currentValue}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.normalRange}</span>
                  </td>
                  <td><Badge status={s.status} /></td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.lastPing}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
