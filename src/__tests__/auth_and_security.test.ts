import { describe, it, expect } from 'vitest';
import { registerCustomer, loginAdmin } from '../services/authService';

describe('Authentication, Authorization & Security QA Suite', () => {
  it('validates customer registration inputs and blocks invalid emails', async () => {
    const invalidEmailRes = await registerCustomer('invalid-email-string', '123456', 'Kasun Perera');
    expect(invalidEmailRes.success).toBe(false);
    expect(invalidEmailRes.message).toContain('valid email');

    const shortPassRes = await registerCustomer('valid@example.com', '123', 'Kasun Perera');
    expect(shortPassRes.success).toBe(false);
    expect(shortPassRes.message).toContain('at least 6 characters');

    const shortNameRes = await registerCustomer('valid@example.com', '123456', 'A');
    expect(shortNameRes.success).toBe(false);
    expect(shortNameRes.message).toContain('legal name');
  });

  it('rejects empty credentials in admin login gate', async () => {
    const emptyEmail = await loginAdmin('', '123456');
    expect(emptyEmail.success).toBe(false);
    expect(emptyEmail.message).toContain('Admin email is required');

    const emptyPass = await loginAdmin('valknutofficial4@gmail.com', '');
    expect(emptyPass.success).toBe(false);
    expect(emptyPass.message).toContain('Admin password is required');
  });

  it('verifies that no service-role secrets are exposed in client environment', () => {
    expect((import.meta.env as any).VITE_SUPABASE_SERVICE_ROLE_KEY).toBeUndefined();
    expect((import.meta.env as any).SUPABASE_SERVICE_ROLE_KEY).toBeUndefined();
    expect((import.meta.env as any).CLOUDINARY_API_SECRET).toBeUndefined();
    expect((import.meta.env as any).VITE_CLOUDINARY_API_SECRET).toBeUndefined();
  });
});
