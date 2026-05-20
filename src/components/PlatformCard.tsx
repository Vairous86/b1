import { useNavigate } from "react-router-dom";
import { useLocale } from "@/contexts/LocaleContext";

interface PlatformCardProps {
  platform: {
    id: string;
    slug: string;
    name: string;
    description: string;
    image: string;
  };
}

export const PlatformCard = ({ platform }: PlatformCardProps) => {
  const navigate = useNavigate();
  const { locale } = useLocale();

  const open = () => navigate(`/platform/${platform.id}`);
  
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  };

  // Helper to render high-fidelity 3D metallic social media orbs using pure CSS & SVG
  const renderSocialOrb = (name: string) => {
    const n = name.toLowerCase();
    
    // Instagram SVG & Gradient
    if (n.includes("instagram") || n.includes("انستجرام") || n.includes("انستغرام")) {
      return (
        <div className="social-orb-chrome shadow-lg">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <defs>
              <linearGradient id="instaGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#instaGrad)" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="url(#instaGrad)" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="url(#instaGrad)" strokeLinecap="round" strokeWidth="2.5" />
          </svg>
        </div>
      );
    }
    
    // Facebook SVG
    if (n.includes("facebook") || n.includes("فيس")) {
      return (
        <div className="social-orb-chrome shadow-lg">
          <svg className="w-8 h-8 text-[#1877f2] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </div>
      );
    }

    // TikTok SVG
    if (n.includes("tiktok") || n.includes("تيك") || n.includes("تيكتوك")) {
      return (
        <div className="social-orb-chrome shadow-lg bg-[#010101] border-[#3a3d42]">
          <svg className="w-8 h-8 text-white drop-shadow-[1px_1px_0px_#ff0050] filter" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.63 4.19 1.15 1.25 2.76 2.01 4.41 2.14v3.86c-1.32-.15-2.6-.66-3.66-1.48-.96-.73-1.68-1.74-2.1-2.88-.05 2.06-.02 4.12-.03 6.19-.06 2.27-.72 4.56-2.07 6.38-1.52 2.08-4.06 3.46-6.66 3.55-2.91.13-5.91-1.27-7.29-3.86-1.49-2.75-1.12-6.52.92-8.87 1.7-2.02 4.45-3.01 7.03-2.5v3.91c-1.47-.46-3.19.14-4.08 1.4-.87 1.2-.7 2.97.41 3.97.97.89 2.47.98 3.53.22.75-.52 1.18-1.39 1.21-2.31.02-3.86.01-7.72.02-11.58.01-.13.02-.27.05-.4z" />
          </svg>
        </div>
      );
    }

    // Twitter SVG
    if (n.includes("twitter") || n.includes("تويتر") || n.includes("توتير")) {
      return (
        <div className="social-orb-chrome shadow-lg">
          <svg className="w-8 h-8 text-[#1da1f2]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        </div>
      );
    }

    // YouTube SVG
    if (n.includes("youtube") || n.includes("يوتيوب")) {
      return (
        <div className="social-orb-chrome shadow-lg">
          <svg className="w-8 h-8 text-[#ff0000]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.507 9.387.507 9.387.507s7.517 0 9.387-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>
      );
    }

    // Fallback: Default Chrome orb with first letter of the name
    return (
      <div className="social-orb-chrome shadow-lg">
        <span className="text-2xl font-black text-[#4a4e55] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] font-heading">
          {name.substring(0, 1).toUpperCase()}
        </span>
      </div>
    );
  };

  // Render mock detailed services points depending on the platform name (matching the look of the image)
  const renderPlatformPoints = (name: string) => {
    const n = name.toLowerCase();
    
    if (n.includes("instagram") || n.includes("انستجرام")) {
      return (
        <ul className="text-right w-full flex flex-col gap-2 text-xs font-bold text-[#1a1c20]/80">
          <li className="flex items-center justify-end gap-2">
            <span>متابعين حقيقيين</span>
            <span className="text-[#25d366]">✔</span>
          </li>
          <li className="flex items-center justify-end gap-2">
            <span>لايكات سريعة</span>
            <span className="text-[#25d366]">✔</span>
          </li>
          <li className="flex items-center justify-end gap-2">
            <span>مشاهدات ريلز</span>
            <span className="text-[#25d366]">✔</span>
          </li>
          <li className="flex items-center justify-end gap-2">
            <span>تعليقات مخصصة</span>
            <span className="text-[#25d366]">✔</span>
          </li>
        </ul>
      );
    }
    
    if (n.includes("facebook") || n.includes("فيس")) {
      return (
        <ul className="text-right w-full flex flex-col gap-2 text-xs font-bold text-[#1a1c20]/80">
          <li className="flex items-center justify-end gap-2">
            <span>متابعين صفحات وحسابات</span>
            <span className="text-[#25d366]">✔</span>
          </li>
          <li className="flex items-center justify-end gap-2">
            <span>تفاعل ولايكات منشورات</span>
            <span className="text-[#25d366]">✔</span>
          </li>
          <li className="flex items-center justify-end gap-2">
            <span>مشاهدات فيديو وبث مباشر</span>
            <span className="text-[#25d366]">✔</span>
          </li>
        </ul>
      );
    }

    if (n.includes("tiktok") || n.includes("تيك")) {
      return (
        <ul className="text-right w-full flex flex-col gap-2 text-xs font-bold text-[#1a1c20]/80">
          <li className="flex items-center justify-end gap-2">
            <span>متابعين تيك توك نشطين</span>
            <span className="text-[#25d366]">✔</span>
          </li>
          <li className="flex items-center justify-end gap-2">
            <span>لايكات حقيقية وسريعة</span>
            <span className="text-[#25d366]">✔</span>
          </li>
          <li className="flex items-center justify-end gap-2">
            <span>مشاهدات بضمان التعويض</span>
            <span className="text-[#25d366]">✔</span>
          </li>
        </ul>
      );
    }

    // Default points
    return (
      <ul className="text-right w-full flex flex-col gap-2 text-xs font-bold text-[#1a1c20]/80">
        <li className="flex items-center justify-end gap-2">
          <span>متابعين عرب وأجانب</span>
          <span className="text-[#25d366]">✔</span>
        </li>
        <li className="flex items-center justify-end gap-2">
          <span>لايكات وتفاعل فوري</span>
          <span className="text-[#25d366]">✔</span>
        </li>
        <li className="flex items-center justify-end gap-2">
          <span>ضمان عدم النقصان</span>
          <span className="text-[#25d366]">✔</span>
        </li>
      </ul>
    );
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={handleKey}
      className="chrome-bezel p-[6px] rounded-[24px] cursor-pointer transition-transform duration-300 hover:scale-[1.03] select-none shadow-xl mt-6 group"
      aria-label={`Open platform ${platform.name}`}
    >
      <div className="metal-brushed px-5 pb-5 pt-8 rounded-[18px] flex flex-col items-center gap-4 relative">
        
        {/* Overlapping 3D Chrome Social Media Orb Badge */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 select-none pointer-events-none transition-transform duration-300 group-hover:scale-105">
          {renderSocialOrb(platform.name)}
        </div>

        {/* Platform Title */}
        <div className="text-center w-full mt-2 select-none border-b border-black/10 pb-3">
          <span className="text-xl md:text-2xl font-black font-heading metal-text-embossed block">
            {platform.name}
          </span>
          <span className="text-[10px] font-black text-[#1a1c20]/60 uppercase tracking-widest mt-1 block">
            {locale === "ar" ? "خدمات ممتازة" : "Growth Services"}
          </span>
        </div>

        {/* Dynamic description or parsed bullet points */}
        <div className="w-full flex-1 py-1">
          {renderPlatformPoints(platform.name)}
        </div>

        {/* Dynamic description (small footer inside card) */}
        <p className="text-[10px] text-center font-bold text-[#1a1c20]/60 mt-1 select-none border-t border-black/5 pt-3 w-full">
          {platform.description.length > 60 
            ? `${platform.description.substring(0, 60)}...` 
            : platform.description}
        </p>

        {/* Steel Purchase Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            open();
          }}
          className="metal-btn w-full py-2.5 text-xs font-black select-none transition-transform active:scale-95 shadow-md flex items-center justify-center gap-2"
        >
          <span>{locale === "ar" ? "شراء" : "Buy Now"}</span>
        </button>

      </div>
    </div>
  );
};
