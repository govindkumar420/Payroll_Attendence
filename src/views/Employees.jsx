import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { useAppState } from "../context/StateContext";
import {
  Search,
  UserPlus,
  Trash2,
  Lock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Eye,
  X,
  Printer,
  List,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  Download,
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  Briefcase,
  ShieldCheck,
  Landmark
} from "lucide-react";
import { SalarySlip } from "../components/SalarySlip";
import { getPermissions, filterEmployeesByRole, EMPLOYEE_PERSONA_ID } from "../utils/permissions";
const Employees = () => {
  const {
    employees,
    shifts,
    activeRole,
    onboardEmployee,
    getNextEmpCode,
    deleteEmployee,
    payroll,
    companyProfile
  } = useAppState();
  const permissions = getPermissions(activeRole);
  const canModify = permissions.employeeManagement === "Full";
  const canViewSalary = permissions.salaryStructure !== "None";
  const canPrintSlipFor = (targetEmpId) => permissions.payslip === "All" || permissions.payslip === "View" || permissions.payslip === "Own" && (targetEmpId === EMPLOYEE_PERSONA_ID || targetEmpId === "EMP-005");
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [viewMode, setViewMode] = useState("rows");
  const [expandedEmpIds, setExpandedEmpIds] = useState(/* @__PURE__ */ new Set());
  const [showModal, setShowModal] = useState(false);
  const [viewDetailsEmp, setViewDetailsEmp] = useState(null);
  const [activeSlip, setActiveSlip] = useState(null);
  const accessibleEmployees = filterEmployeesByRole(employees, activeRole);
  const availableLocations = Array.from(new Set(accessibleEmployees.map((e) => e.location || "Cold Jamnagar"))).filter(Boolean);
  const availableDepartments = Array.from(new Set(accessibleEmployees.map((e) => e.department))).filter(Boolean);
  const filteredEmployees = accessibleEmployees.filter((emp) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = emp.name.toLowerCase().includes(term) || emp.id.toLowerCase().includes(term) || emp.designation.toLowerCase().includes(term) || emp.location && emp.location.toLowerCase().includes(term) || emp.uanNumber && emp.uanNumber.toLowerCase().includes(term) || emp.mobileNumber && emp.mobileNumber.toLowerCase().includes(term);
    const matchesDept = deptFilter === "All" || emp.department === deptFilter;
    const matchesLocation = locationFilter === "All" || emp.location === locationFilter;
    return matchesSearch && matchesDept && matchesLocation;
  });
  const toggleExpand = (id) => {
    setExpandedEmpIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };
  const toggleExpandAll = () => {
    if (expandedEmpIds.size === filteredEmployees.length) {
      setExpandedEmpIds(/* @__PURE__ */ new Set());
    } else {
      setExpandedEmpIds(new Set(filteredEmployees.map((e) => e.id)));
    }
  };
  const handlePrintSlip = (emp) => {
    const existing = payroll.find((p) => p.employeeId === emp.id);
    const mockRecord = existing || {
      id: `PAY-${emp.id}-2024-06`,
      employeeId: emp.id,
      month: "2024-06",
      totalDays: 30,
      presentDays: 30,
      absentDays: 0,
      leaveDays: 0,
      overtimeHours: 10,
      earnings: {
        basic: emp.salaryStructure.basic,
        hra: emp.salaryStructure.hra,
        da: emp.salaryStructure.da || 0,
        conveyance: emp.salaryStructure.conveyance || 0,
        medical: emp.salaryStructure.medical || 0,
        specialAllowance: emp.salaryStructure.specialAllowance || 0,
        otherAllowance: emp.salaryStructure.otherAllowance || 0,
        leaveEncashment: emp.salaryStructure.leaveEncashment || 662,
        bonus: emp.salaryStructure.bonus || 955,
        incentive: emp.salaryStructure.incentive || 0,
        overtime: (emp.salaryStructure.overtimeRate || 150) * 10,
        grossSalary: emp.salaryStructure.basic + emp.salaryStructure.hra + (emp.salaryStructure.otherAllowance || 0) + (emp.salaryStructure.leaveEncashment || 662) + (emp.salaryStructure.bonus || 955) + (emp.salaryStructure.overtimeRate || 150) * 10
      },
      deductions: {
        pf: Math.round(emp.salaryStructure.basic * 0.12),
        esi: 0,
        pt: 200,
        tds: 0,
        advance: 0,
        loanEmi: 0,
        latePenalty: 0,
        leaveDeduction: 0,
        lwf: 1,
        otherDeduction: 0,
        totalDeductions: Math.round(emp.salaryStructure.basic * 0.12) + 200 + 1
      },
      netSalary: emp.salaryStructure.basic + emp.salaryStructure.hra + (emp.salaryStructure.otherAllowance || 0) + (emp.salaryStructure.leaveEncashment || 662) + (emp.salaryStructure.bonus || 955) + (emp.salaryStructure.overtimeRate || 150) * 10 - (Math.round(emp.salaryStructure.basic * 0.12) + 200 + 1),
      paymentMode: "BY BANK",
      status: "Approved"
    };
    setActiveSlip({ record: mockRecord, employee: emp });
  };
  const [empCode, setEmpCode] = useState("");
  const [name, setName] = useState("");
  const [photoUrl] = useState("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("G - PLOT HIG MHADA COMPLEX-158, SANT TUKARAM NAGAR, PUNE MAHARASHTRA- 411018");
  const [location, setLocation] = useState("Cold Jamnagar");
  const [dob, setDob] = useState("1995-01-01");
  const [gender, setGender] = useState("Male");
  const [department, setDepartment] = useState("Operations");
  const [designation, setDesignation] = useState("Floor Associate");
  const [joiningDate, setJoiningDate] = useState("2024-06-01");
  const [employmentType, setEmploymentType] = useState("Full-Time");
  const [shiftId, setShiftId] = useState("S1");
  const [manager, setManager] = useState("Sarah Connor");
  const [basic, setBasic] = useState(11166);
  const [hra, setHra] = useState(0);
  const [da, setDa] = useState(0);
  const [conveyance, setConveyance] = useState(0);
  const [medical, setMedical] = useState(0);
  const [specialAllowance, setSpecialAllowance] = useState(0);
  const [otherAllowance, setOtherAllowance] = useState(0);
  const [leaveEncashment, setLeaveEncashment] = useState(662);
  const [bonus, setBonus] = useState(955);
  const [incentive, setIncentive] = useState(0);
  const [overtimeRate, setOvertimeRate] = useState(150);
  const [bankName, setBankName] = useState("State Bank of India");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("SBIN0001234");
  const [pfNumber, setPfNumber] = useState("");
  const [uanNumber, setUanNumber] = useState("");
  const [esiNumber, setEsiNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const handleOpenOnboardModal = () => {
    const nextCode = getNextEmpCode("200");
    setEmpCode(nextCode);
    setShowModal(true);
  };
  const handleRegenerateCode = (prefix = "200") => {
    const nextCode = getNextEmpCode(prefix);
    setEmpCode(nextCode);
  };
  const handleExportCSV = () => {
    const headers = [
      "Emp Code",
      "Full Name",
      "Designation",
      "Department",
      "Location",
      "Employment Type",
      "Joining Date",
      "Basic Salary",
      "HRA",
      "Other Allowance",
      "Leave Encashment",
      "Bonus",
      "OT Rate/Hr",
      "Bank Name",
      "Account Number",
      "IFSC Code",
      "UAN Number",
      "ESIC Number",
      "PAN Number",
      "Aadhaar Number",
      "Mobile Number",
      "Email",
      "Address",
      "Status"
    ];
    const rows = filteredEmployees.map((emp) => [
      `"${emp.id}"`,
      `"${emp.name}"`,
      `"${emp.designation}"`,
      `"${emp.department}"`,
      `"${emp.location || "Cold Jamnagar"}"`,
      `"${emp.employmentType}"`,
      `"${emp.joiningDate}"`,
      emp.salaryStructure.basic,
      emp.salaryStructure.hra,
      emp.salaryStructure.otherAllowance || 0,
      emp.salaryStructure.leaveEncashment || 0,
      emp.salaryStructure.bonus,
      emp.salaryStructure.overtimeRate,
      `"${emp.bankDetails.bankName}"`,
      `"${emp.bankDetails.accountNumber}"`,
      `"${emp.bankDetails.ifscCode}"`,
      `"${emp.uanNumber || emp.pfNumber || ""}"`,
      `"${emp.esiNumber || emp.esicNumber || ""}"`,
      `"${emp.panNumber}"`,
      `"${emp.aadhaarNumber}"`,
      `"${emp.mobileNumber}"`,
      `"${emp.email}"`,
      `"${(emp.address || "").replace(/"/g, '""')}"`,
      `"${emp.status}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Riddhi_Siddhi_Employees_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canModify) return;
    onboardEmployee({
      id: empCode || getNextEmpCode("200"),
      name,
      photoUrl,
      mobileNumber,
      email: email || `${name.toLowerCase().replace(/[^a-z0-9]/g, ".")}@riddhisiddhi.com`,
      address,
      location,
      dob,
      gender,
      department,
      designation,
      joiningDate,
      employmentType,
      shiftId,
      manager,
      salaryStructure: {
        basic: Number(basic),
        hra: Number(hra),
        da: Number(da),
        conveyance: Number(conveyance),
        medical: Number(medical),
        specialAllowance: Number(specialAllowance),
        otherAllowance: Number(otherAllowance),
        leaveEncashment: Number(leaveEncashment),
        bonus: Number(bonus),
        incentive: Number(incentive),
        overtimeRate: Number(overtimeRate)
      },
      bankDetails: {
        bankName,
        accountNumber: accountNumber || `3098${Math.floor(Math.random() * 9e7 + 1e7)}`,
        ifscCode
      },
      pfNumber: pfNumber || uanNumber || `1019${Math.floor(Math.random() * 9e7 + 1e7)}`,
      uanNumber: uanNumber || pfNumber || "",
      esiNumber: esiNumber || "",
      esicNumber: esiNumber || "",
      panNumber: panNumber || `ABCDE${Math.floor(Math.random() * 9e3 + 1e3)}F`,
      aadhaarNumber: aadhaarNumber || `1234-${Math.floor(Math.random() * 9e3 + 1e3)}-${Math.floor(Math.random() * 9e3 + 1e3)}`,
      status: "Active"
    });
    setName("");
    setMobileNumber("");
    setEmail("");
    setAccountNumber("");
    setShowModal(false);
  };
  const getShift = (sId) => {
    return shifts.find((s) => s.id === sId);
  };
  const getShiftName = (sId) => {
    const s = getShift(sId);
    return s ? `${s.name} (${s.startTime} - ${s.endTime})` : "Default Shift";
  };
  return /* @__PURE__ */ jsxs("div", { className: "animate-fade-in", style: { display: "flex", flexDirection: "column", gap: "20px" }, children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
          /* @__PURE__ */ jsx("h2", { style: { fontSize: "22px", fontWeight: 800 }, children: "Employee Directory" }),
          /* @__PURE__ */ jsxs("span", { className: "badge badge-success", style: { fontWeight: 700, padding: "4px 10px", fontSize: "12px" }, children: [
            employees.length,
            " Active Employees"
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { color: "var(--text-secondary)", fontSize: "13px", marginTop: "2px" }, children: "Manage Riddhi Siddhi Enterprises roster, salary structures, statutory accounts, and locations in rows and tables." })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: "btn btn-outline",
            onClick: handleExportCSV,
            style: { fontSize: "13px", gap: "6px" },
            title: "Download complete employee dataset as CSV",
            children: [
              /* @__PURE__ */ jsx(Download, { size: 16 }),
              "Export CSV (",
              filteredEmployees.length,
              ")"
            ]
          }
        ),
        canModify ? /* @__PURE__ */ jsxs("button", { className: "btn btn-primary", onClick: handleOpenOnboardModal, style: { fontSize: "13px", gap: "6px" }, children: [
          /* @__PURE__ */ jsx(UserPlus, { size: 16 }),
          "Onboard New Employee"
        ] }) : /* @__PURE__ */ jsxs("div", { className: "badge badge-warning", style: { gap: "6px", padding: "6px 12px" }, children: [
          /* @__PURE__ */ jsx(Lock, { size: 14 }),
          "HR Read-Only Mode"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "glass", style: { padding: "16px 20px", display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "12px", flexWrap: "wrap", flexGrow: 1, alignItems: "center" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { position: "relative", minWidth: "280px", flexGrow: 1 }, children: [
          /* @__PURE__ */ jsx(Search, { size: 18, style: { position: "absolute", left: "12px", top: "11px", color: "var(--text-muted)" } }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Search by Code (e.g. 200050), Name, Location, UAN, Phone...",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              style: { paddingLeft: "40px", fontSize: "13px" }
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { style: { width: "190px" }, children: /* @__PURE__ */ jsxs("select", { value: locationFilter, onChange: (e) => setLocationFilter(e.target.value), style: { fontSize: "13px" }, children: [
          /* @__PURE__ */ jsxs("option", { value: "All", children: [
            "All Locations (",
            employees.length,
            ")"
          ] }),
          availableLocations.map((loc) => /* @__PURE__ */ jsxs("option", { value: loc, children: [
            loc,
            " (",
            employees.filter((e) => e.location === loc).length,
            ")"
          ] }, loc))
        ] }) }),
        /* @__PURE__ */ jsx("div", { style: { width: "180px" }, children: /* @__PURE__ */ jsxs("select", { value: deptFilter, onChange: (e) => setDeptFilter(e.target.value), style: { fontSize: "13px" }, children: [
          /* @__PURE__ */ jsxs("option", { value: "All", children: [
            "All Departments (",
            employees.length,
            ")"
          ] }),
          availableDepartments.map((dept) => /* @__PURE__ */ jsxs("option", { value: dept, children: [
            dept,
            " (",
            employees.filter((e) => e.department === dept).length,
            ")"
          ] }, dept))
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px", alignItems: "center" }, children: [
        viewMode === "rows" && /* @__PURE__ */ jsx(
          "button",
          {
            className: "btn btn-outline",
            style: { fontSize: "12px", padding: "6px 10px", height: "38px" },
            onClick: toggleExpandAll,
            title: "Expand/Collapse all row details",
            children: expandedEmpIds.size === filteredEmployees.length && filteredEmployees.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(ChevronUp, { size: 14 }),
              " Collapse All"
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(ChevronDown, { size: 14 }),
              " Expand All"
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: {
          display: "flex",
          background: "var(--bg-secondary)",
          padding: "3px",
          borderRadius: "10px",
          border: "1px solid var(--border-color-solid)"
        }, children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setViewMode("rows"),
              className: `btn ${viewMode === "rows" ? "btn-primary" : "btn-outline"}`,
              style: {
                padding: "6px 12px",
                fontSize: "12px",
                border: "none",
                borderRadius: "8px",
                gap: "6px",
                background: viewMode === "rows" ? "var(--primary)" : "transparent",
                color: viewMode === "rows" ? "#ffffff" : "var(--text-secondary)"
              },
              title: "View all details in full rows and columns",
              children: [
                /* @__PURE__ */ jsx(List, { size: 15 }),
                "Rows View"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setViewMode("cards"),
              className: `btn ${viewMode === "cards" ? "btn-primary" : "btn-outline"}`,
              style: {
                padding: "6px 12px",
                fontSize: "12px",
                border: "none",
                borderRadius: "8px",
                gap: "6px",
                background: viewMode === "cards" ? "var(--primary)" : "transparent",
                color: viewMode === "cards" ? "#ffffff" : "var(--text-secondary)"
              },
              title: "View employees as cards",
              children: [
                /* @__PURE__ */ jsx(LayoutGrid, { size: 15 }),
                "Cards View"
              ]
            }
          )
        ] })
      ] })
    ] }),
    filteredEmployees.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { textAlign: "center", padding: "48px 24px", color: "var(--text-muted)" }, children: [
      /* @__PURE__ */ jsx(FileSpreadsheet, { size: 48, style: { margin: "0 auto 16px", opacity: 0.4 } }),
      /* @__PURE__ */ jsx("h3", { style: { fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }, children: "No Employee Records Found" }),
      /* @__PURE__ */ jsx("p", { style: { fontSize: "13px" }, children: "Try adjusting your search keyword, location, or department filters." })
    ] }) : viewMode === "rows" ? (
      /* ============================================================
         DETAILED ROWS / TABLE VIEW (ALL DETAILS IN ROWS)
         ============================================================ */
      /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { padding: "0", overflow: "hidden" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { padding: "16px 24px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { style: { fontSize: "14px", fontWeight: 800, color: "var(--text-primary)" }, children: "Active Roster Data Matrix" }),
            /* @__PURE__ */ jsxs("span", { style: { fontSize: "12px", color: "var(--text-muted)", marginLeft: "10px" }, children: [
              "Displaying ",
              filteredEmployees.length,
              " employee records with complete salary, bank & statutory credentials"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { style: { fontSize: "12px", color: "var(--text-muted)" }, children: "Tip: Click any row or the chevron icon (\u25BE) to reveal full inline details." })
        ] }),
        /* @__PURE__ */ jsx("div", { style: { overflowX: "auto", width: "100%" }, children: /* @__PURE__ */ jsxs("table", { style: { margin: 0, width: "100%", minWidth: "1150px" }, children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { style: { background: "var(--bg-secondary)" }, children: [
            /* @__PURE__ */ jsx("th", { style: { width: "45px", textAlign: "center", padding: "12px 8px" }, children: "#" }),
            /* @__PURE__ */ jsx("th", { style: { width: "110px" }, children: "Emp Code" }),
            /* @__PURE__ */ jsx("th", { style: { minWidth: "220px" }, children: "Employee & Role" }),
            /* @__PURE__ */ jsx("th", { style: { minWidth: "150px" }, children: "Location & Dept" }),
            /* @__PURE__ */ jsx("th", { style: { minWidth: "130px" }, children: "Joining Date" }),
            /* @__PURE__ */ jsx("th", { style: { minWidth: "150px" }, children: "Salary Structure" }),
            /* @__PURE__ */ jsx("th", { style: { minWidth: "170px" }, children: "Bank & UAN Details" }),
            /* @__PURE__ */ jsx("th", { style: { minWidth: "150px" }, children: "Contact Info" }),
            /* @__PURE__ */ jsx("th", { style: { width: "90px", textAlign: "center" }, children: "Status" }),
            /* @__PURE__ */ jsx("th", { style: { minWidth: "180px", textAlign: "right", paddingRight: "20px" }, children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: filteredEmployees.map((emp) => {
            const isExpanded = expandedEmpIds.has(emp.id);
            const grossPay = emp.salaryStructure.basic + emp.salaryStructure.hra + (emp.salaryStructure.otherAllowance || 0) + (emp.salaryStructure.leaveEncashment || 0) + (emp.salaryStructure.bonus || 0);
            return /* @__PURE__ */ jsxs(React.Fragment, { children: [
              /* @__PURE__ */ jsxs(
                "tr",
                {
                  style: {
                    cursor: "pointer",
                    backgroundColor: isExpanded ? "var(--primary-light)" : void 0,
                    transition: "background-color 0.15s ease"
                  },
                  onClick: () => toggleExpand(emp.id),
                  children: [
                    /* @__PURE__ */ jsx("td", { style: { textAlign: "center", padding: "12px 8px" }, children: /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: (e) => {
                          e.stopPropagation();
                          toggleExpand(emp.id);
                        },
                        style: {
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: isExpanded ? "var(--primary)" : "var(--text-muted)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto"
                        },
                        title: isExpanded ? "Collapse Row" : "Expand Row Details",
                        children: isExpanded ? /* @__PURE__ */ jsx(ChevronUp, { size: 16 }) : /* @__PURE__ */ jsx(ChevronDown, { size: 16 })
                      }
                    ) }),
                    /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("span", { style: {
                      fontFamily: "monospace",
                      fontWeight: 800,
                      fontSize: "12px",
                      background: "var(--primary-light)",
                      color: "var(--primary)",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      border: "1px solid var(--primary)",
                      display: "inline-block"
                    }, children: [
                      "#",
                      emp.id
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
                      /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: emp.photoUrl,
                          alt: emp.name,
                          style: {
                            width: "38px",
                            height: "38px",
                            borderRadius: "10px",
                            objectFit: "cover",
                            background: "var(--border-color)",
                            flexShrink: 0
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { style: { minWidth: 0 }, children: [
                        /* @__PURE__ */ jsx("div", { style: { fontWeight: 700, fontSize: "13px", color: "var(--text-primary)", whiteSpace: "nowrap" }, children: emp.name }),
                        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }, children: [
                          /* @__PURE__ */ jsx("span", { style: { color: "var(--primary)", fontSize: "11px", fontWeight: 600 }, children: emp.designation }),
                          /* @__PURE__ */ jsxs("span", { style: { fontSize: "10px", color: "var(--text-muted)" }, children: [
                            "\u2022 ",
                            emp.employmentType
                          ] })
                        ] })
                      ] })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "2px" }, children: [
                      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 600 }, children: [
                        /* @__PURE__ */ jsx(MapPin, { size: 12, style: { color: "var(--primary)", flexShrink: 0 } }),
                        /* @__PURE__ */ jsx("span", { children: emp.location || "Cold Jamnagar" })
                      ] }),
                      /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", color: "var(--text-muted)" }, children: emp.department })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "2px", fontSize: "12px" }, children: [
                      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "4px", color: "var(--text-primary)" }, children: [
                        /* @__PURE__ */ jsx(Calendar, { size: 12, style: { color: "var(--text-muted)", flexShrink: 0 } }),
                        /* @__PURE__ */ jsx("span", { style: { fontWeight: 500 }, children: emp.joiningDate })
                      ] }),
                      /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", color: "var(--text-muted)" }, children: getShift(emp.shiftId)?.name || "General Shift" })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { children: canViewSalary ? /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "2px" }, children: [
                      /* @__PURE__ */ jsxs("span", { style: { fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }, children: [
                        "\u20B9",
                        emp.salaryStructure.basic.toLocaleString(),
                        " ",
                        /* @__PURE__ */ jsx("span", { style: { fontSize: "10px", fontWeight: 500, color: "var(--text-muted)" }, children: "Basic" })
                      ] }),
                      /* @__PURE__ */ jsxs("span", { style: { fontSize: "11px", color: "var(--text-muted)" }, children: [
                        "Gross: \u20B9",
                        grossPay.toLocaleString(),
                        " | OT: \u20B9",
                        emp.salaryStructure.overtimeRate,
                        "/h"
                      ] })
                    ] }) : /* @__PURE__ */ jsxs("div", { style: { fontSize: "11px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }, children: [
                      /* @__PURE__ */ jsx(Lock, { size: 12 }),
                      " Confidential"
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "2px", fontSize: "11px" }, children: [
                      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "4px" }, children: [
                        /* @__PURE__ */ jsx(Landmark, { size: 11, style: { color: "var(--text-muted)", flexShrink: 0 } }),
                        /* @__PURE__ */ jsx("span", { style: { fontWeight: 600, color: "var(--text-secondary)" }, children: emp.bankDetails.bankName.slice(0, 18) })
                      ] }),
                      /* @__PURE__ */ jsxs("span", { style: { fontFamily: "monospace", color: "var(--text-muted)" }, children: [
                        "UAN: ",
                        emp.uanNumber || emp.pfNumber || "N/A"
                      ] })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "2px", fontSize: "11px" }, children: [
                      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "4px", color: "var(--text-secondary)" }, children: [
                        /* @__PURE__ */ jsx(Phone, { size: 11, style: { color: "var(--text-muted)", flexShrink: 0 } }),
                        /* @__PURE__ */ jsx("span", { children: emp.mobileNumber || "+91 9876543210" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "4px", color: "var(--text-muted)" }, children: [
                        /* @__PURE__ */ jsx(Mail, { size: 11, style: { flexShrink: 0 } }),
                        /* @__PURE__ */ jsx("span", { style: { maxWidth: "130px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: emp.email })
                      ] })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { style: { textAlign: "center" }, children: /* @__PURE__ */ jsx("span", { className: `badge ${emp.status === "Active" ? "badge-success" : "badge-danger"}`, style: { fontSize: "10px", padding: "3px 7px" }, children: emp.status }) }),
                    /* @__PURE__ */ jsx("td", { style: { paddingRight: "20px" }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "6px" }, onClick: (e) => e.stopPropagation(), children: [
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          className: "btn btn-outline",
                          style: { padding: "5px 8px", fontSize: "11px", gap: "4px" },
                          onClick: () => setViewDetailsEmp(emp),
                          title: "View Full Profile Modal",
                          children: [
                            /* @__PURE__ */ jsx(Eye, { size: 13 }),
                            "Profile"
                          ]
                        }
                      ),
                      canPrintSlipFor(emp.id) && /* @__PURE__ */ jsxs(
                        "button",
                        {
                          className: "btn btn-primary",
                          style: {
                            padding: "5px 9px",
                            fontSize: "11px",
                            gap: "4px",
                            background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                            color: "#ffffff",
                            fontWeight: 600
                          },
                          onClick: () => handlePrintSlip(emp),
                          title: "Print Monthly Salary Slip",
                          children: [
                            /* @__PURE__ */ jsx(Printer, { size: 13 }),
                            "Slip"
                          ]
                        }
                      ),
                      canModify && /* @__PURE__ */ jsx(
                        "button",
                        {
                          className: "btn btn-outline",
                          style: { color: "var(--danger)", borderColor: "var(--danger-light)", padding: "5px 7px" },
                          onClick: () => {
                            if (confirm(`Are you sure you want to terminate ${emp.name} (Code: ${emp.id})?`)) {
                              deleteEmployee(emp.id);
                            }
                          },
                          title: "Terminate Employee",
                          children: /* @__PURE__ */ jsx(Trash2, { size: 13 })
                        }
                      )
                    ] }) })
                  ]
                }
              ),
              isExpanded && /* @__PURE__ */ jsx("tr", { style: { background: "var(--bg-surface)" }, children: /* @__PURE__ */ jsx("td", { colSpan: 10, style: { padding: "16px 24px", borderBottom: "2px solid var(--primary)" }, children: /* @__PURE__ */ jsxs("div", { className: "animate-fade-in", style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }, children: [
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [
                    /* @__PURE__ */ jsx(ShieldCheck, { size: 18, style: { color: "var(--primary)" } }),
                    /* @__PURE__ */ jsxs("span", { style: { fontSize: "13px", fontWeight: 800, color: "var(--primary)" }, children: [
                      "Comprehensive Master Records for ",
                      emp.name,
                      " (#",
                      emp.id,
                      ")"
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "badge badge-info", style: { fontSize: "10px" }, children: emp.employmentType })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px" }, children: [
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        className: "btn btn-primary",
                        style: { fontSize: "11px", padding: "4px 10px", gap: "4px" },
                        onClick: () => handlePrintSlip(emp),
                        children: [
                          /* @__PURE__ */ jsx(Printer, { size: 12 }),
                          " Print Official Payslip"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        className: "btn btn-secondary",
                        style: { fontSize: "11px", padding: "4px 10px", gap: "4px" },
                        onClick: () => setViewDetailsEmp(emp),
                        children: [
                          /* @__PURE__ */ jsx(Eye, { size: 12 }),
                          " Full Modal Drawer"
                        ]
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid-4", style: { gap: "16px" }, children: [
                  /* @__PURE__ */ jsxs("div", { style: { background: "var(--bg-secondary)", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--border-color)" }, children: [
                    /* @__PURE__ */ jsxs("h5", { style: { fontSize: "12px", fontWeight: 800, color: "var(--primary)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }, children: [
                      /* @__PURE__ */ jsx(MapPin, { size: 13 }),
                      " 1. Personal & Contact"
                    ] }),
                    /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "6px", fontSize: "11px" }, children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "DOB & Gender: " }),
                        /* @__PURE__ */ jsxs("strong", { style: { color: "var(--text-primary)" }, children: [
                          emp.dob,
                          " (",
                          emp.gender,
                          ")"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "Mobile: " }),
                        /* @__PURE__ */ jsx("strong", { style: { color: "var(--text-primary)" }, children: emp.mobileNumber })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "Email: " }),
                        /* @__PURE__ */ jsx("span", { style: { color: "var(--text-primary)", wordBreak: "break-all" }, children: emp.email })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "Residential Address: " }),
                        /* @__PURE__ */ jsx("p", { style: { color: "var(--text-primary)", marginTop: "2px", lineHeight: "1.4" }, children: emp.address })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { style: { background: "var(--bg-secondary)", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--border-color)" }, children: [
                    /* @__PURE__ */ jsxs("h5", { style: { fontSize: "12px", fontWeight: 800, color: "var(--primary)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }, children: [
                      /* @__PURE__ */ jsx(Briefcase, { size: 13 }),
                      " 2. Roster & Hierarchy"
                    ] }),
                    /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "6px", fontSize: "11px" }, children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "Branch Location: " }),
                        /* @__PURE__ */ jsx("strong", { style: { color: "var(--text-primary)" }, children: emp.location || "Cold Jamnagar" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "Department: " }),
                        /* @__PURE__ */ jsx("strong", { style: { color: "var(--text-primary)" }, children: emp.department })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "Designation: " }),
                        /* @__PURE__ */ jsx("strong", { style: { color: "var(--text-primary)" }, children: emp.designation })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "Reporting Manager: " }),
                        /* @__PURE__ */ jsx("strong", { style: { color: "var(--text-primary)" }, children: emp.manager })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "Assigned Shift: " }),
                        /* @__PURE__ */ jsx("span", { style: { color: "var(--text-primary)" }, children: getShiftName(emp.shiftId) })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { style: { background: "var(--bg-secondary)", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--border-color)" }, children: [
                    /* @__PURE__ */ jsxs("h5", { style: { fontSize: "12px", fontWeight: 800, color: "var(--primary)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }, children: [
                      /* @__PURE__ */ jsx(CreditCard, { size: 13 }),
                      " 3. Salary Structure (\u20B9/Mo)"
                    ] }),
                    canViewSalary ? /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", fontSize: "11px" }, children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)", display: "block" }, children: "Basic Pay:" }),
                        /* @__PURE__ */ jsxs("strong", { style: { color: "var(--text-primary)" }, children: [
                          "\u20B9",
                          emp.salaryStructure.basic.toLocaleString()
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)", display: "block" }, children: "HRA:" }),
                        /* @__PURE__ */ jsxs("strong", { style: { color: "var(--text-primary)" }, children: [
                          "\u20B9",
                          emp.salaryStructure.hra.toLocaleString()
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)", display: "block" }, children: "Other Allow.:" }),
                        /* @__PURE__ */ jsxs("strong", { style: { color: "var(--text-primary)" }, children: [
                          "\u20B9",
                          (emp.salaryStructure.otherAllowance || 0).toLocaleString()
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)", display: "block" }, children: "Leave Encash:" }),
                        /* @__PURE__ */ jsxs("strong", { style: { color: "var(--text-primary)" }, children: [
                          "\u20B9",
                          (emp.salaryStructure.leaveEncashment || 0).toLocaleString()
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)", display: "block" }, children: "Annual Bonus:" }),
                        /* @__PURE__ */ jsxs("strong", { style: { color: "var(--text-primary)" }, children: [
                          "\u20B9",
                          (emp.salaryStructure.bonus || 0).toLocaleString()
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)", display: "block" }, children: "OT Rate/Hr:" }),
                        /* @__PURE__ */ jsxs("strong", { style: { color: "var(--primary)" }, children: [
                          "\u20B9",
                          emp.salaryStructure.overtimeRate,
                          " / hr"
                        ] })
                      ] })
                    ] }) : /* @__PURE__ */ jsxs("div", { style: { padding: "12px", fontSize: "11px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }, children: [
                      /* @__PURE__ */ jsx(Lock, { size: 14 }),
                      " Salary breakdown is confidential."
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { style: { background: "var(--bg-secondary)", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--border-color)" }, children: [
                    /* @__PURE__ */ jsxs("h5", { style: { fontSize: "12px", fontWeight: 800, color: "var(--primary)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }, children: [
                      /* @__PURE__ */ jsx(Building2, { size: 13 }),
                      " 4. Banking & Statutory IDs"
                    ] }),
                    /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "6px", fontSize: "11px" }, children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "Bank & IFSC: " }),
                        /* @__PURE__ */ jsxs("strong", { style: { color: "var(--text-primary)" }, children: [
                          emp.bankDetails.bankName,
                          " (",
                          emp.bankDetails.ifscCode,
                          ")"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "Account No: " }),
                        /* @__PURE__ */ jsx("strong", { style: { fontFamily: "monospace", color: "var(--text-primary)" }, children: emp.bankDetails.accountNumber })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "UAN / PF: " }),
                        /* @__PURE__ */ jsx("strong", { style: { fontFamily: "monospace", color: "var(--primary)" }, children: emp.uanNumber || emp.pfNumber || "-" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "ESIC No: " }),
                        /* @__PURE__ */ jsx("span", { style: { fontFamily: "monospace", color: "var(--text-primary)" }, children: emp.esiNumber || emp.esicNumber || "N/A" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "PAN & Aadhaar: " }),
                        /* @__PURE__ */ jsxs("span", { style: { fontFamily: "monospace", color: "var(--text-primary)" }, children: [
                          emp.panNumber,
                          " | ",
                          emp.aadhaarNumber
                        ] })
                      ] })
                    ] })
                  ] })
                ] })
              ] }) }) })
            ] }, emp.id);
          }) })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { style: { padding: "12px 24px", background: "var(--bg-secondary)", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "var(--text-muted)" }, children: [
          /* @__PURE__ */ jsxs("span", { children: [
            "Showing ",
            filteredEmployees.length,
            " of ",
            employees.length,
            " employees"
          ] }),
          /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [
            /* @__PURE__ */ jsx(CheckCircle2, { size: 14, style: { color: "var(--success)" } }),
            " All employee profiles, salary breakdowns & statutory records loaded"
          ] })
        ] })
      ] })
    ) : (
      /* ============================================================
         CARDS / GRID VIEW (ALTERNATIVE VIEW)
         ============================================================ */
      /* @__PURE__ */ jsx("div", { className: "grid-3", children: filteredEmployees.map((emp) => /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "16px", position: "relative" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "16px", alignItems: "center" }, children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: emp.photoUrl,
              alt: emp.name,
              style: { width: "60px", height: "60px", borderRadius: "12px", objectFit: "cover", background: "var(--border-color)" }
            }
          ),
          /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "6px" }, children: [
              /* @__PURE__ */ jsxs("span", { style: {
                fontFamily: "monospace",
                fontWeight: 800,
                fontSize: "11px",
                background: "var(--primary-glow)",
                color: "var(--primary)",
                padding: "2px 8px",
                borderRadius: "6px",
                border: "1px solid var(--primary)"
              }, children: [
                "#",
                emp.id
              ] }),
              /* @__PURE__ */ jsx("span", { style: { fontSize: "10px", color: "var(--text-muted)", fontWeight: 600 }, children: emp.employmentType })
            ] }),
            /* @__PURE__ */ jsx("h4", { style: { fontSize: "15px", fontWeight: 700, marginTop: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: emp.name }),
            /* @__PURE__ */ jsx("p", { style: { color: "var(--primary)", fontSize: "12px", fontWeight: 600 }, children: emp.designation })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { borderTop: "1px solid var(--border-color)", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px", alignItems: "center", color: "var(--text-secondary)" }, children: [
            /* @__PURE__ */ jsx(MapPin, { size: 14, style: { color: "var(--primary)", flexShrink: 0 } }),
            /* @__PURE__ */ jsx("span", { style: { fontWeight: 600 }, children: emp.location || "Cold Jamnagar" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px", alignItems: "center", color: "var(--text-secondary)" }, children: [
            /* @__PURE__ */ jsx(Calendar, { size: 14, style: { color: "var(--text-muted)", flexShrink: 0 } }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Joined ",
              emp.joiningDate
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px", alignItems: "center", color: "var(--text-secondary)" }, children: [
            /* @__PURE__ */ jsx(CreditCard, { size: 14, style: { color: "var(--text-muted)", flexShrink: 0 } }),
            /* @__PURE__ */ jsx("span", { children: canViewSalary ? `Basic Pay: \u20B9${emp.salaryStructure.basic.toLocaleString()}` : "Role: " + emp.department })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifySelf: "flex-end", marginTop: "auto", gap: "8px", width: "100%", borderTop: "1px solid var(--border-color)", paddingTop: "12px" }, children: [
          /* @__PURE__ */ jsxs("button", { className: "btn btn-outline", style: { flexGrow: 1, padding: "8px", fontSize: "12px" }, onClick: () => setViewDetailsEmp(emp), children: [
            /* @__PURE__ */ jsx(Eye, { size: 14 }),
            "Profile"
          ] }),
          canPrintSlipFor(emp.id) && /* @__PURE__ */ jsxs(
            "button",
            {
              className: "btn btn-primary",
              style: { padding: "8px 12px", fontSize: "12px", gap: "6px", background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)", color: "#ffffff", fontWeight: 600 },
              onClick: () => handlePrintSlip(emp),
              title: "Print Salary Slip",
              children: [
                /* @__PURE__ */ jsx(Printer, { size: 14 }),
                "Print Slip"
              ]
            }
          ),
          canModify && /* @__PURE__ */ jsx(
            "button",
            {
              className: "btn btn-outline",
              style: { color: "var(--danger)", borderColor: "var(--danger-light)", padding: "8px" },
              onClick: () => {
                if (confirm(`Are you sure you want to terminate ${emp.name} (Code: ${emp.id})?`)) {
                  deleteEmployee(emp.id);
                }
              },
              title: "Terminate Employee",
              children: /* @__PURE__ */ jsx(Trash2, { size: 14 })
            }
          )
        ] })
      ] }, emp.id)) })
    ),
    showModal && /* @__PURE__ */ jsx("div", { className: "modal-overlay", children: /* @__PURE__ */ jsxs("div", { className: "modal-content glass", style: { background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid var(--border-color)" }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { style: { fontSize: "18px", fontWeight: 800 }, children: "Onboard New Employee" }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: "12px", color: "var(--text-muted)" }, children: "Generate Employee Code and configure salary & statutory profiles" })
        ] }),
        /* @__PURE__ */ jsx("button", { style: { border: "none", background: "transparent", cursor: "pointer", color: "var(--text-primary)" }, onClick: () => setShowModal(false), children: /* @__PURE__ */ jsx(X, { size: 20 }) })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, style: { padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }, children: [
        /* @__PURE__ */ jsxs("div", { style: {
          background: "var(--bg-surface-solid)",
          border: "1px solid var(--primary)",
          borderRadius: "10px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 800, color: "var(--primary)", display: "block" }, children: "\u26A1 Employee Code (Auto-Generated / Customizable)" }),
              /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", color: "var(--text-muted)" }, children: "Auto-increments to the next sequential code in the series" })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "6px" }, children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "btn btn-outline",
                  style: { fontSize: "11px", padding: "4px 10px" },
                  onClick: () => handleRegenerateCode("200"),
                  children: "Series 200xxx"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "btn btn-outline",
                  style: { fontSize: "11px", padding: "4px 10px" },
                  onClick: () => handleRegenerateCode("300"),
                  children: "Series 300xxx"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", alignItems: "center" }, children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                required: true,
                value: empCode,
                onChange: (e) => setEmpCode(e.target.value),
                placeholder: "e.g. 200141",
                style: {
                  fontSize: "15px",
                  fontWeight: 800,
                  fontFamily: "monospace",
                  letterSpacing: "1px",
                  color: "var(--primary)"
                }
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "btn btn-secondary",
                style: { whiteSpace: "nowrap", padding: "8px 14px" },
                onClick: () => handleRegenerateCode("200"),
                children: "\u26A1 Auto Next"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "12px" }, children: [
          /* @__PURE__ */ jsx("h4", { style: { fontSize: "14px", fontWeight: 700, color: "var(--primary)", borderBottom: "1px solid var(--border-color)", paddingBottom: "6px" }, children: "1. Personal & Contact Details" }),
          /* @__PURE__ */ jsxs("div", { className: "grid-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Full Name *" }),
              /* @__PURE__ */ jsx("input", { type: "text", required: true, value: name, onChange: (e) => setName(e.target.value), placeholder: "Sarah Connor" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Email Address *" }),
              /* @__PURE__ */ jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), placeholder: "email@enterprise.com" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Mobile Number *" }),
              /* @__PURE__ */ jsx("input", { type: "text", required: true, value: mobileNumber, onChange: (e) => setMobileNumber(e.target.value), placeholder: "+1 555-0100" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Date of Birth" }),
              /* @__PURE__ */ jsx("input", { type: "date", value: dob, onChange: (e) => setDob(e.target.value) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Gender" }),
              /* @__PURE__ */ jsxs("select", { value: gender, onChange: (e) => setGender(e.target.value), children: [
                /* @__PURE__ */ jsx("option", { value: "Male", children: "Male" }),
                /* @__PURE__ */ jsx("option", { value: "Female", children: "Female" }),
                /* @__PURE__ */ jsx("option", { value: "Other", children: "Other" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Work Location / Branch" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: location, onChange: (e) => setLocation(e.target.value), placeholder: "Cold Jamnagar, Pune, etc." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Home Address" }),
            /* @__PURE__ */ jsx("input", { type: "text", value: address, onChange: (e) => setAddress(e.target.value), placeholder: "G - PLOT HIG MHADA COMPLEX-158, SANT TUKARAM NAGAR, PUNE MAHARASHTRA- 411018" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "12px" }, children: [
          /* @__PURE__ */ jsx("h4", { style: { fontSize: "14px", fontWeight: 700, color: "var(--primary)", borderBottom: "1px solid var(--border-color)", paddingBottom: "6px" }, children: "2. Department & Roster Assignment" }),
          /* @__PURE__ */ jsxs("div", { className: "grid-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Department" }),
              /* @__PURE__ */ jsxs("select", { value: department, onChange: (e) => setDepartment(e.target.value), children: [
                /* @__PURE__ */ jsx("option", { value: "Operations", children: "Operations" }),
                /* @__PURE__ */ jsx("option", { value: "Housekeeping", children: "Housekeeping" }),
                /* @__PURE__ */ jsx("option", { value: "Logistics", children: "Logistics" }),
                /* @__PURE__ */ jsx("option", { value: "Human Resources", children: "Human Resources" }),
                /* @__PURE__ */ jsx("option", { value: "Finance", children: "Finance" }),
                /* @__PURE__ */ jsx("option", { value: "Engineering", children: "Engineering" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Designation" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: designation, onChange: (e) => setDesignation(e.target.value), placeholder: "Floor Associate" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Employment Type" }),
              /* @__PURE__ */ jsxs("select", { value: employmentType, onChange: (e) => setEmploymentType(e.target.value), children: [
                /* @__PURE__ */ jsx("option", { value: "Full-Time", children: "Full-Time" }),
                /* @__PURE__ */ jsx("option", { value: "Part-Time", children: "Part-Time" }),
                /* @__PURE__ */ jsx("option", { value: "Contract", children: "Contract" }),
                /* @__PURE__ */ jsx("option", { value: "Intern", children: "Intern" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Shift Assignment" }),
              /* @__PURE__ */ jsx("select", { value: shiftId, onChange: (e) => setShiftId(e.target.value), children: shifts.map((s) => /* @__PURE__ */ jsxs("option", { value: s.id, children: [
                s.name,
                " (",
                s.startTime,
                " - ",
                s.endTime,
                ")"
              ] }, s.id)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Joining Date" }),
              /* @__PURE__ */ jsx("input", { type: "date", value: joiningDate, onChange: (e) => setJoiningDate(e.target.value) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Manager" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: manager, onChange: (e) => setManager(e.target.value), placeholder: "Reports to..." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "12px" }, children: [
          /* @__PURE__ */ jsx("h4", { style: { fontSize: "14px", fontWeight: 700, color: "var(--primary)", borderBottom: "1px solid var(--border-color)", paddingBottom: "6px" }, children: "3. Salary Structure (\u20B9 Monthly)" }),
          /* @__PURE__ */ jsxs("div", { className: "grid-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "11px", fontWeight: 600, display: "block", marginBottom: "4px" }, children: "Basic Salary (\u20B9)" }),
              /* @__PURE__ */ jsx("input", { type: "number", value: basic, onChange: (e) => setBasic(Number(e.target.value)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "11px", fontWeight: 600, display: "block", marginBottom: "4px" }, children: "HRA (\u20B9)" }),
              /* @__PURE__ */ jsx("input", { type: "number", value: hra, onChange: (e) => setHra(Number(e.target.value)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "11px", fontWeight: 600, display: "block", marginBottom: "4px" }, children: "Other Allowance (\u20B9)" }),
              /* @__PURE__ */ jsx("input", { type: "number", value: otherAllowance, onChange: (e) => setOtherAllowance(Number(e.target.value)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "11px", fontWeight: 600, display: "block", marginBottom: "4px" }, children: "Leave Encashment (\u20B9)" }),
              /* @__PURE__ */ jsx("input", { type: "number", value: leaveEncashment, onChange: (e) => setLeaveEncashment(Number(e.target.value)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "11px", fontWeight: 600, display: "block", marginBottom: "4px" }, children: "Bonus (\u20B9)" }),
              /* @__PURE__ */ jsx("input", { type: "number", value: bonus, onChange: (e) => setBonus(Number(e.target.value)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "11px", fontWeight: 600, display: "block", marginBottom: "4px" }, children: "OT Rate (\u20B9 / Hr)" }),
              /* @__PURE__ */ jsx("input", { type: "number", value: overtimeRate, onChange: (e) => setOvertimeRate(Number(e.target.value)) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "12px" }, children: [
          /* @__PURE__ */ jsx("h4", { style: { fontSize: "14px", fontWeight: 700, color: "var(--primary)", borderBottom: "1px solid var(--border-color)", paddingBottom: "6px" }, children: "4. Bank Details & Statutory IDs (UAN / ESIC / PF)" }),
          /* @__PURE__ */ jsxs("div", { className: "grid-3", children: [
            /* @__PURE__ */ jsxs("div", { style: { gridColumn: "span 2" }, children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "11px", fontWeight: 600, display: "block", marginBottom: "4px" }, children: "Bank Name" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: bankName, onChange: (e) => setBankName(e.target.value) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "11px", fontWeight: 600, display: "block", marginBottom: "4px" }, children: "IFSC Code" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: ifscCode, onChange: (e) => setIfscCode(e.target.value) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "11px", fontWeight: 600, display: "block", marginBottom: "4px" }, children: "Bank Account Number" }),
              /* @__PURE__ */ jsx("input", { type: "text", required: true, value: accountNumber, onChange: (e) => setAccountNumber(e.target.value), placeholder: "01234567890" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "11px", fontWeight: 600, display: "block", marginBottom: "4px" }, children: "UAN Number (12 Digits)" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: uanNumber, onChange: (e) => setUanNumber(e.target.value), placeholder: "101974247470" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "11px", fontWeight: 600, display: "block", marginBottom: "4px" }, children: "ESIC No. (Optional)" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: esiNumber, onChange: (e) => setEsiNumber(e.target.value), placeholder: "33-01928-82" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "11px", fontWeight: 600, display: "block", marginBottom: "4px" }, children: "PAN Card (10 Digits)" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: panNumber, onChange: (e) => setPanNumber(e.target.value.toUpperCase()), placeholder: "ABCDE1234F" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid var(--border-color)", paddingTop: "20px", marginTop: "10px" }, children: [
          /* @__PURE__ */ jsx("button", { type: "button", className: "btn btn-secondary", onClick: () => setShowModal(false), children: "Cancel" }),
          /* @__PURE__ */ jsx("button", { type: "submit", className: "btn btn-primary", children: "Complete Registration" })
        ] })
      ] })
    ] }) }),
    viewDetailsEmp && /* @__PURE__ */ jsx("div", { className: "modal-overlay", children: /* @__PURE__ */ jsxs("div", { className: "modal-content glass", style: { maxWidth: "640px", background: "var(--bg-surface-solid)" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid var(--border-color)" }, children: [
        /* @__PURE__ */ jsx("h3", { style: { fontSize: "18px", fontWeight: 800 }, children: "Employee Profile Details" }),
        /* @__PURE__ */ jsx("button", { style: { border: "none", background: "transparent", cursor: "pointer", color: "var(--text-primary)" }, onClick: () => setViewDetailsEmp(null), children: /* @__PURE__ */ jsx(X, { size: 20 }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "20px", alignItems: "center" }, children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: viewDetailsEmp.photoUrl,
              alt: viewDetailsEmp.name,
              style: { width: "80px", height: "80px", borderRadius: "16px", objectFit: "cover" }
            }
          ),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { style: { fontSize: "20px", fontWeight: 800 }, children: viewDetailsEmp.name }),
            /* @__PURE__ */ jsx("p", { style: { color: "var(--primary)", fontWeight: 700, fontSize: "14px" }, children: viewDetailsEmp.designation }),
            /* @__PURE__ */ jsxs("p", { style: { fontSize: "12px", color: "var(--text-muted)" }, children: [
              "#",
              viewDetailsEmp.id,
              " \u2022 ",
              viewDetailsEmp.employmentType,
              " \u2022 ",
              viewDetailsEmp.status
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", borderTop: "1px solid var(--border-color)", paddingTop: "16px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", alignItems: "center" }, children: [
            /* @__PURE__ */ jsx(Phone, { size: 16, style: { color: "var(--text-muted)" } }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { fontSize: "10px", color: "var(--text-muted)", display: "block" }, children: "Mobile Number" }),
              /* @__PURE__ */ jsx("span", { style: { fontSize: "13px", fontWeight: 500 }, children: viewDetailsEmp.mobileNumber })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", alignItems: "center" }, children: [
            /* @__PURE__ */ jsx(Mail, { size: 16, style: { color: "var(--text-muted)" } }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { fontSize: "10px", color: "var(--text-muted)", display: "block" }, children: "Email Address" }),
              /* @__PURE__ */ jsx("span", { style: { fontSize: "13px", fontWeight: 500 }, children: viewDetailsEmp.email })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", alignItems: "center" }, children: [
            /* @__PURE__ */ jsx(MapPin, { size: 16, style: { color: "var(--text-muted)" } }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { fontSize: "10px", color: "var(--text-muted)", display: "block" }, children: "Home Address" }),
              /* @__PURE__ */ jsx("span", { style: { fontSize: "13px", fontWeight: 500 }, children: viewDetailsEmp.address })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", alignItems: "center" }, children: [
            /* @__PURE__ */ jsx(Calendar, { size: 16, style: { color: "var(--text-muted)" } }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { fontSize: "10px", color: "var(--text-muted)", display: "block" }, children: "Date of Birth" }),
              /* @__PURE__ */ jsxs("span", { style: { fontSize: "13px", fontWeight: 500 }, children: [
                viewDetailsEmp.dob,
                " (",
                viewDetailsEmp.gender,
                ")"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid var(--border-color)", paddingTop: "16px" }, children: [
          /* @__PURE__ */ jsx("h4", { style: { fontSize: "13px", fontWeight: 700, color: "var(--primary)" }, children: "Assignment & Location Rules" }),
          /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px", background: "var(--bg-secondary)", padding: "12px", borderRadius: "8px" }, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { fontSize: "10px", color: "var(--text-muted)", display: "block" }, children: "Department" }),
              /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", fontWeight: 600 }, children: viewDetailsEmp.department })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { fontSize: "10px", color: "var(--text-muted)", display: "block" }, children: "Location" }),
              /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", fontWeight: 600 }, children: viewDetailsEmp.location || "Cold Jamnagar" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { fontSize: "10px", color: "var(--text-muted)", display: "block" }, children: "Shift Schedule" }),
              /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", fontWeight: 600 }, children: getShiftName(viewDetailsEmp.shiftId) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { fontSize: "10px", color: "var(--text-muted)", display: "block" }, children: "Reports To" }),
              /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", fontWeight: 600 }, children: viewDetailsEmp.manager })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid var(--border-color)", paddingTop: "16px" }, children: [
          /* @__PURE__ */ jsx("h4", { style: { fontSize: "13px", fontWeight: 700, color: "var(--primary)" }, children: "Salary Breakdown (\u20B9 Monthly)" }),
          /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", fontSize: "12px" }, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "Basic Pay:" }),
              " ",
              /* @__PURE__ */ jsxs("span", { style: { fontWeight: 600 }, children: [
                "\u20B9",
                viewDetailsEmp.salaryStructure.basic.toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "HRA:" }),
              " ",
              /* @__PURE__ */ jsxs("span", { style: { fontWeight: 600 }, children: [
                "\u20B9",
                viewDetailsEmp.salaryStructure.hra.toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "Other Allowance:" }),
              " ",
              /* @__PURE__ */ jsxs("span", { style: { fontWeight: 600 }, children: [
                "\u20B9",
                (viewDetailsEmp.salaryStructure.otherAllowance || viewDetailsEmp.salaryStructure.specialAllowance || 0).toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "Leave Encashment:" }),
              " ",
              /* @__PURE__ */ jsxs("span", { style: { fontWeight: 600 }, children: [
                "\u20B9",
                (viewDetailsEmp.salaryStructure.leaveEncashment || 0).toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "Bonus:" }),
              " ",
              /* @__PURE__ */ jsxs("span", { style: { fontWeight: 600 }, children: [
                "\u20B9",
                (viewDetailsEmp.salaryStructure.bonus || 0).toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "Overtime Rate:" }),
              " ",
              /* @__PURE__ */ jsxs("span", { style: { fontWeight: 600 }, children: [
                "\u20B9",
                viewDetailsEmp.salaryStructure.overtimeRate,
                " / hr"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid var(--border-color)", paddingTop: "16px" }, children: [
          /* @__PURE__ */ jsx("h4", { style: { fontSize: "13px", fontWeight: 700, color: "var(--primary)" }, children: "Banking & Statutory Registrations" }),
          /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", fontSize: "12px" }, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "Bank Name:" }),
              " ",
              /* @__PURE__ */ jsx("span", { style: { fontWeight: 600 }, children: viewDetailsEmp.bankDetails.bankName })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "Account Number:" }),
              " ",
              /* @__PURE__ */ jsx("span", { style: { fontWeight: 600 }, children: viewDetailsEmp.bankDetails.accountNumber })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "IFSC Bank Code:" }),
              " ",
              /* @__PURE__ */ jsx("span", { style: { fontWeight: 600 }, children: viewDetailsEmp.bankDetails.ifscCode })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "UAN Number:" }),
              " ",
              /* @__PURE__ */ jsx("span", { style: { fontWeight: 600 }, children: viewDetailsEmp.uanNumber || viewDetailsEmp.pfNumber || "-" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "ESIC No.:" }),
              " ",
              /* @__PURE__ */ jsx("span", { style: { fontWeight: 600 }, children: viewDetailsEmp.esiNumber || viewDetailsEmp.esicNumber || "-" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "PAN Tax Code:" }),
              " ",
              /* @__PURE__ */ jsx("span", { style: { fontWeight: 600 }, children: viewDetailsEmp.panNumber })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "16px", marginTop: "4px" }, children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: "btn btn-primary",
              style: { fontSize: "12px", padding: "8px 16px", gap: "6px", background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)", color: "#ffffff", fontWeight: 600 },
              onClick: () => handlePrintSlip(viewDetailsEmp),
              children: [
                /* @__PURE__ */ jsx(Printer, { size: 14 }),
                " Print Salary Slip"
              ]
            }
          ),
          /* @__PURE__ */ jsx("button", { className: "btn btn-secondary", onClick: () => setViewDetailsEmp(null), children: "Close Profile Details" })
        ] })
      ] })
    ] }) }),
    activeSlip && /* @__PURE__ */ jsx("div", { className: "modal-overlay", onClick: () => setActiveSlip(null), children: /* @__PURE__ */ jsx("div", { onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsx(
      SalarySlip,
      {
        payroll: activeSlip.record,
        employee: activeSlip.employee,
        companyName: companyProfile.name,
        companyAddress: companyProfile.address,
        onClose: () => setActiveSlip(null)
      }
    ) }) })
  ] });
};
export {
  Employees
};
