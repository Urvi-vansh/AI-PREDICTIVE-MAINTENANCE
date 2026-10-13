import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import {
  Calendar,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react';
import { CreatePreventiveScheduleModal } from '../forms/CreatePreventiveScheduleModal';
import { CompletePreventiveTaskModal } from '../modals/CompletePreventiveTaskModal';

export const PreventiveMaintenanceView = ({
  schedules = [],
  assets = [],
  onCreateSchedule,
  onCompleteTask,
  userRole = 'admin'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [frequencyFilter, setFrequencyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const frequencies = ['All', 'Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'Annual'];
  const statuses = ['All', 'Upcoming', 'Due Today', 'Overdue', 'Completed'];

  const filteredSchedules = schedules.filter((sch) => {
    const matchesSearch =
      sch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sch.machineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sch.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sch.assignedTech.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFreq = frequencyFilter === 'All' || sch.frequency === frequencyFilter;
    const matchesStatus = statusFilter === 'All' || sch.status === statusFilter;

    return matchesSearch && matchesFreq && matchesStatus;
  });

  const totalUpcoming = schedules.filter((s) => s.status === 'Upcoming').length;
  const totalDueToday = schedules.filter((s) => s.status === 'Due Today').length;
  const totalOverdue = schedules.filter((s) => s.status === 'Overdue').length;

  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage) || 1;
  const paginatedSchedules = filteredSchedules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Preventive Maintenance Scheduling</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Scheduled machinery inspection routines, frequency intervals, and technician servicing execution logs
          </p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle size={16} /> + Schedule Servicing Task
        </button>
      </div>

      {/* KPI Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Scheduled Inspection Routines</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary-600)', marginTop: '0.1rem' }}>
            {schedules.length} Schedules
          </div>
        </div>

        <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-200)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary-700)' }}>Upcoming Maintenance</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary-700)', marginTop: '0.1rem' }}>
            {totalUpcoming} Scheduled
          </div>
        </div>

        <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--status-warning-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--status-warning-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--status-warning-text)' }}>Due Today</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--status-warning-text)', marginTop: '0.1rem' }}>
            {totalDueToday} Action Req.
          </div>
        </div>

        <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--status-danger-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--status-danger-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--status-danger-text)' }}>Overdue Servicing</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--status-danger-text)', marginTop: '0.1rem' }}>
            {totalOverdue} Overdue
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.4rem' }}
              placeholder="Search schedule ID, machine, title, or technician..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Frequency Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Frequency:</span>
            <select
              className="form-control form-select"
              style={{ width: '150px' }}
              value={frequencyFilter}
              onChange={(e) => {
                setFrequencyFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {frequencies.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status:</span>
            <select
              className="form-control form-select"
              style={{ width: '140px' }}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {statuses.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Schedules Table */}
      <Card title={`Preventive Maintenance Routines (${filteredSchedules.length} Tasks)`}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Schedule ID & Title</th>
                <th>Target Machine</th>
                <th>Sector & Dept</th>
                <th>Frequency</th>
                <th>Next Due Date</th>
                <th>Assigned Tech</th>
                <th>Status</th>
                <th>Execution Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSchedules.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <Calendar size={36} style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: 600 }}>No Preventive Schedules Match Your Filters</div>
                    <div style={{ fontSize: '0.8rem' }}>Try clearing your search query or selecting a different frequency.</div>
                  </td>
                </tr>
              ) : (
                paginatedSchedules.map((sch) => {
                  const isOverdue = sch.status === 'Overdue';
                  return (
                    <tr key={sch.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.875rem' }}>
                          {sch.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--primary-600)', fontFamily: 'monospace', fontWeight: 700 }}>
                          {sch.id}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.825rem' }}>
                          {sch.machineName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sch.machineId}</div>
                      </td>

                      <td>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{sch.sector}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{sch.department}</div>
                      </td>

                      <td>
                        <span className="nav-badge" style={{ fontSize: '0.725rem', backgroundColor: 'var(--bg-secondary)' }}>
                          {sch.frequency}
                        </span>
                      </td>

                      <td>
                        <span style={{ fontWeight: 700, color: isOverdue ? '#dc2626' : 'var(--text-main)' }}>
                          {sch.nextDueDate}
                        </span>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                          Last: {sch.lastCompletedDate}
                        </div>
                      </td>

                      <td>{sch.assignedTech}</td>

                      <td>
                        <span
                          className={`badge ${sch.status === 'Overdue' ? 'badge-critical' : sch.status === 'Due Today' ? 'badge-warning' : sch.status === 'Completed' ? 'badge-operational' : 'badge-info'}`}
                        >
                          {sch.status}
                        </span>
                      </td>

                      <td>
                        <button
                          className="btn btn-outline-blue btn-sm"
                          style={{ fontSize: '0.75rem' }}
                          onClick={() => setSelectedSchedule(sch)}
                        >
                          <CheckCircle2 size={14} /> Mark Complete
                        </button>
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
              Page {currentPage} of {totalPages} ({filteredSchedules.length} routines)
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

      {/* Modals */}
      {isCreateModalOpen && (
        <CreatePreventiveScheduleModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmitSchedule={onCreateSchedule}
          assets={assets}
        />
      )}

      {selectedSchedule && (
        <CompletePreventiveTaskModal
          isOpen={Boolean(selectedSchedule)}
          onClose={() => setSelectedSchedule(null)}
          schedule={selectedSchedule}
          onCompleteTask={onCompleteTask}
        />
      )}
    </div>
  );
};
