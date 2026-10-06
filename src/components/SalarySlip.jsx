import { jsx, jsxs } from "react/jsx-runtime";
import React, { useRef } from "react";
import { Printer, Mail, X, Check, Copy } from "lucide-react";
import { CompanyLogo } from "./CompanyLogo";
const SalarySlip = ({
  payroll,
  employee,
  companyName = "Gnosis Ventures",
  companyAddress = "",
  onClose
}) => {
  const slipRef = useRef(null);
  const formatMonth = (monthStr) => {
    if (!monthStr) return "N/A";
    const parts = monthStr.split("-");
    if (parts.length === 2) {
      const year = parts[0];
      const monthIdx = parseInt(parts[1], 10) - 1;
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${months[monthIdx] || "Jun"}-${year}`;
    }
    return monthStr;
  };
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, "0");
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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
    alert(`Email Dispatch: Salary slip for ${formatMonth(payroll.month)} has been queued to ${employee.email || "employee mailbox"}`);
  };
  const [copied, setCopied] = React.useState(false);
  const handleCopyText = () => {
    const text = `SALARY SLIP - ${companyName}
Month: ${formatMonth(payroll.month)}
Employee: ${employee.name} (${employee.id})
Gross: \u20B9${payroll.earnings.grossSalary}
Net Pay: \u20B9${payroll.netSalary}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  const earnings = payroll.earnings;
  const deductions = payroll.deductions;
  const basicVal = earnings.basic ?? 0;
  const hraVal = earnings.hra ?? 0;
  const otherAllowanceVal = (earnings.specialAllowance ?? 0) + (earnings.da ?? 0) + (earnings.conveyance ?? 0) + (earnings.medical ?? 0) + (earnings.otherAllowance ?? 0);
  const leaveEncashmentVal = earnings.leaveEncashment ?? 0;
  const bonusVal = earnings.bonus ?? 0;
  const otVal = earnings.overtime ?? 0;
  const grossVal = earnings.grossSalary ?? basicVal + hraVal + otherAllowanceVal + leaveEncashmentVal + bonusVal + otVal;
  const pfVal = deductions.pf ?? 0;
  const esicVal = deductions.esi ?? 0;
  const ptVal = deductions.pt ?? 0;
  const lwfVal = deductions.lwf ?? 1;
  const otherDeductionVal = deductions.otherDeduction ?? deductions.latePenalty ?? 0;
  const advanceVal = deductions.advance ?? deductions.loanEmi ?? 0;
  const totalDeductionsVal = deductions.totalDeductions ?? pfVal + esicVal + ptVal + lwfVal + otherDeductionVal + advanceVal;
  const netPaymentVal = payroll.netSalary ?? grossVal - totalDeductionsVal;
  const paymentMode = payroll.paymentMode || "BY BANK";
  const totalDays = payroll.totalDays ?? 30;
  const presentDays = payroll.presentDays ?? 30;
  const leaveDays = payroll.leaveDays ?? 0;
  return /* @__PURE__ */ jsxs("div", { className: "salary-slip-modal-wrapper", children: [
    /* @__PURE__ */ jsxs("div", { className: "no-print salary-slip-action-bar", children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
        /* @__PURE__ */ jsx("span", { style: { fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }, children: "Official Salary Slip Preview:" }),
        /* @__PURE__ */ jsx("span", { className: "badge badge-success", style: { fontSize: "11px" }, children: formatMonth(payroll.month) })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", alignItems: "center" }, children: [
        /* @__PURE__ */ jsxs("button", { className: "btn btn-outline", style: { fontSize: "12px", padding: "6px 12px" }, onClick: handleCopyText, children: [
          copied ? /* @__PURE__ */ jsx(Check, { size: 14 }) : /* @__PURE__ */ jsx(Copy, { size: 14 }),
          " ",
          copied ? "Copied" : "Copy Summary"
        ] }),
        /* @__PURE__ */ jsxs("button", { className: "btn btn-outline", style: { fontSize: "12px", padding: "6px 12px" }, onClick: handleEmail, children: [
          /* @__PURE__ */ jsx(Mail, { size: 14 }),
          " Email"
        ] }),
        /* @__PURE__ */ jsxs("button", { className: "btn btn-primary", style: { fontSize: "12px", padding: "6px 14px" }, onClick: handlePrint, children: [
          /* @__PURE__ */ jsx(Printer, { size: 14 }),
          " Print / Save PDF"
        ] }),
        onClose && /* @__PURE__ */ jsx(
          "button",
          {
            className: "btn btn-secondary",
            style: { padding: "6px", borderRadius: "50%", width: "30px", height: "30px" },
            onClick: onClose,
            title: "Close",
            children: /* @__PURE__ */ jsx(X, { size: 16 })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "salary-slip-page", ref: slipRef, children: /* @__PURE__ */ jsxs("div", { className: "salary-slip-box", children: [
      /* @__PURE__ */ jsxs("div", { className: "salary-slip-header", children: [
        /* @__PURE__ */ jsx("div", { className: "salary-slip-logo-wrapper", children: /* @__PURE__ */ jsx(CompanyLogo, { size: "xl" }) }),
        /* @__PURE__ */ jsxs("div", { className: "salary-slip-company-info", children: [
          /* @__PURE__ */ jsx("h1", { className: "company-title", children: companyName }),
          /* @__PURE__ */ jsx("p", { className: "company-address", children: companyAddress }),
          /* @__PURE__ */ jsxs("h2", { className: "payslip-month-title", children: [
            "Payslip for the Month of \u2013 ",
            formatMonth(payroll.month)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("table", { className: "slip-table emp-info-table", children: /* @__PURE__ */ jsxs("tbody", { children: [
        /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { className: "field-label", style: { width: "20%" }, children: "Employee Code:" }),
          /* @__PURE__ */ jsx("td", { className: "field-value", style: { width: "30%" }, children: employee.id || "N/A" }),
          /* @__PURE__ */ jsx("td", { className: "field-label", style: { width: "22%" }, children: "Location" }),
          /* @__PURE__ */ jsx("td", { className: "field-value", style: { width: "28%" }, children: employee.location || "N/A" })
        ] }),
        /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { className: "field-label", children: "Employee Name:" }),
          /* @__PURE__ */ jsx("td", { className: "field-value", children: employee.name || "N/A" }),
          /* @__PURE__ */ jsx("td", { className: "field-label", children: "Designation:" }),
          /* @__PURE__ */ jsx("td", { className: "field-value", children: employee.designation || "Floor Associate" })
        ] }),
        /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { className: "field-label", children: "Date of Joining:" }),
          /* @__PURE__ */ jsx("td", { className: "field-value", children: formatDate(employee.joiningDate) }),
          /* @__PURE__ */ jsx("td", { className: "field-label", children: "ESIC No.:" }),
          /* @__PURE__ */ jsx("td", { className: "field-value", children: employee.esiNumber || employee.esicNumber || "" })
        ] }),
        /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { className: "field-label", children: "UAN No:" }),
          /* @__PURE__ */ jsx("td", { className: "field-value", children: employee.uanNumber || employee.pfNumber || "101974247470" }),
          /* @__PURE__ */ jsx("td", { className: "field-label", children: "Total Days:" }),
          /* @__PURE__ */ jsx("td", { className: "field-value", children: totalDays })
        ] }),
        /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { className: "field-label", children: "Present Days:" }),
          /* @__PURE__ */ jsx("td", { className: "field-value", children: presentDays }),
          /* @__PURE__ */ jsx("td", { className: "field-label", children: "Leave:" }),
          /* @__PURE__ */ jsx("td", { className: "field-value", children: leaveDays })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("table", { className: "slip-table earnings-deductions-table", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { style: { width: "28%" }, children: "Earning" }),
          /* @__PURE__ */ jsx("th", { style: { width: "22%" }, children: "Amount" }),
          /* @__PURE__ */ jsx("th", { style: { width: "28%" }, children: "Deduction" }),
          /* @__PURE__ */ jsx("th", { style: { width: "22%" }, children: "Amount" })
        ] }) }),
        /* @__PURE__ */ jsxs("tbody", { children: [
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { children: "Basic" }),
            /* @__PURE__ */ jsx("td", { className: "num-cell", children: basicVal > 0 ? basicVal : "0" }),
            /* @__PURE__ */ jsx("td", { children: "PF" }),
            /* @__PURE__ */ jsx("td", { className: "num-cell", children: pfVal > 0 ? pfVal : "0" })
          ] }),
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { children: "House Rent Allowance" }),
            /* @__PURE__ */ jsx("td", { className: "num-cell", children: hraVal > 0 ? hraVal : "0" }),
            /* @__PURE__ */ jsx("td", { children: "ESIC" }),
            /* @__PURE__ */ jsx("td", { className: "num-cell", children: esicVal > 0 ? esicVal : "0" })
          ] }),
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { children: "Other Allowance" }),
            /* @__PURE__ */ jsx("td", { className: "num-cell", children: otherAllowanceVal > 0 ? otherAllowanceVal : "0" }),
            /* @__PURE__ */ jsx("td", { children: "PT" }),
            /* @__PURE__ */ jsx("td", { className: "num-cell", children: ptVal > 0 ? ptVal : "0" })
          ] }),
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { children: "Leave Encashment" }),
            /* @__PURE__ */ jsx("td", { className: "num-cell", children: leaveEncashmentVal > 0 ? leaveEncashmentVal : "0" }),
            /* @__PURE__ */ jsx("td", { children: "LWF" }),
            /* @__PURE__ */ jsx("td", { className: "num-cell", children: lwfVal > 0 ? lwfVal : "0" })
          ] }),
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { children: "Bonus" }),
            /* @__PURE__ */ jsx("td", { className: "num-cell", children: bonusVal > 0 ? bonusVal : "0" }),
            /* @__PURE__ */ jsx("td", { children: "Other Deduction" }),
            /* @__PURE__ */ jsx("td", { className: "num-cell", children: otherDeductionVal > 0 ? otherDeductionVal : "" })
          ] }),
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { children: "OT" }),
            /* @__PURE__ */ jsx("td", { className: "num-cell", children: otVal > 0 ? otVal : "0" }),
            /* @__PURE__ */ jsx("td", { children: "Advance" }),
            /* @__PURE__ */ jsx("td", { className: "num-cell", children: advanceVal > 0 ? advanceVal : "" })
          ] }),
          /* @__PURE__ */ jsxs("tr", { className: "summary-row", children: [
            /* @__PURE__ */ jsx("td", { className: "bold-label", children: "Gross Earning" }),
            /* @__PURE__ */ jsx("td", { className: "num-cell bold-val", children: grossVal }),
            /* @__PURE__ */ jsx("td", { className: "bold-label", children: "Total Deduction" }),
            /* @__PURE__ */ jsx("td", { className: "num-cell bold-val", children: totalDeductionsVal })
          ] }),
          /* @__PURE__ */ jsxs("tr", { className: "net-row", children: [
            /* @__PURE__ */ jsx("td", { className: "bold-label", children: "Net Payment" }),
            /* @__PURE__ */ jsx("td", { className: "num-cell bold-val", children: netPaymentVal }),
            /* @__PURE__ */ jsx("td", { className: "bold-label text-center", colSpan: 1, children: paymentMode }),
            /* @__PURE__ */ jsx("td", {})
          ] })
        ] })
      ] })
    ] }) })
  ] });
};
export {
  SalarySlip
};
