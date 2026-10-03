import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import type { OrderStatus } from '../../types/ecommerce';
import { 
  X, 
  User, 
  Package, 
  ExternalLink, 
  LogOut, 
  ShieldCheck 
} from 'lucide-react';

export const CustomerAccountModal: React.FC = () => {
  const { 
    isAccountOpen, 
    setIsAccountOpen, 
    user, 
    loginUser, 
    logoutUser, 
    orders, 
    setIsAdminOpen 
  } = useStore();

  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'PROFILE'>('ORDERS');

  if (!isAccountOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    loginUser(emailInput, nameInput || 'VALKNUT Customer');
  };

  const userOrders = user 
    ? orders.filter(o => o.customerInfo.email.toLowerCase() === user.email.toLowerCase() || user.isAdmin)
    : orders;

  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
      case 'Payment Pending': return 1;
      case 'Payment Confirmed':
      case 'Processing': return 2;
      case 'Packed': return 3;
      case 'Shipped': return 4;
      case 'Delivered': return 5;
      default: return 1;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-[#0e1017] border border-white/10 w-full max-w-3xl rounded-lg overflow-hidden relative shadow-2xl my-auto max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-[#08090d] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="text-[#d4af37]" size={22} />
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider font-syne">
                VALKNUT CUSTOMER PORTAL
              </h3>
              <p className="text-xs text-slate-400">
                {user ? `Logged in as ${user.name}` : 'Sign in to view orders & saved address'}
              </p>
            </div>
          </div>

          <button 
            onClick={() => setIsAccountOpen(false)} 
            className="text-slate-400 hover:text-white p-1 rounded-full bg-white/5"
            aria-label="Close Portal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        {!user ? (
          /* LOGIN FORM */
          <div className="p-8 max-w-md mx-auto w-full space-y-6">
            <div className="text-center">
              <span className="text-xs font-extrabold tracking-widest text-[#d4af37] uppercase block mb-1">
                ACCESS YOUR ACCOUNT
              </span>
              <h4 className="text-xl font-bold text-white font-syne uppercase">
                SIGN IN / REGISTER
              </h4>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Kasun Perera"
                  className="w-full bg-[#141620] border border-white/20 rounded p-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="kasun@example.com"
                  className="w-full bg-[#141620] border border-white/20 rounded p-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <button type="submit" className="w-full btn-gold py-3.5 text-xs font-extrabold">
                SIGN IN TO ACCOUNT
              </button>
            </form>
          </div>
        ) : (
          /* LOGGED IN PORTAL */
          <div className="p-6 overflow-y-auto max-h-[80vh] space-y-6">
            
            {/* Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('ORDERS')}
                  className={`px-4 py-2 rounded text-xs font-bold uppercase transition-colors ${
                    activeTab === 'ORDERS' ? 'bg-[#d4af37] text-black' : 'bg-white/5 text-slate-300'
                  }`}
                >
                  ORDER HISTORY ({userOrders.length})
                </button>
                <button
                  onClick={() => setActiveTab('PROFILE')}
                  className={`px-4 py-2 rounded text-xs font-bold uppercase transition-colors ${
                    activeTab === 'PROFILE' ? 'bg-[#d4af37] text-black' : 'bg-white/5 text-slate-300'
                  }`}
                >
                  PROFILE DETAILS
                </button>
              </div>

              <div className="flex items-center gap-2">
                {user.isAdmin && (
                  <button
                    onClick={() => { setIsAccountOpen(false); setIsAdminOpen(true); }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#d4af37]/20 border border-[#d4af37]/50 rounded text-xs font-bold text-[#d4af37]"
                  >
                    <ShieldCheck size={14} />
                    <span>OPEN ADMIN</span>
                  </button>
                )}

                <button
                  onClick={logoutUser}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-red-950/40 text-slate-300 hover:text-red-400 rounded text-xs font-bold"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Orders Tab View */}
            {activeTab === 'ORDERS' && (
              <div className="space-y-4">
                {userOrders.length === 0 ? (
                  <div className="text-center py-12 space-y-2">
                    <Package className="mx-auto text-slate-500" size={32} />
                    <p className="text-sm text-slate-300 font-bold">No orders found under your account.</p>
                  </div>
                ) : (
                  userOrders.map(order => {
                    const stepNum = getStatusStep(order.orderStatus);

                    return (
                      <div key={order.id} className="bg-[#141620] border border-white/10 rounded-lg p-5 space-y-4">
                        
                        {/* Top Summary Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                          <div>
                            <span className="text-xs font-extrabold text-[#d4af37] font-mono block">
                              {order.orderNumber}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-black text-white block">
                              LKR {order.totalAmount.toLocaleString()}
                            </span>
                            <span className="text-[10px] font-bold text-[#d4af37] uppercase">
                              {order.paymentGateway} ({order.paymentStatus})
                            </span>
                          </div>
                        </div>

                        {/* Order Items Breakdown */}
                        <div className="space-y-2">
                          {order.items.map((ci: any, idx: number) => {
                            const img = ci.customization?.finalPreviewDataUrl || ci.imageUrl || ci.product?.images?.[0] || '';
                            const name = ci.productName || ci.product?.name || 'VALKNUT Piece';
                            const size = ci.size || ci.selectedSize || 'M';

                            return (
                              <div key={idx} className="flex items-center gap-3 text-xs">
                                {img ? (
                                  <img src={img} alt={name} className="w-10 h-12 object-cover rounded bg-[#141620]" />
                                ) : (
                                  <div className="w-10 h-12 bg-[#141620] rounded flex items-center justify-center text-[9px] font-mono">VK</div>
                                )}
                                <div className="flex-1">
                                  <p className="font-bold text-white uppercase">{name}</p>
                                  <p className="text-[10px] text-slate-400">Size: {size} | Qty: {ci.quantity}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Live Tracking Progress Timeline */}
                        <div className="pt-2 border-t border-white/5">
                          <p className="text-[11px] font-bold text-slate-300 mb-3 flex items-center justify-between">
                            <span>SHIPPING STATUS: <strong className="text-[#d4af37] uppercase">{order.orderStatus}</strong></span>
                            {order.awbNumber && (
                              <span className="text-[10px] text-slate-400">AWB: <strong className="text-white">{order.awbNumber}</strong> ({order.courierName})</span>
                            )}
                          </p>

                          {/* Progress Bar steps */}
                          <div className="grid grid-cols-5 gap-1 text-center text-[9px] font-extrabold uppercase text-slate-500">
                            {['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'].map((stName, idx) => {
                              const isCompleted = stepNum >= (idx + 1);
                              return (
                                <div key={stName} className="space-y-1">
                                  <div className={`h-1.5 rounded-full ${isCompleted ? 'bg-[#d4af37]' : 'bg-white/10'}`} />
                                  <span className={isCompleted ? 'text-white' : 'text-slate-500'}>{stName}</span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Tracking Link Button */}
                          {order.trackingLink && (
                            <div className="mt-3 text-right">
                              <a
                                href={order.trackingLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-bold text-[#d4af37] hover:underline"
                              >
                                <span>Track with {order.courierName || 'Courier'}</span>
                                <ExternalLink size={13} />
                              </a>
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Profile Tab View */}
            {activeTab === 'PROFILE' && (
              <div className="bg-[#141620] border border-white/10 rounded-lg p-6 space-y-4 text-xs text-slate-300">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Name:</span>
                  <strong className="text-white">{user.name}</strong>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Email:</span>
                  <strong className="text-white">{user.email}</strong>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Phone:</span>
                  <strong className="text-white">{user.phone}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Role:</span>
                  <strong className="text-[#d4af37] uppercase">{user.isAdmin ? 'Store Admin & Owner' : 'VALKNUT VIP Member'}</strong>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
