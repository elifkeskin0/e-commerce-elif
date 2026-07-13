import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "Elif Commerce",
    label: "Yeni sezon",
    text: "Moda, ev ve yaşam ürünlerini hızlı filtreleme, güvenli sepet ve akıcı sipariş deneyimiyle keşfet.",
    image: "https://cdn.dsmcdn.com/ty181/product/media/images/20210923/14/135755138/57457659/1/1_org_zoom.jpg",
  },
  {
    title: "Öne Çıkan Ürünler",
    label: "Çok satanlar",
    text: "Kategori, fiyat ve puana göre sıralayarak ihtiyacın olan ürüne daha hızlı ulaş.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Güvenli Sipariş",
    label: "Sipariş akışı",
    text: "Adres, kart ve sepet bilgilerini tek akış içinde yönet.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=80",
  },
];

export default function Slider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = slides[activeIndex];

  const goTo = (direction) => {
    setActiveIndex((current) => (current + direction + slides.length) % slides.length);
  };

  return (
    <section className="bg-[#EAF6FF]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:py-16">
        <div className="flex flex-1 flex-col gap-6">
          <span className="text-sm font-bold uppercase text-brand">{slide.label}</span>
          <h1 className="max-w-xl text-4xl font-bold leading-tight text-ink md:text-6xl">
            {slide.title}
          </h1>
          <p className="max-w-lg text-base leading-7 text-muted">{slide.text}</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => goTo(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 bg-white text-ink hover:border-brand hover:text-brand"
              aria-label="Önceki slayt"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(1)}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 bg-white text-ink hover:border-brand hover:text-brand"
              aria-label="Sonraki slayt"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex flex-1 justify-center">
          <img
            src={slide.image}
            alt={slide.title}
            className="max-h-[460px] w-full max-w-sm rounded-md object-cover shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
