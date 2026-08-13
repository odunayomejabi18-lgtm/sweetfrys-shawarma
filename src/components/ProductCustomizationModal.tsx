import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Flame, Check, Sparkles, MessageSquare } from 'lucide-react';
import { FoodItem, ProteinOption, SizeOption, SpiceLevel, AddOn, CartItem } from '../types';

interface ProductCustomizationModalProps {
  food: FoodItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

export const ProductCustomizationModal: React.FC<ProductCustomizationModalProps> = ({
  food,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!food || !isOpen) return null;

  const [protein, setProtein] = useState<ProteinOption>(
    food.supportedProteins?.[0] || 'chicken'
  );
  const [selectedSize, setSelectedSize] = useState<SizeOption>('regular');
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel>('medium');
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // Reset when food changes
  useEffect(() => {
    if (food) {
      setProtein(food.supportedProteins?.[0] || 'chicken');
      setSelectedSize('regular');
      setSpiceLevel('medium');
      setSelectedAddOns([]);
      setQuantity(1);
      setSpecialInstructions('');
    }
  }, [food]);

  // Calculate live total price
  const sizeObj = food.supportedSizes?.find((s) => s.size === selectedSize);
  const sizeAddOnPrice = sizeObj ? sizeObj.priceAdd : 0;
  const addOnsTotalPrice = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = food.price + sizeAddOnPrice + addOnsTotalPrice;
  const totalPrice = unitPrice * quantity;

  const toggleAddOn = (addOn: AddOn) => {
    if (selectedAddOns.some((a) => a.id === addOn.id)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a.id !== addOn.id));
    } else {
      setSelectedAddOns([...selectedAddOns, addOn]);
    }
  };

  const handleAdd = () => {
    const cartItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      foodId: food.id,
      name: food.name,
      image: food.image,
      unitPrice,
      quantity,
      protein,
      size: selectedSize,
      spiceLevel,
      selectedAddOns,
      specialInstructions: specialInstructions.trim() || undefined,
      totalPrice,
    };
    onAddToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#161616] border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Top Image Banner */}
        <div className="relative h-56 sm:h-64 shrink-0 overflow-hidden bg-black">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-[#0F0F0F]/80 text-white/60 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Category Pill */}
          <div className="absolute top-4 left-4 bg-[#E65100] text-black text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
            {food.category}
          </div>

          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white uppercase">{food.name}</h2>
            <p className="text-xs sm:text-sm text-white/60 mt-1 line-clamp-2 font-normal">
              {food.description}
            </p>
          </div>
        </div>

        {/* Scrollable Customization Form */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#F5F5F0]">
          
          {/* 1. Protein Selection */}
          {food.supportedProteins && food.supportedProteins.length > 0 && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-widest text-[#E65100] flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#E65100]" /> Choose Protein Choice
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'chicken', label: '🍗 Chicken', desc: 'Flame-grilled Tender' },
                  { key: 'beef', label: '🥩 Beef', desc: 'Slow Spiced Strips' },
                  { key: 'mixed', label: '🔥 Mixed', desc: 'Chicken & Beef Duo' },
                ]
                  .filter((p) => food.supportedProteins?.includes(p.key as ProteinOption))
                  .map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setProtein(p.key as ProteinOption)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        protein === p.key
                          ? 'border-[#E65100] bg-[#E65100]/10 text-white shadow-md'
                          : 'border-white/5 bg-white/5 text-white/60 hover:border-white/20'
                      }`}
                    >
                      <div className="text-xs font-bold uppercase tracking-wider">{p.label}</div>
                      <div className="text-[10px] text-white/40 mt-0.5 font-normal">{p.desc}</div>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* 2. Size Selection */}
          {food.supportedSizes && food.supportedSizes.length > 0 && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-widest text-[#E65100]">
                Select Size
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {food.supportedSizes.map((s) => (
                  <button
                    key={s.size}
                    type="button"
                    onClick={() => setSelectedSize(s.size)}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      selectedSize === s.size
                        ? 'border-[#E65100] bg-[#E65100]/10 text-white'
                        : 'border-white/5 bg-white/5 text-white/60 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider">{s.size.replace('_', ' ')}</div>
                      <div className="text-[10px] text-white/40 font-normal">{s.label}</div>
                    </div>
                    {s.priceAdd > 0 ? (
                      <span className="text-xs font-extrabold text-[#E65100]">
                        +₦{s.priceAdd.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-[10px] bg-white/10 text-white/80 px-2 py-0.5 rounded font-bold uppercase">Standard</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Spice Level */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-widest text-[#E65100] flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-red-500" /> Select Pepper & Spice Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { level: 'mild', label: 'Mild 🌶️', desc: 'Light Suya Spice' },
                { level: 'medium', label: 'Medium 🌶️🌶️', desc: 'Standard Nigerian Spice' },
                { level: 'hot', label: 'Hot 🌶️🌶️🌶️', desc: 'Extra Habanero' },
                { level: 'extra_hot', label: 'Extra Hot 🌶️🌶️🌶️🌶️', desc: 'Fire Pepper Blast' },
              ].map((s) => (
                <button
                  key={s.level}
                  type="button"
                  onClick={() => setSpiceLevel(s.level as SpiceLevel)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    spiceLevel === s.level
                      ? 'border-red-500 bg-red-950/40 text-white font-bold'
                      : 'border-white/5 bg-white/5 text-white/60 hover:border-white/20'
                  }`}
                >
                  <div className="text-xs font-bold uppercase tracking-wider">{s.label}</div>
                  <div className="text-[10px] text-white/40 mt-0.5 font-normal">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Add-ons Selection */}
          {food.supportedAddOns && food.supportedAddOns.length > 0 && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-widest text-[#E65100] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Extra Add-ons & Fillings
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {food.supportedAddOns.map((addOn) => {
                  const isChecked = selectedAddOns.some((a) => a.id === addOn.id);
                  return (
                    <button
                      key={addOn.id}
                      type="button"
                      onClick={() => toggleAddOn(addOn)}
                      className={`p-3 rounded-2xl border flex items-center justify-between text-left transition-all ${
                        isChecked
                          ? 'border-emerald-500 bg-emerald-950/30 text-white'
                          : 'border-white/5 bg-white/5 text-white/60 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            isChecked
                              ? 'bg-emerald-500 border-emerald-400 text-white'
                              : 'border-white/20 bg-black/40'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-bold text-white">{addOn.name}</span>
                      </div>
                      <span className="text-xs font-extrabold text-[#E65100]">
                        +₦{addOn.price.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. Special Instructions */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-white/40" /> Special Kitchen Instructions
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Please don't add onions, put sauce on the side..."
              className="w-full bg-[#0F0F0F] border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#E65100] transition-colors"
            />
          </div>

        </div>

        {/* Modal Footer: Quantity Stepper + Submit CTA */}
        <div className="p-4 sm:p-6 bg-[#0F0F0F] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase text-white/40 tracking-wider">Qty:</span>
            <div className="flex items-center bg-[#161616] border border-white/10 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg bg-white/5 text-white/80 hover:text-white flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-extrabold text-white text-base">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg bg-[#E65100] text-black hover:bg-[#FF6D00] flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#E65100] hover:bg-[#FF6D00] text-black font-extrabold text-xs uppercase tracking-widest shadow-xl shadow-[#E65100]/20 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Add to Cart</span>
            <span className="bg-black/20 px-2.5 py-0.5 rounded-md font-black text-black">
              ₦{totalPrice.toLocaleString()}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
