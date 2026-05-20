import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("الخدمات");

  const menuItems = [
    { label: "الرئيسية", path: "/" },
    { label: "المتجر", path: "/#platforms" },
    { label: "الخدمات", path: "/#platforms" },
    { label: "المدونة", path: "/#platforms" },
    { label: "تواصل معنا", path: "/#contact" },
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
        <div className="chrome-bezel-pill flex items-center justify-center gap-1 sm:gap-4 overflow-x-auto max-w-full">
          {menuItems.map((item, idx) => {
            const isActive = item.label === activeItem;

            return (
              <button
                key={`${item.label}-${idx}`}
                onClick={() => {
                  setActiveItem(item.label);
                  handleNavClick(item.path);
                }}
                className={`px-3 py-2 text-xs sm:text-sm font-semibold transition-all rounded-full hover:text-white ${
                  isActive 
                    ? "nav-active-glow font-bold text-white" 
                    : "text-white/60 hover:text-white/90"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Side: Separate Oval Chrome Logo Plaque */}
        <Link to="/" className="chrome-bezel flex items-center justify-center select-none group p-[6px] rounded-[20px]">
          <div className="metal-brushed-dark px-8 py-2 flex items-center justify-center min-w-[150px] text-center rounded-[12px] border border-white/5">
            <span className="text-xl md:text-2xl font-bold tracking-wide bg-gradient-to-b from-[#fef08a] via-[#f59e0b] to-[#b45309] bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.95)] font-heading animate-pulse">
              بيدو المصري
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
};


