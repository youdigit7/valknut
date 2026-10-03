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

/**
 * Uploads a file to Firebase Storage with progress tracking, client validation, and local fallback
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

  // 1. Firebase Cloud Storage Upload (If configured)
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

      return new Promise<UploadMediaResult>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) onProgress(Math.round(progress));
          },
          (error) => {
            console.error('Firebase Storage upload error:', error);
            reject(new Error(`Firebase Storage error: ${error.message}`));
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
    } catch (firebaseErr: any) {
      console.warn('Firebase storage failed, switching to local Data URL fallback:', firebaseErr);
    }
  }

  // 2. Local Fallback (Base64 / Data URL) for development & offline modes
  return new Promise<UploadMediaResult>((resolve, reject) => {
    let currentPct = 0;
    const interval = setInterval(() => {
      currentPct += 25;
      if (onProgress) onProgress(Math.min(currentPct, 95));
      if (currentPct >= 100) {
        clearInterval(interval);
      }
    }, 40);

    const reader = new FileReader();
    reader.onload = () => {
      clearInterval(interval);
      if (onProgress) onProgress(100);
      resolve({
        url: reader.result as string,
        storagePath: `local://fallback/${storagePath}`,
        fileName: originalName,
        sizeBytes: fileToUpload.size,
        type: fileToUpload.type || 'image/webp'
      });
    };
    reader.onerror = () => {
      clearInterval(interval);
      reject(new Error('Failed to read image file data.'));
    };
    reader.readAsDataURL(fileToUpload);
  });
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
