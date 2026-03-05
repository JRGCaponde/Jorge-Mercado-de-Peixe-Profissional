
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Invoice, Order } from '../types';
import { generateAGTQRCodeString } from '../services/agtService';

interface InvoiceModalProps {
  invoice: Invoice;
  order: Order;
  onClose: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ invoice, order, onClose }) => {
  // Mock Issuer Data (In a real app, this comes from settings)
  const issuerData = {
    name: 'PEIXE PRO - COMÉRCIO DE PESCADO, LDA',
    nif: '5401234567',
    address: 'Av. Revolução de Outubro, Luanda, Angola',
    phone: '+244 923 000 111',
    certificationNumber: '250/AGT/2024'
  };

  const qrCodeString = generateAGTQRCodeString({
    issuerNif: issuerData.nif,
    customerNif: invoice.nif,
    invoiceType: 'FT',
    invoiceStatus: 'N',
    date: new Date(invoice.createdAt).toISOString().split('T')[0],
    invoiceNumber: invoice.sequence,
    hash: invoice.hash.substring(0, 4),
    certificationNumber: issuerData.certificationNumber,
    totalIva: order.tax,
    totalGross: order.total,
    totalNet: order.total - order.tax
  });

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in duration-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">Factura Eletrónica</h2>
            <p className="text-slate-400 text-xs">Documento Certificado pela AGT</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Invoice Content */}
        <div className="p-8 space-y-8" id="printable-area">
          {/* Top Info */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-black text-slate-900">{issuerData.name}</h3>
              <p className="text-xs text-slate-500">{issuerData.address}</p>
              <p className="text-xs text-slate-500">NIF: {issuerData.nif}</p>
              <p className="text-xs text-slate-500">Tel: {issuerData.phone}</p>
            </div>
            <div className="text-right space-y-1">
              <div className="bg-slate-100 px-3 py-1 rounded-lg inline-block">
                <p className="text-[10px] font-black text-slate-400 uppercase">Número do Documento</p>
                <p className="font-black text-slate-900">{invoice.sequence}</p>
              </div>
              <p className="text-xs text-slate-500">Data: {new Date(invoice.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase mb-2">Dados do Cliente</h4>
            <p className="font-bold text-slate-900">{order.customerName}</p>
            <p className="text-xs text-slate-500 font-mono">NIF: {invoice.nif}</p>
          </div>

          {/* Items Table */}
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-3 text-[10px] font-black text-slate-400 uppercase">Descrição</th>
                <th className="py-3 text-[10px] font-black text-slate-400 uppercase text-center">Qtd</th>
                <th className="py-3 text-[10px] font-black text-slate-400 uppercase text-right">Preço</th>
                <th className="py-3 text-[10px] font-black text-slate-400 uppercase text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {order.items.map((item, idx) => (
                <tr key={idx} className="text-xs">
                  <td className="py-3 font-bold text-slate-700">{item.name}</td>
                  <td className="py-3 text-center text-slate-500">{item.quantity} {item.pricingType}</td>
                  <td className="py-3 text-right text-slate-500">{item.price.toLocaleString()} Kz</td>
                  <td className="py-3 text-right font-bold text-slate-900">{(item.quantity * item.price).toLocaleString()} Kz</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals & QR Code */}
          <div className="flex justify-between items-end border-t border-slate-100 pt-8">
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 bg-white border border-slate-100 rounded-xl shadow-sm">
                <QRCodeSVG value={qrCodeString} size={100} level="M" />
              </div>
              <p className="text-[8px] font-mono text-slate-400 text-center max-w-[120px] break-all">
                {invoice.hash.substring(0, 4)}-Processado por programa certificado n.º {issuerData.certificationNumber}
              </p>
            </div>

            <div className="w-64 space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Total Líquido</span>
                <span>{(order.total - order.tax).toLocaleString()} Kz</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>IVA (14%)</span>
                <span>{order.tax.toLocaleString()} Kz</span>
              </div>
              <div className="flex justify-between text-lg font-black text-slate-900 border-t border-slate-100 pt-2">
                <span>Total Geral</span>
                <span>{order.total.toLocaleString()} Kz</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl text-[10px] text-slate-400 leading-relaxed">
            <p className="font-bold mb-1">Observações:</p>
            <p>Os bens/serviços foram colocados à disposição do adquirente na data e local do documento. Este documento serve de factura e recibo após boa cobrança.</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 text-slate-500 font-bold hover:text-slate-700 transition-colors"
          >
            Fechar
          </button>
          <button 
            onClick={() => window.print()}
            className="bg-blue-700 text-white px-8 py-2 rounded-xl font-black hover:bg-blue-800 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
            Imprimir Factura
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
