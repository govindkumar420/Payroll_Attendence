import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sqlite3 from 'sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'payroll_attendance.db');
const schemaPath = path.join(__dirname, 'schema.sql');

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new sqlite3.Database(dbPath);

const executeSql = (sql) => new Promise((resolve, reject) => {
  db.exec(sql, (error) => {
    if (error) {
      reject(error);
      return;
    }
    resolve();
  });
});

const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function onRun(error) {
    if (error) {
      reject(error);
      return;
    }
    resolve(this);
  });
});

const seedData = async () => {
  await run("INSERT INTO companies (name, address, tagline) VALUES (?, ?, ?)", [
    'Gnosis Ventures',
    'Bengaluru, India',
    'Payroll & Attendance Operations'
  ]);

  await run(
    "INSERT INTO employees (id, code, name, email, role, department, shift_id, manager_id, status, joining_date, base_salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    ['EMP-1001', '2001', 'Aisha Patel', 'aisha@gnosisventures.com', 'Super Admin', 'Operations', 'S1', null, 'Active', '2023-01-10', 220000]
  );

  await run(
    "INSERT INTO employees (id, code, name, email, role, department, shift_id, manager_id, status, joining_date, base_salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    ['EMP-1002', '2002', 'Rohan Mehta', 'rohan@gnosisventures.com', 'HR Manager', 'Human Resources', 'S2', 'EMP-1001', 'Active', '2023-03-18', 180000]
  );

  await run(
    "INSERT INTO employees (id, code, name, email, role, department, shift_id, manager_id, status, joining_date, base_salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    ['EMP-1003', '2003', 'Nisha Rao', 'nisha@gnosisventures.com', 'Employee', 'Engineering', 'S3', 'EMP-1002', 'Active', '2024-02-12', 140000]
  );

  await run("INSERT INTO attendance (employee_id, attendance_date, check_in, check_out, shift_name, status, total_hours, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
    'EMP-1001',
    '2026-10-08',
    '09:00',
    '17:15',
    'Morning Shift',
    'Present',
    8.25,
    'On time'
  ]);

  await run("INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?, ?)", [
    'EMP-1003',
    'Annual Leave',
    '2026-10-12',
    '2026-10-14',
    'Family visit',
    'Pending'
  ]);

  await run("INSERT INTO holidays (name, holiday_date, type) VALUES (?, ?, ?)", ['Diwali', '2026-11-02', 'Public']);

  await run("INSERT INTO loans (employee_id, amount, monthly_installment, outstanding_balance, status) VALUES (?, ?, ?, ?, ?)", [
    'EMP-1003',
    150000,
    12000,
    90000,
    'Active'
  ]);

  await run("INSERT INTO payroll_runs (employee_id, period_start, period_end, basic_salary, overtime, deductions, net_pay, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
    'EMP-1003',
    '2026-09-01',
    '2026-09-30',
    140000,
    15000,
    2500,
    152500,
    'Generated'
  ]);

  await run("INSERT INTO audit_logs (employee_id, action, details) VALUES (?, ?, ?)", ['EMP-1001', 'Database Initialised', 'SQLite database was created for the payroll attendance portal.']);
};

try {
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  await executeSql(schemaSql);
  await seedData();
  console.log(`Database created successfully at ${dbPath}`);
} catch (error) {
  console.error('Database creation failed:', error.message);
  process.exitCode = 1;
} finally {
  db.close();
}