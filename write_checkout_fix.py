content = open("src/app/checkout/page.tsx").read()

new_func = '''  async function checkShippingById(cityId: string) {
    if (!cityId) return;
    setLoadingShipping(true);
    setShippingOptions([]);
    setSelectedShipping(null);
    try {
      const weight = items.reduce((s, i) => s + i.quantity * 250, 0);
      const res = await fetch("/api/biteship/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinationAreaId: cityId, weightGrams: weight }),
      });
      const data = await res.json();
      setShippingOptions(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoadingShipping(false); }
  }

  async function handleSubmit(e: React.FormEvent) {'''

content = content.replace(
    "  async function handleSubmit(e: React.FormEvent) {",
    new_func
)
open("src/app/checkout/page.tsx", "w").write(content)
print("Done!")
