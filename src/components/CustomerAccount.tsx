import React, { useState, useEffect } from 'react';
import { User, ShoppingBag, MapPin, Heart, RefreshCw, ChevronRight, Phone, Mail, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Order, FoodItem } from '../types';
import { api } from '../services/api';

interface CustomerAccountProps {
  onSelectFood: (food: FoodItem) => void;
  onTrackOrder: (orderId: string) => void;
  menuItems: FoodItem[];
}

export const CustomerAccount: React.FC<CustomerAccountProps> = ({
  onSelectFood,
  onTrackOrder,
  menuItems,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'favourites' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // Saved Addresses
  const [addresses, setAddresses] = useState([
    { id: '1', title: 'Home', address: 'Block 12, Flat 4, Admiralty Way', area: 'Lekki Phase 1', landmark: 'Near Ebeano Supermarket' },
    { id: '2', title: 'Office', address: '15 Bishop Aboyade Cole St', area: 'Victoria Island (VI)', landmark: 'Zenith Bank' },
  ]);

  const [newAddrTitle, setNewAddrTitle] = useState('');
  const [newAddrText, setNewAddrText] = useState('');

  useEffect(() => {
    fetchCustomerOrders();
  }, []);

  const fetchCustomerOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getOrders({ phone: '08023456789' }); // Sample customer phone
      setOrders(res);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  const favorites = menuItems.filter((item) => item.isPopular || item.isBestSeller);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Profile Welcome Banner */}
      <div className="bg-[#161616] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#E65100] text-black font-black text-2xl flex items-center justify-center shadow-lg shadow-[#E65100]/20">
            OB
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white uppercase tracking-tight">Oluwaseun Bakare</h1>
            <p className="text-xs text-white/40 font-normal">08023456789 • seun.b@example.com</p>
            <div className="inline-flex items-center gap-1.5 bg-[#E65100]/10 text-[#E65100] text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-md border border-[#E65100]/20 mt-1">
              ⭐ VIP Shawarma Club Member
            </div>
          </div>
        </div>

        <button
          onClick={fetchCustomerOrders}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-2">
        {[
          { key: 'orders', label: 'My Orders', icon: ShoppingBag },
          { key: 'favourites', label: 'Favourite Meals', icon: Heart },
          { key: 'addresses', label: 'Saved Addresses', icon: MapPin },
          { key: 'profile', label: 'Profile Settings', icon: User },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === t.key
                ? 'bg-[#E65100] text-black shadow-lg shadow-[#E65100]/20'
                : 'bg-[#161616] text-white/40 hover:text-white border border-white/10'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="text-base font-extrabold text-white uppercase tracking-wider">Order History & Active Deliveries</h2>

          {orders.length === 0 ? (
            <div className="text-center py-12 bg-[#161616] rounded-3xl border border-white/10">
              <ShoppingBag className="w-12 h-12 text-white/20 mx-auto mb-2" />
              <p className="text-sm font-bold text-white uppercase tracking-wider">No orders placed yet</p>
              <p className="text-xs text-white/40 mt-1 font-normal">Order your first shawarma or grill today!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 rounded-2xl bg-[#161616] border border-white/10 hover:border-white/20 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-base">#{ord.orderNumber}</span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                          ord.status === 'DELIVERED'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-[#E65100]/10 text-[#E65100] border border-[#E65100]/30'
                        }`}
                      >
                        {ord.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs text-white/60 font-normal">
                      {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>

                    <div className="text-[11px] text-white/40 font-normal">
                      {new Date(ord.createdAt).toLocaleString()} • {ord.delivery.area}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="font-black text-white text-base">
                      ₦{ord.total.toLocaleString()}
                    </span>

                    <button
                      onClick={() => onTrackOrder(ord.id)}
                      className="px-4 py-2 rounded-xl bg-[#E65100] hover:bg-[#FF6D00] text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1 shadow"
                    >
                      <span>Track</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Favourites */}
      {activeTab === 'favourites' && (
        <div className="space-y-4">
          <h2 className="text-base font-extrabold text-white uppercase tracking-wider">Saved Favorite Delicacies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((food) => (
              <div key={food.id} className="p-4 rounded-2xl bg-[#161616] border border-white/10 flex items-center gap-3">
                <img src={food.image} alt={food.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-white truncate uppercase">{food.name}</h4>
                  <div className="text-xs font-black text-[#E65100] mt-0.5">₦{food.price.toLocaleString()}</div>
                  <button
                    onClick={() => onSelectFood(food)}
                    className="text-[10px] text-[#E65100] font-extrabold uppercase hover:underline mt-1 block"
                  >
                    + Quick Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <h2 className="text-base font-extrabold text-white uppercase tracking-wider">Saved Delivery Addresses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((a) => (
              <div key={a.id} className="p-4 rounded-2xl bg-[#161616] border border-white/10 space-y-1 relative">
                <span className="text-[10px] font-black uppercase text-[#E65100] bg-[#E65100]/10 px-2 py-0.5 rounded border border-[#E65100]/20">
                  {a.title}
                </span>
                <div className="font-bold text-white text-xs mt-1">{a.address}</div>
                <div className="text-[11px] text-white/40 font-normal">{a.area} ({a.landmark})</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="p-6 bg-[#161616] border border-white/10 rounded-3xl space-y-4 text-xs text-white/80">
          <h2 className="text-base font-extrabold text-white uppercase tracking-wider">Account Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-white/40 uppercase tracking-widest text-[10px]">Full Name</label>
              <input type="text" value="Oluwaseun Bakare" readOnly className="w-full bg-[#0F0F0F] border border-white/10 p-3 rounded-xl text-white mt-1 font-normal" />
            </div>
            <div>
              <label className="font-bold text-white/40 uppercase tracking-widest text-[10px]">Phone</label>
              <input type="text" value="08023456789" readOnly className="w-full bg-[#0F0F0F] border border-white/10 p-3 rounded-xl text-white mt-1 font-normal" />
            </div>
            <div>
              <label className="font-bold text-white/40 uppercase tracking-widest text-[10px]">Email</label>
              <input type="text" value="seun.b@example.com" readOnly className="w-full bg-[#0F0F0F] border border-white/10 p-3 rounded-xl text-white mt-1 font-normal" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
