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
        padding: "60px 24px",
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
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1a1a1a", marginBottom: "6px" }}>
          Create Account
        </h1>
        <p style={{ fontSize: "13px", color: "#888", marginBottom: "32px" }}>
          Register and get updates on our items and promotions
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
          {/* First Name & Last Name */}
          {[
            { id: "firstName", placeholder: "First Name" },
            { id: "lastName", placeholder: "Last Name" },
          ].map((f) => (
            <div key={f.id} style={{ marginBottom: "24px" }}>
              <input
                id={f.id}
                name={f.id}
                type="text"
                placeholder={f.placeholder}
                style={inputStyle}
              />
            </div>
          ))}

          {/* Place Birth */}
          <div style={{ marginBottom: "24px" }}>
            <input
              name="birthPlace"
              type="text"
              placeholder="Place Birth"
              style={inputStyle}
            />
          </div>

          {/* Birth Date */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "12px", color: "#888", display: "block", marginBottom: "6px" }}>
              Birth Date
            </label>
            <input
              name="birthDate"
              type="date"
              style={inputStyle}
            />
          </div>

          {/* Gender */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "12px", color: "#888", display: "block", marginBottom: "6px" }}>
              Gender
            </label>
            <div style={{ position: "relative" }}>
              <select
                name="gender"
                style={{
                  ...inputStyle,
                  appearance: "none",
                  WebkitAppearance: "none",
                  cursor: "pointer",
                  paddingRight: "28px",
                }}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <span style={{
                position: "absolute", right: "4px", top: "50%",
                transform: "translateY(-50%)", pointerEvents: "none",
                fontSize: "10px", color: "#888",
              }}>▼</span>
            </div>
          </div>

          {/* City */}
          <div style={{ marginBottom: "24px" }}>
            <input
              name="city"
              type="text"
              placeholder="Where do you live? (City Only)"
              style={inputStyle}
            />
          </div>

          {/* Occupation */}
          <div style={{ marginBottom: "24px" }}>
            <input
              name="occupation"
              type="text"
              placeholder="Occupation"
              style={inputStyle}
            />
          </div>

          {/* WhatsApp */}
          <div style={{ marginBottom: "24px" }}>
            <input
              name="phone"
              type="text"
              required
              placeholder="Whatsapp/Phone Number"
              style={inputStyle}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: "24px" }}>
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              style={inputStyle}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "16px" }}>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="Password"
              style={inputStyle}
            />
          </div>

          {/* Hidden fields untuk API compatibility */}
          <input type="hidden" name="storeName" value="Member" />
          <input type="hidden" name="name" id="fullNameHidden" />

          {/* Note */}
          <p style={{ fontSize: "11px", color: "#888", marginBottom: "20px", lineHeight: 1.6 }}>
            *Nomor handphone berguna untuk promosi dan informasi penawaran produk
          </p>

          {/* Terms */}
          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              fontSize: "13px",
              color: "#555",
              marginBottom: "28px",
              cursor: "pointer",
            }}
          >
            <input type="checkbox" required style={{ marginTop: "2px", width: "15px", height: "15px", flexShrink: 0 }} />
            I agree to Terms of Use and Privacy Policy
          </label>

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
            Create
          </button>

          {/* Login link */}
          <p style={{ textAlign: "center", fontSize: "13px", color: "#888" }}>
            Already have an Account?{" "}
            <Link href="/masuk" style={{ color: "#1a1a1a", fontWeight: 700, textDecoration: "none" }}>
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "none",
  borderBottom: "1px solid #ccc",
  padding: "10px 0",
  fontSize: "14px",
  color: "#1a1a1a",
  outline: "none",
  background: "transparent",
  boxSizing: "border-box",
  fontFamily: "var(--font-jost, sans-serif)",
};
