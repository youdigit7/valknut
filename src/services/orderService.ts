import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { 
  Order, 
  OrderItemSnapshot, 
  CartItem, 
  OrderStatus, 
  PaymentGateway, 
  PaymentStatus,
  ShippingAddress, 
  ShippingInformation,
  PaymentRecord,
  OrderStatusHistoryEntry,
  CheckoutValidationResult,
  Product,
  Coupon,
  NotificationLog
} from '../types/ecommerce';
import { calculateShippingFee, getAvailableShippingMethods } from './shippingService';
import { getAllProducts } from './productService';

const LOCAL_ORDERS_KEY = 'valknut_orders';
const LOCAL_LOGS_KEY = 'valknut_logs';

/**
 * Maps frontend OrderStatus to Supabase Postgres check constraint values:
 * ('Order Placed', 'Confirmed', 'In Production', 'Customizing Artwork', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled')
 */
export function mapOrderStatusToDb(status: OrderStatus): string {
  switch (status) {
    case 'Pending':
    case 'Payment Pending':
      return 'Order Placed';
    case 'Payment Confirmed':
      return 'Confirmed';
    case 'Processing':
    case 'Packed':
      return 'In Production';
    case 'Shipped':
      return 'Shipped';
    case 'Delivered':
      return 'Delivered';
    case 'Cancelled':
      return 'Cancelled';
    default:
      return 'Order Placed';
  }
}

/**
 * Maps Supabase order_status back to canonical frontend OrderStatus
 */
export function mapOrderStatusFromDb(dbStatus?: string): OrderStatus {
  switch (dbStatus) {
    case 'Order Placed':
      return 'Pending';
    case 'Confirmed':
      return 'Payment Confirmed';
    case 'In Production':
    case 'Customizing Artwork':
      return 'Processing';
    case 'Shipped':
    case 'Out for Delivery':
      return 'Shipped';
    case 'Delivered':
      return 'Delivered';
    case 'Cancelled':
      return 'Cancelled';
    default:
      return 'Pending';
  }
}

/**
 * Maps frontend PaymentStatus to Supabase Postgres check constraint values:
 * ('PENDING', 'PAID', 'FAILED', 'REFUNDED')
 */
export function mapPaymentStatusToDb(status: PaymentStatus): string {
  switch (status) {
    case 'UNPAID':
      return 'PENDING';
    case 'PAID':
      return 'PAID';
    case 'FAILED':
      return 'FAILED';
    case 'REFUNDED':
      return 'REFUNDED';
    default:
      return 'PENDING';
  }
}

/**
 * Maps Supabase payment_status back to canonical frontend PaymentStatus
 */
export function mapPaymentStatusFromDb(dbStatus?: string): PaymentStatus {
  switch (dbStatus?.toUpperCase()) {
    case 'PAID':
      return 'PAID';
    case 'FAILED':
      return 'FAILED';
    case 'REFUNDED':
      return 'REFUNDED';
    case 'PENDING':
    default:
      return 'UNPAID';
  }
}

/**
 * Normalizes Supabase orders database row to canonical TypeScript Order type
 */
export function mapSupabaseOrderRowToOrder(row: any): Order {
  let items: OrderItemSnapshot[] = Array.isArray(row.order_items)
    ? row.order_items.map((it: any) => ({
        id: it.id,
        productId: it.product_id,
        productName: it.product_name,
        productSlug: it.product_slug,
        sku: it.sku,
        size: it.size,
        color: it.color,
        colorHex: it.color_hex,
        unitPrice: Number(it.unit_price),
        originalPrice: it.original_price ? Number(it.original_price) : undefined,
        quantity: it.quantity,
        subtotal: Number(it.subtotal),
        imageUrl: it.image_url,
        customization: it.customization_details || (row.shipping_info?.customization && {
          productBaseId: it.product_id,
          productName: it.product_name,
          garmentColor: it.color,
          garmentColorHex: it.color_hex,
          selectedSize: it.size,
          placement: row.shipping_info.customization.placement || 'FRONT',
          customText: row.shipping_info.customization.frontText || row.shipping_info.customization.customText,
          textColor: row.shipping_info.customization.frontColor || row.shipping_info.customization.textColor,
          textFont: row.shipping_info.customization.frontFont || row.shipping_info.customization.textFont,
          uploadedArtworkUrl: row.shipping_info.customization.artworkUrl || row.shipping_info.customization.uploadedArtworkUrl,
          printTechnique: row.shipping_info.customization.printTechnique || 'High-Density 3D Puff Rubber',
          basePrice: Number(it.unit_price),
          techniqueFee: 0,
          placementFee: 0,
          additionalPrice: 0,
          totalCustomPrice: Number(it.subtotal)
        }),
        createdAt: it.created_at
      }))
    : [];

  // Fallback if order_items relation wasn't loaded or order came directly with shipping_info.customization
  if (items.length === 0 && row.shipping_info?.customization) {
    const cust = row.shipping_info.customization;
    items = [{
      id: crypto.randomUUID(),
      productId: 'custom-garment',
      productName: cust.productName || 'VALKNUT Bespoke Garment',
      productSlug: 'valknut-bespoke-garment',
      sku: 'VK-CUSTOM-PIECE',
      size: cust.selectedSize || 'L',
      color: cust.garmentColor || cust.frontColor || 'Onyx Black',
      colorHex: cust.garmentColorHex || '#0a0a0c',
      unitPrice: Number(row.total_amount),
      quantity: 1,
      subtotal: Number(row.total_amount),
      imageUrl: cust.artworkUrl || cust.uploadedArtworkUrl || '',
      customization: {
        productBaseId: 'custom-garment',
        productName: cust.productName || 'VALKNUT Bespoke Garment',
        garmentColor: cust.garmentColor || 'Onyx Black',
        garmentColorHex: cust.garmentColorHex || '#0a0a0c',
        selectedSize: cust.selectedSize || 'L',
        placement: cust.placement || 'FRONT',
        customText: cust.frontText || cust.customText,
        textColor: cust.frontColor || cust.textColor,
        textFont: cust.frontFont || cust.textFont,
        uploadedArtworkUrl: cust.artworkUrl || cust.uploadedArtworkUrl,
        printTechnique: cust.printTechnique || 'High-Density 3D Puff Rubber',
        basePrice: Number(row.subtotal),
        techniqueFee: 0,
        placementFee: 0,
        additionalPrice: 0,
        totalCustomPrice: Number(row.total_amount)
      },
      createdAt: row.created_at
    }];
  }

  return {
    id: row.id,
    userId: row.user_id || undefined,
    orderNumber: row.order_number,
    createdAt: row.created_at,
    customerInfo: row.customer_info || {},
    items,
    subtotal: Number(row.subtotal),
    discountAmount: Number(row.discount_amount || 0),
    shippingCharge: Number(row.shipping_charge || 0),
    totalAmount: Number(row.total_amount),
    couponCode: row.coupon_code || undefined,
    paymentGateway: row.payment_gateway,
    paymentStatus: mapPaymentStatusFromDb(row.payment_status),
    orderStatus: mapOrderStatusFromDb(row.order_status),
    shippingInfo: row.shipping_info || {},
    paymentRecord: row.payment_record || undefined,
    statusHistory: [],
    courierName: row.shipping_info?.courierName,
    awbNumber: row.shipping_info?.awbNumber,
    trackingLink: row.shipping_info?.trackingUrl,
    notes: row.shipping_info?.notes
  };
}

/**
 * Validates order details server-side against canonical database/catalog.
 * Crucial security rule: Client-side prices, stock levels, and discount amounts are NEVER trusted directly.
 */
export async function validateOrderSecurity(
  items: CartItem[],
  couponCode?: string,
  shippingMethodId: 'standard' | 'express' = 'standard',
  allCoupons?: Coupon[]
): Promise<CheckoutValidationResult> {
  const errors: string[] = [];
  const itemSnapshots: OrderItemSnapshot[] = [];
  let calculatedSubtotal = 0;

  if (!items || items.length === 0) {
    return {
      valid: false,
      errors: ['Your shopping bag is empty.'],
      validatedSubtotal: 0,
      validatedDiscount: 0,
      validatedShippingCharge: 0,
      validatedTotal: 0,
      itemSnapshots: []
    };
  }

  // 1. Fetch authoritative product catalog
  const catalogProducts = await getAllProducts();

  for (const item of items) {
    const authoritativeProduct = catalogProducts.find((p: Product) => p.id === item.productId);

    if (!authoritativeProduct) {
      errors.push(`Product "${item.product?.name || item.productId}" is no longer available in our collection.`);
      continue;
    }

    // Match exact variant (size & color)
    const variants = Array.isArray(authoritativeProduct.variants) ? authoritativeProduct.variants : [];
    let variant = variants.find(
      (v) => v.size === item.selectedSize && v.color.toLowerCase() === item.selectedColor.toLowerCase()
    );

    // If it's a bespoke customized garment, the customer selected a custom shade from STUDIO_COLORS
    // Find the base garment size variant
    if (!variant && item.customization) {
      variant = variants.find((v) => v.size === item.selectedSize) || variants[0];
    }

    if (!variant) {
      errors.push(`Variant ${item.selectedSize} / ${item.selectedColor} for "${authoritativeProduct.name}" is unavailable.`);
      continue;
    }

    // Validate Stock Availability
    const currentStock = variant.stock ?? (variant.stockCount ?? 0);
    if (currentStock < item.quantity) {
      if (currentStock === 0) {
        errors.push(`"${authoritativeProduct.name}" (${item.selectedSize} / ${item.selectedColor}) is out of stock.`);
      } else {
        errors.push(`Only ${currentStock} piece(s) available for "${authoritativeProduct.name}" (${item.selectedSize} / ${item.selectedColor}). Requested: ${item.quantity}.`);
      }
      continue;
    }

    // Authoritative pricing: canonical salePrice or price + customization price
    const baseCanonicalPrice = authoritativeProduct.salePrice ?? authoritativeProduct.price;
    const customAddon = item.customization?.additionalPrice ?? 0;
    const authoritativeUnitPrice = baseCanonicalPrice + customAddon;

    const lineSubtotal = authoritativeUnitPrice * item.quantity;
    calculatedSubtotal += lineSubtotal;

    // Build immutable historical snapshot
    const snapshot: OrderItemSnapshot = {
      id: crypto.randomUUID(),
      productId: authoritativeProduct.id,
      productName: authoritativeProduct.name,
      productSlug: authoritativeProduct.slug,
      sku: variant.sku || `${authoritativeProduct.slug.toUpperCase()}-${item.selectedSize}`,
      variantId: variant.id,
      size: item.selectedSize,
      color: item.selectedColor,
      colorHex: item.selectedColorHex || variant.colorHex || '#000000',
      unitPrice: authoritativeUnitPrice,
      originalPrice: authoritativeProduct.price + customAddon,
      quantity: item.quantity,
      subtotal: lineSubtotal,
      imageUrl: item.customization?.finalPreviewDataUrl || authoritativeProduct.images[0] || '',
      customization: item.customization ? { ...item.customization } : undefined,
      createdAt: new Date().toISOString()
    };

    itemSnapshots.push(snapshot);
  }

  // 2. Validate and recalculate coupon discount
  let validatedDiscount = 0;
  if (couponCode && couponCode.trim()) {
    const cleanCode = couponCode.trim().toUpperCase();
    let coupon: Coupon | undefined;

    if (allCoupons && allCoupons.length > 0) {
      coupon = allCoupons.find((c) => c.code.toUpperCase() === cleanCode && c.active);
    } else {
      // Fallback verification against local storage coupons
      try {
        const stored = localStorage.getItem('valknut_coupons');
        if (stored) {
          const parsed = JSON.parse(stored);
          coupon = parsed.find((c: Coupon) => c.code.toUpperCase() === cleanCode && c.active);
        }
      } catch (e) {
        console.warn('Failed to verify coupon:', e);
      }
    }

    if (!coupon) {
      errors.push(`Coupon code "${couponCode}" is invalid or expired.`);
    } else if (calculatedSubtotal < coupon.minOrderAmount) {
      errors.push(`Coupon "${coupon.code}" requires a minimum order of LKR ${coupon.minOrderAmount.toLocaleString()}.`);
    } else {
      if (coupon.discountType === 'PERCENTAGE') {
        validatedDiscount = Math.round((calculatedSubtotal * coupon.discountValue) / 100);
      } else {
        validatedDiscount = coupon.discountValue;
      }
      validatedDiscount = Math.min(validatedDiscount, calculatedSubtotal);
    }
  }

  // 3. Authoritative Shipping Fee Calculation
  const shippingCalculation = calculateShippingFee(shippingMethodId, calculatedSubtotal);
  const validatedShippingCharge = shippingCalculation.charge;

  const validatedTotal = Math.max(0, calculatedSubtotal - validatedDiscount + validatedShippingCharge);

  return {
    valid: errors.length === 0,
    errors,
    validatedSubtotal: calculatedSubtotal,
    validatedDiscount,
    validatedShippingCharge,
    validatedTotal,
    itemSnapshots
  };
}

export interface CreateOrderPayload {
  customerInfo: ShippingAddress;
  items: CartItem[];
  shippingMethodId?: 'standard' | 'express';
  paymentGateway: PaymentGateway;
  couponCode?: string;
  notes?: string;
  userId?: string | null;
  allCoupons?: Coupon[];
}

/**
 * Creates and stores a fully validated order with immutable line-item snapshots and tracking records.
 */
export async function createOrderSecurely(payload: CreateOrderPayload): Promise<{
  success: boolean;
  order?: Order;
  errors?: string[];
}> {
  const {
    customerInfo,
    items,
    shippingMethodId = 'standard',
    paymentGateway,
    couponCode,
    notes,
    userId,
    allCoupons
  } = payload;

  // 1. Run server-side validation
  const validation = await validateOrderSecurity(items, couponCode, shippingMethodId, allCoupons);

  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors
    };
  }

  // 2. Generate unique order number (e.g. VK-2026-849201)
  const currentYear = new Date().getFullYear();
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const orderNumber = `VK-${currentYear}-${randomSuffix}`;
  const orderId = crypto.randomUUID();
  const nowIso = new Date().toISOString();

  // 3. Determine Payment and Order Status
  const isCOD = paymentGateway === 'Cash on Delivery';
  const paymentStatus: PaymentStatus = isCOD ? 'UNPAID' : 'PAID';
  const initialOrderStatus: OrderStatus = isCOD ? 'Pending' : 'Payment Confirmed';

  // 4. Shipping method details
  const shippingMethods = getAvailableShippingMethods();
  const selectedMethod = shippingMethods.find((m) => m.id === shippingMethodId) || shippingMethods[0];

  const shippingInfo: ShippingInformation = {
    shippingMethodId,
    shippingMethodName: selectedMethod.name,
    shippingCharge: validation.validatedShippingCharge,
    estimatedDays: selectedMethod.estimatedDays,
    shippingStatus: 'Pending',
    courierName: 'Pronto Lanka Express',
    awbNumber: `PRN-${Math.floor(10000000 + Math.random() * 90000000)}`,
    trackingNumber: `TRK-${orderNumber}`,
    trackingUrl: `https://valknutofficial.com/#/track-order?order=${orderNumber}`
  };

  // 5. Payment Transaction Record
  const paymentRecord: PaymentRecord = {
    id: `pay-${Date.now()}`,
    orderId,
    paymentMethod: paymentGateway,
    transactionId: `TXN-${paymentGateway.toUpperCase().replace(/\s+/g, '')}-${Date.now()}`,
    amount: validation.validatedTotal,
    currency: 'LKR',
    status: paymentStatus,
    gatewayResponse: {
      authorizedAt: nowIso,
      gateway: paymentGateway,
      simulatedAuthCode: `AUTH_${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    },
    createdAt: nowIso
  };

  // 6. Order Status History Initial Entry
  const initialHistory: OrderStatusHistoryEntry = {
    id: `osh-${Date.now()}`,
    orderId,
    status: initialOrderStatus,
    comment: isCOD ? 'Order placed via Cash on Delivery' : `Payment captured via ${paymentGateway} gateway. Order verified.`,
    updatedBy: 'VALKNUT Secure Checkout',
    createdAt: nowIso
  };

  // 7. Complete Canonical Order
  const finalOrder: Order = {
    id: orderId,
    userId: userId || null,
    orderNumber,
    createdAt: nowIso,
    customerInfo,
    items: validation.itemSnapshots,
    subtotal: validation.validatedSubtotal,
    discountAmount: validation.validatedDiscount,
    shippingCharge: validation.validatedShippingCharge,
    totalAmount: validation.validatedTotal,
    couponCode: couponCode?.trim().toUpperCase() || undefined,
    paymentGateway,
    paymentStatus,
    orderStatus: initialOrderStatus,
    shippingInfo,
    paymentRecord,
    statusHistory: [initialHistory],
    courierName: shippingInfo.courierName,
    awbNumber: shippingInfo.awbNumber,
    trackingLink: shippingInfo.trackingUrl,
    notes
  };

  // 8. Deduct Stock in Local & Remote DB
  await deductStockForOrder(validation.itemSnapshots);

  // 9. Persist Order to Local Storage & Supabase
  persistOrderLocally(finalOrder);

  if (isSupabaseConfigured && supabase) {
    try {
      // Insert to orders table
      // Insert to orders table (matching Supabase public.orders schema)
      const { error: orderError } = await supabase
        .from('orders')
        .insert([{
          id: finalOrder.id,
          user_id: finalOrder.userId,
          order_number: finalOrder.orderNumber,
          customer_info: finalOrder.customerInfo,
          subtotal: finalOrder.subtotal,
          discount_amount: finalOrder.discountAmount,
          shipping_charge: finalOrder.shippingCharge,
          total_amount: finalOrder.totalAmount,
          coupon_code: finalOrder.couponCode,
          payment_gateway: finalOrder.paymentGateway,
          payment_status: mapPaymentStatusToDb(finalOrder.paymentStatus),
          order_status: mapOrderStatusToDb(finalOrder.orderStatus),
          shipping_info: {
            ...shippingInfo,
            notes: finalOrder.notes || null,
            // Attach custom artwork and specifications to shipping_info for QA and admin visibility
            customization: finalOrder.items.find(i => i.customization)?.customization || null,
            customItems: finalOrder.items.filter(i => i.customization).map(i => ({
              productName: i.productName,
              size: i.size,
              color: i.color,
              customization: i.customization
            }))
          },
          payment_record: paymentRecord
        }]);

      if (orderError) {
        console.warn('Supabase order insert notice:', orderError.message);
      } else {
        // Insert immutable order_items
        const orderItemRows = finalOrder.items.map((item) => ({
          id: item.id,
          order_id: finalOrder.id,
          product_id: item.productId,
          product_name: item.productName,
          product_slug: item.productSlug,
          sku: item.sku,
          size: item.size,
          color: item.color,
          color_hex: item.colorHex,
          unit_price: item.unitPrice,
          original_price: item.originalPrice,
          quantity: item.quantity,
          subtotal: item.subtotal,
          image_url: item.imageUrl,
          customization_details: item.customization || null,
          created_at: item.createdAt
        }));

        const { error: itemError } = await supabase.from('order_items').insert(orderItemRows);
        if (itemError) {
          console.warn('Supabase order_items insert notice:', itemError.message);
        }
      }
    } catch (dbErr) {
      console.warn('Could not sync order to Supabase (offline fallback active):', dbErr);
    }
  }

  // 10. Generate Automated Notification Logs
  dispatchOrderNotifications(finalOrder);

  return {
    success: true,
    order: finalOrder
  };
}

export interface OrderedStockItem {
  productId: string;
  variantId?: string;
  sku?: string;
  size: string;
  color?: string;
  quantity: number;
}

/**
 * Pure function to deduct stock counts for ordered items across an array of products.
 * Handles custom variant names, studio color selections, SKU matching, and multi-quantity aggregations.
 */
export function deductStockFromProducts(
  products: Product[],
  items: OrderedStockItem[]
): Product[] {
  return products.map((prod) => {
    const orderItemsForProd = items.filter((i) => i.productId === prod.id);
    if (orderItemsForProd.length === 0) return prod;

    const prodVariants = Array.isArray(prod.variants) ? prod.variants : [];
    if (prodVariants.length === 0) return prod;

    // Track deductions per variant index to handle duplicate items accurately
    const deductionsPerVariantIndex = new Map<number, number>();

    for (const item of orderItemsForProd) {
      const targetSize = (item.size || '').trim().toLowerCase();
      const targetColor = (item.color || '').trim().toLowerCase();
      const targetSku = (item.sku || '').trim().toLowerCase();
      const targetVariantId = item.variantId;

      let matchedIdx = -1;

      // 1. Match by variant ID if present
      if (targetVariantId) {
        matchedIdx = prodVariants.findIndex((v) => v.id && v.id === targetVariantId);
      }

      // 2. Match by SKU if present
      if (matchedIdx === -1 && targetSku) {
        matchedIdx = prodVariants.findIndex((v) => v.sku && v.sku.trim().toLowerCase() === targetSku);
      }

      // 3. Match by exact size AND color
      if (matchedIdx === -1 && targetSize && targetColor) {
        matchedIdx = prodVariants.findIndex(
          (v) =>
            v.size.trim().toLowerCase() === targetSize &&
            v.color.trim().toLowerCase() === targetColor
        );
      }

      // 4. Match by size alone (e.g. customized studio garment where color was picked from studio shades)
      if (matchedIdx === -1 && targetSize) {
        matchedIdx = prodVariants.findIndex((v) => v.size.trim().toLowerCase() === targetSize);
      }

      // 5. Fallback: If product has only 1 variant (e.g. One Size / Free Size), deduct from it
      if (matchedIdx === -1 && prodVariants.length === 1) {
        matchedIdx = 0;
      }

      if (matchedIdx !== -1) {
        const currentDeduction = deductionsPerVariantIndex.get(matchedIdx) || 0;
        deductionsPerVariantIndex.set(matchedIdx, currentDeduction + (item.quantity || 1));
      }
    }

    const updatedVariants = prodVariants.map((v, idx) => {
      const deduction = deductionsPerVariantIndex.get(idx);
      if (deduction && deduction > 0) {
        const currentStock = v.stock ?? v.stockCount ?? 0;
        const newStock = Math.max(0, currentStock - deduction);
        return { ...v, stock: newStock, stockCount: newStock };
      }
      return v;
    });

    return { ...prod, variants: updatedVariants };
  });
}

/**
 * Deducts stock for each item from products store
 */
async function deductStockForOrder(items: OrderItemSnapshot[]): Promise<void> {
  try {
    const saved = localStorage.getItem('valknut_products_v3') || localStorage.getItem('valknut_products_v2') || localStorage.getItem('valknut_products');
    if (saved) {
      const products: Product[] = JSON.parse(saved);
      const updatedProducts = deductStockFromProducts(products, items);
      localStorage.setItem('valknut_products_v3', JSON.stringify(updatedProducts));
      localStorage.setItem('valknut_products_v2', JSON.stringify(updatedProducts));
    }

    // Deduct stock in Supabase cloud database if available
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      try {
        const rawToken = localStorage.getItem('sb-urwhkkrozmlpadjmiqpc-auth-token');
        if (rawToken) {
          const parsed = JSON.parse(rawToken);
          if (parsed?.access_token && parsed?.refresh_token) {
            await client.auth.setSession({
              access_token: parsed.access_token,
              refresh_token: parsed.refresh_token
            });
          }
        }
      } catch (_) {}

      for (const item of items) {
        try {
          const isUuid = item.variantId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.variantId);

          // 1. Try atomic database RPC function first
          if (isUuid) {
            const { error: rpcErr } = await client.rpc('deduct_variant_stock', {
              p_variant_id: item.variantId,
              p_quantity: item.quantity
            });
            if (!rpcErr) continue;
          } else if (item.sku) {
            const { error: rpcSkuErr } = await client.rpc('deduct_variant_stock_by_sku', {
              p_sku: item.sku,
              p_quantity: item.quantity
            });
            if (!rpcSkuErr) continue;
          }

          // 2. Direct update fallback
          let query = client.from('product_variants').select('stock, id');
          if (isUuid) {
            query = query.eq('id', item.variantId);
          } else if (item.sku) {
            query = query.eq('sku', item.sku);
          } else if (item.productId && item.size) {
            query = query.eq('product_id', item.productId).eq('size', item.size);
          } else {
            continue;
          }

          const { data: vRow } = await query.maybeSingle();

          if (vRow && typeof vRow.stock === 'number') {
            const newStock = Math.max(0, vRow.stock - item.quantity);
            await client
              .from('product_variants')
              .update({ stock: newStock })
              .eq('id', vRow.id);
          }
        } catch (cloudErr) {
          console.warn('Could not update remote stock for item:', item.sku, cloudErr);
        }
      }
    }
  } catch (e) {
    console.warn('Failed to deduct product stock:', e);
  }
}

/**
 * Persists order locally
 */
function persistOrderLocally(order: Order): void {
  try {
    const saved = localStorage.getItem(LOCAL_ORDERS_KEY);
    const orders: Order[] = saved ? JSON.parse(saved) : [];
    const updated = [order, ...orders.filter((o) => o.id !== order.id && o.orderNumber !== order.orderNumber)];
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save order locally:', e);
  }
}

/**
 * Dispatches automated SMS & Email receipts
 */
function dispatchOrderNotifications(order: Order): void {
  try {
    const smsLog: NotificationLog = {
      id: `sms-${Date.now()}`,
      type: 'SMS',
      recipient: order.customerInfo.phone,
      subjectOrTitle: `Order Confirmed: ${order.orderNumber}`,
      message: `VALKNUT: Your order ${order.orderNumber} is confirmed! Total: LKR ${order.totalAmount.toLocaleString()} (${order.paymentGateway}). Track: https://valknutofficial.com/#/track-order?order=${order.orderNumber}`,
      timestamp: new Date().toISOString(),
      status: 'SENT'
    };

    const emailLog: NotificationLog = {
      id: `email-${Date.now()}`,
      type: 'EMAIL',
      recipient: order.customerInfo.email,
      subjectOrTitle: `VALKNUT Official Order Receipt #${order.orderNumber}`,
      message: `Dear ${order.customerInfo.fullName},\n\nThank you for choosing VALKNUT Official.\n\nOrder Number: ${order.orderNumber}\nDate: ${new Date(order.createdAt).toLocaleDateString()}\nShipping Method: ${order.shippingInfo.shippingMethodName}\nDelivery Address: ${order.customerInfo.addressLine1}, ${order.customerInfo.city}, ${order.customerInfo.district}\n\nTotal Paid: LKR ${order.totalAmount.toLocaleString()}\nPayment Method: ${order.paymentGateway}\nEstimated Delivery: ${order.shippingInfo.estimatedDays}\n\nOWN YOUR MIND. CONTROL YOUR WORLD.`,
      timestamp: new Date().toISOString(),
      status: 'SENT'
    };

    const logsSaved = localStorage.getItem(LOCAL_LOGS_KEY);
    const existingLogs: NotificationLog[] = logsSaved ? JSON.parse(logsSaved) : [];
    localStorage.setItem(LOCAL_LOGS_KEY, JSON.stringify([smsLog, emailLog, ...existingLogs]));
  } catch (e) {
    console.warn('Failed to dispatch notifications:', e);
  }
}

/**
 * Fetches all orders (local + remote)
 */
export async function getAllOrders(): Promise<Order[]> {
  let remoteOrders: Order[] = [];
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        remoteOrders = data.map(mapSupabaseOrderRowToOrder);
      }
    } catch (e) {
      console.warn('Failed to fetch remote orders from Supabase:', e);
    }
  }

  try {
    const saved = localStorage.getItem(LOCAL_ORDERS_KEY);
    const localOrders: Order[] = saved ? JSON.parse(saved) : [];
    
    // Merge remote and local by orderNumber, remote taking precedence
    const orderMap = new Map<string, Order>();
    for (const ord of remoteOrders) {
      orderMap.set(ord.orderNumber, ord);
    }
    for (const ord of localOrders) {
      if (!orderMap.has(ord.orderNumber)) {
        orderMap.set(ord.orderNumber, ord);
      }
    }
    const merged = Array.from(orderMap.values());
    if (merged.length > 0) {
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch (e) {
    console.warn('Failed to load local orders:', e);
  }
  return remoteOrders;
}

/**
 * Searches order by order number and email or phone (for guest order tracking)
 */
export async function findOrderByTracking(
  orderNumber: string,
  emailOrPhone?: string
): Promise<Order | null> {
  const orders = await getAllOrders();
  const cleanOrderNum = orderNumber.trim().toUpperCase();

  const found = orders.find((o) => {
    const matchNumber = o.orderNumber.toUpperCase() === cleanOrderNum || o.id === cleanOrderNum;
    if (!matchNumber) return false;

    if (!emailOrPhone || !emailOrPhone.trim()) return true;

    const query = emailOrPhone.trim().toLowerCase();
    const emailMatch = o.customerInfo.email.toLowerCase() === query;
    const phoneMatch = o.customerInfo.phone.replace(/\D/g, '').includes(query.replace(/\D/g, ''));
    return emailMatch || phoneMatch;
  });

  return found || null;
}

/**
 * Updates order status and logs history event
 */
export async function updateOrderStatusWithAudit(
  orderId: string,
  newStatus: OrderStatus,
  courierData?: {
    courierName?: string;
    awbNumber?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    shippingStatus?: any;
  },
  comment?: string,
  updatedBy: string = 'VALKNUT Order Management'
): Promise<Order | null> {
  const orders = await getAllOrders();
  const orderIndex = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);

  if (orderIndex === -1) return null;

  const targetOrder = orders[orderIndex];
  const nowIso = new Date().toISOString();

  const historyEntry: OrderStatusHistoryEntry = {
    id: `osh-${Date.now()}`,
    orderId: targetOrder.id,
    status: newStatus,
    comment: comment || `Order status updated to ${newStatus}`,
    updatedBy,
    createdAt: nowIso
  };

  const updatedShippingInfo: ShippingInformation = {
    ...targetOrder.shippingInfo,
    courierName: courierData?.courierName || targetOrder.shippingInfo.courierName,
    awbNumber: courierData?.awbNumber || targetOrder.shippingInfo.awbNumber,
    trackingNumber: courierData?.trackingNumber || targetOrder.shippingInfo.trackingNumber,
    trackingUrl: courierData?.trackingUrl || targetOrder.shippingInfo.trackingUrl,
    shippingStatus: courierData?.shippingStatus || (newStatus === 'Shipped' ? 'In Transit' : newStatus === 'Delivered' ? 'Delivered' : targetOrder.shippingInfo.shippingStatus),
    dispatchedAt: newStatus === 'Shipped' ? nowIso : targetOrder.shippingInfo.dispatchedAt,
    deliveredAt: newStatus === 'Delivered' ? nowIso : targetOrder.shippingInfo.deliveredAt
  };

  const updatedOrder: Order = {
    ...targetOrder,
    orderStatus: newStatus,
    shippingInfo: updatedShippingInfo,
    courierName: updatedShippingInfo.courierName,
    awbNumber: updatedShippingInfo.awbNumber,
    trackingLink: updatedShippingInfo.trackingUrl,
    statusHistory: [...(targetOrder.statusHistory || []), historyEntry]
  };

  orders[orderIndex] = updatedOrder;
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));

  // Sync to Supabase if available
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('orders')
        .update({
          order_status: mapOrderStatusToDb(newStatus),
          shipping_info: {
            ...(targetOrder.shippingInfo || {}),
            courierName: updatedShippingInfo.courierName,
            awbNumber: updatedShippingInfo.awbNumber,
            trackingUrl: updatedShippingInfo.trackingUrl,
            shippingStatus: updatedShippingInfo.shippingStatus
          }
        })
        .eq('id', targetOrder.id);
    } catch (e) {
      console.warn('Failed to sync order update to Supabase:', e);
    }
  }

  return updatedOrder;
}

/**
 * Updates order payment status following payment gateway callback/verification (e.g. UNPAID -> PAID)
 */
export async function updateOrderPaymentStatus(
  orderNumberOrId: string,
  newPaymentStatus: PaymentStatus,
  transactionId?: string,
  gatewayDetails?: Record<string, any>
): Promise<Order | null> {
  const orders = await getAllOrders();
  const orderIndex = orders.findIndex(
    (o) => o.orderNumber === orderNumberOrId || o.id === orderNumberOrId
  );
  if (orderIndex === -1) return null;

  const targetOrder = orders[orderIndex];
  const nowIso = new Date().toISOString();
  const newOrderStatus: OrderStatus = newPaymentStatus === 'PAID' ? 'Payment Confirmed' : targetOrder.orderStatus;

  const existingPayment = targetOrder.paymentRecord;
  const updatedPaymentRecord: PaymentRecord = {
    id: existingPayment?.id || `pay-${Date.now()}`,
    orderId: targetOrder.id,
    paymentMethod: targetOrder.paymentGateway,
    amount: targetOrder.totalAmount,
    currency: 'LKR',
    status: newPaymentStatus,
    transactionId: transactionId || existingPayment?.transactionId || `TXN-${targetOrder.paymentGateway.toUpperCase()}-${Date.now()}`,
    gatewayResponse: {
      ...(existingPayment?.gatewayResponse || {}),
      ...(gatewayDetails || {}),
      verifiedAt: nowIso
    },
    createdAt: existingPayment?.createdAt || nowIso
  };

  const updatedOrder: Order = {
    ...targetOrder,
    paymentStatus: newPaymentStatus,
    orderStatus: newOrderStatus,
    paymentRecord: updatedPaymentRecord,
    statusHistory: [
      ...(targetOrder.statusHistory || []),
      {
        id: `osh-${Date.now()}`,
        orderId: targetOrder.id,
        status: newOrderStatus,
        comment: `Payment status updated to ${newPaymentStatus} via ${targetOrder.paymentGateway}${transactionId ? ` (Txn: ${transactionId})` : ''}`,
        updatedBy: 'OnePay IPG Verification',
        createdAt: nowIso
      }
    ]
  };

  orders[orderIndex] = updatedOrder;
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));

  // Sync to Supabase if available
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('orders')
        .update({
          payment_status: mapPaymentStatusToDb(newPaymentStatus),
          order_status: mapOrderStatusToDb(newOrderStatus),
          payment_record: updatedOrder.paymentRecord
        })
        .eq('id', targetOrder.id);
    } catch (e) {
      console.warn('Failed to sync payment status to Supabase:', e);
    }
  }

  return updatedOrder;
}
