import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { X, KeyRound, Maximize2, Minimize2 } from "lucide-react";
import { RoleCredentialsCard } from "./RoleCredentialsCard";
const RoleCredentialsModal = ({
  isOpen,
  onClose
}) => {
  const [isFullScreen, setIsFullScreen] = useState(true);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "modal-overlay",
      style: {
        padding: isFullScreen ? 0 : "24px",
        alignItems: isFullScreen ? "stretch" : "center",
        justifyContent: isFullScreen ? "stretch" : "center",
        background: "rgba(0, 0, 0, 0.85)",
        zIndex: 999
      },
      onClick: (e) => {
        if (e.target === e.currentTarget && !isFullScreen) onClose();
      },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: "modal-content glass-card",
          style: {
            width: isFullScreen ? "100vw" : "95vw",
            maxWidth: isFullScreen ? "100vw" : "1100px",
            height: isFullScreen ? "100vh" : "auto",
            maxHeight: isFullScreen ? "100vh" : "90vh",
            background: "var(--bg-surface-solid)",
            border: isFullScreen ? "none" : "1px solid var(--border-color-solid)",
            padding: 0,
            borderRadius: isFullScreen ? 0 : "16px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: isFullScreen ? "none" : "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
            transition: "all 0.2s ease-out"
          },
          children: [
            /* @__PURE__ */ jsxs("div", { style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: isFullScreen ? "18px 32px" : "16px 24px",
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(6, 182, 212, 0.18) 100%)",
              borderBottom: "1px solid var(--border-color-solid)",
              flexShrink: 0
            }, children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "14px" }, children: [
                /* @__PURE__ */ jsx("div", { style: {
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  background: "var(--primary-light)",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 12px rgba(99, 102, 241, 0.25)"
                }, children: /* @__PURE__ */ jsx(KeyRound, { size: 24 }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("h2", { style: { fontSize: isFullScreen ? "20px" : "17px", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: "10px" }, children: [
                    "System Access & Role Credentials",
                    /* @__PURE__ */ jsx("span", { className: "badge badge-primary", style: { fontSize: "10px", padding: "2px 8px", fontWeight: 700 }, children: isFullScreen ? "FULL SCREEN" : "WINDOWED" })
                  ] }),
                  /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "var(--text-secondary)" }, children: "Complete User ID, Passwords, and Persona Credentials Directory for all system roles" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    className: "btn btn-outline",
                    style: { padding: "8px 14px", borderRadius: "8px", fontSize: "12px", gap: "6px", fontWeight: 600 },
                    onClick: () => setIsFullScreen(!isFullScreen),
                    title: isFullScreen ? "Exit Full Screen" : "Open in Full Screen",
                    children: [
                      isFullScreen ? /* @__PURE__ */ jsx(Minimize2, { size: 16 }) : /* @__PURE__ */ jsx(Maximize2, { size: 16 }),
                      /* @__PURE__ */ jsx("span", { children: isFullScreen ? "Exit Fullscreen" : "Full Screen" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: "btn btn-outline",
                    style: { padding: "8px", borderRadius: "8px", border: "none", color: "var(--text-muted)" },
                    onClick: onClose,
                    title: "Close (ESC)",
                    children: /* @__PURE__ */ jsx(X, { size: 22 })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { style: {
              padding: isFullScreen ? "24px 32px" : "20px 24px",
              overflowY: "auto",
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            }, children: /* @__PURE__ */ jsx(RoleCredentialsCard, { fullScreen: isFullScreen }) })
          ]
        }
      )
    }
  );
};
export {
  RoleCredentialsModal
};
