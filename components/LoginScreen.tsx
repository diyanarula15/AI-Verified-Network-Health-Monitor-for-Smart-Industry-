import React, { useState } from 'react';
import { ShieldCheck, Zap, Lock, Activity, Globe, User, Key, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (role: 'operator' | 'injector') => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'operator' | 'injector'>('operator');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isOperator = activeTab === 'operator';
  
  // Theme constants based on role
  const themeColor = isOperator ? 'text-neon-blue' : 'text-neon-rose';
  const themeBg = isOperator ? 'bg-neon-blue' : 'bg-neon-rose';
  const themeBorder = isOperator ? 'border-neon-blue' : 'border-neon-rose';
  const themeHover = isOperator ? 'hover:bg-neon-blue' : 'hover:bg-neon-rose';
  const themeFocus = isOperator ? 'focus:border-neon-blue' : 'focus:border-neon-rose';
  const glowShadow = isOperator ? 'shadow-[0_0_30px_rgba(6,182,212,0.15)]' : 'shadow-[0_0_30px_rgba(244,63,94,0.15)]';

  const handleTabChange = (tab: 'operator' | 'injector') => {
    setActiveTab(tab);
    setUsername('');
    setPassword('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('ID and Password are required to authenticate.');
      return;
    }

    setIsLoading(true);

    // Simulate network authentication handshake
    setTimeout(() => {
      setIsLoading(false);
      onLogin(activeTab);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-cyber-black flex items-center justify-center relative overflow-hidden font-sans text-slate-200">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', 
             backgroundSize: '50px 50px',
             maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
           }}>
      </div>
      
      {/* Ambient Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[100px] pointer-events-none transition-colors duration-1000 ${isOperator ? 'bg-indigo-500/10' : 'bg-rose-900/10'}`}></div>

      <div className="z-10 w-full max-w-md px-6">
        
        {/* Header Logo */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center gap-2 font-mono text-xs tracking-[0.3em] uppercase mb-4 border px-3 py-1 rounded-full transition-colors duration-300 ${isOperator ? 'border-neon-blue/30 bg-neon-blue/5 text-neon-blue' : 'border-neon-rose/30 bg-neon-rose/5 text-neon-rose'}`}>
            <Globe size={12} /> Secure Industrial Gateway v4.2
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
            NEURO-LINK
          </h1>
          <p className="text-slate-500 text-sm font-mono">
            Simulated Industrial Network Environment
          </p>
        </div>

        {/* Login Card */}
        <div className={`bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ${glowShadow}`}>
            
            {/* Tab Switcher */}
            <div className="flex border-b border-slate-700">
                <button 
                    onClick={() => handleTabChange('operator')}
                    className={`flex-1 py-4 text-sm font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'operator' ? 'bg-slate-800 text-neon-blue border-b-2 border-neon-blue' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
                >
                    <Activity size={16} /> OPERATOR
                </button>
                <button 
                    onClick={() => handleTabChange('injector')}
                    className={`flex-1 py-4 text-sm font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'injector' ? 'bg-slate-800 text-neon-rose border-b-2 border-neon-rose' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
                >
                    <Zap size={16} /> ADVERSARY
                </button>
            </div>

            {/* Form */}
            <div className="p-8">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-1">
                        {isOperator ? 'Operator Portal' : 'Backend Injection Console'}
                    </h2>
                    <p className="text-xs text-slate-400">
                        {isOperator ? 'Enter your Shift ID to access the dashboard.' : 'Authenticate to access root system controls.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">User ID</label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                <User size={16} />
                            </div>
                            <input 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={`w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all ${themeFocus}`}
                                placeholder={isOperator ? "OP-7422" : "ROOT_ADMIN"}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Password</label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                <Key size={16} />
                            </div>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-600 outline-none transition-all ${themeFocus}`}
                                placeholder="••••••••"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/20 p-3 rounded border border-rose-900/50 animate-in fade-in slide-in-from-top-1">
                            <AlertCircle size={14} /> {error}
                        </div>
                    )}

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 rounded-lg font-bold text-sm tracking-wide text-white transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg ${themeBg} ${themeHover}`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" /> VERIFYING CREDENTIALS...
                            </>
                        ) : (
                            <>
                                <Lock size={16} /> AUTHENTICATE
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Footer */}
            <div className="bg-slate-950/50 p-4 border-t border-slate-800 text-center">
                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-mono">
                    <ShieldCheck size={12} className={themeColor} />
                    <span>256-BIT ENCRYPTION ACTIVE</span>
                    <span className="text-slate-700">|</span>
                    <span>SERVER: US-EAST-1</span>
                </div>
            </div>
        </div>

        <div className="mt-8 text-center opacity-40 hover:opacity-100 transition-opacity duration-300">
             <p className="text-[10px] text-slate-500 font-mono">
                 Use any non-empty credentials for simulation access.
             </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;