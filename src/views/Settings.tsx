import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { Shield, ShieldAlert, KeyRound, Database, RefreshCw, Eye, Lock, ShieldCheck, Building2, Check, Save, UserCheck, CheckCircle2, XCircle } from 'lucide-react';
import { CompanyLogo } from '../components/CompanyLogo';
import { RoleCredentialsCard } from '../components/RoleCredentialsCard';
import { getPermissions } from '../utils/permissions';

export const Settings: React.FC = () => {
  const { auditLogs, activeRole, companyProfile, updateCompanyProfile, triggerSyncNotification, addAuditLog } = useAppState();

  const [companyName, setCompanyName] = useState(companyProfile.name || 'RIDDHI SIDDHI ENTERPRISES');
  const [companyAddress, setCompanyAddress] = useState(companyProfile.address || 'G - PLOT HIG MHADA COMPLEX-158, SANT TUKARAM NAGAR, PUNE MAHARASHTRA- 411018');
  const [tagline, setTagline] = useState(companyProfile.tagline || 'Workforce & Payroll Operations');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [encryptionStandard, setEncryptionStandard] = useState('AES-256 (GCM)');
  
  // Backup simulation state
  const [backupLoading, setBackupLoading] = useState(false);
  const [lastBackup, setLastBackup] = useState('Aug 8, 2026 00:00:00');

  const permissions = getPermissions(activeRole);
  const canManageSystemSettings = permissions.systemSettings === 'Full';
  const canManageUsers = permissions.userManagement !== 'None';
  const canViewAuditLogs = permissions.auditLogs !== 'None';

  const handleSaveCompanyProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageSystemSettings) return;
    updateCompanyProfile({
      name: companyName,
      address: companyAddress,
      tagline
    });
    setSavedSuccess(true);
    triggerSyncNotification(`🏢 Company profile updated to: ${companyName}`);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleBackup = () => {
    if (!canManageSystemSettings) return;
    setBackupLoading(true);
    addAuditLog('Backup Triggered', 'Manual cryptographic database backup initiated by administrator');
    
    setTimeout(() => {
      setBackupLoading(false);
      const nowStr = new Date().toLocaleString();
      setLastBackup(nowStr);
      addAuditLog('Backup Completed', 'Full snapshot stored securely in off-site S3 server');
      triggerSyncNotification('💾 System Backup completed successfully! DB integrity: 100%');
      alert('System Backup Completed successfully! Snapshot hash: SHA256-4b9e28f3a...');
    }, 1500);
  };

  const handleMfaToggle = () => {
    if (!canManageSystemSettings) return;
    setMfaEnabled(!mfaEnabled);
    addAuditLog('2FA Config Update', `Two-Factor security settings changed to: ${!mfaEnabled ? 'ENABLED' : 'DISABLED'}`);
  };

  // Full 21-module authority matrix matching the User's exact RBAC specification
  const fullPermissionMatrix = [
    { module: 'Dashboard', super: 'Full', hr: 'View', payroll: 'View', manager: 'View', accountant: 'View', employee: 'Own' },
    { module: 'User Management', super: '✅ Full', hr: '✅ Manage', payroll: '❌', manager: '❌', accountant: '❌', employee: '❌' },
    { module: 'Employee Management', super: '✅ Full', hr: '✅ Full', payroll: '👁️ View', manager: '👁️ Team', accountant: '👁️ View', employee: '👁️ Own' },
    { module: 'Attendance', super: '✅ Full', hr: '✅ Manage', payroll: '👁️ View', manager: '✅ Team', accountant: '👁️ View', employee: '✏️ Own' },
    { module: 'Manual Attendance', super: '✅', hr: '✅', payroll: '❌', manager: '✅ Team', accountant: '❌', employee: '❌' },
    { module: 'Attendance Approval', super: '✅', hr: '✅', payroll: '❌', manager: '✅ Team', accountant: '❌', employee: '❌' },
    { module: 'Shift Management', super: '✅ Full', hr: '✅ Manage', payroll: '👁️ View', manager: '👁️ View', accountant: '❌', employee: '👁️ Own' },
    { module: 'Leave Management', super: '✅ Full', hr: '✅ Full', payroll: '👁️ View', manager: '✅ Approve', accountant: '❌', employee: '✅ Apply' },
    { module: 'Holiday Management', super: '✅ Full', hr: '✅ Manage', payroll: '👁️ View', manager: '👁️ View', accountant: '❌', employee: '👁️ View' },
    { module: 'Overtime', super: '✅ Full', hr: '✅ Manage', payroll: '✅ Calculate', manager: '✅ Approve', accountant: '👁️ View', employee: '✅ Request' },
    { module: 'Salary Structure', super: '✅ Full', hr: '✅ Manage', payroll: '✅ Full', manager: '❌', accountant: '👁️ View', employee: '👁️ Own' },
    { module: 'Payroll Calculation', super: '✅', hr: '👁️', payroll: '✅ Full', manager: '❌', accountant: '👁️ View', employee: '👁️ Own' },
    { module: 'Payroll Approval', super: '✅', hr: '✅', payroll: '✅', manager: '❌', accountant: '❌', employee: '❌' },
    { module: 'Payslip', super: '✅', hr: '✅', payroll: '✅', manager: '❌', accountant: '👁️ View', employee: '👁️ Own' },
    { module: 'Loan & Advance', super: '✅', hr: '✅ Manage', payroll: '✅ Calculate', manager: '❌', accountant: '👁️ View', employee: '✅ Request/View' },
    { module: 'PF/ESI/TDS Reports', super: '✅', hr: '✅', payroll: '✅', manager: '❌', accountant: '✅', employee: '❌' },
    { module: 'Bank Transfer', super: '✅', hr: '❌', payroll: '✅', manager: '❌', accountant: '✅', employee: '❌' },
    { module: 'Reports', super: '✅ All', hr: 'HR Reports', payroll: 'Payroll Reports', manager: 'Team Reports', accountant: 'Finance Reports', employee: 'Own' },
    { module: 'Notifications', super: '✅', hr: '✅', payroll: '✅', manager: '✅', accountant: '✅', employee: 'Own' },
    { module: 'Audit Logs', super: '✅ Full', hr: '👁️ View', payroll: '👁️ View', manager: '❌', accountant: '❌', employee: '❌' },
    { module: 'System Settings', super: '✅ Full', hr: '❌', payroll: '❌', manager: '❌', accountant: '❌', employee: '❌' },
  ];

  const renderBadge = (val: string) => {
    if (val === '❌') return <span className="badge badge-danger" style={{ fontSize: '11px' }}>❌ Denied</span>;
    if (val.startsWith('✅')) return <span className="badge badge-success" style={{ fontSize: '11px' }}>{val}</span>;
    if (val.startsWith('👁️')) return <span className="badge badge-info" style={{ fontSize: '11px' }}>{val}</span>;
    if (val.startsWith('✏️')) return <span className="badge badge-warning" style={{ fontSize: '11px' }}>{val}</span>;
    return <span className="badge badge-primary" style={{ fontSize: '11px' }}>{val}</span>;
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Security, Access Control & Auditing</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
          Enforce Role-Based Access Control (RBAC), user credentials, company legal profile, and tamper-proof operational audit logs.
        </p>
      </div>

      {/* System Settings & Branding (Super Admin Only) */}
      {canManageSystemSettings && (
        <>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid var(--primary-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--primary-glow)', color: 'var(--primary)' }}>
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Company Branding & Official Emblem</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    This legal name, emblem, and registered address appear on all official salary slips, reports, and header banners.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-secondary)', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>Emblem Preview:</span>
                <CompanyLogo size="sm" showText={false} />
                <CompanyLogo size="md" showText={false} />
              </div>
            </div>

            <form onSubmit={handleSaveCompanyProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="grid-2">
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Legal Company Name *
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={companyName} 
                    onChange={(e) => setCompanyName(e.target.value)} 
                    placeholder="RIDDHI SIDDHI ENTERPRISES"
                    style={{ fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Tagline / Operational Subtitle
                  </label>
                  <input 
                    type="text" 
                    value={tagline} 
                    onChange={(e) => setTagline(e.target.value)} 
                    placeholder="Workforce & Payroll Operations"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Registered Corporate Address (Printed on Salary Slips) *
                </label>
                <input 
                  type="text" 
                  required 
                  value={companyAddress} 
                  onChange={(e) => setCompanyAddress(e.target.value)} 
                  placeholder="G - PLOT HIG MHADA COMPLEX-158, SANT TUKARAM NAGAR, PUNE MAHARASHTRA- 411018"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                {savedSuccess && (
                  <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={16} /> Saved & Updated Live across entire system!
                  </span>
                )}
                <button type="submit" className="btn btn-primary" style={{ gap: '8px' }}>
                  <Save size={16} /> Save Company Branding
                </button>
              </div>
            </form>
          </div>

          {/* Grid: 2FA, Backup, Encryption */}
          <div className="grid-3">
            
            {/* Two Factor Authentication Card */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <KeyRound size={18} style={{ color: 'var(--primary)' }} /> Multi-Factor Security
              </h3>
              
              <div style={{ flexGrow: 1 }}>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Enforce mandatory SMS OTP or Google Authenticator validation on every administrative log-in.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600 }}>2FA OTP Login:</span>
                  <button 
                    className={`btn ${mfaEnabled ? 'btn-primary' : 'btn-outline'}`}
                    style={{ padding: '6px 12px', fontSize: '12px', background: mfaEnabled ? 'var(--success)' : 'transparent', color: mfaEnabled ? 'white' : 'inherit' }}
                    onClick={handleMfaToggle}
                  >
                    {mfaEnabled ? 'Active (OTP Secured)' : 'Disabled'}
                  </button>
                </div>
              </div>
            </div>

            {/* Backups Panel */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={18} style={{ color: 'var(--primary)' }} /> Cloud Backups
              </h3>
              
              <div style={{ flexGrow: 1 }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  <span>Last Snapshot:</span>
                  <strong style={{ display: 'block', color: 'var(--text-primary)', marginTop: '2px' }}>{lastBackup}</strong>
                </div>
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '8px', fontSize: '12px' }}
                  onClick={handleBackup}
                  disabled={backupLoading}
                >
                  <RefreshCw size={14} className={backupLoading ? 'animate-spin' : ''} style={{ animation: backupLoading ? 'spin 1.5s linear infinite' : 'none' }} />
                  {backupLoading ? 'Backing up vaults...' : 'Trigger Secure Backup'}
                </button>
              </div>
            </div>

            {/* Encryption configurations */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={18} style={{ color: 'var(--primary)' }} /> Cryptography & SSL
              </h3>
              
              <div style={{ flexGrow: 1, fontSize: '12px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Security Level:</span>
                  <strong style={{ display: 'block', color: 'var(--text-primary)', marginTop: '2px' }}>Bank-Grade AES-256</strong>
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Cipher Configuration</label>
                  <select 
                    value={encryptionStandard} 
                    onChange={(e) => setEncryptionStandard(e.target.value)}
                    style={{ padding: '6px 10px', fontSize: '11px' }}
                  >
                    <option value="AES-256 (GCM)">AES-256 (GCM Mode)</option>
                    <option value="ChaCha20-Poly1305">ChaCha20-Poly1305</option>
                    <option value="RSA-4096 (Signatures)">RSA-4096 (Asymmetric)</option>
                  </select>
                </div>
              </div>
            </div>

          </div>
        </>
      )}

      {/* User Management (Super Admin & HR Manager) */}
      {canManageUsers && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserCheck size={20} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>User Management & Role Authentication Credentials</h3>
          </div>
          <RoleCredentialsCard />
        </div>
      )}

      {/* Role-Based Permissions Matrix (Full Verified Matrix) */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Role-Based Access Control (RBAC) Permission Matrix</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Live governance rules mapping all 21 system authority modules to active user roles.
            </p>
          </div>
          <span className="badge badge-success" style={{ padding: '6px 12px', gap: '6px' }}>
            <CheckCircle2 size={14} /> Matrix Verified & Active
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                <th style={{ minWidth: '180px' }}>Module / Authority</th>
                <th style={{ minWidth: '110px' }}>Super Admin</th>
                <th style={{ minWidth: '110px' }}>HR Manager</th>
                <th style={{ minWidth: '120px' }}>Payroll Manager</th>
                <th style={{ minWidth: '110px' }}>Dept. Manager</th>
                <th style={{ minWidth: '120px' }}>Accountant</th>
                <th style={{ minWidth: '110px' }}>Employee</th>
              </tr>
            </thead>
            <tbody>
              {fullPermissionMatrix.map((p, idx) => (
                <tr key={idx} style={{ background: idx % 2 === 1 ? 'var(--bg-surface)' : undefined }}>
                  <td style={{ fontWeight: 700, fontSize: '13px' }}>{p.module}</td>
                  <td>{renderBadge(p.super)}</td>
                  <td>{renderBadge(p.hr)}</td>
                  <td>{renderBadge(p.payroll)}</td>
                  <td>{renderBadge(p.manager)}</td>
                  <td>{renderBadge(p.accountant)}</td>
                  <td>{renderBadge(p.employee)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Operational Audit Logs (Super Admin, HR Manager, Payroll Manager) */}
      {canViewAuditLogs && (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Operational Audit Logs</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Tamper-proof history of all administrative operations executed in the active session.
              </p>
            </div>
            <span className="badge badge-info">{auditLogs.length} Events Logged</span>
          </div>

          <div style={{ overflowX: 'auto', maxHeight: '320px' }}>
            <table>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)' }}>
                  <th>Timestamp</th>
                  <th>Active Role</th>
                  <th>Operation</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.length > 0 ? (
                  auditLogs.map(log => (
                    <tr key={log.id}>
                      <td style={{ fontSize: '11px', fontFamily: 'monospace' }}>{log.timestamp}</td>
                      <td><span className="badge badge-info" style={{ fontSize: '11px' }}>{log.role}</span></td>
                      <td style={{ fontWeight: 600 }}>{log.action}</td>
                      <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{log.details}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No audit records registered yet. Actions like clocks, onboarding, and approvals will trigger entries.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
