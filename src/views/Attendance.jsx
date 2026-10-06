import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useAppState } from "../context/StateContext";
import {
  CheckCircle,
  XCircle,
  MapPin,
  ScanLine,
  Fingerprint,
  RefreshCw,
  KeyRound,
  Camera,
  Eye,
  CheckCircle2
} from "lucide-react";
import { CameraCaptureModal } from "../components/CameraCaptureModal";
import { PhotoVerificationModal } from "../components/PhotoVerificationModal";
import { getPermissions, filterEmployeesByRole, EMPLOYEE_PERSONA_ID, MANAGER_DEPARTMENT } from "../utils/permissions";
const Attendance = () => {
  const { employees, attendance, activeRole, clockIn, clockOut } = useAppState();
  const permissions = getPermissions(activeRole);
  const isEmployee = activeRole === "Employee";
  const canClock = permissions.attendance === "Full" || permissions.attendance === "Manage" || permissions.attendance === "Team" || permissions.attendance === "Own";
  const accessibleEmployees = filterEmployeesByRole(employees, activeRole);
  const accessibleAttendance = isEmployee ? attendance.filter((a) => a.employeeId === EMPLOYEE_PERSONA_ID) : activeRole === "Department Manager" ? attendance.filter((a) => {
    const emp = employees.find((e) => e.id === a.employeeId);
    return emp?.department === MANAGER_DEPARTMENT;
  }) : attendance;
  const [selectedEmpId, setSelectedEmpId] = useState(isEmployee ? EMPLOYEE_PERSONA_ID : accessibleEmployees[0]?.id || "");
  const [clockMethod, setClockMethod] = useState("Biometric");
  const [mockLocation, setMockLocation] = useState("Headquarters (San Jose)");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [geoVerifiedDetails, setGeoVerifiedDetails] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [time, setTime] = useState((/* @__PURE__ */ new Date()).toLocaleTimeString());
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((/* @__PURE__ */ new Date()).toLocaleTimeString());
    }, 1e3);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (isEmployee) {
      setSelectedEmpId(EMPLOYEE_PERSONA_ID);
    } else if (accessibleEmployees.length > 0 && (!selectedEmpId || !accessibleEmployees.some((e) => e.id === selectedEmpId))) {
      setSelectedEmpId(accessibleEmployees[0].id);
    }
  }, [activeRole, accessibleEmployees, isEmployee]);
  useEffect(() => {
    setCapturedPhoto(null);
    setGeoVerifiedDetails(null);
  }, [selectedEmpId]);
  const handleSelectScanMethod = (method) => {
    setClockMethod(method);
    if (method === "GPS") {
      setIsCameraModalOpen(true);
    }
  };
  const handlePhotoUploaded = (photoUrl, locationData) => {
    setCapturedPhoto(photoUrl);
    setGeoVerifiedDetails(locationData);
    setMockLocation(`${locationData.address} (${locationData.coordinates})`);
  };
  const handleClockIn = () => {
    if (!selectedEmpId) return;
    const loc = clockMethod === "GPS" ? mockLocation : void 0;
    clockIn(selectedEmpId, clockMethod === "GPS" ? "GPS Geo-Fence" : clockMethod, loc, capturedPhoto || void 0);
    setCapturedPhoto(null);
    setGeoVerifiedDetails(null);
  };
  const handleClockOut = () => {
    if (!selectedEmpId) return;
    clockOut(selectedEmpId);
  };
  const getEmployeeName = (id) => {
    return employees.find((e) => e.id === id)?.name || id;
  };
  const getEmployeeObj = (id) => {
    return employees.find((e) => e.id === id);
  };
  const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const isClockedInToday = (empId) => {
    const rec = attendance.find((a) => a.employeeId === empId && a.date === todayStr);
    return rec ? !!rec.checkIn : false;
  };
  const isClockedOutToday = (empId) => {
    const rec = attendance.find((a) => a.employeeId === empId && a.date === todayStr);
    return rec ? !!rec.checkOut : false;
  };
  const currentSelectedEmployee = getEmployeeObj(selectedEmpId);
  const filteredLogs = accessibleAttendance.filter((log) => {
    const empName = getEmployeeName(log.employeeId).toLowerCase();
    const empId = log.employeeId.toLowerCase();
    const dateStr = log.date;
    const matchesSearch = empName.includes(searchTerm.toLowerCase()) || empId.includes(searchTerm.toLowerCase()) || dateStr.includes(searchTerm);
    const matchesStatus = statusFilter === "All" || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  return /* @__PURE__ */ jsxs("div", { className: "animate-fade-in", style: { display: "flex", flexDirection: "column", gap: "24px" }, children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { style: { fontSize: "20px", fontWeight: 800 }, children: "Attendance Console" }),
      /* @__PURE__ */ jsx("p", { style: { color: "var(--text-secondary)", fontSize: "13px" }, children: "Simulate biometric logs, RFID clock-ins, live camera GPS geo-fencing, and view the monthly digital attendance register." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid-2", style: { gridTemplateColumns: "1.1fr 1.9fr", alignItems: "stretch", gap: "24px" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "18px", justifyContent: "space-between" }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }, children: [
            /* @__PURE__ */ jsx("h3", { style: { fontSize: "15px", fontWeight: 800 }, children: "Terminal Simulator" }),
            /* @__PURE__ */ jsxs("span", { className: "badge badge-success", style: { gap: "6px" }, children: [
              /* @__PURE__ */ jsx("span", { style: { width: "6px", height: "6px", borderRadius: "50%", background: "var(--success)" } }),
              "ONLINE"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: {
            background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
            color: "#38bdf8",
            padding: "16px",
            borderRadius: "12px",
            textAlign: "center",
            fontFamily: "monospace",
            fontSize: "28px",
            fontWeight: 800,
            letterSpacing: "3px",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            boxShadow: "0 0 15px rgba(56, 189, 248, 0.1)",
            marginBottom: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "4px"
          }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "2px" }, children: "Live Gateway Time" }),
            time
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "14px" }, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Select Employee Persona" }),
              /* @__PURE__ */ jsx(
                "select",
                {
                  value: selectedEmpId,
                  onChange: (e) => setSelectedEmpId(e.target.value),
                  disabled: activeRole === "Employee",
                  children: accessibleEmployees.map((e) => /* @__PURE__ */ jsxs("option", { value: e.id, children: [
                    e.name,
                    " (",
                    e.id,
                    ")"
                  ] }, e.id))
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }, children: "Scan Method" }),
              /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }, children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    className: `btn ${clockMethod === "Biometric" ? "btn-primary" : "btn-outline"}`,
                    style: { padding: "8px", fontSize: "12px" },
                    onClick: () => handleSelectScanMethod("Biometric"),
                    children: [
                      /* @__PURE__ */ jsx(Fingerprint, { size: 14 }),
                      " Fingerprint"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    className: `btn ${clockMethod === "GPS" ? "btn-primary" : "btn-outline"}`,
                    style: {
                      padding: "8px",
                      fontSize: "12px",
                      boxShadow: clockMethod === "GPS" ? "0 0 12px rgba(0, 143, 131, 0.4)" : "none"
                    },
                    onClick: () => handleSelectScanMethod("GPS"),
                    children: [
                      /* @__PURE__ */ jsx(MapPin, { size: 14 }),
                      " GPS Geo-Fence"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    className: `btn ${clockMethod === "RFID" ? "btn-primary" : "btn-outline"}`,
                    style: { padding: "8px", fontSize: "12px" },
                    onClick: () => handleSelectScanMethod("RFID"),
                    children: [
                      /* @__PURE__ */ jsx(KeyRound, { size: 14 }),
                      " RFID Card"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    className: `btn ${clockMethod === "QR Code" ? "btn-primary" : "btn-outline"}`,
                    style: { padding: "8px", fontSize: "12px" },
                    onClick: () => handleSelectScanMethod("QR Code"),
                    children: [
                      /* @__PURE__ */ jsx(ScanLine, { size: 14 }),
                      " QR Scanner"
                    ]
                  }
                )
              ] })
            ] }),
            clockMethod === "GPS" && /* @__PURE__ */ jsxs("div", { style: {
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color-solid)",
              borderRadius: "10px",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              animation: "fadeIn 0.2s ease-in-out"
            }, children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
                /* @__PURE__ */ jsxs("label", { style: { fontSize: "12px", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "6px" }, children: [
                  /* @__PURE__ */ jsx(MapPin, { size: 14, style: { color: "#009688" } }),
                  "GPS Geo-Fence & Camera"
                ] }),
                /* @__PURE__ */ jsx("span", { className: "badge badge-success", style: { fontSize: "10px", padding: "2px 6px" }, children: "Active Zone" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: mockLocation,
                  onChange: (e) => setMockLocation(e.target.value),
                  placeholder: "Enter Latitude/Longitude or City",
                  style: { fontSize: "12px", padding: "8px 10px" }
                }
              ),
              capturedPhoto ? /* @__PURE__ */ jsxs("div", { style: {
                background: "rgba(16, 185, 129, 0.08)",
                border: "1.5px solid var(--success)",
                borderRadius: "8px",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }, children: [
                /* @__PURE__ */ jsx("div", { style: {
                  width: "56px",
                  height: "56px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  flexShrink: 0,
                  border: "1px solid var(--success)",
                  background: "#090d16"
                }, children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: capturedPhoto,
                    alt: "Captured Selfie",
                    style: { width: "100%", height: "100%", objectFit: "cover" }
                  }
                ) }),
                /* @__PURE__ */ jsxs("div", { style: { flexGrow: 1, overflow: "hidden" }, children: [
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "4px", color: "var(--success)", fontWeight: 700, fontSize: "12px" }, children: [
                    /* @__PURE__ */ jsx(CheckCircle2, { size: 14 }),
                    " Selfie & Geotag Attached"
                  ] }),
                  /* @__PURE__ */ jsx("div", { style: { fontSize: "11px", color: "var(--text-muted)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }, children: geoVerifiedDetails ? `${geoVerifiedDetails.coordinates}` : "Verified within perimeter" }),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      className: "btn btn-outline",
                      style: { padding: "2px 8px", fontSize: "10px", marginTop: "4px", height: "auto" },
                      onClick: () => setIsCameraModalOpen(true),
                      children: [
                        /* @__PURE__ */ jsx(RefreshCw, { size: 10 }),
                        " Retake Photo"
                      ]
                    }
                  )
                ] })
              ] }) : /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "6px" }, children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    className: "btn btn-primary",
                    style: {
                      padding: "9px 12px",
                      fontSize: "12px",
                      fontWeight: 700,
                      background: "linear-gradient(135deg, #009688 0%, #14b8a6 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      boxShadow: "0 4px 12px rgba(0, 150, 136, 0.25)"
                    },
                    onClick: () => setIsCameraModalOpen(true),
                    children: [
                      /* @__PURE__ */ jsx(Camera, { size: 16 }),
                      " Open Camera & Click Picture"
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", color: "var(--text-muted)", textAlign: "center" }, children: "Clicking opens live camera with biometric geotag watermark." })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }, children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: "btn btn-primary",
              style: {
                padding: "12px",
                background: isClockedInToday(selectedEmpId) ? "var(--bg-secondary)" : "var(--success)",
                color: isClockedInToday(selectedEmpId) ? "var(--text-muted)" : "white",
                fontWeight: 700,
                border: isClockedInToday(selectedEmpId) ? "1px solid var(--border-color-solid)" : "none"
              },
              onClick: handleClockIn,
              disabled: isClockedInToday(selectedEmpId),
              children: [
                /* @__PURE__ */ jsx(CheckCircle, { size: 18 }),
                isClockedInToday(selectedEmpId) ? "Already Clocked In Today" : "Simulate Clock In"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: "btn btn-outline",
              style: { padding: "12px", borderColor: "var(--danger)", color: "var(--danger)", fontWeight: 700 },
              onClick: handleClockOut,
              disabled: !isClockedInToday(selectedEmpId) || isClockedOutToday(selectedEmpId),
              children: [
                /* @__PURE__ */ jsx(XCircle, { size: 18 }),
                isClockedOutToday(selectedEmpId) ? "Already Clocked Out Today" : !isClockedInToday(selectedEmpId) ? "Must Clock In First" : "Simulate Clock Out"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { display: "flex", flexDirection: "column", gap: "20px", overflow: "hidden" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }, children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { style: { fontSize: "15px", fontWeight: 800 }, children: "Digital Attendance Register" }),
            /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "var(--text-secondary)" }, children: "Live clock-in events with geotag & selfie photo verifications" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px" }, children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Search Employee / Date...",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                style: { width: "180px", padding: "6px 12px", fontSize: "12px" }
              }
            ),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: statusFilter,
                onChange: (e) => setStatusFilter(e.target.value),
                style: { width: "120px", padding: "6px 12px", fontSize: "12px" },
                children: [
                  /* @__PURE__ */ jsx("option", { value: "All", children: "All Status" }),
                  /* @__PURE__ */ jsx("option", { value: "Present", children: "Present" }),
                  /* @__PURE__ */ jsx("option", { value: "Absent", children: "Absent" }),
                  /* @__PURE__ */ jsx("option", { value: "Leave", children: "Leave" }),
                  /* @__PURE__ */ jsx("option", { value: "Holiday", children: "Holiday" }),
                  /* @__PURE__ */ jsx("option", { value: "Weekly Off", children: "Weekly Off" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { style: { overflowX: "auto", maxHeight: "420px" }, children: /* @__PURE__ */ jsxs("table", { children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { children: "Employee" }),
            /* @__PURE__ */ jsx("th", { children: "Date" }),
            /* @__PURE__ */ jsx("th", { children: "Clock In" }),
            /* @__PURE__ */ jsx("th", { children: "Clock Out" }),
            /* @__PURE__ */ jsx("th", { children: "Worked" }),
            /* @__PURE__ */ jsx("th", { children: "Method / Verification" }),
            /* @__PURE__ */ jsx("th", { children: "Status" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: filteredLogs.length > 0 ? filteredLogs.map((log) => {
            const emp = getEmployeeObj(log.employeeId);
            return /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                /* @__PURE__ */ jsx("div", { style: {
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "var(--primary-light)",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  flexShrink: 0
                }, children: log.employeeId.slice(-3) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("strong", { style: { display: "block", fontSize: "12px" }, children: getEmployeeName(log.employeeId) }),
                  /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", color: "var(--text-muted)" }, children: log.employeeId })
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("td", { style: { whiteSpace: "nowrap", fontSize: "12px" }, children: log.date }),
              /* @__PURE__ */ jsxs("td", { style: { color: log.lateArrival ? "var(--warning)" : "inherit", fontSize: "12px" }, children: [
                log.checkIn || "-",
                log.lateArrival && /* @__PURE__ */ jsx("span", { style: { fontSize: "9px", display: "block", color: "var(--warning)", fontWeight: 700 }, children: "LATE" })
              ] }),
              /* @__PURE__ */ jsxs("td", { style: { color: log.earlyLeaving ? "var(--warning)" : "inherit", fontSize: "12px" }, children: [
                log.checkOut || "-",
                log.earlyLeaving && /* @__PURE__ */ jsx("span", { style: { fontSize: "9px", display: "block", color: "var(--warning)", fontWeight: 700 }, children: "EARLY LEAVE" })
              ] }),
              /* @__PURE__ */ jsx("td", { style: { fontSize: "12px" }, children: log.workingHours ? `${log.workingHours}h` : "-" }),
              /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }, children: [
                /* @__PURE__ */ jsxs("span", { style: {
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  background: "var(--bg-secondary)",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-color-solid)"
                }, children: [
                  log.method?.includes("GPS") ? /* @__PURE__ */ jsx(MapPin, { size: 11, style: { color: "#009688" } }) : log.method?.includes("RFID") ? /* @__PURE__ */ jsx(KeyRound, { size: 11, style: { color: "#f59e0b" } }) : log.method?.includes("QR") ? /* @__PURE__ */ jsx(ScanLine, { size: 11, style: { color: "#8b5cf6" } }) : /* @__PURE__ */ jsx(Fingerprint, { size: 11, style: { color: "#10b981" } }),
                  log.method || "Biometric"
                ] }),
                log.photo ? /* @__PURE__ */ jsxs(
                  "button",
                  {
                    className: "btn btn-outline",
                    style: {
                      padding: "2px 8px",
                      fontSize: "11px",
                      height: "auto",
                      color: "var(--success)",
                      borderColor: "var(--success)",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    },
                    onClick: () => setViewingRecord(log),
                    title: "View Verified Photo & Geotag",
                    children: [
                      /* @__PURE__ */ jsx(Camera, { size: 12 }),
                      "Photo Verified"
                    ]
                  }
                ) : log.method?.includes("GPS") ? /* @__PURE__ */ jsxs(
                  "button",
                  {
                    className: "btn btn-outline",
                    style: {
                      padding: "2px 6px",
                      fontSize: "10px",
                      height: "auto",
                      color: "var(--primary)",
                      borderColor: "var(--border-color-solid)"
                    },
                    onClick: () => setViewingRecord(log),
                    title: "View Geo Details",
                    children: [
                      /* @__PURE__ */ jsx(Eye, { size: 11 }),
                      " Geo Tag"
                    ]
                  }
                ) : null
              ] }) }),
              /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", { className: `badge ${log.status === "Present" || log.status === "WFH" ? "badge-success" : log.status === "Absent" ? "badge-danger" : log.status === "Leave" ? "badge-warning" : "badge-info"}`, style: { fontSize: "11px" }, children: log.status }) })
            ] }, log.id);
          }) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 7, style: { textAlign: "center", padding: "24px", color: "var(--text-muted)" }, children: "No attendance records found." }) }) })
        ] }) })
      ] })
    ] }),
    isCameraModalOpen && /* @__PURE__ */ jsx(
      CameraCaptureModal,
      {
        isOpen: isCameraModalOpen,
        onClose: () => setIsCameraModalOpen(false),
        employeeName: currentSelectedEmployee?.name || "Employee",
        employeeId: selectedEmpId,
        currentLocation: mockLocation,
        onPhotoUploaded: handlePhotoUploaded
      }
    ),
    viewingRecord && /* @__PURE__ */ jsx(
      PhotoVerificationModal,
      {
        record: viewingRecord,
        employee: getEmployeeObj(viewingRecord.employeeId),
        onClose: () => setViewingRecord(null)
      }
    )
  ] });
};
export {
  Attendance
};
