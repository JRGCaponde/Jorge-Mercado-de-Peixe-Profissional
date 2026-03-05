
import React, { useState } from 'react';
import { CartItem } from '../types';

interface OrderTrackingProps {
  cart: CartItem[];
  createOrder: (nif?: string) => void;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ cart, createOrder }) => {
  const [step, setStep] = useState(1);
  const [nif, setNif] = useState('');
  const [address, setAddress] = useState('');

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = total * 0.14;

  if (cart.length === 0 && step === 1) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        <p className="text-lg font-bold">O seu carrinho está vazio</p>
        <p className="text-sm mt-2">Visite o catálogo e escolha o melhor peixe!</p>
      </div>
    );
  }

  const steps = ['Carrinho', 'Entrega', 'Pagamento'];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between mb-12">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-1 relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-200 text-slate-500'}`}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className={`text-[10px] uppercase font-black tracking-widest ${step === i + 1 ? 'text-blue-900' : 'text-slate-400'}`}>{s}</span>
            {i < 2 && <div className={`absolute top-5 left-1/2 w-full h-0.5 ${step > i + 1 ? 'bg-green-500' : 'bg-slate-200'}`}></div>}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-2xl font-bold mb-6">Rever o seu Cesto</h2>
          <div className="space-y-4 mb-8">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center py-4 border-b border-slate-50">
                <div className="flex gap-4 items-center">
                  <img src={item.image} className="w-16 h-16 rounded-xl object-cover" alt="" />
                  <div>
                    <h4 className="font-bold">{item.name}</h4>
                    <p className="text-xs text-slate-500">{item.quantity} x {item.price.toLocaleString()} Kz</p>
                  </div>
                </div>
                <p className="font-black">{(item.quantity * item.price).toLocaleString()} Kz</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-4">
            <button onClick={() => setStep(2)} className="bg-blue-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-all">Próximo: Entrega</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-2xl font-bold">Local de Entrega</h2>
          <div className="relative h-64 bg-slate-100 rounded-2xl overflow-hidden group">
            <img src="https://picsum.photos/seed/map/800/300" className="w-full h-full object-cover opacity-50" alt="Mapa" />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-2xl border-4 border-white animate-bounce">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
               </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-white p-3 rounded-lg shadow-lg text-xs font-medium text-slate-600">
               Clique para fixar a localização exacta. Precisão GPS: ±5m
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Morada Detalhada (Edifício/Andar/Porta)</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="ex: Edifício Mutu-ya-Kevela, 3º Andar"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="text-slate-400 font-bold">Voltar</button>
            <button onClick={() => setStep(3)} className="bg-blue-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-all">Próximo: Pagamento</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-2xl font-bold">Finalizar Pedido</h2>
          <div className="bg-slate-50 p-6 rounded-2xl space-y-3">
             <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>{total.toLocaleString()} Kz</span>
             </div>
             <div className="flex justify-between text-slate-500">
                <span>IVA (14%)</span>
                <span>{tax.toLocaleString()} Kz</span>
             </div>
             <div className="flex justify-between text-xl font-black text-blue-900 border-t border-slate-200 pt-3">
                <span>Total Geral</span>
                <span>{(total + tax).toLocaleString()} Kz</span>
             </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">NIF para Factura</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="Número de Identificação Fiscal"
                value={nif}
                onChange={(e) => setNif(e.target.value)}
              />
            </div>
            <p className="text-[10px] text-slate-400 flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>
               Ao efectuar o pedido, concorda em receber uma factura digital certificada pela AGT.
            </p>
            <button 
              onClick={() => createOrder(nif)}
              className="w-full bg-blue-700 text-white py-4 rounded-xl text-lg font-black hover:bg-blue-800 transition-all shadow-2xl shadow-blue-200"
            >
              CONFIRMAR PEDIDO E PAGAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
