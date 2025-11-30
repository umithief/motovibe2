
import React, { useRef, useEffect, useState } from 'react';
import { Product, Story } from '../types';
import { ChevronLeft, ChevronRight, Heart, Zap, Truck, Plus, Handshake } from 'lucide-react';
import { storyService } from '../services/storyService';
import { StarRating } from './StarRating';

interface PopularProductsProps {
  products: Product[];
  onAddToCart: (product: Product, event?: React.MouseEvent) => void;
  onProductClick: (product: Product) => void;
  favoriteIds: number[];
  onToggleFavorite: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onCompare: (product: Product) => void;
  isCompared: (id: number) => boolean;
  onViewAll: () => void;
}

export const PopularProducts: React.FC<PopularProductsProps> = ({
  products,
  onAddToCart,
  onProductClick,
  favoriteIds,
  onToggleFavorite,
  onViewAll
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const storyScrollRef = useRef<HTMLDivElement>(null);
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
      storyService.getStories().then(setStories);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollStories = (direction: 'left' | 'right') => {
    const container = storyScrollRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-6 bg-[#f5f5f5] dark:bg-[#0a0a0a] transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* --- Story Widgets --- */}
        <div className="relative group/stories mb-8">
            {/* Nav Buttons for Stories */}
            <button 
                onClick={() => scrollStories('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/90 dark:bg-black/90 rounded-full shadow-lg border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-white opacity-0 group-hover/stories:opacity-100 transition-all hover:scale-110 -ml-2 md:-ml-4"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
                onClick={() => scrollStories('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/90 dark:bg-black/90 rounded-full shadow-lg border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-white opacity-0 group-hover/stories:opacity-100 transition-all hover:scale-110 -mr-2 md:-mr-4"
            >
                <ChevronRight className="w-4 h-4" />
            </button>

            <div 
                ref={storyScrollRef}
                className="flex gap-6 overflow-x-auto no-scrollbar pb-4 pt-2 px-1 scroll-smooth items-start"
            >
                {stories.map((w) => (
                    <div key={w.id} className="flex flex-col items-center gap-3 cursor-pointer group min-w-[120px]">
                        <div className={`w-[120px] h-[120px] rounded-full p-[3px] border-2 ${w.color} bg-white dark:bg-black transition-transform duration-300 group-hover:scale-105 shadow-md`}>
                            <div className="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-black">
                                <img src={w.image} alt={w.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            </div>
                        </div>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap tracking-wide">{w.label}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* --- Header --- */}
        <div className="bg-white dark:bg-[#111] rounded-t-xl p-4 flex justify-between items-center border-b border-gray-100 dark:border-white/5">
            <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Popüler Ürünler
                <span className="text-xs font-normal text-gray-500 hidden md:inline-block ml-2">Sizin için seçtiklerimiz</span>
            </h2>
            <button 
                onClick={onViewAll}
                className="text-sm font-bold text-moto-accent hover:text-moto-accent-hover transition-colors hover:underline"
            >
                Tümünü Gör
            </button>
        </div>

        {/* --- Product Carousel --- */}
        <div className="relative group/carousel bg-white dark:bg-[#111] rounded-b-xl p-4 shadow-sm border border-gray-100 dark:border-white/5">
            
            {/* Nav Buttons */}
            <button 
                onClick={() => scroll('left')}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white dark:bg-[#222] rounded-full shadow-md border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-white opacity-0 group-hover/carousel:opacity-100 transition-all hover:scale-110 disabled:opacity-0"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
                onClick={() => scroll('right')}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white dark:bg-[#222] rounded-full shadow-md border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-white opacity-0 group-hover/carousel:opacity-100 transition-all hover:scale-110"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* Scroll Area */}
            <div 
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 scroll-smooth"
            >
                {products.slice(0, 10).map((product) => (
                    <div 
                        key={product.id} 
                        className="min-w-[210px] w-[210px] snap-start bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-lg relative group cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
                        onClick={() => onProductClick(product)}
                    >
                        {/* Image Area */}
                        <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg bg-gray-100 dark:bg-black/50">
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            
                            {/* Fav Button */}
                            <button 
                                onClick={(e) => { e.stopPropagation(); onToggleFavorite(product); }}
                                className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-10"
                            >
                                <Heart className={`w-4 h-4 ${favoriteIds.includes(product.id) ? 'fill-moto-accent text-moto-accent' : 'text-gray-400'}`} />
                            </button>

                            {/* Badges Container (Top Left) */}
                            <div className="absolute top-2 left-0 flex flex-col gap-1 z-20 items-start">
                                {/* Badge: Negotiable */}
                                {product.isNegotiable && (
                                    <div className="relative overflow-hidden bg-purple-600/90 backdrop-blur-md text-white text-[9px] font-bold px-2 py-1 rounded-r-md flex items-center gap-1 shadow-lg border-y border-r border-purple-400/30">
                                        <div className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]" style={{ animation: 'shine 3s infinite linear' }}></div>
                                        <Handshake className="w-3 h-3 relative z-10" />
                                        <span className="relative z-10">PAZARLIK</span>
                                    </div>
                                )}

                                {/* Badge: Cargo (Moving Shine) */}
                                <div className="relative overflow-hidden bg-black/90 backdrop-blur-md text-white text-[9px] font-bold px-2 py-1 rounded-r-md flex items-center gap-1 shadow-lg border-y border-r border-white/10">
                                    <div className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]" style={{ animation: 'shine 2s infinite linear' }}></div>
                                    <Truck className="w-3 h-3 relative z-10" /> 
                                    <span className="relative z-10">KARGO BEDAVA</span>
                                </div>
                            </div>

                            {/* Badge: Delivery (Pulsing) */}
                            <div className="absolute bottom-2 left-2 bg-green-600/90 text-white text-[9px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm animate-pulse">
                                <Zap className="w-3 h-3 fill-current" /> HIZLI TESLİMAT
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-3 flex flex-col flex-1">
                            {/* Title */}
                            <div className="text-xs text-gray-700 dark:text-gray-200 leading-tight mb-2 h-8 overflow-hidden line-clamp-2">
                                <span className="font-bold text-black dark:text-white mr-1">{product.category}</span>
                                {product.name}
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-2">
                                <StarRating rating={product.rating} size={14} />
                                <span className="text-[10px] text-gray-400">({Math.floor(Math.random() * 2000)})</span>
                            </div>

                            {/* Price */}
                            <div className="flex flex-col mt-auto">
                                <span className="text-[10px] text-gray-400 line-through">₺{(product.price * 1.25).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</span>
                                <div className="text-sm font-bold text-moto-accent">
                                    ₺{product.price.toLocaleString('tr-TR')}
                                </div>
                            </div>

                            {/* Add to Cart (Always Visible) */}
                            <button 
                                onClick={(e) => { e.stopPropagation(); onAddToCart(product, e); }}
                                className="mt-3 w-full bg-moto-accent hover:bg-moto-accent-hover text-surface font-bold text-xs py-2 rounded-md transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-1"
                            >
                                <Plus className="w-3 h-3" /> Sepete Ekle
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
