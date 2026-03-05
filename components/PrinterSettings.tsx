
import React, { useState } from 'react';

const PrinterSettings: React.FC = () => {
  const [printers, setPrinters] = useState([
    { id: 1, name: 'Impressora de Talões (Caixa)', type: 'Térmica', connection: 'USB', status: 'Online' },
    { id: 2, name: 'Impressora de Etiquetas', type: 'Etiquetas', connection: 'Bluetooth', status: 'Offline' },
    { id: 3, name: 'Escritório (Facturas A4)', type: 'Laser', connection: 'LAN', status: 'Online' },
  ]);

  const [testMode, setTestMode] = useState(false);

  const handleTest = () => {
    setTestMode(true);
    setTimeout(() => setTestMode(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Periféricos e Impressão</h1>
        <p className="text-slate-500">Configure a sua rede de hardware de facturação</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-lg">Impressoras Configuradas</h2>
          <button className="text-blue-600 font-bold text-sm">+ Adicionar</button>
        </div>
        
        <div className="divide-y divide-slate-50">
          {printers.map(p => (
            <div key={p.id} className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 rounded-xl text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{p.name}</h4>
                  <div className="flex gap-2 items-center text-[10px] font-black uppercase tracking-widest mt-1">
                    <span className="text-slate-400">{p.type}</span>
                    <span className="text-slate-200">|</span>
                    <span className="text-blue-500">{p.connection}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${p.status === 'Online' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                  <span className="text-xs font-bold text-slate-600">{p.status}</span>
                </div>
                <button 
                  onClick={handleTest}
                  disabled={testMode}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  {testMode ? 'A imprimir...' : 'Teste'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-4">
          <h3 className="text-xl font-bold">Configuração Rápida Balança</h3>
          <p className="text-sm text-slate-400">Sincronize o terminal de vendas com a balança electrónica via RS-232 ou Ethernet.</p>
          <div className="pt-4">
             <button className="bg-blue-600 px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest">Detectar Periférico</button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-4">
          <h3 className="text-xl font-bold text-slate-800">Modelo de Factura</h3>
          <p className="text-sm text-slate-500">Seleccione o modelo padrão certificado para impressão térmica (80mm).</p>
          <select className="w-full bg-slate-50 border border-slate-100 p-2 rounded-lg text-sm outline-none">
            <option>AGT - Termo 80mm (Padrão)</option>
            <option>AGT - Termo 58mm</option>
            <option>Relatório Interno - Compacto</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PrinterSettings;
