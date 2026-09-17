import React, { useState } from 'react';
import { useAppState, Holiday } from '../context/StateContext';
import { Calendar, Plus, MapPin, Award, Trash2 } from 'lucide-react';

export const Holidays: React.FC = () => {
  const { holidays, activeRole, addHoliday } = useAppState();

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<'National' | 'Festival' | 'Company' | 'Optional'>('National');
  const [showForm, setShowForm] = useState(false);

  const canModify = activeRole === 'Super Admin' || activeRole === 'HR Manager';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date || !canModify) return;

    addHoliday({
      name,
      date,
      type
    });

    setName('');
    setDate('');
    setShowForm(false);
  };

  // Group holidays by month
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getHolidayMonth = (dateStr: string) => {
    const monthIndex = new Date(dateStr).getMonth();
    return months[monthIndex];
  };

  // Sort holidays chronologically
  const sortedHolidays = [...holidays].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Holiday Calendar</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Declare state/national, festival, and corporate holidays.
          </p>
        </div>
        
        {canModify && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={18} /> Declare Holiday
          </button>
        )}
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: showForm ? '1fr 1fr' : '1fr' }}>
        
        {/* Declare Form */}
        {showForm && canModify && (
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Declare Corporate Holiday</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Holiday Name</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Labor Day, Thanksgiving"
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Date</label>
                <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Holiday Type</label>
                <select value={type} onChange={(e) => setType(e.target.value as any)}>
                  <option value="National">National Holiday</option>
                  <option value="Festival">Festival Holiday</option>
                  <option value="Company">Company Holiday</option>
                  <option value="Optional">Optional Holiday</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Publish Holiday</button>
              </div>
            </form>
          </div>
        )}

        {/* Holiday Timeline list */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Calendar Schedule (2026)</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {sortedHolidays.map(hol => (
              <div key={hol.id} style={{ 
                border: '1px solid var(--border-color)', 
                borderRadius: '12px', 
                padding: '16px', 
                background: 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '10px', 
                  background: 'var(--primary-light)', 
                  color: 'var(--primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  lineHeight: '1.2'
                }}>
                  <span style={{ fontSize: '16px' }}>{new Date(hol.date).getDate()}</span>
                  <span>{getHolidayMonth(hol.date).substring(0, 3)}</span>
                </div>

                <div style={{ flexGrow: 1 }}>
                  <span style={{ fontWeight: 700, fontSize: '14px', display: 'block' }}>{hol.name}</span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                    <span className={`badge ${
                      hol.type === 'National' ? 'badge-danger' :
                      hol.type === 'Festival' ? 'badge-warning' :
                      hol.type === 'Company' ? 'badge-success' : 'badge-info'
                    }`} style={{ fontSize: '10px', padding: '2px 6px' }}>
                      {hol.type}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{hol.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
