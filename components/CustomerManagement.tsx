
import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { maskPII } from '../utils/masking';

interface CustomerManagementProps {
  users: UserProfile[];
  role: UserRole;
}

const CustomerManagement: React.FC<CustomerManagementProps> = ({ users, role }) => {
  const [search, setSearch] = useState('');

  const filtered = users.filter(u => 
    u.fullName.toLowerCase().includes(search.toLowerCase()) || 
    u.nif?.includes(search)
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Gestão de Clientes</h1>
        <p className="text-slate-500">Monitorize a base de dados de clientes e fidelização</p>
      </div>

      <div className="flex gap-4 no-print">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Pesquisar por nome ou NIF..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute left-3 top-3.5 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>
        <button 
          onClick={() => window.print()}
          className="bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-300 transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
          Imprimir Lista
        </button>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
          Novo Cliente
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" id="printable-area">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase">Nome</th>
              <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase">Contacto</th>
              <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase">NIF</th>
              <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase text-right">Acções</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(user => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                      {user.fullName[0]}
                    </div>
                    <span className="font-bold text-slate-800">{user.fullName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-600">{maskPII(user.email, role)}</p>
                  <p className="text-xs text-slate-400">{maskPII(user.phone, role)}</p>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-slate-500">
                  {user.nif || 'Consumidor Final'}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-bold">Histórico</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerManagement;
