import React from 'react';
import {
  Building2,
  Layers,
  ShieldAlert,
  Users,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Cog
} from 'lucide-react';
import { hasTabPermission } from '../../config/permissions';

export const Sidebar = ({
  collapsed,
  setCollapsed,
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen,
  user,
  pendingApprovalCount = 0,
  openAlertsCount = 0
}) => {
  const allNavItems = [
    { id: 'sectors', label: 'Sectors', icon: Building2 },
    { id: 'departments', label: 'Departments', icon: Layers },
    { id: 'alerts', label: 'Alerts', icon: ShieldAlert, badge: openAlertsCount > 0 ? `${openAlertsCount}` : null },
    { id: 'users', label: 'Users', icon: Users, badge: pendingApprovalCount > 0 ? `${pendingApprovalCount} New` : null },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ];

  // Filter navigation items by role permissions
  const navItems = allNavItems.filter(item => hasTabPermission(user.role, item.id));

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            zIndex: 35
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Sidebar Header with IndustrialCare Logo & Tagline */}
        <div className="sidebar-header">
          <div className="brand-logo-area">
            <div className="logo-badge">
              <Cog size={22} />
            </div>
            {!collapsed && (
              <div className="brand-text-group">
                <div className="brand-name">
                  Industrial<span>Care</span>
                </div>
                <div className="brand-tagline" title="Smarter Maintenance. Better Productivity.">
                  Smarter Maintenance. Better Productivity.
                </div>
              </div>
            )}
          </div>

          <button
            className="sidebar-toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label="Toggle Sidebar"
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {/* Navigation Items (Role Restricted) */}
        <nav className="sidebar-nav">
          {!collapsed && <div className="nav-section-label">Navigation Menu</div>}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleTabClick(item.id)}
                title={collapsed ? item.label : ''}
              >
                <div className="nav-icon">
                  <Icon size={20} />
                </div>
                {!collapsed && (
                  <>
                    <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Role & Sector Status Footer */}
        {!collapsed && (
          <div className="sidebar-footer">
            <div className="sys-status-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                <div className="status-dot-pulse" />
                <span className="sys-status-text" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                  {user.title || user.role}
                </span>
              </div>
              <div className="sys-status-sub" style={{ fontSize: '0.725rem', color: 'var(--primary-700)', fontWeight: 500 }}>
                Sector: {user.sector}
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
