import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const { locale, setLocale } = useLocale();

  useEffect(() => setMounted(true), []);

  const menuItems = [
    { label: locale === "ar" ? "الرئيسية" : "Home", path: "/" },
    { label: locale === "ar" ? "المتجر" : "Store", path: "/#platforms" },
    { label: locale === "ar" ? "الخدمات" : "Services", path: "/#platforms" },
    { label: locale === "ar" ? "المدونة" : "Blog", path: "/#platforms" },
    { label: locale === "ar" ? "تواصل معنا" : "Contact Us", path: "/#contact" },
  ];

  const handleNavClick = (path: string) => {
    if (path.startsWith("/#")) {
      const id = path.substring(2);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      navigate(path);
    }
  };

  return (
    <header className="w-full py-4 px-4 sticky top-0 z-50 metal-mesh-bg border-b border-white/5">
      <div className="container mx-auto max-w-6xl flex flex-col-reverse md:flex-row items-center justify-between gap-4">
        {/* Left Side: Navigation Pill Bezel */}
        <div className="chrome-bezel-pill flex items-center justify-center gap-1 sm:gap-3 overflow-x-auto max-w-full">
          {menuItems.map((item, idx) => {
            // Match pathname or hash to determine active state
            const isHomeActive = item.path === "/" && location.pathname === "/" && !location.hash;
            const isHashActive = item.path.startsWith("/#") && location.hash === item.path.substring(1);
            const isActive = isHomeActive || isHashActive;

            // In the image, "الخدمات" is active or highlighted. We also avoid duplicate render but keep standard layout.
            return (
              <button
                key={`${item.label}-${idx}`}
                onClick={() => handleNavClick(item.path)}
                className={`px-3 py-2 text-xs sm:text-sm font-semibold transition-all rounded-full hover:text-white ${
                  isActive 
                    ? "nav-active-glow font-bold" 
                    : "text-white/60 hover:text-white/90"
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {/* Sleek Circular Chrome Dial for Language Toggle */}
          {mounted && (
            <button
              onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-transform active:scale-95 ml-2 mr-1 bg-gradient-to-br from-[#ebedf0] to-[#9ba0a7] border border-[#a3a7ae] text-[#1a1c1f] hover:brightness-110 shadow-[0_2px_5px_rgba(0,0,0,0.5)]"
              aria-label="Toggle language"
            >
              {locale === "ar" ? "EN" : "ع"}
            </button>
          )}
        </div>

        {/* Right Side: Separate Oval Chrome Logo Plaque */}
        <Link to="/" className="chrome-bezel flex items-center justify-center select-none group p-[6px] rounded-[20px]">
          <div className="metal-brushed-dark px-8 py-2 flex items-center justify-center min-w-[150px] text-center rounded-[12px] border border-white/5">
            <span className="text-xl md:text-2xl font-bold tracking-wide bg-gradient-to-b from-[#fef08a] via-[#f59e0b] to-[#b45309] bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.95)] font-heading">
              {locale === "ar" ? "بيدو المصري" : "Bido Elmasry"}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
};


