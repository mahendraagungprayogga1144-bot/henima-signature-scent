export default async function LupaSandiPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  const { error, sent } = await searchParams;

  return (
    <div style={{minHeight:"100vh",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-jost, sans-serif)",padding:"40px 24px"}}>
      <div style={{width:"100%",maxWidth:"440px",border:"1px solid #d5d5d5",padding:"48px 40px"}}>
        <h1 style={{fontSize:"28px",fontWeight:700,color:"#1a1a1a",marginBottom:"6px"}}>Forgot Password</h1>
        <p style={{fontSize:"13px",color:"#888",marginBottom:"32px"}}>
          Masukkan email kamu dan kami akan kirimkan link reset kata sandi.
        </p>

        {sent && (
          <div style={{background:"#f0fdf4",border:"1px solid #86efac",padding:"12px 16px",fontSize:"13px",color:"#166534",marginBottom:"20px"}}>
            Email reset sudah dikirim! Cek inbox kamu.
          </div>
        )}

        {error && (
          <div style={{background:"#fff5f5",border:"1px solid #ffc5c5",padding:"12px 16px",fontSize:"13px",color:"#cc0000",marginBottom:"20px"}}>
            {decodeURIComponent(error)}
          </div>
        )}

        {!sent && (
          <form action="/api/auth/reset-password" method="POST">
            <div style={{marginBottom:"24px"}}>
              <input
                name="email"
                type="email"
                required
                placeholder="Email"
                style={{width:"100%",border:"none",borderBottom:"1px solid #ccc",padding:"10px 0",fontSize:"14px",color:"#1a1a1a",outline:"none",background:"transparent",boxSizing:"border-box"}}
              />
            </div>
            <button type="submit" style={{width:"100%",background:"#2c2c2c",color:"#fff",border:"none",padding:"15px",fontSize:"12px",letterSpacing:"2px",textTransform:"uppercase",cursor:"pointer",fontWeight:500,marginBottom:"20px"}}>
              Kirim Link Reset
            </button>
          </form>
        )}

        <p style={{textAlign:"center",fontSize:"13px",color:"#888"}}>
          Sudah ingat?{" "}
          <a href="/masuk" style={{color:"#1a1a1a",fontWeight:700,textDecoration:"none"}}>Sign in</a>
        </p>
      </div>
    </div>
  );
}
