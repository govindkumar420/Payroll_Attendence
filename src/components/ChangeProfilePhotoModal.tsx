import React, { useState, useRef } from 'react';
import { useAppState, UserRole } from '../context/StateContext';
import { Camera, Upload, X, Check, Image as ImageIcon, Sparkles, RefreshCw } from 'lucide-react';

interface ChangeProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhoto: string;
  role: UserRole;
  personaName: string;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150'
];

export const ChangeProfilePhotoModal: React.FC<ChangeProfilePhotoModalProps> = ({
  isOpen,
  onClose,
  currentPhoto,
  role,
  personaName
}) => {
  const { updatePersonaPhoto } = useAppState();
  const [selectedPhoto, setSelectedPhoto] = useState<string>(currentPhoto);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedPhoto(event.target.result as string);
        stopCamera();
      }
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 480 }, height: { ideal: 480 } }
        });
        setStream(mediaStream);
        setIsCameraActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      }
    } catch (err) {
      console.warn('Unable to access camera for profile selfie:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
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
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw square cropped snapshot
    const minDim = Math.min(video.videoWidth, video.videoHeight);
    const sx = (video.videoWidth - minDim) / 2;
    const sy = (video.videoHeight - minDim) / 2;
    ctx.drawImage(video, sx, sy, minDim, minDim, 0, 0, 400, 400);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setSelectedPhoto(dataUrl);
    stopCamera();
  };

  const handleSave = () => {
    updatePersonaPhoto(role, selectedPhoto);
    stopCamera();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) { stopCamera(); onClose(); } }}>
      <div 
        className="modal-content glass-card"
        style={{
          maxWidth: '520px',
          width: '100%',
          background: 'var(--bg-surface-solid)',
          border: '1px solid var(--border-color-solid)',
          padding: 0,
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.55)'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.12) 100%)',
          borderBottom: '1px solid var(--border-color-solid)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Camera size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>
                Change Profile Picture
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {personaName} ({role})
              </span>
            </div>
          </div>
          <button 
            className="btn btn-outline"
            style={{ padding: '6px', borderRadius: '8px', border: 'none', color: 'var(--text-muted)' }}
            onClick={() => { stopCamera(); onClose(); }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Active Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid var(--primary)',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
              position: 'relative',
              background: '#090d16'
            }}>
              {isCameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                />
              ) : (
                <img
                  src={selectedPhoto}
                  alt="Profile Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {!isCameraActive ? (
                <>
                  <button
                    className="btn btn-primary"
                    style={{ fontSize: '12px', padding: '6px 14px', gap: '6px' }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={14} /> Choose Image File
                  </button>
                  <button
                    className="btn btn-outline"
                    style={{ fontSize: '12px', padding: '6px 14px', gap: '6px' }}
                    onClick={startCamera}
                  >
                    <Camera size={14} /> Open Camera
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-primary"
                    style={{ fontSize: '12px', padding: '6px 16px', background: 'var(--success)', color: 'white' }}
                    onClick={captureCameraPhoto}
                  >
                    <Camera size={14} /> Capture Selfie
                  </button>
                  <button
                    className="btn btn-outline"
                    style={{ fontSize: '12px', padding: '6px 14px' }}
                    onClick={stopCamera}
                  >
                    Cancel Camera
                  </button>
                </>
              )}
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>

          {/* Preset Avatars Selection */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              Or Select from Avatar Presets:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {PRESET_AVATARS.map((avatar, idx) => (
                <div
                  key={idx}
                  onClick={() => { setSelectedPhoto(avatar); stopCamera(); }}
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selectedPhoto === avatar ? '2px solid var(--primary)' : '2px solid transparent',
                    boxShadow: selectedPhoto === avatar ? '0 0 10px rgba(99, 102, 241, 0.4)' : 'none',
                    transform: selectedPhoto === avatar ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                    aspectRatio: '1/1'
                  }}
                >
                  <img src={avatar} alt={`Avatar option ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button
              className="btn btn-outline"
              style={{ fontSize: '12px', padding: '8px 16px' }}
              onClick={() => { stopCamera(); onClose(); }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              style={{ fontSize: '12px', padding: '8px 22px', fontWeight: 700 }}
              onClick={handleSave}
            >
              <Check size={14} /> Save Profile Picture
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
