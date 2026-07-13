import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { currency, getCategoryName, getProductImage, slugify } from "../utils/format.js";

export default function ProductCard({ product, category, onAdd }) {
  const gender = category?.code?.startsWith("k:") ? "kadin" : "erkek";
  const categoryName = getCategoryName(category);
  const detailUrl = `/shop/${gender}/${categoryName}/${product.category_id}/${slugify(product.name)}/${product.id}`;

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-md border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <Link to={detailUrl} className="block cursor-pointer">
        <img
          src={getProductImage(product)}
          alt={product.name}
          className="aspect-[3/4] w-full object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link to={detailUrl} className="min-h-[48px] text-sm font-bold text-ink hover:text-brand">
          {product.name}
        </Link>
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold text-success">{currency(product.price)}</span>
          <span className="flex items-center gap-1 text-muted">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            {product.rating?.toFixed?.(1) || product.rating}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onAdd(product)}
          className="mt-auto flex h-10 items-center justify-center gap-2 rounded-md bg-ink px-3 text-sm font-bold text-white hover:bg-brand"
        >
          <ShoppingCart className="h-4 w-4" />
          Sepete Ekle
        </button>
      </div>
    </div>
  );
}
