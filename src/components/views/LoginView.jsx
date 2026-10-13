import React, { useState } from 'react';
import {
  Cog,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Wrench,
  Factory,
  Cpu,
  Zap,
  User,
  UserPlus,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { ROLES, SECTORS } from '../../config/permissions';

// Exactly the 9 requested operational role options
const OPERATIONAL_ROLES = [
  {
    key: 'system_admin',
    role: ROLES.ADMIN,
    label: 'System administrator',
    title: 'System administrator',
    sector: 'All Plant Sectors',
    department: 'Plant Administration',
    icon: ShieldCheck,
    avatar: 'SA'
  },
  {
    key: 'sector_head_1',
    role: ROLES.SECTOR_HEAD_1,
    label: 'Sector head - Sector 1',
    title: 'Sector Head 1 (Production & Manufacturing)',
    sector: 'Sector 1 (Production & Manufacturing)',
    department: 'Machining Line 1',
    icon: Factory,
    avatar: 'S1'
  },
  {
    key: 'sector_head_2',
    role: ROLES.SECTOR_HEAD_2,
    label: 'Sector head - Sector 2',
    title: 'Sector Head 2 (Heavy Machining & Fabrication)',
    sector: 'Sector 2 (Heavy Machining & Fabrication)',
    department: 'Heavy Machining Bay',
    icon: Factory,
    avatar: 'S2'
  },
  {
    key: 'sector_head_3',
    role: ROLES.SECTOR_HEAD_3,
    label: 'Sector head - Sector 3',
    title: 'Sector Head 3 (Assembly & Packaging)',
    sector: 'Sector 3 (Assembly & Packaging)',
    department: 'Automated Assembly Bay',
    icon: Factory,
    avatar: 'S3'
  },
  {
    key: 'sector_head_4',
    role: ROLES.SECTOR_HEAD_4,
    label: 'Sector head - Sector 4',
    title: 'Sector Head 4 (Material Handling & Logistics)',
    sector: 'Sector 4 (Material Handling & Logistics)',
    department: 'Logistics Conveyance Bay',
    icon: Factory,
    avatar: 'S4'
  },
  {
    key: 'mechanical_head',
    role: ROLES.MECHANICAL_HEAD,
    label: 'Mechanical department head',
    title: 'Mechanical Department Head',
    sector: 'Mechanical Department',
    department: 'Mechanical Department',
    icon: Wrench,
    avatar: 'MH'
  },
  {
    key: 'electrical_head',
    role: ROLES.ELECTRICAL_HEAD,
    label: 'Electrical department head',
    title: 'Electrical Department Head',
    sector: 'Electrical Department',
    department: 'Electrical Department',
    icon: Zap,
    avatar: 'EH'
  },
  {
    key: 'mechanical_technician',
    role: ROLES.MECHANICAL_TECH,
    label: 'Mechanical technician',
    title: 'Mechanical Technician',
    sector: 'Mechanical Department',
    department: 'Mechanical Department',
    icon: Wrench,
    avatar: 'MT'
  },
  {
    key: 'electrical_technician',
    role: ROLES.ELECTRICAL_TECH,
    label: 'Electrical technician',
    title: 'Electrical Technician',
    sector: 'Electrical Department',
    department: 'Electrical Department',
    icon: Cpu,
    avatar: 'ET'
  }
];

export const LoginView = ({ onLogin, onRegisterUser }) => {
  // Mode: Sign In (false) or Register (true)
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Selected Role Dropdown State (key from OPERATIONAL_ROLES)
  const [selectedRoleKey, setSelectedRoleKey] = useState('system_admin');

  // Sign In Form Inputs - clean and empty for manual entry
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form Inputs
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [agreeSafety, setAgreeSafety] = useState(false);

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Active Role Object
  const currentRole = OPERATIONAL_ROLES.find(r => r.key === selectedRoleKey) || OPERATIONAL_ROLES[0];

  // Handle Role Dropdown Change
  const handleRoleChange = (e) => {
    setSelectedRoleKey(e.target.value);
    setValidationError('');
  };

  // Handle Sign In Submit
  const handleSignInSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!email || !email.includes('@')) {
      setValidationError('Please enter a valid work email address.');
      return;
    }
    if (!password || password.length < 4) {
      setValidationError('Password must be at least 4 characters.');
      return;
    }

    setIsLoading(true);

    const emailPrefix = email.split('@')[0];
    const userDisplayName = emailPrefix ? emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1) : currentRole.title;
    const avatarLetters = userDisplayName.substring(0, 2).toUpperCase();

    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        role: currentRole.role,
        name: userDisplayName,
        title: currentRole.title,
        sector: currentRole.sector,
        email: email.trim(),
        avatar: avatarLetters,
        employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`
      });
    }, 350);
  };

  // Handle Registration Submit
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!fullName.trim() || fullName.trim().length < 2) {
      setValidationError('Please enter your full name (at least 2 characters).');
      return;
    }

    if (!regEmail.trim() || !regEmail.includes('@') || !regEmail.includes('.')) {
      setValidationError('Please enter a valid work email address.');
      return;
    }

    if (!regPassword || regPassword.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setValidationError('Passwords do not match. Please verify both password fields.');
      return;
    }

    if (!agreeSafety) {
      setValidationError('You must acknowledge plant safety and access compliance.');
      return;
    }

    setIsLoading(true);

    const nameParts = fullName.trim().split(' ');
    const initials = (nameParts[0][0] + (nameParts[1] ? nameParts[1][0] : nameParts[0][1] || '')).toUpperCase();

    const isApprovalNeeded = currentRole.role !== ROLES.ADMIN;
    const newUserAccount = {
      role: currentRole.role,
      name: fullName.trim(),
      title: currentRole.title,
      sector: currentRole.sector,
      email: regEmail.trim(),
      avatar: initials,
      employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      description: `Registered as ${currentRole.title} (${currentRole.sector}).`,
      isNewUser: true,
      status: isApprovalNeeded ? 'Pending Approval' : 'Active',
      isApproved: !isApprovalNeeded,
      requestedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setTimeout(() => {
      setIsLoading(false);
      if (onRegisterUser) {
        onRegisterUser(newUserAccount);
      }
      onLogin(newUserAccount);
    }, 450);
  };

  return (
    <div
      className="login-screen"
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        boxSizing: 'border-box'
      }}
    >
      <div
        className="login-card"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '2.5rem 2.25rem',
          margin: 'auto',
          boxSizing: 'border-box'
        }}
      >
        {/* Brand Header */}
        <div className="login-brand" style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
          <div className="login-logo" style={{ margin: '0 auto 0.75rem auto' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cog size={30} style={{ animation: 'spin 12s linear infinite' }} />
              <Wrench size={15} style={{ position: 'absolute' }} />
            </div>
          </div>
          <h1 className="login-title" style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>
            Industrial<span style={{ color: 'var(--primary-600)' }}>Care</span>
          </h1>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-600)', marginTop: '0.2rem' }}>
            Smarter Maintenance. Better Productivity.
          </div>
          <p className="login-subtitle" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {isRegisterMode ? 'New Personnel Registration Portal' : 'Predictive Maintenance & Asset Operations Portal'}
          </p>
        </div>

        {/* Validation Error Alert */}
        {validationError && (
          <div
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--status-danger-bg)',
              border: '1px solid var(--status-danger-border)',
              color: 'var(--status-danger-text)',
              fontSize: '0.8rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textAlign: 'left'
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{validationError}</span>
          </div>
        )}

        {/* ================= FORM 1: SIGN IN ================= */}
        {!isRegisterMode && (
          <form onSubmit={handleSignInSubmit} style={{ textAlign: 'left' }}>
            {/* Field 1: Role Selection Dropdown (No headings, exactly the 9 options) */}
            <div className="form-group" style={{ marginBottom: '1.25rem', textAlign: 'left' }}>
              <label className="form-label" style={{ display: 'block', textAlign: 'left', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                Operational Role
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  className="form-control form-select"
                  value={selectedRoleKey}
                  onChange={handleRoleChange}
                  style={{
                    paddingLeft: '2.5rem',
                    paddingRight: '2.5rem',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    height: '42px',
                    width: '100%',
                    borderColor: 'var(--border-medium)',
                    backgroundColor: '#ffffff'
                  }}
                >
                  {OPERATIONAL_ROLES.map((roleItem) => (
                    <option key={roleItem.key} value={roleItem.key}>
                      {roleItem.label}
                    </option>
                  ))}
                </select>
                <div
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--primary-600)',
                    pointerEvents: 'none'
                  }}
                >
                  {React.createElement(currentRole.icon, { size: 18 })}
                </div>
              </div>
            </div>

            {/* Field 2: Work Email Address (Left Aligned) */}
            <div className="form-group" style={{ marginBottom: '1.25rem', textAlign: 'left' }}>
              <label
                className="form-label"
                style={{
                  display: 'block',
                  textAlign: 'left',
                  fontWeight: 600,
                  marginBottom: '0.4rem',
                  fontSize: '0.85rem'
                }}
              >
                Work Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-control"
                  style={{
                    paddingLeft: '2.5rem',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    height: '42px',
                    width: '100%'
                  }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                />
                <Mail
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-light)'
                  }}
                />
              </div>
            </div>

            {/* Field 3: Password */}
            <div className="form-group" style={{ marginBottom: '1.25rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label
                  className="form-label"
                  style={{
                    textAlign: 'left',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    margin: 0
                  }}
                >
                  Password
                </label>
                <button
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary-600)',
                    fontSize: '0.775rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    padding: 0
                  }}
                  onClick={() => setShowForgotModal(true)}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  style={{
                    paddingLeft: '2.5rem',
                    paddingRight: '2.5rem',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    height: '42px',
                    width: '100%'
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-light)'
                  }}
                />
                <button
                  type="button"
                  style={{
                    position: 'absolute',
                    right: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Workstation Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--primary-600)' }}
                />
                <span>Remember workstation</span>
              </label>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Secure Gateway
              </span>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.8rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In as {currentRole.title}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Register Option at Bottom of Card for New Users */}
            <div
              style={{
                textAlign: 'center',
                marginTop: '1.5rem',
                paddingTop: '1.1rem',
                borderTop: '1px solid var(--border-light)',
                fontSize: '0.825rem',
                color: 'var(--text-secondary)'
              }}
            >
              New user?{' '}
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-600)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0
                }}
                onClick={() => {
                  setIsRegisterMode(true);
                  setValidationError('');
                }}
              >
                Register here
              </button>
            </div>
          </form>
        )}

        {/* ================= FORM 2: REGISTRATION ================= */}
        {isRegisterMode && (
          <form onSubmit={handleRegisterSubmit} style={{ textAlign: 'left' }}>
            {/* Field 1: Operational Role Dropdown (No headings, exactly the 9 options) */}
            <div className="form-group" style={{ marginBottom: '1rem', textAlign: 'left' }}>
              <label className="form-label" style={{ display: 'block', textAlign: 'left', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                Operational Role
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  className="form-control form-select"
                  value={selectedRoleKey}
                  onChange={handleRoleChange}
                  style={{
                    paddingLeft: '2.5rem',
                    paddingRight: '2.5rem',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    height: '42px',
                    width: '100%',
                    borderColor: 'var(--border-medium)',
                    backgroundColor: '#ffffff'
                  }}
                >
                  {OPERATIONAL_ROLES.map((roleItem) => (
                    <option key={roleItem.key} value={roleItem.key}>
                      {roleItem.label}
                    </option>
                  ))}
                </select>
                <div
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--primary-600)',
                    pointerEvents: 'none'
                  }}
                >
                  {React.createElement(currentRole.icon, { size: 18 })}
                </div>
              </div>
            </div>

            {/* Field 2: Full Name */}
            <div className="form-group" style={{ marginBottom: '1rem', textAlign: 'left' }}>
              <label className="form-label" style={{ display: 'block', textAlign: 'left', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-control"
                  style={{
                    paddingLeft: '2.5rem',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    height: '42px',
                    width: '100%'
                  }}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Liam Stone"
                  required
                />
                <User
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-light)'
                  }}
                />
              </div>
            </div>

            {/* Field 3: Work Email Address */}
            <div className="form-group" style={{ marginBottom: '1rem', textAlign: 'left' }}>
              <label className="form-label" style={{ display: 'block', textAlign: 'left', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                Work Email Address *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-control"
                  style={{
                    paddingLeft: '2.5rem',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    height: '42px',
                    width: '100%'
                  }}
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. liam.stone@industrialcare.io"
                  required
                />
                <Mail
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-light)'
                  }}
                />
              </div>
            </div>

            {/* Field 4: Password & Confirm Password */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ margin: 0, textAlign: 'left' }}>
                <label className="form-label" style={{ display: 'block', textAlign: 'left', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                  Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    className="form-control"
                    style={{
                      paddingLeft: '2.25rem',
                      fontSize: '0.85rem',
                      height: '42px',
                      width: '100%'
                    }}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    required
                  />
                  <Lock
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-light)'
                    }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0, textAlign: 'left' }}>
                <label className="form-label" style={{ display: 'block', textAlign: 'left', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                  Confirm *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    className="form-control"
                    style={{
                      paddingLeft: '2.25rem',
                      fontSize: '0.85rem',
                      height: '42px',
                      width: '100%'
                    }}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-enter"
                    required
                  />
                  <Lock
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-light)'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Password Match Indicator */}
            {regConfirmPassword && (
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  marginBottom: '0.75rem',
                  color: regPassword === regConfirmPassword ? 'var(--status-success-text)' : 'var(--status-danger-text)'
                }}
              >
                {regPassword === regConfirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
              </div>
            )}

            {/* Safety Compliance Agreement Checkbox */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.775rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={agreeSafety}
                  onChange={(e) => setAgreeSafety(e.target.checked)}
                  style={{ marginTop: '0.15rem', accentColor: 'var(--primary-600)' }}
                  required
                />
                <span>
                  I confirm authorized plant personnel status and agree to IndustrialCare plant safety protocols.
                </span>
              </label>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.8rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Registering...</span>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Register as {currentRole.title}</span>
                </>
              )}
            </button>

            {/* Sign In Option at Bottom of Card */}
            <div
              style={{
                textAlign: 'center',
                marginTop: '1.5rem',
                paddingTop: '1.1rem',
                borderTop: '1px solid var(--border-light)',
                fontSize: '0.825rem',
                color: 'var(--text-secondary)'
              }}
            >
              Already have an account?{' '}
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-600)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0
                }}
                onClick={() => {
                  setIsRegisterMode(false);
                  setValidationError('');
                }}
              >
                Sign in here
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
          onClick={() => setShowForgotModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem',
              maxWidth: '400px',
              width: '100%',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-light)',
              textAlign: 'left'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--primary-600)' }}>
              <KeyRound size={22} />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0 }}>Password Recovery</h3>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              Operational account passwords are authenticated via plant access directory. Please contact your Plant Administrator or IT Helpdesk to request a credential reset.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setShowForgotModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
