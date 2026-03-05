
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Order, Product } from '../types';
import { getMarketInsights } from '../services/geminiService';
import { OracleAnalytics } from '../services/primaveraService';

interface AdminDashboardProps {
  orders: Order[];
  products: Product[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, products }) => {
  const [insights, setInsights] = useState<string>('A carregar análise Primavera...');
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [contributionData, setContributionData] = useState<any[]>([]);

  useEffect(() => {
    setContributionData(OracleAnalytics.getContributionMargin());
    const fetchInsights = async () => {
      setLoadingInsights(true);
      const data = {
        totalRevenue: orders.reduce((acc, o) => acc + o.total, 0),
        erpStatus: "V10.1 Cloud Connected",
        svatCompliance: "100%",
        stockEfficiency: "High"
      };
      const text = await getMarketInsights(data);
      setInsights(text || "Sem análises.");
      setLoadingInsights(false);
    };
    fetchInsights();
  }, [orders]);

  const handleExportCSV = () => {
    const headers = ['Categoria', 'Margem (%)'];
    const rows = contributionData.map(item => [item.category, `${item.margin}%`]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `margem_contribuicao_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    // Simulação de geração de PDF profissional utilizando print capability
    window.print();
  };

  return (
    <div className="space-y-8 print:p-0" id="printable-area">
      <header className="flex justify-between items-center no-print">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Dashboard Executivo</h1>
          <p className="text-slate-500">Oracle Analytics + Primavera ERP Integrado</p>
        </div>
        <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-xl flex items-center gap-4">
           <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>
           </div>
           <div>
              <p className="text-[10px] font-black uppercase opacity-60">Status ERP</p>
              <p className="text-sm font-black">Certificado SVAT 2026</p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico Oracle Analytics */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm print:border-none print:shadow-none">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-lg font-black flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Margem de Contribuição por Categoria
            </h3>
            <div className="flex gap-2 print:hidden">
              <button 
                onClick={handleExportCSV}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-slate-100 flex items-center gap-2 text-[10px] font-black uppercase"
                title="Exportar CSV"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M14 13h2"/><path d="M14 17h2"/></svg>
                CSV
              </button>
              <button 
                onClick={handleExportPDF}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all border border-slate-100 flex items-center gap-2 text-[10px] font-black uppercase"
                title="Exportar PDF / Imprimir"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><polyline points="6 9 6 2 18 2 18 9"/><rect x="6" y="14" width="12" height="8"/></svg>
                PDF
              </button>
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contributionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="margin" fill="#0ea5e9" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Section */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl flex flex-col print:bg-white print:text-slate-900 print:border print:border-slate-200">
          <h3 className="text-xl font-black mb-4 text-blue-400 print:text-blue-600">Consultoria Smart AI</h3>
          <div className="flex-1 overflow-y-auto text-xs leading-relaxed text-slate-300 print:text-slate-700">
             {loadingInsights ? "Analisando dados fiscais..." : insights}
          </div>
          <button 
            onClick={handleExportPDF}
            className="mt-8 bg-white text-slate-900 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-400 hover:text-white transition-all print:hidden shadow-lg"
          >
            Relatório de Gestão (PDF Completo)
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
