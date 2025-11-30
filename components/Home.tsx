
import React from 'react';
import { Hero } from './Hero';
import { CategoryGrid } from './CategoryGrid';
import { ProductCard } from './ProductCard';
import { PopularProducts } from './PopularProducts';
import { Product, ProductCategory, ViewState } from '../types';

interface HomeProps {
  products: Product[];
  onAddToCart: (product: Product, event?: React.MouseEvent) => void;
  onProductClick: (product: Product) => void;
  favoriteIds: number[];
  onToggleFavorite: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onCompare: (product: Product) => void;
  compareList: Product[];
  onNavigate: (view: ViewState, data?: any) => void;
}

export const Home: React.FC<HomeProps> = ({ 
  products, 
  onAddToCart, 
  onProductClick, 
  favoriteIds, 
  onToggleFavorite,
  onQuickView,
  onCompare,
  compareList,
  onNavigate
}) => {
  const featuredProducts = products.slice(0, 8); 

  const handleCategorySelect = (category: ProductCategory) => {
    onNavigate('shop', category);
  };

  return (
    <>
      <Hero onNavigate={onNavigate} />
      
      {/* Trendyol Style Popular Products Widget Section */}
      <PopularProducts 
        products={products}
        onAddToCart={onAddToCart}
        onProductClick={onProductClick}
        favoriteIds={favoriteIds}
        onToggleFavorite={onToggleFavorite}
        onQuickView={onQuickView}
        onCompare={onCompare}
        isCompared={(id) => compareList.some(p => p.id === id)}
        onViewAll={() => onNavigate('shop')}
      />

      <CategoryGrid onCategorySelect={handleCategorySelect} />
      
      {/* Editor's Choice Section */}
      <div className="py-16 bg-white dark:bg-[#050505] px-4 max-w-7xl mx-auto transition-colors duration-300">
        <div className="flex justify-center mb-10">
          <div className="text-center">
             <h2 className="text-3xl font-display font-black text-gray-900 dark:text-white mb-2">EDİTÖRÜN SEÇİMİ</h2>
             <div className="w-12 h-1 bg-moto-accent mx-auto"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredProducts.slice(4, 8).map(product => (
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
            />
          ))}
        </div>
      </div>
    </>
  );
};
