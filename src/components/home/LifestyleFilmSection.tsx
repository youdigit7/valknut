import React from 'react';

export const LifestyleFilmSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#0A0A0A] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10">
          <span className="text-[#d4af37] text-[11px] font-bold tracking-[0.25em] uppercase block mb-2">
            CAMPAIGN
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase font-syne tracking-tight">
            DROP 04 — LIFESTYLE FILM
          </h2>
        </div>

        {/* Video Embed Placeholder */}
        <div className="relative aspect-video bg-[#12141e] border border-white/5 rounded overflow-hidden">
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
            <span className="text-[#d4af37] text-[10px] tracking-[0.2em] uppercase font-bold mb-3">VIDEO</span>
            <span className="text-white text-sm font-bold">Lifestyle / campaign video —</span>
            <span className="text-white text-sm font-bold">cinematic 4K cut with sound toggle</span>
            <span className="text-slate-500 text-xs mt-3">
              Sits full-width. Mobile receives a 9:16 vertical<br />
              version optimised for Instagram/TikTok traffic.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
