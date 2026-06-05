import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatRupiah } from "@/lib/format";

interface Props {
  product: Product;
  children?: React.ReactNode;
}

export default function ProductCard({ product, children }: Props) {
  return (
    <article className="card flex flex-col overflow-hidden p-0">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-50 to-stone-100">
        <Image
          src={product.photo}
          alt={product.name}
          fill
          className="object-contain p-8"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-ink-50">{product.name}</h3>
        <p className="mt-1 flex-1 text-sm text-ink-300">{product.description}</p>
        <div className="mt-3 space-y-1">
          <p className="text-sm text-ink-400 line-through">
            {formatRupiah(product.originalPrice)}
          </p>
          <p className="text-xl font-bold text-red-300">
            {formatRupiah(product.discountPrice)}
          </p>
        </div>
        {((product as any).topNotes || (product as any).middleNotes || (product as any).baseNotes) && (
          <div className="mt-3 space-y-1 border-t border-ink-800 pt-3">
            {(product as any).topNotes && (
              <p className="text-xs text-ink-400"><span className="text-ink-200 font-medium">Top:</span> {(product as any).topNotes}</p>
            )}
            {(product as any).middleNotes && (
              <p className="text-xs text-ink-400"><span className="text-ink-200 font-medium">Middle:</span> {(product as any).middleNotes}</p>
            )}
            {(product as any).baseNotes && (
              <p className="text-xs text-ink-400"><span className="text-ink-200 font-medium">Base:</span> {(product as any).baseNotes}</p>
            )}
          </div>
        )}
        {(product as any).inspiration && (
          <div className="mt-3 rounded-xl bg-ink-900/60 p-3 border-t border-ink-800">
            <p className="text-xs text-ink-400 italic">"{(product as any).inspiration}"</p>
          </div>
        )}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </article>
  );
}
