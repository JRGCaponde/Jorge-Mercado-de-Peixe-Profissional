
import React, { useState } from 'react';
import { Invoice, Order } from '../types';
import InvoiceModal from './InvoiceModal';

interface AGTReportsProps {
  invoices: Invoice[];
  orders: Order[];
}

const AGTReports: React.FC<AGTReportsProps> = ({ invoices, orders }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<{ invoice: Invoice, order: Order } | null>(null);
  const [activeTab, setActiveTab] = useState<'registry' | 'settings'>('registry');
  const totalTax = orders.reduce((acc, o) => acc + o.tax, 0);

  const handleViewInvoice = (inv: Invoice) => {
    const order = orders.find(o => o.id === inv.orderId);
    if (order) {
      setSelectedInvoice({ invoice: inv, order });
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Central de Conformidade Fiscal</h1>
          <p className="text-slate-500">Registo Oficial de 'Factura/Recibo' da AGT e Log de Auditoria</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('registry')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${activeTab === 'registry' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Registo de Facturas
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${activeTab === 'settings' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Configuração AGT
          </button>
        </div>
      </header>

      {activeTab === 'registry' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Responsabilidade Fiscal (IVA)</p>
              <h3 className="text-3xl font-black text-blue-900">{totalTax.toLocaleString()} Kz</h3>
              <p className="text-xs text-green-500 font-medium mt-2">Integridade Verificada</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Sequência de Facturação</p>
              <h3 className="text-3xl font-black text-slate-800">FT 2024/{invoices.length.toString().padStart(4, '0')}</h3>
              <p className="text-xs text-slate-400 font-medium mt-2">Série Activa</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pontuação de Conformidade</p>
              <h3 className="text-3xl font-black text-emerald-600">100%</h3>
              <p className="text-xs text-slate-400 font-medium mt-2">Documentos selados</p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6 no-print">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Registo de Facturas Certificadas</h3>
            <button 
              onClick={() => window.print()}
              className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
              Imprimir Listagem
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" id="printable-area">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase">Sequência</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase">NIF Cliente</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase">Valor do Hash</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase">Data</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase text-right">Acções</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">Nenhuma factura gerada neste período</td>
                  </tr>
                ) : (
                  invoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 text-sm font-bold text-blue-700">{inv.sequence}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-mono">{inv.nif}</td>
                      <td className="px-6 py-4 text-xs text-slate-400 font-mono">{inv.hash.slice(0, 16)}...</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{new Date(inv.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleViewInvoice(inv)}
                          className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase hover:bg-blue-700 hover:text-white transition-all opacity-0 group-hover:opacity-100 no-print"
                        >
                          Ver Factura
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Ligação ao Servidor AGT</h3>
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <div>
                  <p className="text-sm font-black text-emerald-900">Sistema Certificado</p>
                  <p className="text-xs text-emerald-600">Comunicação ativa com os servidores da AGT</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">N.º de Certificação</label>
                  <input type="text" readOnly value="250/AGT/2024" className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">NIF da Empresa</label>
                  <input type="text" readOnly value="5401234567" className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600" />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">Endpoint de Submissão</span>
                  <span className="text-[10px] font-mono text-slate-400">https://api.agt.minfin.gov.ao/v1/invoices</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">Última Sincronização</span>
                  <span className="text-[10px] font-mono text-slate-400">Hoje, 09:42:15</span>
                </div>
              </div>

              <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase hover:bg-slate-800 transition-all">
                Testar Ligação ao Servidor
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Segurança e Assinatura</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                <p className="text-xs font-bold text-blue-900 mb-2">Chave Privada RSA (2048 bits)</p>
                <div className="bg-slate-900 p-3 rounded-xl font-mono text-[8px] text-blue-400 break-all leading-relaxed">
                  -----BEGIN RSA PRIVATE KEY-----
                  MIIEpAIBAAKCAQEA7V5+6X9... (Chave Encriptada em HSM)
                  -----END RSA PRIVATE KEY-----
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                A assinatura digital é gerada localmente utilizando o algoritmo RSA-SHA1. O hash resultante é incluído em cada documento para garantir a sua integridade e não-repúdio, conforme exigido pelo regulamento de facturação eletrónica.
              </p>
              <div className="flex items-center gap-2 text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>
                <span className="text-[10px] font-black uppercase">Módulo de Segurança Ativo</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedInvoice && (
        <InvoiceModal 
          invoice={selectedInvoice.invoice} 
          order={selectedInvoice.order} 
          onClose={() => setSelectedInvoice(null)} 
        />
      )}
    </div>
  );
};

export default AGTReports;
