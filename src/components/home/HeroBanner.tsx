import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Compass, ShieldCheck, Sparkles } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { setActiveCategory } = useStore();

  const handleShopNow = () => {
    setActiveCategory('ALL');
    window.location.hash = '#/shop';
  };

  const handleExploreCollection = () => {
    const el = document.getElementById('featured-collection-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = '#/shop';
    }
  };

  return (
    <section className="relative min-h-[92vh] sm:min-h-[95vh] lg:min-h-screen w-full flex flex-col justify-end items-center overflow-hidden bg-[#0A0A0A] pb-10 sm:pb-16 lg:pb-20 pt-28 sm:pt-32">

      <div className="absolute inset-0 z-0">
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=85"
          />
          <img
            src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=2000&q=90"
            alt="VALKNUT Official Editorial Campaign"
            className="w-full h-full object-cover object-top filter brightness-[0.55] contrast-120 transition-transform duration-1000 ease-out"
            loading="eager"
            fetchPriority="high"
          />
        </picture>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-radial-vignette opacity-70" />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[650px] lg:w-[950px] h-[350px] sm:h-[500px] bg-[#D4AF37]/10 blur-[150px] sm:blur-[220px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">

        <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-black/60 border border-[#D4AF37]/50 rounded-full mb-4 sm:mb-6 backdrop-blur-xl shadow-[0_4px_20px_rgba(212,175,55,0.2)]">
          <Sparkles size={13} className="text-[#D4AF37] animate-pulse" />
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] text-[#D4AF37] uppercase">
            DROP 04 / DARK SOVEREIGN
          </span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60" />
          <span className="hidden sm:inline-block text-[10px] font-mono text-slate-300 uppercase tracking-widest">
            COLOMBO ARCHIVES
          </span>
        </div>

        <h1
          className="font-heading font-black uppercase tracking-tight leading-[1.05] mb-3 sm:mb-5 max-w-4xl text-balance drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)]"
          style={{ fontSize: 'clamp(2.2rem, 5.5vw + 0.5rem, 5.25rem)' }}
        >
          <span className="gold-gradient-text block drop-shadow-[0_4px_25px_rgba(212,175,55,0.35)]">
            OWN YOUR MIND.
          </span>
          <span className="text-white block mt-1 drop-shadow-[0_8px_30px_rgba(0,0,0,0.9)]">
            CONTROL YOUR WORLD.
          </span>
        </h1>

        <p className="text-slate-200/90 text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-6 sm:mb-8 font-light tracking-wide drop-shadow-[0_3px_15px_rgba(0,0,0,0.9)] px-3">
          Engineered in Colombo. 480GSM heavyweight cotton, architectural boxy fits,
          and dark luxury minimalism crafted for those who command their destiny.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5 w-full sm:w-auto px-2 max-w-md sm:max-w-none mx-auto mb-8 sm:mb-10">
          <button
            onClick={handleShopNow}
            className="w-full sm:w-auto px-9 py-4 bg-gradient-to-r from-[#e6c042] via-[#D4AF37] to-[#aa8010] text-black font-extrabold text-xs sm:text-sm tracking-[0.18em] uppercase rounded-xl shadow-[0_15px_35px_rgba(212,175,55,0.4),inset_0_1px_1px_rgba(255,255,255,0.7)] hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(212,175,55,0.6)] active:translate-y-0.5 transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <span>SHOP COLLECTION</span>
            <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleExploreCollection}
            className="w-full sm:w-auto px-9 py-4 bg-black/50 hover:bg-black/75 text-white font-extrabold text-xs sm:text-sm tracking-[0.18em] uppercase rounded-xl border border-white/25 hover:border-[#D4AF37]/60 backdrop-blur-xl shadow-[0_12px_30px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.18)] hover:-translate-y-1 active:translate-y-0.5 transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <Compass size={17} className="text-[#D4AF37] group-hover:rotate-45 transition-transform duration-300" />
            <span>EXPLORE PIECES</span>
          </button>
        </div>

        <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-4 sm:px-6 py-2.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.7)]">
          <span className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono text-slate-300 uppercase tracking-wider">
            <ShieldCheck size={13} className="text-[#D4AF37]" />
            480GSM French Terry
          </span>
          <span className="text-white/20 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono text-slate-300 uppercase tracking-wider">
            <span className="text-[#D4AF37] font-bold">✓</span>
            Islandwide Delivery
          </span>
          <span className="text-white/20 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono text-slate-300 uppercase tracking-wider">
            <span className="text-[#D4AF37] font-bold">✓</span>
            Koko 3x Instalments
          </span>
        </div>

      </div>

      <a
        href="https://wa.me/94770000000?text=Hello%20VALKNUT%20Official"
        target="_blank"
        rel="noreferrer"
        className="whatsapp-floating-btn"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="font-extrabold uppercase">WHATSAPP US</span>
      </a>
    </section>
  );
};
