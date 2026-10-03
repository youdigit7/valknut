import React from 'react';
import { Truck, Shield, RotateCcw, CreditCard } from 'lucide-react';
import { Container } from '../ui/Container';

export const TrustBar: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-[#0E1017] border-b border-white/10 w-full flex justify-center">
      <Container size="default">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 text-slate-300">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[2px] bg-[#12141E] border border-white/10 flex items-center justify-center shrink-0">
              <Truck size={22} className="text-[#D4AF37]" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white block">ISLANDWIDE DELIVERY</span>
              <span className="text-[11px] font-mono text-slate-400 mt-0.5 block">1-3 Days Across Sri Lanka</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[2px] bg-[#12141E] border border-white/10 flex items-center justify-center shrink-0">
              <CreditCard size={22} className="text-[#D4AF37]" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white block">KOKO & MINTPAY</span>
              <span className="text-[11px] font-mono text-slate-400 mt-0.5 block">3 Interest-Free Instalments</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[2px] bg-[#12141E] border border-white/10 flex items-center justify-center shrink-0">
              <RotateCcw size={22} className="text-[#D4AF37]" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white block">EASY SIZE EXCHANGES</span>
              <span className="text-[11px] font-mono text-slate-400 mt-0.5 block">Hassle-Free Fit Guarantee</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[2px] bg-[#12141E] border border-white/10 flex items-center justify-center shrink-0">
              <Shield size={22} className="text-[#D4AF37]" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white block">100% AUTHENTIC</span>
              <span className="text-[11px] font-mono text-slate-400 mt-0.5 block">Engineered in Colombo</span>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
};
