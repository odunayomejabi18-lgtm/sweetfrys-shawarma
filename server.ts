import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import {
  INITIAL_MENU_ITEMS,
  INITIAL_DELIVERY_ZONES,
  INITIAL_DELIVERY_AGENTS,
  INITIAL_PROMOS,
  INITIAL_REVIEWS,
  SAMPLE_ORDERS
} from "./src/data/initialData.js";
import { Order, FoodItem, DeliveryAgent, DeliveryZone, PromoCode, Review, OrderStatus } from "./src/types.js";

// In-Memory Data Store with Initial State
let menuItems: FoodItem[] = [...INITIAL_MENU_ITEMS];
let deliveryZones: DeliveryZone[] = [...INITIAL_DELIVERY_ZONES];
let deliveryAgents: DeliveryAgent[] = [...INITIAL_DELIVERY_AGENTS];
let promoCodes: PromoCode[] = [...INITIAL_PROMOS];
let customerReviews: Review[] = [...INITIAL_REVIEWS];
let ordersStore: Order[] = [...SAMPLE_ORDERS];

let nextOrderCounter = 1026;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ENDPOINTS ---

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", appName: "Lagos Shawarma & Grill API" });
  });

  // 1. MENU
  app.get("/api/menu", (_req, res) => {
    res.json(menuItems);
  });

  app.post("/api/menu", (req, res) => {
    const newItem: FoodItem = {
      id: `food-${Date.now()}`,
      rating: 5.0,
      prepTimeMinutes: 15,
      available: true,
      ...req.body
    };
    menuItems.unshift(newItem);
    res.status(201).json(newItem);
  });

  app.put("/api/menu/:id", (req, res) => {
    const { id } = req.params;
    const index = menuItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      menuItems[index] = { ...menuItems[index], ...req.body };
      return res.json(menuItems[index]);
    }
    res.status(404).json({ error: "Menu item not found" });
  });

  app.delete("/api/menu/:id", (req, res) => {
    const { id } = req.params;
    menuItems = menuItems.filter((item) => item.id !== id);
    res.json({ success: true, message: "Item deleted" });
  });

  // 2. DELIVERY ZONES
  app.get("/api/zones", (_req, res) => {
    res.json(deliveryZones);
  });

  app.post("/api/zones", (req, res) => {
    const newZone: DeliveryZone = {
      id: `zone-${Date.now()}`,
      ...req.body
    };
    deliveryZones.push(newZone);
    res.status(201).json(newZone);
  });

  app.put("/api/zones/:id", (req, res) => {
    const { id } = req.params;
    const idx = deliveryZones.findIndex((z) => z.id === id);
    if (idx !== -1) {
      deliveryZones[idx] = { ...deliveryZones[idx], ...req.body };
      return res.json(deliveryZones[idx]);
    }
    res.status(404).json({ error: "Zone not found" });
  });

  app.delete("/api/zones/:id", (req, res) => {
    const { id } = req.params;
    deliveryZones = deliveryZones.filter((z) => z.id !== id);
    res.json({ success: true });
  });

  // 3. DELIVERY AGENTS / RIDERS
  app.get("/api/riders", (_req, res) => {
    res.json(deliveryAgents);
  });

  app.post("/api/riders", (req, res) => {
    const newRider: DeliveryAgent = {
      id: `rider-${Date.now()}`,
      status: 'AVAILABLE',
      totalDeliveries: 0,
      rating: 5.0,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      ...req.body
    };
    deliveryAgents.push(newRider);
    res.status(201).json(newRider);
  });

  app.put("/api/riders/:id", (req, res) => {
    const { id } = req.params;
    const idx = deliveryAgents.findIndex((r) => r.id === id);
    if (idx !== -1) {
      deliveryAgents[idx] = { ...deliveryAgents[idx], ...req.body };
      return res.json(deliveryAgents[idx]);
    }
    res.status(404).json({ error: "Rider not found" });
  });

  // 4. PROMO CODES
  app.get("/api/promos", (_req, res) => {
    res.json(promoCodes);
  });

  app.post("/api/promos/validate", (req, res) => {
    const { code, subtotal, deliveryFee } = req.body;
    const promo = promoCodes.find((p) => p.code.toUpperCase() === (code || "").trim().toUpperCase() && p.isActive);
    if (!promo) {
      return res.status(400).json({ error: "Invalid or expired promo code" });
    }
    if (subtotal < promo.minSubtotal) {
      return res.status(400).json({
        error: `Minimum subtotal of ₦${promo.minSubtotal.toLocaleString()} required for code ${promo.code}`
      });
    }

    let discount = 0;
    if (promo.discountType === "percentage") {
      discount = Math.round((subtotal * promo.discountValue) / 100);
    } else if (promo.discountType === "fixed") {
      discount = promo.discountValue;
    } else if (promo.discountType === "free_delivery") {
      discount = deliveryFee || 1500;
    }

    res.json({
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      calculatedDiscount: discount
    });
  });

  app.post("/api/promos", (req, res) => {
    const newPromo: PromoCode = {
      id: `promo-${Date.now()}`,
      usageCount: 0,
      isActive: true,
      ...req.body
    };
    promoCodes.push(newPromo);
    res.status(201).json(newPromo);
  });

  // 5. REVIEWS
  app.get("/api/reviews", (_req, res) => {
    res.json(customerReviews);
  });

  app.post("/api/reviews", (req, res) => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      date: 'Just now',
      verifiedOrder: true,
      ...req.body
    };
    customerReviews.unshift(newReview);
    res.status(201).json(newReview);
  });

  // 6. ORDERS
  app.get("/api/orders", (req, res) => {
    const { status, riderId, phone, query } = req.query;
    let filtered = [...ordersStore];

    if (status) {
      filtered = filtered.filter((o) => o.status === status);
    }
    if (riderId) {
      filtered = filtered.filter((o) => o.assignedRiderId === riderId);
    }
    if (phone) {
      filtered = filtered.filter((o) => o.customer.phone.includes(phone as string));
    }
    if (query) {
      const q = (query as string).toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.fullName.toLowerCase().includes(q) ||
          o.customer.phone.includes(q)
      );
    }

    res.json(filtered);
  });

  app.get("/api/orders/:id", (req, res) => {
    const { id } = req.params;
    const order = ordersStore.find((o) => o.id === id || o.orderNumber.toLowerCase() === id.toLowerCase());
    if (order) {
      return res.json(order);
    }
    res.status(404).json({ error: "Order not found" });
  });

  app.post("/api/orders", (req, res) => {
    const orderNumber = `SHW-${nextOrderCounter++}`;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      status: 'NEW',
      paymentStatus: req.body.paymentMethod === 'cash_on_delivery' ? 'PENDING' : 'PAID',
      statusHistory: [
        {
          status: 'NEW',
          timestamp: timeString,
          note: 'Order placed online successfully'
        }
      ],
      riderCoordinates: { lat: 6.4485, lng: 3.4722 },
      ...req.body
    };

    ordersStore.unshift(newOrder);
    res.status(201).json(newOrder);
  });

  app.put("/api/orders/:id/status", (req, res) => {
    const { id } = req.params;
    const { status, note } = req.body;
    const idx = ordersStore.findIndex((o) => o.id === id || o.orderNumber === id);

    if (idx !== -1) {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const current = ordersStore[idx];

      const updatedHistory = [
        ...current.statusHistory,
        {
          status: status as OrderStatus,
          timestamp: timeString,
          note: note || `Status updated to ${status}`
        }
      ];

      ordersStore[idx] = {
        ...current,
        status: status as OrderStatus,
        updatedAt: now.toISOString(),
        statusHistory: updatedHistory
      };

      // If order is completed/delivered, update rider status if assigned
      if (status === 'DELIVERED' && current.assignedRiderId) {
        const rIdx = deliveryAgents.findIndex((r) => r.id === current.assignedRiderId);
        if (rIdx !== -1) {
          deliveryAgents[rIdx].status = 'AVAILABLE';
          deliveryAgents[rIdx].activeDeliveryId = undefined;
          deliveryAgents[rIdx].totalDeliveries += 1;
        }
      }

      return res.json(ordersStore[idx]);
    }

    res.status(404).json({ error: "Order not found" });
  });

  app.put("/api/orders/:id/assign-rider", (req, res) => {
    const { id } = req.params;
    const { riderId } = req.body;

    const oIdx = ordersStore.findIndex((o) => o.id === id || o.orderNumber === id);
    const rIdx = deliveryAgents.findIndex((r) => r.id === riderId);

    if (oIdx === -1) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (rIdx === -1) {
      return res.status(404).json({ error: "Rider not found" });
    }

    const rider = deliveryAgents[rIdx];
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Update rider
    deliveryAgents[rIdx].status = 'ON_DELIVERY';
    deliveryAgents[rIdx].activeDeliveryId = ordersStore[oIdx].orderNumber;

    // Update order
    ordersStore[oIdx].assignedRiderId = rider.id;
    ordersStore[oIdx].assignedRider = deliveryAgents[rIdx];
    if (ordersStore[oIdx].status === 'NEW' || ordersStore[oIdx].status === 'CONFIRMED' || ordersStore[oIdx].status === 'PREPARING') {
      ordersStore[oIdx].status = 'READY';
    }
    ordersStore[oIdx].statusHistory.push({
      status: ordersStore[oIdx].status,
      timestamp: timeString,
      note: `Assigned rider ${rider.name} (${rider.vehicleNumber})`
    });

    res.json(ordersStore[oIdx]);
  });

  // 7. ANALYTICS
  app.get("/api/analytics", (_req, res) => {
    const totalRevenue = ordersStore.reduce((sum, o) => sum + (o.paymentStatus === 'PAID' ? o.total : 0), 0);
    const totalOrders = ordersStore.length;
    const pendingOrders = ordersStore.filter((o) => o.status === 'NEW').length;
    const preparingOrders = ordersStore.filter((o) => o.status === 'PREPARING' || o.status === 'CONFIRMED').length;
    const outForDeliveryOrders = ordersStore.filter((o) => o.status === 'OUT_FOR_DELIVERY' || o.status === 'READY').length;
    const completedOrders = ordersStore.filter((o) => o.status === 'DELIVERED').length;
    const activeRiders = deliveryAgents.filter((r) => r.status === 'ON_DELIVERY' || r.status === 'AVAILABLE').length;

    res.json({
      totalRevenue,
      totalOrders,
      pendingOrders,
      preparingOrders,
      outForDeliveryOrders,
      completedOrders,
      activeRiders,
      averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
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
    });
  });

  // --- VITE / STATIC SERVING ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Lagos Shawarma & Grill Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
