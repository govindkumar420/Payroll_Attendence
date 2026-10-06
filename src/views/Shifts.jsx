import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAppState } from "../context/StateContext";
import { Clock, Plus, Users, Award, Calendar } from "lucide-react";
import { Holidays } from "./Holidays";
import { Overtime } from "./Overtime";
import { getPermissions, EMPLOYEE_PERSONA_ID, MANAGER_DEPARTMENT } from "../utils/permissions";
const Shifts = () => {
  const { shifts, employees, activeRole, addShift, updateEmployee } = useAppState();
  const permissions = getPermissions(activeRole);
  const [activeSubTab, setActiveSubTab] = useState("shifts");
  const [showModal, setShowModal] = useState(false);
  const [shiftName, setShiftName] = useState("");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const [breakMins, setBreakMins] = useState(45);
  const [graceMins, setGraceMins] = useState(15);
  const [weeklyOffDay, setWeeklyOffDay] = useState("Sunday");
  const canModifyShift = permissions.shiftManagement === "Full" || permissions.shiftManagement === "Manage";
  const isEmployee = activeRole === "Employee";
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canModifyShift) return;
    const newShift = {
      id: `S${shifts.length + 1}`,
      name: shiftName,
      startTime: start,
      endTime: end,
      breakTime: Number(breakMins),
      gracePeriod: Number(graceMins),
      weeklyOff: weeklyOffDay
    };
    addShift(newShift);
    setShowModal(false);
    setShiftName("");
  };
  const handleAssignShift = (empId, sId) => {
    if (!canModifyShift) return;
    const emp = employees.find((e) => e.id === empId);
    if (emp) {
      updateEmployee({
        ...emp,
        shiftId: sId
      });
    }
  };
  const visibleEmployees = isEmployee ? employees.filter((e) => e.id === EMPLOYEE_PERSONA_ID) : permissions.employeeManagement === "Team" ? employees.filter((e) => e.department === MANAGER_DEPARTMENT) : employees;
  return /* @__PURE__ */ jsxs("div", { className: "animate-fade-in", style: { display: "flex", flexDirection: "column", gap: "24px" }, children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px", background: "var(--bg-secondary)", padding: "4px", borderRadius: "12px", border: "1px solid var(--border-color)" }, children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: `btn ${activeSubTab === "shifts" ? "btn-primary" : "btn-outline"}`,
            onClick: () => setActiveSubTab("shifts"),
            style: { fontSize: "12px", padding: "6px 16px", borderRadius: "8px", border: activeSubTab === "shifts" ? "none" : "transparent" },
            children: [
              /* @__PURE__ */ jsx(Clock, { size: 14 }),
              " Shift Policies & Rosters"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: `btn ${activeSubTab === "holidays" ? "btn-primary" : "btn-outline"}`,
            onClick: () => setActiveSubTab("holidays"),
            style: { fontSize: "12px", padding: "6px 16px", borderRadius: "8px", border: activeSubTab === "holidays" ? "none" : "transparent" },
            children: [
              /* @__PURE__ */ jsx(Calendar, { size: 14 }),
              " Holiday Calendar"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: `btn ${activeSubTab === "overtime" ? "btn-primary" : "btn-outline"}`,
            onClick: () => setActiveSubTab("overtime"),
            style: { fontSize: "12px", padding: "6px 16px", borderRadius: "8px", border: activeSubTab === "overtime" ? "none" : "transparent" },
            children: [
              /* @__PURE__ */ jsx(Award, { size: 14 }),
              " Overtime Ledger"
            ]
          }
        )
      ] }),
      activeSubTab === "shifts" && canModifyShift && /* @__PURE__ */ jsxs("button", { className: "btn btn-primary", onClick: () => setShowModal(true), children: [
        /* @__PURE__ */ jsx(Plus, { size: 18 }),
        " Add New Shift Policy"
      ] })
    ] }),
    activeSubTab === "holidays" && /* @__PURE__ */ jsx(Holidays, {}),
    activeSubTab === "overtime" && /* @__PURE__ */ jsx(Overtime, {}),
    activeSubTab === "shifts" && /* @__PURE__ */ jsxs("div", { className: "grid-2", style: { gridTemplateColumns: isEmployee ? "1fr 1fr" : "2fr 3fr" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "20px" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
          /* @__PURE__ */ jsx("h3", { style: { fontSize: "16px", fontWeight: 800 }, children: "Active Shift Policies" }),
          /* @__PURE__ */ jsxs("span", { className: "badge badge-info", children: [
            shifts.length,
            " Defined"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: shifts.map((shift) => {
          const count = employees.filter((e) => e.shiftId === shift.id).length;
          return /* @__PURE__ */ jsxs("div", { style: {
            border: "1px solid var(--border-color)",
            borderRadius: "12px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            background: "var(--bg-secondary)"
          }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
              /* @__PURE__ */ jsx("span", { style: { fontWeight: 700, fontSize: "15px", color: "var(--primary)" }, children: shift.name }),
              /* @__PURE__ */ jsxs("span", { className: "badge badge-info", style: { gap: "4px" }, children: [
                /* @__PURE__ */ jsx(Users, { size: 12 }),
                " ",
                count,
                " ",
                count === 1 ? "Employee" : "Employees"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "12px", color: "var(--text-secondary)" }, children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "Work Hours:" }),
                /* @__PURE__ */ jsxs("span", { style: { fontWeight: 600, display: "block", color: "var(--text-primary)" }, children: [
                  shift.startTime,
                  " - ",
                  shift.endTime
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "Break Time:" }),
                /* @__PURE__ */ jsxs("span", { style: { fontWeight: 600, display: "block", color: "var(--text-primary)" }, children: [
                  shift.breakTime,
                  " mins"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "Grace Period:" }),
                /* @__PURE__ */ jsxs("span", { style: { fontWeight: 600, display: "block", color: "var(--text-primary)" }, children: [
                  shift.gracePeriod,
                  " mins"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { style: { color: "var(--text-muted)" }, children: "Weekly Off:" }),
                /* @__PURE__ */ jsx("span", { style: { fontWeight: 600, display: "block", color: "var(--text-primary)" }, children: shift.weeklyOff })
              ] })
            ] })
          ] }, shift.id);
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "20px" }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { style: { fontSize: "16px", fontWeight: 800 }, children: isEmployee ? "My Assigned Shift Schedule" : "Employee Shift Roster" }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }, children: isEmployee ? "Your active working hours and grace period for biometric punch-ins." : "Assign shifts to employees. Late arrival penalties and grace periods calculate automatically." })
        ] }),
        /* @__PURE__ */ jsx("div", { style: { overflowX: "auto", maxHeight: "550px" }, children: /* @__PURE__ */ jsxs("table", { children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { children: "Employee" }),
            /* @__PURE__ */ jsx("th", { children: "Department" }),
            /* @__PURE__ */ jsx("th", { children: "Current Shift" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: visibleEmployees.map((emp) => /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: emp.photoUrl,
                  alt: emp.name,
                  style: { width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }
                }
              ),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { style: { fontWeight: 600, display: "block" }, children: emp.name }),
                /* @__PURE__ */ jsx("span", { style: { fontSize: "10px", color: "var(--text-muted)" }, children: emp.id })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("td", { children: emp.department }),
            /* @__PURE__ */ jsx("td", { children: canModifyShift ? /* @__PURE__ */ jsx(
              "select",
              {
                value: emp.shiftId,
                onChange: (e) => handleAssignShift(emp.id, e.target.value),
                style: { fontSize: "12px", padding: "4px 8px" },
                children: shifts.map((s) => /* @__PURE__ */ jsxs("option", { value: s.id, children: [
                  s.name,
                  " (",
                  s.startTime,
                  "-",
                  s.endTime,
                  ")"
                ] }, s.id))
              }
            ) : /* @__PURE__ */ jsx("span", { className: "badge badge-primary", style: { fontWeight: 600 }, children: shifts.find((s) => s.id === emp.shiftId)?.name || "General Shift" }) })
          ] }, emp.id)) })
        ] }) })
      ] })
    ] }),
    showModal && /* @__PURE__ */ jsx("div", { className: "modal-overlay", children: /* @__PURE__ */ jsxs("div", { className: "modal-content glass", style: { maxWidth: "450px", background: "var(--bg-secondary)" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid var(--border-color)" }, children: [
        /* @__PURE__ */ jsx("h3", { style: { fontSize: "16px", fontWeight: 800 }, children: "Create New Shift Policy" }),
        /* @__PURE__ */ jsx("button", { style: { border: "none", background: "transparent", cursor: "pointer", color: "var(--text-primary)" }, onClick: () => setShowModal(false), children: "Close" })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, style: { padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Shift Policy Name" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              required: true,
              value: shiftName,
              onChange: (e) => setShiftName(e.target.value),
              placeholder: "e.g. Weekend Shift, Night Shift"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Start Time" }),
            /* @__PURE__ */ jsx("input", { type: "time", required: true, value: start, onChange: (e) => setStart(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "End Time" }),
            /* @__PURE__ */ jsx("input", { type: "time", required: true, value: end, onChange: (e) => setEnd(e.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Break Time (Minutes)" }),
            /* @__PURE__ */ jsx("input", { type: "number", required: true, value: breakMins, onChange: (e) => setBreakMins(Number(e.target.value)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Grace Period (Minutes)" }),
            /* @__PURE__ */ jsx("input", { type: "number", required: true, value: graceMins, onChange: (e) => setGraceMins(Number(e.target.value)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Weekly Off Day" }),
          /* @__PURE__ */ jsxs("select", { value: weeklyOffDay, onChange: (e) => setWeeklyOffDay(e.target.value), children: [
            /* @__PURE__ */ jsx("option", { value: "Sunday", children: "Sunday" }),
            /* @__PURE__ */ jsx("option", { value: "Saturday", children: "Saturday" }),
            /* @__PURE__ */ jsx("option", { value: "Monday", children: "Monday" }),
            /* @__PURE__ */ jsx("option", { value: "No Weekly Off", children: "No Weekly Off" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }, children: [
          /* @__PURE__ */ jsx("button", { type: "button", className: "btn btn-secondary", onClick: () => setShowModal(false), children: "Cancel" }),
          /* @__PURE__ */ jsx("button", { type: "submit", className: "btn btn-primary", children: "Create Policy" })
        ] })
      ] })
    ] }) })
  ] });
};
var Shifts_default = Shifts;
export {
  Shifts,
  Shifts_default as default
};
