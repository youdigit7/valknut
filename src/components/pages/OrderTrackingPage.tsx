import React, { useState } from 'react';
import { Search, Truck, CheckCircle2, Clock, MapPin, AlertCircle, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { Order } from '../../types/ecommerce';
import { SEOHead } from '../common/SEOHead';
import { getBreadcrumbSchema } from '../../utils/seo';

export const OrderTrackingPage: React.FC = () => {
  const { orders } = useStore();
  const [searchInput, setSearchInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const seoMetadata = {
    title: 'Live Order Tracking & AWB Courier Status | VALKNUT Official',
    description: 'Track your VALKNUT Official streetwear parcel in real-time. Enter your order number or AWB tracking code for live dispatch and delivery updates in Sri Lanka.',
    keywords: 'track order valknut, streetwear package tracking, pronto lanka tracking, valknut courier status',
    canonicalUrl: 'https://valknutofficial.com/#/track-order',
    ogTitle: 'Live Order Tracking — VALKNUT Official',
    ogDescription: 'Live islandwide shipment tracking for your VALKNUT luxury garments.',
    ogImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
    jsonLd: [
      getBreadcrumbSchema([
        { name: 'Home', url: '/#/' },
        { name: 'Track Order', url: '/#/track-order' }
      ])
    ]
  };

  // Auto-fill from URL query param if present (e.g. #/track-order?order=VK-2026-8801)
  React.useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('?')) {
      const queryParams = new URLSearchParams(hash.split('?')[1]);
      const orderParam = queryParams.get('order');
      if (orderParam) {
        setSearchInput(orderParam);
        const term = orderParam.trim().toUpperCase();
        const found = orders.find(
          o => o.orderNumber.toUpperCase() === term || 
               (o.awbNumber && o.awbNumber.toUpperCase() === term)
        );
        if (found) {
          setSearchedOrder(found);
          setHasSearched(true);
        }
      }
    }
  }, [orders]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    const term = searchInput.trim().toUpperCase();
    const found = orders.find(
      o => o.orderNumber.toUpperCase() === term || 
           (o.awbNumber && o.awbNumber.toUpperCase() === term)
    );

    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'Pending':
      case 'Payment Pending':
        return 1;
      case 'Payment Confirmed':
        return 2;
      case 'Processing':
        return 3;
      case 'Packed':
        return 4;
      case 'Shipped':
        return 5;
      case 'Delivered':
        return 6;
      default:
        return 2;
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <SEOHead metadata={seoMetadata} />
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400">
          <li><a href="#/" className="hover:text-[#d4af37]">Home</a></li>
          <li><span>/</span></li>
          <li className="text-[#d4af37] font-semibold">Live Order & AWB Tracking</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="badge-pill badge-gold mb-4">
          <Truck size={12} /> EXPRESS SRI LANKA LOGISTICS
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4 font-syne">
          Track Your <span className="gold-gradient-text">VALKNUT Order</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Enter your VALKNUT Order ID (e.g. <code className="text-[#d4af37]">VK-2026-8801</code>) or Courier Air Waybill (AWB) number.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="glass-panel p-6 sm:p-8 rounded-sm mb-12 border border-white/10 shadow-2xl">
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="e.g. VK-2026-8801 or PRN-99882103"
              className="w-full bg-[#0b0c10] border border-white/15 rounded-sm py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition-colors uppercase font-mono"
            />
          </div>
          <button
            type="submit"
            className="btn-gold px-8 py-3.5 text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2"
          >
            <span>TRACK PACKAGE</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
          <span>Quick Demo IDs:</span>
          <button 
            onClick={() => { setSearchInput('VK-2026-8801'); }} 
            className="text-[#d4af37] underline font-mono hover:text-white"
          >
            VK-2026-8801 (Shipped)
          </button>
          <span>•</span>
          <button 
            onClick={() => { setSearchInput('VK-2026-8802'); }} 
            className="text-[#d4af37] underline font-mono hover:text-white"
          >
            VK-2026-8802 (Processing)
          </button>
        </div>
      </div>

      {/* Results */}
      {hasSearched && (
        searchedOrder ? (
          <div className="glass-panel p-6 sm:p-10 rounded-sm border border-white/10 animate-fade-in space-y-8">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-widest block mb-1">Order Reference</span>
                <h2 className="text-2xl font-bold font-mono text-white">{searchedOrder.orderNumber}</h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 uppercase tracking-widest block mb-1">Status</span>
                <span className="badge-pill badge-gold text-xs font-bold">
                  {searchedOrder.orderStatus}
                </span>
              </div>
            </div>

            {/* Stepper */}
            <div className="py-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className={`p-4 rounded-sm border ${getStatusStep(searchedOrder.orderStatus) >= 2 ? 'border-[#d4af37] bg-[#d4af37]/10' : 'border-white/10 bg-white/5'} text-center`}>
                  <CheckCircle2 className={`mx-auto mb-2 ${getStatusStep(searchedOrder.orderStatus) >= 2 ? 'text-[#d4af37]' : 'text-slate-600'}`} size={24} />
                  <div className="text-xs font-bold text-white uppercase">Confirmed</div>
                  <div className="text-[10px] text-slate-400 mt-1">Payment verified</div>
                </div>

                <div className={`p-4 rounded-sm border ${getStatusStep(searchedOrder.orderStatus) >= 3 ? 'border-[#d4af37] bg-[#d4af37]/10' : 'border-white/10 bg-white/5'} text-center`}>
                  <Clock className={`mx-auto mb-2 ${getStatusStep(searchedOrder.orderStatus) >= 3 ? 'text-[#d4af37]' : 'text-slate-600'}`} size={24} />
                  <div className="text-xs font-bold text-white uppercase">Processing</div>
                  <div className="text-[10px] text-slate-400 mt-1">Precision tailoring</div>
                </div>

                <div className={`p-4 rounded-sm border ${getStatusStep(searchedOrder.orderStatus) >= 5 ? 'border-[#d4af37] bg-[#d4af37]/10' : 'border-white/10 bg-white/5'} text-center`}>
                  <Truck className={`mx-auto mb-2 ${getStatusStep(searchedOrder.orderStatus) >= 5 ? 'text-[#d4af37]' : 'text-slate-600'}`} size={24} />
                  <div className="text-xs font-bold text-white uppercase">Shipped</div>
                  <div className="text-[10px] text-slate-400 mt-1">In transit</div>
                </div>

                <div className={`p-4 rounded-sm border ${getStatusStep(searchedOrder.orderStatus) >= 6 ? 'border-[#d4af37] bg-[#d4af37]/10' : 'border-white/10 bg-white/5'} text-center`}>
                  <MapPin className={`mx-auto mb-2 ${getStatusStep(searchedOrder.orderStatus) >= 6 ? 'text-[#d4af37]' : 'text-slate-600'}`} size={24} />
                  <div className="text-xs font-bold text-white uppercase">Delivered</div>
                  <div className="text-[10px] text-slate-400 mt-1">Recipient verified</div>
                </div>
              </div>
            </div>

            {/* Courier Details */}
            {searchedOrder.awbNumber && (
              <div className="bg-[#0b0c10] p-6 rounded-sm border border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Courier Partner & AWB</div>
                  <div className="text-base font-bold text-white">
                    {searchedOrder.courierName || 'Pronto Express'} — <span className="font-mono text-[#d4af37]">{searchedOrder.awbNumber}</span>
                  </div>
                </div>
                {searchedOrder.trackingLink && (
                  <a
                    href={searchedOrder.trackingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary text-xs py-2 px-4"
                  >
                    Open Official Courier Portal
                  </a>
                )}
              </div>
            )}

            {/* Order Items Preview */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 font-syne">
                Items in This Shipment ({searchedOrder.items.length})
              </h3>
              <div className="space-y-3">
                {searchedOrder.items.map((item: any, idx: number) => {
                  const img = item.customization?.finalPreviewDataUrl || item.imageUrl || item.product?.images?.[0] || '';
                  const name = item.productName || item.product?.name || 'Garment';
                  const size = item.size || item.selectedSize || 'M';
                  const color = item.color || item.selectedColor || '';

                  return (
                    <div key={idx} className="flex items-center gap-4 bg-white/5 p-3 rounded-sm border border-white/5">
                      {img && (
                        <img 
                          src={img} 
                          alt={name}
                          className="w-14 h-14 object-cover rounded-xs bg-[#141620]"
                        />
                      )}
                      <div className="flex-1">
                        <div className="text-sm font-bold text-white uppercase font-heading">{name}</div>
                        <div className="text-xs text-slate-400 font-mono">Size: {size} {color ? `| Color: ${color}` : ''} | Qty: {item.quantity}</div>
                      </div>
                      <div className="text-sm font-mono font-bold text-[#d4af37]">
                        LKR {((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-8 text-center rounded-sm border border-white/10 text-slate-400">
            <AlertCircle className="mx-auto mb-3 text-[#d4af37]" size={36} />
            <h3 className="text-lg font-bold text-white uppercase mb-2">No Order Found</h3>
            <p className="text-sm max-w-md mx-auto">
              We couldn't find an order matching "<strong>{searchInput}</strong>". Please double check your order confirmation SMS/email or contact WhatsApp support (+94 77 123 4567).
            </p>
          </div>
        )
      )}
    </div>
  );
};
