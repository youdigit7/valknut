import { describe, it, expect } from 'vitest';
import { 
  getCloudinaryConfig, 
  isCloudinaryConfigured, 
  getOptimizedCloudinaryUrl, 
  validateImageFile,
  validateMediaFile, 
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES, 
  MAX_FILE_SIZE_BYTES,
  MAX_VIDEO_SIZE_BYTES,
  ECO_IMAGE_MAX_WIDTH,
  ECO_IMAGE_QUALITY,
  ECO_VIDEO_MAX_WIDTH,
  getStorageQuotaMetrics,
  MONTHLY_STORAGE_LIMIT_GB 
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

  it('validates image and video files, enforcing supported formats and sizes', () => {
    // Valid image format check
    expect(ALLOWED_IMAGE_TYPES).toContain('image/jpeg');
    expect(ALLOWED_IMAGE_TYPES).toContain('image/png');
    expect(ALLOWED_IMAGE_TYPES).toContain('image/webp');
    expect(MAX_FILE_SIZE_BYTES).toBe(10 * 1024 * 1024); // 10MB limit

    // Valid video format check
    expect(ALLOWED_VIDEO_TYPES).toContain('video/mp4');
    expect(ALLOWED_VIDEO_TYPES).toContain('video/webm');
    expect(MAX_VIDEO_SIZE_BYTES).toBe(50 * 1024 * 1024); // 50MB limit

    // Mock File test - Image
    const validImage = new File(['mock content'], 'hoodie.jpg', { type: 'image/jpeg' });
    const imgValidation = validateMediaFile(validImage);
    expect(imgValidation.isValid).toBe(true);
    expect(imgValidation.mediaType).toBe('image');

    // Mock File test - Video
    const validVideo = new File(['mock video'], 'lookbook.mp4', { type: 'video/mp4' });
    const vidValidation = validateMediaFile(validVideo);
    expect(vidValidation.isValid).toBe(true);
    expect(vidValidation.mediaType).toBe('video');

    // Unsupported format test
    const invalidFile = new File(['mock executable'], 'virus.exe', { type: 'application/x-msdownload' });
    const invalidValidation = validateImageFile(invalidFile);
    expect(invalidValidation.isValid).toBe(false);
    expect(invalidValidation.error).toContain('Unsupported format');
  });

  it('transforms Cloudinary URLs with dynamic optimizations f_auto, q_auto, and video eco codec', () => {
    const rawCldUrl = 'https://res.cloudinary.com/ofrariny/image/upload/v1792177103/valknut/fh5iiissseg7njxt2o0e.jpg';
    
    // Transform with width 800 and quality auto
    const optimized = getOptimizedCloudinaryUrl(rawCldUrl, { width: 800, quality: 'auto' });
    expect(optimized).toContain('f_auto,q_auto,w_800');
    expect(optimized).toContain('valknut/fh5iiissseg7njxt2o0e.jpg');

    // Transform with custom width and height
    const resized = getOptimizedCloudinaryUrl(rawCldUrl, { width: 400, height: 400, crop: 'fill' });
    expect(resized).toContain('w_400,h_400,c_fill');

    // Video URL downscaling transformation
    const rawVideoUrl = 'https://res.cloudinary.com/ofrariny/video/upload/v1792177103/valknut/lookbook.mp4';
    const optimizedVideo = getOptimizedCloudinaryUrl(rawVideoUrl);
    expect(optimizedVideo).toContain('vc_auto,q_auto:eco,w_1080,br_1m');

    // Non-cloudinary URL should return unchanged
    const nonCldUrl = 'https://images.unsplash.com/photo-123';
    expect(getOptimizedCloudinaryUrl(nonCldUrl, { width: 500 })).toBe(nonCldUrl);
  });

  it('enforces downscaled quality standards and verifies sub-5GB capacity metrics', () => {
    expect(MONTHLY_STORAGE_LIMIT_GB).toBe(5);
    expect(ECO_IMAGE_MAX_WIDTH).toBe(1280);
    expect(ECO_IMAGE_QUALITY).toBe(0.72);
    expect(ECO_VIDEO_MAX_WIDTH).toBe(1080);

    // Test with typical catalog of 50 images (~4.5MB with 0.72 WebP)
    const typicalMetrics = getStorageQuotaMetrics(50);
    expect(typicalMetrics.totalLimitGb).toBe(5);
    expect(typicalMetrics.productImageCount).toBe(50);
    expect(typicalMetrics.isBelowQuota).toBe(true);
    expect(typicalMetrics.tierStatus).toBe('free_tier_active');
    expect(typicalMetrics.estimatedCostMonthlyUsd).toBe(0);
    expect(typicalMetrics.remainingGb).toBeGreaterThan(4.99);
    expect(typicalMetrics.percentUsed).toBeLessThan(1);
    expect(typicalMetrics.compressionRatioPercent).toBe(72);

    // Test with massive catalog of 5,000 images (~450MB)
    const largeCatalogMetrics = getStorageQuotaMetrics(5000);
    expect(largeCatalogMetrics.isBelowQuota).toBe(true);
    expect(largeCatalogMetrics.tierStatus).toBe('free_tier_active');
    expect(largeCatalogMetrics.estimatedCostMonthlyUsd).toBe(0);
    expect(largeCatalogMetrics.remainingGb).toBeGreaterThan(4.5);
  });
});
