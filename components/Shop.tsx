
import React, { useState, useEffect } from 'react';
import { Product, ProductCategory, ViewState } from '../types';
import { ProductCard } from './ProductCard';
import { Search, Filter } from 'lucide-react';

interface ShopProps {
  products: Product[];
  onAddToCart: (product: Product, event?: React.MouseEvent) => void;
  onProductClick: (product: Product) => void;
  favoriteIds: number[];
  onToggleFavorite: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onNavigate: (view: ViewState) => void;
  onCompare: (product: Product) => void;
  compareList: Product[];
  initialCategory?: ProductCategory | 'ALL';
}

export const Shop: React.FC<ShopProps> = ({
  products,
  onAddToCart,
  onProductClick,
  favoriteIds,
  onToggleFavorite,
  onQuickView,
  onNavigate,
  onCompare,
  compareList,
  initialCategory = 'ALL'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'ALL'>(initialCategory);
  const [sortOption, setSortOption] = useState<string>('default');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const allCategories = ['ALL', ...Object.values(ProductCategory)];

  let filteredProducts = products.filter(p => { 
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory; 
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()); 
    return matchesCategory && matchesSearch; 
  });

  // Sorting Logic
  if (sortOption === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortOption === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="pt-20 md:pt-24 pb-24 px-2 md:px-4 max-w-7xl mx-auto min-h-screen animate-in fade-in duration-500">
        {/* Sticky Header with increased opacity and consistent z-index */}
        <div className="sticky top-[56px] md:top-[90px] z-30 bg-gray-100/95 dark:bg-[#050505]/95 backdrop-blur-xl py-3 -mx-2 px-2 md:-mx-4 md:px-4 md:bg-transparent md:static border-b border-gray-200 dark:border-white/10 md:border-none mb-4 md:mb-6 transition-colors duration-300 shadow-sm md:shadow-none">
          <div className="flex flex-col gap-3">
            <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar md:flex-wrap md:justify-center">
                {allCategories.map((cat) => (
                      <button key={cat} onClick={() => setSelectedCategory(cat as any)} className={`flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-bold transition-all border ${selectedCategory === cat ? 'bg-moto-accent border-moto-accent text-white' : 'bg-white dark:bg-white/5 border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-400'}`}>
                        {cat === 'ALL' ? 'TÜMÜ' : cat.toUpperCase()}
                      </button>
                  ))}
            </div>
            <div className="flex gap-2 items-center">
                  <div className="flex-1 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl flex items-center px-3 py-2 focus-within:border-moto-accent transition-colors">
                    <Search className="w-4 h-4 text-gray-500 mr-2" />
                    <input type="text" placeholder="Ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent text-gray-900 dark:text-white text-sm w-full outline-none placeholder-gray-500 dark:placeholder-gray-600" />
                  </div>
                  <div className="bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-3 py-2 text-gray-900 dark:text-white text-xs font-bold flex items-center gap-2">
                    <Filter className="w-3 h-3" />
                    <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="bg-transparent outline-none appearance-none cursor-pointer w-16 md:w-auto">
                      <option value="default" className="bg-white dark:bg-black">Sırala</option>
                      <option value="price-asc" className="bg-white dark:bg-black">Fiyat Artan</option>
                      <option value="price-desc" className="bg-white dark:bg-black">Fiyat Azalan</option>
                      <option value="rating" className="bg-white dark:bg-black">Puan</option>
                    </select>
                  </div>
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? <div className="text-center py-20 text-gray-500">Ürün bulunamadı.</div> : 
            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={onAddToCart} 
                    onClick={() => onProductClick(product)} 
                    onQuickView={onQuickView} 
                    isFavorite={favoriteIds.includes(product.id)} 
                    onToggleFavorite={onToggleFavorite}
                    onCompare={onCompare}
                    isCompared={compareList.some(p => p.id === product.id)}
                    highlight={searchQuery}
                  />
                ))}
            </div>
        }
    </div>
  );
};
