import React, { useState } from 'react';
import { Modal } from './Modal';
import { Badge } from './Badge';
import {
  Cpu,
  MapPin,
  Calendar,
  Activity,
  Wrench,
  ShieldCheck,
  Info,
  Clock,
  Edit3,
  Power,
  ShieldAlert,
  AlertTriangle,
  PlusCircle,
  FileText,
  Building2,
  Users
} from 'lucide-react';
import { ManualReadingsModal } from '../forms/ManualReadingsModal';
import { EditMachineModal } from '../forms/EditMachineModal';

export const AssetDetailsModal = ({
  isOpen,
  onClose,
  asset,
  alerts = [],
  workOrders = [],
  downtimeLogs = [],
  spareParts = [],
  userRole,
  onEditMachine,
  onDeactivateMachine,
  onSaveReadings
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isManualReadingsOpen, setIsManualReadingsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!asset) return null;

  const linkedAlerts = alerts.filter((a) => a.machineId === asset.id || a.machineName === asset.name);
  const linkedWorkOrders = workOrders.filter((w) => w.assetId === asset.id || w.assetName === asset.name);
  const linkedDowntimes = downtimeLogs.filter((d) => d.machineId === asset.id || d.machineName === asset.name);
  const linkedParts = spareParts.filter((p) => p.compatibleMachineId === asset.id || p.compatibleMachine === asset.name);

  const isAdmin = userRole === 'admin';

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Machine Profile: ${asset.name} (${asset.id})`}
      >
        <div>
          {/* Header Card Info */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase' }}>
                  {asset.id} • {asset.type || asset.category}
                </span>
                <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                  Source: {asset.dataSource || 'Demo Data'}
                </span>
              </div>
              <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginTop: '0.2rem', marginBottom: '0.25rem' }}>
                {asset.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Building2 size={14} /> {asset.sector}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Users size={14} /> Dept: <strong>{asset.department}</strong>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={14} /> {asset.location}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              <Badge status={asset.status} />
              {asset.lastUpdated && (
                <div style={{ fontSize: '0.725rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} /> Last Updated: {asset.lastUpdated}
                </div>
              )}
            </div>
          </div>

          {/* Machine Profile Action Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            {/* Tabs Selector */}
            <div style={{ display: 'flex', gap: '0.35rem', borderBottom: '1px solid var(--border-light)', width: '100%', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
              <button
                className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('overview')}
              >
                <Info size={14} /> Info & Telemetry
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('history')}
              >
                <Calendar size={14} /> Servicing History ({asset.maintenanceHistory?.length || 0})
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'downtime' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('downtime')}
              >
                <Clock size={14} /> Downtime Logs ({linkedDowntimes.length})
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'spare-parts' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('spare-parts')}
              >
                <Wrench size={14} /> Spare Parts ({linkedParts.length})
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'alerts' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('alerts')}
              >
                <ShieldAlert size={14} /> Alerts ({linkedAlerts.length})
              </button>
            </div>
          </div>

          {/* TAB 1: OVERVIEW & TELEMETRY */}
          {activeTab === 'overview' && (
            <div>
              {/* Health Score Bar */}
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Activity size={16} className="text-blue" /> Equipment Health Score
                  </span>
                  <span style={{ fontWeight: 700, color: asset.healthScore > 80 ? '#16a34a' : asset.healthScore > 60 ? '#d97706' : '#dc2626' }}>
                    {asset.healthScore}%
                  </span>
                </div>
                <div style={{ width: '100%', height: 8, backgroundColor: 'var(--border-light)', borderRadius: 4, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${asset.healthScore}%`,
                      height: '100%',
                      backgroundColor: asset.healthScore > 80 ? '#16a34a' : asset.healthScore > 60 ? '#d97706' : '#dc2626',
                      borderRadius: 4,
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>
              </div>

              {/* Manually Entered Sample Telemetry Readings */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.925rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Activity size={16} className="text-blue" /> Sample Sensor & Telemetry Readings
                </h4>
                <button
                  className="btn btn-outline-blue btn-sm"
                  style={{ fontSize: '0.75rem' }}
                  onClick={() => setIsManualReadingsOpen(true)}
                >
                  <PlusCircle size={14} /> Enter Manual Readings
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {asset.readings && asset.readings.length > 0 ? (
                  asset.readings.map((r, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.75rem',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-light)'
                      }}
                    >
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{r.name}</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: r.status === 'Critical' ? '#dc2626' : r.status === 'Warning' ? '#d97706' : 'var(--text-main)', marginTop: '0.1rem' }}>
                        {r.value} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{r.unit}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                        <span>Target: {r.range}</span>
                        <span style={{ fontWeight: 600, color: r.status === 'Critical' ? '#dc2626' : r.status === 'Warning' ? '#d97706' : '#16a34a' }}>
                          {r.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ colSpan: 'all', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>
                    No sample telemetry readings logged yet. Click "Enter Manual Readings" above to record field values.
                  </div>
                )}
              </div>

              {/* Technical Specifications Grid */}
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Info size={16} className="text-blue" /> Technical Equipment Specifications
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ padding: '0.6rem 0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Responsible Maintenance Dept</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>{asset.department}</div>
                </div>

                <div style={{ padding: '0.6rem 0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Assigned Specialist</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>{asset.assignedTech || 'Unassigned'}</div>
                </div>

                {asset.specs && Object.entries(asset.specs).map(([key, value]) => (
                  <div key={key} style={{ padding: '0.6rem 0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                      {key.replace(/([A-Z])/g, ' $1')}
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: MAINTENANCE HISTORY */}
          {activeTab === 'history' && (
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={16} className="text-blue" /> Equipment Servicing Log & Work Orders
              </h4>

              {asset.maintenanceHistory && asset.maintenanceHistory.length > 0 ? (
                <div className="table-container" style={{ marginBottom: '1.25rem' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Log ID</th>
                        <th>Servicing Date</th>
                        <th>Type</th>
                        <th>Technician</th>
                        <th>Details</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {asset.maintenanceHistory.map((mh) => (
                        <tr key={mh.id}>
                          <td><strong>{mh.id}</strong></td>
                          <td>{mh.date}</td>
                          <td>{mh.type}</td>
                          <td>{mh.technician}</td>
                          <td style={{ fontSize: '0.8rem' }}>{mh.details}</td>
                          <td><Badge status={mh.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No historical maintenance logs recorded for this machine.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DOWNTIME STOPS */}
          {activeTab === 'downtime' && (
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={16} className="text-blue" /> Machine Stoppage & Downtime History
              </h4>

              {linkedDowntimes.length > 0 ? (
                <div className="table-container" style={{ marginBottom: '1.25rem' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Log ID</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Duration</th>
                        <th>Reason</th>
                        <th>Recorded By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {linkedDowntimes.map((dt) => (
                        <tr key={dt.id}>
                          <td><strong>{dt.id}</strong></td>
                          <td style={{ fontSize: '0.8rem' }}>{dt.startTime}</td>
                          <td style={{ fontSize: '0.8rem' }}>{dt.endTime}</td>
                          <td><strong>{dt.status === 'Ongoing' ? 'Ongoing' : `${dt.downtimeHours} hrs`}</strong></td>
                          <td><span className="nav-badge" style={{ fontSize: '0.7rem' }}>{dt.reason}</span></td>
                          <td>{dt.recordedBy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No stoppage or downtime logs recorded for this machine.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: COMPATIBLE SPARE PARTS */}
          {activeTab === 'spare-parts' && (
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Wrench size={16} className="text-blue" /> Compatible Replacement Spare Parts
              </h4>

              {linkedParts.length > 0 ? (
                <div className="table-container" style={{ marginBottom: '1.25rem' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Part ID & Name</th>
                        <th>Category</th>
                        <th>Stock Qty</th>
                        <th>Unit Price</th>
                        <th>Location</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {linkedParts.map((prt) => (
                        <tr key={prt.id}>
                          <td>
                            <strong>{prt.name}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--primary-600)' }}>{prt.id}</div>
                          </td>
                          <td>{prt.category}</td>
                          <td><strong>{prt.stockQuantity} units</strong></td>
                          <td>{prt.unitPrice}</td>
                          <td>{prt.location}</td>
                          <td><Badge status={prt.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No specific spare parts linked to this machine profile.
                </div>
              )}
            </div>
          )}

          {/* TAB 5: LINKED ALERTS */}
          {activeTab === 'alerts' && (
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldAlert size={16} className="text-blue" /> Incident & Telemetry Alerts
              </h4>

              {linkedAlerts.length > 0 ? (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Alert ID</th>
                        <th>Title</th>
                        <th>Severity</th>
                        <th>Date & Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {linkedAlerts.map((alt) => (
                        <tr key={alt.id}>
                          <td><strong>{alt.id}</strong></td>
                          <td>{alt.title}</td>
                          <td>
                            <span className={`badge ${alt.severity === 'Critical' ? 'badge-critical' : alt.severity === 'Warning' ? 'badge-warning' : 'badge-info'}`}>
                              {alt.severity}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.8rem' }}>{alt.date}</td>
                          <td><Badge status={alt.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No active or past alerts linked to this machine.
                </div>
              )}
            </div>
          )}

          {/* Admin Management Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {isAdmin && (
                <>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <Edit3 size={14} /> Edit Record
                  </button>
                  <button
                    className={`btn btn-sm ${asset.status === 'Offline' ? 'btn-success' : 'btn-danger'}`}
                    onClick={() => {
                      if (onDeactivateMachine) {
                        onDeactivateMachine(asset.id);
                      }
                    }}
                  >
                    <Power size={14} /> {asset.status === 'Offline' ? 'Reactivate Machine' : 'Deactivate Machine'}
                  </button>
                </>
              )}
            </div>

            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              Close Profile
            </button>
          </div>
        </div>
      </Modal>

      {/* Manual Sample Readings Modal */}
      {isManualReadingsOpen && (
        <ManualReadingsModal
          isOpen={isManualReadingsOpen}
          onClose={() => setIsManualReadingsOpen(false)}
          asset={asset}
          onSaveReadings={onSaveReadings}
        />
      )}

      {/* Edit Machine Modal */}
      {isEditModalOpen && (
        <EditMachineModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          asset={asset}
          onSubmit={(updated) => {
            if (onEditMachine) {
              onEditMachine(updated);
            }
          }}
        />
      )}
    </>
  );
};
