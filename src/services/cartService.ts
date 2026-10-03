import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { CartItem } from '../types/ecommerce';

const GUEST_CART_KEY = 'valknut_cart';

/**
 * Load cart from local storage
 */
export function loadLocalCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(GUEST_CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.warn('Failed to load local cart:', e);
    return [];
  }
}

/**
 * Save cart to local storage
 */
export function saveLocalCart(cart: CartItem[]): void {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  } catch (e) {
    console.warn('Failed to save local cart:', e);
  }
}

/**
 * Merges guest cart items with the customer's cloud/account cart.
 * If identical product, size, and color exist, quantities are summed.
 */
export async function mergeGuestCartWithCustomerCart(
  guestCart: CartItem[],
  customerId: string
): Promise<CartItem[]> {
  let customerCart: CartItem[] = [];

  // 1. Fetch existing cloud cart from Supabase if configured
  if (isSupabaseConfigured && supabase && customerId) {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', customerId);

      if (!error && data && data.length > 0) {
        customerCart = data.map((row: any) => ({
          id: row.cart_item_id || row.id,
          productId: row.product_id,
          product: row.product_data,
          selectedSize: row.size,
          selectedColor: row.color,
          selectedColorHex: row.color_hex || '#000000',
          quantity: row.quantity,
          unitPrice: row.unit_price,
          customization: row.customization || undefined
        }));
      }
    } catch (err) {
      console.warn('Error fetching cloud cart:', err);
    }
  }

  // 2. Merge logic
  const merged = [...customerCart];

  for (const guestItem of guestCart) {
    const existingIndex = merged.findIndex(
      (item) =>
        item.productId === guestItem.productId &&
        item.selectedSize === guestItem.selectedSize &&
        item.selectedColor === guestItem.selectedColor &&
        !guestItem.customization // Keep customized products separate
    );

    if (existingIndex > -1) {
      merged[existingIndex].quantity += guestItem.quantity;
    } else {
      merged.push({ ...guestItem });
    }
  }

  // 3. Save merged cart locally
  saveLocalCart(merged);

  // 4. Push merged cart to Supabase in background if configured
  if (isSupabaseConfigured && supabase && customerId) {
    try {
      // Clear and re-insert
      await supabase.from('cart_items').delete().eq('user_id', customerId);
      if (merged.length > 0) {
        const rows = merged.map((item) => ({
          user_id: customerId,
          cart_item_id: item.id,
          product_id: item.productId,
          product_data: item.product,
          size: item.selectedSize,
          color: item.selectedColor,
          color_hex: item.selectedColorHex,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          customization: item.customization || null,
          updated_at: new Date().toISOString()
        }));
        await supabase.from('cart_items').insert(rows);
      }
    } catch (err) {
      console.warn('Error syncing merged cart to Supabase:', err);
    }
  }

  return merged;
}

/**
 * Syncs cart updates to Supabase for logged-in user
 */
export async function syncCartToCloud(cart: CartItem[], customerId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase || !customerId) return;

  try {
    await supabase.from('cart_items').delete().eq('user_id', customerId);
    if (cart.length > 0) {
      const rows = cart.map((item) => ({
        user_id: customerId,
        cart_item_id: item.id,
        product_id: item.productId,
        product_data: item.product,
        size: item.selectedSize,
        color: item.selectedColor,
        color_hex: item.selectedColorHex,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        customization: item.customization || null,
        updated_at: new Date().toISOString()
      }));
      await supabase.from('cart_items').insert(rows);
    }
  } catch (err) {
    console.warn('Error syncing cart to Supabase:', err);
  }
}
