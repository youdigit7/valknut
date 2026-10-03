import React from 'react';
import { Layers, Sparkles, Truck, CheckCircle2, ArrowRight, Compass } from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

export const BrandIntro: React.FC = () => {
  return (
    <section className="min-h-[85vh] lg:min-h-screen py-20 sm:py-24 lg:py-28 bg-[#0A0A0A] border-b border-white/10 w-full flex flex-col justify-center items-center overflow-hidden">
      <Container size="default">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          
          {/* Eyebrow Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full mb-5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#D4AF37] uppercase">
              THE ARCHITECTURE OF VALKNUT
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[1.15] max-w-4xl">
            BUILT FOR THOSE WHO COMMAND RESPECT THROUGH RESTRAINT.
          </h2>

          {/* Narrative Body */}
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal mt-5 max-w-2xl">
            Rooted in the ancient Norse geometry of the bound knot and engineered in Colombo. 
            VALKNUT creates high-density garments for individuals who choose substance over noise. 
            No synthetic blends. No cheap prints. Pure heavyweight cotton tailored with uncompromising structure.
          </p>

          {/* 4 Feature Architecture Cards (Instant Readability in 3 Seconds) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full mt-12 text-left">
            
            {/* Card 1: 480 GSM */}
            <div className="p-6 rounded-[3px] bg-[#0E1017] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 group flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl sm:text-3xl font-black text-[#D4AF37] font-heading tracking-tight">
                    480 GSM
                  </span>
                  <div className="w-9 h-9 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#D4AF37]/40 transition-colors">
                    <Layers size={18} className="text-[#D4AF37]" />
                  </div>
                </div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
                  FABRIC WEIGHT
                </span>
                <h3 className="text-sm font-bold text-white uppercase font-heading">
                  HEAVY FRENCH TERRY
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-white/5 leading-relaxed">
                Ultra-dense combed cotton with permanent structural drape.
              </p>
            </div>

            {/* Card 2: 100% Cotton */}
            <div className="p-6 rounded-[3px] bg-[#0E1017] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 group flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl sm:text-3xl font-black text-[#D4AF37] font-heading tracking-tight">
                    100%
                  </span>
                  <div className="w-9 h-9 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#D4AF37]/40 transition-colors">
                    <CheckCircle2 size={18} className="text-[#D4AF37]" />
                  </div>
                </div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
                  PURITY GRADE
                </span>
                <h3 className="text-sm font-bold text-white uppercase font-heading">
                  COMBED COTTON
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-white/5 leading-relaxed">
                Zero synthetic polyester blends. Breathable and pre-shrunk.
              </p>
            </div>

            {/* Card 3: Custom Studio */}
            <div className="p-6 rounded-[3px] bg-[#0E1017] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 group flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl sm:text-3xl font-black text-[#D4AF37] font-heading tracking-tight">
                    CUSTOM
                  </span>
                  <div className="w-9 h-9 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#D4AF37]/40 transition-colors">
                    <Sparkles size={18} className="text-[#D4AF37]" />
                  </div>
                </div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
                  STUDIO GRAPHICS
                </span>
                <h3 className="text-sm font-bold text-white uppercase font-heading">
                  HIGH-DENSITY EMBROIDERY
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-white/5 leading-relaxed">
                Bespoke 3D puff rubber and metallic thread application.
              </p>
            </div>

            {/* Card 4: Colombo Dispatch */}
            <div className="p-6 rounded-[3px] bg-[#0E1017] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 group flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl sm:text-3xl font-black text-[#D4AF37] font-heading tracking-tight">
                    COLOMBO
                  </span>
                  <div className="w-9 h-9 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#D4AF37]/40 transition-colors">
                    <Truck size={18} className="text-[#D4AF37]" />
                  </div>
                </div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
                  ISLANDWIDE DISPATCH
                </span>
                <h3 className="text-sm font-bold text-white uppercase font-heading">
                  1-3 DAYS DELIVERY
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-white/5 leading-relaxed">
                Tracked courier service across all 25 districts in Sri Lanka.
              </p>
            </div>

          </div>

          {/* Action Triggers */}
          <div className="pt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="gold"
              size="lg"
              onClick={() => (window.location.hash = '#/shop')}
              rightIcon={<ArrowRight size={16} />}
            >
              EXPLORE APPAREL
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => (window.location.hash = '#/custom-studio')}
              leftIcon={<Compass size={16} />}
            >
              CUSTOMIZE IN STUDIO
            </Button>
          </div>

        </div>
      </Container>
    </section>
  );
};
