
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { UserRole, UserProfile, Product, Order, Invoice, CartItem, AppNotification } from './types';
import { MOCK_PRODUCTS, ICONS } from './constants';
import { PrimaveraAPI } from './services/primaveraService';
import POSView from './components/POSView';
import CatalogView from './components/CatalogView';
import AdminDashboard from './components/AdminDashboard';
import ProfileView from './components/ProfileView';
import OrderTracking from './components/OrderTracking';
import AGTReports from './components/AGTReports';
import OrderManagement from './components/OrderManagement';
import CustomerManagement from './components/CustomerManagement';
import StaffManagement from './components/StaffManagement';
import PrinterSettings from './components/PrinterSettings';
import ReservationView from './components/ReservationView';
import CashFlowView from './components/CashFlowView';
import InvoiceModal from './components/InvoiceModal';
import Login from './components/Login';
import { Reservation, CashFlowEntry, CashFlowCategory, CashFlowAccount } from './types';

const STOCK_THRESHOLD = 10;

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-101',
      customerId: 'usr-3',
      customerName: 'João Luanda',
      items: [],
      total: 150000,
      tax: 21000,
      status: 'delivered',
      type: 'pos',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ORD-102',
      customerId: 'usr-4',
      customerName: 'Bento Peixe',
      items: [],
      total: 85000,
      tax: 11900,
      status: 'delivered',
      type: 'online',
      createdAt: new Date().toISOString(),
    }
  ]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<{ invoice: Invoice, order: Order } | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: 'RES-1',
      customerId: 'usr-3',
      customerName: 'João Luanda',
      customerPhone: '921999888',
      date: '2026-03-10',
      time: '12:30',
      type: 'table',
      status: 'confirmed',
      notes: 'Mesa para 4 pessoas, perto da janela.',
      createdAt: new Date().toISOString()
    },
    {
      id: 'RES-2',
      customerId: 'usr-4',
      customerName: 'Bento Peixe',
      customerPhone: '931000555',
      date: '2026-03-12',
      time: '15:00',
      type: 'product',
      status: 'pending',
      notes: 'Reserva de 5kg de Lagosta Viva.',
      createdAt: new Date().toISOString()
    }
  ]);
  const [cashFlow, setCashFlow] = useState<CashFlowEntry[]>([
    {
      id: 'CF-1',
      type: 'expense',
      category: 'Fornecedores',
      description: 'Compra de Gelo e Caixas de Isopor',
      amount: 45000,
      date: new Date().toISOString(),
      paymentMethod: 'multicaixa'
    }
  ]);
  const [cashFlowCategories, setCashFlowCategories] = useState<CashFlowCategory[]>([
    { id: 'CAT-1', name: 'Vendas', type: 'income', color: 'emerald' },
    { id: 'CAT-2', name: 'Fornecedores', type: 'expense', color: 'rose' },
    { id: 'CAT-3', name: 'Salários', type: 'expense', color: 'blue' },
    { id: 'CAT-4', name: 'Manutenção', type: 'expense', color: 'amber' }
  ]);
  const [cashFlowAccounts, setCashFlowAccounts] = useState<CashFlowAccount[]>([
    { id: 'ACC-1', name: 'Caixa Principal', type: 'cash', balance: 50000 },
    { id: 'ACC-2', name: 'Conta BFA', type: 'bank', balance: 1250000, bankName: 'BFA', accountNumber: 'AO06.0001.0000.1234.5678.9' }
  ]);

  const [allUsers, setAllUsers] = useState<UserProfile[]>([
    { id: 'usr-admin-jorge', fullName: 'Jorge Amaral', email: 'jorgeamaral2009@Gmail.com', password: 'podescre0', phone: '923000000', role: UserRole.ADMIN, nif: '5401234567' },
    { id: 'usr-1', fullName: 'Artur Gonçalves', email: 'artur@fishmarket.ao', password: '1234', phone: '923000111', role: UserRole.ADMIN, nif: '5401234567' },
    { id: 'usr-2', fullName: 'Maria Silva', email: 'maria.caixa@fishmarket.ao', password: '1234', phone: '924111222', role: UserRole.STAFF },
    { id: 'usr-3', fullName: 'João Luanda', email: 'joao@cliente.com', password: '1234', phone: '921999888', role: UserRole.CUSTOMER, nif: '123456789' },
    { id: 'usr-4', fullName: 'Bento Peixe', email: 'bento@restaurante.ao', password: '1234', phone: '931000555', role: UserRole.CUSTOMER, nif: '987654321' },
  ]);

  const addNotification = (title: string, message: string, type: AppNotification['type']) => {
    const newNotif: AppNotification = {
      id: `NOT-${Date.now()}`,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const addToCart = (product: Product, quantity: number = 1, batchId?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedBatchId === batchId);
      if (existing) {
        return prev.map(item => item.id === product.id && item.selectedBatchId === batchId ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity, selectedBatchId: batchId }];
    });
  };

  const removeFromCart = (productId: string, batchId?: string) => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.selectedBatchId === batchId)));
  };

  const updateCartQuantity = (productId: string, quantity: number, batchId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, batchId);
      return;
    }
    setCart(prev => prev.map(item => 
      (item.id === productId && item.selectedBatchId === batchId) 
        ? { ...item, quantity } 
        : item
    ));
  };

  const handleCheckout = async (nif?: string, customerId?: string, paymentMethod: CashFlowEntry['paymentMethod'] = 'multicaixa', discount: number = 0) => {
    if (cart.length === 0) return;
    
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalAfterDiscount = subtotal - discount;
    const orderTotal = totalAfterDiscount * 1.14;

    // 1. Verificação de Crédito Primavera ECHO
    if (customerId && customerId !== 'guest') {
      const creditCheck = await PrimaveraAPI.checkCreditLimit(customerId, orderTotal);
      if (!creditCheck.approved) {
        alert(`FALHA NA VALIDAÇÃO FINANCEIRA (ECHO): ${creditCheck.reason}`);
        addNotification("Bloqueio de Crédito", `Venda negada para o cliente ID ${customerId}.`, "error");
        return;
      }
    }

    // 2. Criação do Pedido e Lógica ERP
    const orderId = `ERP-PED-${Date.now()}`;
    const invoiceId = `FT-${Date.now()}`;
    
    // Gatilho de Produção (MRP II) se o stock for insuficiente
    let mrpNeeded = false;
    setProducts(prev => {
      return prev.map(p => {
        const cartItems = cart.filter(ci => ci.id === p.id);
        const totalQty = cartItems.reduce((a, b) => a + b.quantity, 0);
        const newStock = p.stock - totalQty;
        
        if (newStock < 0) {
          mrpNeeded = true;
          addNotification("Gatilho MRP II", `Ordem de Fabrico gerada para "${p.name}". Stock insuficiente.`, "iot");
        }
        return { ...p, stock: Math.max(0, newStock) };
      });
    });

    const newOrder: Order = {
      id: orderId,
      customerId: customerId || 'guest',
      customerName: allUsers.find(u => u.id === customerId)?.fullName || 'Consumidor Final',
      items: [...cart],
      total: orderTotal,
      tax: totalAfterDiscount * 0.14,
      status: mrpNeeded ? 'processing' : 'received',
      type: 'pos',
      createdAt: new Date().toISOString(),
      invoiceId,
      syncStatus: 'synced',
      mrpTriggered: mrpNeeded
    };

    const newInvoice: Invoice = {
      id: invoiceId,
      orderId,
      sequence: `FT 2026/${(invoices.length + 1).toString().padStart(4, '0')}`,
      nif: nif || '999999999',
      hash: Math.random().toString(36).substring(7).toUpperCase(),
      taxStamp: 'SVAT-2026-' + Math.random().toString(36).substring(4).toUpperCase(),
      createdAt: new Date().toISOString(),
      svatValid: true
    };

    setOrders([newOrder, ...orders]);
    setInvoices([newInvoice, ...invoices]);
    setSelectedInvoice({ invoice: newInvoice, order: newOrder });
    
    // Registar no Fluxo de Caixa
    const cashEntry: CashFlowEntry = {
      id: `CF-ORD-${Date.now()}`,
      type: 'income',
      category: 'Vendas',
      description: `Venda ${orderId} - ${newOrder.customerName}${discount > 0 ? ' (Desc: ' + discount.toLocaleString() + ' Kz)' : ''}`,
      amount: orderTotal,
      date: new Date().toISOString(),
      paymentMethod,
      referenceId: orderId
    };
    setCashFlow(prev => [cashEntry, ...prev]);

    setCart([]);
    alert(`SINCRONIZAÇÃO COMPLETA: Encomenda ${newOrder.id} lançada no ERP Primavera V10.`);
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleAddReservation = (resData: Omit<Reservation, 'id' | 'createdAt'>) => {
    const newRes: Reservation = {
      ...resData,
      id: `RES-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setReservations(prev => [newRes, ...prev]);
    addNotification("Nova Reserva", `Reserva agendada para ${newRes.customerName} em ${newRes.date}.`, "info");
  };

  const handleUpdateReservationStatus = (id: string, status: Reservation['status']) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    const res = reservations.find(r => r.id === id);
    if (res) {
      addNotification("Reserva Atualizada", `Reserva de ${res.customerName} marcada como ${status}.`, "info");
    }
  };

  const handleAddCashFlow = (entryData: Omit<CashFlowEntry, 'id' | 'date'>) => {
    const newEntry: CashFlowEntry = {
      ...entryData,
      id: `CF-${Date.now()}`,
      date: new Date().toISOString()
    };
    setCashFlow(prev => [newEntry, ...prev]);
    addNotification("Fluxo de Caixa", `Novo registo de ${entryData.type === 'income' ? 'entrada' : 'saída'} efetuado.`, "info");
  };

  const handleAddCashFlowCategory = (category: Omit<CashFlowCategory, 'id'>) => {
    const newCat: CashFlowCategory = { ...category, id: `CAT-${Date.now()}` };
    setCashFlowCategories(prev => [...prev, newCat]);
  };

  const handleAddCashFlowAccount = (account: Omit<CashFlowAccount, 'id'>) => {
    const newAcc: CashFlowAccount = { ...account, id: `ACC-${Date.now()}` };
    setCashFlowAccounts(prev => [...prev, newAcc]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} allUsers={allUsers} />;
  }

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900">
        <Sidebar 
          role={currentUser?.role || UserRole.CUSTOMER} 
          user={currentUser} 
          notifications={notifications}
          onClearNotification={clearNotification}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto pb-20 md:pb-0 main-content">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            <Routes>
              <Route path="/profile" element={<ProfileView user={currentUser} onSave={(u) => setCurrentUser(u)} />} />
              
              {currentUser?.role === UserRole.ADMIN && (
                <>
                  <Route path="/dashboard" element={<AdminDashboard orders={orders} products={products} />} />
                  <Route path="/reports" element={<AGTReports invoices={invoices} orders={orders} />} />
                  <Route path="/staff" element={
                    <StaffManagement 
                      users={allUsers.filter(u => u.role !== UserRole.CUSTOMER)} 
                      onUpdateUser={(updatedUser) => setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u))}
                    />
                  } />
                  <Route path="/printers" element={<PrinterSettings />} />
                </>
              )}

              <Route path="/reservations" element={
                <ReservationView 
                  reservations={reservations} 
                  user={currentUser} 
                  onAddReservation={handleAddReservation}
                  onUpdateStatus={handleUpdateReservationStatus}
                />
              } />

              <Route path="/cashflow" element={
                <CashFlowView 
                  entries={cashFlow} 
                  categories={cashFlowCategories}
                  accounts={cashFlowAccounts}
                  orders={orders}
                  user={currentUser} 
                  onAddEntry={handleAddCashFlow}
                  onAddCategory={handleAddCashFlowCategory}
                  onAddAccount={handleAddCashFlowAccount}
                />
              } />

              {(currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.STAFF) && (
                <>
                  <Route path="/pos" element={
                    <POSView 
                      products={products} 
                      customers={allUsers.filter(u => u.role === UserRole.CUSTOMER)}
                      cart={cart} 
                      addToCart={addToCart} 
                      removeFromCart={removeFromCart}
                      updateCartQuantity={updateCartQuantity}
                      checkout={handleCheckout} 
                      clearCart={() => setCart([])} 
                      role={currentUser.role} 
                    />
                  } />
                  <Route path="/orders" element={<OrderManagement orders={orders} updateStatus={(id, s) => setOrders(prev => prev.map(o => o.id === id ? {...o, status: s} : o))} role={currentUser.role} />} />
                  <Route path="/customers" element={<CustomerManagement users={allUsers.filter(u => u.role === UserRole.CUSTOMER)} role={currentUser.role} />} />
                </>
              )}

              <Route path="*" element={<Navigate to={currentUser?.role === UserRole.ADMIN ? "/dashboard" : "/pos"} replace />} />
            </Routes>
          </div>
        </main>

        {selectedInvoice && (
          <InvoiceModal 
            invoice={selectedInvoice.invoice} 
            order={selectedInvoice.order} 
            onClose={() => setSelectedInvoice(null)} 
          />
        )}
      </div>
    </HashRouter>
  );
};

// Reutilização da Sidebar com notificações IoT
interface SidebarProps {
  role: UserRole;
  user: UserProfile | null;
  notifications: AppNotification[];
  onClearNotification: (id: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, user, notifications, onClearNotification, onLogout }) => {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const navItems = [
    { label: 'Primavera Analytics', path: '/dashboard', roles: [UserRole.ADMIN], icon: ICONS.Layout },
    { label: 'Venda Mobile (ERP)', path: '/pos', roles: [UserRole.ADMIN, UserRole.STAFF], icon: ICONS.Cart },
    { label: 'Logística de Pedidos', path: '/orders', roles: [UserRole.ADMIN, UserRole.STAFF], icon: ICONS.Search },
    { label: 'Gestão de Clientes', path: '/customers', roles: [UserRole.ADMIN, UserRole.STAFF], icon: ICONS.Users },
    { label: 'Gestão de Equipa', path: '/staff', roles: [UserRole.ADMIN], icon: ICONS.Shield },
    { label: 'Reservas Online', path: '/reservations', roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER], icon: ICONS.Calendar },
    { label: 'Fluxo de Caixa', path: '/cashflow', roles: [UserRole.ADMIN], icon: ICONS.Dollar },
    { label: 'Conformidade Fiscal', path: '/reports', roles: [UserRole.ADMIN], icon: ICONS.FileText },
    { label: 'Hardware/Impressão', path: '/printers', roles: [UserRole.ADMIN], icon: ICONS.Printer },
    { label: 'Perfil', path: '/profile', roles: [UserRole.ADMIN, UserRole.STAFF], icon: ICONS.User },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col md:flex-col shadow-2xl z-40 sticky top-0 md:h-screen no-print">
      {/* Mobile Header */}
      <div className="flex md:hidden items-center justify-between p-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center font-black text-xs text-white">P</div>
          <h1 className="text-sm font-black tracking-tight text-white uppercase">Pro Sales 26</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1 hover:bg-slate-800 rounded-full transition-colors relative"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
          <button 
            onClick={onLogout}
            className="p-1 text-rose-400"
          >
            <ICONS.LogOut />
          </button>
        </div>
      </div>

      <div className="p-6 hidden md:block border-b border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-black text-xl text-white">P</div>
          <h1 className="text-xl font-black tracking-tight text-white uppercase">Pro Sales 26</h1>
        </div>
        <div className="flex justify-between items-center">
          <div className="inline-block px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
            <span className="text-[10px] text-blue-400 font-black tracking-widest uppercase">ERP V10 ACTIVE</span>
          </div>
          
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1 hover:bg-slate-800 rounded-full transition-colors relative"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
        </div>
        
        {/* Notificações IoT/ERP Dashboard */}
        {showNotifications && (
          <div className="absolute left-64 top-0 mt-4 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 py-4 z-50 text-slate-900 animate-in fade-in slide-in-from-left-4">
             <div className="px-4 pb-2 border-b flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase">Alertas ERP & IoT</span>
             </div>
             <div className="max-h-96 overflow-y-auto px-4 pt-4 space-y-3">
                {notifications.map(n => (
                  <div key={n.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 relative group">
                    <button onClick={() => onClearNotification(n.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                    <p className="text-xs font-black text-slate-800 flex items-center gap-2">
                       {n.type === 'iot' && <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>}
                       {n.title}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">{n.message}</p>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
      
      <nav className="flex-1 flex md:flex-col p-2 md:p-4 overflow-x-auto md:overflow-y-auto scrollbar-hide space-y-1">
        {navItems.filter(item => item.roles.includes(role)).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              location.pathname === item.path ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <item.icon />
            <span className="font-bold text-sm whitespace-nowrap">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 hidden md:block">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all duration-300 group"
        >
          <ICONS.LogOut />
          <span className="font-bold text-sm">Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );
};

export default App;
