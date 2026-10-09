import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useAppState } from "../context/StateContext";
import {
  Users,
  UserCheck,
  UserMinus,
  DollarSign,
  Calendar,
  ShieldAlert,
  MapPin,
  Clock,
  FileCheck,
  CreditCard,
  CheckCircle2,
  CalendarCheck
} from "lucide-react";
import { CompanyLogo } from "../components/CompanyLogo";
import { EMPLOYEE_PERSONA_ID, MANAGER_DEPARTMENT, getPermissions } from "../utils/permissions";
const Dashboard = () => {
  const { employees, attendance, payroll, leaves, shifts, activeRole, companyProfile, clockIn } = useAppState();
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const activeEmployees = employees.filter((e) => e.status === "Active");
  const permissions = getPermissions(activeRole);
  const todayAtt = attendance.filter((a) => a.date === today);
  const presentCount = todayAtt.filter((a) => a.status === "Present" || a.status === "WFH").length;
  const leaveCount = todayAtt.filter((a) => a.status === "Leave").length;
  const holidayCount = todayAtt.filter((a) => a.status === "Holiday").length;
  const lateCount = todayAtt.filter((a) => a.lateArrival).length;
  const absentCount = Math.max(0, activeEmployees.length - presentCount - leaveCount - holidayCount);
  const totalOtHours = attendance.reduce((sum, rec) => sum + (rec.overtime || 0), 0);
  const activeMonth = new Date().toISOString().slice(0, 7);
  const activeMonthPayroll = payroll.filter((p) => p.month === activeMonth);
  const totalSalaryCost = activeMonthPayroll.reduce((sum, p) => sum + p.netSalary, 0);
  const grossSalaryCost = activeMonthPayroll.reduce((sum, p) => sum + p.earnings.grossSalary, 0);
  const totalPfDeduction = activeMonthPayroll.reduce((sum, p) => sum + (p.deductions?.pf || 0), 0);
  const totalEsicDeduction = activeMonthPayroll.reduce((sum, p) => sum + (p.deductions?.esi || 0), 0);
  const totalPtDeduction = activeMonthPayroll.reduce((sum, p) => sum + (p.deductions?.pt || 0), 0);
  const totalTdsDeduction = activeMonthPayroll.reduce((sum, p) => sum + (p.deductions?.tds || 0), 0);
  const teamEmployees = employees.filter((e) => e.department === MANAGER_DEPARTMENT);
  const teamTodayAtt = todayAtt.filter((a) => {
    const emp = employees.find((e) => e.id === a.employeeId);
    return emp?.department === MANAGER_DEPARTMENT;
  });
  const teamPresent = teamTodayAtt.filter((a) => a.status === "Present" || a.status === "WFH").length;
  const teamPendingLeaves = leaves.filter((l) => {
    if (l.status !== "Pending Approval") return false;
    const emp = employees.find((e) => e.id === l.employeeId);
    return emp?.department === MANAGER_DEPARTMENT;
  });
  const currentEmp = employees.find((e) => e.id === EMPLOYEE_PERSONA_ID) || employees[0];
  const empAttendanceLogs = attendance.filter((a) => a.employeeId === currentEmp?.id);
  const empPresentDays = empAttendanceLogs.filter((a) => a.status === "Present" || a.status === "WFH").length;
  const empTodayRec = todayAtt.find((a) => a.employeeId === currentEmp?.id);
  const empPayrollRec = payroll.find((p) => p.employeeId === currentEmp?.id && p.month === activeMonth);
  const empShift = currentEmp ? shifts.find((s) => s.id === currentEmp.shiftId) || shifts[0] : null;
  const weeklyTrendData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const dateString = date.toISOString().split("T")[0];
    const records = attendance.filter((record) => record.date === dateString);
    return {
      label: date.toLocaleDateString("en", { weekday: "short" }),
      present: records.filter((record) => record.status === "Present" || record.status === "WFH").length,
      absent: records.filter((record) => record.status === "Absent").length
    };
  });
  const depts = employees.reduce((acc, curr) => {
    acc[curr.department] = (acc[curr.department] || 0) + 1;
    return acc;
  }, {});
  const deptData = Object.entries(depts).map(([name, count]) => ({ name, count }));
  const handleEmployeeClockIn = () => {
    if (!currentEmp) return;
    clockIn(currentEmp.id, "Self Web Terminal", currentEmp.location || "");
    alert("Attendance successfully punched for today!");
  };
  if (activeRole === "Employee" && !currentEmp) {
    return <div className="glass-card">No employee profile is linked to this account yet. Ask an administrator to create or assign your employee profile.</div>;
  }
  return /* @__PURE__ */ jsxs("div", { className: "animate-fade-in", style: { display: "flex", flexDirection: "column", gap: "32px" }, children: [
    /* @__PURE__ */ jsxs("div", { className: "glass-card", style: {
      background: "linear-gradient(135deg, #04244c 0%, #063c78 60%, #0e5b32 100%)",
      color: "white",
      border: "1px solid rgba(255, 255, 255, 0.15)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "24px 32px",
      flexWrap: "wrap",
      gap: "20px",
      boxShadow: "0 8px 24px rgba(4, 36, 76, 0.35)"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "20px" }, children: [
        /* @__PURE__ */ jsx("div", { style: { background: "white", padding: "8px", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }, children: /* @__PURE__ */ jsx(CompanyLogo, { size: "lg" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [
            /* @__PURE__ */ jsx("h2", { style: { fontSize: "22px", fontWeight: 900, letterSpacing: "0.5px" }, children: companyProfile.name }),
            /* @__PURE__ */ jsx("span", { className: "badge badge-success", style: { fontSize: "10px", padding: "2px 8px", fontWeight: 700 }, children: "Verified Official" })
          ] }),
          /* @__PURE__ */ jsxs("p", { style: { opacity: 0.9, fontSize: "12px", marginTop: "4px", maxWidth: "600px", display: "flex", alignItems: "center", gap: "6px" }, children: [
            /* @__PURE__ */ jsx(MapPin, { size: 13, style: { color: "#38bdf8", flexShrink: 0 } }),
            companyProfile.address || "Add your company address in Settings."
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "12px", marginTop: "8px", fontSize: "11px", opacity: 0.85 }, children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "\u{1F4CD} Workforce & Payroll Operations"
            ] }),
            /* @__PURE__ */ jsx("span", { children: "\u2022" }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Workforce Roster: ",
              /* @__PURE__ */ jsxs("strong", { children: [
                employees.length,
                " Active Employees"
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.12)", padding: "10px 16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.2)" }, children: [
          /* @__PURE__ */ jsx(Calendar, { size: 18 }),
          /* @__PURE__ */ jsxs("span", { style: { fontWeight: 700, fontSize: "13px" }, children: [
            "Session: ",
            activeRole
          ] })
        ] }),
        /* @__PURE__ */ jsxs("span", { style: { fontSize: "11px", opacity: 0.8 }, children: [
          "Access Scope: ",
          permissions.dashboard,
          " Dashboard"
        ] })
      ] })
    ] }),
    activeRole === "Employee" && /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "24px" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "grid-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", alignItems: "center", gap: "16px" }, children: [
          /* @__PURE__ */ jsx("div", { style: { padding: "12px", borderRadius: "12px", background: "var(--primary-light)", color: "var(--primary)" }, children: /* @__PURE__ */ jsx(Clock, { size: 28 }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { style: { color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600 }, children: "My Monthly Attendance" }),
            /* @__PURE__ */ jsxs("h3", { style: { fontSize: "22px", fontWeight: 800, marginTop: "2px" }, children: [
              empPresentDays,
              " ",
              /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", fontWeight: 500, color: "var(--text-muted)" }, children: "/ 30 Days" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", alignItems: "center", gap: "16px" }, children: [
          /* @__PURE__ */ jsx("div", { style: { padding: "12px", borderRadius: "12px", background: "var(--success-light)", color: "var(--success)" }, children: /* @__PURE__ */ jsx(CalendarCheck, { size: 28 }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { style: { color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600 }, children: "Leave Balance" }),
            /* @__PURE__ */ jsxs("h3", { style: { fontSize: "22px", fontWeight: 800, marginTop: "2px" }, children: [
              "4 ",
              /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", fontWeight: 500, color: "var(--text-muted)" }, children: "Casual \u2022 5 Sick \u2022 12 Earned" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", alignItems: "center", gap: "16px" }, children: [
          /* @__PURE__ */ jsx("div", { style: { padding: "12px", borderRadius: "12px", background: "var(--accent-light)", color: "var(--accent)" }, children: /* @__PURE__ */ jsx(DollarSign, { size: 28 }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { style: { color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600 }, children: "August Payslip (Net)" }),
            /* @__PURE__ */ jsxs("h3", { style: { fontSize: "22px", fontWeight: 800, marginTop: "2px", color: "var(--success)" }, children: [
              "\u20B9",
              (empPayrollRec?.netSalary || currentEmp.salaryStructure.basic).toLocaleString()
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", alignItems: "center", gap: "16px" }, children: [
          /* @__PURE__ */ jsx("div", { style: { padding: "12px", borderRadius: "12px", background: "var(--warning-light)", color: "var(--warning)" }, children: /* @__PURE__ */ jsx(Clock, { size: 28 }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { style: { color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600 }, children: "My Assigned Shift" }),
            /* @__PURE__ */ jsxs("h3", { style: { fontSize: "16px", fontWeight: 800, marginTop: "2px" }, children: [
              empShift.name,
              " (",
              empShift.startTime,
              "-",
              empShift.endTime,
              ")"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid-2", style: { gridTemplateColumns: "1fr 2fr" }, children: [
        /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
          /* @__PURE__ */ jsx("h3", { style: { fontSize: "16px", fontWeight: 800 }, children: "Daily Clock-in Terminal" }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "var(--bg-secondary)", borderRadius: "10px" }, children: [
            /* @__PURE__ */ jsx("img", { src: currentEmp.photoUrl, alt: currentEmp.name, style: { width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover" } }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { fontWeight: 700, fontSize: "14px", display: "block" }, children: currentEmp.name }),
              /* @__PURE__ */ jsxs("span", { style: { fontSize: "11px", color: "var(--text-muted)" }, children: [
                "EMP Code: ",
                currentEmp.id,
                " \u2022 ",
                currentEmp.designation
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "var(--text-secondary)" }, children: "Today's Punch Status:" }),
            /* @__PURE__ */ jsx("div", { style: { marginTop: "6px" }, children: empTodayRec ? /* @__PURE__ */ jsxs("span", { className: "badge badge-success", style: { padding: "6px 12px", fontSize: "12px" }, children: [
              /* @__PURE__ */ jsx(CheckCircle2, { size: 14 }),
              " Checked-in at ",
              empTodayRec.checkIn
            ] }) : /* @__PURE__ */ jsxs("button", { className: "btn btn-primary", style: { width: "100%", padding: "10px" }, onClick: handleEmployeeClockIn, children: [
              /* @__PURE__ */ jsx(Clock, { size: 16 }),
              " Punch Attendance Now"
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
          /* @__PURE__ */ jsx("h3", { style: { fontSize: "16px", fontWeight: 800 }, children: "Recent Attendance & Leave History" }),
          /* @__PURE__ */ jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxs("table", { children: [
            /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { children: "Date" }),
              /* @__PURE__ */ jsx("th", { children: "Check-in" }),
              /* @__PURE__ */ jsx("th", { children: "Check-out" }),
              /* @__PURE__ */ jsx("th", { children: "Work Hours" }),
              /* @__PURE__ */ jsx("th", { children: "Status" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { children: empAttendanceLogs.slice(0, 5).map((log) => /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { style: { fontWeight: 600 }, children: log.date }),
              /* @__PURE__ */ jsx("td", { children: log.checkIn || "-" }),
              /* @__PURE__ */ jsx("td", { children: log.checkOut || "-" }),
              /* @__PURE__ */ jsx("td", { children: log.workingHours ? `${log.workingHours} hrs` : "-" }),
              /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", { className: `badge ${log.status === "Present" ? "badge-success" : log.status === "Leave" ? "badge-warning" : "badge-danger"}`, children: log.status }) })
            ] }, log.id)) })
          ] }) })
        ] })
      ] })
    ] }),
    activeRole === "Accountant" && /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "24px" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "grid-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", alignItems: "center", gap: "16px" }, children: [
          /* @__PURE__ */ jsx("div", { style: { padding: "12px", borderRadius: "12px", background: "var(--primary-light)", color: "var(--primary)" }, children: /* @__PURE__ */ jsx(DollarSign, { size: 28 }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { style: { color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600 }, children: "Gross Payroll Liability" }),
            /* @__PURE__ */ jsxs("h3", { style: { fontSize: "22px", fontWeight: 800, marginTop: "2px" }, children: [
              "\u20B9",
              grossSalaryCost.toLocaleString()
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", alignItems: "center", gap: "16px" }, children: [
          /* @__PURE__ */ jsx("div", { style: { padding: "12px", borderRadius: "12px", background: "var(--success-light)", color: "var(--success)" }, children: /* @__PURE__ */ jsx(CreditCard, { size: 28 }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { style: { color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600 }, children: "Net Bank Payout" }),
            /* @__PURE__ */ jsxs("h3", { style: { fontSize: "22px", fontWeight: 800, marginTop: "2px", color: "var(--success)" }, children: [
              "\u20B9",
              totalSalaryCost.toLocaleString()
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", alignItems: "center", gap: "16px" }, children: [
          /* @__PURE__ */ jsx("div", { style: { padding: "12px", borderRadius: "12px", background: "var(--warning-light)", color: "var(--warning)" }, children: /* @__PURE__ */ jsx(FileCheck, { size: 28 }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { style: { color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600 }, children: "PF & ESIC Challans" }),
            /* @__PURE__ */ jsxs("h3", { style: { fontSize: "22px", fontWeight: 800, marginTop: "2px" }, children: [
              "\u20B9",
              (totalPfDeduction + totalEsicDeduction).toLocaleString()
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", alignItems: "center", gap: "16px" }, children: [
          /* @__PURE__ */ jsx("div", { style: { padding: "12px", borderRadius: "12px", background: "var(--accent-light)", color: "var(--accent)" }, children: /* @__PURE__ */ jsx(ShieldAlert, { size: 28 }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { style: { color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600 }, children: "TDS / Tax Deductions" }),
            /* @__PURE__ */ jsxs("h3", { style: { fontSize: "22px", fontWeight: 800, marginTop: "2px" }, children: [
              "\u20B9",
              totalTdsDeduction.toLocaleString()
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
        /* @__PURE__ */ jsx("h3", { style: { fontSize: "16px", fontWeight: 800 }, children: "August 2026 Statutory & Compliance Summary" }),
        /* @__PURE__ */ jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxs("table", { children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { children: "Statutory Component" }),
            /* @__PURE__ */ jsx("th", { children: "Statutory Rate" }),
            /* @__PURE__ */ jsx("th", { children: "Total Deductions (\u20B9)" }),
            /* @__PURE__ */ jsx("th", { children: "Employer Share (\u20B9)" }),
            /* @__PURE__ */ jsx("th", { children: "Challan Status" })
          ] }) }),
          /* @__PURE__ */ jsxs("tbody", { children: [
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { style: { fontWeight: 700 }, children: "Employee Provident Fund (EPF)" }),
              /* @__PURE__ */ jsx("td", { children: "12% of Basic" }),
              /* @__PURE__ */ jsxs("td", { style: { fontWeight: 600 }, children: [
                "\u20B9",
                totalPfDeduction.toLocaleString()
              ] }),
              /* @__PURE__ */ jsxs("td", { style: { fontWeight: 600 }, children: [
                "\u20B9",
                totalPfDeduction.toLocaleString()
              ] }),
              /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", { className: "badge badge-success", children: "Ready for ECR Filing" }) })
            ] }),
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { style: { fontWeight: 700 }, children: "Employee State Insurance (ESIC)" }),
              /* @__PURE__ */ jsx("td", { children: "0.75% / 3.25%" }),
              /* @__PURE__ */ jsxs("td", { style: { fontWeight: 600 }, children: [
                "\u20B9",
                totalEsicDeduction.toLocaleString()
              ] }),
              /* @__PURE__ */ jsxs("td", { style: { fontWeight: 600 }, children: [
                "\u20B9",
                (totalEsicDeduction * 4.33).toFixed(0)
              ] }),
              /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", { className: "badge badge-success", children: "Monthly Return Prepared" }) })
            ] }),
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { style: { fontWeight: 700 }, children: "Professional Tax (PT - Gujarat)" }),
              /* @__PURE__ */ jsx("td", { children: "Slab Based (\u20B9200/mo)" }),
              /* @__PURE__ */ jsxs("td", { style: { fontWeight: 600 }, children: [
                "\u20B9",
                totalPtDeduction.toLocaleString()
              ] }),
              /* @__PURE__ */ jsx("td", { children: "-" }),
              /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", { className: "badge badge-success", children: "Commercial Tax Form 5" }) })
            ] }),
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { style: { fontWeight: 700 }, children: "Income Tax TDS (Section 192)" }),
              /* @__PURE__ */ jsx("td", { children: "As per New/Old Slab" }),
              /* @__PURE__ */ jsxs("td", { style: { fontWeight: 600 }, children: [
                "\u20B9",
                totalTdsDeduction.toLocaleString()
              ] }),
              /* @__PURE__ */ jsx("td", { children: "-" }),
              /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", { className: "badge badge-info", children: "24Q Quarterly Schedule" }) })
            ] })
          ] })
        ] }) })
      ] })
    ] }),
    activeRole === "Department Manager" && /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "24px" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "grid-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", alignItems: "center", gap: "16px" }, children: [
          /* @__PURE__ */ jsx("div", { style: { padding: "12px", borderRadius: "12px", background: "var(--primary-light)", color: "var(--primary)" }, children: /* @__PURE__ */ jsx(Users, { size: 28 }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { style: { color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600 }, children: "Operations Team Roster" }),
            /* @__PURE__ */ jsxs("h3", { style: { fontSize: "22px", fontWeight: 800, marginTop: "2px" }, children: [
              teamEmployees.length,
              " Employees"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", alignItems: "center", gap: "16px" }, children: [
          /* @__PURE__ */ jsx("div", { style: { padding: "12px", borderRadius: "12px", background: "var(--success-light)", color: "var(--success)" }, children: /* @__PURE__ */ jsx(UserCheck, { size: 28 }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { style: { color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600 }, children: "Team Present Today" }),
            /* @__PURE__ */ jsxs("h3", { style: { fontSize: "22px", fontWeight: 800, marginTop: "2px" }, children: [
              teamPresent,
              " ",
              /* @__PURE__ */ jsxs("span", { style: { fontSize: "12px", fontWeight: 500, color: "var(--text-muted)" }, children: [
                "/ ",
                teamEmployees.length
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", alignItems: "center", gap: "16px" }, children: [
          /* @__PURE__ */ jsx("div", { style: { padding: "12px", borderRadius: "12px", background: "var(--warning-light)", color: "var(--warning)" }, children: /* @__PURE__ */ jsx(CalendarCheck, { size: 28 }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { style: { color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600 }, children: "Pending Leave Approvals" }),
            /* @__PURE__ */ jsxs("h3", { style: { fontSize: "22px", fontWeight: 800, marginTop: "2px", color: "var(--warning)" }, children: [
              teamPendingLeaves.length,
              " Requests"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", alignItems: "center", gap: "16px" }, children: [
          /* @__PURE__ */ jsx("div", { style: { padding: "12px", borderRadius: "12px", background: "var(--accent-light)", color: "var(--accent)" }, children: /* @__PURE__ */ jsx(Clock, { size: 28 }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { style: { color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600 }, children: "Team OT Logged" }),
            /* @__PURE__ */ jsxs("h3", { style: { fontSize: "22px", fontWeight: 800, marginTop: "2px" }, children: [
              totalOtHours,
              " hrs"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
        /* @__PURE__ */ jsx("h3", { style: { fontSize: "16px", fontWeight: 800 }, children: "Operations Department Team Roster" }),
        /* @__PURE__ */ jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxs("table", { children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { children: "Employee Name" }),
            /* @__PURE__ */ jsx("th", { children: "Code" }),
            /* @__PURE__ */ jsx("th", { children: "Designation" }),
            /* @__PURE__ */ jsx("th", { children: "Location" }),
            /* @__PURE__ */ jsx("th", { children: "Status" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: teamEmployees.slice(0, 8).map((emp) => /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [
              /* @__PURE__ */ jsx("img", { src: emp.photoUrl, alt: emp.name, style: { width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" } }),
              /* @__PURE__ */ jsx("span", { style: { fontWeight: 600 }, children: emp.name })
            ] }) }),
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", { className: "badge badge-info", children: emp.id }) }),
            /* @__PURE__ */ jsx("td", { children: emp.designation }),
            /* @__PURE__ */ jsx("td", { children: emp.location }),
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", { className: "badge badge-success", children: emp.status }) })
          ] }, emp.id)) })
        ] }) })
      ] })
    ] }),
    (activeRole === "Super Admin" || activeRole === "HR Manager" || activeRole === "Payroll Manager") && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "grid-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", alignItems: "center", gap: "20px" }, children: [
          /* @__PURE__ */ jsx("div", { style: { padding: "12px", borderRadius: "12px", background: "var(--primary-light)", color: "var(--primary)" }, children: /* @__PURE__ */ jsx(Users, { size: 28 }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { style: { color: "var(--text-secondary)", fontSize: "13px", fontWeight: 500 }, children: "Total Employees" }),
            /* @__PURE__ */ jsx("h3", { style: { fontSize: "24px", fontWeight: 800, marginTop: "4px" }, children: employees.length })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", alignItems: "center", gap: "20px" }, children: [
          /* @__PURE__ */ jsx("div", { style: { padding: "12px", borderRadius: "12px", background: "var(--success-light)", color: "var(--success)" }, children: /* @__PURE__ */ jsx(UserCheck, { size: 28 }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { style: { color: "var(--text-secondary)", fontSize: "13px", fontWeight: 500 }, children: "Present Today" }),
            /* @__PURE__ */ jsxs("h3", { style: { fontSize: "24px", fontWeight: 800, marginTop: "4px" }, children: [
              presentCount,
              " ",
              /* @__PURE__ */ jsxs("span", { style: { fontSize: "13px", fontWeight: 500, color: "var(--text-muted)" }, children: [
                "/ ",
                activeEmployees.length
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", alignItems: "center", gap: "20px" }, children: [
          /* @__PURE__ */ jsx("div", { style: { padding: "12px", borderRadius: "12px", background: "var(--warning-light)", color: "var(--warning)" }, children: /* @__PURE__ */ jsx(UserMinus, { size: 28 }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { style: { color: "var(--text-secondary)", fontSize: "13px", fontWeight: 500 }, children: "On Leave / Absent" }),
            /* @__PURE__ */ jsxs("h3", { style: { fontSize: "24px", fontWeight: 800, marginTop: "4px" }, children: [
              leaveCount,
              " ",
              /* @__PURE__ */ jsx("span", { style: { fontSize: "13px", fontWeight: 500, color: "var(--text-muted)" }, children: "LV" }),
              /* @__PURE__ */ jsxs("span", { style: { fontSize: "16px", fontWeight: 500, color: "var(--danger)", marginLeft: "12px" }, children: [
                absentCount,
                " ABS"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", alignItems: "center", gap: "20px" }, children: [
          /* @__PURE__ */ jsx("div", { style: { padding: "12px", borderRadius: "12px", background: "var(--accent-light)", color: "var(--accent)" }, children: /* @__PURE__ */ jsx(DollarSign, { size: 28 }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { style: { color: "var(--text-secondary)", fontSize: "13px", fontWeight: 500 }, children: "August Net Payout" }),
            /* @__PURE__ */ jsxs("h3", { style: { fontSize: "24px", fontWeight: 800, marginTop: "4px" }, children: [
              "\u20B9",
              totalSalaryCost > 0 ? totalSalaryCost.toLocaleString() : "0.00"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid-2", style: { gridTemplateColumns: "3fr 2fr" }, children: [
        /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "20px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
            /* @__PURE__ */ jsx("h3", { style: { fontSize: "16px", fontWeight: 700 }, children: "Attendance Trends (7-Day Cycle)" }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "16px", fontSize: "12px" }, children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [
                /* @__PURE__ */ jsx("div", { style: { width: "12px", height: "12px", borderRadius: "3px", background: "var(--primary)" } }),
                /* @__PURE__ */ jsx("span", { style: { color: "var(--text-secondary)" }, children: "Present / WFH" })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [
                /* @__PURE__ */ jsx("div", { style: { width: "12px", height: "12px", borderRadius: "3px", background: "var(--danger-light)" } }),
                /* @__PURE__ */ jsx("span", { style: { color: "var(--text-secondary)" }, children: "Absent" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { width: "100%", height: "220px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "10px 10px 30px 10px", borderBottom: "1px solid var(--border-color)", position: "relative" }, children: [
            /* @__PURE__ */ jsx("div", { style: { position: "absolute", bottom: "70px", left: 0, right: 0, height: "1px", borderBottom: "1px dashed var(--border-color)", pointerEvents: "none" } }),
            /* @__PURE__ */ jsx("div", { style: { position: "absolute", bottom: "130px", left: 0, right: 0, height: "1px", borderBottom: "1px dashed var(--border-color)", pointerEvents: "none" } }),
            /* @__PURE__ */ jsx("div", { style: { position: "absolute", bottom: "190px", left: 0, right: 0, height: "1px", borderBottom: "1px dashed var(--border-color)", pointerEvents: "none" } }),
            weeklyTrendData.map((data, index) => {
              const max = 60;
              const presentHeight = data.present / max * 160;
              const absentHeight = data.absent / max * 160;
              return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flexGrow: 1, height: "100%", justifyContent: "flex-end" }, children: [
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "6px", alignItems: "flex-end", height: "160px" }, children: [
                  /* @__PURE__ */ jsx("div", { style: {
                    width: "20px",
                    height: `${Math.max(4, presentHeight)}px`,
                    background: "linear-gradient(to top, var(--primary) 0%, var(--accent) 100%)",
                    borderRadius: "4px 4px 0 0",
                    transition: "height 0.5s ease"
                  }, title: `Present: ${data.present}` }),
                  /* @__PURE__ */ jsx("div", { style: {
                    width: "20px",
                    height: `${Math.max(0, absentHeight)}px`,
                    background: "var(--danger-light)",
                    border: "1px solid var(--danger)",
                    borderRadius: "4px 4px 0 0",
                    transition: "height 0.5s ease"
                  }, title: `Absent: ${data.absent}` })
                ] }),
                /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)" }, children: data.label })
              ] }, index);
            })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "20px" }, children: [
          /* @__PURE__ */ jsx("h3", { style: { fontSize: "16px", fontWeight: 700 }, children: "Department Roster" }),
          /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: deptData.map((dept, index) => {
            const colors = ["var(--primary)", "var(--accent)", "var(--success)", "var(--warning)", "var(--danger)"];
            const col = colors[index % colors.length];
            const pct = dept.count / employees.length * 100;
            return /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }, children: [
                /* @__PURE__ */ jsx("span", { style: { fontWeight: 600, fontSize: "13px" }, children: dept.name }),
                /* @__PURE__ */ jsxs("span", { style: { fontSize: "12px", color: "var(--text-secondary)" }, children: [
                  dept.count,
                  " ",
                  dept.count === 1 ? "employee" : "employees",
                  " (",
                  Math.round(pct),
                  "%)"
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { style: { width: "100%", height: "8px", background: "var(--border-color)", borderRadius: "4px", overflow: "hidden" }, children: /* @__PURE__ */ jsx("div", { style: { width: `${pct}%`, height: "100%", background: col, borderRadius: "4px" } }) })
            ] }, index);
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "20px" }, children: [
          /* @__PURE__ */ jsx("h3", { style: { fontSize: "16px", fontWeight: 700 }, children: "Role-based Workflows" }),
          /* @__PURE__ */ jsx("p", { style: { color: "var(--text-secondary)", fontSize: "13px" }, children: "Choose a demo role when opening a local session to explore these workflows:" }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "12px", marginTop: "4px" }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
              /* @__PURE__ */ jsx("div", { style: { width: "28px", height: "28px", borderRadius: "50%", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "12px" }, children: "1" }),
              /* @__PURE__ */ jsxs("div", { style: { flexGrow: 1 }, children: [
                /* @__PURE__ */ jsx("span", { style: { fontWeight: 600 }, children: "Employee Clock-in & Leaves" }),
                /* @__PURE__ */ jsx("p", { style: { fontSize: "12px", color: "var(--text-muted)" }, children: "Apply for leaves or clock-in daily" })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "badge badge-info", children: "Employee" })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
              /* @__PURE__ */ jsx("div", { style: { width: "28px", height: "28px", borderRadius: "50%", background: "var(--success-light)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "12px" }, children: "2" }),
              /* @__PURE__ */ jsxs("div", { style: { flexGrow: 1 }, children: [
                /* @__PURE__ */ jsx("span", { style: { fontWeight: 600 }, children: "Manager Approval" }),
                /* @__PURE__ */ jsx("p", { style: { fontSize: "12px", color: "var(--text-muted)" }, children: "Approve leaves and manage shift schedules" })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "badge badge-success", children: "Manager" })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
              /* @__PURE__ */ jsx("div", { style: { width: "28px", height: "28px", borderRadius: "50%", background: "var(--warning-light)", color: "var(--warning)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "12px" }, children: "3" }),
              /* @__PURE__ */ jsxs("div", { style: { flexGrow: 1 }, children: [
                /* @__PURE__ */ jsx("span", { style: { fontWeight: 600 }, children: "HR Verification & Payroll Calc" }),
                /* @__PURE__ */ jsx("p", { style: { fontSize: "12px", color: "var(--text-muted)" }, children: "Verify records, setup taxes and process monthly payslip runs" })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "badge badge-warning", children: "HR Manager" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "20px" }, children: [
          /* @__PURE__ */ jsx("h3", { style: { fontSize: "16px", fontWeight: 700 }, children: "Demo Integrations (Not Connected)" }),
          /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }, children: [
            /* @__PURE__ */ jsxs("div", { style: { border: "1px solid var(--border-color)", padding: "12px", borderRadius: "10px", display: "flex", alignItems: "center", gap: "12px" }, children: [
              /* @__PURE__ */ jsx("div", { style: { width: "8px", height: "8px", borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 8px var(--success)" } }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { style: { fontWeight: 600, fontSize: "12px", display: "block" }, children: "Biometric RFID Device" }),
                /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", color: "var(--text-muted)" }, children: "Demo only · no device connected" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { border: "1px solid var(--border-color)", padding: "12px", borderRadius: "10px", display: "flex", alignItems: "center", gap: "12px" }, children: [
              /* @__PURE__ */ jsx("div", { style: { width: "8px", height: "8px", borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 8px var(--success)" } }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { style: { fontWeight: 600, fontSize: "12px", display: "block" }, children: "Bank Transfer API" }),
                /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", color: "var(--text-muted)" }, children: "Demo only · no bank connected" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { border: "1px solid var(--border-color)", padding: "12px", borderRadius: "10px", display: "flex", alignItems: "center", gap: "12px" }, children: [
              /* @__PURE__ */ jsx("div", { style: { width: "8px", height: "8px", borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 8px var(--success)" } }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { style: { fontWeight: 600, fontSize: "12px", display: "block" }, children: "Email/SMS Gateway" }),
                /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", color: "var(--text-muted)" }, children: "Demo only · no messaging service connected" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { border: "1px solid var(--border-color)", padding: "12px", borderRadius: "10px", display: "flex", alignItems: "center", gap: "12px" }, children: [
              /* @__PURE__ */ jsx("div", { style: { width: "8px", height: "8px", borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 8px var(--success)" } }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { style: { fontWeight: 600, fontSize: "12px", display: "block" }, children: "Accounting Sync" }),
                /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", color: "var(--text-muted)" }, children: "Demo only · no accounting system connected" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { background: "var(--danger-light)", border: "1px solid var(--danger)", padding: "12px", borderRadius: "10px", display: "flex", gap: "10px", alignItems: "flex-start" }, children: [
            /* @__PURE__ */ jsx(ShieldAlert, { size: 20, color: "var(--danger)", style: { marginTop: "2px", flexShrink: 0 } }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { fontWeight: 600, color: "var(--danger)", fontSize: "12px" }, children: "Local Demo Storage" }),
              /* @__PURE__ */ jsx("p", { style: { fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }, children: "Data is stored in this browser only. Demo roles do not provide authentication or protect sensitive payroll data." })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
};
var Dashboard_default = Dashboard;
export {
  Dashboard,
  Dashboard_default as default
};
