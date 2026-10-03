import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Compass } from 'lucide-react';
import { Button } from '../ui/Button';

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
    <section className="relative min-h-[94vh] sm:min-h-[98vh] w-full flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
      
      {/* Background Editorial Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source 
            media="(max-width: 768px)" 
            srcSet="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=85" 
          />
          <img
            src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=2000&q=90"
            alt="VALKNUT Official Editorial Campaign"
            className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-125 scale-105 transition-transform duration-1000"
            loading="eager"
            fetchPriority="high"
          />
        </picture>

        {/* Ambient Dark Luxury Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-[#0A0A0A]/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/80 via-transparent to-[#0A0A0A]/80" />
      </div>

      {/* Gold Ambient Backlight */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[350px] bg-[#D4AF37]/15 blur-[180px] pointer-events-none" />

      {/* Hero Content Box */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 text-center py-24 sm:py-32 flex flex-col items-center justify-center">
        
        {/* Brand Crest & Eyebrow */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-black/60 border border-white/15 rounded-full mb-8 backdrop-blur-md shadow-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] text-slate-200 uppercase">
            DROP 04 / DARK SOVEREIGN
          </span>
        </div>

        {/* Valknut Sigil Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-[#D4AF37] flex items-center justify-center rounded-[3px] mb-8 shadow-[0_0_35px_rgba(212,175,55,0.3)] bg-black/40 backdrop-blur-sm">
          <span className="text-[#D4AF37] font-heading text-3xl font-black">V</span>
        </div>

        {/* Editorial Headline */}
        <h1 className="font-heading font-black uppercase text-white tracking-tight leading-[1.12] mb-6 max-w-4xl" style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5.25rem)' }}>
          <span className="gold-gradient-text block">OWN YOUR MIND.</span>
          <span className="text-white block mt-2">CONTROL YOUR WORLD.</span>
        </h1>

        {/* Subtitle / Philosophy */}
        <p className="text-slate-200 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed mb-12 font-normal tracking-wide">
          Engineered in Colombo. 480GSM heavyweight cotton, architectural silhouettes, 
          and dark luxury minimalism crafted for those who command their destiny.
        </p>

        {/* Action Buttons with Prominent Sizing & Distinction */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
          <Button 
            variant="gold" 
            size="xl" 
            onClick={handleShopNow}
            rightIcon={<ArrowRight size={18} />}
            className="w-full sm:w-auto min-w-[220px] shadow-[0_0_35px_rgba(212,175,55,0.45)]"
          >
            SHOP NOW
          </Button>

          <Button 
            variant="secondary" 
            size="xl" 
            onClick={handleExploreCollection}
            leftIcon={<Compass size={18} />}
            className="w-full sm:w-auto min-w-[220px]"
          >
            EXPLORE COLLECTION
          </Button>
        </div>

        {/* Micro Credibility Line */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-xs font-mono text-slate-400 uppercase tracking-widest">
          <span>✓ Islandwide Delivery</span>
          <span>✓ Koko 3x Instalments</span>
          <span>✓ 480GSM French Terry</span>
        </div>
      </div>

      {/* WhatsApp Quick Connect Floating Button */}
      <a 
        href="https://wa.me/94770000000?text=Hello%20VALKNUT%20Official"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 bg-[#25D366] text-black text-xs font-black tracking-wider uppercase rounded-full shadow-[0_0_25px_rgba(37,211,102,0.4)] hover:scale-105 active:scale-95 transition-transform backdrop-blur-md"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span>WHATSAPP US</span>
      </a>
    </section>
  );
};
