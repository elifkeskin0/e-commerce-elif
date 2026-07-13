import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, Star } from "lucide-react";
import Spinner from "../components/Spinner.jsx";
import { addToCart, fetchProductById } from "../store/actions.js";
import { currency, getProductImage } from "../utils/format.js";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, fetchState } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  if (fetchState === "FETCHING" || !selectedProduct) return <Spinner label="Ürün yükleniyor" />;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10 lg:flex-row">
      <div className="flex flex-1">
        <img
          src={getProductImage(selectedProduct)}
          alt={selectedProduct.name}
          className="max-h-[680px] w-full rounded-md object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-5">
        <h1 className="text-3xl font-bold leading-tight text-ink">{selectedProduct.name}</h1>
        <div className="flex items-center gap-4 text-sm text-muted">
          <span className="flex items-center gap-1">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            {selectedProduct.rating}
          </span>
          <span>{selectedProduct.sell_count} satış</span>
          <span>{selectedProduct.stock} stok</span>
        </div>
        <p className="text-3xl font-bold text-success">{currency(selectedProduct.price)}</p>
        <p className="leading-7 text-muted">{selectedProduct.description}</p>
        <button
          type="button"
          onClick={() => dispatch(addToCart(selectedProduct))}
          className="flex h-12 w-fit items-center gap-2 rounded-md bg-brand px-7 text-sm font-bold text-white hover:bg-ink"
        >
          <ShoppingCart className="h-4 w-4" />
          Sepete Ekle
        </button>
      </div>
    </div>
  );
}
