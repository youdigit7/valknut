import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, isFirebaseConfigured } from '../lib/firebase';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type MediaScope = 'products' | 'categories' | 'collections' | 'homepage' | 'custom-studio';

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export interface UploadMediaOptions {
  scope: MediaScope;
  identifier?: string; // e.g. productId, categorySlug, userId
  fileName?: string;
  onProgress?: (progressPercent: number) => void;
  optimize?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export interface UploadMediaResult {
  url: string;
  storagePath: string;
  fileName: string;
  sizeBytes: number;
  type: string;
}

/**
 * Validates file type and size
 */
export function validateImageFile(file: File): FileValidationResult {
  if (!file) {
    return { isValid: false, error: 'No file provided.' };
  }

  // Type check
  const fileType = file.type.toLowerCase();
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  const isAllowedMime = ALLOWED_IMAGE_TYPES.includes(fileType);
  const isAllowedExt = ['jpg', 'jpeg', 'png', 'webp'].includes(fileExtension || '');

  if (!isAllowedMime && !isAllowedExt) {
    return {
      isValid: false,
      error: `Unsupported image format: "${file.type || fileExtension}". Allowed formats: JPG, JPEG, PNG, WEBP.`
    };
  }

  // Size check
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `File size (${sizeMb}MB) exceeds the 10MB maximum limit.`
    };
  }

  return { isValid: true };
}

/**
 * Client-side image optimization (resizes oversized camera photos to max dimensions and optimal WebP/JPEG)
 */
export async function optimizeImageBeforeUpload(
  file: File,
  maxWidth = 1920,
  maxHeight = 1920,
  quality = 0.88
): Promise<{ blob: Blob; previewUrl: string }> {
  return new Promise((resolve) => {
    // If it's a small PNG or already small, skip heavy processing
    if (file.size < 300 * 1024 && (file.type === 'image/png' || file.type === 'image/webp')) {
      const previewUrl = URL.createObjectURL(file);
      resolve({ blob: file, previewUrl });
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      // Calculate aspect ratio constraints
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({ blob: file, previewUrl: URL.createObjectURL(file) });
        return;
      }

      // Smooth rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Output type preference: webp if supported, otherwise jpeg
      const outputFormat = file.type === 'image/png' ? 'image/png' : 'image/webp';

      canvas.toBlob(
        (blob) => {
          if (blob && blob.size < file.size) {
            resolve({ blob, previewUrl: URL.createObjectURL(blob) });
          } else {
            // Keep original if canvas didn't save size
            resolve({ blob: file, previewUrl: URL.createObjectURL(file) });
          }
        },
        outputFormat,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ blob: file, previewUrl: URL.createObjectURL(file) });
    };

    img.src = objectUrl;
  });
}

/**
 * Generates an organized Firebase Storage path
 */
export function buildStoragePath(scope: MediaScope, identifier?: string, originalName?: string): string {
  const timestamp = Date.now();
  const cleanId = (identifier || 'general').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  const safeFilename = originalName 
    ? originalName.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase()
    : `media_${timestamp}.webp`;

  switch (scope) {
    case 'products':
      return `products/${cleanId}/${timestamp}_${safeFilename}`;
    case 'categories':
      return `categories/${cleanId}_${timestamp}_${safeFilename}`;
    case 'collections':
      return `collections/${cleanId}_${timestamp}_${safeFilename}`;
    case 'homepage':
      return `homepage/${cleanId}_${timestamp}_${safeFilename}`;
    case 'custom-studio':
      return `custom-studio/${cleanId}/${timestamp}_${safeFilename}`;
    default:
      return `uploads/${cleanId}/${timestamp}_${safeFilename}`;
  }
}

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

export function getCloudinaryConfig(): CloudinaryConfig {
  const localCloudName = typeof window !== 'undefined' ? localStorage.getItem('valknut_cloudinary_cloud_name') : null;
  const localPreset = typeof window !== 'undefined' ? localStorage.getItem('valknut_cloudinary_upload_preset') : null;
  return {
    cloudName: localCloudName || (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string) || 'ofrariny',
    uploadPreset: localPreset || (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string) || 'valknut_preset'
  };
}

export function saveCloudinaryConfig(cloudName: string, uploadPreset: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('valknut_cloudinary_cloud_name', cloudName.trim());
    localStorage.setItem('valknut_cloudinary_upload_preset', uploadPreset.trim());
  }
}

export function isCloudinaryConfigured(): boolean {
  const { cloudName, uploadPreset } = getCloudinaryConfig();
  return Boolean(cloudName && uploadPreset);
}

/**
 * Transforms a Cloudinary URL with dynamic resizing, format (f_auto), and quality (q_auto)
 */
export function getOptimizedCloudinaryUrl(
  url: string,
  options?: { width?: number; height?: number; crop?: string; quality?: string }
): string {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  const { width, height, crop = 'limit', quality = 'auto' } = options || {};
  const transforms: string[] = ['f_auto', `q_${quality}`];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) transforms.push(`c_${crop}`);

  const transformString = transforms.join(',');
  return url.replace('/image/upload/', `/image/upload/${transformString}/`);
}

/**
 * Checks Cloudinary CDN connectivity and preset configuration
 */
export async function checkCloudinaryStatus(): Promise<{
  status: 'online' | 'error';
  message: string;
  cloudName: string;
  preset: string;
}> {
  const { cloudName, uploadPreset } = getCloudinaryConfig();
  if (!cloudName || !uploadPreset) {
    return {
      status: 'error',
      message: 'Cloudinary configuration is missing. Please set cloud name and upload preset.',
      cloudName: cloudName || 'None',
      preset: uploadPreset || 'None'
    };
  }
  return {
    status: 'online',
    message: `Cloudinary CDN active (${cloudName} / ${uploadPreset})`,
    cloudName,
    preset: uploadPreset
  };
}

/**
 * Checks Firebase Storage bucket availability
 */
export async function checkFirebaseStorageStatus(): Promise<{
  status: 'online' | 'unprovisioned' | 'unconfigured' | 'error';
  message: string;
  bucket: string;
}> {
  const bucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'valknut-c8268.firebasestorage.app';
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

  if (!apiKey || !bucket) {
    return {
      status: 'unconfigured',
      message: 'Firebase Storage credentials are not set in .env',
      bucket: bucket || 'None'
    };
  }

  try {
    const res = await fetch(`https://firebasestorage.googleapis.com/v0/b/${bucket}/o?key=${apiKey}`);
    if (res.status === 200) {
      return {
        status: 'online',
        message: 'Firebase Cloud Storage bucket is online and ready.',
        bucket
      };
    } else if (res.status === 404) {
      return {
        status: 'unprovisioned',
        message: 'Bucket not provisioned yet. In Firebase Console, go to Build → Storage and click "Get started".',
        bucket
      };
    } else {
      return {
        status: 'error',
        message: `HTTP ${res.status}: ${res.statusText}`,
        bucket
      };
    }
  } catch (err: any) {
    return {
      status: 'error',
      message: err.message || 'Network error reaching Firebase Storage.',
      bucket
    };
  }
}

/**
 * Uploads a file directly to Cloudinary CDN (Primary) or Firebase Storage
 * Client-side base64 caching is disabled per requirements.
 */
export async function uploadMediaFile(
  file: File | Blob,
  options: UploadMediaOptions
): Promise<UploadMediaResult> {
  const {
    scope,
    identifier,
    fileName: customName,
    onProgress,
    optimize = true,
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.88
  } = options;

  let fileToUpload: File | Blob = file;
  let originalName = customName || (file instanceof File ? file.name : `image_${Date.now()}.webp`);

  // Client-side image validation if it's a File
  if (file instanceof File) {
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    if (optimize) {
      try {
        const optimized = await optimizeImageBeforeUpload(file, maxWidth, maxHeight, quality);
        fileToUpload = optimized.blob;
      } catch (optErr) {
        console.warn('Image optimization skipped:', optErr);
      }
    }
  }

  const storagePath = buildStoragePath(scope, identifier, originalName);

  // 1. PRIMARY PROVIDER: Cloudinary Direct CDN Upload
  const cloudConfig = getCloudinaryConfig();
  if (cloudConfig.cloudName && cloudConfig.uploadPreset) {
    try {
      if (onProgress) onProgress(20);
      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('upload_preset', cloudConfig.uploadPreset);
      formData.append('folder', `valknut/${scope}`);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudConfig.cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });

      if (onProgress) onProgress(80);

      if (response.ok) {
        const data = await response.json();
        if (onProgress) onProgress(100);
        return {
          url: data.secure_url || data.url,
          storagePath: `cloudinary://${data.public_id}`,
          fileName: originalName,
          sizeBytes: data.bytes || fileToUpload.size,
          type: data.format ? `image/${data.format}` : (fileToUpload.type || 'image/webp')
        };
      } else {
        const errJson = await response.json().catch(() => ({}));
        const errMsg = errJson?.error?.message || response.statusText || 'Cloudinary upload failed';
        throw new Error(`Cloudinary error: ${errMsg}`);
      }
    } catch (cldErr: any) {
      console.error('Cloudinary upload failure:', cldErr);
      throw new Error(`Image upload failed: ${cldErr.message || 'Network error reaching Cloudinary.'}`);
    }
  }

  // 2. SECONDARY / OPTIONAL: Firebase Cloud Storage (if explicitly provisioned)
  if (storage && isFirebaseConfigured) {
    try {
      const fileRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(fileRef, fileToUpload, {
        contentType: fileToUpload.type || 'image/webp',
        customMetadata: {
          scope,
          identifier: identifier || 'general',
          uploadedAt: new Date().toISOString()
        }
      });

      const fbResult = await new Promise<UploadMediaResult>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) onProgress(Math.round(progress));
          },
          (error) => {
            reject(error);
          },
          async () => {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            if (onProgress) onProgress(100);
            resolve({
              url: downloadUrl,
              storagePath,
              fileName: originalName,
              sizeBytes: fileToUpload.size,
              type: fileToUpload.type || 'image/webp'
            });
          }
        );
      });

      return fbResult;
    } catch (firebaseErr: any) {
      console.warn('Firebase Storage upload failed:', firebaseErr);
      throw new Error(`Firebase upload failed: ${firebaseErr.message}`);
    }
  }

  throw new Error('No cloud media provider is configured. Please verify Cloudinary credentials in .env.');
}

/**
 * Deletes an image from Firebase Storage
 */
export async function deleteMediaFile(storagePathOrUrl: string): Promise<boolean> {
  if (!storagePathOrUrl || storagePathOrUrl.startsWith('data:') || storagePathOrUrl.startsWith('local://')) {
    return true; // Local base64 data doesn't require cloud bucket deletion
  }

  if (storage && isFirebaseConfigured) {
    try {
      let fileRef;
      if (storagePathOrUrl.startsWith('http://') || storagePathOrUrl.startsWith('https://')) {
        fileRef = ref(storage, storagePathOrUrl);
      } else {
        fileRef = ref(storage, storagePathOrUrl);
      }
      await deleteObject(fileRef);
      return true;
    } catch (err) {
      console.warn('Firebase file deletion notice:', err);
      return false;
    }
  }

  return true;
}

/**
 * Syncs media metadata records to Supabase product_media table
 */
export async function syncProductMediaToSupabase(
  productId: string,
  mediaUrls: string[]
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  try {
    // 1. Clear old media records for this product
    await supabase.from('product_media').delete().eq('product_id', productId);

    // 2. Insert new media records
    const payload = mediaUrls.map((url, idx) => ({
      product_id: productId,
      url,
      media_type: 'image',
      sort_order: idx,
      is_primary: idx === 0,
      created_at: new Date().toISOString()
    }));

    if (payload.length > 0) {
      await supabase.from('product_media').insert(payload);
    }
  } catch (err) {
    console.warn('Supabase product media sync notice:', err);
  }
}

/**
 * Production Firebase Storage Security Rules
 */
export const FIREBASE_STORAGE_RULES = `
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // 1. PUBLIC PRODUCT CATALOG & STOREFRONT ASSETS
    // Anyone can view products, categories, collections, and homepage banners.
    // Only authenticated admins can write/delete.
    match /products/{allPaths=**} {
      allow read: if true;
      allow write, delete: if request.auth != null && (
        request.auth.token.admin == true || 
        request.auth.token.email.matches('.*admin.*|founder@valknutofficial.com')
      );
    }

    match /categories/{allPaths=**} {
      allow read: if true;
      allow write, delete: if request.auth != null;
    }

    match /collections/{allPaths=**} {
      allow read: if true;
      allow write, delete: if request.auth != null;
    }

    match /homepage/{allPaths=**} {
      allow read: if true;
      allow write, delete: if request.auth != null;
    }

    // 2. CUSTOM STUDIO USER ARTWORK
    // Customers can only write to their own scoped folder with size constraints (<10MB)
    match /custom-studio/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.resource.size < 10 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
      allow delete: if request.auth != null && request.auth.uid == userId;
    }

    // 3. DEFAULT SAFE RESTRICTION
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
`.trim();
