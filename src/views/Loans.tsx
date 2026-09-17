import React, { useState } from 'react';
import { useAppState, LoanRequest, Employee } from '../context/StateContext';
import { Landmark, ArrowUpRight, CheckSquare, XCircle, FileText, BadgeInfo, Receipt } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getPermissions, EMPLOYEE_PERSONA_ID } from '../utils/permissions';

export const Loans: React.FC = () => {
  const { loans, employees, activeRole, applyLoan, updateLoanStatus } = useAppState();
  const permissions = getPermissions(activeRole);

  const isEmployee = activeRole === 'Employee';
  const canApprove = permissions.loanAndAdvance === 'Full' || permissions.loanAndAdvance === 'Manage';
  const canApply = permissions.loanAndAdvance === 'Full' || permissions.loanAndAdvance === 'Manage' || permissions.loanAndAdvance === 'Request';

  const [empId, setEmpId] = useState(isEmployee ? EMPLOYEE_PERSONA_ID : '');
  const [loanType, setLoanType] = useState<'Loan' | 'Salary Advance'>('Salary Advance');
  const [amount, setAmount] = useState(1000);
  const [emis, setEmis] = useState(4);

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
    if (!empId || amount <= 0 || emis <= 0 || !canApply) return;

    const monthlyDeduction = Math.round(amount / emis);

    applyLoan({
      employeeId: empId,
      type: loanType,
      amount,
      emis,
      monthlyDeduction
    });

    alert('Application submitted successfully! HR & Management will review.');
  };

  const getEmployeeName = (id: string) => {
    return employees.find(e => e.id === id)?.name || id;
  };

  const handleApprove = (id: string) => {
    if (!canApprove) return;
    updateLoanStatus(id, 'Disbursed');
    confetti({ particleCount: 50, spread: 40 });
  };

  const handleReject = (id: string) => {
    if (!canApprove) return;
    updateLoanStatus(id, 'Rejected');
  };

  const scopedLoans = isEmployee ? loans.filter(l => l.employeeId === EMPLOYEE_PERSONA_ID || l.employeeId === 'EMP-005') : loans;
  const activeLoans = scopedLoans.filter(l => l.status === 'Disbursed');
  const pendingLoans = scopedLoans.filter(l => l.status === 'Pending');

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Loans & Salary Advances</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
          On-demand salary advances, corporate loans, and automated EMI recovery structures.
        </p>
      </div>

      {/* Grid */}
      <div className="grid-2">
        
        {/* Application Form */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Request Credit Advance</h3>
          
          <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Employee Persona</label>
              <select 
                value={empId} 
                onChange={(e) => setEmpId(e.target.value)}
                disabled={activeRole === 'Employee'}
              >
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.id})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Credit Type</label>
              <select value={loanType} onChange={(e) => setLoanType(e.target.value as any)}>
                <option value="Salary Advance">Salary Advance (Short Term recovery)</option>
                <option value="Loan">Long Term Personal Loan</option>
              </select>
            </div>

            <div className="grid-2">
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Requested Amount ($)</label>
                <input type="number" required value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Installments (Months)</label>
                <input type="number" required value={emis} onChange={(e) => setEmis(Number(e.target.value))} />
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: '10px', fontSize: '12px', border: '1px dashed var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Monthly Recovery (EMI):</span>
                <strong>${amount > 0 && emis > 0 ? Math.round(amount / emis) : 0} / mo</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Interest Rate:</span>
                <strong style={{ color: 'var(--success)' }}>0% (Corporate Benefit)</strong>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '12px', width: '100%', fontWeight: 700 }}>
              <Landmark size={16} /> Submit Credit Application
            </button>
          </form>
        </div>

        {/* Amortization and Approvals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Approval desk */}
          {canApprove && (
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Finance Review Desk</h3>
              
              {pendingLoans.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {pendingLoans.map(item => (
                    <div key={item.id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px', background: 'var(--bg-secondary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <strong style={{ display: 'block' }}>{getEmployeeName(item.employeeId)}</strong>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.employeeId} • Requested {item.appliedDate}</span>
                        </div>
                        <span className="badge badge-info">{item.type}</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', fontSize: '12px', margin: '12px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '8px 0' }}>
                        <div>
                          <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>Total Capital</span>
                          <strong>${item.amount}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>Tenure</span>
                          <strong>{item.emis} Months</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>Monthly EMI</span>
                          <strong>${item.monthlyDeduction}</strong>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)', padding: '6px 12px', fontSize: '12px' }} onClick={() => handleReject(item.id)}>
                          <XCircle size={14} /> Decline
                        </button>
                        <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleApprove(item.id)}>
                          <CheckSquare size={14} /> Approve & Disburse
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', padding: '16px' }}>
                  No pending loans requiring review.
                </p>
              )}
            </div>
          )}

          {/* Active Balance Tracker */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Active Repayment Ledgers</h3>
            
            {activeLoans.length > 0 ? (
              <div style={{ overflowX: 'auto', maxHeight: '250px' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Type</th>
                      <th>Total Loan</th>
                      <th>EMI Recovery</th>
                      <th>Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeLoans.map(item => (
                      <tr key={item.id}>
                        <td>
                          <span style={{ fontWeight: 600, display: 'block' }}>{getEmployeeName(item.employeeId)}</span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.employeeId}</span>
                        </td>
                        <td>{item.type}</td>
                        <td style={{ fontWeight: 600 }}>${item.amount}</td>
                        <td style={{ color: 'var(--danger)' }}>-${item.monthlyDeduction}/mo</td>
                        <td style={{ fontWeight: 800, color: 'var(--primary)' }}>
                          ${item.remainingBalance}
                          {item.remainingBalance <= 0 && <span className="badge badge-success" style={{ marginLeft: '8px', fontSize: '9px' }}>Recovered</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', padding: '16px' }}>
                No active loans in recovery mode.
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
