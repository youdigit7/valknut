import React from 'react';
import { Truck, RefreshCw, CreditCard } from 'lucide-react';
import { SEOHead } from '../common/SEOHead';
import { getBreadcrumbSchema } from '../../utils/seo';

export const ShippingPolicyPage: React.FC = () => {
  const seoMetadata = {
    title: 'Shipping, Islandwide Delivery & Exchange Policy | VALKNUT Official',
    description: 'Islandwide delivery across Colombo and all 25 districts in Sri Lanka. Free shipping on orders over LKR 10,000, 7-day size exchange guarantee, Koko 3x instalments.',
    keywords: 'streetwear shipping sri lanka, clothing delivery colombo, koko pay delivery, valknut returns and exchanges',
    canonicalUrl: 'https://valknutofficial.com/#/shipping-returns',
    ogTitle: 'Shipping, Islandwide Delivery & Exchange Policy — VALKNUT Official',
    ogDescription: 'Islandwide delivery, Koko 3x instalments, and 7-day size exchange guarantee.',
    ogImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
    jsonLd: [
      getBreadcrumbSchema([
        { name: 'Home', url: '/#/' },
        { name: 'Shipping & Exchanges', url: '/#/shipping-returns' }
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
          <li className="text-[#d4af37] font-semibold">Shipping, Payments & Returns</li>
        </ol>
      </nav>

      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="badge-pill badge-gold mb-4">
          <Truck size={12} /> ISLANDWIDE LOGISTICS
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4 font-syne">
          Shipping, Payments & <span className="gold-gradient-text">Exchange Policy</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Transparent, secure, and expedited. We partner with Sri Lanka’s premier courier fleets to ensure your package arrives in pristine condition.
        </p>
      </div>

      <div className="space-y-8">
        {/* Shipping Rates */}
        <div className="glass-panel p-8 rounded-sm border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
              <Truck size={20} />
            </div>
            <h2 className="text-xl font-bold uppercase text-white font-syne">
              1. Delivery Timelines & Rates
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
            <div className="bg-[#0b0c10] p-6 rounded-sm border border-white/5">
              <h3 className="font-bold text-white uppercase mb-2 text-base">Greater Colombo & Suburbs</h3>
              <p className="text-slate-400 mb-3">1 to 2 business days</p>
              <div className="text-xs font-mono text-[#d4af37]">Standard Rate: LKR 450 | FREE above LKR 10,000</div>
            </div>
            <div className="bg-[#0b0c10] p-6 rounded-sm border border-white/5">
              <h3 className="font-bold text-white uppercase mb-2 text-base">All Islandwide Outstations</h3>
              <p className="text-slate-400 mb-3">2 to 4 business days</p>
              <div className="text-xs font-mono text-[#d4af37]">Standard Rate: LKR 450 | FREE above LKR 10,000</div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="glass-panel p-8 rounded-sm border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
              <CreditCard size={20} />
            </div>
            <h2 className="text-xl font-bold uppercase text-white font-syne">
              2. Approved Payment Options
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div className="bg-[#0b0c10] p-6 rounded-sm border border-white/5">
              <div className="text-lg font-bold text-emerald-400 mb-2 font-syne">Koko BNPL</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Split your total bill into 3 equal monthly payments with 0% interest and zero hidden charges using your debit or credit card.
              </p>
            </div>

            <div className="bg-[#0b0c10] p-6 rounded-sm border border-white/5">
              <div className="text-lg font-bold text-blue-400 mb-2 font-syne">OnePay Gateway</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bank-grade 256-bit encrypted card processing for Visa, MasterCard, UnionPay, and direct LankaQR instant mobile payments.
              </p>
            </div>

            <div className="bg-[#0b0c10] p-6 rounded-sm border border-white/5">
              <div className="text-lg font-bold text-slate-200 mb-2 font-syne">Cash on Delivery</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pay in cash directly to the courier agent upon receiving and inspecting your parcel packaging.
              </p>
            </div>
          </div>
        </div>

        {/* Exchanges */}
        <div className="glass-panel p-8 rounded-sm border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
              <RefreshCw size={20} />
            </div>
            <h2 className="text-xl font-bold uppercase text-white font-syne">
              3. 7-Day Size Exchange Guarantee
            </h2>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            If your chosen size does not fit your desired drape, you can request an exchange within 7 days of delivery. The item must be unwashed, unworn, with all original VALKNUT hangtags and packaging intact.
          </p>
          <p className="text-xs text-slate-400">
            *Customized products created in the VALKNUT Studio are non-refundable unless manufacturing defects occur.
          </p>
        </div>
      </div>
    </div>
  );
};
