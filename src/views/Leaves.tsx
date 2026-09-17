import React, { useState } from 'react';
import { useAppState, LeaveRequest, Employee } from '../context/StateContext';
import { FileText, Send, Calendar, CheckSquare, ShieldCheck, XCircle, AlertCircle, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getPermissions, EMPLOYEE_PERSONA_ID, MANAGER_DEPARTMENT } from '../utils/permissions';

export const Leaves: React.FC = () => {
  const { leaves, employees, activeRole, applyLeave, updateLeaveStatus } = useAppState();
  const permissions = getPermissions(activeRole);

  const isEmployee = activeRole === 'Employee';
  const isDeptManager = activeRole === 'Department Manager';
  const isHR = activeRole === 'HR Manager' || activeRole === 'Super Admin';
  const isSuperAdmin = activeRole === 'Super Admin';
  const isPayroll = activeRole === 'Payroll Manager';

  // Apply Form State
  const [empId, setEmpId] = useState(isEmployee ? EMPLOYEE_PERSONA_ID : '');
  const [leaveType, setLeaveType] = useState<'Casual' | 'Sick' | 'Paid' | 'Earned' | 'Maternity' | 'Paternity' | 'LWP'>('Casual');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [reason, setReason] = useState('');

  // Set default employee if role is Employee
  React.useEffect(() => {
    if (isEmployee) {
      setEmpId(EMPLOYEE_PERSONA_ID);
    } else if (employees.length > 0 && !empId) {
      setEmpId(employees[0].id);
    }
  }, [activeRole, employees, empId, isEmployee]);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empId || !from || !to) return;

    applyLeave({
      employeeId: empId,
      leaveType,
      fromDate: from,
      toDate: to,
      reason
    });

    setReason('');
    setFrom('');
    setTo('');
    
    alert('Leave applied successfully! Manager has been notified.');
  };

  const getEmployeeName = (id: string) => {
    return employees.find(e => e.id === id)?.name || id;
  };

  const handleApproveManager = (id: string) => {
    updateLeaveStatus(id, 'Approved by Manager');
    confetti({ particleCount: 60, spread: 40, origin: { y: 0.8 } });
  };

  const handleVerifyHR = (id: string) => {
    updateLeaveStatus(id, 'HR Verified');
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.8 } });
  };

  const handleReject = (id: string) => {
    updateLeaveStatus(id, 'Rejected');
  };

  // Filter lists based on roles
  const managerQueue = leaves.filter(l => {
    if (l.status !== 'Pending Approval') return false;
    if (isDeptManager) {
      const emp = employees.find(e => e.id === l.employeeId);
      return emp?.department === MANAGER_DEPARTMENT;
    }
    return true;
  });

  const hrQueue = leaves.filter(l => l.status === 'Approved by Manager');
  const allHistory = isEmployee 
    ? leaves.filter(l => l.employeeId === EMPLOYEE_PERSONA_ID || l.employeeId === 'EMP-005') 
    : isDeptManager 
      ? leaves.filter(l => {
          const emp = employees.find(e => e.id === l.employeeId);
          return emp?.department === MANAGER_DEPARTMENT;
        })
      : leaves;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Leave Desk</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
          Apply for leave, verify certificates, track approvals, and manage absences.
        </p>
      </div>

      {/* Renders dynamic interface based on role */}
      <div className="grid-2" style={{ gridTemplateColumns: isEmployee ? '1fr 1fr' : '1fr 2fr' }}>
        
        {/* Leave application form (visible for employee, admin, or HR) */}
        {(isEmployee || activeRole === 'Super Admin' || activeRole === 'HR Manager') ? (
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Apply for Leave</h3>
            
            <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Employee Persona</label>
                <select 
                  value={empId} 
                  onChange={(e) => setEmpId(e.target.value)}
                  disabled={isEmployee}
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Leave Type</label>
                <select value={leaveType} onChange={(e) => setLeaveType(e.target.value as any)}>
                  <option value="Casual">Casual Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Paid">Paid Leave</option>
                  <option value="Earned">Earned Leave</option>
                  <option value="Maternity">Maternity Leave</option>
                  <option value="Paternity">Paternity Leave</option>
                  <option value="LWP">Leave Without Pay (LWP)</option>
                </select>
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>From Date</label>
                  <input type="date" required value={from} onChange={(e) => setFrom(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>To Date</label>
                  <input type="date" required value={to} onChange={(e) => setTo(e.target.value)} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Reason for Absence</label>
                <textarea 
                  required 
                  value={reason} 
                  onChange={(e) => setReason(e.target.value)} 
                  rows={4}
                  placeholder="Please state details regarding your absence..."
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '12px', width: '100%', fontWeight: 700 }}>
                <Send size={16} /> Submit Leave Request
              </button>
            </form>
          </div>
        ) : (
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-secondary)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Approval Panel</h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'var(--primary-light)', padding: '16px', borderRadius: '10px', color: 'var(--primary)' }}>
              <ShieldCheck size={24} />
              <div>
                <span style={{ fontWeight: 600, display: 'block' }}>Roster Authority Session</span>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  You are logged in as <strong>{activeRole}</strong>. Verify and approve employee absences below.
                </p>
              </div>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Employees apply for leaves from their profile pages. Department managers sign off on leaves first, followed by final HR verification for salary updates.
            </p>
          </div>
        )}

        {/* Approval Queues & Log history */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Manager approval queue */}
          {(isDeptManager || isHR || isSuperAdmin) && (
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Manager Approval Queue (Stage 1)</h3>
                <span className="badge badge-warning">{managerQueue.length} Pending</span>
              </div>

              {managerQueue.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {managerQueue.map(item => (
                    <div key={item.id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px', background: 'var(--bg-secondary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <span style={{ fontWeight: 700, fontSize: '14px' }}>{getEmployeeName(item.employeeId)}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>{item.employeeId} • Applied {item.appliedDate}</span>
                        </div>
                        <span className="badge badge-info">{item.leaveType} Leave</span>
                      </div>
                      
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '8px 0', borderLeft: '3px solid var(--primary)', paddingLeft: '8px' }}>
                        "{item.reason}"
                      </p>

                      <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} /> {item.fromDate} to {item.toDate}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)', padding: '6px 12px', fontSize: '12px' }} onClick={() => handleReject(item.id)}>
                          <XCircle size={14} /> Reject
                        </button>
                        <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleApproveManager(item.id)}>
                          <CheckSquare size={14} /> Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', padding: '16px' }}>
                  No pending approvals in Manager queue.
                </p>
              )}
            </div>
          )}

          {/* HR Verification queue */}
          {isHR && (
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 800 }}>HR Verification Desk (Stage 2)</h3>
                <span className="badge badge-success">{hrQueue.length} Verified</span>
              </div>

              {hrQueue.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {hrQueue.map(item => (
                    <div key={item.id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px', background: 'var(--bg-secondary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <span style={{ fontWeight: 700, fontSize: '14px' }}>{getEmployeeName(item.employeeId)}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>{item.employeeId} • Stage 1 Approved</span>
                        </div>
                        <span className="badge badge-info">{item.leaveType} Leave</span>
                      </div>
                      
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '8px 0', borderLeft: '3px solid var(--success)', paddingLeft: '8px' }}>
                        "{item.reason}"
                      </p>

                      <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} /> {item.fromDate} to {item.toDate}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)', padding: '6px 12px', fontSize: '12px' }} onClick={() => handleReject(item.id)}>
                          <XCircle size={14} /> Decline
                        </button>
                        <button className="btn btn-primary" style={{ background: 'var(--success)', color: 'white', padding: '6px 12px', fontSize: '12px' }} onClick={() => handleVerifyHR(item.id)}>
                          <ShieldCheck size={14} /> Verify & Update Attendance
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', padding: '16px' }}>
                  No pending verifications in HR queue.
                </p>
              )}
            </div>
          )}

          {/* Leave History List */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Leave Log Registry</h3>
            <div style={{ overflowX: 'auto', maxHeight: '250px' }}>
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Leave Type</th>
                    <th>Dates</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allHistory.map(item => (
                    <tr key={item.id}>
                      <td>
                        <span style={{ fontWeight: 600, display: 'block' }}>{getEmployeeName(item.employeeId)}</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.employeeId}</span>
                      </td>
                      <td>{item.leaveType}</td>
                      <td style={{ fontSize: '12px' }}>{item.fromDate} to {item.toDate}</td>
                      <td>
                        <span className={`badge ${
                          item.status === 'HR Verified' ? 'badge-success' :
                          item.status === 'Approved by Manager' ? 'badge-info' :
                          item.status === 'Rejected' ? 'badge-danger' : 'badge-warning'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
