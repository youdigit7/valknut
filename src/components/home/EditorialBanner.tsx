import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

export const EditorialBanner: React.FC = () => {
  return (
    <section className="relative min-h-[85vh] lg:min-h-screen py-20 sm:py-24 lg:py-28 w-full overflow-hidden bg-[#0A0A0A] flex flex-col justify-center items-center border-b border-white/10">
      {/* Background Graphic & Texture */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=2000&q=85"
          alt="VALKNUT Custom Studio Craftsmanship"
          loading="lazy"
          className="w-full h-full object-cover object-center filter brightness-[0.25] contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/70 to-[#0A0A0A]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
      </div>

      <Container size="default" className="relative z-10">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full">
            <Sparkles size={14} className="text-[#D4AF37]" />
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-[#D4AF37] uppercase">
              BESPOKE APPAREL ENGINEERING
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase font-heading tracking-tight leading-[1.12]">
            MAKE IT YOUR ARMOR.<br />
            <span className="gold-gradient-text mt-1 inline-block">CUSTOM STUDIO LIVE.</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
            Upload your signature graphics or render high-density puff rubber lettering on our 480GSM heavy blanks. Live real-time placement, multiple print techniques, and local master craftsmanship.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              variant="gold"
              size="lg"
              onClick={() => (window.location.hash = '#/custom-studio')}
              rightIcon={<ArrowRight size={16} />}
            >
              LAUNCH CUSTOM STUDIO
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => (window.location.hash = '#/lookbook')}
            >
              VIEW LOOKBOOK
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};
