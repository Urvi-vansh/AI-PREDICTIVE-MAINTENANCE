import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import {
  Users,
  Shield,
  Plus,
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  AlertTriangle,
  Building2,
  Search,
  Filter,
  FileText,
  Eye,
  RotateCcw
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { ROLES, getRequiredApprover, canUserApproveTarget } from '../../config/permissions';

export const UsersManagementView = ({
  usersList = [],
  currentUser,
  onAddUser,
  onApproveUser,
  onRejectUser
}) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'pending', 'rejected'
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedUserDossier, setSelectedUserDossier] = useState(null);

  const isMechHead = currentUser?.role === ROLES.MECHANICAL_HEAD;
  const isElecHead = currentUser?.role === ROLES.ELECTRICAL_HEAD;
  const isAdmin = currentUser?.role === ROLES.ADMIN || !currentUser;

  // Use effective users list
  const effectiveUsers = usersList && usersList.length > 0 ? usersList : [];

  // Filter pending users requiring active user's approval
  const pendingRequestsForCurrentUser = effectiveUsers.filter((u) => {
    const isPending = u.status === 'Pending Approval' || (!u.isApproved && u.status !== 'Rejected' && u.role !== ROLES.ADMIN);
    if (!isPending) return false;
    return canUserApproveTarget(currentUser?.role, u);
  });

  // Calculate counts strictly from the shared records
  const totalCount = effectiveUsers.length;
  const activeCount = effectiveUsers.filter((u) => u.status === 'Active' || (u.isApproved && u.status !== 'Rejected')).length;
  const pendingCount = effectiveUsers.filter((u) => u.status === 'Pending Approval' || (!u.isApproved && u.status !== 'Rejected' && u.role !== ROLES.ADMIN)).length;
  const rejectedCount = effectiveUsers.filter((u) => u.status === 'Rejected').length;

  const sectors = [
    'All',
    'Sector 1 (Production & Manufacturing)',
    'Sector 2 (Heavy Machining & Fabrication)',
    'Sector 3 (Assembly & Packaging)',
    'Sector 4 (Material Handling & Logistics)',
    'Mechanical Department',
    'Electrical Department',
    'Plant Operations Management'
  ];

  const rolesList = [
    'All',
    'System Administrator',
    'Sector Head - Sector 1',
    'Sector Head - Sector 2',
    'Sector Head - Sector 3',
    'Sector Head - Sector 4',
    'Mechanical Department Head',
    'Electrical Department Head',
    'Mechanical Technician',
    'Electrical Technician'
  ];

  const filteredUsers = effectiveUsers.filter((u) => {
    const isPending = u.status === 'Pending Approval' || (!u.isApproved && u.status !== 'Rejected' && u.role !== ROLES.ADMIN);
    const isActive = u.status === 'Active' || (u.isApproved && u.status !== 'Rejected');
    const isRejected = u.status === 'Rejected';

    // Tab filter
    if (activeTab === 'active' && !isActive) return false;
    if (activeTab === 'pending' && !isPending) return false;
    if (activeTab === 'rejected' && !isRejected) return false;

    // Search query
    const matchesSearch =
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.employeeId && u.employeeId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.title && u.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.role && u.role.toLowerCase().includes(searchTerm.toLowerCase()));

    // Sector filter
    const matchesSector =
      sectorFilter === 'All' ||
      u.sector === sectorFilter ||
      (u.sector && u.sector.includes(sectorFilter.split(' ')[0]));

    // Role filter
    const matchesRole =
      roleFilter === 'All' ||
      u.title === roleFilter ||
      (u.role && u.role.toLowerCase().includes(roleFilter.toLowerCase()));

    return matchesSearch && matchesSector && matchesRole;
  });

  return (
    <div>
      {/* Header Info Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
            Plant Users & Access Control Governance
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Active personnel directory, pending approval routing, rejected registration logs, & audit histories
          </p>
        </div>
      </div>

      {/* KPI Stats Counters Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div
          onClick={() => setActiveTab('all')}
          style={{
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-md)',
            border: activeTab === 'all' ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Plant Personnel</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
            {totalCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>All registered accounts</div>
        </div>

        <div
          onClick={() => setActiveTab('active')}
          style={{
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--status-success-bg)',
            borderRadius: 'var(--radius-md)',
            border: activeTab === 'active' ? '2px solid #16a34a' : '1px solid var(--status-success-border)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--status-success-text)' }}>Active & Approved</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a', marginTop: '0.2rem' }}>
            {activeCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Full operational clearance</div>
        </div>

        <div
          onClick={() => setActiveTab('pending')}
          style={{
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--status-warning-bg)',
            borderRadius: 'var(--radius-md)',
            border: activeTab === 'pending' ? '2px solid var(--status-warning-text)' : '1px solid var(--status-warning-border)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--status-warning-dark)' }}>Pending Approval</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-warning-dark)', marginTop: '0.2rem' }}>
            {pendingCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {pendingRequestsForCurrentUser.length > 0 ? (
              <strong style={{ color: '#dc2626' }}>{pendingRequestsForCurrentUser.length} awaiting your authorization!</strong>
            ) : (
              'Awaiting designated approver'
            )}
          </div>
        </div>

        <div
          onClick={() => setActiveTab('rejected')}
          style={{
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--status-danger-bg)',
            borderRadius: 'var(--radius-md)',
            border: activeTab === 'rejected' ? '2px solid #dc2626' : '1px solid var(--status-danger-border)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--status-danger-text)' }}>Rejected Requests</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#dc2626', marginTop: '0.2rem' }}>
            {rejectedCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Access denied / unverified</div>
        </div>
      </div>

      {/* PENDING APPROVAL ALERT BANNER (If user has pending approvals) */}
      {pendingRequestsForCurrentUser.length > 0 && (
        <Card
          title={`Action Required: ${pendingRequestsForCurrentUser.length} Pending Personnel Authorizations`}
          subtitle={`You are authenticated as ${currentUser?.title || currentUser?.role}. Please review and authorize the following requests.`}
          style={{
            marginBottom: '1.5rem',
            border: '2px solid rgba(217, 119, 6, 0.4)',
            backgroundColor: 'var(--bg-secondary)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pendingRequestsForCurrentUser.map((pUser) => {
              const approver = getRequiredApprover(pUser.role);
              return (
                <div
                  key={pUser.email}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    backgroundColor: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      className="user-avatar"
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor: 'var(--status-warning-bg)',
                        color: 'var(--status-warning-dark)',
                        fontWeight: 700
                      }}
                    >
                      {pUser.avatar || pUser.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                        {pUser.name} <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>({pUser.email})</span>
                      </div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                        Requested Role: {pUser.title || pUser.role} • {pUser.sector}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        Requested: {pUser.requestedAt || 'Recently'} • Designated Authority: {approver.title}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn btn-sm btn-success"
                      style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', fontWeight: 600 }}
                      onClick={() => onApproveUser && onApproveUser(pUser.email)}
                    >
                      <CheckCircle2 size={14} /> Approve Access
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      style={{ color: 'var(--status-danger-text)', fontWeight: 600 }}
                      onClick={() => onRejectUser && onRejectUser(pUser.email)}
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Tabs & Search Filter Toolbar */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          {/* Tab buttons */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button
              className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('all')}
            >
              All Personnel ({totalCount})
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'active' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('active')}
            >
              Active Users ({activeCount})
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending Approval ({pendingCount})
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'rejected' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('rejected')}
            >
              Rejected Users ({rejectedCount})
            </button>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.2rem', fontSize: '0.825rem' }}
              placeholder="Search personnel, email, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Dropdown Filters */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Sector / Dept:</span>
            <select
              className="form-control form-select"
              style={{ width: '200px', fontSize: '0.825rem' }}
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
            >
              {sectors.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Role:</span>
            <select
              className="form-control form-select"
              style={{ width: '190px', fontSize: '0.825rem' }}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              {rolesList.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Main Personnel Table with Complete Approval History Details */}
      <Card title={`Personnel Directory (${filteredUsers.length} Records)`}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Personnel Name & ID</th>
                <th>Role & Title</th>
                <th>Industry Sector / Dept</th>
                <th>Email Address</th>
                <th>Authorization Status</th>
                <th>Approval History & Audit</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No personnel records match the current filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isPending = u.status === 'Pending Approval' || (!u.isApproved && u.status !== 'Rejected' && u.role !== ROLES.ADMIN);
                  const isRejected = u.status === 'Rejected';
                  const isActive = !isPending && !isRejected;
                  const canApprove = canUserApproveTarget(currentUser?.role, u);
                  const approver = getRequiredApprover(u.role);

                  return (
                    <tr key={u.email}>
                      <td>
                        <div className="asset-name-cell">
                          <div
                            className="user-avatar"
                            style={{
                              width: 38,
                              height: 38,
                              fontSize: '0.9rem',
                              backgroundColor: isPending ? 'var(--status-warning-bg)' : isRejected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(37, 99, 235, 0.12)',
                              color: isPending ? 'var(--status-warning-dark)' : isRejected ? '#dc2626' : '#2563eb'
                            }}
                          >
                            {u.avatar || u.name?.substring(0, 2).toUpperCase() || 'US'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.875rem' }}>{u.name}</div>
                            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{u.employeeId || 'EMP-GEN'}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--primary-600)', fontSize: '0.825rem' }}>
                          {u.title || u.role}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>{u.sector}</div>
                      </td>

                      <td>
                        <code style={{ fontSize: '0.775rem' }}>{u.email}</code>
                      </td>

                      <td>
                        {isPending ? (
                          <span className="badge badge-warning" style={{ fontSize: '0.725rem', fontWeight: 700 }}>
                            ● Pending Approval
                          </span>
                        ) : isRejected ? (
                          <span className="badge badge-critical" style={{ fontSize: '0.725rem', fontWeight: 700 }}>
                            Declined
                          </span>
                        ) : (
                          <span className="badge badge-success" style={{ fontSize: '0.725rem', fontWeight: 700 }}>
                            Active / Approved
                          </span>
                        )}
                      </td>

                      {/* Complete Approval History Column */}
                      <td>
                        <div style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
                          {isActive && (
                            <div>
                              <span style={{ color: '#16a34a', fontWeight: 600 }}>Approved</span> by <strong>{u.approvedBy || 'Plant General Manager'}</strong>
                              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                                Role: {u.approvedByRole || 'Administrator'} • {u.approvedAt || 'Registered'}
                              </div>
                            </div>
                          )}

                          {isPending && (
                            <div>
                              <span style={{ color: 'var(--status-warning-dark)', fontWeight: 600 }}>Requested:</span> {u.requestedAt || 'Recently'}
                              <div style={{ color: 'var(--primary-600)', fontSize: '0.7rem', fontWeight: 600 }}>
                                Routing: {approver.title}
                              </div>
                            </div>
                          )}

                          {isRejected && (
                            <div>
                              <span style={{ color: '#dc2626', fontWeight: 600 }}>Rejected</span> by <strong>{u.rejectedBy || 'Department Head'}</strong>
                              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                                Reason: <em>{u.rejectReason || 'Safety clearance renewal required'}</em>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                          {isPending && canApprove && (
                            <>
                              <button
                                className="btn btn-sm btn-success"
                                style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', fontSize: '0.725rem', padding: '0.25rem 0.5rem' }}
                                onClick={() => onApproveUser && onApproveUser(u.email)}
                              >
                                Approve
                              </button>
                              <button
                                className="btn btn-sm btn-secondary"
                                style={{ color: 'var(--status-danger-text)', fontSize: '0.725rem', padding: '0.25rem 0.5rem' }}
                                onClick={() => onRejectUser && onRejectUser(u.email)}
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {isRejected && canApprove && (
                            <button
                              className="btn btn-sm btn-secondary"
                              style={{ fontSize: '0.725rem', padding: '0.25rem 0.5rem' }}
                              onClick={() => onApproveUser && onApproveUser(u.email)}
                            >
                              Re-evaluate
                            </button>
                          )}

                          <button
                            className="btn btn-sm btn-secondary"
                            style={{ fontSize: '0.725rem', padding: '0.25rem 0.5rem' }}
                            onClick={() => setSelectedUserDossier(u)}
                            title="View approval history dossier"
                          >
                            <Eye size={13} /> Dossier
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User Dossier & Approval History Modal */}
      {selectedUserDossier && (
        <Modal
          isOpen={Boolean(selectedUserDossier)}
          onClose={() => setSelectedUserDossier(null)}
          title={`Personnel Access & Approval Dossier: ${selectedUserDossier.name}`}
        >
          <div>
            {/* Header info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1.25rem' }}>
              <div
                className="user-avatar"
                style={{
                  width: 50,
                  height: 50,
                  fontSize: '1.15rem',
                  backgroundColor: 'rgba(37, 99, 235, 0.12)',
                  color: '#2563eb'
                }}
              >
                {selectedUserDossier.avatar || selectedUserDossier.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                  {selectedUserDossier.name}
                </h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                  {selectedUserDossier.title || selectedUserDossier.role} • {selectedUserDossier.sector}
                </div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                  Employee ID: <code>{selectedUserDossier.employeeId || 'PERSONNEL'}</code> • Email: <code>{selectedUserDossier.email}</code>
                </div>
              </div>
            </div>

            {/* Approval Lifecycle Timeline */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={15} /> Access Authorization Lifecycle Timeline
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* Stage 1: Request Submitted */}
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>1. Registration & Access Request Logged</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedUserDossier.requestedAt || 'Initial Registration'}</span>
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Requested role clearance for <strong>{selectedUserDossier.title || selectedUserDossier.role}</strong> in <strong>{selectedUserDossier.sector}</strong>.
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary-600)', marginTop: '0.15rem' }}>
                    Designated Approver: <strong>{getRequiredApprover(selectedUserDossier.role).title}</strong>
                  </div>
                </div>

                {/* Stage 2: Decision Record */}
                {selectedUserDossier.status === 'Active' && (
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--status-success-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--status-success-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.85rem', color: '#16a34a' }}>2. Operational Clearance Granted</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedUserDossier.approvedAt || 'Approved'}</span>
                    </div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                      Authorized by <strong>{selectedUserDossier.approvedBy || 'Plant General Manager'}</strong> ({selectedUserDossier.approvedByRole || 'Administrator'}). Full permissions active.
                    </div>
                  </div>
                )}

                {selectedUserDossier.status === 'Pending Approval' && (
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--status-warning-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--status-warning-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--status-warning-dark)' }}>2. Awaiting Authorization</strong>
                      <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>Pending</span>
                    </div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                      User is restricted to Pending Approval screen until authorized by <strong>{selectedUserDossier.approverTitle || getRequiredApprover(selectedUserDossier.role).title}</strong>.
                    </div>
                  </div>
                )}

                {selectedUserDossier.status === 'Rejected' && (
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--status-danger-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--status-danger-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.85rem', color: '#dc2626' }}>2. Access Request Declined</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedUserDossier.rejectedAt || 'Declined'}</span>
                    </div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                      Declined by <strong>{selectedUserDossier.rejectedBy || 'Department Head'}</strong> ({selectedUserDossier.rejectedByRole || 'Head'}).
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.2rem', fontStyle: 'italic' }}>
                      Reason: "{selectedUserDossier.rejectReason || 'Safety accreditation verification required.'}"
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Permissions summary */}
            <div style={{ marginBottom: '1.25rem', padding: '0.85rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                Role Permissions Scope
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', margin: 0 }}>
                {selectedUserDossier.description || 'Standard facility operational access.'}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedUserDossier(null)}>
                Close Dossier
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
