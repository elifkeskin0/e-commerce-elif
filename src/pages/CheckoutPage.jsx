import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import OrderSummary from "../components/OrderSummary.jsx";
import {
  createOrder,
  deleteAddress,
  deleteCreditCard,
  fetchAddressList,
  fetchCreditCards,
  saveAddress,
  saveCreditCard,
  setAddress,
  setPayment,
} from "../store/actions.js";

const cities = ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya", "Adana", "Konya"];

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { cart, address, payment } = useSelector((state) => state.shoppingCart);
  const { addressList, creditCards } = useSelector((state) => state.client);
  const [step, setStep] = useState(1);
  const addressForm = useForm();
  const cardForm = useForm();

  useEffect(() => {
    dispatch(fetchAddressList());
    dispatch(fetchCreditCards());
  }, [dispatch]);

  const selectedItems = cart.filter((item) => item.checked);
  const price = selectedItems.reduce((sum, item) => sum + item.count * item.product.price, 0);

  const editAddress = (item) => {
    Object.entries(item).forEach(([key, value]) => addressForm.setValue(key, value));
  };

  const editCard = (card) => {
    Object.entries(card).forEach(([key, value]) => cardForm.setValue(key, value));
  };

  const submitAddress = async (data) => {
    await dispatch(saveAddress(data));
    addressForm.reset();
  };

  const submitCard = async (data) => {
    const payload = {
      ...(data.id ? { id: data.id } : {}),
      card_no: data.card_no,
      expire_month: Number(data.expire_month),
      expire_year: Number(data.expire_year),
      name_on_card: data.name_on_card,
    };
    await dispatch(saveCreditCard(payload));
    dispatch(setPayment({ ...payload, card_ccv: data.card_ccv }));
    cardForm.reset();
  };

  const completeOrder = () => {
    if (!selectedItems.length) {
      toast.error("Sipariş için en az bir ürün seçmelisiniz.");
      return;
    }
    if (!address.id) {
      toast.error("Lütfen bir adres seçin.");
      setStep(1);
      return;
    }
    if (!payment.card_no) {
      toast.error("Lütfen kart bilgisi seçin veya kaydedin.");
      setStep(2);
      return;
    }

    dispatch(
      createOrder(
        {
          address_id: address.id,
          order_date: new Date().toISOString().slice(0, 19),
          card_no: Number(payment.card_no),
          card_name: payment.name_on_card,
          card_expire_month: Number(payment.expire_month),
          card_expire_year: Number(payment.expire_year),
          card_ccv: Number(payment.card_ccv || 321),
          price,
          products: selectedItems.map((item) => ({
            product_id: item.product.id,
            count: item.count,
            detail: item.product.name,
          })),
        },
        history
      )
    );
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold text-muted">Sipariş</span>
        <h1 className="text-3xl font-bold text-ink">Sipariş Oluştur</h1>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex gap-3">
            <button
              type="button"
              className={`h-10 rounded-md px-4 text-sm font-bold ${step === 1 ? "bg-brand text-white" : "bg-paper text-muted"}`}
              onClick={() => setStep(1)}
            >
              Adres
            </button>
            <button
              type="button"
              className={`h-10 rounded-md px-4 text-sm font-bold ${step === 2 ? "bg-brand text-white" : "bg-paper text-muted"}`}
              onClick={() => setStep(2)}
            >
              Kart
            </button>
          </div>

          {step === 1 && (
            <section className="flex flex-col gap-5 rounded-md border border-slate-200 p-5">
              <h2 className="text-lg font-bold text-ink">Adres Seçimi</h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {addressList.map((item) => (
                  <div
                    key={item.id}
                    className={`flex flex-col gap-3 rounded-md border p-4 text-left text-sm ${address.id === item.id ? "border-brand" : "border-slate-200"}`}
                  >
                    <button type="button" onClick={() => dispatch(setAddress(item))} className="text-left">
                      <span className="font-bold text-ink">{item.title}</span>
                      <p className="mt-2 text-muted">
                        {item.city} / {item.district}
                      </p>
                    </button>
                    <div className="flex gap-4">
                      <button type="button" onClick={() => editAddress(item)} className="text-xs font-bold text-brand">
                        Düzenle
                      </button>
                      <button
                        type="button"
                        onClick={() => dispatch(deleteAddress(item.id))}
                        className="text-xs font-bold text-danger"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={addressForm.handleSubmit(submitAddress)} className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <input type="hidden" {...addressForm.register("id")} />
                <input placeholder="Adres başlığı" {...addressForm.register("title", { required: true })} className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand" />
                <input placeholder="Ad" {...addressForm.register("name", { required: true })} className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand" />
                <input placeholder="Soyad" {...addressForm.register("surname", { required: true })} className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand" />
                <input placeholder="Telefon" {...addressForm.register("phone", { required: true, pattern: /^0?5\d{9}$/ })} className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand" />
                <select {...addressForm.register("city", { required: true })} className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand">
                  <option value="">Şehir</option>
                  {cities.map((city) => (
                    <option key={city} value={city.toLowerCase()}>
                      {city}
                    </option>
                  ))}
                </select>
                <input placeholder="İlçe" {...addressForm.register("district", { required: true })} className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand" />
                <input placeholder="Mahalle ve adres detayı" {...addressForm.register("neighborhood", { required: true })} className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand md:col-span-2" />
                <button className="h-11 rounded-md bg-ink text-sm font-bold text-white hover:bg-brand">Adres Kaydet</button>
                <button type="button" onClick={() => setStep(2)} className="h-11 rounded-md bg-brand text-sm font-bold text-white hover:bg-ink">
                  Kart Adımına Geç
                </button>
              </form>
            </section>
          )}

          {step === 2 && (
            <section className="flex flex-col gap-5 rounded-md border border-slate-200 p-5">
              <h2 className="text-lg font-bold text-ink">Kart Bilgileri</h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {creditCards.map((card) => (
                  <div
                    key={card.id}
                    className={`flex flex-col gap-3 rounded-md border p-4 text-left text-sm ${payment.id === card.id ? "border-brand" : "border-slate-200"}`}
                  >
                    <button type="button" onClick={() => dispatch(setPayment(card))} className="text-left">
                      <span className="font-bold text-ink">{card.name_on_card}</span>
                      <p className="mt-2 text-muted">**** **** **** {String(card.card_no).slice(-4)}</p>
                    </button>
                    <div className="flex gap-4">
                      <button type="button" onClick={() => editCard(card)} className="text-xs font-bold text-brand">
                        Düzenle
                      </button>
                      <button
                        type="button"
                        onClick={() => dispatch(deleteCreditCard(card.id))}
                        className="text-xs font-bold text-danger"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={cardForm.handleSubmit(submitCard)} className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <input type="hidden" {...cardForm.register("id")} />
                <input placeholder="Kart numarası" {...cardForm.register("card_no", { required: true, pattern: /^\d{16}$/ })} className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand" />
                <input placeholder="Kart üzerindeki ad" {...cardForm.register("name_on_card", { required: true })} className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand" />
                <input placeholder="Son kullanma ayı" type="number" {...cardForm.register("expire_month", { required: true, min: 1, max: 12 })} className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand" />
                <input placeholder="Son kullanma yılı" type="number" {...cardForm.register("expire_year", { required: true, min: 2025 })} className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand" />
                <input placeholder="Güvenlik kodu" {...cardForm.register("card_ccv", { required: true, pattern: /^\d{3}$/ })} className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand" />
                <button className="h-11 rounded-md bg-ink text-sm font-bold text-white hover:bg-brand">Kart Kaydet</button>
              </form>

              <button type="button" onClick={completeOrder} className="h-12 rounded-md bg-brand text-sm font-bold text-white hover:bg-ink">
                Siparişi Tamamla
              </button>
            </section>
          )}
        </div>
        <OrderSummary cart={cart} actionTo="/checkout" />
      </div>
    </div>
  );
}
