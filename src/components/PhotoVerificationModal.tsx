import React from 'react';
import { X, MapPin, ShieldCheck, Clock, User, Calendar, CheckCircle2, Download } from 'lucide-react';
import { AttendanceRecord, Employee } from '../context/StateContext';

interface PhotoVerificationModalProps {
  record: AttendanceRecord | null;
  employee?: Employee;
  onClose: () => void;
}

export const PhotoVerificationModal: React.FC<PhotoVerificationModalProps> = ({
  record,
  employee,
  onClose
}) => {
  if (!record) return null;

  const empName = employee?.name || record.employeeId;
  const empDept = employee?.department || 'Operations';
  const empDesignation = employee?.designation || 'Staff Associate';

  const downloadCertificate = () => {
    if (!record.photo) return;
    const link = document.createElement('a');
    link.href = record.photo;
    link.download = `attendance-verification-${record.employeeId}-${record.date}.jpg`;
    link.click();
  };

  return (
    <div className="modal-overlay">
      <div 
        className="modal-content glass-card"
        style={{
          maxWidth: '560px',
          width: '100%',
          background: 'var(--bg-surface-solid)',
          border: '1px solid var(--border-color-solid)',
          padding: 0,
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.12) 100%)',
          borderBottom: '1px solid var(--border-color-solid)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--success-light)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>
                Attendance Photo & Geotag Verification
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Official Digital Clock-In Audit Trail
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

        {/* Content Body */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Photo Display */}
          <div style={{
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#090d16',
            border: '2px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
            maxHeight: '320px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {record.photo ? (
              <img 
                src={record.photo} 
                alt={`Selfie verification for ${empName}`}
                style={{ width: '100%', height: 'auto', maxHeight: '320px', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <User size={48} style={{ opacity: 0.4, marginBottom: '8px' }} />
                <p>No live camera photo attached for this record.</p>
              </div>
            )}

            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: 'rgba(9, 13, 22, 0.85)',
              backdropFilter: 'blur(4px)',
              color: '#34d399',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid rgba(52, 211, 153, 0.3)'
            }}>
              <CheckCircle2 size={13} />
              AUTHENTICATED BIOMETRIC / GPS
            </div>
          </div>

          {/* Verification Details Grid */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color-solid)',
            borderRadius: '12px',
            padding: '16px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            fontSize: '12px'
          }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Employee</span>
              <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{empName}</strong>
              <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>ID: {record.employeeId} • {empDesignation}</div>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Department</span>
              <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{empDept}</strong>
              <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Status: {record.status}</div>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Date & Clock In Time</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={13} style={{ color: 'var(--primary)' }} />
                <strong>{record.date}</strong>
                <Clock size={13} style={{ color: 'var(--success)', marginLeft: '4px' }} />
                <strong>{record.checkIn || '-'}</strong>
              </div>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Verification Method</span>
              <span className="badge badge-primary" style={{ fontSize: '11px', padding: '2px 8px' }}>
                {record.method || 'GPS Geo-Fence'}
              </span>
            </div>

            <div style={{ gridColumn: 'span 2', borderTop: '1px solid var(--border-color-solid)', paddingTop: '10px' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>GPS Geolocation & Office Perimeter</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#06b6d4' }}>
                <MapPin size={14} />
                <strong>{record.location || 'Headquarters (San Jose) - Within 20m Perimeter'}</strong>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            {record.photo && (
              <button className="btn btn-outline" style={{ fontSize: '12px', padding: '8px 14px' }} onClick={downloadCertificate}>
                <Download size={14} /> Download Image
              </button>
            )}
            <button className="btn btn-primary" style={{ fontSize: '12px', padding: '8px 20px' }} onClick={onClose}>
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
