
import React from 'react';
import { VaultItem } from '../types';

interface VaultProps {
  items: VaultItem[];
  onSelectItem: (item: VaultItem) => void;
  onDeleteItem: (id: string) => void;
}

const Vault: React.FC<VaultProps> = ({ items, onSelectItem, onDeleteItem }) => {
  if (items.length === 0) {
    return (
      <div className="h-[800px] glass-card rounded-[4.5rem] p-12 border-dashed border-white/5 flex flex-col items-center justify-center text-center space-y-8">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-slate-800 floating">
           <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        </div>
        <div className="space-y-4">
           <p className="text-3xl font-black text-slate-800 uppercase tracking-tighter italic">Archive Offline</p>
           <p className="text-[11px] font-bold text-slate-700 uppercase tracking-[0.4em] max-w-xs mx-auto">No neural packets recorded for this identity.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {items.map((item) => (
        <div 
          key={item.id}
          className="glass-card rounded-[3rem] p-8 border-white/5 hover:border-cyan-500/40 transition-all group relative cursor-pointer overflow-hidden flex flex-col gap-6"
          onClick={() => onSelectItem(item)}
        >
          <div className="flex gap-8">
            <div className="w-32 h-40 bg-black/60 rounded-3xl overflow-hidden border border-white/5 group-hover:border-cyan-500/40 transition-all flex-shrink-0 shadow-2xl relative">
               <img src={item.image.base64} alt="doc" className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            </div>
            <div className="flex-1 space-y-4 py-2">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.2em] space-mono">Packet ID: {item.id.substring(0, 8)}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteItem(item.id); }}
                  className="p-2 hover:bg-red-500/20 text-slate-700 hover:text-red-500 rounded-xl transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-white truncate group-hover:text-cyan-400 transition-colors uppercase tracking-tight italic">{item.title || "Unknown Intelligence"}</h4>
                <div className="flex items-center gap-3">
                   <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-bold text-slate-500 uppercase tracking-widest border border-white/5">{item.sourceLang}</span>
                   <span className="text-slate-700">→</span>
                   <span className="px-3 py-1 bg-cyan-500/5 rounded-full text-[9px] font-bold text-cyan-500 uppercase tracking-widest border border-cyan-500/10">{item.targetLang}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-3 italic leading-relaxed">
                {item.result.clean_source_text || item.result.raw_text}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
             <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Captured: {new Date(item.timestamp).toLocaleDateString()}</span>
             <span className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity">Retrieve Link →</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-fuchsia-500/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-1000"></div>
        </div>
      ))}
    </div>
  );
};

export default Vault;
