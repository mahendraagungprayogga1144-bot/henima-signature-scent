content = open("src/app/checkout/page.tsx").read()

content = content.replace(
    '''                          <p style={{fontSize:"14px", color:"#1C1917", fontWeight:500}}>{opt.courier_name} - {opt.courier_service_name}</p>
                          <p style={{fontSize:"12px", color:"#9A8F82"}}>{opt.min_day}-{opt.max_day} hari</p>
                        </div>
                      </div>
                      <span style={{fontSize:"14px", fontWeight:500}}>Rp {opt.price?.toLocaleString("id-ID")}</span>''',
    '''                          <p style={{fontSize:"14px", color:"#1C1917", fontWeight:500}}>{opt.courier_name} {opt.courier_service_name}</p>
                          <p style={{fontSize:"12px", color:"#9A8F82"}}>{opt.shipment_duration_range} {opt.shipment_duration_unit}</p>
                        </div>
                      </div>
                      <span style={{fontSize:"14px", fontWeight:500}}>Rp {(opt.price || opt.shipping_fee)?.toLocaleString("id-ID")}</span>'''
)

# Fix shipping cost
content = content.replace(
    "const shippingCost = selectedShipping?.price || 0;",
    "const shippingCost = selectedShipping?.price || selectedShipping?.shipping_fee || 0;"
)

open("src/app/checkout/page.tsx", "w").write(content)
print("Done!")
