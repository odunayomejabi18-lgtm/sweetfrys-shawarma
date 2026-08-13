import React from 'react';
import { Flame, Phone, Mail, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onSelectCategory?: (category: string) => void;
  onNavigate?: (page: 'home' | 'menu' | 'track' | 'account') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onNavigate }) => {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10 text-white/60 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#E65100] flex items-center justify-center text-black font-black text-lg italic shadow-lg shadow-[#E65100]/20">
                SF
              </div>
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight uppercase flex items-center gap-1">
                  SWEETFRYS <span className="text-[#E65100]">SHAWARMA</span>
                </span>
                <span className="block text-[10px] tracking-widest text-[#E65100] uppercase font-extrabold -mt-1">
                  SPOT
                </span>
              </div>
            </div>
            <p className="text-white/60 text-xs leading-relaxed font-normal">
              Fresh double-wrapped shawarma & charcoal grills delivered hot to your doorstep.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Open Daily
              </span>
              <span className="text-xs text-white/40 font-normal">10 AM - 11:30 PM</span>
            </div>
          </div>

          {/* Col 2: Fast Category Links */}
          <div>
            <h4 className="text-white font-extrabold text-xs mb-4 tracking-widest uppercase">
              Popular Menu Categories
            </h4>
            <ul className="space-y-2.5 font-medium text-white/60">
              {['Shawarma', 'Grills', 'Suya', 'Fish', 'Chicken', 'Combos'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      if (onNavigate) onNavigate('menu');
                      if (onSelectCategory) onSelectCategory(cat);
                    }}
                    className="hover:text-[#E65100] transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                  >
                    <span className="text-[#E65100] text-xs">›</span>
                    {cat} Specials
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Delivery Zones in Lagos */}
          <div>
            <h4 className="text-white font-extrabold text-xs mb-4 tracking-widest uppercase">
              Express Delivery Locations
            </h4>
            <ul className="space-y-2 text-xs text-white/60">
              <li className="flex items-center gap-2 font-normal">
                <MapPin className="w-3.5 h-3.5 text-[#E65100] shrink-0" />
                Lekki Phase 1 & Ikate (20–30 mins)
              </li>
              <li className="flex items-center gap-2 font-normal">
                <MapPin className="w-3.5 h-3.5 text-[#E65100] shrink-0" />
                Victoria Island & Oniru (20–35 mins)
              </li>
              <li className="flex items-center gap-2 font-normal">
                <MapPin className="w-3.5 h-3.5 text-[#E65100] shrink-0" />
                Ikoyi & Banana Island (25–40 mins)
              </li>
              <li className="flex items-center gap-2 font-normal">
                <MapPin className="w-3.5 h-3.5 text-[#E65100] shrink-0" />
                Ikeja GRA, Maryland & Yaba (30–45 mins)
              </li>
              <li className="flex items-center gap-2 font-normal">
                <MapPin className="w-3.5 h-3.5 text-[#E65100] shrink-0" />
                Chevron, Ajah & Sangotedo (35–50 mins)
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Hotline */}
          <div className="space-y-4">
            <h4 className="text-white font-extrabold text-xs mb-4 tracking-widest uppercase">
              Direct Contact & Support
            </h4>
            <div className="space-y-3">
              <a
                href="tel:08007429276"
                className="flex items-center gap-3 p-3 rounded-xl bg-[#161616] border border-white/10 hover:border-[#E65100]/50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#E65100]/20 text-[#E65100] flex items-center justify-center group-hover:bg-[#E65100] group-hover:text-black transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-white/40 uppercase font-extrabold tracking-widest">Call / Order Line</div>
                  <div className="font-extrabold text-white text-xs">0800-SHAWARMA (0800 742 9276)</div>
                </div>
              </a>

              <a
                href="https://wa.me/2348023456789"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 hover:bg-emerald-950/80 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-emerald-400 uppercase font-extrabold tracking-widest">WhatsApp Orders & Help</div>
                  <div className="font-extrabold text-white text-xs">+234 802 345 6789</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Security & SEO Banner */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-white/40 font-normal">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secured Online Payments via Paystack, Flutterwave, Cards & Bank Transfers</span>
          </div>

          <div className="text-xs text-white/40 flex items-center gap-1 font-normal">
            Built for Nigerian Food Lovers with <Heart className="w-3.5 h-3.5 text-[#E65100] fill-[#E65100]" /> in Lagos
          </div>
        </div>
      </div>
    </footer>
  );
};
