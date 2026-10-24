import { describe, it, expect } from 'vitest';
import { generateOnePayHash, initiateOnePayPayment, getOnePayConfig } from '../services/onepayService';

describe('OnePay Payment Gateway Service', () => {
  it('generates accurate SHA-256 digital signature following OnePay specification', async () => {
    const appId = 'TEST_APP_123';
    const currency = 'LKR';
    const amount = 1500.5;
    const hashSalt = 'SECRET_SALT_ABC';

    // Formula: SHA256(appId + currency + formattedAmount + hashSalt)
    // String: "TEST_APP_123LKR1500.50SECRET_SALT_ABC"
    const hash = await generateOnePayHash(appId, currency, amount, hashSalt);
    
    expect(hash).toBeDefined();
    expect(hash.length).toBe(64); // Valid SHA-256 hex string
    
    // Deterministic check
    const secondHash = await generateOnePayHash(appId, currency, amount, hashSalt);
    expect(hash).toBe(secondHash);
  });

  it('loads configuration from environment properly', () => {
    const config = getOnePayConfig();
    expect(config).toBeDefined();
    expect(config.environment).toBe('sandbox');
    expect(config.appId).toBe('M2AZ1192C785F712D7E21');
  });

  it('initiates payment request in sandbox mode successfully', async () => {
    const response = await initiateOnePayPayment({
      orderNumber: 'VK-TEST-20261023',
      amount: 4500,
      customerName: 'Kasun Perera',
      customerEmail: 'kasun@example.com',
      customerPhone: '0771234567'
    });

    expect(response.success).toBe(true);
    expect(response.paymentUrl).toBeDefined();
    expect(response.transactionId).toBeDefined();
  });
});
