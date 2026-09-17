import React, { useState } from 'react';
import { useAppState, Employee, AttendanceRecord } from '../context/StateContext';
import { Clock, CheckSquare, Plus, DollarSign, Award, AlertCircle, CheckCircle2, Send, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getPermissions, EMPLOYEE_PERSONA_ID, MANAGER_DEPARTMENT } from '../utils/permissions';

export const Overtime: React.FC = () => {
  const { attendance, employees, activeRole, setAttendanceRecords } = useAppState();
  const permissions = getPermissions(activeRole);

  const [otRateMultiplier, setOtRateMultiplier] = useState(1.5); // 1.5x standard
  const [weekendOtMultiplier, setWeekendOtMultiplier] = useState(2.0); // 2.0x standard
  const [claimDate, setClaimDate] = useState(new Date().toISOString().split('T')[0]);
  const [claimHours, setClaimHours] = useState(2);
  const [claimReason, setClaimReason] = useState('Extended production shift support');
  
  const canModifyConfig = permissions.overtime === 'Full' || permissions.overtime === 'Manage' || permissions.overtime === 'Calculate';
  const canApprove = permissions.overtime === 'Full' || permissions.overtime === 'Approve' || permissions.overtime === 'Manage';
  const isEmployee = activeRole === 'Employee';
  const isDeptManager = activeRole === 'Department Manager';

  // Filter attendance records that have overtime
  const allOtLogs = attendance.filter(a => (a.workingHours > 8 || a.overtime > 0));
  
  // Scope records according to role
  const visibleLogs = isEmployee
    ? allOtLogs.filter(a => a.employeeId === EMPLOYEE_PERSONA_ID)
    : isDeptManager
      ? allOtLogs.filter(a => {
          const emp = employees.find(e => e.id === a.employeeId);
          return emp?.department === MANAGER_DEPARTMENT;
        })
      : allOtLogs;

  const getEmployeeName = (id: string) => {
    return employees.find(e => e.id === id)?.name || id;
  };

  const getEmployeeRate = (id: string) => {
    const emp = employees.find(e => e.id === id);
    return emp ? emp.salaryStructure.overtimeRate : 0;
  };

  const handleApproveOT = (logId: string) => {
    if (!canApprove) return;
    
    const updated = attendance.map(a => {
      if (a.id === logId) {
        return {
          ...a,
          breakTime: a.breakTime // confirms record state
        };
      }
      return a;
    });
    setAttendanceRecords(updated);
    confetti({ particleCount: 50, spread: 30 });
    alert('Overtime hours verified and locked for payroll calculation.');
  };

  const handleEmployeeClaimOT = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: AttendanceRecord = {
      id: `${EMPLOYEE_PERSONA_ID}_${claimDate}_${Date.now()}`,
      employeeId: EMPLOYEE_PERSONA_ID,
      date: claimDate,
      checkIn: '09:00',
      checkOut: '19:00',
      workingHours: 8 + Number(claimHours),
      breakTime: 45,
      overtime: Number(claimHours),
      status: 'Present',
      lateArrival: false,
      earlyLeaving: false,
      method: 'Employee Self OT Claim'
    };
    setAttendanceRecords([newRecord, ...attendance]);
    confetti({ particleCount: 60, spread: 45 });
    alert('Overtime claim submitted to Department Manager for approval!');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Overtime Ledger & Claims</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Multipliers for standard and weekend OT, manager approval queue, and employee claim requests.
          </p>
        </div>
        <div className="badge badge-primary">
          Authority: {permissions.overtime}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid-2" style={{ gridTemplateColumns: isEmployee ? '1fr 2fr' : '1fr 2fr' }}>
        
        {/* Left Card: Config or Employee Claim */}
        {isEmployee ? (
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Request Overtime Claim</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Submit extra hours worked for manager approval and automated payroll inclusion.
            </p>

            <form onSubmit={handleEmployeeClaimOT} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Date of OT</label>
                <input type="date" required value={claimDate} onChange={(e) => setClaimDate(e.target.value)} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>OT Hours</label>
                <input type="number" min="1" max="8" required value={claimHours} onChange={(e) => setClaimHours(Number(e.target.value))} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Reason / Project</label>
                <input type="text" required value={claimReason} onChange={(e) => setClaimReason(e.target.value)} />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
                <Send size={16} /> Submit OT Claim
              </button>
            </form>
          </div>
        ) : (
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Overtime Policy Multipliers</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Standard Overtime Rate (Multiplier)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input 
                    type="number" 
                    step="0.1"
                    value={otRateMultiplier} 
                    onChange={(e) => setOtRateMultiplier(Number(e.target.value))}
                    disabled={!canModifyConfig}
                    style={{ width: '100px' }}
                  />
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>x Employee Hourly Base</span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Weekend / Holiday Rate</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input 
                    type="number" 
                    step="0.1"
                    value={weekendOtMultiplier} 
                    onChange={(e) => setWeekendOtMultiplier(Number(e.target.value))}
                    disabled={!canModifyConfig}
                    style={{ width: '100px' }}
                  />
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>x Employee Hourly Base</span>
                </div>
              </div>
              
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <AlertCircle size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <p>
                  Calculated overtime pay is automatically credited in the monthly payroll run under earnings.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Right Card: Clocked OT Logs */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>
              {isEmployee ? 'My Overtime History' : isDeptManager ? 'Operations Team Overtime Queue' : 'All Clocked Overtime Records'}
            </h3>
            <span className="badge badge-info">{visibleLogs.length} Records</span>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Clock Hours</th>
                  <th>OT (Hours)</th>
                  <th>Est. OT Pay</th>
                  <th>Approval / Status</th>
                </tr>
              </thead>
              <tbody>
                {visibleLogs.length > 0 ? (
                  visibleLogs.map(log => {
                    const rate = getEmployeeRate(log.employeeId);
                    const isWeekend = new Date(log.date).getDay() === 0 || log.status === 'Holiday';
                    const multiplier = isWeekend ? weekendOtMultiplier : otRateMultiplier;
                    const estPay = log.overtime * rate * multiplier;

                    return (
                      <tr key={log.id}>
                        <td>
                          <span style={{ fontWeight: 600, display: 'block' }}>{getEmployeeName(log.employeeId)}</span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{log.employeeId}</span>
                        </td>
                        <td>{log.date}</td>
                        <td>{log.workingHours} hrs</td>
                        <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{log.overtime} hrs</td>
                        <td style={{ fontWeight: 700 }}>₹{estPay.toFixed(2)}</td>
                        <td>
                          {canApprove ? (
                            <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--success)', borderColor: 'var(--success-light)' }} onClick={() => handleApproveOT(log.id)}>
                              <CheckSquare size={12} /> Approve OT
                            </button>
                          ) : (
                            <span className="badge badge-success">
                              <ShieldCheck size={12} /> Logged
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No overtime logged for this cycle.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Overtime;
