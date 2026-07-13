import { useEffect, useState } from "react";
import { api } from "../api/api.js";
import Spinner from "../components/Spinner.jsx";
import { currency } from "../utils/format.js";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/order")
      .then((response) => setOrders(response.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold text-muted">Hesap</span>
        <h1 className="text-3xl font-bold text-ink">Önceki Siparişler</h1>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <details key={order.id} className="rounded-md border border-slate-200 p-5">
              <summary className="cursor-pointer font-bold text-ink">
                #{order.id} - {currency(order.price)}
              </summary>
              <div className="mt-4 flex flex-col gap-2 text-sm text-muted">
                <span>{order.order_date}</span>
                {(order.products || []).map((product) => (
                  <span key={`${order.id}-${product.product_id}`}>{product.count} x {product.detail}</span>
                ))}
              </div>
            </details>
          ))}
          {orders.length === 0 && <div className="rounded-md border border-slate-200 p-8 text-center text-muted">Sipariş bulunamadı.</div>}
        </div>
      )}
    </div>
  );
}
