
import React, { useState } from 'react';
import { Reservation, UserRole, UserProfile } from '../types';
import { ICONS } from '../constants';

interface ReservationViewProps {
  reservations: Reservation[];
  user: UserProfile | null;
  onAddReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => void;
  onUpdateStatus: (id: string, status: Reservation['status']) => void;
}

const ReservationView: React.FC<ReservationViewProps> = ({ 
  reservations, 
  user, 
  onAddReservation, 
  onUpdateStatus 
}) => {
  const [isBooking, setIsBooking] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    notes: '',
    phone: user?.phone || '',
    type: 'table' as Reservation['type']
  });

  const isAdminOrStaff = user?.role === UserRole.ADMIN || user?.role === UserRole.STAFF;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    onAddReservation({
      customerId: user.id,
      customerName: user.fullName,
      customerPhone: formData.phone,
      date: formData.date,
      time: formData.time,
      type: formData.type,
      status: 'pending',
      notes: formData.notes
    });

    setIsBooking(false);
    setFormData({ date: '', time: '', notes: '', phone: user.phone || '', type: 'table' });
  };

  const filteredReservations = isAdminOrStaff 
    ? reservations 
    : reservations.filter(r => r.customerId === user?.id);

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'completed': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center no-print">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Reservas Online</h2>
          <p className="text-slate-500 text-sm">Agende a sua visita ou recolha de produtos frescos.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => window.print()}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-3 rounded-xl font-bold flex items-center gap-2 transition-all"
          >
            <ICONS.Printer />
            Imprimir Lista
          </button>
          {!isAdminOrStaff && (
            <button 
              onClick={() => setIsBooking(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-200"
            >
              <ICONS.Calendar />
              Nova Reserva
            </button>
          )}
        </div>
      </div>

      {isBooking && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl animate-in fade-in zoom-in duration-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-lg uppercase">Agendar Visita</h3>
            <button onClick={() => setIsBooking(false)} className="text-slate-400 hover:text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black text-slate-500 uppercase">Tipo de Reserva</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'table'})}
                  className={`flex-1 p-4 rounded-xl border-2 flex items-center justify-center gap-3 transition-all ${
                    formData.type === 'table' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-400'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3z"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                  <span className="font-bold uppercase text-xs">Mesa / Visita</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'product'})}
                  className={`flex-1 p-4 rounded-xl border-2 flex items-center justify-center gap-3 transition-all ${
                    formData.type === 'product' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-400'
                  }`}
                >
                  <ICONS.Cart />
                  <span className="font-bold uppercase text-xs">Produtos Especiais</span>
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase">Data</label>
              <input 
                type="date" 
                required
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase">Hora</label>
              <input 
                type="time" 
                required
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.time}
                onChange={e => setFormData({...formData, time: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase">Telefone de Contacto</label>
              <input 
                type="tel" 
                required
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black text-slate-500 uppercase">Notas Adicionais</label>
              <textarea 
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none h-24"
                placeholder="Ex: Gostaria de reservar 2kg de garoupa fresca..."
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setIsBooking(false)}
                className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
              >
                Confirmar Agendamento
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4" id="printable-area">
        {filteredReservations.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <ICONS.Calendar />
            </div>
            <h3 className="font-black text-slate-400 uppercase">Sem reservas encontradas</h3>
            <p className="text-slate-400 text-sm mt-1">As suas marcações aparecerão aqui.</p>
          </div>
        ) : (
          filteredReservations.map(res => (
            <div key={res.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex flex-col items-center justify-center text-blue-600">
                  <span className="text-[10px] font-black uppercase leading-none">{new Date(res.date).toLocaleDateString('pt-PT', { month: 'short' })}</span>
                  <span className="text-lg font-black leading-none">{new Date(res.date).getDate()}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-slate-100 rounded text-slate-500">
                      <ICONS.User />
                    </div>
                    <h4 className="font-black text-slate-900 uppercase">{res.customerName}</h4>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase ${getStatusColor(res.status)}`}>
                      {res.status}
                    </span>
                    <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full uppercase border border-blue-100">
                      {res.type === 'table' ? 'Mesa' : 'Produtos'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> {res.time}</span>
                    <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> {res.customerPhone}</span>
                  </p>
                  {res.notes && <p className="text-[11px] text-slate-400 mt-2 italic">"{res.notes}"</p>}
                </div>
              </div>

              {isAdminOrStaff && res.status === 'pending' && (
                <div className="flex gap-2 w-full md:w-auto">
                  <button 
                    onClick={() => onUpdateStatus(res.id, 'confirmed')}
                    className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    Confirmar
                  </button>
                  <button 
                    onClick={() => onUpdateStatus(res.id, 'cancelled')}
                    className="flex-1 md:flex-none bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    Recusar
                  </button>
                </div>
              )}

              {isAdminOrStaff && res.status === 'confirmed' && (
                <button 
                  onClick={() => onUpdateStatus(res.id, 'completed')}
                  className="w-full md:w-auto bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  Marcar como Concluída
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReservationView;
