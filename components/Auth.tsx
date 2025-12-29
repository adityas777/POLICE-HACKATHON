
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simulate Auth Logic using LocalStorage for persistence
    const usersJson = localStorage.getItem('lekhan_users');
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];

    if (isLogin) {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        setError('Identity mismatch. Check credentials.');
      }
    } else {
      if (users.find(u => u.email === email)) {
        setError('Identity already exists in matrix.');
        return;
      }
      const newUser: User = { id: Date.now().toString(), name, email, password };
      users.push(newUser);
      localStorage.setItem('lekhan_users', JSON.stringify(users));
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="glass-card w-full max-w-md rounded-[3rem] p-12 border-white/5 relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center space-y-4 mb-10">
          <div className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center text-3xl font-black shadow-2xl mx-auto italic">L</div>
          <h2 className="text-3xl font-black text-white tracking-tighter italic">
            {isLogin ? 'Access Terminal' : 'Register Identity'}
          </h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Neural Link Protocol v4.2</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] pl-1">Full Name</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Agent Name"
                className="w-full bg-black/50 border border-white/5 rounded-2xl px-5 py-4 text-[11px] font-black text-white focus:outline-none focus:border-cyan-500/50 transition-all"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] pl-1">Neural Email</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="id@lekhan.ai"
              className="w-full bg-black/50 border border-white/5 rounded-2xl px-5 py-4 text-[11px] font-black text-white focus:outline-none focus:border-cyan-500/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] pl-1">Access Key</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/50 border border-white/5 rounded-2xl px-5 py-4 text-[11px] font-black text-white focus:outline-none focus:border-cyan-500/50 transition-all"
            />
          </div>

          {error && (
            <p className="text-red-500 text-[9px] font-black uppercase tracking-widest text-center animate-pulse">{error}</p>
          )}

          <button className="w-full py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] btn-neural shadow-2xl hover:bg-cyan-400">
            {isLogin ? 'Initialize Link' : 'Register Sequence'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-slate-500 text-[9px] font-black uppercase tracking-widest hover:text-cyan-400 transition-colors"
          >
            {isLogin ? "No identity? Register here" : "Existing Link? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
