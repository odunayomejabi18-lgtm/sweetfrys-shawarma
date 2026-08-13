import React from 'react';
import { Flame, ShoppingBag, MapPin, User, ShieldCheck, Bike, Search, Menu, X, PhoneCall } from 'lucide-react';
import { CartItem } from '../types';

interface NavbarProps {
  currentRole: 'customer' | 'admin' | 'rider';
  setCurrentRole: (role: 'customer' | 'admin' | 'rider') => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
  onNavigateCustomer: (page: 'home' | 'menu' | 'track' | 'account') => void;
  customerPage: 'home' | 'menu' | 'track' | 'account';
  activeOrderCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  setCurrentRole,
  cartItems,
  onOpenCart,
  onNavigateCustomer,
  customerPage,
  activeOrderCount = 0
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#0F0F0F]/95 backdrop-blur-md border-b border-white/10">
      {/* Top Role Switcher Banner */}
      <div className="bg-[#050505] border-b border-white/5 px-4 py-1.5 text-xs text-white/60">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium text-[#F5F5F0]">Sweetfrys Express</span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="hidden sm:inline text-white/60">Hotline: <a href="tel:080079338379" className="text-[#E65100] font-bold hover:underline">0800-SWEETFRYS</a></span>
          </div>

          <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-lg border border-white/10">
            <span className="text-[11px] text-white/40 px-1 font-semibold">Demo Role:</span>
            <button
              onClick={() => setCurrentRole('customer')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                currentRole === 'customer'
                  ? 'bg-[#E65100] text-black shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Customer
            </button>
            <button
              onClick={() => setCurrentRole('admin')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                currentRole === 'admin'
                  ? 'bg-[#D32F2F] text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
              {activeOrderCount > 0 && (
                <span className="bg-white text-black px-1.5 py-0.2 text-[10px] rounded-full font-bold">
                  {activeOrderCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentRole('rider')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                currentRole === 'rider'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              Rider Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => {
            setCurrentRole('customer');
            onNavigateCustomer('home');
          }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 bg-[#E65100] rounded-xl flex items-center justify-center font-black text-black text-lg italic shadow-lg shadow-[#E65100]/20 group-hover:scale-105 transition-transform">
            SF
          </div>
          <div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white uppercase flex items-center gap-1">
              SWEETFRYS <span className="text-[#E65100]">SHAWARMA</span>
            </span>
            <span className="block text-[10px] tracking-widest text-[#E65100] uppercase font-extrabold -mt-1">
              SPOT
            </span>
          </div>
        </div>

        {/* Customer Nav Links */}
        {currentRole === 'customer' && (
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-white/60">
            <button
              onClick={() => onNavigateCustomer('home')}
              className={`hover:text-white transition-colors pb-1 ${
                customerPage === 'home' ? 'text-white border-b-2 border-[#E65100]' : ''
              }`}
            >
              Menu
            </button>
            <button
              onClick={() => onNavigateCustomer('menu')}
              className={`hover:text-white transition-colors pb-1 ${
                customerPage === 'menu' ? 'text-white border-b-2 border-[#E65100]' : ''
              }`}
            >
              Full Menu
            </button>
            <button
              onClick={() => onNavigateCustomer('track')}
              className={`hover:text-white transition-colors pb-1 flex items-center gap-1.5 ${
                customerPage === 'track' ? 'text-white border-b-2 border-[#E65100]' : ''
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Orders
            </button>
            <button
              onClick={() => onNavigateCustomer('account')}
              className={`hover:text-white transition-colors pb-1 flex items-center gap-1.5 ${
                customerPage === 'account' ? 'text-white border-b-2 border-[#E65100]' : ''
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Account
            </button>
          </nav>
        )}

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          {currentRole === 'customer' && (
            <button
              onClick={onOpenCart}
              className="relative bg-[#E65100] hover:bg-[#FF6D00] text-black font-extrabold uppercase tracking-widest text-xs px-4 py-2.5 rounded-xl flex items-center gap-2.5 shadow-lg shadow-[#E65100]/20 transition-all transform hover:scale-[1.02] active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 ? (
                <span className="bg-black/20 text-black text-xs px-2 py-0.5 rounded-md font-black">
                  ₦{cartSubtotal.toLocaleString()} ({cartCount})
                </span>
              ) : (
                <span className="bg-black/20 text-black text-xs px-2 py-0.5 rounded-md font-black">
                  0
                </span>
              )}
            </button>
          )}

          {/* Mobile menu toggle button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white/60 hover:text-white bg-[#161616] border border-white/10 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F0F0F] border-b border-white/10 px-4 py-4 space-y-3">
          {currentRole === 'customer' ? (
            <>
              <button
                onClick={() => {
                  onNavigateCustomer('home');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 font-bold uppercase tracking-wider text-xs text-white/80 border-b border-white/5"
              >
                Home
              </button>
              <button
                onClick={() => {
                  onNavigateCustomer('menu');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 font-bold uppercase tracking-wider text-xs text-white/80 border-b border-white/5"
              >
                Browse Menu
              </button>
              <button
                onClick={() => {
                  onNavigateCustomer('track');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 font-bold uppercase tracking-wider text-xs text-emerald-400 border-b border-white/5"
              >
                Track Live Order
              </button>
              <button
                onClick={() => {
                  onNavigateCustomer('account');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 font-bold uppercase tracking-wider text-xs text-white/80"
              >
                My Account & History
              </button>
            </>
          ) : (
            <div className="text-xs text-white/40">
              You are viewing the <span className="text-white font-bold uppercase">{currentRole}</span> interface.
            </div>
          )}
        </div>
      )}
    </header>
  );
};
