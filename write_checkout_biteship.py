content = open("src/app/checkout/page.tsx").read()

# Ganti searchCities pakai Biteship
content = content.replace(
    '''  async function searchCities(q: string) {
    setCitySearch(q);
    setSelectedCityId("");
    setCity("");
    if (q.length < 2) { setCities([]); setShowCityDropdown(false); return; }
    try {
      const res = await fetch("/api/cities?q=" + encodeURIComponent(q));
      const data = await res.json();
      const list = data.cities || [];
      setCities(list);
      setShowCityDropdown(list.length > 0);
    } catch (e) {
      console.error("City search error:", e);''',
    '''  async function searchCities(q: string) {
    setCitySearch(q);
    setSelectedCityId("");
    setCity("");
    if (q.length < 3) { setCities([]); setShowCityDropdown(false); return; }
    try {
      const res = await fetch("/api/biteship/locations?q=" + encodeURIComponent(q));
      const list = await res.json();
      setCities(list);
      setShowCityDropdown(list.length > 0);
    } catch (e) {
      console.error("City search error:", e);'''
)

# Ganti checkShipping pakai Biteship
content = content.replace(
    '''      const res = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinationId: selectedCityId, weightGrams: items.reduce((s, i) => s + i.quantity * 250, 0) }),''',
    '''      const res = await fetch("/api/biteship/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinationAreaId: selectedCityId, weightGrams: items.reduce((s, i) => s + i.quantity * 250, 0) }),'''
)

# Ganti city dropdown display
content = content.replace(
    '''                        <div key={c.id || c.city_id}
                          onClick={() => {
                            setSelectedCityId(String(c.id || c.city_id));
                            setCity(c.city_name || c.district_name || "");
                            setProvince(c.province_name || c.province || "");
                            setPostalCode(c.zip_code || "");
                            setCitySearch(c.label || (c.type + " " + c.city_name + " — " + c.province));
                            setShowCityDropdown(false);
                          }}
                          style={{padding:"12px 16px", cursor:"pointer", fontSize:"13px", color:"#1C1917", borderBottom:"1px solid rgba(28,25,23,0.06)"}}>
                          {c.label || (c.type + " " + c.city_name)} <span style={{color:"#9A8F82"}}>— {c.province_name || c.province}</span>
                        </div>''',
    '''                        <div key={c.id}
                          onClick={() => {
                            setSelectedCityId(c.id);
                            setCity(c.administrative_division_level_3_name || "");
                            setProvince(c.administrative_division_level_1_name || "");
                            setPostalCode(String(c.postal_code || ""));
                            setCitySearch(c.name);
                            setShowCityDropdown(false);
                          }}
                          style={{padding:"12px 16px", cursor:"pointer", fontSize:"13px", color:"#1C1917", borderBottom:"1px solid rgba(28,25,23,0.06)"}}>
                          {c.name}
                        </div>'''
)

# Ganti shipping options display
content = content.replace(
    'opt.service === selectedShipping?.service',
    'opt.courier_service_code === selectedShipping?.courier_service_code'
)

content = content.replace(
    '''onClick={() => setSelectedShipping(opt)}''',
    '''onClick={() => setSelectedShipping(opt)}'''
)

# Fix shipping cost
content = content.replace(
    "const shippingCost = selectedShipping?.cost?.[0]?.value || 0;",
    "const shippingCost = selectedShipping?.price || 0;"
)

# Fix shipping options mapping
content = content.replace(
    '''{shippingOptions.map((opt) => (
                    <div key={opt.service}''',
    '''{shippingOptions.map((opt) => (
                    <div key={opt.courier_service_code}'''
)

open("src/app/checkout/page.tsx", "w").write(content)
print("Done!")
