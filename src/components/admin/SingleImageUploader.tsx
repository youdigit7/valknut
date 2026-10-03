import React, { useState, useRef } from 'react';
import { Upload, Trash2, RefreshCw, AlertCircle, Image as ImageIcon, X } from 'lucide-react';
import { uploadMediaFile, validateImageFile, deleteMediaFile, ALLOWED_IMAGE_TYPES } from '../../services/mediaService';
import type { MediaScope } from '../../services/mediaService';

interface SingleImageUploaderProps {
  imageUrl: string;
  onChange: (newUrl: string) => void;
  scope: MediaScope;
  identifier?: string;
  label?: string;
  placeholder?: string;
}

export const SingleImageUploader: React.FC<SingleImageUploaderProps> = ({
  imageUrl,
  onChange,
  scope,
  identifier = 'general',
  label = 'Cover Image',
  placeholder = 'https://images.unsplash.com/...'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg('');

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setErrorMsg(validation.error || 'Invalid image file.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);

    try {
      const oldUrl = imageUrl;
      const result = await uploadMediaFile(file, {
        scope,
        identifier,
        fileName: file.name,
        optimize: true,
        onProgress: (pct) => setUploadProgress(pct)
      });

      if (oldUrl && !oldUrl.includes('unsplash.com')) {
        deleteMediaFile(oldUrl);
      }

      onChange(result.url);
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 400);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setErrorMsg(err.message || 'Upload failed.');
      setIsUploading(false);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    if (imageUrl && !imageUrl.includes('unsplash.com')) {
      deleteMediaFile(imageUrl);
    }
    onChange('');
  };

  return (
    <div className="space-y-2 font-mono text-xs">
      <div className="flex items-center justify-between">
        <label className="text-slate-300 font-bold block uppercase text-[10px] tracking-wider">
          {label}
        </label>
        {imageUrl && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1"
          >
            <Trash2 size={11} />
            <span>Remove</span>
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="p-2 bg-red-950/70 border border-red-500/40 rounded text-red-300 text-[11px] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <AlertCircle size={13} className="text-red-400" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')}><X size={12} /></button>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="p-2.5 bg-[#141620] border border-[#D4AF37]/30 rounded space-y-1.5 animate-fade-in">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-300 flex items-center gap-1.5">
              <RefreshCw size={11} className="animate-spin text-[#D4AF37]" />
              <span>Uploading to Firebase Storage...</span>
            </span>
            <span className="text-[#D4AF37] font-bold">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-[#0E1017] rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#D4AF37] h-full transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Preview box */}
        <div className="w-16 h-16 rounded bg-[#141620] border border-white/15 overflow-hidden flex-shrink-0 flex items-center justify-center relative group">
          {imageUrl ? (
            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon size={20} className="text-slate-600" />
          )}
        </div>

        {/* URL Input & Upload Action */}
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2 text-white text-[11px] focus:outline-none"
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-3 py-1 bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload size={11} />
              <span>Upload Local Image</span>
            </button>
            <span className="text-[10px] text-slate-500">JPG, PNG, WEBP (Max 10MB)</span>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
