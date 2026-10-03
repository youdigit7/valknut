export interface ShippingMethod {
  id: 'standard' | 'express';
  name: string;
  description: string;
  baseCharge: number;
  freeShippingThreshold: number; // 0 means no free shipping
  estimatedDays: string;
  active: boolean;
}

export const DEFAULT_SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Islandwide Delivery',
    description: 'Islandwide delivery via Pronto Lanka / Fargo Express. 2-3 days Colombo, 3-5 days Outstation.',
    baseCharge: 450,
    freeShippingThreshold: 10000,
    estimatedDays: '2-4 Business Days',
    active: true
  },
  {
    id: 'express',
    name: 'VIP Express Priority Courier',
    description: 'Guaranteed Priority Dispatch with direct courier handoff and real-time SMS tracking updates.',
    baseCharge: 850,
    freeShippingThreshold: 0, // Express is always paid premium
    estimatedDays: '1-2 Business Days',
    active: true
  }
];

const LOCAL_STORAGE_SHIPPING_KEY = 'valknut_shipping_methods';

/**
 * Gets active shipping methods (supports future admin modification from local storage or cloud)
 */
export function getAvailableShippingMethods(): ShippingMethod[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_SHIPPING_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((m: ShippingMethod) => m.active);
      }
    }
  } catch (e) {
    console.warn('Failed to parse shipping methods:', e);
  }
  return DEFAULT_SHIPPING_METHODS;
}

/**
 * Calculates delivery fee based on selected method, subtotal, and optional destination
 */
export function calculateShippingFee(
  methodId: 'standard' | 'express',
  subtotal: number,
  _destinationDistrict?: string
): { charge: number; isFree: boolean; method: ShippingMethod } {
  const methods = getAvailableShippingMethods();
  const method = methods.find((m) => m.id === methodId) || methods[0] || DEFAULT_SHIPPING_METHODS[0];

  if (subtotal <= 0) {
    return { charge: 0, isFree: true, method };
  }

  // Check free shipping threshold
  if (method.freeShippingThreshold > 0 && subtotal >= method.freeShippingThreshold) {
    return { charge: 0, isFree: true, method };
  }

  return { charge: method.baseCharge, isFree: false, method };
}

/**
 * Calculates progress toward free shipping threshold
 */
export function getFreeShippingProgress(subtotal: number, threshold: number = 10000): {
  progressPercent: number;
  remainingAmount: number;
  qualifies: boolean;
} {
  if (subtotal >= threshold) {
    return { progressPercent: 100, remainingAmount: 0, qualifies: true };
  }
  const remaining = Math.max(0, threshold - subtotal);
  const percent = Math.min(100, Math.round((subtotal / threshold) * 100));
  return { progressPercent: percent, remainingAmount: remaining, qualifies: false };
}
