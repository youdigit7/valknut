import { describe, it, expect, beforeEach, vi } from 'vitest';
import { validateOrderSecurity, deductStockFromProducts } from '../services/orderService';
import { calculateShippingFee } from '../services/shippingService';
import * as productService from '../services/productService';
import type { CartItem, Product, Coupon } from '../types/ecommerce';

describe('Order Security, Calculations & Checkout QA Suite', () => {
  const testProduct: Product = {
    id: 'test-garment-1',
    name: 'Sovereign Heavyweight Tee',
    slug: 'sovereign-heavyweight-tee',
    description: 'Bespoke cotton garment',
    price: 8500,
    salePrice: 7500,
    category: 'MEN',
    subCategory: 'Oversized T-Shirts',
    collection: 'SHADOW OPS 2026',
    images: ['https://res.cloudinary.com/ofrariny/image/upload/v1/test.jpg'],
    tags: ['Tee'],
    variants: [
      { id: 'v-1', size: 'M', color: 'Onyx Black', colorHex: '#000000', sku: 'VK-TEE-M', stock: 10 },
      { id: 'v-2', size: 'L', color: 'Onyx Black', colorHex: '#000000', sku: 'VK-TEE-L', stock: 0 }
    ],
    material: '100% French Terry Cotton',
    careInstructions: 'Machine wash cold inside out',
    createdAt: new Date().toISOString()
  };

  const testCoupons: Coupon[] = [
    {
      code: 'VALKNUT10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderAmount: 5000,
      expiryDate: '2027-12-31',
      active: true
    },
    {
      code: 'FLAT1000',
      discountType: 'FIXED',
      discountValue: 1000,
      minOrderAmount: 7000,
      expiryDate: '2027-12-31',
      active: true
    },
    {
      code: 'EXPIRED20',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      minOrderAmount: 2000,
      expiryDate: '2020-01-01',
      active: false
    }
  ];

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('valknut_products_v2', JSON.stringify([testProduct]));
    vi.spyOn(productService, 'getAllProducts').mockResolvedValue([testProduct]);
  });

  it('calculates standard shipping charge of 450 LKR and free shipping over 10,000 LKR threshold', () => {
    // Under 10,000 threshold (e.g. 5,000 LKR order)
    const underThreshold = calculateShippingFee('standard', 5000);
    expect(underThreshold.charge).toBe(450);
    expect(underThreshold.isFree).toBe(false);

    // Over 10,000 threshold (e.g. 15,000 LKR order)
    const overThreshold = calculateShippingFee('standard', 15000);
    expect(overThreshold.charge).toBe(0);
    expect(overThreshold.isFree).toBe(true);

    // Express shipping charge is 850 LKR and never free
    const expressShip = calculateShippingFee('express', 50000);
    expect(expressShip.charge).toBe(850);
  });

  it('rejects empty shopping bag validation', async () => {
    const result = await validateOrderSecurity([], undefined, 'standard');
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('empty');
  });

  it('accurately calculates percentage discount and total for valid coupon', async () => {
    // Mock cart item where client tampered with unit price (claiming 1000 LKR instead of 7500)
    const cartItem: CartItem = {
      id: 'cart-1',
      productId: testProduct.id,
      product: testProduct,
      selectedSize: 'M',
      selectedColor: 'Onyx Black',
      selectedColorHex: '#000000',
      quantity: 2,
      unitPrice: 1000 // Tampered! Server must enforce authoritative price 7500
    };

    const validation = await validateOrderSecurity([cartItem], 'VALKNUT10', 'standard', testCoupons);
    
    expect(validation.valid).toBe(true);
    // Subtotal should be 7500 * 2 = 15000 (not 1000 * 2)
    expect(validation.validatedSubtotal).toBe(15000);
    // Discount: 10% of 15000 = 1500
    expect(validation.validatedDiscount).toBe(1500);
    // Shipping: 0 because 15,000 >= 10,000 threshold
    expect(validation.validatedShippingCharge).toBe(0);
    // Final Total: 15000 - 1500 + 0 = 13500
    expect(validation.validatedTotal).toBe(13500);
  });

  it('rejects expired coupon code and enforces minimum order amount', async () => {
    const cartItem: CartItem = {
      id: 'cart-1',
      productId: testProduct.id,
      product: testProduct,
      selectedSize: 'M',
      selectedColor: 'Onyx Black',
      selectedColorHex: '#000000',
      quantity: 1,
      unitPrice: 7500
    };

    const resultExpired = await validateOrderSecurity([cartItem], 'EXPIRED20', 'standard', testCoupons);
    expect(resultExpired.valid).toBe(false);
    expect(resultExpired.errors.some(e => e.includes('invalid or expired'))).toBe(true);

    const resultMinAmount = await validateOrderSecurity(
      [{ ...cartItem, quantity: 1 }], 
      'FLAT1000', 
      'standard', 
      [{ ...testCoupons[1], minOrderAmount: 20000 }]
    );
    expect(resultMinAmount.valid).toBe(false);
    expect(resultMinAmount.errors.some(e => e.includes('minimum order'))).toBe(true);
  });

  it('rejects order for out-of-stock product variant', async () => {
    const outOfStockItem: CartItem = {
      id: 'cart-oos',
      productId: testProduct.id,
      product: testProduct,
      selectedSize: 'L', // Size L has stock = 0
      selectedColor: 'Onyx Black',
      selectedColorHex: '#000000',
      quantity: 1,
      unitPrice: 7500
    };

    const result = await validateOrderSecurity([outOfStockItem], undefined, 'standard', testCoupons);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('out of stock'))).toBe(true);
  });

  it('deducts stock correctly after customer purchase', () => {
    // Initial stock for Size M is 10, Size L is 0
    const productsBefore = [testProduct];
    const cartItems = [{ productId: testProduct.id, size: 'M', color: 'Onyx Black', quantity: 4 }];

    const updated = deductStockFromProducts(productsBefore, cartItems);
    const sizeM = updated[0].variants.find(v => v.size === 'M');
    const sizeL = updated[0].variants.find(v => v.size === 'L');

    expect(sizeM?.stock).toBe(6); // 10 - 4 = 6
    expect(sizeL?.stock).toBe(0); // Unchanged
  });
});
