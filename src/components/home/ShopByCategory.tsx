import React from 'react';
import { ArrowRight } from 'lucide-react';
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
    <a href={href} className="group block relative overflow-hidden rounded-[3px] border border-white/10 bg-[#12141E] hover:border-[#D4AF37]/50 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
      {/* Category Image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={`VALKNUT ${title} Collection`}
          loading="lazy"
          className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-115 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
        
        {/* Top Tag */}
        <div className="absolute top-4 left-4 z-10">
          <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-[#D4AF37] uppercase bg-black/75 px-3 py-1.5 rounded-[2px] backdrop-blur-md border border-[#D4AF37]/30">
            {itemCount}
          </span>
        </div>

        {/* Bottom Content Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 z-10 flex flex-col justify-end">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase font-heading tracking-wider mb-2 group-hover:text-[#D4AF37] transition-colors">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mb-5 line-clamp-2 font-light leading-relaxed">
            {subtitle}
          </p>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-white tracking-[0.18em] uppercase group-hover:translate-x-1.5 transition-transform">
            <span>EXPLORE {title}</span>
            <ArrowRight size={16} className="text-[#D4AF37]" />
          </div>
        </div>
      </div>
    </a>
  );
};

export const ShopByCategory: React.FC = () => {
  return (
    <section className="min-h-[85vh] lg:min-h-screen py-20 sm:py-24 lg:py-28 bg-[#0E1017] w-full flex flex-col justify-center items-center border-b border-white/10 overflow-hidden">
      <Container size="default">
        
        <SectionHeading
          align="center"
          eyebrow="CURATED PIECES"
          title="PRODUCT CATEGORIES"
          subtitle="Engineered for distinct fits and heavy layering. Select your discipline."
          linkText="VIEW ALL CATEGORIES"
          linkHref="#/shop"
        />

        {/* Categories 3-Column Grid with generous spacing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 w-full">
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
