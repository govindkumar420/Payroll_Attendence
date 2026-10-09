import { useState } from "react";
import { useAppState } from "../context/StateContext";
import { CompanyLogo } from "./CompanyLogo";
import { ArrowRight, HardDrive } from "lucide-react";

const DEMO_ROLES = [
  "Super Admin",
  "HR Manager",
  "Payroll Manager",
  "Department Manager",
  "Accountant",
  "Employee",
];

export const LoginScreen = () => {
  const { login, storageError } = useAppState();
  const [email, setEmail] = useState("admin@nexapay.com");
  const [role, setRole] = useState("Super Admin");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      login(email, role);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(ellipse at center, #0c2549 0%, #040e1c 100%)",
      padding: "24px",
    }}>
      <section className="glass-card" style={{
        maxWidth: "460px",
        width: "100%",
        padding: "36px 32px",
        borderRadius: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}>
        <header style={{ textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "white", padding: "12px 20px", borderRadius: "16px", boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)" }}>
            <CompanyLogo size="lg" />
          </div>
          <h1 style={{ fontSize: "20px", fontWeight: 900, marginTop: "14px" }}>NEXAPAY</h1>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            PAYROLL MANAGEMENT SYSTEM
          </p>
        </header>

        {error && (
          <div role="alert" style={{
            color: "var(--danger)",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid var(--danger)",
            borderRadius: "8px",
            padding: "10px 14px",
            fontSize: "12px",
          }}>
            {error}
          </div>
        )}

        <div role="note" style={{
          color: "var(--warning)",
          background: "rgba(245, 158, 11, 0.1)",
          border: "1px solid var(--warning)",
          borderRadius: "8px",
          padding: "10px 14px",
          fontSize: "12px",
        }}>
          Local demo mode: data is stored only in this browser. This is not secure authentication; do not enter real payroll or personal data.
        </div>

        {storageError && (
          <div role="alert" style={{ color: "var(--danger)", fontSize: "12px" }}>{storageError}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600 }}>
            Display email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              maxLength={254}
              style={{ marginTop: "6px" }}
            />
          </label>
          <label style={{ fontSize: "12px", fontWeight: 600 }}>
            Demo role
            <select value={role} onChange={(event) => setRole(event.target.value)} style={{ marginTop: "6px" }}>
              {DEMO_ROLES.map((demoRole) => <option key={demoRole} value={demoRole}>{demoRole}</option>)}
            </select>
          </label>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{ padding: "12px", fontSize: "14px", fontWeight: 800, marginTop: "8px" }}
          >
            {isSubmitting ? "Signing in..." : "Sign In"} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{
          textAlign: "center",
          fontSize: "11px",
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
        }}>
          <HardDrive size={14} style={{ color: "var(--primary)" }} />
          <span>Browser local storage · no server required</span>
        </div>
      </section>
    </main>
  );
};
