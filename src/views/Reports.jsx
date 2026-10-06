import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useAppState } from "../context/StateContext";
import { Download, Printer } from "lucide-react";
import { SalarySlip } from "../components/SalarySlip";
import { getPermissions, filterEmployeesByRole, EMPLOYEE_PERSONA_ID } from "../utils/permissions";
const Reports = () => {
  const { employees, payroll, attendance, companyProfile, activeRole } = useAppState();
  const permissions = getPermissions(activeRole);
  const isEmployee = activeRole === "Employee";
  const allowedTabs = [];
  if (activeRole === "Super Admin") {
    allowedTabs.push(
      { id: "attendance", label: "Attendance Audit" },
      { id: "payroll", label: "Payroll Summary" },
      { id: "statutory", label: "PF / ESI / TDS" },
      { id: "bank", label: "Bank Transfer Log" }
    );
  } else if (activeRole === "HR Manager") {
    allowedTabs.push(
      { id: "attendance", label: "HR Attendance Audit" },
      { id: "statutory", label: "PF / ESI Compliance" }
    );
  } else if (activeRole === "Payroll Manager") {
    allowedTabs.push(
      { id: "payroll", label: "Payroll Summary" },
      { id: "statutory", label: "PF / ESI / TDS Reports" },
      { id: "bank", label: "Bank Transfer Payouts" }
    );
  } else if (activeRole === "Department Manager") {
    allowedTabs.push(
      { id: "attendance", label: "Team Attendance Register" }
    );
  } else if (activeRole === "Accountant") {
    allowedTabs.push(
      { id: "payroll", label: "Financial Payroll Summary" },
      { id: "statutory", label: "Tax & TDS Ledgers" },
      { id: "bank", label: "Bank Transfer Register" }
    );
  } else {
    allowedTabs.push(
      { id: "attendance", label: "My Attendance History" },
      { id: "payroll", label: "My Salary Records" }
    );
  }
  const [activeReportTab, setActiveReportTab] = useState(allowedTabs[0]?.id || "attendance");
  const [activePayslip, setActivePayslip] = useState(null);
  useEffect(() => {
    if (!allowedTabs.some((t) => t.id === activeReportTab)) {
      setActiveReportTab(allowedTabs[0]?.id || "attendance");
    }
  }, [activeRole, activeReportTab]);
  const scopedEmployees = filterEmployeesByRole(employees, activeRole);
  const getEmployee = (id) => {
    return employees.find((e) => e.id === id);
  };
  const getEmployeeName = (id) => {
    return employees.find((e) => e.id === id)?.name || id;
  };
  const getEmployeeBank = (id) => {
    const emp = employees.find((e) => e.id === id);
    return emp ? `${emp.bankDetails.bankName} - ${emp.bankDetails.accountNumber}` : "-";
  };
  const getEmployeeIfsc = (id) => {
    return employees.find((e) => e.id === id)?.bankDetails.ifscCode || "-";
  };
  const getEmployeeTaxIds = (id) => {
    const emp = employees.find((e) => e.id === id);
    return emp ? `PAN: ${emp.panNumber} | Aadhaar: ${emp.aadhaarNumber}` : "-";
  };
  const handleExport = (type) => {
    alert(`Report Exporter: Compiled and generated CSV file for ${type}_Report_${new Date().toISOString().slice(0, 10)}.csv. Download starting...`);
  };
  const activePayrollRun = payroll.filter((p) => {
    return !isEmployee || p.employeeId === EMPLOYEE_PERSONA_ID;
  });
  return /* @__PURE__ */ jsxs("div", { className: "animate-fade-in", style: { display: "flex", flexDirection: "column", gap: "24px" }, children: [
    /* @__PURE__ */ jsx("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { style: { fontSize: "20px", fontWeight: 800 }, children: "Reports & Statutory Audits" }),
      /* @__PURE__ */ jsx("p", { style: { color: "var(--text-secondary)", fontSize: "13px" }, children: "Compile statutory accounts (PF/ESI/TDS), audit attendance registers, print salary slips, and download bank transfer ledgers." })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "glass", style: { padding: "8px", display: "flex", gap: "10px" }, children: allowedTabs.map((tab) => /* @__PURE__ */ jsx(
      "button",
      {
        className: `btn ${activeReportTab === tab.id ? "btn-primary" : "btn-outline"}`,
        style: { flexGrow: 1, padding: "8px" },
        onClick: () => setActiveReportTab(tab.id),
        children: tab.label
      },
      tab.id
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "20px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }, children: [
        /* @__PURE__ */ jsxs("h3", { style: { fontSize: "15px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }, children: [
          activeReportTab,
          " Statement"
        ] }),
        /* @__PURE__ */ jsxs("button", { className: "btn btn-outline", style: { fontSize: "12px", padding: "6px 12px" }, onClick: () => handleExport(activeReportTab), children: [
          /* @__PURE__ */ jsx(Download, { size: 14 }),
          " Export CSV Statement"
        ] })
      ] }),
      activeReportTab === "attendance" && /* @__PURE__ */ jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxs("table", { children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { children: "Employee ID" }),
          /* @__PURE__ */ jsx("th", { children: "Full Name" }),
          /* @__PURE__ */ jsx("th", { children: "Present (Days)" }),
          /* @__PURE__ */ jsx("th", { children: "Overtime" }),
          /* @__PURE__ */ jsx("th", { children: "Absences" }),
          /* @__PURE__ */ jsx("th", { children: "Approved Leaves" }),
          /* @__PURE__ */ jsx("th", { children: "Attendance %" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: employees.map((emp) => {
          const empAttendance = attendance.filter((a) => a.employeeId === emp.id);
          const presents = empAttendance.filter((a) => a.status === "Present").length;
          const absences = empAttendance.filter((a) => a.status === "Absent").length;
          const leaves = empAttendance.filter((a) => a.status === "Leave").length;
          const ot = empAttendance.reduce((acc, curr) => acc + (curr.overtime || 0), 0);
          const rate = empAttendance.length > 0 ? Math.round(presents / empAttendance.length * 100) : 100;
          return /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { style: { fontWeight: 600 }, children: emp.id }),
            /* @__PURE__ */ jsx("td", { children: emp.name }),
            /* @__PURE__ */ jsxs("td", { children: [
              presents,
              " days"
            ] }),
            /* @__PURE__ */ jsxs("td", { style: { fontWeight: 600 }, children: [
              ot,
              " hrs"
            ] }),
            /* @__PURE__ */ jsx("td", { style: { color: absences > 0 ? "var(--danger)" : "inherit" }, children: absences }),
            /* @__PURE__ */ jsx("td", { children: leaves }),
            /* @__PURE__ */ jsxs("td", { style: { fontWeight: 700, color: rate > 80 ? "var(--success)" : "var(--warning)" }, children: [
              rate,
              "%"
            ] })
          ] }, emp.id);
        }) })
      ] }) }),
      activeReportTab === "payroll" && /* @__PURE__ */ jsx("div", { style: { overflowX: "auto" }, children: activePayrollRun.length > 0 ? /* @__PURE__ */ jsxs("table", { children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { children: "ID" }),
          /* @__PURE__ */ jsx("th", { children: "Employee Name" }),
          /* @__PURE__ */ jsx("th", { children: "Basic Pay" }),
          /* @__PURE__ */ jsx("th", { children: "Allowances" }),
          /* @__PURE__ */ jsx("th", { children: "OT Pay" }),
          /* @__PURE__ */ jsx("th", { children: "Gross Salary" }),
          /* @__PURE__ */ jsx("th", { children: "Total Deduct." }),
          /* @__PURE__ */ jsx("th", { children: "Net Take-Home" }),
          /* @__PURE__ */ jsx("th", { children: "Action" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: activePayrollRun.map((pay) => {
          const earns = pay.earnings;
          const allow = (earns.hra || 0) + (earns.da || 0) + (earns.conveyance || 0) + (earns.medical || 0) + (earns.specialAllowance || 0) + (earns.otherAllowance || 0) + (earns.leaveEncashment || 0) + (earns.bonus || 0);
          return /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { style: { fontWeight: 600 }, children: pay.employeeId }),
            /* @__PURE__ */ jsx("td", { children: getEmployeeName(pay.employeeId) }),
            /* @__PURE__ */ jsxs("td", { children: [
              "\u20B9",
              earns.basic.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxs("td", { children: [
              "\u20B9",
              allow.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxs("td", { children: [
              "\u20B9",
              earns.overtime.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxs("td", { style: { fontWeight: 600 }, children: [
              "\u20B9",
              earns.grossSalary.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxs("td", { style: { color: "var(--danger)" }, children: [
              "-\u20B9",
              pay.deductions.totalDeductions.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxs("td", { style: { fontWeight: 700, color: "var(--primary)" }, children: [
              "\u20B9",
              pay.netSalary.toLocaleString()
            ] }),
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs(
              "button",
              {
                className: "btn btn-primary",
                style: { padding: "4px 10px", fontSize: "11px", gap: "4px", background: "linear-gradient(135deg, #009688 0%, #14b8a6 100%)", color: "#ffffff" },
                onClick: () => setActivePayslip(pay),
                title: "Print Salary Slip",
                children: [
                  /* @__PURE__ */ jsx(Printer, { size: 12 }),
                  " Print Slip"
                ]
              }
            ) })
          ] }, pay.id);
        }) })
      ] }) : /* @__PURE__ */ jsx("p", { style: { textAlign: "center", padding: "24px", color: "var(--text-muted)" }, children: "No payroll calculated. Calculate salaries in Payroll first." }) }),
      activeReportTab === "statutory" && /* @__PURE__ */ jsx("div", { style: { overflowX: "auto" }, children: activePayrollRun.length > 0 ? /* @__PURE__ */ jsxs("table", { children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { children: "ID" }),
          /* @__PURE__ */ jsx("th", { children: "Name" }),
          /* @__PURE__ */ jsx("th", { children: "PF (12%)" }),
          /* @__PURE__ */ jsx("th", { children: "ESIC (0.75%)" }),
          /* @__PURE__ */ jsx("th", { children: "PT (Prof. Tax)" }),
          /* @__PURE__ */ jsx("th", { children: "LWF" }),
          /* @__PURE__ */ jsx("th", { children: "Total Statutory" }),
          /* @__PURE__ */ jsx("th", { children: "Tax / UAN Registration" }),
          /* @__PURE__ */ jsx("th", { children: "Action" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: activePayrollRun.map((pay) => {
          const totalStat = pay.deductions.pf + pay.deductions.esi + pay.deductions.pt + (pay.deductions.lwf || 1);
          return /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { style: { fontWeight: 600 }, children: pay.employeeId }),
            /* @__PURE__ */ jsx("td", { children: getEmployeeName(pay.employeeId) }),
            /* @__PURE__ */ jsxs("td", { children: [
              "\u20B9",
              pay.deductions.pf.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxs("td", { children: [
              "\u20B9",
              pay.deductions.esi.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxs("td", { children: [
              "\u20B9",
              pay.deductions.pt.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxs("td", { children: [
              "\u20B9",
              pay.deductions.lwf || 1
            ] }),
            /* @__PURE__ */ jsxs("td", { style: { fontWeight: 700, color: "var(--danger)" }, children: [
              "\u20B9",
              totalStat.toLocaleString()
            ] }),
            /* @__PURE__ */ jsx("td", { style: { fontSize: "11px", color: "var(--text-muted)" }, children: getEmployeeTaxIds(pay.employeeId) }),
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs(
              "button",
              {
                className: "btn btn-primary",
                style: { padding: "4px 10px", fontSize: "11px", gap: "4px", background: "linear-gradient(135deg, #009688 0%, #14b8a6 100%)", color: "#ffffff" },
                onClick: () => setActivePayslip(pay),
                title: "Print Salary Slip",
                children: [
                  /* @__PURE__ */ jsx(Printer, { size: 12 }),
                  " Print Slip"
                ]
              }
            ) })
          ] }, pay.id);
        }) })
      ] }) : /* @__PURE__ */ jsx("p", { style: { textAlign: "center", padding: "24px", color: "var(--text-muted)" }, children: "No active statutory records." }) }),
      activeReportTab === "bank" && /* @__PURE__ */ jsx("div", { style: { overflowX: "auto" }, children: activePayrollRun.length > 0 ? /* @__PURE__ */ jsxs("table", { children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { children: "Emp ID" }),
          /* @__PURE__ */ jsx("th", { children: "Beneficiary Name" }),
          /* @__PURE__ */ jsx("th", { children: "Bank & Account Number" }),
          /* @__PURE__ */ jsx("th", { children: "IFSC Code" }),
          /* @__PURE__ */ jsx("th", { children: "Net Disbursal" }),
          /* @__PURE__ */ jsx("th", { children: "Transfer Status" }),
          /* @__PURE__ */ jsx("th", { children: "Action" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: activePayrollRun.map((pay) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { style: { fontWeight: 600 }, children: pay.employeeId }),
          /* @__PURE__ */ jsx("td", { children: getEmployeeName(pay.employeeId) }),
          /* @__PURE__ */ jsx("td", { children: getEmployeeBank(pay.employeeId) }),
          /* @__PURE__ */ jsx("td", { style: { fontFamily: "monospace" }, children: getEmployeeIfsc(pay.employeeId) }),
          /* @__PURE__ */ jsxs("td", { style: { fontWeight: 800, color: "var(--success)" }, children: [
            "\u20B9",
            pay.netSalary.toLocaleString()
          ] }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", { className: `badge ${pay.status === "Disbursed" ? "badge-success" : "badge-warning"}`, children: pay.status === "Disbursed" ? "Completed" : "Draft Run / Pending" }) }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs(
            "button",
            {
              className: "btn btn-primary",
              style: { padding: "4px 10px", fontSize: "11px", gap: "4px", background: "linear-gradient(135deg, #009688 0%, #14b8a6 100%)", color: "#ffffff" },
              onClick: () => setActivePayslip(pay),
              title: "Print Salary Slip",
              children: [
                /* @__PURE__ */ jsx(Printer, { size: 12 }),
                " Print Slip"
              ]
            }
          ) })
        ] }, pay.id)) })
      ] }) : /* @__PURE__ */ jsx("p", { style: { textAlign: "center", padding: "24px", color: "var(--text-muted)" }, children: "No active disbursement run matches selection." }) })
    ] }),
    activePayslip && /* @__PURE__ */ jsx("div", { className: "modal-overlay", onClick: () => setActivePayslip(null), children: /* @__PURE__ */ jsx("div", { onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsx(
      SalarySlip,
      {
        payroll: activePayslip,
        employee: getEmployee(activePayslip.employeeId) || {
          id: activePayslip.employeeId,
          name: getEmployeeName(activePayslip.employeeId),
          photoUrl: "",
          mobileNumber: "",
          email: "",
          address: companyProfile.address,
          dob: "",
          gender: "Male",
          department: "Operations",
          designation: "Floor Associate",
          joiningDate: "",
          location: "",
          employmentType: "Full-Time",
          shiftId: "S1",
          manager: "",
          salaryStructure: {
            basic: activePayslip.earnings.basic,
            hra: activePayslip.earnings.hra,
            da: activePayslip.earnings.da,
            conveyance: activePayslip.earnings.conveyance,
            medical: activePayslip.earnings.medical,
            specialAllowance: activePayslip.earnings.specialAllowance,
            otherAllowance: activePayslip.earnings.otherAllowance || 0,
            leaveEncashment: activePayslip.earnings.leaveEncashment || 0,
            bonus: activePayslip.earnings.bonus,
            incentive: activePayslip.earnings.incentive,
            overtimeRate: 150
          },
          bankDetails: { bankName: "Bank", accountNumber: "", ifscCode: "" },
          pfNumber: "",
          uanNumber: "",
          esiNumber: "",
          panNumber: "",
          aadhaarNumber: "",
          status: "Active"
        },
        companyName: companyProfile.name,
        companyAddress: companyProfile.address,
        onClose: () => setActivePayslip(null)
      }
    ) }) })
  ] });
};
export {
  Reports
};
