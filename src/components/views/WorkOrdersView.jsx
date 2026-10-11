import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { PreventiveMaintenanceView } from './PreventiveMaintenanceView';
import { DowntimeTrackingView } from './DowntimeTrackingView';

export const WorkOrdersView = ({
  workOrders = [],
  onUpdateWOStatus,
  onOpenWorkOrderModal,
  preventiveSchedules = [],
  onCreatePreventiveSchedule,
  onCompletePreventiveTask,
  downtimeLogs = [],
  onRecordDowntime,
  user
}) => {
  const [moduleTab, setModuleTab] = useState('corrective'); // 'corrective', 'preventive', 'downtime'
  const [activeFilterTab, setActiveFilterTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filterTabs = ['All', 'Pending', 'In Progress', 'Completed', 'High Priority', 'Overdue'];

  const filteredWorkOrders = workOrders.filter((wo) => {
    const matchesSearch =
      wo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSector = sectorFilter === 'All' || (wo.sector && wo.sector === sectorFilter);

    if (activeFilterTab === 'High Priority') {
      return matchesSearch && matchesSector && wo.priority === 'High';
    }
    if (activeFilterTab === 'Overdue') {
      const isOverdue = new Date(wo.dueDate) < new Date('2026-10-10') && wo.status !== 'Completed';
      return matchesSearch && matchesSector && isOverdue;
    }
    if (activeFilterTab !== 'All') {
      return matchesSearch && matchesSector && wo.status === activeFilterTab;
    }
    return matchesSearch && matchesSector;
  });

  const totalPages = Math.ceil(filteredWorkOrders.length / itemsPerPage) || 1;
  const paginatedWorkOrders = filteredWorkOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {/* Module Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--border-light)', paddingBottom: '0.5rem' }}>
        <button
          className={`btn btn-sm ${moduleTab === 'corrective' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setModuleTab('corrective')}
        >
          <Wrench size={15} /> Corrective Work Orders
        </button>

        <button
          className={`btn btn-sm ${moduleTab === 'preventive' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setModuleTab('preventive')}
        >
          <Calendar size={15} /> Preventive Maintenance ({preventiveSchedules.filter(s => s.status === 'Overdue' || s.status === 'Due Today').length} Action Req.)
        </button>

        <button
          className={`btn btn-sm ${moduleTab === 'downtime' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setModuleTab('downtime')}
        >
          <Clock size={15} /> Downtime Tracking ({downtimeLogs.filter(d => d.status === 'Ongoing').length} Ongoing)
        </button>
      </div>

      {/* RENDER MODULE 1: PREVENTIVE MAINTENANCE */}
      {moduleTab === 'preventive' && (
        <PreventiveMaintenanceView
          schedules={preventiveSchedules}
          onCreateSchedule={onCreatePreventiveSchedule}
          onCompleteTask={onCompletePreventiveTask}
          userRole={user ? user.role : 'admin'}
        />
      )}

      {/* RENDER MODULE 2: DOWNTIME TRACKING */}
      {moduleTab === 'downtime' && (
        <DowntimeTrackingView
          downtimeLogs={downtimeLogs}
          onRecordDowntime={onRecordDowntime}
          user={user}
        />
      )}

      {/* RENDER CORRECTIVE WORK ORDERS */}
      {moduleTab === 'corrective' && (
        <div>
          {/* Header Info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Maintenance Work Orders Schedule</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Corrective maintenance task dispatch and technician progress tracking</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={onOpenWorkOrderModal}>
              <Plus size={16} /> Create Work Order Task
            </button>
          </div>

          {/* Header & Filter Tabs */}
          <Card style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {filterTabs.map((tab) => (
                  <button
                    key={tab}
                    className={`btn btn-sm ${activeFilterTab === tab ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => {
                      setActiveFilterTab(tab);
                      setCurrentPage(1);
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>Sector:</span>
                <select
                  className="form-control form-select"
                  style={{ width: '190px' }}
                  value={sectorFilter}
                  onChange={(e) => {
                    setSectorFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="All">All Sectors</option>
                  <option value="Production & Manufacturing">Production & Mfg</option>
                  <option value="Mechanical Department">Mechanical Dept</option>
                  <option value="Electrical Department">Electrical Dept</option>
                </select>
              </div>
            </div>

            {/* Search Bar */}
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="Search work order ticket ID, target asset, or assigned technician..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </Card>

          {/* Work Orders List Table */}
          <Card title={`Maintenance Tasks Schedule (${filteredWorkOrders.length} Tickets)`}>
            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Target Machine</th>
                    <th>Sector</th>
                    <th>Maintenance Type</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assigned Tech</th>
                    <th>Due Date</th>
                    <th>Update Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedWorkOrders.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        <Wrench size={36} style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }} />
                        <div style={{ fontWeight: 600 }}>No Maintenance Tickets Found</div>
                        <div style={{ fontSize: '0.8rem' }}>No task orders match your filter criteria.</div>
                      </td>
                    </tr>
                  ) : (
                    paginatedWorkOrders.map((wo) => {
                      const isOverdue = new Date(wo.dueDate) < new Date('2026-10-10') && wo.status !== 'Completed';
                      return (
                        <tr key={wo.id}>
                          <td>
                            <span style={{ fontWeight: 700, color: 'var(--primary-600)', fontFamily: 'monospace' }}>
                              {wo.id}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{wo.assetName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{wo.assetId}</div>
                          </td>
                          <td>{wo.sector || 'Plant Floor'}</td>
                          <td>{wo.type}</td>
                          <td>
                            <span
                              style={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: wo.priority === 'High' ? '#dc2626' : wo.priority === 'Medium' ? '#d97706' : '#2563eb'
                              }}
                            >
                              {wo.priority}
                            </span>
                          </td>
                          <td><Badge status={wo.status} /></td>
                          <td>{wo.assignedTo}</td>
                          <td>
                            <span style={{ color: isOverdue ? '#dc2626' : 'var(--text-main)', fontWeight: isOverdue ? 700 : 400 }}>
                              {wo.dueDate}
                              {isOverdue && <span style={{ fontSize: '0.7rem', display: 'block', color: '#dc2626' }}>Overdue</span>}
                            </span>
                          </td>
                          <td>
                            <select
                              className="form-control form-select"
                              style={{ width: '130px', padding: '0.25rem 0.5rem', fontSize: '0.775rem' }}
                              value={wo.status}
                              onChange={(e) => onUpdateWOStatus(wo.id, e.target.value)}
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Page {currentPage} of {totalPages} ({filteredWorkOrders.length} tickets)
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
