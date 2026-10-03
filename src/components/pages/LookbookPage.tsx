import React from 'react';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SEOHead } from '../common/SEOHead';
import { getBreadcrumbSchema } from '../../utils/seo';

interface LookbookItem {
  id: string;
  title: string;
  collection: string;
  image: string;
  productId: string;
  productName: string;
  price: number;
}

const LOOKBOOK_ITEMS: LookbookItem[] = [
  {
    id: 'look-1',
    title: 'Look 01: The Sovereign Monolith',
    collection: 'DARK SOVEREIGN 2026',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
    productId: 'prod-1',
    productName: 'VALKNUT Celestial Mountain 480GSM Sovereign Hoodie',
    price: 12500
  },
  {
    id: 'look-2',
    title: 'Look 02: Mind Control Signature',
    collection: 'ESSENTIAL SIGNATURE',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85',
    productId: 'prod-2',
    productName: 'Mind Control Heavyweight Oversized Tee',
    price: 6800
  },
  {
    id: 'look-3',
    title: 'Look 03: Celestial Occult Series',
    collection: 'DARK SOVEREIGN 2026',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85',
    productId: 'prod-3',
    productName: 'Celestial Mountain Acid Wash Oversized Tee',
    price: 6500
  },
  {
    id: 'look-4',
    title: 'Look 04: Urban Stealth Utility',
    collection: 'STEALTH LABS',
    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1200&q=85',
    productId: 'prod-7',
    productName: 'Valknut Stealth Tech Tactical Joggers',
    price: 9800
  },
  {
    id: 'look-5',
    title: 'Look 05: Femme Raw Sculpted',
    collection: 'VALKNUT FEMME',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
    productId: 'prod-8',
    productName: 'VALKNUT Femme Sculpted Crop Hoodie',
    price: 9500
  },
  {
    id: 'look-6',
    title: 'Look 06: Heavyweight Iron Cover',
    collection: 'EVERYDAY ESSENTIALS',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=85',
    productId: 'prod-9',
    productName: 'Essential Oversized Boxy Gym Pump Cover',
    price: 5900
  }
];

export const LookbookPage: React.FC = () => {
  const { products, setSelectedProduct } = useStore();

  const seoMetadata = {
    title: 'Editorial Lookbook 2026 | VALKNUT Official Sri Lanka',
    description: 'Explore the 2026 VALKNUT Official Streetwear Lookbook. 480GSM Sovereign Hoodies, acid wash oversized tees, and tactical utility wear documented on Colombo brutalist backdrops.',
    keywords: 'streetwear lookbook sri lanka, valknut editorial, fashion photography colombo, dark luxury streetwear aesthetic',
    canonicalUrl: 'https://valknutofficial.com/#/lookbook',
    ogTitle: 'Editorial Lookbook 2026 — VALKNUT Official',
    ogDescription: 'Documenting the collision of dark architectural minimalism and Colombo streetwear.',
    ogImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
    jsonLd: [
      getBreadcrumbSchema([
        { name: 'Home', url: '/#/' },
        { name: 'Editorial Lookbook', url: '/#/lookbook' }
      ])
    ]
  };

  const handleOpenProduct = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    if (prod) {
      setSelectedProduct(prod);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SEOHead metadata={seoMetadata} />
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400">
          <li><a href="#/" className="hover:text-[#d4af37]">Home</a></li>
          <li><span>/</span></li>
          <li className="text-[#d4af37] font-semibold">Editorial Lookbook 2026</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="badge-pill badge-gold mb-4">
          <Sparkles size={12} /> CAMPAIGN 2026 • DARK SOVEREIGN
        </span>
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-4 font-syne">
          Editorial <span className="gold-gradient-text">Lookbook</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Documenting the collision of dark architectural minimalism and Colombo streetwear culture. Shot on 35mm brutalist concrete backdrops.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {LOOKBOOK_ITEMS.map((item) => (
          <div 
            key={item.id}
            className="group relative bg-[#0b0c10] rounded-sm overflow-hidden border border-white/10 hover:border-[#d4af37]/60 transition-all duration-500 flex flex-col"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-black">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Tag */}
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-mono tracking-widest uppercase bg-black/80 backdrop-blur-md px-3 py-1 border border-white/10 text-white">
                  {item.collection}
                </span>
              </div>

              {/* Hover quick action */}
              <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                <button
                  onClick={() => handleOpenProduct(item.productId)}
                  className="w-full btn-gold py-3 text-xs font-bold tracking-widest flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={14} />
                  <span>VIEW GARMENT — LKR {item.price.toLocaleString()}</span>
                </button>
              </div>
            </div>

            <div className="p-5 border-t border-white/5 bg-[#0e1017]">
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-syne mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-[#d4af37] font-medium uppercase tracking-wider">
                {item.productName}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
