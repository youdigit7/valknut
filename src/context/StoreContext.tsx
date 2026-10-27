import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { 
  Product, 
  CartItem, 
  Coupon, 
  Order, 
  OrderStatus, 
  PaymentGateway, 
  PaymentStatus,
  ShippingAddress, 
  CategoryType, 
  SubCategoryType,
  UserProfile,
  NotificationLog,
  CustomStudioOptions,
  ProductSize
} from '../types/ecommerce';
import { INITIAL_PRODUCTS, INITIAL_COUPONS, SAMPLE_ORDERS, DEMO_CUSTOMER_EMAILS, DEMO_ORDER_IDS } from '../data/initialData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { saveProductToSupabase, deleteProductFromSupabase, mapSupabaseRowToProduct, isExcludedDummyProduct } from '../services/productService';
import { calculateShippingFee, getAvailableShippingMethods } from '../services/shippingService';
import type { ShippingMethod } from '../services/shippingService';
import { createOrderSecurely, updateOrderStatusWithAudit, updateOrderPaymentStatus, getAllOrders, deductStockFromProducts, deleteOrderFromSystem, clearAllOrdersFromSystem } from '../services/orderService';

interface StoreContextType {
  // Products
  products: Product[];
  activeCategory: CategoryType | 'ALL';
  setActiveCategory: (cat: CategoryType | 'ALL') => void;
  activeSubCategory: SubCategoryType | 'ALL';
  setActiveSubCategory: (sub: SubCategoryType | 'ALL') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedPriceRange: [number, number];
  setSelectedPriceRange: (range: [number, number]) => void;
  selectedSizeFilter: string | null;
  setSelectedSizeFilter: (size: string | null) => void;
  selectedColorFilter: string | null;
  setSelectedColorFilter: (color: string | null) => void;
  sortBy: 'latest' | 'price-low' | 'price-high' | 'popular';
  setSortBy: (sort: 'latest' | 'price-low' | 'price-high' | 'popular') => void;
  
  // Modals & Active Selections
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  customStudioProduct: Product | null;
  setCustomStudioProduct: (p: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isSizeChartOpen: boolean;
  setIsSizeChartOpen: (open: boolean) => void;

  // Shipping
  shippingMethodId: 'standard' | 'express';
  setShippingMethodId: (id: 'standard' | 'express') => void;
  availableShippingMethods: ShippingMethod[];

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: ProductSize, color: string, colorHex: string, quantity?: number, customization?: CustomStudioOptions) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTotal: number;

  // Orders
  orders: Order[];
  createOrder: (customerInfo: ShippingAddress, paymentGateway: PaymentGateway, notes?: string, customShippingMethod?: 'standard' | 'express') => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, courierName?: string, awbNumber?: string, trackingLink?: string) => Promise<void>;
  updateOrderPayment: (orderNumber: string, status: PaymentStatus, transactionId?: string) => Promise<Order | null>;
  deleteOrder: (orderId: string) => Promise<void>;
  clearAllOrders: () => Promise<void>;

  // Products Admin
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => void;

  // Coupons Admin
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;

  // User Auth & Profile
  user: UserProfile | null;
  loginUser: (email: string, name: string, isAdmin?: boolean, extra?: Partial<UserProfile>) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  logoutUser: () => void;

  // Notifications
  notificationLogs: NotificationLog[];
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage (real products only) or reliable default catalog
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('valknut_products_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const realOnly = parsed.filter((p: Product) => !isExcludedDummyProduct(p));
          if (realOnly.length > 0) return realOnly;
        }
      }
      localStorage.removeItem('valknut_products_v3');
      localStorage.removeItem('valknut_products_v2');
      localStorage.removeItem('valknut_products');
    } catch (e) {
      console.warn('Failed to parse cached products:', e);
    }
    return isSupabaseConfigured ? [] : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    localStorage.removeItem('valknut_orders');
    localStorage.removeItem('valknut_orders_v2');
    const saved = localStorage.getItem('valknut_orders_v3');
    const source = saved ? JSON.parse(saved) : SAMPLE_ORDERS;
    if (!Array.isArray(source)) return [];
    const cleaned = source.filter((order: Order) =>
      !DEMO_ORDER_IDS.includes(order.id) &&
      !DEMO_CUSTOMER_EMAILS.includes(order.customerInfo?.email?.toLowerCase())
    );
    if (saved && cleaned.length !== source.length) {
      localStorage.setItem('valknut_orders_v3', JSON.stringify(cleaned));
    }
    return cleaned;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('valknut_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('valknut_cart');
    return saved ? (JSON.parse(saved) as CartItem[]).filter((item) => !isExcludedDummyProduct(item?.product)) : [];
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('valknut_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clean out legacy mock default
        if (parsed?.email === 'guest@valknutofficial.com') {
          localStorage.removeItem('valknut_user');
          return null;
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse cached user:', e);
    }
    return null;
  });

  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>(() => {
    const savedLogs = localStorage.getItem('valknut_logs');
    return savedLogs ? JSON.parse(savedLogs) : [];
  });

  // Filter States
  const [activeCategory, setActiveCategory] = useState<CategoryType | 'ALL'>('ALL');
  const [activeSubCategory, setActiveSubCategory] = useState<SubCategoryType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>([0, 25000]);
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string | null>(null);
  const [selectedColorFilter, setSelectedColorFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'price-low' | 'price-high' | 'popular'>('latest');

  // Shipping Method State
  const [shippingMethodId, setShippingMethodId] = useState<'standard' | 'express'>('standard');
  const availableShippingMethods = getAvailableShippingMethods();

  // Active Modals & Selection
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customStudioProduct, setCustomStudioProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('valknut_products_v4', JSON.stringify(products));
    localStorage.removeItem('valknut_products_v3');
    localStorage.removeItem('valknut_products_v2');
    localStorage.removeItem('valknut_products');
  }, [products]);

  useEffect(() => {
    localStorage.setItem('valknut_orders_v3', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('valknut_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('valknut_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('valknut_logs', JSON.stringify(notificationLogs));
  }, [notificationLogs]);

  // Supabase cloud fetch: ONLY real products and variants from Supabase, plus orders & real-time sync
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      const loadCloudData = async () => {
        try {
          let { data, error } = await client.from('products').select('*, product_variants(*)');
          if (error && (error.code === 'PGRST301' || (error as any).status === 401)) {
            await client.auth.signOut().catch(() => {});
            const retry = await client.from('products').select('*, product_variants(*)');
            data = retry.data;
            error = retry.error;
          }
          if (!error && Array.isArray(data)) {
            const mapped = data.map(mapSupabaseRowToProduct).filter((p) => !isExcludedDummyProduct(p));
            setProducts((prev) => {
              const cachedRaw = localStorage.getItem('valknut_products_v4');
              const localCatalog: Product[] = cachedRaw ? JSON.parse(cachedRaw) : prev;

              // Reconcile: If local stock was deducted by placed orders, do NOT revert it to higher remote stock
              const reconciled = mapped.map((cloudProd) => {
                const localProd = localCatalog.find((p) => p.id === cloudProd.id);
                if (!localProd) return cloudProd;

                const cloudVariants = Array.isArray(cloudProd.variants) ? cloudProd.variants : [];
                const localVariants = Array.isArray(localProd.variants) ? localProd.variants : [];

                const reconciledVariants = cloudVariants.map((cv) => {
                  const lv = localVariants.find(
                    (v) =>
                      (v.id && cv.id && v.id === cv.id) ||
                      (v.sku && cv.sku && v.sku.toLowerCase() === cv.sku.toLowerCase()) ||
                      (v.size.toLowerCase() === cv.size.toLowerCase() && v.color.toLowerCase() === cv.color.toLowerCase()) ||
                      (v.size.toLowerCase() === cv.size.toLowerCase())
                  );
                  if (!lv) return cv;

                  const cloudStock = cv.stock ?? cv.stockCount ?? 0;
                  const localStock = lv.stock ?? lv.stockCount ?? 0;
                  const effectiveStock = Math.min(cloudStock, localStock);
                  return { ...cv, stock: effectiveStock, stockCount: effectiveStock };
                });

                return { ...cloudProd, variants: reconciledVariants };
              });

              localStorage.setItem('valknut_products_v4', JSON.stringify(reconciled));
              return reconciled;
            });
          }
        } catch (error: unknown) {
          console.warn('Supabase product fetch unavailable:', error);
        }

        try {
          const latestOrders = await getAllOrders();
          if (Array.isArray(latestOrders)) {
            setOrders(latestOrders);
          }
        } catch (ordErr) {
          console.warn('Supabase orders fetch unavailable:', ordErr);
        }
      };
      void loadCloudData();

      // Supabase Realtime channel for order updates
      try {
        const channel = client
          .channel('public:orders_realtime_feed')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'orders' },
            async (payload) => {
              const freshOrders = await getAllOrders();
              setOrders(freshOrders);
              if (payload.eventType === 'INSERT') {
                const newOrderNum = (payload.new as any)?.order_number || 'New Order';
                showToast(`New Customer Order: ${newOrderNum}`, 'info');
              }
            }
          )
          .subscribe();

        return () => {
          client.removeChannel(channel);
        };
      } catch (rtErr) {
        console.warn('Realtime subscription skipped:', rtErr);
      }
    }
  }, []);

  // Cross-tab real-time sync via BroadcastChannel & storage event
  useEffect(() => {
    const bc = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('valknut_orders_sync') : null;
    if (bc) {
      bc.onmessage = async (evt) => {
        if (evt.data?.type === 'ORDER_PLACED') {
          if (Array.isArray(evt.data.deductedItems) && evt.data.deductedItems.length > 0) {
            setProducts((prev) => {
              const updated = deductStockFromProducts(prev, evt.data.deductedItems);
              localStorage.setItem('valknut_products_v4', JSON.stringify(updated));
              return updated;
            });
          }
          const freshOrders = await getAllOrders();
          setOrders(freshOrders);
          showToast(`Order Placed: ${evt.data.orderNumber}`, 'info');
        }
      };
    }

    const onStorageChange = async (e: StorageEvent) => {
      if (e.key === 'valknut_orders_v3') {
        const freshOrders = await getAllOrders();
        setOrders(freshOrders);
      }
      if (e.key === 'valknut_products_v4' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setProducts(parsed.filter((p: Product) => !isExcludedDummyProduct(p)));
          }
        } catch (_) {}
      }
    };
    window.addEventListener('storage', onStorageChange);

    return () => {
      if (bc) bc.close();
      window.removeEventListener('storage', onStorageChange);
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  let cartDiscount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrderAmount) {
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      cartDiscount = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
    } else {
      cartDiscount = appliedCoupon.discountValue;
    }
  }

  const shippingCalc = calculateShippingFee(shippingMethodId, cartSubtotal);
  const cartShipping = shippingCalc.charge;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShipping);

  // Cart Operations
  const addToCart = (
    product: Product, 
    size: ProductSize, 
    color: string, 
    colorHex: string, 
    quantity: number = 1,
    customization?: CustomStudioOptions
  ) => {
    const itemUnitPrice = (product.salePrice ?? product.price) + (customization ? customization.additionalPrice : 0);
    const cartItemId = `${product.id}-${size}-${color}-${customization ? 'custom-' + Date.now() : 'standard'}`;

    setCart(prev => {
      const existing = prev.find(item => item.id === cartItemId);
      if (existing) {
        return prev.map(item => 
          item.id === cartItemId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            productId: product.id,
            product,
            selectedSize: size,
            selectedColor: color,
            selectedColorHex: colorHex,
            quantity,
            unitPrice: itemUnitPrice,
            customization
          }
        ];
      }
    });

    showToast(`Added ${product.name} (${size}) to your bag.`, 'success');
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
    showToast('Item removed from cart.', 'info');
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => 
      prev.map(item => {
        if (item.id === cartItemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const found = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.active);
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    if (cartSubtotal < found.minOrderAmount) {
      return { success: false, message: `Minimum order of LKR ${found.minOrderAmount.toLocaleString()} required for this coupon.` };
    }
    setAppliedCoupon(found);
    showToast(`Coupon '${found.code}' applied successfully!`, 'success');
    return { success: true, message: 'Coupon applied.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.', 'info');
  };

  // Order Operations
  const createOrder = async (
    customerInfo: ShippingAddress, 
    paymentGateway: PaymentGateway, 
    notes?: string,
    customShippingMethod?: 'standard' | 'express'
  ): Promise<Order> => {
    const activeMethodId = customShippingMethod || shippingMethodId;

    const result = await createOrderSecurely({
      customerInfo,
      items: cart,
      shippingMethodId: activeMethodId,
      paymentGateway,
      couponCode: appliedCoupon?.code,
      notes,
      userId: user?.id,
      allCoupons: coupons
    });

    if (!result.success || !result.order) {
      const errorMsg = result.errors?.[0] || 'Unable to complete order. Please review your cart items.';
      showToast(errorMsg, 'error');
      throw new Error(errorMsg);
    }

    // Refresh orders and notifications state
    const allLatestOrders = await getAllOrders();
    setOrders(allLatestOrders);

    // Deduct stock in real-time across the app state
    const itemsToDeduct = (result.order?.items && result.order.items.length > 0)
      ? result.order.items.map((it) => ({
          productId: it.productId,
          variantId: it.variantId,
          sku: it.sku,
          size: it.size,
          color: it.color,
          quantity: it.quantity,
          customization: it.customization
        }))
      : cart.map((c) => ({
          productId: c.productId,
          size: c.selectedSize,
          color: c.selectedColor,
          quantity: c.quantity,
          customization: c.customization
        }));

    setProducts((prev) => {
      const updated = deductStockFromProducts(prev, itemsToDeduct);
      localStorage.setItem('valknut_products_v4', JSON.stringify(updated));
      return updated;
    });

    setSelectedProduct((prev) => {
      if (!prev) return null;
      const updatedList = deductStockFromProducts([prev], itemsToDeduct);
      return updatedList[0] || prev;
    });

    try {
      const logsSaved = localStorage.getItem('valknut_logs');
      if (logsSaved) setNotificationLogs(JSON.parse(logsSaved));
    } catch (e) {
      console.warn('Failed to update products state after order:', e);
    }

    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('valknut_orders_sync');
        bc.postMessage({
          type: 'ORDER_PLACED',
          orderNumber: result.order.orderNumber,
          deductedItems: itemsToDeduct
        });
        bc.close();
      }
    } catch (bcErr) {
      // ignore
    }

    clearCart();
    return result.order;
  };

  const updateOrderStatus = async (
    orderId: string, 
    status: OrderStatus, 
    courierName?: string, 
    awbNumber?: string, 
    trackingLink?: string
  ): Promise<void> => {
    const updated = await updateOrderStatusWithAudit(
      orderId,
      status,
      { courierName, awbNumber, trackingUrl: trackingLink },
      `Order status marked as ${status}`,
      user?.name || 'VALKNUT Admin'
    );

    if (updated) {
      const allLatestOrders = await getAllOrders();
      setOrders(allLatestOrders);

      try {
        const logsSaved = localStorage.getItem('valknut_logs');
        if (logsSaved) setNotificationLogs(JSON.parse(logsSaved));
      } catch (e) {
        // ignore
      }

      showToast(`Order #${updated.orderNumber} status updated to '${status}'.`, 'success');
    }
  };

  const updateOrderPayment = async (
    orderNumber: string,
    status: PaymentStatus,
    transactionId?: string
  ): Promise<Order | null> => {
    const updated = await updateOrderPaymentStatus(orderNumber, status, transactionId);
    if (updated) {
      const allLatestOrders = await getAllOrders();
      setOrders(allLatestOrders);
      showToast(`Payment confirmed for order #${updated.orderNumber}.`, 'success');
    }
    return updated;
  };

  const deleteOrder = async (orderId: string): Promise<void> => {
    await deleteOrderFromSystem(orderId);
    setOrders((prev) => prev.filter((o) => o.id !== orderId && o.orderNumber !== orderId));
    showToast('Order removed.', 'info');
  };

  const clearAllOrders = async (): Promise<void> => {
    await clearAllOrdersFromSystem();
    setOrders([]);
    showToast('All orders cleared.', 'info');
  };

  // Products CRUD
  const addProduct = async (p: Product) => {
    const savedProduct = await saveProductToSupabase(p);
    setProducts(prev => [savedProduct, ...prev.filter(item => item.id !== savedProduct.id)]);
    showToast(`Product "${savedProduct.name}" created.`, 'success');
  };

  const updateProduct = async (p: Product) => {
    const savedProduct = await saveProductToSupabase(p);
    setProducts(prev => prev.map(item => item.id === savedProduct.id ? savedProduct : item));
    showToast(`Product "${savedProduct.name}" updated.`, 'success');
  };

  const deleteProduct = async (id: string) => {
    await deleteProductFromSupabase(id);
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product deleted from database.', 'info');
  };

  // Coupons CRUD
  const addCoupon = (c: Coupon) => {
    setCoupons(prev => [c, ...prev]);
    showToast(`Coupon code ${c.code} created.`, 'success');
  };

  const deleteCoupon = (code: string) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
    showToast('Coupon removed.', 'info');
  };

  // User Auth
  const loginUser = (
    email: string, 
    name: string, 
    isAdmin?: boolean, 
    extra?: Partial<UserProfile>
  ) => {
    const determinedAdmin = typeof isAdmin === 'boolean' 
      ? isAdmin 
      : Boolean(email.toLowerCase().includes('admin') || email.toLowerCase().includes('valknut') || email.toLowerCase() === 'founder@valknutofficial.com');

    const newUser: UserProfile = {
      id: extra?.id || `u-${Date.now()}`,
      email,
      name,
      phone: extra?.phone || '+94770000000',
      address: extra?.address,
      isAdmin: determinedAdmin
    };
    setUser(newUser);
    localStorage.setItem('valknut_user', JSON.stringify(newUser));
    showToast(`Welcome back, ${name}.`, 'success');
  };

  const setUserProfile = (profile: UserProfile | null) => {
    setUser(profile);
    if (profile) {
      localStorage.setItem('valknut_user', JSON.stringify(profile));
    } else {
      localStorage.removeItem('valknut_user');
      localStorage.removeItem('valknut_auth_session');
    }
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('valknut_user');
    localStorage.removeItem('valknut_auth_session');
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    showToast('Signed out of VALKNUT.', 'info');
  };

  return (
    <StoreContext.Provider value={{
      products,
      activeCategory,
      setActiveCategory,
      activeSubCategory,
      setActiveSubCategory,
      searchQuery,
      setSearchQuery,
      selectedPriceRange,
      setSelectedPriceRange,
      selectedSizeFilter,
      setSelectedSizeFilter,
      selectedColorFilter,
      setSelectedColorFilter,
      sortBy,
      setSortBy,
      selectedProduct,
      setSelectedProduct,
      customStudioProduct,
      setCustomStudioProduct,
      isCartOpen,
      setIsCartOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      isAccountOpen,
      setIsAccountOpen,
      isAdminOpen,
      setIsAdminOpen,
      isSizeChartOpen,
      setIsSizeChartOpen,
      shippingMethodId,
      setShippingMethodId,
      availableShippingMethods,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      cartSubtotal,
      cartDiscount,
      cartShipping,
      cartTotal,
      orders,
      createOrder,
      updateOrderStatus,
      updateOrderPayment,
      deleteOrder,
      clearAllOrders,
      addProduct,
      updateProduct,
      deleteProduct,
      coupons,
      addCoupon,
      deleteCoupon,
      user,
      loginUser,
      setUserProfile,
      logoutUser,
      notificationLogs,
      toast,
      showToast
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
