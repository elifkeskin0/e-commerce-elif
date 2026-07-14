import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-3">
          <span className="text-2xl font-bold text-ink">Elif Ticaret</span>
          <p className="max-w-sm text-sm leading-6 text-muted">
            Günlük alışveriş akışını sade, hızlı ve güvenli hale getiren e-ticaret deneyimi.
          </p>
          <div className="flex gap-3 text-brand">
            <Instagram className="h-5 w-5" />
            <Facebook className="h-5 w-5" />
            <Twitter className="h-5 w-5" />
          </div>
        </div>
        <div className="flex flex-wrap gap-10 text-sm">
          <div className="flex flex-col gap-2">
            <span className="font-bold text-ink">Sayfalar</span>
            <span className="text-muted">Mağaza</span>
            <span className="text-muted">Ekip</span>
            <span className="text-muted">İletişim</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-bold text-ink">Destek</span>
            <span className="text-muted">Siparişler</span>
            <span className="text-muted">Adresler</span>
            <span className="text-muted">Kartlar</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
