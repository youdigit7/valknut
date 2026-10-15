import React, { useState, useMemo, useEffect } from 'react';
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
import {
  FIREBASE_STORAGE_RULES,
  syncProductMediaToSupabase,
  checkFirebaseStorageStatus,
  getCloudinaryConfig,
  saveCloudinaryConfig,
  isCloudinaryConfigured,
  uploadMediaFile
} from '../../services/mediaService';
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
import { loginAdmin } from '../../services/authService';
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
  XCircle,
  Copy,
  Check,
  Cloud,
  Eye,
  EyeOff,
  Palette,
  HardDrive,
  Upload,
  RefreshCw,
  Server,
  ChevronRight
} from 'lucide-react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  LinearProgress,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Tooltip,
  Divider,
  Switch,
  FormControlLabel,
  Checkbox,
  AppBar,
  Toolbar
} from '@mui/material';
import valknutLogo from '../../assets/logos/symbol-dark.png';

type AdminTab =
  | 'METRICS'
  | 'PRODUCTS'
  | 'STUDIOS'
  | 'ORDERS'
  | 'CATEGORIES'
  | 'COLLECTIONS'
  | 'CUSTOMERS'
  | 'COUPONS'
  | 'HOMEPAGE'
  | 'STORAGE'
  | 'DATABASE';

// Modern Luxury Design Tokens
const goldColor = '#D4AF37';
const goldHover = '#E5C158';

const modernCardSx = {
  backgroundColor: '#0E1017',
  backgroundImage: 'linear-gradient(145deg, rgba(20, 22, 32, 0.7) 0%, rgba(14, 16, 23, 0.95) 100%)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
  overflow: 'hidden',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
  '&:hover': {
    borderColor: 'rgba(255, 255, 255, 0.14)',
  }
};

const darkInputSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#121420',
    borderRadius: '10px',
    color: '#F8FAFC',
    fontSize: '0.85rem',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.1)',
      transition: 'border-color 0.2s ease',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(212, 175, 55, 0.45)',
    },
    '&.Mui-focused fieldset': {
      borderColor: goldColor,
      boxShadow: '0 0 0 2px rgba(212, 175, 55, 0.2)',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#94A3B8',
    fontSize: '0.85rem',
    '&.Mui-focused': {
      color: goldColor,
    },
  },
};

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
    setUserProfile,
    showToast
  } = useStore();

  // Active Admin View Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('METRICS');

  // Admin Auth Gate State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAdminLoggingIn, setIsAdminLoggingIn] = useState(false);
  const [showAdminPass, setShowAdminPass] = useState(false);

  // Products Tab Filtering & Search
  const [productCategoryFilter, setProductCategoryFilter] = useState<'ALL' | 'MEN' | 'WOMEN' | 'ESSENTIALS'>('ALL');
  const [productSearchQuery, setProductSearchQuery] = useState('');

  // Studio Submissions / Custom Orders State
  const [studioStatusFilter, setStudioStatusFilter] = useState<string>('ALL');

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

  // Customer Detail Drawer / Modal
  const [viewingCustomer, setViewingCustomer] = useState<CustomerAccountRecord | null>(null);

  // Delete Confirmation State
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{ type: 'product' | 'category' | 'collection' | 'coupon'; id: string; name: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedStorageRules, setCopiedStorageRules] = useState(false);

  // Cloud Media Storage Management State
  const [firebaseStatus, setFirebaseStatus] = useState<{ status: string; message: string; bucket: string } | null>(null);
  const [isCheckingStorage, setIsCheckingStorage] = useState(false);
  const [cldCloudName, setCldCloudName] = useState(() => getCloudinaryConfig().cloudName);
  const [cldPreset, setCldPreset] = useState(() => getCloudinaryConfig().uploadPreset);
  const [testUploadFile, setTestUploadFile] = useState<File | null>(null);
  const [isTestingUpload, setIsTestingUpload] = useState(false);
  const [testUploadProgress, setTestUploadProgress] = useState(0);
  const [testUploadResult, setTestUploadResult] = useState<any>(null);
  const [testUploadError, setTestUploadError] = useState('');

  const handleCheckFirebaseStatus = async () => {
    setIsCheckingStorage(true);
    try {
      const res = await checkFirebaseStorageStatus();
      setFirebaseStatus(res);
    } catch (e: any) {
      setFirebaseStatus({ status: 'error', message: e.message || 'Error checking status', bucket: '' });
    } finally {
      setIsCheckingStorage(false);
    }
  };

  const handleSaveCloudinary = (e: React.FormEvent) => {
    e.preventDefault();
    saveCloudinaryConfig(cldCloudName, cldPreset);
    showToast('Cloudinary credentials saved successfully.', 'success');
  };

  const handleRunTestUpload = async () => {
    if (!testUploadFile) return;
    setIsTestingUpload(true);
    setTestUploadProgress(10);
    setTestUploadError('');
    setTestUploadResult(null);

    try {
      const res = await uploadMediaFile(testUploadFile, {
        scope: 'products',
        identifier: 'test-sandbox',
        fileName: testUploadFile.name,
        optimize: true,
        onProgress: (p) => setTestUploadProgress(p)
      });
      setTestUploadResult(res);
      showToast('Media upload succeeded!', 'success');
    } catch (err: any) {
      setTestUploadError(err.message || 'Test upload failed.');
    } finally {
      setIsTestingUpload(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'STORAGE') {
      handleCheckFirebaseStatus();
    }
  }, [activeTab]);

  // Executive Admin Login Handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAdminLoggingIn(true);

    try {
      const res = await loginAdmin(adminEmail, adminPassword);
      if (res.success && res.user) {
        setUserProfile(res.user);
        showToast('Administrative privileges verified. Access granted.', 'success');
      } else {
        setAuthError(res.message || 'Invalid administrator username or security key.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication error.');
    } finally {
      setIsAdminLoggingIn(false);
    }
  };

  const handleFillDemoAdmin = () => {
    setAdminEmail('admin@valknutofficial.com');
    setAdminPassword('valknut2026');
    showToast('Loaded verified Executive Admin credentials (admin@valknutofficial.com)', 'info');
  };

  // Metrics Calculations
  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + o.totalAmount, 0), [orders]);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = useMemo(() => orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Payment Pending' || o.orderStatus === 'Processing').length, [orders]);
  const lowStockProducts = useMemo(() => products.filter(p => p.variants.some(v => (v.stock ?? 0) <= 5)), [products]);

  // Studio Orders Calculation
  const studioOrders = useMemo(() => {
    return orders.filter(o => {
      const hasStudio = o.items.some((it: any) => Boolean(it.customization));
      if (!hasStudio) return false;
      if (studioStatusFilter === 'ALL') return true;
      return o.orderStatus.toLowerCase() === studioStatusFilter.toLowerCase();
    });
  }, [orders, studioStatusFilter]);

  // Filtered Products Calculation
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchCategory = productCategoryFilter === 'ALL' || prod.category === productCategoryFilter;
      const q = productSearchQuery.trim().toLowerCase();
      const matchSearch = !q ||
        prod.name.toLowerCase().includes(q) ||
        prod.slug.toLowerCase().includes(q) ||
        prod.subCategory.toLowerCase().includes(q) ||
        prod.tags.some(t => t.toLowerCase().includes(q)) ||
        prod.variants.some(v => v.sku?.toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });
  }, [products, productCategoryFilter, productSearchQuery]);

  // Product Open Form
  const openProductForm = (p?: Product, defaultCategory?: CategoryType) => {
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
      const cat = defaultCategory || (productCategoryFilter !== 'ALL' ? productCategoryFilter : 'MEN');
      setEditingProduct(null);
      setProdName('');
      setProdSlug('');
      setProdPrice(cat === 'ESSENTIALS' ? 5200 : 8500);
      setProdSalePrice(undefined);
      setProdCategory(cat);
      setProdSubCategory(cat === 'ESSENTIALS' ? 'Accessories' : 'Oversized T-Shirts');
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

  // ==========================================
  // AUTHENTICATION GUARD SCREEN
  // ==========================================
  if (!isAuthorizedAdmin) {
    return (
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          backgroundColor: '#07080C',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 4 },
        }}
      >
        <Paper
          elevation={24}
          sx={{
            ...modernCardSx,
            maxWidth: 460,
            width: '100%',
            p: { xs: 3.5, sm: 5 },
            position: 'relative',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 40px rgba(212, 175, 55, 0.08)',
          }}
        >
          {/* Subtle gold ambient glow */}
          <Box
            sx={{
              position: 'absolute',
              top: -40,
              right: -40,
              width: 140,
              height: 140,
              borderRadius: '50%',
              bgcolor: 'rgba(212, 175, 55, 0.08)',
              filter: 'blur(30px)',
              pointerEvents: 'none',
            }}
          />

          <Box sx={{ textAlign: 'center', mb: 4, display: 'flex', flexDirection: 'col', alignItems: 'center' }}>
            <Box
              component="img"
              src={valknutLogo}
              alt="VALKNUT Sovereign Symbol"
              sx={{
                width: 68,
                height: 68,
                objectFit: 'contain',
                mx: 'auto',
                mb: 2.5,
                filter: 'drop-shadow(0 6px 20px rgba(212, 175, 55, 0.45))',
              }}
            />

            <Typography
              variant="overline"
              sx={{
                fontSize: '0.7rem',
                fontFamily: 'monospace',
                fontWeight: 800,
                letterSpacing: '0.25em',
                color: goldColor,
                textTransform: 'uppercase',
                display: 'block',
              }}
            >
              RESTRICTED VALKNUT ARCHIVE
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                textTransform: 'uppercase',
                fontFamily: '"Outfit", sans-serif',
                letterSpacing: '0.02em',
                color: '#F8FAFC',
                mt: 0.5,
                mb: 1,
              }}
            >
              ADMINISTRATIVE ACCESS
            </Typography>

            <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem', lineHeight: 1.5 }}>
              Database Row-Level Security Enforced. Customers must authenticate with verified admin credentials.
            </Typography>
          </Box>

          {authError && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                bgcolor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#F87171',
                fontSize: '0.8rem',
                '& .MuiAlert-icon': { color: '#F87171' },
              }}
            >
              {authError}
            </Alert>
          )}

          <form onSubmit={handleAdminLogin}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                fullWidth
                label="Admin Email Identifier"
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@valknutofficial.com"
                sx={darkInputSx}
              />

              <TextField
                fullWidth
                label="Security Password / Token"
                type={showAdminPass ? 'text' : 'password'}
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••••••"
                sx={darkInputSx}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowAdminPass(!showAdminPass)}
                          edge="end"
                          sx={{ color: '#94A3B8' }}
                        >
                          {showAdminPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                }}
              />

              <Button
                type="submit"
                fullWidth
                disabled={isAdminLoggingIn}
                startIcon={isAdminLoggingIn ? <CircularProgress size={16} color="inherit" /> : <ShieldCheck size={18} />}
                sx={{
                  bgcolor: goldColor,
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  letterSpacing: '0.08em',
                  py: 1.5,
                  borderRadius: '10px',
                  boxShadow: '0 6px 20px rgba(212, 175, 55, 0.3)',
                  textTransform: 'uppercase',
                  mt: 1,
                  '&:hover': {
                    bgcolor: goldHover,
                    boxShadow: '0 8px 24px rgba(212, 175, 55, 0.45)',
                  },
                }}
              >
                {isAdminLoggingIn ? 'AUTHENTICATING...' : 'AUTHORIZE ACCESS'}
              </Button>
            </Box>
          </form>

          <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, textAlign: 'center' }}>
            <Button
              variant="outlined"
              fullWidth
              size="small"
              onClick={handleFillDemoAdmin}
              sx={{
                color: goldColor,
                borderColor: 'rgba(212, 175, 55, 0.4)',
                borderRadius: '8px',
                fontSize: '0.75rem',
                textTransform: 'none',
                py: 1,
                '&:hover': {
                  borderColor: goldColor,
                  bgcolor: 'rgba(212, 175, 55, 0.1)',
                },
              }}
            >
              Use Verified Admin Credentials (admin@valknutofficial.com)
            </Button>

            <Button
              href="#/"
              sx={{
                color: '#94A3B8',
                fontSize: '0.75rem',
                textTransform: 'none',
                '&:hover': { color: '#FFFFFF' },
              }}
            >
              Return to VALKNUT Storefront
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  // ==========================================
  // FULL AUTHORIZED ADMIN OPERATIONS SUITE
  // ==========================================
  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#08090E', color: '#F8FAFC', pb: 10 }}>

      {/* Top Operations Header Bar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: 'rgba(14, 16, 23, 0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          top: 0,
          zIndex: 1100,
          py: 0.5,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', gap: 2, px: { xs: 2, sm: 4, lg: 6 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Box
              component="img"
              src={valknutLogo}
              alt="VALKNUT Official Logo"
              sx={{
                width: 40,
                height: 40,
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 10px rgba(212, 175, 55, 0.45))',
                flexShrink: 0,
              }}
            />
            <Box>
              <Typography
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 800,
                  letterSpacing: '0.22em',
                  color: goldColor,
                  textTransform: 'uppercase',
                  fontSize: '0.65rem',
                  lineHeight: 1.1,
                }}
              >
                VALKNUT MASTER CONTROL
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  fontFamily: '"Outfit", sans-serif',
                  letterSpacing: '0.02em',
                  fontSize: { xs: '0.95rem', sm: '1.15rem' },
                  color: '#F8FAFC',
                }}
              >
                EXECUTIVE SUITE
              </Typography>
            </Box>

            <Chip
              icon={<Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10B981', ml: 1 }} />}
              label="CLOUD SYNC ACTIVE"
              size="small"
              sx={{
                display: { xs: 'none', md: 'flex' },
                bgcolor: 'rgba(16, 185, 129, 0.12)',
                color: '#34D399',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontFamily: 'monospace',
                fontWeight: 700,
                fontSize: '0.65rem',
                height: 24,
              }}
            />
          </Box>

          {/* Action Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Button
              variant="outlined"
              size="small"
              endIcon={<ExternalLink size={14} />}
              onClick={() => (window.location.hash = '#/shop')}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.15)',
                color: '#E2E8F0',
                fontSize: '0.75rem',
                borderRadius: '8px',
                textTransform: 'uppercase',
                fontWeight: 700,
                px: 1.8,
                py: 0.8,
                '&:hover': {
                  borderColor: goldColor,
                  color: goldColor,
                  bgcolor: 'rgba(212, 175, 55, 0.08)',
                },
              }}
            >
              Live Store
            </Button>

            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 1 }} />

            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#F8FAFC', lineHeight: 1.2 }}>
                {user?.name || 'Administrator'}
              </Typography>
              <Typography sx={{ fontSize: '0.65rem', color: goldColor, fontFamily: 'monospace', fontWeight: 700 }}>
                SUPABASE FOUNDER
              </Typography>
            </Box>

            <Tooltip title="Exit Dashboard">
              <IconButton
                onClick={() => {
                  if (setIsAdminOpen) setIsAdminOpen(false);
                  window.location.hash = '#/';
                }}
                sx={{
                  color: '#94A3B8',
                  '&:hover': { color: '#EF4444', bgcolor: 'rgba(239, 68, 68, 0.1)' },
                }}
              >
                <XCircle size={20} />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Container */}
      <Box sx={{ maxWidth: 1720, mx: 'auto', px: { xs: 2, sm: 3, md: 4, lg: 6 }, pt: 3.5 }}>

        {/* Responsive MUI Navigation Bar */}
        <Paper
          elevation={0}
          sx={{
            ...modernCardSx,
            p: 0.75,
            mb: 4,
            border: '1px solid rgba(255, 255, 255, 0.09)',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: 46,
              '& .MuiTabs-indicator': {
                display: 'none',
              },
              '& .MuiTab-root': {
                minHeight: 42,
                borderRadius: '10px',
                px: { xs: 1.5, sm: 2 },
                py: 0.8,
                color: '#94A3B8',
                fontWeight: 700,
                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                textTransform: 'none',
                transition: 'all 0.2s ease',
                mr: 0.5,
                '&:hover': {
                  color: '#FFFFFF',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
                '&.Mui-selected': {
                  color: '#000000',
                  backgroundColor: goldColor,
                  boxShadow: '0 4px 14px rgba(212, 175, 55, 0.35)',
                },
              },
            }}
          >
            <Tab icon={<TrendingUp size={16} />} iconPosition="start" value="METRICS" label="Overview" />
            <Tab
              icon={<Package size={16} />}
              iconPosition="start"
              value="PRODUCTS"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>Products</span>
                  <Chip
                    size="small"
                    label={products.length}
                    sx={{
                      height: 18,
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      bgcolor: activeTab === 'PRODUCTS' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.1)',
                      color: 'inherit',
                    }}
                  />
                </Box>
              }
            />
            <Tab
              icon={<Palette size={16} />}
              iconPosition="start"
              value="STUDIOS"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>3D Studios</span>
                  <Chip
                    size="small"
                    label={studioOrders.length}
                    sx={{
                      height: 18,
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      bgcolor: activeTab === 'STUDIOS' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.1)',
                      color: 'inherit',
                    }}
                  />
                </Box>
              }
            />
            <Tab
              icon={<ShoppingBag size={16} />}
              iconPosition="start"
              value="ORDERS"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>Orders</span>
                  <Chip
                    size="small"
                    label={orders.length}
                    sx={{
                      height: 18,
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      bgcolor: activeTab === 'ORDERS' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.1)',
                      color: 'inherit',
                    }}
                  />
                </Box>
              }
            />
            <Tab icon={<Layers size={16} />} iconPosition="start" value="CATEGORIES" label="Categories" />
            <Tab icon={<Sparkles size={16} />} iconPosition="start" value="COLLECTIONS" label="Collections" />
            <Tab icon={<Users size={16} />} iconPosition="start" value="CUSTOMERS" label="Customers" />
            <Tab icon={<Tag size={16} />} iconPosition="start" value="COUPONS" label="Coupons" />
            <Tab icon={<Home size={16} />} iconPosition="start" value="HOMEPAGE" label="Homepage CMS" />
            <Tab icon={<Cloud size={16} />} iconPosition="start" value="STORAGE" label="Media Storage" />
            <Tab icon={<Database size={16} />} iconPosition="start" value="DATABASE" label="Database & SQL" />
          </Tabs>
        </Paper>

        {/* ========================================== */}
        {/* 1. METRICS & KPI OVERVIEW TAB */}
        {/* ========================================== */}
        {activeTab === 'METRICS' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            {/* KPI Matrix with Modern Colors and Full Responsiveness */}
            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
              {/* Gross Revenue */}
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card
                  sx={{
                    ...modernCardSx,
                    p: 3,
                    borderTop: `3px solid ${goldColor}`,
                    backgroundImage: 'radial-gradient(circle at top right, rgba(212, 175, 55, 0.12), transparent 70%), linear-gradient(145deg, #12141F 0%, #0E1017 100%)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontFamily: 'monospace', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.15em' }}>
                      GROSS REVENUE
                    </Typography>
                    <Box sx={{ p: 1, borderRadius: '8px', bgcolor: 'rgba(212, 175, 55, 0.15)', color: goldColor }}>
                      <TrendingUp size={18} />
                    </Box>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 900, fontFamily: 'monospace', color: '#F8FAFC', mb: 1 }}>
                    LKR {totalRevenue.toLocaleString()}
                  </Typography>
                  <Chip
                    icon={<Check size={13} style={{ color: '#10B981' }} />}
                    label="Verified Purchases"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(16, 185, 129, 0.12)',
                      color: '#34D399',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                    }}
                  />
                </Card>
              </Grid>

              {/* Total Completed Orders */}
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card
                  sx={{
                    ...modernCardSx,
                    p: 3,
                    borderTop: '3px solid #38BDF8',
                    backgroundImage: 'radial-gradient(circle at top right, rgba(56, 189, 248, 0.12), transparent 70%), linear-gradient(145deg, #12141F 0%, #0E1017 100%)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontFamily: 'monospace', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.15em' }}>
                      TOTAL ORDERS
                    </Typography>
                    <Box sx={{ p: 1, borderRadius: '8px', bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' }}>
                      <ShoppingBag size={18} />
                    </Box>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 900, fontFamily: 'monospace', color: goldColor, mb: 1 }}>
                    {totalOrdersCount}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                    {pendingOrdersCount} Pending Dispatch
                  </Typography>
                </Card>
              </Grid>

              {/* Registered Buyers */}
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card
                  sx={{
                    ...modernCardSx,
                    p: 3,
                    borderTop: '3px solid #10B981',
                    backgroundImage: 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.12), transparent 70%), linear-gradient(145deg, #12141F 0%, #0E1017 100%)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontFamily: 'monospace', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.15em' }}>
                      REGISTERED BUYERS
                    </Typography>
                    <Box sx={{ p: 1, borderRadius: '8px', bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
                      <Users size={18} />
                    </Box>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 900, fontFamily: 'monospace', color: '#F8FAFC', mb: 1 }}>
                    {customers.length}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#34D399', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                    100% Verified Customer Profiles
                  </Typography>
                </Card>
              </Grid>

              {/* Low-Stock Alerts */}
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card
                  sx={{
                    ...modernCardSx,
                    p: 3,
                    borderTop: `3px solid ${lowStockProducts.length > 0 ? '#F59E0B' : '#10B981'}`,
                    backgroundImage: `radial-gradient(circle at top right, ${lowStockProducts.length > 0 ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)'}, transparent 70%), linear-gradient(145deg, #12141F 0%, #0E1017 100%)`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontFamily: 'monospace', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.15em' }}>
                      LOW-STOCK ALERTS (≤ 5 PCS)
                    </Typography>
                    <Box sx={{ p: 1, borderRadius: '8px', bgcolor: lowStockProducts.length > 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: lowStockProducts.length > 0 ? '#F59E0B' : '#10B981' }}>
                      <AlertTriangle size={18} />
                    </Box>
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 900,
                      fontFamily: 'monospace',
                      color: lowStockProducts.length > 0 ? '#F59E0B' : '#34D399',
                      mb: 1,
                    }}
                  >
                    {lowStockProducts.length} Products
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                    {lowStockProducts.length > 0 ? 'Action required in warehouse' : 'Inventory levels healthy'}
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Split Section: Recent Orders (8 cols) & Low Stock Notices (4 cols) */}
            <Grid container spacing={{ xs: 2.5, md: 3 }}>
              {/* Recent Orders Stream */}
              <Grid size={{ xs: 12, lg: 8 }}>
                <Card sx={modernCardSx}>
                  <CardHeader
                    title={
                      <Typography sx={{ fontSize: '0.95rem', fontWeight: 900, textTransform: 'uppercase', fontFamily: '"Outfit", sans-serif', letterSpacing: '0.05em' }}>
                        RECENT ORDERS STREAM
                      </Typography>
                    }
                    action={
                      <Button
                        size="small"
                        onClick={() => setActiveTab('ORDERS')}
                        endIcon={<ChevronRight size={14} />}
                        sx={{ color: goldColor, fontSize: '0.75rem', fontWeight: 700, textTransform: 'none' }}
                      >
                        View All Orders
                      </Button>
                    }
                    sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', px: 3, py: 2 }}
                  />
                  <CardContent sx={{ p: 0 }}>
                    <TableContainer>
                      <Table sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid rgba(255, 255, 255, 0.05)', py: 2, px: 3 } }}>
                        <TableBody>
                          {orders.slice(0, 5).map((ord) => (
                            <TableRow key={ord.id} hover sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.03)' } }}>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                  <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', fontFamily: 'monospace' }}>
                                    {ord.orderNumber}
                                  </Typography>
                                  <Chip
                                    size="small"
                                    label={ord.paymentGateway}
                                    sx={{
                                      height: 20,
                                      fontSize: '0.65rem',
                                      bgcolor: 'rgba(255, 255, 255, 0.06)',
                                      color: '#94A3B8',
                                      border: '1px solid rgba(255, 255, 255, 0.1)',
                                    }}
                                  />
                                </Box>
                                <Typography sx={{ color: '#94A3B8', fontSize: '0.75rem', mt: 0.5 }}>
                                  {ord.customerInfo.fullName} • {ord.customerInfo.phone}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', fontFamily: 'monospace' }}>
                                  LKR {ord.totalAmount.toLocaleString()}
                                </Typography>
                                <Chip
                                  size="small"
                                  label={ord.orderStatus}
                                  sx={{
                                    height: 20,
                                    fontSize: '0.65rem',
                                    fontWeight: 800,
                                    mt: 0.5,
                                    bgcolor: ord.orderStatus === 'Delivered' ? 'rgba(16, 185, 129, 0.15)' : ord.orderStatus === 'Shipped' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                                    color: ord.orderStatus === 'Delivered' ? '#34D399' : ord.orderStatus === 'Shipped' ? goldColor : '#38BDF8',
                                    border: '1px solid',
                                    borderColor: ord.orderStatus === 'Delivered' ? 'rgba(16, 185, 129, 0.3)' : ord.orderStatus === 'Shipped' ? 'rgba(212, 175, 55, 0.3)' : 'rgba(56, 189, 248, 0.3)',
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Low Inventory Notices */}
              <Grid size={{ xs: 12, lg: 4 }}>
                <Card sx={modernCardSx}>
                  <CardHeader
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#F59E0B' }}>
                        <AlertTriangle size={18} />
                        <Typography sx={{ fontSize: '0.95rem', fontWeight: 900, textTransform: 'uppercase', fontFamily: '"Outfit", sans-serif', letterSpacing: '0.05em' }}>
                          LOW INVENTORY NOTICES
                        </Typography>
                      </Box>
                    }
                    sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', px: 3, py: 2 }}
                  />
                  <CardContent sx={{ p: 2.5 }}>
                    {lowStockProducts.length === 0 ? (
                      <Typography sx={{ fontSize: '0.8rem', color: '#94A3B8', py: 4, textAlign: 'center' }}>
                        All variant quantities are above minimum reorder thresholds.
                      </Typography>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {lowStockProducts.slice(0, 5).map((prod) => (
                          <Box
                            key={prod.id}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              p: 1.5,
                              bgcolor: 'rgba(255, 255, 255, 0.03)',
                              borderRadius: '10px',
                              border: '1px solid rgba(255, 255, 255, 0.05)',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Box
                                component="img"
                                src={prod.images[0]}
                                alt=""
                                sx={{ width: 42, height: 50, objectFit: 'cover', borderRadius: '6px', bgcolor: '#141620' }}
                              />
                              <Box sx={{ maxWidth: 140 }}>
                                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#F8FAFC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {prod.name}
                                </Typography>
                                <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                                  {prod.subCategory}
                                </Typography>
                              </Box>
                            </Box>

                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => openProductForm(prod)}
                              sx={{
                                color: goldColor,
                                borderColor: 'rgba(212, 175, 55, 0.4)',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                borderRadius: '6px',
                                py: 0.5,
                                px: 1.5,
                                '&:hover': { bgcolor: 'rgba(212, 175, 55, 0.1)', borderColor: goldColor },
                              }}
                            >
                              Restock
                            </Button>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* ========================================== */}
        {/* 2. PRODUCT MANAGEMENT TAB */}
        {/* ========================================== */}
        {activeTab === 'PRODUCTS' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Header and Quick Add Actions */}
            <Paper
              elevation={0}
              sx={{
                ...modernCardSx,
                p: { xs: 2.5, sm: 3 },
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: 'space-between',
                gap: 2.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(212, 175, 55, 0.15)', color: goldColor }}>
                  <Package size={24} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'uppercase', fontFamily: '"Outfit", sans-serif' }}>
                    PRODUCT CATALOG REPOSITORY
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                    Manage heavyweight luxury garments, size charts, variant stocks, and specs.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => openProductForm(undefined, 'MEN')}
                  sx={{ borderColor: 'rgba(212, 175, 55, 0.4)', color: goldColor, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}
                >
                  + Add Men's
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => openProductForm(undefined, 'WOMEN')}
                  sx={{ borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38BDF8', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}
                >
                  + Add Women's
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => openProductForm(undefined, 'ESSENTIALS')}
                  sx={{ borderColor: 'rgba(16, 185, 129, 0.4)', color: '#10B981', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}
                >
                  + Add Essentials
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Plus size={16} />}
                  onClick={() => openProductForm()}
                  sx={{
                    bgcolor: goldColor,
                    color: '#000000',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    borderRadius: '8px',
                    px: 2.5,
                    py: 1,
                    boxShadow: '0 4px 14px rgba(212, 175, 55, 0.35)',
                    '&:hover': { bgcolor: goldHover },
                  }}
                >
                  NEW ITEM
                </Button>
              </Box>
            </Paper>

            {/* Filters & Search Toolbar */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'stretch', md: 'center' },
                justifyContent: 'space-between',
                gap: 2,
                p: 2,
                bgcolor: '#0E1017',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                {(['ALL', 'MEN', 'WOMEN', 'ESSENTIALS'] as const).map((cat) => {
                  const count = cat === 'ALL' ? products.length : products.filter(p => p.category === cat).length;
                  const isSelected = productCategoryFilter === cat;
                  return (
                    <Chip
                      key={cat}
                      label={`${cat} (${count})`}
                      onClick={() => setProductCategoryFilter(cat)}
                      sx={{
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        bgcolor: isSelected ? goldColor : 'rgba(255, 255, 255, 0.05)',
                        color: isSelected ? '#000000' : '#94A3B8',
                        border: '1px solid',
                        borderColor: isSelected ? goldColor : 'rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          bgcolor: isSelected ? goldHover : 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    />
                  );
                })}
              </Box>

              <TextField
                size="small"
                value={productSearchQuery}
                onChange={(e) => setProductSearchQuery(e.target.value)}
                placeholder="Filter by name, SKU, category..."
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={16} style={{ color: '#94A3B8' }} />
                      </InputAdornment>
                    ),
                  }
                }}
                sx={{ ...darkInputSx, minWidth: { xs: '100%', md: 320 } }}
              />
            </Box>

            {/* Products Data Table */}
            <TableContainer component={Paper} sx={{ ...modernCardSx, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <Table sx={{ minWidth: 700 }}>
                <TableHead sx={{ bgcolor: '#121420' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#94A3B8', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Garment</TableCell>
                    <TableCell sx={{ color: '#94A3B8', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Category / Collection</TableCell>
                    <TableCell sx={{ color: '#94A3B8', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Price</TableCell>
                    <TableCell sx={{ color: '#94A3B8', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Variants & Stock</TableCell>
                    <TableCell sx={{ color: '#94A3B8', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status Badges</TableCell>
                    <TableCell align="right" sx={{ color: '#94A3B8', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.map((prod) => {
                    const totalStock = prod.variants.reduce((sum, v) => sum + (v.stock ?? 0), 0);
                    const isLowStock = totalStock <= 10;

                    return (
                      <TableRow key={prod.id} hover sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.03)' } }}>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                              component="img"
                              src={prod.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80'}
                              alt=""
                              sx={{ width: 48, height: 58, objectFit: 'cover', borderRadius: '8px', bgcolor: '#141620', border: '1px solid rgba(255, 255, 255, 0.1)', flexShrink: 0 }}
                            />
                            <Box>
                              <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#F8FAFC', textTransform: 'uppercase' }}>
                                {prod.name}
                              </Typography>
                              <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8', fontFamily: 'monospace' }}>
                                SKU: {prod.variants[0]?.sku || prod.slug}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <Typography sx={{ color: goldColor, fontWeight: 700, fontSize: '0.8rem' }}>
                            {prod.category}
                          </Typography>
                          <Typography sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>
                            {prod.subCategory}
                          </Typography>
                          {prod.collection && (
                            <Typography sx={{ color: '#64748B', fontSize: '0.65rem', textTransform: 'uppercase' }}>
                              {prod.collection}
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', fontFamily: 'monospace' }}>
                            LKR {prod.price.toLocaleString()}
                          </Typography>
                          {prod.salePrice && (
                            <Typography sx={{ color: '#34D399', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                              Sale: LKR {prod.salePrice.toLocaleString()}
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <Chip
                            size="small"
                            label={`${totalStock} units`}
                            sx={{
                              height: 22,
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              bgcolor: isLowStock ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                              color: isLowStock ? '#F59E0B' : '#E2E8F0',
                              border: '1px solid',
                              borderColor: isLowStock ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                            }}
                          />
                          <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8', mt: 0.5 }}>
                            {prod.variants.length} Variants
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            {prod.isNewArrival && <Chip size="small" label="NEW" sx={{ height: 20, fontSize: '0.65rem', bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)' }} />}
                            {prod.isBestSeller && <Chip size="small" label="BESTSELLER" sx={{ height: 20, fontSize: '0.65rem', bgcolor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.3)' }} />}
                            {prod.isCustomizable && <Chip size="small" label="STUDIO" sx={{ height: 20, fontSize: '0.65rem', bgcolor: 'rgba(212, 175, 55, 0.15)', color: goldColor, border: '1px solid rgba(212, 175, 55, 0.3)' }} />}
                          </Box>
                        </TableCell>

                        <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <Tooltip title="Edit Product">
                            <IconButton onClick={() => openProductForm(prod)} size="small" sx={{ color: '#94A3B8', '&:hover': { color: '#FFFFFF', bgcolor: 'rgba(255, 255, 255, 0.08)' } }}>
                              <Edit2 size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Product">
                            <IconButton onClick={() => setDeleteConfirmTarget({ type: 'product', id: prod.id, name: prod.name })} size="small" sx={{ color: '#EF4444', ml: 1, '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.15)' } }}>
                              <Trash2 size={16} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* ========================================== */}
        {/* 3. 3D CUSTOM STUDIOS & BESPOKE COMMISSIONS */}
        {/* ========================================== */}
        {activeTab === 'STUDIOS' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper
              elevation={0}
              sx={{
                ...modernCardSx,
                p: { xs: 2.5, sm: 3 },
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(212, 175, 55, 0.15)', color: goldColor }}>
                  <Palette size={24} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'uppercase', fontFamily: '"Outfit", sans-serif' }}>
                    BESPOKE 3D APPAREL STUDIO COMMISSIONS
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                    Manage customized heavyweight hoodies, oversized tees, client vector uploads, and 3D puff rubber prints.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                {['ALL', 'Pending', 'Processing', 'Shipped', 'Delivered'].map((st) => (
                  <Chip
                    key={st}
                    label={st.toUpperCase()}
                    onClick={() => setStudioStatusFilter(st)}
                    size="small"
                    sx={{
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      bgcolor: studioStatusFilter === st ? goldColor : 'rgba(255, 255, 255, 0.05)',
                      color: studioStatusFilter === st ? '#000000' : '#94A3B8',
                      border: '1px solid',
                      borderColor: studioStatusFilter === st ? goldColor : 'rgba(255, 255, 255, 0.1)',
                    }}
                  />
                ))}
              </Box>
            </Paper>

            {studioOrders.length === 0 ? (
              <Card sx={{ ...modernCardSx, p: 6, textAlign: 'center' }}>
                <Palette size={44} style={{ color: '#64748B', margin: '0 auto 16px' }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#E2E8F0', mb: 1 }}>
                  NO BESPOKE STUDIO COMMISSIONS FOUND
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8', maxWidth: 460, mx: 'auto', mb: 3 }}>
                  When customers design customized garments in the Interactive Custom Studio, their specifications, artwork uploads, and print placement instructions will appear here.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (setIsAdminOpen) setIsAdminOpen(false);
                    window.location.hash = '#/custom-studio';
                  }}
                  sx={{ bgcolor: goldColor, color: '#000000', fontWeight: 800, '&:hover': { bgcolor: goldHover } }}
                >
                  Open Custom Studio Storefront
                </Button>
              </Card>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {studioOrders.map((order) => {
                  const customItems = order.items.filter((it: any) => Boolean(it.customization));

                  return (
                    <Card key={order.id} sx={modernCardSx}>
                      <CardHeader
                        title={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: 'rgba(212, 175, 55, 0.15)', color: goldColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.8rem' }}>
                              3D
                            </Box>
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Typography sx={{ fontWeight: 900, fontSize: '0.95rem', fontFamily: 'monospace' }}>
                                  {order.orderNumber}
                                </Typography>
                                <Chip size="small" label={order.orderStatus} sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, bgcolor: 'rgba(212, 175, 55, 0.15)', color: goldColor }} />
                              </Box>
                              <Typography sx={{ color: '#94A3B8', fontSize: '0.75rem', mt: 0.3 }}>
                                Client: <strong style={{ color: '#F8FAFC' }}>{order.customerInfo.fullName}</strong> • Mobile: {order.customerInfo.phone} • Email: {order.customerInfo.email}
                              </Typography>
                            </Box>
                          </Box>
                        }
                        action={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pt: 1 }}>
                            <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', fontFamily: 'monospace', color: goldColor }}>
                              Total: LKR {order.totalAmount.toLocaleString()}
                            </Typography>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                setSelectedOrderForAwb(order);
                                setAwbNumberInput(order.awbNumber || '');
                                setAwbCourier(order.courierName || 'Pronto Lanka Express');
                                setAwbStatusSelect(order.orderStatus);
                              }}
                              sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: '#E2E8F0', fontSize: '0.75rem', borderRadius: '8px' }}
                            >
                              Dispatch AWB
                            </Button>
                          </Box>
                        }
                        sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', px: 3, py: 2 }}
                      />
                      <CardContent sx={{ p: 3 }}>
                        <Grid container spacing={2}>
                          {customItems.map((item: any, idx: number) => {
                            const cust = item.customization;
                            return (
                              <Grid size={{ xs: 12, md: 6 }} key={idx}>
                                <Paper sx={{ p: 2.5, bgcolor: '#121420', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                                    <Box>
                                      <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#F8FAFC' }}>
                                        {item.productName || item.product?.name || 'VALKNUT Bespoke Garment'}
                                      </Typography>
                                      <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                                        Size: <strong style={{ color: '#FFFFFF' }}>{item.selectedSize || item.size}</strong> • Color: <strong style={{ color: '#FFFFFF' }}>{item.selectedColor || item.color}</strong> • Qty: {item.quantity}
                                      </Typography>
                                    </Box>
                                    <Chip size="small" label={cust?.printTechnique || '3D Puff Rubber'} sx={{ bgcolor: goldColor, color: '#000000', fontWeight: 800, fontSize: '0.7rem' }} />
                                  </Box>

                                  <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.4)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <Typography sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>PRINT PLACEMENT:</Typography>
                                      <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#F8FAFC' }}>{cust?.placement || 'FRONT CHEST'}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <Typography sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>TECHNIQUE FEE:</Typography>
                                      <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', color: goldColor }}>+LKR {(cust?.techniqueFee || 0).toLocaleString()}</Typography>
                                    </Box>

                                    {cust?.customText && (
                                      <Box sx={{ pt: 1, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                        <Typography sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>CUSTOM TYPOGRAPHY:</Typography>
                                        <Typography sx={{ fontWeight: 800, color: '#FFFFFF', fontStyle: 'italic', fontSize: '0.85rem' }}>
                                          "{cust.customText}"
                                        </Typography>
                                        <Typography sx={{ color: '#64748B', fontSize: '0.7rem' }}>
                                          Font: {cust.textFont || 'Outfit'} • Color: {cust.textColor || goldColor} • Size: {cust.textSize || 24}px
                                        </Typography>
                                      </Box>
                                    )}

                                    {cust?.uploadedArtworkUrl && (
                                      <Box sx={{ pt: 1, borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                          <Box component="img" src={cust.uploadedArtworkUrl} alt="" sx={{ width: 36, height: 36, objectFit: 'contain', borderRadius: '4px', bgcolor: 'rgba(255, 255, 255, 0.1)', p: 0.5 }} />
                                          <Box>
                                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#F8FAFC' }}>Client Artwork</Typography>
                                            <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8' }}>{cust.artworkName || 'Custom Vector'}</Typography>
                                          </Box>
                                        </Box>
                                        <Button
                                          size="small"
                                          href={cust.uploadedArtworkUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                          endIcon={<ExternalLink size={12} />}
                                          sx={{ color: goldColor, fontSize: '0.7rem', fontWeight: 700 }}
                                        >
                                          View File
                                        </Button>
                                      </Box>
                                    )}
                                  </Box>
                                </Paper>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            )}
          </Box>
        )}

        {/* ========================================== */}
        {/* 4. ORDERS & FULFILLMENT TAB */}
        {/* ========================================== */}
        {activeTab === 'ORDERS' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper
              elevation={0}
              sx={{
                ...modernCardSx,
                p: { xs: 2.5, sm: 3 },
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(212, 175, 55, 0.15)', color: goldColor }}>
                    <ShoppingBag size={24} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'uppercase', fontFamily: '"Outfit", sans-serif' }}>
                      ORDER FULFILLMENT & COURIER DISPATCH
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                      Real-time status changes, Air Waybill tracking assignment, and courier integration.
                    </Typography>
                  </Box>
                </Box>

                {/* Status Tabs Quick Filter */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  {['ALL', 'Pending', 'Payment Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                    <Chip
                      key={st}
                      label={st.toUpperCase()}
                      onClick={() => setOrderStatusFilter(st)}
                      size="small"
                      sx={{
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        bgcolor: orderStatusFilter === st ? goldColor : 'rgba(255, 255, 255, 0.05)',
                        color: orderStatusFilter === st ? '#000000' : '#94A3B8',
                        border: '1px solid',
                        borderColor: orderStatusFilter === st ? goldColor : 'rgba(255, 255, 255, 0.1)',
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <TextField
                fullWidth
                size="small"
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                placeholder="Search by Order # (e.g. VK-2026-8801), Customer Name, Mobile Phone, or Email..."
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={16} style={{ color: '#94A3B8' }} />
                      </InputAdornment>
                    ),
                  }
                }}
                sx={darkInputSx}
              />
            </Paper>

            {/* Orders Feed Table */}
            <TableContainer component={Paper} sx={{ ...modernCardSx, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <Table sx={{ minWidth: 800 }}>
                <TableHead sx={{ bgcolor: '#121420' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#94A3B8', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Order Ref</TableCell>
                    <TableCell sx={{ color: '#94A3B8', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Customer & Destination</TableCell>
                    <TableCell sx={{ color: '#94A3B8', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Items</TableCell>
                    <TableCell sx={{ color: '#94A3B8', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Total & Gateway</TableCell>
                    <TableCell sx={{ color: '#94A3B8', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Order Status</TableCell>
                    <TableCell sx={{ color: '#94A3B8', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Courier / AWB</TableCell>
                    <TableCell align="right" sx={{ color: '#94A3B8', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Dispatch</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6, color: '#94A3B8' }}>
                        No orders matched the active filter criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((ord) => (
                      <TableRow key={ord.id} hover sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.03)' } }}>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', fontFamily: 'monospace' }}>
                            {ord.orderNumber}
                          </Typography>
                          <Typography sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#F8FAFC' }}>
                            {ord.customerInfo.fullName}
                          </Typography>
                          <Typography sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>
                            {ord.customerInfo.city}, {ord.customerInfo.district}
                          </Typography>
                          <Typography sx={{ color: '#64748B', fontSize: '0.7rem' }}>
                            {ord.customerInfo.phone}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.8rem' }}>
                            {ord.items.reduce((s, i) => s + i.quantity, 0)} Pcs
                          </Typography>
                          <Typography sx={{ color: '#94A3B8', fontSize: '0.7rem', maxWidth: 140, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {ord.items[0]?.productName || 'Garment'}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', fontFamily: 'monospace', color: goldColor }}>
                            LKR {ord.totalAmount.toLocaleString()}
                          </Typography>
                          <Typography sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>
                            {ord.paymentGateway} ({ord.paymentStatus})
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <Select
                            size="small"
                            value={ord.orderStatus}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            sx={{
                              bgcolor: '#121420',
                              color: '#F8FAFC',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              height: 32,
                              borderRadius: '6px',
                              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                            }}
                          >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Payment Pending">Payment Pending</MenuItem>
                            <MenuItem value="Payment Confirmed">Payment Confirmed</MenuItem>
                            <MenuItem value="Processing">Processing</MenuItem>
                            <MenuItem value="Packed">Packed</MenuItem>
                            <MenuItem value="Shipped">Shipped</MenuItem>
                            <MenuItem value="Delivered">Delivered</MenuItem>
                            <MenuItem value="Cancelled">Cancelled</MenuItem>
                          </Select>
                        </TableCell>

                        <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          {ord.awbNumber ? (
                            <Box>
                              <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', fontFamily: 'monospace' }}>
                                {ord.awbNumber}
                              </Typography>
                              <Typography sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>
                                {ord.courierName || 'Courier'}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography sx={{ color: '#F59E0B', fontSize: '0.75rem', fontWeight: 700 }}>
                              Unassigned
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setSelectedOrderForAwb(ord);
                              setAwbCourier(ord.courierName || 'Pronto Lanka Express');
                              setAwbNumberInput(ord.awbNumber || '');
                              setAwbTrackingLinkInput(ord.trackingLink || '');
                              setAwbStatusSelect(ord.orderStatus);
                            }}
                            sx={{
                              color: goldColor,
                              borderColor: 'rgba(212, 175, 55, 0.4)',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              borderRadius: '6px',
                              '&:hover': { bgcolor: 'rgba(212, 175, 55, 0.1)', borderColor: goldColor },
                            }}
                          >
                            Dispatch AWB
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* ========================================== */}
        {/* 5. CATEGORY MANAGEMENT TAB */}
        {/* ========================================== */}
        {activeTab === 'CATEGORIES' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper
              elevation={0}
              sx={{
                ...modernCardSx,
                p: { xs: 2.5, sm: 3 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(212, 175, 55, 0.15)', color: goldColor }}>
                  <Layers size={24} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'uppercase', fontFamily: '"Outfit", sans-serif' }}>
                    STOREFRONT CATEGORIES & TAXONOMIES
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                    Configure parent categories, sub-classifications, and SEO metadata.
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                startIcon={<Plus size={16} />}
                onClick={() => openCategoryForm()}
                sx={{
                  bgcolor: goldColor,
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: '0.8rem',
                  borderRadius: '8px',
                  px: 2.5,
                  py: 1,
                  boxShadow: '0 4px 14px rgba(212, 175, 55, 0.35)',
                  '&:hover': { bgcolor: goldHover },
                }}
              >
                CREATE CATEGORY
              </Button>
            </Paper>

            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
              {categories.map((cat) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cat.id}>
                  <Card sx={{ ...modernCardSx, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: '0.7rem', color: goldColor, fontWeight: 800, fontFamily: 'monospace' }}>
                          PARENT: {cat.parentCategory}
                        </Typography>
                        <Chip size="small" label="ACTIVE" sx={{ height: 20, fontSize: '0.65rem', bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontWeight: 800 }} />
                      </Box>

                      <Typography variant="h6" sx={{ fontWeight: 800, textTransform: 'uppercase', color: '#F8FAFC' }}>
                        {cat.name}
                      </Typography>

                      <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem', lineHeight: 1.5 }}>
                        {cat.description || 'No description provided.'}
                      </Typography>

                      {cat.seoTitle && (
                        <Box sx={{ p: 1.5, bgcolor: '#121420', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <Typography sx={{ fontSize: '0.65rem', color: goldColor, fontWeight: 800 }}>SEO TITLE</Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: '#E2E8F0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {cat.seoTitle}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'monospace' }}>
                        /{cat.slug}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" onClick={() => openCategoryForm(cat)} sx={{ color: '#94A3B8', '&:hover': { color: '#FFFFFF' } }}>
                          <Edit2 size={15} />
                        </IconButton>
                        <IconButton size="small" onClick={() => setDeleteConfirmTarget({ type: 'category', id: cat.id, name: cat.name })} sx={{ color: '#EF4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.15)' } }}>
                          <Trash2 size={15} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* ========================================== */}
        {/* 6. COLLECTION MANAGEMENT TAB */}
        {/* ========================================== */}
        {activeTab === 'COLLECTIONS' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper
              elevation={0}
              sx={{
                ...modernCardSx,
                p: { xs: 2.5, sm: 3 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(212, 175, 55, 0.15)', color: goldColor }}>
                  <Sparkles size={24} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'uppercase', fontFamily: '"Outfit", sans-serif' }}>
                    EDITORIAL COLLECTIONS & DROPS
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                    Group pieces into themed drops like Shadow Ops 2026 and Stealth Labs.
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                startIcon={<Plus size={16} />}
                onClick={() => openCollectionForm()}
                sx={{
                  bgcolor: goldColor,
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: '0.8rem',
                  borderRadius: '8px',
                  px: 2.5,
                  py: 1,
                  boxShadow: '0 4px 14px rgba(212, 175, 55, 0.35)',
                  '&:hover': { bgcolor: goldHover },
                }}
              >
                CREATE COLLECTION
              </Button>
            </Paper>

            <Grid container spacing={{ xs: 2.5, md: 3 }}>
              {collections.map((col) => (
                <Grid size={{ xs: 12, md: 6 }} key={col.id}>
                  <Card sx={{ ...modernCardSx, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ height: 180, position: 'relative', bgcolor: '#121420', overflow: 'hidden' }}>
                      <Box component="img" src={col.imageUrl} alt={col.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0E1017 0%, transparent 70%)' }} />
                      <Chip
                        size="small"
                        label={`RELEASE: ${col.releaseDate || '2026'}`}
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          bgcolor: 'rgba(0,0,0,0.85)',
                          color: goldColor,
                          border: '1px solid rgba(212, 175, 55, 0.4)',
                          fontWeight: 800,
                          fontSize: '0.65rem',
                          fontFamily: 'monospace',
                        }}
                      />
                    </Box>

                    <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, textTransform: 'uppercase', color: '#F8FAFC' }}>
                          {col.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem', mt: 1 }}>
                          {col.description}
                        </Typography>
                        <Chip
                          size="small"
                          label={`${col.productIds.length} Assigned Garments`}
                          sx={{ mt: 2, bgcolor: 'rgba(255, 255, 255, 0.06)', color: '#E2E8F0', fontSize: '0.7rem', fontWeight: 700 }}
                        />
                      </Box>

                      <Box sx={{ pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'monospace' }}>
                          /{col.slug}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" onClick={() => openCollectionForm(col)} sx={{ color: '#94A3B8', '&:hover': { color: '#FFFFFF' } }}>
                            <Edit2 size={15} />
                          </IconButton>
                          <IconButton size="small" onClick={() => setDeleteConfirmTarget({ type: 'collection', id: col.id, name: col.name })} sx={{ color: '#EF4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.15)' } }}>
                            <Trash2 size={15} />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* ========================================== */}
        {/* 7. CUSTOMERS MANAGEMENT TAB */}
        {/* ========================================== */}
        {activeTab === 'CUSTOMERS' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper
              elevation={0}
              sx={{
                ...modernCardSx,
                p: { xs: 2.5, sm: 3 },
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(212, 175, 55, 0.15)', color: goldColor }}>
                <Users size={24} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'uppercase', fontFamily: '"Outfit", sans-serif' }}>
                  CUSTOMER DIRECTORY & PURCHASE PROFILES
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                  View verified client histories, total lifetime expenditure, and Sri Lanka delivery destinations.
                </Typography>
              </Box>
            </Paper>

            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
              {customers.map((c) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={c.id}>
                  <Card sx={{ ...modernCardSx, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ width: 42, height: 42, borderRadius: '50%', bgcolor: '#121420', border: '1px solid rgba(255, 255, 255, 0.1)', color: goldColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                            {c.fullName.charAt(0).toUpperCase()}
                          </Box>
                          <Box>
                            <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#F8FAFC' }}>
                              {c.fullName}
                            </Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                              {c.email}
                            </Typography>
                          </Box>
                        </Box>

                        {c.isAdmin && (
                          <Chip size="small" label="ADMIN" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, bgcolor: 'rgba(212, 175, 55, 0.15)', color: goldColor, border: '1px solid rgba(212, 175, 55, 0.3)' }} />
                        )}
                      </Box>

                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, p: 2, bgcolor: '#121420', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <Box>
                          <Typography sx={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 800 }}>ORDERS</Typography>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#F8FAFC', fontFamily: 'monospace' }}>
                            {c.ordersCount}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 800 }}>SPENT</Typography>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: goldColor, fontFamily: 'monospace' }}>
                            LKR {c.totalSpent.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>
                        <Typography sx={{ fontSize: '0.75rem' }}>Tel: {c.phone}</Typography>
                        {c.address && (
                          <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mt: 0.5 }}>
                            {c.address.city}, {c.address.district}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      onClick={() => setViewingCustomer(c)}
                      sx={{
                        color: '#E2E8F0',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        fontSize: '0.75rem',
                        borderRadius: '8px',
                        py: 0.8,
                        '&:hover': { borderColor: goldColor, color: goldColor, bgcolor: 'rgba(212, 175, 55, 0.08)' },
                      }}
                    >
                      View Order History
                    </Button>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* ========================================== */}
        {/* 8. COUPONS & DISCOUNTS TAB */}
        {/* ========================================== */}
        {activeTab === 'COUPONS' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper
              elevation={0}
              sx={{
                ...modernCardSx,
                p: { xs: 2.5, sm: 3 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(212, 175, 55, 0.15)', color: goldColor }}>
                  <Tag size={24} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'uppercase', fontFamily: '"Outfit", sans-serif' }}>
                    PROMOTIONS & DISCOUNT RULES
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                    Configure percentage discounts, fixed vouchers, usage caps, and expiration limits.
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                startIcon={<Plus size={16} />}
                onClick={() => setIsCouponModalOpen(true)}
                sx={{
                  bgcolor: goldColor,
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: '0.8rem',
                  borderRadius: '8px',
                  px: 2.5,
                  py: 1,
                  boxShadow: '0 4px 14px rgba(212, 175, 55, 0.35)',
                  '&:hover': { bgcolor: goldHover },
                }}
              >
                CREATE COUPON
              </Button>
            </Paper>

            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
              {coupons.map((cpn) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cpn.code}>
                  <Card sx={{ ...modernCardSx, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontWeight: 900, fontSize: '1.15rem', color: goldColor, fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                          {cpn.code}
                        </Typography>
                        <Chip
                          size="small"
                          label={cpn.active ? 'ACTIVE' : 'INACTIVE'}
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            bgcolor: cpn.active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: cpn.active ? '#34D399' : '#F87171',
                          }}
                        />
                      </Box>

                      <Box sx={{ p: 2, bgcolor: '#121420', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Discount:</Typography>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', color: '#F8FAFC' }}>
                            {cpn.discountType === 'PERCENTAGE' ? `${cpn.discountValue}% OFF` : `LKR ${cpn.discountValue.toLocaleString()} OFF`}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Min Order:</Typography>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#F8FAFC' }}>
                            LKR {cpn.minOrderAmount.toLocaleString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Expires:</Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                            {cpn.expiryDate}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontSize: '0.7rem', color: '#64748B', fontFamily: 'monospace' }}>
                        Limit: {cpn.usageLimit || 'Unlimited'}
                      </Typography>
                      <IconButton size="small" onClick={() => setDeleteConfirmTarget({ type: 'coupon', id: cpn.code, name: cpn.code })} sx={{ color: '#EF4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.15)' } }}>
                        <Trash2 size={16} />
                      </IconButton>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* ========================================== */}
        {/* 9. HOMEPAGE CMS TAB */}
        {/* ========================================== */}
        {activeTab === 'HOMEPAGE' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper
              elevation={0}
              sx={{
                ...modernCardSx,
                p: { xs: 2.5, sm: 3 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(212, 175, 55, 0.15)', color: goldColor }}>
                  <Home size={24} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'uppercase', fontFamily: '"Outfit", sans-serif' }}>
                    STOREFRONT HOMEPAGE CMS & SECTION CONTROLS
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                    Live hero banners, editorial announcements, and component visibility toggles.
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                onClick={() => {
                  saveAdminHomepageConfig(homepageConfig);
                  showToast('Homepage CMS settings updated successfully.', 'success');
                }}
                sx={{
                  bgcolor: goldColor,
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: '0.8rem',
                  borderRadius: '8px',
                  px: 3,
                  py: 1,
                  boxShadow: '0 4px 14px rgba(212, 175, 55, 0.35)',
                  '&:hover': { bgcolor: goldHover },
                }}
              >
                SAVE CMS CHANGES
              </Button>
            </Paper>

            <Grid container spacing={{ xs: 2.5, md: 3 }}>
              {/* Hero Banner Controls */}
              <Grid size={{ xs: 12, lg: 6 }}>
                <Card sx={{ ...modernCardSx, p: 3.5, height: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, textTransform: 'uppercase', mb: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.08)', pb: 1.5 }}>
                    1. Hero Section Banner
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                      fullWidth
                      label="Headline Text"
                      value={homepageConfig.hero.headline}
                      onChange={(e) => setHomepageConfig({ ...homepageConfig, hero: { ...homepageConfig.hero, headline: e.target.value } })}
                      sx={darkInputSx}
                    />

                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Subheadline Description"
                      value={homepageConfig.hero.subheadline}
                      onChange={(e) => setHomepageConfig({ ...homepageConfig, hero: { ...homepageConfig.hero, subheadline: e.target.value } })}
                      sx={darkInputSx}
                    />

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="CTA Button Text"
                          value={homepageConfig.hero.ctaText}
                          onChange={(e) => setHomepageConfig({ ...homepageConfig, hero: { ...homepageConfig.hero, ctaText: e.target.value } })}
                          sx={darkInputSx}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="CTA Destination Link"
                          value={homepageConfig.hero.ctaLink}
                          onChange={(e) => setHomepageConfig({ ...homepageConfig, hero: { ...homepageConfig.hero, ctaLink: e.target.value } })}
                          sx={darkInputSx}
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 1 }}>
                      <SingleImageUploader
                        label="Hero Background Banner"
                        imageUrl={homepageConfig.hero.bannerImage}
                        onChange={(url) => setHomepageConfig({ ...homepageConfig, hero: { ...homepageConfig.hero, bannerImage: url } })}
                        scope="homepage"
                        identifier="hero-banner"
                      />
                    </Box>
                  </Box>
                </Card>
              </Grid>

              {/* Section Visibility Controls */}
              <Grid size={{ xs: 12, lg: 6 }}>
                <Card sx={{ ...modernCardSx, p: 3.5, height: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, textTransform: 'uppercase', mb: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.08)', pb: 1.5 }}>
                    2. Section Visibility Toggles
                  </Typography>

                  <Grid container spacing={2}>
                    {Object.entries(homepageConfig.sectionsVisibility).map(([key, val]) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={key}>
                        <Paper
                          sx={{
                            p: 2,
                            bgcolor: '#121420',
                            borderRadius: '10px',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'capitalize' }}>
                            {key.replace(/([A-Z])/g, ' $1')}
                          </Typography>
                          <Switch
                            checked={val}
                            onChange={(e) => {
                              const updated = { ...homepageConfig.sectionsVisibility, [key]: e.target.checked };
                              setHomepageConfig({ ...homepageConfig, sectionsVisibility: updated });
                            }}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: goldColor,
                                '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.1)' },
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: goldColor,
                              },
                            }}
                          />
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* ========================================== */}
        {/* 10. MEDIA & CLOUD STORAGE TAB */}
        {/* ========================================== */}
        {activeTab === 'STORAGE' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper
              elevation={0}
              sx={{
                ...modernCardSx,
                p: { xs: 2.5, sm: 3 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(212, 175, 55, 0.15)', color: goldColor }}>
                  <Cloud size={24} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'uppercase', fontFamily: '"Outfit", sans-serif' }}>
                    MEDIA & CLOUD STORAGE INFRASTRUCTURE
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                    Configure Firebase Storage, Cloudinary CDN, and inspect bucket readiness to eliminate Supabase egress constraints.
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="outlined"
                size="small"
                onClick={handleCheckFirebaseStatus}
                disabled={isCheckingStorage}
                startIcon={<RefreshCw size={14} className={isCheckingStorage ? 'animate-spin' : ''} />}
                sx={{
                  color: '#E2E8F0',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  '&:hover': { borderColor: goldColor, color: goldColor },
                }}
              >
                {isCheckingStorage ? 'Testing Connection...' : 'Check Bucket Status'}
              </Button>
            </Paper>

            <Grid container spacing={{ xs: 2.5, md: 3 }}>
              {/* Firebase Cloud Storage */}
              <Grid size={{ xs: 12, lg: 6 }}>
                <Card sx={{ ...modernCardSx, p: 3.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', pb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <HardDrive size={22} style={{ color: goldColor }} />
                        <Typography variant="h6" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>
                          Firebase Cloud Storage
                        </Typography>
                      </Box>
                      {firebaseStatus?.status === 'online' ? (
                        <Chip label="BUCKET ONLINE" size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontWeight: 800, fontSize: '0.7rem' }} />
                      ) : firebaseStatus?.status === 'unprovisioned' ? (
                        <Chip label="NEEDS PROVISIONING (404)" size="small" sx={{ bgcolor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', fontWeight: 800, fontSize: '0.7rem' }} />
                      ) : (
                        <Chip label="INITIALIZED IN .ENV" size="small" sx={{ bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', fontWeight: 800, fontSize: '0.7rem' }} />
                      )}
                    </Box>

                    <Box sx={{ p: 2.5, bgcolor: '#121420', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>Project ID:</Typography>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', fontFamily: 'monospace' }}>valknut-c8268</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>Target Bucket:</Typography>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', fontFamily: 'monospace', color: goldColor }}>valknut-c8268.firebasestorage.app</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>Status:</Typography>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', color: firebaseStatus?.status === 'online' ? '#34D399' : '#F59E0B' }}>
                          {firebaseStatus?.message || 'Ready for test check.'}
                        </Typography>
                      </Box>
                    </Box>

                    {firebaseStatus?.status === 'unprovisioned' && (
                      <Alert severity="warning" sx={{ bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#FDE68A', border: '1px solid rgba(245, 158, 11, 0.3)', fontSize: '0.75rem' }}>
                        <strong>Firebase Storage Bucket Not Created Yet:</strong> In Firebase Console, go to Storage &rarr; Get Started &rarr; Done.
                      </Alert>
                    )}
                  </Box>

                  <Box sx={{ pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      endIcon={<ExternalLink size={14} />}
                      onClick={() => window.open('https://console.firebase.google.com/project/valknut-c8268/storage', '_blank')}
                      sx={{ color: goldColor, borderColor: 'rgba(212, 175, 55, 0.4)', fontSize: '0.75rem', borderRadius: '8px' }}
                    >
                      Open Firebase Console
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => {
                        navigator.clipboard.writeText(FIREBASE_STORAGE_RULES);
                        showToast('Firebase Security Rules copied.', 'success');
                      }}
                      sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.75rem', borderRadius: '8px', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.18)' } }}
                    >
                      Copy Storage Rules
                    </Button>
                  </Box>
                </Card>
              </Grid>

              {/* Cloudinary Global CDN */}
              <Grid size={{ xs: 12, lg: 6 }}>
                <Card sx={{ ...modernCardSx, p: 3.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', pb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Server size={22} style={{ color: '#38BDF8' }} />
                        <Typography variant="h6" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>
                          Cloudinary Global CDN
                        </Typography>
                      </Box>
                      {isCloudinaryConfigured() ? (
                        <Chip label="CLOUDINARY ACTIVE" size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontWeight: 800, fontSize: '0.7rem' }} />
                      ) : (
                        <Chip label="OPTIONAL CDN" size="small" sx={{ bgcolor: 'rgba(255, 255, 255, 0.06)', color: '#94A3B8', fontWeight: 800, fontSize: '0.7rem' }} />
                      )}
                    </Box>

                    <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem', lineHeight: 1.5 }}>
                      Cloudinary provides 25GB free monthly bandwidth with automatic WebP/AVIF compression.
                    </Typography>

                    <form onSubmit={handleSaveCloudinary}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Cloud Name"
                          value={cldCloudName}
                          onChange={(e) => setCldCloudName(e.target.value)}
                          placeholder="e.g. valknut-media"
                          sx={darkInputSx}
                        />

                        <TextField
                          fullWidth
                          size="small"
                          label="Unsigned Upload Preset"
                          value={cldPreset}
                          onChange={(e) => setCldPreset(e.target.value)}
                          placeholder="e.g. valknut_uploads"
                          sx={darkInputSx}
                        />

                        <Button
                          type="submit"
                          variant="contained"
                          sx={{ bgcolor: goldColor, color: '#000000', fontWeight: 800, fontSize: '0.8rem', borderRadius: '8px', py: 1, '&:hover': { bgcolor: goldHover } }}
                        >
                          Save & Activate Cloudinary
                        </Button>
                      </Box>
                    </form>
                  </Box>

                  <Box sx={{ pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>Need an account?</Typography>
                    <Button
                      size="small"
                      endIcon={<ExternalLink size={14} />}
                      onClick={() => window.open('https://cloudinary.com/users/register_free', '_blank')}
                      sx={{ color: '#38BDF8', fontSize: '0.75rem', fontWeight: 700 }}
                    >
                      Create Free Cloudinary Account
                    </Button>
                  </Box>
                </Card>
              </Grid>

              {/* Upload Sandbox */}
              <Grid size={{ xs: 12 }}>
                <Card sx={{ ...modernCardSx, p: 3.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, textTransform: 'uppercase', mb: 2.5, borderBottom: '1px solid rgba(255, 255, 255, 0.08)', pb: 1.5 }}>
                    Live Cloud Upload Verification Sandbox
                  </Typography>

                  <Grid container spacing={3} sx={{ alignItems: 'center' }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box
                        onClick={() => document.getElementById('test-file-input')?.click()}
                        sx={{
                          border: '2px dashed rgba(255, 255, 255, 0.15)',
                          borderRadius: '12px',
                          p: 4,
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          bgcolor: 'rgba(255, 255, 255, 0.02)',
                          '&:hover': { borderColor: goldColor, bgcolor: 'rgba(212, 175, 55, 0.03)' },
                        }}
                      >
                        <input
                          id="test-file-input"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setTestUploadFile(e.target.files?.[0] || null)}
                          style={{ display: 'none' }}
                        />
                        <Upload size={32} style={{ color: goldColor, margin: '0 auto 8px' }} />
                        <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#F8FAFC' }}>
                          {testUploadFile ? testUploadFile.name : 'Select or Drop a Test Image'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mt: 0.5 }}>
                          {testUploadFile ? `${(testUploadFile.size / 1024).toFixed(1)} KB` : 'JPG, PNG, WEBP (Max 10MB)'}
                        </Typography>
                      </Box>

                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handleRunTestUpload}
                        disabled={!testUploadFile || isTestingUpload}
                        sx={{
                          mt: 2,
                          bgcolor: goldColor,
                          color: '#000000',
                          fontWeight: 800,
                          borderRadius: '8px',
                          py: 1.2,
                          '&:hover': { bgcolor: goldHover },
                        }}
                      >
                        {isTestingUpload ? `Uploading (${testUploadProgress}%)...` : 'Run Cloud Upload Test'}
                      </Button>

                      {isTestingUpload && <LinearProgress sx={{ mt: 1.5, borderRadius: 1, bgcolor: 'rgba(255, 255, 255, 0.1)', '& .MuiLinearProgress-bar': { bgcolor: goldColor } }} />}

                      {testUploadError && (
                        <Alert severity="error" sx={{ mt: 1.5, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '0.75rem' }}>
                          {testUploadError}
                        </Alert>
                      )}
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Paper sx={{ p: 3, bgcolor: '#121420', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', minHeight: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        {testUploadResult ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#34D399' }}>
                              <Check size={18} />
                              <Typography sx={{ fontWeight: 800, fontSize: '0.85rem' }}>Upload Succeeded!</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box component="img" src={testUploadResult.url} alt="" sx={{ width: 56, height: 56, objectFit: 'cover', borderRadius: '8px' }} />
                              <Box sx={{ overflow: 'hidden' }}>
                                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#F8FAFC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {testUploadResult.fileName}
                                </Typography>
                                <Typography sx={{ fontSize: '0.7rem', color: goldColor, fontFamily: 'monospace' }}>
                                  {(testUploadResult.sizeBytes / 1024).toFixed(1)} KB • {testUploadResult.type}
                                </Typography>
                              </Box>
                            </Box>

                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                navigator.clipboard.writeText(testUploadResult.url);
                                showToast('CDN URL copied to clipboard.', 'success');
                              }}
                              sx={{ color: goldColor, borderColor: 'rgba(212, 175, 55, 0.4)', borderRadius: '6px', fontSize: '0.75rem' }}
                            >
                              Copy CDN URL
                            </Button>
                          </Box>
                        ) : (
                          <Box sx={{ textAlign: 'center', color: '#64748B' }}>
                            <Cloud size={32} style={{ margin: '0 auto 8px' }} />
                            <Typography sx={{ fontSize: '0.8rem', fontWeight: 700 }}>No test upload performed yet</Typography>
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* ========================================== */}
        {/* 11. DATABASE & SUPABASE TAB */}
        {/* ========================================== */}
        {activeTab === 'DATABASE' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Supabase Schema */}
            <Card sx={{ ...modernCardSx, p: 3.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Database size={24} style={{ color: goldColor }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>
                      SUPABASE DATABASE & RLS POLICIES
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                      Cloud schema with 11 tables and hardened Row-Level Security policies.
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  startIcon={copiedSql ? <Check size={16} /> : <Copy size={16} />}
                  onClick={handleCopySql}
                  sx={{ bgcolor: goldColor, color: '#000000', fontWeight: 800, fontSize: '0.8rem', borderRadius: '8px', '&:hover': { bgcolor: goldHover } }}
                >
                  {copiedSql ? 'COPIED SQL' : 'COPY SUPABASE SQL'}
                </Button>
              </Box>

              <Box sx={{ p: 2.5, bgcolor: '#07080C', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)', maxHeight: 320, overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.75rem', color: '#94A3B8', whiteSpace: 'pre' }}>
                {SUPABASE_SETUP_SQL}
              </Box>
            </Card>

            {/* Storage Rules */}
            <Card sx={{ ...modernCardSx, p: 3.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Cloud size={24} style={{ color: goldColor }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>
                      FIREBASE CLOUD STORAGE RULES
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                      Production security rules for products, categories, collections, and custom customer artwork.
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  startIcon={copiedStorageRules ? <Check size={16} /> : <Copy size={16} />}
                  onClick={() => {
                    navigator.clipboard.writeText(FIREBASE_STORAGE_RULES);
                    setCopiedStorageRules(true);
                    setTimeout(() => setCopiedStorageRules(false), 2000);
                  }}
                  sx={{ bgcolor: goldColor, color: '#000000', fontWeight: 800, fontSize: '0.8rem', borderRadius: '8px', '&:hover': { bgcolor: goldHover } }}
                >
                  {copiedStorageRules ? 'COPIED RULES' : 'COPY STORAGE RULES'}
                </Button>
              </Box>

              <Box sx={{ p: 2.5, bgcolor: '#07080C', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)', maxHeight: 260, overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.75rem', color: '#94A3B8', whiteSpace: 'pre' }}>
                {FIREBASE_STORAGE_RULES}
              </Box>
            </Card>
          </Box>
        )}

      </Box>

      {/* ========================================== */}
      {/* PRODUCT CREATE/EDIT DIALOG */}
      {/* ========================================== */}
      <Dialog
        open={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: '#0E1017',
              backgroundImage: 'linear-gradient(145deg, #121420 0%, #0E1017 100%)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '16px',
              color: '#F8FAFC',
            },
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'rgba(212, 175, 55, 0.15)', color: goldColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={22} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.7rem', color: goldColor, fontWeight: 800, letterSpacing: '0.15em', fontFamily: 'monospace' }}>
                {editingProduct ? 'GARMENT EDITOR' : 'NEW CATALOG ADDITION'}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>
                {editingProduct ? editingProduct.name : 'Create Luxury Streetwear Garment'}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setIsProductModalOpen(false)} sx={{ color: '#94A3B8', '&:hover': { color: '#FFFFFF' } }}>
            <XCircle size={22} />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSaveProduct}>
          <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', p: 3.5, display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            {/* 1. Garment Identity */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: goldColor, letterSpacing: '0.1em' }}>
                1. GARMENT IDENTITY & CLASSIFICATION
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    required
                    label="Product Name"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    sx={darkInputSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="URL Slug (auto-generated if empty)"
                    value={prodSlug}
                    onChange={(e) => setProdSlug(e.target.value)}
                    sx={darkInputSx}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth size="small" sx={darkInputSx}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={prodCategory}
                      label="Category"
                      onChange={(e) => setProdCategory(e.target.value as CategoryType)}
                    >
                      <MenuItem value="MEN">MEN</MenuItem>
                      <MenuItem value="WOMEN">WOMEN</MenuItem>
                      <MenuItem value="ESSENTIALS">ESSENTIALS</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth size="small" sx={darkInputSx}>
                    <InputLabel>Subcategory</InputLabel>
                    <Select
                      value={prodSubCategory}
                      label="Subcategory"
                      onChange={(e) => setProdSubCategory(e.target.value as SubCategoryType)}
                    >
                      <MenuItem value="Oversized T-Shirts">Oversized T-Shirts</MenuItem>
                      <MenuItem value="T-Shirts">T-Shirts</MenuItem>
                      <MenuItem value="Hoodies">Hoodies</MenuItem>
                      <MenuItem value="Tops">Tops</MenuItem>
                      <MenuItem value="Joggers">Joggers</MenuItem>
                      <MenuItem value="Jeans">Jeans</MenuItem>
                      <MenuItem value="Accessories">Accessories</MenuItem>
                      <MenuItem value="Core products">Core products</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Collection / Season"
                    value={prodCollection}
                    onChange={(e) => setProdCollection(e.target.value)}
                    sx={darkInputSx}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* 2. Pricing & Fabric Engineering */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: goldColor, letterSpacing: '0.1em' }}>
                2. PRICING & FABRIC ENGINEERING
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    required
                    label="Regular Price (LKR)"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    sx={darkInputSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    label="Sale Price (LKR, optional)"
                    value={prodSalePrice || ''}
                    onChange={(e) => setProdSalePrice(e.target.value ? Number(e.target.value) : undefined)}
                    sx={darkInputSx}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Fabric Composition & GSM Weight"
                    value={prodMaterial}
                    onChange={(e) => setProdMaterial(e.target.value)}
                    placeholder="e.g. 100% Combed Organic Heavy Cotton (480 GSM)"
                    sx={darkInputSx}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    size="small"
                    label="Garment Description"
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                    sx={darkInputSx}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Care & Wash Instructions"
                    value={prodCare}
                    onChange={(e) => setProdCare(e.target.value)}
                    sx={darkInputSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Search Tags (Comma-separated)"
                    value={prodTags}
                    onChange={(e) => setProdTags(e.target.value)}
                    sx={darkInputSx}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* 3. Media Gallery */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: goldColor, letterSpacing: '0.1em' }}>
                3. PRODUCT MEDIA & LOOKBOOK PHOTOS
              </Typography>
              <ProductImageManager
                productId={editingProduct?.id || prodSlug || 'new-product'}
                images={prodImages}
                onChange={(newImgs) => setProdImages(newImgs)}
              />
            </Box>

            {/* 4. Variants Matrix */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: goldColor, letterSpacing: '0.1em' }}>
                  4. SIZE & COLOR VARIANTS ({prodVariants.length})
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
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
                  sx={{ color: goldColor, borderColor: 'rgba(212, 175, 55, 0.4)', fontSize: '0.75rem', borderRadius: '6px' }}
                >
                  + Add Variant
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {prodVariants.map((v, idx) => (
                  <Paper key={v.id || idx} sx={{ p: 2, bgcolor: '#121420', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <Grid container spacing={1.5} sx={{ alignItems: 'center' }}>
                      <Grid size={{ xs: 6, sm: 2 }}>
                        <FormControl fullWidth size="small" sx={darkInputSx}>
                          <InputLabel>Size</InputLabel>
                          <Select
                            value={v.size}
                            label="Size"
                            onChange={(e) => {
                              const copy = [...prodVariants];
                              copy[idx].size = e.target.value as any;
                              setProdVariants(copy);
                            }}
                          >
                            <MenuItem value="S">S</MenuItem>
                            <MenuItem value="M">M</MenuItem>
                            <MenuItem value="L">L</MenuItem>
                            <MenuItem value="XL">XL</MenuItem>
                            <MenuItem value="XXL">XXL</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 6, sm: 3 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Color Name"
                          value={v.color}
                          onChange={(e) => {
                            const copy = [...prodVariants];
                            copy[idx].color = e.target.value;
                            setProdVariants(copy);
                          }}
                          sx={darkInputSx}
                        />
                      </Grid>

                      <Grid size={{ xs: 6, sm: 3 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="SKU Code"
                          value={v.sku}
                          onChange={(e) => {
                            const copy = [...prodVariants];
                            copy[idx].sku = e.target.value;
                            setProdVariants(copy);
                          }}
                          sx={darkInputSx}
                        />
                      </Grid>

                      <Grid size={{ xs: 4, sm: 2 }}>
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          label="Stock"
                          value={v.stock}
                          onChange={(e) => {
                            const copy = [...prodVariants];
                            copy[idx].stock = Number(e.target.value);
                            setProdVariants(copy);
                          }}
                          sx={darkInputSx}
                        />
                      </Grid>

                      <Grid size={{ xs: 2, sm: 2 }} sx={{ textAlign: 'right' }}>
                        <IconButton
                          size="small"
                          onClick={() => setProdVariants(prodVariants.filter((_, i) => i !== idx))}
                          sx={{ color: '#EF4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.15)' } }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Box>
            </Box>

            {/* 5. Merchandising Flags */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControlLabel
                control={<Checkbox checked={prodIsNewArrival} onChange={(e) => setProdIsNewArrival(e.target.checked)} sx={{ color: goldColor, '&.Mui-checked': { color: goldColor } }} />}
                label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 700 }}>New Arrival</Typography>}
              />
              <FormControlLabel
                control={<Checkbox checked={prodIsBestSeller} onChange={(e) => setProdIsBestSeller(e.target.checked)} sx={{ color: goldColor, '&.Mui-checked': { color: goldColor } }} />}
                label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 700 }}>Best Seller</Typography>}
              />
              <FormControlLabel
                control={<Checkbox checked={prodIsCustomizable} onChange={(e) => setProdIsCustomizable(e.target.checked)} sx={{ color: goldColor, '&.Mui-checked': { color: goldColor } }} />}
                label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 700 }}>3D Custom Studio</Typography>}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Button onClick={() => setIsProductModalOpen(false)} sx={{ color: '#94A3B8' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: goldColor, color: '#000000', fontWeight: 900, px: 3, '&:hover': { bgcolor: goldHover } }}
            >
              {editingProduct ? 'Save Changes' : 'Publish Garment'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ========================================== */}
      {/* AWB & LOGISTICS MODAL */}
      {/* ========================================== */}
      <Dialog
        open={Boolean(selectedOrderForAwb)}
        onClose={() => setSelectedOrderForAwb(null)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: '#0E1017',
              backgroundImage: 'linear-gradient(145deg, #121420 0%, #0E1017 100%)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '16px',
              color: '#F8FAFC',
            },
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: goldColor, fontWeight: 800, fontFamily: 'monospace' }}>
              COURIER DISPATCH UPDATE
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {selectedOrderForAwb?.orderNumber}
            </Typography>
          </Box>
          <IconButton onClick={() => setSelectedOrderForAwb(null)} sx={{ color: '#94A3B8' }}>
            <XCircle size={20} />
          </IconButton>
        </DialogTitle>

        {selectedOrderForAwb && (
          <form onSubmit={handleSaveAwbUpdate}>
            <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <FormControl fullWidth size="small" sx={darkInputSx}>
                <InputLabel>Select Courier Partner</InputLabel>
                <Select
                  value={awbCourier}
                  label="Select Courier Partner"
                  onChange={(e) => setAwbCourier(e.target.value)}
                >
                  <MenuItem value="Pronto Lanka Express">Pronto Lanka Express</MenuItem>
                  <MenuItem value="Fargo Express">Fargo Express</MenuItem>
                  <MenuItem value="Domex Courier">Domex Courier</MenuItem>
                  <MenuItem value="Direct VIP Courier">Direct VIP Courier</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                size="small"
                required
                label="Air Waybill (AWB) / Tracking #"
                value={awbNumberInput}
                onChange={(e) => setAwbNumberInput(e.target.value)}
                placeholder="PRN-99882103"
                sx={darkInputSx}
              />

              <TextField
                fullWidth
                size="small"
                label="Tracking URL (Optional)"
                value={awbTrackingLinkInput}
                onChange={(e) => setAwbTrackingLinkInput(e.target.value)}
                placeholder="https://valknutofficial.com/#/track-order"
                sx={darkInputSx}
              />

              <FormControl fullWidth size="small" sx={darkInputSx}>
                <InputLabel>Update Order Status</InputLabel>
                <Select
                  value={awbStatusSelect}
                  label="Update Order Status"
                  onChange={(e) => setAwbStatusSelect(e.target.value as OrderStatus)}
                >
                  <MenuItem value="Packed">Packed (Awaiting pickup)</MenuItem>
                  <MenuItem value="Shipped">Shipped (Dispatched to Courier)</MenuItem>
                  <MenuItem value="Delivered">Delivered (Handed over to Customer)</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>

            <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <Button onClick={() => setSelectedOrderForAwb(null)} sx={{ color: '#94A3B8' }}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ bgcolor: goldColor, color: '#000000', fontWeight: 900, px: 3, '&:hover': { bgcolor: goldHover } }}
              >
                SAVE & DISPATCH
              </Button>
            </DialogActions>
          </form>
        )}
      </Dialog>

      {/* ========================================== */}
      {/* CATEGORY CREATE/EDIT DIALOG */}
      {/* ========================================== */}
      <Dialog
        open={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: '#0E1017',
              backgroundImage: 'linear-gradient(145deg, #121420 0%, #0E1017 100%)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '16px',
              color: '#F8FAFC',
            },
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: goldColor, fontWeight: 800, fontFamily: 'monospace' }}>
              CATEGORY CONFIGURATION
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {editingCategory ? `Edit "${editingCategory.name}"` : 'Create New Category'}
            </Typography>
          </Box>
          <IconButton onClick={() => setIsCategoryModalOpen(false)} sx={{ color: '#94A3B8' }}>
            <XCircle size={20} />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSaveCategory}>
          <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  required
                  label="Category Name"
                  value={catName}
                  onChange={(e) => {
                    setCatName(e.target.value);
                    if (!editingCategory) {
                      setCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  sx={darkInputSx}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="URL Slug"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  sx={darkInputSx}
                />
              </Grid>
            </Grid>

            <FormControl fullWidth size="small" sx={darkInputSx}>
              <InputLabel>Parent Classification</InputLabel>
              <Select
                value={catParent}
                label="Parent Classification"
                onChange={(e) => setCatParent(e.target.value as any)}
              >
                <MenuItem value="ROOT">Root Department</MenuItem>
                <MenuItem value="MEN">Men Collection</MenuItem>
                <MenuItem value="WOMEN">Women Collection</MenuItem>
                <MenuItem value="ESSENTIALS">Essentials & Accessories</MenuItem>
              </Select>
            </FormControl>

            <SingleImageUploader
              label="Category Cover Image"
              imageUrl={catImage}
              onChange={(url) => setCatImage(url)}
              scope="categories"
              identifier={catSlug || 'category'}
            />

            <TextField
              fullWidth
              multiline
              rows={2}
              size="small"
              label="Description"
              value={catDescription}
              onChange={(e) => setCatDescription(e.target.value)}
              sx={darkInputSx}
            />

            <TextField
              fullWidth
              size="small"
              label="SEO Title"
              value={catSeoTitle}
              onChange={(e) => setCatSeoTitle(e.target.value)}
              sx={darkInputSx}
            />

            <TextField
              fullWidth
              multiline
              rows={2}
              size="small"
              label="SEO Meta Description"
              value={catSeoDesc}
              onChange={(e) => setCatSeoDesc(e.target.value)}
              sx={darkInputSx}
            />
          </DialogContent>

          <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Button onClick={() => setIsCategoryModalOpen(false)} sx={{ color: '#94A3B8' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: goldColor, color: '#000000', fontWeight: 900, px: 3, '&:hover': { bgcolor: goldHover } }}
            >
              {editingCategory ? 'SAVE CATEGORY' : 'CREATE CATEGORY'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ========================================== */}
      {/* COLLECTION CREATE/EDIT DIALOG */}
      {/* ========================================== */}
      <Dialog
        open={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: '#0E1017',
              backgroundImage: 'linear-gradient(145deg, #121420 0%, #0E1017 100%)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '16px',
              color: '#F8FAFC',
            },
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: goldColor, fontWeight: 800, fontFamily: 'monospace' }}>
              EDITORIAL DROP & COLLECTION
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {editingCollection ? `Edit "${editingCollection.name}"` : 'Create New Collection'}
            </Typography>
          </Box>
          <IconButton onClick={() => setIsCollectionModalOpen(false)} sx={{ color: '#94A3B8' }}>
            <XCircle size={20} />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSaveCollection}>
          <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  required
                  label="Collection Title"
                  value={colName}
                  onChange={(e) => {
                    setColName(e.target.value);
                    if (!editingCollection) {
                      setColSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  sx={darkInputSx}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="URL Slug"
                  value={colSlug}
                  onChange={(e) => setColSlug(e.target.value)}
                  sx={darkInputSx}
                />
              </Grid>
            </Grid>

            <SingleImageUploader
              label="Collection Campaign Banner"
              imageUrl={colImage}
              onChange={(url) => setColImage(url)}
              scope="collections"
              identifier={colSlug || 'collection'}
            />

            <TextField
              fullWidth
              multiline
              rows={2}
              size="small"
              label="Editorial Concept"
              value={colDescription}
              onChange={(e) => setColDescription(e.target.value)}
              sx={darkInputSx}
            />

            <Box sx={{ p: 2, bgcolor: '#121420', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)', maxHeight: 180, overflowY: 'auto' }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: goldColor, mb: 1.5 }}>
                Assign Products ({colSelectedProducts.length})
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {products.map((p) => {
                  const isSelected = colSelectedProducts.includes(p.id);
                  return (
                    <FormControlLabel
                      key={p.id}
                      control={
                        <Checkbox
                          size="small"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setColSelectedProducts([...colSelectedProducts, p.id]);
                            } else {
                              setColSelectedProducts(colSelectedProducts.filter(id => id !== p.id));
                            }
                          }}
                          sx={{ color: goldColor, '&.Mui-checked': { color: goldColor } }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2 }}>
                          <Typography sx={{ fontSize: '0.8rem', color: '#F8FAFC' }}>{p.name}</Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>LKR {p.price.toLocaleString()}</Typography>
                        </Box>
                      }
                      sx={{ mx: 0 }}
                    />
                  );
                })}
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Button onClick={() => setIsCollectionModalOpen(false)} sx={{ color: '#94A3B8' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: goldColor, color: '#000000', fontWeight: 900, px: 3, '&:hover': { bgcolor: goldHover } }}
            >
              {editingCollection ? 'SAVE COLLECTION' : 'CREATE COLLECTION'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ========================================== */}
      {/* COUPON CREATE DIALOG */}
      {/* ========================================== */}
      <Dialog
        open={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: '#0E1017',
              backgroundImage: 'linear-gradient(145deg, #121420 0%, #0E1017 100%)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '16px',
              color: '#F8FAFC',
            },
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: goldColor, fontWeight: 800, fontFamily: 'monospace' }}>
              DISCOUNT VOUCHER CONFIGURATION
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Create Promotional Coupon
            </Typography>
          </Box>
          <IconButton onClick={() => setIsCouponModalOpen(false)} sx={{ color: '#94A3B8' }}>
            <XCircle size={20} />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSaveCoupon}>
          <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              fullWidth
              size="small"
              required
              label="Coupon Promo Code"
              value={newCouponCode}
              onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
              placeholder="e.g. VALK2026"
              sx={darkInputSx}
            />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small" sx={darkInputSx}>
                  <InputLabel>Discount Type</InputLabel>
                  <Select
                    value={newCouponType}
                    label="Discount Type"
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                  >
                    <MenuItem value="PERCENTAGE">Percentage (%) Off</MenuItem>
                    <MenuItem value="FIXED">Fixed Amount (LKR) Off</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  required
                  label={newCouponType === 'PERCENTAGE' ? 'Discount %' : 'Discount LKR'}
                  value={newCouponDiscount}
                  onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                  sx={darkInputSx}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Min Order (LKR)"
                  value={newCouponMinOrder}
                  onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                  sx={darkInputSx}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Usage Limit"
                  value={newCouponUsageLimit}
                  onChange={(e) => setNewCouponUsageLimit(Number(e.target.value))}
                  sx={darkInputSx}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Expiry Date"
                  value={newCouponExpiry}
                  onChange={(e) => setNewCouponExpiry(e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={darkInputSx}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Button onClick={() => setIsCouponModalOpen(false)} sx={{ color: '#94A3B8' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: goldColor, color: '#000000', fontWeight: 900, px: 3, '&:hover': { bgcolor: goldHover } }}
            >
              CREATE COUPON
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ========================================== */}
      {/* CUSTOMER PROFILE & ORDER HISTORY DIALOG */}
      {/* ========================================== */}
      <Dialog
        open={Boolean(viewingCustomer)}
        onClose={() => setViewingCustomer(null)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: '#0E1017',
              backgroundImage: 'linear-gradient(145deg, #121420 0%, #0E1017 100%)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '16px',
              color: '#F8FAFC',
            },
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: goldColor, fontWeight: 800, fontFamily: 'monospace' }}>
              CUSTOMER PURCHASE RECORD
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {viewingCustomer?.fullName}
            </Typography>
          </Box>
          <IconButton onClick={() => setViewingCustomer(null)} sx={{ color: '#94A3B8' }}>
            <XCircle size={20} />
          </IconButton>
        </DialogTitle>

        {viewingCustomer && (
          <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Grid container spacing={2} sx={{ p: 2, bgcolor: '#121420', borderRadius: '10px' }}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography sx={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 800 }}>EMAIL</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {viewingCustomer.email}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography sx={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 800 }}>MOBILE</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700 }}>{viewingCustomer.phone}</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography sx={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 800 }}>ORDERS</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 800 }}>{viewingCustomer.ordersCount}</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography sx={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 800 }}>SPENT</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: goldColor }}>LKR {viewingCustomer.totalSpent.toLocaleString()}</Typography>
              </Grid>
            </Grid>

            {viewingCustomer.address && (
              <Box sx={{ p: 2, bgcolor: '#121420', borderRadius: '10px' }}>
                <Typography sx={{ fontSize: '0.65rem', color: goldColor, fontWeight: 800, mb: 0.5 }}>DELIVERY DESTINATION</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#E2E8F0' }}>
                  {viewingCustomer.address.addressLine1}, {viewingCustomer.address.city}, {viewingCustomer.address.district} ({viewingCustomer.address.postalCode})
                </Typography>
              </Box>
            )}

            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', mb: 1.5, letterSpacing: '0.05em' }}>
                ORDER HISTORY LOG
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 220, overflowY: 'auto' }}>
                {orders.filter((o) => o.customerInfo.email.toLowerCase() === viewingCustomer.email.toLowerCase()).length === 0 ? (
                  <Typography sx={{ fontSize: '0.8rem', color: '#64748B', py: 2 }}>No placed orders recorded for this account yet.</Typography>
                ) : (
                  orders.filter((o) => o.customerInfo.email.toLowerCase() === viewingCustomer.email.toLowerCase()).map((o) => (
                    <Paper key={o.id} sx={{ p: 1.5, bgcolor: '#121420', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', fontFamily: 'monospace' }}>{o.orderNumber}</Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#64748B' }}>{new Date(o.createdAt).toLocaleDateString()}</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', color: goldColor, fontFamily: 'monospace' }}>LKR {o.totalAmount.toLocaleString()}</Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase' }}>{o.orderStatus}</Typography>
                      </Box>
                    </Paper>
                  ))
                )}
              </Box>
            </Box>
          </DialogContent>
        )}

        <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Button onClick={() => setViewingCustomer(null)} sx={{ color: '#E2E8F0', bgcolor: 'rgba(255, 255, 255, 0.08)' }}>
            Close Customer File
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================== */}
      {/* DELETE CONFIRMATION DIALOG */}
      {/* ========================================== */}
      <Dialog
        open={Boolean(deleteConfirmTarget)}
        onClose={() => setDeleteConfirmTarget(null)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: '#0E1017',
              backgroundImage: 'linear-gradient(145deg, #181216 0%, #0E1017 100%)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '16px',
              color: '#F8FAFC',
              p: 1,
            },
          }
        }}
      >
        <DialogContent sx={{ textAlign: 'center', py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ width: 52, height: 52, borderRadius: '50%', bgcolor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Trash2 size={26} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'uppercase', mb: 1 }}>
            Confirm Deletion
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.85rem' }}>
            Are you sure you want to permanently delete <strong style={{ color: '#F8FAFC' }}>"{deleteConfirmTarget?.name}"</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, justifyContent: 'center', gap: 2 }}>
          <Button onClick={() => setDeleteConfirmTarget(null)} sx={{ color: '#94A3B8' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={executeDelete}
            sx={{ bgcolor: '#EF4444', color: '#FFFFFF', fontWeight: 800, '&:hover': { bgcolor: '#DC2626' } }}
          >
            CONFIRM DELETE
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};
