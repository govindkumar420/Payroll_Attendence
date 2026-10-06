import { jsx, jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { useAppState } from "../context/StateContext";
import { Send, Calendar, CheckSquare, ShieldCheck, XCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { getPermissions, EMPLOYEE_PERSONA_ID, MANAGER_DEPARTMENT } from "../utils/permissions";
const Leaves = () => {
  const { leaves, employees, activeRole, applyLeave, updateLeaveStatus } = useAppState();
  const permissions = getPermissions(activeRole);
  const isEmployee = activeRole === "Employee";
  const isDeptManager = activeRole === "Department Manager";
  const isHR = activeRole === "HR Manager" || activeRole === "Super Admin";
  const isSuperAdmin = activeRole === "Super Admin";
  const isPayroll = activeRole === "Payroll Manager";
  const [empId, setEmpId] = useState(isEmployee ? EMPLOYEE_PERSONA_ID : "");
  const [leaveType, setLeaveType] = useState("Casual");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  React.useEffect(() => {
    if (isEmployee) {
      setEmpId(EMPLOYEE_PERSONA_ID);
    } else if (employees.length > 0 && !empId) {
      setEmpId(employees[0].id);
    }
  }, [activeRole, employees, empId, isEmployee]);
  const handleApply = (e) => {
    e.preventDefault();
    if (!empId || !from || !to) return;
    applyLeave({
      employeeId: empId,
      leaveType,
      fromDate: from,
      toDate: to,
      reason
    });
    setReason("");
    setFrom("");
    setTo("");
    alert("Leave applied successfully! Manager has been notified.");
  };
  const getEmployeeName = (id) => {
    return employees.find((e) => e.id === id)?.name || id;
  };
  const handleApproveManager = (id) => {
    updateLeaveStatus(id, "Approved by Manager");
    confetti({ particleCount: 60, spread: 40, origin: { y: 0.8 } });
  };
  const handleVerifyHR = (id) => {
    updateLeaveStatus(id, "HR Verified");
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.8 } });
  };
  const handleReject = (id) => {
    updateLeaveStatus(id, "Rejected");
  };
  const managerQueue = leaves.filter((l) => {
    if (l.status !== "Pending Approval") return false;
    if (isDeptManager) {
      const emp = employees.find((e) => e.id === l.employeeId);
      return emp?.department === MANAGER_DEPARTMENT;
    }
    return true;
  });
  const hrQueue = leaves.filter((l) => l.status === "Approved by Manager");
  const allHistory = isEmployee ? leaves.filter((l) => l.employeeId === EMPLOYEE_PERSONA_ID || l.employeeId === "EMP-005") : isDeptManager ? leaves.filter((l) => {
    const emp = employees.find((e) => e.id === l.employeeId);
    return emp?.department === MANAGER_DEPARTMENT;
  }) : leaves;
  return /* @__PURE__ */ jsxs("div", { className: "animate-fade-in", style: { display: "flex", flexDirection: "column", gap: "24px" }, children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { style: { fontSize: "20px", fontWeight: 800 }, children: "Leave Desk" }),
      /* @__PURE__ */ jsx("p", { style: { color: "var(--text-secondary)", fontSize: "13px" }, children: "Apply for leave, verify certificates, track approvals, and manage absences." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid-2", style: { gridTemplateColumns: isEmployee ? "1fr 1fr" : "1fr 2fr" }, children: [
      isEmployee || activeRole === "Super Admin" || activeRole === "HR Manager" ? /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "20px" }, children: [
        /* @__PURE__ */ jsx("h3", { style: { fontSize: "16px", fontWeight: 800 }, children: "Apply for Leave" }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleApply, style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Employee Persona" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                value: empId,
                onChange: (e) => setEmpId(e.target.value),
                disabled: isEmployee,
                children: employees.map((e) => /* @__PURE__ */ jsxs("option", { value: e.id, children: [
                  e.name,
                  " (",
                  e.id,
                  ")"
                ] }, e.id))
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Leave Type" }),
            /* @__PURE__ */ jsxs("select", { value: leaveType, onChange: (e) => setLeaveType(e.target.value), children: [
              /* @__PURE__ */ jsx("option", { value: "Casual", children: "Casual Leave" }),
              /* @__PURE__ */ jsx("option", { value: "Sick", children: "Sick Leave" }),
              /* @__PURE__ */ jsx("option", { value: "Paid", children: "Paid Leave" }),
              /* @__PURE__ */ jsx("option", { value: "Earned", children: "Earned Leave" }),
              /* @__PURE__ */ jsx("option", { value: "Maternity", children: "Maternity Leave" }),
              /* @__PURE__ */ jsx("option", { value: "Paternity", children: "Paternity Leave" }),
              /* @__PURE__ */ jsx("option", { value: "LWP", children: "Leave Without Pay (LWP)" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "From Date" }),
              /* @__PURE__ */ jsx("input", { type: "date", required: true, value: from, onChange: (e) => setFrom(e.target.value) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "To Date" }),
              /* @__PURE__ */ jsx("input", { type: "date", required: true, value: to, onChange: (e) => setTo(e.target.value) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Reason for Absence" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                required: true,
                value: reason,
                onChange: (e) => setReason(e.target.value),
                rows: 4,
                placeholder: "Please state details regarding your absence..."
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("button", { type: "submit", className: "btn btn-primary", style: { padding: "12px", width: "100%", fontWeight: 700 }, children: [
            /* @__PURE__ */ jsx(Send, { size: 16 }),
            " Submit Leave Request"
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "16px", background: "var(--bg-secondary)" }, children: [
        /* @__PURE__ */ jsx("h3", { style: { fontSize: "16px", fontWeight: 800 }, children: "Approval Panel" }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", alignItems: "center", background: "var(--primary-light)", padding: "16px", borderRadius: "10px", color: "var(--primary)" }, children: [
          /* @__PURE__ */ jsx(ShieldCheck, { size: 24 }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { style: { fontWeight: 600, display: "block" }, children: "Roster Authority Session" }),
            /* @__PURE__ */ jsxs("p", { style: { fontSize: "11px", color: "var(--text-secondary)" }, children: [
              "You are logged in as ",
              /* @__PURE__ */ jsx("strong", { children: activeRole }),
              ". Verify and approve employee absences below."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: "12px", color: "var(--text-secondary)" }, children: "Employees apply for leaves from their profile pages. Department managers sign off on leaves first, followed by final HR verification for salary updates." })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "24px" }, children: [
        (isDeptManager || isHR || isSuperAdmin) && /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
            /* @__PURE__ */ jsx("h3", { style: { fontSize: "15px", fontWeight: 800 }, children: "Manager Approval Queue (Stage 1)" }),
            /* @__PURE__ */ jsxs("span", { className: "badge badge-warning", children: [
              managerQueue.length,
              " Pending"
            ] })
          ] }),
          managerQueue.length > 0 ? /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "12px" }, children: managerQueue.map((item) => /* @__PURE__ */ jsxs("div", { style: { border: "1px solid var(--border-color)", borderRadius: "10px", padding: "14px", background: "var(--bg-secondary)" }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }, children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { style: { fontWeight: 700, fontSize: "14px" }, children: getEmployeeName(item.employeeId) }),
                /* @__PURE__ */ jsxs("span", { style: { fontSize: "11px", color: "var(--text-muted)", display: "block" }, children: [
                  item.employeeId,
                  " \u2022 Applied ",
                  item.appliedDate
                ] })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "badge badge-info", children: [
                item.leaveType,
                " Leave"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("p", { style: { fontSize: "12px", color: "var(--text-secondary)", margin: "8px 0", borderLeft: "3px solid var(--primary)", paddingLeft: "8px" }, children: [
              '"',
              item.reason,
              '"'
            ] }),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "12px", fontSize: "11px", color: "var(--text-muted)", marginBottom: "10px" }, children: /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "4px" }, children: [
              /* @__PURE__ */ jsx(Calendar, { size: 12 }),
              " ",
              item.fromDate,
              " to ",
              item.toDate
            ] }) }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "flex-end", gap: "10px" }, children: [
              /* @__PURE__ */ jsxs("button", { className: "btn btn-outline", style: { color: "var(--danger)", borderColor: "var(--danger-light)", padding: "6px 12px", fontSize: "12px" }, onClick: () => handleReject(item.id), children: [
                /* @__PURE__ */ jsx(XCircle, { size: 14 }),
                " Reject"
              ] }),
              /* @__PURE__ */ jsxs("button", { className: "btn btn-primary", style: { padding: "6px 12px", fontSize: "12px" }, onClick: () => handleApproveManager(item.id), children: [
                /* @__PURE__ */ jsx(CheckSquare, { size: 14 }),
                " Approve"
              ] })
            ] })
          ] }, item.id)) }) : /* @__PURE__ */ jsx("p", { style: { textAlign: "center", fontSize: "12px", color: "var(--text-muted)", padding: "16px" }, children: "No pending approvals in Manager queue." })
        ] }),
        isHR && /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
            /* @__PURE__ */ jsx("h3", { style: { fontSize: "15px", fontWeight: 800 }, children: "HR Verification Desk (Stage 2)" }),
            /* @__PURE__ */ jsxs("span", { className: "badge badge-success", children: [
              hrQueue.length,
              " Verified"
            ] })
          ] }),
          hrQueue.length > 0 ? /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "12px" }, children: hrQueue.map((item) => /* @__PURE__ */ jsxs("div", { style: { border: "1px solid var(--border-color)", borderRadius: "10px", padding: "14px", background: "var(--bg-secondary)" }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }, children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { style: { fontWeight: 700, fontSize: "14px" }, children: getEmployeeName(item.employeeId) }),
                /* @__PURE__ */ jsxs("span", { style: { fontSize: "11px", color: "var(--text-muted)", display: "block" }, children: [
                  item.employeeId,
                  " \u2022 Stage 1 Approved"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "badge badge-info", children: [
                item.leaveType,
                " Leave"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("p", { style: { fontSize: "12px", color: "var(--text-secondary)", margin: "8px 0", borderLeft: "3px solid var(--success)", paddingLeft: "8px" }, children: [
              '"',
              item.reason,
              '"'
            ] }),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "12px", fontSize: "11px", color: "var(--text-muted)", marginBottom: "10px" }, children: /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "4px" }, children: [
              /* @__PURE__ */ jsx(Calendar, { size: 12 }),
              " ",
              item.fromDate,
              " to ",
              item.toDate
            ] }) }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "flex-end", gap: "10px" }, children: [
              /* @__PURE__ */ jsxs("button", { className: "btn btn-outline", style: { color: "var(--danger)", borderColor: "var(--danger-light)", padding: "6px 12px", fontSize: "12px" }, onClick: () => handleReject(item.id), children: [
                /* @__PURE__ */ jsx(XCircle, { size: 14 }),
                " Decline"
              ] }),
              /* @__PURE__ */ jsxs("button", { className: "btn btn-primary", style: { background: "var(--success)", color: "white", padding: "6px 12px", fontSize: "12px" }, onClick: () => handleVerifyHR(item.id), children: [
                /* @__PURE__ */ jsx(ShieldCheck, { size: 14 }),
                " Verify & Update Attendance"
              ] })
            ] })
          ] }, item.id)) }) : /* @__PURE__ */ jsx("p", { style: { textAlign: "center", fontSize: "12px", color: "var(--text-muted)", padding: "16px" }, children: "No pending verifications in HR queue." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
          /* @__PURE__ */ jsx("h3", { style: { fontSize: "15px", fontWeight: 800 }, children: "Leave Log Registry" }),
          /* @__PURE__ */ jsx("div", { style: { overflowX: "auto", maxHeight: "250px" }, children: /* @__PURE__ */ jsxs("table", { children: [
            /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { children: "Employee" }),
              /* @__PURE__ */ jsx("th", { children: "Leave Type" }),
              /* @__PURE__ */ jsx("th", { children: "Dates" }),
              /* @__PURE__ */ jsx("th", { children: "Status" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { children: allHistory.map((item) => /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsxs("td", { children: [
                /* @__PURE__ */ jsx("span", { style: { fontWeight: 600, display: "block" }, children: getEmployeeName(item.employeeId) }),
                /* @__PURE__ */ jsx("span", { style: { fontSize: "10px", color: "var(--text-muted)" }, children: item.employeeId })
              ] }),
              /* @__PURE__ */ jsx("td", { children: item.leaveType }),
              /* @__PURE__ */ jsxs("td", { style: { fontSize: "12px" }, children: [
                item.fromDate,
                " to ",
                item.toDate
              ] }),
              /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", { className: `badge ${item.status === "HR Verified" ? "badge-success" : item.status === "Approved by Manager" ? "badge-info" : item.status === "Rejected" ? "badge-danger" : "badge-warning"}`, children: item.status }) })
            ] }, item.id)) })
          ] }) })
        ] })
      ] })
    ] })
  ] });
};
export {
  Leaves
};
