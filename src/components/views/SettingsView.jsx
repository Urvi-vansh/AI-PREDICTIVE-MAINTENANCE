import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import {
  Settings,
  Save,
  Shield,
  Bell,
  Database,
  Server,
  Check,
  User,
  Building2,
  Lock,
  Mail,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export const SettingsView = ({ user }) => {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('profile');

  // Form states
  const [userName, setUserName] = useState(user?.name || 'Alex Vance');
  const [userEmail, setUserEmail] = useState(user?.email || 'admin@industrialcare.io');
  const [plantName, setPlantName] = useState('IndustrialCare Plant #04 - Manufacturing Complex');
  const [vibrationLimit, setVibrationLimit] = useState(6.5);
  const [tempLimit, setTempLimit] = useState(80);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div style={{ maxWidth: '960px' }}>
      {/* Settings Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--border-light)', paddingBottom: '0.5rem' }}>
        <button
          className={`btn btn-sm ${activeSettingsTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSettingsTab('profile')}
        >
          <User size={15} /> User Profile & Security Permissions
        </button>

        <button
          className={`btn btn-sm ${activeSettingsTab === 'thresholds' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSettingsTab('thresholds')}
        >
          <Cpu size={15} /> Telemetry Alert Thresholds
        </button>

        <button
          className={`btn btn-sm ${activeSettingsTab === 'plant' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSettingsTab('plant')}
        >
          <Building2 size={15} /> Plant Facility Profile
        </button>
      </div>

      <form onSubmit={handleSave}>
        {/* TAB 1: USER PROFILE & ROLE PERMISSIONS */}
        {activeSettingsTab === 'profile' && (
          <div>
            <Card title="Authenticated User Profile" subtitle="Your account credentials, avatar, and assigned role title" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-200)' }}>
                <div className="user-avatar" style={{ width: 56, height: 56, fontSize: '1.25rem', flexShrink: 0 }}>
                  {user?.avatar || 'AU'}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: 0 }}>
                    {user?.name || 'Authorized Specialist'}
                  </h3>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-700)', marginTop: '0.15rem' }}>
                    {user?.title || user?.role}
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                    Assigned Sector: <strong>{user?.sector}</strong>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Work Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">System Access Level / Role</label>
                  <input
                    type="text"
                    className="form-control"
                    value={user?.title || user?.role}
                    disabled
                    style={{ backgroundColor: 'var(--bg-secondary)', cursor: 'not-allowed' }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Authorized Plant Sector</label>
                  <input
                    type="text"
                    className="form-control"
                    value={user?.sector}
                    disabled
                    style={{ backgroundColor: 'var(--bg-secondary)', cursor: 'not-allowed' }}
                  />
                </div>
              </div>
            </Card>

            <Card title="Security & Access Scope" subtitle="Frontend role permission parameters" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontWeight: 600 }}>
                  <ShieldCheck size={18} /> Role Permissions Enforced Across All Modules
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Your account role ({user?.role}) restricts access to authorized sector equipment, tasks, and management views.
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 2: TELEMETRY ALERT THRESHOLDS */}
        {activeSettingsTab === 'thresholds' && (
          <Card title="Telemetry Alert Threshold Configuration" subtitle="Configure trigger limits for simulated sensor events" style={{ marginBottom: '1.5rem' }}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Critical Vibration Limit (mm/s)</label>
                <input
                  type="number"
                  className="form-control"
                  step="0.1"
                  value={vibrationLimit}
                  onChange={(e) => setVibrationLimit(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Critical Thermal Limit (°C)</label>
                <input
                  type="number"
                  className="form-control"
                  value={tempLimit}
                  onChange={(e) => setTempLimit(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary-600)' }} />
                Dispatch in-app notifications for Critical telemetry alerts
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary-600)' }} />
                Auto-route failure tasks to authorized Sector Head
              </label>
            </div>
          </Card>
        )}

        {/* TAB 3: PLANT FACILITY PROFILE */}
        {activeSettingsTab === 'plant' && (
          <Card title="Industrial Facility Organization Profile" subtitle="General plant details and location code" style={{ marginBottom: '1.5rem' }}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Plant Facility Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={plantName}
                  onChange={(e) => setPlantName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Facility ID Code</label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue="FAC-US-EAST-04"
                  disabled
                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Plant Operations Shift Manager</label>
              <input type="text" className="form-control" defaultValue={`${user?.name} (${user?.title || user?.role})`} />
            </div>
          </Card>
        )}

        {/* Save Controls Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
          {savedSuccess ? (
            <span style={{ color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
              <Check size={18} /> Profile & Settings Updated Successfully!
            </span>
          ) : <span />}

          <button type="submit" className="btn btn-primary">
            <Save size={16} /> Save Profile & Settings
          </button>
        </div>
      </form>
    </div>
  );
};
