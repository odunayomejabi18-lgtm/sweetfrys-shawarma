import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, Sparkles, MapPin } from 'lucide-react';
import { CartItem, DeliveryZone } from '../types';
import { api } from '../services/api';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  zones: DeliveryZone[];
  selectedZone: DeliveryZone | null;
  setSelectedZone: (zone: DeliveryZone) => void;
  appliedDiscount: number;
  setAppliedDiscount: (amount: number) => void;
  appliedPromoCode: string;
  setAppliedPromoCode: (code: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  zones,
  selectedZone,
  setSelectedZone,
  appliedDiscount,
  setAppliedDiscount,
  appliedPromoCode,
  setAppliedPromoCode,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [validatingPromo, setValidatingPromo] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = selectedZone ? selectedZone.fee : 1500;
  const finalTotal = Math.max(0, subtotal + deliveryFee - appliedDiscount);

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setValidatingPromo(true);
    setPromoError('');
    setPromoSuccess('');

    try {
      const res = await api.validatePromo(promoInput, subtotal, deliveryFee);
      setAppliedDiscount(res.calculatedDiscount);
      setAppliedPromoCode(res.code);
      setPromoSuccess(`Promo code ${res.code} applied! Saved ₦${res.calculatedDiscount.toLocaleString()}`);
    } catch (err: any) {
      setPromoError(err.message || 'Invalid promo code');
    } finally {
      setValidatingPromo(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0F0F0F] border-l border-white/10 flex flex-col shadow-2xl">
          
          {/* Cart Header */}
          <div className="p-5 bg-[#050505] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#E65100]/20 text-[#E65100] flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-lg text-white uppercase tracking-tight">Your Food Basket</h2>
                <p className="text-xs text-white/40">{cartItems.length} items selected</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-20 text-white/40 space-y-4">
                <ShoppingBag className="w-16 h-16 mx-auto stroke-1 text-white/20" />
                <div>
                  <h3 className="font-bold text-white text-base uppercase">Your cart is empty</h3>
                  <p className="text-xs text-white/40 mt-1 max-w-xs mx-auto font-normal">
                    Add juicy chicken shawarma, grilled catfish or spicy suya from our menu to get started!
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#E65100] hover:bg-[#FF6D00] text-black font-extrabold text-xs uppercase tracking-widest shadow-md transition-all"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#161616] border border-white/5 rounded-2xl p-3.5 flex gap-3.5 relative group hover:border-white/20 transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 bg-black/40"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-xs sm:text-sm text-white uppercase truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-white/30 hover:text-red-400 p-1 rounded transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Item Customization Breakdown */}
                      <div className="text-[10px] text-white/40 space-y-0.5 mt-1 font-medium">
                        <div className="capitalize">
                          <span className="text-[#E65100] font-bold">{item.protein}</span> • {item.size} • {item.spiceLevel.replace('_', ' ')} spice
                        </div>
                        {item.selectedAddOns.length > 0 && (
                          <div className="text-emerald-400 font-medium truncate">
                            Add-ons: {item.selectedAddOns.map(a => a.name).join(', ')}
                          </div>
                        )}
                        {item.specialInstructions && (
                          <div className="text-white/30 italic truncate">
                            "{item.specialInstructions}"
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Controls & Price */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-2">
                      <div className="flex items-center bg-[#0F0F0F] border border-white/10 rounded-lg p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded bg-white/5 text-white/80 hover:text-white flex items-center justify-center"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-black text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded bg-[#E65100] text-black hover:bg-[#FF6D00] flex items-center justify-center font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-black text-white">
                        ₦{item.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer Summary & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-5 bg-[#050505] border-t border-white/10 space-y-4 shrink-0">
              
              {/* Delivery Zone Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#E65100]" /> Select Delivery Area
                </label>
                <select
                  value={selectedZone?.id || ''}
                  onChange={(e) => {
                    const z = zones.find(z => z.id === e.target.value);
                    if (z) setSelectedZone(z);
                  }}
                  className="w-full bg-[#161616] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#E65100]"
                >
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} — ₦{z.fee.toLocaleString()} ({z.estimatedMinutes})
                    </option>
                  ))}
                </select>
              </div>

              {/* Promo Code Input */}
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="Coupon Code (e.g. WELCOME10)"
                      className="w-full bg-[#161616] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#E65100]"
                    />
                  </div>
                  <button
                    onClick={handleApplyPromo}
                    disabled={validatingPromo}
                    className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/10 transition-colors shrink-0"
                  >
                    {validatingPromo ? 'Checking...' : 'Apply'}
                  </button>
                </div>
                {promoError && <p className="text-[11px] text-red-400">{promoError}</p>}
                {promoSuccess && <p className="text-[11px] text-emerald-400">{promoSuccess}</p>}
              </div>

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-white/60 pt-2 border-t border-white/10 font-normal">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee ({selectedZone?.name || 'Standard'})</span>
                  <span className="font-bold text-white">₦{deliveryFee.toLocaleString()}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Discount ({appliedPromoCode})</span>
                    <span>-₦{appliedDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-white/10">
                  <span>Total Amount</span>
                  <span className="text-[#E65100]">₦{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 rounded-xl bg-[#E65100] hover:bg-[#FF6D00] text-black font-extrabold text-xs uppercase tracking-widest shadow-xl shadow-[#E65100]/20 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
