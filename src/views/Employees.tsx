import React, { useState } from 'react';
import { useAppState, Employee, Shift, PayrollRecord } from '../context/StateContext';
import { 
  Search, 
  UserPlus, 
  Trash2, 
  Lock, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Eye, 
  X, 
  Printer, 
  List, 
  LayoutGrid, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Building2, 
  FileSpreadsheet,
  CheckCircle2,
  Briefcase,
  ShieldCheck,
  Landmark
} from 'lucide-react';
import { SalarySlip } from '../components/SalarySlip';
import { getPermissions, filterEmployeesByRole, EMPLOYEE_PERSONA_ID, MANAGER_DEPARTMENT } from '../utils/permissions';

export const Employees: React.FC = () => {
  const { 
    employees, 
    shifts, 
    activeRole, 
    onboardEmployee, 
    getNextEmpCode, 
    deleteEmployee, 
    payroll, 
    companyProfile 
  } = useAppState();
  
  const permissions = getPermissions(activeRole);
  const canModify = permissions.employeeManagement === 'Full';
  const canViewSalary = permissions.salaryStructure !== 'None';
  const canPrintSlipFor = (targetEmpId: string) => 
    permissions.payslip === 'All' || 
    permissions.payslip === 'View' || 
    (permissions.payslip === 'Own' && (targetEmpId === EMPLOYEE_PERSONA_ID || targetEmpId === 'EMP-005'));

  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'rows' | 'cards'>('rows');
  const [expandedEmpIds, setExpandedEmpIds] = useState<Set<string>>(new Set());
  
  const [showModal, setShowModal] = useState(false);
  const [viewDetailsEmp, setViewDetailsEmp] = useState<Employee | null>(null);
  const [activeSlip, setActiveSlip] = useState<{ record: PayrollRecord; employee: Employee } | null>(null);

  // Scoped employees based on RBAC authority
  const accessibleEmployees = filterEmployeesByRole(employees, activeRole);

  // Extract unique locations and departments from accessible roster
  const availableLocations = Array.from(new Set(accessibleEmployees.map(e => e.location || 'Cold Jamnagar'))).filter(Boolean);
  const availableDepartments = Array.from(new Set(accessibleEmployees.map(e => e.department))).filter(Boolean);

  // Filtered employees
  const filteredEmployees = accessibleEmployees.filter(emp => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = emp.name.toLowerCase().includes(term) || 
                          emp.id.toLowerCase().includes(term) ||
                          emp.designation.toLowerCase().includes(term) ||
                          (emp.location && emp.location.toLowerCase().includes(term)) ||
                          (emp.uanNumber && emp.uanNumber.toLowerCase().includes(term)) ||
                          (emp.mobileNumber && emp.mobileNumber.toLowerCase().includes(term));
    const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
    const matchesLocation = locationFilter === 'All' || emp.location === locationFilter;
    return matchesSearch && matchesDept && matchesLocation;
  });

  const toggleExpand = (id: string) => {
    setExpandedEmpIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleExpandAll = () => {
    if (expandedEmpIds.size === filteredEmployees.length) {
      setExpandedEmpIds(new Set());
    } else {
      setExpandedEmpIds(new Set(filteredEmployees.map(e => e.id)));
    }
  };

  const handlePrintSlip = (emp: Employee) => {
    const existing = payroll.find(p => p.employeeId === emp.id);
    const mockRecord: PayrollRecord = existing || {
      id: `PAY-${emp.id}-2024-06`,
      employeeId: emp.id,
      month: '2024-06',
      totalDays: 30,
      presentDays: 30,
      absentDays: 0,
      leaveDays: 0,
      overtimeHours: 10,
      earnings: {
        basic: emp.salaryStructure.basic,
        hra: emp.salaryStructure.hra,
        da: emp.salaryStructure.da || 0,
        conveyance: emp.salaryStructure.conveyance || 0,
        medical: emp.salaryStructure.medical || 0,
        specialAllowance: emp.salaryStructure.specialAllowance || 0,
        otherAllowance: emp.salaryStructure.otherAllowance || 0,
        leaveEncashment: emp.salaryStructure.leaveEncashment || 662,
        bonus: emp.salaryStructure.bonus || 955,
        incentive: emp.salaryStructure.incentive || 0,
        overtime: (emp.salaryStructure.overtimeRate || 150) * 10,
        grossSalary: (emp.salaryStructure.basic + emp.salaryStructure.hra + (emp.salaryStructure.otherAllowance || 0) + (emp.salaryStructure.leaveEncashment || 662) + (emp.salaryStructure.bonus || 955) + ((emp.salaryStructure.overtimeRate || 150) * 10))
      },
      deductions: {
        pf: Math.round(emp.salaryStructure.basic * 0.12),
        esi: 0,
        pt: 200,
        tds: 0,
        advance: 0,
        loanEmi: 0,
        latePenalty: 0,
        leaveDeduction: 0,
        lwf: 1,
        otherDeduction: 0,
        totalDeductions: Math.round(emp.salaryStructure.basic * 0.12) + 200 + 1
      },
      netSalary: (emp.salaryStructure.basic + emp.salaryStructure.hra + (emp.salaryStructure.otherAllowance || 0) + (emp.salaryStructure.leaveEncashment || 662) + (emp.salaryStructure.bonus || 955) + ((emp.salaryStructure.overtimeRate || 150) * 10)) - (Math.round(emp.salaryStructure.basic * 0.12) + 200 + 1),
      paymentMode: 'BY BANK',
      status: 'Approved'
    };

    setActiveSlip({ record: mockRecord, employee: emp });
  };
  
  // Form State
  const [empCode, setEmpCode] = useState('');
  const [name, setName] = useState('');
  const [photoUrl] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('G - PLOT HIG MHADA COMPLEX-158, SANT TUKARAM NAGAR, PUNE MAHARASHTRA- 411018');
  const [location, setLocation] = useState('Cold Jamnagar');
  const [dob, setDob] = useState('1995-01-01');
  const [gender, setGender] = useState('Male');
  const [department, setDepartment] = useState('Operations');
  const [designation, setDesignation] = useState('Floor Associate');
  const [joiningDate, setJoiningDate] = useState('2024-06-01');
  const [employmentType, setEmploymentType] = useState<'Full-Time' | 'Part-Time' | 'Contract' | 'Intern'>('Full-Time');
  const [shiftId, setShiftId] = useState('S1');
  const [manager, setManager] = useState('Sarah Connor');
  
  // Salary
  const [basic, setBasic] = useState(11166);
  const [hra, setHra] = useState(0);
  const [da, setDa] = useState(0);
  const [conveyance, setConveyance] = useState(0);
  const [medical, setMedical] = useState(0);
  const [specialAllowance, setSpecialAllowance] = useState(0);
  const [otherAllowance, setOtherAllowance] = useState(0);
  const [leaveEncashment, setLeaveEncashment] = useState(662);
  const [bonus, setBonus] = useState(955);
  const [incentive, setIncentive] = useState(0);
  const [overtimeRate, setOvertimeRate] = useState(150);
  
  // Bank & Tax
  const [bankName, setBankName] = useState('State Bank of India');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('SBIN0001234');
  const [pfNumber, setPfNumber] = useState('');
  const [uanNumber, setUanNumber] = useState('');
  const [esiNumber, setEsiNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');

  const handleOpenOnboardModal = () => {
    const nextCode = getNextEmpCode('200');
    setEmpCode(nextCode);
    setShowModal(true);
  };

  const handleRegenerateCode = (prefix: string = '200') => {
    const nextCode = getNextEmpCode(prefix);
    setEmpCode(nextCode);
  };

  const handleExportCSV = () => {
    const headers = [
      'Emp Code',
      'Full Name',
      'Designation',
      'Department',
      'Location',
      'Employment Type',
      'Joining Date',
      'Basic Salary',
      'HRA',
      'Other Allowance',
      'Leave Encashment',
      'Bonus',
      'OT Rate/Hr',
      'Bank Name',
      'Account Number',
      'IFSC Code',
      'UAN Number',
      'ESIC Number',
      'PAN Number',
      'Aadhaar Number',
      'Mobile Number',
      'Email',
      'Address',
      'Status'
    ];

    const rows = filteredEmployees.map(emp => [
      `"${emp.id}"`,
      `"${emp.name}"`,
      `"${emp.designation}"`,
      `"${emp.department}"`,
      `"${emp.location || 'Cold Jamnagar'}"`,
      `"${emp.employmentType}"`,
      `"${emp.joiningDate}"`,
      emp.salaryStructure.basic,
      emp.salaryStructure.hra,
      emp.salaryStructure.otherAllowance || 0,
      emp.salaryStructure.leaveEncashment || 0,
      emp.salaryStructure.bonus,
      emp.salaryStructure.overtimeRate,
      `"${emp.bankDetails.bankName}"`,
      `"${emp.bankDetails.accountNumber}"`,
      `"${emp.bankDetails.ifscCode}"`,
      `"${emp.uanNumber || emp.pfNumber || ''}"`,
      `"${emp.esiNumber || emp.esicNumber || ''}"`,
      `"${emp.panNumber}"`,
      `"${emp.aadhaarNumber}"`,
      `"${emp.mobileNumber}"`,
      `"${emp.email}"`,
      `"${(emp.address || '').replace(/"/g, '""')}"`,
      `"${emp.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Riddhi_Siddhi_Employees_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canModify) return;

    onboardEmployee({
      id: empCode || getNextEmpCode('200'),
      name,
      photoUrl,
      mobileNumber,
      email: email || `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@riddhisiddhi.com`,
      address,
      location,
      dob,
      gender,
      department,
      designation,
      joiningDate,
      employmentType,
      shiftId,
      manager,
      salaryStructure: {
        basic: Number(basic),
        hra: Number(hra),
        da: Number(da),
        conveyance: Number(conveyance),
        medical: Number(medical),
        specialAllowance: Number(specialAllowance),
        otherAllowance: Number(otherAllowance),
        leaveEncashment: Number(leaveEncashment),
        bonus: Number(bonus),
        incentive: Number(incentive),
        overtimeRate: Number(overtimeRate)
      },
      bankDetails: {
        bankName,
        accountNumber: accountNumber || `3098${Math.floor(Math.random() * 90000000 + 10000000)}`,
        ifscCode
      },
      pfNumber: pfNumber || uanNumber || `1019${Math.floor(Math.random() * 90000000 + 10000000)}`,
      uanNumber: uanNumber || pfNumber || '',
      esiNumber: esiNumber || '',
      esicNumber: esiNumber || '',
      panNumber: panNumber || `ABCDE${Math.floor(Math.random() * 9000 + 1000)}F`,
      aadhaarNumber: aadhaarNumber || `1234-${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      status: 'Active'
    });

    // Reset Form
    setName('');
    setMobileNumber('');
    setEmail('');
    setAccountNumber('');
    setShowModal(false);
  };

  const getShift = (sId: string): Shift | undefined => {
    return shifts.find(s => s.id === sId);
  };

  const getShiftName = (sId: string) => {
    const s = getShift(sId);
    return s ? `${s.name} (${s.startTime} - ${s.endTime})` : 'Default Shift';
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Panel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Employee Directory</h2>
            <span className="badge badge-success" style={{ fontWeight: 700, padding: '4px 10px', fontSize: '12px' }}>
              {employees.length} Active Employees
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Manage Riddhi Siddhi Enterprises roster, salary structures, statutory accounts, and locations in rows and tables.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-outline" 
            onClick={handleExportCSV}
            style={{ fontSize: '13px', gap: '6px' }}
            title="Download complete employee dataset as CSV"
          >
            <Download size={16} />
            Export CSV ({filteredEmployees.length})
          </button>

          {canModify ? (
            <button className="btn btn-primary" onClick={handleOpenOnboardModal} style={{ fontSize: '13px', gap: '6px' }}>
              <UserPlus size={16} />
              Onboard New Employee
            </button>
          ) : (
            <div className="badge badge-warning" style={{ gap: '6px', padding: '6px 12px' }}>
              <Lock size={14} />
              HR Read-Only Mode
            </div>
          )}
        </div>
      </div>

      {/* Filter and View Control Bar */}
      <div className="glass" style={{ padding: '16px 20px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flexGrow: 1, alignItems: 'center' }}>
          
          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '280px', flexGrow: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by Code (e.g. 200050), Name, Location, UAN, Phone..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '40px', fontSize: '13px' }}
            />
          </div>
          
          {/* Location Filter */}
          <div style={{ width: '190px' }}>
            <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} style={{ fontSize: '13px' }}>
              <option value="All">All Locations ({employees.length})</option>
              {availableLocations.map(loc => (
                <option key={loc} value={loc}>
                  {loc} ({employees.filter(e => e.location === loc).length})
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div style={{ width: '180px' }}>
            <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} style={{ fontSize: '13px' }}>
              <option value="All">All Departments ({employees.length})</option>
              {availableDepartments.map(dept => (
                <option key={dept} value={dept}>
                  {dept} ({employees.filter(e => e.department === dept).length})
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* View Switcher & Expand/Collapse Toggle */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {viewMode === 'rows' && (
            <button 
              className="btn btn-outline" 
              style={{ fontSize: '12px', padding: '6px 10px', height: '38px' }}
              onClick={toggleExpandAll}
              title="Expand/Collapse all row details"
            >
              {expandedEmpIds.size === filteredEmployees.length && filteredEmployees.length > 0 ? (
                <>
                  <ChevronUp size={14} /> Collapse All
                </>
              ) : (
                <>
                  <ChevronDown size={14} /> Expand All
                </>
              )}
            </button>
          )}

          <div style={{ 
            display: 'flex', 
            background: 'var(--bg-secondary)', 
            padding: '3px', 
            borderRadius: '10px', 
            border: '1px solid var(--border-color-solid)' 
          }}>
            <button 
              type="button"
              onClick={() => setViewMode('rows')}
              className={`btn ${viewMode === 'rows' ? 'btn-primary' : 'btn-outline'}`}
              style={{ 
                padding: '6px 12px', 
                fontSize: '12px', 
                border: 'none', 
                borderRadius: '8px',
                gap: '6px',
                background: viewMode === 'rows' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'rows' ? '#ffffff' : 'var(--text-secondary)'
              }}
              title="View all details in full rows and columns"
            >
              <List size={15} />
              Rows View
            </button>
            <button 
              type="button"
              onClick={() => setViewMode('cards')}
              className={`btn ${viewMode === 'cards' ? 'btn-primary' : 'btn-outline'}`}
              style={{ 
                padding: '6px 12px', 
                fontSize: '12px', 
                border: 'none', 
                borderRadius: '8px',
                gap: '6px',
                background: viewMode === 'cards' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'cards' ? '#ffffff' : 'var(--text-secondary)'
              }}
              title="View employees as cards"
            >
              <LayoutGrid size={15} />
              Cards View
            </button>
          </div>
        </div>

      </div>

      {/* Main Content Area */}
      {filteredEmployees.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
          <FileSpreadsheet size={48} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>No Employee Records Found</h3>
          <p style={{ fontSize: '13px' }}>Try adjusting your search keyword, location, or department filters.</p>
        </div>
      ) : viewMode === 'rows' ? (
        
        /* ============================================================
           DETAILED ROWS / TABLE VIEW (ALL DETAILS IN ROWS)
           ============================================================ */
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Active Roster Data Matrix
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '10px' }}>
                Displaying {filteredEmployees.length} employee records with complete salary, bank & statutory credentials
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Tip: Click any row or the chevron icon (▾) to reveal full inline details.
            </div>
          </div>

          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ margin: 0, width: '100%', minWidth: '1150px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)' }}>
                  <th style={{ width: '45px', textAlign: 'center', padding: '12px 8px' }}>#</th>
                  <th style={{ width: '110px' }}>Emp Code</th>
                  <th style={{ minWidth: '220px' }}>Employee & Role</th>
                  <th style={{ minWidth: '150px' }}>Location & Dept</th>
                  <th style={{ minWidth: '130px' }}>Joining Date</th>
                  <th style={{ minWidth: '150px' }}>Salary Structure</th>
                  <th style={{ minWidth: '170px' }}>Bank & UAN Details</th>
                  <th style={{ minWidth: '150px' }}>Contact Info</th>
                  <th style={{ width: '90px', textAlign: 'center' }}>Status</th>
                  <th style={{ minWidth: '180px', textAlign: 'right', paddingRight: '20px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => {
                  const isExpanded = expandedEmpIds.has(emp.id);
                  const grossPay = emp.salaryStructure.basic + 
                                   emp.salaryStructure.hra + 
                                   (emp.salaryStructure.otherAllowance || 0) + 
                                   (emp.salaryStructure.leaveEncashment || 0) + 
                                   (emp.salaryStructure.bonus || 0);

                  return (
                    <React.Fragment key={emp.id}>
                      {/* Main Table Row */}
                      <tr 
                        style={{ 
                          cursor: 'pointer',
                          backgroundColor: isExpanded ? 'var(--primary-light)' : undefined,
                          transition: 'background-color 0.15s ease'
                        }}
                        onClick={() => toggleExpand(emp.id)}
                      >
                        {/* Index / Expand Chevron */}
                        <td style={{ textAlign: 'center', padding: '12px 8px' }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(emp.id);
                            }}
                            style={{ 
                              background: 'transparent', 
                              border: 'none', 
                              cursor: 'pointer', 
                              color: isExpanded ? 'var(--primary)' : 'var(--text-muted)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto'
                            }}
                            title={isExpanded ? 'Collapse Row' : 'Expand Row Details'}
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </td>

                        {/* Employee Code Badge */}
                        <td>
                          <span style={{ 
                            fontFamily: 'monospace', 
                            fontWeight: 800, 
                            fontSize: '12px', 
                            background: 'var(--primary-light)', 
                            color: 'var(--primary)', 
                            padding: '3px 8px', 
                            borderRadius: '6px',
                            border: '1px solid var(--primary)',
                            display: 'inline-block'
                          }}>
                            #{emp.id}
                          </span>
                        </td>

                        {/* Employee Name + Photo + Designation */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img 
                              src={emp.photoUrl} 
                              alt={emp.name} 
                              style={{ 
                                width: '38px', 
                                height: '38px', 
                                borderRadius: '10px', 
                                objectFit: 'cover', 
                                background: 'var(--border-color)',
                                flexShrink: 0
                              }}
                            />
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                                {emp.name}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                <span style={{ color: 'var(--primary)', fontSize: '11px', fontWeight: 600 }}>
                                  {emp.designation}
                                </span>
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>• {emp.employmentType}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Location & Department */}
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600 }}>
                              <MapPin size={12} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                              <span>{emp.location || 'Cold Jamnagar'}</span>
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              {emp.department}
                            </span>
                          </div>
                        </td>

                        {/* Joining Date & Shift */}
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-primary)' }}>
                              <Calendar size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                              <span style={{ fontWeight: 500 }}>{emp.joiningDate}</span>
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              {getShift(emp.shiftId)?.name || 'General Shift'}
                            </span>
                          </div>
                        </td>

                        {/* Salary Structure */}
                        <td>
                          {canViewSalary ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                                ₹{emp.salaryStructure.basic.toLocaleString()} <span style={{ fontSize: '10px', fontWeight: 500, color: 'var(--text-muted)' }}>Basic</span>
                              </span>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                Gross: ₹{grossPay.toLocaleString()} | OT: ₹{emp.salaryStructure.overtimeRate}/h
                              </span>
                            </div>
                          ) : (
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Lock size={12} /> Confidential
                            </div>
                          )}
                        </td>

                        {/* Bank & UAN Details */}
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Landmark size={11} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{emp.bankDetails.bankName.slice(0, 18)}</span>
                            </div>
                            <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                              UAN: {emp.uanNumber || emp.pfNumber || 'N/A'}
                            </span>
                          </div>
                        </td>

                        {/* Contact Info */}
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                              <Phone size={11} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                              <span>{emp.mobileNumber || '+91 9876543210'}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                              <Mail size={11} style={{ flexShrink: 0 }} />
                              <span style={{ maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {emp.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td style={{ textAlign: 'center' }}>
                          <span className={`badge ${emp.status === 'Active' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '10px', padding: '3px 7px' }}>
                            {emp.status}
                          </span>
                        </td>

                        {/* Action Buttons */}
                        <td style={{ paddingRight: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                            <button 
                              className="btn btn-outline" 
                              style={{ padding: '5px 8px', fontSize: '11px', gap: '4px' }}
                              onClick={() => setViewDetailsEmp(emp)}
                              title="View Full Profile Modal"
                            >
                              <Eye size={13} />
                              Profile
                            </button>

                            {canPrintSlipFor(emp.id) && (
                              <button 
                                className="btn btn-primary" 
                                style={{ 
                                  padding: '5px 9px', 
                                  fontSize: '11px', 
                                  gap: '4px', 
                                  background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', 
                                  color: '#ffffff', 
                                  fontWeight: 600 
                                }}
                                onClick={() => handlePrintSlip(emp)}
                                title="Print Monthly Salary Slip"
                              >
                                <Printer size={13} />
                                Slip
                              </button>
                            )}

                            {canModify && (
                              <button 
                                className="btn btn-outline" 
                                style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)', padding: '5px 7px' }}
                                onClick={() => {
                                  if (confirm(`Are you sure you want to terminate ${emp.name} (Code: ${emp.id})?`)) {
                                    deleteEmployee(emp.id);
                                  }
                                }}
                                title="Terminate Employee"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Full-Detail Row Panel */}
                      {isExpanded && (
                        <tr style={{ background: 'var(--bg-surface)' }}>
                          <td colSpan={10} style={{ padding: '16px 24px', borderBottom: '2px solid var(--primary)' }}>
                            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              
                              {/* Expanded Row Header */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <ShieldCheck size={18} style={{ color: 'var(--primary)' }} />
                                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary)' }}>
                                    Comprehensive Master Records for {emp.name} (#{emp.id})
                                  </span>
                                  <span className="badge badge-info" style={{ fontSize: '10px' }}>
                                    {emp.employmentType}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button 
                                    className="btn btn-primary" 
                                    style={{ fontSize: '11px', padding: '4px 10px', gap: '4px' }}
                                    onClick={() => handlePrintSlip(emp)}
                                  >
                                    <Printer size={12} /> Print Official Payslip
                                  </button>
                                  <button 
                                    className="btn btn-secondary" 
                                    style={{ fontSize: '11px', padding: '4px 10px', gap: '4px' }}
                                    onClick={() => setViewDetailsEmp(emp)}
                                  >
                                    <Eye size={12} /> Full Modal Drawer
                                  </button>
                                </div>
                              </div>

                              {/* 4-Panel Detailed Grid */}
                              <div className="grid-4" style={{ gap: '16px' }}>
                                
                                {/* Panel 1: Personal & Residence */}
                                <div style={{ background: 'var(--bg-secondary)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                                  <h5 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <MapPin size={13} /> 1. Personal & Contact
                                  </h5>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
                                    <div>
                                      <span style={{ color: 'var(--text-muted)' }}>DOB & Gender: </span>
                                      <strong style={{ color: 'var(--text-primary)' }}>{emp.dob} ({emp.gender})</strong>
                                    </div>
                                    <div>
                                      <span style={{ color: 'var(--text-muted)' }}>Mobile: </span>
                                      <strong style={{ color: 'var(--text-primary)' }}>{emp.mobileNumber}</strong>
                                    </div>
                                    <div>
                                      <span style={{ color: 'var(--text-muted)' }}>Email: </span>
                                      <span style={{ color: 'var(--text-primary)', wordBreak: 'break-all' }}>{emp.email}</span>
                                    </div>
                                    <div>
                                      <span style={{ color: 'var(--text-muted)' }}>Residential Address: </span>
                                      <p style={{ color: 'var(--text-primary)', marginTop: '2px', lineHeight: '1.4' }}>{emp.address}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Panel 2: Job & Roster Details */}
                                <div style={{ background: 'var(--bg-secondary)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                                  <h5 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Briefcase size={13} /> 2. Roster & Hierarchy
                                  </h5>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
                                    <div>
                                      <span style={{ color: 'var(--text-muted)' }}>Branch Location: </span>
                                      <strong style={{ color: 'var(--text-primary)' }}>{emp.location || 'Cold Jamnagar'}</strong>
                                    </div>
                                    <div>
                                      <span style={{ color: 'var(--text-muted)' }}>Department: </span>
                                      <strong style={{ color: 'var(--text-primary)' }}>{emp.department}</strong>
                                    </div>
                                    <div>
                                      <span style={{ color: 'var(--text-muted)' }}>Designation: </span>
                                      <strong style={{ color: 'var(--text-primary)' }}>{emp.designation}</strong>
                                    </div>
                                    <div>
                                      <span style={{ color: 'var(--text-muted)' }}>Reporting Manager: </span>
                                      <strong style={{ color: 'var(--text-primary)' }}>{emp.manager}</strong>
                                    </div>
                                    <div>
                                      <span style={{ color: 'var(--text-muted)' }}>Assigned Shift: </span>
                                      <span style={{ color: 'var(--text-primary)' }}>{getShiftName(emp.shiftId)}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Panel 3: Complete Salary Structure */}
                                <div style={{ background: 'var(--bg-secondary)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                                  <h5 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <CreditCard size={13} /> 3. Salary Structure (₹/Mo)
                                  </h5>
                                  {canViewSalary ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11px' }}>
                                      <div>
                                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Basic Pay:</span>
                                        <strong style={{ color: 'var(--text-primary)' }}>₹{emp.salaryStructure.basic.toLocaleString()}</strong>
                                      </div>
                                      <div>
                                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>HRA:</span>
                                        <strong style={{ color: 'var(--text-primary)' }}>₹{emp.salaryStructure.hra.toLocaleString()}</strong>
                                      </div>
                                      <div>
                                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Other Allow.:</span>
                                        <strong style={{ color: 'var(--text-primary)' }}>₹{(emp.salaryStructure.otherAllowance || 0).toLocaleString()}</strong>
                                      </div>
                                      <div>
                                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Leave Encash:</span>
                                        <strong style={{ color: 'var(--text-primary)' }}>₹{(emp.salaryStructure.leaveEncashment || 0).toLocaleString()}</strong>
                                      </div>
                                      <div>
                                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Annual Bonus:</span>
                                        <strong style={{ color: 'var(--text-primary)' }}>₹{(emp.salaryStructure.bonus || 0).toLocaleString()}</strong>
                                      </div>
                                      <div>
                                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>OT Rate/Hr:</span>
                                        <strong style={{ color: 'var(--primary)' }}>₹{emp.salaryStructure.overtimeRate} / hr</strong>
                                      </div>
                                    </div>
                                  ) : (
                                    <div style={{ padding: '12px', fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <Lock size={14} /> Salary breakdown is confidential.
                                    </div>
                                  )}
                                </div>

                                {/* Panel 4: Statutory & Bank Details */}
                                <div style={{ background: 'var(--bg-secondary)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                                  <h5 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Building2 size={13} /> 4. Banking & Statutory IDs
                                  </h5>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
                                    <div>
                                      <span style={{ color: 'var(--text-muted)' }}>Bank & IFSC: </span>
                                      <strong style={{ color: 'var(--text-primary)' }}>{emp.bankDetails.bankName} ({emp.bankDetails.ifscCode})</strong>
                                    </div>
                                    <div>
                                      <span style={{ color: 'var(--text-muted)' }}>Account No: </span>
                                      <strong style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{emp.bankDetails.accountNumber}</strong>
                                    </div>
                                    <div>
                                      <span style={{ color: 'var(--text-muted)' }}>UAN / PF: </span>
                                      <strong style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>{emp.uanNumber || emp.pfNumber || '-'}</strong>
                                    </div>
                                    <div>
                                      <span style={{ color: 'var(--text-muted)' }}>ESIC No: </span>
                                      <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{emp.esiNumber || emp.esicNumber || 'N/A'}</span>
                                    </div>
                                    <div>
                                      <span style={{ color: 'var(--text-muted)' }}>PAN & Aadhaar: </span>
                                      <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{emp.panNumber} | {emp.aadhaarNumber}</span>
                                    </div>
                                  </div>
                                </div>

                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ padding: '12px 24px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span>Showing {filteredEmployees.length} of {employees.length} employees</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} style={{ color: 'var(--success)' }} /> All employee profiles, salary breakdowns & statutory records loaded
            </span>
          </div>

        </div>

      ) : (

        /* ============================================================
           CARDS / GRID VIEW (ALTERNATIVE VIEW)
           ============================================================ */
        <div className="grid-3">
          {filteredEmployees.map(emp => (
            <div key={emp.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
              
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <img 
                  src={emp.photoUrl} 
                  alt={emp.name} 
                  style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover', background: 'var(--border-color)' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
                    <span style={{ 
                      fontFamily: 'monospace', 
                      fontWeight: 800, 
                      fontSize: '11px', 
                      background: 'var(--primary-glow)', 
                      color: 'var(--primary)', 
                      padding: '2px 8px', 
                      borderRadius: '6px',
                      border: '1px solid var(--primary)'
                    }}>
                      #{emp.id}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {emp.employmentType}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {emp.name}
                  </h4>
                  <p style={{ color: 'var(--primary)', fontSize: '12px', fontWeight: 600 }}>{emp.designation}</p>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--text-secondary)' }}>
                  <MapPin size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  <span style={{ fontWeight: 600 }}>{emp.location || 'Cold Jamnagar'}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--text-secondary)' }}>
                  <Calendar size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  <span>Joined {emp.joiningDate}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--text-secondary)' }}>
                  <CreditCard size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  <span>
                    {canViewSalary ? `Basic Pay: ₹${emp.salaryStructure.basic.toLocaleString()}` : 'Role: ' + emp.department}
                  </span>
                </div>
              </div>

              {/* Actions Card Footer */}
              <div style={{ display: 'flex', justifySelf: 'flex-end', marginTop: 'auto', gap: '8px', width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <button className="btn btn-outline" style={{ flexGrow: 1, padding: '8px', fontSize: '12px' }} onClick={() => setViewDetailsEmp(emp)}>
                  <Eye size={14} />
                  Profile
                </button>

                {canPrintSlipFor(emp.id) && (
                  <button 
                    className="btn btn-primary" 
                    style={{ padding: '8px 12px', fontSize: '12px', gap: '6px', background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', color: '#ffffff', fontWeight: 600 }}
                    onClick={() => handlePrintSlip(emp)}
                    title="Print Salary Slip"
                  >
                    <Printer size={14} />
                    Print Slip
                  </button>
                )}
                
                {canModify && (
                  <button 
                    className="btn btn-outline" 
                    style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)', padding: '8px' }}
                    onClick={() => {
                      if (confirm(`Are you sure you want to terminate ${emp.name} (Code: ${emp.id})?`)) {
                        deleteEmployee(emp.id);
                      }
                    }}
                    title="Terminate Employee"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Onboarding Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Onboard New Employee</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Generate Employee Code and configure salary & statutory profiles</p>
              </div>
              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-primary)' }} onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Employee Code Section */}
              <div style={{ 
                background: 'var(--bg-surface-solid)', 
                border: '1px solid var(--primary)', 
                borderRadius: '10px', 
                padding: '16px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '10px' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', display: 'block' }}>
                      ⚡ Employee Code (Auto-Generated / Customizable)
                    </label>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Auto-increments to the next sequential code in the series
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      type="button" 
                      className="btn btn-outline" 
                      style={{ fontSize: '11px', padding: '4px 10px' }}
                      onClick={() => handleRegenerateCode('200')}
                    >
                      Series 200xxx
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline" 
                      style={{ fontSize: '11px', padding: '4px 10px' }}
                      onClick={() => handleRegenerateCode('300')}
                    >
                      Series 300xxx
                    </button>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    required 
                    value={empCode} 
                    onChange={(e) => setEmpCode(e.target.value)} 
                    placeholder="e.g. 200141" 
                    style={{ 
                      fontSize: '15px', 
                      fontWeight: 800, 
                      fontFamily: 'monospace', 
                      letterSpacing: '1px',
                      color: 'var(--primary)'
                    }} 
                  />
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    style={{ whiteSpace: 'nowrap', padding: '8px 14px' }}
                    onClick={() => handleRegenerateCode('200')}
                  >
                    ⚡ Auto Next
                  </button>
                </div>
              </div>

              {/* Profile Fields Group */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                  1. Personal & Contact Details
                </h4>
                
                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Full Name *</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Sarah Connor" />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Email Address *</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@enterprise.com" />
                  </div>
                </div>

                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Mobile Number *</label>
                    <input type="text" required value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="+1 555-0100" />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Date of Birth</label>
                    <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                  </div>
                </div>

                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Work Location / Branch</label>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Cold Jamnagar, Pune, etc." />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Home Address</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="G - PLOT HIG MHADA COMPLEX-158, SANT TUKARAM NAGAR, PUNE MAHARASHTRA- 411018" />
                </div>
              </div>

              {/* Assignment Group */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                  2. Department & Roster Assignment
                </h4>
                
                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Department</label>
                    <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                      <option value="Operations">Operations</option>
                      <option value="Housekeeping">Housekeeping</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Finance">Finance</option>
                      <option value="Engineering">Engineering</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Designation</label>
                    <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="Floor Associate" />
                  </div>
                </div>

                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Employment Type</label>
                    <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value as any)}>
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Intern">Intern</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Shift Assignment</label>
                    <select value={shiftId} onChange={(e) => setShiftId(e.target.value)}>
                      {shifts.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.startTime} - {s.endTime})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Joining Date</label>
                    <input type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Manager</label>
                    <input type="text" value={manager} onChange={(e) => setManager(e.target.value)} placeholder="Reports to..." />
                  </div>
                </div>
              </div>

              {/* Salary Structure Group */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                  3. Salary Structure (₹ Monthly)
                </h4>
                
                <div className="grid-3">
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Basic Salary (₹)</label>
                    <input type="number" value={basic} onChange={(e) => setBasic(Number(e.target.value))} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>HRA (₹)</label>
                    <input type="number" value={hra} onChange={(e) => setHra(Number(e.target.value))} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Other Allowance (₹)</label>
                    <input type="number" value={otherAllowance} onChange={(e) => setOtherAllowance(Number(e.target.value))} />
                  </div>
                </div>

                <div className="grid-3">
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Leave Encashment (₹)</label>
                    <input type="number" value={leaveEncashment} onChange={(e) => setLeaveEncashment(Number(e.target.value))} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Bonus (₹)</label>
                    <input type="number" value={bonus} onChange={(e) => setBonus(Number(e.target.value))} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>OT Rate (₹ / Hr)</label>
                    <input type="number" value={overtimeRate} onChange={(e) => setOvertimeRate(Number(e.target.value))} />
                  </div>
                </div>
              </div>

              {/* Financial & Statutory Audits Group */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                  4. Bank Details & Statutory IDs (UAN / ESIC / PF)
                </h4>
                
                <div className="grid-3">
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Bank Name</label>
                    <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>IFSC Code</label>
                    <input type="text" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} />
                  </div>
                </div>

                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Bank Account Number</label>
                    <input type="text" required value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="01234567890" />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>UAN Number (12 Digits)</label>
                    <input type="text" value={uanNumber} onChange={(e) => setUanNumber(e.target.value)} placeholder="101974247470" />
                  </div>
                </div>

                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>ESIC No. (Optional)</label>
                    <input type="text" value={esiNumber} onChange={(e) => setEsiNumber(e.target.value)} placeholder="33-01928-82" />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>PAN Card (10 Digits)</label>
                    <input type="text" value={panNumber} onChange={(e) => setPanNumber(e.target.value.toUpperCase())} placeholder="ABCDE1234F" />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Complete Registration</button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* View Details Profile Drawer Modal */}
      {viewDetailsEmp && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '640px', background: 'var(--bg-surface-solid)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Employee Profile Details</h3>
              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-primary)' }} onClick={() => setViewDetailsEmp(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Header profile */}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <img 
                  src={viewDetailsEmp.photoUrl} 
                  alt={viewDetailsEmp.name} 
                  style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover' }}
                />
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800 }}>{viewDetailsEmp.name}</h3>
                  <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '14px' }}>{viewDetailsEmp.designation}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>#{viewDetailsEmp.id} • {viewDetailsEmp.employmentType} • {viewDetailsEmp.status}</p>
                </div>
              </div>

              {/* Grid Contact Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Phone size={16} style={{ color: 'var(--text-muted)' }} />
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>Mobile Number</span>
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{viewDetailsEmp.mobileNumber}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Mail size={16} style={{ color: 'var(--text-muted)' }} />
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>Email Address</span>
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{viewDetailsEmp.email}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <MapPin size={16} style={{ color: 'var(--text-muted)' }} />
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>Home Address</span>
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{viewDetailsEmp.address}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Calendar size={16} style={{ color: 'var(--text-muted)' }} />
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>Date of Birth</span>
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{viewDetailsEmp.dob} ({viewDetailsEmp.gender})</span>
                  </div>
                </div>
              </div>

              {/* Roster Assignment details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>Assignment & Location Rules</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>Department</span>
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>{viewDetailsEmp.department}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>Location</span>
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>{viewDetailsEmp.location || 'Cold Jamnagar'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>Shift Schedule</span>
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>{getShiftName(viewDetailsEmp.shiftId)}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>Reports To</span>
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>{viewDetailsEmp.manager}</span>
                  </div>
                </div>
              </div>

              {/* Salary Structure Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>Salary Breakdown (₹ Monthly)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Basic Pay:</span> <span style={{ fontWeight: 600 }}>₹{viewDetailsEmp.salaryStructure.basic.toLocaleString()}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>HRA:</span> <span style={{ fontWeight: 600 }}>₹{viewDetailsEmp.salaryStructure.hra.toLocaleString()}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Other Allowance:</span> <span style={{ fontWeight: 600 }}>₹{(viewDetailsEmp.salaryStructure.otherAllowance || viewDetailsEmp.salaryStructure.specialAllowance || 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Leave Encashment:</span> <span style={{ fontWeight: 600 }}>₹{(viewDetailsEmp.salaryStructure.leaveEncashment || 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Bonus:</span> <span style={{ fontWeight: 600 }}>₹{(viewDetailsEmp.salaryStructure.bonus || 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Overtime Rate:</span> <span style={{ fontWeight: 600 }}>₹{viewDetailsEmp.salaryStructure.overtimeRate} / hr</span>
                  </div>
                </div>
              </div>

              {/* Financial & Statutory info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>Banking & Statutory Registrations</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Bank Name:</span> <span style={{ fontWeight: 600 }}>{viewDetailsEmp.bankDetails.bankName}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Account Number:</span> <span style={{ fontWeight: 600 }}>{viewDetailsEmp.bankDetails.accountNumber}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>IFSC Bank Code:</span> <span style={{ fontWeight: 600 }}>{viewDetailsEmp.bankDetails.ifscCode}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>UAN Number:</span> <span style={{ fontWeight: 600 }}>{viewDetailsEmp.uanNumber || viewDetailsEmp.pfNumber || '-'}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>ESIC No.:</span> <span style={{ fontWeight: 600 }}>{viewDetailsEmp.esiNumber || viewDetailsEmp.esicNumber || '-'}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>PAN Tax Code:</span> <span style={{ fontWeight: 600 }}>{viewDetailsEmp.panNumber}</span>
                  </div>
                </div>
              </div>

              {/* Close profile & print buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '4px' }}>
                <button 
                  className="btn btn-primary" 
                  style={{ fontSize: '12px', padding: '8px 16px', gap: '6px', background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', color: '#ffffff', fontWeight: 600 }}
                  onClick={() => handlePrintSlip(viewDetailsEmp)}
                >
                  <Printer size={14} /> Print Salary Slip
                </button>

                <button className="btn btn-secondary" onClick={() => setViewDetailsEmp(null)}>Close Profile Details</button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Salary Slip Modal */}
      {activeSlip && (
        <div className="modal-overlay" onClick={() => setActiveSlip(null)}>
          <div onClick={(e) => e.stopPropagation()}>
            <SalarySlip
              payroll={activeSlip.record}
              employee={activeSlip.employee}
              companyName={companyProfile.name}
              companyAddress={companyProfile.address}
              onClose={() => setActiveSlip(null)}
            />
          </div>
        </div>
      )}

    </div>
  );
};
