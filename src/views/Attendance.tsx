import React, { useState, useEffect } from 'react';
import { useAppState, AttendanceRecord } from '../context/StateContext';
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
} from 'lucide-react';
import { CameraCaptureModal } from '../components/CameraCaptureModal';
import { PhotoVerificationModal } from '../components/PhotoVerificationModal';
import { getPermissions, filterEmployeesByRole, EMPLOYEE_PERSONA_ID, MANAGER_DEPARTMENT } from '../utils/permissions';

export const Attendance: React.FC = () => {
  const { employees, attendance, activeRole, clockIn, clockOut } = useAppState();
  
  const permissions = getPermissions(activeRole);
  const isEmployee = activeRole === 'Employee';
  const canClock = permissions.attendance === 'Full' || permissions.attendance === 'Manage' || permissions.attendance === 'Team' || permissions.attendance === 'Own';

  // Role-scoped employees and attendance
  const accessibleEmployees = filterEmployeesByRole(employees, activeRole);
  const accessibleAttendance = isEmployee 
    ? attendance.filter(a => a.employeeId === EMPLOYEE_PERSONA_ID || a.employeeId === 'EMP-005') 
    : activeRole === 'Department Manager'
      ? attendance.filter(a => {
          const emp = employees.find(e => e.id === a.employeeId);
          return emp?.department === MANAGER_DEPARTMENT;
        })
      : attendance;

  const [selectedEmpId, setSelectedEmpId] = useState(isEmployee ? EMPLOYEE_PERSONA_ID : (accessibleEmployees[0]?.id || ''));
  const [clockMethod, setClockMethod] = useState('Biometric');
  const [mockLocation, setMockLocation] = useState('Headquarters (San Jose)');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Camera & Photo Verification State
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [geoVerifiedDetails, setGeoVerifiedDetails] = useState<{ coordinates: string; accuracy: string; address: string } | null>(null);
  const [viewingRecord, setViewingRecord] = useState<AttendanceRecord | null>(null);
  
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Set default employee based on role
  useEffect(() => {
    if (isEmployee) {
      setSelectedEmpId(EMPLOYEE_PERSONA_ID);
    } else if (accessibleEmployees.length > 0 && (!selectedEmpId || !accessibleEmployees.some(e => e.id === selectedEmpId))) {
      setSelectedEmpId(accessibleEmployees[0].id);
    }
  }, [activeRole, accessibleEmployees, isEmployee]);

  // When user switches employee persona, reset pending photo
  useEffect(() => {
    setCapturedPhoto(null);
    setGeoVerifiedDetails(null);
  }, [selectedEmpId]);

  // When GPS Geo-Fence is selected, automatically trigger the camera
  const handleSelectScanMethod = (method: string) => {
    setClockMethod(method);
    if (method === 'GPS') {
      setIsCameraModalOpen(true);
    }
  };

  const handlePhotoUploaded = (photoUrl: string, locationData: { coordinates: string; accuracy: string; address: string }) => {
    setCapturedPhoto(photoUrl);
    setGeoVerifiedDetails(locationData);
    setMockLocation(`${locationData.address} (${locationData.coordinates})`);
  };

  const handleClockIn = () => {
    if (!selectedEmpId) return;
    const loc = clockMethod === 'GPS' ? mockLocation : undefined;
    clockIn(selectedEmpId, clockMethod === 'GPS' ? 'GPS Geo-Fence' : clockMethod, loc, capturedPhoto || undefined);
    setCapturedPhoto(null);
    setGeoVerifiedDetails(null);
  };

  const handleClockOut = () => {
    if (!selectedEmpId) return;
    clockOut(selectedEmpId);
  };

  const getEmployeeName = (id: string) => {
    return employees.find(e => e.id === id)?.name || id;
  };

  const getEmployeeObj = (id: string) => {
    return employees.find(e => e.id === id);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const isClockedInToday = (empId: string) => {
    const rec = attendance.find(a => a.employeeId === empId && a.date === todayStr);
    return rec ? !!rec.checkIn : false;
  };

  const isClockedOutToday = (empId: string) => {
    const rec = attendance.find(a => a.employeeId === empId && a.date === todayStr);
    return rec ? !!rec.checkOut : false;
  };

  const currentSelectedEmployee = getEmployeeObj(selectedEmpId);

  // Filtered attendance logs
  const filteredLogs = accessibleAttendance.filter(log => {
    const empName = getEmployeeName(log.employeeId).toLowerCase();
    const empId = log.employeeId.toLowerCase();
    const dateStr = log.date;
    const matchesSearch = empName.includes(searchTerm.toLowerCase()) || 
                          empId.includes(searchTerm.toLowerCase()) ||
                          dateStr.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* View Header */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Attendance Console</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
          Simulate biometric logs, RFID clock-ins, live camera GPS geo-fencing, and view the monthly digital attendance register.
        </p>
      </div>

      {/* Console Grid */}
      <div className="grid-2" style={{ gridTemplateColumns: '1.1fr 1.9fr', alignItems: 'stretch', gap: '24px' }}>
        
        {/* Hardware / Gateway Simulator Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '18px', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Terminal Simulator</h3>
              <span className="badge badge-success" style={{ gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }}></span>
                ONLINE
              </span>
            </div>

            {/* Glowing Digital Time Display */}
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
              color: '#38bdf8',
              padding: '16px',
              borderRadius: '12px',
              textAlign: 'center',
              fontFamily: 'monospace',
              fontSize: '28px',
              fontWeight: 800,
              letterSpacing: '3px',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.1)',
              marginBottom: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px' }}>Live Gateway Time</span>
              {time}
            </div>

            {/* Simulated hardware form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Select Employee Persona</label>
                <select 
                  value={selectedEmpId} 
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  disabled={activeRole === 'Employee'}
                >
                  {accessibleEmployees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Scan Method</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button 
                    className={`btn ${clockMethod === 'Biometric' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ padding: '8px', fontSize: '12px' }}
                    onClick={() => handleSelectScanMethod('Biometric')}
                  >
                    <Fingerprint size={14} /> Fingerprint
                  </button>
                  <button 
                    className={`btn ${clockMethod === 'GPS' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ 
                      padding: '8px', 
                      fontSize: '12px',
                      boxShadow: clockMethod === 'GPS' ? '0 0 12px rgba(99, 102, 241, 0.4)' : 'none'
                    }}
                    onClick={() => handleSelectScanMethod('GPS')}
                  >
                    <MapPin size={14} /> GPS Geo-Fence
                  </button>
                  <button 
                    className={`btn ${clockMethod === 'RFID' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ padding: '8px', fontSize: '12px' }}
                    onClick={() => handleSelectScanMethod('RFID')}
                  >
                    <KeyRound size={14} /> RFID Card
                  </button>
                  <button 
                    className={`btn ${clockMethod === 'QR Code' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ padding: '8px', fontSize: '12px' }}
                    onClick={() => handleSelectScanMethod('QR Code')}
                  >
                    <ScanLine size={14} /> QR Scanner
                  </button>
                </div>
              </div>

              {/* GPS Geo-Fence & Camera Verification Area */}
              {clockMethod === 'GPS' && (
                <div style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color-solid)',
                  borderRadius: '10px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  animation: 'fadeIn 0.2s ease-in-out'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} style={{ color: '#06b6d4' }} />
                      GPS Geo-Fence & Camera
                    </label>
                    <span className="badge badge-success" style={{ fontSize: '10px', padding: '2px 6px' }}>
                      Active Zone
                    </span>
                  </div>

                  <input 
                    type="text" 
                    value={mockLocation} 
                    onChange={(e) => setMockLocation(e.target.value)} 
                    placeholder="Enter Latitude/Longitude or City"
                    style={{ fontSize: '12px', padding: '8px 10px' }}
                  />

                  {/* Uploaded / Captured Selfie Preview */}
                  {capturedPhoto ? (
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.08)',
                      border: '1.5px solid var(--success)',
                      borderRadius: '8px',
                      padding: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: '1px solid var(--success)',
                        background: '#090d16'
                      }}>
                        <img 
                          src={capturedPhoto} 
                          alt="Captured Selfie" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>
                      <div style={{ flexGrow: 1, overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--success)', fontWeight: 700, fontSize: '12px' }}>
                          <CheckCircle2 size={14} /> Selfie & Geotag Attached
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {geoVerifiedDetails ? `${geoVerifiedDetails.coordinates}` : 'Verified within perimeter'}
                        </div>
                        <button
                          type="button"
                          className="btn btn-outline"
                          style={{ padding: '2px 8px', fontSize: '10px', marginTop: '4px', height: 'auto' }}
                          onClick={() => setIsCameraModalOpen(true)}
                        >
                          <RefreshCw size={10} /> Retake Photo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{
                          padding: '9px 12px',
                          fontSize: '12px',
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 12px rgba(6, 182, 212, 0.25)'
                        }}
                        onClick={() => setIsCameraModalOpen(true)}
                      >
                        <Camera size={16} /> Open Camera & Click Picture
                      </button>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
                        Clicking opens live camera with biometric geotag watermark.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Trigger Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            <button 
              className="btn btn-primary" 
              style={{ 
                padding: '12px', 
                background: isClockedInToday(selectedEmpId) ? 'var(--bg-secondary)' : 'var(--success)', 
                color: isClockedInToday(selectedEmpId) ? 'var(--text-muted)' : 'white', 
                fontWeight: 700,
                border: isClockedInToday(selectedEmpId) ? '1px solid var(--border-color-solid)' : 'none'
              }}
              onClick={handleClockIn}
              disabled={isClockedInToday(selectedEmpId)}
            >
              <CheckCircle size={18} />
              {isClockedInToday(selectedEmpId) ? 'Already Clocked In Today' : 'Simulate Clock In'}
            </button>
            
            <button 
              className="btn btn-outline" 
              style={{ padding: '12px', borderColor: 'var(--danger)', color: 'var(--danger)', fontWeight: 700 }}
              onClick={handleClockOut}
              disabled={!isClockedInToday(selectedEmpId) || isClockedOutToday(selectedEmpId)}
            >
              <XCircle size={18} />
              {isClockedOutToday(selectedEmpId) 
                ? 'Already Clocked Out Today' 
                : !isClockedInToday(selectedEmpId)
                  ? 'Must Clock In First'
                  : 'Simulate Clock Out'}
            </button>
          </div>
        </div>

        {/* Database Logs Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Digital Attendance Register</h3>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Live clock-in events with geotag & selfie photo verifications
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                placeholder="Search Employee / Date..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '180px', padding: '6px 12px', fontSize: '12px' }}
              />
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ width: '120px', padding: '6px 12px', fontSize: '12px' }}
              >
                <option value="All">All Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Leave">Leave</option>
                <option value="Holiday">Holiday</option>
                <option value="Weekly Off">Weekly Off</option>
              </select>
            </div>
          </div>

          {/* Logs Table */}
          <div style={{ overflowX: 'auto', maxHeight: '420px' }}>
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Worked</th>
                  <th>Method / Verification</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => {
                    const emp = getEmployeeObj(log.employeeId);
                    return (
                      <tr key={log.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: 'var(--primary-light)',
                              color: 'var(--primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              fontWeight: 700,
                              flexShrink: 0
                            }}>
                              {log.employeeId.slice(-3)}
                            </div>
                            <div>
                              <strong style={{ display: 'block', fontSize: '12px' }}>{getEmployeeName(log.employeeId)}</strong>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{log.employeeId}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ whiteSpace: 'nowrap', fontSize: '12px' }}>{log.date}</td>
                        <td style={{ color: log.lateArrival ? 'var(--warning)' : 'inherit', fontSize: '12px' }}>
                          {log.checkIn || '-'}
                          {log.lateArrival && <span style={{ fontSize: '9px', display: 'block', color: 'var(--warning)', fontWeight: 700 }}>LATE</span>}
                        </td>
                        <td style={{ color: log.earlyLeaving ? 'var(--warning)' : 'inherit', fontSize: '12px' }}>
                          {log.checkOut || '-'}
                          {log.earlyLeaving && <span style={{ fontSize: '9px', display: 'block', color: 'var(--warning)', fontWeight: 700 }}>EARLY LEAVE</span>}
                        </td>
                        <td style={{ fontSize: '12px' }}>{log.workingHours ? `${log.workingHours}h` : '-'}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            {/* Method Badge */}
                            <span style={{
                              fontSize: '11px',
                              color: 'var(--text-secondary)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: 'var(--bg-secondary)',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color-solid)'
                            }}>
                              {log.method?.includes('GPS') ? <MapPin size={11} style={{ color: '#06b6d4' }} /> :
                               log.method?.includes('RFID') ? <KeyRound size={11} style={{ color: '#f59e0b' }} /> :
                               log.method?.includes('QR') ? <ScanLine size={11} style={{ color: '#8b5cf6' }} /> :
                               <Fingerprint size={11} style={{ color: '#10b981' }} />}
                              {log.method || 'Biometric'}
                            </span>

                            {/* Clickable Photo Preview / Badge if available */}
                            {log.photo ? (
                              <button
                                className="btn btn-outline"
                                style={{
                                  padding: '2px 8px',
                                  fontSize: '11px',
                                  height: 'auto',
                                  color: 'var(--success)',
                                  borderColor: 'var(--success)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                                onClick={() => setViewingRecord(log)}
                                title="View Verified Photo & Geotag"
                              >
                                <Camera size={12} />
                                Photo Verified
                              </button>
                            ) : log.method?.includes('GPS') ? (
                              <button
                                className="btn btn-outline"
                                style={{
                                  padding: '2px 6px',
                                  fontSize: '10px',
                                  height: 'auto',
                                  color: 'var(--primary)',
                                  borderColor: 'var(--border-color-solid)'
                                }}
                                onClick={() => setViewingRecord(log)}
                                title="View Geo Details"
                              >
                                <Eye size={11} /> Geo Tag
                              </button>
                            ) : null}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${
                            log.status === 'Present' || log.status === 'WFH' ? 'badge-success' :
                            log.status === 'Absent' ? 'badge-danger' :
                            log.status === 'Leave' ? 'badge-warning' : 'badge-info'
                          }`} style={{ fontSize: '11px' }}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Live Camera Capture Modal */}
      {isCameraModalOpen && (
        <CameraCaptureModal
          isOpen={isCameraModalOpen}
          onClose={() => setIsCameraModalOpen(false)}
          employeeName={currentSelectedEmployee?.name || 'Employee'}
          employeeId={selectedEmpId}
          currentLocation={mockLocation}
          onPhotoUploaded={handlePhotoUploaded}
        />
      )}

      {/* Photo & Geotag Verification Details Modal */}
      {viewingRecord && (
        <PhotoVerificationModal
          record={viewingRecord}
          employee={getEmployeeObj(viewingRecord.employeeId)}
          onClose={() => setViewingRecord(null)}
        />
      )}

    </div>
  );
};
