
import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { ICONS } from '../constants';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
  allUsers: UserProfile[];
}

const Login: React.FC<LoginProps> = ({ onLogin, allUsers }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulação de delay de rede
    setTimeout(() => {
      const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (user) {
        // Verifica a password se estiver definida no perfil (para o novo admin)
        // Se não estiver definida, permite entrar (retrocompatibilidade com mock anterior)
        if (user.password && user.password !== password) {
          setError('Palavra-passe incorrecta.');
          setIsLoading(false);
          return;
        }
        onLogin(user);
      } else {
        setError('Credenciais inválidas. Por favor, verifique o seu email.');
        setIsLoading(false);
      }
    }, 800);
  };

  const quickLogin = (role: UserRole) => {
    const user = allUsers.find(u => u.role === role);
    if (user) {
      setEmail(user.email);
      // No real password check in this mock
      onLogin(user);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 mb-4">
                <span className="text-3xl font-black text-white">P</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight uppercase">Pro Sales 26</h1>
              <p className="text-slate-400 text-sm mt-1 font-medium">Sistema de Gestão Integrado ERP V10</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Corporativo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <ICONS.User />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    placeholder="exemplo@fishmarket.ao"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Palavra-passe</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 flex items-center gap-3 text-rose-400 text-xs font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    ENTRAR NO SISTEMA
                    <ICONS.LogIn />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-900 px-4 text-slate-500 font-bold tracking-widest">Acesso Rápido (Demo)</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => quickLogin(UserRole.ADMIN)}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-800/30 border border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <ICONS.Shield />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase">Admin</span>
                </button>
                <button 
                  onClick={() => quickLogin(UserRole.STAFF)}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-800/30 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <ICONS.Users />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase">Staff</span>
                </button>
                <button 
                  onClick={() => quickLogin(UserRole.CUSTOMER)}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-800/30 border border-slate-800 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <ICONS.User />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase">Cliente</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/30 p-4 text-center border-t border-slate-800">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              © 2026 Fish Market Pro • Luanda, Angola
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
