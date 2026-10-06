import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAppState } from "../context/StateContext";
import { KeyRound, Copy, Check, Eye, EyeOff, ShieldCheck, UserCheck, ArrowRight, Lock, ShieldAlert } from "lucide-react";
const ROLE_CREDENTIALS = [
  {
    role: "Super Admin",
    userId: "admin@riddhisiddhi.com",
    password: "Admin@2026",
    personaName: "Shejal",
    email: "admin@riddhisiddhi.com",
    scope: "Full System Access, System Config, Security & Backups",
    badgeClass: "badge-danger"
  },
  {
    role: "HR Manager",
    userId: "hr@riddhisiddhi.com",
    password: "Hr@2026#",
    personaName: "Hiralben",
    email: "sarah.connor@riddhisiddhi.com",
    scope: "Employee Directory, Onboarding, Leave Verification & Shifts",
    badgeClass: "badge-primary"
  },
  {
    role: "Payroll Manager",
    userId: "payroll@riddhisiddhi.com",
    password: "Payroll@2026",
    personaName: "Parth",
    email: "marcus.wright@riddhisiddhi.com",
    scope: "Salary Slips, Overtime & Loans Processing",
    badgeClass: "badge-warning"
  },
  {
    role: "Department Manager",
    userId: "manager@riddhisiddhi.com",
    password: "Manager@2026",
    personaName: "Manas",
    email: "john.connor@riddhisiddhi.com",
    scope: "Team Attendance & Leave Approvals",
    badgeClass: "badge-info"
  },
  {
    role: "Employee",
    userId: "200050",
    password: "Emp@200050",
    personaName: "Vaghela Pushprajsinh",
    email: "pushpraj.vaghela@riddhisiddhi.com",
    scope: "Self Attendance (GPS & Camera), Leaves & Payslips",
    badgeClass: "badge-success"
  },
  {
    role: "Accountant",
    userId: "accountant@riddhisiddhi.com",
    password: "Accounts@2026",
    personaName: "Finance Desk",
    email: "accounts@riddhisiddhi.com",
    scope: "Tax Reports, TDS, PF / ESIC Disbursals",
    badgeClass: "badge-primary"
  }
];
const RoleCredentialsCard = ({ fullScreen = false }) => {
  const { activeRole, setActiveRole, triggerSyncNotification } = useAppState();
  const [showPasswords, setShowPasswords] = useState({});
  const [copiedField, setCopiedField] = useState(null);
  const isSuperAdmin = activeRole === "Super Admin";
  const visibleCredentials = isSuperAdmin ? ROLE_CREDENTIALS : ROLE_CREDENTIALS.filter((c) => c.role === activeRole);
  const togglePasswordVisibility = (role) => {
    setShowPasswords((prev) => ({ ...prev, [role]: !prev[role] }));
  };
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    triggerSyncNotification(`\u{1F4CB} Copied ${label} to clipboard`);
    setTimeout(() => setCopiedField(null), 2e3);
  };
  return /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "18px", border: "1.5px solid rgba(99, 102, 241, 0.25)", flexGrow: fullScreen ? 1 : "unset" }, children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
        /* @__PURE__ */ jsx("div", { style: {
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          background: isSuperAdmin ? "var(--primary-light)" : "rgba(16, 185, 129, 0.1)",
          color: isSuperAdmin ? "var(--primary)" : "var(--success)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }, children: /* @__PURE__ */ jsx(KeyRound, { size: 22 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h3", { style: { fontSize: "16px", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: "8px" }, children: [
            isSuperAdmin ? "Master Role Credentials Directory" : "My Account Credentials",
            /* @__PURE__ */ jsx("span", { className: `badge ${isSuperAdmin ? "badge-danger" : "badge-success"}`, style: { fontSize: "10px", padding: "2px 8px" }, children: isSuperAdmin ? "SUPER ADMIN ACCESS (ALL ROLES)" : `RESTRICTED TO ${activeRole.toUpperCase()}` })
          ] }),
          /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "var(--text-secondary)" }, children: isSuperAdmin ? "Super Admin master authorization: Full visibility over all system roles and credentials." : `Restricted Access: Displaying credentials for your authenticated role (${activeRole}) only.` })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: isSuperAdmin ? /* @__PURE__ */ jsxs(
        "button",
        {
          className: "btn btn-outline",
          style: { fontSize: "11px", padding: "6px 12px", gap: "6px" },
          onClick: () => {
            const allVisible = Object.keys(showPasswords).length === ROLE_CREDENTIALS.length && Object.values(showPasswords).every(Boolean);
            const newState = {};
            ROLE_CREDENTIALS.forEach((r) => {
              newState[r.role] = !allVisible;
            });
            setShowPasswords(newState);
          },
          children: [
            /* @__PURE__ */ jsx(Lock, { size: 13 }),
            "Toggle All Passwords"
          ]
        }
      ) : /* @__PURE__ */ jsxs("span", { className: "badge badge-info", style: { fontSize: "11px", gap: "4px" }, children: [
        /* @__PURE__ */ jsx(ShieldCheck, { size: 13 }),
        " Authenticated as ",
        activeRole
      ] }) })
    ] }),
    !isSuperAdmin && /* @__PURE__ */ jsxs("div", { style: {
      background: "rgba(99, 102, 241, 0.08)",
      border: "1px solid var(--primary-light)",
      borderRadius: "8px",
      padding: "10px 14px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontSize: "12px",
      color: "var(--text-secondary)"
    }, children: [
      /* @__PURE__ */ jsx(ShieldAlert, { size: 16, style: { color: "var(--primary)", flexShrink: 0 } }),
      /* @__PURE__ */ jsxs("span", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Security Notice:" }),
        " In accordance with role-based access control (RBAC) policies, master credentials for other roles are hidden and only accessible by ",
        /* @__PURE__ */ jsx("strong", { children: "Super Admin" }),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { style: {
      overflowX: "auto",
      overflowY: "auto",
      maxHeight: fullScreen ? "calc(100vh - 270px)" : "400px",
      border: "1px solid var(--border-color-solid)",
      borderRadius: "10px",
      boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.1)",
      flexGrow: fullScreen ? 1 : "unset"
    }, children: /* @__PURE__ */ jsxs("table", { style: { width: "100%", minWidth: "850px", margin: 0 }, children: [
      /* @__PURE__ */ jsx("thead", { style: { position: "sticky", top: 0, zIndex: 2 }, children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { style: { background: "var(--bg-surface-solid)", borderBottom: "2px solid var(--border-color-solid)", padding: "14px 16px" }, children: "Role" }),
        /* @__PURE__ */ jsx("th", { style: { background: "var(--bg-surface-solid)", borderBottom: "2px solid var(--border-color-solid)", padding: "14px 16px" }, children: "Designated Persona" }),
        /* @__PURE__ */ jsx("th", { style: { background: "var(--bg-surface-solid)", borderBottom: "2px solid var(--border-color-solid)", padding: "14px 16px" }, children: "Login User ID / Username" }),
        /* @__PURE__ */ jsx("th", { style: { background: "var(--bg-surface-solid)", borderBottom: "2px solid var(--border-color-solid)", padding: "14px 16px" }, children: "Default Password" }),
        /* @__PURE__ */ jsx("th", { style: { background: "var(--bg-surface-solid)", borderBottom: "2px solid var(--border-color-solid)", padding: "14px 16px" }, children: "Access Scope" }),
        isSuperAdmin && /* @__PURE__ */ jsx("th", { style: { background: "var(--bg-surface-solid)", borderBottom: "2px solid var(--border-color-solid)", padding: "14px 16px" }, children: "Action" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: visibleCredentials.map((cred) => {
        const isActive = activeRole === cred.role;
        const isVisible = !!showPasswords[cred.role];
        const isIdCopied = copiedField === `${cred.role}-id`;
        const isPwCopied = copiedField === `${cred.role}-pw`;
        return /* @__PURE__ */ jsxs("tr", { style: { background: isActive ? "var(--primary-light)" : "transparent" }, children: [
          /* @__PURE__ */ jsx("td", { style: { padding: "14px 16px" }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
            /* @__PURE__ */ jsx("span", { className: `badge ${cred.badgeClass}`, style: { fontWeight: 800, fontSize: "11px" }, children: cred.role }),
            isActive && /* @__PURE__ */ jsx("span", { className: "badge badge-success", style: { fontSize: "9px", padding: "1px 6px" }, children: "ACTIVE" })
          ] }) }),
          /* @__PURE__ */ jsxs("td", { style: { padding: "14px 16px" }, children: [
            /* @__PURE__ */ jsx("strong", { style: { fontSize: "13px", display: "block" }, children: cred.personaName }),
            /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", color: "var(--text-muted)" }, children: cred.email })
          ] }),
          /* @__PURE__ */ jsx("td", { style: { padding: "14px 16px" }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
            /* @__PURE__ */ jsx("code", { style: {
              background: "var(--bg-secondary)",
              padding: "5px 10px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 700,
              color: "var(--text-primary)",
              border: "1px solid var(--border-color-solid)",
              fontFamily: "monospace"
            }, children: cred.userId }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "btn btn-outline",
                style: { padding: "4px 6px", height: "auto", border: "none", color: isIdCopied ? "var(--success)" : "var(--text-muted)" },
                onClick: () => copyToClipboard(cred.userId, `${cred.role}-id`),
                title: "Copy User ID",
                children: isIdCopied ? /* @__PURE__ */ jsx(Check, { size: 14 }) : /* @__PURE__ */ jsx(Copy, { size: 14 })
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx("td", { style: { padding: "14px 16px" }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [
            /* @__PURE__ */ jsx("code", { style: {
              background: "var(--bg-secondary)",
              padding: "5px 10px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 700,
              color: "#06b6d4",
              border: "1px solid var(--border-color-solid)",
              fontFamily: "monospace",
              minWidth: "120px",
              display: "inline-block"
            }, children: isVisible ? cred.password : "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "btn btn-outline",
                style: { padding: "4px 6px", height: "auto", border: "none", color: "var(--text-muted)" },
                onClick: () => togglePasswordVisibility(cred.role),
                title: isVisible ? "Hide password" : "Show password",
                children: isVisible ? /* @__PURE__ */ jsx(EyeOff, { size: 14 }) : /* @__PURE__ */ jsx(Eye, { size: 14 })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "btn btn-outline",
                style: { padding: "4px 6px", height: "auto", border: "none", color: isPwCopied ? "var(--success)" : "var(--text-muted)" },
                onClick: () => copyToClipboard(cred.password, `${cred.role}-pw`),
                title: "Copy Password",
                children: isPwCopied ? /* @__PURE__ */ jsx(Check, { size: 14 }) : /* @__PURE__ */ jsx(Copy, { size: 14 })
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx("td", { style: { fontSize: "12px", color: "var(--text-secondary)", maxWidth: "280px", padding: "14px 16px" }, children: cred.scope }),
          isSuperAdmin && /* @__PURE__ */ jsx("td", { style: { padding: "14px 16px" }, children: isActive ? /* @__PURE__ */ jsxs("span", { style: { fontSize: "11px", color: "var(--success)", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }, children: [
            /* @__PURE__ */ jsx(UserCheck, { size: 14 }),
            " Current"
          ] }) : /* @__PURE__ */ jsxs(
            "button",
            {
              className: "btn btn-outline",
              style: { padding: "6px 12px", fontSize: "11px", height: "auto", gap: "4px" },
              onClick: () => setActiveRole(cred.role),
              children: [
                "Switch ",
                /* @__PURE__ */ jsx(ArrowRight, { size: 12 })
              ]
            }
          ) })
        ] }, cred.role);
      }) })
    ] }) })
  ] });
};
export {
  ROLE_CREDENTIALS,
  RoleCredentialsCard
};
