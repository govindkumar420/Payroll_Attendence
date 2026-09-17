import React, { useState, useEffect } from 'react';
import { useAppState, Employee, PayrollRecord } from '../context/StateContext';
import { BarChart3, FileSpreadsheet, Download, RefreshCw, FileText, CheckCircle, Printer } from 'lucide-react';
import { SalarySlip } from '../components/SalarySlip';
import { getPermissions, filterEmployeesByRole, EMPLOYEE_PERSONA_ID, MANAGER_DEPARTMENT } from '../utils/permissions';

export const Reports: React.FC = () => {
  const { employees, payroll, attendance, companyProfile, activeRole } = useAppState();
  const permissions = getPermissions(activeRole);
  const isEmployee = activeRole === 'Employee';

  // Determine allowed report tabs for this role
  const allowedTabs: Array<{ id: 'attendance' | 'payroll' | 'statutory' | 'bank'; label: string }> = [];

  if (activeRole === 'Super Admin') {
    allowedTabs.push(
      { id: 'attendance', label: 'Attendance Audit' },
      { id: 'payroll', label: 'Payroll Summary' },
      { id: 'statutory', label: 'PF / ESI / TDS' },
      { id: 'bank', label: 'Bank Transfer Log' }
    );
  } else if (activeRole === 'HR Manager') {
    allowedTabs.push(
      { id: 'attendance', label: 'HR Attendance Audit' },
      { id: 'statutory', label: 'PF / ESI Compliance' }
    );
  } else if (activeRole === 'Payroll Manager') {
    allowedTabs.push(
      { id: 'payroll', label: 'Payroll Summary' },
      { id: 'statutory', label: 'PF / ESI / TDS Reports' },
      { id: 'bank', label: 'Bank Transfer Payouts' }
    );
  } else if (activeRole === 'Department Manager') {
    allowedTabs.push(
      { id: 'attendance', label: 'Team Attendance Register' }
    );
  } else if (activeRole === 'Accountant') {
    allowedTabs.push(
      { id: 'payroll', label: 'Financial Payroll Summary' },
      { id: 'statutory', label: 'Tax & TDS Ledgers' },
      { id: 'bank', label: 'Bank Transfer Register' }
    );
  } else {
    // Employee
    allowedTabs.push(
      { id: 'attendance', label: 'My Attendance History' },
      { id: 'payroll', label: 'My Salary Records' }
    );
  }

  const [activeReportTab, setActiveReportTab] = useState<'attendance' | 'payroll' | 'statutory' | 'bank'>(allowedTabs[0]?.id || 'attendance');
  const [activePayslip, setActivePayslip] = useState<PayrollRecord | null>(null);

  // Auto reset tab when role changes
  useEffect(() => {
    if (!allowedTabs.some(t => t.id === activeReportTab)) {
      setActiveReportTab(allowedTabs[0]?.id || 'attendance');
    }
  }, [activeRole, activeReportTab]);

  const scopedEmployees = filterEmployeesByRole(employees, activeRole);

  const getEmployee = (id: string): Employee | undefined => {
    return employees.find(e => e.id === id);
  };

  const getEmployeeName = (id: string) => {
    return employees.find(e => e.id === id)?.name || id;
  };

  const getEmployeeBank = (id: string) => {
    const emp = employees.find(e => e.id === id);
    return emp ? `${emp.bankDetails.bankName} - ${emp.bankDetails.accountNumber}` : '-';
  };

  const getEmployeeIfsc = (id: string) => {
    return employees.find(e => e.id === id)?.bankDetails.ifscCode || '-';
  };

  const getEmployeeTaxIds = (id: string) => {
    const emp = employees.find(e => e.id === id);
    return emp ? `PAN: ${emp.panNumber} | Aadhaar: ${emp.aadhaarNumber}` : '-';
  };

  // Simulates downloading file
  const handleExport = (type: string) => {
    alert(`Report Exporter: Compiled and generated CSV file for ${type}_Report_August_2026.csv. Download starting...`);
  };

  const activePayrollRun = payroll.filter(p => {
    const matchesMonth = p.month === '2026-08' || p.month === '2024-06';
    const matchesRole = !isEmployee || p.employeeId === EMPLOYEE_PERSONA_ID || p.employeeId === 'EMP-005';
    return matchesMonth && matchesRole;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Reports & Statutory Audits</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Compile statutory accounts (PF/ESI/TDS), audit attendance registers, print salary slips, and download bank transfer ledgers.
          </p>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="glass" style={{ padding: '8px', display: 'flex', gap: '10px' }}>
        {allowedTabs.map(tab => (
          <button
            key={tab.id}
            className={`btn ${activeReportTab === tab.id ? 'btn-primary' : 'btn-outline'}`}
            style={{ flexGrow: 1, padding: '8px' }}
            onClick={() => setActiveReportTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Data card */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Card Header with Exporter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {activeReportTab} Statement
          </h3>

          <button className="btn btn-outline" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => handleExport(activeReportTab)}>
            <Download size={14} /> Export CSV Statement
          </button>
        </div>

        {/* Attendance Statement */}
        {activeReportTab === 'attendance' && (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Full Name</th>
                  <th>Present (Days)</th>
                  <th>Overtime</th>
                  <th>Absences</th>
                  <th>Approved Leaves</th>
                  <th>Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => {
                  const empAttendance = attendance.filter(a => a.employeeId === emp.id);
                  const presents = empAttendance.filter(a => a.status === 'Present').length;
                  const absences = empAttendance.filter(a => a.status === 'Absent').length;
                  const leaves = empAttendance.filter(a => a.status === 'Leave').length;
                  const ot = empAttendance.reduce((acc, curr) => acc + (curr.overtime || 0), 0);
                  const rate = empAttendance.length > 0 ? Math.round((presents / empAttendance.length) * 100) : 100;

                  return (
                    <tr key={emp.id}>
                      <td style={{ fontWeight: 600 }}>{emp.id}</td>
                      <td>{emp.name}</td>
                      <td>{presents} days</td>
                      <td style={{ fontWeight: 600 }}>{ot} hrs</td>
                      <td style={{ color: absences > 0 ? 'var(--danger)' : 'inherit' }}>{absences}</td>
                      <td>{leaves}</td>
                      <td style={{ fontWeight: 700, color: rate > 80 ? 'var(--success)' : 'var(--warning)' }}>{rate}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Payroll Summary */}
        {activeReportTab === 'payroll' && (
          <div style={{ overflowX: 'auto' }}>
            {activePayrollRun.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Employee Name</th>
                    <th>Basic Pay</th>
                    <th>Allowances</th>
                    <th>OT Pay</th>
                    <th>Gross Salary</th>
                    <th>Total Deduct.</th>
                    <th>Net Take-Home</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activePayrollRun.map(pay => {
                    const earns = pay.earnings;
                    const allow = (earns.hra || 0) + (earns.da || 0) + (earns.conveyance || 0) + (earns.medical || 0) + (earns.specialAllowance || 0) + (earns.otherAllowance || 0) + (earns.leaveEncashment || 0) + (earns.bonus || 0);

                    return (
                      <tr key={pay.id}>
                        <td style={{ fontWeight: 600 }}>{pay.employeeId}</td>
                        <td>{getEmployeeName(pay.employeeId)}</td>
                        <td>₹{earns.basic.toLocaleString()}</td>
                        <td>₹{allow.toLocaleString()}</td>
                        <td>₹{earns.overtime.toLocaleString()}</td>
                        <td style={{ fontWeight: 600 }}>₹{earns.grossSalary.toLocaleString()}</td>
                        <td style={{ color: 'var(--danger)' }}>-₹{pay.deductions.totalDeductions.toLocaleString()}</td>
                        <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{pay.netSalary.toLocaleString()}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            style={{ padding: '4px 10px', fontSize: '11px', gap: '4px', background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', color: '#ffffff' }}
                            onClick={() => setActivePayslip(pay)}
                            title="Print Salary Slip"
                          >
                            <Printer size={12} /> Print Slip
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                No payroll calculated. Calculate salaries in Payroll first.
              </p>
            )}
          </div>
        )}

        {/* Statutory Report */}
        {activeReportTab === 'statutory' && (
          <div style={{ overflowX: 'auto' }}>
            {activePayrollRun.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>PF (12%)</th>
                    <th>ESIC (0.75%)</th>
                    <th>PT (Prof. Tax)</th>
                    <th>LWF</th>
                    <th>Total Statutory</th>
                    <th>Tax / UAN Registration</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activePayrollRun.map(pay => {
                    const totalStat = pay.deductions.pf + pay.deductions.esi + pay.deductions.pt + (pay.deductions.lwf || 1);
                    return (
                      <tr key={pay.id}>
                        <td style={{ fontWeight: 600 }}>{pay.employeeId}</td>
                        <td>{getEmployeeName(pay.employeeId)}</td>
                        <td>₹{pay.deductions.pf.toLocaleString()}</td>
                        <td>₹{pay.deductions.esi.toLocaleString()}</td>
                        <td>₹{pay.deductions.pt.toLocaleString()}</td>
                        <td>₹{pay.deductions.lwf || 1}</td>
                        <td style={{ fontWeight: 700, color: 'var(--danger)' }}>₹{totalStat.toLocaleString()}</td>
                        <td style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{getEmployeeTaxIds(pay.employeeId)}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            style={{ padding: '4px 10px', fontSize: '11px', gap: '4px', background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', color: '#ffffff' }}
                            onClick={() => setActivePayslip(pay)}
                            title="Print Salary Slip"
                          >
                            <Printer size={12} /> Print Slip
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                No active statutory records.
              </p>
            )}
          </div>
        )}

        {/* Bank Transfer Log */}
        {activeReportTab === 'bank' && (
          <div style={{ overflowX: 'auto' }}>
            {activePayrollRun.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Emp ID</th>
                    <th>Beneficiary Name</th>
                    <th>Bank & Account Number</th>
                    <th>IFSC Code</th>
                    <th>Net Disbursal</th>
                    <th>Transfer Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activePayrollRun.map(pay => (
                    <tr key={pay.id}>
                      <td style={{ fontWeight: 600 }}>{pay.employeeId}</td>
                      <td>{getEmployeeName(pay.employeeId)}</td>
                      <td>{getEmployeeBank(pay.employeeId)}</td>
                      <td style={{ fontFamily: 'monospace' }}>{getEmployeeIfsc(pay.employeeId)}</td>
                      <td style={{ fontWeight: 800, color: 'var(--success)' }}>₹{pay.netSalary.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${pay.status === 'Disbursed' ? 'badge-success' : 'badge-warning'}`}>
                          {pay.status === 'Disbursed' ? 'Completed' : 'Draft Run / Pending'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-primary"
                          style={{ padding: '4px 10px', fontSize: '11px', gap: '4px', background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', color: '#ffffff' }}
                          onClick={() => setActivePayslip(pay)}
                          title="Print Salary Slip"
                        >
                          <Printer size={12} /> Print Slip
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                No active disbursement run matches selection.
              </p>
            )}
          </div>
        )}

      </div>

      {/* Salary Slip Modal */}
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
