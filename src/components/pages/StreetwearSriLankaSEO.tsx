import React from 'react';
import { ShieldCheck, Zap, Sparkles, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SEOHead } from '../common/SEOHead';
import { getBreadcrumbSchema } from '../../utils/seo';

export const StreetwearSriLankaSEO: React.FC = () => {
  const { setActiveCategory } = useStore();

  const seoMetadata = {
    title: 'Streetwear & Oversized Clothing Sri Lanka | VALKNUT Official',
    description: 'Discover Sri Lanka’s premier dark luxury streetwear brand. 480GSM heavyweight hoodies, boxy oversized graphic t-shirts, tactical cargo joggers, and custom apparel made in Colombo.',
    keywords: 'streetwear sri lanka, oversized t shirts colombo, luxury streetwear brand lk, heavyweight hoodies sri lanka, koko pay clothing, custom print tshirts sri lanka',
    canonicalUrl: 'https://valknutofficial.com/#/sri-lanka-streetwear',
    ogTitle: 'Streetwear & Oversized Clothing Sri Lanka | VALKNUT Official',
    ogDescription: 'OWN YOUR MIND. CONTROL YOUR WORLD. Heavyweight 480GSM luxury streetwear engineered in Colombo.',
    ogImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
    jsonLd: [
      getBreadcrumbSchema([
        { name: 'Home', url: '/#/' },
        { name: 'Sri Lanka Streetwear', url: '/#/sri-lanka-streetwear' }
      ])
    ]
  };

  const handleShopNow = () => {
    setActiveCategory('ALL');
    window.location.hash = '#/shop';
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <SEOHead metadata={seoMetadata} />
      {/* Breadcrumb for SEO */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400">
          <li>
            <a href="#/" className="hover:text-[#d4af37] transition-colors">Home</a>
          </li>
          <li><span>/</span></li>
          <li className="text-[#d4af37] font-semibold">Sri Lanka Streetwear Culture</li>
        </ol>
      </nav>

      {/* Hero Heading for SEO */}
      <header className="mb-14 text-center max-w-3xl mx-auto">
        <span className="badge-pill badge-gold mb-4">
          <Sparkles size={12} /> COLOMBO STREETWEAR REVOLUTION
        </span>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white mb-6 leading-none font-syne">
          The Ultimate <span className="gold-gradient-text">Streetwear & Oversized</span> Clothing Brand in Sri Lanka
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light">
          Engineered in Colombo. Crafted from ultra-heavyweight 100% organic cotton (up to 480 GSM). 
          VALKNUT Official redefines modern luxury streetwear with boxy silhouettes, dark aesthetics, and uncompromising discipline.
        </p>
      </header>

      {/* Grid of Key Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="glass-panel p-8 rounded-sm border-l-2 border-l-[#d4af37] hover:border-white/20 transition-all">
          <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] mb-6">
            <Zap size={24} />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-wider text-white mb-3 font-syne">
            480 GSM Heavyweight Cotton
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Unlike mass-market flimsy t-shirts, every VALKNUT garment is crafted using premium high-density Sri Lankan organic cotton, built for durability and structured boxy drape.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-sm border-l-2 border-l-[#d4af37] hover:border-white/20 transition-all">
          <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] mb-6">
            <MapPin size={24} />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-wider text-white mb-3 font-syne">
            Islandwide Delivery
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Fast express courier delivery across Colombo, Kandy, Galle, Gampaha, Kurunegala, Jaffna, and all 25 districts in Sri Lanka with live AWB tracking and SMS alerts.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-sm border-l-2 border-l-[#d4af37] hover:border-white/20 transition-all">
          <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] mb-6">
            <ShieldCheck size={24} />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-wider text-white mb-3 font-syne">
            Buy Now Pay Later with Koko
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Split your order into 3 interest-free installments via Koko, or pay securely via OnePay, Visa/MasterCard, and Cash on Delivery.
          </p>
        </div>
      </div>

      {/* SEO Long Form Content & Keywords */}
      <div className="glass-panel p-8 sm:p-12 rounded-sm mb-16 space-y-8 text-slate-300">
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase mb-4 font-syne">
            Why VALKNUT is Ranked #1 for Sri Lankan Dark Streetwear
          </h2>
          <p className="leading-relaxed mb-4 text-sm sm:text-base">
            Streetwear in Sri Lanka has evolved beyond fast-fashion graphics. Today’s discerning youth and fashion connoisseurs demand substantial fabric weight, architectural silhouettes, precision embroidery, and empowering philosophies. VALKNUT was founded on the Norse emblem of nine worlds and inner power, encapsulated in our decree: <strong>“OWN YOUR MIND. CONTROL YOUR WORLD.”</strong>
          </p>
          <p className="leading-relaxed text-sm sm:text-base">
            From our iconic <em>Celestial Mountain Vintage Washed Oversized Tees</em> to the monolithic <em>480GSM Sovereign Hoodies</em> and bespoke <em>Custom Studio</em>, we guarantee world-class garment construction manufactured ethically right here in Sri Lanka.
          </p>
        </section>

        <section className="pt-6 border-t border-white/10">
          <h3 className="text-xl font-bold text-white uppercase mb-4 font-syne">
            Popular Streetwear Categories in Sri Lanka
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-[#d4af37] shrink-0 mt-0.5" size={18} />
              <div>
                <strong className="text-white">Oversized T-Shirts Sri Lanka:</strong> Drop-shoulder boxy cuts with high-density puff rubber print and pre-shrunk cotton.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-[#d4af37] shrink-0 mt-0.5" size={18} />
              <div>
                <strong className="text-white">Heavyweight Winter & Rain Hoodies:</strong> Double-lined hoods with metallic aglets and architectural drop cuffs.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-[#d4af37] shrink-0 mt-0.5" size={18} />
              <div>
                <strong className="text-white">Tactical Cargo Joggers:</strong> Water-repellent technical weave with multi-zip utility pockets.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-[#d4af37] shrink-0 mt-0.5" size={18} />
              <div>
                <strong className="text-white">Gym Pump Covers & Activewear:</strong> Breathable thermal-regulating mesh and ribbed crop tops.
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Call to action */}
      <div className="text-center bg-gradient-to-r from-[#12141d] via-[#1a1e2d] to-[#12141d] p-10 rounded-sm border border-[#d4af37]/30">
        <h2 className="text-2xl sm:text-4xl font-black uppercase text-white mb-4 font-syne">
          Ready to Elevate Your Wardrobe?
        </h2>
        <p className="text-slate-300 text-sm max-w-xl mx-auto mb-8">
          Explore the latest 2026 drops, limited releases, and customize your own apparel in the VALKNUT Studio.
        </p>
        <button 
          onClick={handleShopNow}
          className="btn-gold px-8 py-4 text-sm font-bold tracking-widest inline-flex items-center gap-3"
        >
          <span>EXPLORE NEW ARRIVALS</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
