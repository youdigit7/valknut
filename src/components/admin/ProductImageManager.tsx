import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Star, 
  RefreshCw, 
  Plus, 
  AlertCircle, 
  Image as ImageIcon,
  Eye,
  X
} from 'lucide-react';
import { 
  uploadMediaFile, 
  validateImageFile, 
  deleteMediaFile, 
  ALLOWED_IMAGE_TYPES 
} from '../../services/mediaService';
import { isFirebaseConfigured } from '../../lib/firebase';

interface ProductImageManagerProps {
  productId?: string;
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export const ProductImageManager: React.FC<ProductImageManagerProps> = ({
  productId = 'temp-product',
  images,
  onChange,
  maxImages = 8
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string>('');
  const [activeUploadFile, setActiveUploadFile] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewZoomUrl, setPreviewZoomUrl] = useState<string | null>(null);

  // Manual URL Add state
  const [manualUrlInput, setManualUrlInput] = useState('');
  const [isAddingUrl, setIsAddingUrl] = useState(false);

  // Handle Multi-file Upload
  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError('');

    if (images.length + files.length > maxImages) {
      setUploadError(`Maximum limit of ${maxImages} images reached. Please remove some images first.`);
      return;
    }

    const fileArray = Array.from(files);

    // Validate all files first
    for (const file of fileArray) {
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        setUploadError(validation.error || 'Invalid file detected.');
        return;
      }
    }

    setIsUploading(true);
    const newUploadedUrls: string[] = [];

    try {
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        setActiveUploadFile(`${file.name} (${i + 1}/${fileArray.length})`);
        setUploadProgress(10);

        const result = await uploadMediaFile(file, {
          scope: 'products',
          identifier: productId,
          fileName: file.name,
          optimize: true,
          onProgress: (pct) => setUploadProgress(pct)
        });

        newUploadedUrls.push(result.url);
      }

      onChange([...images, ...newUploadedUrls]);
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setActiveUploadFile('');
      }, 500);
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setUploadError(err.message || 'Failed to upload image. Please try again.');
      setIsUploading(false);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle Single Image Replacement
  const handleReplaceFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || replacingIndex === null) return;
    setUploadError('');

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setUploadError(validation.error || 'Invalid file for replacement.');
      return;
    }

    setIsUploading(true);
    setActiveUploadFile(`Replacing slot #${replacingIndex + 1}...`);
    setUploadProgress(20);

    try {
      const oldUrl = images[replacingIndex];
      const result = await uploadMediaFile(file, {
        scope: 'products',
        identifier: productId,
        fileName: file.name,
        optimize: true,
        onProgress: (pct) => setUploadProgress(pct)
      });

      // Cleanup old file from storage asynchronously
      if (oldUrl) deleteMediaFile(oldUrl);

      const updated = [...images];
      updated[replacingIndex] = result.url;
      onChange(updated);

      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setReplacingIndex(null);
      }, 500);
    } catch (err: any) {
      setUploadError(err.message || 'Replacement failed.');
      setIsUploading(false);
    } finally {
      if (replaceInputRef.current) replaceInputRef.current.value = '';
    }
  };

  // Move image position
  const moveImage = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= images.length) return;
    const copy = [...images];
    const item = copy.splice(fromIdx, 1)[0];
    copy.splice(toIdx, 0, item);
    onChange(copy);
  };

  // Set as Primary (Index 0)
  const setPrimaryImage = (index: number) => {
    if (index === 0) return;
    moveImage(index, 0);
  };

  // Delete image
  const removeImage = (index: number) => {
    const targetUrl = images[index];
    if (targetUrl) deleteMediaFile(targetUrl);
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  // Add URL directly
  const handleAddManualUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrlInput.trim()) return;

    if (!manualUrlInput.startsWith('http://') && !manualUrlInput.startsWith('https://') && !manualUrlInput.startsWith('data:')) {
      setUploadError('Please provide a valid web URL starting with https://');
      return;
    }

    onChange([...images, manualUrlInput.trim()]);
    setManualUrlInput('');
    setIsAddingUrl(false);
    setUploadError('');
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      
      {/* Header bar with Cloud Sync Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="text-[#D4AF37]" size={16} />
          <span className="text-white font-bold tracking-wider uppercase">
            PRODUCT MEDIA GALLERY ({images.length}/{maxImages})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isFirebaseConfigured ? (
            <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Firebase Bucket Online</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-[10px] text-amber-400">
              Local High-Res Fallback
            </span>
          )}
        </div>
      </div>

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="p-3 bg-red-950/70 border border-red-500/50 rounded text-red-300 text-xs flex items-center justify-between gap-2 animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
            <span>{uploadError}</span>
          </div>
          <button onClick={() => setUploadError('')} className="text-red-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Uploading Progress Bar */}
      {isUploading && (
        <div className="p-3.5 bg-[#141620] border border-[#D4AF37]/40 rounded-md space-y-2 animate-fade-in">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-white font-bold flex items-center gap-2">
              <RefreshCw size={13} className="animate-spin text-[#D4AF37]" />
              <span>Uploading {activeUploadFile}...</span>
            </span>
            <span className="text-[#D4AF37] font-bold">{uploadProgress}%</span>
          </div>

          <div className="w-full bg-[#0E1017] rounded-full h-2 overflow-hidden border border-white/10">
            <div 
              className="bg-gradient-to-r from-[#D4AF37] to-[#E2B714] h-full transition-all duration-200 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Current Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((imgUrl, idx) => {
            const isPrimary = idx === 0;
            return (
              <div 
                key={`${imgUrl}-${idx}`}
                className={`group relative bg-[#141620] rounded border transition-all overflow-hidden flex flex-col justify-between ${
                  isPrimary ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/50' : 'border-white/10 hover:border-white/30'
                }`}
              >
                {/* Image Preview */}
                <div className="h-36 w-full relative bg-[#0A0B0E] overflow-hidden">
                  <img 
                    src={imgUrl} 
                    alt={`Product image ${idx + 1}`} 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    loading={isPrimary ? 'eager' : 'lazy'}
                  />

                  {/* Primary Badge */}
                  {isPrimary && (
                    <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-black/90 border border-[#D4AF37] rounded text-[9px] text-[#D4AF37] font-bold flex items-center gap-1 shadow-lg">
                      <Star size={10} className="fill-[#D4AF37]" />
                      <span>COVER</span>
                    </div>
                  )}

                  {/* Zoom Preview Button */}
                  <button
                    type="button"
                    onClick={() => setPreviewZoomUrl(imgUrl)}
                    className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black text-slate-300 hover:text-white rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    title="Zoom View"
                  >
                    <Eye size={12} />
                  </button>
                </div>

                {/* Controls Bar */}
                <div className="p-2 bg-[#0E1017] border-t border-white/5 flex items-center justify-between gap-1">
                  
                  {/* Left / Right Position */}
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveImage(idx, idx - 1)}
                      className={`p-1 rounded ${idx === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                      title="Move Left"
                    >
                      <ArrowLeft size={12} />
                    </button>

                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => moveImage(idx, idx + 1)}
                      className={`p-1 rounded ${idx === images.length - 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                      title="Move Right"
                    >
                      <ArrowRight size={12} />
                    </button>
                  </div>

                  {/* Action Icons */}
                  <div className="flex items-center gap-1">
                    {!isPrimary && (
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(idx)}
                        className="px-1.5 py-0.5 bg-white/5 hover:bg-[#D4AF37]/20 text-[#D4AF37] rounded text-[9px] font-bold"
                        title="Set as Main Cover Image"
                      >
                        Set Cover
                      </button>
                    )}

                    {/* Replace Image */}
                    <button
                      type="button"
                      onClick={() => {
                        setReplacingIndex(idx);
                        replaceInputRef.current?.click();
                      }}
                      className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded"
                      title="Replace Image"
                    >
                      <RefreshCw size={12} />
                    </button>

                    {/* Delete Image */}
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="p-1 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded"
                      title="Delete Image"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      {images.length < maxImages && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            handleFilesSelected(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-all ${
            isDragOver 
              ? 'border-[#D4AF37] bg-[#D4AF37]/10' 
              : 'border-white/15 hover:border-[#D4AF37]/60 bg-[#141620]/60 hover:bg-[#141620]'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-[#D4AF37] flex items-center justify-center">
              <Upload size={18} />
            </div>

            <div className="space-y-0.5">
              <p className="text-white font-bold">
                Drop high-resolution images here or <span className="text-[#D4AF37] underline">Browse</span>
              </p>
              <p className="text-slate-400 text-[11px]">
                Supports JPG, JPEG, PNG, WEBP (Up to 10MB per file)
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-500">
              <span>Automatic dimension scaling</span>
              <span>•</span>
              <span>Direct Firebase CDN Delivery</span>
            </div>
          </div>
        </div>
      )}

      {/* Alternate: Paste Direct URL */}
      <div className="flex items-center justify-between pt-1">
        {isAddingUrl ? (
          <form onSubmit={handleAddManualUrl} className="flex items-center gap-2 w-full animate-fade-in">
            <input
              type="text"
              value={manualUrlInput}
              onChange={(e) => setManualUrlInput(e.target.value)}
              placeholder="Paste direct HTTPS image link (e.g. https://images.unsplash.com/...)"
              className="flex-1 bg-[#141620] border border-white/15 rounded p-2 text-white text-[11px] focus:outline-none focus:border-[#D4AF37]"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-[#D4AF37] text-black font-bold rounded text-[11px] uppercase tracking-wider"
            >
              Add Link
            </button>
            <button
              type="button"
              onClick={() => setIsAddingUrl(false)}
              className="p-2 text-slate-400 hover:text-white"
            >
              <X size={14} />
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAddingUrl(true)}
            className="text-[11px] text-[#D4AF37] hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={12} />
            <span>Or paste external image URL</span>
          </button>
        )}
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        onChange={(e) => handleFilesSelected(e.target.files)}
        className="hidden"
      />

      <input
        ref={replaceInputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        onChange={handleReplaceFileSelected}
        className="hidden"
      />

      {/* Full Preview Zoom Modal */}
      {previewZoomUrl && (
        <div 
          onClick={() => setPreviewZoomUrl(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded border border-white/20 shadow-2xl">
            <img src={previewZoomUrl} alt="Zoom Preview" className="w-full h-full object-contain" />
            <button
              onClick={() => setPreviewZoomUrl(null)}
              className="absolute top-3 right-3 p-2 bg-black/80 text-white rounded-full hover:bg-black"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
