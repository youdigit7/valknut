import React from 'react';
import { Sparkles, Shield, Flame, Compass, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SEOHead } from '../common/SEOHead';
import { getBreadcrumbSchema } from '../../utils/seo';

export const BrandStoryPage: React.FC = () => {
  const { setActiveCategory } = useStore();

  const seoMetadata = {
    title: 'Brand Story & Philosophy | VALKNUT Official Sri Lanka',
    description: 'Learn about VALKNUT Official, Sri Lanka’s premier dark luxury streetwear house. Rooted in ancient Norse discipline and modern architectural garment engineering.',
    keywords: 'valknut brand story, streetwear philosophy, dark luxury brand colombo, clothing brand sri lanka, own your mind control your world',
    canonicalUrl: 'https://valknutofficial.com/#/brand-story',
    ogTitle: 'Brand Story & Philosophy — VALKNUT Official',
    ogDescription: 'OWN YOUR MIND. CONTROL YOUR WORLD. Built for those who think different.',
    ogImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
    jsonLd: [
      getBreadcrumbSchema([
        { name: 'Home', url: '/#/' },
        { name: 'Brand Story', url: '/#/brand-story' }
      ])
    ]
  };

  const handleShop = () => {
    setActiveCategory('ALL');
    window.location.hash = '#/shop';
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <SEOHead metadata={seoMetadata} />
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400">
          <li><a href="#/" className="hover:text-[#d4af37]">Home</a></li>
          <li><span>/</span></li>
          <li className="text-[#d4af37] font-semibold">Brand Story</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <span className="badge-pill badge-gold mb-4">
          <Sparkles size={12} /> ESTABLISHED 2026 • COLOMBO
        </span>
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-6 font-syne">
          We Design More Than Clothes. <br />
          <span className="gold-gradient-text">We Create Identity.</span>
        </h1>
        <p className="text-lg sm:text-xl text-[#d4af37] font-semibold tracking-widest uppercase mb-4">
          “OWN YOUR MIND. CONTROL YOUR WORLD.”
        </p>
        <p className="text-slate-400 text-base leading-relaxed">
          Built for those who think different. Rooted in ancient Norse symbolism of the nine interlocked realms and modernized for contemporary dark luxury streetwear.
        </p>
      </div>

      {/* The 4 Pillars */}
      <div className="mb-24">
        <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-center text-white mb-12 font-syne">
          The Four Pillars of VALKNUT
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Pillar 1: MIND */}
          <div className="glass-panel p-8 text-center rounded-sm border-t-2 border-t-[#d4af37] group hover:bg-[#151824] transition-all">
            <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] group-hover:scale-110 transition-transform">
              <Sparkles size={28} />
            </div>
            <h3 className="text-xl font-bold uppercase text-white mb-2 font-syne">MIND</h3>
            <span className="text-xs text-[#d4af37] font-mono tracking-widest uppercase block mb-3">Clarity & Vision</span>
            <p className="text-slate-400 text-xs leading-relaxed">
              Every creation starts in the psyche. We engineer apparel that sharpens your mental focus and asserts quiet dominance.
            </p>
          </div>

          {/* Pillar 2: CONTROL */}
          <div className="glass-panel p-8 text-center rounded-sm border-t-2 border-t-[#d4af37] group hover:bg-[#151824] transition-all">
            <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] group-hover:scale-110 transition-transform">
              <Shield size={28} />
            </div>
            <h3 className="text-xl font-bold uppercase text-white mb-2 font-syne">CONTROL</h3>
            <span className="text-xs text-[#d4af37] font-mono tracking-widest uppercase block mb-3">Mastery of Self</span>
            <p className="text-slate-400 text-xs leading-relaxed">
              True power is internal governance. Master your reactions, dictate your path, and take absolute command of your realm.
            </p>
          </div>

          {/* Pillar 3: DISCIPLINE */}
          <div className="glass-panel p-8 text-center rounded-sm border-t-2 border-t-[#d4af37] group hover:bg-[#151824] transition-all">
            <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] group-hover:scale-110 transition-transform">
              <Flame size={28} />
            </div>
            <h3 className="text-xl font-bold uppercase text-white mb-2 font-syne">DISCIPLINE</h3>
            <span className="text-xs text-[#d4af37] font-mono tracking-widest uppercase block mb-3">Relentless Execution</span>
            <p className="text-slate-400 text-xs leading-relaxed">
              The bridge between vision and reality. Consistent, uncompromising dedication woven into every stitch and seam.
            </p>
          </div>

          {/* Pillar 4: FREEDOM */}
          <div className="glass-panel p-8 text-center rounded-sm border-t-2 border-t-[#d4af37] group hover:bg-[#151824] transition-all">
            <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] group-hover:scale-110 transition-transform">
              <Compass size={28} />
            </div>
            <h3 className="text-xl font-bold uppercase text-white mb-2 font-syne">FREEDOM</h3>
            <span className="text-xs text-[#d4af37] font-mono tracking-widest uppercase block mb-3">Limitless Expression</span>
            <p className="text-slate-400 text-xs leading-relaxed">
              Liberation from generic trends. An authentic, timeless aesthetic that stays sharp across years, not seasons.
            </p>
          </div>
        </div>
      </div>

      {/* Sri Lankan Craftsmanship */}
      <div className="glass-panel p-8 sm:p-12 rounded-sm mb-20 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="badge-pill badge-dark mb-4">100% ETHICAL APPAREL</span>
            <h2 className="text-2xl sm:text-4xl font-bold uppercase text-white mb-6 font-syne">
              Made in Sri Lanka. <br />
              <span className="text-[#d4af37]">Crafted for the World.</span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Sri Lanka is globally recognized for high-caliber garment engineering and textile excellence. VALKNUT harnesses this artisan heritage to construct heavyweight streetwear fabrics with zero compromise.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              From our pre-shrunk reactive dyeing process to reinforced architectural neckline ribs, every single piece undergoes meticulous quality inspection before dispatch.
            </p>
          </div>
          <div className="bg-[#0b0c10] p-6 rounded-sm border border-white/10 text-center">
            <div className="w-20 h-20 mx-auto mb-4 border border-[#d4af37]/40 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-[#d4af37] font-['Cinzel']">VK</span>
            </div>
            <h4 className="text-base font-bold text-white uppercase tracking-widest mb-1">VALKNUT ESSENTIAL</h4>
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-4">Sri Lanka • Est 2026</p>
            <div className="inline-block py-2 px-4 bg-white/5 border border-white/10 rounded-sm text-xs font-mono text-slate-300">
              valknutofficial.com
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <button 
          onClick={handleShop}
          className="btn-gold px-10 py-4 text-sm font-bold tracking-widest inline-flex items-center gap-3"
        >
          <span>EXPLORE VALKNUT ESSENTIALS</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
