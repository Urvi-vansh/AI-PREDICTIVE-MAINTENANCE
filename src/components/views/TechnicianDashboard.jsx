import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  FileText,
  Send,
  History,
  Cpu,
  Package,
  CheckSquare
} from 'lucide-react';
import { TaskResolutionModal } from '../modals/TaskResolutionModal';

export const TechnicianDashboard = ({
  user,
  workOrders,
  onAcknowledgeTask,
  onStartWork,
  onSubmitResolution,
  onSelectAsset
}) => {
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'
  const [selectedTaskForResolution, setSelectedTaskForResolution] = useState(null);

  // Filter tasks strictly assigned to this technician
  const techName = user.name || 'Technician';
  const assignedWorkOrders = workOrders.filter(w =>
    w.assignedTo.toLowerCase().includes(techName.toLowerCase()) ||
    techName.toLowerCase().includes(w.assignedTo.split(' ')[0].toLowerCase())
  );

  const activeTasks = assignedWorkOrders.filter(w => w.status !== 'Completed');
  const completedTasks = assignedWorkOrders.filter(w => w.status === 'Completed');

  return (
    <div>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Field Technician Task Console</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Assigned Technician: <strong>{user.name}</strong> ({user.title}) • {user.sector}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn btn-sm ${activeTab === 'active' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('active')}
          >
            <Wrench size={14} /> Active Tasks ({activeTasks.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('history')}
          >
            <History size={14} /> Repair History ({completedTasks.length})
          </button>
        </div>
      </div>

      {activeTab === 'active' ? (
        <div>
          {/* Active Tasks Grid */}
          {activeTasks.length === 0 ? (
            <Card style={{ textAlign: 'center', padding: '3rem' }}>
              <CheckCircle2 size={42} style={{ color: '#16a34a', marginBottom: '0.5rem' }} />
              <h3 style={{ color: 'var(--text-main)', marginBottom: '0.25rem' }}>No Active Assigned Tasks</h3>
              <p style={{ color: 'var(--text-muted)' }}>All assigned maintenance work orders have been completed and verified.</p>
            </Card>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
              {activeTasks.map((task) => {
                const isOverdue = new Date(task.dueDate) < new Date('2026-10-10') && task.status !== 'Completed';
                return (
                  <Card key={task.id} style={{ border: isOverdue ? '1px solid var(--status-danger-border)' : '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--primary-600)', fontFamily: 'monospace' }}>
                        {task.id}
                      </span>
                      <Badge status={task.status} />
                    </div>

                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                      {task.assetName}
                    </h3>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      Machine Tag: <strong>{task.assetId}</strong> • Type: {task.type}
                    </div>

                    {/* Fault Description Box */}
                    <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', marginBottom: '1rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                      <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                        Fault / Task Instructions:
                      </div>
                      "{task.description}"
                    </div>

                    {/* Metadata Details */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.775rem', marginBottom: '1.25rem' }}>
                      <div>
                        Priority: <strong style={{ color: task.priority === 'High' ? '#dc2626' : 'var(--primary-600)' }}>{task.priority}</strong>
                      </div>
                      <div>
                        Deadline: <strong style={{ color: isOverdue ? '#dc2626' : 'var(--text-main)' }}>{task.dueDate}</strong>
                      </div>
                    </div>

                    {/* Technician Interactive Control Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {task.status === 'Pending' && (
                        <button
                          className="btn btn-outline-blue btn-sm"
                          style={{ width: '100%' }}
                          onClick={() => onAcknowledgeTask(task.id)}
                        >
                          <CheckCircle2 size={16} /> Acknowledge Task
                        </button>
                      )}

                      {task.status === 'In Progress' && (
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ width: '100%' }}
                          onClick={() => setSelectedTaskForResolution(task)}
                        >
                          <Send size={16} /> Submit Repair Resolution
                        </button>
                      )}

                      {task.status === 'Pending Verification' && (
                        <div style={{ padding: '0.6rem', textAlign: 'center', backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 600 }}>
                          Submitted for Sector Head Verification
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Task Repair History Page */
        <Card title={`Technician Repair History (${completedTasks.length} Completed Tasks)`}>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Target Machine</th>
                  <th>Maintenance Type</th>
                  <th>Priority</th>
                  <th>Completion Date</th>
                  <th>Resolution Status</th>
                </tr>
              </thead>
              <tbody>
                {completedTasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                      No completed maintenance tasks logged in history.
                    </td>
                  </tr>
                ) : (
                  completedTasks.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--primary-600)', fontFamily: 'monospace' }}>
                          {t.id}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{t.assetName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.assetId}</div>
                      </td>
                      <td>{t.type}</td>
                      <td>{t.priority}</td>
                      <td>{t.dueDate}</td>
                      <td><Badge status="Completed">Verified & Closed</Badge></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Resolution Modal */}
      <TaskResolutionModal
        isOpen={Boolean(selectedTaskForResolution)}
        onClose={() => setSelectedTaskForResolution(null)}
        task={selectedTaskForResolution}
        onSubmitResolution={onSubmitResolution}
      />
    </div>
  );
};
