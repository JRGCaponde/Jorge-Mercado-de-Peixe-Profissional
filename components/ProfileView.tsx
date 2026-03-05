
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  user: UserProfile | null;
  onSave: (user: UserProfile) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onSave }) => {
  const [formData, setFormData] = useState<UserProfile>(user || {
    id: '', fullName: '', email: '', phone: '', role: 'customer' as any
  });

  if (!user) return null;

  const roleLabels: any = {
    'admin': 'Administrador',
    'staff': 'Funcionário',
    'customer': 'Cliente'
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Definições de Utilizador</h1>
        <p className="text-slate-500">Gerir o seu perfil de mercado e preferências</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-black">
            {user.fullName[0]}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{user.fullName}</h3>
            <p className="text-sm text-slate-400 capitalize">Conta de {roleLabels[user.role]}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Nome Completo</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">E-mail</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">NIF (Identificação Fiscal)</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none"
              value={formData.nif || ''}
              onChange={(e) => setFormData({...formData, nif: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Número de Telefone</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        </div>

        <div className="pt-6">
          <button 
            onClick={() => onSave(formData)}
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            ACTUALIZAR PERFIL
          </button>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
        <div className="text-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
        </div>
        <div>
          <h4 className="text-sm font-bold text-blue-900">Privacidade e Segurança</h4>
          <p className="text-xs text-blue-700 mt-1">Os seus dados estão mascarados para utilizadores de nível Funcionário. Apenas Administradores podem visualizar informações de contacto completas para garantir a conformidade com a privacidade do cliente.</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
