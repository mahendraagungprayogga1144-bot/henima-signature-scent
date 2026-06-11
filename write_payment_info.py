content = open("src/app/checkout/page.tsx").read()

new_content = content.replace(
    '            {/* SUBMIT MOBILE */}',
    '''            {/* PAYMENT INFO */}
            <div style={{marginBottom:"32px", background:"#F0EBE3", padding:"24px", border:"1px solid rgba(28,25,23,0.08)"}}>
              <h2 style={{fontSize:"14px", fontWeight:600, color:"#1C1917", marginBottom:"16px", letterSpacing:"0.5px"}}>Informasi Pembayaran</h2>
              <p style={{fontSize:"13px", color:"#6B5E52", lineHeight:1.8, marginBottom:"16px"}}>
                Setelah order dikonfirmasi, lakukan transfer ke rekening berikut:
              </p>
              <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
                <div style={{display:"flex", justifyContent:"space-between", fontSize:"13px"}}>
                  <span style={{color:"#9A8F82"}}>Bank</span>
                  <span style={{fontWeight:600, color:"#1C1917"}}>BCA</span>
                </div>
                <div style={{display:"flex", justifyContent:"space-between", fontSize:"13px"}}>
                  <span style={{color:"#9A8F82"}}>No. Rekening</span>
                  <span style={{fontWeight:600, color:"#1C1917"}}>2712008173</span>
                </div>
                <div style={{display:"flex", justifyContent:"space-between", fontSize:"13px"}}>
                  <span style={{color:"#9A8F82"}}>Atas Nama</span>
                  <span style={{fontWeight:600, color:"#1C1917"}}>PT Henima Collection Indo</span>
                </div>
              </div>
              <div style={{height:"1px", background:"rgba(28,25,23,0.1)", margin:"16px 0"}} />
              <p style={{fontSize:"12px", color:"#9A8F82", lineHeight:1.7}}>
                Tim Henima akan mengkonfirmasi pembayaran dan mengirimkan pesanan dalam 1x24 jam setelah transfer diterima.
              </p>
            </div>

            {/* SUBMIT MOBILE */}'''
)

open("src/app/checkout/page.tsx", "w").write(new_content)
print("Done!")
