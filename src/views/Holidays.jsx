import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAppState } from "../context/StateContext";
import { Plus } from "lucide-react";
const Holidays = () => {
  const { holidays, activeRole, addHoliday } = useAppState();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("National");
  const [showForm, setShowForm] = useState(false);
  const canModify = activeRole === "Super Admin" || activeRole === "HR Manager";
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !date || !canModify) return;
    addHoliday({
      name,
      date,
      type
    });
    setName("");
    setDate("");
    setShowForm(false);
  };
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const getHolidayMonth = (dateStr) => {
    const monthIndex = new Date(dateStr).getMonth();
    return months[monthIndex];
  };
  const sortedHolidays = [...holidays].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return /* @__PURE__ */ jsxs("div", { className: "animate-fade-in", style: { display: "flex", flexDirection: "column", gap: "24px" }, children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { style: { fontSize: "20px", fontWeight: 800 }, children: "Holiday Calendar" }),
        /* @__PURE__ */ jsx("p", { style: { color: "var(--text-secondary)", fontSize: "13px" }, children: "Declare state/national, festival, and corporate holidays." })
      ] }),
      canModify && /* @__PURE__ */ jsxs("button", { className: "btn btn-primary", onClick: () => setShowForm(!showForm), children: [
        /* @__PURE__ */ jsx(Plus, { size: 18 }),
        " Declare Holiday"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid-2", style: { gridTemplateColumns: showForm ? "1fr 1fr" : "1fr" }, children: [
      showForm && canModify && /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "20px", height: "fit-content" }, children: [
        /* @__PURE__ */ jsx("h3", { style: { fontSize: "16px", fontWeight: 800 }, children: "Declare Corporate Holiday" }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Holiday Name" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                required: true,
                value: name,
                onChange: (e) => setName(e.target.value),
                placeholder: "e.g. Labor Day, Thanksgiving"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Date" }),
            /* @__PURE__ */ jsx("input", { type: "date", required: true, value: date, onChange: (e) => setDate(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Holiday Type" }),
            /* @__PURE__ */ jsxs("select", { value: type, onChange: (e) => setType(e.target.value), children: [
              /* @__PURE__ */ jsx("option", { value: "National", children: "National Holiday" }),
              /* @__PURE__ */ jsx("option", { value: "Festival", children: "Festival Holiday" }),
              /* @__PURE__ */ jsx("option", { value: "Company", children: "Company Holiday" }),
              /* @__PURE__ */ jsx("option", { value: "Optional", children: "Optional Holiday" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "flex-end", gap: "10px" }, children: [
            /* @__PURE__ */ jsx("button", { type: "button", className: "btn btn-secondary", onClick: () => setShowForm(false), children: "Cancel" }),
            /* @__PURE__ */ jsx("button", { type: "submit", className: "btn btn-primary", children: "Publish Holiday" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "20px" }, children: [
        /* @__PURE__ */ jsx("h3", { style: { fontSize: "16px", fontWeight: 800 }, children: "Calendar Schedule (2026)" }),
        /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }, children: sortedHolidays.map((hol) => /* @__PURE__ */ jsxs("div", { style: {
          border: "1px solid var(--border-color)",
          borderRadius: "12px",
          padding: "16px",
          background: "var(--bg-secondary)",
          display: "flex",
          alignItems: "center",
          gap: "16px"
        }, children: [
          /* @__PURE__ */ jsxs("div", { style: {
            width: "56px",
            height: "56px",
            borderRadius: "10px",
            background: "var(--primary-light)",
            color: "var(--primary)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "11px",
            lineHeight: "1.2"
          }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontSize: "16px" }, children: new Date(hol.date).getDate() }),
            /* @__PURE__ */ jsx("span", { children: getHolidayMonth(hol.date).substring(0, 3) })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { flexGrow: 1 }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontWeight: 700, fontSize: "14px", display: "block" }, children: hol.name }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px", alignItems: "center", marginTop: "4px" }, children: [
              /* @__PURE__ */ jsx("span", { className: `badge ${hol.type === "National" ? "badge-danger" : hol.type === "Festival" ? "badge-warning" : hol.type === "Company" ? "badge-success" : "badge-info"}`, style: { fontSize: "10px", padding: "2px 6px" }, children: hol.type }),
              /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", color: "var(--text-muted)" }, children: hol.date })
            ] })
          ] })
        ] }, hol.id)) })
      ] })
    ] })
  ] });
};
export {
  Holidays
};
