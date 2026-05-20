import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { PlatformCard } from "@/components/PlatformCard";
import { Platform, Service } from "@/lib/localStorage";
import {
  getPlatforms as fetchPlatforms,
  getMostRequested as fetchMostRequested,
  getServices as fetchServices,
} from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Search, Shield, Clock, Award, Headphones, Instagram, Facebook, Send } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ============ Hero Section ============ */}
      <section className="py-24 px-4 hero-ramadan islamic-pattern">
        <div className="container mx-auto max-w-6xl text-center animate-fade-in relative z-10">
          {/* Crescent Moon */}
          <div className="crescent-moon" aria-hidden />

          {/* Twinkling Stars */}
          <span className="hero-star s1" aria-hidden />
          <span className="hero-star s2" aria-hidden />
          <span className="hero-star gold s3" aria-hidden />
          <span className="hero-star s4" aria-hidden />
          <span className="hero-star s5" aria-hidden />
          <span className="hero-star s6" aria-hidden />
          <span className="hero-star gold s7" aria-hidden />
          <span className="hero-star s8" aria-hidden />
          <span className="hero-star emerald s9" aria-hidden />
          <span className="hero-star s10" aria-hidden />
          <span className="hero-star gold s11" aria-hidden />
          <span className="hero-star s12" aria-hidden />

          {/* Floating Lanterns */}
          <div className="lantern l1" aria-hidden>
            <span className="lantern-body">🏮</span>
          </div>
          <div className="lantern l2" aria-hidden>
            <span className="lantern-body">🏮</span>
          </div>
          <div className="lantern l3" aria-hidden>
            <span className="lantern-body">🏮</span>
          </div>
          <div className="lantern l4" aria-hidden>
            <span className="lantern-body">🏮</span>
          </div>

          {/* Ramadan Greeting */}
          <div className="mb-3">
            <span className="inline-block text-ramadan-gold text-sm font-medium tracking-wider opacity-80">
              ✦ {locale === "ar" ? "رمضان مبارك" : "Ramadan Mubarak"} ✦
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-5 glow-text leading-tight">
            {t("homeHeroTitle")}
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8">
            {t("homeHeroDesc")}
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative mb-10">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 border-border/50 shadow-card bg-card/50 backdrop-blur-sm"
            />
          </div>

          {/* Ornamental Divider */}
          <div className="ramadan-divider mb-8" />

          {/* Most Requested inside hero */}
          <div className="mt-4">
            <div className="flex items-center justify-between max-w-6xl mx-auto mb-5">
              <h3 className="text-lg font-semibold text-ramadan-gold flex items-center gap-2">
                <span>☪</span>
                {t("mostRequestedTitle")}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
              {most
                .slice(0, 6)
                .map((m) => {
                  const s = services.find((x) => x.id === (m as any).service_id);
                  if (!s || !m.visible) return null;
                  return (
                    <Link key={s.id} to={`/service/${s.id}`} className="block">
                      <Card className="most-requested-card p-3 shadow-card hover:shadow-lg">
                        <div className="flex items-center gap-3">
                          <img
                            src={s.image}
                            alt={s.title}
                            className="w-16 h-16 rounded-md object-cover"
                          />
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-foreground">
                              {s.title}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {t("avgDeliveryLabel")} {s.deliveryTime}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      </section>

      {/* ============ Platforms Grid ============ */}
      <section className="py-20 px-4 islamic-pattern">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <span className="text-ramadan-gold text-sm font-medium tracking-wider mb-3 block">
              ✦ {locale === "ar" ? "خدماتنا" : "Our Services"} ✦
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              {t("choosePlatformTitle")}
            </h2>
            <div className="ramadan-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
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
              <p className="text-muted-foreground text-lg">
                {t("noPlatformsFound")}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ============ Features Section ============ */}
      <section className="py-20 px-4 ornamental-border" style={{ background: 'linear-gradient(180deg, hsl(240 25% 7%), hsl(240 30% 5%))' }}>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <span className="text-ramadan-gold text-sm font-medium tracking-wider mb-3 block">
              ✦ {locale === "ar" ? "لماذا نحن" : "Why Us"} ✦
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              {t("whyChooseUsTitle")}
            </h2>
            <div className="ramadan-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { icon: Clock, label: "fastDeliveryTitle", desc: "fastDeliveryDesc", delay: "0s" },
              { icon: Shield, label: "safeTitle", desc: "safeDesc", delay: "0.1s" },
              { icon: Award, label: "qualityTitle", desc: "qualityDesc", delay: "0.2s" },
              { icon: Headphones, label: "supportTitle", desc: "supportDesc", delay: "0.3s" },
            ].map(({ icon: Icon, label, desc, delay }) => (
              <div
                key={label}
                className="text-center animate-scale-in"
                style={{ animationDelay: delay }}
              >
                <div className="feature-icon-ring mx-auto mb-5">
                  <Icon className="w-7 h-7 text-ramadan-gold" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">
                  {t(label)}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t(desc)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Trust Section ============ */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
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
                <div className="text-4xl md:text-5xl font-heading font-bold stat-value mb-2">
                  {value}
                </div>
                <div className="text-muted-foreground text-sm">{t(label)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Footer ============ */}
      <footer className="footer-ramadan py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-5">
              <a
                href="https://www.instagram.com/bedo_elmasry_9/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-ramadan-gold transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61570478468069"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-ramadan-gold transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://t.me/bedo_elmasry_9"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-ramadan-gold transition-colors"
              >
                <Send className="w-6 h-6" />
              </a>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="text-ramadan-gold text-lg">☪</span>
              <span className="text-white/60 text-sm">رمضان كريم — كل عام وأنتم بخير</span>
              <span className="text-ramadan-gold text-lg">☪</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
