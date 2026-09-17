import React, { useState } from 'react';
import { useAppState, Shift, Employee } from '../context/StateContext';
import { Clock, Plus, Users, ShieldAlert, Award, Calendar, Check, Sparkles } from 'lucide-react';
import { Holidays } from './Holidays';
import { Overtime } from './Overtime';
import { getPermissions, EMPLOYEE_PERSONA_ID, MANAGER_DEPARTMENT } from '../utils/permissions';

export const Shifts: React.FC = () => {
  const { shifts, employees, activeRole, addShift, updateEmployee } = useAppState();
  const permissions = getPermissions(activeRole);

  const [activeSubTab, setActiveSubTab] = useState<'shifts' | 'holidays' | 'overtime'>('shifts');
  const [showModal, setShowModal] = useState(false);
  const [shiftName, setShiftName] = useState('');
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('17:00');
  const [breakMins, setBreakMins] = useState(45);
  const [graceMins, setGraceMins] = useState(15);
  const [weeklyOffDay, setWeeklyOffDay] = useState('Sunday');

  const canModifyShift = permissions.shiftManagement === 'Full' || permissions.shiftManagement === 'Manage';
  const isEmployee = activeRole === 'Employee';

  // Handle new shift submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canModifyShift) return;

    const newShift: Shift = {
      id: `S${shifts.length + 1}`,
      name: shiftName,
      startTime: start,
      endTime: end,
      breakTime: Number(breakMins),
      gracePeriod: Number(graceMins),
      weeklyOff: weeklyOffDay
    };

    addShift(newShift);
    setShowModal(false);
    setShiftName('');
  };

  // Re-assign shift to employee
  const handleAssignShift = (empId: string, sId: string) => {
    if (!canModifyShift) return;
    const emp = employees.find(e => e.id === empId);
    if (emp) {
      updateEmployee({
        ...emp,
        shiftId: sId
      });
    }
  };

  // Filter employee roster for shift assignments
  const visibleEmployees = isEmployee 
    ? employees.filter(e => e.id === EMPLOYEE_PERSONA_ID) 
    : permissions.employeeManagement === 'Team' 
      ? employees.filter(e => e.department === MANAGER_DEPARTMENT) 
      : employees;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Subtab Navigation for Shift, Holiday, and Overtime */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <button
            className={`btn ${activeSubTab === 'shifts' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveSubTab('shifts')}
            style={{ fontSize: '12px', padding: '6px 16px', borderRadius: '8px', border: activeSubTab === 'shifts' ? 'none' : 'transparent' }}
          >
            <Clock size={14} /> Shift Policies & Rosters
          </button>
          
          <button
            className={`btn ${activeSubTab === 'holidays' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveSubTab('holidays')}
            style={{ fontSize: '12px', padding: '6px 16px', borderRadius: '8px', border: activeSubTab === 'holidays' ? 'none' : 'transparent' }}
          >
            <Calendar size={14} /> Holiday Calendar
          </button>

          <button
            className={`btn ${activeSubTab === 'overtime' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveSubTab('overtime')}
            style={{ fontSize: '12px', padding: '6px 16px', borderRadius: '8px', border: activeSubTab === 'overtime' ? 'none' : 'transparent' }}
          >
            <Award size={14} /> Overtime Ledger
          </button>
        </div>

        {activeSubTab === 'shifts' && canModifyShift && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Add New Shift Policy
          </button>
        )}
      </div>

      {/* Render Selected SubTab */}
      {activeSubTab === 'holidays' && <Holidays />}
      {activeSubTab === 'overtime' && <Overtime />}

      {activeSubTab === 'shifts' && (
        <div className="grid-2" style={{ gridTemplateColumns: isEmployee ? '1fr 1fr' : '2fr 3fr' }}>
          
          {/* Active Shift Policies */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Active Shift Policies</h3>
              <span className="badge badge-info">{shifts.length} Defined</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {shifts.map(shift => {
                const count = employees.filter(e => e.shiftId === shift.id).length;
                
                return (
                  <div key={shift.id} style={{ 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '12px', 
                    padding: '16px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '12px',
                    background: 'var(--bg-secondary)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--primary)' }}>{shift.name}</span>
                      <span className="badge badge-info" style={{ gap: '4px' }}>
                        <Users size={12} /> {count} {count === 1 ? 'Employee' : 'Employees'}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Work Hours:</span> 
                        <span style={{ fontWeight: 600, display: 'block', color: 'var(--text-primary)' }}>{shift.startTime} - {shift.endTime}</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Break Time:</span> 
                        <span style={{ fontWeight: 600, display: 'block', color: 'var(--text-primary)' }}>{shift.breakTime} mins</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Grace Period:</span> 
                        <span style={{ fontWeight: 600, display: 'block', color: 'var(--text-primary)' }}>{shift.gracePeriod} mins</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Weekly Off:</span> 
                        <span style={{ fontWeight: 600, display: 'block', color: 'var(--text-primary)' }}>{shift.weeklyOff}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Employee Roster Planner */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>
                {isEmployee ? 'My Assigned Shift Schedule' : 'Employee Shift Roster'}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {isEmployee 
                  ? 'Your active working hours and grace period for biometric punch-ins.' 
                  : 'Assign shifts to employees. Late arrival penalties and grace periods calculate automatically.'}
              </p>
            </div>

            <div style={{ overflowX: 'auto', maxHeight: '550px' }}>
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Current Shift</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleEmployees.map(emp => (
                    <tr key={emp.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img 
                            src={emp.photoUrl} 
                            alt={emp.name} 
                            style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <span style={{ fontWeight: 600, display: 'block' }}>{emp.name}</span>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{emp.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>{emp.department}</td>
                      <td>
                        {canModifyShift ? (
                          <select 
                            value={emp.shiftId} 
                            onChange={(e) => handleAssignShift(emp.id, e.target.value)}
                            style={{ fontSize: '12px', padding: '4px 8px' }}
                          >
                            {shifts.map(s => (
                              <option key={s.id} value={s.id}>{s.name} ({s.startTime}-{s.endTime})</option>
                            ))}
                          </select>
                        ) : (
                          <span className="badge badge-primary" style={{ fontWeight: 600 }}>
                            {shifts.find(s => s.id === emp.shiftId)?.name || 'General Shift'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Add Shift Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '450px', background: 'var(--bg-secondary)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Create New Shift Policy</h3>
              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-primary)' }} onClick={() => setShowModal(false)}>Close</button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Shift Policy Name</label>
                <input 
                  type="text" 
                  required 
                  value={shiftName} 
                  onChange={(e) => setShiftName(e.target.value)} 
                  placeholder="e.g. Weekend Shift, Night Shift"
                />
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Start Time</label>
                  <input type="time" required value={start} onChange={(e) => setStart(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>End Time</label>
                  <input type="time" required value={end} onChange={(e) => setEnd(e.target.value)} />
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Break Time (Minutes)</label>
                  <input type="number" required value={breakMins} onChange={(e) => setBreakMins(Number(e.target.value))} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Grace Period (Minutes)</label>
                  <input type="number" required value={graceMins} onChange={(e) => setGraceMins(Number(e.target.value))} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Weekly Off Day</label>
                <select value={weeklyOffDay} onChange={(e) => setWeeklyOffDay(e.target.value)}>
                  <option value="Sunday">Sunday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Monday">Monday</option>
                  <option value="No Weekly Off">No Weekly Off</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Policy</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Shifts;
