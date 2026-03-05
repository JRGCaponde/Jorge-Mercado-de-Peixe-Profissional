
import React, { useState } from 'react';
import { CashFlowEntry, UserRole, UserProfile, CashFlowCategory, CashFlowAccount, Order } from '../types';
import { ICONS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart as RePieChart, Pie } from 'recharts';

interface CashFlowViewProps {
  entries: CashFlowEntry[];
  categories: CashFlowCategory[];
  accounts: CashFlowAccount[];
  orders: Order[];
  user: UserProfile | null;
  onAddEntry: (entry: Omit<CashFlowEntry, 'id' | 'date'>) => void;
  onAddCategory: (category: Omit<CashFlowCategory, 'id'>) => void;
  onAddAccount: (account: Omit<CashFlowAccount, 'id'>) => void;
}

const CashFlowView: React.FC<CashFlowViewProps> = ({ 
  entries, 
  categories, 
  accounts, 
  orders,
  user, 
  onAddEntry,
  onAddCategory,
  onAddAccount
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'entries' | 'categories' | 'accounts' | 'reports'>('dashboard');
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [showMonthlyMap, setShowMonthlyMap] = useState(false);
  const [showChannelReport, setShowChannelReport] = useState(false);

  const [entryForm, setEntryForm] = useState({
    type: 'expense' as CashFlowEntry['type'],
    category: '',
    description: '',
    amount: 0,
    paymentMethod: 'cash' as CashFlowEntry['paymentMethod'],
    accountId: ''
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    type: 'expense' as CashFlowCategory['type'],
    color: 'blue'
  });

  const [accountForm, setAccountForm] = useState({
    name: '',
    type: 'cash' as CashFlowAccount['type'],
    balance: 0,
    bankName: '',
    accountNumber: ''
  });

  const totalIncome = entries
    .filter(e => e.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  const totalExpense = entries
    .filter(e => e.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  const balance = totalIncome - totalExpense;

  const handleEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEntry(entryForm);
    setIsAddingEntry(false);
    setEntryForm({
      type: 'expense',
      category: '',
      description: '',
      amount: 0,
      paymentMethod: 'cash',
      accountId: ''
    });
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCategory(categoryForm);
    setIsAddingCategory(false);
    setCategoryForm({ name: '', type: 'expense', color: 'blue' });
  };

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAccount(accountForm);
    setIsAddingAccount(false);
    setAccountForm({ name: '', type: 'cash', balance: 0, bankName: '', accountNumber: '' });
  };

  const openAddEntryModal = (type: CashFlowEntry['type']) => {
    setEntryForm({ ...entryForm, type });
    setIsAddingEntry(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Fluxo de Caixa</h2>
          <p className="text-slate-500 text-sm">Gestão financeira integrada Fish Market Pro.</p>
        </div>
        {user?.role === UserRole.ADMIN && (
          <div className="flex gap-2 w-full md:w-auto">
            {activeTab === 'categories' ? (
              <button 
                onClick={() => setIsAddingCategory(true)}
                className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100 text-sm"
              >
                <ICONS.PieChart />
                Nova Categoria
              </button>
            ) : activeTab === 'accounts' ? (
              <button 
                onClick={() => setIsAddingAccount(true)}
                className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100 text-sm"
              >
                <ICONS.CreditCard />
                Nova Conta
              </button>
            ) : (
              <>
                <button 
                  onClick={() => openAddEntryModal('income')}
                  className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-100 text-sm"
                >
                  <ICONS.TrendingUp />
                  Nova Entrada
                </button>
                <button 
                  onClick={() => openAddEntryModal('expense')}
                  className="flex-1 md:flex-none bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-100 text-sm"
                >
                  <ICONS.TrendingDown />
                  Nova Saída
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Sub-Navegação Financeira */}
      <div className="flex overflow-x-auto gap-2 p-1 bg-slate-100 rounded-2xl no-scrollbar">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: ICONS.Layout },
          { id: 'entries', label: 'Movimentações', icon: ICONS.Search },
          { id: 'categories', label: 'Categorias', icon: ICONS.PieChart },
          { id: 'accounts', label: 'Contas', icon: ICONS.CreditCard },
          { id: 'reports', label: 'Relatórios', icon: ICONS.FileText },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs uppercase whitespace-nowrap transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <tab.icon />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Resumo Financeiro */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <ICONS.TrendingUp />
                </div>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Receitas</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Entradas</p>
              <p className="text-3xl font-black text-emerald-600">{totalIncome.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                  <ICONS.TrendingDown />
                </div>
                <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full uppercase">Despesas</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Saídas</p>
              <p className="text-3xl font-black text-rose-600">{totalExpense.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-3xl shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-800 rounded-lg text-white">
                  <ICONS.Dollar />
                </div>
                <span className="text-[10px] font-black text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full uppercase">Disponível</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Saldo em Caixa</p>
              <p className={`text-3xl font-black ${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {balance.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="font-black text-slate-900 uppercase text-sm mb-6">Distribuição por Categoria</h3>
              <div className="space-y-4">
                {categories.map(cat => {
                  const catTotal = entries.filter(e => e.category === cat.name).reduce((acc, curr) => acc + curr.amount, 0);
                  const percentage = (catTotal / (totalIncome + totalExpense)) * 100;
                  if (catTotal === 0) return null;
                  return (
                    <div key={cat.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold uppercase">
                        <span>{cat.name}</span>
                        <span>{catTotal.toLocaleString('pt-AO')} AOA</span>
                      </div>
                      <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${cat.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="font-black text-slate-900 uppercase text-sm mb-6">Saldos por Conta</h3>
              <div className="space-y-4">
                {accounts.map(acc => (
                  <div key={acc.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase">{acc.name}</p>
                      <p className="text-[10px] text-slate-500 uppercase">{acc.type === 'cash' ? 'Caixa Físico' : acc.bankName}</p>
                    </div>
                    <p className="font-black text-slate-900">{acc.balance.toLocaleString('pt-AO')} AOA</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'entries' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-black text-slate-900 uppercase text-sm">Histórico de Movimentações</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Data</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Tipo</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Categoria</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Descrição</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">Nenhuma movimentação registada.</td>
                  </tr>
                ) : (
                  entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(entry => (
                    <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-xs text-slate-500">{new Date(entry.date).toLocaleDateString('pt-AO')}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase border ${
                          entry.type === 'income' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                          {entry.type === 'income' ? 'Entrada' : 'Saída'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-700">{entry.category}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{entry.description}</td>
                      <td className={`px-6 py-4 text-xs font-black text-right ${
                        entry.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {entry.type === 'income' ? '+' : '-'} {entry.amount.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-300">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
              <div>
                <h4 className="font-black text-slate-900 uppercase text-sm">{cat.name}</h4>
                <p className={`text-[10px] font-black uppercase ${cat.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {cat.type === 'income' ? 'Entrada' : 'Saída'}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full bg-${cat.color}-500`}></div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'accounts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
          {accounts.map(acc => (
            <div key={acc.id} className="bg-slate-900 p-6 rounded-3xl shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <ICONS.CreditCard />
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{acc.type === 'cash' ? 'Caixa Físico' : 'Conta Bancária'}</p>
                    <h4 className="text-xl font-black uppercase">{acc.name}</h4>
                  </div>
                  {acc.bankName && <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase">{acc.bankName}</span>}
                </div>
                {acc.accountNumber && (
                  <p className="text-xs font-mono text-slate-400 mb-4 tracking-wider">{acc.accountNumber}</p>
                )}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Saldo Disponível</p>
                  <p className="text-2xl font-black text-emerald-400">{acc.balance.toLocaleString('pt-AO')} AOA</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm animate-in fade-in duration-300">
          <h3 className="font-black text-slate-900 uppercase text-sm mb-6">Gerador de Relatórios Financeiros</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => setShowMonthlyMap(true)}
              className="p-6 border-2 border-slate-50 rounded-2xl hover:border-blue-100 hover:bg-blue-50 transition-all text-left group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <ICONS.FileText />
              </div>
              <h4 className="font-black text-slate-900 uppercase text-xs mb-1">Mapa de Exploração Mensal</h4>
              <p className="text-[10px] text-slate-500">Resumo completo de receitas e despesas do mês corrente.</p>
            </button>
            <button 
              onClick={() => setShowChannelReport(true)}
              className="p-6 border-2 border-slate-50 rounded-2xl hover:border-emerald-100 hover:bg-emerald-50 transition-all text-left group"
            >
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                <ICONS.TrendingUp />
              </div>
              <h4 className="font-black text-slate-900 uppercase text-xs mb-1">Relatório de Vendas por Canal</h4>
              <p className="text-[10px] text-slate-500">Comparativo entre vendas POS e Encomendas Online.</p>
            </button>
          </div>
        </div>
      )}

      {/* Modais de Criação */}
      {isAddingEntry && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-lg uppercase text-slate-900">Registar Movimentação</h3>
              <button onClick={() => setIsAddingEntry(false)} className="text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleEntrySubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Tipo</label>
                  <select 
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={entryForm.type}
                    onChange={e => setEntryForm({...entryForm, type: e.target.value as any})}
                  >
                    <option value="expense">Saída (Despesa)</option>
                    <option value="income">Entrada (Receita)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Categoria</label>
                  <select 
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={entryForm.category}
                    onChange={e => setEntryForm({...entryForm, category: e.target.value})}
                    required
                  >
                    <option value="">Selecionar...</option>
                    {categories.filter(c => c.type === entryForm.type).map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Valor (AOA)</label>
                  <input 
                    type="number" 
                    required
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={entryForm.amount}
                    onChange={e => setEntryForm({...entryForm, amount: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Conta</label>
                  <select 
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={entryForm.accountId}
                    onChange={e => setEntryForm({...entryForm, accountId: e.target.value})}
                    required
                  >
                    <option value="">Selecionar...</option>
                    {accounts.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase">Método de Pagamento</label>
                <select 
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={entryForm.paymentMethod}
                  onChange={e => setEntryForm({...entryForm, paymentMethod: e.target.value as any})}
                >
                  <option value="cash">Dinheiro</option>
                  <option value="multicaixa">Multicaixa</option>
                  <option value="transfer">Transferência</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase">Descrição</label>
                <textarea 
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none h-20 text-sm"
                  placeholder="Detalhes da movimentação..."
                  value={entryForm.description}
                  onChange={e => setEntryForm({...entryForm, description: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAddingEntry(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
                >
                  Confirmar Registo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddingCategory && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-lg uppercase text-slate-900">Nova Categoria</h3>
              <button onClick={() => setIsAddingCategory(false)} className="text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase">Nome da Categoria</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={categoryForm.name}
                  onChange={e => setCategoryForm({...categoryForm, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase">Tipo</label>
                <select 
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={categoryForm.type}
                  onChange={e => setCategoryForm({...categoryForm, type: e.target.value as any})}
                >
                  <option value="expense">Despesa</option>
                  <option value="income">Receita</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAddingCategory(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
                >
                  Criar Categoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddingAccount && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-lg uppercase text-slate-900">Nova Conta / Caixa</h3>
              <button onClick={() => setIsAddingAccount(false)} className="text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleAccountSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase">Nome da Conta</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Caixa Diário, Conta Empresa..."
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={accountForm.name}
                  onChange={e => setAccountForm({...accountForm, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase">Tipo</label>
                <select 
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={accountForm.type}
                  onChange={e => setAccountForm({...accountForm, type: e.target.value as any})}
                >
                  <option value="cash">Dinheiro (Caixa)</option>
                  <option value="bank">Banco</option>
                </select>
              </div>
              {accountForm.type === 'bank' && (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase">Nome do Banco</label>
                    <input 
                      type="text" 
                      className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      value={accountForm.bankName}
                      onChange={e => setAccountForm({...accountForm, bankName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase">IBAN / Número de Conta</label>
                    <input 
                      type="text" 
                      className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      value={accountForm.accountNumber}
                      onChange={e => setAccountForm({...accountForm, accountNumber: e.target.value})}
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase">Saldo Inicial (AOA)</label>
                <input 
                  type="number" 
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={accountForm.balance}
                  onChange={e => setAccountForm({...accountForm, balance: Number(e.target.value)})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAddingAccount(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all"
                >
                  Criar Conta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modais de Relatórios */}
      {showMonthlyMap && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-200">
            <div className="p-8" id="printable-area">
              <div className="flex justify-between items-center mb-8 no-print">
                <div>
                  <h3 className="font-black text-2xl uppercase text-slate-900">Mapa de Exploração Mensal</h3>
                  <p className="text-slate-500 text-sm">Resumo financeiro do mês corrente</p>
                </div>
                <button onClick={() => setShowMonthlyMap(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Receitas Totais</p>
                <p className="text-2xl font-black text-emerald-700">{totalIncome.toLocaleString('pt-AO')} AOA</p>
              </div>
              <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                <p className="text-[10px] font-black text-rose-600 uppercase mb-1">Despesas Totais</p>
                <p className="text-2xl font-black text-rose-700">{totalExpense.toLocaleString('pt-AO')} AOA</p>
              </div>
              <div className={`${balance >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-amber-50 border-amber-100'} p-6 rounded-2xl border`}>
                <p className={`text-[10px] font-black ${balance >= 0 ? 'text-blue-600' : 'text-amber-600'} uppercase mb-1`}>Resultado Líquido</p>
                <p className={`text-2xl font-black ${balance >= 0 ? 'text-blue-700' : 'text-amber-700'}`}>{balance.toLocaleString('pt-AO')} AOA</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h4 className="font-black text-slate-900 uppercase text-sm border-b pb-2">Detalhamento por Categoria</h4>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categories.map(cat => ({
                      name: cat.name,
                      total: entries.filter(e => e.category === cat.name).reduce((acc, curr) => acc + curr.amount, 0),
                      type: cat.type
                    })).filter(d => d.total > 0)}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: '#f8fafc' }}
                      />
                      <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                        {categories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.type === 'income' ? '#10b981' : '#f43f5e'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-black text-slate-900 uppercase text-sm border-b pb-2">Maiores Despesas</h4>
                <div className="space-y-2">
                  {entries
                    .filter(e => e.type === 'expense')
                    .sort((a, b) => b.amount - a.amount)
                    .slice(0, 5)
                    .map(entry => (
                      <div key={entry.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                        <div>
                          <p className="text-xs font-black text-slate-900 uppercase">{entry.category}</p>
                          <p className="text-[10px] text-slate-500">{entry.description}</p>
                        </div>
                        <p className="font-black text-rose-600 text-xs">-{entry.amount.toLocaleString('pt-AO')} AOA</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            </div>

            <div className="mt-8 pt-6 border-t flex justify-end no-print">
              <button 
                onClick={() => window.print()}
                className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
              >
                <ICONS.Printer />
                Imprimir Relatório
              </button>
            </div>
          </div>
        </div>
      )}

      {showChannelReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-200">
            <div className="p-8" id="printable-area">
              <div className="flex justify-between items-center mb-8 no-print">
                <div>
                  <h3 className="font-black text-2xl uppercase text-slate-900">Relatório de Vendas por Canal</h3>
                  <p className="text-slate-500 text-sm">Análise comparativa POS vs Online</p>
                </div>
                <button onClick={() => setShowChannelReport(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>

            {(() => {
              const posOrders = orders.filter(o => o.type === 'pos');
              const onlineOrders = orders.filter(o => o.type === 'online');
              
              const posTotal = posOrders.reduce((acc, curr) => acc + curr.total, 0);
              const onlineTotal = onlineOrders.reduce((acc, curr) => acc + curr.total, 0);
              
              const channelData = [
                { name: 'POS (Loja)', value: posTotal, color: '#3b82f6' },
                { name: 'Online', value: onlineTotal, color: '#10b981' }
              ];

              return (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-50 p-6 rounded-3xl flex flex-col items-center justify-center">
                      <h4 className="font-black text-slate-900 uppercase text-xs mb-6">Volume de Vendas por Canal</h4>
                      <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <RePieChart>
                            <Pie
                              data={channelData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {channelData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </RePieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex gap-6 mt-4">
                        {channelData.map(d => (
                          <div key={d.name} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                            <span className="text-[10px] font-black uppercase text-slate-600">{d.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-black text-slate-900 uppercase text-sm border-b pb-2">Métricas de Performance</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                          <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Total POS</p>
                          <p className="text-lg font-black text-blue-700">{posTotal.toLocaleString('pt-AO')} AOA</p>
                          <p className="text-[10px] text-blue-500 mt-1">{posOrders.length} Encomendas</p>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                          <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Total Online</p>
                          <p className="text-lg font-black text-emerald-700">{onlineTotal.toLocaleString('pt-AO')} AOA</p>
                          <p className="text-[10px] text-emerald-500 mt-1">{onlineOrders.length} Encomendas</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                          <p className="text-[10px] font-black text-slate-600 uppercase mb-1">Ticket Médio POS</p>
                          <p className="text-lg font-black text-slate-700">
                            {posOrders.length > 0 ? (posTotal / posOrders.length).toLocaleString('pt-AO') : 0} AOA
                          </p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                          <p className="text-[10px] font-black text-slate-600 uppercase mb-1">Ticket Médio Online</p>
                          <p className="text-lg font-black text-slate-700">
                            {onlineOrders.length > 0 ? (onlineTotal / onlineOrders.length).toLocaleString('pt-AO') : 0} AOA
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-100">
                      <h4 className="font-black text-slate-900 uppercase text-xs">Últimas Vendas por Canal</h4>
                    </div>
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/50">
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase">ID</th>
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase">Canal</th>
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase">Cliente</th>
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {orders.slice(0, 5).map(order => (
                          <tr key={order.id} className="text-xs">
                            <td className="px-6 py-3 font-bold text-slate-900">{order.id}</td>
                            <td className="px-6 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                order.type === 'pos' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                              }`}>
                                {order.type === 'pos' ? 'Loja' : 'Online'}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-slate-500">{order.customerName}</td>
                            <td className="px-6 py-3 text-right font-black text-slate-900">{order.total.toLocaleString('pt-AO')} AOA</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

            </div>

            <div className="mt-8 pt-6 border-t flex justify-end no-print">
              <button 
                onClick={() => window.print()}
                className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
              >
                <ICONS.Printer />
                Imprimir Relatório
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashFlowView;
