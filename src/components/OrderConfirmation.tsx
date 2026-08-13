import React from 'react';
import { CheckCircle2, MapPin, Clock, ArrowRight, ShoppingBag, PhoneCall, MessageCircle } from 'lucide-react';
import { Order } from '../types';

interface OrderConfirmationProps {
  order: Order;
  onTrackOrder: (orderId: string) => void;
  onContinueShopping: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  order,
  onTrackOrder,
  onContinueShopping,
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-[#161616] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 text-center sm:text-left">
        
        {/* Top Success Badge */}
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-8 border-b border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-950/80 text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-800/80 mb-2">
              🎉 Order Successfully Received
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
              Order Confirmed! <span className="text-[#E65100]">#{order.orderNumber}</span>
            </h1>
            <p className="text-xs sm:text-sm text-white/60 mt-1 font-normal">
              Thank you, {order.customer.fullName}. Our kitchen has received your order and is preparing it fresh on the grill!
            </p>
          </div>
        </div>

        {/* Order Details Quick Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#0F0F0F] border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-white/40">Estimated Prep Time</span>
            <div className="font-black text-white text-base flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#E65100]" />
              15–20 Mins
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0F0F0F] border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-white/40">Estimated Arrival</span>
            <div className="font-black text-emerald-400 text-base flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              25–40 Mins
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0F0F0F] border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-white/40">Payment Status</span>
            <div className="font-black text-white text-base">
              {order.paymentStatus === 'PAID' ? (
                <span className="text-emerald-400">✓ Paid Online</span>
              ) : (
                <span className="text-amber-400">Cash on Delivery</span>
              )}
            </div>
          </div>
        </div>

        {/* Ordered Items Summary */}
        <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-5 space-y-3 text-left">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#E65100]">
            Order Items ({order.items.length})
          </h3>

          <div className="divide-y divide-white/5">
            {order.items.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-extrabold text-white uppercase">{item.quantity}x {item.name}</span>
                  <span className="text-[11px] text-white/40 ml-2 font-normal">
                    ({item.protein}, {item.size}, {item.spiceLevel} spice)
                  </span>
                </div>
                <span className="font-extrabold text-white">₦{item.totalPrice.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-between items-center text-sm font-black text-white">
            <span>Total Paid Amount</span>
            <span className="text-[#E65100]">₦{order.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Address & Instructions */}
        <div className="p-4 rounded-2xl bg-[#0F0F0F] border border-white/10 text-xs text-white/80 space-y-1 text-left">
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-white/40 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#E65100]" /> Delivery Address
          </span>
          <div className="font-extrabold text-white text-sm uppercase">{order.delivery.area}</div>
          <div className="font-normal">{order.delivery.address}</div>
          {order.delivery.landmark && (
            <div className="text-white/40 font-normal">Landmark: {order.delivery.landmark}</div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onTrackOrder(order.id)}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#E65100] hover:bg-[#FF6D00] text-black font-extrabold text-xs uppercase tracking-widest shadow-xl shadow-[#E65100]/20 transition-all flex items-center justify-center gap-2"
          >
            <MapPin className="w-5 h-5 text-black" />
            <span>Track My Order in Real-Time</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onContinueShopping}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/10 border border-white/10 text-white/80 hover:text-white font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>

      </div>
    </div>
  );
};
