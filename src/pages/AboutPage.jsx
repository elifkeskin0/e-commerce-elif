import { Award, ShieldCheck, Truck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-center">
          <div className="flex flex-1 flex-col gap-4">
            <span className="text-sm font-bold text-muted">Hakkımızda</span>
            <h1 className="text-3xl font-bold leading-tight text-ink md:text-5xl">Elif Ticaret alışverişi sadeleştirir.</h1>
            <p className="text-sm leading-7 text-muted">
              Bu proje Workintech e-commerce görevleri için React, Redux, Thunk, Router v5, Tailwind ve canlı API entegrasyonuyla geliştirilen modern bir alışveriş uygulamasıdır.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80"
            alt="E-commerce operasyon"
            className="max-h-[420px] flex-1 rounded-md object-cover"
          />
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-6 py-12 md:grid-cols-3">
        {[
          { icon: Truck, title: "Hızlı Teslimat", text: "Sepetten siparişe kadar akıcı alışveriş." },
          { icon: ShieldCheck, title: "Güvenli İşlem", text: "Token tabanlı giriş ve korumalı sipariş sayfaları." },
          { icon: Award, title: "Kaliteli Deneyim", text: "Mobil öncelikli, sade ve tutarlı arayüz." },
        ].map((item) => (
          <div key={item.title} className="flex flex-col gap-4 rounded-md border border-slate-200 p-6">
            <item.icon className="h-8 w-8 text-brand" />
            <span className="font-bold text-ink">{item.title}</span>
            <span className="text-sm leading-6 text-muted">{item.text}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
