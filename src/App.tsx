import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { CurrencyProvider, useCurrency } from "@/contexts/CurrencyContext";
import Index from "./pages/Index";
import PlatformServices from "./pages/PlatformServices";
import ServiceOrder from "./pages/ServiceOrder";
import Payment from "./pages/Payment";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentConfirmation from "./pages/PaymentConfirmation";
import NotFound from "./pages/NotFound";
import { MessageCircle } from "lucide-react";
import { logVisit } from "@/lib/db";
import { detectReferrerSource } from "@/lib/referrerUtils";

const queryClient = new QueryClient();

/* =======================
   Meta Pixel PageView
======================= */
const MetaPageView = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "PageView");
    }

    // Log visit for internal analytics
    const log = async () => {
      const referrerSource = detectReferrerSource();
      try {
        const res = await fetch("https://ipwho.is/");
        const data = await res.json();
        logVisit({
          ip_address: data.ip || "unknown",
          country: data.country || "unknown",
          city: data.city || "unknown",
          page_url: window.location.href,
          user_agent: navigator.userAgent,
          referrer_source: referrerSource
        });
      } catch {
        // Fallback if ip API fails
        logVisit({
          ip_address: "unknown",
          country: "unknown",
          page_url: window.location.href,
          user_agent: navigator.userAgent,
          referrer_source: referrerSource
        });
      }
    };
    log();

  }, [location.pathname]);

  return null;
};

/* =======================
   Google Translate
======================= */
const GoogleTranslate = () => {
  useEffect(() => {
    if (document.querySelector('script[src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]')) return;

    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        { pageLanguage: "ar", includedLanguages: "ar,en", layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE },
        "google_translate_element"
      );
    };
  }, []);

  return (
    <div
      id="google_translate_element"
      className="fixed bottom-24 right-4 z-40 bg-white/90 backdrop-blur rounded-lg shadow-sm p-1 border border-border opacity-80 hover:opacity-100 transition-opacity text-xs"
      style={{ transform: "scale(0.85)", transformOrigin: "bottom right" }}
    />
  );
};

/* =======================
   WhatsApp Floating Button
======================= */
const WhatsAppButton = () => {
  const { currency } = useCurrency();
  const number = currency === "EGP" ? "201092902885" : "966505163956";
  const href = `https://wa.me/${number}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-floating-orb"
      aria-label="Contact via WhatsApp"
    >
      <div className="whatsapp-floating-orb-inner">
        {/* Futuristic Glass/Metallic WhatsApp logo */}
        <svg className="w-8 h-8 text-white fill-current drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.062 5.321 5.388.007 11.979 0c3.192.001 6.195 1.242 8.455 3.499C22.7 5.757 23.94 8.757 23.937 11.954c-.005 6.632-5.33 11.946-11.914 11.946h-.007c-2.01-.001-3.987-.525-5.748-1.52L0 24zM6.57 18.066c1.642.978 3.513 1.493 5.4 1.495h.005c5.432 0 9.849-4.343 9.853-9.679.002-2.586-1.002-5.018-2.83-6.843C17.17 1.215 14.739.006 12.164 0h-.006c-5.435 0-9.853 4.343-9.857 9.68-.001 2.052.54 4.053 1.566 5.827L2.83 19.86l4.475-1.157c-1.782.97-2.73 2.195-2.73 2.195zM17.13 14.654c-.28-.14-1.657-.818-1.913-.91-.257-.094-.444-.14-.63.14-.187.28-.724.91-.887 1.096-.164.186-.327.21-.607.07-.28-.14-1.185-.437-2.257-1.393-.834-.744-1.397-1.662-1.56-1.942-.164-.28-.018-.43.123-.57.127-.127.28-.328.42-.49.14-.164.187-.28.28-.467.094-.188.047-.35-.023-.49-.07-.14-.63-1.52-.864-2.08-.228-.547-.48-.473-.63-.48H8.38c-.187 0-.49.07-.747.35-.257.28-.98.957-.98 2.336s1.003 2.71 1.143 2.9c.14.186 1.974 3.013 4.782 4.22.668.287 1.19.458 1.597.588.672.213 1.284.183 1.767.11.539-.08 1.658-.677 1.89-.933.235-.257.235-.477.164-.56-.07-.08-.257-.14-.537-.28z" />
        </svg>
      </div>
    </a>
  );
};

/* =======================
   App
======================= */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <CurrencyProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          {/* 🔥 Meta Pixel PageView & Analytics & Google Translate */}
          <MetaPageView />
          <GoogleTranslate />

          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/platform/:platformId"
              element={<PlatformServices />}
            />
            <Route path="/service/:serviceId" element={<ServiceOrder />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment/confirmation" element={<PaymentConfirmation />} />
            <Route
              path="/super-secret-admin-panel-x99"
              element={<AdminLogin />}
            />
            <Route
              path="/super-secret-admin-panel-x99/dashboard"
              element={<AdminDashboard />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>

          <WhatsAppButton />
        </BrowserRouter>
      </TooltipProvider>
    </CurrencyProvider>
  </QueryClientProvider>
);

export default App;
