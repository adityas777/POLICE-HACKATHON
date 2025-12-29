
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user?: User;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-24 bg-black/40 backdrop-blur-3xl border-b border-white/5 flex items-center px-12 no-print transition-all duration-500">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-5 group cursor-pointer">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 bg-cyan-500/20 blur-[15px] rounded-full group-hover:bg-cyan-500/40 transition-all"></div>
            <div className="relative w-full h-full bg-[#0d1117] border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl group-hover:border-cyan-500/50 transition-all overflow-hidden">
               <span className="text-white font-black text-2xl tracking-tighter italic">L</span>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tight text-white group-hover:text-cyan-400 transition-all duration-500 italic">
              LEKHAN<span className="text-slate-600">AI</span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-slate-500 tracking-[0.5em] uppercase opacity-60">Neural Synchronization</span>
            </div>
          </div>
        </div>
        
        {user && (
          <nav className="hidden xl:flex items-center gap-12">
            <div className="flex items-center gap-4 px-5 py-2.5 bg-white/5 rounded-2xl border border-white/5">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white uppercase tracking-wider">{user.name}</span>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Active Session</span>
              </div>
            </div>
            
            <button 
              onClick={onLogout}
              className="px-6 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95"
            >
              Terminate Link
            </button>
          </nav>
        )}

        <button className="xl:hidden p-3 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-2xl border border-white/10">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
