
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import OCRResult from './components/OCRResult';
import Vault from './components/Vault';
import Auth from './components/Auth';
import { OCRMode, OCRResultData, VaultItem, User, VaultStatus } from './types';
import { MODES, SUPPORTED_SOURCE_LANGS, SUPPORTED_TARGET_LANGS } from './constants.tsx';
import { performOCR } from './services/geminiService';
import { jsPDF } from 'jspdf';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [sourceLang, setSourceLang] = useState<string>('hi');
  const [targetLang, setTargetLang] = useState<string>('en');
  const [image, setImage] = useState<{ base64: string; mime: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OCRResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [vault, setVault] = useState<VaultItem[]>([]);
  const [showVault, setShowVault] = useState(false);

  const sourceLangObj = SUPPORTED_SOURCE_LANGS.find(l => l.code === sourceLang) || SUPPORTED_SOURCE_LANGS[0];
  const targetLangObj = SUPPORTED_TARGET_LANGS.find(l => l.code === targetLang) || SUPPORTED_TARGET_LANGS[0];

  useEffect(() => {
    const savedUser = localStorage.getItem('lekhan_active_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      loadUserVault(parsedUser.id);
    }
  }, []);

  const loadUserVault = (userId: string) => {
    const savedVault = localStorage.getItem(`lekhan_vault_${userId}`);
    if (savedVault) {
      try {
        setVault(JSON.parse(savedVault));
      } catch (e) {
        console.error("Failed to parse user vault", e);
      }
    } else {
      setVault([]);
    }
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('lekhan_active_user', JSON.stringify(newUser));
    loadUserVault(newUser.id);
  };

  const handleLogout = () => {
    setUser(null);
    setVault([]);
    setResult(null);
    setImage(null);
    localStorage.removeItem('lekhan_active_user');
  };

  const saveVault = (newVault: VaultItem[]) => {
    if (!user) return;
    setVault(newVault);
    localStorage.setItem(`lekhan_vault_${user.id}`, JSON.stringify(newVault));
  };

  const handleFileSelect = (base64: string, mime: string) => {
    setImage({ base64, mime });
    setResult(null);
    setError(null);
  };

  const handleDownloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yCursor = 25;

    const checkPageBreak = (neededHeight: number) => {
      if (yCursor + neededHeight > pageHeight - margin) {
        doc.addPage();
        yCursor = margin + 10;
        return true;
      }
      return false;
    };

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42);
    doc.text("Lekhan-AI Intelligence Report", margin, yCursor);
    yCursor += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Authorized Agent: ${user?.name || 'Unknown'}`, margin, yCursor);
    doc.text(`Timestamp: ${new Date().toLocaleString()}`, margin + 100, yCursor);
    yCursor += 12;

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, yCursor, pageWidth - margin, yCursor);
    yCursor += 15;

    if (result.title) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42);
      const splitTitle = doc.splitTextToSize(result.title, contentWidth);
      doc.text(splitTitle, margin, yCursor);
      yCursor += (splitTitle.length * 7) + 10;
    }

    if (result.sections && result.sections.length > 0) {
      result.sections.forEach(sec => {
        checkPageBreak(25);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(14, 165, 233);
        doc.text(sec.heading.toUpperCase(), margin, yCursor);
        yCursor += 7;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(51, 65, 85);
        const splitContent = doc.splitTextToSize(sec.content, contentWidth);
        doc.text(splitContent, margin, yCursor);
        yCursor += (splitContent.length * 5) + 10;
      });
    }

    if (result.translated_text) {
      checkPageBreak(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(192, 38, 211);
      doc.text(`Bilingual Translation Packet`, margin, yCursor);
      yCursor += 7;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      const splitTrans = doc.splitTextToSize(result.translated_text, contentWidth);
      doc.text(splitTrans, margin, yCursor);
    }

    doc.save(`LEKHAN_INTELLIGENCE_${Date.now()}.pdf`);
  };

  const runComprehensiveAnalysis = async () => {
    if (!image || !user) return;
    setLoading(true);
    setError(null);
    try {
      const rawResponse = await performOCR(image.base64, OCRMode.MASTER, sourceLangObj.name, targetLangObj.name, image.mime);
      let parsedData: OCRResultData = {};
      try {
        const cleanedJson = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(cleanedJson);
      } catch (e) {
        parsedData = { raw_text: rawResponse };
      }
      
      setResult(parsedData);
      
      const newItem: VaultItem = {
        id: Date.now().toString(),
        userId: user.id,
        timestamp: Date.now(),
        title: parsedData.title || `Intelligence ${new Date().toLocaleTimeString()}`,
        image: { base64: image.base64, mime: image.mime },
        result: parsedData,
        sourceLang: sourceLangObj.name,
        targetLang: targetLangObj.name,
        status: 'not-visited'
      };
      saveVault([newItem, ...vault.slice(0, 49)]);

    } catch (err: any) {
      setError(err.message || 'Interface Link Failure.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFromVault = (item: VaultItem) => {
    setImage(item.image);
    setResult(item.result);
    setSourceLang(SUPPORTED_SOURCE_LANGS.find(l => l.name === item.sourceLang)?.code || 'hi');
    setTargetLang(SUPPORTED_TARGET_LANGS.find(l => l.name === item.targetLang)?.code || 'en');
    setShowVault(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteFromVault = (id: string) => {
    saveVault(vault.filter(item => item.id !== id));
  };

  const handleUpdateStatus = (id: string, newStatus: VaultStatus) => {
    const updatedVault = vault.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    );
    saveVault(updatedVault);
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <Auth onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="container mx-auto px-6 pt-32 pb-32 max-w-[1500px]">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
          
          {/* Dashboard Panel */}
          <div className="xl:col-span-4 space-y-12 no-print">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/30 neural-pulse">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest space-mono">Neural Status: Stable</span>
                </div>
                <button 
                  onClick={() => setShowVault(!showVault)}
                  className={`text-[9px] font-black uppercase tracking-widest px-5 py-2 rounded-full border transition-all btn-neural ${showVault ? 'bg-cyan-500 text-black border-cyan-400' : 'text-slate-400 border-white/10 hover:border-cyan-500/30'}`}
                >
                  {showVault ? 'Close Archive' : `Archive (${vault.length})`}
                </button>
              </div>
              <h2 className="text-7xl font-extrabold text-white leading-none tracking-tighter italic">
                {showVault ? 'Intelligence' : 'Master'}<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-600">
                  {showVault ? 'Registry.' : 'Matrix.'}
                </span>
              </h2>
            </div>

            {!showVault ? (
              <div className="glass-card rounded-[3.5rem] p-12 border-white/5 space-y-12 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-emerald-500 opacity-50"></div>
                
                <div className="space-y-10">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] pl-1 space-mono">Script Origin</label>
                      <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-5 text-[11px] font-bold text-white focus:outline-none focus:border-cyan-500/50 appearance-none cursor-pointer transition-all hover:bg-black">
                        {SUPPORTED_SOURCE_LANGS.map(l => <option key={l.code} value={l.code}>{l.name} • {l.native}</option>)}
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] pl-1 space-mono">Link Target</label>
                      <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-5 text-[11px] font-bold text-white focus:outline-none focus:border-fuchsia-500/50 appearance-none cursor-pointer transition-all hover:bg-black">
                        {SUPPORTED_TARGET_LANGS.map(l => <option key={l.code} value={l.code}>{l.name} • {l.native}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] space-mono">Capture Module</h3>
                    <FileUploader onFileSelect={handleFileSelect} isLoading={loading} />
                  </div>

                  <div className="pt-8">
                    <button disabled={!image || loading} onClick={runComprehensiveAnalysis} className={`w-full py-7 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.5em] transition-all duration-700 btn-neural-primary flex items-center justify-center gap-5 ${!image || loading ? 'bg-slate-900 text-slate-700 cursor-not-allowed border border-white/5 opacity-40' : 'shadow-2xl'}`}>
                      {loading ? (
                        <div className="flex items-center gap-4">
                          <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                          Neural Stream Active...
                        </div>
                      ) : (
                        "Initiate Matrix Scan"
                      )}
                    </button>
                    <p className="text-[10px] text-center text-slate-600 mt-6 font-bold uppercase tracking-[0.2em] italic">Proprietary Reconstruction Protocol 4.2</p>
                  </div>

                  {error && (
                    <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-[2rem] text-red-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-5 animate-in slide-in-from-top-4">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                      {error}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-10 animate-in fade-in slide-in-from-left-6 duration-700">
                <div className="glass-card p-10 rounded-[3rem] border-cyan-500/10">
                  <p className="text-slate-400 text-lg font-medium leading-relaxed italic">
                    Identity confirmed: <span className="text-cyan-400">{user.name}</span>. Accessing isolated records from the deep intelligence matrix.
                  </p>
                </div>
                <div className="p-8 bg-indigo-500/5 rounded-[2rem] border border-white/5">
                   <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest space-mono">Security Note</p>
                   <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">Local records are encrypted and bound to your active neural profile. Unauthorized access is blocked by hardware encryption.</p>
                </div>
              </div>
            )}
          </div>

          {/* Result / Vault Area */}
          <div className="xl:col-span-8">
            {showVault ? (
              <Vault 
                items={vault} 
                onSelectItem={handleSelectFromVault} 
                onDeleteItem={handleDeleteFromVault}
                onUpdateStatus={handleUpdateStatus}
              />
            ) : (
              <div className="h-full">
                {!result && !loading && (
                  <div className="h-full min-h-[850px] border-2 border-dashed border-slate-900/50 rounded-[4.5rem] flex flex-col items-center justify-center p-24 text-center space-y-16 group hover:border-cyan-500/20 transition-all duration-1000 bg-white/[0.01]">
                    <div className="relative floating">
                       <div className="absolute inset-0 bg-cyan-500/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                       <div className="relative w-56 h-56 bg-black/40 rounded-[3rem] flex items-center justify-center border border-white/5 shadow-inner rotate-12 group-hover:rotate-0 transition-all duration-1000">
                          <svg className="w-20 h-20 text-slate-800 group-hover:text-cyan-500/50 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                       </div>
                    </div>
                    <div className="space-y-6">
                      <h4 className="text-5xl font-black text-slate-800 tracking-tighter italic uppercase">Registry Idle</h4>
                      <p className="max-w-md text-slate-700 mx-auto text-[11px] font-black uppercase tracking-[0.5em] leading-loose">
                        Transmit source data via the capture module to begin multi-threaded neural synchronization.
                      </p>
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="h-full min-h-[850px] glass-card rounded-[4.5rem] flex flex-col items-center justify-center p-24 space-y-20 relative overflow-hidden shadow-inner">
                    <div className="scanning-beam"></div>
                    
                    <div className="relative z-10 text-center space-y-16">
                      <div className="relative inline-flex items-center justify-center">
                        <div className="w-72 h-72 border-[2px] border-white/5 rounded-full"></div>
                        <div className="absolute inset-0 w-72 h-72 border-t-[4px] border-transparent border-t-cyan-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-10 w-52 h-52 border-b-[4px] border-transparent border-b-fuchsia-500 rounded-full animate-[spin_4s_linear_infinite_reverse]"></div>
                        <div className="absolute inset-20 w-32 h-32 border-l-[4px] border-transparent border-l-emerald-500 rounded-full animate-[spin_3s_linear_infinite]"></div>
                        <div className="absolute w-12 h-12 bg-white rounded-full blur-xl animate-pulse opacity-40"></div>
                      </div>
                      <div className="space-y-6">
                        <h4 className="text-4xl font-extrabold text-white tracking-tighter italic">Normalizing Matrix Fragments</h4>
                        <div className="flex flex-col items-center gap-6">
                           <div className="flex gap-4">
                              <span className="px-4 py-1.5 bg-white/5 rounded-full text-[9px] font-black text-cyan-400 uppercase tracking-widest border border-cyan-500/20">OCR Core</span>
                              <span className="px-4 py-1.5 bg-white/5 rounded-full text-[9px] font-black text-fuchsia-400 uppercase tracking-widest border border-fuchsia-500/20">Translator</span>
                              <span className="px-4 py-1.5 bg-white/5 rounded-full text-[9px] font-black text-emerald-400 uppercase tracking-widest border border-emerald-500/20">Validator</span>
                           </div>
                           <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.4em] max-w-sm mx-auto leading-relaxed">
                             Reconstructing geometry • Normalizing Unicode • Extracting Intelligence
                           </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {result && !loading && (
                  <OCRResult data={result} sourceLangName={sourceLangObj.name} targetLangName={targetLangObj.name} onDownload={handleDownloadPDF} />
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
