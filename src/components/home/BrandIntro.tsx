import React from 'react';
import { Layers, Sparkles, Truck, CheckCircle2, ArrowRight, Compass } from 'lucide-react';
import { Container } from '../ui/Container';

export const BrandIntro: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#0A0A0A] border-b border-white/10 w-full flex flex-col justify-center items-center overflow-hidden">
      <Container size="default">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">

          {/* Eyebrow Tag with 3D Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-[#D4AF37]/15 via-black/40 to-[#D4AF37]/15 border border-[#D4AF37]/40 rounded-full mb-5 backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.15)]">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] sm:tracking-[0.25em] text-[#D4AF37] uppercase">
              THE ARCHITECTURE OF VALKNUT
            </span>
          </div>

          {/* Headline with 3D Depth */}
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[1.12] max-w-4xl break-words drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            BUILT FOR THOSE WHO COMMAND RESPECT THROUGH RESTRAINT.
          </h2>

          {/* Narrative Body */}
          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed font-light mt-4 max-w-2xl px-2 sm:px-0">
            Rooted in the ancient Norse geometry of the bound knot and engineered in Colombo.
            VALKNUT creates high-density garments for individuals who choose substance over noise.
            No synthetic blends. No cheap prints. Pure heavyweight cotton tailored with uncompromising structure.
          </p>

          {/* 4 Feature Architecture Cards - 3D Floating Glass Slabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full mt-12 sm:mt-16 text-left">

            {/* Card 1: 480 GSM */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#181a28]/85 via-[#10121d]/90 to-[#0b0c14] border border-white/15 border-t-white/30 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.25)] hover:border-[#D4AF37]/60 hover:-translate-y-2 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight gold-gradient-text drop-shadow-[0_4px_12px_rgba(212,175,55,0.4)]">
                    480 GSM
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D4AF37]/25 to-black/60 border border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.25)] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Layers size={19} className="text-[#D4AF37]" />
                  </div>
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
                  FABRIC WEIGHT
                </span>
                <h3 className="text-sm font-bold text-white uppercase font-heading">
                  HEAVY FRENCH TERRY
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-4 pt-3 border-t border-white/10 leading-relaxed font-light">
                Ultra-dense combed cotton with permanent structural drape.
              </p>
            </div>

            {/* Card 2: 100% Cotton */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#181a28]/85 via-[#10121d]/90 to-[#0b0c14] border border-white/15 border-t-white/30 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.25)] hover:border-[#D4AF37]/60 hover:-translate-y-2 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight gold-gradient-text drop-shadow-[0_4px_12px_rgba(212,175,55,0.4)]">
                    100%
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D4AF37]/25 to-black/60 border border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.25)] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CheckCircle2 size={19} className="text-[#D4AF37]" />
                  </div>
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
                  PURITY GRADE
                </span>
                <h3 className="text-sm font-bold text-white uppercase font-heading">
                  COMBED COTTON
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-4 pt-3 border-t border-white/10 leading-relaxed font-light">
                Zero synthetic polyester blends. Breathable and pre-shrunk.
              </p>
            </div>

            {/* Card 3: Custom Studio */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#181a28]/85 via-[#10121d]/90 to-[#0b0c14] border border-white/15 border-t-white/30 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.25)] hover:border-[#D4AF37]/60 hover:-translate-y-2 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight gold-gradient-text drop-shadow-[0_4px_12px_rgba(212,175,55,0.4)]">
                    CUSTOM
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D4AF37]/25 to-black/60 border border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.25)] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkles size={19} className="text-[#D4AF37]" />
                  </div>
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
                  STUDIO GRAPHICS
                </span>
                <h3 className="text-sm font-bold text-white uppercase font-heading">
                  HIGH-DENSITY EMBROIDERY
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-4 pt-3 border-t border-white/10 leading-relaxed font-light">
                Bespoke 3D puff rubber and metallic thread application.
              </p>
            </div>

            {/* Card 4: Colombo Dispatch */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#181a28]/85 via-[#10121d]/90 to-[#0b0c14] border border-white/15 border-t-white/30 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.25)] hover:border-[#D4AF37]/60 hover:-translate-y-2 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight gold-gradient-text drop-shadow-[0_4px_12px_rgba(212,175,55,0.4)]">
                    COLOMBO
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D4AF37]/25 to-black/60 border border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.25)] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Truck size={19} className="text-[#D4AF37]" />
                  </div>
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
                  ISLANDWIDE DISPATCH
                </span>
                <h3 className="text-sm font-bold text-white uppercase font-heading">
                  1-3 DAYS DELIVERY
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-4 pt-3 border-t border-white/10 leading-relaxed font-light">
                Tracked courier service across all 25 districts in Sri Lanka.
              </p>
            </div>

          </div>

          {/* Action Triggers with Modern 3D Buttons & Generous Breathing Room */}
          <div className="pt-12 sm:pt-16 pb-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => (window.location.hash = '#/shop')}
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-gradient-to-r from-[#e2b714] via-[#D4AF37] to-[#aa8010] text-black font-extrabold text-xs sm:text-sm tracking-[0.16em] uppercase rounded-xl shadow-[0_12px_30px_rgba(212,175,55,0.45),inset_0_1px_1px_rgba(255,255,255,0.6)] hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(212,175,55,0.6)] active:translate-y-0.5 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <span>EXPLORE APPAREL</span>
              <ArrowRight size={17} />
            </button>
            <button
              onClick={() => (window.location.hash = '#/custom-studio')}
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-white/[0.08] hover:bg-white/[0.14] text-white font-extrabold text-xs sm:text-sm tracking-[0.16em] uppercase rounded-xl border border-white/20 hover:border-[#D4AF37]/50 backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:-translate-y-1 active:translate-y-0.5 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Compass size={17} />
              <span>CUSTOMIZE IN STUDIO</span>
            </button>
          </div>

        </div>
      </Container>
    </section>
  );
};
