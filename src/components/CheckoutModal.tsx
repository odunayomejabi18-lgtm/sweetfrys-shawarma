import React, { useState } from 'react';
import { X, Check, ShieldCheck, CreditCard, Truck, User, MapPin, Clock, ArrowRight, Lock, Phone, MessageSquare } from 'lucide-react';
import { CartItem, CustomerInfo, DeliveryInfo, PaymentMethod, DeliveryZone, Order } from '../types';
import { api } from '../services/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  zones: DeliveryZone[];
  selectedZone: DeliveryZone | null;
  appliedDiscount: number;
  onOrderComplete: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  zones,
  selectedZone,
  appliedDiscount,
  onOrderComplete,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: 'Oluwaseun Bakare',
    phone: '08023456789',
    email: 'seun.b@example.com',
    whatsapp: '08023456789',
  });

  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('Block 12, Flat 4, Admiralty Way');
  const [area, setArea] = useState(selectedZone?.name || 'Lekki Phase 1');
  const [landmark, setLandmark] = useState('Near Ebeano Supermarket');
  const [deliveryInstructions, setDeliveryInstructions] = useState('Call at gate');

  const [deliveryTiming, setDeliveryTiming] = useState<'asap' | 'scheduled'>('asap');
  const [scheduledTime, setScheduledTime] = useState('Today, 7:30 PM');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paystack');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentGatewayModal, setShowPaymentGatewayModal] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = deliveryType === 'pickup' ? 0 : (selectedZone?.fee || 1500);
  const total = Math.max(0, subtotal + deliveryFee - appliedDiscount);

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    const deliveryObj: DeliveryInfo = {
      deliveryType,
      address: deliveryType === 'delivery' ? address : 'Pick up at Lagos Grill Kitchen',
      area: deliveryType === 'delivery' ? area : 'Victoria Island Outlet',
      city: 'Lagos',
      landmark: deliveryType === 'delivery' ? landmark : undefined,
      instructions: deliveryInstructions || undefined,
    };

    const newOrderData: Partial<Order> = {
      customer,
      delivery: deliveryObj,
      items: cartItems,
      subtotal,
      deliveryFee,
      discount: appliedDiscount,
      total,
      paymentMethod,
      scheduledTime: deliveryTiming === 'scheduled' ? scheduledTime : 'ASAP (25–40 mins)',
    };

    try {
      const createdOrder = await api.createOrder(newOrderData);
      setIsSubmitting(false);
      onOrderComplete(createdOrder);
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#161616] border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-[#0F0F0F] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E65100]/20 text-[#E65100] flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white uppercase tracking-tight">Express Checkout</h2>
              <p className="text-xs text-white/40">Step {step} of 5 — Complete your order</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/40 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="bg-[#0A0A0A] px-6 py-3 border-b border-white/10 flex items-center justify-between text-xs font-bold text-white/40 overflow-x-auto shrink-0">
          {[
            { num: 1, label: 'Contact' },
            { num: 2, label: 'Delivery' },
            { num: 3, label: 'Timing' },
            { num: 4, label: 'Payment' },
            { num: 5, label: 'Confirm' },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => setStep(s.num as any)}
              className={`flex items-center gap-2 py-1 px-2.5 rounded-lg transition-all ${
                step === s.num
                  ? 'bg-[#E65100] text-black font-extrabold uppercase tracking-wider shadow'
                  : step > s.num
                  ? 'text-emerald-400 font-bold'
                  : 'text-white/40'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
                {step > s.num ? '✓' : s.num}
              </span>
              <span className="uppercase text-[10px] tracking-wider">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Step Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-[#F5F5F0]">
          
          {/* STEP 1: CUSTOMER INFO */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <User className="w-5 h-5 text-[#E65100]" /> Customer Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E65100]"
                    placeholder="e.g. Oluwaseun Bakare"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Phone Number (For Delivery Call) *</label>
                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E65100]"
                    placeholder="08012345678"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Email Address (For Receipt)</label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E65100]"
                    placeholder="name@example.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider">WhatsApp Number (For Order Updates)</label>
                  <input
                    type="tel"
                    value={customer.whatsapp}
                    onChange={(e) => setCustomer({ ...customer, whatsapp: e.target.value })}
                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E65100]"
                    placeholder="08012345678"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DELIVERY INFO */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#E65100]" /> Order Fulfillment Mode
              </h3>

              {/* Delivery vs Pickup Toggle */}
              <div className="grid grid-cols-2 gap-3 p-1 bg-[#0F0F0F] border border-white/10 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  className={`py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    deliveryType === 'delivery'
                      ? 'bg-[#E65100] text-black shadow-md'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  <Truck className="w-4 h-4" /> Doorstep Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  className={`py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    deliveryType === 'pickup'
                      ? 'bg-[#E65100] text-black shadow-md'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" /> Self Pickup (0 Fee)
                </button>
              </div>

              {deliveryType === 'delivery' ? (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Area / Neighborhood *</label>
                      <select
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E65100]"
                      >
                        {zones.map((z) => (
                          <option key={z.id} value={z.name}>
                            {z.name} — ₦{z.fee.toLocaleString()} ({z.estimatedMinutes})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Nearest Landmark *</label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E65100]"
                        placeholder="e.g. Opposite Ebeano Supermarket"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Full Delivery Street Address *</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E65100]"
                      placeholder="e.g. House 14, Block 3, Admiralty Way, Lekki Phase 1"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Rider Gate/Compound Instructions</label>
                    <input
                      type="text"
                      value={deliveryInstructions}
                      onChange={(e) => setDeliveryInstructions(e.target.value)}
                      className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E65100]"
                      placeholder="e.g. Call my phone when at security gate"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#0F0F0F] border border-white/10 text-xs text-white/80 space-y-2">
                  <div className="font-bold text-[#E65100] uppercase tracking-wider">Pickup Kitchen Location:</div>
                  <p>Lagos Shawarma & Grill Express Kitchen, 18 Bishop Aboyade Cole St, Victoria Island, Lagos.</p>
                  <p className="text-white/40">Your food will be freshly packed and waiting for you in 20 minutes.</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: TIMING */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#E65100]" /> Delivery Timing Preference
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDeliveryTiming('asap')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    deliveryTiming === 'asap'
                      ? 'border-[#E65100] bg-[#E65100]/10 text-white'
                      : 'border-white/10 bg-[#0F0F0F] text-white/60 hover:border-white/20'
                  }`}
                >
                  <div className="font-extrabold text-xs uppercase tracking-wider text-[#E65100] flex items-center gap-2">
                    ⚡ ASAP Delivery (25–40 mins)
                  </div>
                  <p className="text-xs text-white/40 mt-1 font-normal">
                    Kitchen starts grilling immediately upon order placement.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryTiming('scheduled')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    deliveryTiming === 'scheduled'
                      ? 'border-[#E65100] bg-[#E65100]/10 text-white'
                      : 'border-white/10 bg-[#0F0F0F] text-white/60 hover:border-white/20'
                  }`}
                >
                  <div className="font-extrabold text-xs uppercase tracking-wider text-white flex items-center gap-2">
                    📅 Schedule For Later
                  </div>
                  <p className="text-xs text-white/40 mt-1 font-normal">
                    Pick a specific date & time for party or dinner delivery.
                  </p>
                </button>
              </div>

              {deliveryTiming === 'scheduled' && (
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Select Date & Time</label>
                  <input
                    type="text"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E65100]"
                    placeholder="e.g. Today at 7:30 PM"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 4: PAYMENT METHOD */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#E65100]" /> Select Payment Gateway
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    key: 'paystack',
                    name: 'Paystack Secured',
                    desc: 'Card, Bank Transfer, USSD, Apple Pay',
                    badge: 'Instant Auto-Confirm ⚡',
                  },
                  {
                    key: 'flutterwave',
                    name: 'Flutterwave',
                    desc: 'Nigerian Debit Cards & Mobile Money',
                    badge: 'Secure Gateway',
                  },
                  {
                    key: 'card',
                    name: 'Direct Debit / Credit Card',
                    desc: 'Mastercard, Visa, Verve',
                    badge: '3D Secure',
                  },
                  {
                    key: 'bank_transfer',
                    name: 'Direct Bank Transfer',
                    desc: 'Instant Virtual Account Transfer',
                    badge: 'Auto Match',
                  },
                  {
                    key: 'cash_on_delivery',
                    name: 'Cash on Delivery',
                    desc: 'Pay cash or transfer to rider upon delivery',
                    badge: 'Pay at Doorstep',
                  },
                ].map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setPaymentMethod(p.key as PaymentMethod)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      paymentMethod === p.key
                        ? 'border-[#E65100] bg-[#E65100]/10 text-white shadow-md'
                        : 'border-white/10 bg-[#0F0F0F] text-white/60 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs uppercase tracking-wider text-white">{p.name}</div>
                      <span className="text-[10px] bg-white/10 text-[#E65100] px-2 py-0.5 rounded font-extrabold uppercase">
                        {p.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/40 mt-1 font-normal">{p.desc}</p>
                  </button>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0F0F0F] border border-white/10 text-xs text-white/60 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>All transactions encrypted end-to-end. Payments are verified securely before dispatch.</span>
              </div>
            </div>
          )}

          {/* STEP 5: FINAL ORDER SUMMARY */}
          {step === 5 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-base font-extrabold text-white uppercase tracking-wider">Review & Confirm Your Order</h3>

              {/* Customer & Address Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-[#0F0F0F] border border-white/10 text-xs text-white/80 space-y-1">
                  <div className="font-bold text-[#E65100] uppercase text-[10px] tracking-widest">Customer Details</div>
                  <div className="font-extrabold text-white">{customer.fullName}</div>
                  <div>Phone: {customer.phone}</div>
                  <div>Email: {customer.email}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0F0F0F] border border-white/10 text-xs text-white/80 space-y-1">
                  <div className="font-bold text-[#E65100] uppercase text-[10px] tracking-widest">Fulfillment Info</div>
                  <div className="font-extrabold text-white capitalize">{deliveryType} ({area})</div>
                  <div className="truncate">{address}</div>
                  {landmark && <div className="text-white/40">Landmark: {landmark}</div>}
                </div>
              </div>

              {/* Items List */}
              <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-4 space-y-2">
                <div className="text-xs font-bold uppercase text-white/40 tracking-wider mb-2">Ordered Items ({cartItems.length})</div>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs py-1 border-b border-white/5 last:border-0">
                    <div>
                      <span className="font-bold text-white">{item.quantity}x {item.name}</span>
                      <span className="text-[10px] text-white/40 ml-2">({item.protein}, {item.size})</span>
                    </div>
                    <span className="font-bold text-white">₦{item.totalPrice.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Final Math */}
              <div className="p-4 bg-[#0F0F0F] border border-white/10 rounded-2xl space-y-1.5 text-xs text-white/60 font-normal">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-white">₦{deliveryFee.toLocaleString()}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Discount</span>
                    <span>-₦{appliedDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-white/10">
                  <span>Total Payable</span>
                  <span className="text-[#E65100]">₦{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-[#0F0F0F] border-t border-white/10 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              onClick={() => setStep((step - 1) as any)}
              className="px-5 py-2.5 rounded-xl bg-white/10 text-white/80 hover:text-white text-xs font-extrabold uppercase tracking-wider"
            >
              Back
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/10 text-white/80 hover:text-white text-xs font-extrabold uppercase tracking-wider"
            >
              Cancel
            </button>
          )}

          {step < 5 ? (
            <button
              onClick={() => setStep((step + 1) as any)}
              className="px-7 py-3 rounded-xl bg-[#E65100] hover:bg-[#FF6D00] text-black font-extrabold text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-[#E65100]/20"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-xl bg-[#E65100] hover:bg-[#FF6D00] text-black font-extrabold text-xs uppercase tracking-widest shadow-xl shadow-[#E65100]/20 transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>Placing Order...</span>
              ) : (
                <>
                  <span>Pay & Place Order (₦{total.toLocaleString()})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
