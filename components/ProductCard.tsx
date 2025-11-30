
import React, { useState } from 'react';
import { Heart, Truck, Zap, Plus, Handshake, ShoppingCart, Image as ImageIcon } from 'lucide-react';
import { Product } from '../types';
import { motion } from 'framer-motion';
import { StarRating } from './StarRating';
import { Highlighter } from './Highlighter';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, event?: React.MouseEvent) => void;
  onClick: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (product: Product) => void;
  onCompare?: (product: Product) => void;
  isCompared?: boolean;
  highlight?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onClick, 
  isFavorite, 
  onToggleFavorite,
  highlight = ''
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const isFreeShipping = product.price > 1000;
  const isNegotiable = product.isNegotiable;

  return (
    <motion.div 
      onClick={() => onClick(product)}
      className="group relative bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-white/5 cursor-pointer transition-all duration-300 hover:shadow-lg overflow-hidden flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      {/* --- Image Section --- */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-zinc-900">
          {/* Skeleton / Placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-zinc-900 animate-pulse z-0">
                <ImageIcon className="w-8 h-8 text-gray-300 dark:text-zinc-700" />
            </div>
          )}
          
          <img 
            src={product.image} 
            alt={product.name} 
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 z-10 relative ${imageLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Quick Action (Hover) */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
              <button 
                  onClick={(e) => { e.stopPropagation(); onAddToCart(product, e); }}
                  className="w-full bg-moto-accent text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm transition-transform active:scale-95"
              >
                  <ShoppingCart className="w-4 h-4" /> Sepete Ekle
              </button>
          </div>
          
          {/* Favorite Button */}
          {onToggleFavorite && (
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(product); }}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md transition-transform hover:scale-110 active:scale-95 z-20"
              >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </button>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-20 items-start">
              {isNegotiable && (
                  <div className="bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                      <Handshake className="w-3 h-3" />
                      <span>PAZARLIK</span>
                  </div>
              )}
              {isFreeShipping && (
                  <div className="bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                      <Truck className="w-3 h-3" /> 
                      <span>KARGO BEDAVA</span>
                  </div>
              )}
          </div>
      </div>

      {/* --- Content Section --- */}
      <div className="p-4 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  {product.category}
              </span>
              <StarRating rating={product.rating} size={10} className="flex" readonly />
          </div>

          <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 leading-tight group-hover:text-moto-accent transition-colors">
              <Highlighter text={product.name} highlight={highlight} />
          </h3>

          <div className="mt-auto pt-3 border-t border-gray-100 dark:border-white/5 flex items-end justify-between">
              <div className="flex flex-col">
                  <span className="text-xs text-gray-400 line-through">
                      ₺{(product.price * 1.25).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ₺{product.price.toLocaleString('tr-TR')}
                  </span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onAddToCart(product, e); }}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-white hover:bg-moto-accent hover:text-white transition-colors"
              >
                  <Plus className="w-4 h-4" />
              </button>
          </div>
      </div>
    </motion.div>
  );
};
