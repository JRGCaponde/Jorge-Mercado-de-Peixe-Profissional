
import React, { useState } from 'react';
import { Product, CartItem, UserRole, UserProfile, CashFlowEntry } from '../types';

interface POSViewProps {
  products: Product[];
  customers: UserProfile[];
  cart: CartItem[];
  addToCart: (p: Product, qty: number, batchId?: string) => void;
  removeFromCart: (productId: string, batchId?: string) => void;
  updateCartQuantity: (productId: string, qty: number, batchId?: string) => void;
  checkout: (nif?: string, customerId?: string, paymentMethod?: CashFlowEntry['paymentMethod'], discount?: number) => void;
  clearCart: () => void;
  role: UserRole;
}

const POSView: React.FC<POSViewProps> = ({ 
  products, 
  customers, 
  cart, 
  addToCart, 
  removeFromCart, 
  updateCartQuantity, 
  checkout, 
  clearCart, 
  role 
}) => {
  const [search, setSearch] = useState('');
  const [customerId, setCustomerId] = useState('guest');
  const [paymentMethod, setPaymentMethod] = useState<CashFlowEntry['paymentMethod']>('multicaixa');
  const [discount, setDiscount] = useState<string>('0');
  const [qtyInput, setQtyInput] = useState<{ [key: string]: string }>({});
  const [batchSelection, setBatchSelection] = useState<{ [key: string]: string }>({});
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountVal = parseFloat(discount) || 0;
  const totalAfterDiscount = Math.max(0, subtotal - discountVal);
  const tax = totalAfterDiscount * 0.14;
  const finalTotal = totalAfterDiscount + tax;

  const validateInput = (p: Product, qtyStr: string, batchId: string) => {
    const qty = parseFloat(qtyStr);
    let error = "";

    if (qtyStr === "") {
      error = ""; 
    } else if (isNaN(qty) || qty <= 0) {
      error = "Introduza uma quantidade válida superior a 0";
    } else {
      if (p.batches && p.batches.length > 0) {
        if (!batchId) {
          error = "Atenção: Seleção de lote obrigatória para este artigo";
        } else {
          const selectedBatch = p.batches.find(b => b.id === batchId);
          if (selectedBatch && qty > selectedBatch.stockQuantity) {
            error = `Stock insuficiente no lote ${batchId} (Máx: ${selectedBatch.stockQuantity})`;
          }
        }
      } else if (qty > p.stock) {
        error = `Stock total insuficiente (Máx: ${p.stock})`;
      }
    }

    setErrorMessages(prev => ({ ...prev, [p.id]: error }));
    return error === "";
  };

  const handleQtyChange = (p: Product, value: string) => {
    setQtyInput(prev => ({ ...prev, [p.id]: value }));
    validateInput(p, value, batchSelection[p.id] || '');
  };

  const handleBatchChange = (p: Product, value: string) => {
    setBatchSelection(prev => ({ ...prev, [p.id]: value }));
    validateInput(p, qtyInput[p.id] || '', value);
  };

  const handleAdd = (p: Product) => {
    const qtyStr = qtyInput[p.id] || '';
    const batchId = batchSelection[p.id];
    
    if (qtyStr === "") {
        setErrorMessages(prev => ({ ...prev, [p.id]: "A quantidade é obrigatória" }));
        return;
    }

    if (validateInput(p, qtyStr, batchId || '')) {
      addToCart(p, parseFloat(qtyStr), batchId);
      setQtyInput(prev => ({ ...prev, [p.id]: '' }));
      setBatchSelection(prev => ({ ...prev, [p.id]: '' }));
      setErrorMessages(prev => ({ ...prev, [p.id]: '' }));
    }
  };

  const getAvailableStockDisplay = (p: Product) => {
    const selectedBatchId = batchSelection[p.id];
    if (p.batches && selectedBatchId) {
      const batch = p.batches.find(b => b.id === selectedBatchId);
      return batch ? batch.stockQuantity : 0;
    }
    return p.stock;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-10rem)]">
      <div className="flex-1 flex flex-col">
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar catálogo Primavera V10..."
              className="w-full pl-10 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute left-3.5 top-4.5 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 overflow-y-auto pr-2 custom-scrollbar">
          {filteredProducts.map(product => {
            const dispStock = getAvailableStockDisplay(product);
            const error = errorMessages[product.id];
            const hasError = !!error;
            const needsBatch = product.batches && product.batches.length > 0;
            const batchError = hasError && error.toLowerCase().includes("lote");
            const qtyError = hasError && !batchError;
            
            // Lógica de desativação do botão baseada nos requisitos
            const canAdd = !hasError && 
                           qtyInput[product.id] && 
                           parseFloat(qtyInput[product.id]) > 0 &&
                           (!needsBatch || batchSelection[product.id]);

            return (
              <div key={product.id} className={`bg-white rounded-2xl border-2 p-5 transition-all flex flex-col relative ${hasError ? 'border-red-500 bg-red-50/10' : 'border-slate-100 hover:border-blue-200 shadow-sm'}`}>
                <div className="relative mb-4">
                  <img src={product.image} className="h-40 w-full object-cover rounded-xl" alt={product.name} />
                  {needsBatch && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
                      Lote Requerido
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-900 leading-tight">{product.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${dispStock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    Disp: {dispStock} {product.pricingType}
                  </span>
                </div>

                <div className="space-y-4 mt-auto">
                  {/* Seleção de Lote com Realce de Erro */}
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Rastreabilidade / Lote</label>
                    <select 
                      className={`w-full text-xs font-bold bg-slate-50 border rounded-lg p-2.5 outline-none transition-all ${batchError ? 'border-red-500 ring-2 ring-red-500/20 text-red-600' : 'border-slate-200 focus:border-blue-500'}`}
                      value={batchSelection[product.id] || ''}
                      onChange={(e) => handleBatchChange(product, e.target.value)}
                    >
                      <option value="">-- Seleccionar Lote --</option>
                      {product.batches?.map(batch => (
                        <option key={batch.id} value={batch.id}>
                          {batch.id} (Disponível: {batch.stockQuantity})
                        </option>
                      ))}
                      {!product.batches && <option value="FIFO">Padrão FIFO</option>}
                    </select>
                  </div>

                  {/* Input de Qtd com Realce de Erro */}
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Qtd. a Vender</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className={`w-full text-sm font-black border rounded-lg px-3 py-2 outline-none transition-all ${qtyError ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50 text-red-600' : 'border-slate-200 focus:border-blue-500'}`}
                        value={qtyInput[product.id] || ''}
                        onChange={(e) => handleQtyChange(product, e.target.value)}
                      />
                    </div>
                    <div className="text-right pb-1">
                       <p className="text-[9px] font-black text-slate-400 uppercase">Preço Unit.</p>
                       <p className="text-blue-700 font-black text-sm">{product.price.toLocaleString()} Kz</p>
                    </div>
                  </div>

                  {/* Mensagem de Erro Proeminente e Detalhada */}
                  {hasError && (
                    <div className="bg-red-600 text-white p-2.5 rounded-xl flex items-start gap-2 animate-in zoom-in-95 duration-200 shadow-lg shadow-red-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                      <span className="text-[10px] font-black leading-tight uppercase tracking-tight">{error}</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleAdd(product)}
                    disabled={!canAdd}
                    className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${!canAdd ? 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200 active:scale-95'}`}
                  >
                    {!canAdd && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    )}
                    {canAdd && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    )}
                    Adicionar ao Cesto
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Painel de Checkout Lateral */}
      <div className="w-full lg:w-96 bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col h-full overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 no-print">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Checkout POS</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => window.print()}
                disabled={cart.length === 0}
                className="text-[10px] font-black text-blue-600 uppercase hover:bg-blue-50 px-3 py-1 rounded-full transition-colors border border-blue-100 disabled:opacity-30"
                title="Imprimir Orçamento"
              >
                Orçamento
              </button>
              <button onClick={clearCart} className="text-[10px] font-black text-red-500 uppercase hover:bg-red-50 px-3 py-1 rounded-full transition-colors border border-red-100">Limpar</button>
            </div>
          </div>
          <p className="text-[10px] text-blue-500 font-bold uppercase mt-1 tracking-widest">Gateway Primavera V10</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar" id="printable-area">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              </div>
              <p className="text-sm font-bold opacity-60 uppercase tracking-tighter">Terminal pronto para venda</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.id}-${item.selectedBatchId}-${idx}`} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 animate-in slide-in-from-right-4 duration-300 group">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{item.name}</h4>
                      <button 
                        onClick={() => removeFromCart(item.id, item.selectedBatchId)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">Lote: {item.selectedBatchId || 'STD'}</span>
                          <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                            <button 
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1, item.selectedBatchId)}
                              className="px-2 py-1 text-slate-400 hover:text-blue-600 transition-colors"
                            >
                              -
                            </button>
                            <span className="px-2 text-[10px] font-black min-w-[30px] text-center border-x border-slate-100">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1, item.selectedBatchId)}
                              className="px-2 py-1 text-slate-400 hover:text-blue-600 transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400">{item.pricingType}</span>
                        </div>
                        <p className="font-black text-sm text-slate-900">{(item.quantity * item.price).toLocaleString()} Kz</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-slate-900 text-white rounded-t-3xl shadow-2xl space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between opacity-60">
              <span className="font-medium">Subtotal</span>
              <span className="font-black">{subtotal.toLocaleString()} Kz</span>
            </div>
            {discountVal > 0 && (
              <div className="flex justify-between text-red-400">
                <span className="font-medium italic">Desconto Comercial</span>
                <span className="font-black">- {discountVal.toLocaleString()} Kz</span>
              </div>
            )}
            <div className="flex justify-between opacity-60">
              <span className="font-medium">IVA Dedutível (14%)</span>
              <span className="font-black">{tax.toLocaleString()} Kz</span>
            </div>
            <div className="flex justify-between text-xl font-black text-blue-400 border-t border-slate-800 pt-4">
              <span className="uppercase tracking-tighter">Total Final</span>
              <span>{finalTotal.toLocaleString()} Kz</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] text-slate-500 font-black uppercase block mb-1 tracking-widest">Entidade (ERP)</label>
                <select 
                  className="w-full bg-slate-800 border-none text-white p-2.5 rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                >
                  <option value="guest">Consumidor Final</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.fullName} ({c.nif || 'S/NIF'})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[9px] text-slate-500 font-black uppercase block mb-1 tracking-widest">Pagamento</label>
                <select 
                  className="w-full bg-slate-800 border-none text-white p-2.5 rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                >
                  <option value="multicaixa">Multicaixa</option>
                  <option value="cash">Numerário</option>
                  <option value="transfer">Transferência</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[9px] text-slate-500 font-black uppercase block mb-1 tracking-widest">Desconto (Kz)</label>
              <input 
                type="number"
                className="w-full bg-slate-800 border-none text-white p-2.5 rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="0.00"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
            
            <button
              disabled={cart.length === 0}
              onClick={() => checkout('', customerId, paymentMethod, discountVal)}
              className="w-full bg-blue-500 text-white font-black py-4 rounded-2xl hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-20 disabled:cursor-not-allowed text-xs uppercase tracking-widest active:scale-95"
            >
              SINCRONIZAR COM PRIMAVERA
            </button>

            <div className="flex justify-center items-center gap-3 py-2">
               <div className="relative flex items-center justify-center">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                 <div className="absolute w-4 h-4 bg-emerald-500/30 rounded-full animate-ping"></div>
               </div>
               <p className="text-[8px] uppercase tracking-widest text-slate-500 font-black">Certificação AGT SVAT-2026 Activa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSView;
