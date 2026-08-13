import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Bike,
  Flame,
  Search,
  RefreshCw,
  Navigation,
  ShieldCheck,
  User
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { api } from '../services/api';

interface OrderTrackingProps {
  orderId?: string;
  onBackToMenu: () => void;
}

const STAGES: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'NEW', label: 'Order Received', desc: 'Received by Lagos Grill online system' },
  { status: 'CONFIRMED', label: 'Order Confirmed', desc: 'Kitchen accepted your order' },
  { status: 'PREPARING', label: 'Food Being Prepared', desc: 'Grilling on hot charcoal' },
  { status: 'READY', label: 'Ready for Pickup', desc: 'Packed in thermal foil bag' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Rider on the way to your door' },
  { status: 'DELIVERED', label: 'Delivered', desc: 'Food handed over safely' },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  NEW: 1,
  CONFIRMED: 2,
  PREPARING: 3,
  READY: 4,
  OUT_FOR_DELIVERY: 5,
  DELIVERED: 6,
  CANCELLED: 0,
};

export const OrderTracking: React.FC<OrderTrackingProps> = ({ orderId, onBackToMenu }) => {
  const [searchId, setSearchId] = useState(orderId || 'ord-1024');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Rider animated map progress
  const [riderProgress, setRiderProgress] = useState(0.45); // 0 to 1

  const fetchOrder = async (targetId: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getOrderById(targetId);
      setOrder(res);
    } catch (e: any) {
      setError("Order not found. Try searching e.g. 'SHW-1024' or 'ord-1024'");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchId) {
      fetchOrder(searchId);
    }
  }, [searchId]);

  // Simulate rider movement if out for delivery
  useEffect(() => {
    if (order?.status === 'OUT_FOR_DELIVERY') {
      const interval = setInterval(() => {
        setRiderProgress((prev) => (prev >= 0.95 ? 0.95 : prev + 0.05));
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [order?.status]);

  const currentStepNum = order ? STATUS_ORDER[order.status] || 1 : 1;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Search Header */}
      <div className="bg-[#161616] border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
            <Navigation className="w-6 h-6 text-[#E65100]" /> Real-Time Order Tracker
          </h1>
          <p className="text-xs text-white/40 mt-0.5 font-normal">
            Track your order live from charcoal grill to your doorstep.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Order # (e.g. SHW-1024)"
              className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#E65100]"
            />
          </div>
          <button
            onClick={() => fetchOrder(searchId)}
            className="px-4 py-2.5 bg-[#E65100] hover:bg-[#FF6D00] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shrink-0 flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Track
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-2xl text-center">
          {error}
        </div>
      )}

      {order && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Timeline & Order Details */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Status Banner */}
            <div className="p-6 rounded-3xl bg-[#161616] border border-white/10 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#E65100] tracking-widest">
                    Order #{order.orderNumber}
                  </span>
                  <h2 className="text-2xl font-extrabold text-white mt-1 uppercase">
                    {order.status === 'DELIVERED' ? (
                      <span className="text-emerald-400">Order Delivered 🎉</span>
                    ) : order.status === 'OUT_FOR_DELIVERY' ? (
                      <span className="text-[#E65100]">Rider On The Way! 🛵</span>
                    ) : (
                      <span className="text-white">Food Being Prepared 🔥</span>
                    )}
                  </h2>
                  <p className="text-xs text-white/40 mt-1 font-normal">
                    Estimated arrival: <strong className="text-white">20–35 minutes</strong>
                  </p>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-[#E65100]/20 text-[#E65100] flex items-center justify-center font-bold">
                  <Flame className="w-7 h-7 fill-[#E65100] text-[#E65100] animate-pulse" />
                </div>
              </div>

              {/* Progress Bar Line */}
              <div className="w-full bg-white/10 h-2 rounded-full mt-6 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#E65100] to-emerald-400 h-full transition-all duration-700"
                  style={{
                    width: `${(currentStepNum / 6) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Stages Timeline */}
            <div className="p-6 rounded-3xl bg-[#161616] border border-white/10 shadow-xl space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">
                Delivery Timeline History
              </h3>

              <div className="relative pl-6 space-y-6 border-l-2 border-white/10">
                {STAGES.map((s, idx) => {
                  const stepNum = idx + 1;
                  const isDone = currentStepNum >= stepNum;
                  const isCurrent = currentStepNum === stepNum;

                  // Find timestamp note if recorded
                  const histItem = order.statusHistory?.find((h) => h.status === s.status);

                  return (
                    <div key={s.status} className="relative">
                      {/* Circle Node */}
                      <div
                        className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all ${
                          isCurrent
                            ? 'bg-[#E65100] border-[#FF6D00] text-black shadow-lg shadow-[#E65100]/40 ring-4 ring-black/80'
                            : isDone
                            ? 'bg-emerald-500 border-emerald-400 text-white'
                            : 'bg-[#0F0F0F] border-white/10 text-white/30'
                        }`}
                      >
                        {isDone ? '✓' : stepNum}
                      </div>

                      <div className="flex items-start justify-between">
                        <div>
                          <div
                            className={`text-sm font-extrabold uppercase tracking-wider ${
                              isCurrent
                                ? 'text-[#E65100]'
                                : isDone
                                ? 'text-white'
                                : 'text-white/40'
                            }`}
                          >
                            {s.label}
                          </div>
                          <div className="text-xs text-white/40 mt-0.5 font-normal">{s.desc}</div>
                          {histItem?.note && (
                            <div className="text-[11px] text-white/30 mt-1 italic font-normal">
                              "{histItem.note}"
                            </div>
                          )}
                        </div>

                        {histItem?.timestamp && (
                          <span className="text-[10px] font-bold bg-[#0F0F0F] text-white/40 px-2 py-0.5 rounded border border-white/10 shrink-0 uppercase tracking-widest">
                            {histItem.timestamp}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items Breakdown */}
            <div className="p-6 rounded-3xl bg-[#161616] border border-white/10 shadow-xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Order Items Details</h3>
              <div className="divide-y divide-white/5">
                {order.items.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white uppercase">{item.quantity}x {item.name}</div>
                      <div className="text-[10px] text-white/40 font-normal">
                        {item.protein} • {item.size} • {item.spiceLevel}
                      </div>
                    </div>
                    <span className="font-extrabold text-white">₦{item.totalPrice.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-black text-white">
                <span>Total Paid</span>
                <span className="text-[#E65100]">₦{order.total.toLocaleString()}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Assigned Rider & Interactive Route Map */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Assigned Rider Card */}
            {order.assignedRider ? (
              <div className="p-6 rounded-3xl bg-[#161616] border border-emerald-800/60 shadow-xl space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                  Assigned Delivery Agent
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <img
                    src={order.assignedRider.avatar}
                    alt={order.assignedRider.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/50"
                  />
                  <div>
                    <h3 className="font-extrabold text-lg text-white uppercase">{order.assignedRider.name}</h3>
                    <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <Bike className="w-3.5 h-3.5" /> {order.assignedRider.vehicleType} ({order.assignedRider.vehicleNumber})
                    </p>
                    <div className="text-[11px] text-white/40 mt-0.5 font-normal">
                      ⭐ {order.assignedRider.rating} Rating • {order.assignedRider.totalDeliveries} Completed
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a
                    href={`tel:${order.assignedRider.phone}`}
                    className="py-2.5 px-3 rounded-xl bg-[#E65100] hover:bg-[#FF6D00] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                  >
                    <Phone className="w-4 h-4" /> Call Rider
                  </a>
                  <a
                    href={`https://wa.me/234${order.assignedRider.phone.slice(1)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-3xl bg-[#161616] border border-white/10 text-center space-y-2">
                <Bike className="w-10 h-10 text-white/20 mx-auto" />
                <h4 className="font-bold text-sm text-white uppercase tracking-wider">Assigning Nearest Delivery Rider</h4>
                <p className="text-xs text-white/40 font-normal">
                  As soon as kitchen finishes grilling, a rider will be dispatched.
                </p>
              </div>
            )}

            {/* Interactive Route Map Simulation Canvas */}
            <div className="p-5 rounded-3xl bg-[#161616] border border-white/10 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-white uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#E65100]" /> Express Route Map
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  GPS Active
                </span>
              </div>

              {/* Map Graphic Container */}
              <div className="relative w-full h-64 rounded-2xl bg-[#0F0F0F] border border-white/10 overflow-hidden">
                {/* Grid Background */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'radial-gradient(#E65100 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                  }}
                />

                {/* SVG Route Line */}
                <svg className="absolute inset-0 w-full h-full">
                  <path
                    d="M 40,200 C 120,180 180,80 320,60"
                    fill="none"
                    stroke="#E65100"
                    strokeWidth="4"
                    strokeDasharray="6 6"
                    className="animate-pulse"
                  />
                </svg>

                {/* Kitchen Origin Marker */}
                <div className="absolute bottom-8 left-6 bg-[#161616] border border-[#E65100] p-2 rounded-xl flex items-center gap-1.5 shadow-lg">
                  <Flame className="w-4 h-4 text-[#E65100] fill-[#E65100]" />
                  <span className="text-[10px] font-bold text-white uppercase">Grill Kitchen (VI)</span>
                </div>

                {/* Customer Destination Marker */}
                <div className="absolute top-8 right-6 bg-[#161616] border border-emerald-500 p-2 rounded-xl flex items-center gap-1.5 shadow-lg">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-bold text-white uppercase">{order.delivery.area}</span>
                </div>

                {/* Moving Rider Icon */}
                <div
                  className="absolute transition-all duration-1000 ease-linear transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${40 + riderProgress * 280}px`,
                    top: `${200 - riderProgress * 140}px`,
                  }}
                >
                  <div className="w-9 h-9 rounded-full bg-[#E65100] text-black flex items-center justify-center shadow-xl ring-4 ring-black animate-bounce">
                    <Bike className="w-5 h-5" />
                  </div>
                  <div className="bg-[#0F0F0F] text-[9px] font-extrabold text-[#E65100] px-1.5 py-0.5 rounded border border-[#E65100]/40 text-center whitespace-nowrap -mt-1 shadow uppercase">
                    Rider
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-white/40 flex items-center justify-between pt-1 font-normal">
                <span>Distance: ~4.2 km</span>
                <span className="text-emerald-400 font-bold">Estimated ETA: 18 mins</span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
