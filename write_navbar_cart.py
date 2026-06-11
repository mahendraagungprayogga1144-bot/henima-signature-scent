content = open("src/components/Navbar.tsx").read()

# Tambah cart state
old_state = '  const [open, setOpen] = useState(false);'
new_state = '''  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("henima-cart") || "[]");
        setCartCount(cart.reduce((s: number, i: any) => s + i.quantity, 0));
      } catch {}
    };
    updateCart();
    window.addEventListener("cart-updated", updateCart);
    return () => window.removeEventListener("cart-updated", updateCart);
  }, []);'''

content = content.replace(old_state, new_state)

# Tambah cart link sebelum hamburger button
old_hamburger = '            {/* Hamburger — always visible */}'
new_hamburger = '''            {/* Cart */}
            {!user && (
              <a href="/cart" style={{position:"relative", display:"flex", alignItems:"center", textDecoration:"none", color:"#1C1917"}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1C1917" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                {cartCount > 0 && (
                  <span style={{position:"absolute", top:"-6px", right:"-6px", background:"#1C1917", color:"#FAF8F4", borderRadius:"50%", width:"16px", height:"16px", fontSize:"9px", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:600}}>
                    {cartCount}
                  </span>
                )}
              </a>
            )}
            {/* Hamburger — always visible */}'''

content = content.replace(old_hamburger, new_hamburger)

open("src/components/Navbar.tsx", "w").write(content)
print("Done!")
