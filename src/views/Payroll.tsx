import React, { useState } from 'react';
import { useAppState, Employee, PayrollRecord } from '../context/StateContext';
import { DollarSign, Cpu, FileText, CheckCircle, Sparkles, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SalarySlip } from '../components/SalarySlip';
import { getPermissions, EMPLOYEE_PERSONA_ID } from '../utils/permissions';

export const Payroll: React.FC = () => {
  const { 
    employees, 
    payroll, 
    activeRole, 
    companyProfile,
    processMonthlyPayroll, 
    approveMonthlyPayroll, 
    disburseMonthlyPayroll 
  } = useAppState();

  const permissions = getPermissions(activeRole);

  const [selectedMonth, setSelectedMonth] = useState('2024-06');
  const [activePayslip, setActivePayslip] = useState<PayrollRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');

  const canProcess = permissions.payrollCalculation === 'Full';
  const canApprove = permissions.payrollApproval;
  const canDisburse = permissions.bankTransfer;
  const isEmployee = activeRole === 'Employee';

  const availableLocations = Array.from(new Set(employees.map(e => e.location || 'Cold Jamnagar'))).filter(Boolean);

  const handleProcess = () => {
    if (!canProcess) return;
    processMonthlyPayroll(selectedMonth);
    confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } });
  };

  const handleApprove = () => {
    if (!canApprove) return;
    approveMonthlyPayroll(selectedMonth);
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
  };

  const handleDisburse = () => {
    if (!canDisburse) return;
    disburseMonthlyPayroll(selectedMonth);
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
  };

  const getEmployeeName = (id: string) => {
    return employees.find(e => e.id === id)?.name || id;
  };

  const getEmployee = (id: string): Employee | undefined => {
    return employees.find(e => e.id === id);
  };

  // Preview sample Riddhi Siddhi Slip directly
  const handleOpenSampleSlip = () => {
    const targetId = isEmployee ? EMPLOYEE_PERSONA_ID : '200050';
    const sampleRecord = payroll.find(p => p.employeeId === targetId && p.month === selectedMonth) || 
                         payroll.find(p => p.employeeId === targetId) || 
                         payroll[0];
    if (sampleRecord) {
      setActivePayslip(sampleRecord);
    }
  };

  const activePayrollRun = payroll.filter(p => {
    const matchesMonth = p.month === selectedMonth;
    const emp = getEmployee(p.employeeId);
    const matchesSearch = p.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          getEmployeeName(p.employeeId).toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (emp?.location && emp.location.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLocation = locationFilter === 'All' || emp?.location === locationFilter;
    const matchesRoleScope = !isEmployee || p.employeeId === EMPLOYEE_PERSONA_ID || p.employeeId === 'EMP-005';
    return matchesMonth && matchesSearch && matchesLocation && matchesRoleScope;
  });

  const totalRunForMonth = payroll.filter(p => p.month === selectedMonth);
  const runStatus = totalRunForMonth.length > 0 ? totalRunForMonth[0].status : 'Not Processed';

  const totalGrossCost = totalRunForMonth.reduce((sum, p) => sum + p.earnings.grossSalary, 0);
  const totalNetCost = totalRunForMonth.reduce((sum, p) => sum + p.netSalary, 0);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Payroll Center</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Execute monthly salary computations, deduct statutory taxes (PF, ESIC, PT, LWF), and issue official salary slips.
          </p>
        </div>

        {/* Quick Sample Preview Action */}
        <button 
          className="btn btn-primary" 
          style={{ background: 'linear-gradient(135deg, #2b7a9e 0%, #1b5a7a 100%)', boxShadow: '0 4px 14px rgba(27, 90, 122, 0.35)', gap: '8px' }}
          onClick={handleOpenSampleSlip}
        >
          <Printer size={16} /> Print Sample Salary Slip (Riddhi Siddhi Enterprises)
        </button>
      </div>

      {/* Control Panel Grid */}
      <div className="grid-3" style={{ gridTemplateColumns: '1.2fr 2fr 1fr' }}>
        
        {/* Run Selector */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '8px' }}>Payroll Processing</h3>
            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Select Target Month</label>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
              <button 
                type="button" 
                className={`btn ${selectedMonth === '2024-06' ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '11px', padding: '4px 10px' }}
                onClick={() => setSelectedMonth('2024-06')}
              >
                Jun-2024 (PDF Data)
              </button>
              <button 
                type="button" 
                className={`btn ${selectedMonth === '2026-08' ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '11px', padding: '4px 10px' }}
                onClick={() => setSelectedMonth('2026-08')}
              >
                Aug-2026 (Live)
              </button>
            </div>
            <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            <button 
              className="btn btn-primary" 
              onClick={handleProcess}
              disabled={!canProcess || runStatus === 'Disbursed'}
              style={{ padding: '12px' }}
            >
              <Cpu size={16} /> Fetch & Process Payroll
            </button>
            
            {runStatus === 'Draft' && (
              <button 
                className="btn btn-secondary" 
                onClick={handleApprove}
                disabled={!canApprove}
                style={{ padding: '12px', background: 'var(--warning)', color: 'black' }}
              >
                <CheckCircle size={16} /> Approve Payroll
              </button>
            )}

            {runStatus === 'Approved' && (
              <button 
                className="btn btn-secondary" 
                onClick={handleDisburse}
                disabled={!canDisburse}
                style={{ padding: '12px', background: 'var(--success)', color: 'white' }}
              >
                <DollarSign size={16} /> Disburse Salaries
              </button>
            )}
          </div>
        </div>

        {/* Current State Summary */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Roster Execution Summary</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Calculation State</span>
              <span style={{ 
                fontWeight: 800, 
                display: 'block', 
                fontSize: '16px',
                marginTop: '4px',
                color: runStatus === 'Disbursed' ? 'var(--success)' : runStatus === 'Approved' ? 'var(--warning)' : 'inherit'
              }}>
                {runStatus}
              </span>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Employees Processed</span>
              <span style={{ fontWeight: 800, display: 'block', fontSize: '16px', marginTop: '4px' }}>
                {activePayrollRun.length} / {employees.length}
              </span>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Gross Cost</span>
              <span style={{ fontWeight: 800, display: 'block', fontSize: '16px', marginTop: '4px' }}>
                ₹{totalGrossCost.toLocaleString()}
              </span>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Net Cost</span>
              <span style={{ fontWeight: 800, display: 'block', fontSize: '16px', marginTop: '4px', color: 'var(--primary)' }}>
                ₹{totalNetCost.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Statutory Compliance Summary */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800 }}>Statutory Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>EPF (12%):</span>
              <strong style={{ color: 'var(--success)' }}>Active (Compliant)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>ESIC (0.75%):</span>
              <strong style={{ color: 'var(--success)' }}>Active (Compliant)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Prof. Tax (PT ₹200):</span>
              <strong style={{ color: 'var(--success)' }}>Auto-Deducted</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>LWF (₹1 Standard):</span>
              <strong style={{ color: 'var(--success)' }}>Auto-Deducted</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Roster & Salaries Table */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Computed Salary Roster ({selectedMonth})</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Showing {activePayrollRun.length} of {totalRunForMonth.length} employee records</span>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="Search by Code (e.g. 200050) or Name..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '240px', padding: '6px 12px', fontSize: '13px' }}
            />
            <select 
              value={locationFilter} 
              onChange={(e) => setLocationFilter(e.target.value)}
              style={{ width: '180px', padding: '6px 12px', fontSize: '13px' }}
            >
              <option value="All">All Locations</option>
              {availableLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        {activePayrollRun.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Location</th>
                  <th>Attendance Info</th>
                  <th>OT (Hours)</th>
                  <th>Gross Earnings</th>
                  <th>Total Deductions</th>
                  <th>Net Salary</th>
                  <th>Status</th>
                  <th>Official Payslip</th>
                </tr>
              </thead>
              <tbody>
                {activePayrollRun.map((pay) => {
                  const emp = getEmployee(pay.employeeId);
                  return (
                    <tr key={pay.id}>
                      <td>
                        <span style={{ fontWeight: 600, display: 'block' }}>{getEmployeeName(pay.employeeId)}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Code: {pay.employeeId}</span>
                      </td>
                      <td style={{ fontSize: '12px' }}>{emp?.location || 'Pune Head Office'}</td>
                      <td style={{ fontSize: '12px' }}>
                        P: <strong>{pay.presentDays}</strong> | A: <strong style={{ color: pay.absentDays > 0 ? 'var(--danger)' : 'inherit' }}>{pay.absentDays}</strong> | L: <strong>{pay.leaveDays}</strong>
                      </td>
                      <td>{pay.overtimeHours} hrs</td>
                      <td style={{ fontWeight: 600 }}>₹{pay.earnings.grossSalary.toLocaleString()}</td>
                      <td style={{ color: 'var(--danger)', fontWeight: 500 }}>-₹{pay.deductions.totalDeductions.toLocaleString()}</td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{pay.netSalary.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${
                          pay.status === 'Disbursed' ? 'badge-success' : pay.status === 'Approved' ? 'badge-warning' : 'badge-info'
                        }`}>
                          {pay.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '6px 14px', fontSize: '12px', gap: '6px', background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', color: '#ffffff', fontWeight: 600, boxShadow: '0 2px 8px rgba(6, 182, 212, 0.3)' }} 
                          onClick={() => setActivePayslip(pay)}
                          title="Open & Print Salary Slip"
                        >
                          <Printer size={14} /> Print Salary Slip
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
            No payroll run found for {selectedMonth}. Click "Fetch & Process Payroll" above to compile.
          </p>
        )}
      </div>

      {/* Authentic Salary Slip Modal */}
      {activePayslip && (
        <div className="modal-overlay" onClick={() => setActivePayslip(null)}>
          <div onClick={(e) => e.stopPropagation()}>
            <SalarySlip
              payroll={activePayslip}
              employee={getEmployee(activePayslip.employeeId) || {
                id: activePayslip.employeeId,
                name: getEmployeeName(activePayslip.employeeId),
                photoUrl: '',
                mobileNumber: '',
                email: '',
                address: companyProfile.address,
                dob: '',
                gender: 'Male',
                department: 'Operations',
                designation: 'Floor Associate',
                joiningDate: '2023-07-17',
                location: 'Cold Jamnagar',
                employmentType: 'Full-Time',
                shiftId: 'S1',
                manager: '',
                salaryStructure: {
                  basic: activePayslip.earnings.basic,
                  hra: activePayslip.earnings.hra,
                  da: activePayslip.earnings.da,
                  conveyance: activePayslip.earnings.conveyance,
                  medical: activePayslip.earnings.medical,
                  specialAllowance: activePayslip.earnings.specialAllowance,
                  otherAllowance: activePayslip.earnings.otherAllowance || 0,
                  leaveEncashment: activePayslip.earnings.leaveEncashment || 0,
                  bonus: activePayslip.earnings.bonus,
                  incentive: activePayslip.earnings.incentive,
                  overtimeRate: 150
                },
                bankDetails: { bankName: 'Bank', accountNumber: '', ifscCode: '' },
                pfNumber: '101974247470',
                uanNumber: '101974247470',
                esiNumber: '',
                panNumber: '',
                aadhaarNumber: '',
                status: 'Active'
              }}
              companyName={companyProfile.name}
              companyAddress={companyProfile.address}
              onClose={() => setActivePayslip(null)}
            />
          </div>
        </div>
      )}

    </div>
  );
};

