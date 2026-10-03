import React from 'react';
import { Truck, Shield, RotateCcw, CreditCard } from 'lucide-react';
import { Container } from '../ui/Container';

export const TrustBar: React.FC = () => {
  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-[#0E1017] border-b border-white/10 w-full flex justify-center">
      <Container size="default">
        <div className="grid grid-cols-1 min-[440px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-slate-300">
          
          <div className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-0 rounded-[2px] bg-[#12141E]/40 sm:bg-transparent">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[2px] bg-[#12141E] border border-white/10 flex items-center justify-center shrink-0">
              <Truck size={20} className="text-[#D4AF37]" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white block">ISLANDWIDE DELIVERY</span>
              <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 mt-0.5 block">1-3 Days Across Sri Lanka</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-0 rounded-[2px] bg-[#12141E]/40 sm:bg-transparent">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[2px] bg-[#12141E] border border-white/10 flex items-center justify-center shrink-0">
              <CreditCard size={20} className="text-[#D4AF37]" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white block">KOKO & MINTPAY</span>
              <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 mt-0.5 block">3 Interest-Free Instalments</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-0 rounded-[2px] bg-[#12141E]/40 sm:bg-transparent">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[2px] bg-[#12141E] border border-white/10 flex items-center justify-center shrink-0">
              <RotateCcw size={20} className="text-[#D4AF37]" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white block">EASY SIZE EXCHANGES</span>
              <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 mt-0.5 block">Hassle-Free Fit Guarantee</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-0 rounded-[2px] bg-[#12141E]/40 sm:bg-transparent">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[2px] bg-[#12141E] border border-white/10 flex items-center justify-center shrink-0">
              <Shield size={20} className="text-[#D4AF37]" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white block">100% AUTHENTIC</span>
              <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 mt-0.5 block">Engineered in Colombo</span>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
};
