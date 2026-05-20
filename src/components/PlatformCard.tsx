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
    const raw = name || "";
    // Normalize spacing, dashes, and lower case for ultra robust matching of dynamic DB platform names
    const n = raw.toLowerCase().replace(/[\s\-_]+/g, "").trim();
    
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

    // WhatsApp
    if (n.includes("whatsapp") || n.includes("واتس") || n.includes("واساب")) {
      return (
        <div className="social-orb-chrome social-orb-wa-neon select-none">
          <div className="social-orb-inner">
            <svg className="w-8 h-8 text-[#dcdfe3] drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)] filter" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.714-1.466L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966a9.782 9.782 0 0 0-6.974-2.85C6.208 1.99 1.782 6.36 1.778 11.788c-.001 1.632.455 3.224 1.32 4.622l-.995 3.635 3.738-.979z" />
            </svg>
          </div>
        </div>
      );
    }

    // Snapchat
    if (n.includes("snapchat") || n.includes("سناب")) {
      return (
        <div className="social-orb-chrome social-orb-snap-neon select-none">
          <div className="social-orb-inner">
            <svg className="w-8 h-8 text-[#dcdfe3] drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)] filter" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.762c-3.109 0-4.661.762-4.661 2.302 0 .151.023.351.047.531l.094.615c-.212.023-.424.094-.613.235-.353.259-.517.659-.517 1.224 0 .376.118.682.376.847.094.047.165.118.212.212-.047.212-.259.612-.659 1.153-.306.4-.564.847-.729 1.341a4.912 4.912 0 0 0-.259 1.576c0 .776.329 1.435.918 1.835l.235.141c-.047.094-.141.282-.235.588-.047.235-.094.541-.094.847 0 .847.4 1.459 1.129 1.765.235.094.494.141.776.141 1.506 0 2.259-.8 2.259-2.353 0-.094-.024-.235-.047-.376l-.071-.471c.565-.212 1.2-.329 1.835-.329s1.271.118 1.835.329l-.071.471c-.024.141-.047.282-.047.376 0 1.553.753 2.353 2.259 2.353.282 0 .541-.047.776-.141.729-.306 1.129-.918 1.129-1.765 0-.306-.047-.612-.094-.847-.094-.306-.188-.494-.235-.588l.235-.141c.588-.4 1.012-1.059 1.012-1.835a4.912 4.912 0 0 0-.259-1.576c-.165-.494-.423-.941-.729-1.341-.4-.541-.612-.941-.659-1.153.047-.094.118-.165.212-.212.259-.165.376-.471.376-.847 0-.565-.164-.965-.517-1.224a1.276 1.276 0 0 0-.613-.235l.094-.615c.024-.18.047-.38.047-.531 0-1.54-1.552-2.302-4.661-2.302z" />
            </svg>
          </div>
        </div>
      );
    }

    // YouTube
    if (n.includes("youtube") || n.includes("يوتيوب")) {
      return (
        <div className="social-orb-chrome social-orb-yt-neon select-none">
          <div className="social-orb-inner">
            <svg className="w-8 h-8 text-[#dcdfe3] drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)] filter" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
        </div>
      );
    }

    // Account Recovery
    if (n.includes("recovery") || n.includes("استرجاع") || n.includes("حسابات")) {
      return (
        <div className="social-orb-chrome social-orb-recovery-neon select-none">
          <div className="social-orb-inner">
            <svg className="w-8 h-8 text-[#dcdfe3] drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)] filter" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25z" />
            </svg>
          </div>
        </div>
      );
    }

    // Kik / Kwai
    if (n.includes("kwai") || n.includes("كويك") || n.includes("كواي") || n.includes("كيك") || n.includes("kik")) {
      return (
        <div className="social-orb-chrome social-orb-kwai-neon select-none">
          <div className="social-orb-inner">
            <svg className="w-8 h-8 text-[#dcdfe3] drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)] filter" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </div>
      );
    }

    // Block numbers
    if (n.includes("block") || n.includes("قفل") || n.includes("حظر") || n.includes("منع")) {
      return (
        <div className="social-orb-chrome social-orb-block-neon select-none">
          <div className="social-orb-inner">
            <svg className="w-8 h-8 text-[#dcdfe3] drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)] filter" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25z" />
            </svg>
          </div>
        </div>
      );
    }

    // Canva / Pro
    if (n.includes("canva") || n.includes("كانفا") || n.includes("اشتراكات") || n.includes("بروم")) {
      return (
        <div className="social-orb-chrome social-orb-canva-neon select-none">
          <div className="social-orb-inner">
            <svg className="w-8 h-8 text-[#dcdfe3] drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)] filter" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12z" />
            </svg>
          </div>
        </div>
      );
    }

    // Default Fallback with beautiful default neon-glow style
    return (
      <div className="social-orb-chrome social-orb-default-neon select-none">
        <div className="social-orb-inner">
          <span className="text-2xl font-black text-[#cbd0d6] drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.85)] font-heading">
            {raw.substring(0, 1).toUpperCase()}
          </span>
        </div>
      </div>
    );
  };

  // Helper to render inline bullet item SVGs inside circular grey buttons (now always gorgeous checkmarks)
  const renderItemBullet = () => {
    return (
      <div className="metal-bullet-icon">
        <svg className="w-3.5 h-3.5 text-[#1e2024]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
    );
  };

  // Render mock detailed services points matching the look of the image (exactly 4 points for all cards)
  const renderPlatformPoints = (_name?: string) => {
    return (
      <div className="w-full flex flex-col gap-3 px-1 my-2">
        <div className="flex items-center justify-end gap-3 w-full">
          <span className="text-sm font-bold text-[#1a1b1f] tracking-wide">متابعين</span>
          {renderItemBullet()}
        </div>
        <div className="flex items-center justify-end gap-3 w-full">
          <span className="text-sm font-bold text-[#1a1b1f] tracking-wide">لايكات</span>
          {renderItemBullet()}
        </div>
        <div className="flex items-center justify-end gap-3 w-full">
          <span className="text-sm font-bold text-[#1a1b1f] tracking-wide">مشاهدات</span>
          {renderItemBullet()}
        </div>
        <div className="flex items-center justify-end gap-3 w-full">
          <span className="text-sm font-bold text-[#1a1b1f] tracking-wide">تعليقات</span>
          {renderItemBullet()}
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
