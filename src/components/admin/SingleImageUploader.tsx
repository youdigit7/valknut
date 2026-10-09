import React, { useState, useRef } from 'react';
import {
  Box, Typography, Button, TextField, LinearProgress, Alert, IconButton
} from '@mui/material';
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

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: '#141620',
    color: 'var(--text-primary)',
    fontSize: '0.6875rem',
    fontFamily: '"Inter", sans-serif',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
    '&.Mui-focused fieldset': { borderColor: '#D4AF37' },
  },
  '& input::placeholder': { color: '#64748b' },
};

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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {/* Label + Remove */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', fontWeight: 900, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>
          {label}
        </Typography>
        {imageUrl && (
          <Button
            size="small"
            onClick={handleRemove}
            startIcon={<Trash2 size={11} />}
            sx={{ fontSize: '0.625rem', color: '#f87171', minWidth: 'auto', p: 0, '&:hover': { color: '#fca5a5', bgcolor: 'transparent' } }}
          >
            Remove
          </Button>
        )}
      </Box>

      {/* Error Alert */}
      {errorMsg && (
        <Alert
          severity="error"
          action={<IconButton size="small" onClick={() => setErrorMsg('')}><X size={12} /></IconButton>}
          icon={<AlertCircle size={13} />}
          sx={{ fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', bgcolor: 'rgba(127,29,29,0.7)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.4)', p: 1 }}
        >
          {errorMsg}
        </Alert>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <Box sx={{ p: 1.5, bgcolor: '#141620', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', color: 'rgba(255,255,255,0.8)' }}>
              <RefreshCw size={11} style={{ color: '#D4AF37', animation: 'spin 1s linear infinite' }} />
              Uploading to Firebase Storage...
            </Typography>
            <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', fontWeight: 900, color: '#D4AF37' }}>
              {uploadProgress}%
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={uploadProgress} sx={{ height: 4, borderRadius: 2, bgcolor: 'var(--bg-surface)', '& .MuiLinearProgress-bar': { bgcolor: '#D4AF37' } }} />
        </Box>
      )}

      {/* Preview + URL Input */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {/* Preview thumbnail */}
        <Box sx={{ width: 64, height: 64, flexShrink: 0, borderRadius: 0.5, bgcolor: '#141620', border: '1px solid rgba(255,255,255,0.15)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {imageUrl ? (
            <Box component="img" src={imageUrl} alt="Preview" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <ImageIcon size={20} color="#475569" />
          )}
        </Box>

        {/* URL + Upload Button */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            value={imageUrl}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            sx={fieldSx}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Button
              size="small"
              startIcon={<Upload size={11} />}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              sx={{ px: 1.5, py: 0.75, bgcolor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 0.5, fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.075em', '&:hover': { bgcolor: 'rgba(255,255,255,0.15)', color: 'var(--text-primary)' } }}
            >
              Upload Local Image
            </Button>
            <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', color: '#64748b' }}>
              JPG, PNG, WEBP (Max 10MB)
            </Typography>
          </Box>
        </Box>
      </Box>

      <input ref={fileInputRef} type="file" accept={ALLOWED_IMAGE_TYPES.join(',')} onChange={handleFileChange} style={{ display: 'none' }} />
    </Box>
  );
};
