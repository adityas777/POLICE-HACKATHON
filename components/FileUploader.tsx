
import React, { useRef, useState } from 'react';

interface FileUploaderProps {
  onFileSelect: (base64: string, mimeType: string) => void;
  isLoading: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, isLoading }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onFileSelect(base64String, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
      />
      
      {!preview ? (
        <div 
          onClick={() => !isLoading && fileInputRef.current?.click()}
          className={`group cursor-pointer border-2 border-dashed border-white/5 rounded-[2.5rem] p-12 transition-all flex flex-col items-center justify-center gap-8 hover:border-cyan-500/40 hover:bg-cyan-500/[0.03] active:scale-95 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/30 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative w-20 h-20 bg-black/40 border border-white/10 rounded-3xl flex items-center justify-center group-hover:bg-slate-900 group-hover:border-cyan-500/50 transition-all duration-700">
              <svg className="w-9 h-9 text-slate-600 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
          </div>
          <div className="text-center space-y-3">
            <p className="text-sm font-black uppercase tracking-[0.4em] text-white group-hover:text-cyan-400 transition-colors">Capture Stream</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Supports Multi-modal Inputs (PNG/JPG)</p>
          </div>
        </div>
      ) : (
        <div className="relative group rounded-[2.5rem] overflow-hidden glass-card border-white/10 aspect-video max-h-[350px] shadow-2xl">
          <img src={preview} alt="Input source" className="w-full h-full object-contain p-4" />
          
          {isLoading && <div className="scanning-beam"></div>}
          
          <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-6 backdrop-blur-md">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-10 py-3.5 btn-neural rounded-2xl text-[10px] font-black uppercase tracking-widest"
            >
              Re-Sync Source
            </button>
            <button 
              onClick={() => { setPreview(null); }}
              className="px-10 py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-500/20 transition-all"
            >
              Erase Cache
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
