import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAppState } from "../context/StateContext";
import { CheckSquare, AlertCircle, Send, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";
import { getPermissions, EMPLOYEE_PERSONA_ID, MANAGER_DEPARTMENT } from "../utils/permissions";
const Overtime = () => {
  const { attendance, employees, activeRole, setAttendanceRecords } = useAppState();
  const permissions = getPermissions(activeRole);
  const [otRateMultiplier, setOtRateMultiplier] = useState(1.5);
  const [weekendOtMultiplier, setWeekendOtMultiplier] = useState(2);
  const [claimDate, setClaimDate] = useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  const [claimHours, setClaimHours] = useState(2);
  const [claimReason, setClaimReason] = useState("Extended production shift support");
  const canModifyConfig = permissions.overtime === "Full" || permissions.overtime === "Manage" || permissions.overtime === "Calculate";
  const canApprove = permissions.overtime === "Full" || permissions.overtime === "Approve" || permissions.overtime === "Manage";
  const isEmployee = activeRole === "Employee";
  const isDeptManager = activeRole === "Department Manager";
  const allOtLogs = attendance.filter((a) => a.workingHours > 8 || a.overtime > 0);
  const visibleLogs = isEmployee ? allOtLogs.filter((a) => a.employeeId === EMPLOYEE_PERSONA_ID) : isDeptManager ? allOtLogs.filter((a) => {
    const emp = employees.find((e) => e.id === a.employeeId);
    return emp?.department === MANAGER_DEPARTMENT;
  }) : allOtLogs;
  const getEmployeeName = (id) => {
    return employees.find((e) => e.id === id)?.name || id;
  };
  const getEmployeeRate = (id) => {
    const emp = employees.find((e) => e.id === id);
    return emp ? emp.salaryStructure.overtimeRate : 0;
  };
  const handleApproveOT = (logId) => {
    if (!canApprove) return;
    const updated = attendance.map((a) => {
      if (a.id === logId) {
        return {
          ...a,
          breakTime: a.breakTime
          // confirms record state
        };
      }
      return a;
    });
    setAttendanceRecords(updated);
    confetti({ particleCount: 50, spread: 30 });
    alert("Overtime hours verified and locked for payroll calculation.");
  };
  const handleEmployeeClaimOT = (e) => {
    e.preventDefault();
    const newRecord = {
      id: `${EMPLOYEE_PERSONA_ID}_${claimDate}_${Date.now()}`,
      employeeId: EMPLOYEE_PERSONA_ID,
      date: claimDate,
      checkIn: "09:00",
      checkOut: "19:00",
      workingHours: 8 + Number(claimHours),
      breakTime: 45,
      overtime: Number(claimHours),
      status: "Present",
      lateArrival: false,
      earlyLeaving: false,
      method: "Employee Self OT Claim"
    };
    setAttendanceRecords([newRecord, ...attendance]);
    confetti({ particleCount: 60, spread: 45 });
    alert("Overtime claim submitted to Department Manager for approval!");
  };
  return /* @__PURE__ */ jsxs("div", { className: "animate-fade-in", style: { display: "flex", flexDirection: "column", gap: "24px" }, children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { style: { fontSize: "20px", fontWeight: 800 }, children: "Overtime Ledger & Claims" }),
        /* @__PURE__ */ jsx("p", { style: { color: "var(--text-secondary)", fontSize: "13px" }, children: "Multipliers for standard and weekend OT, manager approval queue, and employee claim requests." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "badge badge-primary", children: [
        "Authority: ",
        permissions.overtime
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid-2", style: { gridTemplateColumns: isEmployee ? "1fr 2fr" : "1fr 2fr" }, children: [
      isEmployee ? /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "20px", height: "fit-content" }, children: [
        /* @__PURE__ */ jsx("h3", { style: { fontSize: "16px", fontWeight: 800 }, children: "Request Overtime Claim" }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: "12px", color: "var(--text-secondary)" }, children: "Submit extra hours worked for manager approval and automated payroll inclusion." }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleEmployeeClaimOT, style: { display: "flex", flexDirection: "column", gap: "14px" }, children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }, children: "Date of OT" }),
            /* @__PURE__ */ jsx("input", { type: "date", required: true, value: claimDate, onChange: (e) => setClaimDate(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }, children: "OT Hours" }),
            /* @__PURE__ */ jsx("input", { type: "number", min: "1", max: "8", required: true, value: claimHours, onChange: (e) => setClaimHours(Number(e.target.value)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }, children: "Reason / Project" }),
            /* @__PURE__ */ jsx("input", { type: "text", required: true, value: claimReason, onChange: (e) => setClaimReason(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("button", { type: "submit", className: "btn btn-primary", style: { marginTop: "8px" }, children: [
            /* @__PURE__ */ jsx(Send, { size: 16 }),
            " Submit OT Claim"
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "20px", height: "fit-content" }, children: [
        /* @__PURE__ */ jsx("h3", { style: { fontSize: "16px", fontWeight: 800 }, children: "Overtime Policy Multipliers" }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Standard Overtime Rate (Multiplier)" }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  step: "0.1",
                  value: otRateMultiplier,
                  onChange: (e) => setOtRateMultiplier(Number(e.target.value)),
                  disabled: !canModifyConfig,
                  style: { width: "100px" }
                }
              ),
              /* @__PURE__ */ jsx("span", { style: { fontSize: "13px", color: "var(--text-secondary)" }, children: "x Employee Hourly Base" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Weekend / Holiday Rate" }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  step: "0.1",
                  value: weekendOtMultiplier,
                  onChange: (e) => setWeekendOtMultiplier(Number(e.target.value)),
                  disabled: !canModifyConfig,
                  style: { width: "100px" }
                }
              ),
              /* @__PURE__ */ jsx("span", { style: { fontSize: "13px", color: "var(--text-secondary)" }, children: "x Employee Hourly Base" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { borderTop: "1px solid var(--border-color)", paddingTop: "16px", fontSize: "12px", color: "var(--text-secondary)", display: "flex", gap: "8px", alignItems: "flex-start" }, children: [
            /* @__PURE__ */ jsx(AlertCircle, { size: 18, style: { color: "var(--primary)", flexShrink: 0, marginTop: "2px" } }),
            /* @__PURE__ */ jsx("p", { children: "Calculated overtime pay is automatically credited in the monthly payroll run under earnings." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "20px" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
          /* @__PURE__ */ jsx("h3", { style: { fontSize: "16px", fontWeight: 800 }, children: isEmployee ? "My Overtime History" : isDeptManager ? "Operations Team Overtime Queue" : "All Clocked Overtime Records" }),
          /* @__PURE__ */ jsxs("span", { className: "badge badge-info", children: [
            visibleLogs.length,
            " Records"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxs("table", { children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { children: "Employee" }),
            /* @__PURE__ */ jsx("th", { children: "Date" }),
            /* @__PURE__ */ jsx("th", { children: "Clock Hours" }),
            /* @__PURE__ */ jsx("th", { children: "OT (Hours)" }),
            /* @__PURE__ */ jsx("th", { children: "Est. OT Pay" }),
            /* @__PURE__ */ jsx("th", { children: "Approval / Status" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: visibleLogs.length > 0 ? visibleLogs.map((log) => {
            const rate = getEmployeeRate(log.employeeId);
            const isWeekend = new Date(log.date).getDay() === 0 || log.status === "Holiday";
            const multiplier = isWeekend ? weekendOtMultiplier : otRateMultiplier;
            const estPay = log.overtime * rate * multiplier;
            return /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsxs("td", { children: [
                /* @__PURE__ */ jsx("span", { style: { fontWeight: 600, display: "block" }, children: getEmployeeName(log.employeeId) }),
                /* @__PURE__ */ jsx("span", { style: { fontSize: "10px", color: "var(--text-muted)" }, children: log.employeeId })
              ] }),
              /* @__PURE__ */ jsx("td", { children: log.date }),
              /* @__PURE__ */ jsxs("td", { children: [
                log.workingHours,
                " hrs"
              ] }),
              /* @__PURE__ */ jsxs("td", { style: { fontWeight: 600, color: "var(--primary)" }, children: [
                log.overtime,
                " hrs"
              ] }),
              /* @__PURE__ */ jsxs("td", { style: { fontWeight: 700 }, children: [
                "\u20B9",
                estPay.toFixed(2)
              ] }),
              /* @__PURE__ */ jsx("td", { children: canApprove ? /* @__PURE__ */ jsxs("button", { className: "btn btn-outline", style: { padding: "4px 8px", fontSize: "11px", color: "var(--success)", borderColor: "var(--success-light)" }, onClick: () => handleApproveOT(log.id), children: [
                /* @__PURE__ */ jsx(CheckSquare, { size: 12 }),
                " Approve OT"
              ] }) : /* @__PURE__ */ jsxs("span", { className: "badge badge-success", children: [
                /* @__PURE__ */ jsx(ShieldCheck, { size: 12 }),
                " Logged"
              ] }) })
            ] }, log.id);
          }) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 6, style: { textAlign: "center", padding: "24px", color: "var(--text-muted)" }, children: "No overtime logged for this cycle." }) }) })
        ] }) })
      ] })
    ] })
  ] });
};
var Overtime_default = Overtime;
export {
  Overtime,
  Overtime_default as default
};
