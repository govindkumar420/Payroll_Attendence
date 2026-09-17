import React, { useState, useEffect } from 'react';
import { useAppState, UserRole } from './context/StateContext';
import { getPermissions, isTabVisibleForRole } from './utils/permissions';
import { Dashboard } from './views/Dashboard';
import { Employees } from './views/Employees';
import { Attendance } from './views/Attendance';
import { Shifts } from './views/Shifts';
import { Leaves } from './views/Leaves';
import { Payroll } from './views/Payroll';
import { Loans } from './views/Loans';
import { Reports } from './views/Reports';
import { Settings } from './views/Settings';
import { CompanyLogo } from './components/CompanyLogo';
import { RoleCredentialsModal } from './components/RoleCredentialsModal';
import { UserProfileMenu } from './components/UserProfileMenu';
import { ChangeProfilePhotoModal } from './components/ChangeProfilePhotoModal';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { LoginScreen } from './components/LoginScreen';

import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  CalendarDays, 
  ClipboardCheck, 
  DollarSign, 
  Wallet, 
  FileBarChart, 
  Shield, 
  Sun, 
  Moon, 
  MessageSquare, 
  Menu, 
  X, 
  KeyRound,
  ChevronDown
} from 'lucide-react';

export const App: React.FC = () => {
  const { theme, setTheme, activeRole, setActiveRole, notifications, personaPhotos, isLoggedIn, logout } = useAppState();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'employees' | 'attendance' | 'shifts' | 'leaves' | 'payroll' | 'loans' | 'reports' | 'settings'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth > 768 : true);
  const [credentialsModalOpen, setCredentialsModalOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [changePhotoModalOpen, setChangePhotoModalOpen] = useState(false);
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);

  const permissions = getPermissions(activeRole);

  // Auto redirect if active tab is not allowed for the new role
  useEffect(() => {
    if (!isTabVisibleForRole(activeRole, activeTab)) {
      setActiveTab('dashboard');
    }
  }, [activeRole, activeTab]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleNavClick = (tabId: any) => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  // Find employee matching role for display name
  const getPersonaName = () => {
    switch (activeRole) {
      case 'Super Admin':
        return 'Shejal (Admin)';
      case 'HR Manager':
        return 'Hiralben (HR)';
      case 'Payroll Manager':
        return 'Parth (Pay)';
      case 'Department Manager':
        return 'Manas (Mgr)';
      case 'Employee':
        return 'Vaghela Pushprajsinh (EMP-200050)';
      case 'Accountant':
        return 'Finance Desk (Fin)';
      default:
        return 'User Session';
    }
  };

  const getPersonaPhoto = () => {
    return personaPhotos[activeRole] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150';
  };

  const getPersonaEmail = () => {
    switch (activeRole) {
      case 'Super Admin':
        return 'admin@riddhisiddhi.com';
      case 'HR Manager':
        return 'hr@riddhisiddhi.com';
      case 'Payroll Manager':
        return 'payroll@riddhisiddhi.com';
      case 'Department Manager':
        return 'manager@riddhisiddhi.com';
      case 'Employee':
        return 'pushpraj.vaghela@riddhisiddhi.com';
      case 'Accountant':
        return 'accountant@riddhisiddhi.com';
      default:
        return 'user@riddhisiddhi.com';
    }
  };

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'employees':
        return <Employees />;
      case 'attendance':
        return <Attendance />;
      case 'shifts':
        return <Shifts />;
      case 'leaves':
        return <Leaves />;
      case 'payroll':
        return <Payroll />;
      case 'loans':
        return <Loans />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  // All navigation items
  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { 
      id: 'employees', 
      label: permissions.employeeManagement === 'Team' ? 'Team Directory' : permissions.employeeManagement === 'Own' ? 'My Profile' : 'Employees Directory', 
      icon: <Users size={18} /> 
    },
    { 
      id: 'attendance', 
      label: activeRole === 'Employee' ? 'My Attendance' : 'Attendance Terminal', 
      icon: <Clock size={18} /> 
    },
    { 
      id: 'shifts', 
      label: activeRole === 'Employee' ? 'My Shift & Calendar' : 'Shift & Calendar', 
      icon: <CalendarDays size={18} /> 
    },
    { 
      id: 'leaves', 
      label: activeRole === 'Employee' ? 'Apply Leave' : permissions.leaveManagement === 'Approve' ? 'Leave Approvals' : 'Leave Desk', 
      icon: <ClipboardCheck size={18} /> 
    },
    { 
      id: 'payroll', 
      label: activeRole === 'Employee' ? 'My Payslips' : 'Payroll Center', 
      icon: <DollarSign size={18} /> 
    },
    { 
      id: 'loans', 
      label: activeRole === 'Employee' ? 'Request Advance' : 'Loans & Advances', 
      icon: <Wallet size={18} /> 
    },
    { 
      id: 'reports', 
      label: activeRole === 'Employee' ? 'My Summary' : activeRole === 'Accountant' ? 'Financial Reports' : 'Statutory Reports', 
      icon: <FileBarChart size={18} /> 
    },
    { 
      id: 'settings', 
      label: activeRole === 'HR Manager' ? 'User Management' : activeRole === 'Payroll Manager' ? 'Audit Logs' : 'Security & Settings', 
      icon: <Shield size={18} /> 
    },
  ];

  const visibleNavItems = allNavItems.filter(item => isTabVisibleForRole(activeRole, item.id));

  return (
    <div className="app-container" data-theme={theme}>
      
      {/* Sidebar Overlay Backdrop for Mobile */}
      {sidebarOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar Navigation */}
      {sidebarOpen && (
        <aside className="sidebar">
          {/* Logo Brand */}
          <div style={{ marginBottom: '28px', padding: '0 6px' }}>
            <CompanyLogo size="sm" showText={true} />
          </div>

          {/* Links list */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1 }}>
            {visibleNavItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: activeTab === item.id ? 'var(--primary-light)' : 'transparent',
                  color: activeTab === item.id ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: activeTab === item.id ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  width: '100%'
                }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          {/* Real-time Simulated SMS/WhatsApp Notifications drawer inside Sidebar */}
          <div style={{ 
            borderTop: '1px solid var(--border-color)', 
            paddingTop: '20px', 
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={12} /> Gateways Dispatch Log
            </span>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '160px', overflowY: 'auto' }}>
              {notifications.length > 0 ? (
                notifications.slice(0, 4).map((note: string, idx: number) => (
                  <div key={idx} style={{ 
                    background: 'var(--border-color)', 
                    padding: '8px 10px', 
                    borderRadius: '8px', 
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    borderLeft: '3px solid var(--primary)'
                  }}>
                    {note}
                  </div>
                ))
              ) : (
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0 8px' }}>
                  No gateway events dispatched.
                </span>
              )}
            </div>
          </div>
        </aside>
      )}

      {/* Main Container */}
      <main className="main-content">
        
        {/* Header */}
        <header className="header">
          {/* Menu Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 style={{ fontSize: '18px', fontWeight: 800 }}>
              {allNavItems.find(n => n.id === activeTab)?.label}
            </h1>
            <div className="badge badge-primary" style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', gap: '6px', background: 'var(--primary-glow)', border: '1px solid var(--primary)' }}>
              <CompanyLogo size="xs" />
              <span>RIDDHI SIDDHI ENTERPRISES</span>
            </div>
          </div>

          {/* Top Panel Actions: Switch Role & Dark Mode toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            
            {/* Global Role Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Role Switcher:</span>
              <select 
                value={activeRole} 
                onChange={(e) => setActiveRole(e.target.value as UserRole)}
                style={{ width: '170px', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 600 }}
              >
                <option value="Super Admin">Super Admin</option>
                <option value="HR Manager">HR Manager</option>
                <option value="Payroll Manager">Payroll Manager</option>
                <option value="Department Manager">Department Manager</option>
                <option value="Employee">Employee Persona</option>
                <option value="Accountant">Accountant</option>
              </select>
            </div>

            {/* Role IDs & Passwords Quick Access Button */}
            <button 
              className="btn btn-outline"
              onClick={() => setCredentialsModalOpen(true)}
              style={{ fontSize: '11px', padding: '6px 12px', gap: '6px', borderRadius: '8px', fontWeight: 700 }}
              title="View User IDs & Passwords for all roles"
            >
              <KeyRound size={14} style={{ color: '#06b6d4' }} />
              <span>IDs & Passwords</span>
            </button>

            {/* Dark/Light toggle button */}
            <button 
              className="btn btn-outline"
              onClick={toggleTheme}
              style={{ padding: '8px', borderRadius: '50%', width: '36px', height: '36px' }}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* User Persona Profile Clickable Dropdown Trigger */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                borderLeft: '1px solid var(--border-color)',
                paddingLeft: '20px',
                cursor: 'pointer',
                padding: '6px 12px 6px 16px',
                borderRadius: '10px',
                background: profileMenuOpen ? 'var(--primary-light)' : 'transparent',
                transition: 'all 0.2s ease'
              }}
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              title="Account Options (Change Photo, Password, Logout)"
            >
              <img 
                src={getPersonaPhoto()} 
                alt="user profile" 
                style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--primary)' }}
              />
              <div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {getPersonaName()}
                  <ChevronDown size={14} style={{ color: 'var(--text-muted)', transform: profileMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'capitalize' }}>
                  {activeRole}
                </span>
              </div>
            </div>

            {/* Floating User Profile Menu */}
            <UserProfileMenu
              isOpen={profileMenuOpen}
              onClose={() => setProfileMenuOpen(false)}
              role={activeRole}
              personaName={getPersonaName()}
              photoUrl={getPersonaPhoto()}
              email={getPersonaEmail()}
              onChangePhotoClick={() => setChangePhotoModalOpen(true)}
              onForgotPasswordClick={() => setForgotPasswordModalOpen(true)}
              onViewCredentialsClick={() => setCredentialsModalOpen(true)}
              onLogoutClick={logout}
            />

          </div>
        </header>

        {/* Dynamic Inner Viewport */}
        <div className="view-container">
          {renderView()}
        </div>

      </main>

      {/* Change Profile Photo Modal */}
      <ChangeProfilePhotoModal
        isOpen={changePhotoModalOpen}
        onClose={() => setChangePhotoModalOpen(false)}
        currentPhoto={getPersonaPhoto()}
        role={activeRole}
        personaName={getPersonaName()}
      />

      {/* Forgot / Change Password Modal */}
      <ForgotPasswordModal
        isOpen={forgotPasswordModalOpen}
        onClose={() => setForgotPasswordModalOpen(false)}
        role={activeRole}
        personaName={getPersonaName()}
        userEmail={getPersonaEmail()}
      />

      {/* Role Credentials Modal (Available Globally) */}
      <RoleCredentialsModal
        isOpen={credentialsModalOpen}
        onClose={() => setCredentialsModalOpen(false)}
      />

    </div>
  );
};

export default App;
