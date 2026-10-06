import { jsx, jsxs } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
import { Camera, KeyRound, LogOut, ShieldCheck, ChevronRight } from "lucide-react";
const UserProfileMenu = ({
  isOpen,
  onClose,
  role,
  personaName,
  photoUrl,
  email,
  onChangePhotoClick,
  onForgotPasswordClick,
  onViewCredentialsClick,
  onLogoutClick
}) => {
  const menuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: menuRef,
      className: "glass-card",
      style: {
        position: "absolute",
        top: "68px",
        right: "24px",
        width: "320px",
        background: "var(--bg-surface-solid)",
        border: "1px solid var(--border-color-solid)",
        borderRadius: "16px",
        padding: "8px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
        zIndex: 1e3,
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        animation: "fadeIn 0.2s ease-out"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { style: {
          padding: "12px 14px",
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          borderBottom: "1px solid var(--border-color-solid)"
        }, children: [
          /* @__PURE__ */ jsx("div", { style: {
            width: "46px",
            height: "46px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid var(--primary)",
            flexShrink: 0,
            boxShadow: "0 0 10px rgba(99, 102, 241, 0.3)"
          }, children: /* @__PURE__ */ jsx("img", { src: photoUrl, alt: "User Avatar", style: { width: "100%", height: "100%", objectFit: "cover" } }) }),
          /* @__PURE__ */ jsxs("div", { style: { overflow: "hidden" }, children: [
            /* @__PURE__ */ jsx("strong", { style: { fontSize: "14px", color: "var(--text-primary)", display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }, children: personaName }),
            /* @__PURE__ */ jsx("span", { className: "badge badge-primary", style: { fontSize: "10px", padding: "1px 6px", marginTop: "2px", display: "inline-block" }, children: role }),
            /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", color: "var(--text-muted)", display: "block", marginTop: "2px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }, children: email })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "2px", marginTop: "4px" }, children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: "btn btn-outline",
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                border: "none",
                borderRadius: "10px",
                width: "100%",
                textAlign: "left",
                color: "var(--text-primary)",
                fontSize: "13px"
              },
              onClick: () => {
                onClose();
                onChangePhotoClick();
              },
              children: [
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [
                  /* @__PURE__ */ jsx("div", { style: { padding: "6px", borderRadius: "8px", background: "rgba(6, 182, 212, 0.1)", color: "#06b6d4" }, children: /* @__PURE__ */ jsx(Camera, { size: 16 }) }),
                  /* @__PURE__ */ jsx("span", { children: "Change Profile Picture" })
                ] }),
                /* @__PURE__ */ jsx(ChevronRight, { size: 16, style: { color: "var(--text-muted)" } })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: "btn btn-outline",
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                border: "none",
                borderRadius: "10px",
                width: "100%",
                textAlign: "left",
                color: "var(--text-primary)",
                fontSize: "13px"
              },
              onClick: () => {
                onClose();
                onForgotPasswordClick();
              },
              children: [
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [
                  /* @__PURE__ */ jsx("div", { style: { padding: "6px", borderRadius: "8px", background: "rgba(99, 102, 241, 0.1)", color: "var(--primary)" }, children: /* @__PURE__ */ jsx(KeyRound, { size: 16 }) }),
                  /* @__PURE__ */ jsx("span", { children: "Forgot / Change Password" })
                ] }),
                /* @__PURE__ */ jsx(ChevronRight, { size: 16, style: { color: "var(--text-muted)" } })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: "btn btn-outline",
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                border: "none",
                borderRadius: "10px",
                width: "100%",
                textAlign: "left",
                color: "var(--text-primary)",
                fontSize: "13px"
              },
              onClick: () => {
                onClose();
                onViewCredentialsClick();
              },
              children: [
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [
                  /* @__PURE__ */ jsx("div", { style: { padding: "6px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.1)", color: "var(--success)" }, children: /* @__PURE__ */ jsx(ShieldCheck, { size: 16 }) }),
                  /* @__PURE__ */ jsx("span", { children: "View Access Credentials" })
                ] }),
                /* @__PURE__ */ jsx(ChevronRight, { size: 16, style: { color: "var(--text-muted)" } })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { style: { height: "1px", background: "var(--border-color-solid)", margin: "4px 6px" } }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: "btn btn-outline",
            style: {
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              border: "none",
              borderRadius: "10px",
              width: "100%",
              textAlign: "left",
              color: "var(--danger)",
              fontSize: "13px",
              fontWeight: 700
            },
            onClick: () => {
              onClose();
              onLogoutClick();
            },
            children: [
              /* @__PURE__ */ jsx("div", { style: { padding: "6px", borderRadius: "8px", background: "rgba(239, 68, 68, 0.1)", color: "var(--danger)" }, children: /* @__PURE__ */ jsx(LogOut, { size: 16 }) }),
              /* @__PURE__ */ jsx("span", { children: "Logout Session" })
            ]
          }
        )
      ]
    }
  );
};
export {
  UserProfileMenu
};
