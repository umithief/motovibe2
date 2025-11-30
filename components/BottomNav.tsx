
import React from 'react';
import { Home, ShoppingBag, Map, User, Navigation } from 'lucide-react';
import { ViewState } from '../types';
import { motion } from 'framer-motion';

interface BottomNavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  cartCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate, cartCount }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Ana Sayfa', view: 'home' as ViewState },
    { id: 'shop', icon: ShoppingBag, label: 'Mağaza', view: 'shop' as ViewState },
    // Middle item (Ride Mode) is handled separately
    { id: 'routes', icon: Map, label: 'Rotalar', view: 'routes' as ViewState },
    { id: 'profile', icon: User, label: 'Profil', view: 'profile' as ViewState },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[90] pb-safe-bottom">
      {/* Glassmorphism Container with visual curve for button */}
      <div className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]"></div>
      
      <div className="relative flex justify-between items-center h-20 px-2 w-full">
        {/* Left Side */}
        <div className="flex flex-1 justify-around items-center h-full">
            {navItems.slice(0, 2).map(item => (
                <NavItem key={item.id} item={item} isActive={currentView === item.view} onNavigate={onNavigate} cartCount={cartCount} />
            ))}
        </div>

        {/* Center Main Button (Ride Mode) - ELEVATED and GLOWING */}
        <div className="relative -top-8 px-2 flex justify-center">
            {/* Glow Layer */}
            <div className="absolute inset-0 bg-red-600 rounded-full blur-xl opacity-20 animate-pulse"></div>
            
            <button
                onClick={() => onNavigate('ride-mode')}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-800 border-4 border-[#0a0a0a] shadow-[0_0_20px_rgba(220,38,38,0.6)] flex flex-col items-center justify-center text-white active:scale-95 transition-transform group overflow-hidden relative z-10 hover:scale-105"
            >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping opacity-20"></div>
                
                <Navigation className="w-6 h-6 fill-current mb-0.5 drop-shadow-md transform group-hover:rotate-45 transition-transform" />
                <span className="text-[8px] font-black uppercase tracking-wider drop-shadow-md">GO</span>
            </button>
        </div>

        {/* Right Side */}
        <div className="flex flex-1 justify-around items-center h-full">
            {navItems.slice(2, 4).map(item => (
                <NavItem key={item.id} item={item} isActive={currentView === item.view} onNavigate={onNavigate} />
            ))}
        </div>
      </div>
    </div>
  );
};

const NavItem: React.FC<{ item: any, isActive: boolean, onNavigate: any, cartCount?: number }> = ({ item, isActive, onNavigate, cartCount }) => (
    <button
        onClick={() => onNavigate(item.view)}
        className="relative flex flex-col items-center justify-center w-14 h-full group"
    >
        {/* Active Indicator Light */}
        {isActive && (
        <motion.div 
            layoutId="bottomNavLight"
            className="absolute -top-[2px] w-8 h-[3px] bg-moto-accent shadow-[0_0_10px_var(--moto-accent)] rounded-b-md"
        />
        )}

        {/* Icon Container */}
        <div className={`relative p-1.5 transition-all duration-300 ${isActive ? 'text-moto-accent -translate-y-1' : 'text-gray-500 group-hover:text-gray-300'}`}>
        <item.icon 
            className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} 
            strokeWidth={isActive ? 2 : 1.5}
        />
        
        {/* Cart Badge */}
        {item.id === 'shop' && cartCount && cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-moto-accent text-[9px] font-bold text-black ring-2 ring-[#0a0a0a]">
            {cartCount}
            </span>
        )}
        </div>

        {/* Label */}
        <span className={`text-[9px] font-medium transition-all duration-300 ${isActive ? 'text-white opacity-100' : 'text-gray-500 opacity-0 scale-0 h-0'}`}>
        {item.label}
        </span>
    </button>
);
