import React, { useState, useRef } from 'react';
import {
  Box, Typography, Button, LinearProgress, Alert, IconButton, TextField
} from '@mui/material';
import { 
  Upload, Trash2, ArrowLeft, ArrowRight, Star, RefreshCw, Plus, AlertCircle, Image as ImageIcon, Eye, X
} from 'lucide-react';
import { uploadMediaFile, validateImageFile, deleteMediaFile, ALLOWED_IMAGE_TYPES } from '../../services/mediaService';
import { isFirebaseConfigured } from '../../lib/firebase';

interface ProductImageManagerProps {
  productId?: string;
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: '#141620',
    color: 'white',
    fontSize: '0.6875rem',
    fontFamily: '"JetBrains Mono", sans-serif',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
    '&.Mui-focused fieldset': { borderColor: '#D4AF37' },
  },
};

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

  const [manualUrlInput, setManualUrlInput] = useState('');
  const [isAddingUrl, setIsAddingUrl] = useState(false);

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError('');

    if (images.length + files.length > maxImages) {
      setUploadError(`Maximum limit of ${maxImages} images reached. Please remove some images first.`);
      return;
    }

    const fileArray = Array.from(files);
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

  const moveImage = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= images.length) return;
    const copy = [...images];
    const item = copy.splice(fromIdx, 1)[0];
    copy.splice(toIdx, 0, item);
    onChange(copy);
  };

  const setPrimaryImage = (index: number) => {
    if (index === 0) return;
    moveImage(index, 0);
  };

  const removeImage = (index: number) => {
    const targetUrl = images[index];
    if (targetUrl) deleteMediaFile(targetUrl);
    onChange(images.filter((_, i) => i !== index));
  };

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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ImageIcon size={16} color="#D4AF37" />
          <Typography sx={{ fontSize: '0.6875rem', fontFamily: '"JetBrains Mono", sans-serif', fontWeight: 900, letterSpacing: '0.15em', color: 'white', textTransform: 'uppercase' }}>
            PRODUCT MEDIA GALLERY ({images.length}/{maxImages})
          </Typography>
        </Box>
        {isFirebaseConfigured ? (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.5, py: 0.5, borderRadius: 10, bgcolor: 'rgba(6,78,59,0.6)', border: '1px solid rgba(52,211,153,0.3)' }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#34d399', animation: 'pulse 2s infinite' }} />
            <Typography sx={{ fontSize: '0.625rem', fontFamily: '"JetBrains Mono", sans-serif', color: '#34d399' }}>Firebase Bucket Online</Typography>
          </Box>
        ) : (
          <Box sx={{ px: 1.5, py: 0.5, borderRadius: 10, bgcolor: 'rgba(120,53,15,0.6)', border: '1px solid rgba(251,191,36,0.3)' }}>
            <Typography sx={{ fontSize: '0.625rem', fontFamily: '"JetBrains Mono", sans-serif', color: '#fbbf24' }}>Local High-Res Fallback</Typography>
          </Box>
        )}
      </Box>

      {/* Upload Error */}
      {uploadError && (
        <Alert
          severity="error"
          action={<IconButton size="small" onClick={() => setUploadError('')}><X size={14} /></IconButton>}
          icon={<AlertCircle size={16} />}
          sx={{ fontSize: '0.75rem', fontFamily: '"JetBrains Mono", sans-serif', bgcolor: 'rgba(127,29,29,0.7)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.5)' }}
        >
          {uploadError}
        </Alert>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <Box sx={{ p: 2, bgcolor: '#141620', border: '1px solid rgba(212,175,55,0.4)', borderRadius: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.6875rem', fontFamily: '"JetBrains Mono", sans-serif', fontWeight: 900, color: 'white' }}>
              <RefreshCw size={13} style={{ color: '#D4AF37', animation: 'spin 1s linear infinite' }} />
              Uploading {activeUploadFile}...
            </Typography>
            <Typography sx={{ fontSize: '0.6875rem', fontFamily: '"JetBrains Mono", sans-serif', fontWeight: 900, color: '#D4AF37' }}>
              {uploadProgress}%
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={uploadProgress} sx={{ height: 6, borderRadius: 3, bgcolor: '#0E1017', border: '1px solid rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #D4AF37, #E2B714)', borderRadius: 3 } }} />
        </Box>
      )}

      {/* Current Images Grid */}
      {images.length > 0 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 1.5 }}>
          {images.map((imgUrl, idx) => {
            const isPrimary = idx === 0;
            return (
              <Box
                key={`${imgUrl}-${idx}`}
                sx={{
                  position: 'relative', bgcolor: '#141620', borderRadius: 0.5, border: isPrimary ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: isPrimary ? '0 0 0 1px rgba(212,175,55,0.4)' : 'none', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                  '&:hover': { borderColor: isPrimary ? '#D4AF37' : 'rgba(255,255,255,0.3)' }, transition: 'border-color 0.2s'
                }}
              >
                {/* Image Preview */}
                <Box sx={{ height: 144, position: 'relative', bgcolor: '#0A0B0E', overflow: 'hidden', '&:hover img': { transform: 'scale(1.05)' } }}>
                  <Box component="img" src={imgUrl} alt={`Product image ${idx + 1}`} sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'transform 0.3s' }} loading={isPrimary ? 'eager' : 'lazy'} />

                  {isPrimary && (
                    <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 10, px: 1, py: 0.25, bgcolor: 'rgba(0,0,0,0.9)', border: '1px solid #D4AF37', borderRadius: 0.25, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Star size={10} color="#D4AF37" fill="#D4AF37" />
                      <Typography sx={{ fontSize: '0.5625rem', fontFamily: '"JetBrains Mono", sans-serif', fontWeight: 900, color: '#D4AF37' }}>COVER</Typography>
                    </Box>
                  )}

                  <IconButton
                    size="small"
                    onClick={() => setPreviewZoomUrl(imgUrl)}
                    title="Zoom View"
                    sx={{ position: 'absolute', top: 6, right: 6, p: 0.75, bgcolor: 'rgba(0,0,0,0.7)', color: 'rgba(255,255,255,0.7)', opacity: 0, zIndex: 10, borderRadius: 0.25, '&:hover': { bgcolor: 'black', color: 'white' }, '.MuiBox-root:hover &': { opacity: 1 }, transition: 'opacity 0.2s' }}
                  >
                    <Eye size={12} />
                  </IconButton>
                </Box>

                {/* Controls Bar */}
                <Box sx={{ p: 1, bgcolor: '#0E1017', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                    <IconButton size="small" disabled={idx === 0} onClick={() => moveImage(idx, idx - 1)} title="Move Left" sx={{ p: 0.5, borderRadius: 0.25, color: idx === 0 ? '#334155' : 'rgba(148,163,184,0.8)', '&:hover': { bgcolor: idx === 0 ? 'transparent' : 'rgba(255,255,255,0.1)', color: idx === 0 ? '#334155' : 'white' } }}>
                      <ArrowLeft size={12} />
                    </IconButton>
                    <IconButton size="small" disabled={idx === images.length - 1} onClick={() => moveImage(idx, idx + 1)} title="Move Right" sx={{ p: 0.5, borderRadius: 0.25, color: idx === images.length - 1 ? '#334155' : 'rgba(148,163,184,0.8)', '&:hover': { bgcolor: idx === images.length - 1 ? 'transparent' : 'rgba(255,255,255,0.1)', color: idx === images.length - 1 ? '#334155' : 'white' } }}>
                      <ArrowRight size={12} />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {!isPrimary && (
                      <Button size="small" onClick={() => setPrimaryImage(idx)} title="Set as Main Cover Image" sx={{ minWidth: 'auto', px: 0.75, py: 0.25, bgcolor: 'rgba(255,255,255,0.05)', color: '#D4AF37', fontSize: '0.5625rem', fontFamily: '"JetBrains Mono", sans-serif', fontWeight: 900, borderRadius: 0.25, '&:hover': { bgcolor: 'rgba(212,175,55,0.2)' } }}>
                        Set Cover
                      </Button>
                    )}
                    <IconButton size="small" onClick={() => { setReplacingIndex(idx); replaceInputRef.current?.click(); }} title="Replace Image" sx={{ p: 0.5, borderRadius: 0.25, color: 'rgba(148,163,184,0.8)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: 'white' } }}>
                      <RefreshCw size={12} />
                    </IconButton>
                    <IconButton size="small" onClick={() => removeImage(idx)} title="Delete Image" sx={{ p: 0.5, borderRadius: 0.25, color: '#f87171', '&:hover': { bgcolor: 'rgba(127,29,29,0.4)', color: '#fca5a5' } }}>
                      <Trash2 size={12} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Drag & Drop Upload Zone */}
      {images.length < maxImages && (
        <Box
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleFilesSelected(e.dataTransfer.files); }}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            border: '2px dashed', borderRadius: 0.5, p: 4, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
            borderColor: isDragOver ? '#D4AF37' : 'rgba(255,255,255,0.15)',
            bgcolor: isDragOver ? 'rgba(212,175,55,0.1)' : 'rgba(20,22,32,0.6)',
            '&:hover': { borderColor: 'rgba(212,175,55,0.6)', bgcolor: '#141620' }
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Upload size={18} color="#D4AF37" />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.6875rem', fontFamily: '"JetBrains Mono", sans-serif', fontWeight: 900, color: 'white' }}>
                Drop high-resolution images here or{' '}
                <Box component="span" sx={{ color: '#D4AF37', textDecoration: 'underline' }}>Browse</Box>
              </Typography>
              <Typography sx={{ fontSize: '0.6875rem', fontFamily: '"JetBrains Mono", sans-serif', color: '#64748b', mt: 0.5 }}>
                Supports JPG, JPEG, PNG, WEBP (Up to 10MB per file)
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.625rem', fontFamily: '"JetBrains Mono", sans-serif', color: '#334155' }}>
              <Typography sx={{ fontSize: 'inherit', fontFamily: 'inherit', color: 'inherit' }}>Automatic dimension scaling</Typography>
              <Typography sx={{ fontSize: 'inherit', fontFamily: 'inherit', color: 'inherit' }}>•</Typography>
              <Typography sx={{ fontSize: 'inherit', fontFamily: 'inherit', color: 'inherit' }}>Direct Firebase CDN Delivery</Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Paste External URL */}
      <Box sx={{ display: 'flex', alignItems: 'center', pt: 0.5 }}>
        {isAddingUrl ? (
          <Box component="form" onSubmit={handleAddManualUrl} sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
            <TextField
              fullWidth
              size="small"
              value={manualUrlInput}
              onChange={(e) => setManualUrlInput(e.target.value)}
              placeholder="Paste direct HTTPS image link (e.g. https://images.unsplash.com/...)"
              autoFocus
              sx={fieldSx}
            />
            <Button type="submit" sx={{ px: 2, py: 1, bgcolor: '#D4AF37', color: 'black', fontSize: '0.6875rem', fontFamily: '"JetBrains Mono", sans-serif', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: 0.5, flexShrink: 0, '&:hover': { bgcolor: '#E2B714' } }}>
              Add Link
            </Button>
            <IconButton size="small" onClick={() => setIsAddingUrl(false)} sx={{ color: '#64748b', '&:hover': { color: 'white' } }}>
              <X size={14} />
            </IconButton>
          </Box>
        ) : (
          <Button
            onClick={() => setIsAddingUrl(true)}
            startIcon={<Plus size={12} />}
            sx={{ fontSize: '0.6875rem', fontFamily: '"JetBrains Mono", sans-serif', color: '#D4AF37', p: 0, minWidth: 'auto', '&:hover': { textDecoration: 'underline', bgcolor: 'transparent' } }}
          >
            Or paste external image URL
          </Button>
        )}
      </Box>

      {/* Hidden File Inputs */}
      <input ref={fileInputRef} type="file" multiple accept={ALLOWED_IMAGE_TYPES.join(',')} onChange={(e) => handleFilesSelected(e.target.files)} style={{ display: 'none' }} />
      <input ref={replaceInputRef} type="file" accept={ALLOWED_IMAGE_TYPES.join(',')} onChange={handleReplaceFileSelected} style={{ display: 'none' }} />

      {/* Full Preview Zoom Modal */}
      {previewZoomUrl && (
        <Box
          onClick={() => setPreviewZoomUrl(null)}
          sx={{ position: 'fixed', inset: 0, zIndex: 9999, bgcolor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, cursor: 'zoom-out' }}
        >
          <Box sx={{ position: 'relative', maxWidth: '56rem', maxHeight: '85vh', overflow: 'hidden', borderRadius: 0.5, border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 25px 50px rgba(0,0,0,0.8)' }}>
            <Box component="img" src={previewZoomUrl} alt="Zoom Preview" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            <IconButton
              onClick={() => setPreviewZoomUrl(null)}
              sx={{ position: 'absolute', top: 12, right: 12, p: 1, bgcolor: 'rgba(0,0,0,0.8)', color: 'white', borderRadius: '50%', '&:hover': { bgcolor: 'black' } }}
            >
              <X size={18} />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};
