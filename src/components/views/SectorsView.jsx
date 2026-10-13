import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import {
  Building2,
  Cpu,
  ShieldAlert,
  ArrowUpRight,
  ArrowLeft,
  Search,
  Filter,
  Plus,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  PowerOff,
  Wrench,
  Gauge,
  Zap,
  Thermometer,
  Layers,
  Shield,
  ShieldCheck,
  AlertOctagon,
  Minus,
  Sparkles,
  ArrowRight,
  Lock
} from 'lucide-react';
import {
  isSectorAllowedForUser,
  isAssetAllowedForUser,
  getUserSectorPrefix,
  isSectorHeadRole,
  ROLES
} from '../../config/permissions';

export const SectorsView = ({
  assets = [],
  alerts = [],
  selectedSectorId = null,
  onSelectSectorId,
  onSelectAsset,
  onOpenAddMachineModal,
  userRole = 'admin',
  currentUser = null,
  initialSector = null
}) => {
  // Controlled sector selection if parent passes selectedSectorId, else local state
  const [internalSectorId, setInternalSectorId] = useState(initialSector);
  const [selectedMachineId, setSelectedMachineId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const activeSectorId = selectedSectorId !== undefined && selectedSectorId !== null
    ? selectedSectorId
    : internalSectorId;

  const setActiveSectorId = (secId) => {
    if (onSelectSectorId) {
      onSelectSectorId(secId);
    }
    setInternalSectorId(secId);
  };

  const standardSectors = [
    {
      id: 'sec-1',
      name: 'Sector 1',
      prefix: 'SEC1',
      title: 'Sector 1: Production & Manufacturing',
      fullName: 'Sector 1 (Production & Manufacturing)',
      headName: 'Sector Head - Sector 1',
      description: 'High-precision CNC machining centers, automated robotic stamping lines, and precision fabrication cells.',
      categories: ['Machining', 'Stamping', 'Robotics']
    },
    {
      id: 'sec-2',
      name: 'Sector 2',
      prefix: 'SEC2',
      title: 'Sector 2: Heavy Machining & Fabrication',
      fullName: 'Sector 2 (Heavy Machining & Fabrication)',
      headName: 'Sector Head - Sector 2',
      description: 'Heavy horizontal boring mills, plasma arc cutting beds, hydraulic shears, and high-pressure fluid power units.',
      categories: ['Machining', 'Fluid Systems', 'Thermal Systems']
    },
    {
      id: 'sec-3',
      name: 'Sector 3',
      prefix: 'SEC3',
      title: 'Sector 3: Assembly & Packaging',
      fullName: 'Sector 3 (Assembly & Packaging)',
      headName: 'Sector Head - Sector 3',
      description: 'High-speed robotic assembly cells, carton erectors, ultrasonic welders, and automated packaging conveyors.',
      categories: ['Material Handling', 'Robotics', 'Pneumatics']
    },
    {
      id: 'sec-4',
      name: 'Sector 4',
      prefix: 'SEC4',
      title: 'Sector 4: Material Handling & Logistics',
      fullName: 'Sector 4 (Material Handling & Logistics)',
      headName: 'Sector Head - Sector 4',
      description: 'Autonomous Guided Vehicles (AGVs), automated high-bay cranes, overhead bridge rails, and distribution charging hubs.',
      categories: ['Material Handling', 'Pneumatics', 'Electrical Distribution']
    }
  ];

  // Helper to extract and numerically sort machines matching a sector definition
  const getSectorAssets = (sec) => {
    return assets
      .filter(
        (a) =>
          (a.id && a.id.startsWith(sec.prefix)) ||
          a.sector === sec.fullName ||
          a.sector === sec.title ||
          a.sector === sec.name ||
          (a.sector && a.sector.startsWith(sec.name))
      )
      .sort((a, b) => {
        const numA = parseInt((a.id?.match(/M(\d+)$/) || [])[1] || '0', 10);
        const numB = parseInt((b.id?.match(/M(\d+)$/) || [])[1] || '0', 10);
        return numA - numB;
      });
  };

  // Live aggregated counts per sector from shared assets model
  const sectorsData = standardSectors.map((sec) => {
    const secAssets = getSectorAssets(sec);
    const total = secAssets.length;
    const operational = secAssets.filter((a) => a.status === 'Operational').length;
    const warning = secAssets.filter(
      (a) => a.status === 'Warning' || a.status === 'Maintenance Required'
    ).length;
    const critical = secAssets.filter((a) => a.status === 'Critical').length;
    const offline = secAssets.filter((a) => a.status === 'Offline').length;
    const healthIndex = total > 0 ? Math.round((operational / total) * 100) : 100;

    return {
      ...sec,
      assets: secAssets,
      total,
      operational,
      warning,
      critical,
      offline,
      healthIndex
    };
  });

  // Overall plant totals (shared data model)
  const totalFleetCount = assets.length;
  const totalOperational = assets.filter((a) => a.status === 'Operational').length;
  const totalWarning = assets.filter(
    (a) => a.status === 'Warning' || a.status === 'Maintenance Required'
  ).length;
  const totalCritical = assets.filter((a) => a.status === 'Critical').length;
  const totalOffline = assets.filter((a) => a.status === 'Offline').length;

  // Active sector drill-down data
  const currentSector = sectorsData.find(
    (s) => s.id === activeSectorId || s.name === activeSectorId || s.fullName === activeSectorId
  );

  // Filtered machines in drill-down mode
  const filteredSectorMachines = currentSector
    ? currentSector.assets.filter((m) => {
        const matchesSearch =
          (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (m.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (m.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (m.type || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === 'All' ||
          m.status === statusFilter ||
          (statusFilter === 'Warning' && m.status === 'Maintenance Required');
        return matchesSearch && matchesStatus;
      })
    : [];

  // Group machines into rows of 5 machines per row
  const machineRows = [];
  for (let i = 0; i < filteredSectorMachines.length; i += 5) {
    machineRows.push({
      rowNumber: Math.floor(i / 5) + 1,
      startIndex: i,
      machines: filteredSectorMachines.slice(i, i + 5)
    });
  }

  const handleCardClick = (machine) => {
    if (currentUser && !isAssetAllowedForUser(machine, currentUser)) {
      alert(`Security Access Restriction: You are authenticated as ${currentUser.title || currentUser.name} (${currentUser.sector}). You do not have clearance to view equipment ${machine.id} in ${machine.sector}.`);
      return;
    }
    setSelectedMachineId(machine.id);
    if (onSelectAsset) {
      onSelectAsset(machine);
    }
  };



  // Border top color based on machine operational status
  const getStatusBorderColor = (status) => {
    switch (status) {
      case 'Operational':
        return 'var(--status-success-text)';
      case 'Warning':
      case 'Maintenance Required':
        return 'var(--status-warning-text)';
      case 'Critical':
        return 'var(--status-danger-text)';
      case 'Offline':
      default:
        return 'var(--status-offline-text)';
    }
  };

  // Render a square machine card (contains ONLY Machine ID, Bay, and Operational Status)
  const renderMachineSeatCard = (machine, bayLabel) => {
    if (!machine) return null;
    const isSelected = selectedMachineId === machine.id;
    const statusAccent = getStatusBorderColor(machine.status);
    const statusClass = (machine.status || 'offline').toLowerCase().replace(/\s+/g, '-');

    return (
      <div
        key={machine.id}
        onClick={() => handleCardClick(machine)}
        className={`bus-seat-card status-${statusClass} ${isSelected ? 'selected' : ''}`}
        style={{
          borderTop: `4px solid ${statusAccent}`,
          borderColor: isSelected ? 'var(--primary-600)' : undefined
        }}
        title={`Click to inspect complete machine details and telemetry for ${machine.id}`}
      >
        {/* Top: Bay Tag & Status Beacon */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <span
            style={{
              fontSize: '0.675rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              padding: '0.15rem 0.45rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-light)'
            }}
          >
            {bayLabel || machine.bayNumber || `Bay ${machine.seatNumber || '01'}`}
          </span>

          {isSelected ? (
            <span
              style={{
                fontSize: '0.6rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                padding: '0.1rem 0.35rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--primary-600)',
                color: '#ffffff'
              }}
            >
              Selected
            </span>
          ) : (
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: statusAccent,
                boxShadow: `0 0 6px ${statusAccent}66`
              }}
            />
          )}
        </div>

        {/* Center: Machine ID (large, bold, prominent) */}
        <div
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            letterSpacing: '0.03em',
            fontFamily: 'var(--font-mono, monospace)',
            textAlign: 'center',
            margin: '0.4rem 0'
          }}
        >
          {machine.id}
        </div>

        {/* Bottom: Status Badge */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Badge status={machine.status} size="sm" />
        </div>
      </div>
    );
  };

  return (
    <div className="sectors-dashboard-container">
      {/* ============================================================== */}
      {/* VIEW MODE 1: ALL FOUR SECTORS OVERVIEW (FOUR LARGE CARDS)     */}
      {/* ============================================================== */}
      {!currentSector ? (
        <div>
          {/* Header Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                Plant Sectors Overview
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Operational machinery distribution, sector health indices, and real-time status monitoring
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-medium)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)'
                }}
              >
                <Building2 size={15} style={{ color: 'var(--primary-600)' }} />
                4 Active Sectors • {totalFleetCount} Machines Total
              </span>

              {userRole === 'admin' && onOpenAddMachineModal && (
                <button className="btn btn-primary btn-sm" onClick={onOpenAddMachineModal}>
                  <Plus size={16} /> + Add Machine
                </button>
              )}
            </div>
          </div>

          {/* Plant-Wide Quick Summary Status Ribbon */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.75rem'
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary-50)',
                  color: 'var(--primary-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Cpu size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Total Machines
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>
                  {totalFleetCount}
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--status-success-bg)',
                  color: 'var(--status-success-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CheckCircle2 size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Operational
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--status-success-text)', lineHeight: 1.1 }}>
                  {totalOperational}
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--status-warning-bg)',
                  color: 'var(--status-warning-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <AlertTriangle size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Warning
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--status-warning-text)', lineHeight: 1.1 }}>
                  {totalWarning}
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--status-danger-bg)',
                  color: 'var(--status-danger-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <XCircle size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Critical
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--status-danger-text)', lineHeight: 1.1 }}>
                  {totalCritical}
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--status-offline-bg)',
                  color: 'var(--status-offline-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <PowerOff size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Offline
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--status-offline-text)', lineHeight: 1.1 }}>
                  {totalOffline}
                </div>
              </div>
            </div>
          </div>

          {/* THE FOUR LARGE SECTOR CARDS GRID */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}
          >
            {sectorsData.map((sec) => {
              const isAllowed = !currentUser || isSectorAllowedForUser(sec.id, currentUser);
              return (
              <div
                key={sec.id}
                onClick={() => {
                  if (!isAllowed) {
                    alert(`Security Access Restriction: You are authenticated as ${currentUser?.title || currentUser?.name} (${currentUser?.sector}). You do not have clearance to inspect ${sec.title}. Only equipment in your authorized sector can be accessed.`);
                    return;
                  }
                  setActiveSectorId(sec.id);
                }}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: isAllowed ? '1px solid var(--border-light)' : '1px solid var(--status-danger-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: isAllowed ? 'pointer' : 'not-allowed',
                  opacity: isAllowed ? 1 : 0.65,
                  transition: 'all var(--transition-fast)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (isAllowed) {
                    e.currentTarget.style.borderColor = 'var(--primary-500)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isAllowed) {
                    e.currentTarget.style.borderColor = 'var(--border-light)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }
                }}
              >
                {/* Top Accent Strip */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: isAllowed
                      ? 'linear-gradient(90deg, var(--primary-600), var(--primary-400))'
                      : 'linear-gradient(90deg, var(--status-danger-text), #991b1b)'
                  }}
                />

                {/* Sector Header */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          padding: '0.2rem 0.65rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--primary-50)',
                          color: 'var(--primary-700)',
                          border: '1px solid var(--primary-200)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em'
                        }}
                      >
                        {sec.name}
                      </span>
                      {!isAllowed && (
                        <span
                          style={{
                            padding: '0.2rem 0.55rem',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--status-danger-bg)',
                            color: 'var(--status-danger-text)',
                            border: '1px solid var(--status-danger-border)',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <Lock size={11} /> Clearance Restricted
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      {sec.total} Machines
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    {sec.title}
                  </h3>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.45, marginBottom: '1.1rem' }}>
                    {sec.description}
                  </p>

                  {/* Health Score Meter */}
                  <div
                    style={{
                      padding: '0.85rem 1rem',
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      marginBottom: '1.25rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Activity size={14} style={{ color: 'var(--primary-600)' }} /> Health Index
                      </span>
                      <span style={{ fontWeight: 700, color: sec.healthIndex >= 85 ? 'var(--status-success-text)' : sec.healthIndex >= 70 ? 'var(--status-warning-text)' : 'var(--status-danger-text)' }}>
                        {sec.healthIndex}%
                      </span>
                    </div>
                    <div style={{ width: '100%', height: 7, backgroundColor: 'var(--border-light)', borderRadius: 4, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${sec.healthIndex}%`,
                          height: '100%',
                          backgroundColor: sec.healthIndex >= 85 ? '#16a34a' : sec.healthIndex >= 70 ? '#d97706' : '#dc2626',
                          transition: 'width 400ms ease'
                        }}
                      />
                    </div>
                  </div>

                  {/* SUMMARY COUNTS: OPERATIONAL, WARNING, CRITICAL, OFFLINE */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      Machine Status Distribution
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '0.5rem',
                        textAlign: 'center'
                      }}
                    >
                      {/* Operational - Green */}
                      <div
                        style={{
                          backgroundColor: 'var(--status-success-bg)',
                          border: '1px solid var(--status-success-border)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.5rem 0.25rem'
                        }}
                      >
                        <div style={{ fontSize: '0.675rem', fontWeight: 600, color: 'var(--status-success-text)' }}>Operational</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--status-success-text)', marginTop: '0.15rem' }}>
                          {sec.operational}
                        </div>
                      </div>

                      {/* Warning - Yellow */}
                      <div
                        style={{
                          backgroundColor: 'var(--status-warning-bg)',
                          border: '1px solid var(--status-warning-border)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.5rem 0.25rem'
                        }}
                      >
                        <div style={{ fontSize: '0.675rem', fontWeight: 600, color: 'var(--status-warning-text)' }}>Warning</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--status-warning-text)', marginTop: '0.15rem' }}>
                          {sec.warning}
                        </div>
                      </div>

                      {/* Critical - Red */}
                      <div
                        style={{
                          backgroundColor: 'var(--status-danger-bg)',
                          border: '1px solid var(--status-danger-border)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.5rem 0.25rem'
                        }}
                      >
                        <div style={{ fontSize: '0.675rem', fontWeight: 600, color: 'var(--status-danger-text)' }}>Critical</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--status-danger-text)', marginTop: '0.15rem' }}>
                          {sec.critical}
                        </div>
                      </div>

                      {/* Offline - Grey */}
                      <div
                        style={{
                          backgroundColor: 'var(--status-offline-bg)',
                          border: '1px solid var(--status-offline-border)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.5rem 0.25rem'
                        }}
                      >
                        <div style={{ fontSize: '0.675rem', fontWeight: 600, color: 'var(--status-offline-text)' }}>Offline</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--status-offline-text)', marginTop: '0.15rem' }}>
                          {sec.offline}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                    {sec.categories.map((cat) => (
                      <span
                        key={cat}
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 500,
                          padding: '0.15rem 0.5rem',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'var(--bg-secondary)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-light)'
                        }}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button: Click to inspect sector's 10 machines */}
                <button
                  className={isAllowed ? 'btn btn-primary' : 'btn btn-secondary'}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '0.65rem',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: isAllowed ? 'pointer' : 'not-allowed'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isAllowed) {
                      alert(`Security Access Restriction: You are authenticated as ${currentUser?.title || currentUser?.name} (${currentUser?.sector}). You do not have clearance to inspect ${sec.title}. Only equipment in your authorized sector can be accessed.`);
                      return;
                    }
                    setActiveSectorId(sec.id);
                  }}
                >
                  {isAllowed ? (
                    <>
                      <Cpu size={16} /> Open Machinery Bays ({sec.total}) <ArrowUpRight size={15} />
                    </>
                  ) : (
                    <>
                      <Lock size={15} /> Clearance Restricted
                    </>
                  )}
                </button>
              </div>
            );
          })}
          </div>
        </div>
      ) : !currentUser || isSectorAllowedForUser(currentSector.id, currentUser) ? (
        /* ============================================================== */
        /* VIEW MODE 2: SECTOR-SPECIFIC 10 MACHINES (BUS-SEAT INTERFACE)   */
        /* ============================================================== */
        <div>
          {/* Back Navigation Bar & Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setActiveSectorId(null);
                  setSearchTerm('');
                  setStatusFilter('All');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 600,
                  boxShadow: 'var(--shadow-sm)'
                }}
                title="Return to the 4 plant sectors overview"
              >
                <ArrowLeft size={16} /> Back to Sectors
              </button>

              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  {currentSector.title}
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                  Showing exactly {filteredSectorMachines.length} of {currentSector.total} machinery bays • Interactive bay selection
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.775rem',
                  fontWeight: 600,
                  color: 'var(--primary-700)',
                  backgroundColor: 'var(--primary-50)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--primary-200)'
                }}
              >
                Stable IDs: {currentSector.prefix}M1 — {currentSector.prefix}M10
              </span>

              {userRole === 'admin' && onOpenAddMachineModal && (
                <button className="btn btn-primary btn-sm" onClick={onOpenAddMachineModal}>
                  <Plus size={16} /> + Add Machine
                </button>
              )}
            </div>
          </div>

          {/* Bus Seat-Style Machine Selection Interface Container */}
          <div className="bus-seat-container">
            {/* Bus Seat Selection Status & Legend Header */}
            <div className="bus-seat-legend">
              <span style={{ color: 'var(--text-main)', marginRight: '0.25rem' }}>
                Operational Status Legend:
              </span>

              <div className="bus-legend-item">
                <span
                  className="bus-legend-dot"
                  style={{ backgroundColor: 'var(--status-success-text)' }}
                />
                <span>Operational ({currentSector.operational})</span>
              </div>

              <div className="bus-legend-item">
                <span
                  className="bus-legend-dot"
                  style={{ backgroundColor: 'var(--status-warning-text)' }}
                />
                <span>Warning ({currentSector.warning})</span>
              </div>

              <div className="bus-legend-item">
                <span
                  className="bus-legend-dot"
                  style={{ backgroundColor: 'var(--status-danger-text)' }}
                />
                <span>Critical ({currentSector.critical})</span>
              </div>

              <div className="bus-legend-item">
                <span
                  className="bus-legend-dot"
                  style={{ backgroundColor: 'var(--status-offline-text)' }}
                />
                <span>Offline ({currentSector.offline})</span>
              </div>

              <div className="bus-legend-item" style={{ borderLeft: '1px solid var(--border-medium)', paddingLeft: '0.85rem' }}>
                <span
                  className="bus-legend-dot"
                  style={{ borderColor: 'var(--primary-600)', backgroundColor: 'var(--primary-100)' }}
                />
                <span style={{ color: 'var(--primary-600)' }}>Selected Card</span>
              </div>
            </div>

            {/* Quick Filter Bar */}
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'center',
                maxWidth: 820,
                margin: '0 auto 1.25rem auto',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ position: 'relative', flex: '1', minWidth: 240 }}>
                <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder={`Search ${currentSector.name} machines, tag ID (e.g. ${currentSector.prefix}M1)...`}
                  className="form-control"
                  style={{ paddingLeft: '2.4rem' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {['All', 'Operational', 'Warning', 'Critical', 'Offline'].map((st) => (
                  <button
                    key={st}
                    className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setStatusFilter(st)}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* 5-Machines-Per-Row Plant Floor Shell */}
            <div className="plant-floor-shell">
              {/* Floor Infeed & Banner Header */}
              <div className="plant-line-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={16} />
                  <span>▲ Production Line Floor — Monitored Machinery Bays</span>
                </div>
                <span>5 Machines Per Row • {currentSector.total} Bays</span>
              </div>

              {/* Rows of 5 Square Machine Cards */}
              {machineRows.map((row, rIdx) => (
                <div key={row.rowNumber} className="plant-row-container">
                  <div className="plant-row-label">
                    <span>Row {row.rowNumber}</span>
                    <span style={{ opacity: 0.4 }}>•</span>
                    <span>Bays {row.startIndex + 1 < 10 ? '0' : ''}{row.startIndex + 1} – {Math.min(row.startIndex + 5, filteredSectorMachines.length) < 10 ? '0' : ''}{Math.min(row.startIndex + 5, filteredSectorMachines.length)}</span>
                  </div>

                  <div className="plant-row-grid">
                    {row.machines.map((machine, mIdx) => {
                      const bayNum = row.startIndex + mIdx + 1;
                      return renderMachineSeatCard(
                        machine,
                        `Bay ${bayNum < 10 ? '0' : ''}${bayNum}`
                      );
                    })}
                  </div>

                  {/* Central Maintenance Aisle Divider between rows */}
                  {rIdx < machineRows.length - 1 && (
                    <div className="plant-aisle-divider">
                      <div className="plant-aisle-line" />
                      <span className="plant-aisle-badge">
                        Central Maintenance Walkway
                      </span>
                      <div className="plant-aisle-line" />
                    </div>
                  )}
                </div>
              ))}

              {filteredSectorMachines.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <Cpu size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
                  <p style={{ margin: 0 }}>No machines matching the search or filter criteria in this sector.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ============================================================== */
        /* VIEW MODE 3: ACCESS DENIED (UNAUTHORIZED SECTOR CLEARANCE)     */
        /* ============================================================== */
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setActiveSectorId(null);
                setSearchTerm('');
                setStatusFilter('All');
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
            >
              <ArrowLeft size={16} /> Back to Sectors
            </button>
          </div>
          <div
            style={{
              padding: '3.5rem 2rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-card)',
              border: '2px solid var(--status-danger-border)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: 680,
              margin: '2rem auto'
            }}
          >
            <ShieldAlert size={54} style={{ color: 'var(--status-danger-text)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--status-danger-text)', marginBottom: '0.5rem' }}>
              Security Clearance Denied: Sector Access Restricted
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              You are currently authenticated as <strong>{currentUser?.title || currentUser?.name}</strong> ({currentUser?.sector}).
              Plant role-based security policies restrict equipment inspection, telemetry monitoring, and maintenance actions strictly to your authorized operational sector. You do not possess clearance for <strong>{currentSector.title}</strong>.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setActiveSectorId(null)}
            >
              <ArrowLeft size={16} /> Return to Authorized Sectors Overview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
