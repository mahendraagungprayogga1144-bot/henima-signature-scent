export default function ResetPasswordPage({
    searchParams,
  }: {
    searchParams: { token?: string };
  }) {
    const token = searchParams.token || "";
  
    return (
      <div style={{minHeight:"100vh",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-jost, sans-serif)",padding:"40px 24px"}}>
        <div style={{width:"100%",maxWidth:"440px",border:"1px solid #d5d5d5",padding:"48px 40px"}}>
          <h1 style={{fontSize:"28px",fontWeight:700,color:"#1a1a1a",marginBottom:"6px"}}>Reset Kata Sandi</h1>
          <p style={{fontSize:"13px",color:"#888",marginBottom:"32px"}}>Masukkan kata sandi baru kamu.</p>
          <form action="/api/auth/do-reset" method="POST">
            <input type="hidden" name="token" value={token} />
            <div style={{marginBottom:"24px"}}>
              <input name="password" type="password" required minLength={6} placeholder="Kata sandi baru" style={{width:"100%",border:"none",borderBottom:"1px solid #ccc",padding:"10px 0",fontSize:"14px",color:"#1a1a1a",outline:"none",background:"transparent",boxSizing:"border-box"}} />
            </div>
            <div style={{marginBottom:"32px"}}>
              <input name="confirm" type="password" required minLength={6} placeholder="Konfirmasi kata sandi" style={{width:"100%",border:"none",borderBottom:"1px solid #ccc",padding:"10px 0",fontSize:"14px",color:"#1a1a1a",outline:"none",background:"transparent",boxSizing:"border-box"}} />
            </div>
            <button type="submit" style={{width:"100%",background:"#2c2c2c",color:"#fff",border:"none",padding:"15px",fontSize:"12px",letterSpacing:"2px",textTransform:"uppercase",cursor:"pointer",fontWeight:500}}>
              Simpan Kata Sandi
            </button>
          </form>
        </div>
      </div>
    );
  }