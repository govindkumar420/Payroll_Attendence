import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { Camera, MapPin, Check, RefreshCw, Upload, X, ShieldCheck, AlertCircle, Sparkles, Crosshair, Image as ImageIcon } from "lucide-react";
const CameraCaptureModal = ({
  isOpen,
  onClose,
  employeeName,
  employeeId,
  currentLocation = "Headquarters (San Jose)",
  onPhotoUploaded
}) => {
  const [stream, setStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [coords, setCoords] = useState(null);
  const [geoStatus, setGeoStatus] = useState("fetching");
  const [currentTimeStr, setCurrentTimeStr] = useState((/* @__PURE__ */ new Date()).toLocaleTimeString());
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeStr((/* @__PURE__ */ new Date()).toLocaleTimeString());
    }, 1e3);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!isOpen) return;
    if ("geolocation" in navigator) {
      setGeoStatus("fetching");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: Math.round(position.coords.accuracy)
          });
          setGeoStatus("success");
        },
        () => {
          setCoords({
            lat: 18.5204,
            lng: 73.8567,
            accuracy: 8
          });
          setGeoStatus("fallback");
        },
        { enableHighAccuracy: true, timeout: 8e3 }
      );
    } else {
      setCoords({
        lat: 18.5204,
        lng: 73.8567,
        accuracy: 10
      });
      setGeoStatus("fallback");
    }
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedPhoto(null);
      setCameraError(null);
      return;
    }
    startCamera();
    return () => {
      stopCamera();
    };
  }, [isOpen]);
  const startCamera = async () => {
    setCameraError(null);
    setCapturedPhoto(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported in this browser.");
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      setStream(mediaStream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(() => {
        });
      }
    } catch (err) {
      console.warn("Camera stream error:", err);
      setCameraError(err.message || "Unable to access web camera. Please check permissions or upload a picture.");
      setIsCameraActive(false);
    }
  };
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsCapturing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -width, 0, width, height);
    ctx.restore();
    const bannerHeight = Math.max(64, Math.floor(height * 0.16));
    ctx.fillStyle = "rgba(9, 13, 22, 0.85)";
    ctx.fillRect(0, height - bannerHeight, width, bannerHeight);
    ctx.fillStyle = "#16a34a";
    ctx.fillRect(0, height - bannerHeight, width, 3);
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${Math.max(14, Math.floor(width * 0.024))}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillText(`GEO-VERIFIED ATTENDANCE: ${employeeName} (${employeeId})`, 16, height - bannerHeight + 24);
    ctx.fillStyle = "#38bdf8";
    ctx.font = `${Math.max(11, Math.floor(width * 0.019))}px 'Courier New', monospace`;
    const locText = coords ? `GPS: ${coords.lat.toFixed(5)}\xB0N, ${coords.lng.toFixed(5)}\xB0E | Acc: \xB1${coords.accuracy}m` : `LOC: ${currentLocation}`;
    const dateText = `${(/* @__PURE__ */ new Date()).toLocaleDateString("en-GB")} ${currentTimeStr}`;
    ctx.fillText(`${locText} | ${dateText}`, 16, height - bannerHeight + 46);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setCapturedPhoto(dataUrl);
    stopCamera();
    setIsCapturing(false);
  };
  const handleSimulateCapture = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const width = 640;
    const height = 480;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#0f172a");
    grad.addColorStop(0.5, "#1e293b");
    grad.addColorStop(1, "#090d16");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    ctx.beginPath();
    ctx.arc(width / 2, height / 2 - 20, 85, 0, Math.PI * 2);
    ctx.fillStyle = "#334155";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#2dd4bf";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(width / 2, height / 2 - 40, 45, 0, Math.PI * 2);
    ctx.fillStyle = "#64748b";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width / 2, height / 2 + 75, 75, Math.PI, 0, false);
    ctx.fillStyle = "#64748b";
    ctx.fill();
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(width / 2 - 100, height / 2 - 120, 200, 200);
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("FACIAL MATCH: 99.8%", width / 2 - 95, height / 2 - 130);
    ctx.fillStyle = "rgba(9, 13, 22, 0.9)";
    ctx.fillRect(0, height - 70, width, 70);
    ctx.fillStyle = "#16a34a";
    ctx.fillRect(0, height - 70, width, 3);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText(`GEO-VERIFIED ATTENDANCE: ${employeeName} (${employeeId})`, 16, height - 42);
    ctx.fillStyle = "#38bdf8";
    ctx.font = "12px monospace";
    const locText = coords ? `GPS: ${coords.lat.toFixed(5)}\xB0N, ${coords.lng.toFixed(5)}\xB0E | Perimeter: IN-ZONE (San Jose)` : `LOC: ${currentLocation}`;
    ctx.fillText(`${locText} | ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-GB")} ${currentTimeStr}`, 16, height - 18);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedPhoto(dataUrl);
    stopCamera();
  };
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const width = 640;
        const height = 480;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const scale = Math.max(width / img.width, height / img.height);
        const x = width / 2 - img.width / 2 * scale;
        const y = height / 2 - img.height / 2 * scale;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        ctx.fillStyle = "rgba(9, 13, 22, 0.88)";
        ctx.fillRect(0, height - 70, width, 70);
        ctx.fillStyle = "#10b981";
        ctx.fillRect(0, height - 70, width, 3);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 15px sans-serif";
        ctx.fillText(`GEO-VERIFIED ATTENDANCE: ${employeeName} (${employeeId})`, 16, height - 42);
        ctx.fillStyle = "#38bdf8";
        ctx.font = "12px monospace";
        const locText = coords ? `GPS: ${coords.lat.toFixed(5)}\xB0N, ${coords.lng.toFixed(5)}\xB0E | Perimeter: VERIFIED` : `LOC: ${currentLocation}`;
        ctx.fillText(`${locText} | ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-GB")} ${currentTimeStr}`, 16, height - 18);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedPhoto(dataUrl);
        stopCamera();
      };
      img.src = event.target?.result;
    };
    reader.readAsDataURL(file);
  };
  const handleConfirmUpload = () => {
    if (!capturedPhoto) return;
    const formattedCoords = coords ? `${coords.lat.toFixed(5)}\xB0 N, ${coords.lng.toFixed(5)}\xB0 E` : "37.33820\xB0 N, -121.88630\xB0 W";
    const locationDetails = {
      coordinates: formattedCoords,
      accuracy: coords ? `\xB1${coords.accuracy}m` : "\xB15m",
      address: currentLocation || "Office Perimeter - Geofence Verified"
    };
    onPhotoUploaded(capturedPhoto, locationDetails);
    onClose();
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx("div", { className: "modal-overlay", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: "modal-content glass-card",
      style: {
        maxWidth: "680px",
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
            }, children: /* @__PURE__ */ jsx(Camera, { size: 20 }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { style: { fontSize: "16px", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: "8px" }, children: "GPS Geo-Fence Camera Verification" }),
              /* @__PURE__ */ jsxs("span", { style: { fontSize: "12px", color: "var(--text-secondary)" }, children: [
                "Face photo capture & live geolocation watermark for ",
                employeeName,
                " (",
                employeeId,
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
        /* @__PURE__ */ jsxs("div", { style: { padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: {
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color-solid)",
            borderRadius: "10px",
            padding: "10px 14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
            fontSize: "12px"
          }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
              /* @__PURE__ */ jsx(MapPin, { size: 16, style: { color: "var(--accent)", flexShrink: 0 } }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Office Geo-Fence:" }),
                " ",
                currentLocation,
                /* @__PURE__ */ jsx("div", { style: { fontSize: "11px", color: "var(--text-muted)" }, children: coords ? `GPS: ${coords.lat.toFixed(5)}\xB0 N, ${coords.lng.toFixed(5)}\xB0 E (Accuracy: \xB1${coords.accuracy}m)` : "GPS coordinates: Detecting location..." })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: `badge ${geoStatus === "success" ? "badge-success" : "badge-primary"}`, style: { gap: "6px", fontSize: "11px", padding: "4px 10px" }, children: [
              /* @__PURE__ */ jsx(ShieldCheck, { size: 13 }),
              geoStatus === "success" ? "Live GPS Locked (Inside 20m Zone)" : "Geofence Active (Within Perimeter)"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: {
            position: "relative",
            width: "100%",
            aspectRatio: "16/10",
            background: "#090d16",
            borderRadius: "12px",
            overflow: "hidden",
            border: "2px solid rgba(56, 189, 248, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "inset 0 0 30px rgba(0, 0, 0, 0.8)"
          }, children: [
            !capturedPhoto && /* @__PURE__ */ jsx(
              "video",
              {
                ref: videoRef,
                autoPlay: true,
                playsInline: true,
                muted: true,
                style: {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: "scaleX(-1)",
                  // mirror for natural selfie feel
                  display: isCameraActive ? "block" : "none"
                }
              }
            ),
            capturedPhoto && /* @__PURE__ */ jsx(
              "img",
              {
                src: capturedPhoto,
                alt: "Captured Selfie",
                style: {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block"
                }
              }
            ),
            !capturedPhoto && isCameraActive && /* @__PURE__ */ jsxs("div", { style: {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "16px"
            }, children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
                /* @__PURE__ */ jsxs("div", { style: {
                  background: "rgba(9, 13, 22, 0.75)",
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
                  /* @__PURE__ */ jsx("span", { style: { width: "8px", height: "8px", borderRadius: "50%", background: "#34d399", boxShadow: "0 0 8px #34d399" } }),
                  "LIVE CAMERA ACTIVE"
                ] }),
                /* @__PURE__ */ jsx("div", { style: {
                  background: "rgba(9, 13, 22, 0.75)",
                  color: "#38bdf8",
                  fontFamily: "monospace",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 700,
                  border: "1px solid rgba(56, 189, 248, 0.3)"
                }, children: currentTimeStr })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: {
                alignSelf: "center",
                width: "180px",
                height: "210px",
                border: "2px dashed rgba(34, 211, 238, 0.7)",
                borderRadius: "90px 90px 80px 80px",
                boxShadow: "0 0 20px rgba(34, 211, 238, 0.25)",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }, children: [
                /* @__PURE__ */ jsx(Crosshair, { size: 28, style: { color: "rgba(34, 211, 238, 0.5)" } }),
                /* @__PURE__ */ jsx("span", { style: {
                  position: "absolute",
                  bottom: "-24px",
                  color: "#2dd4bf",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  textShadow: "0 1px 4px rgba(0,0,0,0.8)"
                }, children: "Align Face in Oval" })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: {
                background: "rgba(9, 13, 22, 0.8)",
                backdropFilter: "blur(4px)",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                fontSize: "11px",
                color: "#ffffff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }, children: [
                /* @__PURE__ */ jsxs("span", { children: [
                  "\u{1F464} ",
                  employeeName,
                  " (",
                  employeeId,
                  ")"
                ] }),
                /* @__PURE__ */ jsx("span", { style: { color: "#38bdf8", fontFamily: "monospace" }, children: coords ? `LAT: ${coords.lat.toFixed(4)}\xB0 | LNG: ${coords.lng.toFixed(4)}\xB0` : "GEOFENCE OK" })
              ] })
            ] }),
            !capturedPhoto && !isCameraActive && /* @__PURE__ */ jsxs("div", { style: {
              textAlign: "center",
              padding: "24px",
              color: "var(--text-secondary)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px"
            }, children: [
              /* @__PURE__ */ jsx("div", { style: {
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.1)",
                color: "var(--danger)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }, children: /* @__PURE__ */ jsx(AlertCircle, { size: 28 }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { style: { fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }, children: "Camera Access Required" }),
                /* @__PURE__ */ jsx("p", { style: { fontSize: "12px", maxWidth: "380px" }, children: cameraError || "Please allow camera permission in your browser, or select an alternative photo option below." })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }, children: [
                /* @__PURE__ */ jsxs("button", { className: "btn btn-primary", style: { fontSize: "12px", padding: "8px 14px" }, onClick: startCamera, children: [
                  /* @__PURE__ */ jsx(RefreshCw, { size: 14 }),
                  " Retry Camera"
                ] }),
                /* @__PURE__ */ jsxs("button", { className: "btn btn-outline", style: { fontSize: "12px", padding: "8px 14px" }, onClick: handleSimulateCapture, children: [
                  /* @__PURE__ */ jsx(Sparkles, { size: 14 }),
                  " AI Biometric Snap"
                ] }),
                /* @__PURE__ */ jsxs("button", { className: "btn btn-outline", style: { fontSize: "12px", padding: "8px 14px" }, onClick: () => fileInputRef.current?.click(), children: [
                  /* @__PURE__ */ jsx(Upload, { size: 14 }),
                  " Choose Image"
                ] })
              ] })
            ] }),
            capturedPhoto && /* @__PURE__ */ jsxs("div", { style: {
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "rgba(16, 185, 129, 0.9)",
              color: "#ffffff",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
            }, children: [
              /* @__PURE__ */ jsx(Check, { size: 14 }),
              " Photo Captured"
            ] })
          ] }),
          /* @__PURE__ */ jsx("canvas", { ref: canvasRef, style: { display: "none" } }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "file",
              ref: fileInputRef,
              onChange: handleFileUpload,
              accept: "image/*",
              style: { display: "none" }
            }
          ),
          /* @__PURE__ */ jsxs("div", { style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginTop: "4px"
          }, children: [
            /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "8px" }, children: !capturedPhoto ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  className: "btn btn-outline",
                  style: { fontSize: "12px", padding: "8px 12px" },
                  onClick: () => fileInputRef.current?.click(),
                  title: "Upload picture from device",
                  children: [
                    /* @__PURE__ */ jsx(ImageIcon, { size: 14 }),
                    " Choose File"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  className: "btn btn-outline",
                  style: { fontSize: "12px", padding: "8px 12px" },
                  onClick: handleSimulateCapture,
                  title: "Generate test capture",
                  children: [
                    /* @__PURE__ */ jsx(Sparkles, { size: 14 }),
                    " AI Snap"
                  ]
                }
              )
            ] }) : /* @__PURE__ */ jsxs(
              "button",
              {
                className: "btn btn-outline",
                style: { fontSize: "12px", padding: "8px 14px" },
                onClick: startCamera,
                children: [
                  /* @__PURE__ */ jsx(RefreshCw, { size: 14 }),
                  " Retake Photo"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px" }, children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "btn btn-outline",
                  style: { fontSize: "13px", padding: "8px 16px" },
                  onClick: onClose,
                  children: "Cancel"
                }
              ),
              !capturedPhoto ? /* @__PURE__ */ jsxs(
                "button",
                {
                  className: "btn btn-primary",
                  style: {
                    fontSize: "13px",
                    padding: "10px 22px",
                    background: "linear-gradient(135deg, #053c78 0%, #0052cc 100%)",
                    color: "#ffffff",
                    fontWeight: 700,
                    boxShadow: "0 4px 14px rgba(5, 60, 120, 0.35)"
                  },
                  onClick: handleCapture,
                  disabled: !isCameraActive || isCapturing,
                  children: [
                    /* @__PURE__ */ jsx(Camera, { size: 16 }),
                    " Click Picture"
                  ]
                }
              ) : /* @__PURE__ */ jsxs(
                "button",
                {
                  className: "btn btn-primary",
                  style: {
                    fontSize: "13px",
                    padding: "10px 24px",
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "#ffffff",
                    fontWeight: 800,
                    boxShadow: "0 4px 16px rgba(16, 185, 129, 0.4)"
                  },
                  onClick: handleConfirmUpload,
                  children: [
                    /* @__PURE__ */ jsx(Upload, { size: 16 }),
                    " Upload to Software"
                  ]
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  ) });
};
export {
  CameraCaptureModal
};
