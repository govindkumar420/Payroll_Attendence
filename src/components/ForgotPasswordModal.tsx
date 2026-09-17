import React, { useState } from 'react';
import { useAppState, UserRole } from '../context/StateContext';
import { KeyRound, X, Check, Lock, Mail, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
  personaName: string;
  userEmail: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  role,
  personaName,
  userEmail
}) => {
  const { updateUserPassword, triggerSyncNotification } = useAppState();
  
  const [activeTab, setActiveTab] = useState<'change' | 'reset'>('change');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  
  // Forgot Password / OTP simulation
  const [resetEmail, setResetEmail] = useState(userEmail);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!newPass) {
      setErrorMsg('Please enter a new password.');
      return;
    }
    if (newPass.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (newPass !== confirmPass) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    updateUserPassword(role, newPass);
    setSuccessMsg('Password updated successfully!');
    setTimeout(() => {
      onClose();
      setSuccessMsg(null);
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    }, 1500);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpSent(true);
    triggerSyncNotification(`📧 Verification OTP sent to ${resetEmail}: 849201`);
  };

  const handleVerifyOtpAndReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!otpCode) {
      setErrorMsg('Please enter the 6-digit OTP code.');
      return;
    }
    if (!newPass || newPass.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }
    if (newPass !== confirmPass) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    updateUserPassword(role, newPass);
    setSuccessMsg('Password reset successfully via verified OTP!');
    setTimeout(() => {
      onClose();
      setSuccessMsg(null);
      setOtpSent(false);
      setOtpCode('');
      setNewPass('');
      setConfirmPass('');
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div 
        className="modal-content glass-card"
        style={{
          maxWidth: '480px',
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
              <KeyRound size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>
                Account Security & Password
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {personaName} ({role})
              </span>
            </div>
          </div>
          <button 
            className="btn btn-outline"
            style={{ padding: '6px', borderRadius: '8px', border: 'none', color: 'var(--text-muted)' }}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color-solid)' }}>
          <button
            style={{
              flex: 1,
              padding: '12px',
              background: activeTab === 'change' ? 'var(--primary-light)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'change' ? '2px solid var(--primary)' : 'none',
              color: activeTab === 'change' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
            onClick={() => { setActiveTab('change'); setErrorMsg(null); setSuccessMsg(null); }}
          >
            Change Password
          </button>
          <button
            style={{
              flex: 1,
              padding: '12px',
              background: activeTab === 'reset' ? 'var(--primary-light)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'reset' ? '2px solid var(--primary)' : 'none',
              color: activeTab === 'reset' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
            onClick={() => { setActiveTab('reset'); setErrorMsg(null); setSuccessMsg(null); }}
          >
            Forgot Password / Reset
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--danger)',
              color: 'var(--danger)',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600
            }}>
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid var(--success)',
              color: 'var(--success)',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Check size={16} /> {successMsg}
            </div>
          )}

          {activeTab === 'change' ? (
            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Current Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Confirm New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-outline" style={{ fontSize: '12px', padding: '8px 16px' }} onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ fontSize: '12px', padding: '8px 22px', fontWeight: 700 }}>
                  <Check size={14} /> Update Password
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {!otpSent ? (
                <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                    Enter your registered email address to receive a 6-digit security OTP to reset your password.
                  </p>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Registered Email</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="user@riddhisiddhi.com"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                    <button type="button" className="btn btn-outline" style={{ fontSize: '12px', padding: '8px 16px' }} onClick={onClose}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" style={{ fontSize: '12px', padding: '8px 20px', fontWeight: 700 }}>
                      <Mail size={14} /> Send Security OTP
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtpAndReset} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{
                    background: 'var(--bg-secondary)',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    border: '1px solid var(--border-color-solid)'
                  }}>
                    <span>Security Code sent to <strong>{resetEmail}</strong> (Demo OTP: <strong>849201</strong>)</span>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>6-Digit OTP Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="e.g. 849201"
                      style={{ letterSpacing: '4px', fontFamily: 'monospace', fontWeight: 700, fontSize: '16px' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>New Password</label>
                    <input
                      type="password"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="Create a strong password"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      placeholder="Re-enter new password"
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                    <button type="button" className="btn btn-outline" style={{ fontSize: '12px', padding: '8px 14px' }} onClick={() => setOtpSent(false)}>
                      Back
                    </button>
                    <button type="submit" className="btn btn-primary" style={{ fontSize: '12px', padding: '8px 22px', fontWeight: 700 }}>
                      <Check size={14} /> Reset & Login
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
