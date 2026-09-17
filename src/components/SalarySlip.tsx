import React, { useRef } from 'react';
import { Employee, PayrollRecord } from '../context/StateContext';
import { Printer, Download, Mail, X, Check, Copy } from 'lucide-react';
import { CompanyLogo } from './CompanyLogo';

interface SalarySlipProps {
  payroll: PayrollRecord;
  employee: Employee;
  companyName?: string;
  companyAddress?: string;
  onClose?: () => void;
}

export const SalarySlip: React.FC<SalarySlipProps> = ({
  payroll,
  employee,
  companyName = 'RIDDHI SIDDHI ENTERPRISES',
  companyAddress = 'G - PLOT HIG MHADA COMPLEX-158, SANT TUKARAM NAGAR, PUNE MAHARASHTRA- 411018',
  onClose
}) => {
  const slipRef = useRef<HTMLDivElement>(null);

  // Month formatter: "2024-06" -> "Jun-2024"
  const formatMonth = (monthStr: string): string => {
    if (!monthStr) return 'Jun-2024';
    const parts = monthStr.split('-');
    if (parts.length === 2) {
      const year = parts[0];
      const monthIdx = parseInt(parts[1], 10) - 1;
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[monthIdx] || 'Jun'}-${year}`;
    }
    return monthStr;
  };

  // Date formatter: "2023-07-17" -> "17-Jul-23"
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '17-Jul-23';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[d.getMonth()];
      const year = String(d.getFullYear()).slice(-2);
      return `${day}-${month}-${year}`;
    } catch {
      return dateStr;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    alert(`Email Dispatch: Salary slip for ${formatMonth(payroll.month)} has been queued to ${employee.email || 'employee mailbox'}`);
  };

  const [copied, setCopied] = React.useState(false);
  const handleCopyText = () => {
    const text = `SALARY SLIP - ${companyName}\nMonth: ${formatMonth(payroll.month)}\nEmployee: ${employee.name} (${employee.id})\nGross: ₹${payroll.earnings.grossSalary}\nNet Pay: ₹${payroll.netSalary}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Extract / fallback numbers matching the salary slip format
  const earnings = payroll.earnings;
  const deductions = payroll.deductions;

  const basicVal = earnings.basic ?? 0;
  const hraVal = earnings.hra ?? 0;
  const otherAllowanceVal = (earnings.specialAllowance ?? 0) + (earnings.da ?? 0) + (earnings.conveyance ?? 0) + (earnings.medical ?? 0) + (earnings.otherAllowance ?? 0);
  const leaveEncashmentVal = earnings.leaveEncashment ?? 0;
  const bonusVal = earnings.bonus ?? 0;
  const otVal = earnings.overtime ?? 0;
  const grossVal = earnings.grossSalary ?? (basicVal + hraVal + otherAllowanceVal + leaveEncashmentVal + bonusVal + otVal);

  const pfVal = deductions.pf ?? 0;
  const esicVal = deductions.esi ?? 0;
  const ptVal = deductions.pt ?? 0;
  const lwfVal = deductions.lwf ?? 1;
  const otherDeductionVal = deductions.otherDeduction ?? deductions.latePenalty ?? 0;
  const advanceVal = deductions.advance ?? deductions.loanEmi ?? 0;
  const totalDeductionsVal = deductions.totalDeductions ?? (pfVal + esicVal + ptVal + lwfVal + otherDeductionVal + advanceVal);

  const netPaymentVal = payroll.netSalary ?? (grossVal - totalDeductionsVal);
  const paymentMode = payroll.paymentMode || 'BY BANK';

  const totalDays = payroll.totalDays ?? 30;
  const presentDays = payroll.presentDays ?? 30;
  const leaveDays = payroll.leaveDays ?? 0;

  return (
    <div className="salary-slip-modal-wrapper">
      {/* Modal Actions Bar (hidden in print) */}
      <div className="no-print salary-slip-action-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Official Salary Slip Preview:
          </span>
          <span className="badge badge-success" style={{ fontSize: '11px' }}>
            {formatMonth(payroll.month)}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button className="btn btn-outline" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={handleCopyText}>
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy Summary'}
          </button>
          <button className="btn btn-outline" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={handleEmail}>
            <Mail size={14} /> Email
          </button>
          <button className="btn btn-primary" style={{ fontSize: '12px', padding: '6px 14px' }} onClick={handlePrint}>
            <Printer size={14} /> Print / Save PDF
          </button>
          {onClose && (
            <button 
              className="btn btn-secondary" 
              style={{ padding: '6px', borderRadius: '50%', width: '30px', height: '30px' }} 
              onClick={onClose}
              title="Close"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Printable Sheet Container */}
      <div className="salary-slip-page" ref={slipRef}>
        <div className="salary-slip-box">
          
          {/* Header Section */}
          <div className="salary-slip-header">
            {/* Logo Emblem */}
            <div className="salary-slip-logo-wrapper">
              <CompanyLogo size="xl" />
            </div>

            {/* Header Text */}
            <div className="salary-slip-company-info">
              <h1 className="company-title">{companyName}</h1>
              <p className="company-address">{companyAddress}</p>
              <h2 className="payslip-month-title">
                Payslip for the Month of – {formatMonth(payroll.month)}
              </h2>
            </div>
          </div>

          {/* Employee Information 4-Column Grid Table */}
          <table className="slip-table emp-info-table">
            <tbody>
              <tr>
                <td className="field-label" style={{ width: '20%' }}>Employee Code:</td>
                <td className="field-value" style={{ width: '30%' }}>{employee.id || '200050'}</td>
                <td className="field-label" style={{ width: '22%' }}>Location</td>
                <td className="field-value" style={{ width: '28%' }}>{employee.location || 'Cold Jamnagar'}</td>
              </tr>
              <tr>
                <td className="field-label">Employee Name:</td>
                <td className="field-value">{employee.name || 'Vaghela Pushprajsinh'}</td>
                <td className="field-label">Designation:</td>
                <td className="field-value">{employee.designation || 'Floor Associate'}</td>
              </tr>
              <tr>
                <td className="field-label">Date of Joining:</td>
                <td className="field-value">{formatDate(employee.joiningDate || '2023-07-17')}</td>
                <td className="field-label">ESIC No.:</td>
                <td className="field-value">{employee.esiNumber || employee.esicNumber || ''}</td>
              </tr>
              <tr>
                <td className="field-label">UAN No:</td>
                <td className="field-value">{employee.uanNumber || employee.pfNumber || '101974247470'}</td>
                <td className="field-label">Total Days:</td>
                <td className="field-value">{totalDays}</td>
              </tr>
              <tr>
                <td className="field-label">Present Days:</td>
                <td className="field-value">{presentDays}</td>
                <td className="field-label">Leave:</td>
                <td className="field-value">{leaveDays}</td>
              </tr>
            </tbody>
          </table>

          {/* Earnings & Deductions 4-Column Table */}
          <table className="slip-table earnings-deductions-table">
            <thead>
              <tr>
                <th style={{ width: '28%' }}>Earning</th>
                <th style={{ width: '22%' }}>Amount</th>
                <th style={{ width: '28%' }}>Deduction</th>
                <th style={{ width: '22%' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Basic</td>
                <td className="num-cell">{basicVal > 0 ? basicVal : '0'}</td>
                <td>PF</td>
                <td className="num-cell">{pfVal > 0 ? pfVal : '0'}</td>
              </tr>
              <tr>
                <td>House Rent Allowance</td>
                <td className="num-cell">{hraVal > 0 ? hraVal : '0'}</td>
                <td>ESIC</td>
                <td className="num-cell">{esicVal > 0 ? esicVal : '0'}</td>
              </tr>
              <tr>
                <td>Other Allowance</td>
                <td className="num-cell">{otherAllowanceVal > 0 ? otherAllowanceVal : '0'}</td>
                <td>PT</td>
                <td className="num-cell">{ptVal > 0 ? ptVal : '0'}</td>
              </tr>
              <tr>
                <td>Leave Encashment</td>
                <td className="num-cell">{leaveEncashmentVal > 0 ? leaveEncashmentVal : '0'}</td>
                <td>LWF</td>
                <td className="num-cell">{lwfVal > 0 ? lwfVal : '0'}</td>
              </tr>
              <tr>
                <td>Bonus</td>
                <td className="num-cell">{bonusVal > 0 ? bonusVal : '0'}</td>
                <td>Other Deduction</td>
                <td className="num-cell">{otherDeductionVal > 0 ? otherDeductionVal : ''}</td>
              </tr>
              <tr>
                <td>OT</td>
                <td className="num-cell">{otVal > 0 ? otVal : '0'}</td>
                <td>Advance</td>
                <td className="num-cell">{advanceVal > 0 ? advanceVal : ''}</td>
              </tr>
              {/* Summary Rows */}
              <tr className="summary-row">
                <td className="bold-label">Gross Earning</td>
                <td className="num-cell bold-val">{grossVal}</td>
                <td className="bold-label">Total Deduction</td>
                <td className="num-cell bold-val">{totalDeductionsVal}</td>
              </tr>
              <tr className="net-row">
                <td className="bold-label">Net Payment</td>
                <td className="num-cell bold-val">{netPaymentVal}</td>
                <td className="bold-label text-center" colSpan={1}>{paymentMode}</td>
                <td></td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
};
