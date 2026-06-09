import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-jost, sans-serif)",
        padding: "40px 24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          border: "1px solid #d5d5d5",
          padding: "48px 40px",
          background: "#fff",
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#1a1a1a",
            marginBottom: "6px",
          }}
        >
          Login
        </h1>
        <p style={{ fontSize: "13px", color: "#888", marginBottom: "32px" }}>
          Please log in to your account.
        </p>

        {error && (
          <div
            style={{
              background: "#fff5f5",
              border: "1px solid #ffc5c5",
              padding: "12px 16px",
              fontSize: "13px",
              color: "#cc0000",
              marginBottom: "20px",
            }}
          >
            {decodeURIComponent(error)}
          </div>
        )}

        <form action="/api/auth/login" method="POST">
          {/* Email */}
          <div style={{ marginBottom: "24px" }}>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email"
              style={{
                width: "100%",
                border: "none",
                borderBottom: "1px solid #ccc",
                padding: "10px 0",
                fontSize: "14px",
                color: "#1a1a1a",
                outline: "none",
                background: "transparent",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "16px", position: "relative" }}>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              style={{
                width: "100%",
                border: "none",
                borderBottom: "1px solid #ccc",
                padding: "10px 0",
                fontSize: "14px",
                color: "#1a1a1a",
                outline: "none",
                background: "transparent",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Remember & Forgot */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "28px",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                color: "#555",
                cursor: "pointer",
              }}
            >
              <input type="checkbox" name="remember" style={{ width: "14px", height: "14px" }} />
              Remember Me
            </label>
            <Link
              href="/lupa-sandi"
              style={{
                fontSize: "13px",
                color: "#1a1a1a",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Forgot your password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            style={{
              width: "100%",
              background: "#2c2c2c",
              color: "#fff",
              border: "none",
              padding: "15px",
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              cursor: "pointer",
              fontWeight: 500,
              fontFamily: "var(--font-jost, sans-serif)",
              marginBottom: "24px",
            }}
          >
            Sign In
          </button>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "#e5e5e5" }} />
            <span style={{ fontSize: "12px", color: "#aaa" }}>or continue with</span>
            <div style={{ flex: 1, height: "1px", background: "#e5e5e5" }} />
          </div>

          {/* Register link */}
          <p style={{ textAlign: "center", fontSize: "13px", color: "#888" }}>
            Don&apos;t have an Account?{" "}
            <Link
              href="/daftar"
              style={{ color: "#1a1a1a", fontWeight: 700, textDecoration: "none" }}
            >
              Create account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
