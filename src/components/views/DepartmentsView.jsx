import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import {
  Wrench,
  Zap,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Search,
  Activity,
  Package,
  Cpu,
  Layers,
  Calendar,
  FileText,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { ROLES, isAssetAllowedForUser } from '../../config/permissions';
import { AssignTechnicianModal } from '../modals/AssignTechnicianModal';

export const DepartmentsView = ({
  assets = [],
  workOrders = [],
  usersList = [],
  spareParts = [],
  onSelectAsset,
  onAssignTask,
  onApproveUser,
  onRejectUser,
  onOpenWorkOrderModal,
  userRole = 'admin',
  currentUser = null
}) => {
  const [selectedDeptKey, setSelectedDeptKey] = useState('mechanical'); // 'mechanical' or 'electrical'
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'requests', 'completed', 'technicians', 'machines'
  const [searchTerm, setSearchTerm] = useState('');
  const [assignModalTarget, setAssignModalTarget] = useState(null);

  // Department configurations strictly modeling Mechanical & Electrical
  const departmentsConfig = {
    mechanical: {
      key: 'mechanical',
      name: 'Mechanical Department',
      shortName: 'Mechanical',
      icon: Wrench,
      accentColor: '#2563eb',
      headName: 'Marcus Vance',
      headRole: 'Mechanical Department Head',
      headEmail: 'head_mech@industrialcare.plant',
      headEmployeeId: 'DPT-M01',
      description: 'Rotary drives, CNC spindles, hydraulic power units, bearings, fluid systems, dynamic balancing, and heavy mechanical assemblies.',
      techRole: ROLES.MECHANICAL_TECH,
      matchDept: (item) => {
        const d = (item.department || item.assignedDepartment || '').toLowerCase();
        return d.includes('mech') || d.includes('machin');
      },
      matchAsset: (a) => {
        return (
          (a.department && (a.department.toLowerCase().includes('mech') || a.department.toLowerCase().includes('machin'))) ||
          (a.sector && (a.sector.includes('Sector 1') || a.sector.includes('Sector 2')))
        );
      }
    },
    electrical: {
      key: 'electrical',
      name: 'Electrical Department',
      shortName: 'Electrical',
      icon: Zap,
      accentColor: '#eab308',
      headName: 'Elena Rostova',
      headRole: 'Electrical Department Head',
      headEmail: 'head_elec@industrialcare.plant',
      headEmployeeId: 'DPT-E01',
      description: 'Power distribution cabinets, servo drives, automation controllers, high-voltage transformers, sensors, and robotics controllers.',
      techRole: ROLES.ELECTRICAL_TECH,
      matchDept: (item) => {
        const d = (item.department || item.assignedDepartment || '').toLowerCase();
        return d.includes('elec') || d.includes('power');
      },
      matchAsset: (a) => {
        return (
          (a.department && (a.department.toLowerCase().includes('elec') || a.department.toLowerCase().includes('power'))) ||
          (a.sector && (a.sector.includes('Sector 3') || a.sector.includes('Sector 4')))
        );
      }
    }
  };

  const currentDept = departmentsConfig[selectedDeptKey];

  // Helper to compute statistics dynamically from shared datasets
  const getDeptData = (deptKey) => {
    const cfg = departmentsConfig[deptKey];

    // Department Technicians (from shared usersList)
    const technicians = usersList.filter(
      (u) => u.role === cfg.techRole || (u.sector && u.sector.toLowerCase().includes(cfg.shortName.toLowerCase()))
    );
    const activeTechs = technicians.filter((u) => u.status === 'Active' || u.isApproved);
    const pendingTechs = technicians.filter((u) => u.status === 'Pending Approval' || (!u.isApproved && u.status !== 'Rejected'));

    // Open Maintenance Requests (from shared workOrders where status is not Closed)
    const deptWorkOrders = workOrders.filter(cfg.matchDept);
    const openRequests = deptWorkOrders.filter((w) => w.status !== 'Closed');
    const urgentRequests = openRequests.filter((w) => w.priority === 'Critical' || w.priority === 'High');
    const overdueRequests = openRequests.filter((w) => w.dueDate && new Date(w.dueDate) < new Date());

    // Completed Work Orders (from shared workOrders where status is Closed or Verified and Resolved)
    const completedWork = deptWorkOrders.filter((w) => w.status === 'Closed' || w.status === 'Verified and Resolved');
    const totalLaborHours = completedWork.reduce((acc, w) => acc + (Number(w.laborHours) || 0), 0);

    // Department Machinery (from shared assets)
    const deptAssets = assets.filter(cfg.matchAsset);
    const operationalAssets = deptAssets.filter((a) => a.status === 'Operational').length;
    const healthIndex = deptAssets.length > 0 ? Math.round((operationalAssets / deptAssets.length) * 100) : 100;

    // Compatible Spare Parts
    const deptSpares = spareParts.filter((p) => p.department && p.department.toLowerCase().includes(cfg.shortName.toLowerCase()));

    return {
      cfg,
      technicians,
      activeTechs,
      pendingTechs,
      deptWorkOrders,
      openRequests,
      urgentRequests,
      overdueRequests,
      completedWork,
      totalLaborHours,
      deptAssets,
      healthIndex,
      deptSpares
    };
  };

  const mechData = getDeptData('mechanical');
  const elecData = getDeptData('electrical');
  const activeData = selectedDeptKey === 'mechanical' ? mechData : elecData;

  // Filtered Open Requests
  const filteredOpenRequests = activeData.openRequests.filter((w) => {
    return (
      w.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.assetName && w.assetName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (w.assetId && w.assetId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (w.assignedTech && w.assignedTech.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (w.description && w.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Filtered Completed Work
  const filteredCompletedWork = activeData.completedWork.filter((w) => {
    return (
      w.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.assetName && w.assetName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (w.assetId && w.assetId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (w.assignedTech && w.assignedTech.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Filtered Technicians
  const filteredTechnicians = activeData.technicians.filter((t) => {
    return (
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.email && t.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.employeeId && t.employeeId.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Filtered Machinery
  const filteredMachines = activeData.deptAssets.filter((m) => {
    return (
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.location && m.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const isCurrentDeptHead = currentUser?.role === (selectedDeptKey === 'mechanical' ? ROLES.MECHANICAL_HEAD : ROLES.ELECTRICAL_HEAD);
  const isAdmin = currentUser?.role === ROLES.ADMIN;

  return (
    <div>
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
            Plant Maintenance Departments: Mechanical & Electrical
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Specialized engineering departments, designated leadership, qualified technicians, open tickets, & completed repairs
          </p>
        </div>

        {onOpenWorkOrderModal && (
          <button className="btn btn-primary btn-sm" onClick={onOpenWorkOrderModal}>
            + Create Maintenance Request
          </button>
        )}
      </div>

      {/* Top Department Switcher & KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.75rem'
        }}
      >
        {/* MECHANICAL DEPARTMENT CARD */}
        <div
          onClick={() => setSelectedDeptKey('mechanical')}
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: selectedDeptKey === 'mechanical' ? '2px solid #2563eb' : '1px solid var(--border-light)',
            boxShadow: selectedDeptKey === 'mechanical' ? '0 4px 14px rgba(37, 99, 235, 0.15)' : 'var(--shadow-sm)',
            padding: '1.25rem 1.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(37, 99, 235, 0.12)',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Wrench size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                  Mechanical Department
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600 }}>
                  Head: {mechData.cfg.headName}
                </div>
              </div>
            </div>

            {selectedDeptKey === 'mechanical' && (
              <span className="badge badge-info" style={{ fontWeight: 700 }}>
                Active View
              </span>
            )}
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.4 }}>
            {mechData.cfg.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Technicians</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {mechData.activeTechs.length}
                {mechData.pendingTechs.length > 0 && (
                  <span style={{ fontSize: '0.75rem', color: '#d97706', marginLeft: '0.2rem' }}>
                    (+{mechData.pendingTechs.length} req)
                  </span>
                )}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Open Requests</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: mechData.urgentRequests.length > 0 ? '#dc2626' : 'var(--primary-600)' }}>
                {mechData.openRequests.length}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Completed</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#16a34a' }}>
                {mechData.completedWork.length}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Fleet Health</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2563eb' }}>
                {mechData.healthIndex}%
              </div>
            </div>
          </div>
        </div>

        {/* ELECTRICAL DEPARTMENT CARD */}
        <div
          onClick={() => setSelectedDeptKey('electrical')}
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: selectedDeptKey === 'electrical' ? '2px solid #eab308' : '1px solid var(--border-light)',
            boxShadow: selectedDeptKey === 'electrical' ? '0 4px 14px rgba(234, 179, 8, 0.15)' : 'var(--shadow-sm)',
            padding: '1.25rem 1.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(234, 179, 8, 0.12)',
                  color: '#ca8a04',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Zap size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                  Electrical Department
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#ca8a04', fontWeight: 600 }}>
                  Head: {elecData.cfg.headName}
                </div>
              </div>
            </div>

            {selectedDeptKey === 'electrical' && (
              <span className="badge badge-warning" style={{ fontWeight: 700 }}>
                Active View
              </span>
            )}
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.4 }}>
            {elecData.cfg.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Technicians</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {elecData.activeTechs.length}
                {elecData.pendingTechs.length > 0 && (
                  <span style={{ fontSize: '0.75rem', color: '#d97706', marginLeft: '0.2rem' }}>
                    (+{elecData.pendingTechs.length} req)
                  </span>
                )}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Open Requests</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: elecData.urgentRequests.length > 0 ? '#dc2626' : 'var(--primary-600)' }}>
                {elecData.openRequests.length}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Completed</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#16a34a' }}>
                {elecData.completedWork.length}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Fleet Health</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ca8a04' }}>
                {elecData.healthIndex}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DEPARTMENT DRILLDOWN SECTION */}
      <Card
        title={`${activeData.cfg.name} Operational Command Center`}
        subtitle={`Led by ${activeData.cfg.headName} • ${activeData.activeTechs.length} active specialists • ${activeData.openRequests.length} active maintenance orders`}
        style={{ marginBottom: '1.5rem' }}
      >
        {/* Navigation Tabs Bar inside Department */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('overview')}
            >
              <Activity size={14} /> Overview & Leadership
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'technicians' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('technicians')}
            >
              <Users size={14} /> Technicians Roster ({activeData.technicians.length})
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'requests' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('requests')}
            >
              <Clock size={14} /> Open Requests ({activeData.openRequests.length})
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('completed')}
            >
              <CheckCircle2 size={14} /> Completed Work ({activeData.completedWork.length})
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'machines' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('machines')}
            >
              <Cpu size={14} /> Department Machinery ({activeData.deptAssets.length})
            </button>
          </div>

          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.2rem', fontSize: '0.8rem', padding: '0.35rem 0.5rem 0.35rem 2.2rem' }}
              placeholder="Search in department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* TAB 1: OVERVIEW & LEADERSHIP */}
        {activeTab === 'overview' && (
          <div>
            {/* Department Head Dossier Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  className="user-avatar"
                  style={{
                    width: 52,
                    height: 52,
                    fontSize: '1.2rem',
                    backgroundColor: activeData.cfg.key === 'mechanical' ? 'rgba(37, 99, 235, 0.15)' : 'rgba(202, 138, 4, 0.15)',
                    color: activeData.cfg.key === 'mechanical' ? '#2563eb' : '#ca8a04',
                    border: `2px solid ${activeData.cfg.accentColor}`
                  }}
                >
                  {activeData.cfg.headName.substring(0, 2).toUpperCase()}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                      {activeData.cfg.headName}
                    </h4>
                    <span className="badge badge-info" style={{ fontSize: '0.725rem', fontWeight: 700 }}>
                      Department Head
                    </span>
                    <span className="badge badge-success" style={{ fontSize: '0.725rem' }}>
                      Active Authorization
                    </span>
                  </div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {activeData.cfg.headRole} • Employee ID: <code style={{ color: 'var(--text-main)' }}>{activeData.cfg.headEmployeeId}</code> • Email: <code>{activeData.cfg.headEmail}</code>
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Approval Governance: <strong>Authorized to approve/reject {activeData.cfg.shortName} Technicians, assign {activeData.cfg.shortName.toLowerCase()} work orders, & manage spare parts inventory.</strong>
                  </div>
                </div>
              </div>

              {(isAdmin || isCurrentDeptHead) && activeData.pendingTechs.length > 0 && (
                <div style={{ backgroundColor: 'var(--bg-primary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--status-warning-border)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <AlertTriangle size={14} /> {activeData.pendingTechs.length} Technician Approval Pending
                  </div>
                  <button
                    className="btn btn-sm btn-primary"
                    style={{ marginTop: '0.4rem', fontSize: '0.75rem', width: '100%' }}
                    onClick={() => setActiveTab('technicians')}
                  >
                    Review Access Requests
                  </button>
                </div>
              )}
            </div>

            {/* Quick Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned Technicians</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  {activeData.activeTechs.length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Field specialists under department
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Maintenance Tickets</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: activeData.urgentRequests.length > 0 ? '#dc2626' : 'var(--primary-600)', marginTop: '0.2rem' }}>
                  {activeData.openRequests.length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {activeData.urgentRequests.length} high priority / {activeData.overdueRequests.length} overdue
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Completed Work Orders</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a', marginTop: '0.2rem' }}>
                  {activeData.completedWork.length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {activeData.totalLaborHours} technician labor hours logged
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Compatible Spare Components</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  {activeData.deptSpares.length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Managed spare part SKUs in inventory
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TECHNICIANS ROSTER */}
        {activeTab === 'technicians' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {activeData.cfg.shortName} Technicians Directory & Approval Status
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Showing {filteredTechnicians.length} technician records
              </div>
            </div>

            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Specialist Name & ID</th>
                    <th>Functional Role</th>
                    <th>Email Address</th>
                    <th>Approval Status</th>
                    <th>Active Tasks</th>
                    <th style={{ textAlign: 'right' }}>Authorization Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTechnicians.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No technicians found matching search.
                      </td>
                    </tr>
                  ) : (
                    filteredTechnicians.map((tech) => {
                      const isPending = tech.status === 'Pending Approval' || (!tech.isApproved && tech.status !== 'Rejected');
                      const isRejected = tech.status === 'Rejected';
                      const canApprove = (isCurrentDeptHead || isAdmin) && isPending;
                      const activeTasksCount = workOrders.filter(
                        (w) => w.assignedTech === tech.name && w.status !== 'Closed'
                      ).length;

                      return (
                        <tr key={tech.email}>
                          <td>
                            <div className="asset-name-cell">
                              <div
                                className="user-avatar"
                                style={{
                                  width: 36,
                                  height: 36,
                                  fontSize: '0.85rem',
                                  backgroundColor: isPending ? 'rgba(217, 119, 6, 0.15)' : 'rgba(37, 99, 235, 0.12)',
                                  color: isPending ? '#d97706' : '#2563eb'
                                }}
                              >
                                {tech.avatar || tech.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{tech.name}</div>
                                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{tech.employeeId || 'TECHNICIAN'}</div>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span style={{ fontWeight: 600, color: 'var(--primary-600)', fontSize: '0.825rem' }}>
                              {tech.title || tech.role}
                            </span>
                          </td>

                          <td>
                            <code style={{ fontSize: '0.8rem' }}>{tech.email}</code>
                          </td>

                          <td>
                            {isPending ? (
                              <span className="badge badge-warning" style={{ fontSize: '0.725rem', fontWeight: 700 }}>
                                ● Pending Approval
                              </span>
                            ) : isRejected ? (
                              <span className="badge badge-critical" style={{ fontSize: '0.725rem' }}>
                                Declined
                              </span>
                            ) : (
                              <span className="badge badge-success" style={{ fontSize: '0.725rem' }}>
                                Active / Approved
                              </span>
                            )}
                          </td>

                          <td>
                            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: activeTasksCount > 0 ? 'var(--primary-600)' : 'var(--text-muted)' }}>
                              {activeTasksCount} active ticket{activeTasksCount !== 1 ? 's' : ''}
                            </span>
                          </td>

                          <td style={{ textAlign: 'right' }}>
                            {canApprove ? (
                              <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                                <button
                                  className="btn btn-sm btn-success"
                                  style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', fontSize: '0.725rem', padding: '0.25rem 0.5rem' }}
                                  onClick={() => onApproveUser && onApproveUser(tech.email)}
                                >
                                  <UserCheck size={13} /> Approve
                                </button>
                                <button
                                  className="btn btn-sm btn-secondary"
                                  style={{ color: 'var(--status-danger-text)', fontSize: '0.725rem', padding: '0.25rem 0.5rem' }}
                                  onClick={() => onRejectUser && onRejectUser(tech.email)}
                                >
                                  Reject
                                </button>
                              </div>
                            ) : isPending ? (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                Awaiting {activeData.cfg.shortName} Head
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                                Authorized
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: OPEN REQUESTS */}
        {activeTab === 'requests' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Active Maintenance Requests Assigned to {activeData.cfg.shortName} Department
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Showing {filteredOpenRequests.length} active tickets
              </div>
            </div>

            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Work Order ID & Type</th>
                    <th>Target Machine</th>
                    <th>Sector Location</th>
                    <th>Priority</th>
                    <th>Due Date & Target</th>
                    <th>Status</th>
                    <th>Assigned Tech</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOpenRequests.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                        No open maintenance requests assigned to this department.
                      </td>
                    </tr>
                  ) : (
                    filteredOpenRequests.map((wo) => {
                      const isOverdue = wo.dueDate && new Date(wo.dueDate) < new Date();
                      return (
                        <tr key={wo.id}>
                          <td>
                            <div style={{ fontWeight: 700, color: 'var(--primary-600)', fontFamily: 'monospace' }}>
                              {wo.id}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {wo.type || 'Corrective Servicing'}
                            </div>
                          </td>

                          <td>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.825rem' }}>
                              {wo.assetName}
                            </div>
                            <div style={{ fontSize: '0.725rem', color: 'var(--primary-600)', fontFamily: 'monospace' }}>
                              {wo.assetId}
                            </div>
                          </td>

                          <td>
                            <div style={{ fontSize: '0.8rem' }}>{wo.sector}</div>
                          </td>

                          <td>
                            <span className={`badge ${wo.priority === 'Critical' ? 'badge-critical' : wo.priority === 'High' ? 'badge-warning' : 'badge-info'}`}>
                              {wo.priority}
                            </span>
                          </td>

                          <td>
                            <div style={{ fontSize: '0.775rem', fontWeight: isOverdue ? 700 : 500, color: isOverdue ? '#dc2626' : 'var(--text-muted)' }}>
                              {wo.dueDate}
                            </div>
                            {isOverdue && (
                              <span className="badge badge-critical" style={{ fontSize: '0.65rem', backgroundColor: '#dc2626', color: '#fff', padding: '0.1rem 0.35rem' }}>
                                OVERDUE
                              </span>
                            )}
                          </td>

                          <td>
                            <Badge status={wo.status} />
                          </td>

                          <td>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                              {wo.assignedTech || 'Unassigned'}
                            </span>
                          </td>

                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                              {(isAdmin || isCurrentDeptHead) && (
                                <button
                                  className="btn btn-secondary btn-sm"
                                  style={{ fontSize: '0.725rem', padding: '0.25rem 0.5rem' }}
                                  onClick={() => setAssignModalTarget(wo)}
                                  title="Reassign qualified specialist"
                                >
                                  Reassign
                                </button>
                              )}
                              <button
                                className="btn btn-primary btn-sm"
                                style={{ fontSize: '0.725rem', padding: '0.25rem 0.5rem' }}
                                onClick={() => {
                                  const mac = assets.find((a) => a.id === wo.assetId);
                                  if (mac && onSelectAsset) onSelectAsset(mac);
                                }}
                              >
                                Inspect
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: COMPLETED WORK ORDERS */}
        {activeTab === 'completed' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Completed Maintenance Work Orders & Resolution Archive
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Total Labor Hours: <strong>{activeData.totalLaborHours} hrs</strong> logged
              </div>
            </div>

            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Work Order ID</th>
                    <th>Target Machine</th>
                    <th>Completed Date</th>
                    <th>Resolution Period</th>
                    <th>Labor Hours</th>
                    <th>Replaced Parts</th>
                    <th>Verified By</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompletedWork.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                        No completed maintenance records in archive for this department.
                      </td>
                    </tr>
                  ) : (
                    filteredCompletedWork.map((wo) => {
                      return (
                        <tr key={wo.id}>
                          <td>
                            <div style={{ fontWeight: 700, color: 'var(--primary-600)', fontFamily: 'monospace' }}>
                              {wo.id}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {wo.type}
                            </div>
                          </td>

                          <td>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.825rem' }}>
                              {wo.assetName}
                            </div>
                            <div style={{ fontSize: '0.725rem', color: 'var(--primary-600)', fontFamily: 'monospace' }}>
                              {wo.assetId}
                            </div>
                          </td>

                          <td>
                            <div style={{ fontSize: '0.8rem' }}>
                              {wo.resolvedAt || wo.createdAt}
                            </div>
                          </td>

                          <td>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#16a34a' }}>
                              {wo.resolutionPeriod || 'Resolved'}
                            </span>
                          </td>

                          <td>
                            <span style={{ fontWeight: 700, fontSize: '0.825rem' }}>
                              {wo.laborHours ? `${wo.laborHours} hrs` : 'N/A'}
                            </span>
                          </td>

                          <td>
                            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                              {wo.replacedParts && wo.replacedParts.length > 0
                                ? wo.replacedParts.join(', ')
                                : 'No parts replaced'}
                            </span>
                          </td>

                          <td>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                              {wo.verifiedBy || 'Sector Head'}
                            </div>
                          </td>

                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '0.725rem', padding: '0.25rem 0.5rem' }}
                              onClick={() => {
                                const mac = assets.find((a) => a.id === wo.assetId);
                                if (mac && onSelectAsset) onSelectAsset(mac);
                              }}
                            >
                              Dossier
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: DEPARTMENT MACHINERY */}
        {activeTab === 'machines' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Plant Machinery Serviced by {activeData.cfg.shortName} Department ({filteredMachines.length} Assets)
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Average Operational Health: <strong>{activeData.healthIndex}%</strong>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem'
              }}
            >
              {filteredMachines.map((m) => {
                return (
                  <div
                    key={m.id}
                    onClick={() => onSelectAsset && onSelectAsset(m)}
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: 'var(--shadow-xs)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                          {m.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--primary-600)', fontFamily: 'monospace', fontWeight: 700 }}>
                          {m.id}
                        </div>
                      </div>
                      <Badge status={m.status} />
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      {m.sector} • {m.location}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Health Index:</span>
                      <strong style={{ fontSize: '0.85rem', color: m.healthScore >= 80 ? '#16a34a' : m.healthScore >= 60 ? '#ca8a04' : '#dc2626' }}>
                        {m.healthScore || 85}%
                      </strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      {/* Assign Specialist Modal */}
      {assignModalTarget && (
        <AssignTechnicianModal
          isOpen={Boolean(assignModalTarget)}
          onClose={() => setAssignModalTarget(null)}
          targetItem={assignModalTarget}
          usersList={usersList}
          currentUser={currentUser}
          onAssign={(taskId, techName, notes) => {
            if (onAssignTask) onAssignTask(taskId, techName, notes);
            setAssignModalTarget(null);
          }}
        />
      )}
    </div>
  );
};
