import React, { useState, useEffect } from 'react';
import {
  Bike,
  Phone,
  MessageCircle,
  MapPin,
  CheckCircle2,
  Clock,
  RefreshCw,
  Navigation,
  DollarSign,
  User,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Order, DeliveryAgent } from '../../types';
import { api } from '../../services/api';

export const RiderPortal: React.FC = () => {
  const [riders, setRiders] = useState<DeliveryAgent[]>([]);
  const [selectedRiderId, setSelectedRiderId] = useState<string>('rider-02'); // Default John Okafor
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRiderData();
  }, [selectedRiderId]);

  const loadRiderData = async () => {
    setLoading(true);
    try {
      const [rRes, oRes] = await Promise.all([
        api.getRiders(),
        api.getOrders({ riderId: selectedRiderId })
      ]);
      setRiders(rRes);
      setActiveOrders(oRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const currentRider = riders.find((r) => r.id === selectedRiderId) || riders[0];

  const handleToggleStatus = async (status: 'AVAILABLE' | 'OFFLINE') => {
    if (!currentRider) return;
    try {
      const updated = await api.updateRider(currentRider.id, { status });
      setRiders(riders.map((r) => (r.id === updated.id ? updated : r)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: any) => {
    try {
      await api.updateOrderStatus(orderId, status);
      loadRiderData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      
      {/* Rider Login/Selector Card */}
      <div className="bg-[#161616] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white uppercase tracking-tight">Delivery Agent App</h1>
              <p className="text-xs text-white/40 font-normal">Sweetfrys Express Logistics</p>
            </div>
          </div>

          <button
            onClick={loadRiderData}
            className="p-2 text-white/40 hover:text-white rounded-lg bg-[#0F0F0F] border border-white/10"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Switch Rider Profile */}
        <div className="space-y-1.5 pt-2">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-white/40">Select Rider Account</label>
          <select
            value={selectedRiderId}
            onChange={(e) => setSelectedRiderId(e.target.value)}
            className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E65100] font-bold uppercase"
          >
            {riders.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} — {r.vehicleType} ({r.vehicleNumber}) [{r.status}]
              </option>
            ))}
          </select>
        </div>

        {currentRider && (
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={currentRider.avatar} alt={currentRider.name} className="w-12 h-12 rounded-2xl object-cover border border-emerald-500/40" />
              <div>
                <h3 className="font-extrabold text-sm text-white uppercase">{currentRider.name}</h3>
                <p className="text-xs text-emerald-400 font-semibold">{currentRider.vehicleNumber}</p>
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="flex items-center gap-1 bg-[#0F0F0F] p-1 rounded-xl border border-white/10">
              <button
                onClick={() => handleToggleStatus('AVAILABLE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all ${
                  currentRider.status === 'AVAILABLE' || currentRider.status === 'ON_DELIVERY'
                    ? 'bg-emerald-600 text-white'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                🟢 Available
              </button>
              <button
                onClick={() => handleToggleStatus('OFFLINE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all ${
                  currentRider.status === 'OFFLINE'
                    ? 'bg-white/10 text-white'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                ⚫ Offline
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Assignment Section */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <Navigation className="w-5 h-5 text-emerald-400" /> Active Deliveries Assigned To You
        </h2>

        {activeOrders.length === 0 ? (
          <div className="p-8 text-center bg-[#161616] border border-white/10 rounded-3xl space-y-2">
            <CheckCircle2 className="w-12 h-12 text-white/20 mx-auto" />
            <h3 className="font-bold text-white text-sm uppercase">No Active Deliveries Right Now</h3>
            <p className="text-xs text-white/40 font-normal">
              Stay 🟢 Available. When the admin assigns a new order, it will appear here instantly!
            </p>
          </div>
        ) : (
          activeOrders.map((ord) => (
            <div
              key={ord.id}
              className="p-6 rounded-3xl bg-[#161616] border border-emerald-800/80 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#E65100] tracking-widest">Order #{ord.orderNumber}</span>
                  <h3 className="text-xl font-extrabold text-white uppercase">{ord.customer.fullName}</h3>
                </div>
                <span className="bg-emerald-950 text-emerald-400 font-extrabold text-xs px-3 py-1 rounded-full border border-emerald-800 uppercase tracking-wider">
                  {ord.status.replace('_', ' ')}
                </span>
              </div>

              {/* Customer Contact & Address */}
              <div className="space-y-3 bg-[#0F0F0F] p-4 rounded-2xl border border-white/10 text-xs text-white/80">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#E65100] flex items-center gap-1 uppercase tracking-wider text-[10px]">
                    <MapPin className="w-4 h-4" /> Destination
                  </span>
                  <span className="font-bold text-white uppercase">{ord.delivery.area}</span>
                </div>
                <div className="font-semibold text-white">{ord.delivery.address}</div>
                {ord.delivery.landmark && <div className="text-white/40">Landmark: {ord.delivery.landmark}</div>}

                <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                  <a
                    href={`tel:${ord.customer.phone}`}
                    className="flex-1 py-2.5 bg-[#E65100] hover:bg-[#FF6D00] text-black font-extrabold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <Phone className="w-4 h-4" /> Call Customer ({ord.customer.phone})
                  </a>
                  <a
                    href={`https://wa.me/234${ord.customer.phone.slice(1)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                </div>
              </div>

              {/* Items & Collect Amount */}
              <div className="p-4 bg-[#0F0F0F] rounded-2xl border border-white/10 space-y-2 text-xs">
                <div className="font-bold text-white/40 uppercase tracking-widest text-[10px]">Package Items</div>
                <div className="text-white font-semibold">
                  {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm font-black text-white">
                  <span className="uppercase text-xs text-white/60">Amount to Collect</span>
                  <span className="text-emerald-400 font-bold">
                    {ord.paymentStatus === 'PAID' ? '✓ Paid Online (0 Collect)' : `₦${ord.total.toLocaleString()} Cash/Transfer`}
                  </span>
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="space-y-2">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-white/40">Update Delivery Progress</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleUpdateOrderStatus(ord.id, 'OUT_FOR_DELIVERY')}
                    className="py-3 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold uppercase tracking-wider text-xs shadow transition-all flex items-center justify-center gap-1.5"
                  >
                    <Bike className="w-4 h-4" /> Mark Out for Delivery
                  </button>
                  <button
                    onClick={() => handleUpdateOrderStatus(ord.id, 'DELIVERED')}
                    className="py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold uppercase tracking-wider text-xs shadow transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark Delivered 🎉
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
