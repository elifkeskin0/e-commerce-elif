import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard.jsx";
import Slider from "../components/Slider.jsx";
import Spinner from "../components/Spinner.jsx";
import { addToCart, fetchCategories, fetchProducts } from "../store/actions.js";
import { getCategoryGender, getCategoryName } from "../utils/format.js";

export default function HomePage() {
  const dispatch = useDispatch();
  const { categories, productList, fetchState } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts({ limit: 8, offset: 0 }));
  }, [dispatch]);

  const topCategories = [...categories].sort((a, b) => b.rating - a.rating).slice(0, 5);

  return (
    <div className="flex flex-col">
      <Slider />

      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
        <div className="flex flex-col gap-2 text-center">
          <span className="text-sm font-bold text-muted">Öne Çıkan Kategoriler</span>
          <h2 className="text-2xl font-bold text-ink">En yüksek puanlı seçimler</h2>
        </div>
        <div className="flex flex-col gap-4 md:flex-row">
          {topCategories.map((category) => (
            <Link
              key={category.id}
              to={`/shop/${getCategoryGender(category)}/${getCategoryName(category)}/${category.id}`}
              className="flex flex-1 flex-col justify-between rounded-md border border-slate-200 bg-white p-5 hover:border-brand hover:shadow-lg"
            >
              <span className="text-lg font-bold text-ink">{category.title}</span>
              <span className="mt-5 text-sm font-bold text-brand">Puan {category.rating}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold text-muted">Ürünler</span>
              <h2 className="text-2xl font-bold text-ink">Çok satanlar</h2>
            </div>
            <Link to="/shop" className="text-sm font-bold text-brand hover:text-ink">
              Tümünü gör
            </Link>
          </div>
          {fetchState === "FETCHING" ? (
            <Spinner />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {productList.slice(0, 8).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  category={categories.find((category) => category.id === product.category_id)}
                  onAdd={(item) => dispatch(addToCart(item))}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
