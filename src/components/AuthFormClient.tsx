"use client";

import Link from "next/link";
import { useState } from "react";

type Mode = "login" | "register";

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "10px",
  letterSpacing: "2.5px",
  textTransform: "uppercase",
  color: "#9A8F82",
  marginBottom: "8px",
  fontWeight: 500,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "none",
  borderBottom: "1px solid rgba(28,25,23,0.18)",
  padding: "10px 0",
  fontSize: "14px",
  color: "#1C1917",
  outline: "none",
  background: "transparent",
  boxSizing: "border-box",
  fontFamily: "var(--font-jost)",
};

const btnStyle: React.CSSProperties = {
  width: "100%",
  background: "#1C1917",
  color: "#FAF8F4",
  border: "none",
  padding: "16px",
  fontSize: "11px",
  letterSpacing: "2.5px",
  textTransform: "uppercase",
  cursor: "pointer",
  fontWeight: 500,
  fontFamily: "var(--font-jost)",
  marginTop: "8px",
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function AuthFormClient({ mode }: { mode: Mode }) {
  const [clientError, setClientError] = useState("");

  function validateLogin(e: React.FormEvent<HTMLFormElement>) {
    setClientError("");
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    if (!email || !password) {
      e.preventDefault();
      setClientError("Email dan kata sandi wajib diisi");
      return;
    }
    if (!isValidEmail(email)) {
      e.preventDefault();
      setClientError("Format email tidak valid");
      return;
    }
  }

  function validateRegister(e: React.FormEvent<HTMLFormElement>) {
    setClientError("");
    const fd = new FormData(e.currentTarget);
    const firstName = String(fd.get("firstName") || "").trim();
    const lastName = String(fd.get("lastName") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const password = String(fd.get("password") || "");
    const confirmPassword = String(fd.get("confirmPassword") || "");

    if (!firstName || !lastName || !email || !phone || !password) {
      e.preventDefault();
      setClientError("Nama depan, nama belakang, email, WhatsApp, dan password wajib diisi");
      return;
    }
    if (!isValidEmail(email)) {
      e.preventDefault();
      setClientError("Format email tidak valid");
      return;
    }
    if (password.length < 8) {
      e.preventDefault();
      setClientError("Password minimal 8 karakter");
      return;
    }
    if (password !== confirmPassword) {
      e.preventDefault();
      setClientError("Konfirmasi password tidak cocok");
      return;
    }
  }

  if (mode === "login") {
    return (
      <form action="/api/auth/login" method="POST" onSubmit={validateLogin}>
        {clientError && (
          <div style={{ background: "#fff5f5", border: "1px solid #ffc5c5", padding: "12px 16px", fontSize: "13px", color: "#cc0000", marginBottom: "20px" }}>
            {clientError}
          </div>
        )}
        <div style={{ marginBottom: "28px" }}>
          <label htmlFor="email" style={labelStyle}>Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" style={inputStyle} />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="password" style={labelStyle}>Password</label>
          <input id="password" name="password" type="password" required autoComplete="current-password" style={inputStyle} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#6B6560", cursor: "pointer" }}>
            <input type="checkbox" name="remember" style={{ width: "14px", height: "14px" }} />
            Ingat saya
          </label>
          <Link href="/lupa-sandi" style={{ fontSize: "13px", color: "#1C1917", textDecoration: "none", fontWeight: 500 }}>
            Lupa password?
          </Link>
        </div>
        <button type="submit" style={btnStyle}>Masuk</button>
      </form>
    );
  }

  return (
    <form action="/api/auth/register" method="POST" onSubmit={validateRegister}>
      {clientError && (
        <div style={{ background: "#fff5f5", border: "1px solid #ffc5c5", padding: "12px 16px", fontSize: "13px", color: "#cc0000", marginBottom: "20px" }}>
          {clientError}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div>
          <label htmlFor="firstName" style={labelStyle}>Nama depan</label>
          <input id="firstName" name="firstName" type="text" required style={inputStyle} />
        </div>
        <div>
          <label htmlFor="lastName" style={labelStyle}>Nama belakang</label>
          <input id="lastName" name="lastName" type="text" required style={inputStyle} />
        </div>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label htmlFor="email" style={labelStyle}>Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" style={inputStyle} />
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label htmlFor="phone" style={labelStyle}>WhatsApp</label>
        <input id="phone" name="phone" type="tel" required style={inputStyle} placeholder="08xxxxxxxxxx" />
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label htmlFor="city" style={labelStyle}>Kota</label>
        <input id="city" name="city" type="text" style={inputStyle} />
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label htmlFor="password" style={labelStyle}>Password</label>
        <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" style={inputStyle} />
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label htmlFor="confirmPassword" style={labelStyle}>Konfirmasi password</label>
        <input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" style={inputStyle} />
      </div>

      <input type="hidden" name="storeName" value="Member" />

      <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13px", color: "#6B6560", marginBottom: "28px", cursor: "pointer", lineHeight: 1.5 }}>
        <input type="checkbox" required style={{ marginTop: "3px", width: "15px", height: "15px", flexShrink: 0 }} />
        Saya setuju dengan Syarat & Ketentuan dan Kebijakan Privasi
      </label>

      <button type="submit" style={btnStyle}>Buat akun</button>
    </form>
  );
}
