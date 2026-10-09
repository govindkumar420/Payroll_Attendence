import { ShieldCheck } from "lucide-react";

const ROLE_SCOPES = [
  ["Super Admin", "Full system administration"],
  ["HR Manager", "Employee records, attendance, leaves, and shifts"],
  ["Payroll Manager", "Payroll preparation and salary processing"],
  ["Department Manager", "Team attendance and leave approvals"],
  ["Accountant", "Financial reports and bank disbursements"],
  ["Employee", "Personal attendance, leave requests, and payslips"],
];

export const RoleCredentialsCard = ({ fullScreen = false }) => (
  <section className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "16px", flexGrow: fullScreen ? 1 : "unset" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <ShieldCheck size={22} style={{ color: "var(--primary)" }} />
      <div>
        <h3 style={{ fontSize: "16px", fontWeight: 800, margin: 0 }}>Role Access Matrix</h3>
        <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
          Each account receives its role from the server. Passwords are never displayed here.
        </span>
      </div>
    </div>
    <div style={{ display: "grid", gap: "8px" }}>
      {ROLE_SCOPES.map(([role, scope]) => (
        <div key={role} style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "16px",
          padding: "10px 12px",
          border: "1px solid var(--border-color)",
          borderRadius: "8px",
          fontSize: "12px",
        }}>
          <strong>{role}</strong>
          <span style={{ color: "var(--text-secondary)", textAlign: "right" }}>{scope}</span>
        </div>
      ))}
    </div>
  </section>
);
