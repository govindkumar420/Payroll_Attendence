CREATE TABLE IF NOT EXISTS companies (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  address TEXT,
  tagline VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employees (
  id VARCHAR(50) PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  role VARCHAR(80) NOT NULL,
  department VARCHAR(100),
  shift_id VARCHAR(30),
  manager_id VARCHAR(50),
  status VARCHAR(30) NOT NULL DEFAULT 'Active',
  joining_date DATE,
  base_salary NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_employees_manager FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS attendance (
  id BIGSERIAL PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL,
  attendance_date DATE NOT NULL,
  check_in TIME,
  check_out TIME,
  shift_name VARCHAR(80),
  status VARCHAR(30) NOT NULL DEFAULT 'Present',
  total_hours NUMERIC(5,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS leave_requests (
  id BIGSERIAL PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL,
  leave_type VARCHAR(80) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_leave_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS holidays (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  holiday_date DATE NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'Public',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loans (
  id BIGSERIAL PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  monthly_installment NUMERIC(12,2) NOT NULL,
  outstanding_balance NUMERIC(12,2) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_loans_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payroll_runs (
  id BIGSERIAL PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  basic_salary NUMERIC(12,2) NOT NULL,
  overtime NUMERIC(12,2) NOT NULL DEFAULT 0,
  deductions NUMERIC(12,2) NOT NULL DEFAULT 0,
  net_pay NUMERIC(12,2) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Generated',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_payroll_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  employee_id VARCHAR(50),
  action VARCHAR(200) NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_audit_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_role ON employees(role);
CREATE INDEX IF NOT EXISTS idx_attendance_employee_date ON attendance(employee_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_leave_requests_employee ON leave_requests(employee_id, start_date);
CREATE INDEX IF NOT EXISTS idx_payroll_runs_employee ON payroll_runs(employee_id, period_end);

INSERT INTO companies (name, address, tagline)
VALUES ('Gnosis Ventures', 'Bengaluru, India', 'Payroll & Attendance Operations')
ON CONFLICT DO NOTHING;

INSERT INTO employees (id, code, name, email, role, department, shift_id, manager_id, status, joining_date, base_salary)
VALUES
  ('EMP-1001', '2001', 'Aisha Patel', 'aisha@gnosisventures.com', 'Super Admin', 'Operations', 'S1', NULL, 'Active', '2023-01-10', 220000),
  ('EMP-1002', '2002', 'Rohan Mehta', 'rohan@gnosisventures.com', 'HR Manager', 'Human Resources', 'S2', 'EMP-1001', 'Active', '2023-03-18', 180000),
  ('EMP-1003', '2003', 'Nisha Rao', 'nisha@gnosisventures.com', 'Employee', 'Engineering', 'S3', 'EMP-1002', 'Active', '2024-02-12', 140000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO attendance (employee_id, attendance_date, check_in, check_out, shift_name, status, total_hours, notes)
VALUES ('EMP-1001', '2026-10-08', '09:00:00', '17:15:00', 'Morning Shift', 'Present', 8.25, 'On time')
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason, status)
VALUES ('EMP-1003', 'Annual Leave', '2026-10-12', '2026-10-14', 'Family visit', 'Pending')
ON CONFLICT DO NOTHING;

INSERT INTO holidays (name, holiday_date, type)
VALUES ('Diwali', '2026-11-02', 'Public')
ON CONFLICT DO NOTHING;

INSERT INTO loans (employee_id, amount, monthly_installment, outstanding_balance, status)
VALUES ('EMP-1003', 150000, 12000, 90000, 'Active')
ON CONFLICT DO NOTHING;

INSERT INTO payroll_runs (employee_id, period_start, period_end, basic_salary, overtime, deductions, net_pay, status)
VALUES ('EMP-1003', '2026-09-01', '2026-09-30', 140000, 15000, 2500, 152500, 'Generated')
ON CONFLICT DO NOTHING;

INSERT INTO audit_logs (employee_id, action, details)
VALUES ('EMP-1001', 'Database Initialised', 'PostgreSQL database was created for the payroll attendance portal.')
ON CONFLICT DO NOTHING;
