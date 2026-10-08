# Gnosis Ventures - Payroll & Attendance Portal

A React and Vite payroll and attendance demo. The application stores its data in the browser's `localStorage`; it does not require PostgreSQL, a database server, or an API server.

## Run locally

1. Install Node.js 20 or newer.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the app:
   ```bash
   npm run dev
   ```
4. On the sign-in screen, enter a display email, select a demo role, and sign in. No password or API is required.

Employees, attendance, shifts, leave requests, holidays, loans, payroll, company settings, theme, and the selected demo session are saved in this browser under `payroll-attendance:v1`. Data stays on this device and browser profile; it does not sync between devices. Clearing site data or browser storage removes it. Use **Settings > Role Access Matrix** for the available demo roles.

## Important security limitation

This is local demo storage, **not secure authentication or a production database**. Anyone with access to this browser profile can inspect or change stored data and choose any demo role. Do not enter real employee, identity, bank, attendance, or salary information. Use a secured server-side API and database before using real payroll data.

## Build

```bash
npm run build
```

GitHub Pages can host the static demo; each viewer has a separate browser-local copy of its data.

## Database

Run the database setup script to create a local SQLite database for payroll and attendance records:

`ash
npm run db:init
`

This creates database/payroll_attendance.db with tables for companies, employees, attendance, leave requests, holidays, loans, payroll runs, and audit logs.

## PostgreSQL schema

For a server-backed database, run the PostgreSQL schema script:

`ash
npm run db:postgres
`

This creates the database objects for companies, employees, attendance, leave requests, holidays, loans, payroll runs, and audit logs in PostgreSQL.
