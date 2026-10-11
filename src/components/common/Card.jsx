import React from 'react';
import * as Icons from 'lucide-react';

export const Card = ({ title, subtitle, action, children, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {(title || action) && (
        <div className="card-header">
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export const KPICard = ({ title, value, subtext, trend, trendValue, iconName }) => {
  const IconComponent = Icons[iconName] || Icons.Activity;

  return (
    <div className="kpi-card">
      <div className="kpi-card-highlight" />
      <div className="kpi-header">
        <span className="kpi-title">{title}</span>
        <div className="kpi-icon-box">
          <IconComponent size={20} />
        </div>
      </div>
      <div>
        <div className="kpi-value">{value}</div>
        <div className="kpi-footer">
          {trendValue && (
            <span className={`trend-badge ${trend}`}>
              {trend === 'positive' && <Icons.TrendingUp size={12} />}
              {trend === 'negative' && <Icons.TrendingDown size={12} />}
              {trendValue}
            </span>
          )}
          <span className="text-muted">{subtext}</span>
        </div>
      </div>
    </div>
  );
};
