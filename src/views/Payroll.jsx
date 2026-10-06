import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAppState } from "../context/StateContext";
import { DollarSign, Cpu, CheckCircle, Printer } from "lucide-react";
import confetti from "canvas-confetti";
import { SalarySlip } from "../components/SalarySlip";
import { getPermissions, EMPLOYEE_PERSONA_ID } from "../utils/permissions";
const Payroll = () => {
  const {
    employees,
    payroll,
    activeRole,
    companyProfile,
    processMonthlyPayroll,
    approveMonthlyPayroll,
    disburseMonthlyPayroll
  } = useAppState();
  const permissions = getPermissions(activeRole);
  const [selectedMonth, setSelectedMonth] = useState("2024-06");
  const [activePayslip, setActivePayslip] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const canProcess = permissions.payrollCalculation === "Full";
  const canApprove = permissions.payrollApproval;
  const canDisburse = permissions.bankTransfer;
  const isEmployee = activeRole === "Employee";
  const availableLocations = Array.from(new Set(employees.map((e) => e.location || "Cold Jamnagar"))).filter(Boolean);
  const handleProcess = () => {
    if (!canProcess) return;
    processMonthlyPayroll(selectedMonth);
    confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } });
  };
  const handleApprove = () => {
    if (!canApprove) return;
    approveMonthlyPayroll(selectedMonth);
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
  };
  const handleDisburse = () => {
    if (!canDisburse) return;
    disburseMonthlyPayroll(selectedMonth);
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
  };
  const getEmployeeName = (id) => {
    return employees.find((e) => e.id === id)?.name || id;
  };
  const getEmployee = (id) => {
    return employees.find((e) => e.id === id);
  };
  const handleOpenSampleSlip = () => {
    const targetId = isEmployee ? EMPLOYEE_PERSONA_ID : "200050";
    const sampleRecord = payroll.find((p) => p.employeeId === targetId && p.month === selectedMonth) || payroll.find((p) => p.employeeId === targetId) || payroll[0];
    if (sampleRecord) {
      setActivePayslip(sampleRecord);
    }
  };
  const activePayrollRun = payroll.filter((p) => {
    const matchesMonth = p.month === selectedMonth;
    const emp = getEmployee(p.employeeId);
    const matchesSearch = p.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) || getEmployeeName(p.employeeId).toLowerCase().includes(searchTerm.toLowerCase()) || emp?.location && emp.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === "All" || emp?.location === locationFilter;
    const matchesRoleScope = !isEmployee || p.employeeId === EMPLOYEE_PERSONA_ID || p.employeeId === "EMP-005";
    return matchesMonth && matchesSearch && matchesLocation && matchesRoleScope;
  });
  const totalRunForMonth = payroll.filter((p) => p.month === selectedMonth);
  const runStatus = totalRunForMonth.length > 0 ? totalRunForMonth[0].status : "Not Processed";
  const totalGrossCost = totalRunForMonth.reduce((sum, p) => sum + p.earnings.grossSalary, 0);
  const totalNetCost = totalRunForMonth.reduce((sum, p) => sum + p.netSalary, 0);
  return /* @__PURE__ */ jsxs("div", { className: "animate-fade-in", style: { display: "flex", flexDirection: "column", gap: "24px" }, children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { style: { fontSize: "20px", fontWeight: 800 }, children: "Payroll Center" }),
        /* @__PURE__ */ jsx("p", { style: { color: "var(--text-secondary)", fontSize: "13px" }, children: "Execute monthly salary computations, deduct statutory taxes (PF, ESIC, PT, LWF), and issue official salary slips." })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          className: "btn btn-primary",
          style: { background: "linear-gradient(135deg, #2b7a9e 0%, #1b5a7a 100%)", boxShadow: "0 4px 14px rgba(27, 90, 122, 0.35)", gap: "8px" },
          onClick: handleOpenSampleSlip,
          children: [
            /* @__PURE__ */ jsx(Printer, { size: 16 }),
            " Print Sample Salary Slip (Riddhi Siddhi Enterprises)"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid-3", style: { gridTemplateColumns: "1.2fr 2fr 1fr" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "16px", justifyContent: "space-between" }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { style: { fontSize: "15px", fontWeight: 800, marginBottom: "8px" }, children: "Payroll Processing" }),
          /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Select Target Month" }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "6px", marginBottom: "8px" }, children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: `btn ${selectedMonth === "2024-06" ? "btn-primary" : "btn-outline"}`,
                style: { fontSize: "11px", padding: "4px 10px" },
                onClick: () => setSelectedMonth("2024-06"),
                children: "Jun-2024 (PDF Data)"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: `btn ${selectedMonth === "2026-08" ? "btn-primary" : "btn-outline"}`,
                style: { fontSize: "11px", padding: "4px 10px" },
                onClick: () => setSelectedMonth("2026-08"),
                children: "Aug-2026 (Live)"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("input", { type: "month", value: selectedMonth, onChange: (e) => setSelectedMonth(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }, children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: "btn btn-primary",
              onClick: handleProcess,
              disabled: !canProcess || runStatus === "Disbursed",
              style: { padding: "12px" },
              children: [
                /* @__PURE__ */ jsx(Cpu, { size: 16 }),
                " Fetch & Process Payroll"
              ]
            }
          ),
          runStatus === "Draft" && /* @__PURE__ */ jsxs(
            "button",
            {
              className: "btn btn-secondary",
              onClick: handleApprove,
              disabled: !canApprove,
              style: { padding: "12px", background: "var(--warning)", color: "black" },
              children: [
                /* @__PURE__ */ jsx(CheckCircle, { size: 16 }),
                " Approve Payroll"
              ]
            }
          ),
          runStatus === "Approved" && /* @__PURE__ */ jsxs(
            "button",
            {
              className: "btn btn-secondary",
              onClick: handleDisburse,
              disabled: !canDisburse,
              style: { padding: "12px", background: "var(--success)", color: "white" },
              children: [
                /* @__PURE__ */ jsx(DollarSign, { size: 16 }),
                " Disburse Salaries"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
        /* @__PURE__ */ jsx("h3", { style: { fontSize: "15px", fontWeight: 800 }, children: "Roster Execution Summary" }),
        /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { background: "var(--bg-secondary)", padding: "12px", borderRadius: "10px", border: "1px solid var(--border-color)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", color: "var(--text-muted)" }, children: "Calculation State" }),
            /* @__PURE__ */ jsx("span", { style: {
              fontWeight: 800,
              display: "block",
              fontSize: "16px",
              marginTop: "4px",
              color: runStatus === "Disbursed" ? "var(--success)" : runStatus === "Approved" ? "var(--warning)" : "inherit"
            }, children: runStatus })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { background: "var(--bg-secondary)", padding: "12px", borderRadius: "10px", border: "1px solid var(--border-color)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", color: "var(--text-muted)" }, children: "Employees Processed" }),
            /* @__PURE__ */ jsxs("span", { style: { fontWeight: 800, display: "block", fontSize: "16px", marginTop: "4px" }, children: [
              activePayrollRun.length,
              " / ",
              employees.length
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { background: "var(--bg-secondary)", padding: "12px", borderRadius: "10px", border: "1px solid var(--border-color)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", color: "var(--text-muted)" }, children: "Total Gross Cost" }),
            /* @__PURE__ */ jsxs("span", { style: { fontWeight: 800, display: "block", fontSize: "16px", marginTop: "4px" }, children: [
              "\u20B9",
              totalGrossCost.toLocaleString()
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { background: "var(--bg-secondary)", padding: "12px", borderRadius: "10px", border: "1px solid var(--border-color)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", color: "var(--text-muted)" }, children: "Total Net Cost" }),
            /* @__PURE__ */ jsxs("span", { style: { fontWeight: 800, display: "block", fontSize: "16px", marginTop: "4px", color: "var(--primary)" }, children: [
              "\u20B9",
              totalNetCost.toLocaleString()
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px" }, children: [
        /* @__PURE__ */ jsx("h3", { style: { fontSize: "14px", fontWeight: 800 }, children: "Statutory Status" }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
            /* @__PURE__ */ jsx("span", { children: "EPF (12%):" }),
            /* @__PURE__ */ jsx("strong", { style: { color: "var(--success)" }, children: "Active (Compliant)" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
            /* @__PURE__ */ jsx("span", { children: "ESIC (0.75%):" }),
            /* @__PURE__ */ jsx("strong", { style: { color: "var(--success)" }, children: "Active (Compliant)" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
            /* @__PURE__ */ jsx("span", { children: "Prof. Tax (PT \u20B9200):" }),
            /* @__PURE__ */ jsx("strong", { style: { color: "var(--success)" }, children: "Auto-Deducted" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
            /* @__PURE__ */ jsx("span", { children: "LWF (\u20B91 Standard):" }),
            /* @__PURE__ */ jsx("strong", { style: { color: "var(--success)" }, children: "Auto-Deducted" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h3", { style: { fontSize: "16px", fontWeight: 800 }, children: [
            "Computed Salary Roster (",
            selectedMonth,
            ")"
          ] }),
          /* @__PURE__ */ jsxs("span", { style: { fontSize: "12px", color: "var(--text-muted)" }, children: [
            "Showing ",
            activePayrollRun.length,
            " of ",
            totalRunForMonth.length,
            " employee records"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "12px", flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Search by Code (e.g. 200050) or Name...",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              style: { width: "240px", padding: "6px 12px", fontSize: "13px" }
            }
          ),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: locationFilter,
              onChange: (e) => setLocationFilter(e.target.value),
              style: { width: "180px", padding: "6px 12px", fontSize: "13px" },
              children: [
                /* @__PURE__ */ jsx("option", { value: "All", children: "All Locations" }),
                availableLocations.map((loc) => /* @__PURE__ */ jsx("option", { value: loc, children: loc }, loc))
              ]
            }
          )
        ] })
      ] }),
      activePayrollRun.length > 0 ? /* @__PURE__ */ jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxs("table", { children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { children: "Employee" }),
          /* @__PURE__ */ jsx("th", { children: "Location" }),
          /* @__PURE__ */ jsx("th", { children: "Attendance Info" }),
          /* @__PURE__ */ jsx("th", { children: "OT (Hours)" }),
          /* @__PURE__ */ jsx("th", { children: "Gross Earnings" }),
          /* @__PURE__ */ jsx("th", { children: "Total Deductions" }),
          /* @__PURE__ */ jsx("th", { children: "Net Salary" }),
          /* @__PURE__ */ jsx("th", { children: "Status" }),
          /* @__PURE__ */ jsx("th", { children: "Official Payslip" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: activePayrollRun.map((pay) => {
          const emp = getEmployee(pay.employeeId);
          return /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsxs("td", { children: [
              /* @__PURE__ */ jsx("span", { style: { fontWeight: 600, display: "block" }, children: getEmployeeName(pay.employeeId) }),
              /* @__PURE__ */ jsxs("span", { style: { fontSize: "11px", color: "var(--text-muted)" }, children: [
                "Code: ",
                pay.employeeId
              ] })
            ] }),
            /* @__PURE__ */ jsx("td", { style: { fontSize: "12px" }, children: emp?.location || "Pune Head Office" }),
            /* @__PURE__ */ jsxs("td", { style: { fontSize: "12px" }, children: [
              "P: ",
              /* @__PURE__ */ jsx("strong", { children: pay.presentDays }),
              " | A: ",
              /* @__PURE__ */ jsx("strong", { style: { color: pay.absentDays > 0 ? "var(--danger)" : "inherit" }, children: pay.absentDays }),
              " | L: ",
              /* @__PURE__ */ jsx("strong", { children: pay.leaveDays })
            ] }),
            /* @__PURE__ */ jsxs("td", { children: [
              pay.overtimeHours,
              " hrs"
            ] }),
            /* @__PURE__ */ jsxs("td", { style: { fontWeight: 600 }, children: [
              "\u20B9",
              pay.earnings.grossSalary.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxs("td", { style: { color: "var(--danger)", fontWeight: 500 }, children: [
              "-\u20B9",
              pay.deductions.totalDeductions.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxs("td", { style: { fontWeight: 700, color: "var(--primary)" }, children: [
              "\u20B9",
              pay.netSalary.toLocaleString()
            ] }),
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", { className: `badge ${pay.status === "Disbursed" ? "badge-success" : pay.status === "Approved" ? "badge-warning" : "badge-info"}`, children: pay.status }) }),
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs(
              "button",
              {
                className: "btn btn-primary",
                style: { padding: "6px 14px", fontSize: "12px", gap: "6px", background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)", color: "#ffffff", fontWeight: 600, boxShadow: "0 2px 8px rgba(6, 182, 212, 0.3)" },
                onClick: () => setActivePayslip(pay),
                title: "Open & Print Salary Slip",
                children: [
                  /* @__PURE__ */ jsx(Printer, { size: 14 }),
                  " Print Salary Slip"
                ]
              }
            ) })
          ] }, pay.id);
        }) })
      ] }) }) : /* @__PURE__ */ jsxs("p", { style: { textAlign: "center", padding: "36px", color: "var(--text-muted)" }, children: [
        "No payroll run found for ",
        selectedMonth,
        '. Click "Fetch & Process Payroll" above to compile.'
      ] })
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
          joiningDate: "2023-07-17",
          location: "Cold Jamnagar",
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
          pfNumber: "101974247470",
          uanNumber: "101974247470",
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
  Payroll
};
