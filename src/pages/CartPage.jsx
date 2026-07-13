import { useDispatch, useSelector } from "react-redux";
import { Minus, Plus, Trash2 } from "lucide-react";
import OrderSummary from "../components/OrderSummary.jsx";
import { removeCartItem, updateCartItem } from "../store/actions.js";
import { currency, getProductImage } from "../utils/format.js";

export default function CartPage() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.shoppingCart.cart);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold text-muted">Sepet</span>
        <h1 className="text-3xl font-bold text-ink">Alışveriş Sepeti</h1>
      </div>
      {cart.length === 0 ? (
        <div className="rounded-md border border-slate-200 p-8 text-center text-muted">Sepetiniz boş.</div>
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex flex-1 flex-col gap-4">
            {cart.map((item) => (
              <div key={item.product.id} className="flex flex-col gap-4 rounded-md border border-slate-200 p-4 md:flex-row md:items-center">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(event) =>
                    dispatch(updateCartItem(item.product.id, { checked: event.target.checked }))
                  }
                  className="h-5 w-5 accent-brand"
                />
                <img src={getProductImage(item.product)} alt={item.product.name} className="h-28 w-24 rounded object-cover" />
                <div className="flex flex-1 flex-col gap-2">
                  <span className="font-bold text-ink">{item.product.name}</span>
                  <span className="text-sm text-muted">{currency(item.product.price)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => dispatch(updateCartItem(item.product.id, { count: item.count - 1 }))}
                    className="rounded-md border border-slate-300 p-2"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-bold">{item.count}</span>
                  <button
                    type="button"
                    onClick={() => dispatch(updateCartItem(item.product.id, { count: item.count + 1 }))}
                    className="rounded-md border border-slate-300 p-2"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch(removeCartItem(item.product.id))}
                    className="rounded-md p-2 text-danger hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <OrderSummary cart={cart} />
        </div>
      )}
    </div>
  );
}
