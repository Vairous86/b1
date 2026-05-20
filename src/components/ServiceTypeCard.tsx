import { Service } from "@/lib/localStorage";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

interface ServiceTypeCardProps {
  service: Service;
}

export const ServiceTypeCard = ({ service }: ServiceTypeCardProps) => {
  const navigate = useNavigate();
  const { currency, symbol } = useCurrency();
  const price = service.prices?.[currency] ?? 0;

  // Make the entire card clickable and accessible via keyboard (Enter / Space)
  const open = () => navigate(`/service/${service.id}`);
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={handleKey}
      className="chrome-bezel p-[6px] rounded-[24px] cursor-pointer transition-transform duration-300 hover:scale-[1.03] select-none shadow-xl animate-fade-in group"
      aria-label={`Order ${service.title}`}
    >
      <div className="metal-brushed px-5 py-5 rounded-[18px] flex flex-col justify-between h-full relative">
        <div>
          {/* Card Image */}
          <div className="aspect-video w-full mb-4 rounded-xl overflow-hidden relative border border-black/10 shadow-inner">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover select-none pointer-events-none"
            />
            <div className="absolute top-2.5 right-2.5">
              <span className="bg-[#121316]/90 backdrop-blur-sm border border-cyan-500/50 text-[#00bfff] text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-[0_0_8px_rgba(0,191,255,0.4)]">
                🔥 مميز
              </span>
            </div>
          </div>

          {/* Card Title */}
          <h3 className="text-lg font-black font-heading metal-text-embossed mb-2 text-right">
            {service.title}
          </h3>

          {/* Description */}
          <p className="text-[11px] font-bold text-[#1a1c20]/75 line-clamp-2 mb-4 text-right leading-relaxed">
            {service.description}
          </p>
        </div>

        <div>
          {/* Price & Time info */}
          <div className="flex items-center justify-between mb-4 border-t border-black/5 pt-3">
            <span className="text-[11px] font-black text-[#1a1c20]/60">
              {service.deliveryTime}
            </span>
            <div>
              {(service.submissionType !== "text" && service.requiresPayment !== false) && (
                <div className="flex items-baseline justify-end gap-1">
                  <span className="text-[10px] font-bold text-[#1a1c20]/60">/ 1000</span>
                  <span className="text-xl font-black text-black font-heading leading-none">
                    {symbol}{price.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Purchase Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              open();
            }}
            className="metal-btn w-full py-2.5 text-xs font-black select-none transition-transform active:scale-95 shadow-md flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>اطلب الآن</span>
          </button>
        </div>
      </div>
    </div>
  );
};
