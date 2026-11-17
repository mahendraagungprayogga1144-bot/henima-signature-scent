/**
 * Kenzo Parfums primary-images — vertical stack that scrolls while
 * the right column stays sticky (content-sticky).
 */
export default function KenzoProductImages({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) {
  const list = images.filter(Boolean);
  if (!list.length) {
    return (
      <div className="kz-primary-images kz-primary-images--empty">
        <span>{productName}</span>
      </div>
    );
  }

  return (
    <div className="kz-primary-images">
      {list.map((src, i) => (
        <div key={`${src}-${i}`} className="kz-product-images">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={`${productName} ${i + 1}`} />
        </div>
      ))}
      <style>{`
        .kz-primary-images {
          width: 100%;
          padding: 0 0 40px;
        }
        .kz-primary-images--empty {
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-futura-nav), Futura, sans-serif;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(33,37,41,0.12);
          font-size: clamp(28px, 5vw, 48px);
        }
        /* Full-column squares so left stack is tall enough for sticky right */
        .kz-product-images {
          width: 100%;
          max-width: 100%;
          margin: 0 0 2px;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FFFFFF;
          overflow: hidden;
        }
        .kz-product-images:last-child {
          margin-bottom: 0;
        }
        .kz-product-images img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        /* Bottle shots stay contained; lifestyle can fill */
        .kz-product-images:first-child img,
        .kz-product-images:nth-child(4) img {
          object-fit: contain;
        }
        @media (max-width: 768.98px) {
          .kz-product-images {
            margin-bottom: 2px;
          }
        }
      `}</style>
    </div>
  );
}
