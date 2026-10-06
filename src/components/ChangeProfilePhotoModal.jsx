import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { useAppState } from "../context/StateContext";
import { Camera, Upload, X, Check } from "lucide-react";
const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150"
];
const ChangeProfilePhotoModal = ({
  isOpen,
  onClose,
  currentPhoto,
  role,
  personaName
}) => {
  const { updatePersonaPhoto } = useAppState();
  const [selectedPhoto, setSelectedPhoto] = useState(currentPhoto);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  if (!isOpen) return null;
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedPhoto(event.target.result);
        stopCamera();
      }
    };
    reader.readAsDataURL(file);
  };
  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 480 }, height: { ideal: 480 } }
        });
        setStream(mediaStream);
        setIsCameraActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      }
    } catch (err) {
      console.warn("Unable to access camera for profile selfie:", err);
    }
  };
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };
  const captureCameraPhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const minDim = Math.min(video.videoWidth, video.videoHeight);
    const sx = (video.videoWidth - minDim) / 2;
    const sy = (video.videoHeight - minDim) / 2;
    ctx.drawImage(video, sx, sy, minDim, minDim, 0, 0, 400, 400);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    setSelectedPhoto(dataUrl);
    stopCamera();
  };
  const handleSave = () => {
    updatePersonaPhoto(role, selectedPhoto);
    stopCamera();
    onClose();
  };
  return /* @__PURE__ */ jsx("div", { className: "modal-overlay", onClick: (e) => {
    if (e.target === e.currentTarget) {
      stopCamera();
      onClose();
    }
  }, children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: "modal-content glass-card",
      style: {
        maxWidth: "520px",
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
            }, children: /* @__PURE__ */ jsx(Camera, { size: 20 }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { style: { fontSize: "16px", fontWeight: 800, margin: 0 }, children: "Change Profile Picture" }),
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
              onClick: () => {
                stopCamera();
                onClose();
              },
              children: /* @__PURE__ */ jsx(X, { size: 20 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }, children: [
            /* @__PURE__ */ jsx("div", { style: {
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "3px solid var(--primary)",
              boxShadow: "0 0 20px rgba(0, 143, 131, 0.3)",
              position: "relative",
              background: "#090d16"
            }, children: isCameraActive ? /* @__PURE__ */ jsx(
              "video",
              {
                ref: videoRef,
                autoPlay: true,
                playsInline: true,
                muted: true,
                style: { width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }
              }
            ) : /* @__PURE__ */ jsx(
              "img",
              {
                src: selectedPhoto,
                alt: "Profile Preview",
                style: { width: "100%", height: "100%", objectFit: "cover" }
              }
            ) }),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "8px" }, children: !isCameraActive ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  className: "btn btn-primary",
                  style: { fontSize: "12px", padding: "6px 14px", gap: "6px" },
                  onClick: () => fileInputRef.current?.click(),
                  children: [
                    /* @__PURE__ */ jsx(Upload, { size: 14 }),
                    " Choose Image File"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  className: "btn btn-outline",
                  style: { fontSize: "12px", padding: "6px 14px", gap: "6px" },
                  onClick: startCamera,
                  children: [
                    /* @__PURE__ */ jsx(Camera, { size: 14 }),
                    " Open Camera"
                  ]
                }
              )
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  className: "btn btn-primary",
                  style: { fontSize: "12px", padding: "6px 16px", background: "var(--success)", color: "white" },
                  onClick: captureCameraPhoto,
                  children: [
                    /* @__PURE__ */ jsx(Camera, { size: 14 }),
                    " Capture Selfie"
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "btn btn-outline",
                  style: { fontSize: "12px", padding: "6px 14px" },
                  onClick: stopCamera,
                  children: "Cancel Camera"
                }
              )
            ] }) }),
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
            /* @__PURE__ */ jsx("canvas", { ref: canvasRef, style: { display: "none" } })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "8px", color: "var(--text-secondary)" }, children: "Or Select from Avatar Presets:" }),
            /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }, children: PRESET_AVATARS.map((avatar, idx) => /* @__PURE__ */ jsx(
              "div",
              {
                onClick: () => {
                  setSelectedPhoto(avatar);
                  stopCamera();
                },
                style: {
                  borderRadius: "12px",
                  overflow: "hidden",
                  cursor: "pointer",
                  border: selectedPhoto === avatar ? "2px solid var(--primary)" : "2px solid transparent",
                  boxShadow: selectedPhoto === avatar ? "0 0 10px rgba(0, 143, 131, 0.4)" : "none",
                  transform: selectedPhoto === avatar ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.2s ease",
                  aspectRatio: "1/1"
                },
                children: /* @__PURE__ */ jsx("img", { src: avatar, alt: `Avatar option ${idx + 1}`, style: { width: "100%", height: "100%", objectFit: "cover" } })
              },
              idx
            )) })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }, children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "btn btn-outline",
                style: { fontSize: "12px", padding: "8px 16px" },
                onClick: () => {
                  stopCamera();
                  onClose();
                },
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                className: "btn btn-primary",
                style: { fontSize: "12px", padding: "8px 22px", fontWeight: 700 },
                onClick: handleSave,
                children: [
                  /* @__PURE__ */ jsx(Check, { size: 14 }),
                  " Save Profile Picture"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  ) });
};
export {
  ChangeProfilePhotoModal
};
