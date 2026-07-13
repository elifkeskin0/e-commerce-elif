import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
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
import OrderSummary from "../components/OrderSummary.jsx";

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
            <button className={`h-10 rounded-md px-4 text-sm font-bold ${step === 1 ? "bg-brand text-white" : "bg-paper text-muted"}`} onClick={() => setStep(1)}>
              Adres
            </button>
            <button className={`h-10 rounded-md px-4 text-sm font-bold ${step === 2 ? "bg-brand text-white" : "bg-paper text-muted"}`} onClick={() => setStep(2)}>
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
                      <p className="mt-2 text-muted">{item.city} / {item.district}</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => dispatch(deleteAddress(item.id))}
                      className="w-fit text-xs font-bold text-danger hover:text-ink"
                    >
                      Sil
                    </button>
                  </div>
                ))}
              </div>
              <form
                onSubmit={addressForm.handleSubmit(async (data) => {
                  await dispatch(saveAddress(data));
                  addressForm.reset();
                })}
                className="grid grid-cols-1 gap-3 md:grid-cols-2"
              >
                {["title", "name", "surname", "phone", "city", "district", "neighborhood"].map((name) => (
                  <input
                    key={name}
                    placeholder={name}
                    {...addressForm.register(name, { required: true })}
                    className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand"
                  />
                ))}
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
                    <button
                      type="button"
                      onClick={() => dispatch(deleteCreditCard(card.id))}
                      className="w-fit text-xs font-bold text-danger hover:text-ink"
                    >
                      Sil
                    </button>
                  </div>
                ))}
              </div>
              <form
                onSubmit={cardForm.handleSubmit(async (data) => {
                  await dispatch(saveCreditCard(data));
                  dispatch(setPayment(data));
                })}
                className="grid grid-cols-1 gap-3 md:grid-cols-2"
              >
                <input placeholder="card_no" {...cardForm.register("card_no", { required: true })} className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand" />
                <input placeholder="name_on_card" {...cardForm.register("name_on_card", { required: true })} className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand" />
                <input placeholder="expire_month" {...cardForm.register("expire_month", { required: true })} className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand" />
                <input placeholder="expire_year" {...cardForm.register("expire_year", { required: true })} className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand" />
                <input placeholder="ccv" {...cardForm.register("card_ccv", { required: true })} className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand" />
                <button className="h-11 rounded-md bg-ink text-sm font-bold text-white hover:bg-brand">Kart Kaydet</button>
              </form>
              <button onClick={completeOrder} className="h-12 rounded-md bg-brand text-sm font-bold text-white hover:bg-ink">
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
