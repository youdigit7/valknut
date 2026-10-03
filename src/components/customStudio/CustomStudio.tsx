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

type StudioControlTab = 'ARTWORK' | 'TYPOGRAPHY' | 'TECHNIQUE';

export const CustomStudio: React.FC = () => {
  const { products, customStudioProduct, setCustomStudioProduct, addToCart, setIsCartOpen, showToast } = useStore();

  const customizableProducts = products.filter(p => p.isCustomizable);
  const activeProduct = customStudioProduct || customizableProducts[0] || products[0];

  // Active UI Control Sub-tab
  const [activeControlTab, setActiveControlTab] = useState<StudioControlTab>('ARTWORK');

  // Garment Attributes
  const [selectedColor, setSelectedColor] = useState(activeProduct.variants[0]?.color || 'Onyx Black');
  const [selectedColorHex, setSelectedColorHex] = useState(activeProduct.variants[0]?.colorHex || '#0A0B0E');
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL'>('M');
  const [placement, setPlacement] = useState<'FRONT' | 'BACK' | 'LEFT_SLEEVE' | 'RIGHT_SLEEVE'>('FRONT');

  // Custom Typography
  const [customText, setCustomText] = useState('VALKNUT SQUAD');
  const [textColor, setTextColor] = useState('#D4AF37');
  const [textFont, setTextFont] = useState('Syne');
  const [textSize, setTextSize] = useState(24);
  const [textUppercase, setTextUppercase] = useState(true);
  const [textPos, setTextPos] = useState({ x: 50, y: 38 });

  // Artwork & Sigil
  const [uploadedArtworkUrl, setUploadedArtworkUrl] = useState<string | undefined>(undefined);
  const [artworkName, setArtworkName] = useState<string | undefined>(undefined);
  const [selectedSigil, setSelectedSigil] = useState<SigilPreset | null>(VALKNUT_SIGIL_PRESETS[0]);
  const [artworkScale, setArtworkScale] = useState(48);
  const [artworkRotation, setArtworkRotation] = useState(0);
  const [artworkPos, setArtworkPos] = useState({ x: 50, y: 56 });
  const [artworkEffect, setArtworkEffect] = useState<'original' | 'monochrome' | 'gold_foil' | 'invert'>('gold_foil');

  // Print Technique
  const [printTechnique, setPrintTechnique] = useState<PrintTechniqueType>('High-Density 3D Puff Rubber');

  // Uploading state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  // Placement Fee Calculation (e.g. Sleeves have a small precision placement fee)
  const placementFee = placement === 'LEFT_SLEEVE' || placement === 'RIGHT_SLEEVE' ? 450 : 0;
  const selectedTechniqueObj = PRINT_TECHNIQUES.find(t => t.id === printTechnique) || PRINT_TECHNIQUES[0];
  const techniqueFee = selectedTechniqueObj.fee;
  const basePrice = activeProduct.salePrice ?? activeProduct.price;
  const totalCustomPrice = basePrice + techniqueFee + placementFee;

  // File Upload Handler (Firebase Storage with Client Validation)
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
      setSelectedSigil(null); // Clear preset if user uploaded their own
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
    <div className="w-full py-10 bg-[#08090D] text-white antialiased">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Studio Title & Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-mono font-bold tracking-[0.2em] uppercase mb-2">
              <Sparkles size={13} />
              <span>VALKNUT BESPOKE APPAREL STUDIO</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase text-white font-syne tracking-tight">
              INTERACTIVE <span className="text-[#D4AF37]">CUSTOM STUDIO</span>
            </h1>
            <p className="text-slate-400 text-xs font-mono mt-1">
              Select luxury garment silhouette, upload high-res graphics, configure typography, and inspect live 2D CAD layer preview.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetCustomization}
              className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Reset Studio</span>
            </button>

            <a
              href="#/shop"
              className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded text-xs font-mono transition-colors"
            >
              Back to Catalog
            </a>
          </div>
        </div>

        {/* Main 3-Column Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COL 1: BASE PRODUCT & GARMENT SELECTION (3 cols) */}
          <div className="lg:col-span-3 bg-[#0E1017] border border-white/10 rounded-md p-5 space-y-6 shadow-xl font-mono text-xs">
            
            {/* 1. Base Product Selector */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                1. BASE GARMENT SILHOUETTE
              </span>
              <select
                value={activeProduct.id}
                onChange={(e) => {
                  const found = products.find(p => p.id === e.target.value);
                  if (found) {
                    setCustomStudioProduct(found);
                    setSelectedColor(found.variants[0]?.color || 'Onyx Black');
                    setSelectedColorHex(found.variants[0]?.colorHex || '#0A0B0E');
                  }
                }}
                className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2.5 text-xs text-white focus:outline-none"
              >
                {customizableProducts.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} — LKR {(p.salePrice ?? p.price).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Color Palette */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                  2. GARMENT FABRIC SHADE
                </span>
                <span className="text-white font-bold text-[11px]">{selectedColor}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {STUDIO_COLORS.map(c => {
                  const isSelected = selectedColor === c.name;
                  return (
                    <button
                      key={c.name}
                      onClick={() => {
                        setSelectedColor(c.name);
                        setSelectedColorHex(c.hex);
                      }}
                      className={`p-2 rounded border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-white' 
                          : 'border-white/10 bg-[#141620] text-slate-400 hover:border-white/30'
                      }`}
                    >
                      <span 
                        className="w-5 h-5 rounded-full border border-white/30 shadow-inner" 
                        style={{ backgroundColor: c.hex }} 
                      />
                      <span className="text-[9px] truncate w-full text-center">{c.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Size Selector */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                3. SELECT SIZE
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {(['S', 'M', 'L', 'XL', 'XXL'] as const).map(sz => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2 rounded text-xs font-bold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                          : 'bg-[#141620] text-slate-300 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Placement Selector */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                4. PRINT PLACEMENT ZONE
              </span>
              <div className="grid grid-cols-2 gap-2">
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
                    <button
                      key={loc.id}
                      onClick={() => setPlacement(loc.id)}
                      className={`p-2 rounded text-[10px] font-bold border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                          : 'bg-[#141620] border-white/10 text-slate-400 hover:border-white/30'
                      }`}
                    >
                      {loc.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fabric Specs Badge */}
            <div className="p-3 bg-[#141620] rounded border border-white/5 space-y-1 text-[11px] text-slate-400">
              <span className="text-[9px] text-[#D4AF37] font-bold uppercase block">GARMENT SPECIFICATION</span>
              <p className="text-white font-bold">{activeProduct.material}</p>
              <p>Heavyweight dropped-shoulder boxy fit with pre-shrunk anti-pilling wash.</p>
            </div>

          </div>

          {/* COL 2: LIVE 2D LAYERED CAD PREVIEW (5 cols) */}
          <div className="lg:col-span-5 bg-[#0E1017] border border-white/10 rounded-md p-6 flex flex-col items-center justify-between shadow-2xl min-h-[580px]">
            
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
            <div className="w-full mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>View: <strong className="text-white">{placement.replace('_', ' ')}</strong></span>
              <span>Technique: <strong className="text-[#D4AF37]">{printTechnique}</strong></span>
            </div>
          </div>

          {/* COL 3: CUSTOMIZATION CONTROLS & PRICING (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Sub-Tabs: Artwork / Typography / Technique */}
            <div className="bg-[#0E1017] border border-white/10 rounded-md p-5 space-y-5 shadow-xl font-mono text-xs">
              
              <div className="flex items-center gap-1 border-b border-white/10 pb-3">
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
                    <button
                      key={tab.id}
                      onClick={() => setActiveControlTab(tab.id)}
                      className={`flex-1 py-2 px-2 rounded text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#D4AF37] text-black shadow-md'
                          : 'bg-[#141620] text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon size={13} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: ARTWORK & NORSE SIGILS */}
              {activeControlTab === 'ARTWORK' && (
                <div className="space-y-4 animate-fade-in">
                  
                  {/* File Upload Zone */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                      UPLOAD CUSTOM GRAPHIC / LOGO
                    </span>

                    {uploadError && (
                      <div className="p-2 bg-red-950/60 border border-red-500/40 rounded text-red-300 text-[10px]">
                        {uploadError}
                      </div>
                    )}

                    {isUploading ? (
                      <div className="p-4 bg-[#141620] border border-[#D4AF37]/30 rounded text-center space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="flex items-center gap-2 text-white font-bold">
                            <RefreshCw size={12} className="animate-spin text-[#D4AF37]" />
                            <span>Uploading to Firebase Cloud...</span>
                          </span>
                          <span className="text-[#D4AF37] font-bold">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-[#0E1017] rounded-full h-1.5 overflow-hidden">
                          <div className="bg-[#D4AF37] h-full transition-all" style={{ width: `${uploadProgress}%` }} />
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border border-dashed border-white/20 hover:border-[#D4AF37] bg-[#141620] p-4 rounded text-center cursor-pointer transition-all"
                      >
                        <Upload size={18} className="mx-auto text-[#D4AF37] mb-1.5" />
                        <p className="text-white font-bold text-xs">
                          {uploadedArtworkUrl ? 'Replace Custom Artwork' : 'Upload Vector / PNG / JPG'}
                        </p>
                        <p className="text-slate-400 text-[10px]">Max 10MB • Auto-centered on {placement}</p>
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      onChange={handleArtworkUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Norse Sigils Preset Library */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                      OR SELECT NORSE HERALDRY PRESET
                    </span>

                    <div className="grid grid-cols-5 gap-2">
                      {VALKNUT_SIGIL_PRESETS.map(s => {
                        const isSelected = selectedSigil?.id === s.id;
                        return (
                          <button
                            key={s.id}
                            onClick={() => handleSelectPresetSigil(s)}
                            className={`p-2 rounded border flex flex-col items-center justify-center transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37]'
                                : 'border-white/10 bg-[#141620] text-slate-400 hover:border-white/30'
                            }`}
                            title={s.description}
                          >
                            <svg viewBox="0 0 100 100" className="w-6 h-6">
                              <path d={s.svgPath} fill="currentColor" />
                            </svg>
                            <span className="text-[8px] truncate w-full text-center mt-1">{s.name.split(' ')[0]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Artwork Transformation Sliders */}
                  {(uploadedArtworkUrl || selectedSigil) && (
                    <div className="p-3 bg-[#141620] rounded border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#D4AF37] font-bold uppercase">ARTWORK ADJUSTMENTS</span>
                        <button
                          onClick={handleRemoveArtwork}
                          className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                          <Trash2 size={11} />
                          <span>Remove</span>
                        </button>
                      </div>

                      {/* Scale */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-400">Scale:</span>
                          <span className="text-white">{artworkScale}%</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="90"
                          value={artworkScale}
                          onChange={(e) => setArtworkScale(Number(e.target.value))}
                          className="w-full accent-[#D4AF37]"
                        />
                      </div>

                      {/* Rotation */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-400">Rotation:</span>
                          <span className="text-white">{artworkRotation}°</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={artworkRotation}
                          onChange={(e) => setArtworkRotation(Number(e.target.value))}
                          className="w-full accent-[#D4AF37]"
                        />
                      </div>

                      {/* Position Y */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-400">Vertical Position (Y):</span>
                          <span className="text-white">{artworkPos.y}%</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="80"
                          value={artworkPos.y}
                          onChange={(e) => setArtworkPos({ ...artworkPos, y: Number(e.target.value) })}
                          className="w-full accent-[#D4AF37]"
                        />
                      </div>

                      {/* Effect Filter */}
                      <div className="space-y-1 pt-1">
                        <span className="text-slate-400 text-[10px] block">Visual Shader Effect:</span>
                        <div className="grid grid-cols-4 gap-1 text-[9px]">
                          {(
                            [
                              { id: 'original', label: 'Original' },
                              { id: 'gold_foil', label: 'Gold Foil' },
                              { id: 'monochrome', label: 'Mono B/W' },
                              { id: 'invert', label: 'Invert' }
                            ] as const
                          ).map(eff => (
                            <button
                              key={eff.id}
                              onClick={() => setArtworkEffect(eff.id)}
                              className={`py-1 rounded border transition-all ${
                                artworkEffect === eff.id
                                  ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37]'
                                  : 'bg-[#0E1017] text-slate-400 border-white/10'
                              }`}
                            >
                              {eff.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* TAB 2: CUSTOM TYPOGRAPHY */}
              {activeControlTab === 'TYPOGRAPHY' && (
                <div className="space-y-4 animate-fade-in">
                  
                  {/* Text Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-[#D4AF37] uppercase">Custom Typography Text</label>
                      <button
                        onClick={() => setTextUppercase(!textUppercase)}
                        className={`text-[9px] px-1.5 py-0.5 rounded border ${
                          textUppercase ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]' : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        ALL CAPS
                      </button>
                    </div>

                    <input
                      type="text"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="ENTER MOTTO OR SQUAD NAME"
                      className="w-full bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded p-2.5 text-white font-bold text-xs"
                    />
                  </div>

                  {/* Font Choice */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-[#D4AF37] uppercase block">Select Typeface</span>
                    <div className="space-y-1.5">
                      {STUDIO_FONTS.map(f => {
                        const isSelected = textFont === f.id || textFont === f.fontFamily;
                        return (
                          <button
                            key={f.id}
                            onClick={() => setTextFont(f.fontFamily)}
                            className={`w-full p-2.5 rounded border text-left flex items-center justify-between transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-white'
                                : 'border-white/10 bg-[#141620] text-slate-400 hover:border-white/30'
                            }`}
                          >
                            <span style={{ fontFamily: f.fontFamily }} className="text-sm font-bold text-white">
                              {f.sample}
                            </span>
                            <span className="text-[9px] text-slate-500">{f.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Text Color Swatches */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-[#D4AF37] uppercase block">Ink / Thread Color</span>
                    <div className="flex flex-wrap gap-2">
                      {STUDIO_TEXT_COLORS.map(tc => {
                        const isSelected = textColor === tc.hex;
                        return (
                          <button
                            key={tc.name}
                            onClick={() => setTextColor(tc.hex)}
                            className={`p-1.5 rounded-full border transition-all ${
                              isSelected ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/40' : 'border-white/20'
                            }`}
                            title={tc.name}
                          >
                            <span className="w-5 h-5 rounded-full block" style={{ backgroundColor: tc.hex }} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Font Size & Position Sliders */}
                  <div className="p-3 bg-[#141620] rounded border border-white/10 space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-400">Font Size:</span>
                        <span className="text-white">{textSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="14"
                        max="44"
                        value={textSize}
                        onChange={(e) => setTextSize(Number(e.target.value))}
                        className="w-full accent-[#D4AF37]"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-400">Vertical Position (Y):</span>
                        <span className="text-white">{textPos.y}%</span>
                      </div>
                      <input
                        type="range"
                        min="15"
                        max="85"
                        value={textPos.y}
                        onChange={(e) => setTextPos({ ...textPos, y: Number(e.target.value) })}
                        className="w-full accent-[#D4AF37]"
                      />
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: CRAFT & TECHNIQUE */}
              {activeControlTab === 'TECHNIQUE' && (
                <div className="space-y-3 animate-fade-in">
                  <span className="text-[10px] font-bold text-[#D4AF37] uppercase block">
                    CHOOSE MANUFACTURING TECHNIQUE
                  </span>

                  <div className="space-y-2">
                    {PRINT_TECHNIQUES.map(tech => {
                      const isSelected = printTechnique === tech.id;
                      return (
                        <div
                          key={tech.id}
                          onClick={() => setPrintTechnique(tech.id)}
                          className={`p-3 rounded border cursor-pointer transition-all space-y-1 ${
                            isSelected
                              ? 'border-[#D4AF37] bg-[#D4AF37]/15'
                              : 'border-white/10 bg-[#141620] hover:border-white/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <strong className="text-white text-xs">{tech.name}</strong>
                            <span className="px-2 py-0.5 rounded bg-black/60 text-[#D4AF37] text-[9px] font-bold">
                              {tech.fee === 0 ? 'Included' : `+ LKR ${tech.fee.toLocaleString()}`}
                            </span>
                          </div>
                          <p className="text-slate-400 text-[10px] leading-relaxed">{tech.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* Price Breakdown Matrix & Add To Cart CTA */}
            <div className="bg-[#0E1017] border border-[#D4AF37]/40 rounded-md p-5 space-y-4 shadow-2xl font-mono text-xs">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                  BESPOKE ORDER VALUATION
                </span>
                <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                  <ShieldCheck size={12} />
                  <span>CRAFT VERIFIED</span>
                </span>
              </div>

              {/* Line Items Formula */}
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>Base Heavyweight Garment:</span>
                  <span className="text-white">LKR {basePrice.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>{printTechnique}:</span>
                  <span className="text-[#D4AF37]">
                    {techniqueFee === 0 ? 'Free' : `+ LKR ${techniqueFee.toLocaleString()}`}
                  </span>
                </div>

                {placementFee > 0 && (
                  <div className="flex justify-between text-slate-400">
                    <span>Precision Sleeve Setup:</span>
                    <span className="text-[#D4AF37]">+ LKR {placementFee.toLocaleString()}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-white uppercase font-syne">TOTAL BESPOKE PIECE:</span>
                  <span className="text-xl font-black text-[#D4AF37]">
                    LKR {totalCustomPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-[#D4AF37] hover:bg-[#E2B714] text-black font-extrabold text-xs uppercase tracking-[0.2em] rounded-[2px] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#D4AF37]/20 cursor-pointer"
              >
                <ShoppingBag size={16} />
                <span>ADD BESPOKE ITEM TO BAG</span>
              </button>

              <p className="text-[10px] text-slate-500 text-center">
                Custom garments are precision manufactured & dispatched in 3–5 working days islandwide.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
