import { UserRole } from '../context/StateContext';

// ==========================================
// ROLE-BASED ACCESS CONTROL (RBAC) PERMISSION ENGINE
// Exact implementation of the User's Authority Matrix
// ==========================================

export interface RolePermissions {
  dashboard: 'Full' | 'View' | 'Own';
  userManagement: 'Full' | 'Manage' | 'None';
  employeeManagement: 'Full' | 'View' | 'Team' | 'Own';
  attendance: 'Full' | 'Manage' | 'View' | 'Team' | 'Own';
  manualAttendance: 'Full' | 'Manage' | 'Team' | 'None';
  attendanceApproval: 'Full' | 'Manage' | 'Team' | 'None';
  shiftManagement: 'Full' | 'Manage' | 'View' | 'Own' | 'None';
  leaveManagement: 'Full' | 'View' | 'Approve' | 'Apply' | 'None';
  holidayManagement: 'Full' | 'Manage' | 'View' | 'None';
  overtime: 'Full' | 'Manage' | 'Calculate' | 'Approve' | 'View' | 'Request';
  salaryStructure: 'Full' | 'Manage' | 'View' | 'Own' | 'None';
  payrollCalculation: 'Full' | 'View' | 'Own' | 'None';
  payrollApproval: boolean;
  payslip: 'All' | 'View' | 'Own';
  loanAndAdvance: 'Full' | 'Manage' | 'Calculate' | 'View' | 'Request' | 'None';
  pfEsiTdsReports: boolean;
  bankTransfer: boolean;
  reports: 'All' | 'HR' | 'Payroll' | 'Team' | 'Finance' | 'Own';
  notifications: 'All' | 'Own';
  auditLogs: 'Full' | 'View' | 'None';
  systemSettings: 'Full' | 'None';
}

export const PERMISSION_MATRIX: Record<UserRole, RolePermissions> = {
  'Super Admin': {
    dashboard: 'Full',
    userManagement: 'Full',
    employeeManagement: 'Full',
    attendance: 'Full',
    manualAttendance: 'Full',
    attendanceApproval: 'Full',
    shiftManagement: 'Full',
    leaveManagement: 'Full',
    holidayManagement: 'Full',
    overtime: 'Full',
    salaryStructure: 'Full',
    payrollCalculation: 'Full',
    payrollApproval: true,
    payslip: 'All',
    loanAndAdvance: 'Full',
    pfEsiTdsReports: true,
    bankTransfer: true,
    reports: 'All',
    notifications: 'All',
    auditLogs: 'Full',
    systemSettings: 'Full',
  },
  'HR Manager': {
    dashboard: 'View',
    userManagement: 'Manage',
    employeeManagement: 'Full',
    attendance: 'Manage',
    manualAttendance: 'Manage',
    attendanceApproval: 'Manage',
    shiftManagement: 'Manage',
    leaveManagement: 'Full',
    holidayManagement: 'Manage',
    overtime: 'Manage',
    salaryStructure: 'Manage',
    payrollCalculation: 'View',
    payrollApproval: true,
    payslip: 'All',
    loanAndAdvance: 'Manage',
    pfEsiTdsReports: true,
    bankTransfer: false,
    reports: 'HR',
    notifications: 'All',
    auditLogs: 'View',
    systemSettings: 'None',
  },
  'Payroll Manager': {
    dashboard: 'View',
    userManagement: 'None',
    employeeManagement: 'View',
    attendance: 'View',
    manualAttendance: 'None',
    attendanceApproval: 'None',
    shiftManagement: 'View',
    leaveManagement: 'View',
    holidayManagement: 'View',
    overtime: 'Calculate',
    salaryStructure: 'Full',
    payrollCalculation: 'Full',
    payrollApproval: true,
    payslip: 'All',
    loanAndAdvance: 'Calculate',
    pfEsiTdsReports: true,
    bankTransfer: true,
    reports: 'Payroll',
    notifications: 'All',
    auditLogs: 'View',
    systemSettings: 'None',
  },
  'Department Manager': {
    dashboard: 'View',
    userManagement: 'None',
    employeeManagement: 'Team',
    attendance: 'Team',
    manualAttendance: 'Team',
    attendanceApproval: 'Team',
    shiftManagement: 'View',
    leaveManagement: 'Approve',
    holidayManagement: 'View',
    overtime: 'Approve',
    salaryStructure: 'None',
    payrollCalculation: 'None',
    payrollApproval: false,
    payslip: 'Own',
    loanAndAdvance: 'None',
    pfEsiTdsReports: false,
    bankTransfer: false,
    reports: 'Team',
    notifications: 'All',
    auditLogs: 'None',
    systemSettings: 'None',
  },
  'Accountant': {
    dashboard: 'View',
    userManagement: 'None',
    employeeManagement: 'View',
    attendance: 'View',
    manualAttendance: 'None',
    attendanceApproval: 'None',
    shiftManagement: 'None',
    leaveManagement: 'None',
    holidayManagement: 'None',
    overtime: 'View',
    salaryStructure: 'View',
    payrollCalculation: 'View',
    payrollApproval: false,
    payslip: 'View',
    loanAndAdvance: 'View',
    pfEsiTdsReports: true,
    bankTransfer: true,
    reports: 'Finance',
    notifications: 'All',
    auditLogs: 'None',
    systemSettings: 'None',
  },
  'Employee': {
    dashboard: 'Own',
    userManagement: 'None',
    employeeManagement: 'Own',
    attendance: 'Own',
    manualAttendance: 'None',
    attendanceApproval: 'None',
    shiftManagement: 'Own',
    leaveManagement: 'Apply',
    holidayManagement: 'View',
    overtime: 'Request',
    salaryStructure: 'Own',
    payrollCalculation: 'Own',
    payrollApproval: false,
    payslip: 'Own',
    loanAndAdvance: 'Request',
    pfEsiTdsReports: false,
    bankTransfer: false,
    reports: 'Own',
    notifications: 'Own',
    auditLogs: 'None',
    systemSettings: 'None',
  }
};

// Target employee ID mapped to Employee Persona in the Riddhi Siddhi roster
export const EMPLOYEE_PERSONA_ID = '200050';

// Department mapped to Department Manager
export const MANAGER_DEPARTMENT = 'Operations';

export const getPermissions = (role: UserRole): RolePermissions => {
  return PERMISSION_MATRIX[role] || PERMISSION_MATRIX['Employee'];
};

// Tab visibility checker based on role permissions
export const isTabVisibleForRole = (role: UserRole, tabId: string): boolean => {
  const p = getPermissions(role);
  switch (tabId) {
    case 'dashboard':
      return true;
    case 'employees':
      return p.employeeManagement !== 'Own'; // Employees access their own profile via profile / dashboard
    case 'attendance':
      return true;
    case 'shifts':
      return p.shiftManagement !== 'None';
    case 'leaves':
      return p.leaveManagement !== 'None';
    case 'payroll':
      return p.payrollCalculation !== 'None' || p.payslip !== 'Own' || role === 'Accountant' || role === 'Employee';
    case 'loans':
      return p.loanAndAdvance !== 'None';
    case 'reports':
      return true;
    case 'settings':
      return p.systemSettings !== 'None' || p.userManagement !== 'None' || p.auditLogs !== 'None';
    default:
      return true;
  }
};

// Helper to filter employee list according to role visibility scope
export const filterEmployeesByRole = <T extends { id: string; department?: string; employeeId?: string }>(
  items: T[],
  role: UserRole,
  getIdField: (item: T) => string = (item) => item.id || item.employeeId || '',
  getDeptField: (item: T) => string = (item) => item.department || ''
): T[] => {
  const p = getPermissions(role);
  if (p.employeeManagement === 'Full' || p.employeeManagement === 'View') {
    return items;
  }
  if (p.employeeManagement === 'Team') {
    return items.filter(item => getDeptField(item) === MANAGER_DEPARTMENT);
  }
  if (p.employeeManagement === 'Own' || role === 'Employee') {
    return items.filter(item => getIdField(item) === EMPLOYEE_PERSONA_ID);
  }
  return items;
};
