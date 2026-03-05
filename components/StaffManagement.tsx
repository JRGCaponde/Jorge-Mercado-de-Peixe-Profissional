
import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';

interface PermissionMetadata {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const AVAILABLE_PERMISSIONS: PermissionMetadata[] = [
  { 
    id: 'vendas', 
    label: 'Vendas (POS)', 
    color: 'bg-blue-500',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
  },
  { 
    id: 'stocks', 
    label: 'Stocks', 
    color: 'bg-emerald-500',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>
  },
  { 
    id: 'financeiro', 
    label: 'Financeiro', 
    color: 'bg-amber-500',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  },
  { 
    id: 'rh', 
    label: 'Gestão RH', 
    color: 'bg-indigo-500',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  },
  { 
    id: 'analytics', 
    label: 'Analytics', 
    color: 'bg-rose-500',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
  }
];

const StaffManagement: React.FC<{ 
  users: UserProfile[],
  onUpdateUser: (user: UserProfile) => void
}> = ({ users, onUpdateUser }) => {
  const [staffList, setStaffList] = useState<UserProfile[]>(users.map(u => ({
    ...u,
    permissions: u.permissions || (u.role === UserRole.ADMIN ? AVAILABLE_PERMISSIONS.map(p => p.id) : ['vendas'])
  })));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<UserProfile | null>(null);

  const handleEditClick = (staff: UserProfile) => {
    setEditingId(staff.id);
    setEditForm({ ...staff });
  };

  const handleTogglePermission = (permId: string) => {
    if (!editForm) return;
    const currentPerms = editForm.permissions || [];
    const newPerms = currentPerms.includes(permId)
      ? currentPerms.filter(p => p !== permId)
      : [...currentPerms, permId];
    setEditForm({ ...editForm, permissions: newPerms });
  };

  const handleSave = () => {
    if (editForm) {
      setStaffList(prev => prev.map(s => s.id === editForm.id ? editForm : s));
      onUpdateUser(editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Equipa Fish Market</h1>
          <p className="text-slate-500">Gestão de credenciais e matriz de autorizações Primavera V10</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto no-print">
          <button 
            onClick={() => window.print()}
            className="bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-300 transition-all flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
            Imprimir Equipa
          </button>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            Adicionar Colaborador
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8" id="printable-area">
        {staffList.map(staff => (
          <div key={staff.id} className={`bg-white rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden ${editingId === staff.id ? 'border-blue-500 shadow-2xl ring-8 ring-blue-50' : 'border-slate-100 shadow-sm hover:border-slate-200'}`}>
            {editingId === staff.id ? (
              // FORMULÁRIO DE EDIÇÃO
              <div className="p-10">
                <div className="flex justify-between items-center mb-10 pb-4 border-b border-slate-100">
                   <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Configuração de Segurança</h2>
                   <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-3 py-1 rounded-full uppercase">ID: {staff.id}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome Completo</label>
                    <input 
                      type="text" 
                      className="w-full text-sm font-bold border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-slate-50/50"
                      value={editForm?.fullName || ''}
                      onChange={e => setEditForm(prev => prev ? {...prev, fullName: e.target.value} : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cargo ERP</label>
                    <select 
                      className="w-full text-sm font-bold border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-slate-50/50 cursor-pointer appearance-none"
                      value={editForm?.role}
                      onChange={e => {
                        const newRole = e.target.value as UserRole;
                        setEditForm(prev => prev ? {
                          ...prev, 
                          role: newRole,
                          permissions: newRole === UserRole.ADMIN ? AVAILABLE_PERMISSIONS.map(p => p.id) : prev.permissions
                        } : null);
                      }}
                    >
                      <option value={UserRole.STAFF}>Funcionário (Staff)</option>
                      <option value={UserRole.ADMIN}>Administrador (Full Access)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Corporativo</label>
                    <input 
                      type="email" 
                      className="w-full text-sm font-bold border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-slate-50/50"
                      value={editForm?.email || ''}
                      onChange={e => setEditForm(prev => prev ? {...prev, email: e.target.value} : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Telefone / Contacto</label>
                    <input 
                      type="text" 
                      className="w-full text-sm font-bold border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-slate-50/50"
                      value={editForm?.phone || ''}
                      onChange={e => setEditForm(prev => prev ? {...prev, phone: e.target.value} : null)}
                    />
                  </div>
                </div>

                <div className="mb-10 p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-inner">
                  <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
                    Módulos & Autorizações Activas
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {AVAILABLE_PERMISSIONS.map(perm => {
                      const isActive = editForm?.permissions?.includes(perm.id);
                      return (
                        <button
                          key={perm.id}
                          onClick={() => handleTogglePermission(perm.id)}
                          className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${
                            isActive 
                            ? 'bg-blue-600/10 border-blue-500 text-white shadow-lg' 
                            : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:border-slate-600'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${isActive ? perm.color : 'bg-slate-700 text-slate-500'}`}>
                            {perm.icon}
                          </div>
                          <span className="text-[10px] font-black uppercase text-left">{perm.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={handleSave}
                    className="flex-1 bg-blue-600 text-white text-xs font-black py-5 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all uppercase tracking-widest active:scale-95"
                  >
                    Guardar Matriz de Acesso
                  </button>
                  <button 
                    onClick={() => { setEditingId(null); setEditForm(null); }}
                    className="px-8 bg-slate-100 text-slate-500 text-xs font-black py-5 rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              // MODO DE VISUALIZAÇÃO
              <div className="p-10 flex flex-col gap-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="relative group">
                    <div className="w-28 h-28 rounded-[2.5rem] bg-slate-100 border-4 border-white shadow-xl flex items-center justify-center text-4xl font-black text-slate-300 overflow-hidden transition-transform duration-500 group-hover:scale-105">
                      {staff.fullName[0]}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                       <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 mb-4">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{staff.fullName}</h3>
                        <p className="text-sm font-bold text-blue-500 mt-1 uppercase tracking-widest">{staff.role}</p>
                      </div>
                      <button 
                        onClick={() => handleEditClick(staff)}
                        className="p-4 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all border border-slate-100 group shadow-sm"
                        title="Configurar Acessos"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                         <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                         <p className="text-xs font-bold text-slate-700">{staff.email}</p>
                      </div>
                      <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                         <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Contacto</p>
                         <p className="text-xs font-bold text-slate-700">{staff.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* VISUALIZAÇÃO DE PERMISSÕES (GRID DE PROGRESSO) */}
                <div className="space-y-4 pt-4 border-t border-slate-50">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 text-center md:text-left">Matriz de Nível de Acesso</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {AVAILABLE_PERMISSIONS.map(perm => {
                      const isActive = staff.permissions?.includes(perm.id);
                      return (
                        <div key={perm.id} className="space-y-3 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-lg ${isActive ? perm.color + ' text-white' : 'bg-slate-200 text-slate-400'}`}>
                                {perm.icon}
                              </div>
                              <span className={`text-[9px] font-black uppercase ${isActive ? 'text-slate-700' : 'text-slate-400'}`}>{perm.label}</span>
                            </div>
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                              {isActive ? 'ACTIVO' : 'BLOQUEADO'}
                            </span>
                          </div>
                          <div className="relative h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={`absolute inset-y-0 left-0 transition-all duration-1000 ease-out ${isActive ? perm.color : 'w-0'}`}
                              style={{ width: isActive ? '100%' : '0%' }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffManagement;
