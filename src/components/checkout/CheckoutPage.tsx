import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import type { PaymentGateway, ShippingAddress, Order } from '../../types/ecommerce';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  Lock, 
  Truck, 
  CreditCard, 
  Tag, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight, 
  Package, 
  Phone, 
  Mail, 
  Clock, 
  Sparkles,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';

const SRI_LANKAN_DISTRICTS = [
  'Colombo',
  'Gampaha',
  'Kalutara',
  'Kandy',
  'Matale',
  'Nuwara Eliya',
  'Galle',
  'Matara',
  'Hambantota',
  'Jaffna',
  'Kilinochchi',
  'Mannar',
  'Vavuniya',
  'Mullaitivu',
  'Batticaloa',
  'Ampara',
  'Trincomalee',
  'Kurunegala',
  'Puttalam',
  'Anuradhapura',
  'Polonnaruwa',
  'Badulla',
  'Monaragala',
  'Ratnapura',
  'Kegalle'
];

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    cartDiscount, 
    cartShipping, 
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    shippingMethodId,
    setShippingMethodId,
    availableShippingMethods,
    createOrder,
    user
  } = useStore();

  // Step state: 'CHECKOUT' | 'CONFIRMATION'
  const [step, setStep] = useState<'CHECKOUT' | 'CONFIRMATION'>('CHECKOUT');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [copiedOrderNum, setCopiedOrderNum] = useState(false);

  // Section 1-4 Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+94771234567');
  const [addressLine1, setAddressLine1] = useState(user?.address?.addressLine1 || 'No. 88, Galle Road');
  const [addressLine2, setAddressLine2] = useState(user?.address?.addressLine2 || '');
  const [city, setCity] = useState(user?.address?.city || 'Colombo 03');
  const [district, setDistrict] = useState(user?.address?.district || 'Colombo');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '00300');
  
  // Section 8 Payment Method
  const [paymentGateway, setPaymentGateway] = useState<PaymentGateway>('Koko');
  const [notes, setNotes] = useState('');

  // Section 7 Coupon Input
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Sync user defaults when user logs in
  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.name);
      if (!email) setEmail(user.email);
      if (user.phone && phone === '+94771234567') setPhone(user.phone);
      if (user.address) {
        setAddressLine1(user.address.addressLine1);
        if (user.address.addressLine2) setAddressLine2(user.address.addressLine2);
        setCity(user.address.city);
        setDistrict(user.address.district);
        setPostalCode(user.address.postalCode);
      }
    }
  }, [user]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponMsg(null);
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponMsg({ text: res.message, isError: false });
      setCouponInput('');
    } else {
      setCouponMsg({ text: res.message, isError: true });
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 9) {
      setFormError('Please enter a valid mobile number for SMS tracking.');
      return;
    }
    if (!addressLine1.trim()) {
      setFormError('Please enter your street address.');
      return;
    }
    if (!city.trim()) {
      setFormError('Please enter your delivery city.');
      return;
    }
    if (cart.length === 0) {
      setFormError('Your shopping bag is empty.');
      return;
    }

    setIsSubmitting(true);

    const shippingInfo: ShippingAddress = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim() || undefined,
      city: city.trim(),
      district: district.trim(),
      postalCode: postalCode.trim()
    };

    try {
      // Simulate payment gateway handshake delay (Koko, OnePay, eWAY, COD)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const order = await createOrder(shippingInfo, paymentGateway, notes, shippingMethodId);
      setPlacedOrder(order);
      setStep('CONFIRMATION');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Celebration Confetti
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#D4AF37', '#FFFFFF', '#A38025', '#FFDF00']
        });
      } catch (err) {
        // ignore
      }
    } catch (err: any) {
      setFormError(err?.message || 'Order creation failed. Please check your inventory or payment details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyOrderNumber = () => {
    if (placedOrder) {
      navigator.clipboard.writeText(placedOrder.orderNumber);
      setCopiedOrderNum(true);
      setTimeout(() => setCopiedOrderNum(false), 2000);
    }
  };

  // Render Confirmation View
  if (step === 'CONFIRMATION' && placedOrder) {
    return (
      <div className="w-full min-h-screen bg-[#0A0A0A] py-12 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
          
          {/* Top Success Badge & Header */}
          <div className="text-center space-y-3 bg-[#0E1017] border border-[#D4AF37]/30 rounded-lg p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 border-2 border-[#D4AF37] text-[#D4AF37] flex items-center justify-center mx-auto shadow-lg shadow-[#D4AF37]/10 animate-bounce">
              <CheckCircle2 size={44} />
            </div>

            <span className="text-xs font-mono font-bold tracking-[0.3em] text-[#D4AF37] uppercase block pt-2">
              VALKNUT ORDER CONFIRMED
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase text-white font-syne tracking-tight">
              THANK YOU FOR YOUR ORDER
            </h1>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Your dark luxury garments are locked and being prepared for high-precision dispatch.
            </p>

            {/* Order Number Box with 1-click Copy */}
            <div className="pt-4 max-w-sm mx-auto">
              <div className="p-3.5 bg-[#141620] border border-white/15 rounded flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">ORDER NUMBER</span>
                  <span className="text-lg font-mono font-black text-white tracking-wider">{placedOrder.orderNumber}</span>
                </div>
                <button
                  onClick={handleCopyOrderNumber}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Copy Order Number"
                >
                  {copiedOrderNum ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedOrderNum ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Simulated SMS & Email Dispatch Proof */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-md flex items-start gap-3 text-emerald-300">
              <Phone size={20} className="flex-shrink-0 text-emerald-400 mt-0.5" />
              <div className="space-y-0.5 text-xs">
                <p className="font-bold">SMS Dispatched</p>
                <p className="text-[11px] text-emerald-400/80">Real-time status updates scheduled to {placedOrder.customerInfo.phone}</p>
              </div>
            </div>

            <div className="p-4 bg-sky-950/30 border border-sky-500/30 rounded-md flex items-start gap-3 text-sky-300">
              <Mail size={20} className="flex-shrink-0 text-sky-400 mt-0.5" />
              <div className="space-y-0.5 text-xs">
                <p className="font-bold">Tax Invoice Dispatched</p>
                <p className="text-[11px] text-sky-400/80">Official order receipt sent to {placedOrder.customerInfo.email}</p>
              </div>
            </div>
          </div>

          {/* Order Details & Summary Card */}
          <div className="bg-[#0E1017] border border-white/10 rounded-md divide-y divide-white/10 overflow-hidden shadow-xl">
            
            {/* 11-Point Confirmation Breakdown */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono">
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block">
                  DELIVERY DESTINATION
                </span>
                <div className="text-slate-300 space-y-1">
                  <p className="text-white font-bold">{placedOrder.customerInfo.fullName}</p>
                  <p>{placedOrder.customerInfo.addressLine1}</p>
                  {placedOrder.customerInfo.addressLine2 && <p>{placedOrder.customerInfo.addressLine2}</p>}
                  <p>{placedOrder.customerInfo.city}, {placedOrder.customerInfo.district} {placedOrder.customerInfo.postalCode}</p>
                  <p className="text-slate-400 pt-1">Tel: {placedOrder.customerInfo.phone}</p>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block">
                  SHIPPING & PAYMENT
                </span>
                <div className="text-slate-300 space-y-1.5">
                  <div className="flex justify-between">
                    <span>Shipping Method:</span>
                    <strong className="text-white">{placedOrder.shippingInfo.shippingMethodName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Arrival:</span>
                    <strong className="text-emerald-400">{placedOrder.shippingInfo.estimatedDays}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Gateway:</span>
                    <strong className="text-white">{placedOrder.paymentGateway}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status:</span>
                    <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${placedOrder.paymentStatus === 'PAID' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-amber-950 text-amber-400 border border-amber-500/40'}`}>
                      {placedOrder.paymentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Order Status:</span>
                    <span className="text-[#D4AF37] font-bold">{placedOrder.orderStatus}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Historical Snapshot Items */}
            <div className="p-6 space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block font-mono">
                PURCHASED PIECES (HISTORICAL SNAPSHOT)
              </span>

              <div className="divide-y divide-white/5">
                {placedOrder.items.map((item) => (
                  <div key={item.id} className="py-3 first:pt-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-12 h-14 object-cover rounded bg-[#141620] border border-white/10 flex-shrink-0"
                      />
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-white uppercase">{item.productName}</h4>
                        <p className="text-[11px] font-mono text-slate-400">
                          SKU: {item.sku} | Size: <strong className="text-white">{item.size}</strong> | Color: <strong className="text-white">{item.color}</strong>
                        </p>
                        {item.customization && (
                          <p className="text-[10px] font-mono text-[#D4AF37]">
                            Bespoke: {item.customization.printTechnique}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right font-mono text-xs">
                      <p className="text-white font-bold">LKR {item.subtotal.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-500">{item.quantity} x LKR {item.unitPrice.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation Footnote */}
              <div className="pt-4 border-t border-white/10 space-y-1.5 text-xs font-mono text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-white">LKR {placedOrder.subtotal.toLocaleString()}</span>
                </div>
                {placedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Coupon Discount ({placedOrder.couponCode}):</span>
                    <span>- LKR {placedOrder.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee:</span>
                  <span className={placedOrder.shippingCharge === 0 ? 'text-emerald-400' : 'text-white'}>
                    {placedOrder.shippingCharge === 0 ? 'FREE' : `LKR ${placedOrder.shippingCharge.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-white/10">
                  <span className="font-syne uppercase">TOTAL PAID:</span>
                  <span className="text-[#D4AF37]">LKR {placedOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={`#/track-order?order=${placedOrder.orderNumber}`}
              className="flex-1 py-4 bg-[#D4AF37] hover:bg-[#E2B714] text-black font-extrabold text-xs uppercase tracking-[0.2em] rounded-[2px] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#D4AF37]/20 cursor-pointer text-center"
            >
              <Package size={16} />
              <span>TRACK ORDER STATUS</span>
            </a>

            <a
              href="#/account/orders"
              className="flex-1 py-4 bg-white/10 hover:bg-white/15 text-white font-mono font-bold text-xs uppercase tracking-[0.2em] rounded-[2px] border border-white/15 transition-colors flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              <span>VIEW IN MY ACCOUNT</span>
              <ArrowRight size={16} />
            </a>

            <a
              href="#/shop"
              className="py-4 px-6 bg-transparent hover:bg-white/5 text-slate-400 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors flex items-center justify-center text-center"
            >
              CONTINUE SHOPPING
            </a>
          </div>

        </div>
      </div>
    );
  }

  // Render Active Checkout Form (Sections 1 through 10)
  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] py-8 sm:py-12 border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Hierarchy */}
        <nav className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-slate-500 mb-6">
          <a href="#/" className="hover:text-white transition-colors">Home</a>
          <ChevronRight size={12} className="text-slate-600" />
          <a href="#/cart" className="hover:text-white transition-colors">Bag</a>
          <ChevronRight size={12} className="text-slate-600" />
          <span className="text-[#D4AF37] font-bold">Secure Checkout</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-6 mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Lock size={14} className="text-[#D4AF37]" />
              <span className="text-xs font-mono font-bold tracking-[0.3em] text-[#D4AF37] uppercase">
                256-BIT ENCRYPTED EXPRESS CHECKOUT
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase text-white font-syne tracking-tight">
              VALKNUT OFFICIAL CHECKOUT
            </h1>
          </div>

          <a
            href="#/cart"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-300 hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>RETURN TO SHOPPING BAG</span>
          </a>
        </div>

        {/* Empty Bag Safeguard */}
        {cart.length === 0 ? (
          <div className="py-20 bg-[#0E1017] border border-white/10 rounded-md p-8 text-center space-y-4">
            <Package size={40} className="mx-auto text-slate-500" />
            <h2 className="text-xl font-bold uppercase font-syne text-white">Your Shopping Bag Is Empty</h2>
            <p className="text-slate-400 text-sm">Please add some items to your bag before proceeding to checkout.</p>
            <a
              href="#/shop"
              className="inline-block py-3 px-8 bg-[#D4AF37] text-black font-mono font-bold text-xs uppercase tracking-widest rounded transition-all hover:bg-[#E2B714] mt-4"
            >
              BROWSE VALKNUT COLLECTION
            </a>
          </div>
        ) : (
          /* Main 2-Column Mobile-First Checkout Layout */
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
            
            {/* LEFT COLUMN (7 Cols): Sections 1, 2, 3, 4, 5, 8 */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Error Notice if any */}
              {formError && (
                <div className="p-4 bg-red-950/40 border border-red-500/50 rounded flex items-center gap-3 text-red-300 text-xs font-mono">
                  <AlertCircle size={18} className="flex-shrink-0 text-red-400" />
                  <span>{formError}</span>
                </div>
              )}

              {/* SECTION 1: CUSTOMER INFORMATION */}
              <div className="bg-[#0E1017] border border-white/10 rounded-md p-6 sm:p-7 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-black text-xs font-mono font-black flex items-center justify-center">
                      1
                    </span>
                    <h2 className="text-sm font-black uppercase tracking-widest text-white font-syne">
                      CUSTOMER INFORMATION
                    </h2>
                  </div>
                  {user && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                      LOGGED IN: {user.name}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Kasun Perera"
                      className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded-[2px] p-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Email Address (For Invoice & Receipt) *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="kasun@example.com"
                      className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded-[2px] p-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    Contact Phone Number (For Courier SMS Tracking) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+94 77 123 4567"
                    className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded-[2px] p-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                  />
                  <p className="text-[10px] font-mono text-slate-500 mt-1">
                    Pronto Lanka & Fargo Express courier drivers will contact this number before delivering.
                  </p>
                </div>
              </div>

              {/* SECTION 2: DELIVERY ADDRESS */}
              <div className="bg-[#0E1017] border border-white/10 rounded-md p-6 sm:p-7 shadow-xl space-y-4">
                <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-black text-xs font-mono font-black flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-sm font-black uppercase tracking-widest text-white font-syne">
                    ISLANDWIDE DELIVERY ADDRESS
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Street Address / House No. *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="No. 88, Galle Road, Apt 4B"
                      className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded-[2px] p-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Apartment / Suite / Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="Opposite Cinnamon Grand / Near Majestic City"
                      className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded-[2px] p-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 block mb-1">
                        City / Town *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Colombo 03"
                        className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded-[2px] p-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 block mb-1">
                        District *
                      </label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded-[2px] p-3 text-xs font-mono text-white focus:outline-none cursor-pointer"
                      >
                        {SRI_LANKAN_DISTRICTS.map((d) => (
                          <option key={d} value={d} className="bg-[#141620] text-white">
                            {d} District
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 block mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="00300"
                        className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded-[2px] p-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Delivery Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Leave with building security if unavailable"
                      className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded-[2px] p-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5: SHIPPING METHOD */}
              <div className="bg-[#0E1017] border border-white/10 rounded-md p-6 sm:p-7 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-black text-xs font-mono font-black flex items-center justify-center">
                      3
                    </span>
                    <h2 className="text-sm font-black uppercase tracking-widest text-white font-syne">
                      SHIPPING METHOD
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    ISLANDWIDE COVERAGE
                  </span>
                </div>

                <div className="space-y-3">
                  {availableShippingMethods.map((method) => {
                    const isSelected = shippingMethodId === method.id;
                    const isFree = method.freeShippingThreshold > 0 && cartSubtotal >= method.freeShippingThreshold;
                    const fee = isFree ? 0 : method.baseCharge;

                    return (
                      <div
                        key={method.id}
                        onClick={() => setShippingMethodId(method.id)}
                        className={`p-4 rounded-[2px] border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white shadow-lg'
                            : 'border-white/10 bg-[#141620] text-slate-300 hover:border-white/25'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="shippingMethod"
                            checked={isSelected}
                            onChange={() => setShippingMethodId(method.id)}
                            className="accent-[#D4AF37] mt-1 cursor-pointer"
                          />
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white font-mono uppercase">{method.name}</span>
                              {method.id === 'express' && (
                                <span className="text-[9px] bg-[#D4AF37] text-black font-black font-mono px-1.5 py-0.2 rounded">
                                  VIP PRIORITY
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] font-mono text-slate-400">{method.description}</p>
                            <p className="text-[10px] font-mono text-[#D4AF37] flex items-center gap-1 pt-0.5">
                              <Clock size={12} />
                              <span>Estimated SLA: {method.estimatedDays}</span>
                            </p>
                          </div>
                        </div>

                        <div className="text-right sm:text-right font-mono font-bold text-xs pl-7 sm:pl-0">
                          {isFree ? (
                            <span className="text-emerald-400 font-extrabold uppercase">FREE DELIVERY</span>
                          ) : (
                            <span className="text-white">LKR {fee.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 8: PAYMENT METHOD */}
              <div className="bg-[#0E1017] border border-white/10 rounded-md p-6 sm:p-7 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-black text-xs font-mono font-black flex items-center justify-center">
                      4
                    </span>
                    <h2 className="text-sm font-black uppercase tracking-widest text-white font-syne">
                      PAYMENT METHOD
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-[#D4AF37] flex items-center gap-1">
                    <ShieldCheck size={13} />
                    <span>PLUGGABLE GATEWAYS</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Koko BNPL */}
                  <div
                    onClick={() => setPaymentGateway('Koko')}
                    className={`p-4 rounded-[2px] border cursor-pointer transition-all flex flex-col justify-between ${
                      paymentGateway === 'Koko'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-white shadow-lg'
                        : 'border-white/10 bg-[#141620] text-slate-400 hover:border-white/25'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="font-extrabold text-xs text-[#D4AF37] font-mono">KOKO PAY</span>
                        <span className="text-[9px] bg-[#D4AF37] text-black px-1.5 py-0.5 rounded font-black font-mono">
                          3X 0% INTEREST
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-300">
                        Split into 3 monthly installments of <strong className="text-white">LKR {Math.round(cartTotal / 3).toLocaleString()}</strong> with Debit/Credit card.
                      </p>
                    </div>
                  </div>

                  {/* OnePay Sri Lanka IPG */}
                  <div
                    onClick={() => setPaymentGateway('OnePay')}
                    className={`p-4 rounded-[2px] border cursor-pointer transition-all flex flex-col justify-between ${
                      paymentGateway === 'OnePay'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-white shadow-lg'
                        : 'border-white/10 bg-[#141620] text-slate-400 hover:border-white/25'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="font-extrabold text-xs text-sky-400 font-mono">ONEPAY DIRECT</span>
                        <span className="text-[9px] bg-sky-500 text-black px-1.5 py-0.5 rounded font-black font-mono">
                          LOCAL IPG
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-300">
                        Direct Internet Banking, LankaQR, and local Sri Lankan Visa/Mastercard processing.
                      </p>
                    </div>
                  </div>

                  {/* eWAY Global Card Gateway */}
                  <div
                    onClick={() => setPaymentGateway('eWAY')}
                    className={`p-4 rounded-[2px] border cursor-pointer transition-all flex flex-col justify-between ${
                      paymentGateway === 'eWAY'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-white shadow-lg'
                        : 'border-white/10 bg-[#141620] text-slate-400 hover:border-white/25'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="font-extrabold text-xs text-amber-400 font-mono">eWAY GLOBAL</span>
                        <CreditCard size={14} className="text-amber-400" />
                      </div>
                      <p className="text-[11px] font-mono text-slate-300">
                        International Visa, Mastercard, AMEX Credit / Debit Cards with 3D-Secure 2.0.
                      </p>
                    </div>
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    onClick={() => setPaymentGateway('Cash on Delivery')}
                    className={`p-4 rounded-[2px] border cursor-pointer transition-all flex flex-col justify-between ${
                      paymentGateway === 'Cash on Delivery'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-white shadow-lg'
                        : 'border-white/10 bg-[#141620] text-slate-400 hover:border-white/25'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="font-extrabold text-xs text-emerald-400 font-mono">CASH ON DELIVERY</span>
                        <Truck size={14} className="text-emerald-400" />
                      </div>
                      <p className="text-[11px] font-mono text-slate-300">
                        Pay cash directly to the courier agent upon doorstep parcel delivery.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN (5 Cols): Sections 6, 7, 9, 10 (Order Summary, Coupon, Totals, Place Order) */}
            <div className="lg:col-span-5 sticky top-28 space-y-6">
              
              {/* ORDER SUMMARY CARD */}
              <div className="bg-[#0E1017] border border-white/10 rounded-md p-6 sm:p-7 shadow-2xl space-y-6">
                
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white font-syne">
                    ORDER SUMMARY
                  </h3>
                  <span className="text-xs font-mono font-bold text-[#D4AF37]">
                    {cart.reduce((a, b) => a + b.quantity, 0)} ITEMS
                  </span>
                </div>

                {/* Items List */}
                <div className="divide-y divide-white/5 max-h-[280px] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="py-3 first:pt-0 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.customization?.finalPreviewDataUrl || item.product.images[0]}
                          alt={item.product.name}
                          className="w-12 h-14 object-cover rounded bg-[#141620] border border-white/10 flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <h4 className="text-xs font-bold text-white uppercase truncate">{item.product.name}</h4>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                            <span>Size: <strong className="text-white">{item.selectedSize}</strong></span>
                            <span>•</span>
                            <span>Color: <strong className="text-white">{item.selectedColor}</strong></span>
                            <span>•</span>
                            <span>Qty: <strong className="text-white">{item.quantity}</strong></span>
                          </div>
                          {item.customization && (
                            <div className="text-[9px] font-mono text-[#D4AF37] flex items-center gap-1">
                              <Sparkles size={10} />
                              <span>Custom: {item.customization.printTechnique}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right font-mono text-xs">
                        <span className="text-white font-black block">
                          LKR {(item.unitPrice * item.quantity).toLocaleString()}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-slate-500 block">
                            @{item.unitPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* SECTION 7: PROMO CODE APPLICATOR */}
                <div className="space-y-2 border-t border-white/10 pt-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300 block font-bold">
                    PROMO CODE
                  </span>

                  {appliedCoupon ? (
                    <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded-[2px] flex items-center justify-between text-xs text-emerald-400 font-mono">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Tag size={14} />
                        <span>'{appliedCoupon.code}' APPLIED</span>
                      </span>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-xs text-red-400 font-bold hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="e.g. VALKNUT10"
                        className="flex-1 bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded-[2px] px-3 py-2 text-xs font-mono uppercase text-white placeholder-slate-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold rounded-[2px] transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  )}

                  {couponMsg && (
                    <p className={`text-[11px] font-mono ${couponMsg.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                      {couponMsg.text}
                    </p>
                  )}
                </div>

                {/* SECTION 9: FINAL AMOUNT BREAKDOWN */}
                <div className="space-y-2.5 text-xs font-mono text-slate-300 border-t border-white/10 pt-4">
                  <div className="flex justify-between">
                    <span>Bag Subtotal:</span>
                    <strong className="text-white font-bold">LKR {cartSubtotal.toLocaleString()}</strong>
                  </div>

                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount Coupon ({appliedCoupon?.code}):</span>
                      <strong>- LKR {cartDiscount.toLocaleString()}</strong>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping Fee ({shippingMethodId === 'standard' ? 'Standard' : 'VIP Express'}):</span>
                    <strong className={cartShipping === 0 ? 'text-emerald-400' : 'text-white'}>
                      {cartShipping === 0 ? 'FREE' : `LKR ${cartShipping.toLocaleString()}`}
                    </strong>
                  </div>

                  <div className="flex justify-between text-base font-black text-white pt-4 border-t border-white/10 font-mono">
                    <span className="font-syne uppercase">FINAL TOTAL:</span>
                    <span className="text-xl text-[#D4AF37]">LKR {cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* SECTION 10: PLACE ORDER CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full py-4 bg-[#D4AF37] hover:bg-[#E2B714] text-black font-extrabold text-xs uppercase tracking-[0.2em] rounded-[2px] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#D4AF37]/20 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2 font-mono">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>LOCKING INVENTORY & AUTHORIZING...</span>
                    </div>
                  ) : (
                    <>
                      <Lock size={16} />
                      <span>PLACE ORDER (LKR {cartTotal.toLocaleString()})</span>
                    </>
                  )}
                </button>

                {/* Security Guarantee */}
                <div className="pt-2 text-center text-[10px] font-mono text-slate-500 space-y-1 border-t border-white/5">
                  <p className="flex items-center justify-center gap-1.5">
                    <ShieldCheck size={14} className="text-[#D4AF37]" />
                    <span>Bank-Grade SSL Security • Direct Courier Handoff</span>
                  </p>
                  <p>All items undergo stringent QC at Colombo Headquarters before dispatch.</p>
                </div>

              </div>

            </div>

          </form>
        )}

      </div>
    </div>
  );
};
