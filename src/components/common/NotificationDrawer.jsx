import React from 'react';
import { AlertTriangle, BellCheck, Info, ShieldAlert, Check } from 'lucide-react';

export const NotificationDrawer = ({ notifications, onMarkAllRead, onClose, onNavigateTab }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'critical':
        return <ShieldAlert size={18} />;
      case 'warning':
        return <AlertTriangle size={18} />;
      default:
        return <Info size={18} />;
    }
  };

  return (
    <div className="notification-drawer">
      <div className="notification-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h4 style={{ color: 'var(--text-main)', fontSize: '0.925rem', fontWeight: 600 }}>
            System Notifications
          </h4>
          <span className="nav-badge" style={{ backgroundColor: 'var(--primary-100)' }}>
            {notifications.filter((n) => !n.read).length} new
          </span>
        </div>
        <button
          onClick={onMarkAllRead}
          className="btn btn-sm btn-outline-blue"
          style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
        >
          <Check size={12} /> Mark all read
        </button>
      </div>

      <div className="notification-list">
        {notifications.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No notifications at this time
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`notification-item ${!item.read ? 'unread' : ''}`}
              style={{ cursor: onNavigateTab ? 'pointer' : 'default' }}
              onClick={() => {
                if (onNavigateTab) {
                  const titleLower = item.title.toLowerCase();
                  if (titleLower.includes('approval') || titleLower.includes('access request') || titleLower.includes('user') || titleLower.includes('personnel')) {
                    onNavigateTab('users');
                  } else if (titleLower.includes('alert') || titleLower.includes('failure')) {
                    onNavigateTab('alerts');
                  } else if (titleLower.includes('machine') || titleLower.includes('asset')) {
                    onNavigateTab('assets');
                  }
                }
              }}
            >
              <div className={`notification-icon ${item.type}`}>
                {getIcon(item.type)}
              </div>
              <div style={{ flex: 1 }}>
                <div className="notification-title">{item.title}</div>
                <div className="notification-desc">{item.desc}</div>
                <div className="notification-time">{item.time}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ padding: '0.75rem', textAlign: 'center', borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--bg-secondary)' }}>
        <button onClick={onClose} style={{ fontSize: '0.8rem', color: 'var(--primary-600)', fontWeight: 600 }}>
          Close Panel
        </button>
      </div>
    </div>
  );
};
