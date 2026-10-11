import React from 'react';

export const Badge = ({ status = 'Operational', children, size = 'normal' }) => {
  const getBadgeClass = (statusStr) => {
    const s = statusStr.toLowerCase();
    if (s.includes('operational') || s.includes('normal') || s.includes('completed') || s.includes('healthy')) {
      return 'badge-operational';
    }
    if (s.includes('warning') || s.includes('medium') || s.includes('pending')) {
      return 'badge-warning';
    }
    if (s.includes('critical') || s.includes('high') || s.includes('overdue')) {
      return 'badge-critical';
    }
    if (s.includes('maintenance') || s.includes('in progress') || s.includes('info')) {
      return 'badge-maintenance';
    }
    return 'badge-neutral';
  };

  return (
    <span className={`badge ${getBadgeClass(status)} ${size === 'sm' ? 'badge-sm' : ''}`}>
      <span className="badge-dot"></span>
      {children || status}
    </span>
  );
};
