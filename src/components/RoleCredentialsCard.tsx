import React, { useState } from 'react';
import { useAppState, UserRole } from '../context/StateContext';
import { KeyRound, Copy, Check, Eye, EyeOff, ShieldCheck, UserCheck, ArrowRight, Lock, ShieldAlert } from 'lucide-react';

export interface RoleCredential {
  role: UserRole;
  userId: string;
  password: string;
  personaName: string;
  email: string;
  scope: string;
  badgeClass: string;
}

export const ROLE_CREDENTIALS: RoleCredential[] = [
  {
    role: 'Super Admin',
    userId: 'admin@riddhisiddhi.com',
    password: 'Admin@2026',
    personaName: 'Shejal',
    email: 'admin@riddhisiddhi.com',
    scope: 'Full System Access, System Config, Security & Backups',
    badgeClass: 'badge-danger'
  },
  {
    role: 'HR Manager',
    userId: 'hr@riddhisiddhi.com',
    password: 'Hr@2026#',
    personaName: 'Hiralben',
    email: 'sarah.connor@riddhisiddhi.com',
    scope: 'Employee Directory, Onboarding, Leave Verification & Shifts',
    badgeClass: 'badge-primary'
  },
  {
    role: 'Payroll Manager',
    userId: 'payroll@riddhisiddhi.com',
    password: 'Payroll@2026',
    personaName: 'Parth',
    email: 'marcus.wright@riddhisiddhi.com',
    scope: 'Salary Slips, Overtime & Loans Processing',
    badgeClass: 'badge-warning'
  },
  {
    role: 'Department Manager',
    userId: 'manager@riddhisiddhi.com',
    password: 'Manager@2026',
    personaName: 'Manas',
    email: 'john.connor@riddhisiddhi.com',
    scope: 'Team Attendance & Leave Approvals',
    badgeClass: 'badge-info'
  },
  {
    role: 'Employee',
    userId: '200050',
    password: 'Emp@200050',
    personaName: 'Vaghela Pushprajsinh',
    email: 'pushpraj.vaghela@riddhisiddhi.com',
    scope: 'Self Attendance (GPS & Camera), Leaves & Payslips',
    badgeClass: 'badge-success'
  },
  {
    role: 'Accountant',
    userId: 'accountant@riddhisiddhi.com',
    password: 'Accounts@2026',
    personaName: 'Finance Desk',
    email: 'accounts@riddhisiddhi.com',
    scope: 'Tax Reports, TDS, PF / ESIC Disbursals',
    badgeClass: 'badge-primary'
  }
];

interface RoleCredentialsCardProps {
  fullScreen?: boolean;
}

export const RoleCredentialsCard: React.FC<RoleCredentialsCardProps> = ({ fullScreen = false }) => {
  const { activeRole, setActiveRole, triggerSyncNotification } = useAppState();
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const isSuperAdmin = activeRole === 'Super Admin';

  // Strict RBAC: Super Admin sees all credentials, other roles ONLY see their own credentials
  const visibleCredentials = isSuperAdmin
    ? ROLE_CREDENTIALS
    : ROLE_CREDENTIALS.filter(c => c.role === activeRole);

  const togglePasswordVisibility = (role: string) => {
    setShowPasswords(prev => ({ ...prev, [role]: !prev[role] }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    triggerSyncNotification(`📋 Copied ${label} to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '18px', border: '1.5px solid rgba(99, 102, 241, 0.25)', flexGrow: fullScreen ? 1 : 'unset' }}>
      
      {/* Top Banner & Security Level */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: isSuperAdmin ? 'var(--primary-light)' : 'rgba(16, 185, 129, 0.1)',
            color: isSuperAdmin ? 'var(--primary)' : 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <KeyRound size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isSuperAdmin ? 'Master Role Credentials Directory' : 'My Account Credentials'}
              <span className={`badge ${isSuperAdmin ? 'badge-danger' : 'badge-success'}`} style={{ fontSize: '10px', padding: '2px 8px' }}>
                {isSuperAdmin ? 'SUPER ADMIN ACCESS (ALL ROLES)' : `RESTRICTED TO ${activeRole.toUpperCase()}`}
              </span>
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {isSuperAdmin 
                ? 'Super Admin master authorization: Full visibility over all system roles and credentials.'
                : `Restricted Access: Displaying credentials for your authenticated role (${activeRole}) only.`}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isSuperAdmin ? (
            <button
              className="btn btn-outline"
              style={{ fontSize: '11px', padding: '6px 12px', gap: '6px' }}
              onClick={() => {
                const allVisible = Object.keys(showPasswords).length === ROLE_CREDENTIALS.length && Object.values(showPasswords).every(Boolean);
                const newState: Record<string, boolean> = {};
                ROLE_CREDENTIALS.forEach(r => { newState[r.role] = !allVisible; });
                setShowPasswords(newState);
              }}
            >
              <Lock size={13} />
              Toggle All Passwords
            </button>
          ) : (
            <span className="badge badge-info" style={{ fontSize: '11px', gap: '4px' }}>
              <ShieldCheck size={13} /> Authenticated as {activeRole}
            </span>
          )}
        </div>
      </div>

      {/* Non-Admin Security Notice */}
      {!isSuperAdmin && (
        <div style={{
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid var(--primary-light)',
          borderRadius: '8px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}>
          <ShieldAlert size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <span>
            <strong>Security Notice:</strong> In accordance with role-based access control (RBAC) policies, master credentials for other roles are hidden and only accessible by <strong>Super Admin</strong>.
          </span>
        </div>
      )}

      {/* Credentials Table with Dedicated Scrollbar and Sticky Header */}
      <div style={{
        overflowX: 'auto',
        overflowY: 'auto',
        maxHeight: fullScreen ? 'calc(100vh - 270px)' : '400px',
        border: '1px solid var(--border-color-solid)',
        borderRadius: '10px',
        boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.1)',
        flexGrow: fullScreen ? 1 : 'unset'
      }}>
        <table style={{ width: '100%', minWidth: '850px', margin: 0 }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
            <tr>
              <th style={{ background: 'var(--bg-surface-solid)', borderBottom: '2px solid var(--border-color-solid)', padding: '14px 16px' }}>Role</th>
              <th style={{ background: 'var(--bg-surface-solid)', borderBottom: '2px solid var(--border-color-solid)', padding: '14px 16px' }}>Designated Persona</th>
              <th style={{ background: 'var(--bg-surface-solid)', borderBottom: '2px solid var(--border-color-solid)', padding: '14px 16px' }}>Login User ID / Username</th>
              <th style={{ background: 'var(--bg-surface-solid)', borderBottom: '2px solid var(--border-color-solid)', padding: '14px 16px' }}>Default Password</th>
              <th style={{ background: 'var(--bg-surface-solid)', borderBottom: '2px solid var(--border-color-solid)', padding: '14px 16px' }}>Access Scope</th>
              {isSuperAdmin && (
                <th style={{ background: 'var(--bg-surface-solid)', borderBottom: '2px solid var(--border-color-solid)', padding: '14px 16px' }}>Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {visibleCredentials.map((cred) => {
              const isActive = activeRole === cred.role;
              const isVisible = !!showPasswords[cred.role];
              const isIdCopied = copiedField === `${cred.role}-id`;
              const isPwCopied = copiedField === `${cred.role}-pw`;

              return (
                <tr key={cred.role} style={{ background: isActive ? 'var(--primary-light)' : 'transparent' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge ${cred.badgeClass}`} style={{ fontWeight: 800, fontSize: '11px' }}>
                        {cred.role}
                      </span>
                      {isActive && (
                        <span className="badge badge-success" style={{ fontSize: '9px', padding: '1px 6px' }}>
                          ACTIVE
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <strong style={{ fontSize: '13px', display: 'block' }}>{cred.personaName}</strong>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{cred.email}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <code style={{
                        background: 'var(--bg-secondary)',
                        padding: '5px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color-solid)',
                        fontFamily: 'monospace'
                      }}>
                        {cred.userId}
                      </code>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '4px 6px', height: 'auto', border: 'none', color: isIdCopied ? 'var(--success)' : 'var(--text-muted)' }}
                        onClick={() => copyToClipboard(cred.userId, `${cred.role}-id`)}
                        title="Copy User ID"
                      >
                        {isIdCopied ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <code style={{
                        background: 'var(--bg-secondary)',
                        padding: '5px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#06b6d4',
                        border: '1px solid var(--border-color-solid)',
                        fontFamily: 'monospace',
                        minWidth: '120px',
                        display: 'inline-block'
                      }}>
                        {isVisible ? cred.password : '••••••••••••'}
                      </code>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '4px 6px', height: 'auto', border: 'none', color: 'var(--text-muted)' }}
                        onClick={() => togglePasswordVisibility(cred.role)}
                        title={isVisible ? 'Hide password' : 'Show password'}
                      >
                        {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '4px 6px', height: 'auto', border: 'none', color: isPwCopied ? 'var(--success)' : 'var(--text-muted)' }}
                        onClick={() => copyToClipboard(cred.password, `${cred.role}-pw`)}
                        title="Copy Password"
                      >
                        {isPwCopied ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '280px', padding: '14px 16px' }}>
                    {cred.scope}
                  </td>
                  {isSuperAdmin && (
                    <td style={{ padding: '14px 16px' }}>
                      {isActive ? (
                        <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <UserCheck size={14} /> Current
                        </span>
                      ) : (
                        <button
                          className="btn btn-outline"
                          style={{ padding: '6px 12px', fontSize: '11px', height: 'auto', gap: '4px' }}
                          onClick={() => setActiveRole(cred.role)}
                        >
                          Switch <ArrowRight size={12} />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
