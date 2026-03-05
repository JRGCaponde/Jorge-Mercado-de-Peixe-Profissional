
import React from 'react';
import { Order, UserRole } from '../types';
import { maskPII } from '../utils/masking';

interface OrderManagementProps {
  orders: Order[];
  updateStatus: (id: string, status: Order['status']) => void;
  role: UserRole;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ orders, updateStatus, role }) => {
  const isCustomer = role === UserRole.CUSTOMER;
  const isStaff = role === UserRole.STAFF;

  // Added 'processing' status to satisfy Record<Order['status'], string>
  const statusLabels: Record<Order['status'], string> = {
    'pending': 'Pendente',
    'received': 'Recebido',
    'processing': 'Processamento',
    'ready': 'Pronto',
    'delivered': 'Entregue'
  };

  // Added 'processing' case to getStatusColor
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'received': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-amber-100 text-amber-700';
      case 'ready': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          {isCustomer ? 'Meus Pedidos' : 'Gestão de Pedidos'}
        </h1>
        <p className="text-slate-500">
          {isCustomer ? 'Acompanhe as suas entregas de peixe fresco' : 'Monitorize e actualize os pedidos activos do mercado'}
        </p>
      </div>

      <div className="grid gap-6">
        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            </div>
            <p className="text-slate-400 font-medium">Nenhum pedido activo encontrado</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
              <div className="p-6 flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">ID do Pedido</p>
                    <h3 className="text-lg font-bold text-slate-800">{order.id}</h3>
                  </div>
                  <div className="flex gap-2 items-center">
                    <button 
                      onClick={() => window.print()}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-slate-100 no-print"
                      title="Imprimir Talão"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                    </button>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                      {statusLabels[order.status]}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-slate-50">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Cliente</p>
                    <p className="text-sm font-bold truncate">
                      {isStaff ? maskPII(order.customerName, role) : order.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total</p>
                    <p className="text-sm font-bold text-blue-700">{order.total.toLocaleString()} Kz</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Canal</p>
                    <p className="text-sm font-bold capitalize">{order.type === 'pos' ? 'Loja Física' : 'Online'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Data</p>
                    <p className="text-sm font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Itens</p>
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] font-medium text-slate-600">
                        {item.quantity}x {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {!isCustomer && (
                <div className="bg-slate-50 p-6 border-t md:border-t-0 md:border-l border-slate-200 flex flex-col gap-2 justify-center w-full md:w-48">
                  <p className="text-[10px] font-black text-slate-400 uppercase text-center mb-2">Actualizar Estado</p>
                  {(['received', 'processing', 'ready', 'delivered'] as Order['status'][]).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(order.id, s)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        order.status === s 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-400'
                      }`}
                    >
                      {statusLabels[s].toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
              
              {isCustomer && order.status === 'ready' && (
                <div className="bg-blue-50 p-6 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-blue-100">
                   <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center animate-bounce mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m7.5 4.27 9 5.15"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/></svg>
                   </div>
                   <p className="text-[10px] font-black text-blue-900 uppercase">Pronto para Levantar</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
