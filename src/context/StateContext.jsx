import { jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from "react";
import { getNextEmployeeCode } from "../utils/employeeCode";
const StateContext = createContext(void 0);
const APP_ROLES = ["Super Admin", "HR Manager", "Payroll Manager", "Department Manager", "Employee", "Accountant"];
const INITIAL_SHIFTS = [
  { id: "S1", name: "Morning Shift", startTime: "09:00", endTime: "17:00", breakTime: 45, gracePeriod: 15, weeklyOff: "Sunday" },
  { id: "S2", name: "Evening Shift", startTime: "17:00", endTime: "01:00", breakTime: 45, gracePeriod: 15, weeklyOff: "Sunday" },
  { id: "S3", name: "Night Shift", startTime: "21:00", endTime: "05:00", breakTime: 45, gracePeriod: 15, weeklyOff: "Sunday" },
  { id: "S4", name: "Flexible Shift", startTime: "00:00", endTime: "23:59", breakTime: 60, gracePeriod: 0, weeklyOff: "Sunday" }
];
const INITIAL_EMPLOYEES = [];
const INITIAL_LEAVES = [];
const INITIAL_LOANS = [];
const INITIAL_PAYROLL = [];
const StateProvider = ({ children }) => {
  const [theme, setThemeState] = useState("dark");
  const [activeRole, setActiveRoleState] = useState("Super Admin");
  const [isAdministratorSession, setIsAdministratorSession] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [personaPhotos, setPersonaPhotos] = useState({
    "Super Admin": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    "HR Manager": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
    "Payroll Manager": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    "Department Manager": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    "Employee": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
    "Accountant": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
  });
  const [companyProfile, setCompanyProfile] = useState({
    name: "Gnosis Ventures",
    address: "",
    tagline: "Payroll & Attendance Operations"
  });
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [attendance, setAttendance] = useState([]);
  const [shifts, setShifts] = useState(INITIAL_SHIFTS);
  const [leaves, setLeaves] = useState(INITIAL_LEAVES);
  const [holidays, setHolidays] = useState([]);
  const [loans, setLoans] = useState(INITIAL_LOANS);
  const [payroll, setPayroll] = useState(INITIAL_PAYROLL);
  const [auditLogs, setAuditLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  const login = (role) => {
    setActiveRoleState(role);
    setIsAdministratorSession(role === "Super Admin");
    setIsLoggedIn(true);
    addAuditLog("User Login", `Successfully logged in as ${role}`);
    triggerSyncNotification(`\u{1F44B} Welcome back! Authenticated as ${role}`);
  };
  const logout = () => {
    setIsLoggedIn(false);
    setIsAdministratorSession(false);
    addAuditLog("User Logout", `Logged out from ${activeRole} session`);
    triggerSyncNotification(`\u{1F6AA} Signed out from ${activeRole} session`);
  };
  const updatePersonaPhoto = (role, photoUrl) => {
    setPersonaPhotos((prev) => ({ ...prev, [role]: photoUrl }));
    addAuditLog("Profile Picture Update", `Updated profile photo for ${role}`);
    triggerSyncNotification(`\u{1F4F8} Profile picture updated for ${role}`);
  };
  const updateUserPassword = (role, _newPass) => {
    if (!isAdministratorSession) {
      triggerSyncNotification("Only the administrator can change account credentials.");
      return false;
    }
    addAuditLog("Password Reset", `Password changed successfully for ${role}`);
    triggerSyncNotification(`\u{1F511} Password updated successfully for ${role}`);
    return true;
  };
  const updateCompanyProfile = (profile) => {
    setCompanyProfile((prev) => ({ ...prev, ...profile }));
    addAuditLog("Company Profile Update", `Updated company profile: ${profile.name || ""}`);
  };
  const addAuditLog = (action, details) => {
    const newLog = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
      timestamp: (/* @__PURE__ */ new Date()).toLocaleString(),
      user: activeRole === "Employee" ? "Current Employee" : activeRole,
      role: activeRole,
      action,
      details
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };
  const triggerSyncNotification = (msg) => {
    setNotifications((prev) => [msg, ...prev].slice(0, 15));
  };
  const getNextEmpCode = (prefix = "200") => {
    return getNextEmployeeCode(employees, prefix);
  };
  const onboardEmployee = (empData) => {
    const nextId = empData.id || getNextEmpCode();
    const newEmp = { ...empData, id: nextId };
    setEmployees((prev) => [...prev, newEmp]);
    addAuditLog("Onboard Employee", `Successfully onboarded employee ${newEmp.name} (Code: ${nextId})`);
    triggerSyncNotification(`\u{1F4E7} Notification sent: Welcome Email sent to ${newEmp.email}`);
    triggerSyncNotification(`\u{1F4AC} WhatsApp alert sent to ${newEmp.mobileNumber}`);
  };
  const updateEmployee = (updatedEmp) => {
    setEmployees((prev) => prev.map((emp) => emp.id === updatedEmp.id ? updatedEmp : emp));
    addAuditLog("Update Employee", `Updated employee record for ${updatedEmp.name} (${updatedEmp.id})`);
  };
  const deleteEmployee = (id) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    addAuditLog("Delete Employee", `Terminated / Removed employee ID: ${id}`);
  };
  const addShift = (newShift) => {
    setShifts((prev) => [...prev, newShift]);
    addAuditLog("Create Shift", `Created new shift: ${newShift.name} (${newShift.startTime}-${newShift.endTime})`);
  };
  const clockIn = (employeeId, method, location, photo) => {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const timeStr = (/* @__PURE__ */ new Date()).toTimeString().split(" ")[0].substring(0, 5);
    const recId = `${employeeId}_${today}`;
    const emp = employees.find((e) => e.id === employeeId);
    const shift = shifts.find((s) => s.id === emp?.shiftId) || shifts[0];
    let lateArrival = false;
    if (shift) {
      const [sHr, sMin] = shift.startTime.split(":").map(Number);
      const [cHr, cMin] = timeStr.split(":").map(Number);
      const shiftMinutes = sHr * 60 + sMin + shift.gracePeriod;
      const clockMinutes = cHr * 60 + cMin;
      if (clockMinutes > shiftMinutes) {
        lateArrival = true;
      }
    }
    const exists = attendance.find((a) => a.id === recId);
    if (exists) {
      addAuditLog("Attendance Alert", `Employee ${employeeId} attempted duplicate Clock In`);
      return;
    }
    const newRecord = {
      id: recId,
      employeeId,
      date: today,
      checkIn: timeStr,
      checkOut: "",
      workingHours: 0,
      breakTime: 0,
      overtime: 0,
      lateArrival,
      earlyLeaving: false,
      status: "Present",
      method: method || "Biometric",
      location: location || "",
      photo: photo || "",
      verifiedAt: (/* @__PURE__ */ new Date()).toLocaleTimeString()
    };
    setAttendance((prev) => [newRecord, ...prev]);
    addAuditLog("Clock In", `Employee ${employeeId} clocked in via ${method}.${location ? ` Location: ${location}.` : ""}${photo ? " (Live selfie photo attached & verified)" : ""}`);
    triggerSyncNotification(`\u{1F4F1} Push Notification: Attendance & photo registered for ${emp?.name} via ${method}`);
  };
  const clockOut = (employeeId) => {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const timeStr = (/* @__PURE__ */ new Date()).toTimeString().split(" ")[0].substring(0, 5);
    const recId = `${employeeId}_${today}`;
    const recordIndex = attendance.findIndex((a) => a.id === recId);
    if (recordIndex === -1) {
      addAuditLog("Attendance Alert", `Employee ${employeeId} attempted to Clock Out without clocking in first`);
      return;
    }
    const record = attendance[recordIndex];
    if (record.checkOut) {
      addAuditLog("Attendance Alert", `Employee ${employeeId} already clocked out today`);
      return;
    }
    const emp = employees.find((e) => e.id === employeeId);
    const shift = shifts.find((s) => s.id === emp?.shiftId) || shifts[0];
    const [inHr, inMin] = record.checkIn.split(":").map(Number);
    const [outHr, outMin] = timeStr.split(":").map(Number);
    const inTotalMins = inHr * 60 + inMin;
    const outTotalMins = outHr * 60 + outMin;
    const diffMins = outTotalMins - inTotalMins;
    const breakVal = shift ? shift.breakTime : 45;
    const activeMins = Math.max(0, diffMins - breakVal);
    const hrs = parseFloat((activeMins / 60).toFixed(2));
    let overtime = 0;
    if (hrs > 8) {
      overtime = parseFloat((hrs - 8).toFixed(2));
    }
    let earlyLeaving = false;
    if (shift) {
      const [sHr, sMin] = shift.endTime.split(":").map(Number);
      const shiftEndMinutes = sHr * 60 + sMin;
      if (outTotalMins < shiftEndMinutes) {
        earlyLeaving = true;
      }
    }
    const updatedRecord = {
      ...record,
      checkOut: timeStr,
      workingHours: hrs,
      breakTime: breakVal,
      overtime,
      earlyLeaving
    };
    setAttendance((prev) => prev.map((a) => a.id === recId ? updatedRecord : a));
    addAuditLog("Clock Out", `Employee ${employeeId} clocked out. Working hours: ${hrs}h (OT: ${overtime}h)`);
  };
  const applyLeave = (leaveData) => {
    const newLeave = {
      ...leaveData,
      id: `LV-${Date.now()}`,
      status: "Pending Approval",
      appliedDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    };
    setLeaves((prev) => [newLeave, ...prev]);
    addAuditLog("Leave Apply", `Employee ${leaveData.employeeId} applied for ${leaveData.leaveType} leave`);
    triggerSyncNotification(`\u{1F4E7} Notification: Manager and HR notified of Leave application by employee ID ${leaveData.employeeId}`);
  };
  const updateLeaveStatus = (id, status) => {
    setLeaves((prev) => prev.map((lv) => {
      if (lv.id === id) {
        if (status === "HR Verified") {
          const dateRange = [];
          let current = new Date(lv.fromDate);
          const end = new Date(lv.toDate);
          while (current <= end) {
            dateRange.push(current.toISOString().split("T")[0]);
            current.setDate(current.getDate() + 1);
          }
          setAttendance((prevAtt) => {
            const copy = [...prevAtt];
            dateRange.forEach((date) => {
              const recId = `${lv.employeeId}_${date}`;
              const existsIdx = copy.findIndex((a) => a.id === recId);
              const isSunday = new Date(date).getDay() === 0;
              if (existsIdx !== -1) {
                copy[existsIdx] = {
                  ...copy[existsIdx],
                  status: isSunday ? "Weekly Off" : "Leave",
                  checkIn: "",
                  checkOut: "",
                  workingHours: 0,
                  overtime: 0
                };
              } else {
                copy.push({
                  id: recId,
                  employeeId: lv.employeeId,
                  date,
                  checkIn: "",
                  checkOut: "",
                  workingHours: 0,
                  breakTime: 0,
                  overtime: 0,
                  lateArrival: false,
                  earlyLeaving: false,
                  status: isSunday ? "Weekly Off" : "Leave"
                });
              }
            });
            return copy;
          });
        }
        return { ...lv, status };
      }
      return lv;
    }));
    const leave = leaves.find((l) => l.id === id);
    addAuditLog("Leave Status Update", `Leave request ${id} updated to status: ${status}`);
    if (leave) {
      const emp = employees.find((e) => e.id === leave.employeeId);
      if (emp) {
        triggerSyncNotification(`\u{1F4AC} WhatsApp alert to ${emp.name}: Your leave request is now ${status}`);
      }
    }
  };
  const addHoliday = (holData) => {
    const newHol = {
      ...holData,
      id: `HOL-${Date.now()}`
    };
    setHolidays((prev) => [...prev, newHol]);
    addAuditLog("Create Holiday", `Created holiday: ${newHol.name} on ${newHol.date}`);
  };
  const applyLoan = (loanData) => {
    const newLoan = {
      ...loanData,
      id: `LN-${Date.now()}`,
      status: "Pending",
      remainingBalance: loanData.amount,
      appliedDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    };
    setLoans((prev) => [newLoan, ...prev]);
    addAuditLog("Apply Loan/Advance", `Employee ${loanData.employeeId} requested ${loanData.type} of $${loanData.amount}`);
  };
  const updateLoanStatus = (id, status) => {
    setLoans((prev) => prev.map((ln) => {
      if (ln.id === id) {
        return {
          ...ln,
          status,
          approvedDate: status === "Approved" || status === "Disbursed" ? (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : ln.approvedDate
        };
      }
      return ln;
    }));
    addAuditLog("Loan Status Update", `Loan ID ${id} status changed to ${status}`);
    const loan = loans.find((l) => l.id === id);
    if (loan) {
      const emp = employees.find((e) => e.id === loan.employeeId);
      if (emp) {
        triggerSyncNotification(`\u{1F4E7} Notification sent to ${emp.email}: Your ${loan.type} request status has been updated to ${status}`);
      }
    }
  };
  const processMonthlyPayroll = (month) => {
    const payrollRecords = [];
    employees.forEach((emp) => {
      const empAtt = attendance.filter((a) => a.employeeId === emp.id && a.date.startsWith(month));
      const presentDays = empAtt.filter((a) => a.status === "Present" || a.status === "WFH" || a.status === "Half Day").length;
      const halfDays = empAtt.filter((a) => a.status === "Half Day").length;
      const leaveDays = empAtt.filter((a) => a.status === "Leave").length;
      const totalMonthDays = 30;
      const sundays = 4;
      const holidaysCount = holidays.filter((h) => h.date.startsWith(month)).length;
      const workdaysExpected = totalMonthDays - sundays - holidaysCount;
      const calculatedAbsent = Math.max(0, workdaysExpected - presentDays - leaveDays);
      const overtimeHours = empAtt.reduce((sum, rec) => sum + (rec.overtime || 0), 0);
      const activeLoan = loans.find((l) => l.employeeId === emp.id && l.status === "Disbursed");
      const loanEmi = activeLoan ? activeLoan.monthlyDeduction : 0;
      const sal = emp.salaryStructure;
      const calculatedOvertimeEarnings = overtimeHours * sal.overtimeRate;
      const dailyBasic = sal.basic / (workdaysExpected || 30);
      const leaveDeduction = calculatedAbsent > 0 ? Math.round(calculatedAbsent * dailyBasic) : 0;
      const lateArrivalsCount = empAtt.filter((a) => a.lateArrival).length;
      const latePenalty = lateArrivalsCount * 10;
      const basic = sal.basic;
      const hra = sal.hra || 0;
      const da = sal.da || 0;
      const conveyance = sal.conveyance || 0;
      const medical = sal.medical || 0;
      const specialAllowance = sal.specialAllowance || 0;
      const otherAllowance = sal.otherAllowance || 0;
      const leaveEncashment = sal.leaveEncashment || 0;
      const bonus = sal.bonus || 0;
      const incentive = sal.incentive || 0;
      const grossSalary = basic + hra + da + conveyance + medical + specialAllowance + otherAllowance + leaveEncashment + bonus + incentive + calculatedOvertimeEarnings;
      const pf = Math.round(basic * 0.12);
      const esi = grossSalary <= 21e3 ? Math.round(grossSalary * 75e-4) : 0;
      const pt = 200;
      const lwf = 1;
      const otherDeduction = 0;
      const advance = loanEmi;
      let tds = 0;
      if (grossSalary > 8e4) tds = Math.round(grossSalary * 0.2);
      else if (grossSalary > 5e4) tds = Math.round(grossSalary * 0.1);
      else if (grossSalary > 3e4) tds = Math.round(grossSalary * 0.05);
      const totalDeductions = pf + esi + pt + lwf + otherDeduction + advance + tds + latePenalty + leaveDeduction;
      const netSalary = grossSalary - totalDeductions;
      payrollRecords.push({
        id: `${emp.id}_${month}`,
        employeeId: emp.id,
        month,
        totalDays: totalMonthDays,
        presentDays: Math.max(0, presentDays - halfDays * 0.5),
        absentDays: calculatedAbsent + halfDays * 0.5,
        leaveDays,
        overtimeHours,
        earnings: {
          basic,
          hra,
          da,
          conveyance,
          medical,
          specialAllowance,
          otherAllowance,
          leaveEncashment,
          bonus,
          incentive,
          overtime: calculatedOvertimeEarnings,
          grossSalary
        },
        deductions: {
          pf,
          esi,
          pt,
          lwf,
          otherDeduction,
          advance,
          tds,
          loanEmi,
          latePenalty,
          leaveDeduction,
          totalDeductions
        },
        netSalary,
        status: "Draft",
        paymentMode: "BY BANK"
      });
    });
    setPayroll((prev) => {
      const filtered = prev.filter((p) => p.month !== month);
      return [...filtered, ...payrollRecords];
    });
    addAuditLog("Process Payroll", `Calculated draft payroll for month: ${month} across ${employees.length} employees`);
    triggerSyncNotification(`\u{1F4CA} Payroll Draft generated for ${month}. Pending HR Approval.`);
  };
  const approveMonthlyPayroll = (month) => {
    setPayroll((prev) => prev.map((p) => {
      if (p.month === month) {
        return { ...p, status: "Approved" };
      }
      return p;
    }));
    addAuditLog("Approve Payroll", `HR Manager / Payroll Director approved payroll for month: ${month}`);
    triggerSyncNotification(`\u2705 Payroll approved for ${month}. Ready for bank disbursement.`);
  };
  const disburseMonthlyPayroll = (month) => {
    setPayroll((prev) => prev.map((p) => {
      if (p.month === month) {
        if (p.deductions.loanEmi > 0) {
          setLoans((prevLoans) => prevLoans.map((loan) => {
            if (loan.employeeId === p.employeeId && loan.status === "Disbursed") {
              const newRem = Math.max(0, loan.remainingBalance - loan.monthlyDeduction);
              return {
                ...loan,
                remainingBalance: newRem,
                status: newRem <= 0 ? "Fully Recovered" : "Disbursed"
              };
            }
            return loan;
          }));
        }
        return {
          ...p,
          status: "Disbursed",
          disbursedDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          paymentMode: "BY BANK",
          transactionRef: `TXN-${Math.floor(Math.random() * 9e7 + 1e7)}`
        };
      }
      return p;
    }));
    addAuditLog("Disburse Salary", `Accountant initiated bank transfers for month: ${month}`);
    triggerSyncNotification(`\u{1F4B0} Salaries disbursed successfully! Bank APIs reported 100% success rate.`);
    triggerSyncNotification(`\u{1F4E7} Notification sent: Payslips emailed to all active employees.`);
  };
  const setActiveRole = (role) => {
    if (!isAdministratorSession) {
      triggerSyncNotification("Only the administrator can switch roles.");
      return false;
    }
    if (!APP_ROLES.includes(role)) {
      throw new Error(`Unknown application role: ${role}`);
    }
    setActiveRoleState(role);
    addAuditLog("Role Switch", `Switched active workspace session to: ${role}`);
    return true;
  };
  const setAttendanceRecords = (records) => {
    setAttendance(records);
  };
  return /* @__PURE__ */ jsx(StateContext.Provider, { value: {
    theme,
    setTheme: setThemeState,
    activeRole,
    isAdministratorSession,
    setActiveRole,
    companyProfile,
    updateCompanyProfile,
    employees,
    attendance,
    shifts,
    leaves,
    holidays,
    loans,
    payroll,
    auditLogs,
    notifications,
    isLoggedIn,
    login,
    logout,
    personaPhotos,
    updatePersonaPhoto,
    updateUserPassword,
    onboardEmployee,
    getNextEmpCode,
    updateEmployee,
    deleteEmployee,
    clockIn,
    clockOut,
    addShift,
    applyLeave,
    updateLeaveStatus,
    addHoliday,
    applyLoan,
    updateLoanStatus,
    processMonthlyPayroll,
    approveMonthlyPayroll,
    disburseMonthlyPayroll,
    triggerSyncNotification,
    addAuditLog,
    setAttendanceRecords
  }, children });
};
const useAppState = () => {
  const context = useContext(StateContext);
  if (context === void 0) {
    throw new Error("useAppState must be used within a StateProvider");
  }
  return context;
};
export {
  StateProvider,
  useAppState
};
