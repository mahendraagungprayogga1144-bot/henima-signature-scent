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
        {children && <div className="mt-4">{children}</div>}
      </div>
    </article>
  );
}
