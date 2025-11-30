
import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Shield, Zap, Truck, Share2, Scale, Facebook, Twitter, Instagram, Link2, MessageCircle, Box, Image as ImageIcon, Maximize2, Handshake, CheckCircle2, Palette, Copy, Play, X, ShoppingBag } from 'lucide-react';
import { Product, ViewState, NegotiationOffer } from '../types';
import { Button } from './Button';
import { statsService } from '../services/statsService';
import { authService } from '../services/auth';
import { negotiationService } from '../services/negotiationService';
import { ProductCard } from './ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Model3D } from './Model3D';
import { StarRating } from './StarRating';
import { NegotiationModal } from './NegotiationModal';
import { useColorExtractor } from '../hooks/useColorExtractor';
import { notify } from '../services/notificationService';
import { RecentlyViewed } from './RecentlyViewed';

interface ProductDetailProps {
  product: Product | null;
  allProducts: Product[];
  onAddToCart: (product: Product, event?: React.MouseEvent) => void;
  onNavigate: (view: ViewState) => void;
  onProductClick: (product: Product) => void;
  onCompare?: (product: Product) => void;
  isCompared?: boolean;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  allProducts, 
  onAddToCart, 
  onNavigate, 
  onProductClick,
  onCompare,
  isCompared
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'image' | '3d'>('image');
  const [isNegotiationOpen, setIsNegotiationOpen] = useState(false);
  const [activeOffer, setActiveOffer] = useState<NegotiationOffer | null>(null);
  
  const lightboxRef = useRef<any>(null);

  // Demo 3D Model URL (Fallback if product doesn't have one)
  const DEMO_MODEL_URL = "https://modelviewer.dev/shared-assets/models/Astronaut.glb";

  // Color Extraction
  const { colors, dominantColor, loading: colorsLoading } = useColorExtractor(product?.image || '', 6);
  const secondaryColor = colors.length > 1 ? colors[1] : dominantColor;

  useEffect(() => {
    setActiveImageIndex(0);
    setShowShareMenu(false);
    setViewMode('image');
    setIsNegotiationOpen(false);
    setActiveOffer(null);

    if (product) {
        // Analytics
        const trackView = async () => {
            const user = await authService.getCurrentUser();
            statsService.trackEvent('view_product', {
                productId: product.id,
                productName: product.name,
                userId: user?.id,
                userName: user?.name
            });

            if (user && product.isNegotiable) {
                const offer = await negotiationService.checkUserOffer(user.id, product.id);
                if (offer) {
                    setActiveOffer(offer);
                }
            }
        };
        trackView();

        // Recently Viewed Logic
        try {
          const stored = localStorage.getItem('mv_recent_views');
          let ids: number[] = stored ? JSON.parse(stored) : [];
          // Remove if exists (to move to top)
          ids = ids.filter(id => id !== product.id);
          // Add to beginning
          ids.unshift(product.id);
          // Keep max 10
          if (ids.length > 10) ids.pop();
          localStorage.setItem('mv_recent_views', JSON.stringify(ids));
        } catch (e) {
          console.error("Storage error", e);
        }
    }
  }, [product?.id]);

  useEffect(() => {
      if (window.GLightbox) {
          lightboxRef.current = window.GLightbox({
              selector: '.product-gallery',
              touchNavigation: true,
              loop: true,
              autoplayVideos: true
          });
      }
      return () => {
          if (lightboxRef.current) {
              lightboxRef.current.destroy();
          }
      };
  }, [product]);

  const openLightbox = (index: number) => {
      if (lightboxRef.current) {
          lightboxRef.current.openAt(index);
      }
  };

  const handleAddToCart = (e?: React.MouseEvent) => {
      if (!product) return;
      const productToAdd = activeOffer 
          ? { ...product, price: activeOffer.offerPrice }
          : product;
      onAddToCart(productToAdd, e);
  };

  if (!product) return <div className="pt-32 text-center">Ürün seçilmedi.</div>;

  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const galleryImages = (product.images && product.images.length > 0) 
      ? product.images 
      : [product.image, product.image, product.image, product.image];

  const handleShare = (platform: string) => {
      const url = window.location.href;
      const text = `${product.name} - MotoVibe'da incele!`;
      let shareUrl = '';
      switch(platform) {
          case 'whatsapp': shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`; break;
          case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`; break;
          case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; break;
          case 'copy': 
              navigator.clipboard.writeText(url);
              setCopySuccess(true);
              setTimeout(() => setCopySuccess(false), 2000);
              return;
      }
      if (shareUrl) window.open(shareUrl, '_blank');
      setShowShareMenu(false);
  };

  const handleCopyColor = (color: string) => {
      navigator.clipboard.writeText(color);
      notify.success(`Renk kopyalandı: ${color}`);
  };

  const currentPrice = activeOffer ? activeOffer.offerPrice : product.price;

  // 3D Model source
  const modelSource = product.model3d || DEMO_MODEL_URL;

  return (
    <div className="relative pt-20 md:pt-32 pb-32 md:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      
      {/* Ambient Glow */}
      {dominantColor && (
          <div 
            className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[150vw] h-[1000px] z-0 opacity-40 dark:opacity-20 pointer-events-none transition-colors duration-1000 blur-[120px]"
            style={{ background: `radial-gradient(circle at center top, ${dominantColor}, ${secondaryColor || 'transparent'} 60%, transparent 80%)` }}
          ></div>
      )}

      {/* Main Content */}
      <div className="relative z-10">
        <Button variant="ghost" onClick={() => onNavigate('shop')} className="mb-4 md:mb-8 pl-0 hover:bg-transparent hover:text-moto-accent group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            MAĞAZAYA DÖN
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-20 mb-8 md:mb-20">
            {/* Left Column: Image */}
            <div className="relative">
                {/* Controls Overlay */}
                <div className="absolute top-4 right-4 z-30 flex bg-black/20 backdrop-blur-md p-1 rounded-xl border border-white/10 gap-1">
                    <button 
                        onClick={() => setViewMode('image')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'image' ? 'bg-white text-black shadow-lg' : 'text-white hover:bg-white/10'}`}
                        title="Galeri"
                    >
                        <ImageIcon className="w-5 h-5" />
                    </button>
                    {/* Only show 3D button if model exists */}
                    {product.model3d && (
                        <button 
                            onClick={() => setViewMode('3d')}
                            className={`p-2 rounded-lg transition-all ${viewMode === '3d' ? 'bg-moto-accent text-white shadow-lg' : 'text-white hover:bg-white/10'}`}
                            title="3D Model"
                        >
                            <Box className="w-5 h-5" />
                        </button>
                    )}
                    {viewMode === 'image' && (
                        <button 
                            onClick={() => openLightbox(activeImageIndex)}
                            className="p-2 rounded-lg text-white hover:bg-white/10 border-l border-white/10 ml-1"
                            title="Tam Ekran"
                        >
                            <Maximize2 className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Hidden Gallery */}
                <div className="hidden">
                    {galleryImages.map((img, i) => (
                        <a key={i} href={img} className="product-gallery" data-gallery="product-images"></a>
                    ))}
                </div>

                <div className="relative aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-[#0a0a0a] group shadow-sm">
                    {viewMode === 'image' ? (
                        <>
                            <img 
                            src={galleryImages[activeImageIndex]} 
                            alt={product.name} 
                            onClick={() => openLightbox(activeImageIndex)}
                            className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110 cursor-pointer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                        </>
                    ) : (
                        <Model3D 
                            src={product.model3d || ''} 
                            poster={product.image}
                            alt={product.name}
                        />
                    )}
                </div>
                
                {/* Thumbnails */}
                <div className={`grid grid-cols-4 gap-2 md:gap-4 mt-2 md:mt-4 transition-opacity duration-300 ${viewMode === '3d' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                    {galleryImages.map((img, i) => (
                    <div 
                        key={i} 
                        onClick={() => setActiveImageIndex(i)}
                        className={`aspect-square rounded-lg border-2 overflow-hidden cursor-pointer transition-all duration-300 ${
                            activeImageIndex === i 
                            ? 'border-moto-accent ring-2 ring-moto-accent/20 shadow-lg' 
                            : 'border-gray-200 dark:border-white/10 opacity-70 hover:opacity-100'
                        } bg-gray-100 dark:bg-gray-900`}
                    >
                        <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                    ))}
                </div>

                {/* Color Palette */}
                {!colorsLoading && colors.length > 0 && (
                    <div className="mt-4 md:mt-6 p-4 bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                            <Palette className="w-4 h-4" /> AI Renk Analizi
                        </div>
                        <div className="flex items-center gap-3">
                            {colors.map((color, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => handleCopyColor(color)}
                                    className="w-8 h-8 rounded-full border border-white/20 shadow-lg relative z-10 hover:scale-110 transition-transform"
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column: Details */}
            <div className="flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-2 md:mb-4">
                <span className="px-3 py-1 bg-moto-accent/10 border border-moto-accent/20 text-moto-accent text-xs font-bold uppercase tracking-widest rounded-full">
                {product.category}
                </span>
                <div className="flex items-center gap-1">
                <StarRating rating={product.rating} size={16} />
                <span className="text-gray-900 dark:text-white font-bold text-sm ml-2">{product.rating}</span>
                </div>
            </div>

            <h1 className="text-2xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4 md:mb-6 leading-tight">
                {product.name}
            </h1>

            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-lg leading-relaxed mb-6 md:mb-8 border-l-2 border-moto-accent pl-4 md:pl-6">
                {product.description}
            </p>

            {/* Price (Desktop Only - Mobile Moved to Sticky Footer) */}
            <div className="hidden md:flex flex-col mb-8">
                {activeOffer && (
                    <div className="flex items-center gap-2 mb-2 animate-in slide-in-from-left">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-bold text-green-500 uppercase tracking-wide">Teklifiniz Onaylandı!</span>
                    </div>
                )}
                <div className="flex items-end gap-4">
                    <div className={`font-mono font-bold text-gray-900 dark:text-white ${activeOffer ? 'text-green-500 text-5xl' : 'text-4xl'}`}>
                    ₺{currentPrice.toLocaleString('tr-TR')}
                    </div>
                    {!activeOffer && (
                        <div className="text-gray-500 line-through mb-2 text-lg">
                            ₺{(product.price * 1.2).toLocaleString('tr-TR')}
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-6 mb-10">
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5">
                <Shield className="w-6 h-6 text-gray-400" />
                <div>
                    <h4 className="text-gray-900 dark:text-white text-sm font-bold">Orijinal Ürün Garantisi</h4>
                    <p className="text-gray-500 text-xs">Resmi distribütör garantili</p>
                </div>
                </div>
                
                <div>
                <h4 className="text-gray-900 dark:text-white font-bold mb-4 text-sm uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-4 h-4 text-moto-accent" /> Teknik Özellikler
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-600 dark:text-gray-300 text-sm">
                        <div className="w-1.5 h-1.5 bg-moto-accent rounded-full"></div>
                        {feature}
                    </li>
                    ))}
                </ul>
                </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex flex-row gap-4 relative z-50">
                <Button variant="primary" size="lg" className="flex-1" onClick={(e) => handleAddToCart(e)}>
                {activeOffer ? 'İNDİRİMLİ SEPETE EKLE' : 'SEPETE EKLE'}
                </Button>
                
                {product.isNegotiable && !activeOffer && (
                    <button 
                        onClick={() => setIsNegotiationOpen(true)}
                        className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
                    >
                        <Handshake className="w-5 h-5" />
                        <span>PAZARLIK YAP</span>
                    </button>
                )}

                {/* Share Button */}
                <div className="relative">
                    <Button 
                        variant="outline" 
                        size="lg" 
                        onClick={() => setShowShareMenu(!showShareMenu)}
                    >
                        {copySuccess ? <span className="text-green-500 font-bold text-xs animate-pulse">KOPYALANDI</span> : <Share2 className="w-5 h-5" />}
                    </Button>
                    <AnimatePresence>
                        {showShareMenu && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: -10 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex gap-2"
                            >
                                {[{ id: 'whatsapp', icon: MessageCircle }, { id: 'twitter', icon: Twitter }, { id: 'copy', icon: Link2 }].map((item) => (
                                    <button 
                                        key={item.id}
                                        onClick={() => handleShare(item.id)}
                                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white"
                                    >
                                        <item.icon className="w-5 h-5" />
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            
            </div>
        </div>

      {/* MOBILE STICKY FOOTER ACTION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#111] border-t border-gray-200 dark:border-white/10 p-3 z-50 flex items-center gap-3 pb-safe">
          <div className="flex-1">
              <div className="text-[10px] text-gray-500 uppercase font-bold">Toplam Tutar</div>
              <div className="text-xl font-mono font-bold text-moto-accent">₺{currentPrice.toLocaleString('tr-TR')}</div>
          </div>
          {product.isNegotiable && !activeOffer && (
             <button onClick={() => setIsNegotiationOpen(true)} className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                 <Handshake className="w-6 h-6" />
             </button>
          )}
          <Button variant="primary" className="flex-1 h-12 text-sm shadow-lg shadow-moto-accent/20" onClick={(e) => handleAddToCart(e)}>
              SEPETE EKLE
          </Button>
      </div>

      <NegotiationModal 
        isOpen={isNegotiationOpen} 
        onClose={() => setIsNegotiationOpen(false)} 
        product={product} 
        onAddToCart={(p) => handleAddToCart()} 
      />

      {/* Recently Viewed - Added here */}
      <RecentlyViewed 
        currentProductId={product.id}
        allProducts={allProducts}
        onAddToCart={onAddToCart}
        onProductClick={onProductClick}
      />

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-gray-200 dark:border-white/10 pt-16">
            <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
                BUNLARI DA <span className="text-moto-accent">BEĞENEBİLİRSİN</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map(rp => (
                    <ProductCard 
                        key={rp.id} 
                        product={rp} 
                        onAddToCart={onAddToCart} 
                        onClick={onProductClick} 
                    />
                ))}
            </div>
        </div>
      )}
    </div>
  );
};
