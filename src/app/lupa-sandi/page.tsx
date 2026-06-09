export default function LupaSandiPage() {
  return (
    <div style={{minHeight:"100vh",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-jost, sans-serif)",padding:"40px 24px"}}>
      <div style={{width:"100%",maxWidth:"440px",border:"1px solid #d5d5d5",padding:"48px 40px"}}>
        <h1 style={{fontSize:"28px",fontWeight:700,color:"#1a1a1a",marginBottom:"6px"}}>Forgot Password</h1>
        <p style={{fontSize:"13px",color:"#888",marginBottom:"32px"}}>Hubungi admin Henima untuk reset kata sandi kamu.</p>
        <a href="https://wa.me/6285190311230" target="_blank" rel="noopener noreferrer" style={{display:"block",width:"100%",background:"#2c2c2c",color:"#fff",padding:"15px",fontSize:"12px",letterSpacing:"2px",textTransform:"uppercase",textAlign:"center",textDecoration:"none",boxSizing:"border-box"}}>Chat WhatsApp Admin</a>
        <p style={{textAlign:"center",fontSize:"13px",color:"#888",marginTop:"20px"}}>Sudah ingat? <a href="/masuk" style={{color:"#1a1a1a",fontWeight:700,textDecoration:"none"}}>Sign in</a></p>
      </div>
    </div>
  );
}
