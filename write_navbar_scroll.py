content = open("src/components/Navbar.tsx").read()

# Tambah scroll hide/show logic
old_state = '  const [open, setOpen] = useState(false);'
new_state = '''  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 40);
      if (currentY < 80) { setHidden(false); }
      else if (currentY > lastScrollY.current + 8) { setHidden(true); }
      else if (currentY < lastScrollY.current - 8) { setHidden(false); }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);'''

content = content.replace(old_state, new_state)

# Tambah useRef import
content = content.replace(
    'import { useState, useEffect } from "react";',
    'import { useState, useEffect, useRef } from "react";'
)

# Update header style dengan transform
old_header = '''      <header style={{
        position:"sticky", top:0, zIndex:50,
        background:"rgba(250,248,244,0.95)",
        backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
        borderBottom:"1px solid rgba(28,25,23,0.08)",
      }}>'''

new_header = '''      <header style={{
        position:"fixed", top:0, left:0, right:0, zIndex:50,
        background: scrolled ? "rgba(250,248,244,0.97)" : "rgba(250,248,244,0.0)",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(28,25,23,0.08)" : "1px solid transparent",
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), background 0.3s ease, border-color 0.3s ease",
      }}>'''

content = content.replace(old_header, new_header)

open("src/components/Navbar.tsx", "w").write(content)
print("Done!")
