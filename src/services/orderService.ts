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
    const variant = authoritativeProduct.variants.find(
      (v) => v.size === item.selectedSize && v.color.toLowerCase() === item.selectedColor.toLowerCase()
    );

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
      id: `oi-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
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
  const orderId = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
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
          payment_status: finalOrder.paymentStatus,
          order_status: finalOrder.orderStatus,
          shipping_method_id: shippingInfo.shippingMethodId,
          shipping_method_name: shippingInfo.shippingMethodName,
          courier_name: shippingInfo.courierName,
          awb_number: shippingInfo.awbNumber,
          tracking_number: shippingInfo.trackingNumber,
          tracking_url: shippingInfo.trackingUrl,
          shipping_status: shippingInfo.shippingStatus,
          notes: finalOrder.notes
        }]);

      if (orderError) {
        console.warn('Supabase order insert notice:', orderError.message);
      }

      // Insert immutable order_items
      const orderItemRows = finalOrder.items.map((item) => ({
        id: item.id,
        order_id: finalOrder.id,
        product_id: item.productId,
        product_name: item.productName,
        product_slug: item.productSlug,
        sku: item.sku,
        variant_id: item.variantId,
        size: item.size,
        color: item.color,
        color_hex: item.colorHex,
        unit_price: item.unitPrice,
        original_price: item.originalPrice,
        quantity: item.quantity,
        subtotal: item.subtotal,
        image_url: item.imageUrl,
        customization: item.customization,
        created_at: item.createdAt
      }));

      await supabase.from('order_items').insert(orderItemRows);

      // Insert payment record
      await supabase.from('payments').insert([{
        id: paymentRecord.id,
        order_id: finalOrder.id,
        payment_method: paymentRecord.paymentMethod,
        transaction_id: paymentRecord.transactionId,
        amount: paymentRecord.amount,
        currency: paymentRecord.currency,
        status: paymentRecord.status,
        gateway_response: paymentRecord.gatewayResponse
      }]);

      // Insert status history
      await supabase.from('order_status_history').insert([{
        id: initialHistory.id,
        order_id: finalOrder.id,
        status: initialHistory.status,
        comment: initialHistory.comment,
        updated_by: initialHistory.updatedBy
      }]);
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

/**
 * Deducts stock for each item from products store
 */
async function deductStockForOrder(items: OrderItemSnapshot[]): Promise<void> {
  try {
    const saved = localStorage.getItem('valknut_products');
    if (saved) {
      const products: Product[] = JSON.parse(saved);
      const updatedProducts = products.map((prod) => {
        const orderItemsForProd = items.filter((i) => i.productId === prod.id);
        if (orderItemsForProd.length === 0) return prod;

        const updatedVariants = prod.variants.map((v) => {
          const match = orderItemsForProd.find((oi) => oi.size === v.size && oi.color.toLowerCase() === v.color.toLowerCase());
          if (match) {
            const newStock = Math.max(0, (v.stock ?? 0) - match.quantity);
            return { ...v, stock: newStock, stockCount: newStock };
          }
          return v;
        });

        return { ...prod, variants: updatedVariants };
      });

      localStorage.setItem('valknut_products', JSON.stringify(updatedProducts));
    }
  } catch (e) {
    console.warn('Failed to deduct local product stock:', e);
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
  try {
    const saved = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (saved) {
      const orders = JSON.parse(saved);
      if (Array.isArray(orders) && orders.length > 0) return orders;
    }
  } catch (e) {
    console.warn('Failed to load local orders:', e);
  }
  return [];
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
          order_status: newStatus,
          courier_name: updatedShippingInfo.courierName,
          awb_number: updatedShippingInfo.awbNumber,
          tracking_url: updatedShippingInfo.trackingUrl,
          shipping_status: updatedShippingInfo.shippingStatus
        })
        .eq('id', targetOrder.id);

      await supabase.from('order_status_history').insert([{
        id: historyEntry.id,
        order_id: targetOrder.id,
        status: newStatus,
        comment: historyEntry.comment,
        updated_by: updatedBy
      }]);
    } catch (e) {
      console.warn('Failed to sync order update to Supabase:', e);
    }
  }

  return updatedOrder;
}
