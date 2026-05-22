import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { PlatformCard } from "@/components/PlatformCard";
import { Platform, Service } from "@/lib/localStorage";
import {
  getPlatforms as fetchPlatforms,
  getMostRequested as fetchMostRequested,
  getServices as fetchServices,
} from "@/lib/db";
import { Search, Shield, Clock, Award, Headphones, Send, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useLocale } from "@/contexts/LocaleContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { testimonialsData } from "@/data/testimonials";
import useEmblaCarousel from "embla-carousel-react";

const AVATAR_POOL = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80"
];

const getAvatarUrl = (username: string) => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash += username.charCodeAt(i);
  }
  return AVATAR_POOL[hash % AVATAR_POOL.length];
};

const Index = () => {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [most, setMost] = useState<Array<{ service_id: string; visible: boolean }>>([]);
  const [services, setServices] = useState<Service[]>([]);
  const { t, locale } = useLocale();
  const { currency } = useCurrency();
  const phoneDisplay = currency === "EGP" ? "+20 109 290 2885" : "+966 50 516 3956";
  const whatsappNumber = currency === "EGP" ? "201092902885" : "966505163956";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    direction: locale === "ar" ? "rtl" : "ltr",
  });

  const handlePrevReview = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const handleNextReview = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    document.title =
      locale === "ar"
        ? "bedo elmasry | تزويد متابعين | خدمات سوشيال ميديا"
        : "bedo elmasry | Social Media Growth Services";

    const desc =
      locale === "ar"
        ? "bedo elmasry: تزويد متابعين، زيادة تفاعل، لايكات ومشاهدات، دعم حسابات، تسويق إلكتروني، وإعلانات ممولة. الرد عبر واتساب."
        : "bedo elmasry: followers, likes, views, account support, content marketing, and paid ads. Reply via WhatsApp.";

    const metaDesc = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;
    if (metaDesc) metaDesc.content = desc;
  }, [locale]);

  useEffect(() => {
    const load = async () => {
      const platRes = await fetchPlatforms();
      const platArr = Array.isArray(platRes?.data) ? (platRes.data as Platform[]) : [];
      const normalize = (value: string) =>
        (value || "")
          .toLowerCase()
          .replace(/[\s\-_]+/g, "")
          .trim();

      const preferred = [
        ["instagram", "instagram", "انستجرام", "انستجرام"],
        ["tiktok", "tik tok", "تيك توك", "تيكتوك"],
        ["facebook", "face book", "فيس بوك", "فيسبوك"],
        ["youtube", "you tube", "يوتيوب"],
        ["snapchat", "snap chat", "سناب شات", "سنابشات"],
        ["whatsapp", "what'sapp", "واتس اب", "واتساب"],
      ].map((aliases) => aliases.map(normalize));

      const getPreferredRank = (p: Platform) => {
        const n = normalize(`${p.name} ${p.description}`);
        const idx = preferred.findIndex((aliases) =>
          aliases.some((a) => a && n.includes(a))
        );
        return idx === -1 ? preferred.length : idx;
      };

      const sortedPlatforms = platArr
         .map((p, idx) => ({ p, idx, rank: getPreferredRank(p) }))
         .sort((a, b) => a.rank - b.rank || a.idx - b.idx)
         .map((x) => x.p);

      setPlatforms(sortedPlatforms);
      const mostRes = await fetchMostRequested();
      const mostArr = Array.isArray(mostRes?.data)
        ? (mostRes.data as Array<{ service_id: string; visible: boolean }>)
        : [];
      setMost(mostArr);
      const svcRes = await fetchServices();
      const svcArr = Array.isArray(svcRes?.data) ? (svcRes.data as Service[]) : [];
      setServices(svcArr);
    };
    load();
  }, []);

  const filteredPlatforms = platforms.filter(
    (platform) =>
      platform.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      platform.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen metal-mesh-bg text-muted-foreground font-sans antialiased pb-12">
      <Navbar />

      {/* ============ Hero Section ============ */}
      <section className="py-10 px-4" id="hero">
        <div className="container mx-auto max-w-6xl">
          <div className="chrome-bezel rounded-[28px] overflow-hidden p-2 shadow-2xl">
            <div className="metal-brushed p-6 md:p-12 flex flex-col-reverse md:flex-row items-center justify-between gap-8 rounded-[20px] relative min-h-[400px]">
              
              {/* Right Side: Arabic Headline & Metallic Glowing CTA (1st in JSX for RTL Right side alignment on desktop) */}
              <div className="flex-1 text-right flex flex-col items-end z-10 w-full">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-8 leading-tight tracking-wide text-right font-heading metal-text-embossed">
                  {locale === "ar" 
                    ? "عزز تواجدك الرقمي بقوة وأمان: تزويد متابعين، لايكات، مشاهدات" 
                    : "Enhance your digital presence with power and safety: followers, likes, views"}
                </h1>
                
                <button 
                  onClick={() => {
                    document.getElementById("platforms")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="metal-btn-blue px-10 py-4 text-lg md:text-xl font-bold flex items-center gap-3 transition-transform hover:scale-105"
                >
                  <span>{locale === "ar" ? "اكتشف الخدمات" : "Discover Services"}</span>
                </button>
              </div>

              {/* Left Side: Glowing 3D iPhone display inside a dark dashboard screen (2nd in JSX for RTL Left side alignment on desktop) */}
              <div className="flex-1 w-full flex items-center justify-center relative select-none z-10">
                <div className="chrome-bezel p-[6px] rounded-[24px] shadow-2xl relative w-full max-w-[320px] aspect-[4/5] flex items-center justify-center bg-[#050505]">
                  <img 
                    src="/hero_phone_mockup.png" 
                    alt="Phone Mockup" 
                    className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] animate-float rounded-[18px]"
                  />
                  {/* Decorative glowing blue orb behind the phone */}
                  <div className="absolute w-[200px] h-[200px] rounded-full bg-[#00bfff]/25 blur-[60px] -z-10 animate-pulse pointer-events-none" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ============ Most Requested Section ============ */}
      {most.length > 0 && services.length > 0 && (
        <section className="py-8 px-4" id="most-requested">
          <div className="container mx-auto max-w-6xl">
            <div className="chrome-bezel rounded-[28px] p-2 shadow-xl">
              <div className="metal-brushed-dark p-6 rounded-[20px]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <span className="text-[#00bfff]">✦</span>
                    {t("mostRequestedTitle")}
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {most
                    .slice(0, 6)
                    .map((m) => {
                      const s = services.find((x) => x.id === (m as any).service_id);
                      if (!s || !m.visible) return null;
                      return (
                        <Link key={s.id} to={`/service/${s.id}`} className="block">
                          <div className="p-3 bg-gradient-to-b from-[#25282d] to-[#121316] border border-[#3b3f46] hover:border-[#00bfff]/50 rounded-[12px] transition-all hover:scale-[1.02] flex items-center gap-3 shadow-md">
                            <img
                              src={s.image}
                              alt={s.title}
                              className="w-14 h-14 rounded-md object-cover border border-[#484c55]"
                            />
                            <div className="flex-1 text-right">
                              <div className="font-bold text-white text-sm">
                                {s.title}
                              </div>
                              <div className="text-[11px] text-white/50 mt-1">
                                {t("avgDeliveryLabel")} {s.deliveryTime}
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============ Platforms Grid ============ */}
      <section className="py-16 px-4" id="platforms">
        <div className="container mx-auto max-w-6xl">
          
          {/* Section Header styled as a nice chrome-framed steel plate */}
          <div className="flex justify-center mb-14">
            <div className="chrome-bezel rounded-[20px] p-1 shadow-md inline-block">
              <div className="metal-brushed px-8 py-3 rounded-[14px]">
                <h2 className="text-2xl md:text-3xl font-black tracking-wide font-heading text-center metal-text-embossed">
                  {t("choosePlatformTitle")}
                </h2>
              </div>
            </div>
          </div>

          {/* Search Bar - Recessed Metallic Slot */}
          <div className="max-w-md mx-auto relative mb-12 px-2">
            <div className="chrome-bezel rounded-[20px] p-[3px] shadow-sm">
              <div className="relative flex items-center bg-[#15171a] rounded-[15px] overflow-hidden border border-[#303338] px-3 shadow-inner">
                <Search className="text-white/40 w-5 h-5 ml-2" />
                <input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 bg-transparent text-white placeholder-white/30 border-none outline-none text-sm text-right font-medium"
                />
              </div>
            </div>
          </div>

          {/* Grid list of dynamic Platform Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlatforms.map((platform, index) => (
              <div
                key={platform.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PlatformCard platform={platform} />
              </div>
            ))}
          </div>

          {filteredPlatforms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/50 text-lg font-medium">
                {t("noPlatformsFound")}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ============ Features Section ("لماذا نحن؟") ============ */}
      <section className="py-16 px-4" id="features">
        <div className="container mx-auto max-w-5xl">
          
          <div className="flex justify-center mb-14">
            <div className="chrome-bezel rounded-[20px] p-1 shadow-md inline-block">
              <div className="metal-brushed px-8 py-3 rounded-[14px]">
                <h2 className="text-2xl md:text-3xl font-black tracking-wide font-heading text-center metal-text-embossed">
                  {locale === "ar" ? "لماذا نحن؟" : "Why Us?"}
                </h2>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 justify-items-center">
            {[
              { icon: Clock, label: locale === "ar" ? "تسليم فوري" : "Fast Delivery" },
              { icon: Shield, label: locale === "ar" ? "آمن وفعال" : "Safe & Effective" },
              { icon: Award, label: locale === "ar" ? "ضمان التعويض" : "Refill Guarantee" },
              { icon: Headphones, label: locale === "ar" ? "دعم 24/7" : "24/7 Support" },
            ].map(({ icon: Icon, label }, idx) => (
              <div
                key={label}
                className="flex flex-col items-center text-center animate-scale-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Custom Steel Shield with Bevels - containing both Icon and Label */}
                <div className="steel-shield shadow-lg group cursor-default">
                  <Icon className="w-8 h-8 text-[#dcdfe3] drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.85)]" />
                  <span className="font-heading font-black text-white text-[11px] md:text-xs mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]">
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Customer Reviews ("آراء العملاء") ============ */}
      <section className="py-16 px-4" id="testimonials">
        <div className="container mx-auto max-w-6xl">
          
          <div className="flex justify-center mb-14">
            <div className="chrome-bezel rounded-[20px] p-1 shadow-md inline-block">
              <div className="metal-brushed px-8 py-3 rounded-[14px]">
                <h2 className="text-2xl md:text-3xl font-black tracking-wide font-heading text-center metal-text-embossed">
                  {locale === "ar" ? "آراء العملاء" : "Customer Reviews"}
                </h2>
              </div>
            </div>
          </div>

          {/* Testimonial Grid matching the 3 cards and navigation arrows in the image */}
          <div className="flex items-center gap-4 max-w-5xl mx-auto w-full">
            {/* Left Nav Arrow */}
            <button 
              onClick={handlePrevReview}
              className="flex w-10 h-10 rounded-full items-center justify-center bg-gradient-to-br from-[#ebedf0] to-[#9ba0a7] border border-[#a3a7ae] text-[#1a1c1f] shadow-md hover:brightness-110 active:scale-95 transition-all shrink-0 z-10"
            >
              <span className="text-lg font-bold">{"<"}</span>
            </button>

            {/* Embla Viewport */}
            <div className="overflow-hidden flex-1" ref={emblaRef}>
              <div className="flex">
                {testimonialsData.map((item, idx) => (
                  <div 
                    key={item.username + "-" + idx} 
                    className="flex-[0_0_100%] min-w-0 md:flex-[0_0_33.333%] px-3 shrink-0"
                  >
                    <div className="chrome-bezel rounded-[22px] p-2 shadow-lg h-full">
                      <div className="metal-brushed p-5 rounded-[16px] flex flex-col items-center text-center gap-3 h-full justify-between">
                        <div className="flex flex-col items-center gap-3 w-full">
                          {/* Chrome Porthole Avatar Frame */}
                          <div className="avatar-porthole-chrome">
                            <img 
                              src={getAvatarUrl(item.username)} 
                              alt={item.username} 
                              className="w-14 h-14 rounded-full object-cover border border-[#4a4e55]"
                            />
                          </div>
                          
                          {/* Stars */}
                          <div className="flex gap-1">
                            {Array.from({ length: item.rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-500 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
                            ))}
                          </div>

                          <p className="text-[#1a1b1d] text-xs font-semibold leading-relaxed my-2 italic max-h-[72px] overflow-y-auto w-full scrollbar-thin" dir="auto">
                            "{item.text}"
                          </p>
                        </div>
                        
                        <a 
                          href={item.commentUrl || "https://www.instagram.com/p/CluLi4_rQUD/"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-heading font-black text-sm text-[#1a1b1d] hover:text-[#00bfff] hover:underline border-t border-[#000000]/10 pt-2 w-full font-sans select-all transition-colors duration-200 block"
                        >
                          @{item.username}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Nav Arrow */}
            <button 
              onClick={handleNextReview}
              className="flex w-10 h-10 rounded-full items-center justify-center bg-gradient-to-br from-[#ebedf0] to-[#9ba0a7] border border-[#a3a7ae] text-[#1a1c1f] shadow-md hover:brightness-110 active:scale-95 transition-all shrink-0 z-10"
            >
              <span className="text-lg font-bold">{">"}</span>
            </button>
          </div>

        </div>
      </section>

      {/* ============ Trust Section (Metallic Stats counters) ============ */}
      <section className="py-16 px-4" id="stats">
        <div className="container mx-auto max-w-5xl">
          <div className="chrome-bezel rounded-[28px] p-2 shadow-xl">
            <div className="metal-brushed-dark p-8 rounded-[20px]">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { value: "50K+", label: "happyCustomers", delay: "0s" },
                  { value: "99%", label: "satisfactionRate", delay: "0.1s" },
                  { value: "1M+", label: "ordersCompleted", delay: "0.2s" },
                  { value: "100%", label: "safeSecure", delay: "0.3s" },
                ].map(({ value, label, delay }) => (
                  <div
                    key={label}
                    className="animate-scale-in"
                    style={{ animationDelay: delay }}
                  >
                    <div className="text-3xl md:text-4xl font-black font-heading stat-value mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      {value}
                    </div>
                    <div className="text-white/50 text-xs font-semibold">{t(label)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Footer ============ */}
      <footer className="pt-12 px-4" id="contact">
        <div className="container mx-auto max-w-6xl">
          
          <div className="chrome-bezel rounded-[28px] p-[8px] shadow-2xl">
            <div className="metal-brushed p-6 md:p-8 rounded-[20px] flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Payment Logos (Left) */}
              <div className="flex flex-col gap-2 select-none items-center md:items-start justify-center">
                <div className="flex gap-2 items-center justify-center">
                  {["VISA", "Mastercard", "PayPal"].map((brand) => (
                    <div key={brand} className="px-3 py-1.5 bg-[#050505] border border-[#3b3d42] rounded-[6px] shadow-inner select-none min-w-[70px] text-center">
                      <span className="text-[11px] font-black text-white/90 tracking-wide font-sans">{brand}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 items-center justify-center">
                  {["Apple Pay", "Mada", "BSO"].map((brand) => (
                    <div key={brand} className="px-3 py-1.5 bg-[#050505] border border-[#3b3d42] rounded-[6px] shadow-inner select-none min-w-[70px] text-center">
                      <span className="text-[11px] font-black text-white/90 tracking-wide font-sans">{brand}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Info (Center) */}
              <div className="text-center md:text-right flex flex-col items-center md:items-end gap-1 text-[#1a1b1e]">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black tracking-wide font-heading">info@bedoelmasry.com</span>
                  <svg className="w-4 h-4 text-[#1a1b1e]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black tracking-wide font-heading font-sans select-all">{phoneDisplay}</span>
                  <svg className="w-4 h-4 text-[#1a1b1e]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.168-5.168-3.511-6.336-6.336l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black tracking-wide font-heading">www.bedoelmasry.com</span>
                  <svg className="w-4 h-4 text-[#1a1b1e]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-.778.099-1.533.284-2.253" />
                  </svg>
                </div>
              </div>

              {/* WhatsApp Button (Right) */}
              <div className="flex items-center gap-3">
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="metal-btn px-8 py-3 text-base font-black flex items-center justify-center gap-3 transition-transform hover:scale-105 border-2 border-[#585c63]"
                >
                  <span>{locale === "ar" ? "تواصل واتساب" : "Contact WhatsApp"}</span>
                </a>
                {/* Skeuomorphic 3D WhatsApp orb next to it */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ebedf0] to-[#9ba0a7] border-2 border-[#00bfff] shadow-[0_0_20px_rgba(0,191,255,0.7)] flex items-center justify-center cursor-pointer transition-transform hover:scale-110 animate-pulse"
                >
                  <div className="w-10 h-10 rounded-full bg-[#25d366] flex items-center justify-center shadow-inner">
                    <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.714-1.466L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966a9.782 9.782 0 0 0-6.974-2.85C6.208 1.99 1.782 6.36 1.778 11.788c-.001 1.632.455 3.224 1.32 4.622l-.995 3.635 3.738-.979z" />
                    </svg>
                  </div>
                </a>
              </div>

            </div>
          </div>

          {/* Programmer Credits Bottom Bar */}
          <div className="mt-8 text-center text-xs text-[#7a7a7a] font-semibold select-none flex flex-col md:flex-row items-center justify-between px-4 pb-8 gap-3 border-t border-[#1a1b1d]/40 pt-6">
            <div>
              {locale === "ar" 
                ? "© جميع الحقوق محفوظة لـ بيدو المصري" 
                : "© All rights reserved to Bedo Elmasry"} {new Date().getFullYear()}
            </div>
            <div className="flex items-center gap-1.5">
              <span>{locale === "ar" ? "تم التطوير بواسطة" : "Developed by"}</span>
              <a 
                href="https://khaledwaheed.vercel.app/"
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-black text-[#00bfff] hover:text-[#4fc3ff] transition-colors duration-200"
              >
                خالد وحيد
              </a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default Index;
