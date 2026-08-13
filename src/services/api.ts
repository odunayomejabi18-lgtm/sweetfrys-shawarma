import { FoodItem, DeliveryZone, DeliveryAgent, PromoCode, Review, Order, AnalyticsSummary, OrderStatus } from '../types';
import { INITIAL_MENU_ITEMS, INITIAL_DELIVERY_ZONES, INITIAL_DELIVERY_AGENTS, INITIAL_PROMOS, INITIAL_REVIEWS, SAMPLE_ORDERS } from '../data/initialData';

// Fallback local memory if server fetch fails
let localOrders: Order[] = [...SAMPLE_ORDERS];
let localMenu: FoodItem[] = [...INITIAL_MENU_ITEMS];
let localZones: DeliveryZone[] = [...INITIAL_DELIVERY_ZONES];
let localRiders: DeliveryAgent[] = [...INITIAL_DELIVERY_AGENTS];
let localPromos: PromoCode[] = [...INITIAL_PROMOS];
let localReviews: Review[] = [...INITIAL_REVIEWS];

export const api = {
  // Menu
  async getMenuItems(): Promise<FoodItem[]> {
    try {
      const res = await fetch('/api/menu');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Using fallback menu", e);
    }
    return localMenu;
  },

  async addMenuItem(item: Partial<FoodItem>): Promise<FoodItem> {
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Failed posting menu", e);
    }
    const newItem = { id: `food-${Date.now()}`, rating: 5.0, prepTimeMinutes: 15, available: true, ...item } as FoodItem;
    localMenu.unshift(newItem);
    return newItem;
  },

  async updateMenuItem(id: string, updates: Partial<FoodItem>): Promise<FoodItem> {
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Failed updating menu", e);
    }
    const idx = localMenu.findIndex(m => m.id === id);
    if (idx !== -1) {
      localMenu[idx] = { ...localMenu[idx], ...updates };
      return localMenu[idx];
    }
    throw new Error("Item not found");
  },

  async deleteMenuItem(id: string): Promise<void> {
    try {
      await fetch(`/api/menu/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn(e);
    }
    localMenu = localMenu.filter(m => m.id !== id);
  },

  // Zones
  async getZones(): Promise<DeliveryZone[]> {
    try {
      const res = await fetch('/api/zones');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Using fallback zones", e);
    }
    return localZones;
  },

  async addZone(zone: Partial<DeliveryZone>): Promise<DeliveryZone> {
    try {
      const res = await fetch('/api/zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(zone)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(e);
    }
    const nz = { id: `zone-${Date.now()}`, fee: 1500, estimatedMinutes: '30 mins', minOrderAmount: 3000, name: 'New Area', ...zone } as DeliveryZone;
    localZones.push(nz);
    return nz;
  },

  // Riders
  async getRiders(): Promise<DeliveryAgent[]> {
    try {
      const res = await fetch('/api/riders');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Using fallback riders", e);
    }
    return localRiders;
  },

  async updateRider(id: string, updates: Partial<DeliveryAgent>): Promise<DeliveryAgent> {
    try {
      const res = await fetch(`/api/riders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(e);
    }
    const idx = localRiders.findIndex(r => r.id === id);
    if (idx !== -1) {
      localRiders[idx] = { ...localRiders[idx], ...updates };
      return localRiders[idx];
    }
    throw new Error("Rider not found");
  },

  // Promos
  async getPromos(): Promise<PromoCode[]> {
    try {
      const res = await fetch('/api/promos');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Using fallback promos", e);
    }
    return localPromos;
  },

  async validatePromo(code: string, subtotal: number, deliveryFee: number) {
    try {
      const res = await fetch('/api/promos/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal, deliveryFee })
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.error || 'Invalid code');
    } catch (e: any) {
      const promo = localPromos.find(p => p.code.toUpperCase() === code.trim().toUpperCase() && p.isActive);
      if (!promo) throw new Error(e.message || "Invalid or expired promo code");
      let discount = 0;
      if (promo.discountType === 'percentage') discount = Math.round((subtotal * promo.discountValue) / 100);
      else if (promo.discountType === 'fixed') discount = promo.discountValue;
      else if (promo.discountType === 'free_delivery') discount = deliveryFee;
      return { code: promo.code, discountType: promo.discountType, calculatedDiscount: discount };
    }
  },

  // Orders
  async getOrders(params?: { status?: string; riderId?: string; phone?: string; query?: string }): Promise<Order[]> {
    try {
      const searchParams = new URLSearchParams(params as any).toString();
      const res = await fetch(`/api/orders?${searchParams}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Using fallback orders", e);
    }
    let res = [...localOrders];
    if (params?.status) res = res.filter(o => o.status === params.status);
    if (params?.riderId) res = res.filter(o => o.assignedRiderId === params.riderId);
    if (params?.phone) res = res.filter(o => o.customer.phone.includes(params.phone!));
    return res;
  },

  async getOrderById(id: string): Promise<Order> {
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(e);
    }
    const order = localOrders.find(o => o.id === id || o.orderNumber.toLowerCase() === id.toLowerCase());
    if (order) return order;
    throw new Error("Order not found");
  },

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Failed creating order via API, saving locally", e);
    }
    const orderNum = `SHW-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrd: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'NEW',
      paymentStatus: orderData.paymentMethod === 'cash_on_delivery' ? 'PENDING' : 'PAID',
      statusHistory: [
        {
          status: 'NEW',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: 'Order placed online'
        }
      ],
      riderCoordinates: { lat: 6.4485, lng: 3.4722 },
      ...orderData
    } as Order;
    localOrders.unshift(newOrd);
    return newOrd;
  },

  async updateOrderStatus(id: string, status: OrderStatus, note?: string): Promise<Order> {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Updating status locally", e);
    }
    const idx = localOrders.findIndex(o => o.id === id || o.orderNumber === id);
    if (idx !== -1) {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      localOrders[idx].status = status;
      localOrders[idx].updatedAt = new Date().toISOString();
      localOrders[idx].statusHistory.push({ status, timestamp: timeStr, note });
      return localOrders[idx];
    }
    throw new Error("Order not found");
  },

  async assignRider(orderId: string, riderId: string): Promise<Order> {
    try {
      const res = await fetch(`/api/orders/${orderId}/assign-rider`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ riderId })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Assigning rider locally", e);
    }
    const oIdx = localOrders.findIndex(o => o.id === orderId || o.orderNumber === orderId);
    const rIdx = localRiders.findIndex(r => r.id === riderId);
    if (oIdx !== -1 && rIdx !== -1) {
      localRiders[rIdx].status = 'ON_DELIVERY';
      localRiders[rIdx].activeDeliveryId = localOrders[oIdx].orderNumber;
      localOrders[oIdx].assignedRiderId = localRiders[rIdx].id;
      localOrders[oIdx].assignedRider = localRiders[rIdx];
      localOrders[oIdx].status = 'READY';
      return localOrders[oIdx];
    }
    throw new Error("Failed assigning rider");
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsSummary> {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(e);
    }
    const totalRevenue = localOrders.reduce((sum, o) => sum + (o.paymentStatus === 'PAID' ? o.total : 0), 0);
    return {
      totalRevenue,
      totalOrders: localOrders.length,
      pendingOrders: localOrders.filter(o => o.status === 'NEW').length,
      preparingOrders: localOrders.filter(o => o.status === 'PREPARING' || o.status === 'CONFIRMED').length,
      outForDeliveryOrders: localOrders.filter(o => o.status === 'OUT_FOR_DELIVERY' || o.status === 'READY').length,
      completedOrders: localOrders.filter(o => o.status === 'DELIVERED').length,
      activeRiders: localRiders.filter(r => r.status === 'ON_DELIVERY' || r.status === 'AVAILABLE').length,
      averageOrderValue: localOrders.length > 0 ? Math.round(totalRevenue / localOrders.length) : 0,
      mostOrderedItem: "Special Chicken Shawarma",
      salesByDay: [
        { day: "Mon", revenue: 145000, orders: 12 },
        { day: "Tue", revenue: 182000, orders: 15 },
        { day: "Wed", revenue: 210000, orders: 18 },
        { day: "Thu", revenue: 245000, orders: 21 },
        { day: "Fri", revenue: 390000, orders: 32 },
        { day: "Sat", revenue: 480000, orders: 40 },
        { day: "Sun", revenue: 420000, orders: 35 }
      ]
    };
  },

  // Reviews
  async getReviews(): Promise<Review[]> {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(e);
    }
    return localReviews;
  },

  async addReview(rev: Partial<Review>): Promise<Review> {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rev)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(e);
    }
    const newR = { id: `rev-${Date.now()}`, date: 'Just now', verifiedOrder: true, customerName: 'Customer', rating: 5, comment: '', ...rev } as Review;
    localReviews.unshift(newR);
    return newR;
  }
};
