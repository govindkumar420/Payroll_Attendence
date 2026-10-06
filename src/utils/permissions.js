const PERMISSION_MATRIX = {
  "Super Admin": {
    dashboard: "Full",
    userManagement: "Full",
    employeeManagement: "Full",
    attendance: "Full",
    manualAttendance: "Full",
    attendanceApproval: "Full",
    shiftManagement: "Full",
    leaveManagement: "Full",
    holidayManagement: "Full",
    overtime: "Full",
    salaryStructure: "Full",
    payrollCalculation: "Full",
    payrollApproval: true,
    payslip: "All",
    loanAndAdvance: "Full",
    pfEsiTdsReports: true,
    bankTransfer: true,
    reports: "All",
    notifications: "All",
    auditLogs: "Full",
    systemSettings: "Full"
  },
  "HR Manager": {
    dashboard: "View",
    userManagement: "Manage",
    employeeManagement: "Full",
    attendance: "Manage",
    manualAttendance: "Manage",
    attendanceApproval: "Manage",
    shiftManagement: "Manage",
    leaveManagement: "Full",
    holidayManagement: "Manage",
    overtime: "Manage",
    salaryStructure: "Manage",
    payrollCalculation: "View",
    payrollApproval: true,
    payslip: "All",
    loanAndAdvance: "Manage",
    pfEsiTdsReports: true,
    bankTransfer: false,
    reports: "HR",
    notifications: "All",
    auditLogs: "View",
    systemSettings: "None"
  },
  "Payroll Manager": {
    dashboard: "View",
    userManagement: "None",
    employeeManagement: "View",
    attendance: "View",
    manualAttendance: "None",
    attendanceApproval: "None",
    shiftManagement: "View",
    leaveManagement: "View",
    holidayManagement: "View",
    overtime: "Calculate",
    salaryStructure: "Full",
    payrollCalculation: "Full",
    payrollApproval: true,
    payslip: "All",
    loanAndAdvance: "Calculate",
    pfEsiTdsReports: true,
    bankTransfer: true,
    reports: "Payroll",
    notifications: "All",
    auditLogs: "View",
    systemSettings: "None"
  },
  "Department Manager": {
    dashboard: "View",
    userManagement: "None",
    employeeManagement: "Team",
    attendance: "Team",
    manualAttendance: "Team",
    attendanceApproval: "Team",
    shiftManagement: "View",
    leaveManagement: "Approve",
    holidayManagement: "View",
    overtime: "Approve",
    salaryStructure: "None",
    payrollCalculation: "None",
    payrollApproval: false,
    payslip: "Own",
    loanAndAdvance: "None",
    pfEsiTdsReports: false,
    bankTransfer: false,
    reports: "Team",
    notifications: "All",
    auditLogs: "None",
    systemSettings: "None"
  },
  "Accountant": {
    dashboard: "View",
    userManagement: "None",
    employeeManagement: "View",
    attendance: "View",
    manualAttendance: "None",
    attendanceApproval: "None",
    shiftManagement: "None",
    leaveManagement: "None",
    holidayManagement: "None",
    overtime: "View",
    salaryStructure: "View",
    payrollCalculation: "View",
    payrollApproval: false,
    payslip: "View",
    loanAndAdvance: "View",
    pfEsiTdsReports: true,
    bankTransfer: true,
    reports: "Finance",
    notifications: "All",
    auditLogs: "None",
    systemSettings: "None"
  },
  "Employee": {
    dashboard: "Own",
    userManagement: "None",
    employeeManagement: "Own",
    attendance: "Own",
    manualAttendance: "None",
    attendanceApproval: "None",
    shiftManagement: "Own",
    leaveManagement: "Apply",
    holidayManagement: "View",
    overtime: "Request",
    salaryStructure: "Own",
    payrollCalculation: "Own",
    payrollApproval: false,
    payslip: "Own",
    loanAndAdvance: "Request",
    pfEsiTdsReports: false,
    bankTransfer: false,
    reports: "Own",
    notifications: "Own",
    auditLogs: "None",
    systemSettings: "None"
  }
};
const EMPLOYEE_PERSONA_ID = "EMP-000001";
const MANAGER_DEPARTMENT = "Operations";
const getPermissions = (role) => {
  return PERMISSION_MATRIX[role] || PERMISSION_MATRIX["Employee"];
};
const isTabVisibleForRole = (role, tabId) => {
  const p = getPermissions(role);
  switch (tabId) {
    case "dashboard":
      return true;
    case "employees":
      return p.employeeManagement !== "Own";
    // Employees access their own profile via profile / dashboard
    case "attendance":
      return true;
    case "shifts":
      return p.shiftManagement !== "None";
    case "leaves":
      return p.leaveManagement !== "None";
    case "payroll":
      return p.payrollCalculation !== "None" || p.payslip !== "Own" || role === "Accountant" || role === "Employee";
    case "loans":
      return p.loanAndAdvance !== "None";
    case "reports":
      return true;
    case "settings":
      return p.systemSettings !== "None" || p.userManagement !== "None" || p.auditLogs !== "None";
    default:
      return true;
  }
};
const filterEmployeesByRole = (items, role, getIdField = (item) => item.id || item.employeeId || "", getDeptField = (item) => item.department || "") => {
  const p = getPermissions(role);
  if (p.employeeManagement === "Full" || p.employeeManagement === "View") {
    return items;
  }
  if (p.employeeManagement === "Team") {
    return items.filter((item) => getDeptField(item) === MANAGER_DEPARTMENT);
  }
  if (p.employeeManagement === "Own" || role === "Employee") {
    return items.filter((item) => getIdField(item) === EMPLOYEE_PERSONA_ID);
  }
  return items;
};
export {
  EMPLOYEE_PERSONA_ID,
  MANAGER_DEPARTMENT,
  PERMISSION_MATRIX,
  filterEmployeesByRole,
  getPermissions,
  isTabVisibleForRole
};
