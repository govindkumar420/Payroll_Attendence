import { jsx, jsxs } from "react/jsx-runtime";
import { X, MapPin, ShieldCheck, Clock, User, Calendar, CheckCircle2, Download } from "lucide-react";
const PhotoVerificationModal = ({
  record,
  employee,
  onClose
}) => {
  if (!record) return null;
  const empName = employee?.name || record.employeeId;
  const empDept = employee?.department || "Operations";
  const empDesignation = employee?.designation || "Staff Associate";
  const downloadCertificate = () => {
    if (!record.photo) return;
    const link = document.createElement("a");
    link.href = record.photo;
    link.download = `attendance-verification-${record.employeeId}-${record.date}.jpg`;
    link.click();
  };
  return /* @__PURE__ */ jsx("div", { className: "modal-overlay", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: "modal-content glass-card",
      style: {
        maxWidth: "560px",
        width: "100%",
        background: "var(--bg-surface-solid)",
        border: "1px solid var(--border-color-solid)",
        padding: 0,
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.45)"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(0, 150, 136, 0.12) 100%)",
          borderBottom: "1px solid var(--border-color-solid)"
        }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [
            /* @__PURE__ */ jsx("div", { style: {
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "var(--success-light)",
              color: "var(--success)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }, children: /* @__PURE__ */ jsx(ShieldCheck, { size: 20 }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { style: { fontSize: "15px", fontWeight: 800, margin: 0 }, children: "Attendance Photo & Geotag Verification" }),
              /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "var(--text-secondary)" }, children: "Official Digital Clock-In Audit Trail" })
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
        /* @__PURE__ */ jsxs("div", { style: { padding: "20px", display: "flex", flexDirection: "column", gap: "18px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: {
            position: "relative",
            borderRadius: "12px",
            overflow: "hidden",
            background: "#090d16",
            border: "2px solid rgba(16, 185, 129, 0.3)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
            maxHeight: "320px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }, children: [
            record.photo ? /* @__PURE__ */ jsx(
              "img",
              {
                src: record.photo,
                alt: `Selfie verification for ${empName}`,
                style: { width: "100%", height: "auto", maxHeight: "320px", objectFit: "cover", display: "block" }
              }
            ) : /* @__PURE__ */ jsxs("div", { style: { padding: "40px 20px", textAlign: "center", color: "var(--text-muted)" }, children: [
              /* @__PURE__ */ jsx(User, { size: 48, style: { opacity: 0.4, marginBottom: "8px" } }),
              /* @__PURE__ */ jsx("p", { children: "No live camera photo attached for this record." })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: {
              position: "absolute",
              top: "12px",
              left: "12px",
              background: "rgba(9, 13, 22, 0.85)",
              backdropFilter: "blur(4px)",
              color: "#34d399",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              border: "1px solid rgba(52, 211, 153, 0.3)"
            }, children: [
              /* @__PURE__ */ jsx(CheckCircle2, { size: 13 }),
              "AUTHENTICATED BIOMETRIC / GPS"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: {
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color-solid)",
            borderRadius: "12px",
            padding: "16px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            fontSize: "12px"
          }, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)", display: "block", marginBottom: "2px" }, children: "Employee" }),
              /* @__PURE__ */ jsx("strong", { style: { fontSize: "13px", color: "var(--text-primary)" }, children: empName }),
              /* @__PURE__ */ jsxs("div", { style: { color: "var(--text-secondary)", fontSize: "11px" }, children: [
                "ID: ",
                record.employeeId,
                " \u2022 ",
                empDesignation
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)", display: "block", marginBottom: "2px" }, children: "Department" }),
              /* @__PURE__ */ jsx("strong", { style: { fontSize: "13px", color: "var(--text-primary)" }, children: empDept }),
              /* @__PURE__ */ jsxs("div", { style: { color: "var(--text-secondary)", fontSize: "11px" }, children: [
                "Status: ",
                record.status
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)", display: "block", marginBottom: "2px" }, children: "Date & Clock In Time" }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [
                /* @__PURE__ */ jsx(Calendar, { size: 13, style: { color: "var(--primary)" } }),
                /* @__PURE__ */ jsx("strong", { children: record.date }),
                /* @__PURE__ */ jsx(Clock, { size: 13, style: { color: "var(--success)", marginLeft: "4px" } }),
                /* @__PURE__ */ jsx("strong", { children: record.checkIn || "-" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)", display: "block", marginBottom: "2px" }, children: "Verification Method" }),
              /* @__PURE__ */ jsx("span", { className: "badge badge-primary", style: { fontSize: "11px", padding: "2px 8px" }, children: record.method || "GPS Geo-Fence" })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { gridColumn: "span 2", borderTop: "1px solid var(--border-color-solid)", paddingTop: "10px" }, children: [
              /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)", display: "block", marginBottom: "2px" }, children: "GPS Geolocation & Office Perimeter" }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "6px", color: "#009688" }, children: [
                /* @__PURE__ */ jsx(MapPin, { size: 14 }),
                /* @__PURE__ */ jsx("strong", { children: record.location || "Headquarters (San Jose) - Within 20m Perimeter" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "flex-end", gap: "10px" }, children: [
            record.photo && /* @__PURE__ */ jsxs("button", { className: "btn btn-outline", style: { fontSize: "12px", padding: "8px 14px" }, onClick: downloadCertificate, children: [
              /* @__PURE__ */ jsx(Download, { size: 14 }),
              " Download Image"
            ] }),
            /* @__PURE__ */ jsx("button", { className: "btn btn-primary", style: { fontSize: "12px", padding: "8px 20px" }, onClick: onClose, children: "Close" })
          ] })
        ] })
      ]
    }
  ) });
};
export {
  PhotoVerificationModal
};
