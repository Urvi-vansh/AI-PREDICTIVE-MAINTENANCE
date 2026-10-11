import React, { useState } from 'react';
import { Cog, Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, UserCheck, Wrench, Factory, Cpu, Zap } from 'lucide-react';
import { DEMO_ACCOUNTS, ROLES } from '../../config/permissions';

export const LoginView = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState(ROLES.ADMIN);
  const [email, setEmail] = useState('admin@industrialcare.io');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Handle role selection from demo cards
  const handleSelectRoleAccount = (account) => {
    setSelectedRole(account.role);
    setEmail(account.email);
    setPassword('••••••••••••');
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setValidationError('Please enter a valid work email address.');
      return;
    }
    if (!password || password.length < 4) {
      setValidationError('Password must be at least 4 characters.');
      return;
    }

    setValidationError('');
    setIsLoading(true);

    const account = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase()) || DEMO_ACCOUNTS.find(a => a.role === selectedRole);

    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        role: account ? account.role : selectedRole,
        name: account ? account.name : 'Authorized User',
        title: account ? account.title : 'Plant Specialist',
        sector: account ? account.sector : 'General Facilities',
        email: email,
        avatar: account ? account.avatar : 'AU'
      });
    }, 500);
  };

  return (
    <div className="login-screen" style={{ padding: '2rem 1rem' }}>
      <div className="login-card" style={{ maxWidth: '640px' }}>
        {/* Brand Header */}
        <div className="login-brand">
          <div className="login-logo">
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cog size={32} style={{ animation: 'spin 12s linear infinite' }} />
              <Wrench size={16} style={{ position: 'absolute' }} />
            </div>
          </div>
          <h1 className="login-title">
            Industrial<span style={{ color: 'var(--primary-600)' }}>Care</span>
          </h1>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-600)', marginTop: '0.25rem' }}>
            Smarter Maintenance. Better Productivity.
          </div>
          <p className="login-subtitle" style={{ fontSize: '0.775rem', marginTop: '0.2rem' }}>
            Role-Based Industrial Maintenance Access Management
          </p>
        </div>

        {/* Validation Alert */}
        {validationError && (
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--status-danger-bg)', border: '1px solid var(--status-danger-border)', color: 'var(--status-danger-text)', fontSize: '0.825rem', marginBottom: '1.25rem', textAlign: 'center' }}>
            {validationError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Work Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
              />
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.8rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-light)'
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <a href="#" style={{ fontSize: '0.775rem', fontWeight: 500 }} onClick={(e) => e.preventDefault()}>
                Forgot password?
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.8rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-light)'
                }}
              />
              <button
                type="button"
                style={{
                  position: 'absolute',
                  right: '0.8rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', marginBottom: '1.5rem' }}
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating Role...' : `Sign In as ${DEMO_ACCOUNTS.find(a => a.role === selectedRole)?.title || 'User'}`}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Demo Fast Role Selectors (6 User Types) */}
        <div className="login-demo-panel">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            Select Demo Account Role (6 Sector User Types)
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.6rem' }}>
            {DEMO_ACCOUNTS.map((acc) => {
              const isSelected = selectedRole === acc.role;
              return (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleSelectRoleAccount(acc)}
                  style={{
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
                    backgroundColor: isSelected ? 'var(--primary-50)' : 'var(--bg-primary)',
                    textAlign: 'left',
                    transition: 'all var(--transition-fast)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <div className="user-avatar" style={{ width: 22, height: 22, fontSize: '0.65rem' }}>
                      {acc.avatar}
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isSelected ? 'var(--primary-700)' : 'var(--text-main)' }}>
                      {acc.name}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.725rem', fontWeight: 600, color: 'var(--primary-600)' }}>
                    {acc.title}
                  </div>
                  <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>
                    {acc.sector}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
