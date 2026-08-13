import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Kanban,
  UtensilsCrossed,
  Bike,
  MapPin,
  Tag,
  BarChart3,
  MessageSquare,
  Flame,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  DollarSign,
  UserCheck,
  TrendingUp,
  X,
  Phone,
  Edit2,
  Trash2
} from 'lucide-react';
import { Order, OrderStatus, FoodItem, DeliveryAgent, DeliveryZone, PromoCode, Review, AnalyticsSummary } from '../../types';
import { api } from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'orders' | 'menu' | 'riders' | 'zones' | 'promos' | 'analytics' | 'reviews'
  >('orders');

  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [riders, setRiders] = useState<DeliveryAgent[]>([]);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  // Modals
  const [showRiderAssignModal, setShowRiderAssignModal] = useState(false);
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [ordRes, menuRes, riderRes, zoneRes, promoRes, revRes, anaRes] = await Promise.all([
        api.getOrders(),
        api.getMenuItems(),
        api.getRiders(),
        api.getZones(),
        api.getPromos(),
        api.getReviews(),
        api.getAnalytics(),
      ]);
      setOrders(ordRes);
      setMenuItems(menuRes);
      setRiders(riderRes);
      setZones(zoneRes);
      setPromos(promoRes);
      setReviews(revRes);
      setAnalytics(anaRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: OrderStatus, note?: string) => {
    try {
      const updated = await api.updateOrderStatus(id, status, note);
      setOrders(orders.map((o) => (o.id === id ? updated : o)));
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder(updated);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAssignRiderToOrder = async (orderId: string, riderId: string) => {
    try {
      const updated = await api.assignRider(orderId, riderId);
      setOrders(orders.map((o) => (o.id === orderId ? updated : o)));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
      setShowRiderAssignModal(false);
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle Menu Item Availability
  const handleToggleMenuAvailability = async (item: FoodItem) => {
    try {
      const updated = await api.updateMenuItem(item.id, { available: !item.available });
      setMenuItems(menuItems.map((m) => (m.id === item.id ? updated : m)));
    } catch (e) {
      console.error(e);
    }
  };

  // Columns for Kanban Board
  const KANBAN_COLUMNS: { status: OrderStatus; label: string; color: string }[] = [
    { status: 'NEW', label: 'NEW ORDERS 🔔', color: 'bg-red-950/80 border-red-800 text-red-400' },
    { status: 'CONFIRMED', label: 'CONFIRMED 📋', color: 'bg-orange-950/80 border-orange-800 text-orange-400' },
    { status: 'PREPARING', label: 'PREPARING 🔥', color: 'bg-amber-950/80 border-amber-800 text-amber-400' },
    { status: 'READY', label: 'READY / PACKED 📦', color: 'bg-blue-950/80 border-blue-800 text-blue-400' },
    { status: 'OUT_FOR_DELIVERY', label: 'OUT FOR DELIVERY 🛵', color: 'bg-purple-950/80 border-purple-800 text-purple-400' },
    { status: 'DELIVERED', label: 'DELIVERED 🎉', color: 'bg-emerald-950/80 border-emerald-800 text-emerald-400' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0F0F0F] border-r border-white/10 p-4 shrink-0 space-y-6">
        <div className="flex items-center gap-2 px-2 pt-2">
          <div className="w-9 h-9 rounded-xl bg-[#E65100] text-black flex items-center justify-center font-black italic">
            SF
          </div>
          <div>
            <span className="font-extrabold text-xs text-white tracking-tight uppercase block">SWEETFRYS</span>
            <span className="text-[10px] text-[#E65100] font-extrabold uppercase tracking-widest">Shawarma Spot Admin</span>
          </div>
        </div>

        <nav className="space-y-1 font-bold text-xs">
          {[
            { key: 'orders', label: 'Live Orders Kanban', icon: Kanban, badge: orders.filter(o => o.status === 'NEW').length },
            { key: 'menu', label: 'Menu Management', icon: UtensilsCrossed },
            { key: 'riders', label: 'Delivery Agents', icon: Bike, badge: riders.filter(r => r.status === 'AVAILABLE').length },
            { key: 'zones', label: 'Delivery Areas / Zones', icon: MapPin },
            { key: 'promos', label: 'Promotions & Coupons', icon: Tag },
            { key: 'analytics', label: 'Sales & Analytics', icon: BarChart3 },
            { key: 'reviews', label: 'Customer Reviews', icon: MessageSquare },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key as any)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl uppercase tracking-wider text-xs font-extrabold transition-all ${
                activeTab === item.key
                  ? 'bg-[#E65100] text-black shadow-lg shadow-[#E65100]/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-white text-black font-black text-[10px] px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="pt-4 border-t border-white/10 text-[10px] text-white/40 space-y-1 px-2 uppercase font-mono">
          <div>System: Express + Vite Engine</div>
          <div className="text-emerald-400">🟢 Cloud Database Connected</div>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-4 sm:p-8 space-y-8 overflow-x-hidden">
        
        {/* Top Metric Cards Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#161616] border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-white/40">Today's Revenue</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-400">
              ₦{analytics?.totalRevenue.toLocaleString() || '1,245,000'}
            </div>
            <span className="text-[10px] text-emerald-500 font-bold">+18% vs yesterday</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#161616] border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-white/40">Total Orders</span>
            <div className="text-xl sm:text-2xl font-black text-white">
              {orders.length} Orders
            </div>
            <span className="text-[10px] text-[#E65100] font-bold">{orders.filter(o => o.status === 'NEW').length} Pending</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#161616] border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-white/40">Active Riders</span>
            <div className="text-xl sm:text-2xl font-black text-blue-400">
              {riders.filter(r => r.status === 'AVAILABLE' || r.status === 'ON_DELIVERY').length} / {riders.length}
            </div>
            <span className="text-[10px] text-white/40 font-bold">Available in Lagos</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#161616] border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-white/40">Avg Prep Time</span>
            <div className="text-xl sm:text-2xl font-black text-amber-400">
              16.4 mins
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">Fast Kitchen</span>
          </div>
        </div>

        {/* TAB 1: LIVE ORDERS KANBAN */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-white uppercase tracking-tight">Live Kitchen & Order Management Board</h2>
                <p className="text-xs text-white/40 font-normal">
                  Click any order card to inspect details, accept, assign riders or update status.
                </p>
              </div>

              <button
                onClick={loadAllData}
                className="px-4 py-2 bg-[#161616] border border-white/10 hover:bg-white/10 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync Board
              </button>
            </div>

            {/* Kanban Columns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-6">
              {KANBAN_COLUMNS.map((col) => {
                const colOrders = orders.filter((o) => o.status === col.status);

                return (
                  <div key={col.status} className="bg-[#161616]/60 border border-white/10 rounded-2xl p-3 space-y-3 min-w-[240px]">
                    {/* Column Header */}
                    <div className={`p-2.5 rounded-xl border font-extrabold text-xs flex items-center justify-between uppercase tracking-wider ${col.color}`}>
                      <span>{col.label}</span>
                      <span className="bg-[#0F0F0F] text-white px-2 py-0.5 rounded text-[10px]">
                        {colOrders.length}
                      </span>
                    </div>

                    {/* Column Cards */}
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {colOrders.length === 0 ? (
                        <div className="text-center py-8 text-[11px] text-white/30 border border-dashed border-white/10 rounded-xl font-normal">
                          No orders
                        </div>
                      ) : (
                        colOrders.map((ord) => (
                          <div
                            key={ord.id}
                            onClick={() => setSelectedOrder(ord)}
                            className="p-3.5 bg-[#161616] border border-white/10 hover:border-[#E65100] rounded-xl cursor-pointer transition-all shadow-md space-y-2 group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-black text-xs text-white group-hover:text-[#E65100]">
                                #{ord.orderNumber}
                              </span>
                              <span className="text-[10px] font-bold text-[#E65100]">
                                ₦{ord.total.toLocaleString()}
                              </span>
                            </div>

                            <div className="text-xs font-bold text-white uppercase truncate">
                              {ord.customer.fullName}
                            </div>

                            <div className="text-[11px] text-white/50 font-normal line-clamp-2">
                              {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                            </div>

                            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40 font-normal">
                              <span>📍 {ord.delivery.area}</span>
                              <span className="text-white/40 font-mono">
                                {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: MENU MANAGEMENT */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-white uppercase tracking-tight">Restaurant Menu Manager</h2>
                <p className="text-xs text-white/40 font-normal">
                  Update food prices, manage available stock, and edit dishes in real-time.
                </p>
              </div>

              <button
                onClick={() => setShowAddMenuModal(true)}
                className="px-4 py-2.5 bg-[#E65100] hover:bg-[#FF6D00] text-black text-xs font-extrabold uppercase tracking-widest rounded-xl flex items-center gap-2 shadow"
              >
                <Plus className="w-4 h-4" /> Add New Menu Item
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-[#161616] border border-white/10 flex gap-3.5">
                  <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="font-bold text-sm text-white truncate uppercase">{item.name}</div>
                    <div className="text-xs font-black text-[#E65100]">₦{item.price.toLocaleString()}</div>
                    <div className="text-[10px] text-white/40 font-normal">{item.category} • {item.prepTimeMinutes}m prep</div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => handleToggleMenuAvailability(item)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          item.available
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-red-950 text-red-400 border border-red-800'
                        }`}
                      >
                        {item.available ? '🟢 In Stock' : '🔴 Out of Stock'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: RIDERS */}
        {activeTab === 'riders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-white uppercase tracking-tight">Delivery Agent Logistics</h2>
                <p className="text-xs text-white/40 font-normal">
                  Manage active delivery agents, monitor active orders and vehicle status.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {riders.map((r) => (
                <div key={r.id} className="p-5 rounded-2xl bg-[#161616] border border-white/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={r.avatar} alt={r.name} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                    <div>
                      <h4 className="font-extrabold text-sm text-white uppercase">{r.name}</h4>
                      <p className="text-xs text-white/40 font-normal">{r.phone}</p>
                    </div>
                  </div>

                  <div className="text-xs text-white/80 space-y-1 font-normal">
                    <div>Vehicle: <strong className="text-white">{r.vehicleType} ({r.vehicleNumber})</strong></div>
                    <div>Completed: <strong className="text-emerald-400">{r.totalDeliveries} Deliveries</strong></div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        r.status === 'AVAILABLE'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : r.status === 'ON_DELIVERY'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-white/10 text-white/40'
                      }`}
                    >
                      {r.status}
                    </span>

                    {r.activeDeliveryId && (
                      <span className="text-[10px] text-[#E65100] font-bold">
                        Order #{r.activeDeliveryId}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ZONES */}
        {activeTab === 'zones' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-white uppercase tracking-tight">Delivery Areas & Pricing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {zones.map((z) => (
                <div key={z.id} className="p-4 rounded-2xl bg-[#161616] border border-white/10 space-y-1">
                  <h4 className="font-extrabold text-base text-white uppercase">{z.name}</h4>
                  <div className="text-xs text-[#E65100] font-bold">Delivery Fee: ₦{z.fee.toLocaleString()}</div>
                  <div className="text-xs text-white/40 font-normal">ETA: {z.estimatedMinutes}</div>
                  <div className="text-[10px] text-white/30 font-normal">Min Order: ₦{z.minOrderAmount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PROMOS */}
        {activeTab === 'promos' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-white uppercase tracking-tight">Active Promotions & Discount Codes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {promos.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-[#161616] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-base text-[#E65100] font-mono">{p.code}</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Active</span>
                  </div>
                  <div className="text-xs text-white/80 font-normal">
                    Discount: {p.discountType === 'percentage' ? `${p.discountValue}% Off` : `₦${p.discountValue} Off`}
                  </div>
                  <div className="text-[10px] text-white/40 font-normal">Used {p.usageCount} times</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-white uppercase tracking-tight">Sales & Order Analytics</h2>
            <div className="p-6 rounded-3xl bg-[#161616] border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Weekly Revenue Trend (₦)</h3>
              <div className="flex items-end justify-between gap-4 h-48 pt-4">
                {analytics?.salesByDay.map((d) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div
                      className="w-full bg-[#E65100] rounded-t-xl transition-all"
                      style={{ height: `${(d.revenue / 500000) * 100}%` }}
                    />
                    <span className="text-xs font-bold text-white/40">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-white uppercase tracking-tight">Customer Reviews</h2>
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-[#161616] border border-white/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white text-sm uppercase">{rev.customerName}</span>
                    <span className="text-amber-400 text-xs font-bold">{"⭐".repeat(rev.rating)}</span>
                  </div>
                  <p className="text-xs text-white/80 font-normal">"{rev.comment}"</p>
                  <div className="text-[10px] text-white/40 font-normal">{rev.foodItemName} • {rev.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* DETAILED ORDER MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-[#161616] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-white uppercase tracking-tight">Order Details #{selectedOrder.orderNumber}</h3>
                <span className="text-xs text-[#E65100] font-extrabold uppercase tracking-wider">{selectedOrder.status}</span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address */}
            <div className="grid grid-cols-2 gap-4 text-xs text-white/80">
              <div className="p-3 bg-[#0F0F0F] rounded-xl space-y-1 border border-white/10">
                <div className="font-bold text-[#E65100] uppercase tracking-wider text-[10px]">Customer</div>
                <div className="font-bold text-white uppercase">{selectedOrder.customer.fullName}</div>
                <div className="font-normal">Phone: {selectedOrder.customer.phone}</div>
              </div>

              <div className="p-3 bg-[#0F0F0F] rounded-xl space-y-1 border border-white/10">
                <div className="font-bold text-[#E65100] uppercase tracking-wider text-[10px]">Delivery Address</div>
                <div className="font-bold text-white uppercase">{selectedOrder.delivery.area}</div>
                <div className="font-normal">{selectedOrder.delivery.address}</div>
              </div>
            </div>

            {/* Status Change Buttons */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-white/40 uppercase tracking-widest">Change Order Status</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { status: 'CONFIRMED', label: 'Accept Order' },
                  { status: 'PREPARING', label: 'Start Preparing' },
                  { status: 'READY', label: 'Mark as Ready' },
                  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
                  { status: 'DELIVERED', label: 'Mark Delivered' },
                  { status: 'CANCELLED', label: 'Cancel Order' },
                ].map((btn) => (
                  <button
                    key={btn.status}
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, btn.status as OrderStatus)}
                    className="py-2 px-3 rounded-xl bg-white/10 hover:bg-[#E65100] hover:text-black text-white font-extrabold text-xs uppercase tracking-wider transition-colors"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rider Assignment Section */}
            <div className="p-4 bg-[#0F0F0F] border border-white/10 rounded-2xl space-y-3">
              <div className="text-xs font-bold text-white/80">
                Assigned Rider: <strong className="text-emerald-400">{selectedOrder.assignedRider?.name || 'None Assigned'}</strong>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Assign Available Rider</label>
                <div className="grid grid-cols-2 gap-2">
                  {riders.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleAssignRiderToOrder(selectedOrder.id, r.id)}
                      className="p-2.5 rounded-xl bg-[#161616] border border-white/10 hover:border-emerald-500 text-left text-xs text-white transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold uppercase">{r.name}</div>
                        <div className="text-[10px] text-white/40 font-normal">{r.status}</div>
                      </div>
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Assign</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
