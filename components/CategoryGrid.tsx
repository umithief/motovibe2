

import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap, Trophy, Shield, Box, Smartphone } from 'lucide-react';
import { ProductCategory, CategoryItem } from '../types';
import { categoryService } from '../services/categoryService';
import { motion } from 'framer-motion';

interface CategoryGridProps {
  onCategorySelect: (category: ProductCategory) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
      const loadCats = async () => {
          const data = await categoryService.getCategories();
          setCategories(data);
      };
      loadCats();
  }, []);

  const getIcon = (type: string) => {
      switch(type) {
          case 'Kask': return Shield;
          case 'Mont': return Trophy;
          case 'Aksesuar': return Box;
          case 'İnterkom': return Smartphone;
          default: return Zap;
      }
  }

  return (
    <section className="py-16 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
             <h2 className="text-3xl font-bold text-white tracking-tight">Kategoriler</h2>
        </div>

        {/* Standard Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => {
            const Icon = getIcon(cat.type);
            
            return (
                <motion.div 
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                onClick={() => onCategorySelect(cat.type)}
                className="group relative overflow-hidden rounded-2xl cursor-pointer bg-[#111] border border-white/5 hover:border-white/20 transition-all duration-300 h-48"
                >
                <div className="absolute inset-0">
                    <img 
                        src={cat.image} 
                        alt={cat.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-50 group-hover:opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                </div>
                
                <div className="absolute inset-0 p-4 flex flex-col justify-end items-center text-center">
                    <div className="mb-2 p-2 bg-white/10 backdrop-blur rounded-full">
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{cat.name}</h3>
                    <p className="text-xs text-gray-400">{cat.count}</p>
                </div>
                </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};