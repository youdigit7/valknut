import React, { useState } from 'react';
import { Ruler } from 'lucide-react';
import { SEOHead } from '../common/SEOHead';
import { getBreadcrumbSchema } from '../../utils/seo';

export const SizeGuidePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERSIZED_TEE' | 'HOODIES' | 'JOGGERS'>('OVERSIZED_TEE');
  const [unit, setUnit] = useState<'cm' | 'inches'>('inches');

  const seoMetadata = {
    title: 'Streetwear Size Chart & Fit Guide | VALKNUT Official Sri Lanka',
    description: 'Find your perfect oversized streetwear fit. Precise measurement charts in inches and cm for 480GSM Sovereign Hoodies, boxy t-shirts, and tactical joggers.',
    keywords: 'streetwear size guide, oversized t shirt measurements, hoodie size chart sri lanka, valknut fit guide',
    canonicalUrl: 'https://valknutofficial.com/#/size-guide',
    ogTitle: 'Streetwear Size Chart & Fit Guide — VALKNUT Official',
    ogDescription: 'Precise dimensional charts for intentional boxy and oversized street drape.',
    ogImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
    jsonLd: [
      getBreadcrumbSchema([
        { name: 'Home', url: '/#/' },
        { name: 'Size Guide', url: '/#/size-guide' }
      ])
    ]
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <SEOHead metadata={seoMetadata} />
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400">
          <li><a href="#/" className="hover:text-[#d4af37]">Home</a></li>
          <li><span>/</span></li>
          <li className="text-[#d4af37] font-semibold">Size Guide & Garment Care</li>
        </ol>
      </nav>

      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="badge-pill badge-gold mb-4">
          <Ruler size={12} /> PRECISION TAILORING
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4 font-syne">
          Size Guide & <span className="gold-gradient-text">Care Standard</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          VALKNUT garments feature intentional boxy, dropped-shoulder silhouettes. Follow our dimensional charts to achieve your desired drape.
        </p>
      </div>

      {/* Garment Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('OVERSIZED_TEE')}
            className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-all ${
              activeTab === 'OVERSIZED_TEE'
                ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20'
                : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Oversized Tees (280-310 GSM)
          </button>
          <button
            onClick={() => setActiveTab('HOODIES')}
            className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-all ${
              activeTab === 'HOODIES'
                ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20'
                : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Sovereign Hoodies (480 GSM)
          </button>
          <button
            onClick={() => setActiveTab('JOGGERS')}
            className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-all ${
              activeTab === 'JOGGERS'
                ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20'
                : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Tactical Cargo Joggers
          </button>
        </div>

        {/* Unit toggle */}
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-sm border border-white/10 text-xs">
          <button
            onClick={() => setUnit('inches')}
            className={`px-3 py-1 rounded-xs font-semibold ${
              unit === 'inches' ? 'bg-[#d4af37] text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Inches (in)
          </button>
          <button
            onClick={() => setUnit('cm')}
            className={`px-3 py-1 rounded-xs font-semibold ${
              unit === 'cm' ? 'bg-[#d4af37] text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Centimeters (cm)
          </button>
        </div>
      </div>

      {/* Measurement Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-sm mb-16 overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/15 text-slate-400 uppercase tracking-widest text-xs font-semibold">
              <th className="py-3 px-4">Size</th>
              <th className="py-3 px-4">{activeTab === 'JOGGERS' ? 'Waist' : 'Chest Width'}</th>
              <th className="py-3 px-4">{activeTab === 'JOGGERS' ? 'Outseam Length' : 'Body Length'}</th>
              <th className="py-3 px-4">{activeTab === 'JOGGERS' ? 'Thigh' : 'Shoulder Width'}</th>
              <th className="py-3 px-4">Recommended Height</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300 font-mono">
            {activeTab === 'OVERSIZED_TEE' && (
              <>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">S (Small)</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '44"' : '112 cm'}</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '28.5"' : '72 cm'}</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '21"' : '53 cm'}</td>
                  <td className="py-3.5 px-4 font-sans text-xs">5'4" - 5'7" (162-170cm)</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">M (Medium)</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '46"' : '117 cm'}</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '29.5"' : '75 cm'}</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '22"' : '56 cm'}</td>
                  <td className="py-3.5 px-4 font-sans text-xs">5'8" - 5'11" (172-180cm)</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">L (Large)</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '48"' : '122 cm'}</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '30.5"' : '77 cm'}</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '23"' : '58 cm'}</td>
                  <td className="py-3.5 px-4 font-sans text-xs">6'0" - 6'2" (182-188cm)</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">XL (Extra Large)</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '50"' : '127 cm'}</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '31.5"' : '80 cm'}</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '24"' : '61 cm'}</td>
                  <td className="py-3.5 px-4 font-sans text-xs">6'2"+ (188cm+)</td>
                </tr>
              </>
            )}

            {activeTab === 'HOODIES' && (
              <>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">S (Small)</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '46"' : '117 cm'}</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '27"' : '69 cm'}</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '22"' : '56 cm'}</td>
                  <td className="py-3.5 px-4 font-sans text-xs">5'4" - 5'7"</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">M (Medium)</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '48"' : '122 cm'}</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '28"' : '71 cm'}</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '23"' : '58 cm'}</td>
                  <td className="py-3.5 px-4 font-sans text-xs">5'8" - 5'11"</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">L (Large)</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '50"' : '127 cm'}</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '29"' : '74 cm'}</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '24"' : '61 cm'}</td>
                  <td className="py-3.5 px-4 font-sans text-xs">6'0" - 6'2"</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">XL (Extra Large)</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '52"' : '132 cm'}</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '30"' : '76 cm'}</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '25"' : '63 cm'}</td>
                  <td className="py-3.5 px-4 font-sans text-xs">6'2"+</td>
                </tr>
              </>
            )}

            {activeTab === 'JOGGERS' && (
              <>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">S (28-30)</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '28-30"' : '71-76 cm'}</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '39"' : '99 cm'}</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '24"' : '61 cm'}</td>
                  <td className="py-3.5 px-4 font-sans text-xs">Standard Fit</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">M (31-33)</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '31-33"' : '78-84 cm'}</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '40"' : '101 cm'}</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '25"' : '63 cm'}</td>
                  <td className="py-3.5 px-4 font-sans text-xs">Standard Fit</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">L (34-36)</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '34-36"' : '86-91 cm'}</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '41"' : '104 cm'}</td>
                  <td className="py-3.5 px-4">{unit === 'inches' ? '26"' : '66 cm'}</td>
                  <td className="py-3.5 px-4 font-sans text-xs">Standard Fit</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Official Care Label (From PDF Page 6) */}
      <div className="bg-[#0e1017] p-8 sm:p-10 rounded-sm border border-white/10 mb-16">
        <div className="max-w-xl mx-auto border-2 border-white/20 p-6 sm:p-8 bg-black/40 text-center font-mono">
          <div className="mb-4">
            <span className="text-xl font-bold uppercase tracking-widest text-white font-syne">VALKNUT</span>
            <div className="text-[10px] text-slate-400 tracking-widest uppercase">— ESSENTIAL —</div>
          </div>
          
          <div className="text-xs text-[#d4af37] uppercase tracking-widest font-semibold mb-6">
            “OWN YOUR MIND. CONTROL YOUR WORLD.”
          </div>

          <div className="py-3 border-y border-white/15 my-6 text-sm font-bold uppercase tracking-widest text-white">
            100% COTTON • MADE IN SRI LANKA
          </div>

          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4 font-sans">
            CARE INSTRUCTIONS
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs text-left text-slate-300 font-sans">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
              <span>Machine Wash Cold (30°C)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
              <span>Wash With Similar Colours</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
              <span>Do Not Bleach</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
              <span>Do Not Tumble Dry</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
              <span>Iron Low Heat (Reverse)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
              <span>Do Not Dry Clean</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
