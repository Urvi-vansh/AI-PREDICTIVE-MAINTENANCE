import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Bell, ShieldAlert, AlertTriangle, Info, Check, Search, CheckCheck, ArrowRight } from 'lucide-react';

export const NotificationsView = ({ notifications = [], onMarkAllRead, onNavigateTab }) => {
  const [filterType, setFilterType] = useState('All');
  const [readFilter, setReadFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotifs = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.desc.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'All' || n.type === filterType;
    const matchesRead =
      readFilter === 'All' ||
      (readFilter === 'unread' && !n.read) ||
      (readFilter === 'read' && n.read);

    return matchesSearch && matchesType && matchesRead;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (item) => {
    if (item.title.toLowerCase().includes('alert') || item.title.toLowerCase().includes('vibration') || item.title.toLowerCase().includes('temperature')) {
      if (onNavigateTab) onNavigateTab('alerts');
    } else if (item.title.toLowerCase().includes('machine') || item.title.toLowerCase().includes('asset')) {
      if (onNavigateTab) onNavigateTab('assets');
    } else {
      if (onNavigateTab) onNavigateTab('work-orders');
    }
  };

  return (
    <div style={{ maxWidth: '960px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Plant Notifications & Alert Feed</h2>
            {unreadCount > 0 && (
              <span className="badge badge-critical" style={{ fontSize: '0.75rem' }}>
                {unreadCount} Unread Notifications
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            System activity, telemetry alerts, work order progress, & reminder dispatch notifications
          </p>
        </div>

        <button className="btn btn-outline-blue btn-sm" onClick={onMarkAllRead}>
          <CheckCheck size={16} /> Mark All as Read
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {['All', 'unread', 'critical', 'warning', 'info'].map((t) => (
              <button
                key={t}
                className={`btn btn-sm ${filterType === t || readFilter === t ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => {
                  if (t === 'unread') {
                    setReadFilter('unread');
                    setFilterType('All');
                  } else {
                    setReadFilter('All');
                    setFilterType(t);
                  }
                }}
                style={{ textTransform: 'capitalize' }}
              >
                {t === 'All' ? 'All Activity' : t}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.4rem' }}
              placeholder="Search feed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      <Card title={`Notification History (${filteredNotifs.length} Items)`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredNotifs.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Bell size={36} style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 600 }}>No Notifications Found</div>
              <div style={{ fontSize: '0.8rem' }}>No activity notifications match your current filter settings.</div>
            </div>
          ) : (
            filteredNotifs.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  backgroundColor: !n.read ? 'var(--primary-50)' : 'var(--bg-primary)',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: !n.read ? '0 2px 6px rgba(37, 99, 235, 0.08)' : 'none'
                }}
              >
                <div className={`notification-icon ${n.type}`} style={{ flexShrink: 0 }}>
                  {n.type === 'critical' ? <ShieldAlert size={20} /> : n.type === 'warning' ? <AlertTriangle size={20} /> : <Info size={20} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <h4 style={{ fontSize: '0.925rem', color: 'var(--text-main)', margin: 0, fontWeight: !n.read ? 700 : 600 }}>
                        {n.title}
                      </h4>
                      {!n.read && (
                        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--primary-600)', display: 'inline-block' }} />
                      )}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{n.time}</span>
                  </div>

                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.2rem 0 0.5rem 0' }}>
                    {n.desc}
                  </p>

                  <div style={{ fontSize: '0.75rem', color: 'var(--primary-600)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    View Related Target Module <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
