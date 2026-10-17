import { describe, it, expect } from 'vitest';
import { 
  getCloudinaryConfig, 
  isCloudinaryConfigured, 
  getOptimizedCloudinaryUrl, 
  validateImageFile, 
  ALLOWED_IMAGE_TYPES, 
  MAX_FILE_SIZE_BYTES 
} from '../services/mediaService';

describe('Cloudinary Media & Asset QA Suite', () => {
  it('correctly retrieves Cloudinary configuration without exposing secrets', () => {
    const config = getCloudinaryConfig();
    expect(config.cloudName).toBe('ofrariny');
    expect(config.uploadPreset).toBe('valknut_preset');
    expect(isCloudinaryConfigured()).toBe(true);
    // Crucial security test: Config object MUST NOT include API secret
    expect((config as any).apiSecret).toBeUndefined();
  });

  it('validates image files and enforces supported formats and size limits', () => {
    // Valid format check
    expect(ALLOWED_IMAGE_TYPES).toContain('image/jpeg');
    expect(ALLOWED_IMAGE_TYPES).toContain('image/png');
    expect(ALLOWED_IMAGE_TYPES).toContain('image/webp');
    expect(MAX_FILE_SIZE_BYTES).toBe(10 * 1024 * 1024); // 10MB limit

    // Mock File test
    const validFile = new File(['mock content'], 'hoodie.jpg', { type: 'image/jpeg' });
    const validationResult = validateImageFile(validFile);
    expect(validationResult.isValid).toBe(true);

    // Unsupported format test
    const invalidFile = new File(['mock executable'], 'virus.exe', { type: 'application/x-msdownload' });
    const invalidValidation = validateImageFile(invalidFile);
    expect(invalidValidation.isValid).toBe(false);
    expect(invalidValidation.error).toContain('Unsupported image format');
  });

  it('transforms Cloudinary URLs with dynamic optimizations f_auto, q_auto, and width', () => {
    const rawCldUrl = 'https://res.cloudinary.com/ofrariny/image/upload/v1792177103/valknut/fh5iiissseg7njxt2o0e.jpg';
    
    // Transform with width 800
    const optimized = getOptimizedCloudinaryUrl(rawCldUrl, { width: 800, quality: 'auto' });
    expect(optimized).toContain('f_auto,q_auto,w_800');
    expect(optimized).toContain('valknut/fh5iiissseg7njxt2o0e.jpg');

    // Transform with custom width and height
    const resized = getOptimizedCloudinaryUrl(rawCldUrl, { width: 400, height: 400, crop: 'fill' });
    expect(resized).toContain('w_400,h_400,c_fill');

    // Non-cloudinary URL should return unchanged
    const nonCldUrl = 'https://images.unsplash.com/photo-123';
    expect(getOptimizedCloudinaryUrl(nonCldUrl, { width: 500 })).toBe(nonCldUrl);
  });
});
