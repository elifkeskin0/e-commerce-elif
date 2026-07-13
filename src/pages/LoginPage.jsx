import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/actions.js";

export default function LoginPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await dispatch(loginUser(data, history, location.state?.from || "/"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-8 px-6 py-10">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold text-muted">Hesap</span>
        <h1 className="text-3xl font-bold text-ink">Giriş Yap</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 rounded-md border border-slate-200 p-6">
        <label className="flex flex-col gap-2 text-sm font-bold text-ink">
          E-posta
          <input
            {...register("email", {
              required: "E-posta zorunlu.",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Geçerli e-posta girin." },
            })}
            className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand"
          />
          {errors.email && <span className="text-xs font-semibold text-danger">{errors.email.message}</span>}
        </label>
        <label className="flex flex-col gap-2 text-sm font-bold text-ink">
          Şifre
          <input
            type="password"
            {...register("password", { required: "Şifre zorunlu." })}
            className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand"
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-muted">
          <input type="checkbox" {...register("rememberMe")} className="h-4 w-4 accent-brand" />
          Beni hatırla
        </label>
        <button
          disabled={loading}
          className="flex h-12 items-center justify-center rounded-md bg-brand text-sm font-bold text-white hover:bg-ink disabled:opacity-60"
        >
          {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : "Giriş Yap"}
        </button>
        <Link to="/signup" className="text-center text-sm font-bold text-brand hover:text-ink">
          Yeni hesap oluştur
        </Link>
      </form>
    </div>
  );
}
