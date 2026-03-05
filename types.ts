
export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  CUSTOMER = 'customer'
}

export type PricingType = 'kg' | 'unit';

export interface BatchInfo {
  id: string;
  expiryDate: string;
  stockQuantity: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  pricingType: PricingType;
  stock: number;
  image: string;
  description: string;
  batches?: BatchInfo[]; // Rastreabilidade Logística Primavera
  costCenter?: string; // Contabilidade Analítica
}

export interface CartItem extends Product {
  quantity: number;
  selectedBatchId?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  password?: string; // Adicionado para autenticação
  phone: string;
  role: UserRole;
  nif?: string;
  address?: string;
  creditLimit?: number; // Financeiro ECHO
  currentDebt?: number;
  permissions?: string[]; // Gestão de acessos granular
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: CartItem[];
  total: number;
  tax: number;
  status: 'pending' | 'received' | 'processing' | 'ready' | 'delivered';
  type: 'pos' | 'online';
  createdAt: string;
  invoiceId?: string;
  syncStatus?: 'synced' | 'pending' | 'error'; // Sync Engine ERP
  mrpTriggered?: boolean; // Integração Manufatura
}

export interface Invoice {
  id: string;
  orderId: string;
  sequence: string;
  nif: string;
  hash: string;
  taxStamp: string;
  createdAt: string;
  svatValid: boolean; // Validação SVAT 2026
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'iot';
  isRead: boolean;
  createdAt: string;
}

export interface Reservation {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  type: 'table' | 'product';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  items?: CartItem[];
  createdAt: string;
}

export interface CashFlowEntry {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
  paymentMethod: 'cash' | 'multicaixa' | 'transfer';
  accountId?: string;
  referenceId?: string;
}

export interface CashFlowCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
}

export interface CashFlowAccount {
  id: string;
  name: string;
  type: 'cash' | 'bank';
  balance: number;
  bankName?: string;
  accountNumber?: string;
}

export interface AppState {
  currentUser: UserProfile | null;
  products: Product[];
  orders: Order[];
  invoices: Invoice[];
  notifications: AppNotification[];
  reservations: Reservation[];
  cashFlow: CashFlowEntry[];
  cashFlowCategories: CashFlowCategory[];
  cashFlowAccounts: CashFlowAccount[];
}
