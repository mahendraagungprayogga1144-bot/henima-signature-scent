content = open("src/app/checkout/page.tsx").read()

content = content.replace(
    '''                    <label key={opt.service} onClick={() => setSelectedShipping(opt)}
                      style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", border: selectedShipping?.service === opt.service ? "1px solid #1C1917" : "1px solid rgba(28,25,23,0.12)", cursor:"pointer", background: selectedShipping?.service === opt.service ? "#F0EBE3" : "#FAF8F4"}}>
                      <div style={{display:"flex", gap:"12px", alignItems:"center"}}>
                        <div style={{width:"16px", height:"16px", borderRadius:"50%", border: selectedShipping?.service === opt.service ? "5px solid #1C1917" : "1px solid rgba(28,25,23,0.3)", flexShrink:0}} />
                        <div>
                          <p style={{fontSize:"14px", color:"#1C1917", fontWeight:500}}>{opt.service}</p>
                          <p style={{fontSize:"12px", color:"#9A8F82"}}>{opt.description} · {opt.cost?.[0]?.etd} days</p>
                        </div>
                      </div>
                      Rp {opt.cost?.[0]?.value?.toLocaleString("id-ID")}
                    </label>''',
    '''                    <label key={opt.courier_service_code} onClick={() => setSelectedShipping(opt)}
                      style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", border: selectedShipping?.courier_service_code === opt.courier_service_code ? "1px solid #1C1917" : "1px solid rgba(28,25,23,0.12)", cursor:"pointer", background: selectedShipping?.courier_service_code === opt.courier_service_code ? "#F0EBE3" : "#FAF8F4"}}>
                      <div style={{display:"flex", gap:"12px", alignItems:"center"}}>
                        <div style={{width:"16px", height:"16px", borderRadius:"50%", border: selectedShipping?.courier_service_code === opt.courier_service_code ? "5px solid #1C1917" : "1px solid rgba(28,25,23,0.3)", flexShrink:0}} />
                        <div>
                          <p style={{fontSize:"14px", color:"#1C1917", fontWeight:500}}>{opt.courier_name} - {opt.courier_service_name}</p>
                          <p style={{fontSize:"12px", color:"#9A8F82"}}>{opt.min_day}-{opt.max_day} hari</p>
                        </div>
                      </div>
                      <span style={{fontSize:"14px", fontWeight:500}}>Rp {opt.price?.toLocaleString("id-ID")}</span>
                    </label>'''
)

# Fix shipping cost
content = content.replace(
    "const shippingCost = selectedShipping?.price || 0;",
    "const shippingCost = selectedShipping?.price || 0;"
)

# Fix courier name di submit
content = content.replace(
    'courierName: selectedShipping?.service,',
    'courierName: selectedShipping?.courier_name + " " + selectedShipping?.courier_service_name,'
)

open("src/app/checkout/page.tsx", "w").write(content)
print("Done!")
