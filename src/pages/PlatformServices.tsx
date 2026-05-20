import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ServiceTypeCard } from "@/components/ServiceTypeCard";
import { Service, Platform } from "@/lib/localStorage";
import { getServices as fetchServices, getPlatforms as fetchPlatforms } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

const PlatformServices = () => {
  const { platformId } = useParams<{ platformId: string }>();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [platform, setPlatform] = useState<Platform | null>(null);
  const { t } = useLocale();

  useEffect(() => {
    const load = async () => {
      if (!platformId) return;
      const platRes = await fetchPlatforms();
      const platArr = Array.isArray(platRes?.data) ? platRes.data : [];
      const p = platArr.find((x: any) => x.slug === platformId || x.id === platformId);
      if (!p) return navigate("/");
      setPlatform(p as Platform);
      const svcRes = await fetchServices();
      const svcArr = Array.isArray(svcRes?.data) ? (svcRes.data as Service[]) : [];
      setServices(svcArr.filter((s: any) => s.platform === platformId));
    };
    load();
  }, [platformId, navigate]);

  if (!platform) {
    return null;
  }

  return (
    <div className="min-h-screen metal-mesh-bg text-foreground pb-20">
      <Navbar />

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <button
            onClick={() => navigate('/')}
            className="metal-btn px-5 py-2.5 text-xs font-black select-none shadow-md flex items-center justify-center gap-2 mb-8 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t("backToPlatforms")}</span>
          </button>

          <div className="chrome-bezel p-[6px] rounded-[24px] shadow-2xl animate-fade-in">
            <div className="metal-brushed-dark px-6 py-8 md:px-10 md:py-10 rounded-[18px] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
              
              {/* Circular Chrome Frame for Platform Icon */}
              <div className="avatar-porthole-chrome p-[5px] shadow-lg flex-shrink-0 animate-float">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-900 flex items-center justify-center border border-black/20">
                  <img
                    src={platform.image}
                    alt={platform.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="text-center md:text-right flex-1">
                <h1 className="text-3xl md:text-5xl font-black font-heading metal-text-embossed-light mb-3 tracking-wide">
                  {platform.name} {t("platformServicesTitle")}
                </h1>
                <p className="text-sm md:text-base font-semibold text-muted-foreground/80 leading-relaxed max-w-2xl">
                  {platform.description}
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="border-b border-[#3a3d42] pb-4 mb-8">
            <h2 className="text-2xl font-black font-heading text-white tracking-wider text-right">
              {t("availableServices")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ServiceTypeCard service={service} />
              </div>
            ))}
          </div>

          {services.length === 0 && (
            <div className="text-center py-16 chrome-bezel p-[6px] rounded-[24px] max-w-md mx-auto mt-10">
              <div className="metal-brushed px-6 py-10 rounded-[18px]">
                <p className="text-black font-black text-lg">{t("noServicesAvailable")}</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PlatformServices;
