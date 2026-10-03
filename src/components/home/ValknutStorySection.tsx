import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

export const ValknutStorySection: React.FC = () => {
  return (
    <section className="min-h-[85vh] lg:min-h-screen py-20 sm:py-24 lg:py-28 bg-[#0A0A0A] border-b border-white/10 w-full flex flex-col justify-center items-center overflow-hidden">
      <Container size="default">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left - Text Content */}
          <div className="space-y-7">
            <span className="text-[#D4AF37] text-xs font-mono font-bold tracking-[0.3em] uppercase block">
              THE VALKNUT STORY
            </span>
            
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase font-heading tracking-tight leading-[1.15]">
              THREE KNOTS.<br />
              <span className="gold-gradient-text mt-1 inline-block">ONE VOW.</span>
            </h2>
            
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              The Valknut is an ancient mark of the bound — mind, body and will held in a single impenetrable form.
              We took that sacred geometry out of ancient stone and forged it into garments designed for individuals who build, lead, and conquer.
            </p>
            
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
              Every thread, every cut, and every custom hardware detail is a deliberate architectural choice. No fillers. No trend-chasing.
              Just honest, heavyweight construction from our studio in Colombo.
            </p>
            
            <div className="pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => (window.location.hash = '#/brand-story')}
                rightIcon={<ArrowRight size={16} />}
              >
                READ THE FULL STORY
              </Button>
            </div>
          </div>

          {/* Right - Cinematic Visual Showcase */}
          <div className="relative aspect-[4/3] bg-[#12141E] border border-white/10 rounded-[3px] overflow-hidden group shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85"
              alt="VALKNUT Brand Film"
              loading="lazy"
              className="w-full h-full object-cover object-center filter brightness-[0.7] contrast-125 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            
            {/* Play Trigger */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 cursor-pointer">
              <div className="w-18 h-18 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shadow-[0_0_35px_rgba(212,175,55,0.4)] group-hover:scale-110 transition-transform mb-4">
                <Play size={26} fill="currentColor" className="ml-1" />
              </div>
              <span className="text-white text-sm font-black uppercase tracking-widest font-heading">
                WATCH BRAND FILM (90s)
              </span>
              <span className="text-slate-400 text-xs font-mono mt-1">
                Filmed on 35mm in Sri Lanka
              </span>
            </div>
          </div>
          
        </div>
      </Container>
    </section>
  );
};
