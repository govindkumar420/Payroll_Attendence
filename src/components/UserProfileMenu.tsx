import React, { useRef, useEffect } from 'react';
import { UserRole } from '../context/StateContext';
import { Camera, KeyRound, LogOut, ShieldCheck, ChevronRight, User } from 'lucide-react';

interface UserProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
  personaName: string;
  photoUrl: string;
  email: string;
  onChangePhotoClick: () => void;
  onForgotPasswordClick: () => void;
  onViewCredentialsClick: () => void;
  onLogoutClick: () => void;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
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
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="glass-card"
      style={{
        position: 'absolute',
        top: '68px',
        right: '24px',
        width: '320px',
        background: 'var(--bg-surface-solid)',
        border: '1px solid var(--border-color-solid)',
        borderRadius: '16px',
        padding: '8px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      {/* Header Profile Badge */}
      <div style={{
        padding: '12px 14px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid var(--border-color-solid)'
      }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid var(--primary)',
          flexShrink: 0,
          boxShadow: '0 0 10px rgba(99, 102, 241, 0.3)'
        }}>
          <img src={photoUrl} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ overflow: 'hidden' }}>
          <strong style={{ fontSize: '14px', color: 'var(--text-primary)', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {personaName}
          </strong>
          <span className="badge badge-primary" style={{ fontSize: '10px', padding: '1px 6px', marginTop: '2px', display: 'inline-block' }}>
            {role}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '2px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {email}
          </span>
        </div>
      </div>

      {/* Menu Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
        
        {/* Option 1: Change Profile Picture */}
        <button
          className="btn btn-outline"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            border: 'none',
            borderRadius: '10px',
            width: '100%',
            textAlign: 'left',
            color: 'var(--text-primary)',
            fontSize: '13px'
          }}
          onClick={() => { onClose(); onChangePhotoClick(); }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' }}>
              <Camera size={16} />
            </div>
            <span>Change Profile Picture</span>
          </div>
          <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
        </button>

        {/* Option 2: Forgot / Change Password */}
        <button
          className="btn btn-outline"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            border: 'none',
            borderRadius: '10px',
            width: '100%',
            textAlign: 'left',
            color: 'var(--text-primary)',
            fontSize: '13px'
          }}
          onClick={() => { onClose(); onForgotPasswordClick(); }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
              <KeyRound size={16} />
            </div>
            <span>Forgot / Change Password</span>
          </div>
          <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
        </button>

        {/* Option 3: Role IDs & Passwords */}
        <button
          className="btn btn-outline"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            border: 'none',
            borderRadius: '10px',
            width: '100%',
            textAlign: 'left',
            color: 'var(--text-primary)',
            fontSize: '13px'
          }}
          onClick={() => { onClose(); onViewCredentialsClick(); }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
              <ShieldCheck size={16} />
            </div>
            <span>View Access Credentials</span>
          </div>
          <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
        </button>

      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border-color-solid)', margin: '4px 6px' }} />

      {/* Option 4: Logout */}
      <button
        className="btn btn-outline"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 14px',
          border: 'none',
          borderRadius: '10px',
          width: '100%',
          textAlign: 'left',
          color: 'var(--danger)',
          fontSize: '13px',
          fontWeight: 700
        }}
        onClick={() => { onClose(); onLogoutClick(); }}
      >
        <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
          <LogOut size={16} />
        </div>
        <span>Logout Session</span>
      </button>

    </div>
  );
};
