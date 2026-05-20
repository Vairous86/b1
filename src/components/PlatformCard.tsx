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
    
    // Instagram
    if (n.includes("instagram") || n.includes("انستجرام") || n.includes("انستغرام")) {
      return (
        <div className="social-orb-chrome social-orb-insta-neon select-none">
          <div className="social-orb-inner">
            <svg className="w-8 h-8 text-[#dcdfe3] drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)] filter" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" strokeWidth="3" />
            </svg>
          </div>
        </div>
      );
    }
    
    // Facebook
    if (n.includes("facebook") || n.includes("فيس")) {
      return (
        <div className="social-orb-chrome social-orb-fb-neon select-none">
          <div className="social-orb-inner">
            <svg className="w-8 h-8 text-[#dcdfe3] drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)] filter" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
        </div>
      );
    }
 
    // TikTok
    if (n.includes("tiktok") || n.includes("تيك")) {
      return (
        <div className="social-orb-chrome social-orb-tt-neon select-none">
          <div className="social-orb-inner">
            <svg className="w-8 h-8 text-[#dcdfe3] drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)] filter" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.63 4.19 1.15 1.25 2.76 2.01 4.41 2.14v3.86c-1.32-.15-2.6-.66-3.66-1.48-.96-.73-1.68-1.74-2.1-2.88-.05 2.06-.02 4.12-.03 6.19-.06 2.27-.72 4.56-2.07 6.38-1.52 2.08-4.06 3.46-6.66 3.55-2.91.13-5.91-1.27-7.29-3.86-1.49-2.75-1.12-6.52.92-8.87 1.7-2.02 4.45-3.01 7.03-2.5v3.91c-1.47-.46-3.19.14-4.08 1.4-.87 1.2-.7 2.97.41 3.97.97.89 2.47.98 3.53.22.75-.52 1.18-1.39 1.21-2.31.02-3.86.01-7.72.02-11.58.01-.13.02-.27.05-.4z" />
            </svg>
          </div>
        </div>
      );
    }
 
    // Twitter / X
    if (n.includes("twitter") || n.includes("تويتر") || n.includes("توتير")) {
      return (
        <div className="social-orb-chrome social-orb-tw-neon select-none">
          <div className="social-orb-inner social-orb-inner-cyan">
            <svg className="w-8 h-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.95)] filter" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
          </div>
        </div>
      );
    }

    // Default Fallback
    return (
      <div className="social-orb-chrome select-none">
        <div className="social-orb-inner">
          <span className="text-2xl font-black text-[#cbd0d6] drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.85)] font-heading">
            {name.substring(0, 1).toUpperCase()}
          </span>
        </div>
      </div>
    );
  };

  // Helper to render inline bullet item SVGs inside circular grey buttons
  const renderItemBullet = (type: "user" | "heart" | "play" | "comment") => {
    let iconSvg = null;
    if (type === "user") {
      iconSvg = (
        <svg className="w-3.5 h-3.5 text-[#1e2024]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      );
    } else if (type === "heart") {
      iconSvg = (
        <svg className="w-3.5 h-3.5 text-[#1e2024]" fill="currentColor" viewBox="0 0 24 24">
          <path d="m11.645 20.91-.007-.003-.003-.001a11.13 11.13 0 0 1-5.075-3.536C3.96 14.662 3 11.373 3 7.82 3 4.606 5.23 2 8 2c1.722 0 3.254.912 4.145 2.253C13.035 2.912 14.568 2 16.3 2c2.77 0 5 2.606 5 5.82 0 3.553-.96 6.842-4.56 9.55a11.13 11.13 0 0 1-5.074 3.536l-.004.001-.007.003Z" />
        </svg>
      );
    } else if (type === "play") {
      iconSvg = (
        <svg className="w-3.5 h-3.5 text-[#1e2024] fill-current" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      );
    } else if (type === "comment") {
      iconSvg = (
        <svg className="w-3.5 h-3.5 text-[#1e2024]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785 0.5.5 0 0 0 .316.793 8.66 8.66 0 0 0 5.293-1.623c.302-.17.671-.168.971.018a10.023 10.023 0 0 0 5.284 1.48Z" />
        </svg>
      );
    }

    return (
      <div className="metal-bullet-icon">
        {iconSvg}
      </div>
    );
  };

  // Render mock detailed services points depending on the platform name (matching the look of the image)
  const renderPlatformPoints = (name: string) => {
    const n = name.toLowerCase();
    
    if (n.includes("instagram") || n.includes("انستجرام")) {
      return (
        <div className="w-full flex flex-col gap-3 px-1 my-2">
          <div className="flex items-center justify-end gap-3 w-full">
            <span className="text-sm font-bold text-[#1a1b1f] tracking-wide">متابعين</span>
            {renderItemBullet("user")}
          </div>
          <div className="flex items-center justify-end gap-3 w-full">
            <span className="text-sm font-bold text-[#1a1b1f] tracking-wide">لايكات</span>
            {renderItemBullet("heart")}
          </div>
          <div className="flex items-center justify-end gap-3 w-full">
            <span className="text-sm font-bold text-[#1a1b1f] tracking-wide">مشاهدات</span>
            {renderItemBullet("play")}
          </div>
          <div className="flex items-center justify-end gap-3 w-full">
            <span className="text-sm font-bold text-[#1a1b1f] tracking-wide">تعليقات</span>
            {renderItemBullet("comment")}
          </div>
        </div>
      );
    }
    
    if (n.includes("facebook") || n.includes("فيس")) {
      return (
        <div className="w-full flex flex-col gap-3 px-1 my-2">
          <div className="flex items-center justify-end gap-3 w-full">
            <span className="text-sm font-bold text-[#1a1b1f] tracking-wide">متابعين 200</span>
            {renderItemBullet("user")}
          </div>
          <div className="flex items-center justify-end gap-3 w-full">
            <span className="text-sm font-bold text-[#1a1b1f] tracking-wide">لايكات</span>
            {renderItemBullet("heart")}
          </div>
          <div className="flex items-center justify-end gap-3 w-full">
            <span className="text-sm font-bold text-[#1a1b1f] tracking-wide">مشاهدات 5250</span>
            {renderItemBullet("play")}
          </div>
        </div>
      );
    }

    if (n.includes("tiktok") || n.includes("تيك")) {
      return (
        <div className="w-full flex flex-col gap-3 px-1 my-2">
          <div className="flex items-center justify-end gap-3 w-full">
            <span className="text-sm font-bold text-[#1a1b1f] tracking-wide">متابعين 200</span>
            {renderItemBullet("user")}
          </div>
          <div className="flex items-center justify-end gap-3 w-full">
            <span className="text-sm font-bold text-[#1a1b1f] tracking-wide">لايكات</span>
            {renderItemBullet("heart")}
          </div>
          <div className="flex items-center justify-end gap-3 w-full">
            <span className="text-sm font-bold text-[#1a1b1f] tracking-wide">مشاهدات 3550</span>
            {renderItemBullet("play")}
          </div>
        </div>
      );
    }

    // Default Twitter / Twitter-X & other fallbacks
    return (
      <div className="w-full flex flex-col gap-3 px-1 my-2">
        <div className="flex items-center justify-end gap-3 w-full">
          <span className="text-sm font-bold text-[#1a1b1f] tracking-wide">متابعين 320</span>
          {renderItemBullet("user")}
        </div>
        <div className="flex items-center justify-end gap-3 w-full">
          <span className="text-sm font-bold text-[#1a1b1f] tracking-wide">لايكات</span>
          {renderItemBullet("heart")}
        </div>
        <div className="flex items-center justify-end gap-3 w-full">
          <span className="text-sm font-bold text-[#1a1b1f] tracking-wide">مشاهدات 3850</span>
          {renderItemBullet("play")}
        </div>
      </div>
    );
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={handleKey}
      className="chrome-bezel !overflow-visible p-[6px] rounded-[24px] cursor-pointer transition-transform duration-300 hover:scale-[1.03] select-none shadow-xl mt-6 group"
      aria-label={`Open platform ${platform.name}`}
    >
      <div className="metal-brushed !overflow-visible px-5 pb-5 pt-8 rounded-[18px] flex flex-col items-center gap-4 relative">
        
        {/* Overlapping 3D Chrome Social Media Orb Badge */}
        <div className="absolute -top-11 left-1/2 transform -translate-x-1/2 select-none pointer-events-none transition-transform duration-300 group-hover:scale-105 z-10">
          {renderSocialOrb(platform.name)}
        </div>

        {/* Platform Title */}
        <div className="text-center w-full mt-4 select-none border-b border-black/10 pb-3">
          <span className="text-xl md:text-2xl font-black font-heading metal-text-embossed block">
            {platform.name}
          </span>
        </div>

        {/* Bullet points with metallic icons */}
        <div className="w-full flex-1 py-1">
          {renderPlatformPoints(platform.name)}
        </div>

        {/* Steel Purchase Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            open();
          }}
          className="metal-btn-recessed w-full py-2.5 text-sm font-bold select-none transition-transform active:scale-95 shadow-md flex items-center justify-center gap-2"
        >
          <span>{locale === "ar" ? "شراء" : "Buy"}</span>
        </button>

      </div>
    </div>
  );
};
