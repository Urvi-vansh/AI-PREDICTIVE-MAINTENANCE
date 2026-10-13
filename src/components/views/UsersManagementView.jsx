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
  Building2
} from 'lucide-react';
import { ROLES, getRequiredApprover, canUserApproveTarget } from '../../config/permissions';

export const UsersManagementView = ({
  usersList = [],
  currentUser,
  onAddUser,
  onApproveUser,
  onRejectUser
}) => {
  const isMechHead = currentUser?.role === ROLES.MECHANICAL_HEAD;
  const isElecHead = currentUser?.role === ROLES.ELECTRICAL_HEAD;
  const isAdmin = currentUser?.role === ROLES.ADMIN || !currentUser;

  const defaultSector = isMechHead
    ? 'Mechanical Department'
    : isElecHead
    ? 'Electrical Department'
    : 'All';

  const [selectedSector, setSelectedSector] = useState(defaultSector);
  const [statusFilter, setStatusFilter] = useState('All');

  // Ensure users list pulls from state or latest localStorage
  const rawList = usersList && usersList.length > 0 ? usersList : (() => {
    try {
      const stored = localStorage.getItem('industrialcare_users');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  })();

  const effectiveUsers = rawList.length > 0 ? rawList : [
    {
      name: 'raj',
      email: 'rajvansh0@gmail.com',
      role: ROLES.MECHANICAL_TECH,
      title: 'Mechanical technician',
      sector: 'Mechanical Department',
      avatar: 'RJ',
      employeeId: 'EMP-7492',
      status: 'Pending Approval',
      isApproved: false,
      requestedAt: 'Just now',
      description: 'Access requested as Mechanical technician (Mechanical Department). Routed to Mechanical Department Head for authorization.',
      approverRole: ROLES.MECHANICAL_HEAD,
      approverTitle: 'Mechanical Department Head'
    }
  ];

  // Role-filtered pending user requests awaiting approval
  const pendingUsers = effectiveUsers.filter((u) => {
    const isPending = u.status === 'Pending Approval' || (!u.isApproved && u.role !== ROLES.ADMIN);
    if (!isPending) return false;
    if (isMechHead) {
      return u.role === ROLES.MECHANICAL_TECH;
    }
    if (isElecHead) {
      return u.role === ROLES.ELECTRICAL_TECH;
    }
    // Admin sees ONLY Sector Heads and Department Heads requiring Admin approval (technicians route strictly to department heads)
    if (isAdmin) {
      return [
        ROLES.PRODUCTION_HEAD,
        ROLES.MECHANICAL_HEAD,
        ROLES.ELECTRICAL_HEAD
      ].includes(u.role);
    }
    return false;
  });

  const filteredUsers = effectiveUsers.filter((u) => {
    // If department head, restrict table to their department or selected filter
    const matchesSector =
      isMechHead
        ? u.sector === 'Mechanical Department' || selectedSector === u.sector
        : isElecHead
        ? u.sector === 'Electrical Department' || selectedSector === u.sector
        : selectedSector === 'All' || u.sector === selectedSector;

    const isPending = u.status === 'Pending Approval' || (!u.isApproved && u.role !== ROLES.ADMIN);
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Pending' && isPending) ||
      (statusFilter === 'Active' && !isPending && u.status !== 'Rejected') ||
      (statusFilter === 'Rejected' && u.status === 'Rejected');

    return matchesSector && matchesStatus;
  });

  const getPageTitle = () => {
    if (isMechHead) return 'Mechanical Department Team & Technician Approvals';
    if (isElecHead) return 'Electrical Department Team & Technician Approvals';
    return 'Plant User & Role Management';
  };

  const getPageSubtitle = () => {
    if (isMechHead) return 'Authorize operational mechanical technician registrations and manage department team permissions';
    if (isElecHead) return 'Authorize operational electrical technician registrations and manage department team permissions';
    return 'Authorize operational sector head and department head registrations and manage facility permissions';
  };

  const getPendingCardTitle = () => {
    if (isMechHead) return `Pending Mechanical Technician Approvals (${pendingUsers.length})`;
    if (isElecHead) return `Pending Electrical Technician Approvals (${pendingUsers.length})`;
    return `Pending Sector & Department Head Approvals (${pendingUsers.length})`;
  };

  return (
    <div>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0 }}>{getPageTitle()}</h2>
            {pendingUsers.length > 0 && (
              <span className="badge badge-warning" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                {pendingUsers.length} Approval Required
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {getPageSubtitle()}
          </p>
        </div>
      </div>

      {/* PENDING APPROVAL REQUESTS SECTION */}
      {pendingUsers.length > 0 && (
        <Card
          title={getPendingCardTitle()}
          subtitle={
            isMechHead || isElecHead
              ? `Operational technician access requests awaiting ${currentUser?.title || 'Department Head'} authorization`
              : 'Sector head and department head registrations requiring System Administrator authorization'
          }
          style={{
            marginBottom: '1.75rem',
            border: '2px solid rgba(217, 119, 6, 0.4)',
            backgroundColor: 'var(--bg-secondary)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingUsers.map((pUser) => {
              const approver = getRequiredApprover(pUser.role);
              const canApprove = canUserApproveTarget(currentUser?.role, pUser);

              return (
                <div
                  key={pUser.email}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--bg-primary)',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      className="user-avatar"
                      style={{
                        width: 44,
                        height: 44,
                        fontSize: '1rem',
                        backgroundColor: 'rgba(217, 119, 6, 0.15)',
                        color: '#d97706',
                        border: '1px solid rgba(217, 119, 6, 0.3)'
                      }}
                    >
                      {pUser.avatar || pUser.name?.substring(0, 2).toUpperCase() || 'RQ'}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{pUser.name}</strong>
                        <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                          ● Pending Approval
                        </span>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.5rem',
                            borderRadius: '6px',
                            backgroundColor: approver.role === ROLES.ADMIN ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                            color: approver.role === ROLES.ADMIN ? 'var(--primary-600)' : '#059669',
                            border: `1px solid ${approver.role === ROLES.ADMIN ? 'rgba(59, 130, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                          }}
                        >
                          Approval Authority: {approver.title}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: 'var(--primary-600)', fontWeight: 600, marginTop: '0.15rem' }}>
                        Requested: {pUser.title || pUser.role} • {pUser.sector}
                      </div>

                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <span>Email: <code style={{ color: 'var(--text-main)' }}>{pUser.email}</code></span>
                        {pUser.requestedAt && <span>Requested: {pUser.requestedAt}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Approve & Reject Actions */}
                  {canApprove ? (
                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                      <button
                        className="btn btn-sm btn-success"
                        style={{
                          backgroundColor: '#16a34a',
                          color: '#ffffff',
                          border: 'none',
                          fontWeight: 600,
                          padding: '0.45rem 0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                        onClick={() => onApproveUser && onApproveUser(pUser.email)}
                        title={`Authorize access as ${approver.title}`}
                      >
                        <CheckCircle2 size={15} /> Approve Access
                      </button>

                      <button
                        className="btn btn-sm btn-secondary"
                        style={{
                          borderColor: 'var(--status-danger-border)',
                          color: 'var(--status-danger-text)',
                          fontWeight: 600,
                          padding: '0.45rem 0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                        onClick={() => onRejectUser && onRejectUser(pUser.email)}
                        title="Deny access request"
                      >
                        <XCircle size={15} /> Reject
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Awaiting {approver.title}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Filter Toolbar */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Sector Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Sector:</span>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {['All', 'Sector 1', 'Sector 2', 'Sector 3', 'Sector 4', 'Mechanical Department', 'Electrical Department'].map((sec) => (
                <button
                  key={sec}
                  className={`btn btn-sm ${selectedSector === sec ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedSector(sec)}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status:</span>
            <select
              className="form-control form-select"
              style={{ width: '150px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending Approval</option>
              <option value="Active">Active / Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      {/* All Personnel Directory Table */}
      <Card title={`Registered Plant Personnel (${filteredUsers.length} Records)`}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>User & Name</th>
                <th>Role & Title</th>
                <th>Industry Sector</th>
                <th>Email Address</th>
                <th>Permissions Scope</th>
                <th>Authorization Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No registered personnel match the current filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isPending = u.status === 'Pending Approval' || (!u.isApproved && u.role !== ROLES.ADMIN);
                  const isRejected = u.status === 'Rejected';

                  return (
                    <tr key={u.email}>
                      <td>
                        <div className="asset-name-cell">
                          <div className="user-avatar" style={{ width: 38, height: 38, fontSize: '0.9rem' }}>
                            {u.avatar || u.name?.substring(0, 2).toUpperCase() || 'US'}
                          </div>
                          <div>
                            <div className="asset-title">{u.name}</div>
                            <div className="asset-code">{u.employeeId || 'PERSONNEL'}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--primary-600)' }}>
                          {u.title || u.role}
                        </span>
                      </td>
                      <td>{u.sector}</td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.825rem' }}>{u.email}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'inline-block', maxWidth: '260px' }}>
                          {u.description || 'Authorized facility access'}
                        </span>
                      </td>
                      <td>
                        {isPending ? (
                          <div>
                            <span className="badge badge-warning" style={{ fontSize: '0.75rem', fontWeight: 700, display: 'inline-block' }}>
                              ● Pending {getRequiredApprover(u.role).shortTitle} Approval
                            </span>
                          </div>
                        ) : isRejected ? (
                          <span className="badge badge-critical" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                            Declined
                          </span>
                        ) : (
                          <Badge status="Operational">Active</Badge>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {isPending ? (
                          canUserApproveTarget(currentUser?.role, u) ? (
                            <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                              <button
                                className="btn btn-sm btn-success"
                                style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                                onClick={() => onApproveUser && onApproveUser(u.email)}
                              >
                                Approve
                              </button>
                              <button
                                className="btn btn-sm btn-secondary"
                                style={{ color: 'var(--status-danger-text)', fontSize: '0.75rem', padding: '0.3rem 0.5rem' }}
                                onClick={() => onRejectUser && onRejectUser(u.email)}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                              Awaiting {getRequiredApprover(u.role).shortTitle}
                            </span>
                          )
                        ) : isRejected ? (
                          canUserApproveTarget(currentUser?.role, u) ? (
                            <button
                              className="btn btn-sm btn-secondary"
                              style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                              onClick={() => onApproveUser && onApproveUser(u.email)}
                            >
                              Re-approve
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Declined</span>
                          )
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                            Verified
                          </span>
                        )}
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
