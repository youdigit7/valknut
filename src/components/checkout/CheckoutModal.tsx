import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import type { PaymentGateway, ShippingAddress, Order } from '../../types/ecommerce';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle, 
  CreditCard, 
  Truck, 
  Lock, 
  MessageSquare, 
  Mail, 
  ArrowLeft,
  Package
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

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartSubtotal, 
    cartDiscount, 
    cartShipping, 
    cartTotal,
    appliedCoupon,
    shippingMethodId,
    setShippingMethodId,
    availableShippingMethods,
    createOrder,
    user
  } = useStore();

  const [step, setStep] = useState<'FORM' | 'CONFIRMATION'>('FORM');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+94771234567');
  const [addressLine1, setAddressLine1] = useState('No. 88, Galle Road');
  const [city, setCity] = useState('Colombo 03');
  const [district, setDistrict] = useState('Colombo');
  const [postalCode, setPostalCode] = useState('00300');
  const [paymentGateway, setPaymentGateway] = useState<PaymentGateway>('Koko');
  const [notes, setNotes] = useState('');

  if (!isCheckoutOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const shippingInfo: ShippingAddress = {
      fullName,
      email,
      phone,
      addressLine1,
      city,
      district,
      postalCode
    };

    try {
      const order = await createOrder(shippingInfo, paymentGateway, notes, shippingMethodId);
      setPlacedOrder(order);
      setStep('CONFIRMATION');

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#FFFFFF', '#A38025']
        });
      } catch (err) {
        // ignore if canvas-confetti fails
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Order failed. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep('FORM');
    setPlacedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-[#0e1017] border border-[#d4af37]/40 w-full max-w-4xl rounded-lg overflow-hidden relative shadow-2xl my-auto max-h-[95vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-[#08090d] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="text-[#d4af37]" size={20} />
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider font-syne">
                {step === 'FORM' ? 'VALKNUT EXPRESS CHECKOUT' : 'ORDER CONFIRMED'}
              </h3>
              <p className="text-xs text-slate-400">256-Bit SSL Encrypted Payment Gateway</p>
            </div>
          </div>

          <button 
            onClick={handleClose} 
            className="text-slate-400 hover:text-white p-1 rounded-full bg-white/5"
            aria-label="Close Checkout"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        {step === 'FORM' ? (
          <form onSubmit={handleSubmitOrder} className="p-6 overflow-y-auto max-h-[80vh] grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Customer & Delivery Details */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Error Notice */}
              {errorMsg && (
                <div className="p-3 bg-red-950/40 border border-red-500/50 rounded text-red-300 text-xs font-mono">
                  {errorMsg}
                </div>
              )}

              {/* 1. Contact Information */}
              <div>
                <h4 className="text-xs font-extrabold text-[#d4af37] tracking-widest uppercase mb-3 flex items-center gap-2">
                  <span>1. CUSTOMER CONTACT INFORMATION</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Kasun Perera"
                      className="w-full bg-[#141620] border border-white/20 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Mobile Phone (For SMS Tracking)</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+94771234567"
                      className="w-full bg-[#141620] border border-white/20 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Email Address (For Invoice)</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kasun@example.com"
                    className="w-full bg-[#141620] border border-white/20 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              {/* 2. Delivery Address */}
              <div className="border-t border-white/10 pt-4">
                <h4 className="text-xs font-extrabold text-[#d4af37] tracking-widest uppercase mb-3">
                  2. ISLANDWIDE SHIPPING ADDRESS
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="House No., Street Name, Apartment"
                      className="w-full bg-[#141620] border border-white/20 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Colombo"
                        className="w-full bg-[#141620] border border-white/20 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">District</label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-[#141620] border border-white/20 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37] cursor-pointer"
                      >
                        {SRI_LANKAN_DISTRICTS.map((d) => (
                          <option key={d} value={d} className="bg-[#141620] text-white">
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Postal Code</label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="00300"
                        className="w-full bg-[#141620] border border-white/20 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Delivery Notes / Landmark (Optional)</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Near commercial bank, call before delivery"
                      className="w-full bg-[#141620] border border-white/20 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Shipping Method Selector */}
              <div className="border-t border-white/10 pt-4">
                <h4 className="text-xs font-extrabold text-[#d4af37] tracking-widest uppercase mb-3">
                  3. SELECT SHIPPING METHOD
                </h4>

                <div className="space-y-2">
                  {availableShippingMethods.map((method) => {
                    const isSelected = shippingMethodId === method.id;
                    const isFree = method.freeShippingThreshold > 0 && cartSubtotal >= method.freeShippingThreshold;
                    const fee = isFree ? 0 : method.baseCharge;

                    return (
                      <div
                        key={method.id}
                        onClick={() => setShippingMethodId(method.id)}
                        className={`p-3 rounded border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-[#d4af37] bg-[#d4af37]/15 text-white'
                            : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="modalShippingMethod"
                            checked={isSelected}
                            onChange={() => setShippingMethodId(method.id)}
                            className="accent-[#d4af37] cursor-pointer"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white uppercase">{method.name}</span>
                              {method.id === 'express' && (
                                <span className="text-[8px] bg-[#d4af37] text-black px-1.5 py-0.2 rounded font-black font-mono">
                                  VIP PRIORITY
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 block">{method.estimatedDays}</span>
                          </div>
                        </div>

                        <span className="text-xs font-bold font-mono">
                          {isFree ? <span className="text-emerald-400">FREE</span> : `LKR ${fee.toLocaleString()}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Payment Gateway Selection */}
              <div className="border-t border-white/10 pt-4">
                <h4 className="text-xs font-extrabold text-[#d4af37] tracking-widest uppercase mb-3">
                  4. SELECT PAYMENT METHOD
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  {/* Koko Option */}
                  <div
                    onClick={() => setPaymentGateway('Koko')}
                    className={`p-3 rounded border cursor-pointer transition-all flex flex-col justify-between ${
                      paymentGateway === 'Koko'
                        ? 'border-[#d4af37] bg-[#d4af37]/15 text-white'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/30'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold text-xs text-[#d4af37]">KOKO PAY</span>
                        <span className="text-[9px] bg-[#d4af37] text-black px-1.5 py-0.2 rounded font-black">3 PAY</span>
                      </div>
                      <p className="text-[10px] text-slate-300">Pay in 3 interest-free monthly installments of LKR {Math.round(cartTotal / 3).toLocaleString()}.</p>
                    </div>
                  </div>

                  {/* OnePay Option */}
                  <div
                    onClick={() => setPaymentGateway('OnePay')}
                    className={`p-3 rounded border cursor-pointer transition-all flex flex-col justify-between ${
                      paymentGateway === 'OnePay'
                        ? 'border-[#d4af37] bg-[#d4af37]/15 text-white'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/30'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold text-xs text-sky-400">ONEPAY</span>
                        <span className="text-[9px] bg-sky-500 text-black px-1.5 py-0.2 rounded font-black">INSTANT</span>
                      </div>
                      <p className="text-[10px] text-slate-300">Direct Sri Lankan Internet Banking & Wallet Gateway.</p>
                    </div>
                  </div>

                  {/* eWAY Option */}
                  <div
                    onClick={() => setPaymentGateway('eWAY')}
                    className={`p-3 rounded border cursor-pointer transition-all flex flex-col justify-between ${
                      paymentGateway === 'eWAY'
                        ? 'border-[#d4af37] bg-[#d4af37]/15 text-white'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/30'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold text-xs text-amber-400">eWAY / CARD</span>
                        <CreditCard size={14} className="text-amber-400" />
                      </div>
                      <p className="text-[10px] text-slate-300">Visa, Mastercard, AMEX Credit / Debit Cards.</p>
                    </div>
                  </div>

                  {/* COD Option */}
                  <div
                    onClick={() => setPaymentGateway('Cash on Delivery')}
                    className={`p-3 rounded border cursor-pointer transition-all flex flex-col justify-between ${
                      paymentGateway === 'Cash on Delivery'
                        ? 'border-[#d4af37] bg-[#d4af37]/15 text-white'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/30'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold text-xs text-emerald-400">CASH ON DELIVERY</span>
                        <Truck size={14} className="text-emerald-400" />
                      </div>
                      <p className="text-[10px] text-slate-300">Pay cash directly upon courier delivery.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary & Pay Button */}
            <div className="lg:col-span-5 bg-[#08090d] border border-white/10 rounded-lg p-6 flex flex-col justify-between space-y-6">
              <div>
                <h4 className="text-xs font-extrabold text-[#d4af37] tracking-widest uppercase mb-4 pb-2 border-b border-white/10">
                  ORDER SUMMARY ({cart.length} ITEMS)
                </h4>

                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-3 text-xs">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-14 object-cover rounded bg-[#141620]" />
                      <div className="flex-1">
                        <h5 className="font-bold text-white line-clamp-1">{item.product.name}</h5>
                        <p className="text-[10px] text-slate-400">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                      </div>
                      <span className="font-extrabold text-white">LKR {(item.unitPrice * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-white/10 pt-4 mt-4 space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>LKR {cartSubtotal.toLocaleString()}</span>
                  </div>

                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount ({appliedCoupon?.code}):</span>
                      <span>- LKR {cartDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Islandwide Delivery ({shippingMethodId === 'standard' ? 'Standard' : 'VIP Express'}):</span>
                    <span>{cartShipping === 0 ? 'FREE' : `LKR ${cartShipping.toLocaleString()}`}</span>
                  </div>

                  <div className="flex justify-between items-baseline text-base font-black text-white pt-2 border-t border-white/10">
                    <span>TOTAL AMOUNT:</span>
                    <span className="text-xl text-[#d4af37]">LKR {cartTotal.toLocaleString()}</span>
                  </div>
                </div>

              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full btn-gold py-4 text-xs font-black flex items-center justify-center gap-2 shadow-2xl disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>LOCKING INVENTORY & AUTHORIZING...</span>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>CONFIRM & PAY LKR {cartTotal.toLocaleString()} VIA {paymentGateway.toUpperCase()}</span>
                  </>
                )}
              </button>
            </div>

          </form>
        ) : (
          /* CONFIRMATION SCREEN */
          <div className="p-8 text-center space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle size={36} />
            </div>

            <div>
              <span className="text-xs font-extrabold tracking-[0.25em] text-[#d4af37] uppercase block mb-1">
                VALKNUT ORDER CONFIRMED
              </span>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase font-syne">
                THANK YOU FOR YOUR ORDER
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Order Number: <strong className="text-white font-mono">{placedOrder?.orderNumber}</strong>
              </p>
            </div>

            {/* Simulated SMS & Email Trigger Alerts */}
            <div className="max-w-md mx-auto space-y-2 text-left text-xs">
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded flex items-center gap-3 text-emerald-300">
                <MessageSquare size={20} className="flex-shrink-0" />
                <div>
                  <p className="font-bold">SMS Sent to {placedOrder?.customerInfo.phone}</p>
                  <p className="text-[10px] text-emerald-400">Order confirmation & courier dispatch updates scheduled via SMS Gateway.</p>
                </div>
              </div>

              <div className="p-3 bg-sky-950/40 border border-sky-500/30 rounded flex items-center gap-3 text-sky-300">
                <Mail size={20} className="flex-shrink-0" />
                <div>
                  <p className="font-bold">Email Receipt Dispatched</p>
                  <p className="text-[10px] text-sky-400">Invoice sent to {placedOrder?.customerInfo.email}</p>
                </div>
              </div>
            </div>

            {/* Order Details summary box */}
            <div className="bg-[#08090d] border border-white/10 rounded-lg p-4 max-w-lg mx-auto text-left text-xs text-slate-300 space-y-2">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>Shipping Method:</span>
                <strong className="text-white">{placedOrder?.shippingInfo.shippingMethodName}</strong>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>Payment Method:</span>
                <strong className="text-white">{placedOrder?.paymentGateway}</strong>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>Total Amount Paid:</span>
                <strong className="text-[#d4af37]">LKR {placedOrder?.totalAmount.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery:</span>
                <strong className="text-emerald-400">{placedOrder?.shippingInfo.estimatedDays}</strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
              <button
                onClick={() => {
                  handleClose();
                  window.location.hash = `#/track-order?order=${placedOrder?.orderNumber}`;
                }}
                className="btn-gold px-6 py-3 text-xs font-black inline-flex items-center justify-center gap-2"
              >
                <Package size={15} />
                <span>TRACK ORDER</span>
              </button>

              <button
                onClick={handleClose}
                className="btn-secondary px-6 py-3 text-xs font-black inline-flex items-center justify-center gap-2"
              >
                <ArrowLeft size={15} />
                <span>RETURN TO STORE</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
