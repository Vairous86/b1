import React from "react";

export const RamadanBanner = () => {
    return (
        <div className="ramadan-banner -mt-1">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-4">
                        <span className="badge">
                            <span>☪</span>
                            رمضان كريم
                        </span>
                        <span className="hidden sm:inline text-sm text-white/60">
                            كل عام وأنتم بخير ✦ خصومات رمضان متاحة الآن
                        </span>
                    </div>
                    <div className="stars-wrapper" aria-hidden>
                        <span className="star star1" />
                        <span className="star star2" />
                        <span className="star star3" />
                        <span className="star star4" />
                        <span className="star star5" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RamadanBanner;
