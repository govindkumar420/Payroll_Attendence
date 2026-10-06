import { jsx, jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { useAppState } from "../context/StateContext";
import { Landmark, CheckSquare, XCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { getPermissions, EMPLOYEE_PERSONA_ID } from "../utils/permissions";
const Loans = () => {
  const { loans, employees, activeRole, applyLoan, updateLoanStatus } = useAppState();
  const permissions = getPermissions(activeRole);
  const isEmployee = activeRole === "Employee";
  const canApprove = permissions.loanAndAdvance === "Full" || permissions.loanAndAdvance === "Manage";
  const canApply = permissions.loanAndAdvance === "Full" || permissions.loanAndAdvance === "Manage" || permissions.loanAndAdvance === "Request";
  const [empId, setEmpId] = useState(isEmployee ? EMPLOYEE_PERSONA_ID : "");
  const [loanType, setLoanType] = useState("Salary Advance");
  const [amount, setAmount] = useState(1e3);
  const [emis, setEmis] = useState(4);
  React.useEffect(() => {
    if (isEmployee) {
      setEmpId(EMPLOYEE_PERSONA_ID);
    } else if (employees.length > 0 && !empId) {
      setEmpId(employees[0].id);
    }
  }, [activeRole, employees, empId, isEmployee]);
  const handleApply = (e) => {
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
    alert("Application submitted successfully! HR & Management will review.");
  };
  const getEmployeeName = (id) => {
    return employees.find((e) => e.id === id)?.name || id;
  };
  const handleApprove = (id) => {
    if (!canApprove) return;
    updateLoanStatus(id, "Disbursed");
    confetti({ particleCount: 50, spread: 40 });
  };
  const handleReject = (id) => {
    if (!canApprove) return;
    updateLoanStatus(id, "Rejected");
  };
  const scopedLoans = isEmployee ? loans.filter((l) => l.employeeId === EMPLOYEE_PERSONA_ID) : loans;
  const activeLoans = scopedLoans.filter((l) => l.status === "Disbursed");
  const pendingLoans = scopedLoans.filter((l) => l.status === "Pending");
  return /* @__PURE__ */ jsxs("div", { className: "animate-fade-in", style: { display: "flex", flexDirection: "column", gap: "24px" }, children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { style: { fontSize: "20px", fontWeight: 800 }, children: "Loans & Salary Advances" }),
      /* @__PURE__ */ jsx("p", { style: { color: "var(--text-secondary)", fontSize: "13px" }, children: "On-demand salary advances, corporate loans, and automated EMI recovery structures." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "20px", height: "fit-content" }, children: [
        /* @__PURE__ */ jsx("h3", { style: { fontSize: "16px", fontWeight: 800 }, children: "Request Credit Advance" }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleApply, style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Employee Persona" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                value: empId,
                onChange: (e) => setEmpId(e.target.value),
                disabled: activeRole === "Employee",
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
            /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Credit Type" }),
            /* @__PURE__ */ jsxs("select", { value: loanType, onChange: (e) => setLoanType(e.target.value), children: [
              /* @__PURE__ */ jsx("option", { value: "Salary Advance", children: "Salary Advance (Short Term recovery)" }),
              /* @__PURE__ */ jsx("option", { value: "Loan", children: "Long Term Personal Loan" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Requested Amount ($)" }),
              /* @__PURE__ */ jsx("input", { type: "number", required: true, value: amount, onChange: (e) => setAmount(Number(e.target.value)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Installments (Months)" }),
              /* @__PURE__ */ jsx("input", { type: "number", required: true, value: emis, onChange: (e) => setEmis(Number(e.target.value)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { background: "var(--bg-secondary)", padding: "14px", borderRadius: "10px", fontSize: "12px", border: "1px dashed var(--border-color)" }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "4px" }, children: [
              /* @__PURE__ */ jsx("span", { children: "Monthly Recovery (EMI):" }),
              /* @__PURE__ */ jsxs("strong", { children: [
                "$",
                amount > 0 && emis > 0 ? Math.round(amount / emis) : 0,
                " / mo"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
              /* @__PURE__ */ jsx("span", { children: "Interest Rate:" }),
              /* @__PURE__ */ jsx("strong", { style: { color: "var(--success)" }, children: "0% (Corporate Benefit)" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("button", { type: "submit", className: "btn btn-primary", style: { padding: "12px", width: "100%", fontWeight: 700 }, children: [
            /* @__PURE__ */ jsx(Landmark, { size: 16 }),
            " Submit Credit Application"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "24px" }, children: [
        canApprove && /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
          /* @__PURE__ */ jsx("h3", { style: { fontSize: "15px", fontWeight: 800 }, children: "Finance Review Desk" }),
          pendingLoans.length > 0 ? /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "12px" }, children: pendingLoans.map((item) => /* @__PURE__ */ jsxs("div", { style: { border: "1px solid var(--border-color)", borderRadius: "10px", padding: "14px", background: "var(--bg-secondary)" }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }, children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("strong", { style: { display: "block" }, children: getEmployeeName(item.employeeId) }),
                /* @__PURE__ */ jsxs("span", { style: { fontSize: "11px", color: "var(--text-muted)" }, children: [
                  item.employeeId,
                  " \u2022 Requested ",
                  item.appliedDate
                ] })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "badge badge-info", children: item.type })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", fontSize: "12px", margin: "12px 0", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)", padding: "8px 0" }, children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)", display: "block", fontSize: "10px" }, children: "Total Capital" }),
                /* @__PURE__ */ jsxs("strong", { children: [
                  "$",
                  item.amount
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)", display: "block", fontSize: "10px" }, children: "Tenure" }),
                /* @__PURE__ */ jsxs("strong", { children: [
                  item.emis,
                  " Months"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)", display: "block", fontSize: "10px" }, children: "Monthly EMI" }),
                /* @__PURE__ */ jsxs("strong", { children: [
                  "$",
                  item.monthlyDeduction
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "flex-end", gap: "10px" }, children: [
              /* @__PURE__ */ jsxs("button", { className: "btn btn-outline", style: { color: "var(--danger)", borderColor: "var(--danger-light)", padding: "6px 12px", fontSize: "12px" }, onClick: () => handleReject(item.id), children: [
                /* @__PURE__ */ jsx(XCircle, { size: 14 }),
                " Decline"
              ] }),
              /* @__PURE__ */ jsxs("button", { className: "btn btn-primary", style: { padding: "6px 12px", fontSize: "12px" }, onClick: () => handleApprove(item.id), children: [
                /* @__PURE__ */ jsx(CheckSquare, { size: 14 }),
                " Approve & Disburse"
              ] })
            ] })
          ] }, item.id)) }) : /* @__PURE__ */ jsx("p", { style: { textAlign: "center", fontSize: "12px", color: "var(--text-muted)", padding: "16px" }, children: "No pending loans requiring review." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
          /* @__PURE__ */ jsx("h3", { style: { fontSize: "15px", fontWeight: 800 }, children: "Active Repayment Ledgers" }),
          activeLoans.length > 0 ? /* @__PURE__ */ jsx("div", { style: { overflowX: "auto", maxHeight: "250px" }, children: /* @__PURE__ */ jsxs("table", { children: [
            /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { children: "Employee" }),
              /* @__PURE__ */ jsx("th", { children: "Type" }),
              /* @__PURE__ */ jsx("th", { children: "Total Loan" }),
              /* @__PURE__ */ jsx("th", { children: "EMI Recovery" }),
              /* @__PURE__ */ jsx("th", { children: "Remaining Balance" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { children: activeLoans.map((item) => /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsxs("td", { children: [
                /* @__PURE__ */ jsx("span", { style: { fontWeight: 600, display: "block" }, children: getEmployeeName(item.employeeId) }),
                /* @__PURE__ */ jsx("span", { style: { fontSize: "10px", color: "var(--text-muted)" }, children: item.employeeId })
              ] }),
              /* @__PURE__ */ jsx("td", { children: item.type }),
              /* @__PURE__ */ jsxs("td", { style: { fontWeight: 600 }, children: [
                "$",
                item.amount
              ] }),
              /* @__PURE__ */ jsxs("td", { style: { color: "var(--danger)" }, children: [
                "-$",
                item.monthlyDeduction,
                "/mo"
              ] }),
              /* @__PURE__ */ jsxs("td", { style: { fontWeight: 800, color: "var(--primary)" }, children: [
                "$",
                item.remainingBalance,
                item.remainingBalance <= 0 && /* @__PURE__ */ jsx("span", { className: "badge badge-success", style: { marginLeft: "8px", fontSize: "9px" }, children: "Recovered" })
              ] })
            ] }, item.id)) })
          ] }) }) : /* @__PURE__ */ jsx("p", { style: { textAlign: "center", fontSize: "12px", color: "var(--text-muted)", padding: "16px" }, children: "No active loans in recovery mode." })
        ] })
      ] })
    ] })
  ] });
};
export {
  Loans
};
