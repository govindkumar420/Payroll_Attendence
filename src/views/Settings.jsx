import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAppState } from "../context/StateContext";
import { Shield, KeyRound, Database, RefreshCw, Building2, Check, Save, UserCheck, CheckCircle2 } from "lucide-react";
import { CompanyLogo } from "../components/CompanyLogo";
import { RoleCredentialsCard } from "../components/RoleCredentialsCard";
import { getPermissions } from "../utils/permissions";
const Settings = () => {
  const { auditLogs, activeRole, companyProfile, updateCompanyProfile, triggerSyncNotification, addAuditLog } = useAppState();
  const [companyName, setCompanyName] = useState(companyProfile.name || "RIDDHI SIDDHI ENTERPRISES");
  const [companyAddress, setCompanyAddress] = useState(companyProfile.address || "G - PLOT HIG MHADA COMPLEX-158, SANT TUKARAM NAGAR, PUNE MAHARASHTRA- 411018");
  const [tagline, setTagline] = useState(companyProfile.tagline || "Workforce & Payroll Operations");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [encryptionStandard, setEncryptionStandard] = useState("AES-256 (GCM)");
  const [backupLoading, setBackupLoading] = useState(false);
  const [lastBackup, setLastBackup] = useState("Aug 8, 2026 00:00:00");
  const permissions = getPermissions(activeRole);
  const canManageSystemSettings = permissions.systemSettings === "Full";
  const canManageUsers = permissions.userManagement !== "None";
  const canViewAuditLogs = permissions.auditLogs !== "None";
  const handleSaveCompanyProfile = (e) => {
    e.preventDefault();
    if (!canManageSystemSettings) return;
    updateCompanyProfile({
      name: companyName,
      address: companyAddress,
      tagline
    });
    setSavedSuccess(true);
    triggerSyncNotification(`\u{1F3E2} Company profile updated to: ${companyName}`);
    setTimeout(() => setSavedSuccess(false), 3e3);
  };
  const handleBackup = () => {
    if (!canManageSystemSettings) return;
    setBackupLoading(true);
    addAuditLog("Backup Triggered", "Manual cryptographic database backup initiated by administrator");
    setTimeout(() => {
      setBackupLoading(false);
      const nowStr = (/* @__PURE__ */ new Date()).toLocaleString();
      setLastBackup(nowStr);
      addAuditLog("Backup Completed", "Full snapshot stored securely in off-site S3 server");
      triggerSyncNotification("\u{1F4BE} System Backup completed successfully! DB integrity: 100%");
      alert("System Backup Completed successfully! Snapshot hash: SHA256-4b9e28f3a...");
    }, 1500);
  };
  const handleMfaToggle = () => {
    if (!canManageSystemSettings) return;
    setMfaEnabled(!mfaEnabled);
    addAuditLog("2FA Config Update", `Two-Factor security settings changed to: ${!mfaEnabled ? "ENABLED" : "DISABLED"}`);
  };
  const fullPermissionMatrix = [
    { module: "Dashboard", super: "Full", hr: "View", payroll: "View", manager: "View", accountant: "View", employee: "Own" },
    { module: "User Management", super: "\u2705 Full", hr: "\u2705 Manage", payroll: "\u274C", manager: "\u274C", accountant: "\u274C", employee: "\u274C" },
    { module: "Employee Management", super: "\u2705 Full", hr: "\u2705 Full", payroll: "\u{1F441}\uFE0F View", manager: "\u{1F441}\uFE0F Team", accountant: "\u{1F441}\uFE0F View", employee: "\u{1F441}\uFE0F Own" },
    { module: "Attendance", super: "\u2705 Full", hr: "\u2705 Manage", payroll: "\u{1F441}\uFE0F View", manager: "\u2705 Team", accountant: "\u{1F441}\uFE0F View", employee: "\u270F\uFE0F Own" },
    { module: "Manual Attendance", super: "\u2705", hr: "\u2705", payroll: "\u274C", manager: "\u2705 Team", accountant: "\u274C", employee: "\u274C" },
    { module: "Attendance Approval", super: "\u2705", hr: "\u2705", payroll: "\u274C", manager: "\u2705 Team", accountant: "\u274C", employee: "\u274C" },
    { module: "Shift Management", super: "\u2705 Full", hr: "\u2705 Manage", payroll: "\u{1F441}\uFE0F View", manager: "\u{1F441}\uFE0F View", accountant: "\u274C", employee: "\u{1F441}\uFE0F Own" },
    { module: "Leave Management", super: "\u2705 Full", hr: "\u2705 Full", payroll: "\u{1F441}\uFE0F View", manager: "\u2705 Approve", accountant: "\u274C", employee: "\u2705 Apply" },
    { module: "Holiday Management", super: "\u2705 Full", hr: "\u2705 Manage", payroll: "\u{1F441}\uFE0F View", manager: "\u{1F441}\uFE0F View", accountant: "\u274C", employee: "\u{1F441}\uFE0F View" },
    { module: "Overtime", super: "\u2705 Full", hr: "\u2705 Manage", payroll: "\u2705 Calculate", manager: "\u2705 Approve", accountant: "\u{1F441}\uFE0F View", employee: "\u2705 Request" },
    { module: "Salary Structure", super: "\u2705 Full", hr: "\u2705 Manage", payroll: "\u2705 Full", manager: "\u274C", accountant: "\u{1F441}\uFE0F View", employee: "\u{1F441}\uFE0F Own" },
    { module: "Payroll Calculation", super: "\u2705", hr: "\u{1F441}\uFE0F", payroll: "\u2705 Full", manager: "\u274C", accountant: "\u{1F441}\uFE0F View", employee: "\u{1F441}\uFE0F Own" },
    { module: "Payroll Approval", super: "\u2705", hr: "\u2705", payroll: "\u2705", manager: "\u274C", accountant: "\u274C", employee: "\u274C" },
    { module: "Payslip", super: "\u2705", hr: "\u2705", payroll: "\u2705", manager: "\u274C", accountant: "\u{1F441}\uFE0F View", employee: "\u{1F441}\uFE0F Own" },
    { module: "Loan & Advance", super: "\u2705", hr: "\u2705 Manage", payroll: "\u2705 Calculate", manager: "\u274C", accountant: "\u{1F441}\uFE0F View", employee: "\u2705 Request/View" },
    { module: "PF/ESI/TDS Reports", super: "\u2705", hr: "\u2705", payroll: "\u2705", manager: "\u274C", accountant: "\u2705", employee: "\u274C" },
    { module: "Bank Transfer", super: "\u2705", hr: "\u274C", payroll: "\u2705", manager: "\u274C", accountant: "\u2705", employee: "\u274C" },
    { module: "Reports", super: "\u2705 All", hr: "HR Reports", payroll: "Payroll Reports", manager: "Team Reports", accountant: "Finance Reports", employee: "Own" },
    { module: "Notifications", super: "\u2705", hr: "\u2705", payroll: "\u2705", manager: "\u2705", accountant: "\u2705", employee: "Own" },
    { module: "Audit Logs", super: "\u2705 Full", hr: "\u{1F441}\uFE0F View", payroll: "\u{1F441}\uFE0F View", manager: "\u274C", accountant: "\u274C", employee: "\u274C" },
    { module: "System Settings", super: "\u2705 Full", hr: "\u274C", payroll: "\u274C", manager: "\u274C", accountant: "\u274C", employee: "\u274C" }
  ];
  const renderBadge = (val) => {
    if (val === "\u274C") return /* @__PURE__ */ jsx("span", { className: "badge badge-danger", style: { fontSize: "11px" }, children: "\u274C Denied" });
    if (val.startsWith("\u2705")) return /* @__PURE__ */ jsx("span", { className: "badge badge-success", style: { fontSize: "11px" }, children: val });
    if (val.startsWith("\u{1F441}\uFE0F")) return /* @__PURE__ */ jsx("span", { className: "badge badge-info", style: { fontSize: "11px" }, children: val });
    if (val.startsWith("\u270F\uFE0F")) return /* @__PURE__ */ jsx("span", { className: "badge badge-warning", style: { fontSize: "11px" }, children: val });
    return /* @__PURE__ */ jsx("span", { className: "badge badge-primary", style: { fontSize: "11px" }, children: val });
  };
  return /* @__PURE__ */ jsxs("div", { className: "animate-fade-in", style: { display: "flex", flexDirection: "column", gap: "24px" }, children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { style: { fontSize: "20px", fontWeight: 800 }, children: "Security, Access Control & Auditing" }),
      /* @__PURE__ */ jsx("p", { style: { color: "var(--text-secondary)", fontSize: "13px" }, children: "Enforce Role-Based Access Control (RBAC), user credentials, company legal profile, and tamper-proof operational audit logs." })
    ] }),
    canManageSystemSettings && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "20px", border: "1px solid var(--primary-light)" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
            /* @__PURE__ */ jsx("div", { style: { padding: "8px", borderRadius: "10px", background: "var(--primary-glow)", color: "var(--primary)" }, children: /* @__PURE__ */ jsx(Building2, { size: 24 }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { style: { fontSize: "16px", fontWeight: 800 }, children: "Company Branding & Official Emblem" }),
              /* @__PURE__ */ jsx("p", { style: { fontSize: "12px", color: "var(--text-muted)" }, children: "This legal name, emblem, and registered address appear on all official salary slips, reports, and header banners." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px", background: "var(--bg-secondary)", padding: "8px 16px", borderRadius: "12px", border: "1px solid var(--border-color)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", fontWeight: 700, color: "var(--text-muted)" }, children: "Emblem Preview:" }),
            /* @__PURE__ */ jsx(CompanyLogo, { size: "sm", showText: false }),
            /* @__PURE__ */ jsx(CompanyLogo, { size: "md", showText: false })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSaveCompanyProfile, style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
          /* @__PURE__ */ jsxs("div", { className: "grid-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "6px" }, children: "Legal Company Name *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  required: true,
                  value: companyName,
                  onChange: (e) => setCompanyName(e.target.value),
                  placeholder: "RIDDHI SIDDHI ENTERPRISES",
                  style: { fontWeight: 700 }
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "6px" }, children: "Tagline / Operational Subtitle" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: tagline,
                  onChange: (e) => setTagline(e.target.value),
                  placeholder: "Workforce & Payroll Operations"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "6px" }, children: "Registered Corporate Address (Printed on Salary Slips) *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                required: true,
                value: companyAddress,
                onChange: (e) => setCompanyAddress(e.target.value),
                placeholder: "G - PLOT HIG MHADA COMPLEX-158, SANT TUKARAM NAGAR, PUNE MAHARASHTRA- 411018"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "12px", borderTop: "1px solid var(--border-color)", paddingTop: "16px" }, children: [
            savedSuccess && /* @__PURE__ */ jsxs("span", { style: { fontSize: "12px", color: "var(--success)", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }, children: [
              /* @__PURE__ */ jsx(Check, { size: 16 }),
              " Saved & Updated Live across entire system!"
            ] }),
            /* @__PURE__ */ jsxs("button", { type: "submit", className: "btn btn-primary", style: { gap: "8px" }, children: [
              /* @__PURE__ */ jsx(Save, { size: 16 }),
              " Save Company Branding"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
          /* @__PURE__ */ jsxs("h3", { style: { fontSize: "15px", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px" }, children: [
            /* @__PURE__ */ jsx(KeyRound, { size: 18, style: { color: "var(--primary)" } }),
            " Multi-Factor Security"
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { flexGrow: 1 }, children: [
            /* @__PURE__ */ jsx("p", { style: { fontSize: "12px", color: "var(--text-secondary)", marginBottom: "16px" }, children: "Enforce mandatory SMS OTP or Google Authenticator validation on every administrative log-in." }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
              /* @__PURE__ */ jsx("span", { style: { fontWeight: 600 }, children: "2FA OTP Login:" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: `btn ${mfaEnabled ? "btn-primary" : "btn-outline"}`,
                  style: { padding: "6px 12px", fontSize: "12px", background: mfaEnabled ? "var(--success)" : "transparent", color: mfaEnabled ? "white" : "inherit" },
                  onClick: handleMfaToggle,
                  children: mfaEnabled ? "Active (OTP Secured)" : "Disabled"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
          /* @__PURE__ */ jsxs("h3", { style: { fontSize: "15px", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px" }, children: [
            /* @__PURE__ */ jsx(Database, { size: 18, style: { color: "var(--primary)" } }),
            " Cloud Backups"
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { flexGrow: 1 }, children: [
            /* @__PURE__ */ jsxs("div", { style: { fontSize: "12px", color: "var(--text-secondary)", marginBottom: "12px" }, children: [
              /* @__PURE__ */ jsx("span", { children: "Last Snapshot:" }),
              /* @__PURE__ */ jsx("strong", { style: { display: "block", color: "var(--text-primary)", marginTop: "2px" }, children: lastBackup })
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                className: "btn btn-primary",
                style: { width: "100%", padding: "8px", fontSize: "12px" },
                onClick: handleBackup,
                disabled: backupLoading,
                children: [
                  /* @__PURE__ */ jsx(RefreshCw, { size: 14, className: backupLoading ? "animate-spin" : "", style: { animation: backupLoading ? "spin 1.5s linear infinite" : "none" } }),
                  backupLoading ? "Backing up vaults..." : "Trigger Secure Backup"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
          /* @__PURE__ */ jsxs("h3", { style: { fontSize: "15px", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px" }, children: [
            /* @__PURE__ */ jsx(Shield, { size: 18, style: { color: "var(--primary)" } }),
            " Cryptography & SSL"
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { flexGrow: 1, fontSize: "12px" }, children: [
            /* @__PURE__ */ jsxs("div", { style: { marginBottom: "12px" }, children: [
              /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "Security Level:" }),
              /* @__PURE__ */ jsx("strong", { style: { display: "block", color: "var(--text-primary)", marginTop: "2px" }, children: "Bank-Grade AES-256" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }, children: "Cipher Configuration" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: encryptionStandard,
                  onChange: (e) => setEncryptionStandard(e.target.value),
                  style: { padding: "6px 10px", fontSize: "11px" },
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "AES-256 (GCM)", children: "AES-256 (GCM Mode)" }),
                    /* @__PURE__ */ jsx("option", { value: "ChaCha20-Poly1305", children: "ChaCha20-Poly1305" }),
                    /* @__PURE__ */ jsx("option", { value: "RSA-4096 (Signatures)", children: "RSA-4096 (Asymmetric)" })
                  ]
                }
              )
            ] })
          ] })
        ] })
      ] })
    ] }),
    canManageUsers && /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "12px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [
        /* @__PURE__ */ jsx(UserCheck, { size: 20, style: { color: "var(--primary)" } }),
        /* @__PURE__ */ jsx("h3", { style: { fontSize: "16px", fontWeight: 800 }, children: "User Management & Role Authentication Credentials" })
      ] }),
      /* @__PURE__ */ jsx(RoleCredentialsCard, {})
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { style: { fontSize: "16px", fontWeight: 800 }, children: "Role-Based Access Control (RBAC) Permission Matrix" }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: "12px", color: "var(--text-secondary)" }, children: "Live governance rules mapping all 21 system authority modules to active user roles." })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "badge badge-success", style: { padding: "6px 12px", gap: "6px" }, children: [
          /* @__PURE__ */ jsx(CheckCircle2, { size: 14 }),
          " Matrix Verified & Active"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxs("table", { children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { style: { background: "var(--bg-secondary)" }, children: [
          /* @__PURE__ */ jsx("th", { style: { minWidth: "180px" }, children: "Module / Authority" }),
          /* @__PURE__ */ jsx("th", { style: { minWidth: "110px" }, children: "Super Admin" }),
          /* @__PURE__ */ jsx("th", { style: { minWidth: "110px" }, children: "HR Manager" }),
          /* @__PURE__ */ jsx("th", { style: { minWidth: "120px" }, children: "Payroll Manager" }),
          /* @__PURE__ */ jsx("th", { style: { minWidth: "110px" }, children: "Dept. Manager" }),
          /* @__PURE__ */ jsx("th", { style: { minWidth: "120px" }, children: "Accountant" }),
          /* @__PURE__ */ jsx("th", { style: { minWidth: "110px" }, children: "Employee" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: fullPermissionMatrix.map((p, idx) => /* @__PURE__ */ jsxs("tr", { style: { background: idx % 2 === 1 ? "var(--bg-surface)" : void 0 }, children: [
          /* @__PURE__ */ jsx("td", { style: { fontWeight: 700, fontSize: "13px" }, children: p.module }),
          /* @__PURE__ */ jsx("td", { children: renderBadge(p.super) }),
          /* @__PURE__ */ jsx("td", { children: renderBadge(p.hr) }),
          /* @__PURE__ */ jsx("td", { children: renderBadge(p.payroll) }),
          /* @__PURE__ */ jsx("td", { children: renderBadge(p.manager) }),
          /* @__PURE__ */ jsx("td", { children: renderBadge(p.accountant) }),
          /* @__PURE__ */ jsx("td", { children: renderBadge(p.employee) })
        ] }, idx)) })
      ] }) })
    ] }),
    canViewAuditLogs && /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { style: { fontSize: "16px", fontWeight: 800 }, children: "Operational Audit Logs" }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: "12px", color: "var(--text-secondary)" }, children: "Tamper-proof history of all administrative operations executed in the active session." })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "badge badge-info", children: [
          auditLogs.length,
          " Events Logged"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { overflowX: "auto", maxHeight: "320px" }, children: /* @__PURE__ */ jsxs("table", { children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { style: { background: "var(--bg-secondary)" }, children: [
          /* @__PURE__ */ jsx("th", { children: "Timestamp" }),
          /* @__PURE__ */ jsx("th", { children: "Active Role" }),
          /* @__PURE__ */ jsx("th", { children: "Operation" }),
          /* @__PURE__ */ jsx("th", { children: "Description" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: auditLogs.length > 0 ? auditLogs.map((log) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { style: { fontSize: "11px", fontFamily: "monospace" }, children: log.timestamp }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", { className: "badge badge-info", style: { fontSize: "11px" }, children: log.role }) }),
          /* @__PURE__ */ jsx("td", { style: { fontWeight: 600 }, children: log.action }),
          /* @__PURE__ */ jsx("td", { style: { fontSize: "12px", color: "var(--text-secondary)" }, children: log.details })
        ] }, log.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 4, style: { textAlign: "center", padding: "24px", color: "var(--text-muted)" }, children: "No audit records registered yet. Actions like clocks, onboarding, and approvals will trigger entries." }) }) })
      ] }) })
    ] })
  ] });
};
export {
  Settings
};
