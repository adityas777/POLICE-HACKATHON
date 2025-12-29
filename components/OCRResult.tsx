
import React from 'react';
import { OCRResultData, OCRMode } from '../types';

interface OCRResultProps {
  data: OCRResultData;
  sourceLangName: string;
  targetLangName: string;
  onDownload: () => void;
}

const OCRResult: React.FC<OCRResultProps> = ({ data, sourceLangName, targetLangName, onDownload }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      {/* Control Strip */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Global Matrix Analysis Active</span>
          </div>
          <span className="text-slate-600 text-xs font-bold">Comprehensive Sync v4.2</span>
        </div>
        <button 
          onClick={onDownload}
          className="btn-neural px-8 py-3.5 bg-cyan-500 text-black border border-cyan-400 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl active:scale-95 flex items-center gap-3"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Intelligence Dossier
        </button>
      </div>

      {/* Cross-Language Intelligence Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Source Text Block */}
        <div className="glass-card rounded-[2.5rem] p-8 md:p-10 border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
            <span className="text-8xl font-black italic select-none">{sourceLangName.substring(0, 2)}</span>
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Extracted Source • {sourceLangName}</h4>
            </div>
            <div className="bg-black/40 rounded-3xl p-8 border border-white/5 min-h-[300px]">
              <p className="text-2xl text-slate-100 leading-relaxed devanagari whitespace-pre-wrap">
                {data.clean_source_text || data.source_text || data.raw_text}
              </p>
            </div>
          </div>
        </div>

        {/* Translation Block */}
        <div className="glass-card rounded-[2.5rem] p-8 md:p-10 border-fuchsia-500/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-fuchsia-500">
            <span className="text-8xl font-black italic select-none">{targetLangName.substring(0, 2)}</span>
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-fuchsia-500"></span>
              <h4 className="text-[10px] font-black text-fuchsia-500 uppercase tracking-[0.3em]">Neural Translation • {targetLangName}</h4>
            </div>
            <div className="bg-fuchsia-500/[0.02] rounded-3xl p-8 border border-fuchsia-500/10 min-h-[300px]">
              {data.translated_text ? (
                <p className="text-xl text-slate-200 leading-relaxed italic whitespace-pre-wrap font-medium">
                  {data.translated_text}
                </p>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-slate-600 text-sm font-bold uppercase tracking-widest italic">Translation Stream Offline</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Intelligence Tags (Entities) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Identified Persons', items: data.entities?.persons, color: 'cyan', icon: '👤' },
          { label: 'Geographical Markers', items: data.entities?.locations, color: 'fuchsia', icon: '📍' },
          { label: 'Temporal Points', items: data.entities?.dates, color: 'emerald', icon: '📅' },
          { label: 'Corporate/Org Nodes', items: data.entities?.organizations, color: 'amber', icon: '🏢' }
        ].map((cat) => (
          <div key={cat.label} className="glass-card p-6 rounded-3xl border-white/5 hover:border-white/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <h5 className={`text-[9px] font-black text-${cat.color}-500 uppercase tracking-widest`}>{cat.label}</h5>
              <span className="text-lg opacity-40 group-hover:scale-110 transition-transform">{cat.icon}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {cat.items && cat.items.length > 0 ? (
                cat.items.map((item, i) => (
                  <span key={i} className={`px-2.5 py-1.5 bg-${cat.color}-500/5 rounded-xl text-[10px] font-bold text-slate-300 border border-white/5`}>
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-slate-700 text-[10px] font-bold uppercase tracking-widest italic">Buffer Empty</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Document Sections */}
      {data.sections && data.sections.length > 0 && (
        <div className="glass-card rounded-[2.5rem] p-10 md:p-14 border-white/5 space-y-12">
          <div className="flex items-center gap-4 border-b border-white/5 pb-8">
            <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.5em]">Structural Intelligence Layers</span>
            <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/20 to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {data.sections.map((sec, idx) => (
              <div key={idx} className="group/sec space-y-4">
                <h4 className="text-sm font-black text-white flex items-center gap-3 uppercase tracking-wider group-hover/sec:text-cyan-400 transition-colors">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>
                  {sec.heading}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed devanagari font-medium pl-4 border-l border-white/5">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OCRResult;
