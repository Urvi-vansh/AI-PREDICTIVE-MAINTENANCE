import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, ShieldAlert, FileText, UserCheck, RotateCcw, ArrowUpRight } from 'lucide-react';

export const AuditTimelineView = ({ auditTimeline = [] }) => {
  if (!auditTimeline || auditTimeline.length === 0) {
    return (
      <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
        No audit event history logged for this incident yet.
      </div>
    );
  }

  const getActionIcon = (action) => {
    if (action.includes('Created')) return <ShieldAlert size={16} className="text-blue" />;
    if (action.includes('Acknowledged') || action.includes('Assigned')) return <UserCheck size={16} style={{ color: 'var(--primary-600)' }} />;
    if (action.includes('Progress')) return <Clock size={16} style={{ color: '#d97706' }} />;
    if (action.includes('Reminder')) return <AlertTriangle size={16} style={{ color: '#d97706' }} />;
    if (action.includes('Escalated')) return <ShieldAlert size={16} style={{ color: '#dc2626' }} />;
    if (action.includes('Resolved') || action.includes('Verified')) return <CheckCircle2 size={16} style={{ color: '#16a34a' }} />;
    if (action.includes('Reopened')) return <RotateCcw size={16} style={{ color: '#d97706' }} />;
    return <FileText size={16} className="text-blue" />;
  };

  return (
    <div className="audit-timeline-container" style={{ padding: '0.5rem 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
        {/* Timeline Connecting Bar */}
        <div
          style={{
            position: 'absolute',
            left: '17px',
            top: '12px',
            bottom: '12px',
            width: '2px',
            backgroundColor: 'var(--border-light)',
            zIndex: 0
          }}
        />

        {auditTimeline.map((evt, idx) => (
          <div
            key={evt.id || idx}
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
              position: 'relative',
              zIndex: 1
            }}
          >
            {/* Timeline Icon Node */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: 'var(--bg-primary)',
                border: '2px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                flexShrink: 0,
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {getActionIcon(evt.action)}
            </div>

            {/* Event Content Card */}
            <div
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {evt.action}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} /> {evt.timestamp}
                </span>
              </div>

              <div style={{ fontSize: '0.775rem', color: 'var(--primary-600)', fontWeight: 600, marginBottom: '0.25rem' }}>
                {evt.actor} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({evt.role})</span>
              </div>

              {evt.notes && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontStyle: 'italic', backgroundColor: 'var(--bg-primary)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                  "{evt.notes}"
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
