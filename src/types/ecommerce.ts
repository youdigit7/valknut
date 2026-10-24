export type CategoryType = 'MEN' | 'WOMEN' | 'ESSENTIALS';

export type SubCategoryType = 
  | 'Oversized T-Shirts' 
  | 'T-Shirts' 
  | 'Hoodies' 
  | 'Tops' 
  | 'Pants' 
  | 'Joggers' 
  | 'Jeans' 
  | 'Activewear' 
  | 'Accessories'
  | 'Core products'
  | 'Everyday essentials';

export type StandardProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
export type ProductSize = StandardProductSize | 'One Size' | 'Free Size' | (string & {});
export type SizeOption = ProductSize;

export interface ProductVariant {
  id: string;
  size: ProductSize;
  color: string;
  colorHex: string;
  sku: string;
  stock: number;
  stockCount?: number;
  price?: number;
  salePrice?: number;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  material: string;
  careInstructions: string;
  price: number;
  salePrice?: number;
  category: CategoryType;
  subCategory: SubCategoryType;
  collection?: string;
  images: string[];
  tags: string[];
  variants: ProductVariant[];
  isCustomizable?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  isLimitedEdition?: boolean;
  createdAt: string;
}

export interface ProductMediaItem {
  id: string;
  productId: string;
  url: string;
  storagePath?: string;
  mediaType?: 'image' | 'video';
  sortOrder: number;
  altText?: string;
  isPrimary: boolean;
  createdAt: string;
}

export type PrintTechniqueType = 
  | 'Screen Print' 
  | 'High-Density 3D Puff Rubber' 
  | 'Gold Metallic Embroidery' 
  | 'Direct-to-Garment (DTG)' 
  | 'Reflective 3M Laser Print';

export interface CustomStudioOptions {
  productBaseId: string;
  productName?: string;
  garmentColor: string;
  garmentColorHex: string;
  selectedSize: ProductSize;
  placement: 'FRONT' | 'BACK' | 'LEFT_SLEEVE' | 'RIGHT_SLEEVE';
  customText?: string;
  textColor?: string;
  textFont?: string;
  textSize?: number;
  textPosition?: { x: number; y: number };
  textUppercase?: boolean;
  uploadedArtworkUrl?: string;
  artworkName?: string;
  artworkScale?: number;
  artworkRotation?: number;
  artworkPosition?: { x: number; y: number };
  artworkEffect?: 'original' | 'monochrome' | 'gold_foil' | 'invert';
  selectedSigilPreset?: string;
  printTechnique: PrintTechniqueType;
  basePrice: number;
  techniqueFee: number;
  placementFee: number;
  additionalPrice: number;
  totalCustomPrice: number;
  finalPreviewDataUrl?: string;
}

export interface CartItem {
  id: string; // unique item id (product + variant + custom hash)
  productId: string;
  product: Product;
  selectedSize: ProductSize;
  selectedColor: string;
  selectedColorHex: string;
  quantity: number;
  unitPrice: number;
  customization?: CustomStudioOptions;
}

export interface Coupon {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount: number;
  expiryDate: string;
  startDate?: string;
  scope?: 'STOREWIDE' | 'CATEGORY' | 'COLLECTION' | 'PRODUCT';
  targetId?: string;
  usageLimit?: number;
  usageCount?: number;
  active: boolean;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  parentCategory: 'MEN' | 'WOMEN' | 'ESSENTIALS' | 'ROOT';
  description?: string;
  imageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  active: boolean;
  itemCount?: number;
}

export interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  seoTitle?: string;
  seoDescription?: string;
  productIds: string[];
  active: boolean;
  releaseDate?: string;
}

export interface HomepageConfig {
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
    ctaLink: string;
    bannerImage: string;
    active: boolean;
  };
  promoBanner: {
    title: string;
    subtitle: string;
    badgeText: string;
    imageUrl: string;
    link: string;
    active: boolean;
  };
  featuredCollectionSlugs: string[];
  featuredProductIds: string[];
  sectionsVisibility: {
    hero: boolean;
    brandIntro: boolean;
    newCollection: boolean;
    newArrivals: boolean;
    bestSellers: boolean;
    categoryGrid: boolean;
    editorialBanner: boolean;
    philosophy: boolean;
    story: boolean;
    featuredProducts: boolean;
    instagram: boolean;
    newsletter: boolean;
    trustBar: boolean;
  };
}

export interface CustomerAccountRecord {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address?: ShippingAddress;
  ordersCount: number;
  totalSpent: number;
  createdAt: string;
  isAdmin: boolean;
  isBlocked?: boolean;
  orders?: Order[];
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  address?: ShippingAddress;
  isAdmin?: boolean;
}

export interface NotificationLog {
  id: string;
  type: 'SMS' | 'EMAIL';
  recipient: string;
  subjectOrTitle: string;
  message: string;
  timestamp: string;
  status: 'SENT' | 'FAILED';
}

export interface CheckoutValidationResult {
  valid: boolean;
  errors: string[];
  validatedSubtotal: number;
  validatedDiscount: number;
  validatedShippingCharge: number;
  validatedTotal: number;
  itemSnapshots: OrderItemSnapshot[];
}

export type OrderStatus = 
  | 'Pending' 
  | 'Payment Pending' 
  | 'Payment Confirmed' 
  | 'Processing' 
  | 'Packed' 
  | 'Shipped' 
  | 'Delivered' 
  | 'Cancelled';

export type PaymentGateway = 'Koko' | 'OnePay' | 'eWAY' | 'Cash on Delivery';

export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED' | 'FAILED';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  postalCode: string;
}

/**
 * Immutable historical snapshot of an item at the time of purchase.
 * Prevents downstream product catalog edits from altering historical invoices.
 */
export interface OrderItemSnapshot {
  id: string;
  orderId?: string;
  productId: string;
  productName: string;
  productSlug: string;
  sku: string;
  variantId?: string;
  size: ProductSize;
  color: string;
  colorHex: string;
  unitPrice: number;
  originalPrice?: number;
  quantity: number;
  subtotal: number;
  imageUrl: string;
  customization?: CustomStudioOptions;
  createdAt?: string;
}

export interface ShippingInformation {
  shippingMethodId: 'standard' | 'express';
  shippingMethodName: string;
  shippingCharge: number;
  estimatedDays: string;
  courierName?: string;
  awbNumber?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  shippingStatus: 'Pending' | 'Dispatched' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Returned';
  dispatchedAt?: string;
  deliveredAt?: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  paymentMethod: PaymentGateway;
  transactionId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  gatewayResponse?: Record<string, any>;
  createdAt: string;
}

export interface OrderStatusHistoryEntry {
  id: string;
  orderId: string;
  status: OrderStatus;
  comment?: string;
  updatedBy?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userId?: string | null;
  orderNumber: string;
  createdAt: string;
  customerInfo: ShippingAddress;
  items: OrderItemSnapshot[];
  subtotal: number;
  discountAmount: number;
  shippingCharge: number;
  totalAmount: number;
  couponCode?: string;
  paymentGateway: PaymentGateway;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingInfo: ShippingInformation;
  paymentRecord?: PaymentRecord;
  statusHistory?: OrderStatusHistoryEntry[];
  courierName?: string;
  awbNumber?: string;
  trackingLink?: string;
  notes?: string;
}

export interface ClubSubscriber {
  id: string;
  email: string;
  source: string;
  createdAt: string;
}
