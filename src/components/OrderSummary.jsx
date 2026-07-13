import { Link } from "react-router-dom";
import { currency } from "../utils/format.js";

export default function OrderSummary({ cart, actionTo = "/checkout" }) {
  const selected = cart.filter((item) => item.checked);
  const productsTotal = selected.reduce((sum, item) => sum + item.count * item.product.price, 0);
  const shipping = productsTotal > 0 && productsTotal < 750 ? 39.99 : 0;
  const discount = productsTotal >= 1500 ? 100 : 0;
  const grandTotal = productsTotal + shipping - discount;

  return (
    <aside className="flex w-full flex-col gap-4 rounded-md border border-slate-200 bg-white p-5 lg:w-80">
      <h2 className="text-lg font-bold text-ink">Sipariş Özeti</h2>
      <div className="flex flex-col gap-3 text-sm text-muted">
        <div className="flex justify-between">
          <span>Ürün Toplamı</span>
          <span>{currency(productsTotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Kargo</span>
          <span>{currency(shipping)}</span>
        </div>
        <div className="flex justify-between text-success">
          <span>İndirim</span>
          <span>-{currency(discount)}</span>
        </div>
      </div>
      <div className="flex justify-between border-t border-slate-200 pt-4 text-base font-bold text-ink">
        <span>Genel Toplam</span>
        <span>{currency(grandTotal)}</span>
      </div>
      <Link
        to={actionTo}
        className="flex h-11 items-center justify-center rounded-md bg-brand px-4 text-sm font-bold text-white hover:bg-ink"
      >
        Sipariş Oluştur
      </Link>
    </aside>
  );
}
