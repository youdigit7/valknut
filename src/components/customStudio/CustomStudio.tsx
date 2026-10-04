import React, { useState, useRef } from 'react';
import type { CustomStudioOptions, PrintTechniqueType } from '../../types/ecommerce';
import { useStore } from '../../context/StoreContext';
import { 
  Sparkles, 
  Upload, 
  Type, 
  ShoppingBag, 
  RotateCcw, 
  Trash2, 
  Layers,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { uploadMediaFile, validateImageFile } from '../../services/mediaService';
import { StudioCanvasPreview } from './StudioCanvasPreview';
import { 
  VALKNUT_SIGIL_PRESETS, 
  STUDIO_FONTS, 
  PRINT_TECHNIQUES, 
  STUDIO_COLORS, 
  STUDIO_TEXT_COLORS
} from './studioAssets';
import type { SigilPreset } from './studioAssets';
import { 
  createTheme, ThemeProvider, Box, Typography, Container, Grid, Button, Slider, Select, MenuItem
} from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#D4AF37', dark: '#E2B714' },
    background: { default: '#08090D', paper: '#0E1017' },
    text: { primary: '#ffffff', secondary: '#94a3b8' },
  },
  typography: {
    fontFamily: '"JetBrains Mono", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontFamily: '"Syne", sans-serif', fontWeight: 900, textTransform: 'uppercase' },
    h6: { fontFamily: '"Syne", sans-serif', fontWeight: 800, textTransform: 'uppercase' },
    body2: { fontFamily: '"JetBrains Mono", sans-serif' },
    caption: { fontFamily: '"JetBrains Mono", sans-serif' },
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#141620',
          fontFamily: '"JetBrains Mono", sans-serif',
          fontSize: '0.75rem',
          color: 'white',
          borderRadius: 4,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.15)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#D4AF37',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#D4AF37',
          }
        }
      }
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#D4AF37',
        }
      }
    }
  }
});

type StudioControlTab = 'ARTWORK' | 'TYPOGRAPHY' | 'TECHNIQUE';

export const CustomStudio: React.FC = () => {
  const { products, customStudioProduct, setCustomStudioProduct, addToCart, setIsCartOpen, showToast } = useStore();

  const customizableProducts = products.filter(p => p.isCustomizable);
  const activeProduct = customStudioProduct || customizableProducts[0] || products[0];

  const [activeControlTab, setActiveControlTab] = useState<StudioControlTab>('ARTWORK');

  const [selectedColor, setSelectedColor] = useState(activeProduct.variants[0]?.color || 'Onyx Black');
  const [selectedColorHex, setSelectedColorHex] = useState(activeProduct.variants[0]?.colorHex || '#0A0B0E');
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL'>('M');
  const [placement, setPlacement] = useState<'FRONT' | 'BACK' | 'LEFT_SLEEVE' | 'RIGHT_SLEEVE'>('FRONT');

  const [customText, setCustomText] = useState('VALKNUT SQUAD');
  const [textColor, setTextColor] = useState('#D4AF37');
  const [textFont, setTextFont] = useState('Syne');
  const [textSize, setTextSize] = useState(24);
  const [textUppercase, setTextUppercase] = useState(true);
  const [textPos, setTextPos] = useState({ x: 50, y: 38 });

  const [uploadedArtworkUrl, setUploadedArtworkUrl] = useState<string | undefined>(undefined);
  const [artworkName, setArtworkName] = useState<string | undefined>(undefined);
  const [selectedSigil, setSelectedSigil] = useState<SigilPreset | null>(VALKNUT_SIGIL_PRESETS[0]);
  const [artworkScale, setArtworkScale] = useState(48);
  const [artworkRotation, setArtworkRotation] = useState(0);
  const [artworkPos, setArtworkPos] = useState({ x: 50, y: 56 });
  const [artworkEffect, setArtworkEffect] = useState<'original' | 'monochrome' | 'gold_foil' | 'invert'>('gold_foil');

  const [printTechnique, setPrintTechnique] = useState<PrintTechniqueType>('High-Density 3D Puff Rubber');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  const placementFee = placement === 'LEFT_SLEEVE' || placement === 'RIGHT_SLEEVE' ? 450 : 0;
  const selectedTechniqueObj = PRINT_TECHNIQUES.find(t => t.id === printTechnique) || PRINT_TECHNIQUES[0];
  const techniqueFee = selectedTechniqueObj.fee;
  const basePrice = activeProduct.salePrice ?? activeProduct.price;
  const totalCustomPrice = basePrice + techniqueFee + placementFee;

  const handleArtworkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setUploadError(validation.error || 'Invalid file format.');
      showToast(validation.error || 'Invalid file format.', 'error');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(15);

      const result = await uploadMediaFile(file, {
        scope: 'custom-studio',
        identifier: 'bespoke-customer',
        fileName: file.name,
        optimize: true,
        onProgress: (pct) => setUploadProgress(pct)
      });

      setUploadedArtworkUrl(result.url);
      setArtworkName(file.name);
      setSelectedSigil(null);
      setArtworkEffect('original');
      setUploadProgress(100);
      showToast(`Artwork "${file.name}" uploaded to studio canvas.`, 'success');
      setTimeout(() => setIsUploading(false), 400);
    } catch (err: any) {
      console.error('Artwork upload failed:', err);
      setUploadError(err.message || 'Failed to upload artwork.');
      showToast(err.message || 'Upload failed.', 'error');
      setIsUploading(false);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveArtwork = () => {
    setUploadedArtworkUrl(undefined);
    setArtworkName(undefined);
    setSelectedSigil(null);
    showToast('Artwork removed from canvas.', 'info');
  };

  const handleSelectPresetSigil = (sigil: SigilPreset) => {
    setSelectedSigil(sigil);
    setUploadedArtworkUrl(undefined);
    setArtworkName(sigil.name);
    showToast(`Applied ${sigil.name} sigil.`, 'info');
  };

  const handleResetCustomization = () => {
    setCustomText('VALKNUT SQUAD');
    setTextColor('#D4AF37');
    setTextFont('Syne');
    setTextSize(24);
    setTextUppercase(true);
    setTextPos({ x: 50, y: 38 });
    setSelectedSigil(VALKNUT_SIGIL_PRESETS[0]);
    setUploadedArtworkUrl(undefined);
    setArtworkScale(48);
    setArtworkRotation(0);
    setArtworkPos({ x: 50, y: 56 });
    setArtworkEffect('gold_foil');
    setPrintTechnique('High-Density 3D Puff Rubber');
    setPlacement('FRONT');
    showToast('Studio canvas reset to default specifications.', 'info');
  };

  const handleAddToCart = () => {
    const customizationData: CustomStudioOptions = {
      productBaseId: activeProduct.id,
      productName: activeProduct.name,
      garmentColor: selectedColor,
      garmentColorHex: selectedColorHex,
      selectedSize,
      placement,
      customText: customText.trim() ? customText.trim() : undefined,
      textColor,
      textFont,
      textSize,
      textPosition: textPos,
      textUppercase,
      uploadedArtworkUrl,
      artworkName: artworkName || selectedSigil?.name,
      artworkScale,
      artworkRotation,
      artworkPosition: artworkPos,
      artworkEffect,
      selectedSigilPreset: selectedSigil?.id,
      printTechnique,
      basePrice,
      techniqueFee,
      placementFee,
      additionalPrice: techniqueFee + placementFee,
      totalCustomPrice
    };

    addToCart(
      activeProduct,
      selectedSize,
      selectedColor,
      selectedColorHex,
      1,
      customizationData
    );

    setIsCartOpen(true);
    showToast(`Custom ${activeProduct.name} added to your bag.`, 'success');
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: '100%', py: { xs: 5, sm: 8, lg: 10 }, bgcolor: 'background.default', color: 'white', WebkitFontSmoothing: 'antialiased' }}>
        <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 4, md: 6 } }}>
          
          {/* Studio Title & Badge */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'flex-end' }, justifyContent: 'space-between', gap: 3, borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 4 }}>
            <Box>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.5, borderRadius: 5, bgcolor: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: 'primary.main', fontSize: '0.625rem', fontFamily: '"JetBrains Mono", sans-serif', fontWeight: 'bold', letterSpacing: '0.2em', textTransform: 'uppercase', mb: 2 }}>
                <Sparkles size={13} />
                <span>VALKNUT BESPOKE APPAREL STUDIO</span>
              </Box>
              <Typography variant="h3" sx={{ fontSize: { xs: '1.875rem', sm: '2.5rem' }, letterSpacing: '-0.02em', mb: 1, textShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
                INTERACTIVE <Box component="span" sx={{ color: 'primary.main' }}>CUSTOM STUDIO</Box>
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem', display: 'block', maxWidth: '600px' }}>
                Select luxury garment silhouette, upload high-res graphics, configure typography, and inspect live 2D CAD layer preview.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                onClick={handleResetCustomization}
                startIcon={<RotateCcw size={13} />}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  fontFamily: '"JetBrains Mono", sans-serif',
                  px: 2,
                  py: 1,
                  textTransform: 'none',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }
                }}
              >
                Reset Studio
              </Button>

              <Button
                href="#/shop"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  fontFamily: '"JetBrains Mono", sans-serif',
                  px: 2,
                  py: 1,
                  textTransform: 'none',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }
                }}
              >
                Back to Catalog
              </Button>
            </Box>
          </Box>

          {/* Main 3-Column Studio Layout */}
          <Grid container spacing={{ xs: 4, lg: 4 }} sx={{ alignItems: 'flex-start' }}>
            
            {/* COL 1: BASE PRODUCT & GARMENT SELECTION (3 cols) */}
            <Grid size={{ xs: 12, lg: 3 }}>
              <Box sx={{ bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, p: 3, display: 'flex', flexDirection: 'column', gap: 4, boxShadow: '0 20px 40px rgba(0,0,0,0.5)', fontFamily: '"JetBrains Mono", sans-serif' }}>
                
                {/* 1. Base Product Selector */}
                <Box>
                  <Typography sx={{ fontSize: '0.625rem', fontWeight: 'bold', color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 1 }}>
                    1. BASE GARMENT SILHOUETTE
                  </Typography>
                  <Select
                    fullWidth
                    value={activeProduct.id}
                    onChange={(e) => {
                      const found = products.find(p => p.id === e.target.value);
                      if (found) {
                        setCustomStudioProduct(found);
                        setSelectedColor(found.variants[0]?.color || 'Onyx Black');
                        setSelectedColorHex(found.variants[0]?.colorHex || '#0A0B0E');
                      }
                    }}
                  >
                    {customizableProducts.map(p => (
                      <MenuItem key={p.id} value={p.id} sx={{ fontSize: '0.75rem', fontFamily: '"JetBrains Mono", sans-serif' }}>
                        {p.name} — LKR {(p.salePrice ?? p.price).toLocaleString()}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>

                {/* 2. Color Palette */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ fontSize: '0.625rem', fontWeight: 'bold', color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      2. GARMENT FABRIC SHADE
                    </Typography>
                    <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.6875rem' }}>{selectedColor}</Typography>
                  </Box>

                  <Grid container spacing={1}>
                    {STUDIO_COLORS.map(c => {
                      const isSelected = selectedColor === c.name;
                      return (
                        <Grid size={{ xs: 4 }} key={c.name}>
                          <Box
                            component="button"
                            onClick={() => {
                              setSelectedColor(c.name);
                              setSelectedColorHex(c.hex);
                            }}
                            sx={{
                              width: '100%',
                              p: 1.5,
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: isSelected ? 'primary.main' : 'rgba(255,255,255,0.1)',
                              bgcolor: isSelected ? 'rgba(212,175,55,0.15)' : '#141620',
                              color: isSelected ? 'white' : 'text.secondary',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: 1,
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': { borderColor: isSelected ? 'primary.main' : 'rgba(255,255,255,0.3)' }
                            }}
                          >
                            <Box sx={{ width: 20, height: 20, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)', bgcolor: c.hex, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }} />
                            <Typography sx={{ fontSize: '0.5625rem', textAlign: 'center', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {c.name.split(' ')[0]}
                            </Typography>
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>

                {/* 3. Size Selector */}
                <Box>
                  <Typography sx={{ fontSize: '0.625rem', fontWeight: 'bold', color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 1 }}>
                    3. SELECT SIZE
                  </Typography>
                  <Grid container spacing={1}>
                    {(['S', 'M', 'L', 'XL', 'XXL'] as const).map(sz => {
                      const isSelected = selectedSize === sz;
                      return (
                        <Grid size={{ xs: 2.4 }} key={sz}>
                          <Box
                            component="button"
                            onClick={() => setSelectedSize(sz)}
                            sx={{
                              width: '100%',
                              py: 1,
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: isSelected ? 'primary.main' : 'rgba(255,255,255,0.1)',
                              bgcolor: isSelected ? 'primary.main' : '#141620',
                              color: isSelected ? 'black' : 'text.secondary',
                              fontWeight: 'bold',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': { borderColor: isSelected ? 'primary.main' : 'rgba(255,255,255,0.3)' }
                            }}
                          >
                            {sz}
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>

                {/* 4. Placement Selector */}
                <Box>
                  <Typography sx={{ fontSize: '0.625rem', fontWeight: 'bold', color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 1 }}>
                    4. PRINT PLACEMENT ZONE
                  </Typography>
                  <Grid container spacing={1}>
                    {(
                      [
                        { id: 'FRONT', label: 'Front Chest' },
                        { id: 'BACK', label: 'Back Full' },
                        { id: 'LEFT_SLEEVE', label: 'Left Sleeve (+450)' },
                        { id: 'RIGHT_SLEEVE', label: 'Right Sleeve (+450)' }
                      ] as const
                    ).map(loc => {
                      const isSelected = placement === loc.id;
                      return (
                        <Grid size={{ xs: 6 }} key={loc.id}>
                          <Box
                            component="button"
                            onClick={() => setPlacement(loc.id)}
                            sx={{
                              width: '100%',
                              p: 1.5,
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: isSelected ? 'primary.main' : 'rgba(255,255,255,0.1)',
                              bgcolor: isSelected ? 'rgba(212,175,55,0.2)' : '#141620',
                              color: isSelected ? 'primary.main' : 'text.secondary',
                              fontWeight: 'bold',
                              fontSize: '0.625rem',
                              textAlign: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': { borderColor: isSelected ? 'primary.main' : 'rgba(255,255,255,0.3)' }
                            }}
                          >
                            {loc.label}
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>

                {/* Fabric Specs Badge */}
                <Box sx={{ p: 2, bgcolor: '#141620', borderRadius: 1, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.5625rem', color: 'primary.main', fontWeight: 'bold', textTransform: 'uppercase' }}>GARMENT SPECIFICATION</Typography>
                  <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.6875rem' }}>{activeProduct.material}</Typography>
                  <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary' }}>Heavyweight dropped-shoulder boxy fit with pre-shrunk anti-pilling wash.</Typography>
                </Box>

              </Box>
            </Grid>

            {/* COL 2: LIVE 2D LAYERED CAD PREVIEW (5 cols) */}
            <Grid size={{ xs: 12, lg: 5 }}>
              <Box sx={{ bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 25px 50px rgba(0,0,0,0.6)', minHeight: '580px' }}>
                
                {/* Component Preview */}
                <StudioCanvasPreview
                  garmentColorHex={selectedColorHex}
                  placement={placement}
                  onPlacementChange={setPlacement}
                  customText={customText}
                  textColor={textColor}
                  textFont={textFont}
                  textSize={textSize}
                  textPos={textPos}
                  textUppercase={textUppercase}
                  uploadedArtworkUrl={uploadedArtworkUrl}
                  sigilSvgPath={selectedSigil?.svgPath}
                  artworkScale={artworkScale}
                  artworkRotation={artworkRotation}
                  artworkPos={artworkPos}
                  artworkEffect={artworkEffect}
                  printTechnique={printTechnique}
                />

                {/* Quick Summary Strip */}
                <Box sx={{ w: '100%', width: '100%', mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: '"JetBrains Mono", sans-serif', color: 'text.secondary' }}>
                  <Typography sx={{ fontSize: 'inherit' }}>View: <Box component="strong" sx={{ color: 'white' }}>{placement.replace('_', ' ')}</Box></Typography>
                  <Typography sx={{ fontSize: 'inherit' }}>Technique: <Box component="strong" sx={{ color: 'primary.main' }}>{printTechnique}</Box></Typography>
                </Box>
              </Box>
            </Grid>

            {/* COL 3: CUSTOMIZATION CONTROLS & PRICING (4 cols) */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                
                {/* Sub-Tabs */}
                <Box sx={{ bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, p: 3, display: 'flex', flexDirection: 'column', gap: 3, boxShadow: '0 20px 40px rgba(0,0,0,0.5)', fontFamily: '"JetBrains Mono", sans-serif' }}>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 2 }}>
                    {(
                      [
                        { id: 'ARTWORK', label: '1. ARTWORK', icon: Upload },
                        { id: 'TYPOGRAPHY', label: '2. TEXT', icon: Type },
                        { id: 'TECHNIQUE', label: '3. CRAFT', icon: Layers }
                      ] as const
                    ).map(tab => {
                      const Icon = tab.icon;
                      const isActive = activeControlTab === tab.id;
                      return (
                        <Box
                          component="button"
                          key={tab.id}
                          onClick={() => setActiveControlTab(tab.id)}
                          sx={{
                            flex: 1,
                            py: 1,
                            px: 1,
                            borderRadius: 1,
                            fontSize: '0.6875rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            ...(isActive ? {
                              bgcolor: 'primary.main',
                              color: 'black',
                              boxShadow: '0 4px 10px rgba(212,175,55,0.3)'
                            } : {
                              bgcolor: '#141620',
                              color: 'text.secondary',
                              '&:hover': { color: 'white' }
                            })
                          }}
                        >
                          <Icon size={13} />
                          <span>{tab.label}</span>
                        </Box>
                      );
                    })}
                  </Box>

                  {/* TAB 1: ARTWORK */}
                  {activeControlTab === 'ARTWORK' && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Typography sx={{ fontSize: '0.625rem', fontWeight: 'bold', color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          UPLOAD CUSTOM GRAPHIC / LOGO
                        </Typography>

                        {uploadError && (
                          <Box sx={{ p: 1.5, bgcolor: 'rgba(220,38,38,0.2)', border: '1px solid rgba(220,38,38,0.4)', borderRadius: 1, color: 'error.main', fontSize: '0.625rem' }}>
                            {uploadError}
                          </Box>
                        )}

                        {isUploading ? (
                          <Box sx={{ p: 2, bgcolor: '#141620', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6875rem' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white', fontWeight: 'bold' }}>
                                <Box sx={{ animation: 'spin 2s linear infinite', display: 'flex' }}><RefreshCw size={12} color="#D4AF37" /></Box>
                                <span>Uploading to Cloud...</span>
                              </Box>
                              <Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>{uploadProgress}%</Typography>
                            </Box>
                            <Box sx={{ width: '100%', bgcolor: '#0E1017', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                              <Box sx={{ bgcolor: 'primary.main', height: '100%', transition: 'width 0.3s', width: `${uploadProgress}%` }} />
                            </Box>
                          </Box>
                        ) : (
                          <Box
                            onClick={() => fileInputRef.current?.click()}
                            sx={{
                              border: '1px dashed rgba(255,255,255,0.2)',
                              bgcolor: '#141620',
                              p: 2,
                              borderRadius: 1,
                              textAlign: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': { borderColor: 'primary.main' }
                            }}
                          >
                            <Upload size={18} color="#D4AF37" style={{ margin: '0 auto 6px' }} />
                            <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.75rem' }}>
                              {uploadedArtworkUrl ? 'Replace Custom Artwork' : 'Upload Vector / PNG / JPG'}
                            </Typography>
                            <Typography sx={{ color: 'text.secondary', fontSize: '0.625rem', mt: 0.5 }}>Max 10MB • Auto-centered on {placement}</Typography>
                          </Box>
                        )}

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/svg+xml"
                          onChange={handleArtworkUpload}
                          style={{ display: 'none' }}
                        />
                      </Box>

                      <Box sx={{ pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Typography sx={{ fontSize: '0.625rem', fontWeight: 'bold', color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          OR SELECT NORSE HERALDRY PRESET
                        </Typography>

                        <Grid container spacing={1}>
                          {VALKNUT_SIGIL_PRESETS.map(s => {
                            const isSelected = selectedSigil?.id === s.id;
                            return (
                              <Grid size={{ xs: 2.4 }} key={s.id}>
                                <Box
                                  component="button"
                                  onClick={() => handleSelectPresetSigil(s)}
                                  title={s.description}
                                  sx={{
                                    width: '100%',
                                    p: 1,
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: isSelected ? 'primary.main' : 'rgba(255,255,255,0.1)',
                                    bgcolor: isSelected ? 'rgba(212,175,55,0.2)' : '#141620',
                                    color: isSelected ? 'primary.main' : 'text.secondary',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    '&:hover': { borderColor: isSelected ? 'primary.main' : 'rgba(255,255,255,0.3)' }
                                  }}
                                >
                                  <svg viewBox="0 0 100 100" style={{ width: 24, height: 24, fill: 'currentColor' }}>
                                    <path d={s.svgPath} />
                                  </svg>
                                  <Typography sx={{ fontSize: '0.5rem', textAlign: 'center', width: '100%', mt: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {s.name.split(' ')[0]}
                                  </Typography>
                                </Box>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>

                      {(uploadedArtworkUrl || selectedSigil) && (
                        <Box sx={{ p: 2, bgcolor: '#141620', borderRadius: 1, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box sx={{ display: 'flex', itemsCenter: 'center', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontSize: '0.625rem', color: 'primary.main', fontWeight: 'bold', textTransform: 'uppercase' }}>ARTWORK ADJUSTMENTS</Typography>
                            <Box component="button" onClick={handleRemoveArtwork} sx={{ fontSize: '0.625rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: 0.5, border: 'none', bgcolor: 'transparent', cursor: 'pointer', '&:hover': { color: '#fca5a5' } }}>
                              <Trash2 size={11} /> <span>Remove</span>
                            </Box>
                          </Box>

                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem', mb: 0.5 }}>
                              <Typography sx={{ color: 'text.secondary', fontSize: 'inherit' }}>Scale:</Typography>
                              <Typography sx={{ color: 'white', fontSize: 'inherit' }}>{artworkScale}%</Typography>
                            </Box>
                            <Slider value={artworkScale} min={20} max={90} onChange={(_, v) => setArtworkScale(v as number)} size="small" />
                          </Box>
                          
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem', mb: 0.5 }}>
                              <Typography sx={{ color: 'text.secondary', fontSize: 'inherit' }}>Rotation:</Typography>
                              <Typography sx={{ color: 'white', fontSize: 'inherit' }}>{artworkRotation}°</Typography>
                            </Box>
                            <Slider value={artworkRotation} min={0} max={360} onChange={(_, v) => setArtworkRotation(v as number)} size="small" />
                          </Box>
                          
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem', mb: 0.5 }}>
                              <Typography sx={{ color: 'text.secondary', fontSize: 'inherit' }}>Vertical Position (Y):</Typography>
                              <Typography sx={{ color: 'white', fontSize: 'inherit' }}>{artworkPos.y}%</Typography>
                            </Box>
                            <Slider value={artworkPos.y} min={20} max={80} onChange={(_, v) => setArtworkPos({ ...artworkPos, y: v as number })} size="small" />
                          </Box>

                          <Box sx={{ pt: 1 }}>
                            <Typography sx={{ color: 'text.secondary', fontSize: '0.625rem', display: 'block', mb: 1 }}>Visual Shader Effect:</Typography>
                            <Grid container spacing={1}>
                              {(
                                [
                                  { id: 'original', label: 'Original' },
                                  { id: 'gold_foil', label: 'Gold Foil' },
                                  { id: 'monochrome', label: 'Mono B/W' },
                                  { id: 'invert', label: 'Invert' }
                                ] as const
                              ).map(eff => (
                                <Grid size={{ xs: 3 }} key={eff.id}>
                                  <Box
                                    component="button"
                                    onClick={() => setArtworkEffect(eff.id)}
                                    sx={{
                                      width: '100%',
                                      py: 0.5,
                                      borderRadius: 1,
                                      border: '1px solid',
                                      borderColor: artworkEffect === eff.id ? 'primary.main' : 'rgba(255,255,255,0.1)',
                                      bgcolor: artworkEffect === eff.id ? 'primary.main' : '#0E1017',
                                      color: artworkEffect === eff.id ? 'black' : 'text.secondary',
                                      fontWeight: artworkEffect === eff.id ? 'bold' : 'normal',
                                      fontSize: '0.5625rem',
                                      cursor: 'pointer',
                                      transition: 'all 0.3s ease'
                                    }}
                                  >
                                    {eff.label}
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        </Box>
                      )}

                    </Box>
                  )}

                  {/* TAB 2: TYPOGRAPHY */}
                  {activeControlTab === 'TYPOGRAPHY' && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography sx={{ fontSize: '0.625rem', fontWeight: 'bold', color: 'primary.main', textTransform: 'uppercase' }}>Custom Typography Text</Typography>
                          <Box 
                            component="button" 
                            onClick={() => setTextUppercase(!textUppercase)} 
                            sx={{ fontSize: '0.5625rem', px: 1, py: 0.5, borderRadius: 1, border: '1px solid', borderColor: textUppercase ? 'primary.main' : 'rgba(255,255,255,0.1)', bgcolor: textUppercase ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.05)', color: textUppercase ? 'primary.main' : 'text.secondary', cursor: 'pointer' }}
                          >
                            ALL CAPS
                          </Box>
                        </Box>
                        <Box
                          component="input"
                          type="text"
                          value={customText}
                          onChange={(e: any) => setCustomText(e.target.value)}
                          placeholder="ENTER MOTTO OR SQUAD NAME"
                          sx={{
                            width: '100%', bgcolor: '#141620', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 1, p: 1.5, color: 'white', fontWeight: 'bold', fontSize: '0.75rem', outline: 'none', fontFamily: '"JetBrains Mono", sans-serif',
                            '&:focus': { borderColor: 'primary.main' }
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography sx={{ fontSize: '0.625rem', fontWeight: 'bold', color: 'primary.main', textTransform: 'uppercase' }}>Select Typeface</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {STUDIO_FONTS.map(f => {
                            const isSelected = textFont === f.id || textFont === f.fontFamily;
                            return (
                              <Box
                                component="button"
                                key={f.id}
                                onClick={() => setTextFont(f.fontFamily)}
                                sx={{
                                  width: '100%', p: 1.5, borderRadius: 1, border: '1px solid', borderColor: isSelected ? 'primary.main' : 'rgba(255,255,255,0.1)', bgcolor: isSelected ? 'rgba(212,175,55,0.15)' : '#141620', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.3s ease',
                                  '&:hover': { borderColor: isSelected ? 'primary.main' : 'rgba(255,255,255,0.3)' }
                                }}
                              >
                                <Typography sx={{ fontFamily: f.fontFamily, fontSize: '0.875rem', fontWeight: 'bold', color: 'white' }}>{f.sample}</Typography>
                                <Typography sx={{ fontSize: '0.5625rem', color: 'text.secondary' }}>{f.name}</Typography>
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography sx={{ fontSize: '0.625rem', fontWeight: 'bold', color: 'primary.main', textTransform: 'uppercase' }}>Ink / Thread Color</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {STUDIO_TEXT_COLORS.map(tc => {
                            const isSelected = textColor === tc.hex;
                            return (
                              <Box
                                component="button"
                                key={tc.name}
                                onClick={() => setTextColor(tc.hex)}
                                title={tc.name}
                                sx={{
                                  p: 0.5, borderRadius: '50%', border: '1px solid', borderColor: 'rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.3s ease', bgcolor: 'transparent',
                                  ...(isSelected ? { borderColor: 'primary.main', boxShadow: '0 0 0 2px rgba(212,175,55,0.4)' } : {})
                                }}
                              >
                                <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: tc.hex }} />
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>

                      <Box sx={{ p: 2, bgcolor: '#141620', borderRadius: 1, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem', mb: 0.5 }}>
                            <Typography sx={{ color: 'text.secondary', fontSize: 'inherit' }}>Font Size:</Typography>
                            <Typography sx={{ color: 'white', fontSize: 'inherit' }}>{textSize}px</Typography>
                          </Box>
                          <Slider value={textSize} min={14} max={44} onChange={(_, v) => setTextSize(v as number)} size="small" />
                        </Box>
                        
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem', mb: 0.5 }}>
                            <Typography sx={{ color: 'text.secondary', fontSize: 'inherit' }}>Vertical Position (Y):</Typography>
                            <Typography sx={{ color: 'white', fontSize: 'inherit' }}>{textPos.y}%</Typography>
                          </Box>
                          <Slider value={textPos.y} min={15} max={85} onChange={(_, v) => setTextPos({ ...textPos, y: v as number })} size="small" />
                        </Box>
                      </Box>

                    </Box>
                  )}

                  {/* TAB 3: TECHNIQUE */}
                  {activeControlTab === 'TECHNIQUE' && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Typography sx={{ fontSize: '0.625rem', fontWeight: 'bold', color: 'primary.main', textTransform: 'uppercase' }}>CHOOSE MANUFACTURING TECHNIQUE</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {PRINT_TECHNIQUES.map(tech => {
                          const isSelected = printTechnique === tech.id;
                          return (
                            <Box
                              component="div"
                              key={tech.id}
                              onClick={() => setPrintTechnique(tech.id)}
                              sx={{
                                p: 2, borderRadius: 1, border: '1px solid', borderColor: isSelected ? 'primary.main' : 'rgba(255,255,255,0.1)', bgcolor: isSelected ? 'rgba(212,175,55,0.15)' : '#141620', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', gap: 1,
                                '&:hover': { borderColor: isSelected ? 'primary.main' : 'rgba(255,255,255,0.3)' }
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 'bold' }}>{tech.name}</Typography>
                                <Box sx={{ px: 1, py: 0.5, borderRadius: 1, bgcolor: 'rgba(0,0,0,0.6)', color: 'primary.main', fontSize: '0.5625rem', fontWeight: 'bold' }}>
                                  {tech.fee === 0 ? 'Included' : `+ LKR ${tech.fee.toLocaleString()}`}
                                </Box>
                              </Box>
                              <Typography sx={{ color: 'text.secondary', fontSize: '0.625rem', lineHeight: 1.6 }}>{tech.description}</Typography>
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                  )}

                </Box>

                {/* Price Breakdown Matrix & Add To Cart CTA */}
                <Box sx={{ bgcolor: 'background.paper', border: '1px solid rgba(212,175,55,0.4)', borderRadius: 2, p: 3, display: 'flex', flexDirection: 'column', gap: 3, boxShadow: '0 25px 50px rgba(0,0,0,0.8)', fontFamily: '"JetBrains Mono", sans-serif' }}>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 2 }}>
                    <Typography sx={{ fontSize: '0.625rem', fontWeight: 'bold', color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.1em' }}>BESPOKE ORDER VALUATION</Typography>
                    <Box sx={{ color: '#34d399', fontSize: '0.625rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ShieldCheck size={12} /> <span>CRAFT VERIFIED</span>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, fontSize: '0.6875rem' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary' }}>
                      <span>Base Heavyweight Garment:</span>
                      <Typography sx={{ color: 'white', fontSize: 'inherit' }}>LKR {basePrice.toLocaleString()}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary' }}>
                      <span>{printTechnique}:</span>
                      <Typography sx={{ color: 'primary.main', fontSize: 'inherit' }}>{techniqueFee === 0 ? 'Free' : `+ LKR ${techniqueFee.toLocaleString()}`}</Typography>
                    </Box>

                    {placementFee > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary' }}>
                        <span>Precision Sleeve Setup:</span>
                        <Typography sx={{ color: 'primary.main', fontSize: 'inherit' }}>+ LKR {placementFee.toLocaleString()}</Typography>
                      </Box>
                    )}

                    <Box sx={{ pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'white', textTransform: 'uppercase', fontFamily: '"Syne", sans-serif' }}>TOTAL BESPOKE PIECE:</Typography>
                      <Typography sx={{ fontSize: '1.25rem', fontWeight: 900, color: 'primary.main' }}>LKR {totalCustomPrice.toLocaleString()}</Typography>
                    </Box>
                  </Box>

                  <Button
                    onClick={handleAddToCart}
                    sx={{
                      w: '100%',
                      py: 2,
                      background: 'linear-gradient(90deg, #e6c042, #D4AF37, #aa8010)',
                      color: 'black',
                      fontWeight: 900,
                      fontSize: '0.75rem',
                      letterSpacing: '0.2em',
                      borderRadius: 1,
                      boxShadow: '0 10px 25px rgba(212,175,55,0.3), inset 0 1px 1px rgba(255,255,255,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 15px 35px rgba(212,175,55,0.5), inset 0 1px 1px rgba(255,255,255,0.7)'
                      }
                    }}
                  >
                    <ShoppingBag size={16} /> ADD BESPOKE ITEM TO BAG
                  </Button>

                  <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary', textAlign: 'center' }}>
                    Custom garments are precision manufactured & dispatched in 3–5 working days islandwide.
                  </Typography>
                </Box>

              </Box>
            </Grid>

          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};
