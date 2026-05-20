import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("الرئيسية");

  const menuItems = [
    { label: "الرئيسية", path: "/" },
    { label: "الخدمات", path: "/#platforms" },
    { label: "لماذا نحن؟", path: "/#features" },
    { label: "آراء العملاء", path: "/#testimonials" },
    { label: "تواصل معنا", path: "/#contact" },
  ];

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveItem("");
      return;
    }

    const handleScroll = () => {
      const sections = [
        { id: "hero", label: "الرئيسية" },
        { id: "platforms", label: "الخدمات" },
        { id: "features", label: "لماذا نحن؟" },
        { id: "testimonials", label: "آراء العملاء" },
        { id: "contact", label: "تواصل معنا" }
      ];

      // If at the very top of the page, highlight "الرئيسية"
      if (window.scrollY < 80) {
        setActiveItem("الرئيسية");
        return;
      }

      let currentActive = "الرئيسية";
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the top of the section is at or above the upper 40% of the viewport
          if (rect.top <= window.innerHeight * 0.4) {
            currentActive = section.label;
          }
        }
      }

      // Check if we reached the absolute bottom of the page
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        currentActive = "تواصل معنا";
      }

      setActiveItem(currentActive);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleNavClick = (path: string) => {
    if (path === "/") {
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 50);
      }
    } else if (path.startsWith("/#")) {
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
      <div className="container mx-auto max-w-6xl flex flex-col-reverse md:flex-row-reverse items-center justify-between gap-4">
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


