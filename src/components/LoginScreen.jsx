import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAppState } from "../context/StateContext";
import { CompanyLogo } from "./CompanyLogo";
import { ROLE_CREDENTIALS } from "./RoleCredentialsCard";
import { ArrowRight, ShieldCheck } from "lucide-react";
const LoginScreen = () => {
  const { login } = useAppState();
  const [selectedRole, setSelectedRole] = useState("Super Admin");
  const [userIdInput, setUserIdInput] = useState("admin@gnosisventures.com");
  const [passwordInput, setPasswordInput] = useState("Admin@2026");
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    const cred = ROLE_CREDENTIALS.find((c) => c.role === role);
    if (cred) {
      setUserIdInput(cred.userId);
      setPasswordInput(cred.password);
    }
  };
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login(selectedRole);
  };
  return /* @__PURE__ */ jsxs("div", { style: {
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "radial-gradient(ellipse at center, #1e293b 0%, #090d16 100%)",
    padding: "24px"
  }, children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "glass-card",
        style: {
          maxWidth: "460px",
          width: "100%",
          padding: "36px 32px",
          borderRadius: "20px",
          border: "1.5px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6)",
          display: "flex",
          flexDirection: "column",
          gap: "24px"
        },
        children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "12px" }, children: [
            /* @__PURE__ */ jsx("div", { style: { background: "white", padding: "10px", borderRadius: "16px", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }, children: /* @__PURE__ */ jsx(CompanyLogo, { size: "md" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h1", { style: { fontSize: "20px", fontWeight: 900, letterSpacing: "0.5px" }, children: "Gnosis Ventures" }),
              /* @__PURE__ */ jsx("p", { style: { fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }, children: "Workforce, Biometric Attendance & Payroll Platform" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)", display: "block", marginBottom: "8px" }, children: "Select Persona to Sign In:" }),
            /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }, children: ROLE_CREDENTIALS.map((cred) => /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: `btn ${selectedRole === cred.role ? "btn-primary" : "btn-outline"}`,
                style: {
                  padding: "6px 4px",
                  fontSize: "11px",
                  borderRadius: "8px",
                  textAlign: "center",
                  fontWeight: selectedRole === cred.role ? 800 : 500
                },
                onClick: () => handleRoleSelect(cred.role),
                children: cred.personaName
              },
              cred.role
            )) })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleLoginSubmit, style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "User ID / Email" }),
              /* @__PURE__ */ jsx("div", { style: { position: "relative" }, children: /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: userIdInput,
                  onChange: (e) => setUserIdInput(e.target.value),
                  placeholder: "Enter User ID",
                  required: true
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }, children: [
                /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600 }, children: "Password" }),
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "password",
                  value: passwordInput,
                  onChange: (e) => setPasswordInput(e.target.value),
                  placeholder: "Enter Password",
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "submit",
                className: "btn btn-primary",
                style: {
                  padding: "12px",
                  fontSize: "14px",
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #009688 0%, #008f83 100%)",
                  color: "white",
                  boxShadow: "0 4px 16px rgba(0, 143, 131, 0.4)",
                  marginTop: "8px"
                },
                children: [
                  "Sign In as ",
                  selectedRole,
                  " ",
                  /* @__PURE__ */ jsx(ArrowRight, { size: 16 })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", fontSize: "11px", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }, children: [
            /* @__PURE__ */ jsx(ShieldCheck, { size: 14, style: { color: "var(--success)" } }),
            /* @__PURE__ */ jsx("span", { children: "256-Bit Encrypted Authentication Gateway" })
          ] })
        ]
      }
    ),
  ] });
};
export {
  LoginScreen
};
