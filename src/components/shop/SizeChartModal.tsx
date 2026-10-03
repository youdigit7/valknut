import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeChartModal: React.FC<SizeChartModalProps> = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState<'CM' | 'INCHES'>('CM');
  const [activeTab, setActiveTab] = useState<'MEN' | 'WOMEN'>('MEN');

  if (!isOpen) return null;

  const menSizes = [
    { size: 'S', chestCm: '106-112', lengthCm: '72', shoulderCm: '54', chestIn: '42-44', lengthIn: '28.3', shoulderIn: '21.2' },
    { size: 'M', chestCm: '114-120', lengthCm: '74', shoulderCm: '56', chestIn: '45-47', lengthIn: '29.1', shoulderIn: '22.0' },
    { size: 'L', chestCm: '122-128', lengthCm: '76', shoulderCm: '58', chestIn: '48-50', lengthIn: '29.9', shoulderIn: '22.8' },
    { size: 'XL', chestCm: '130-136', lengthCm: '78', shoulderCm: '60', chestIn: '51-53', lengthIn: '30.7', shoulderIn: '23.6' },
    { size: 'XXL', chestCm: '138-144', lengthCm: '80', shoulderCm: '62', chestIn: '54-56', lengthIn: '31.5', shoulderIn: '24.4' }
  ];

  const womenSizes = [
    { size: 'S', chestCm: '94-98', lengthCm: '46', shoulderCm: '42', chestIn: '37-38.5', lengthIn: '18.1', shoulderIn: '16.5' },
    { size: 'M', chestCm: '100-104', lengthCm: '48', shoulderCm: '44', chestIn: '39-41', lengthIn: '18.9', shoulderIn: '17.3' },
    { size: 'L', chestCm: '106-110', lengthCm: '50', shoulderCm: '46', chestIn: '41.5-43', lengthIn: '19.7', shoulderIn: '18.1' }
  ];

  const currentData = activeTab === 'MEN' ? menSizes : womenSizes;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0e1017] border border-[#d4af37]/40 w-full max-w-2xl rounded-lg p-6 relative shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <Ruler className="text-[#d4af37]" size={24} />
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider font-syne">
                VALKNUT OFFICIAL SIZE GUIDE
              </h3>
              <p className="text-xs text-slate-400">Architectural Heavyweight Fit & Sizing Matrix</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full bg-white/5"
            aria-label="Close Size Guide"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab & Unit Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center bg-white/5 p-1 rounded border border-white/10">
            <button
              onClick={() => setActiveTab('MEN')}
              className={`px-4 py-1.5 text-xs font-bold uppercase rounded transition-colors ${
                activeTab === 'MEN' ? 'bg-[#d4af37] text-black' : 'text-slate-300'
              }`}
            >
              MEN / UNISEX FIT
            </button>
            <button
              onClick={() => setActiveTab('WOMEN')}
              className={`px-4 py-1.5 text-xs font-bold uppercase rounded transition-colors ${
                activeTab === 'WOMEN' ? 'bg-[#d4af37] text-black' : 'text-slate-300'
              }`}
            >
              WOMEN'S FIT
            </button>
          </div>

          <div className="flex items-center bg-white/5 p-1 rounded border border-white/10">
            <button
              onClick={() => setUnit('CM')}
              className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                unit === 'CM' ? 'bg-white text-black' : 'text-slate-400'
              }`}
            >
              CM
            </button>
            <button
              onClick={() => setUnit('INCHES')}
              className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                unit === 'INCHES' ? 'bg-white text-black' : 'text-slate-400'
              }`}
            >
              INCHES
            </button>
          </div>
        </div>

        {/* Size Table */}
        <div className="overflow-x-auto border border-white/10 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-[#d4af37] uppercase tracking-wider font-semibold border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Chest Circumference ({unit})</th>
                <th className="py-3 px-4">Garment Length ({unit})</th>
                <th className="py-3 px-4">Shoulder Width ({unit})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {currentData.map((row) => (
                <tr key={row.size} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-extrabold text-white">{row.size}</td>
                  <td className="py-3 px-4">{unit === 'CM' ? row.chestCm : row.chestIn}</td>
                  <td className="py-3 px-4">{unit === 'CM' ? row.lengthCm : row.lengthIn}</td>
                  <td className="py-3 px-4">{unit === 'CM' ? row.shoulderCm : row.shoulderIn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measuring Tip */}
        <div className="bg-white/[0.03] p-3 rounded border border-white/5 text-[11px] text-slate-400 leading-relaxed">
          <p className="font-semibold text-white mb-1">FIT NOTE:</p>
          VALKNUT tops are cut in our signature signature relaxed/oversized drop-shoulder profile. 
          If you prefer a closer tailored fit, we recommend selecting one size down.
        </div>

      </div>
    </div>
  );
};
