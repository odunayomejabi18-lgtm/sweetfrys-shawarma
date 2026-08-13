import React from 'react';
import { Flame, Clock, ShieldCheck, ArrowRight, Star, ShoppingBag, Truck, Utensils, CheckCircle2 } from 'lucide-react';
import { FoodItem } from '../types';

interface HeroProps {
  onOrderNow: () => void;
  onSelectFood: (food: FoodItem) => void;
  popularItems: FoodItem[];
}

export const Hero: React.FC<HeroProps> = ({ onOrderNow, onSelectFood, popularItems }) => {
  return (
    <div className="relative overflow-hidden bg-[#0A0A0A] pt-8 pb-16">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#E65100]/10 via-red-900/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#161616] border border-white/10 px-3.5 py-1.5 rounded-full text-[#E65100] text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <Flame className="w-4 h-4 text-[#E65100] animate-pulse" />
              <span>Sweetfrys Shawarma Spot</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] uppercase">
              Hot Shawarma. <br className="hidden sm:inline" />
              <span className="font-serif italic text-[#F5F5F0] font-normal lowercase text-5xl sm:text-6xl lg:text-7xl normal-case block sm:inline">
                fresh grills.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-white/70 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Freshly grilled shawarma, spicy suya, catfish & loaded fries delivered hot in 25 mins.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOrderNow}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#E65100] hover:bg-[#FF6D00] text-black font-extrabold text-xs uppercase tracking-widest shadow-xl shadow-[#E65100]/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOrderNow}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <Utensils className="w-4 h-4 text-[#E65100]" />
                <span>View Menu</span>
              </button>
            </div>

            {/* Micro Trust Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-center lg:text-left">
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">25 MINS</div>
                <div className="text-[11px] text-white/40 font-semibold uppercase tracking-wider">Fast Delivery</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#E65100] flex items-center justify-center lg:justify-start gap-1">
                  4.9 <Star className="w-4 h-4 fill-[#E65100]" />
                </div>
                <div className="text-[11px] text-white/40 font-semibold uppercase tracking-wider">Rating</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400">100% HOT</div>
                <div className="text-[11px] text-white/40 font-semibold uppercase tracking-wider">Freshly Wrapped</div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden border border-white/10 bg-[#161616] p-3 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=1000&q=80"
                alt="Nigerian Special Chicken Shawarma"
                className="w-full h-80 sm:h-96 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
              />

              {/* Floating Badge on Image */}
              <div className="absolute top-6 right-6 bg-[#0F0F0F]/90 backdrop-blur-md text-white px-3.5 py-2 rounded-xl border border-white/10 flex items-center gap-2 shadow-lg">
                <Flame className="w-4 h-4 text-[#E65100] fill-[#E65100] animate-bounce" />
                <div>
                  <div className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Today's Best Seller</div>
                  <div className="text-xs font-bold text-white">Special Chicken Shawarma</div>
                </div>
              </div>

              {/* Floating Price Tag */}
              <div className="absolute bottom-6 left-6 bg-[#E65100] text-black px-4 py-2 rounded-xl shadow-xl">
                <span className="text-[10px] font-bold block uppercase tracking-wider opacity-80">Starting from</span>
                <span className="text-lg font-black">₦5,500</span>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-16 pt-10 border-t border-white/10">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight">How It Works</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                title: "CHOOSE MEAL",
                desc: "Select shawarma, grills, or sides.",
                icon: Utensils,
              },
              {
                step: "02",
                title: "CUSTOMIZE",
                desc: "Pick spice level & extra add-ons.",
                icon: ShoppingBag,
              },
              {
                step: "03",
                title: "FRESH GRILL",
                desc: "Flame-grilled to order instantly.",
                icon: Flame,
              },
              {
                step: "04",
                title: "FAST DELIVERY",
                desc: "Tracked live to your doorstep.",
                icon: Truck,
              },
            ].map((s) => (
              <div
                key={s.step}
                className="bg-[#161616] border border-white/5 p-5 rounded-2xl relative group hover:border-[#E65100]/40 transition-all"
              >
                <div className="text-xl font-black text-white/10 group-hover:text-[#E65100]/30 transition-colors absolute top-4 right-4">
                  {s.step}
                </div>
                <div className="w-9 h-9 rounded-xl bg-[#E65100]/10 text-[#E65100] flex items-center justify-center mb-3 group-hover:bg-[#E65100] group-hover:text-black transition-colors">
                  <s.icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">{s.title}</h4>
                <p className="text-xs text-white/50 font-normal">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
