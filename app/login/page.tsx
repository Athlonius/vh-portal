"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/components/AuthContext";

export default function LoginPage() {
  const { login, user, ready } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace("/");
  }, [ready, user, router]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = login(email.trim(), password);
    if (ok) {
      router.replace("/");
    } else {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0F172A",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background radial glow */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(59,130,246,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60,
            background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
            borderRadius: 16, display: "inline-flex", alignItems: "center",
            justifyContent: "center", fontWeight: 900, fontSize: 24,
            color: "#fff", letterSpacing: "-1px", marginBottom: 16,
            boxShadow: "0 0 40px rgba(59,130,246,0.25)",
          }}>
            VH
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.5px" }}>
            VH Portal
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: 14, color: "#64748B" }}>
            DMC Operations — Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "#1E293B",
          border: "1px solid #334155",
          borderRadius: 16,
          padding: "32px 32px 28px",
          boxShadow: "0 32px 64px rgba(0,0,0,0.4)",
        }}>
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: "block", fontSize: 12, fontWeight: 600, color: "#94A3B8",
                textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8,
              }}>
                Email address
              </label>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="you@vh-portal.ge"
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "#0F172A", border: "1px solid #334155",
                  borderRadius: 8, color: "#F8FAFC", fontSize: 14,
                  padding: "12px 14px", outline: "none", colorScheme: "dark",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => e.target.style.borderColor = "#3B82F6"}
                onBlur={(e) => e.target.style.borderColor = "#334155"}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: "block", fontSize: 12, fontWeight: 600, color: "#94A3B8",
                textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8,
              }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "#0F172A", border: "1px solid #334155",
                    borderRadius: 8, color: "#F8FAFC", fontSize: 14,
                    padding: "12px 44px 12px 14px", outline: "none", colorScheme: "dark",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3B82F6"}
                  onBlur={(e) => e.target.style.borderColor = "#334155"}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  tabIndex={-1}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "#475569", display: "flex", alignItems: "center", padding: 2,
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: "#3B0F0F", border: "1px solid #7F1D1D",
                borderRadius: 8, padding: "10px 14px", marginBottom: 20,
                fontSize: 13, color: "#FCA5A5",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>⚠</span>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "13px", borderRadius: 8, border: "none",
                background: "#2563EB",
                color: "#fff", fontSize: 15, fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.01em",
                opacity: loading ? 0.75 : 1,
                transition: "opacity 0.15s",
              }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "#1E293B" }}>
          VH Portal Operations © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
