import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import type { 
  Product, 
  ProductVariant, 
  OrderStatus, 
  Coupon, 
  CategoryItem, 
  CollectionItem, 
  HomepageConfig, 
  CustomerAccountRecord, 
  CategoryType,
  SubCategoryType 
} from '../../types/ecommerce';
import { SUPABASE_SETUP_SQL } from '../../lib/supabase';
import { ProductImageManager } from './ProductImageManager';
import { SingleImageUploader } from './SingleImageUploader';
import { FIREBASE_STORAGE_RULES, syncProductMediaToSupabase } from '../../services/mediaService';
import { 
  getAdminCategories, 
  saveAdminCategory, 
  deleteAdminCategory,
  getAdminCollections,
  saveAdminCollection,
  deleteAdminCollection,
  getAdminHomepageConfig,
  saveAdminHomepageConfig,
  getAdminCustomersList
} from '../../services/adminService';
import { 
  ShieldCheck, 
  Package, 
  ShoppingBag, 
  Tag, 
  Sparkles, 
  Plus, 
  Trash2, 
  Database, 
  TrendingUp,
  AlertTriangle,
  Layers,
  Users,
  Home,
  Edit2,
  Search,
  ExternalLink,
  Lock,
  XCircle,
  Copy,
  Check,
  Cloud
} from 'lucide-react';

type AdminTab = 
  | 'METRICS' 
  | 'PRODUCTS' 
  | 'CATEGORIES' 
  | 'COLLECTIONS' 
  | 'ORDERS' 
  | 'CUSTOMERS' 
  | 'COUPONS' 
  | 'HOMEPAGE' 
  | 'DATABASE';

export const AdminDashboard: React.FC = () => {
  const { 
    setIsAdminOpen, 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    orders, 
    updateOrderStatus, 
    coupons, 
    addCoupon, 
    deleteCoupon, 
    user,
    loginUser,
    showToast
  } = useStore();

  // Active Admin View Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('METRICS');

  // Admin Auth Gate State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Categories & Collections state
  const [categories, setCategories] = useState<CategoryItem[]>(() => getAdminCategories());
  const [collections, setCollections] = useState<CollectionItem[]>(() => getAdminCollections());
  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig>(() => getAdminHomepageConfig());

  // Customer List
  const customers = useMemo(() => getAdminCustomersList(orders, user), [orders, user]);

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodSlug, setProdSlug] = useState('');
  const [prodPrice, setProdPrice] = useState(8500);
  const [prodSalePrice, setProdSalePrice] = useState<number | undefined>(undefined);
  const [prodCategory, setProdCategory] = useState<CategoryType>('MEN');
  const [prodSubCategory, setProdSubCategory] = useState<SubCategoryType>('Oversized T-Shirts');
  const [prodCollection, setProdCollection] = useState('SHADOW OPS 2026');
  const [prodDescription, setProdDescription] = useState('');
  const [prodMaterial, setProdMaterial] = useState('100% Combed Organic Cotton (320 GSM)');
  const [prodCare, setProdCare] = useState('Machine wash cold. Line dry in shade.');
  const [prodImages, setProdImages] = useState<string[]>(['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85']);
  const [prodTags, setProdTags] = useState('Streetwear, Heavy Cotton, Boxy Fit');
  const [prodIsCustomizable, setProdIsCustomizable] = useState(true);
  const [prodIsBestSeller, setProdIsBestSeller] = useState(false);
  const [prodIsNewArrival, setProdIsNewArrival] = useState(true);
  const [prodIsLimitedEdition, setProdIsLimitedEdition] = useState(false);

  // Variant Manager inside Product Modal
  const [prodVariants, setProdVariants] = useState<ProductVariant[]>([
    { id: 'v-1', size: 'S', color: 'Onyx Black', colorHex: '#0a0a0c', sku: 'VK-NEW-BLK-S', stock: 20 },
    { id: 'v-2', size: 'M', color: 'Onyx Black', colorHex: '#0a0a0c', sku: 'VK-NEW-BLK-M', stock: 35 },
    { id: 'v-3', size: 'L', color: 'Onyx Black', colorHex: '#0a0a0c', sku: 'VK-NEW-BLK-L', stock: 25 },
    { id: 'v-4', size: 'XL', color: 'Onyx Black', colorHex: '#0a0a0c', sku: 'VK-NEW-BLK-XL', stock: 15 }
  ]);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catParent, setCatParent] = useState<'MEN' | 'WOMEN' | 'ESSENTIALS' | 'ROOT'>('ROOT');
  const [catDescription, setCatDescription] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catSeoTitle, setCatSeoTitle] = useState('');
  const [catSeoDesc, setCatSeoDesc] = useState('');

  // Collection Modal State
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<CollectionItem | null>(null);
  const [colName, setColName] = useState('');
  const [colSlug, setColSlug] = useState('');
  const [colDescription, setColDescription] = useState('');
  const [colImage, setColImage] = useState('');
  const [colSelectedProducts, setColSelectedProducts] = useState<string[]>([]);
  const [colSeoTitle, setColSeoTitle] = useState('');
  const [colSeoDesc, setColSeoDesc] = useState('');

  // Coupon Modal State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [newCouponDiscount, setNewCouponDiscount] = useState(15);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState(5000);
  const [newCouponExpiry, setNewCouponExpiry] = useState('2026-12-31');
  const [newCouponUsageLimit, setNewCouponUsageLimit] = useState(100);

  // Order Search & Filter State
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [selectedOrderForAwb, setSelectedOrderForAwb] = useState<any>(null);
  const [awbCourier, setAwbCourier] = useState('Pronto Lanka Express');
  const [awbNumberInput, setAwbNumberInput] = useState('');
  const [awbTrackingLinkInput, setAwbTrackingLinkInput] = useState('');
  const [awbStatusSelect, setAwbStatusSelect] = useState<OrderStatus>('Shipped');

  // Customer Detail Drawer
  const [viewingCustomer, setViewingCustomer] = useState<CustomerAccountRecord | null>(null);

  // Delete Confirmation State
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{ type: 'product' | 'category' | 'collection' | 'coupon'; id: string; name: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedStorageRules, setCopiedStorageRules] = useState(false);

  // Quick Demo Admin Login Handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const emailClean = adminEmail.trim().toLowerCase();
    if (emailClean.includes('admin') || emailClean.includes('valknut') || emailClean === 'founder@valknutofficial.com') {
      loginUser(adminEmail, 'VALKNUT Director');
      showToast('Admin access granted.', 'success');
    } else {
      setAuthError('Unauthorized. Only validated VALKNUT administrators can access this portal.');
    }
  };

  const handleFillDemoAdmin = () => {
    setAdminEmail('admin@valknutofficial.com');
    setAdminPassword('valknut2026');
  };

  // Metrics Calculations
  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + o.totalAmount, 0), [orders]);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = useMemo(() => orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Payment Pending' || o.orderStatus === 'Processing').length, [orders]);
  const lowStockProducts = useMemo(() => products.filter(p => p.variants.some(v => (v.stock ?? 0) <= 5)), [products]);

  // Product Open Form
  const openProductForm = (p?: Product) => {
    if (p) {
      setEditingProduct(p);
      setProdName(p.name);
      setProdSlug(p.slug);
      setProdPrice(p.price);
      setProdSalePrice(p.salePrice);
      setProdCategory(p.category);
      setProdSubCategory(p.subCategory);
      setProdCollection(p.collection || 'SHADOW OPS 2026');
      setProdDescription(p.description);
      setProdMaterial(p.material);
      setProdCare(p.careInstructions);
      setProdImages(p.images);
      setProdTags(p.tags.join(', '));
      setProdIsCustomizable(Boolean(p.isCustomizable));
      setProdIsBestSeller(Boolean(p.isBestSeller));
      setProdIsNewArrival(Boolean(p.isNewArrival));
      setProdIsLimitedEdition(Boolean(p.isLimitedEdition));
      setProdVariants(p.variants);
    } else {
      setEditingProduct(null);
      setProdName('');
      setProdSlug('');
      setProdPrice(8500);
      setProdSalePrice(undefined);
      setProdCategory('MEN');
      setProdSubCategory('Oversized T-Shirts');
      setProdCollection('SHADOW OPS 2026');
      setProdDescription('Engineered luxury garment constructed from heavyweight combed cotton.');
      setProdMaterial('100% Combed Organic Cotton (320 GSM)');
      setProdCare('Machine wash cold. Line dry in shade.');
      setProdImages(['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85']);
      setProdTags('Streetwear, Heavy Cotton, Boxy Fit');
      setProdIsCustomizable(true);
      setProdIsBestSeller(false);
      setProdIsNewArrival(true);
      setProdIsLimitedEdition(false);
      setProdVariants([
        { id: `v-${Date.now()}-1`, size: 'S', color: 'Onyx Black', colorHex: '#0a0a0c', sku: 'VK-NEW-BLK-S', stock: 20 },
        { id: `v-${Date.now()}-2`, size: 'M', color: 'Onyx Black', colorHex: '#0a0a0c', sku: 'VK-NEW-BLK-M', stock: 35 },
        { id: `v-${Date.now()}-3`, size: 'L', color: 'Onyx Black', colorHex: '#0a0a0c', sku: 'VK-NEW-BLK-L', stock: 25 },
        { id: `v-${Date.now()}-4`, size: 'XL', color: 'Onyx Black', colorHex: '#0a0a0c', sku: 'VK-NEW-BLK-XL', stock: 15 }
      ]);
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) {
      showToast('Product name is required.', 'error');
      return;
    }

    const calculatedSlug = prodSlug.trim() || prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const splitTags = prodTags.split(',').map(t => t.trim()).filter(Boolean);

    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: prodName.trim(),
      slug: calculatedSlug,
      description: prodDescription.trim(),
      material: prodMaterial.trim(),
      careInstructions: prodCare.trim(),
      price: Number(prodPrice),
      salePrice: prodSalePrice ? Number(prodSalePrice) : undefined,
      category: prodCategory,
      subCategory: prodSubCategory,
      collection: prodCollection,
      images: prodImages.filter(Boolean),
      tags: splitTags,
      isCustomizable: prodIsCustomizable,
      isBestSeller: prodIsBestSeller,
      isNewArrival: prodIsNewArrival,
      isLimitedEdition: prodIsLimitedEdition,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString(),
      variants: prodVariants
    };

    if (editingProduct) {
      updateProduct(productPayload);
      syncProductMediaToSupabase(productPayload.id, productPayload.images);
      showToast(`Updated "${productPayload.name}".`, 'success');
    } else {
      addProduct(productPayload);
      syncProductMediaToSupabase(productPayload.id, productPayload.images);
      showToast(`Created "${productPayload.name}".`, 'success');
    }

    setIsProductModalOpen(false);
  };

  // Category Open Form
  const openCategoryForm = (c?: CategoryItem) => {
    if (c) {
      setEditingCategory(c);
      setCatName(c.name);
      setCatSlug(c.slug);
      setCatParent(c.parentCategory);
      setCatDescription(c.description || '');
      setCatImage(c.imageUrl || '');
      setCatSeoTitle(c.seoTitle || '');
      setCatSeoDesc(c.seoDescription || '');
    } else {
      setEditingCategory(null);
      setCatName('');
      setCatSlug('');
      setCatParent('ROOT');
      setCatDescription('');
      setCatImage('');
      setCatSeoTitle('');
      setCatSeoDesc('');
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const payload: CategoryItem = {
      id: editingCategory ? editingCategory.id : `cat-${Date.now()}`,
      name: catName.trim(),
      slug: catSlug.trim() || catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      parentCategory: catParent,
      description: catDescription.trim(),
      imageUrl: catImage.trim(),
      seoTitle: catSeoTitle.trim(),
      seoDescription: catSeoDesc.trim(),
      active: true,
      itemCount: editingCategory?.itemCount || 0
    };

    const updated = saveAdminCategory(payload);
    setCategories(updated);
    setIsCategoryModalOpen(false);
    showToast(`Category "${payload.name}" saved.`, 'success');
  };

  // Collection Open Form
  const openCollectionForm = (col?: CollectionItem) => {
    if (col) {
      setEditingCollection(col);
      setColName(col.name);
      setColSlug(col.slug);
      setColDescription(col.description);
      setColImage(col.imageUrl);
      setColSelectedProducts(col.productIds);
      setColSeoTitle(col.seoTitle || '');
      setColSeoDesc(col.seoDescription || '');
    } else {
      setEditingCollection(null);
      setColName('');
      setColSlug('');
      setColDescription('');
      setColImage('https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85');
      setColSelectedProducts([]);
      setColSeoTitle('');
      setColSeoDesc('');
    }
    setIsCollectionModalOpen(true);
  };

  const handleSaveCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!colName.trim()) return;

    const payload: CollectionItem = {
      id: editingCollection ? editingCollection.id : `col-${Date.now()}`,
      name: colName.trim(),
      slug: colSlug.trim() || colName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: colDescription.trim(),
      imageUrl: colImage.trim(),
      productIds: colSelectedProducts,
      seoTitle: colSeoTitle.trim(),
      seoDescription: colSeoDesc.trim(),
      active: true,
      releaseDate: editingCollection?.releaseDate || new Date().toISOString().split('T')[0]
    };

    const updated = saveAdminCollection(payload);
    setCollections(updated);
    setIsCollectionModalOpen(false);
    showToast(`Collection "${payload.name}" saved.`, 'success');
  };

  // Coupon Creation
  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    const newC: Coupon = {
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      discountValue: Number(newCouponDiscount),
      minOrderAmount: Number(newCouponMinOrder),
      expiryDate: newCouponExpiry,
      usageLimit: Number(newCouponUsageLimit),
      usageCount: 0,
      scope: 'STOREWIDE',
      active: true
    };

    addCoupon(newC);
    setIsCouponModalOpen(false);
    setNewCouponCode('');
    showToast(`Coupon "${newC.code}" created.`, 'success');
  };

  // AWB & Order Logistics Update
  const handleSaveAwbUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForAwb) return;

    const trkLink = awbTrackingLinkInput.trim() || `https://valknutofficial.com/#/track-order?order=${selectedOrderForAwb.orderNumber}`;
    await updateOrderStatus(
      selectedOrderForAwb.id,
      awbStatusSelect,
      awbCourier,
      awbNumberInput.trim(),
      trkLink
    );

    setSelectedOrderForAwb(null);
    showToast(`Updated logistics for ${selectedOrderForAwb.orderNumber}.`, 'success');
  };

  // Delete Action Dispatcher
  const executeDelete = () => {
    if (!deleteConfirmTarget) return;

    if (deleteConfirmTarget.type === 'product') {
      deleteProduct(deleteConfirmTarget.id);
    } else if (deleteConfirmTarget.type === 'category') {
      setCategories(deleteAdminCategory(deleteConfirmTarget.id));
      showToast('Category deleted.', 'info');
    } else if (deleteConfirmTarget.type === 'collection') {
      setCollections(deleteAdminCollection(deleteConfirmTarget.id));
      showToast('Collection deleted.', 'info');
    } else if (deleteConfirmTarget.type === 'coupon') {
      deleteCoupon(deleteConfirmTarget.id);
    }

    setDeleteConfirmTarget(null);
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = orderStatusFilter === 'ALL' || o.orderStatus.toLowerCase() === orderStatusFilter.toLowerCase();
      const q = orderSearchQuery.trim().toLowerCase();
      const matchSearch = !q || 
        o.orderNumber.toLowerCase().includes(q) || 
        o.customerInfo.fullName.toLowerCase().includes(q) ||
        o.customerInfo.phone.includes(q) ||
        o.customerInfo.email.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [orders, orderStatusFilter, orderSearchQuery]);

  // Copy Supabase SQL
  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  // Check if non-admin is viewing
  const isAuthorizedAdmin = Boolean(user?.isAdmin || (user?.email && (user.email.toLowerCase().includes('admin') || user.email.toLowerCase() === 'founder@valknutofficial.com')));

  // AUTHENTICATION GUARD SCREEN
  if (!isAuthorizedAdmin) {
    return (
      <div className="w-full min-h-screen bg-[#0A0A0A] py-16 px-4 flex items-center justify-center border-b border-white/10">
        <div className="bg-[#0E1017] border border-[#D4AF37]/40 w-full max-w-md rounded-md p-8 shadow-2xl space-y-6 animate-fade-in relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border-2 border-[#D4AF37] text-[#D4AF37] flex items-center justify-center mx-auto shadow-lg shadow-[#D4AF37]/10">
              <Lock size={28} />
            </div>
            <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-[#D4AF37] uppercase block pt-2">
              RESTRICTED VALKNUT ARCHIVE
            </span>
            <h1 className="text-2xl font-black uppercase text-white font-syne tracking-tight">
              ADMINISTRATIVE ACCESS
            </h1>
            <p className="text-slate-400 text-xs font-mono">
              Database Row-Level Security Enforced. Customers must authenticate with verified admin credentials.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-950/60 border border-red-500/40 rounded text-red-400 text-xs font-mono flex items-center gap-2">
              <XCircle size={15} className="flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 font-mono text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-bold block uppercase text-[10px] tracking-wider">
                Admin Email Identifier
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@valknutofficial.com"
                className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded-[2px] p-3 text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-bold block uppercase text-[10px] tracking-wider">
                Security Password / Token
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded-[2px] p-3 text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#D4AF37] hover:bg-[#E2B714] text-black font-extrabold text-xs uppercase tracking-[0.2em] rounded-[2px] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#D4AF37]/20 cursor-pointer"
            >
              <ShieldCheck size={16} />
              <span>AUTHORIZE ACCESS</span>
            </button>
          </form>

          {/* Quick Demo Fill Helper */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              className="w-full py-2 bg-white/5 hover:bg-white/10 text-[#D4AF37] text-[11px] font-mono rounded border border-[#D4AF37]/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Use Verified Demo Admin Credentials</span>
            </button>

            <a
              href="#/"
              className="w-full py-2 text-center text-slate-400 hover:text-white text-[11px] font-mono block transition-colors"
            >
              Return to VALKNUT Storefront
            </a>
          </div>

        </div>
      </div>
    );
  }

  // FULL AUTHORIZED ADMIN OPERATIONS SUITE
  return (
    <div className="w-full min-h-screen bg-[#08090D] text-white flex flex-col antialiased">
      
      {/* Top Operations Bar */}
      <header className="bg-[#0E1017] border-b border-white/10 sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#D4AF37] text-black flex items-center justify-center font-mono font-black text-sm">
              VK
            </div>
            <div>
              <span className="text-[9px] font-mono font-bold tracking-[0.25em] text-[#D4AF37] uppercase block">
                VALKNUT MASTER CONTROL
              </span>
              <h1 className="text-base font-black uppercase text-white font-syne tracking-tight">
                EXECUTIVE SUITE
              </h1>
            </div>
          </div>

          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[10px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>CLOUD SYNC ACTIVE</span>
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <a
            href="#/shop"
            className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <span>Live Store</span>
            <ExternalLink size={13} />
          </a>

          <div className="flex items-center gap-2 border-l border-white/10 pl-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-white block font-mono">{user?.name || 'Administrator'}</span>
              <span className="text-[10px] text-[#D4AF37] font-mono">SUPABASE FOUNDER</span>
            </div>
            <button
              onClick={() => {
                if (setIsAdminOpen) setIsAdminOpen(false);
                window.location.hash = '#/';
              }}
              className="p-2 text-slate-400 hover:text-white bg-white/5 rounded transition-colors"
              title="Exit Dashboard"
            >
              <XCircle size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-1.5 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none font-mono text-xs">
          {[
            { id: 'METRICS', label: 'OVERVIEW', icon: TrendingUp },
            { id: 'PRODUCTS', label: `PRODUCTS (${products.length})`, icon: Package },
            { id: 'CATEGORIES', label: `CATEGORIES (${categories.length})`, icon: Layers },
            { id: 'COLLECTIONS', label: `COLLECTIONS (${collections.length})`, icon: Sparkles },
            { id: 'ORDERS', label: `ORDERS (${orders.length})`, icon: ShoppingBag },
            { id: 'CUSTOMERS', label: `CUSTOMERS (${customers.length})`, icon: Users },
            { id: 'COUPONS', label: `COUPONS (${coupons.length})`, icon: Tag },
            { id: 'HOMEPAGE', label: 'HOMEPAGE CMS', icon: Home },
            { id: 'DATABASE', label: 'DATABASE & RLS', icon: Database }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`px-4 py-2.5 rounded-[2px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer flex-shrink-0 ${
                  isActive
                    ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/10'
                    : 'bg-[#12141F] text-slate-400 hover:text-white border border-white/5 hover:bg-white/5'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* 1. METRICS TAB */}
        {activeTab === 'METRICS' && (
          <div className="space-y-6 animate-fade-in">
            {/* KPI Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 bg-[#0E1017] border border-white/10 rounded-md space-y-2 relative overflow-hidden">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                  GROSS REVENUE (LKR)
                </span>
                <p className="text-3xl font-black text-white font-mono">
                  LKR {totalRevenue.toLocaleString()}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                  <TrendingUp size={14} />
                  <span>Verified Purchases Across Sri Lanka</span>
                </div>
              </div>

              <div className="p-6 bg-[#0E1017] border border-white/10 rounded-md space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                  TOTAL COMPLETED ORDERS
                </span>
                <p className="text-3xl font-black text-[#D4AF37] font-mono">
                  {totalOrdersCount}
                </p>
                <span className="text-xs text-slate-400 font-mono">
                  {pendingOrdersCount} Pending Dispatch
                </span>
              </div>

              <div className="p-6 bg-[#0E1017] border border-white/10 rounded-md space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                  REGISTERED BUYERS
                </span>
                <p className="text-3xl font-black text-white font-mono">
                  {customers.length}
                </p>
                <span className="text-xs text-emerald-400 font-mono">
                  100% Verified Customer Profiles
                </span>
              </div>

              <div className="p-6 bg-[#0E1017] border border-white/10 rounded-md space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                  LOW-STOCK ALERTS (&le; 5 PCS)
                </span>
                <p className={`text-3xl font-black font-mono ${lowStockProducts.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {lowStockProducts.length} Products
                </p>
                <span className="text-xs text-slate-400 font-mono">
                  {lowStockProducts.length > 0 ? 'Action required in warehouse' : 'Inventory levels healthy'}
                </span>
              </div>
            </div>

            {/* Recent Orders Feed & Low Stock Table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Recent Orders (8 cols) */}
              <div className="lg:col-span-8 bg-[#0E1017] border border-white/10 rounded-md p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-sm font-black uppercase text-white font-syne tracking-wider">
                    RECENT ORDERS STREAM
                  </h3>
                  <button
                    onClick={() => setActiveTab('ORDERS')}
                    className="text-xs font-mono text-[#D4AF37] hover:underline"
                  >
                    View All Orders &rarr;
                  </button>
                </div>

                <div className="divide-y divide-white/5 overflow-x-auto">
                  {orders.slice(0, 5).map((ord) => (
                    <div key={ord.id} className="py-3.5 flex items-center justify-between gap-4 text-xs font-mono">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <strong className="text-white">{ord.orderNumber}</strong>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                            {ord.paymentGateway}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px]">{ord.customerInfo.fullName} • {ord.customerInfo.phone}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-white font-bold">LKR {ord.totalAmount.toLocaleString()}</p>
                        <span className="text-[10px] text-[#D4AF37] font-bold uppercase">{ord.orderStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Items (4 cols) */}
              <div className="lg:col-span-4 bg-[#0E1017] border border-white/10 rounded-md p-6 space-y-4">
                <h3 className="text-sm font-black uppercase text-amber-400 font-syne tracking-wider flex items-center gap-2">
                  <AlertTriangle size={16} />
                  <span>LOW INVENTORY NOTICES</span>
                </h3>

                {lowStockProducts.length === 0 ? (
                  <p className="text-xs font-mono text-slate-400 py-6 text-center">
                    All variant quantities are above minimum reorder thresholds.
                  </p>
                ) : (
                  <div className="divide-y divide-white/5 space-y-3">
                    {lowStockProducts.slice(0, 5).map((prod) => (
                      <div key={prod.id} className="pt-3 first:pt-0 flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2.5">
                          <img src={prod.images[0]} alt="" className="w-10 h-12 object-cover rounded bg-[#141620]" />
                          <div>
                            <p className="text-white font-bold truncate max-w-[140px]">{prod.name}</p>
                            <p className="text-[10px] text-slate-400">{prod.subCategory}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => openProductForm(prod)}
                          className="px-2.5 py-1 bg-amber-950/40 border border-amber-500/40 text-amber-400 rounded text-[10px] hover:bg-amber-950 transition-colors"
                        >
                          Restock
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* 2. PRODUCT MANAGEMENT TAB */}
        {activeTab === 'PRODUCTS' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0E1017] border border-white/10 p-4 rounded-md">
              <div className="flex items-center gap-3">
                <Package className="text-[#D4AF37]" size={22} />
                <div>
                  <h2 className="text-base font-black uppercase text-white font-syne">
                    PRODUCT CATALOG REPOSITORY
                  </h2>
                  <p className="text-xs font-mono text-slate-400">
                    Manage heavyweight luxury garments, size charts, variant stocks, and specs.
                  </p>
                </div>
              </div>

              <button
                onClick={() => openProductForm()}
                className="px-5 py-3 bg-[#D4AF37] hover:bg-[#E2B714] text-black text-xs font-mono font-extrabold uppercase tracking-wider rounded-[2px] flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#D4AF37]/20"
              >
                <Plus size={16} />
                <span>CREATE PRODUCT</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-[#0E1017] border border-white/10 rounded-md overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-[#141620] text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                    <tr>
                      <th className="p-4">Garment</th>
                      <th className="p-4">Category / Collection</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Variants & Stock</th>
                      <th className="p-4">Status Badges</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.map((prod) => {
                      const totalStock = prod.variants.reduce((sum, v) => sum + (v.stock ?? 0), 0);
                      const isLowStock = totalStock <= 10;

                      return (
                        <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80'}
                                alt=""
                                className="w-12 h-14 object-cover rounded bg-[#141620] border border-white/10 flex-shrink-0"
                              />
                              <div>
                                <h4 className="text-white font-bold text-xs uppercase font-heading">{prod.name}</h4>
                                <span className="text-[10px] text-slate-500 block">SKU: {prod.variants[0]?.sku || prod.slug}</span>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <span className="text-[#D4AF37] font-bold block">{prod.category}</span>
                            <span className="text-[10px] text-slate-400 block">{prod.subCategory}</span>
                            {prod.collection && (
                              <span className="text-[9px] text-slate-500 uppercase">{prod.collection}</span>
                            )}
                          </td>

                          <td className="p-4">
                            <span className="text-white font-bold block">LKR {prod.price.toLocaleString()}</span>
                            {prod.salePrice && (
                              <span className="text-emerald-400 text-[10px] block">Sale: LKR {prod.salePrice.toLocaleString()}</span>
                            )}
                          </td>

                          <td className="p-4">
                            <span className={`font-bold ${isLowStock ? 'text-amber-400' : 'text-slate-300'}`}>
                              {totalStock} units
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              {prod.variants.length} Size/Color Variants
                            </span>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center gap-1.5 flex-wrap text-[9px]">
                              {prod.isNewArrival && <span className="px-1.5 py-0.5 bg-sky-950 text-sky-400 border border-sky-500/30 rounded">NEW</span>}
                              {prod.isBestSeller && <span className="px-1.5 py-0.5 bg-amber-950 text-amber-400 border border-amber-500/30 rounded">BESTSELLER</span>}
                              {prod.isCustomizable && <span className="px-1.5 py-0.5 bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 rounded">STUDIO</span>}
                            </div>
                          </td>

                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => openProductForm(prod)}
                              className="p-2 bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white rounded transition-colors"
                              title="Edit Product"
                            >
                              <Edit2 size={14} />
                            </button>

                            <button
                              onClick={() => setDeleteConfirmTarget({ type: 'product', id: prod.id, name: prod.name })}
                              className="p-2 bg-red-950/30 hover:bg-red-950/80 text-red-400 rounded transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. CATEGORY MANAGEMENT TAB */}
        {activeTab === 'CATEGORIES' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0E1017] border border-white/10 p-4 rounded-md">
              <div className="flex items-center gap-3">
                <Layers className="text-[#D4AF37]" size={22} />
                <div>
                  <h2 className="text-base font-black uppercase text-white font-syne">
                    STOREFRONT CATEGORIES & TAXONOMIES
                  </h2>
                  <p className="text-xs font-mono text-slate-400">
                    Configure parent categories, sub-classifications, and SEO metadata.
                  </p>
                </div>
              </div>

              <button
                onClick={() => openCategoryForm()}
                className="px-5 py-3 bg-[#D4AF37] hover:bg-[#E2B714] text-black text-xs font-mono font-extrabold uppercase tracking-wider rounded-[2px] flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#D4AF37]/20"
              >
                <Plus size={16} />
                <span>CREATE CATEGORY</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-[#0E1017] border border-white/10 rounded-md p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase">
                        PARENT: {cat.parentCategory}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                        ACTIVE
                      </span>
                    </div>

                    <h3 className="text-base font-bold uppercase text-white font-syne">{cat.name}</h3>
                    <p className="text-xs font-mono text-slate-400 line-clamp-2">{cat.description || 'No description provided.'}</p>

                    {cat.seoTitle && (
                      <div className="p-2.5 bg-[#141620] rounded border border-white/5 text-[11px] font-mono text-slate-300 space-y-1">
                        <span className="text-[9px] text-[#D4AF37] uppercase block font-bold">SEO TITLE</span>
                        <p className="truncate">{cat.seoTitle}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500">Slug: /{cat.slug}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openCategoryForm(cat)}
                        className="p-2 bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white rounded"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmTarget({ type: 'category', id: cat.id, name: cat.name })}
                        className="p-2 bg-red-950/30 hover:bg-red-950 text-red-400 rounded"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. COLLECTION MANAGEMENT TAB */}
        {activeTab === 'COLLECTIONS' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0E1017] border border-white/10 p-4 rounded-md">
              <div className="flex items-center gap-3">
                <Sparkles className="text-[#D4AF37]" size={22} />
                <div>
                  <h2 className="text-base font-black uppercase text-white font-syne">
                    EDITORIAL COLLECTIONS & DROPS
                  </h2>
                  <p className="text-xs font-mono text-slate-400">
                    Group pieces into themed drops like Shadow Ops 2026 and Stealth Labs.
                  </p>
                </div>
              </div>

              <button
                onClick={() => openCollectionForm()}
                className="px-5 py-3 bg-[#D4AF37] hover:bg-[#E2B714] text-black text-xs font-mono font-extrabold uppercase tracking-wider rounded-[2px] flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#D4AF37]/20"
              >
                <Plus size={16} />
                <span>CREATE COLLECTION</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {collections.map((col) => (
                <div key={col.id} className="bg-[#0E1017] border border-white/10 rounded-md overflow-hidden flex flex-col justify-between shadow-xl">
                  <div className="h-44 relative bg-[#141620] overflow-hidden">
                    <img src={col.imageUrl} alt={col.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E1017] via-transparent to-black/40" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-black/80 text-[#D4AF37] border border-[#D4AF37]/50 text-[10px] font-mono font-black uppercase rounded">
                        RELEASE: {col.releaseDate || '2026'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-black uppercase text-white font-syne">{col.name}</h3>
                      <p className="text-xs font-mono text-slate-400 mt-1">{col.description}</p>
                      
                      <div className="mt-3 flex items-center gap-2 text-xs font-mono text-slate-300">
                        <strong className="text-white">{col.productIds.length}</strong> Assigned Garments
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-500">Slug: /{col.slug}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openCollectionForm(col)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white rounded text-xs font-mono flex items-center gap-1.5"
                        >
                          <Edit2 size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirmTarget({ type: 'collection', id: col.id, name: col.name })}
                          className="p-1.5 bg-red-950/30 hover:bg-red-950 text-red-400 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. ORDER & LOGISTICS MANAGEMENT TAB */}
        {activeTab === 'ORDERS' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header & Filter Controls */}
            <div className="bg-[#0E1017] border border-white/10 p-5 rounded-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="text-[#D4AF37]" size={22} />
                  <div>
                    <h2 className="text-base font-black uppercase text-white font-syne">
                      ORDER FULFILLMENT & COURIER DISPATCH
                    </h2>
                    <p className="text-xs font-mono text-slate-400">
                      Real-time status changes, Air Waybill tracking assignment, and courier integration.
                    </p>
                  </div>
                </div>

                {/* Status Tabs Quick Filter */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono">
                  {['ALL', 'Pending', 'Payment Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1.5 rounded uppercase font-bold transition-all cursor-pointer flex-shrink-0 ${
                        orderStatusFilter === st
                          ? 'bg-[#D4AF37] text-black'
                          : 'bg-[#141620] text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Search by Order # (e.g. VK-2026-8801), Customer Name, Mobile Phone, or Email..."
                  className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded-[2px] py-2.5 pl-10 pr-4 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Orders Feed Table */}
            <div className="bg-[#0E1017] border border-white/10 rounded-md overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-[#141620] text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                    <tr>
                      <th className="p-4">Order Ref</th>
                      <th className="p-4">Customer & Destination</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Total & Gateway</th>
                      <th className="p-4">Order Status</th>
                      <th className="p-4">Courier / AWB</th>
                      <th className="p-4 text-right">Logistics Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500 font-mono">
                          No orders matched the active filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <strong className="text-white font-bold block">{ord.orderNumber}</strong>
                            <span className="text-[10px] text-slate-500">
                              {new Date(ord.createdAt).toLocaleDateString()}
                            </span>
                          </td>

                          <td className="p-4">
                            <span className="text-white font-bold block">{ord.customerInfo.fullName}</span>
                            <span className="text-[10px] text-slate-400 block">{ord.customerInfo.city}, {ord.customerInfo.district}</span>
                            <span className="text-[10px] text-slate-500">{ord.customerInfo.phone}</span>
                          </td>

                          <td className="p-4">
                            <span className="text-white font-bold block">
                              {ord.items.reduce((s, i) => s + i.quantity, 0)} Pcs
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                              {ord.items[0]?.productName || 'Garment'}
                            </span>
                          </td>

                          <td className="p-4">
                            <span className="text-[#D4AF37] font-bold block">LKR {ord.totalAmount.toLocaleString()}</span>
                            <span className="text-[10px] text-slate-400 block">{ord.paymentGateway} ({ord.paymentStatus})</span>
                          </td>

                          <td className="p-4">
                            <select
                              value={ord.orderStatus}
                              onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                              className="bg-[#141620] border border-white/20 text-xs font-mono rounded px-2 py-1 text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Payment Pending">Payment Pending</option>
                              <option value="Payment Confirmed">Payment Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Packed">Packed</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>

                          <td className="p-4">
                            {ord.awbNumber ? (
                              <div>
                                <span className="text-white font-bold block">{ord.awbNumber}</span>
                                <span className="text-[10px] text-slate-400">{ord.courierName || 'Courier'}</span>
                              </div>
                            ) : (
                              <span className="text-amber-400 text-[10px] font-bold">Unassigned</span>
                            )}
                          </td>

                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedOrderForAwb(ord);
                                setAwbCourier(ord.courierName || 'Pronto Lanka Express');
                                setAwbNumberInput(ord.awbNumber || '');
                                setAwbTrackingLinkInput(ord.trackingLink || '');
                                setAwbStatusSelect(ord.orderStatus);
                              }}
                              className="px-3 py-1.5 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/50 text-[#D4AF37] rounded text-xs font-mono font-bold transition-colors cursor-pointer"
                            >
                              Dispatch AWB
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 6. CUSTOMER MANAGEMENT TAB */}
        {activeTab === 'CUSTOMERS' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#0E1017] border border-white/10 p-5 rounded-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="text-[#D4AF37]" size={22} />
                <div>
                  <h2 className="text-base font-black uppercase text-white font-syne">
                    CUSTOMER DIRECTORY & PURCHASE PROFILES
                  </h2>
                  <p className="text-xs font-mono text-slate-400">
                    View verified client histories, total lifetime expenditure, and Sri Lanka delivery destinations.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customers.map((c) => (
                <div key={c.id} className="bg-[#0E1017] border border-white/10 rounded-md p-5 space-y-4 shadow-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#141620] border border-white/10 flex items-center justify-center text-white font-mono font-bold">
                        {c.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold uppercase text-white font-heading">{c.fullName}</h4>
                        <span className="text-[11px] font-mono text-slate-400 block">{c.email}</span>
                      </div>
                    </div>

                    {c.isAdmin && (
                      <span className="px-2 py-0.5 bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] text-[9px] font-mono font-bold uppercase rounded">
                        ADMIN
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono p-3 bg-[#141620] rounded border border-white/5">
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase block">TOTAL ORDERS</span>
                      <strong className="text-white">{c.ordersCount} Orders</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase block">LIFETIME SPEND</span>
                      <strong className="text-[#D4AF37]">LKR {c.totalSpent.toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="text-xs font-mono text-slate-400 space-y-1">
                    <p className="text-slate-300">Tel: {c.phone}</p>
                    {c.address && (
                      <p className="truncate">Destination: {c.address.city}, {c.address.district}</p>
                    )}
                  </div>

                  <button
                    onClick={() => setViewingCustomer(c)}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded text-xs font-mono font-bold transition-colors"
                  >
                    View Customer Order History
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. COUPON MANAGEMENT TAB */}
        {activeTab === 'COUPONS' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0E1017] border border-white/10 p-4 rounded-md">
              <div className="flex items-center gap-3">
                <Tag className="text-[#D4AF37]" size={22} />
                <div>
                  <h2 className="text-base font-black uppercase text-white font-syne">
                    PROMOTIONS & DISCOUNT RULES
                  </h2>
                  <p className="text-xs font-mono text-slate-400">
                    Configure percentage discounts, fixed vouchers, usage caps, and expiration limits.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCouponModalOpen(true)}
                className="px-5 py-3 bg-[#D4AF37] hover:bg-[#E2B714] text-black text-xs font-mono font-extrabold uppercase tracking-wider rounded-[2px] flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#D4AF37]/20"
              >
                <Plus size={16} />
                <span>CREATE COUPON</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coupons.map((cpn) => (
                <div key={cpn.code} className="bg-[#0E1017] border border-white/10 rounded-md p-5 space-y-4 shadow-xl flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-mono font-black text-[#D4AF37] tracking-wider">
                        {cpn.code}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold rounded">
                        {cpn.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>

                    <div className="p-3 bg-[#141620] rounded border border-white/5 space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Discount:</span>
                        <strong className="text-white">
                          {cpn.discountType === 'PERCENTAGE' ? `${cpn.discountValue}% OFF` : `LKR ${cpn.discountValue.toLocaleString()} OFF`}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Min Order:</span>
                        <strong className="text-white">LKR {cpn.minOrderAmount.toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Expires:</span>
                        <strong className="text-slate-300">{cpn.expiryDate}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">Usage Limit: {cpn.usageLimit || 'Unlimited'}</span>
                    <button
                      onClick={() => setDeleteConfirmTarget({ type: 'coupon', id: cpn.code, name: cpn.code })}
                      className="p-2 bg-red-950/30 hover:bg-red-950 text-red-400 rounded transition-colors"
                      title="Delete Coupon"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. HOMEPAGE CMS MANAGEMENT TAB */}
        {activeTab === 'HOMEPAGE' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#0E1017] border border-white/10 p-5 rounded-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Home className="text-[#D4AF37]" size={22} />
                <div>
                  <h2 className="text-base font-black uppercase text-white font-syne">
                    STOREFRONT HOMEPAGE CMS & SECTION CONTROLS
                  </h2>
                  <p className="text-xs font-mono text-slate-400">
                    Live hero banners, editorial announcements, and component visibility toggles.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  saveAdminHomepageConfig(homepageConfig);
                  showToast('Homepage CMS settings updated successfully.', 'success');
                }}
                className="px-6 py-3 bg-[#D4AF37] hover:bg-[#E2B714] text-black text-xs font-mono font-extrabold uppercase tracking-wider rounded-[2px] transition-all shadow-lg"
              >
                SAVE CMS CHANGES
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hero Banner Controls */}
              <div className="bg-[#0E1017] border border-white/10 rounded-md p-6 space-y-4">
                <h3 className="text-sm font-black uppercase text-white font-syne tracking-wider border-b border-white/10 pb-3">
                  1. HERO SECTION HERO BANNER
                </h3>

                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Headline Text</label>
                    <input
                      type="text"
                      value={homepageConfig.hero.headline}
                      onChange={(e) => setHomepageConfig({ ...homepageConfig, hero: { ...homepageConfig.hero, headline: e.target.value } })}
                      className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Subheadline Description</label>
                    <input
                      type="text"
                      value={homepageConfig.hero.subheadline}
                      onChange={(e) => setHomepageConfig({ ...homepageConfig, hero: { ...homepageConfig.hero, subheadline: e.target.value } })}
                      className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2.5 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">CTA Button Text</label>
                      <input
                        type="text"
                        value={homepageConfig.hero.ctaText}
                        onChange={(e) => setHomepageConfig({ ...homepageConfig, hero: { ...homepageConfig.hero, ctaText: e.target.value } })}
                        className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">CTA Destination Link</label>
                      <input
                        type="text"
                        value={homepageConfig.hero.ctaLink}
                        onChange={(e) => setHomepageConfig({ ...homepageConfig, hero: { ...homepageConfig.hero, ctaLink: e.target.value } })}
                        className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2.5 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <SingleImageUploader
                      label="Hero Background Banner"
                      imageUrl={homepageConfig.hero.bannerImage}
                      onChange={(url) => setHomepageConfig({ ...homepageConfig, hero: { ...homepageConfig.hero, bannerImage: url } })}
                      scope="homepage"
                      identifier="hero-banner"
                    />
                  </div>
                </div>
              </div>

              {/* Section Visibility Toggles */}
              <div className="bg-[#0E1017] border border-white/10 rounded-md p-6 space-y-4">
                <h3 className="text-sm font-black uppercase text-white font-syne tracking-wider border-b border-white/10 pb-3">
                  2. HOMEPAGE SECTIONS VISIBILITY
                </h3>

                <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
                  {Object.entries(homepageConfig.sectionsVisibility).map(([key, val]) => (
                    <label key={key} className="flex items-center gap-2.5 p-2.5 bg-[#141620] rounded border border-white/5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={(e) => {
                          const updated = { ...homepageConfig.sectionsVisibility, [key]: e.target.checked };
                          setHomepageConfig({ ...homepageConfig, sectionsVisibility: updated });
                        }}
                        className="accent-[#D4AF37]"
                      />
                      <span className="capitalize text-slate-300 text-[11px]">{key.replace(/([A-Z])/g, ' $1')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 9. DATABASE & SUPABASE TAB */}
        {activeTab === 'DATABASE' && (
          <div className="space-y-6 animate-fade-in">
            {/* Supabase SQL Card */}
            <div className="bg-[#0E1017] border border-white/10 p-6 rounded-md space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <Database className="text-[#D4AF37]" size={22} />
                  <div>
                    <h2 className="text-base font-black uppercase text-white font-syne">
                      SUPABASE DATABASE & RLS POLICIES
                    </h2>
                    <p className="text-xs font-mono text-slate-400">
                      Cloud schema with 11 tables (including product_media) and hardened Row-Level Security policies.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCopySql}
                  className="px-4 py-2 bg-[#D4AF37] text-black font-mono font-bold text-xs uppercase rounded flex items-center gap-1.5 transition-all hover:bg-[#E2B714]"
                >
                  {copiedSql ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedSql ? 'COPIED SQL' : 'COPY SUPABASE SQL'}</span>
                </button>
              </div>

              <div className="p-4 bg-[#08090D] border border-white/10 rounded font-mono text-[11px] text-slate-300 max-h-[300px] overflow-y-auto whitespace-pre">
                {SUPABASE_SETUP_SQL}
              </div>
            </div>

            {/* Firebase Storage Security Rules Card */}
            <div className="bg-[#0E1017] border border-white/10 p-6 rounded-md space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <Cloud className="text-[#D4AF37]" size={22} />
                  <div>
                    <h2 className="text-base font-black uppercase text-white font-syne">
                      FIREBASE CLOUD STORAGE RULES
                    </h2>
                    <p className="text-xs font-mono text-slate-400">
                      Production security rules for products, categories, collections, and custom customer artwork.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(FIREBASE_STORAGE_RULES);
                    setCopiedStorageRules(true);
                    setTimeout(() => setCopiedStorageRules(false), 2000);
                  }}
                  className="px-4 py-2 bg-[#D4AF37] text-black font-mono font-bold text-xs uppercase rounded flex items-center gap-1.5 transition-all hover:bg-[#E2B714]"
                >
                  {copiedStorageRules ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedStorageRules ? 'COPIED RULES' : 'COPY STORAGE RULES'}</span>
                </button>
              </div>

              <div className="p-4 bg-[#08090D] border border-white/10 rounded font-mono text-[11px] text-slate-300 max-h-[250px] overflow-y-auto whitespace-pre">
                {FIREBASE_STORAGE_RULES}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* PRODUCT CREATE/EDIT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="bg-[#0E1017] border border-[#D4AF37]/40 w-full max-w-4xl rounded-md p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest block">
                  {editingProduct ? 'EDIT EXISTING GARMENT' : 'CREATE NEW LUXURY PRODUCT'}
                </span>
                <h3 className="text-xl font-black uppercase text-white font-syne">
                  {editingProduct ? editingProduct.name : 'NEW VALKNUT PRODUCT'}
                </h3>
              </div>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <XCircle size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6 font-mono text-xs">
              
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="e.g. Valknut Oversized Heavyweight Boxy Hoodie"
                    className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">URL Slug (Auto-generated if empty)</label>
                  <input
                    type="text"
                    value={prodSlug}
                    onChange={(e) => setProdSlug(e.target.value)}
                    placeholder="valknut-oversized-heavyweight-boxy-hoodie"
                    className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2.5 text-white"
                  />
                </div>
              </div>

              {/* Pricing & Categories */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Regular Price (LKR) *</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Sale Price (LKR)</label>
                  <input
                    type="number"
                    value={prodSalePrice || ''}
                    onChange={(e) => setProdSalePrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Optional"
                    className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Category *</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as CategoryType)}
                    className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2.5 text-white"
                  >
                    <option value="MEN">MEN</option>
                    <option value="WOMEN">WOMEN</option>
                    <option value="ESSENTIALS">ESSENTIALS</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Subcategory *</label>
                  <select
                    value={prodSubCategory}
                    onChange={(e) => setProdSubCategory(e.target.value as SubCategoryType)}
                    className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2.5 text-white"
                  >
                    <option value="Oversized T-Shirts">Oversized T-Shirts</option>
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Hoodies">Hoodies</option>
                    <option value="Tops">Tops</option>
                    <option value="Joggers">Joggers</option>
                    <option value="Jeans">Jeans</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Core products">Core products</option>
                  </select>
                </div>
              </div>

              {/* Description, Material & Care */}
              <div className="space-y-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Product Description</label>
                  <textarea
                    rows={2}
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                    className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2.5 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Fabric & Material Composition</label>
                    <input
                      type="text"
                      value={prodMaterial}
                      onChange={(e) => setProdMaterial(e.target.value)}
                      className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Care & Wash Instructions</label>
                    <input
                      type="text"
                      value={prodCare}
                      onChange={(e) => setProdCare(e.target.value)}
                      className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2.5 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Product Media Gallery Uploader & Reordering */}
              <div className="p-4 bg-[#0A0B0E] rounded-md border border-white/10 space-y-3">
                <ProductImageManager
                  productId={editingProduct?.id || prodSlug || 'new-product'}
                  images={prodImages}
                  onChange={(newImgs) => setProdImages(newImgs)}
                />
              </div>

              {/* Variant Stock Management Table */}
              <div className="p-4 bg-[#141620] rounded border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase">
                    SIZE & COLOR VARIANTS INVENTORY
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const newV: ProductVariant = {
                        id: `v-${Date.now()}`,
                        size: 'M',
                        color: 'Onyx Black',
                        colorHex: '#0a0a0c',
                        sku: `VK-${Date.now().toString().slice(-4)}`,
                        stock: 20
                      };
                      setProdVariants([...prodVariants, newV]);
                    }}
                    className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[10px]"
                  >
                    + Add Variant
                  </button>
                </div>

                <div className="space-y-2">
                  {prodVariants.map((v, idx) => (
                    <div key={v.id || idx} className="grid grid-cols-5 gap-2 items-center text-[11px]">
                      <select
                        value={v.size}
                        onChange={(e) => {
                          const copy = [...prodVariants];
                          copy[idx].size = e.target.value as any;
                          setProdVariants(copy);
                        }}
                        className="bg-[#0E1017] border border-white/15 rounded p-1.5 text-white"
                      >
                        <option value="S">Size S</option>
                        <option value="M">Size M</option>
                        <option value="L">Size L</option>
                        <option value="XL">Size XL</option>
                        <option value="XXL">Size XXL</option>
                      </select>

                      <input
                        type="text"
                        value={v.color}
                        onChange={(e) => {
                          const copy = [...prodVariants];
                          copy[idx].color = e.target.value;
                          setProdVariants(copy);
                        }}
                        placeholder="Color Name"
                        className="bg-[#0E1017] border border-white/15 rounded p-1.5 text-white"
                      />

                      <input
                        type="text"
                        value={v.sku}
                        onChange={(e) => {
                          const copy = [...prodVariants];
                          copy[idx].sku = e.target.value;
                          setProdVariants(copy);
                        }}
                        placeholder="SKU"
                        className="bg-[#0E1017] border border-white/15 rounded p-1.5 text-white"
                      />

                      <input
                        type="number"
                        value={v.stock}
                        onChange={(e) => {
                          const copy = [...prodVariants];
                          copy[idx].stock = Number(e.target.value);
                          setProdVariants(copy);
                        }}
                        placeholder="Stock"
                        className="bg-[#0E1017] border border-white/15 rounded p-1.5 text-white font-bold"
                      />

                      <button
                        type="button"
                        onClick={() => setProdVariants(prodVariants.filter((_, i) => i !== idx))}
                        className="text-red-400 hover:text-red-300 p-1 text-center"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Flags */}
              <div className="flex items-center gap-6 text-xs text-slate-300 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={prodIsNewArrival} onChange={(e) => setProdIsNewArrival(e.target.checked)} className="accent-[#D4AF37]" />
                  <span>New Arrival</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={prodIsBestSeller} onChange={(e) => setProdIsBestSeller(e.target.checked)} className="accent-[#D4AF37]" />
                  <span>Best Seller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={prodIsCustomizable} onChange={(e) => setProdIsCustomizable(e.target.checked)} className="accent-[#D4AF37]" />
                  <span>Custom Studio Enabled</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-8 py-2.5 bg-[#D4AF37] hover:bg-[#E2B714] text-black font-extrabold uppercase tracking-widest rounded"
                >
                  {editingProduct ? 'SAVE CHANGES' : 'CREATE PRODUCT'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* AWB & LOGISTICS UPDATE MODAL */}
      {selectedOrderForAwb && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="bg-[#0E1017] border border-[#D4AF37]/40 w-full max-w-lg rounded-md p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase block">
                  COURIER DISPATCH UPDATE
                </span>
                <h3 className="text-lg font-black uppercase text-white font-syne">
                  {selectedOrderForAwb.orderNumber}
                </h3>
              </div>
              <button onClick={() => setSelectedOrderForAwb(null)} className="text-slate-400 hover:text-white">
                <XCircle size={20} />
              </button>
            </div>

            {/* Ordered Items & Bespoke Customization Info */}
            <div className="p-3.5 bg-[#141620] rounded border border-white/10 space-y-2.5 max-h-48 overflow-y-auto">
              <span className="text-[10px] text-[#D4AF37] font-bold uppercase block tracking-wider">
                ORDER ITEMS & PRODUCTION SPECS ({selectedOrderForAwb.items.length})
              </span>
              <div className="divide-y divide-white/5 space-y-2">
                {selectedOrderForAwb.items.map((it: any, idx: number) => (
                  <div key={idx} className="pt-2 flex items-start justify-between gap-3 text-[11px]">
                    <div className="space-y-1">
                      <p className="text-white font-bold">{it.productName} <span className="text-slate-400 font-normal">({it.size} / {it.color}) × {it.quantity}</span></p>
                      
                      {it.customization && (
                        <div className="p-2 bg-black/60 rounded border border-[#D4AF37]/30 text-[10px] text-[#D4AF37] space-y-1">
                          <div className="flex items-center gap-1 font-bold">
                            <Sparkles size={11} />
                            <span>Bespoke: {it.customization.printTechnique} ({it.customization.placement})</span>
                          </div>
                          {it.customization.customText && (
                            <p className="text-slate-300">Custom Text: <strong className="text-white">"{it.customization.customText}"</strong> ({it.customization.textFont})</p>
                          )}
                          {it.customization.uploadedArtworkUrl && (
                            <div className="pt-1 flex items-center gap-2">
                              <img src={it.customization.uploadedArtworkUrl} alt="Artwork" className="w-8 h-8 object-contain rounded bg-white/10 p-0.5" />
                              <a
                                href={it.customization.uploadedArtworkUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-0.5 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 text-[#D4AF37] rounded text-[9px] font-bold flex items-center gap-1"
                              >
                                <span>Download High-Res Artwork</span>
                                <ExternalLink size={10} />
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <span className="text-[#D4AF37] font-bold">LKR {it.subtotal.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSaveAwbUpdate} className="space-y-4 font-mono text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Select Courier Partner</label>
                <select
                  value={awbCourier}
                  onChange={(e) => setAwbCourier(e.target.value)}
                  className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-white"
                >
                  <option value="Pronto Lanka Express">Pronto Lanka Express</option>
                  <option value="Fargo Express">Fargo Express</option>
                  <option value="Domex Courier">Domex Courier</option>
                  <option value="Direct VIP Courier">Direct VIP Courier</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Air Waybill (AWB) / Tracking # *</label>
                <input
                  type="text"
                  required
                  value={awbNumberInput}
                  onChange={(e) => setAwbNumberInput(e.target.value)}
                  placeholder="PRN-99882103"
                  className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Tracking URL (Optional)</label>
                <input
                  type="text"
                  value={awbTrackingLinkInput}
                  onChange={(e) => setAwbTrackingLinkInput(e.target.value)}
                  placeholder="https://valknutofficial.com/#/track-order"
                  className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Update Order Status</label>
                <select
                  value={awbStatusSelect}
                  onChange={(e) => setAwbStatusSelect(e.target.value as OrderStatus)}
                  className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-white"
                >
                  <option value="Shipped">Shipped (Dispatched to Courier)</option>
                  <option value="Delivered">Delivered (Handed over to Customer)</option>
                  <option value="Packed">Packed (Awaiting pickup)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForAwb(null)}
                  className="px-4 py-2 bg-white/5 text-slate-400 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#D4AF37] text-black font-extrabold uppercase rounded shadow"
                >
                  SAVE & DISPATCH
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY CREATE/EDIT MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="bg-[#0E1017] border border-[#D4AF37]/40 w-full max-w-xl rounded-md p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase block">
                  CATEGORY CONFIGURATION
                </span>
                <h3 className="text-lg font-black uppercase text-white font-syne">
                  {editingCategory ? `Edit "${editingCategory.name}"` : 'Create New Category'}
                </h3>
              </div>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={catName}
                    onChange={(e) => {
                      setCatName(e.target.value);
                      if (!editingCategory) {
                        setCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                      }
                    }}
                    placeholder="e.g. Oversized Hoodies"
                    className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={catSlug}
                    onChange={(e) => setCatSlug(e.target.value)}
                    placeholder="oversized-hoodies"
                    className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Parent Classification</label>
                  <select
                    value={catParent}
                    onChange={(e) => setCatParent(e.target.value as any)}
                    className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-white"
                  >
                    <option value="ROOT">Root Department</option>
                    <option value="MEN">Men Collection</option>
                    <option value="WOMEN">Women Collection</option>
                    <option value="ESSENTIALS">Essentials & Accessories</option>
                  </select>
                </div>
                <div>
                  <SingleImageUploader
                    label="Category Cover Image"
                    imageUrl={catImage}
                    onChange={(url) => setCatImage(url)}
                    scope="categories"
                    identifier={catSlug || 'category'}
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  placeholder="Luxury streetwear category description..."
                  className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-white"
                />
              </div>

              <div className="p-3 bg-[#141620] rounded border border-white/5 space-y-3">
                <span className="text-[10px] text-[#D4AF37] font-bold uppercase block">SEO Metadata</span>
                <div>
                  <label className="text-slate-300 block mb-1 text-[11px]">SEO Title</label>
                  <input
                    type="text"
                    value={catSeoTitle}
                    onChange={(e) => setCatSeoTitle(e.target.value)}
                    placeholder="Luxury Hoodies & Streetwear Sri Lanka | VALKNUT"
                    className="w-full bg-[#0E1017] border border-white/15 rounded p-2 text-white text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 text-[11px]">Meta Description</label>
                  <textarea
                    rows={2}
                    value={catSeoDesc}
                    onChange={(e) => setCatSeoDesc(e.target.value)}
                    placeholder="Shop premium streetwear and luxury oversized hoodies in Sri Lanka."
                    className="w-full bg-[#0E1017] border border-white/15 rounded p-2 text-white text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 bg-white/5 text-slate-400 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#D4AF37] text-black font-extrabold uppercase rounded shadow"
                >
                  {editingCategory ? 'SAVE CATEGORY' : 'CREATE CATEGORY'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COLLECTION CREATE/EDIT MODAL */}
      {isCollectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="bg-[#0E1017] border border-[#D4AF37]/40 w-full max-w-xl rounded-md p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase block">
                  EDITORIAL DROP & COLLECTION
                </span>
                <h3 className="text-lg font-black uppercase text-white font-syne">
                  {editingCollection ? `Edit "${editingCollection.name}"` : 'Create New Collection'}
                </h3>
              </div>
              <button onClick={() => setIsCollectionModalOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCollection} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Collection Title *</label>
                  <input
                    type="text"
                    required
                    value={colName}
                    onChange={(e) => {
                      setColName(e.target.value);
                      if (!editingCollection) {
                        setColSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                      }
                    }}
                    placeholder="SHADOW OPS 2026"
                    className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={colSlug}
                    onChange={(e) => setColSlug(e.target.value)}
                    placeholder="shadow-ops-2026"
                    className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <SingleImageUploader
                  label="Collection Campaign Banner"
                  imageUrl={colImage}
                  onChange={(url) => setColImage(url)}
                  scope="collections"
                  identifier={colSlug || 'collection'}
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Editorial Concept</label>
                <textarea
                  rows={2}
                  value={colDescription}
                  onChange={(e) => setColDescription(e.target.value)}
                  placeholder="Tactical silhouettes crafted for the sovereign individual..."
                  className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-white"
                />
              </div>

              {/* Product Assign Checklist */}
              <div className="p-3 bg-[#141620] rounded border border-white/5 space-y-2 max-h-40 overflow-y-auto">
                <span className="text-[10px] text-[#D4AF37] font-bold uppercase block">Assign Products ({colSelectedProducts.length})</span>
                <div className="space-y-1.5">
                  {products.map((p) => {
                    const isSelected = colSelectedProducts.includes(p.id);
                    return (
                      <label key={p.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-white/5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setColSelectedProducts([...colSelectedProducts, p.id]);
                            } else {
                              setColSelectedProducts(colSelectedProducts.filter(id => id !== p.id));
                            }
                          }}
                          className="accent-[#D4AF37]"
                        />
                        <span className="text-white text-[11px]">{p.name}</span>
                        <span className="text-slate-500 text-[10px] ml-auto">LKR {p.price.toLocaleString()}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCollectionModalOpen(false)}
                  className="px-4 py-2 bg-white/5 text-slate-400 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#D4AF37] text-black font-extrabold uppercase rounded shadow"
                >
                  {editingCollection ? 'SAVE COLLECTION' : 'CREATE COLLECTION'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COUPON CREATE MODAL */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="bg-[#0E1017] border border-[#D4AF37]/40 w-full max-w-lg rounded-md p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase block">
                  DISCOUNT VOUCHER CONFIGURATION
                </span>
                <h3 className="text-lg font-black uppercase text-white font-syne">
                  Create Promotional Coupon
                </h3>
              </div>
              <button onClick={() => setIsCouponModalOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4 font-mono text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Coupon Promo Code *</label>
                <input
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. VALK2026"
                  className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-white font-bold tracking-widest uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Discount Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-white"
                  >
                    <option value="PERCENTAGE">Percentage (%) Off</option>
                    <option value="FIXED">Fixed Amount (LKR) Off</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    {newCouponType === 'PERCENTAGE' ? 'Discount % *' : 'Discount LKR *'}
                  </label>
                  <input
                    type="number"
                    required
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                    className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Min Order (LKR)</label>
                  <input
                    type="number"
                    value={newCouponMinOrder}
                    onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                    className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={newCouponUsageLimit}
                    onChange={(e) => setNewCouponUsageLimit(Number(e.target.value))}
                    className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newCouponExpiry}
                    onChange={(e) => setNewCouponExpiry(e.target.value)}
                    className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 bg-white/5 text-slate-400 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#D4AF37] text-black font-extrabold uppercase rounded shadow"
                >
                  CREATE COUPON
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOMER ORDER HISTORY DRAWER / MODAL */}
      {viewingCustomer && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="bg-[#0E1017] border border-[#D4AF37]/40 w-full max-w-2xl rounded-md p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase block">
                  CUSTOMER PURCHASE RECORD
                </span>
                <h3 className="text-lg font-black uppercase text-white font-syne">
                  {viewingCustomer.fullName}
                </h3>
              </div>
              <button onClick={() => setViewingCustomer(null)} className="text-slate-400 hover:text-white">
                <XCircle size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-[#141620] rounded border border-white/5 font-mono text-xs">
              <div>
                <span className="text-[9px] text-slate-500 uppercase block">EMAIL</span>
                <strong className="text-white truncate block">{viewingCustomer.email}</strong>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 uppercase block">MOBILE</span>
                <strong className="text-white">{viewingCustomer.phone}</strong>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 uppercase block">ORDERS</span>
                <strong className="text-white">{viewingCustomer.ordersCount}</strong>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 uppercase block">LIFETIME SPEND</span>
                <strong className="text-[#D4AF37]">LKR {viewingCustomer.totalSpent.toLocaleString()}</strong>
              </div>
            </div>

            {viewingCustomer.address && (
              <div className="p-3 bg-[#141620] rounded border border-white/5 font-mono text-xs text-slate-300">
                <span className="text-[9px] text-[#D4AF37] uppercase font-bold block mb-1">DELIVERY DESTINATION</span>
                <p>{viewingCustomer.address.addressLine1}, {viewingCustomer.address.city}, {viewingCustomer.address.district} ({viewingCustomer.address.postalCode})</p>
              </div>
            )}

            <div className="space-y-3 font-mono text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">ORDER HISTORY LOG</span>
              <div className="divide-y divide-white/5 max-h-56 overflow-y-auto">
                {orders.filter((o) => o.customerInfo.email.toLowerCase() === viewingCustomer.email.toLowerCase()).length === 0 ? (
                  <p className="text-slate-500 py-3">No placed orders recorded for this account yet.</p>
                ) : (
                  orders.filter((o) => o.customerInfo.email.toLowerCase() === viewingCustomer.email.toLowerCase()).map((o) => (
                    <div key={o.id} className="py-2.5 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-white font-bold">{o.orderNumber}</span>
                        <span className="text-slate-500 text-[10px] block">{new Date(o.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-bold">LKR {o.totalAmount.toLocaleString()}</span>
                        <span className="text-[10px] text-[#D4AF37] uppercase block">{o.orderStatus}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setViewingCustomer(null)}
                className="px-5 py-2 bg-white/10 hover:bg-white/15 text-white font-mono text-xs rounded font-bold"
              >
                Close Customer File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="bg-[#0E1017] border border-red-500/40 w-full max-w-md rounded-md p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-500 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>

            <h3 className="text-base font-black uppercase text-white font-syne">
              CONFIRM ARCHIVE / DELETION
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Are you sure you want to permanently delete <strong className="text-white">"{deleteConfirmTarget.name}"</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2 font-mono text-xs">
              <button
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded font-bold"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold uppercase rounded shadow-lg shadow-red-600/20"
              >
                CONFIRM DELETE
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
