import React from 'react';
import { useAppState, Employee, AttendanceRecord } from '../context/StateContext';
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  DollarSign, 
  Calendar, 
  ArrowRight, 
  ShieldAlert, 
  MapPin, 
  Clock, 
  FileCheck, 
  CreditCard, 
  AlertCircle,
  Building2,
  CheckCircle2,
  Send,
  CalendarCheck
} from 'lucide-react';
import { CompanyLogo } from '../components/CompanyLogo';
import { EMPLOYEE_PERSONA_ID, MANAGER_DEPARTMENT, getPermissions } from '../utils/permissions';

export const Dashboard: React.FC = () => {
  const { employees, attendance, payroll, leaves, shifts, activeRole, setActiveRole, companyProfile, clockIn } = useAppState();
  
  const today = new Date().toISOString().split('T')[0];
  const activeEmployees = employees.filter(e => e.status === 'Active');
  const permissions = getPermissions(activeRole);
  
  // Calculate today's metrics
  const todayAtt = attendance.filter(a => a.date === today);
  const presentCount = todayAtt.filter(a => a.status === 'Present' || a.status === 'WFH').length;
  const leaveCount = todayAtt.filter(a => a.status === 'Leave').length;
  const holidayCount = todayAtt.filter(a => a.status === 'Holiday').length;
  const lateCount = todayAtt.filter(a => a.lateArrival).length;
  const absentCount = Math.max(0, activeEmployees.length - presentCount - leaveCount - holidayCount);
  
  // Calculate OT and salary metrics
  const totalOtHours = attendance.reduce((sum, rec) => sum + (rec.overtime || 0), 0);
  const activeMonthPayroll = payroll.filter(p => p.month === '2026-08');
  const totalSalaryCost = activeMonthPayroll.reduce((sum, p) => sum + p.netSalary, 0);
  const grossSalaryCost = activeMonthPayroll.reduce((sum, p) => sum + p.earnings.grossSalary, 0);
  const totalPfDeduction = activeMonthPayroll.reduce((sum, p) => sum + (p.deductions?.pf || 0), 0);
  const totalEsicDeduction = activeMonthPayroll.reduce((sum, p) => sum + (p.deductions?.esi || 0), 0);
  const totalPtDeduction = activeMonthPayroll.reduce((sum, p) => sum + (p.deductions?.pt || 0), 0);
  const totalTdsDeduction = activeMonthPayroll.reduce((sum, p) => sum + (p.deductions?.tds || 0), 0);

  // Department Manager calculations (Operations department)
  const teamEmployees = employees.filter(e => e.department === MANAGER_DEPARTMENT);
  const teamTodayAtt = todayAtt.filter(a => {
    const emp = employees.find(e => e.id === a.employeeId);
    return emp?.department === MANAGER_DEPARTMENT;
  });
  const teamPresent = teamTodayAtt.filter(a => a.status === 'Present' || a.status === 'WFH').length;
  const teamPendingLeaves = leaves.filter(l => {
    if (l.status !== 'Pending Approval') return false;
    const emp = employees.find(e => e.id === l.employeeId);
    return emp?.department === MANAGER_DEPARTMENT;
  });

  // Employee Persona calculations (EMPLOYEE_PERSONA_ID: 200050)
  const currentEmp = employees.find(e => e.id === EMPLOYEE_PERSONA_ID) || employees[0];
  const empAttendanceLogs = attendance.filter(a => a.employeeId === currentEmp.id);
  const empPresentDays = empAttendanceLogs.filter(a => a.status === 'Present' || a.status === 'WFH').length;
  const empTodayRec = todayAtt.find(a => a.employeeId === currentEmp.id);
  const empPayrollRec = payroll.find(p => p.employeeId === currentEmp.id && p.month === '2026-08');
  const empShift = shifts.find(s => s.id === currentEmp.shiftId) || shifts[0];
  
  // Custom SVG bar graph values for 7-day attendance trend
  const weeklyTrendData = [
    { label: 'Mon', present: 52, absent: 5 },
    { label: 'Tue', present: 54, absent: 3 },
    { label: 'Wed', present: 50, absent: 7 },
    { label: 'Thu', present: 55, absent: 2 },
    { label: 'Fri', present: 53, absent: 4 },
    { label: 'Sat', present: 48, absent: 9 },
    { label: 'Sun', present: 0, absent: 57 }
  ];
  
  // Count employees per department
  const depts = employees.reduce((acc, curr) => {
    acc[curr.department] = (acc[curr.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const deptData = Object.entries(depts).map(([name, count]) => ({ name, count }));

  // Quick Employee Self Clock-in
  const handleEmployeeClockIn = () => {
    clockIn(currentEmp.id, 'Self Web Terminal', 'Jamnagar Office');
    alert('Attendance successfully punched for today!');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Company Corporate Hero Banner */}
      <div className="glass-card" style={{ 
        background: 'linear-gradient(135deg, #1b5a7a 0%, #0f2b3c 100%)',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 32px',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 8px 24px rgba(15, 43, 60, 0.35)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'white', padding: '8px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <CompanyLogo size="lg" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '0.5px' }}>{companyProfile.name}</h2>
              <span className="badge badge-success" style={{ fontSize: '10px', padding: '2px 8px', fontWeight: 700 }}>
                Verified Official
              </span>
            </div>
            <p style={{ opacity: 0.9, fontSize: '12px', marginTop: '4px', maxWidth: '600px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={13} style={{ color: '#38bdf8', flexShrink: 0 }} />
              {companyProfile.address}
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '11px', opacity: 0.85 }}>
              <span>📍 Locations: <strong>Cold Jamnagar</strong> & <strong>TML DEF Gandhidham</strong></span>
              <span>•</span>
              <span>Workforce Roster: <strong>{employees.length} Active Employees</strong></span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.12)', padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Calendar size={18} />
            <span style={{ fontWeight: 700, fontSize: '13px' }}>Session: {activeRole}</span>
          </div>
          <span style={{ fontSize: '11px', opacity: 0.8 }}>Access Scope: {permissions.dashboard} Dashboard</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. EMPLOYEE PERSONA DASHBOARD VIEW */}
      {/* ========================================================================= */}
      {activeRole === 'Employee' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Employee KPI Cards */}
          <div className="grid-4">
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)' }}>
                <Clock size={28} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>My Monthly Attendance</p>
                <h3 style={{ fontSize: '22px', fontWeight: 800, marginTop: '2px' }}>
                  {empPresentDays} <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>/ 30 Days</span>
                </h3>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--success-light)', color: 'var(--success)' }}>
                <CalendarCheck size={28} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>Leave Balance</p>
                <h3 style={{ fontSize: '22px', fontWeight: 800, marginTop: '2px' }}>
                  4 <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>Casual • 5 Sick • 12 Earned</span>
                </h3>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--accent-light)', color: 'var(--accent)' }}>
                <DollarSign size={28} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>August Payslip (Net)</p>
                <h3 style={{ fontSize: '22px', fontWeight: 800, marginTop: '2px', color: 'var(--success)' }}>
                  ₹{(empPayrollRec?.netSalary || currentEmp.salaryStructure.basic).toLocaleString()}
                </h3>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--warning-light)', color: 'var(--warning)' }}>
                <Clock size={28} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>My Assigned Shift</p>
                <h3 style={{ fontSize: '16px', fontWeight: 800, marginTop: '2px' }}>
                  {empShift.name} ({empShift.startTime}-{empShift.endTime})
                </h3>
              </div>
            </div>
          </div>

          {/* Quick Punch & Personal Status */}
          <div className="grid-2" style={{ gridTemplateColumns: '1fr 2fr' }}>
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Daily Clock-in Terminal</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '10px' }}>
                <img src={currentEmp.photoUrl} alt={currentEmp.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <span style={{ fontWeight: 700, fontSize: '14px', display: 'block' }}>{currentEmp.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>EMP Code: {currentEmp.id} • {currentEmp.designation}</span>
                </div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Today's Punch Status:</span>
                <div style={{ marginTop: '6px' }}>
                  {empTodayRec ? (
                    <span className="badge badge-success" style={{ padding: '6px 12px', fontSize: '12px' }}>
                      <CheckCircle2 size={14} /> Checked-in at {empTodayRec.checkIn}
                    </span>
                  ) : (
                    <button className="btn btn-primary" style={{ width: '100%', padding: '10px' }} onClick={handleEmployeeClockIn}>
                      <Clock size={16} /> Punch Attendance Now
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Recent Attendance & Leave History</h3>
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Work Hours</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {empAttendanceLogs.slice(0, 5).map(log => (
                      <tr key={log.id}>
                        <td style={{ fontWeight: 600 }}>{log.date}</td>
                        <td>{log.checkIn || '-'}</td>
                        <td>{log.checkOut || '-'}</td>
                        <td>{log.workingHours ? `${log.workingHours} hrs` : '-'}</td>
                        <td>
                          <span className={`badge ${log.status === 'Present' ? 'badge-success' : log.status === 'Leave' ? 'badge-warning' : 'badge-danger'}`}>
                            {log.status}
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
      )}

      {/* ========================================================================= */}
      {/* 2. ACCOUNTANT DASHBOARD VIEW */}
      {/* ========================================================================= */}
      {activeRole === 'Accountant' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="grid-4">
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)' }}>
                <DollarSign size={28} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>Gross Payroll Liability</p>
                <h3 style={{ fontSize: '22px', fontWeight: 800, marginTop: '2px' }}>₹{grossSalaryCost.toLocaleString()}</h3>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--success-light)', color: 'var(--success)' }}>
                <CreditCard size={28} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>Net Bank Payout</p>
                <h3 style={{ fontSize: '22px', fontWeight: 800, marginTop: '2px', color: 'var(--success)' }}>₹{totalSalaryCost.toLocaleString()}</h3>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--warning-light)', color: 'var(--warning)' }}>
                <FileCheck size={28} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>PF & ESIC Challans</p>
                <h3 style={{ fontSize: '22px', fontWeight: 800, marginTop: '2px' }}>₹{(totalPfDeduction + totalEsicDeduction).toLocaleString()}</h3>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--accent-light)', color: 'var(--accent)' }}>
                <ShieldAlert size={28} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>TDS / Tax Deductions</p>
                <h3 style={{ fontSize: '22px', fontWeight: 800, marginTop: '2px' }}>₹{totalTdsDeduction.toLocaleString()}</h3>
              </div>
            </div>
          </div>

          {/* Statutory Breakdown Table for Accountant */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>August 2026 Statutory & Compliance Summary</h3>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Statutory Component</th>
                    <th>Statutory Rate</th>
                    <th>Total Deductions (₹)</th>
                    <th>Employer Share (₹)</th>
                    <th>Challan Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Employee Provident Fund (EPF)</td>
                    <td>12% of Basic</td>
                    <td style={{ fontWeight: 600 }}>₹{totalPfDeduction.toLocaleString()}</td>
                    <td style={{ fontWeight: 600 }}>₹{totalPfDeduction.toLocaleString()}</td>
                    <td><span className="badge badge-success">Ready for ECR Filing</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Employee State Insurance (ESIC)</td>
                    <td>0.75% / 3.25%</td>
                    <td style={{ fontWeight: 600 }}>₹{totalEsicDeduction.toLocaleString()}</td>
                    <td style={{ fontWeight: 600 }}>₹{(totalEsicDeduction * 4.33).toFixed(0)}</td>
                    <td><span className="badge badge-success">Monthly Return Prepared</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Professional Tax (PT - Gujarat)</td>
                    <td>Slab Based (₹200/mo)</td>
                    <td style={{ fontWeight: 600 }}>₹{totalPtDeduction.toLocaleString()}</td>
                    <td>-</td>
                    <td><span className="badge badge-success">Commercial Tax Form 5</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Income Tax TDS (Section 192)</td>
                    <td>As per New/Old Slab</td>
                    <td style={{ fontWeight: 600 }}>₹{totalTdsDeduction.toLocaleString()}</td>
                    <td>-</td>
                    <td><span className="badge badge-info">24Q Quarterly Schedule</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DEPARTMENT MANAGER DASHBOARD VIEW */}
      {/* ========================================================================= */}
      {activeRole === 'Department Manager' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="grid-4">
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)' }}>
                <Users size={28} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>Operations Team Roster</p>
                <h3 style={{ fontSize: '22px', fontWeight: 800, marginTop: '2px' }}>{teamEmployees.length} Employees</h3>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--success-light)', color: 'var(--success)' }}>
                <UserCheck size={28} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>Team Present Today</p>
                <h3 style={{ fontSize: '22px', fontWeight: 800, marginTop: '2px' }}>
                  {teamPresent} <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>/ {teamEmployees.length}</span>
                </h3>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--warning-light)', color: 'var(--warning)' }}>
                <CalendarCheck size={28} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>Pending Leave Approvals</p>
                <h3 style={{ fontSize: '22px', fontWeight: 800, marginTop: '2px', color: 'var(--warning)' }}>{teamPendingLeaves.length} Requests</h3>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--accent-light)', color: 'var(--accent)' }}>
                <Clock size={28} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>Team OT Logged</p>
                <h3 style={{ fontSize: '22px', fontWeight: 800, marginTop: '2px' }}>{totalOtHours} hrs</h3>
              </div>
            </div>
          </div>

          {/* Operations Team Roster Overview */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Operations Department Team Roster</h3>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Code</th>
                    <th>Designation</th>
                    <th>Location</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {teamEmployees.slice(0, 8).map(emp => (
                    <tr key={emp.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={emp.photoUrl} alt={emp.name} style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />
                          <span style={{ fontWeight: 600 }}>{emp.name}</span>
                        </div>
                      </td>
                      <td><span className="badge badge-info">{emp.id}</span></td>
                      <td>{emp.designation}</td>
                      <td>{emp.location}</td>
                      <td><span className="badge badge-success">{emp.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SUPER ADMIN, HR MANAGER & PAYROLL MANAGER DASHBOARD */}
      {/* ========================================================================= */}
      {(activeRole === 'Super Admin' || activeRole === 'HR Manager' || activeRole === 'Payroll Manager') && (
        <>
          {/* KPI Stats Grid */}
          <div className="grid-4">
            
            {/* Total Employees */}
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)' }}>
                <Users size={28} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>Total Employees</p>
                <h3 style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>{employees.length}</h3>
              </div>
            </div>

            {/* Present Today */}
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--success-light)', color: 'var(--success)' }}>
                <UserCheck size={28} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>Present Today</p>
                <h3 style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
                  {presentCount} <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>/ {activeEmployees.length}</span>
                </h3>
              </div>
            </div>

            {/* Leaves / Absent */}
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--warning-light)', color: 'var(--warning)' }}>
                <UserMinus size={28} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>On Leave / Absent</p>
                <h3 style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
                  {leaveCount} <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>LV</span>
                  <span style={{ fontSize: '16px', fontWeight: 500, color: 'var(--danger)', marginLeft: '12px' }}>{absentCount} ABS</span>
                </h3>
              </div>
            </div>

            {/* Monthly Payroll Cost */}
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--accent-light)', color: 'var(--accent)' }}>
                <DollarSign size={28} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>August Net Payout</p>
                <h3 style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
                  ₹{totalSalaryCost > 0 ? totalSalaryCost.toLocaleString() : '0.00'}
                </h3>
              </div>
            </div>

          </div>

          {/* Analytics & Charts section */}
          <div className="grid-2" style={{ gridTemplateColumns: '3fr 2fr' }}>
            
            {/* Attendance Trends */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Attendance Trends (7-Day Cycle)</h3>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--primary)' }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>Present / WFH</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--danger-light)' }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>Absent</span>
                  </div>
                </div>
              </div>
              
              {/* Custom SVG Bar Chart */}
              <div style={{ width: '100%', height: '220px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '10px 10px 30px 10px', borderBottom: '1px solid var(--border-color)', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: '70px', left: 0, right: 0, height: '1px', borderBottom: '1px dashed var(--border-color)', pointerEvents: 'none' }}></div>
                <div style={{ position: 'absolute', bottom: '130px', left: 0, right: 0, height: '1px', borderBottom: '1px dashed var(--border-color)', pointerEvents: 'none' }}></div>
                <div style={{ position: 'absolute', bottom: '190px', left: 0, right: 0, height: '1px', borderBottom: '1px dashed var(--border-color)', pointerEvents: 'none' }}></div>
                
                {weeklyTrendData.map((data, index) => {
                  const max = 60;
                  const presentHeight = (data.present / max) * 160;
                  const absentHeight = (data.absent / max) * 160;
                  
                  return (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexGrow: 1, height: '100%', justifyContent: 'flex-end' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '160px' }}>
                        <div style={{ 
                          width: '20px', 
                          height: `${Math.max(4, presentHeight)}px`, 
                          background: 'linear-gradient(to top, var(--primary) 0%, var(--accent) 100%)', 
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.5s ease'
                        }} title={`Present: ${data.present}`} />
                        <div style={{ 
                          width: '20px', 
                          height: `${Math.max(0, absentHeight)}px`, 
                          background: 'var(--danger-light)', 
                          border: '1px solid var(--danger)',
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.5s ease'
                        }} title={`Absent: ${data.absent}`} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{data.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Department Distribution */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Department Roster</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {deptData.map((dept, index) => {
                  const colors = ['var(--primary)', 'var(--accent)', 'var(--success)', 'var(--warning)', 'var(--danger)'];
                  const col = colors[index % colors.length];
                  const pct = (dept.count / employees.length) * 100;
                  
                  return (
                    <div key={index}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 600, fontSize: '13px' }}>{dept.name}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {dept.count} {dept.count === 1 ? 'employee' : 'employees'} ({Math.round(pct)}%)
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: col, borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Role Play Quick Actions and Integration status */}
          <div className="grid-2">
            
            {/* Quick Simulator Flow Map */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Role Flow Demonstration</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                Test the end-to-end HR and Payroll workflow in real-time by switching roles:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px' }}>1</div>
                  <div style={{ flexGrow: 1 }}>
                    <span style={{ fontWeight: 600 }}>Employee Clock-in & Leaves</span>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Apply for leaves or clock-in daily</p>
                  </div>
                  <span className="badge badge-info" style={{ cursor: 'pointer' }} onClick={() => setActiveRole('Employee')}>Switch to Employee</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px' }}>2</div>
                  <div style={{ flexGrow: 1 }}>
                    <span style={{ fontWeight: 600 }}>Manager Approval</span>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Approve leaves and manage shift schedules</p>
                  </div>
                  <span className="badge badge-success" style={{ cursor: 'pointer' }} onClick={() => setActiveRole('Department Manager')}>Switch to Manager</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--warning-light)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px' }}>3</div>
                  <div style={{ flexGrow: 1 }}>
                    <span style={{ fontWeight: 600 }}>HR Verification & Payroll Calc</span>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Verify records, setup taxes and process monthly payslip runs</p>
                  </div>
                  <span className="badge badge-warning" style={{ cursor: 'pointer' }} onClick={() => setActiveRole('HR Manager')}>Switch to HR</span>
                </div>

              </div>
            </div>

            {/* Integration Status Panel */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Active Gateways & Hardware</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                
                <div style={{ border: '1px solid var(--border-color)', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }}></div>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '12px', display: 'block' }}>Biometric RFID Device</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Connected (ZKTeco v8)</span>
                  </div>
                </div>

                <div style={{ border: '1px solid var(--border-color)', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }}></div>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '12px', display: 'block' }}>Bank Transfer API</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Connected (SBI / HDFC)</span>
                  </div>
                </div>

                <div style={{ border: '1px solid var(--border-color)', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }}></div>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '12px', display: 'block' }}>Email/SMS Gateway</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Connected (Twilio/WhatsApp)</span>
                  </div>
                </div>

                <div style={{ border: '1px solid var(--border-color)', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }}></div>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '12px', display: 'block' }}>Accounting Sync</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tally / ERP Online</span>
                  </div>
                </div>

              </div>
              
              <div style={{ background: 'var(--danger-light)', border: '1px solid var(--danger)', padding: '12px', borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <ShieldAlert size={20} color="var(--danger)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <span style={{ fontWeight: 600, color: 'var(--danger)', fontSize: '12px' }}>System Security: 2FA & Audit Active</span>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    All administrative operations and financial actions are strictly recorded in the immutable audit log.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </>
      )}
      
    </div>
  );
};

export default Dashboard;
