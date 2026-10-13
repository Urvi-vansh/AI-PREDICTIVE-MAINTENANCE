import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Plus,
  ChevronDown,
  User,
  LogOut,
  Shield,
  HelpCircle,
  Building2
} from 'lucide-react';
import { NotificationDrawer } from './NotificationDrawer';
import { ROLE_PERMISSIONS } from '../../config/permissions';

export const Header = ({
  activeTab,
  onOpenWorkOrderModal,
  notifications,
  onMarkAllRead,
  user,
  onLogout,
  setMobileOpen,
  onNavigateTab
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Plant Overview Control Center';
      case 'sectors': return 'Industry Sectors Summary';
      case 'assets': return 'Machinery & Equipment Fleet';
      case 'alerts': return 'Failure & Sensor Alerts Log';
      case 'work-orders': return 'Maintenance Tasks & Work Orders';
      case 'users': return 'Plant User & Role Management';
      case 'spare-parts': return 'Spare Parts Inventory';
      case 'analytics': return 'Reports & Operational Analytics';
      case 'notifications': return 'Notifications Center';
      case 'settings': return 'System Settings & Profile';
      default: return 'IndustrialCare Dashboard';
    }
  };

  const rolePerm = ROLE_PERMISSIONS[user.role] || {};
  const unreadCount = notifications.filter(n => !n.read).length;

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTabLabel = (tabKey) => {
    if (tabKey === 'work-orders') return 'Maintenance';
    if (tabKey === 'spare-parts') return 'Spare Parts';
    return tabKey.charAt(0).toUpperCase() + tabKey.slice(1);
  };

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Open Mobile Menu"
        >
          <Menu size={22} />
        </button>

        <div className="page-title-group">
          <h1>{getPageTitle()}</h1>
          <div className="breadcrumbs">
            <span>IndustrialCare</span>
            <span style={{ color: 'var(--text-light)' }}>/</span>
            <span style={{ color: 'var(--primary-600)', fontWeight: 600 }}>
              {user.sector ? user.sector : 'Plant Floor'}
            </span>
            <span style={{ color: 'var(--text-light)' }}>/</span>
            <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
              {getTabLabel(activeTab)}
            </span>
          </div>
        </div>
      </div>

      <div className="header-right">
        {/* Global Search Bar */}
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search assets, WOs..."
          />
          <span className="search-shortcut">⌘K</span>
        </div>

        {/* Quick Action Button (Role Authorized Only) */}
        {rolePerm.canCreateWorkOrders && (
          <button className="btn btn-primary btn-sm" onClick={onOpenWorkOrderModal}>
            <Plus size={16} />
            <span>New Work Order</span>
          </button>
        )}

        {/* Notification Bell with Dropdown */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            className="header-action-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <NotificationDrawer
              notifications={notifications}
              onMarkAllRead={onMarkAllRead}
              onClose={() => setShowNotifications(false)}
              onNavigateTab={(tab) => {
                if (onNavigateTab) onNavigateTab(tab);
                setShowNotifications(false);
              }}
            />
          )}
        </div>

        {/* User Profile Menu Dropdown */}
        <div className="user-profile-menu" ref={profileRef}>
          <button
            className="user-profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="user-avatar">{user.avatar}</div>
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-role">{user.title || user.role}</div>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </button>

          {showProfileMenu && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <p>{user.name}</p>
                <span style={{ fontSize: '0.725rem', color: 'var(--primary-600)', fontWeight: 600, display: 'block', marginTop: '0.1rem' }}>
                  {user.title || user.role}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Sector: {user.sector}
                </span>
              </div>
              <button className="dropdown-item">
                <User size={16} /> Account Profile
              </button>
              <button className="dropdown-item">
                <Building2 size={16} /> Sector Permissions
              </button>
              <button className="dropdown-item">
                <HelpCircle size={16} /> System Help & Docs
              </button>
              <div style={{ height: '1px', backgroundColor: 'var(--border-light)', margin: '0.25rem 0' }} />
              <button className="dropdown-item danger" onClick={onLogout}>
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
