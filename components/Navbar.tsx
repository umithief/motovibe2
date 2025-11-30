
import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Palette, ChevronDown, User as UserIcon, Check, Zap, Navigation } from 'lucide-react';
import { ViewState, User, ColorTheme, ProductCategory } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { UserAvatar } from './UserAvatar';

interface NavbarProps {
  cartCount: number;
  favoritesCount: number;
  onCartClick: () => void;
  onFavoritesClick: () => void;
  onSearch: (query: string) => void;
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onNavigate: (view: ViewState, data?: any) => void;
  currentView: ViewState;
  colorTheme?: ColorTheme;
  onColorChange?: (theme: ColorTheme) => void;
}

// Mega Menu Data Structure
const MENU_ITEMS = [
    {
        id: 'shop',
        label: 'MAĞAZA',
        type: 'mega',
        view: 'shop',
        columns: [
            {
                title: 'SÜRÜCÜ EKİPMANI',
                items: [
                    { label: 'Kasklar', value: ProductCategory.HELMET },
                    { label: 'Montlar', value: ProductCategory.JACKET },
                    { label: 'Eldivenler', value: ProductCategory.GLOVES },
                    { label: 'Bot & Ayakkabı', value: ProductCategory.BOOTS },
                    { label: 'Pantolonlar', value: ProductCategory.PANTS },
                ]
            },
            {
                title: 'TEKNOLOJİ & AKSESUAR',
                items: [
                    { label: 'İnterkom Sistemleri', value: ProductCategory.INTERCOM },
                    { label: 'Koruma Ekipmanları', value: ProductCategory.PROTECTION },
                    { label: 'Motosiklet Aksesuarları', value: ProductCategory.ACCESSORY },
                ]
            }
        ],
        featured: {
            title: "YENİ SEZON",
            desc: "2024 Koleksiyonu Yayında",
            image: "https://images.unsplash.com/photo-1622185135505-2d795043ec63?q=80&w=600&auto=format&fit=crop"
        }
    },
    { id: 'routes', label: 'ROTALAR', type: 'link', view: 'routes' },
    { id: 'meetup', label: 'ETKİNLİKLER', type: 'link', view: 'meetup' },
    { id: 'blog', label: 'BLOG', type: 'link', view: 'blog' },
    { id: 'about', label: 'HİKAYEMİZ', type: 'link', view: 'about' },
];

export const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, 
  onCartClick, 
  onOpenAuth,
  onNavigate,
  user,
  colorTheme,
  onColorChange,
  onLogout
}) => {
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
        setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mega menu when scrolling
  useEffect(() => {
      const closeMenu = () => setActiveHover(null);
      window.addEventListener('scroll', closeMenu);
      return () => window.removeEventListener('scroll', closeMenu);
  }, []);

  const handleNavClick = (view: ViewState, data?: any) => {
      onNavigate(view, data);
      setActiveHover(null);
  };

  const colors: { id: ColorTheme; bg: string; label: string }[] = [
      { id: 'orange', bg: 'bg-[#F2A619]', label: 'KTM' },
      { id: 'red', bg: 'bg-[#EF4444]', label: 'Ducati' },
      { id: 'blue', bg: 'bg-[#3B82F6]', label: 'Yamaha' },
      { id: 'green', bg: 'bg-[#22C55E]', label: 'Kawasaki' },
      { id: 'cyan', bg: 'bg-[#06B6D4]', label: 'Neon' },
      { id: 'purple', bg: 'bg-[#A855F7]', label: 'Retro' },
      { id: 'yellow', bg: 'bg-[#EAB308]', label: 'VR46' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[40] transition-all duration-500
        ${scrolled || activeHover ? 'bg-white/90 dark:bg-[#050505]/90 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 py-3 shadow-md' : 'bg-transparent border-b border-transparent py-4 md:py-6'}`}
        onMouseLeave={() => setActiveHover(null)}
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-full">
            <div className="flex justify-between items-center h-full">
                
                {/* --- LOGO --- */}
                <div className="flex-shrink-0 flex items-center z-50">
                    <button 
                        onClick={() => handleNavClick('home')}
                        className="group flex items-center gap-2 md:gap-3 transition-transform duration-300 hover:scale-105"
                    >
                        <div className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                            <div className="absolute inset-0 bg-moto-accent rounded-xl rotate-0 group-hover:rotate-12 transition-transform duration-300 opacity-20"></div>
                            <div className="absolute inset-0 bg-moto-accent rounded-xl rotate-0 group-hover:-rotate-6 transition-transform duration-300 opacity-40"></div>
                            <div className="relative w-8 h-8 md:w-10 md:h-10 bg-moto-accent rounded-lg md:rounded-xl flex items-center justify-center text-black shadow-lg shadow-moto-accent/30 group-hover:scale-105 transition-transform">
                                <Zap className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                            </div>
                        </div>
                        <div className="flex flex-col items-start leading-none">
                            <span className="font-display font-black tracking-tighter text-xl md:text-2xl text-gray-900 dark:text-white drop-shadow-sm transition-colors">
                                MOTO<span className="text-moto-accent">VIBE</span>
                            </span>
                            <span className="text-[8px] md:text-[9px] font-bold text-gray-500 dark:text-gray-400 tracking-[0.3em] uppercase group-hover:text-black dark:group-hover:text-white transition-colors hidden md:block">Premium Gear</span>
                        </div>
                    </button>
                </div>

                {/* --- DESKTOP NAVIGATION --- */}
                <nav className="hidden lg:flex items-center justify-center gap-1 h-full bg-gray-100/50 dark:bg-white/5 rounded-full px-2 border border-gray-200 dark:border-white/5 backdrop-blur-md">
                    {MENU_ITEMS.map((item) => (
                        <div 
                            key={item.id}
                            className="h-full flex items-center"
                            onMouseEnter={() => setActiveHover(item.id)}
                        >
                            <button 
                                onClick={() => handleNavClick(item.view as ViewState)}
                                className={`relative px-5 py-2.5 text-xs font-bold tracking-widest transition-all duration-300 group flex items-center gap-1 rounded-full uppercase hover:scale-105
                                ${activeHover === item.id ? 'text-white bg-black dark:bg-white dark:text-black shadow-lg scale-105' : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'}`}
                            >
                                {item.label}
                                {item.type === 'mega' && (
                                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeHover === item.id ? 'rotate-180' : ''}`} />
                                )}
                            </button>
                        </div>
                    ))}
                </nav>

                {/* --- ACTIONS --- */}
                <div className="flex items-center gap-2 md:gap-3 z-50">
                    
                    {/* RIDE MODE BUTTON (DESKTOP) */}
                    <button 
                        onClick={() => handleNavClick('ride-mode')}
                        className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:scale-105 active:scale-95 transition-all border border-red-500 group animate-pulse hover:animate-none"
                    >
                        <Navigation className="w-4 h-4 fill-current group-hover:rotate-45 transition-transform" />
                        <span>SÜRÜŞ MODU</span>
                    </button>

                    {/* Theme Picker (Desktop) */}
                    <div className="relative hidden md:block">
                        <button 
                            onClick={() => setIsColorMenuOpen(!isColorMenuOpen)}
                            className={`
                                flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 border hover:scale-110 active:scale-95
                                ${isColorMenuOpen 
                                    ? 'bg-moto-accent/10 border-moto-accent text-moto-accent ring-2 ring-moto-accent/20' 
                                    : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10'
                                }
                            `}
                            title="Renk Temasını Değiştir"
                        >
                            <Palette className="w-5 h-5" />
                        </button>
                        
                        <AnimatePresence>
                            {isColorMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsColorMenuOpen(false)}></div>
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 top-full mt-4 w-72 p-4 bg-white dark:bg-[#111]/95 border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl z-20 flex flex-col gap-3 backdrop-blur-xl"
                                    >
                                        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-2 mb-2">
                                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Arayüz Teması</span>
                                        </div>
                                        
                                        <div className="grid grid-cols-4 gap-3">
                                            {colors.map(c => (
                                                <button
                                                    key={c.id}
                                                    onClick={() => { if(onColorChange) onColorChange(c.id); setIsColorMenuOpen(false); }}
                                                    className="group relative flex flex-col items-center gap-1"
                                                >
                                                    <div className={`
                                                        w-10 h-10 rounded-full ${c.bg} shadow-lg transition-all duration-300 flex items-center justify-center relative
                                                        ${colorTheme === c.id ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#111]' : 'hover:scale-110 hover:ring-2 hover:ring-white/20'}
                                                    `}>
                                                        {colorTheme === c.id && <Check className="w-5 h-5 text-white drop-shadow-md" strokeWidth={3} />}
                                                    </div>
                                                    <span className="text-[9px] font-bold text-gray-500 uppercase group-hover:text-black dark:group-hover:text-white transition-colors">{c.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Search (Desktop) */}
                    <button 
                        onClick={() => handleNavClick('shop')}
                        className="hidden md:flex w-10 h-10 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all hover:border-gray-300 dark:hover:border-white/20 hover:scale-110 active:scale-95"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                    
                    {/* Cart Icon (Desktop & Mobile) */}
                    <button 
                        onClick={onCartClick}
                        className="relative w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all group hover:border-moto-accent/50 hover:scale-110 active:scale-95"
                        id="cart-icon-desktop"
                    >
                        <ShoppingBag className="w-5 h-5 group-hover:text-moto-accent transition-colors" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-moto-accent text-black text-[10px] font-bold rounded-full shadow-[0_0_10px_rgba(var(--moto-accent-rgb),0.5)] ring-2 ring-white dark:ring-[#050505]">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    {/* Auth / Profile (Desktop) */}
                    <div className="hidden md:block">
                        {user ? (
                            <button 
                                onClick={() => handleNavClick('profile')}
                                className="flex items-center gap-3 pl-2 pr-4 py-1.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5 hover:border-moto-accent/50 rounded-full transition-all group hover:scale-105 active:scale-95"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-900 flex items-center justify-center text-gray-700 dark:text-white border border-white/10 group-hover:border-moto-accent transition-colors">
                                    <UserIcon className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                            </button>
                        ) : (
                            <button 
                                onClick={onOpenAuth}
                                className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-moto-accent hover:text-black dark:hover:bg-moto-accent dark:hover:text-black rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-black/5 hover:shadow-moto-accent/40 hover:scale-105 active:scale-95"
                            >
                                Giriş Yap
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* --- MEGA MENU DROPDOWN (Desktop) --- */}
        <AnimatePresence>
            {activeHover && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="hidden lg:block absolute top-full left-0 right-0 bg-white/95 dark:bg-[#050505]/95 backdrop-blur-3xl border-b border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden"
                    onMouseEnter={() => setActiveHover(activeHover)}
                    onMouseLeave={() => setActiveHover(null)}
                >
                    <div className="max-w-[1600px] mx-auto px-8 py-12">
                        {MENU_ITEMS.map((item) => (
                            item.id === activeHover && item.type === 'mega' && item.columns ? (
                                <div key={item.id} className="grid grid-cols-12 gap-12">
                                    
                                    {/* Categories */}
                                    <div className="col-span-8 grid grid-cols-2 gap-12 border-r border-gray-200 dark:border-white/5 pr-12">
                                        {item.columns.map((col, idx) => (
                                            <div key={idx}>
                                                <h3 className="flex items-center gap-3 text-sm font-bold text-moto-accent tracking-[0.2em] uppercase mb-8">
                                                    <span className="w-8 h-[1px] bg-moto-accent"></span>
                                                    {col.title}
                                                </h3>
                                                <ul className="space-y-4">
                                                    {col.items.map((subItem, subIdx) => (
                                                        <li key={subIdx}>
                                                            <button 
                                                                onClick={() => handleNavClick(item.view as ViewState, subItem.value)}
                                                                className="group flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-base font-medium w-full text-left"
                                                            >
                                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-white/10 group-hover:bg-moto-accent transition-colors"></div>
                                                                <span className="group-hover:translate-x-2 transition-transform duration-300">{subItem.label}</span>
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Featured Image Card */}
                                    {item.featured && (
                                        <div className="col-span-4">
                                            <div 
                                                className="relative group cursor-pointer overflow-hidden rounded-3xl h-full min-h-[350px] border border-gray-200 dark:border-white/10"
                                                onClick={() => handleNavClick(item.view as ViewState)}
                                            >
                                                <img 
                                                    src={item.featured.image} 
                                                    alt={item.featured.title} 
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                                                
                                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                                    <div className="inline-block px-3 py-1 bg-moto-accent text-black text-[10px] font-bold uppercase tracking-wider rounded-md mb-4 shadow-lg">
                                                        Editörün Seçimi
                                                    </div>
                                                    <h3 className="text-4xl font-display font-black text-white mb-2 leading-none uppercase drop-shadow-md">
                                                        {item.featured.title}
                                                    </h3>
                                                    <p className="text-gray-200 text-sm mb-6 max-w-[80%] drop-shadow-sm">{item.featured.desc}</p>
                                                    <div className="w-full h-[1px] bg-white/20 mb-4">
                                                        <div className="h-full bg-moto-accent w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-white">
                                                        <span>Şimdi Keşfet</span>
                                                        <Zap className="w-4 h-4 text-moto-accent" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : null
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </header>
    </>
  );
};
