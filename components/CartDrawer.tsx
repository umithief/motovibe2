
import React from 'react';
import { X, Trash2, ShoppingBag, CreditCard, ChevronRight, Minus, Plus, ShieldCheck, Package, Star } from 'lucide-react';
import { CartItem, User } from '../types';
import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';
import { animationService } from '../services/animationService';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => Promise<void>;
  user: User | null;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemoveItem,
  onCheckout,
  user
}) => {
  const subTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountRate = user?.rank === 'Yol Kaptanı' ? 0.05 : 0;
  const discountAmount = subTotal * discountRate;
  const total = subTotal - discountAmount;

  const handleCheckoutClick = async () => {
    onCheckout();
  };

  const transition = animationService.getTransition();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] overflow-hidden">
          {/* Backdrop with blur */}
          <motion.div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          ></motion.div>
          
          <motion.div 
            className="absolute inset-y-0 right-0 max-w-md w-full flex pointer-events-none"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={transition}
          >
            <div className="w-full h-full flex flex-col bg-white/95 dark:bg-[#050505]/95 backdrop-blur-xl shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.8)] border-l border-gray-200 dark:border-white/10 relative pointer-events-auto">
              
              {/* Cyber Decorative Lines */}
              <div className="absolute top-0 left-0 w-1 h-24 bg-moto-accent shadow-[0_0_10px_#ff1f1f]"></div>
              
              {/* Header */}
              <div className="relative px-6 py-8 border-b border-gray-200 dark:border-white/10 bg-gradient-to-b from-gray-50/50 dark:from-white/5 to-transparent">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                        <ShoppingBag className="w-4 h-4 text-moto-accent" />
                        <span className="text-[10px] font-mono text-moto-accent uppercase tracking-widest">Loadout</span>
                    </div>
                    <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-wider italic">
                      SEPET <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-500">DETAYI</span>
                    </h2>
                  </div>
                  <button 
                    onClick={onClose} 
                    className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white transition-all duration-300 group"
                  >
                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>
              </div>

              {/* Items Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-moto-accent/10 blur-2xl rounded-full"></div>
                        <div className="w-24 h-24 rounded-2xl border border-gray-200 dark:border-white/10 flex items-center justify-center bg-gray-50 dark:bg-black relative z-10">
                            <ShoppingBag className="w-10 h-10 opacity-30 text-gray-900 dark:text-white" />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">SEPET BOŞ</p>
                        <p className="text-xs font-mono text-gray-500 tracking-wider">NO_GEAR_DETECTED</p>
                    </div>
                    <Button variant="cyber" onClick={onClose} className="border-gray-300 dark:border-white/20 text-gray-600 dark:text-gray-300 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white">
                        EKİPMAN SEÇ
                    </Button>
                  </div>
                ) : (
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div 
                          key={item.id} 
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -50, height: 0, marginBottom: 0, overflow: 'hidden' }}
                          className="group relative flex gap-4 bg-gray-50 dark:bg-[#0a0a0a] p-3 rounded-xl border border-gray-200 dark:border-white/5 hover:border-moto-accent/30 transition-all duration-300 overflow-hidden"
                      >
                        {/* Hover Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-moto-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                        {/* Product Image */}
                        <div className="w-24 h-24 bg-white dark:bg-black rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 relative flex-shrink-0">
                          <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover opacity-100 dark:opacity-80 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-110 transform" 
                          />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-between py-1 relative z-10">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 font-display tracking-wide leading-tight">{item.name}</h3>
                                <button 
                                  onClick={() => onRemoveItem(item.id)}
                                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1 font-mono">{item.category}</p>
                          </div>
                          
                          <div className="flex items-end justify-between mt-2">
                            {/* Mechanical Quantity Control */}
                            <div className="flex items-center bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden h-8">
                              <button 
                                  onClick={() => onUpdateQuantity(item.id, -1)}
                                  className="w-8 h-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors disabled:opacity-30 active:bg-gray-200 dark:active:bg-white/20"
                                  disabled={item.quantity <= 1}
                              >
                                  <Minus className="w-3 h-3" />
                              </button>
                              <div className="w-8 h-full flex items-center justify-center border-x border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                                  <span className="text-sm font-mono font-bold text-gray-900 dark:text-white">{item.quantity}</span>
                              </div>
                              <button 
                                  onClick={() => onUpdateQuantity(item.id, 1)}
                                  className="w-8 h-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors active:bg-gray-200 dark:active:bg-white/20"
                              >
                                  <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="text-right">
                                <span className="block text-[10px] text-gray-500 dark:text-gray-600 mb-0.5 text-right">Birim: ₺{item.price.toLocaleString('tr-TR')}</span>
                                <span className="text-base font-bold text-moto-accent font-mono tracking-tight">₺{(item.price * item.quantity).toLocaleString('tr-TR')}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-6 bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-white/10 relative z-20">
                  {/* Decorative top border glow */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-moto-accent/50 to-transparent"></div>
                  
                  <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-mono text-xs">ARA TOPLAM</span>
                        <span className="text-gray-800 dark:text-gray-300 font-mono">₺{subTotal.toLocaleString('tr-TR')}</span>
                      </div>
                      
                      {discountAmount > 0 && (
                          <div className="flex justify-between items-center text-sm animate-in slide-in-from-left">
                            <span className="text-green-500 font-bold text-xs flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current" />
                                YOL KAPTANI İNDİRİMİ (%5)
                            </span>
                            <span className="text-green-500 font-mono">-₺{discountAmount.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}</span>
                          </div>
                      )}

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-mono text-xs flex items-center gap-2"><Package className="w-3 h-3" /> KARGO</span>
                        <span className="text-green-500 text-xs uppercase font-bold bg-green-100 dark:bg-green-900/20 px-2 py-0.5 rounded border border-green-200 dark:border-green-500/30">ÜCRETSİZ</span>
                      </div>
                      
                      <div className="flex justify-between items-end pt-4 border-t border-gray-200 dark:border-white/5 mt-4">
                        <span className="text-gray-900 dark:text-white font-display text-xl font-bold tracking-wide">TOPLAM</span>
                        <div className="text-right">
                            <span className="text-3xl font-bold font-mono text-moto-accent drop-shadow-[0_0_10px_rgba(255,31,31,0.3)]">
                                ₺{total.toLocaleString('tr-TR')}
                            </span>
                            <span className="block text-[9px] text-gray-500 font-mono mt-1">KDV DAHİL</span>
                        </div>
                      </div>
                  </div>

                  <Button 
                    variant="primary" 
                    className="w-full py-5 text-lg group relative overflow-hidden shadow-lg shadow-moto-accent/20" 
                    onClick={handleCheckoutClick}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <span className="relative z-10 flex items-center justify-center gap-2 font-display tracking-widest">
                        SİPARİŞİ TAMAMLA 
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                  
                  <div className="mt-4 flex justify-center items-center gap-2 text-[10px] text-gray-400 dark:text-gray-500 font-mono uppercase tracking-wider">
                    <ShieldCheck className="w-3 h-3 text-gray-400" />
                    Secure Encrypted Transaction
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
