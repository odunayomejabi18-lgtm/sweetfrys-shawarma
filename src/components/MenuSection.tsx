import React, { useState } from 'react';
import { Search, Flame, Star, Clock, Plus, Sparkles, Filter } from 'lucide-react';
import { FoodItem } from '../types';

interface MenuSectionProps {
  menuItems: FoodItem[];
  onSelectFood: (food: FoodItem) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

const CATEGORIES = [
  'All',
  'Shawarma',
  'Grills',
  'Chicken',
  'Beef',
  'Fish',
  'Suya',
  'Burgers',
  'Fries & Sides',
  'Drinks',
  'Combos',
];

export const MenuSection: React.FC<MenuSectionProps> = ({
  menuItems,
  onSelectFood,
  selectedCategory,
  setSelectedCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<'all' | 'popular' | 'bestseller'>('all');

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag =
      filterTag === 'all' ||
      (filterTag === 'popular' && item.isPopular) ||
      (filterTag === 'bestseller' && item.isBestSeller);

    return matchesCategory && matchesSearch && matchesTag;
  });

  return (
    <section id="menu-section" className="py-12 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#E65100] font-extrabold text-xs uppercase tracking-widest mb-1">
              <Flame className="w-4 h-4 fill-[#E65100]" /> Fresh Menu
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight">
              Our Shawarma & Grills
            </h2>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chicken, catfish, suya..."
              className="w-full bg-[#161616] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#E65100] transition-colors"
            />
          </div>
        </div>

        {/* Category Tabs Scroll Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#E65100] text-black shadow-lg shadow-[#E65100]/20'
                  : 'bg-[#161616] border border-white/5 text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat === 'All' ? '🔥 All Delicacies' : cat}
            </button>
          ))}
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/40">
          <span className="flex items-center gap-1 text-white/30">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <button
            onClick={() => setFilterTag('all')}
            className={`px-3 py-1 rounded-lg border transition-all ${
              filterTag === 'all'
                ? 'bg-white/10 text-white border-white/20'
                : 'bg-[#161616] border-white/5 hover:text-white'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setFilterTag('popular')}
            className={`px-3 py-1 rounded-lg border transition-all flex items-center gap-1 ${
              filterTag === 'popular'
                ? 'bg-[#E65100]/20 text-[#E65100] border-[#E65100]/40'
                : 'bg-[#161616] border-white/5 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#E65100]" /> Most Popular
          </button>
          <button
            onClick={() => setFilterTag('bestseller')}
            className={`px-3 py-1 rounded-lg border transition-all flex items-center gap-1 ${
              filterTag === 'bestseller'
                ? 'bg-red-950/60 text-red-400 border-red-600/50'
                : 'bg-[#161616] border-white/5 hover:text-white'
            }`}
          >
            <Flame className="w-3 h-3 text-red-400" /> Best Sellers
          </button>
        </div>

        {/* Menu Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-[#161616] rounded-3xl border border-white/5">
            <Flame className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white uppercase">No food items found</h3>
            <p className="text-xs text-white/40 mt-1 font-normal">Try clearing your search query or switching categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#161616] border border-white/5 rounded-3xl overflow-hidden hover:border-[#E65100]/40 transition-all duration-300 flex flex-col group shadow-lg"
              >
                {/* Image Container */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-black/40">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent opacity-90" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {item.isBestSeller && (
                      <span className="bg-[#D32F2F] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow">
                        🔥 Best Seller
                      </span>
                    )}
                    {item.isPopular && (
                      <span className="bg-[#E65100] text-black text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow">
                        ⭐ Popular
                      </span>
                    )}
                  </div>

                  {/* Prep time */}
                  <div className="absolute bottom-3 left-3 bg-[#0F0F0F]/90 backdrop-blur-md text-white/80 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#E65100]" />
                    <span>{item.prepTimeMinutes} mins prep</span>
                  </div>

                  {/* Rating */}
                  <div className="absolute bottom-3 right-3 bg-[#0F0F0F]/90 backdrop-blur-md text-amber-400 text-xs font-extrabold px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{item.rating}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-extrabold text-base text-white uppercase group-hover:text-[#E65100] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-white/60 leading-relaxed mt-1 line-clamp-2 font-normal">
                      {item.description}
                    </p>
                  </div>

                  {/* Footer Price & Add Button */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-white/40 block uppercase font-bold tracking-wider">Price</span>
                      <span className="text-lg font-black text-white">
                        ₦{item.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectFood(item)}
                      className="px-4 py-2.5 rounded-xl bg-[#E65100] hover:bg-[#FF6D00] text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#E65100]/20 transition-all transform active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Customize & Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
