content = open("src/app/shop/[slug]/page.tsx").read()
old = "@media (max-width: 768px) {\n          .product-detail-grid { grid-template-columns: 1fr !important; }\n        }"
new = "@media (max-width: 768px) {\n          .product-detail-grid { grid-template-columns: 1fr !important; }\n          .product-detail-grid > div:first-child { min-height: 380px !important; }\n          .product-detail-grid > div:last-child { padding: 32px 6vw !important; }\n        }"
open("src/app/shop/[slug]/page.tsx", "w").write(content.replace(old, new))
print("Done!")
