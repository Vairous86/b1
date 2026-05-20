import { useState, useEffect } from "react";
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

const Index = () => {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [most, setMost] = useState<Array<{ service_id: string; visible: boolean }>>([]);
  const [services, setServices] = useState<Service[]>([]);
  const { t, locale } = useLocale();

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
              
              {/* Left Side: Glowing 3D iPhone display */}
              <div className="flex-1 w-full flex items-center justify-center relative select-none">
                <div className="relative w-full max-w-[320px] aspect-[4/5] flex items-center justify-center">
                  <img 
                    src="/hero_phone_mockup.png" 
                    alt="Phone Mockup" 
                    className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] animate-float"
                  />
                  {/* Decorative glowing blue orb behind the phone */}
                  <div className="absolute w-[200px] h-[200px] rounded-full bg-[#00bfff]/25 blur-[60px] -z-10 animate-pulse pointer-events-none" />
                </div>
              </div>

              {/* Right Side: Arabic Headline & Metallic Glowing CTA */}
              <div className="flex-1 text-right flex flex-col items-end z-10">
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
              { icon: Headphones, label: locale === "ar" ? "دعم 24/7" : "24/7 Support" },
              { icon: Award, label: locale === "ar" ? "ضمان التعويض" : "Refill Guarantee" },
              { icon: Shield, label: locale === "ar" ? "آمن وفعال" : "Safe & Effective" },
              { icon: Clock, label: locale === "ar" ? "تسليم فوري" : "Fast Delivery" },
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
          <div className="flex items-center gap-4 max-w-5xl mx-auto">
            {/* Left Nav Arrow */}
            <button className="hidden md:flex w-10 h-10 rounded-full items-center justify-center bg-gradient-to-br from-[#ebedf0] to-[#9ba0a7] border border-[#a3a7ae] text-[#1a1c1f] shadow-md hover:brightness-110 active:scale-95">
              <span className="text-lg font-bold">{"<"}</span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
              {[
                { name: locale === "ar" ? "محمد العتيبي" : "Mohammad Al-Otaibi", text: locale === "ar" ? "خدمة سريعة وممتازة جداً ومصداقية كاملة في التنفيذ، أنصح بالتعامل معهم دائمًا." : "Very fast and excellent service with complete credibility. Highly recommended.", rating: 5, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80" },
                { name: locale === "ar" ? "أحمد سليمان" : "Ahmad Suleiman", text: locale === "ar" ? "أفضل موقع لزيادة المتابعين والتفاعل، الدعم الفني متعاون لأبعد حد وسريع الاستجابة." : "The best website for increasing followers and engagement. Extremely helpful support.", rating: 5, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80" },
                { name: locale === "ar" ? "سارة القحطاني" : "Sarah Al-Qahtani", text: locale === "ar" ? "جربت خدمات اللايكات والمشاهدات وكان التوصيل فوري وبدون أي نقصان. شكراً جزيلاً." : "Tried likes and views services, delivery was instant and with zero drop. Thank you!", rating: 5, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80" },
              ].map((item, idx) => (
                <div key={idx} className="chrome-bezel rounded-[22px] p-2 shadow-lg">
                  <div className="metal-brushed p-5 rounded-[16px] flex flex-col items-center text-center gap-3 h-full">
                    {/* Chrome Porthole Avatar Frame */}
                    <div className="avatar-porthole-chrome">
                      <img 
                        src={item.avatar} 
                        alt={item.name} 
                        className="w-14 h-14 rounded-full object-cover border border-[#4a4e55]"
                      />
                    </div>
                    
                    {/* Stars */}
                    <div className="flex gap-1">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-500 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
                      ))}
                    </div>

                    <p className="text-[#1a1b1d] text-xs font-semibold leading-relaxed my-2 italic">
                      "{item.text}"
                    </p>
                    
                    <span className="font-heading font-black text-sm text-[#1a1b1d] border-t border-[#000000]/10 pt-2 w-full">
                      {item.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Nav Arrow */}
            <button className="hidden md:flex w-10 h-10 rounded-full items-center justify-center bg-gradient-to-br from-[#ebedf0] to-[#9ba0a7] border border-[#a3a7ae] text-[#1a1c1f] shadow-md hover:brightness-110 active:scale-95">
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
              <div className="flex flex-wrap gap-2 items-center justify-center">
                {["VISA", "Mastercard", "PayPal", "Mada", "STC Pay"].map((brand) => (
                  <div key={brand} className="px-3 py-1 bg-gradient-to-b from-[#2e3137] to-[#121315] border border-[#484b51] rounded-[6px] shadow-sm select-none">
                    <span className="text-[10px] font-black text-white/70 tracking-wide font-sans">{brand}</span>
                  </div>
                ))}
              </div>

              {/* Contact Info (Center) */}
              <div className="text-center md:text-right flex flex-col items-center md:items-end gap-1 text-[#1a1b1e]">
                <span className="font-heading font-black text-sm">{locale === "ar" ? "قناة تواصل بيدو المصري" : "Bedo Elmasry Contact Info"}</span>
                <span className="text-xs font-bold opacity-80 select-all">00966505163956 | 01060938386</span>
                <span className="text-xs font-semibold opacity-70">info@bidomedia.com | © {new Date().getFullYear()}</span>
              </div>

              {/* WhatsApp Button (Right) */}
              <a 
                href={`https://wa.me/201092902885`}
                target="_blank"
                rel="noopener noreferrer"
                className="metal-btn-blue px-6 py-3 text-sm font-bold flex items-center gap-2 transition-transform hover:scale-105 shadow-[0_0_15px_rgba(0,191,255,0.4)]"
              >
                {/* 3D-like WhatsApp icon badge inside */}
                <div className="w-5 h-5 rounded-full bg-[#25d366] flex items-center justify-center shadow-inner">
                  <Send className="w-3 h-3 text-white fill-white transform rotate-45 -translate-x-[0.5px] translate-y-[0.5px]" />
                </div>
                <span>{locale === "ar" ? "تواصل واتساب" : "تواصل واتساب"}</span>
              </a>

            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default Index;
