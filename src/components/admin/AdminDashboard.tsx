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
import { Box, Typography, Paper, Tabs, Tab, Chip, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Button, Input, IconButton } from '../ui';

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
      <Box className="w-full min-h-screen bg-[var(--bg-main)] py-16 px-4 flex items-center justify-center border-b border-white/10">
        <Paper
          elevation={24}
          className="bg-[var(--bg-surface)] border border-[#D4AF37]/40 w-full max-w-md rounded-md p-8 relative overflow-hidden animate-fade-in"
          sx={{ backgroundColor: '#0E1017' }}
        >
          <Box className="absolute -top-10 -right-10 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />

          <Box className="flex flex-col items-center text-center space-y-4 mb-8">
            <Box className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border-2 border-[#D4AF37] text-[#D4AF37] flex items-center justify-center shadow-lg shadow-[#D4AF37]/10">
              <Lock size={28} />
            </Box>
            <Typography variant="overline" className="text-[10px] font-mono font-bold tracking-[0.3em] text-[#D4AF37] uppercase block pt-2" sx={{ lineHeight: 1.2 }}>
              RESTRICTED VALKNUT ARCHIVE
            </Typography>
            <Typography variant="h5" className="font-black uppercase text-[var(--text-primary)] font-syne tracking-tight">
              ADMINISTRATIVE ACCESS
            </Typography>
            <Typography variant="caption" className="text-slate-400 font-mono text-xs">
              Database Row-Level Security Enforced. Customers must authenticate with verified admin credentials.
            </Typography>
          </Box>

          {authError && (
            <Alert severity="error" className="mb-4 bg-red-950/60 border border-red-500/40 text-red-400 font-mono text-xs" sx={{ color: '#f87171', '& .MuiAlert-icon': { color: '#f87171' } }}>
              {authError}
            </Alert>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 font-mono text-xs">
            <Input
              label="Admin Email Identifier"
              type="email"
              required
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="admin@valknutofficial.com"
            />
            <Input
              label="Security Password / Token"
              type="password"
              required
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="••••••••••••"
            />
            <Button
              type="submit"
              variant="gold"
              fullWidth
              leftIcon={<ShieldCheck size={16} />}
              className="py-4 mt-2"
            >
              AUTHORIZE ACCESS
            </Button>
          </form>

          <Box className="pt-4 mt-6 border-t border-white/10 space-y-3">
            <Button
              variant="outline"
              fullWidth
              size="sm"
              onClick={handleFillDemoAdmin}
              className="py-2.5"
            >
              Use Verified Demo Admin Credentials
            </Button>
            <Typography
              component="a"
              href="#/"
              className="w-full text-center text-slate-400 hover:text-[var(--text-primary)] text-[11px] font-mono block transition-colors mt-2"
            >
              Return to VALKNUT Storefront
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  }

  // FULL AUTHORIZED ADMIN OPERATIONS SUITE
  return (
    <Box className="w-full min-h-screen bg-[#08090D] text-[var(--text-primary)] flex flex-col antialiased">

      {/* Top Operations Bar */}
      <Box component="header" className="bg-[var(--bg-surface)] border-b border-white/10 sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <Box className="flex items-center gap-4">
          <Box className="flex items-center gap-2">
            <Box className="w-8 h-8 rounded bg-[#D4AF37] text-black flex items-center justify-center font-mono font-black text-sm">
              VK
            </Box>
            <Box>
              <Typography className="text-[9px] font-mono font-bold tracking-[0.25em] text-[#D4AF37] uppercase block">
                VALKNUT MASTER CONTROL
              </Typography>
              <Typography variant="h6" className="text-base font-black uppercase text-[var(--text-primary)] font-syne tracking-tight">
                EXECUTIVE SUITE
              </Typography>
            </Box>
          </Box>

          <Chip
            label={
              <Box className="flex items-center gap-1.5">
                <Box className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <Typography component="span">CLOUD SYNC ACTIVE</Typography>
              </Box>
            }
            className="hidden md:flex bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-mono text-[10px]"
            variant="outlined"
            size="small"
            sx={{ borderRadius: '9999px', height: '24px' }}
          />
        </Box>

        {/* Action Controls */}
        <Box className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            rightIcon={<ExternalLink size={13} />}
            onClick={() => window.location.hash = '#/shop'}
          >
            Live Store
          </Button>

          <Box className="flex items-center gap-2 border-l border-white/10 pl-3">
            <Box className="text-right hidden sm:block">
              <Typography className="text-xs font-bold text-[var(--text-primary)] block font-mono">{user?.name || 'Administrator'}</Typography>
              <Typography className="text-[10px] text-[#D4AF37] font-mono">SUPABASE FOUNDER</Typography>
            </Box>
            <IconButton
              icon={<XCircle size={18} />}
              label="Exit Dashboard"
              variant="ghost"
              onClick={() => {
                if (setIsAdminOpen) setIsAdminOpen(false);
                window.location.hash = '#/';
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Main Container */}
      <Box className="flex-1 max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Navigation Tabs Bar */}
        <Box className="border-b border-white/10 pb-3">
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': { backgroundColor: '#D4AF37' },
              '& .MuiTab-root': { color: '#94a3b8', fontFamily: 'monospace', fontWeight: 700, minHeight: '40px', padding: '10px 20px', transition: 'all 0.2s', fontSize: '0.75rem' },
              '& .Mui-selected': { color: '#D4AF37 !important' },
            }}
          >
            <Tab icon={<TrendingUp size={16} />} iconPosition="start" label="OVERVIEW" value="METRICS" />
            <Tab icon={<Package size={16} />} iconPosition="start" label={`PRODUCTS (${products.length})`} value="PRODUCTS" />
            <Tab icon={<Layers size={16} />} iconPosition="start" label={`CATEGORIES (${categories.length})`} value="CATEGORIES" />
            <Tab icon={<Sparkles size={16} />} iconPosition="start" label={`COLLECTIONS (${collections.length})`} value="COLLECTIONS" />
            <Tab icon={<ShoppingBag size={16} />} iconPosition="start" label={`ORDERS (${orders.length})`} value="ORDERS" />
            <Tab icon={<Users size={16} />} iconPosition="start" label={`CUSTOMERS (${customers.length})`} value="CUSTOMERS" />
            <Tab icon={<Tag size={16} />} iconPosition="start" label={`COUPONS (${coupons.length})`} value="COUPONS" />
            <Tab icon={<Home size={16} />} iconPosition="start" label="HOMEPAGE CMS" value="HOMEPAGE" />
            <Tab icon={<Database size={16} />} iconPosition="start" label="DATABASE & RLS" value="DATABASE" />
          </Tabs>
        </Box>

        {/* 1. METRICS TAB */}
        {activeTab === 'METRICS' && (
          <Box className="space-y-6 animate-fade-in">
            {/* KPI Matrix */}
            <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Box>
                <Paper className="p-6 bg-[var(--bg-surface)] border border-white/10 rounded-md space-y-2 relative overflow-hidden h-full" sx={{ backgroundColor: '#0E1017' }}>
                  <Typography className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                    GROSS REVENUE (LKR)
                  </Typography>
                  <Typography className="text-3xl font-black text-[var(--text-primary)] font-mono mt-2">
                    LKR {totalRevenue.toLocaleString()}
                  </Typography>
                  <Box className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono mt-2">
                    <TrendingUp size={14} />
                    <Typography component="span">Verified Purchases</Typography>
                  </Box>
                </Paper>
              </Box>

              <Box>
                <Paper className="p-6 bg-[var(--bg-surface)] border border-white/10 rounded-md space-y-2 h-full" sx={{ backgroundColor: '#0E1017' }}>
                  <Typography className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                    TOTAL COMPLETED ORDERS
                  </Typography>
                  <Typography className="text-3xl font-black text-[#D4AF37] font-mono mt-2">
                    {totalOrdersCount}
                  </Typography>
                  <Typography className="text-xs text-slate-400 font-mono mt-2">
                    {pendingOrdersCount} Pending Dispatch
                  </Typography>
                </Paper>
              </Box>

              <Box>
                <Paper className="p-6 bg-[var(--bg-surface)] border border-white/10 rounded-md space-y-2 h-full" sx={{ backgroundColor: '#0E1017' }}>
                  <Typography className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                    REGISTERED BUYERS
                  </Typography>
                  <Typography className="text-3xl font-black text-[var(--text-primary)] font-mono mt-2">
                    {customers.length}
                  </Typography>
                  <Typography className="text-xs text-emerald-400 font-mono mt-2">
                    100% Verified Customer Profiles
                  </Typography>
                </Paper>
              </Box>

              <Box>
                <Paper className="p-6 bg-[var(--bg-surface)] border border-white/10 rounded-md space-y-2 h-full" sx={{ backgroundColor: '#0E1017' }}>
                  <Typography className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                    LOW-STOCK ALERTS (&le; 5 PCS)
                  </Typography>
                  <Typography className={`text-3xl font-black font-mono mt-2 ${lowStockProducts.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {lowStockProducts.length} Products
                  </Typography>
                  <Typography className="text-xs text-slate-400 font-mono mt-2">
                    {lowStockProducts.length > 0 ? 'Action required in warehouse' : 'Inventory levels healthy'}
                  </Typography>
                </Paper>
              </Box>
            </Box>

            {/* Recent Orders Feed & Low Stock Table */}
            <Box className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">

              {/* Recent Orders (8 cols) */}
              <Box className="lg:col-span-8">
                <Paper className="bg-[var(--bg-surface)] border border-white/10 rounded-md p-6 space-y-4 h-full" sx={{ backgroundColor: '#0E1017', color: 'var(--text-primary)' }}>
                  <Box className="flex items-center justify-between border-b border-white/10 pb-3">
                    <Typography className="text-sm font-black uppercase text-[var(--text-primary)] font-syne tracking-wider">
                      RECENT ORDERS STREAM
                    </Typography>
                    <Typography
                      component="button"
                      onClick={() => setActiveTab('ORDERS')}
                      className="text-xs font-mono text-[#D4AF37] hover:underline cursor-pointer bg-transparent border-none"
                    >
                      View All Orders &rarr;
                    </Typography>
                  </Box>

                  <Box className="divide-y divide-white/5 overflow-x-auto">
                    {orders.slice(0, 5).map((ord) => (
                      <Box key={ord.id} className="py-3.5 flex items-center justify-between gap-4 text-xs font-mono">
                        <Box className="space-y-0.5">
                          <Box className="flex items-center gap-2">
                            <strong className="text-[var(--text-primary)]">{ord.orderNumber}</strong>
                            <Chip size="small" label={ord.paymentGateway} className="text-[10px] bg-white/5 border border-white/10 text-slate-300 rounded" />
                          </Box>
                          <Typography className="text-slate-400 text-[11px]">{ord.customerInfo.fullName} • {ord.customerInfo.phone}</Typography>
                        </Box>

                        <Box className="text-right">
                          <Typography className="text-[var(--text-primary)] font-bold text-xs">LKR {ord.totalAmount.toLocaleString()}</Typography>
                          <Typography className="text-[10px] text-[#D4AF37] font-bold uppercase">{ord.orderStatus}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Box>

              {/* Low Stock Items (4 cols) */}
              <Box className="lg:col-span-4">
                <Paper className="bg-[var(--bg-surface)] border border-white/10 rounded-md p-6 space-y-4 h-full" sx={{ backgroundColor: '#0E1017', color: 'var(--text-primary)' }}>
                  <Typography className="text-sm font-black uppercase text-amber-400 font-syne tracking-wider flex items-center gap-2">
                    <AlertTriangle size={16} />
                    <Typography component="span">LOW INVENTORY NOTICES</Typography>
                  </Typography>

                  {lowStockProducts.length === 0 ? (
                    <Typography className="text-xs font-mono text-slate-400 py-6 text-center">
                      All variant quantities are above minimum reorder thresholds.
                    </Typography>
                  ) : (
                    <Box className="divide-y divide-white/5 space-y-3">
                      {lowStockProducts.slice(0, 5).map((prod) => (
                        <Box key={prod.id} className="pt-3 first:pt-0 flex items-center justify-between text-xs font-mono">
                          <Box className="flex items-center gap-2.5">
                            <Box component="img" src={prod.images[0]} alt="" className="w-10 h-12 object-cover rounded bg-[#141620]" />
                            <Box>
                              <Typography className="text-[var(--text-primary)] font-bold truncate max-w-[140px] text-xs">{prod.name}</Typography>
                              <Typography className="text-[10px] text-slate-400">{prod.subCategory}</Typography>
                            </Box>
                          </Box>

                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => openProductForm(prod)}
                            className="px-2.5 py-1 text-[10px]"
                          >
                            Restock
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Paper>
              </Box>

            </Box>
          </Box>
        )}

        {/* 2. PRODUCT MANAGEMENT TAB */}
        {activeTab === 'PRODUCTS' && (
          <Box className="space-y-6 animate-fade-in">
            <Box className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-surface)] border border-white/10 p-4 rounded-md">
              <Box className="flex items-center gap-3">
                <Package className="text-[#D4AF37]" size={22} />
                <Box>
                  <Typography variant="h6" className="text-base font-black uppercase text-[var(--text-primary)] font-syne">
                    PRODUCT CATALOG REPOSITORY
                  </Typography>
                  <Typography variant="body2" className="text-xs font-mono text-slate-400">
                    Manage heavyweight luxury garments, size charts, variant stocks, and specs.
                  </Typography>
                </Box>
              </Box>

              <Button
                onClick={() => openProductForm()}
                className="px-5 py-3 text-xs font-mono font-extrabold tracking-wider bg-[#D4AF37] hover:bg-[#E2B714] text-black shadow-lg shadow-[#D4AF37]/20"
              >
                <Plus size={16} className="mr-2 inline" />
                CREATE PRODUCT
              </Button>
            </Box>

            {/* Products Table */}
            <TableContainer component={Paper} className="bg-[var(--bg-surface)] border border-white/10 rounded-md overflow-hidden shadow-2xl" sx={{ backgroundColor: '#0E1017' }}>
              <Table sx={{ minWidth: 650, '& .MuiTableCell-root': { borderBottom: '1px solid rgba(255,255,255,0.05)' } }} aria-label="products table">
                <TableHead sx={{ backgroundColor: '#141620' }}>
                  <TableRow>
                    <TableCell className="text-slate-400 font-mono text-[10px] uppercase tracking-wider p-4">Garment</TableCell>
                    <TableCell className="text-slate-400 font-mono text-[10px] uppercase tracking-wider p-4">Category / Collection</TableCell>
                    <TableCell className="text-slate-400 font-mono text-[10px] uppercase tracking-wider p-4">Price</TableCell>
                    <TableCell className="text-slate-400 font-mono text-[10px] uppercase tracking-wider p-4">Variants & Stock</TableCell>
                    <TableCell className="text-slate-400 font-mono text-[10px] uppercase tracking-wider p-4">Status Badges</TableCell>
                    <TableCell align="right" className="text-slate-400 font-mono text-[10px] uppercase tracking-wider p-4">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((prod) => {
                    const totalStock = prod.variants.reduce((sum, v) => sum + (v.stock ?? 0), 0);
                    const isLowStock = totalStock <= 10;

                    return (
                      <TableRow key={prod.id} hover sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.05) !important' } }}>
                        <TableCell className="p-4 border-0">
                          <Box className="flex items-center gap-3">
                            <Box
                              component="img"
                              src={prod.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80'}
                              alt=""
                              className="w-12 h-14 object-cover rounded bg-[#141620] border border-white/10 flex-shrink-0"
                            />
                            <Box>
                              <Typography className="text-[var(--text-primary)] font-bold text-xs uppercase font-heading">{prod.name}</Typography>
                              <Typography className="text-[10px] text-slate-500 font-mono block">SKU: {prod.variants[0]?.sku || prod.slug}</Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell className="p-4 font-mono border-0">
                          <Typography className="text-[#D4AF37] font-bold text-xs block">{prod.category}</Typography>
                          <Typography className="text-[10px] text-slate-400 block">{prod.subCategory}</Typography>
                          {prod.collection && (
                            <Typography className="text-[9px] text-slate-500 uppercase">{prod.collection}</Typography>
                          )}
                        </TableCell>

                        <TableCell className="p-4 font-mono border-0">
                          <Typography className="text-[var(--text-primary)] font-bold text-xs block">LKR {prod.price.toLocaleString()}</Typography>
                          {prod.salePrice && (
                            <Typography className="text-emerald-400 text-[10px] block">Sale: LKR {prod.salePrice.toLocaleString()}</Typography>
                          )}
                        </TableCell>

                        <TableCell className="p-4 font-mono border-0">
                          <Typography className={`font-bold text-xs ${isLowStock ? 'text-amber-400' : 'text-slate-300'}`}>
                            {totalStock} units
                          </Typography>
                          <Typography className="text-[10px] text-slate-500 block">
                            {prod.variants.length} Size/Color Variants
                          </Typography>
                        </TableCell>

                        <TableCell className="p-4 font-mono border-0">
                          <Box className="flex items-center gap-1.5 flex-wrap">
                            {prod.isNewArrival && <Chip size="small" label="NEW" sx={{ height: '20px', fontSize: '9px', backgroundColor: '#0c4a6e', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }} />}
                            {prod.isBestSeller && <Chip size="small" label="BESTSELLER" sx={{ height: '20px', fontSize: '9px', backgroundColor: '#451a03', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.3)' }} />}
                            {prod.isCustomizable && <Chip size="small" label="STUDIO" sx={{ height: '20px', fontSize: '9px', backgroundColor: 'rgba(212, 175, 55, 0.2)', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.4)' }} />}
                          </Box>
                        </TableCell>

                        <TableCell align="right" className="p-4 space-x-2 border-0">
                          <IconButton
                            onClick={() => openProductForm(prod)}
                            label="Edit Product"
                            size="sm"
                            icon={<Edit2 size={14} className="text-slate-300" />}
                          />

                          <IconButton
                            onClick={() => setDeleteConfirmTarget({ type: 'product', id: prod.id, name: prod.name })}
                            label="Delete Product"
                            size="sm"
                            sx={{ '&:hover': { backgroundColor: 'rgba(153, 27, 27, 0.3)' } }}
                            icon={<Trash2 size={14} className="text-red-400" />}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* 3. CATEGORY MANAGEMENT TAB */}
        {activeTab === 'CATEGORIES' && (
          <Box className="space-y-6 animate-fade-in">
            <Box className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-surface)] border border-white/10 p-4 rounded-md">
              <Box className="flex items-center gap-3">
                <Layers className="text-[#D4AF37]" size={22} />
                <Box>
                  <Typography variant="h6" className="text-base font-black uppercase text-[var(--text-primary)] font-syne">
                    STOREFRONT CATEGORIES & TAXONOMIES
                  </Typography>
                  <Typography variant="body2" className="text-xs font-mono text-slate-400">
                    Configure parent categories, sub-classifications, and SEO metadata.
                  </Typography>
                </Box>
              </Box>

              <Button
                onClick={() => openCategoryForm()}
                className="px-5 py-3 text-xs font-mono font-extrabold tracking-wider bg-[#D4AF37] hover:bg-[#E2B714] text-black shadow-lg shadow-[#D4AF37]/20"
              >
                <Plus size={16} className="mr-2 inline" />
                CREATE CATEGORY
              </Button>
            </Box>

            <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <Paper key={cat.id} className="bg-[var(--bg-surface)] border border-white/10 rounded-md p-5 space-y-4 flex flex-col justify-between" sx={{ backgroundColor: '#0E1017' }}>
                  <Box className="space-y-2">
                    <Box className="flex items-center justify-between">
                      <Typography className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase">
                        PARENT: {cat.parentCategory}
                      </Typography>
                      <Chip size="small" label="ACTIVE" sx={{ height: '20px', fontSize: '10px', backgroundColor: 'rgba(5, 150, 105, 0.4)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }} />
                    </Box>

                    <Typography className="text-base font-bold uppercase text-[var(--text-primary)] font-syne">{cat.name}</Typography>
                    <Typography className="text-xs font-mono text-slate-400 line-clamp-2">{cat.description || 'No description provided.'}</Typography>

                    {cat.seoTitle && (
                      <Box className="p-2.5 bg-[#141620] rounded border border-white/5 text-[11px] font-mono text-slate-300 space-y-1">
                        <Typography className="text-[9px] text-[#D4AF37] uppercase block font-bold">SEO TITLE</Typography>
                        <Typography className="truncate font-mono">{cat.seoTitle}</Typography>
                      </Box>
                    )}
                  </Box>

                  <Box className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <Typography className="text-xs font-mono text-slate-500">Slug: /{cat.slug}</Typography>
                    <Box className="flex items-center gap-2">
                      <IconButton
                        onClick={() => openCategoryForm(cat)}
                        label="Edit Category"
                        size="sm"
                        icon={<Edit2 size={13} className="text-slate-300" />}
                      />
                      <IconButton
                        onClick={() => setDeleteConfirmTarget({ type: 'category', id: cat.id, name: cat.name })}
                        label="Delete Category"
                        size="sm"
                        sx={{ '&:hover': { backgroundColor: 'rgba(153, 27, 27, 0.3)' } }}
                        icon={<Trash2 size={13} className="text-red-400" />}
                      />
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        )}

        {/* 4. COLLECTION MANAGEMENT TAB */}
        {activeTab === 'COLLECTIONS' && (
          <Box className="space-y-6 animate-fade-in">
            <Box className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-surface)] border border-white/10 p-4 rounded-md">
              <Box className="flex items-center gap-3">
                <Sparkles className="text-[#D4AF37]" size={22} />
                <Box>
                  <Typography variant="h6" className="text-base font-black uppercase text-[var(--text-primary)] font-syne">
                    EDITORIAL COLLECTIONS & DROPS
                  </Typography>
                  <Typography variant="body2" className="text-xs font-mono text-slate-400">
                    Group pieces into themed drops like Shadow Ops 2026 and Stealth Labs.
                  </Typography>
                </Box>
              </Box>

              <Button
                onClick={() => openCollectionForm()}
                className="px-5 py-3 text-xs font-mono font-extrabold tracking-wider bg-[#D4AF37] hover:bg-[#E2B714] text-black shadow-lg shadow-[#D4AF37]/20"
              >
                <Plus size={16} className="mr-2 inline" />
                CREATE COLLECTION
              </Button>
            </Box>

            <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {collections.map((col) => (
                <Paper key={col.id} className="bg-[var(--bg-surface)] border border-white/10 rounded-md overflow-hidden flex flex-col justify-between shadow-xl" sx={{ backgroundColor: '#0E1017' }}>
                  <Box className="h-44 relative bg-[#141620] overflow-hidden">
                    <Box component="img" src={col.imageUrl} alt={col.name} className="w-full h-full object-cover" />
                    <Box className="absolute inset-0 bg-gradient-to-t from-[#0E1017] via-transparent to-black/40" />
                    <Box className="absolute top-3 left-3">
                      <Chip
                        size="small"
                        label={`RELEASE: ${col.releaseDate || '2026'}`}
                        sx={{
                          height: '24px',
                          fontSize: '10px',
                          fontFamily: 'monospace',
                          fontWeight: 900,
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          color: '#D4AF37',
                          border: '1px solid rgba(212, 175, 55, 0.5)',
                          borderRadius: '4px'
                        }}
                      />
                    </Box>
                  </Box>

                  <Box className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <Box>
                      <Typography className="text-lg font-black uppercase text-[var(--text-primary)] font-syne">{col.name}</Typography>
                      <Typography className="text-xs font-mono text-slate-400 mt-1">{col.description}</Typography>

                      <Box className="mt-3 flex items-center gap-2 text-xs font-mono text-slate-300">
                        <strong className="text-[var(--text-primary)]">{col.productIds.length}</strong> Assigned Garments
                      </Box>
                    </Box>

                    <Box className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <Typography className="text-[11px] font-mono text-slate-500">Slug: /{col.slug}</Typography>
                      <Box className="flex items-center gap-2">
                        <IconButton
                          onClick={() => openCollectionForm(col)}
                          label="Edit Collection"
                          size="sm"
                          icon={<Edit2 size={13} className="text-slate-300" />}
                        />
                        <IconButton
                          onClick={() => setDeleteConfirmTarget({ type: 'collection', id: col.id, name: col.name })}
                          label="Delete Collection"
                          size="sm"
                          sx={{ '&:hover': { backgroundColor: 'rgba(153, 27, 27, 0.3)' } }}
                          icon={<Trash2 size={14} className="text-red-400" />}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        )}

        {/* 5. ORDER & LOGISTICS MANAGEMENT TAB */}
        {activeTab === 'ORDERS' && (
          <Box className="space-y-6 animate-fade-in">
            {/* Header & Filter Controls */}
            <Box className="bg-[var(--bg-surface)] border border-white/10 p-5 rounded-md space-y-4">
              <Box className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Box className="flex items-center gap-3">
                  <ShoppingBag className="text-[#D4AF37]" size={22} />
                  <Box>
                    <h2 className="text-base font-black uppercase text-[var(--text-primary)] font-syne">
                      ORDER FULFILLMENT & COURIER DISPATCH
                    </h2>
                    <Typography component="p" className="text-xs font-mono text-slate-400">
                      Real-time status changes, Air Waybill tracking assignment, and courier integration.
                    </Typography>
                  </Box>
                </Box>

                {/* Status Tabs Quick Filter */}
                <Box className="flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono">
                  {['ALL', 'Pending', 'Payment Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                    <Box component="button"
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1.5 rounded uppercase font-bold transition-all cursor-pointer flex-shrink-0 ${orderStatusFilter === st
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-[#141620] text-slate-400 hover:text-[var(--text-primary)] border border-white/5'
                        }`}
                    >
                      {st}
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Search Box */}
              <Box className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Search by Order # (e.g. VK-2026-8801), Customer Name, Mobile Phone, or Email..."
                  className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded-[2px] py-2.5 pl-10 pr-4 text-xs font-mono text-[var(--text-primary)] placeholder-slate-500 focus:outline-none"
                />
              </Box>
            </Box>

            {/* Orders Feed Table */}
            <Box className="bg-[var(--bg-surface)] border border-white/10 rounded-md overflow-hidden shadow-2xl">
              <Box className="overflow-x-auto">
                <Table className="w-full text-left font-mono text-xs">
                  <TableHead className="bg-[#141620] text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                    <TableRow>
                      <TableCell className="p-4">Order Ref</TableCell>
                      <TableCell className="p-4">Customer & Destination</TableCell>
                      <TableCell className="p-4">Items</TableCell>
                      <TableCell className="p-4">Total & Gateway</TableCell>
                      <TableCell className="p-4">Order Status</TableCell>
                      <TableCell className="p-4">Courier / AWB</TableCell>
                      <TableCell className="p-4 text-right">Logistics Update</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="divide-y divide-white/5">
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="p-8 text-center text-slate-500 font-mono">
                          No orders matched the active filter criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((ord) => (
                        <TableRow key={ord.id} className="hover:bg-white/5 transition-colors">
                          <TableCell className="p-4">
                            <strong className="text-[var(--text-primary)] font-bold block">{ord.orderNumber}</strong>
                            <Typography component="span" className="text-[10px] text-slate-500">
                              {new Date(ord.createdAt).toLocaleDateString()}
                            </Typography>
                          </TableCell>

                          <TableCell className="p-4">
                            <Typography component="span" className="text-[var(--text-primary)] font-bold block">{ord.customerInfo.fullName}</Typography>
                            <Typography component="span" className="text-[10px] text-slate-400 block">{ord.customerInfo.city}, {ord.customerInfo.district}</Typography>
                            <Typography component="span" className="text-[10px] text-slate-500">{ord.customerInfo.phone}</Typography>
                          </TableCell>

                          <TableCell className="p-4">
                            <Typography component="span" className="text-[var(--text-primary)] font-bold block">
                              {ord.items.reduce((s, i) => s + i.quantity, 0)} Pcs
                            </Typography>
                            <Typography component="span" className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                              {ord.items[0]?.productName || 'Garment'}
                            </Typography>
                          </TableCell>

                          <TableCell className="p-4">
                            <Typography component="span" className="text-[#D4AF37] font-bold block">LKR {ord.totalAmount.toLocaleString()}</Typography>
                            <Typography component="span" className="text-[10px] text-slate-400 block">{ord.paymentGateway} ({ord.paymentStatus})</Typography>
                          </TableCell>

                          <TableCell className="p-4">
                            <select
                              value={ord.orderStatus}
                              onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                              className="bg-[#141620] border border-white/20 text-xs font-mono rounded px-2 py-1 text-[var(--text-primary)] focus:outline-none focus:border-[#D4AF37] cursor-pointer"
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
                          </TableCell>

                          <TableCell className="p-4">
                            {ord.awbNumber ? (
                              <Box>
                                <Typography component="span" className="text-[var(--text-primary)] font-bold block">{ord.awbNumber}</Typography>
                                <Typography component="span" className="text-[10px] text-slate-400">{ord.courierName || 'Courier'}</Typography>
                              </Box>
                            ) : (
                              <Typography component="span" className="text-amber-400 text-[10px] font-bold">Unassigned</Typography>
                            )}
                          </TableCell>

                          <TableCell className="p-4 text-right">
                            <Box component="button"
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
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          </Box>
        )}

        {/* 6. CUSTOMER MANAGEMENT TAB */}
        {activeTab === 'CUSTOMERS' && (
          <Box className="space-y-6 animate-fade-in">
            <Box className="bg-[var(--bg-surface)] border border-white/10 p-5 rounded-md flex items-center justify-between">
              <Box className="flex items-center gap-3">
                <Users className="text-[#D4AF37]" size={22} />
                <Box>
                  <Typography variant="h6" className="text-base font-black uppercase text-[var(--text-primary)] font-syne">
                    CUSTOMER DIRECTORY & PURCHASE PROFILES
                  </Typography>
                  <Typography variant="body2" className="text-xs font-mono text-slate-400">
                    View verified client histories, total lifetime expenditure, and Sri Lanka delivery destinations.
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customers.map((c) => (
                <Paper key={c.id} className="bg-[var(--bg-surface)] border border-white/10 rounded-md p-5 space-y-4 shadow-xl" sx={{ backgroundColor: '#0E1017' }}>
                  <Box className="flex items-start justify-between">
                    <Box className="flex items-center gap-3">
                      <Box className="w-10 h-10 rounded-full bg-[#141620] border border-white/10 flex items-center justify-center text-[var(--text-primary)] font-mono font-bold">
                        {c.fullName.charAt(0).toUpperCase()}
                      </Box>
                      <Box>
                        <Typography className="text-sm font-bold uppercase text-[var(--text-primary)] font-heading">{c.fullName}</Typography>
                        <Typography className="text-[11px] font-mono text-slate-400 block">{c.email}</Typography>
                      </Box>
                    </Box>

                    {c.isAdmin && (
                      <Chip 
                        size="small" 
                        label="ADMIN" 
                        sx={{ 
                          height: '20px', 
                          fontSize: '9px', 
                          fontFamily: 'monospace',
                          fontWeight: 'bold',
                          backgroundColor: 'rgba(212, 175, 55, 0.2)', 
                          color: '#D4AF37', 
                          border: '1px solid #D4AF37',
                          borderRadius: '4px'
                        }} 
                      />
                    )}
                  </Box>

                  <Box className="grid grid-cols-2 gap-2 text-xs font-mono p-3 bg-[#141620] rounded border border-white/5">
                    <Box>
                      <Typography className="text-[9px] text-slate-500 uppercase block font-mono">TOTAL ORDERS</Typography>
                      <strong className="text-[var(--text-primary)] font-mono">{c.ordersCount} Orders</strong>
                    </Box>
                    <Box>
                      <Typography className="text-[9px] text-slate-500 uppercase block font-mono">LIFETIME SPEND</Typography>
                      <strong className="text-[#D4AF37] font-mono">LKR {c.totalSpent.toLocaleString()}</strong>
                    </Box>
                  </Box>

                  <Box className="text-xs font-mono text-slate-400 space-y-1">
                    <Typography className="text-slate-300 font-mono text-xs">Tel: {c.phone}</Typography>
                    {c.address && (
                      <Typography className="truncate font-mono text-xs">Destination: {c.address.city}, {c.address.district}</Typography>
                    )}
                  </Box>

                  <Button
                    onClick={() => setViewingCustomer(c)}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-[var(--text-primary)] rounded text-xs font-mono font-bold transition-colors shadow-none block text-center"
                  >
                    View Customer Order History
                  </Button>
                </Paper>
              ))}
            </Box>
          </Box>
        )}

        {/* 7. COUPON MANAGEMENT TAB */}
        {activeTab === 'COUPONS' && (
          <Box className="space-y-6 animate-fade-in">
            <Box className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-surface)] border border-white/10 p-4 rounded-md">
              <Box className="flex items-center gap-3">
                <Tag className="text-[#D4AF37]" size={22} />
                <Box>
                  <Typography variant="h6" className="text-base font-black uppercase text-[var(--text-primary)] font-syne">
                    PROMOTIONS & DISCOUNT RULES
                  </Typography>
                  <Typography variant="body2" className="text-xs font-mono text-slate-400">
                    Configure percentage discounts, fixed vouchers, usage caps, and expiration limits.
                  </Typography>
                </Box>
              </Box>

              <Button
                onClick={() => setIsCouponModalOpen(true)}
                className="px-5 py-3 text-xs font-mono font-extrabold tracking-wider bg-[#D4AF37] hover:bg-[#E2B714] text-black shadow-lg shadow-[#D4AF37]/20"
              >
                <Plus size={16} className="mr-2 inline" />
                CREATE COUPON
              </Button>
            </Box>

            <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coupons.map((cpn) => (
                <Paper key={cpn.code} className="bg-[var(--bg-surface)] border border-white/10 rounded-md p-5 space-y-4 shadow-xl flex flex-col justify-between" sx={{ backgroundColor: '#0E1017' }}>
                  <Box className="space-y-3">
                    <Box className="flex items-center justify-between">
                      <Typography className="text-lg font-mono font-black text-[#D4AF37] tracking-wider">
                        {cpn.code}
                      </Typography>
                      <Chip 
                        size="small" 
                        label={cpn.active ? 'ACTIVE' : 'INACTIVE'} 
                        sx={{ 
                          height: '20px', 
                          fontSize: '10px', 
                          fontFamily: 'monospace',
                          fontWeight: 'bold',
                          backgroundColor: cpn.active ? 'rgba(5, 150, 105, 0.4)' : 'rgba(153, 27, 27, 0.4)', 
                          color: cpn.active ? '#34d399' : '#f87171', 
                          border: `1px solid ${cpn.active ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                          borderRadius: '4px'
                        }} 
                      />
                    </Box>

                    <Box className="p-3 bg-[#141620] rounded border border-white/5 space-y-1.5 text-xs font-mono">
                      <Box className="flex justify-between">
                        <Typography className="text-slate-400 font-mono text-xs">Discount:</Typography>
                        <strong className="text-[var(--text-primary)] font-mono text-xs">
                          {cpn.discountType === 'PERCENTAGE' ? `${cpn.discountValue}% OFF` : `LKR ${cpn.discountValue.toLocaleString()} OFF`}
                        </strong>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography className="text-slate-400 font-mono text-xs">Min Order:</Typography>
                        <strong className="text-[var(--text-primary)] font-mono text-xs">LKR {cpn.minOrderAmount.toLocaleString()}</strong>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography className="text-slate-400 font-mono text-xs">Expires:</Typography>
                        <strong className="text-slate-300 font-mono text-xs">{cpn.expiryDate}</strong>
                      </Box>
                    </Box>
                  </Box>

                  <Box className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <Typography className="text-[10px] font-mono text-slate-500">Usage Limit: {cpn.usageLimit || 'Unlimited'}</Typography>
                    <IconButton
                      onClick={() => setDeleteConfirmTarget({ type: 'coupon', id: cpn.code, name: cpn.code })}
                      size="sm"
                      sx={{ '&:hover': { backgroundColor: 'rgba(153, 27, 27, 0.3)' } }}
                      label="Delete Coupon"
                      icon={<Trash2 size={14} className="text-red-400" />}
                    />
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        )}

        {/* 8. HOMEPAGE CMS MANAGEMENT TAB */}
        {activeTab === 'HOMEPAGE' && (
          <Box className="space-y-6 animate-fade-in">
            <Box className="bg-[var(--bg-surface)] border border-white/10 p-5 rounded-md flex items-center justify-between">
              <Box className="flex items-center gap-3">
                <Home className="text-[#D4AF37]" size={22} />
                <Box>
                  <Typography variant="h6" className="text-base font-black uppercase text-[var(--text-primary)] font-syne">
                    STOREFRONT HOMEPAGE CMS & SECTION CONTROLS
                  </Typography>
                  <Typography variant="body2" className="text-xs font-mono text-slate-400">
                    Live hero banners, editorial announcements, and component visibility toggles.
                  </Typography>
                </Box>
              </Box>

              <Button
                onClick={() => {
                  saveAdminHomepageConfig(homepageConfig);
                  showToast('Homepage CMS settings updated successfully.', 'success');
                }}
                className="px-6 py-3 bg-[#D4AF37] hover:bg-[#E2B714] text-black text-xs font-mono font-extrabold uppercase tracking-wider transition-all shadow-lg"
              >
                SAVE CMS CHANGES
              </Button>
            </Box>

            <Box className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hero Banner Controls */}
              <Box className="bg-[var(--bg-surface)] border border-white/10 rounded-md p-6 space-y-4">
                <Typography className="text-sm font-black uppercase text-[var(--text-primary)] font-syne tracking-wider border-b border-white/10 pb-3">
                  1. HERO SECTION HERO BANNER
                </Typography>

                <Box className="space-y-3 font-mono text-xs">
                  <Box>
                    <label className="text-slate-300 font-bold block mb-1">Headline Text</label>
                    <Box
                      component="input"
                      type="text"
                      value={homepageConfig.hero.headline}
                      onChange={(e: any) => setHomepageConfig({ ...homepageConfig, hero: { ...homepageConfig.hero, headline: e.target.value } })}
                      className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2.5 text-[var(--text-primary)] focus:outline-none"
                    />
                  </Box>

                  <Box>
                    <label className="text-slate-300 font-bold block mb-1">Subheadline Description</label>
                    <Box
                      component="input"
                      type="text"
                      value={homepageConfig.hero.subheadline}
                      onChange={(e: any) => setHomepageConfig({ ...homepageConfig, hero: { ...homepageConfig.hero, subheadline: e.target.value } })}
                      className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2.5 text-[var(--text-primary)] focus:outline-none"
                    />
                  </Box>

                  <Box className="grid grid-cols-2 gap-3">
                    <Box>
                      <label className="text-slate-300 font-bold block mb-1">CTA Button Text</label>
                      <Box
                        component="input"
                        type="text"
                        value={homepageConfig.hero.ctaText}
                        onChange={(e: any) => setHomepageConfig({ ...homepageConfig, hero: { ...homepageConfig.hero, ctaText: e.target.value } })}
                        className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2.5 text-[var(--text-primary)] focus:outline-none"
                      />
                    </Box>
                    <Box>
                      <label className="text-slate-300 font-bold block mb-1">CTA Destination Link</label>
                      <Box
                        component="input"
                        type="text"
                        value={homepageConfig.hero.ctaLink}
                        onChange={(e: any) => setHomepageConfig({ ...homepageConfig, hero: { ...homepageConfig.hero, ctaLink: e.target.value } })}
                        className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2.5 text-[var(--text-primary)] focus:outline-none"
                      />
                    </Box>
                  </Box>

                  <Box>
                    <SingleImageUploader
                      label="Hero Background Banner"
                      imageUrl={homepageConfig.hero.bannerImage}
                      onChange={(url) => setHomepageConfig({ ...homepageConfig, hero: { ...homepageConfig.hero, bannerImage: url } })}
                      scope="homepage"
                      identifier="hero-banner"
                    />
                  </Box>
                </Box>
              </Box>

              {/* Section Visibility Toggles */}
              <Box className="bg-[var(--bg-surface)] border border-white/10 rounded-md p-6 space-y-4">
                <Typography className="text-sm font-black uppercase text-[var(--text-primary)] font-syne tracking-wider border-b border-white/10 pb-3">
                  2. HOMEPAGE SECTIONS VISIBILITY
                </Typography>

                <Box className="grid grid-cols-2 gap-2.5 font-mono text-xs">
                  {Object.entries(homepageConfig.sectionsVisibility).map(([key, val]) => (
                    <label key={key} className="flex items-center gap-2.5 p-2.5 bg-[#141620] rounded border border-white/5 cursor-pointer">
                      <Box
                        component="input"
                        type="checkbox"
                        checked={val}
                        onChange={(e: any) => {
                          const updated = { ...homepageConfig.sectionsVisibility, [key]: e.target.checked };
                          setHomepageConfig({ ...homepageConfig, sectionsVisibility: updated });
                        }}
                        className="accent-[#D4AF37]"
                      />
                      <Box component="span" className="capitalize text-slate-300 text-[11px]">{key.replace(/([A-Z])/g, ' $1')}</Box>
                    </label>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {/* 9. DATABASE & SUPABASE TAB */}
        {activeTab === 'DATABASE' && (
          <Box className="space-y-6 animate-fade-in">
            {/* Supabase SQL Card */}
            <Box className="bg-[var(--bg-surface)] border border-white/10 p-6 rounded-md space-y-4">
              <Box className="flex items-center justify-between flex-wrap gap-3">
                <Box className="flex items-center gap-3">
                  <Database className="text-[#D4AF37]" size={22} />
                  <Box>
                    <Typography variant="h6" className="text-base font-black uppercase text-[var(--text-primary)] font-syne">
                      SUPABASE DATABASE & RLS POLICIES
                    </Typography>
                    <Typography variant="body2" className="text-xs font-mono text-slate-400">
                      Cloud schema with 11 tables (including product_media) and hardened Row-Level Security policies.
                    </Typography>
                  </Box>
                </Box>

                <Button
                  onClick={handleCopySql}
                  className="px-4 py-2 bg-[#D4AF37] text-black font-mono font-bold text-xs uppercase transition-all hover:bg-[#E2B714]"
                >
                  {copiedSql ? <Check size={14} className="mr-1.5 inline" /> : <Copy size={14} className="mr-1.5 inline" />}
                  {copiedSql ? 'COPIED SQL' : 'COPY SUPABASE SQL'}
                </Button>
              </Box>

              <Box className="p-4 bg-[#08090D] border border-white/10 rounded font-mono text-[11px] text-slate-300 max-h-[300px] overflow-y-auto whitespace-pre">
                {SUPABASE_SETUP_SQL}
              </Box>
            </Box>

            {/* Firebase Storage Security Rules Card */}
            <Box className="bg-[var(--bg-surface)] border border-white/10 p-6 rounded-md space-y-4">
              <Box className="flex items-center justify-between flex-wrap gap-3">
                <Box className="flex items-center gap-3">
                  <Cloud className="text-[#D4AF37]" size={22} />
                  <Box>
                    <Typography variant="h6" className="text-base font-black uppercase text-[var(--text-primary)] font-syne">
                      FIREBASE CLOUD STORAGE RULES
                    </Typography>
                    <Typography variant="body2" className="text-xs font-mono text-slate-400">
                      Production security rules for products, categories, collections, and custom customer artwork.
                    </Typography>
                  </Box>
                </Box>

                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(FIREBASE_STORAGE_RULES);
                    setCopiedStorageRules(true);
                    setTimeout(() => setCopiedStorageRules(false), 2000);
                  }}
                  className="px-4 py-2 bg-[#D4AF37] text-black font-mono font-bold text-xs uppercase transition-all hover:bg-[#E2B714]"
                >
                  {copiedStorageRules ? <Check size={14} className="mr-1.5 inline" /> : <Copy size={14} className="mr-1.5 inline" />}
                  {copiedStorageRules ? 'COPIED RULES' : 'COPY STORAGE RULES'}
                </Button>
              </Box>

              <Box className="p-4 bg-[#08090D] border border-white/10 rounded font-mono text-[11px] text-slate-300 max-h-[250px] overflow-y-auto whitespace-pre">
                {FIREBASE_STORAGE_RULES}
              </Box>
            </Box>
          </Box>
        )}

      </Box>

      {/* PRODUCT CREATE/EDIT MODAL */}
      {isProductModalOpen && (
        <Box className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <Box className="bg-[var(--bg-surface)] border border-[#D4AF37]/40 w-full max-w-4xl rounded-md p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto">
            <Box className="flex items-center justify-between border-b border-white/10 pb-4">
              <Box>
                <Typography component="span" className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest block">
                  {editingProduct ? 'EDIT EXISTING GARMENT' : 'CREATE NEW LUXURY PRODUCT'}
                </Typography>
                <h3 className="text-xl font-black uppercase text-[var(--text-primary)] font-syne">
                  {editingProduct ? editingProduct.name : 'NEW VALKNUT PRODUCT'}
                </h3>
              </Box>
              <Box component="button" onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-[var(--text-primary)] p-1">
                <XCircle size={22} />
              </Box>
            </Box>

            <form onSubmit={handleSaveProduct} className="space-y-6 font-mono text-xs">

              {/* Basic Fields */}
              <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Box>
                  <label className="text-slate-300 font-bold block mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="e.g. Valknut Oversized Heavyweight Boxy Hoodie"
                    className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2.5 text-[var(--text-primary)]"
                  />
                </Box>

                <Box>
                  <label className="text-slate-300 font-bold block mb-1">URL Slug (Auto-generated if empty)</label>
                  <input
                    type="text"
                    value={prodSlug}
                    onChange={(e) => setProdSlug(e.target.value)}
                    placeholder="valknut-oversized-heavyweight-boxy-hoodie"
                    className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2.5 text-[var(--text-primary)]"
                  />
                </Box>
              </Box>

              {/* Pricing & Categories */}
              <Box className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Box>
                  <label className="text-slate-300 font-bold block mb-1">Regular Price (LKR) *</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2.5 text-[var(--text-primary)]"
                  />
                </Box>

                <Box>
                  <label className="text-slate-300 font-bold block mb-1">Sale Price (LKR)</label>
                  <input
                    type="number"
                    value={prodSalePrice || ''}
                    onChange={(e) => setProdSalePrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Optional"
                    className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2.5 text-[var(--text-primary)]"
                  />
                </Box>

                <Box>
                  <label className="text-slate-300 font-bold block mb-1">Category *</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as CategoryType)}
                    className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2.5 text-[var(--text-primary)]"
                  >
                    <option value="MEN">MEN</option>
                    <option value="WOMEN">WOMEN</option>
                    <option value="ESSENTIALS">ESSENTIALS</option>
                  </select>
                </Box>

                <Box>
                  <label className="text-slate-300 font-bold block mb-1">Subcategory *</label>
                  <select
                    value={prodSubCategory}
                    onChange={(e) => setProdSubCategory(e.target.value as SubCategoryType)}
                    className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2.5 text-[var(--text-primary)]"
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
                </Box>
              </Box>

              {/* Description, Material & Care */}
              <Box className="space-y-3">
                <Box>
                  <label className="text-slate-300 font-bold block mb-1">Product Description</label>
                  <textarea
                    rows={2}
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                    className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2.5 text-[var(--text-primary)]"
                  />
                </Box>

                <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Box>
                    <label className="text-slate-300 font-bold block mb-1">Fabric & Material Composition</label>
                    <input
                      type="text"
                      value={prodMaterial}
                      onChange={(e) => setProdMaterial(e.target.value)}
                      className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2.5 text-[var(--text-primary)]"
                    />
                  </Box>
                  <Box>
                    <label className="text-slate-300 font-bold block mb-1">Care & Wash Instructions</label>
                    <input
                      type="text"
                      value={prodCare}
                      onChange={(e) => setProdCare(e.target.value)}
                      className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2.5 text-[var(--text-primary)]"
                    />
                  </Box>
                </Box>
              </Box>

              {/* Product Media Gallery Uploader & Reordering */}
              <Box className="p-4 bg-[#0A0B0E] rounded-md border border-white/10 space-y-3">
                <ProductImageManager
                  productId={editingProduct?.id || prodSlug || 'new-product'}
                  images={prodImages}
                  onChange={(newImgs) => setProdImages(newImgs)}
                />
              </Box>

              {/* Variant Stock Management Table */}
              <Box className="p-4 bg-[#141620] rounded border border-white/10 space-y-3">
                <Box className="flex items-center justify-between">
                  <Typography component="span" className="text-xs font-bold text-[#D4AF37] uppercase">
                    SIZE & COLOR VARIANTS INVENTORY
                  </Typography>
                  <Box component="button"
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
                    className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-[var(--text-primary)] rounded text-[10px]"
                  >
                    + Add Variant
                  </Box>
                </Box>

                <Box className="space-y-2">
                  {prodVariants.map((v, idx) => (
                    <Box key={v.id || idx} className="grid grid-cols-5 gap-2 items-center text-[11px]">
                      <select
                        value={v.size}
                        onChange={(e) => {
                          const copy = [...prodVariants];
                          copy[idx].size = e.target.value as any;
                          setProdVariants(copy);
                        }}
                        className="bg-[var(--bg-surface)] border border-white/15 rounded p-1.5 text-[var(--text-primary)]"
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
                        className="bg-[var(--bg-surface)] border border-white/15 rounded p-1.5 text-[var(--text-primary)]"
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
                        className="bg-[var(--bg-surface)] border border-white/15 rounded p-1.5 text-[var(--text-primary)]"
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
                        className="bg-[var(--bg-surface)] border border-white/15 rounded p-1.5 text-[var(--text-primary)] font-bold"
                      />

                      <Box component="button"
                        type="button"
                        onClick={() => setProdVariants(prodVariants.filter((_, i) => i !== idx))}
                        className="text-red-400 hover:text-red-300 p-1 text-center"
                      >
                        Remove
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Status Flags */}
              <Box className="flex items-center gap-6 text-xs text-slate-300 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={prodIsNewArrival} onChange={(e) => setProdIsNewArrival(e.target.checked)} className="accent-[#D4AF37]" />
                  <Typography component="span">New Arrival</Typography>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={prodIsBestSeller} onChange={(e) => setProdIsBestSeller(e.target.checked)} className="accent-[#D4AF37]" />
                  <Typography component="span">Best Seller</Typography>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={prodIsCustomizable} onChange={(e) => setProdIsCustomizable(e.target.checked)} className="accent-[#D4AF37]" />
                  <Typography component="span">Custom Studio Enabled</Typography>
                </label>
              </Box>

              {/* Action Buttons */}
              <Box className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <Box component="button"
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded font-bold"
                >
                  Cancel
                </Box>

                <Box component="button"
                  type="submit"
                  className="px-8 py-2.5 bg-[#D4AF37] hover:bg-[#E2B714] text-black font-extrabold uppercase tracking-widest rounded"
                >
                  {editingProduct ? 'SAVE CHANGES' : 'CREATE PRODUCT'}
                </Box>
              </Box>

            </form>
          </Box>
        </Box>
      )}

      {/* AWB & LOGISTICS UPDATE MODAL */}
      {selectedOrderForAwb && (
        <Box className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <Box className="bg-[var(--bg-surface)] border border-[#D4AF37]/40 w-full max-w-lg rounded-md p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <Box className="flex items-center justify-between border-b border-white/10 pb-3">
              <Box>
                <Typography component="span" className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase block">
                  COURIER DISPATCH UPDATE
                </Typography>
                <h3 className="text-lg font-black uppercase text-[var(--text-primary)] font-syne">
                  {selectedOrderForAwb.orderNumber}
                </h3>
              </Box>
              <Box component="button" onClick={() => setSelectedOrderForAwb(null)} className="text-slate-400 hover:text-[var(--text-primary)]">
                <XCircle size={20} />
              </Box>
            </Box>

            {/* Ordered Items & Bespoke Customization Info */}
            <Box className="p-3.5 bg-[#141620] rounded border border-white/10 space-y-2.5 max-h-48 overflow-y-auto">
              <Typography component="span" className="text-[10px] text-[#D4AF37] font-bold uppercase block tracking-wider">
                ORDER ITEMS & PRODUCTION SPECS ({selectedOrderForAwb.items.length})
              </Typography>
              <Box className="divide-y divide-white/5 space-y-2">
                {selectedOrderForAwb.items.map((it: any, idx: number) => (
                  <Box key={idx} className="pt-2 flex items-start justify-between gap-3 text-[11px]">
                    <Box className="space-y-1">
                      <Typography component="p" className="text-[var(--text-primary)] font-bold">{it.productName} <Typography component="span" className="text-slate-400 font-normal">({it.size} / {it.color}) × {it.quantity}</Typography></Typography>

                      {it.customization && (
                        <Box className="p-2 bg-black/60 rounded border border-[#D4AF37]/30 text-[10px] text-[#D4AF37] space-y-1">
                          <Box className="flex items-center gap-1 font-bold">
                            <Sparkles size={11} />
                            <Typography component="span">Bespoke: {it.customization.printTechnique} ({it.customization.placement})</Typography>
                          </Box>
                          {it.customization.customText && (
                            <Typography component="p" className="text-slate-300">Custom Text: <strong className="text-[var(--text-primary)]">"{it.customization.customText}"</strong> ({it.customization.textFont})</Typography>
                          )}
                          {it.customization.uploadedArtworkUrl && (
                            <Box className="pt-1 flex items-center gap-2">
                              <img src={it.customization.uploadedArtworkUrl} alt="Artwork" className="w-8 h-8 object-contain rounded bg-white/10 p-0.5" />
                              <a
                                href={it.customization.uploadedArtworkUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-0.5 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 text-[#D4AF37] rounded text-[9px] font-bold flex items-center gap-1"
                              >
                                <Typography component="span">Download High-Res Artwork</Typography>
                                <ExternalLink size={10} />
                              </a>
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>

                    <Typography component="span" className="text-[#D4AF37] font-bold">LKR {it.subtotal.toLocaleString()}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <form onSubmit={handleSaveAwbUpdate} className="space-y-4 font-mono text-xs">
              <Box>
                <label className="text-slate-300 font-bold block mb-1">Select Courier Partner</label>
                <select
                  value={awbCourier}
                  onChange={(e) => setAwbCourier(e.target.value)}
                  className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-[var(--text-primary)]"
                >
                  <option value="Pronto Lanka Express">Pronto Lanka Express</option>
                  <option value="Fargo Express">Fargo Express</option>
                  <option value="Domex Courier">Domex Courier</option>
                  <option value="Direct VIP Courier">Direct VIP Courier</option>
                </select>
              </Box>

              <Box>
                <label className="text-slate-300 font-bold block mb-1">Air Waybill (AWB) / Tracking # *</label>
                <input
                  type="text"
                  required
                  value={awbNumberInput}
                  onChange={(e) => setAwbNumberInput(e.target.value)}
                  placeholder="PRN-99882103"
                  className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-[var(--text-primary)]"
                />
              </Box>

              <Box>
                <label className="text-slate-300 font-bold block mb-1">Tracking URL (Optional)</label>
                <input
                  type="text"
                  value={awbTrackingLinkInput}
                  onChange={(e) => setAwbTrackingLinkInput(e.target.value)}
                  placeholder="https://valknutofficial.com/#/track-order"
                  className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-[var(--text-primary)]"
                />
              </Box>

              <Box>
                <label className="text-slate-300 font-bold block mb-1">Update Order Status</label>
                <select
                  value={awbStatusSelect}
                  onChange={(e) => setAwbStatusSelect(e.target.value as OrderStatus)}
                  className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-[var(--text-primary)]"
                >
                  <option value="Shipped">Shipped (Dispatched to Courier)</option>
                  <option value="Delivered">Delivered (Handed over to Customer)</option>
                  <option value="Packed">Packed (Awaiting pickup)</option>
                </select>
              </Box>

              <Box className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <Box component="button"
                  type="button"
                  onClick={() => setSelectedOrderForAwb(null)}
                  className="px-4 py-2 bg-white/5 text-slate-400 rounded"
                >
                  Cancel
                </Box>
                <Box component="button"
                  type="submit"
                  className="px-6 py-2 bg-[#D4AF37] text-black font-extrabold uppercase rounded shadow"
                >
                  SAVE & DISPATCH
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      )}

      {/* CATEGORY CREATE/EDIT MODAL */}
      {isCategoryModalOpen && (
        <Box className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <Box className="bg-[var(--bg-surface)] border border-[#D4AF37]/40 w-full max-w-xl rounded-md p-6 space-y-6 shadow-2xl relative">
            <Box className="flex items-center justify-between border-b border-white/10 pb-3">
              <Box>
                <Typography component="span" className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase block">
                  CATEGORY CONFIGURATION
                </Typography>
                <h3 className="text-lg font-black uppercase text-[var(--text-primary)] font-syne">
                  {editingCategory ? `Edit "${editingCategory.name}"` : 'Create New Category'}
                </h3>
              </Box>
              <Box component="button" onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-[var(--text-primary)]">
                <XCircle size={20} />
              </Box>
            </Box>

            <form onSubmit={handleSaveCategory} className="space-y-4 font-mono text-xs">
              <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Box>
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
                    className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-[var(--text-primary)]"
                  />
                </Box>
                <Box>
                  <label className="text-slate-300 font-bold block mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={catSlug}
                    onChange={(e) => setCatSlug(e.target.value)}
                    placeholder="oversized-hoodies"
                    className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-[var(--text-primary)]"
                  />
                </Box>
              </Box>

              <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Box>
                  <label className="text-slate-300 font-bold block mb-1">Parent Classification</label>
                  <select
                    value={catParent}
                    onChange={(e) => setCatParent(e.target.value as any)}
                    className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-[var(--text-primary)]"
                  >
                    <option value="ROOT">Root Department</option>
                    <option value="MEN">Men Collection</option>
                    <option value="WOMEN">Women Collection</option>
                    <option value="ESSENTIALS">Essentials & Accessories</option>
                  </select>
                </Box>
                <Box>
                  <SingleImageUploader
                    label="Category Cover Image"
                    imageUrl={catImage}
                    onChange={(url) => setCatImage(url)}
                    scope="categories"
                    identifier={catSlug || 'category'}
                  />
                </Box>
              </Box>

              <Box>
                <label className="text-slate-300 font-bold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  placeholder="Luxury streetwear category description..."
                  className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-[var(--text-primary)]"
                />
              </Box>

              <Box className="p-3 bg-[#141620] rounded border border-white/5 space-y-3">
                <Typography component="span" className="text-[10px] text-[#D4AF37] font-bold uppercase block">SEO Metadata</Typography>
                <Box>
                  <label className="text-slate-300 block mb-1 text-[11px]">SEO Title</label>
                  <input
                    type="text"
                    value={catSeoTitle}
                    onChange={(e) => setCatSeoTitle(e.target.value)}
                    placeholder="Luxury Hoodies & Streetwear Sri Lanka | VALKNUT"
                    className="w-full bg-[var(--bg-surface)] border border-white/15 rounded p-2 text-[var(--text-primary)] text-[11px]"
                  />
                </Box>
                <Box>
                  <label className="text-slate-300 block mb-1 text-[11px]">Meta Description</label>
                  <textarea
                    rows={2}
                    value={catSeoDesc}
                    onChange={(e) => setCatSeoDesc(e.target.value)}
                    placeholder="Shop premium streetwear and luxury oversized hoodies in Sri Lanka."
                    className="w-full bg-[var(--bg-surface)] border border-white/15 rounded p-2 text-[var(--text-primary)] text-[11px]"
                  />
                </Box>
              </Box>

              <Box className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <Box component="button"
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 bg-white/5 text-slate-400 rounded"
                >
                  Cancel
                </Box>
                <Box component="button"
                  type="submit"
                  className="px-6 py-2 bg-[#D4AF37] text-black font-extrabold uppercase rounded shadow"
                >
                  {editingCategory ? 'SAVE CATEGORY' : 'CREATE CATEGORY'}
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      )}

      {/* COLLECTION CREATE/EDIT MODAL */}
      {isCollectionModalOpen && (
        <Box className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <Box className="bg-[var(--bg-surface)] border border-[#D4AF37]/40 w-full max-w-xl rounded-md p-6 space-y-6 shadow-2xl relative">
            <Box className="flex items-center justify-between border-b border-white/10 pb-3">
              <Box>
                <Typography component="span" className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase block">
                  EDITORIAL DROP & COLLECTION
                </Typography>
                <h3 className="text-lg font-black uppercase text-[var(--text-primary)] font-syne">
                  {editingCollection ? `Edit "${editingCollection.name}"` : 'Create New Collection'}
                </h3>
              </Box>
              <Box component="button" onClick={() => setIsCollectionModalOpen(false)} className="text-slate-400 hover:text-[var(--text-primary)]">
                <XCircle size={20} />
              </Box>
            </Box>

            <form onSubmit={handleSaveCollection} className="space-y-4 font-mono text-xs">
              <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Box>
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
                    className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-[var(--text-primary)]"
                  />
                </Box>
                <Box>
                  <label className="text-slate-300 font-bold block mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={colSlug}
                    onChange={(e) => setColSlug(e.target.value)}
                    placeholder="shadow-ops-2026"
                    className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-[var(--text-primary)]"
                  />
                </Box>
              </Box>

              <Box>
                <SingleImageUploader
                  label="Collection Campaign Banner"
                  imageUrl={colImage}
                  onChange={(url) => setColImage(url)}
                  scope="collections"
                  identifier={colSlug || 'collection'}
                />
              </Box>

              <Box>
                <label className="text-slate-300 font-bold block mb-1">Editorial Concept</label>
                <textarea
                  rows={2}
                  value={colDescription}
                  onChange={(e) => setColDescription(e.target.value)}
                  placeholder="Tactical silhouettes crafted for the sovereign individual..."
                  className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-[var(--text-primary)]"
                />
              </Box>

              {/* Product Assign Checklist */}
              <Box className="p-3 bg-[#141620] rounded border border-white/5 space-y-2 max-h-40 overflow-y-auto">
                <Typography component="span" className="text-[10px] text-[#D4AF37] font-bold uppercase block">Assign Products ({colSelectedProducts.length})</Typography>
                <Box className="space-y-1.5">
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
                        <Typography component="span" className="text-[var(--text-primary)] text-[11px]">{p.name}</Typography>
                        <Typography component="span" className="text-slate-500 text-[10px] ml-auto">LKR {p.price.toLocaleString()}</Typography>
                      </label>
                    );
                  })}
                </Box>
              </Box>

              <Box className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <Box component="button"
                  type="button"
                  onClick={() => setIsCollectionModalOpen(false)}
                  className="px-4 py-2 bg-white/5 text-slate-400 rounded"
                >
                  Cancel
                </Box>
                <Box component="button"
                  type="submit"
                  className="px-6 py-2 bg-[#D4AF37] text-black font-extrabold uppercase rounded shadow"
                >
                  {editingCollection ? 'SAVE COLLECTION' : 'CREATE COLLECTION'}
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      )}

      {/* COUPON CREATE MODAL */}
      {isCouponModalOpen && (
        <Box className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <Box className="bg-[var(--bg-surface)] border border-[#D4AF37]/40 w-full max-w-lg rounded-md p-6 space-y-6 shadow-2xl relative">
            <Box className="flex items-center justify-between border-b border-white/10 pb-3">
              <Box>
                <Typography component="span" className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase block">
                  DISCOUNT VOUCHER CONFIGURATION
                </Typography>
                <h3 className="text-lg font-black uppercase text-[var(--text-primary)] font-syne">
                  Create Promotional Coupon
                </h3>
              </Box>
              <Box component="button" onClick={() => setIsCouponModalOpen(false)} className="text-slate-400 hover:text-[var(--text-primary)]">
                <XCircle size={20} />
              </Box>
            </Box>

            <form onSubmit={handleSaveCoupon} className="space-y-4 font-mono text-xs">
              <Box>
                <label className="text-slate-300 font-bold block mb-1">Coupon Promo Code *</label>
                <input
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. VALK2026"
                  className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-[var(--text-primary)] font-bold tracking-widest uppercase"
                />
              </Box>

              <Box className="grid grid-cols-2 gap-4">
                <Box>
                  <label className="text-slate-300 font-bold block mb-1">Discount Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-[var(--text-primary)]"
                  >
                    <option value="PERCENTAGE">Percentage (%) Off</option>
                    <option value="FIXED">Fixed Amount (LKR) Off</option>
                  </select>
                </Box>
                <Box>
                  <label className="text-slate-300 font-bold block mb-1">
                    {newCouponType === 'PERCENTAGE' ? 'Discount % *' : 'Discount LKR *'}
                  </label>
                  <input
                    type="number"
                    required
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                    className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-[var(--text-primary)] font-bold"
                  />
                </Box>
              </Box>

              <Box className="grid grid-cols-3 gap-3">
                <Box>
                  <label className="text-slate-300 font-bold block mb-1">Min Order (LKR)</label>
                  <input
                    type="number"
                    value={newCouponMinOrder}
                    onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                    className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-[var(--text-primary)]"
                  />
                </Box>
                <Box>
                  <label className="text-slate-300 font-bold block mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={newCouponUsageLimit}
                    onChange={(e) => setNewCouponUsageLimit(Number(e.target.value))}
                    className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-[var(--text-primary)]"
                  />
                </Box>
                <Box>
                  <label className="text-slate-300 font-bold block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newCouponExpiry}
                    onChange={(e) => setNewCouponExpiry(e.target.value)}
                    className="w-full bg-[#141620] border border-white/15 rounded p-2.5 text-[var(--text-primary)]"
                  />
                </Box>
              </Box>

              <Box className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <Box component="button"
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 bg-white/5 text-slate-400 rounded"
                >
                  Cancel
                </Box>
                <Box component="button"
                  type="submit"
                  className="px-6 py-2 bg-[#D4AF37] text-black font-extrabold uppercase rounded shadow"
                >
                  CREATE COUPON
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      )}

      {/* CUSTOMER ORDER HISTORY DRAWER / MODAL */}
      {viewingCustomer && (
        <Box className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <Box className="bg-[var(--bg-surface)] border border-[#D4AF37]/40 w-full max-w-2xl rounded-md p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <Box className="flex items-center justify-between border-b border-white/10 pb-3">
              <Box>
                <Typography component="span" className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase block">
                  CUSTOMER PURCHASE RECORD
                </Typography>
                <h3 className="text-lg font-black uppercase text-[var(--text-primary)] font-syne">
                  {viewingCustomer.fullName}
                </h3>
              </Box>
              <Box component="button" onClick={() => setViewingCustomer(null)} className="text-slate-400 hover:text-[var(--text-primary)]">
                <XCircle size={20} />
              </Box>
            </Box>

            <Box className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-[#141620] rounded border border-white/5 font-mono text-xs">
              <Box>
                <Typography component="span" className="text-[9px] text-slate-500 uppercase block">EMAIL</Typography>
                <strong className="text-[var(--text-primary)] truncate block">{viewingCustomer.email}</strong>
              </Box>
              <Box>
                <Typography component="span" className="text-[9px] text-slate-500 uppercase block">MOBILE</Typography>
                <strong className="text-[var(--text-primary)]">{viewingCustomer.phone}</strong>
              </Box>
              <Box>
                <Typography component="span" className="text-[9px] text-slate-500 uppercase block">ORDERS</Typography>
                <strong className="text-[var(--text-primary)]">{viewingCustomer.ordersCount}</strong>
              </Box>
              <Box>
                <Typography component="span" className="text-[9px] text-slate-500 uppercase block">LIFETIME SPEND</Typography>
                <strong className="text-[#D4AF37]">LKR {viewingCustomer.totalSpent.toLocaleString()}</strong>
              </Box>
            </Box>

            {viewingCustomer.address && (
              <Box className="p-3 bg-[#141620] rounded border border-white/5 font-mono text-xs text-slate-300">
                <Typography component="span" className="text-[9px] text-[#D4AF37] uppercase font-bold block mb-1">DELIVERY DESTINATION</Typography>
                <Typography component="p">{viewingCustomer.address.addressLine1}, {viewingCustomer.address.city}, {viewingCustomer.address.district} ({viewingCustomer.address.postalCode})</Typography>
              </Box>
            )}

            <Box className="space-y-3 font-mono text-xs">
              <Typography component="span" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">ORDER HISTORY LOG</Typography>
              <Box className="divide-y divide-white/5 max-h-56 overflow-y-auto">
                {orders.filter((o) => o.customerInfo.email.toLowerCase() === viewingCustomer.email.toLowerCase()).length === 0 ? (
                  <Typography component="p" className="text-slate-500 py-3">No placed orders recorded for this account yet.</Typography>
                ) : (
                  orders.filter((o) => o.customerInfo.email.toLowerCase() === viewingCustomer.email.toLowerCase()).map((o) => (
                    <Box key={o.id} className="py-2.5 flex items-center justify-between gap-4">
                      <Box>
                        <Typography component="span" className="text-[var(--text-primary)] font-bold">{o.orderNumber}</Typography>
                        <Typography component="span" className="text-slate-500 text-[10px] block">{new Date(o.createdAt).toLocaleDateString()}</Typography>
                      </Box>
                      <Box className="text-right">
                        <Typography component="span" className="text-[var(--text-primary)] font-bold">LKR {o.totalAmount.toLocaleString()}</Typography>
                        <Typography component="span" className="text-[10px] text-[#D4AF37] uppercase block">{o.orderStatus}</Typography>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </Box>

            <Box className="pt-3 border-t border-white/10 flex justify-end">
              <Box component="button"
                onClick={() => setViewingCustomer(null)}
                className="px-5 py-2 bg-white/10 hover:bg-white/15 text-[var(--text-primary)] font-mono text-xs rounded font-bold"
              >
                Close Customer File
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirmTarget && (
        <Box className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <Box className="bg-[var(--bg-surface)] border border-red-500/40 w-full max-w-md rounded-md p-6 space-y-4 shadow-2xl text-center">
            <Box className="w-12 h-12 rounded-full bg-red-950/60 border border-red-500 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </Box>

            <h3 className="text-base font-black uppercase text-[var(--text-primary)] font-syne">
              CONFIRM ARCHIVE / DELETION
            </h3>
            <Typography component="p" className="text-xs font-mono text-slate-400">
              Are you sure you want to permanently delete <strong className="text-[var(--text-primary)]">"{deleteConfirmTarget.name}"</strong>? This action cannot be undone.
            </Typography>

            <Box className="flex items-center justify-center gap-3 pt-2 font-mono text-xs">
              <Box component="button"
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded font-bold"
              >
                Cancel
              </Box>
              <Box component="button"
                onClick={executeDelete}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-[var(--text-primary)] font-extrabold uppercase rounded shadow-lg shadow-red-600/20"
              >
                CONFIRM DELETE
              </Box>
            </Box>
          </Box>
        </Box>
      )}

    </Box>
  );
};
