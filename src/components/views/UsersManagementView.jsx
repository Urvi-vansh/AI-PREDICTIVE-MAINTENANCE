import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Users, Shield, Plus, Mail, CheckCircle2, UserCheck, Key } from 'lucide-react';
import { DEMO_ACCOUNTS } from '../../config/permissions';

export const UsersManagementView = () => {
  const [usersList, setUsersList] = useState(DEMO_ACCOUNTS);
  const [selectedSector, setSelectedSector] = useState('All');

  const filteredUsers = usersList.filter(u => {
    if (selectedSector === 'All') return true;
    return u.sector === selectedSector;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Plant User & Role Management</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Configure sector permissions and technician access control</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => alert('Add User Modal mockup triggered')}>
          <Plus size={16} /> Register New User
        </button>
      </div>

      {/* Sector Filter Bar */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Filter by Sector:</span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['All', 'Production & Manufacturing', 'Mechanical Department', 'Electrical Department'].map(sec => (
              <button
                key={sec}
                className={`btn btn-sm ${selectedSector === sec ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedSector(sec)}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Users List Table */}
      <Card title={`Active Sector Personnel (${filteredUsers.length} Users)`}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>User & Name</th>
                <th>Role & Title</th>
                <th>Industry Sector</th>
                <th>Email Address</th>
                <th>Permissions Scope</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.email}>
                  <td>
                    <div className="asset-name-cell">
                      <div className="user-avatar" style={{ width: 38, height: 38, fontSize: '0.9rem' }}>
                        {u.avatar}
                      </div>
                      <div>
                        <div className="asset-title">{u.name}</div>
                        <div className="asset-code">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--primary-600)' }}>
                      {u.title}
                    </span>
                  </td>
                  <td>{u.sector}</td>
                  <td>{u.email}</td>
                  <td>
                    <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'inline-block', maxWidth: '300px' }}>
                      {u.description}
                    </span>
                  </td>
                  <td>
                    <Badge status="Operational">Active</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
