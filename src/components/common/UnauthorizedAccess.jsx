import React from 'react';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { Card } from './Card';

export const UnauthorizedAccess = ({ userRole, onReturnHome }) => {
  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
      <Card>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: 'var(--status-danger-bg)',
            color: 'var(--status-danger-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto'
          }}
        >
          <ShieldAlert size={34} />
        </div>
        <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Access Restricted
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Your current account role (<strong>{userRole}</strong>) does not have authorization to view this section or sector management page.
        </p>
        <div
          style={{
            padding: '0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-light)',
            fontSize: '0.825rem',
            color: 'var(--text-secondary)',
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}
        >
          <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
            <Lock size={14} className="text-blue" /> Sector Security Protocol
          </div>
          Access permissions are restricted based on your assigned sector and role. Please contact your Plant Administrator if you require additional sector permissions.
        </div>
        <button className="btn btn-primary" onClick={onReturnHome}>
          <ArrowLeft size={16} /> Return to Authorized Dashboard
        </button>
      </Card>
    </div>
  );
};
