import React, { useState } from 'react';
import { useAppState, UserRole } from '../context/StateContext';
import { CompanyLogo } from './CompanyLogo';
import { ROLE_CREDENTIALS } from './RoleCredentialsCard';
import { Lock, User, KeyRound, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export const LoginScreen: React.FC = () => {
  const { login } = useAppState();
  const [selectedRole, setSelectedRole] = useState<UserRole>('Super Admin');
  const [userIdInput, setUserIdInput] = useState('admin@riddhisiddhi.com');
  const [passwordInput, setPasswordInput] = useState('Admin@2026');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    const cred = ROLE_CREDENTIALS.find(c => c.role === role);
    if (cred) {
      setUserIdInput(cred.userId);
      setPasswordInput(cred.password);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, #1e293b 0%, #090d16 100%)',
      padding: '24px'
    }}>
      <div 
        className="glass-card"
        style={{
          maxWidth: '460px',
          width: '100%',
          padding: '36px 32px',
          borderRadius: '20px',
          border: '1.5px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        {/* Brand Logo & Title */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
          <div style={{ background: 'white', padding: '10px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
            <CompanyLogo size="md" />
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '0.5px' }}>
              RIDDHI SIDDHI ENTERPRISES
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Workforce, Biometric Attendance & Payroll Platform
            </p>
          </div>
        </div>

        {/* Quick Role Persona Switcher Buttons */}
        <div>
          <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
            Select Persona to Sign In:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {ROLE_CREDENTIALS.map((cred) => (
              <button
                key={cred.role}
                type="button"
                className={`btn ${selectedRole === cred.role ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  padding: '6px 4px',
                  fontSize: '11px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontWeight: selectedRole === cred.role ? 800 : 500
                }}
                onClick={() => handleRoleSelect(cred.role)}
              >
                {cred.personaName}
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>User ID / Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={userIdInput}
                onChange={(e) => setUserIdInput(e.target.value)}
                placeholder="Enter User ID"
                required
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600 }}>Password</label>
              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                style={{ background: 'none', border: 'none', color: '#06b6d4', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter Password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              padding: '12px',
              fontSize: '14px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
              color: 'white',
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
              marginTop: '8px'
            }}
          >
            Sign In as {selectedRole} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <ShieldCheck size={14} style={{ color: 'var(--success)' }} />
          <span>256-Bit Encrypted Authentication Gateway</span>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        role={selectedRole}
        personaName={ROLE_CREDENTIALS.find(c => c.role === selectedRole)?.personaName || selectedRole}
        userEmail={ROLE_CREDENTIALS.find(c => c.role === selectedRole)?.email || 'admin@riddhisiddhi.com'}
      />
    </div>
  );
};
