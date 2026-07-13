import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
      <div className="flex flex-col gap-2 text-center">
        <span className="text-sm font-bold text-muted">İletişim</span>
        <h1 className="text-3xl font-bold text-ink">Bize Ulaşın</h1>
        <p className="mx-auto max-w-2xl text-sm leading-6 text-muted">
          Sipariş, üyelik ve ürün deneyimiyle ilgili sorularınız için destek ekibimize yazabilirsiniz.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {[
          { icon: Mail, title: "E-posta", text: "support@elifticaret.com" },
          { icon: Phone, title: "Telefon", text: "+90 555 000 00 00" },
          { icon: MapPin, title: "Adres", text: "İstanbul, Türkiye" },
        ].map((item) => (
          <div key={item.title} className="flex flex-col items-center gap-4 rounded-md border border-slate-200 p-8 text-center">
            <item.icon className="h-8 w-8 text-brand" />
            <span className="font-bold text-ink">{item.title}</span>
            <span className="text-sm text-muted">{item.text}</span>
          </div>
        ))}
      </div>
      <form className="mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-md border border-slate-200 p-6">
        <input placeholder="Ad Soyad" className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand" />
        <input placeholder="E-posta" className="h-11 rounded-md border border-slate-300 px-4 text-sm outline-none focus:border-brand" />
        <textarea placeholder="Mesajınız" rows="5" className="rounded-md border border-slate-300 p-4 text-sm outline-none focus:border-brand" />
        <button type="button" className="h-11 rounded-md bg-brand text-sm font-bold text-white hover:bg-ink">
          Gönder
        </button>
      </form>
    </div>
  );
}
