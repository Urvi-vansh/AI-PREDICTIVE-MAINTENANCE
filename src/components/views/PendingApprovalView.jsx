import React, { useState } from 'react';
import {
  ShieldAlert,
  Clock,
  LogOut,
  RefreshCw,
  User,
  Mail,
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

import { getRequiredApprover } from '../../config/permissions';

export const PendingApprovalView = ({ user, onLogout, onCheckStatus }) => {
  const [checking, setChecking] = useState(false);
  const [checkMessage, setCheckMessage] = useState('');

  const isRejected = user && user.status === 'Rejected';
  const approver = getRequiredApprover(user?.role);

  const handleRefresh = () => {
    setChecking(true);
    setCheckMessage('');
    if (onCheckStatus) {
      onCheckStatus();
    }
    setTimeout(() => {
      setChecking(false);
      setCheckMessage(`Status checked: Awaiting authorization from ${approver.title}.`);
    }, 500);
  };

  const getHeadingTitle = () => {
    if (isRejected) return 'Access Request Declined';
    return `${approver.title} Approval Required`;
  };

  const getSubtitleText = () => {
    if (isRejected) {
      return `Your account access request was declined by ${approver.title}. Please contact plant administration if you believe this is an error.`;
    }
    return (
      <>
        Your account request as <strong>{user?.title || user?.role}</strong> has been submitted.
        Till approved by the <strong>{approver.title}</strong>, access to plant machinery, sensors, and operational data is restricted.
      </>
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        boxSizing: 'border-box',
        backgroundColor: 'var(--bg-primary)'
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '2.5rem 2rem',
          boxSizing: 'border-box',
          textAlign: 'center',
          boxShadow: 'var(--shadow-xl)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-medium)',
          backgroundColor: 'var(--bg-secondary)'
        }}
      >
        {/* Status Icon */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: isRejected ? 'var(--status-danger-bg)' : 'rgba(217, 119, 6, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            border: `2px solid ${isRejected ? 'var(--status-danger-border)' : 'rgba(217, 119, 6, 0.3)'}`
          }}
        >
          {isRejected ? (
            <XCircle size={38} style={{ color: 'var(--status-danger-text)' }} />
          ) : (
            <Clock size={38} style={{ color: '#d97706' }} />
          )}
        </div>

        {/* Brand */}
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.35rem' }}>
          IndustrialCare Plant Portal
        </div>

        {/* Main Status Heading */}
        <h1
          style={{
            fontSize: '1.55rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            margin: '0 0 0.75rem 0',
            lineHeight: 1.2
          }}
        >
          {getHeadingTitle()}
        </h1>

        {/* Informative Subtitle */}
        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            margin: '0 0 1.75rem 0'
          }}
        >
          {getSubtitleText()}
        </p>

        {/* User Request Summary Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            padding: '1.25rem',
            textAlign: 'left',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Account Request Details
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={15} /> Personnel Name:
              </span>
              <strong style={{ color: 'var(--text-main)' }}>{user?.name || 'New User'}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={15} /> Work Email:
              </span>
              <span style={{ color: 'var(--text-main)', fontFamily: 'monospace', fontSize: '0.825rem' }}>{user?.email}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Building2 size={15} /> Operational Role:
              </span>
              <strong style={{ color: 'var(--primary-600)' }}>{user?.title || user?.role}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Assigned Sector:</span>
              <span style={{ color: 'var(--text-secondary)' }}>{user?.sector || 'General Floor'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Approval Authority:</span>
              <span style={{ color: '#d97706', fontWeight: 700 }}>{approver.title}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Authorization Status:</span>
              <span
                className="badge"
                style={{
                  backgroundColor: isRejected ? 'var(--status-danger-bg)' : 'rgba(217, 119, 6, 0.15)',
                  color: isRejected ? 'var(--status-danger-text)' : '#d97706',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.65rem'
                }}
              >
                {isRejected ? 'Declined / Rejected' : `● Pending ${approver.shortTitle} Approval`}
              </span>
            </div>
          </div>
        </div>

        {/* Check Status Message Alert */}
        {checkMessage && (
          <div
            style={{
              padding: '0.65rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(217, 119, 6, 0.1)',
              border: '1px solid rgba(217, 119, 6, 0.25)',
              color: '#d97706',
              fontSize: '0.8rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <AlertCircle size={15} />
            <span>{checkMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {!isRejected && (
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', justifyContent: 'center' }}
              onClick={handleRefresh}
              disabled={checking}
            >
              <RefreshCw size={16} className={checking ? 'spin' : ''} />
              <span>{checking ? 'Checking Status...' : 'Check Approval Status'}</span>
            </button>
          )}

          <button
            className="btn btn-secondary"
            style={{ width: '100%', padding: '0.75rem', justifyContent: 'center' }}
            onClick={onLogout}
          >
            <LogOut size={16} />
            <span>Sign Out / Return to Login</span>
          </button>
        </div>

        {/* Footer Note */}
        <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-light)' }}>
          Contact System Administrator for expedited operational clearance.
        </div>
      </div>
    </div>
  );
};
