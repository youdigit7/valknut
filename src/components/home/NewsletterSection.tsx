import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setSubscribed(true);
        setEmail('');
      }, 500);
    }
  };

  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-gradient-to-b from-[#0E1017] to-[#0A0A0A] border-b border-white/10 w-full flex flex-col justify-center items-center overflow-hidden">
      <Container size="narrow">
        <div className="text-center space-y-4 sm:space-y-6">
          <span className="text-[#D4AF37] text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase block">
            THE INNER CIRCLE
          </span>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[1.15] break-words">
            BE FIRST WHEN LIMITED DROPS GO LIVE.
          </h2>
          
          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto font-normal px-2">
            Numbered garments sell out in hours. Receive private 24-hour early access codes, member-only editorial previews, and exclusive sizing reservations.
          </p>

          {subscribed ? (
            <div className="inline-flex items-center gap-3 px-6 py-4 sm:px-8 sm:py-5 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-[2px] text-[#D4AF37] text-xs font-mono font-bold tracking-wider uppercase animate-fade-in max-w-full">
              <Check size={18} className="shrink-0" />
              <span className="truncate">YOUR EMAIL IS RESERVED ON THE VIP DROP LIST</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 max-w-lg mx-auto pt-2 sm:pt-4 w-full px-2 sm:px-0">
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER YOUR EMAIL FOR EARLY ACCESS"
                required
                className="w-full min-w-0 flex-1 px-4 py-3 sm:px-5 sm:py-3.5 bg-[#12141E] border border-white/15 text-white text-xs sm:text-sm font-mono placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] transition-colors rounded-[2px]"
              />
              <Button
                variant="gold"
                size="lg"
                type="submit"
                isLoading={isLoading}
                rightIcon={<ArrowRight size={16} />}
                className="w-full sm:w-auto shrink-0 text-xs sm:text-sm font-extrabold"
              >
                JOIN CLUB
              </Button>
            </form>
          )}

          <p className="text-slate-500 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest pt-2 sm:pt-3">
            No spam. No promotional noise. Unsubscribe at any time.
          </p>
        </div>
      </Container>
    </section>
  );
};
