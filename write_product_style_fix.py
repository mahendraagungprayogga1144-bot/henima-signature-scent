content = open("src/app/shop/[slug]/page.tsx").read()

old = """      <style>{\\`
        @media (max-width: 768px) {
          .product-detail-grid { grid-template-columns: 1fr !important; }
          .product-detail-right { padding: 32px 6vw !important; }
        }
      \\`}</style>"""

new = """      <style>{"@media (max-width: 768px) { .product-detail-grid { grid-template-columns: 1fr !important; } .product-detail-right { padding: 32px 6vw !important; } }"}</style>"""

if old in content:
    new_content = content.replace(old, new)
    open("src/app/shop/[slug]/page.tsx", "w").write(new_content)
    print("Fixed!")
else:
    # Try direct approach
    lines = content.split("\n")
    new_lines = []
    skip = False
    for line in lines:
        if "<style>{`" in line or "<style>{\\`" in line:
            skip = True
            new_lines.append('      <style>{"@media (max-width: 768px) { .product-detail-grid { grid-template-columns: 1fr !important; } .product-detail-right { padding: 32px 6vw !important; } }"}</style>')
        elif skip and ("`}</style>" in line or "\\`}</style>" in line):
            skip = False
        elif not skip:
            new_lines.append(line)
    open("src/app/shop/[slug]/page.tsx", "w").write("\n".join(new_lines))
    print("Fixed via line approach!")
