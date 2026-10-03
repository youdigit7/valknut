import React from 'react';
import { Shield, Zap, Lock } from 'lucide-react';
import { Container } from '../ui/Container';

export const BrandPhilosophy: React.FC = () => {
  return (
    <section className="min-h-[85vh] lg:min-h-screen py-20 sm:py-24 lg:py-28 bg-[#0E1017] border-b border-white/10 w-full flex flex-col justify-center items-center overflow-hidden">
      <Container size="default">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Brand Philosophy Visual */}
          <div className="relative">
            <div className="relative rounded-[3px] overflow-hidden border border-white/10 p-2 bg-[#12141E] shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85" 
                alt="VALKNUT Brand Craftsmanship" 
                loading="lazy"
                className="w-full h-[480px] object-cover rounded-[2px] filter contrast-110 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-[#0E1017]/95 border border-[#D4AF37]/40 rounded-[2px] backdrop-blur-md">
                <span className="text-xs font-mono font-extrabold tracking-[0.25em] text-[#D4AF37] uppercase block mb-1.5">
                  THE VALKNUT CODE
                </span>
                <p className="text-white text-base sm:text-lg font-bold font-heading uppercase leading-snug">
                  &ldquo;WE DO NOT FOLLOW TRENDS. WE ARCHITECT THE STANDARD.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Text & Pillars */}
          <div className="space-y-7">
            <div className="inline-block px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full">
              <span className="text-xs font-mono font-bold text-[#D4AF37] tracking-widest uppercase">
                BRAND PHILOSOPHY
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase font-heading leading-[1.18]">
              DESIGNED FOR THOSE WHO COMMAND THEIR DESTINY.
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              VALKNUT Official was founded on a singular principle: true power starts within the mind. 
              Our garments are built not merely as apparel, but as armor for the relentless—combining 
              architectural heavy drape fabrics, precision tailoring, and dark luxury minimalism.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 pt-4">
              <div className="p-5 bg-[#12141E] border border-white/5 rounded-[2px] hover:border-[#D4AF37]/40 transition-colors shadow-lg">
                <Shield className="text-[#D4AF37] mb-3" size={26} />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1.5">UNCOMPROMISED</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">480GSM ultra-dense organic cotton constructions.</p>
              </div>

              <div className="p-5 bg-[#12141E] border border-white/5 rounded-[2px] hover:border-[#D4AF37]/40 transition-colors shadow-lg">
                <Zap className="text-[#D4AF37] mb-3" size={26} />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1.5">CUSTOM STUDIO</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">Personalize with high-density puff & embroidery.</p>
              </div>

              <div className="p-5 bg-[#12141E] border border-white/5 rounded-[2px] hover:border-[#D4AF37]/40 transition-colors shadow-lg">
                <Lock className="text-[#D4AF37] mb-3" size={26} />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1.5">SECURE CHECKOUT</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">Koko, OnePay & eWAY instant payments.</p>
              </div>
            </div>

          </div>

        </div>
      </Container>
    </section>
  );
};
