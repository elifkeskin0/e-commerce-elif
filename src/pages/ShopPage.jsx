import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard.jsx";
import Spinner from "../components/Spinner.jsx";
import { addToCart, fetchCategories, fetchProducts, setFilter, setOffset } from "../store/actions.js";

export default function ShopPage() {
  const dispatch = useDispatch();
  const { categoryId } = useParams();
  const { categories, productList, total, limit, offset, filter, fetchState } = useSelector(
    (state) => state.product
  );
  const [filterInput, setFilterInput] = useState(filter);
  const [sort, setSort] = useState("");

  const params = useMemo(
    () => ({
      category: categoryId,
      sort,
      filter,
      limit,
      offset,
    }),
    [categoryId, sort, filter, limit, offset]
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts(params));
  }, [dispatch, params]);

  const page = Math.floor(offset / limit) + 1;
  const maxPage = Math.max(1, Math.ceil(total / limit));

  const applyFilter = () => {
    dispatch(setOffset(0));
    dispatch(setFilter(filterInput));
  };

  const goPage = (nextPage) => {
    dispatch(setOffset((nextPage - 1) * limit));
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-muted">Shop</span>
          <h1 className="text-3xl font-bold text-ink">Ürünleri Keşfet</h1>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={filterInput}
            onChange={(event) => setFilterInput(event.target.value)}
            placeholder="Ürün ara"
            className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand"
          />
          <select
            value={sort}
            onChange={(event) => {
              dispatch(setOffset(0));
              setSort(event.target.value);
            }}
            className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand"
          >
            <option value="">Sıralama</option>
            <option value="price:asc">Fiyat Artan</option>
            <option value="price:desc">Fiyat Azalan</option>
            <option value="rating:asc">Puan Artan</option>
            <option value="rating:desc">Puan Azalan</option>
          </select>
          <button
            type="button"
            onClick={applyFilter}
            className="h-11 rounded-md bg-ink px-5 text-sm font-bold text-white hover:bg-brand"
          >
            Filtrele
          </button>
        </div>
      </div>

      {fetchState === "FETCHING" ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {productList.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              category={categories.find((category) => category.id === product.category_id)}
              onAdd={(item) => dispatch(addToCart(item))}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => goPage(page - 1)}
          className="h-10 rounded-md border border-slate-300 px-4 text-sm font-bold disabled:opacity-40"
        >
          Önceki
        </button>
        <span className="text-sm font-bold text-muted">
          {page} / {maxPage}
        </span>
        <button
          type="button"
          disabled={page === maxPage}
          onClick={() => goPage(page + 1)}
          className="h-10 rounded-md border border-slate-300 px-4 text-sm font-bold disabled:opacity-40"
        >
          Sonraki
        </button>
      </div>
    </div>
  );
}
