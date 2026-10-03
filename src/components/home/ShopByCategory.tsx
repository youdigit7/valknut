import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';

interface CategoryCardProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  itemCount: string;
  href: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, subtitle, imageUrl, itemCount, href }) => {
  return (
    <a 
      href={href} 
      className="group block relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-[#181a27] via-[#10121d] to-[#0a0b12] hover:border-[#D4AF37]/60 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.12)] hover:shadow-[0_30px_70px_rgba(212,175,55,0.25),inset_0_1px_0_rgba(212,175,55,0.5)] hover:-translate-y-2 transform perspective-1000"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0a0b12]">
        <img
          src={imageUrl}
          alt={`VALKNUT ${title} Collection`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.72] contrast-115 transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b12] via-[#0a0b12]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-80" />
        
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-[0.2em] text-[#D4AF37] uppercase bg-black/80 px-3.5 py-1.5 rounded-full backdrop-blur-xl border border-[#D4AF37]/40 shadow-[0_6px_16px_rgba(0,0,0,0.7)]">
            <Sparkles size={11} className="text-[#D4AF37] animate-pulse" />
            {itemCount}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-8 z-10 flex flex-col justify-end">
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-wider mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-[#F3E5AB] group-hover:to-[#D4AF37] transition-all duration-300">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300/90 mb-4 sm:mb-6 line-clamp-2 font-light leading-relaxed">
            {subtitle}
          </p>
          <div className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-extrabold text-white tracking-[0.18em] uppercase group-hover:text-[#D4AF37] transition-colors">
            <span>DISCOVER {title}</span>
            <div className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-[#D4AF37] flex items-center justify-center transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-black">
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

export const ShopByCategory: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#0a0c12] w-full flex flex-col justify-center items-center border-b border-white/10 overflow-hidden relative">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />

      <Container size="default">
        <SectionHeading
          align="center"
          eyebrow="CURATED PIECES"
          title="PRODUCT CATEGORIES"
          subtitle="Engineered for distinct fits and heavy layering. Select your discipline."
          linkText="VIEW ALL CATEGORIES"
          linkHref="#/shop"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 w-full relative z-10">
          <CategoryCard 
            title="MEN"
            subtitle="480GSM Boxy Hoodies, Oversized Graphic Tees, Tactical Cargos"
            itemCount="14 PIECES"
            imageUrl="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85"
            href="#/category/men"
          />
          <CategoryCard 
            title="WOMEN"
            subtitle="Sculpted Heavyweight Crop Tops, Wide-Leg Fleece Pants, Oversized Outerwear"
            itemCount="9 PIECES"
            imageUrl="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85"
            href="#/category/women"
          />
          <CategoryCard 
            title="ESSENTIALS"
            subtitle="Embroidered Caps, Stainless Steel Vacuum Bottles, Dark Silver Hardware"
            itemCount="7 PIECES"
            imageUrl="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85"
            href="#/category/essentials"
          />
        </div>
      </Container>
    </section>
  );
};
