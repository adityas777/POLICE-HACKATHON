
import React, { useState, useMemo } from 'react';
import { VaultItem, VaultStatus } from '../types';

interface VaultProps {
  items: VaultItem[];
  onSelectItem: (item: VaultItem) => void;
  onDeleteItem: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: VaultStatus) => void;
}

const Vault: React.FC<VaultProps> = ({ items, onSelectItem, onDeleteItem, onUpdateStatus }) => {
  const [langFilter, setLangFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');

  const availableLanguages = useMemo(() => {
    const langs = new Set(items.map(item => item.sourceLang));
    return Array.from(langs);
  }, [items]);

  const availableMonths = useMemo(() => {
    const months = new Set(items.map(item => {
      const date = new Date(item.timestamp);
      return date.toLocaleString('default', { month: 'long' });
    }));
    return Array.from(months);
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesLang = langFilter === 'all' || item.sourceLang === langFilter;
      const itemMonth = new Date(item.timestamp).toLocaleString('default', { month: 'long' });
      const matchesMonth = monthFilter === 'all' || itemMonth === monthFilter;
      return matchesLang && matchesMonth;
    });
  }, [items, langFilter, monthFilter]);

  const groupedItems = useMemo(() => {
    const groups: Record<VaultStatus, VaultItem[]> = {
      'not-visited': [],
      'in-progress': [],
      'completed': []
    };
    filteredItems.forEach(item => {
      groups[item.status || 'not-visited'].push(item);
    });
    return groups;
  }, [filteredItems]);

  const statusConfig: { id: VaultStatus; label: string; color: string }[] = [
    { id: 'not-visited', label: 'Not Visited', color: 'slate' },
    { id: 'in-progress', label: 'In Progress', color: 'cyan' },
    { id: 'completed', label: 'Completed', color: 'emerald' }
  ];

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
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center gap-8 bg-black/40 p-6 rounded-[2.5rem] border border-white/5">
        <div className="flex items-center gap-4 flex-1 w-full">
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] whitespace-nowrap">Source Filters</span>
           <div className="h-px w-full bg-white/5"></div>
        </div>
        <div className="flex items-center gap-6 w-full md:w-auto">
          <div className="relative group min-w-[150px]">
            <select 
              value={langFilter} 
              onChange={(e) => setLangFilter(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-3 text-[10px] font-black text-white focus:outline-none focus:border-cyan-500/50 appearance-none cursor-pointer transition-all hover:bg-black"
            >
              <option value="all">All Languages</option>
              {availableLanguages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
            </select>
          </div>
          <div className="relative group min-w-[150px]">
            <select 
              value={monthFilter} 
              onChange={(e) => setMonthFilter(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-3 text-[10px] font-black text-white focus:outline-none focus:border-fuchsia-500/50 appearance-none cursor-pointer transition-all hover:bg-black"
            >
              <option value="all">All Months</option>
              {availableMonths.map(month => <option key={month} value={month}>{month}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {statusConfig.map((col) => (
          <div key={col.id} className="space-y-8 flex flex-col h-full">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-4">
                 <div className={`w-2 h-2 rounded-full bg-${col.color}-500 shadow-[0_0_10px_rgba(var(--cyan-glow),0.5)]`}></div>
                 <h3 className="text-[11px] font-black text-white uppercase tracking-[0.5em] italic">{col.label}</h3>
              </div>
              <span className="text-[10px] font-black text-slate-700 bg-white/5 px-3 py-1 rounded-full">{groupedItems[col.id].length}</span>
            </div>

            <div className="flex-1 space-y-6 bg-white/[0.01] rounded-[3rem] p-4 min-h-[500px] border border-transparent hover:border-white/5 transition-all">
              {groupedItems[col.id].length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-20">
                  <div className="w-12 h-12 border border-dashed border-slate-700 rounded-full flex items-center justify-center">
                    <span className="text-xs">∅</span>
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-700">Zone Empty</p>
                </div>
              ) : (
                groupedItems[col.id].map((item) => (
                  <div 
                    key={item.id}
                    className="glass-card rounded-[2.5rem] p-6 border-white/5 hover:border-cyan-500/40 transition-all group relative cursor-pointer overflow-hidden flex flex-col gap-4"
                    onClick={() => onSelectItem(item)}
                  >
                    <div className="flex gap-4">
                      <div className="w-16 h-20 bg-black/60 rounded-2xl overflow-hidden border border-white/5 group-hover:border-cyan-500/40 transition-all flex-shrink-0 relative">
                         <img src={item.image.base64} alt="doc" className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="text-[11px] font-black text-white truncate group-hover:text-cyan-400 transition-colors uppercase tracking-tight italic">{item.title}</h4>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onDeleteItem(item.id); }}
                            className="p-1.5 hover:bg-red-500/20 text-slate-700 hover:text-red-500 rounded-lg transition-all"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="px-2 py-0.5 bg-white/5 rounded-full text-[8px] font-bold text-slate-500 uppercase border border-white/5">{item.sourceLang}</span>
                        </div>
                        <p className="text-[9px] text-slate-600 line-clamp-2 italic leading-tight">
                          {item.result.clean_source_text || item.result.raw_text}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex flex-col gap-3">
                       <div className="flex items-center justify-between">
                         <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">{new Date(item.timestamp).toLocaleDateString()}</span>
                       </div>
                       
                       {/* Quick Status Update Controls */}
                       <div className="grid grid-cols-3 gap-1">
                         {statusConfig.map(status => (
                           <button
                             key={status.id}
                             onClick={(e) => { e.stopPropagation(); onUpdateStatus(item.id, status.id); }}
                             className={`text-[7px] font-black uppercase tracking-widest py-1.5 rounded-lg border transition-all ${item.status === status.id ? `bg-${status.color}-500/20 text-${status.color}-400 border-${status.color}-500/40` : 'bg-white/5 text-slate-600 border-white/5 hover:border-white/20'}`}
                           >
                             {status.id.split('-')[0]}
                           </button>
                         ))}
                       </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-fuchsia-500/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vault;
