import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { fetchRoles, signupUser } from "../store/actions.js";

export default function SignupPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const roles = useSelector((state) => state.client.roles);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  const selectedRole = Number(watch("role_id"));
  const selectedRoleName = roles.find((role) => role.id === selectedRole)?.name?.toLowerCase();
  const isStore = selectedRoleName?.includes("store") || selectedRoleName?.includes("mağaza");

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    const customerRole = roles.find((role) => role.name?.toLowerCase().includes("customer"));
    if (customerRole && !getValues("role_id")) {
      setValue("role_id", customerRole.id);
    }
  }, [roles, setValue, getValues]);

  const onSubmit = async (data) => {
    setLoading(true);
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      role_id: Number(data.role_id),
    };
    if (isStore) {
      payload.store = {
        name: data.store_name,
        phone: data.store_phone,
        tax_no: data.tax_no,
        bank_account: data.bank_account,
      };
    }
    try {
      await dispatch(signupUser(payload, history, location.state?.from || "/"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-10">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold text-muted">Hesap</span>
        <h1 className="text-3xl font-bold text-ink">Yeni Üyelik</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 rounded-md border border-slate-200 p-6">
        <Field label="Ad Soyad" error={errors.name?.message}>
          <input
            {...register("name", { required: "Ad soyad zorunlu.", minLength: { value: 3, message: "En az 3 karakter." } })}
            className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand"
          />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input
            {...register("email", {
              required: "Email zorunlu.",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Geçerli email girin." },
            })}
            className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand"
          />
        </Field>
        <Field label="Şifre" error={errors.password?.message}>
          <input
            type="password"
            {...register("password", {
              required: "Şifre zorunlu.",
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                message: "En az 8 karakter, büyük/küçük harf, sayı ve özel karakter içermeli.",
              },
            })}
            className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand"
          />
        </Field>
        <Field label="Şifre Tekrar" error={errors.passwordConfirm?.message}>
          <input
            type="password"
            {...register("passwordConfirm", {
              validate: (value) => value === watch("password") || "Şifreler eşleşmeli.",
            })}
            className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand"
          />
        </Field>
        <Field label="Rol" error={errors.role_id?.message}>
          <select
            defaultValue={roles.find((role) => role.name?.toLowerCase().includes("customer"))?.id || ""}
            {...register("role_id", { required: "Rol seçin." })}
            className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand"
          >
            <option value="">Rol seçin</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </Field>

        {isStore && (
          <div className="flex flex-col gap-5 rounded-md bg-paper p-4">
            <Field label="Mağaza Adı" error={errors.store_name?.message}>
              <input
                {...register("store_name", { required: isStore, minLength: { value: 3, message: "En az 3 karakter." } })}
                className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand"
              />
            </Field>
            <Field label="Telefon" error={errors.store_phone?.message}>
              <input
                {...register("store_phone", {
                  required: isStore,
                  pattern: { value: /^0?5\d{9}$/, message: "Türkiye cep telefonu girin." },
                })}
                className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand"
              />
            </Field>
            <Field label="Vergi No" error={errors.tax_no?.message}>
              <input
                {...register("tax_no", {
                  required: isStore,
                  pattern: { value: /^T\d{4}V\d{6}$/, message: "TXXXXVXXXXXX formatında olmalı." },
                })}
                className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand"
              />
            </Field>
            <Field label="IBAN" error={errors.bank_account?.message}>
              <input
                {...register("bank_account", {
                  required: isStore,
                  pattern: { value: /^TR\d{24}$/, message: "Geçerli TR IBAN girin." },
                })}
                className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand"
              />
            </Field>
          </div>
        )}

        <button
          disabled={loading}
          className="flex h-12 items-center justify-center rounded-md bg-brand text-sm font-bold text-white hover:bg-ink disabled:opacity-60"
        >
          {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : "Kayıt Ol"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-bold text-ink">
      {label}
      {children}
      {error && <span className="text-xs font-semibold text-danger">{error}</span>}
    </label>
  );
}
