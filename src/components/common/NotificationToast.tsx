import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { toast } = useStore();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className={`px-5 py-3.5 rounded-lg shadow-2xl border flex items-center gap-3 backdrop-blur-md text-xs font-bold ${
        toast.type === 'success' 
          ? 'bg-[#0e1017]/95 border-[#d4af37] text-white' 
          : toast.type === 'error'
          ? 'bg-red-950/95 border-red-500 text-red-200'
          : 'bg-[#141620]/95 border-white/20 text-slate-200'
      }`}>
        {toast.type === 'success' && <CheckCircle className="text-[#d4af37]" size={18} />}
        {toast.type === 'error' && <AlertCircle className="text-red-400" size={18} />}
        {toast.type === 'info' && <Info className="text-sky-400" size={18} />}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
