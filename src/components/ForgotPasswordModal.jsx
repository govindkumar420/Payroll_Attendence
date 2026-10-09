import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAppState } from "../context/StateContext";
import { KeyRound, X, Check, Mail, Eye, EyeOff } from "lucide-react";
const ForgotPasswordModal = ({
  isOpen,
  onClose,
  role,
  personaName,
  userEmail
}) => {
  const { isAdministratorSession, updateUserPassword, triggerSyncNotification } = useAppState();
  const [activeTab, setActiveTab] = useState("change");
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [resetEmail, setResetEmail] = useState(userEmail);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  if (!isOpen || !isAdministratorSession) return null;
  const handleChangePassword = (e) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!newPass) {
      setErrorMsg("Please enter a new password.");
      return;
    }
    if (newPass.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    if (newPass !== confirmPass) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (!updateUserPassword(role, newPass)) return;
    setSuccessMsg("Password updated successfully!");
    setTimeout(() => {
      onClose();
      setSuccessMsg(null);
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
    }, 1500);
  };
  const handleSendOtp = (e) => {
    e.preventDefault();
    setOtpSent(true);
    triggerSyncNotification(`\u{1F4E7} Verification OTP sent to ${resetEmail}: 849201`);
  };
  const handleVerifyOtpAndReset = (e) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!otpCode) {
      setErrorMsg("Please enter the 6-digit OTP code.");
      return;
    }
    if (!newPass || newPass.length < 6) {
      setErrorMsg("New password must be at least 6 characters.");
      return;
    }
    if (newPass !== confirmPass) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (!updateUserPassword(role, newPass)) return;
    setSuccessMsg("Password reset successfully via verified OTP!");
    setTimeout(() => {
      onClose();
      setSuccessMsg(null);
      setOtpSent(false);
      setOtpCode("");
      setNewPass("");
      setConfirmPass("");
    }, 1500);
  };
  return /* @__PURE__ */ jsx("div", { className: "modal-overlay", onClick: (e) => {
    if (e.target === e.currentTarget) onClose();
  }, children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: "modal-content glass-card",
      style: {
        maxWidth: "480px",
        width: "100%",
        background: "var(--bg-surface-solid)",
        border: "1px solid var(--border-color-solid)",
        padding: 0,
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.55)"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          background: "linear-gradient(135deg, rgba(0, 143, 131, 0.12) 0%, rgba(0, 150, 136, 0.12) 100%)",
          borderBottom: "1px solid var(--border-color-solid)"
        }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [
            /* @__PURE__ */ jsx("div", { style: {
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "var(--primary-light)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }, children: /* @__PURE__ */ jsx(KeyRound, { size: 20 }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { style: { fontSize: "16px", fontWeight: 800, margin: 0 }, children: "Account Security & Password" }),
              /* @__PURE__ */ jsxs("span", { style: { fontSize: "12px", color: "var(--text-secondary)" }, children: [
                personaName,
                " (",
                role,
                ")"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "btn btn-outline",
              style: { padding: "6px", borderRadius: "8px", border: "none", color: "var(--text-muted)" },
              onClick: onClose,
              children: /* @__PURE__ */ jsx(X, { size: 20 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", borderBottom: "1px solid var(--border-color-solid)" }, children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              style: {
                flex: 1,
                padding: "12px",
                background: activeTab === "change" ? "var(--primary-light)" : "transparent",
                border: "none",
                borderBottom: activeTab === "change" ? "2px solid var(--primary)" : "none",
                color: activeTab === "change" ? "var(--primary)" : "var(--text-secondary)",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer"
              },
              onClick: () => {
                setActiveTab("change");
                setErrorMsg(null);
                setSuccessMsg(null);
              },
              children: "Change Password"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              style: {
                flex: 1,
                padding: "12px",
                background: activeTab === "reset" ? "var(--primary-light)" : "transparent",
                border: "none",
                borderBottom: activeTab === "reset" ? "2px solid var(--primary)" : "none",
                color: activeTab === "reset" ? "var(--primary)" : "var(--text-secondary)",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer"
              },
              onClick: () => {
                setActiveTab("reset");
                setErrorMsg(null);
                setSuccessMsg(null);
              },
              children: "Forgot Password / Reset"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }, children: [
          errorMsg && /* @__PURE__ */ jsx("div", { style: {
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid var(--danger)",
            color: "var(--danger)",
            padding: "10px 14px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600
          }, children: errorMsg }),
          successMsg && /* @__PURE__ */ jsxs("div", { style: {
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid var(--success)",
            color: "var(--success)",
            padding: "10px 14px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }, children: [
            /* @__PURE__ */ jsx(Check, { size: 16 }),
            " ",
            successMsg
          ] }),
          activeTab === "change" ? /* @__PURE__ */ jsxs("form", { onSubmit: handleChangePassword, style: { display: "flex", flexDirection: "column", gap: "14px" }, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Current Password" }),
              /* @__PURE__ */ jsxs("div", { style: { position: "relative" }, children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: showPassword ? "text" : "password",
                    value: currentPass,
                    onChange: (e) => setCurrentPass(e.target.value),
                    placeholder: "Enter current password",
                    required: true
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    style: { position: "absolute", right: "10px", top: "10px", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" },
                    onClick: () => setShowPassword(!showPassword),
                    children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { size: 16 }) : /* @__PURE__ */ jsx(Eye, { size: 16 })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "New Password" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: showPassword ? "text" : "password",
                  value: newPass,
                  onChange: (e) => setNewPass(e.target.value),
                  placeholder: "At least 6 characters",
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Confirm New Password" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: showPassword ? "text" : "password",
                  value: confirmPass,
                  onChange: (e) => setConfirmPass(e.target.value),
                  placeholder: "Re-enter new password",
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }, children: [
              /* @__PURE__ */ jsx("button", { type: "button", className: "btn btn-outline", style: { fontSize: "12px", padding: "8px 16px" }, onClick: onClose, children: "Cancel" }),
              /* @__PURE__ */ jsxs("button", { type: "submit", className: "btn btn-primary", style: { fontSize: "12px", padding: "8px 22px", fontWeight: 700 }, children: [
                /* @__PURE__ */ jsx(Check, { size: 14 }),
                " Update Password"
              ] })
            ] })
          ] }) : /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "14px" }, children: !otpSent ? /* @__PURE__ */ jsxs("form", { onSubmit: handleSendOtp, style: { display: "flex", flexDirection: "column", gap: "14px" }, children: [
            /* @__PURE__ */ jsx("p", { style: { fontSize: "12px", color: "var(--text-secondary)", margin: 0 }, children: "Enter your registered email address to receive a 6-digit security OTP to reset your password." }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Registered Email" }),
              /* @__PURE__ */ jsx("div", { style: { position: "relative" }, children: /* @__PURE__ */ jsx(
                "input",
                {
                  type: "email",
                  value: resetEmail,
                  onChange: (e) => setResetEmail(e.target.value),
                  placeholder: "user@nexapay.com",
                  required: true
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "6px" }, children: [
              /* @__PURE__ */ jsx("button", { type: "button", className: "btn btn-outline", style: { fontSize: "12px", padding: "8px 16px" }, onClick: onClose, children: "Cancel" }),
              /* @__PURE__ */ jsxs("button", { type: "submit", className: "btn btn-primary", style: { fontSize: "12px", padding: "8px 20px", fontWeight: 700 }, children: [
                /* @__PURE__ */ jsx(Mail, { size: 14 }),
                " Send Security OTP"
              ] })
            ] })
          ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleVerifyOtpAndReset, style: { display: "flex", flexDirection: "column", gap: "14px" }, children: [
            /* @__PURE__ */ jsx("div", { style: {
              background: "var(--bg-secondary)",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "12px",
              border: "1px solid var(--border-color-solid)"
            }, children: /* @__PURE__ */ jsxs("span", { children: [
              "Security Code sent to ",
              /* @__PURE__ */ jsx("strong", { children: resetEmail }),
              " (Demo OTP: ",
              /* @__PURE__ */ jsx("strong", { children: "849201" }),
              ")"
            ] }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "6-Digit OTP Code" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  maxLength: 6,
                  value: otpCode,
                  onChange: (e) => setOtpCode(e.target.value),
                  placeholder: "e.g. 849201",
                  style: { letterSpacing: "4px", fontFamily: "monospace", fontWeight: 700, fontSize: "16px" },
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "New Password" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "password",
                  value: newPass,
                  onChange: (e) => setNewPass(e.target.value),
                  placeholder: "Create a strong password",
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Confirm New Password" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "password",
                  value: confirmPass,
                  onChange: (e) => setConfirmPass(e.target.value),
                  placeholder: "Re-enter new password",
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "6px" }, children: [
              /* @__PURE__ */ jsx("button", { type: "button", className: "btn btn-outline", style: { fontSize: "12px", padding: "8px 14px" }, onClick: () => setOtpSent(false), children: "Back" }),
              /* @__PURE__ */ jsxs("button", { type: "submit", className: "btn btn-primary", style: { fontSize: "12px", padding: "8px 22px", fontWeight: 700 }, children: [
                /* @__PURE__ */ jsx(Check, { size: 14 }),
                " Reset & Login"
              ] })
            ] })
          ] }) })
        ] })
      ]
    }
  ) });
};
export {
  ForgotPasswordModal
};
