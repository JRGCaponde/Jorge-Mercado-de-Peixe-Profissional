
import React from 'react';
import { Product, CartItem } from '../types';

interface CatalogViewProps {
  products: Product[];
  cart: CartItem[];
  addToCart: (p: Product) => void;
}

const CatalogView: React.FC<CatalogViewProps> = ({ products, addToCart, cart }) => {
  return (
    <div className="space-y-10">
      <section className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl no-print">
        <img src="https://picsum.photos/seed/ocean/1200/400" className="absolute inset-0 w-full h-full object-cover" alt="Banner" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent flex flex-col justify-center p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Captura Fresca do Dia</h1>
          <p className="text-blue-200 text-lg max-w-md">Peixe sustentável e de origem ética entregue directamente à sua porta em Luanda.</p>
        </div>
      </section>

      <div className="flex justify-between items-center no-print">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Catálogo de Produtos</h2>
        <button 
          onClick={() => window.print()}
          className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
          Imprimir Catálogo
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" id="printable-area">
        {products.map(product => {
          const inCart = cart.find(c => c.id === product.id);
          return (
            <div key={product.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-300 flex flex-col">
              <div className="relative overflow-hidden h-56">
                <img 
                  src={product.image} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  alt={product.name} 
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-900">
                    {product.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-800">{product.name}</h3>
                  <span className="text-blue-600 font-black">{product.price.toLocaleString()} Kz</span>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 mb-6">{product.description}</p>
                
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
                  <span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {product.stock > 0 ? `● Em Stock (${product.stock} ${product.pricingType})` : '● Esgotado'}
                  </span>
                  <button 
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {inCart ? `No Carrinho (${inCart.quantity})` : 'Adicionar'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CatalogView;
