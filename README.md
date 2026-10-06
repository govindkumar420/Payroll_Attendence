
# 🏢 Riddhi Siddhi Enterprises - Payroll & Attendance Portal

A comprehensive, enterprise-grade Attendance and Payroll Management System built with **React**, **TypeScript**, **Vite**, and styled with custom glassmorphism dark/light mode.

🌐 **Live Demo on GitHub Pages**: [https://govindkumar420.github.io/Payroll_Attendence/](https://govindkumar420.github.io/Payroll_Attendence/)

---

## ✨ Features

- 👥 **Multi-Role Access Control (RBAC)**:
  - Super Admin (Shejal)
  - HR Manager (Hiralben)
  - Payroll Manager (Parth)
  - Department Manager (Manas)
  - Accountant
  - Employee Persona (Pushprajsinh Vaghela)
- ⏱️ **Attendance Tracking & Terminal**: Live camera capture, biometric simulation, daily check-in/out, logs, geolocation.
- 💰 **Automated Payroll Engine**: Salary computation, PF (12%), ESIC (0.75%), Professional Tax (PT), TDS deduction, overtime calculations.
- 🧾 **Salary Slips**: Professional printable payslips with company branding.
- 🏖️ **Leave & Advance Desk**: Apply leaves, loan requests, workflow approval pipelines.
- 📊 **Statutory & Bank Transfer Reports**: Form 16 / PF / ESIC reports and NEFT/RTGS bank disbursal sheets.
- 🎨 **Modern Dark & Light UI**: Responsive glassmorphic layout, customizable themes, persona switching, and credential inspector.

---

## 🔑 Default Login Credentials

| Role | User ID / Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin@riddhisiddhi.com` | `Admin@2026` |
| **HR Manager** | `hr@riddhisiddhi.com` | `Hr@2026` |
| **Payroll Manager** | `payroll@riddhisiddhi.com` | `Payroll@2026` |
| **Department Manager** | `manager@riddhisiddhi.com` | `Manager@2026` |
| **Accountant** | `accountant@riddhisiddhi.com` | `Accountant@2026` |
| **Employee** | `EMP-200050` / `pushpraj.vaghela@riddhisiddhi.com` | `Emp@2026` |

---

## 🚀 Local Development

1. **Clone repository**:
   ```bash
   git clone https://github.com/govindkumar420/Payroll_Attendence.git
   cd Payroll_Attendence
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build production bundle**:
   ```bash
   npm run build
   ```

---

## ⚙️ GitHub Pages Setup

To enable GitHub Pages from GitHub Actions:
1. Go to your repository on GitHub: **Settings > Pages**
2. Under **Build and deployment > Source**, select **GitHub Actions**
3. On every push to `main`, the `.github/workflows/deploy.yml` workflow will automatically build and publish the live site.