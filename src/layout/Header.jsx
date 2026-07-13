import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, LogOut, Menu, ShoppingCart, User, X } from "lucide-react";
import { fetchCategories, logoutUser } from "../store/actions.js";
import { currency, getCategoryGender, getCategoryName, gravatarUrl } from "../utils/format.js";

const navItems = [
  { to: "/", label: "Home", exact: true },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/team", label: "Team" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.client);
  const { cart } = useSelector((state) => state.shoppingCart);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const cartCount = cart.reduce((sum, item) => sum + item.count, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.count * item.product.price, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="text-xl font-bold text-ink">
          Elif Commerce
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-bold text-muted md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              exact={item.exact}
              activeClassName="text-brand"
              className="hover:text-brand"
            >
              {item.label}
            </NavLink>
          ))}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShopOpen((value) => !value)}
              className="flex items-center gap-1 hover:text-brand"
            >
              Categories
              <ChevronDown className="h-4 w-4" />
            </button>
            {shopOpen && (
              <div className="absolute left-0 top-9 flex w-[520px] gap-8 rounded-md border border-slate-200 bg-white p-5 shadow-xl">
                {["kadin", "erkek"].map((gender) => (
                  <div key={gender} className="flex flex-1 flex-col gap-2">
                    <span className="text-xs uppercase tracking-wide text-muted">
                      {gender === "kadin" ? "Kadın" : "Erkek"}
                    </span>
                    {categories
                      .filter((category) => getCategoryGender(category) === gender)
                      .slice(0, 8)
                      .map((category) => (
                        <Link
                          key={category.id}
                          to={`/shop/${gender}/${getCategoryName(category)}/${category.id}`}
                          className="text-sm font-semibold text-ink hover:text-brand"
                          onClick={() => setShopOpen(false)}
                        >
                          {category.title}
                        </Link>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden items-center gap-2 md:flex">
              <img
                src={gravatarUrl(user.email)}
                alt={user.name || user.email}
                className="h-8 w-8 rounded-full"
              />
              <Link to="/orders" className="text-sm font-bold text-ink hover:text-brand">
                {user.name || user.email}
              </Link>
              <button
                type="button"
                onClick={() => dispatch(logoutUser())}
                className="rounded-md p-2 text-muted hover:bg-slate-100 hover:text-danger"
                title="Çıkış yap"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden items-center gap-2 text-sm font-bold text-brand md:flex"
            >
              <User className="h-4 w-4" />
              Login
            </Link>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() => setCartOpen((value) => !value)}
              className="relative rounded-md p-2 text-ink hover:bg-slate-100"
              title="Sepet"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
            {cartOpen && (
              <div className="absolute right-0 top-12 flex w-80 flex-col gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-xl">
                <span className="text-sm font-bold text-ink">Sepetim</span>
                {cart.length === 0 ? (
                  <span className="text-sm text-muted">Sepet boş.</span>
                ) : (
                  cart.slice(0, 4).map((item) => (
                    <div key={item.product.id} className="flex gap-3 text-sm">
                      <img
                        src={item.product.images?.[0]?.url}
                        alt={item.product.name}
                        className="h-12 w-10 rounded object-cover"
                      />
                      <div className="flex flex-1 flex-col">
                        <span className="line-clamp-1 font-semibold text-ink">{item.product.name}</span>
                        <span className="text-muted">
                          {item.count} x {currency(item.product.price)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-sm font-bold">
                  <span>Toplam</span>
                  <span>{currency(cartTotal)}</span>
                </div>
                <Link
                  to="/cart"
                  onClick={() => setCartOpen(false)}
                  className="flex h-10 items-center justify-center rounded-md bg-brand text-sm font-bold text-white hover:bg-ink"
                >
                  Sepete Git
                </Link>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="rounded-md p-2 text-ink hover:bg-slate-100 md:hidden"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-5 text-sm font-bold text-muted md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              exact={item.exact}
              activeClassName="text-brand"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          {user ? (
            <button
              type="button"
              onClick={() => {
                dispatch(logoutUser());
                setMenuOpen(false);
              }}
              className="text-left text-danger"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="text-brand">
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
