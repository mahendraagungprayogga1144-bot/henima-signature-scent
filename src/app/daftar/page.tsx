import Link from "next/link";

export default async function RegisterPage({
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
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#1a1a1a",
            marginBottom: "6px",
          }}
        >
          Create Account
        </h1>
        <p style={{ fontSize: "13px", color: "#888", marginBottom: "32px" }}>
          Already have an account?{" "}
          <Link href="/masuk" style={{ color: "#1a1a1a", fontWeight: 700, textDecoration: "none" }}>
            Sign in
          </Link>
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

        <form action="/api/auth/register" method="POST">
          {[
            { id: "name", label: "Full Name", type: "text" },
            { id: "storeName", label: "Store Name", type: "text" },
            { id: "email", label: "Email", type: "email" },
            { id: "phone", label: "WhatsApp (08xxx / 62xxx)", type: "text", placeholder: "6281234567890" },
          ].map((field) => (
            <div key={field.id} style={{ marginBottom: "24px" }}>
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                required
                placeholder={field.placeholder || field.label}
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
          ))}

          <div style={{ marginBottom: "24px" }}>
            <textarea
              id="address"
              name="address"
              rows={2}
              placeholder="Store Address"
              style={{
                width: "100%",
                border: "none",
                borderBottom: "1px solid #ccc",
                padding: "10px 0",
                fontSize: "14px",
                color: "#1a1a1a",
                outline: "none",
                background: "transparent",
                resize: "none",
                boxSizing: "border-box",
                fontFamily: "var(--font-jost, sans-serif)",
              }}
            />
          </div>

          <div style={{ marginBottom: "32px" }}>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
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
            }}
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
