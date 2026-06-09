"use client";
export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{position:"fixed", bottom:"24px", right:"24px", background:"#1C1917", color:"#fff", border:"none", padding:"12px 24px", fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", cursor:"pointer"}}>
      Print / Save PDF
    </button>
  );
}
