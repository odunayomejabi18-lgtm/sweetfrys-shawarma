import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { ProductCustomizationModal } from './components/ProductCustomizationModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmation } from './components/OrderConfirmation';
import { OrderTracking } from './components/OrderTracking';
import { CustomerAccount } from './components/CustomerAccount';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { RiderPortal } from './components/rider/RiderPortal';

import { FoodItem, CartItem, Order, DeliveryZone } from './types';
import { api } from './services/api';

export default function App() {
  // Global Role State ('customer' | 'admin' | 'rider')
  const [currentRole, setCurrentRole] = useState<'customer' | 'admin' | 'rider'>('customer');
  const [customerPage, setCustomerPage] = useState<'home' | 'menu' | 'track' | 'account' | 'confirmation'>('home');

  // Menu & Zone data
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Shopping Cart & Modals
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [selectedFoodForCustomization, setSelectedFoodForCustomization] = useState<FoodItem | null>(null);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedPromoCode, setAppliedPromoCode] = useState('');

  // Orders State
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | undefined>('ord-1024');
  const [activeOrderCount, setActiveOrderCount] = useState(1);

  // Load initial data
  useEffect(() => {
    async function init() {
      try {
        const [mRes, zRes] = await Promise.all([api.getMenuItems(), api.getZones()]);
        setMenuItems(mRes);
        setZones(zRes);
        if (zRes.length > 0) setSelectedZone(zRes[0]);
      } catch (e) {
        console.error("Init data load error", e);
      }
    }
    init();
  }, []);

  // Handlers
  const handleOpenCustomization = (food: FoodItem) => {
    setSelectedFoodForCustomization(food);
    setIsCustomizationOpen(true);
  };

  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => {
      // Check if identical item with same protein, size, spice, add-ons exists
      const existingIdx = prev.findIndex(
        (i) =>
          i.foodId === item.foodId &&
          i.protein === item.protein &&
          i.size === item.size &&
          i.spiceLevel === item.spiceLevel &&
          JSON.stringify(i.selectedAddOns) === JSON.stringify(item.selectedAddOns)
      );

      if (existingIdx !== -1) {
        const updated = [...prev];
        const ex = updated[existingIdx];
        const newQty = ex.quantity + item.quantity;
        updated[existingIdx] = {
          ...ex,
          quantity: newQty,
          totalPrice: ex.unitPrice * newQty,
        };
        return updated;
      }
      return [...prev, item];
    });

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleOrderComplete = (order: Order) => {
    setConfirmedOrder(order);
    setCartItems([]);
    setIsCheckoutOpen(false);
    setTrackingOrderId(order.id);
    setActiveOrderCount((prev) => prev + 1);
    setCustomerPage('confirmation');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] flex flex-col font-sans selection:bg-[#E65100] selection:text-black">
      {/* Navigation Header */}
      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigateCustomer={(page) => setCustomerPage(page)}
        customerPage={customerPage}
        activeOrderCount={activeOrderCount}
      />

      {/* Main Body View Switching based on Role and Customer Page */}
      <main className="flex-1">
        {currentRole === 'customer' && (
          <>
            {customerPage === 'home' && (
              <>
                <Hero
                  onOrderNow={() => {
                    const el = document.getElementById('menu-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else setCustomerPage('menu');
                  }}
                  onSelectFood={handleOpenCustomization}
                  popularItems={menuItems.filter((i) => i.isPopular)}
                />
                <MenuSection
                  menuItems={menuItems}
                  onSelectFood={handleOpenCustomization}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              </>
            )}

            {customerPage === 'menu' && (
              <MenuSection
                menuItems={menuItems}
                onSelectFood={handleOpenCustomization}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            )}

            {customerPage === 'track' && (
              <OrderTracking
                orderId={trackingOrderId}
                onBackToMenu={() => setCustomerPage('menu')}
              />
            )}

            {customerPage === 'account' && (
              <CustomerAccount
                onSelectFood={handleOpenCustomization}
                onTrackOrder={(orderId) => {
                  setTrackingOrderId(orderId);
                  setCustomerPage('track');
                }}
                menuItems={menuItems}
              />
            )}

            {customerPage === 'confirmation' && confirmedOrder && (
              <OrderConfirmation
                order={confirmedOrder}
                onTrackOrder={(orderId) => {
                  setTrackingOrderId(orderId);
                  setCustomerPage('track');
                }}
                onContinueShopping={() => setCustomerPage('home')}
              />
            )}
          </>
        )}

        {currentRole === 'admin' && <AdminDashboard />}

        {currentRole === 'rider' && <RiderPortal />}
      </main>

      {/* Global Product Customization Modal */}
      <ProductCustomizationModal
        food={selectedFoodForCustomization}
        isOpen={isCustomizationOpen}
        onClose={() => setIsCustomizationOpen(false)}
        onAddToCart={handleAddToCart}
      />

      {/* Global Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        zones={zones}
        selectedZone={selectedZone}
        setSelectedZone={setSelectedZone}
        appliedDiscount={appliedDiscount}
        setAppliedDiscount={setAppliedDiscount}
        appliedPromoCode={appliedPromoCode}
        setAppliedPromoCode={setAppliedPromoCode}
      />

      {/* Global Multi-step Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        zones={zones}
        selectedZone={selectedZone}
        appliedDiscount={appliedDiscount}
        onOrderComplete={handleOrderComplete}
      />

      {/* Footer (Rendered in Customer View) */}
      {currentRole === 'customer' && (
        <Footer
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onNavigate={(page) => setCustomerPage(page)}
        />
      )}
    </div>
  );
}
