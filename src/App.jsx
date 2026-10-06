import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useAppState } from "./context/StateContext";
import { getPermissions, isTabVisibleForRole } from "./utils/permissions";
import { Dashboard } from "./views/Dashboard";
import { Employees } from "./views/Employees";
import { Attendance } from "./views/Attendance";
import { Shifts } from "./views/Shifts";
import { Leaves } from "./views/Leaves";
import { Payroll } from "./views/Payroll";
import { Loans } from "./views/Loans";
import { Reports } from "./views/Reports";
import { Settings } from "./views/Settings";
import { CompanyLogo } from "./components/CompanyLogo";
import { RoleCredentialsModal } from "./components/RoleCredentialsModal";
import { UserProfileMenu } from "./components/UserProfileMenu";
import { ChangeProfilePhotoModal } from "./components/ChangeProfilePhotoModal";
import { ForgotPasswordModal } from "./components/ForgotPasswordModal";
import { LoginScreen } from "./components/LoginScreen";
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  ClipboardCheck,
  DollarSign,
  Wallet,
  FileBarChart,
  Shield,
  Sun,
  Moon,
  MessageSquare,
  Menu,
  X,
  KeyRound,
  ChevronDown
} from "lucide-react";
const App = () => {
  const { theme, setTheme, activeRole, setActiveRole, notifications, personaPhotos, isLoggedIn, logout } = useAppState();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== "undefined" ? window.innerWidth > 768 : true);
  const [credentialsModalOpen, setCredentialsModalOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [changePhotoModalOpen, setChangePhotoModalOpen] = useState(false);
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);
  const permissions = getPermissions(activeRole);
  useEffect(() => {
    if (!isTabVisibleForRole(activeRole, activeTab)) {
      setActiveTab("dashboard");
    }
  }, [activeRole, activeTab]);
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };
  const getPersonaName = () => {
    switch (activeRole) {
      case "Super Admin":
        return "Shejal (Admin)";
      case "HR Manager":
        return "Hiralben (HR)";
      case "Payroll Manager":
        return "Parth (Pay)";
      case "Department Manager":
        return "Manas (Mgr)";
      case "Employee":
        return "Vaghela Pushprajsinh (EMP-200050)";
      case "Accountant":
        return "Finance Desk (Fin)";
      default:
        return "User Session";
    }
  };
  const getPersonaPhoto = () => {
    return personaPhotos[activeRole] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150";
  };
  const getPersonaEmail = () => {
    switch (activeRole) {
      case "Super Admin":
        return "admin@riddhisiddhi.com";
      case "HR Manager":
        return "hr@riddhisiddhi.com";
      case "Payroll Manager":
        return "payroll@riddhisiddhi.com";
      case "Department Manager":
        return "manager@riddhisiddhi.com";
      case "Employee":
        return "pushpraj.vaghela@riddhisiddhi.com";
      case "Accountant":
        return "accountant@riddhisiddhi.com";
      default:
        return "user@riddhisiddhi.com";
    }
  };
  if (!isLoggedIn) {
    return /* @__PURE__ */ jsx(LoginScreen, {});
  }
  const renderView = () => {
    switch (activeTab) {
      case "dashboard":
        return /* @__PURE__ */ jsx(Dashboard, {});
      case "employees":
        return /* @__PURE__ */ jsx(Employees, {});
      case "attendance":
        return /* @__PURE__ */ jsx(Attendance, {});
      case "shifts":
        return /* @__PURE__ */ jsx(Shifts, {});
      case "leaves":
        return /* @__PURE__ */ jsx(Leaves, {});
      case "payroll":
        return /* @__PURE__ */ jsx(Payroll, {});
      case "loans":
        return /* @__PURE__ */ jsx(Loans, {});
      case "reports":
        return /* @__PURE__ */ jsx(Reports, {});
      case "settings":
        return /* @__PURE__ */ jsx(Settings, {});
      default:
        return /* @__PURE__ */ jsx(Dashboard, {});
    }
  };
  const allNavItems = [
    { id: "dashboard", label: "Dashboard", icon: /* @__PURE__ */ jsx(LayoutDashboard, { size: 18 }) },
    {
      id: "employees",
      label: permissions.employeeManagement === "Team" ? "Team Directory" : permissions.employeeManagement === "Own" ? "My Profile" : "Employees Directory",
      icon: /* @__PURE__ */ jsx(Users, { size: 18 })
    },
    {
      id: "attendance",
      label: activeRole === "Employee" ? "My Attendance" : "Attendance Terminal",
      icon: /* @__PURE__ */ jsx(Clock, { size: 18 })
    },
    {
      id: "shifts",
      label: activeRole === "Employee" ? "My Shift & Calendar" : "Shift & Calendar",
      icon: /* @__PURE__ */ jsx(CalendarDays, { size: 18 })
    },
    {
      id: "leaves",
      label: activeRole === "Employee" ? "Apply Leave" : permissions.leaveManagement === "Approve" ? "Leave Approvals" : "Leave Desk",
      icon: /* @__PURE__ */ jsx(ClipboardCheck, { size: 18 })
    },
    {
      id: "payroll",
      label: activeRole === "Employee" ? "My Payslips" : "Payroll Center",
      icon: /* @__PURE__ */ jsx(DollarSign, { size: 18 })
    },
    {
      id: "loans",
      label: activeRole === "Employee" ? "Request Advance" : "Loans & Advances",
      icon: /* @__PURE__ */ jsx(Wallet, { size: 18 })
    },
    {
      id: "reports",
      label: activeRole === "Employee" ? "My Summary" : activeRole === "Accountant" ? "Financial Reports" : "Statutory Reports",
      icon: /* @__PURE__ */ jsx(FileBarChart, { size: 18 })
    },
    {
      id: "settings",
      label: activeRole === "HR Manager" ? "User Management" : activeRole === "Payroll Manager" ? "Audit Logs" : "Security & Settings",
      icon: /* @__PURE__ */ jsx(Shield, { size: 18 })
    }
  ];
  const visibleNavItems = allNavItems.filter((item) => isTabVisibleForRole(activeRole, item.id));
  return /* @__PURE__ */ jsxs("div", { className: "app-container", "data-theme": theme, children: [
    sidebarOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "sidebar-backdrop",
        onClick: () => setSidebarOpen(false)
      }
    ),
    sidebarOpen && /* @__PURE__ */ jsxs("aside", { className: "sidebar", children: [
      /* @__PURE__ */ jsx("div", { style: { marginBottom: "28px", padding: "0 6px" }, children: /* @__PURE__ */ jsx(CompanyLogo, { size: "sm", showText: true }) }),
      /* @__PURE__ */ jsx("nav", { style: { display: "flex", flexDirection: "column", gap: "6px", flexGrow: 1 }, children: visibleNavItems.map((item) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handleNavClick(item.id),
          style: {
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            borderRadius: "10px",
            border: "none",
            background: activeTab === item.id ? "var(--primary-light)" : "transparent",
            color: activeTab === item.id ? "var(--primary)" : "var(--text-secondary)",
            fontWeight: activeTab === item.id ? 700 : 500,
            fontSize: "13px",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.2s ease",
            width: "100%"
          },
          children: [
            item.icon,
            item.label
          ]
        },
        item.id
      )) }),
      /* @__PURE__ */ jsxs("div", { style: {
        borderTop: "1px solid var(--border-color)",
        paddingTop: "20px",
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
      }, children: [
        /* @__PURE__ */ jsxs("span", { style: { fontSize: "10px", color: "var(--text-muted)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "6px" }, children: [
          /* @__PURE__ */ jsx(MessageSquare, { size: 12 }),
          " Gateways Dispatch Log"
        ] }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "8px", maxHeight: "160px", overflowY: "auto" }, children: notifications.length > 0 ? notifications.slice(0, 4).map((note, idx) => /* @__PURE__ */ jsx("div", { style: {
          background: "var(--border-color)",
          padding: "8px 10px",
          borderRadius: "8px",
          fontSize: "11px",
          color: "var(--text-secondary)",
          borderLeft: "3px solid var(--primary)"
        }, children: note }, idx)) : /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", color: "var(--text-muted)", fontStyle: "italic", padding: "0 8px" }, children: "No gateway events dispatched." }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("main", { className: "main-content", children: [
      /* @__PURE__ */ jsxs("header", { className: "header", children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setSidebarOpen(!sidebarOpen),
              style: { background: "transparent", border: "none", cursor: "pointer", color: "var(--text-primary)" },
              children: sidebarOpen ? /* @__PURE__ */ jsx(X, { size: 20 }) : /* @__PURE__ */ jsx(Menu, { size: 20 })
            }
          ),
          /* @__PURE__ */ jsx("h1", { style: { fontSize: "18px", fontWeight: 800 }, children: allNavItems.find((n) => n.id === activeTab)?.label }),
          /* @__PURE__ */ jsxs("div", { className: "badge badge-primary", style: { fontSize: "11px", fontWeight: 700, padding: "4px 10px", gap: "6px", background: "var(--primary-glow)", border: "1px solid var(--primary)" }, children: [
            /* @__PURE__ */ jsx(CompanyLogo, { size: "xs" }),
            /* @__PURE__ */ jsx("span", { children: "RIDDHI SIDDHI ENTERPRISES" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "20px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }, children: "Role Switcher:" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: activeRole,
                onChange: (e) => setActiveRole(e.target.value),
                style: { width: "170px", padding: "6px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: 600 },
                children: [
                  /* @__PURE__ */ jsx("option", { value: "Super Admin", children: "Super Admin" }),
                  /* @__PURE__ */ jsx("option", { value: "HR Manager", children: "HR Manager" }),
                  /* @__PURE__ */ jsx("option", { value: "Payroll Manager", children: "Payroll Manager" }),
                  /* @__PURE__ */ jsx("option", { value: "Department Manager", children: "Department Manager" }),
                  /* @__PURE__ */ jsx("option", { value: "Employee", children: "Employee Persona" }),
                  /* @__PURE__ */ jsx("option", { value: "Accountant", children: "Accountant" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: "btn btn-outline",
              onClick: () => setCredentialsModalOpen(true),
              style: { fontSize: "11px", padding: "6px 12px", gap: "6px", borderRadius: "8px", fontWeight: 700 },
              title: "View User IDs & Passwords for all roles",
              children: [
                /* @__PURE__ */ jsx(KeyRound, { size: 14, style: { color: "#06b6d4" } }),
                /* @__PURE__ */ jsx("span", { children: "IDs & Passwords" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "btn btn-outline",
              onClick: toggleTheme,
              style: { padding: "8px", borderRadius: "50%", width: "36px", height: "36px" },
              children: theme === "light" ? /* @__PURE__ */ jsx(Moon, { size: 18 }) : /* @__PURE__ */ jsx(Sun, { size: 18 })
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "10px",
                borderLeft: "1px solid var(--border-color)",
                paddingLeft: "20px",
                cursor: "pointer",
                padding: "6px 12px 6px 16px",
                borderRadius: "10px",
                background: profileMenuOpen ? "var(--primary-light)" : "transparent",
                transition: "all 0.2s ease"
              },
              onClick: () => setProfileMenuOpen(!profileMenuOpen),
              title: "Account Options (Change Photo, Password, Logout)",
              children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: getPersonaPhoto(),
                    alt: "user profile",
                    style: { width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover", border: "1.5px solid var(--primary)" }
                  }
                ),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("span", { style: { fontSize: "12px", fontWeight: 800, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "4px" }, children: [
                    getPersonaName(),
                    /* @__PURE__ */ jsx(ChevronDown, { size: 14, style: { color: "var(--text-muted)", transform: profileMenuOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" } })
                  ] }),
                  /* @__PURE__ */ jsx("span", { style: { fontSize: "10px", color: "var(--text-muted)", display: "block", textTransform: "capitalize" }, children: activeRole })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            UserProfileMenu,
            {
              isOpen: profileMenuOpen,
              onClose: () => setProfileMenuOpen(false),
              role: activeRole,
              personaName: getPersonaName(),
              photoUrl: getPersonaPhoto(),
              email: getPersonaEmail(),
              onChangePhotoClick: () => setChangePhotoModalOpen(true),
              onForgotPasswordClick: () => setForgotPasswordModalOpen(true),
              onViewCredentialsClick: () => setCredentialsModalOpen(true),
              onLogoutClick: logout
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "view-container", children: renderView() })
    ] }),
    /* @__PURE__ */ jsx(
      ChangeProfilePhotoModal,
      {
        isOpen: changePhotoModalOpen,
        onClose: () => setChangePhotoModalOpen(false),
        currentPhoto: getPersonaPhoto(),
        role: activeRole,
        personaName: getPersonaName()
      }
    ),
    /* @__PURE__ */ jsx(
      ForgotPasswordModal,
      {
        isOpen: forgotPasswordModalOpen,
        onClose: () => setForgotPasswordModalOpen(false),
        role: activeRole,
        personaName: getPersonaName(),
        userEmail: getPersonaEmail()
      }
    ),
    /* @__PURE__ */ jsx(
      RoleCredentialsModal,
      {
        isOpen: credentialsModalOpen,
        onClose: () => setCredentialsModalOpen(false)
      }
    )
  ] });
};
var App_default = App;
export {
  App,
  App_default as default
};
