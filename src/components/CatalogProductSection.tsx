import Image from "next/image";
import type { Product } from "@/lib/types";
import { fixCatalogText } from "@/lib/catalog-text";

const PERFUME_TYPE = "Extrait de Parfum";

type CatalogProductSectionProps = {
  product: Product;
};

function formatSizes(product: Product): string {
  const sizes = product.variants
    .filter((v) => v.active)
    .map((v) => `${v.sizeMl}ml`);
  return sizes.length > 0 ? sizes.join(" · ") : "—";
}

function formatPrice(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")},-`;
}

export default function CatalogProductSection({ product }: CatalogProductSectionProps) {
  const variants = product.variants.filter((v) => v.active);
  const minPrice =
    variants.length > 0
      ? Math.min(...variants.map((v) => v.originalPrice))
      : product.originalPrice;

  const name = fixCatalogText(product.name);
  const scentFamily = fixCatalogText(product.scentFamily);
  const inspiration = fixCatalogText(product.inspiration || product.description);
  const topNotes = fixCatalogText(product.topNotes);
  const middleNotes = fixCatalogText(product.middleNotes);
  const baseNotes = fixCatalogText(product.baseNotes);
  const sillage = fixCatalogText(product.sillage);
  const projection = fixCatalogText(product.projection);
  const longevity = fixCatalogText(product.longevity);

  const hasPerformance = Boolean(sillage || projection || longevity);

  return (
    <section className="catalog-product-section">
      {/* Header */}
      <header className="catalog-product-header">
        <h2 className="catalog-product-name">{name}</h2>
        <p className="catalog-product-info">
          {PERFUME_TYPE} · {formatSizes(product)}
          {scentFamily ? (
            <>
              {" · "}
              <strong>{scentFamily}</strong>
            </>
          ) : null}
        </p>
        {product.comingSoon ? (
          <p className="catalog-product-coming-soon">Coming Soon</p>
        ) : (
          <p className="catalog-product-price">{formatPrice(minPrice)}</p>
        )}
      </header>

      {/* Body — photo always left */}
      <div className="catalog-product-body">
        <div className="catalog-product-photo">
          {product.photo ? (
            <Image
              src={product.photo}
              alt={name}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          ) : (
            <div className="catalog-product-photo-placeholder">
              <span>{name}</span>
            </div>
          )}
        </div>

        <div className="catalog-product-details">
          {inspiration ? (
            <p className="catalog-product-story">{inspiration}</p>
          ) : null}

          <div className="catalog-notes">
            <div className="catalog-note-group">
              <p className="catalog-note-label">Mind Notes</p>
              <p className="catalog-note-value">{topNotes || "—"}</p>
            </div>
            <div className="catalog-note-group">
              <p className="catalog-note-label">Heart Notes</p>
              <p className="catalog-note-value">{middleNotes || "—"}</p>
            </div>
            <div className="catalog-note-group">
              <p className="catalog-note-label">Soul Notes</p>
              <p className="catalog-note-value">{baseNotes || "—"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer performance */}
      {hasPerformance ? (
        <footer className="catalog-product-footer">
          <p className="catalog-performance">
            {sillage ? (
              <>
                <span className="catalog-performance-label">Sillage</span> {sillage}
              </>
            ) : null}
            {sillage && projection ? <span className="catalog-performance-sep"> | </span> : null}
            {projection ? (
              <>
                <span className="catalog-performance-label">Projection</span> {projection}
              </>
            ) : null}
            {(sillage || projection) && longevity ? (
              <span className="catalog-performance-sep"> | </span>
            ) : null}
            {longevity ? (
              <>
                <span className="catalog-performance-label">Longevity</span> {longevity}
              </>
            ) : null}
          </p>
        </footer>
      ) : null}
    </section>
  );
}
