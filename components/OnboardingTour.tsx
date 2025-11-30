

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Zap, Navigation, ShoppingBag, Bot, X, Search, Menu } from 'lucide-react';
import { Button } from './Button';

interface OnboardingTourProps {
    onComplete: () => void;
}

const STEPS = [
    {
        id: 'welcome',
        targetId: 'tour-logo',
        mobileTargetId: 'tour-logo',
        icon: Zap,
        title: "SİSTEM ÇEVRİMİÇİ",
        desc: "MotoVibe Ekosistemine hoş geldin sürücü. Burası sadece bir mağaza değil; yapay zeka destekli, yeni nesil bir sürüş üssü.",
        color: "text-yellow-400",
        position: 'center'
    },
    {
        id: 'nav',
        targetId: 'tour-nav-links',
        mobileTargetId: 'tour-mobile-menu',
        icon: Menu,
        title: "KOLAY NAVİGASYON",
        desc: "Rotalar, Forum, Koleksiyon ve Blog. İhtiyacın olan her şeye buradan hızlıca ulaşabilirsin.",
        color: "text-white"
    },
    {
        id: 'ai',
        targetId: 'tour-search', 
        mobileTargetId: 'tour-search',
        icon: Bot,
        title: "AI ASİSTAN & ARAMA",
        desc: "Kararsız mı kaldın? Gemini AI destekli asistanımız sana özel ekipmanları önerir veya hızlı arama yapabilirsin.",
        color: "text-moto-accent"
    },
    {
        id: 'ride',
        targetId: 'tour-nav-routes', // Updated to target Routes link
        mobileTargetId: 'tour-mobile-menu', // Fallback to menu on mobile
        icon: Navigation,
        title: "SÜRÜŞ MODU (HUD)",
        desc: "Rotalar sekmesinden 'Sürüşü Başlat' diyerek tarayıcını tam ekran bir yol bilgisayarına dönüştürebilirsin.",
        color: "text-blue-400"
    },
    {
        id: 'cart',
        targetId: 'tour-cart',
        mobileTargetId: 'tour-cart',
        icon: ShoppingBag,
        title: "AKILLI ENVANTER",
        desc: "Loadout'unu hazırla. Ekipmanlarını burada topla ve güvenle sipariş ver.",
        color: "text-green-400"
    }
];

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            updateTarget();
        };
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', updateTarget);
        
        // Initial check
        setTimeout(updateTarget, 100);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', updateTarget);
        };
    }, [currentStep]);

    const updateTarget = () => {
        const step = STEPS[currentStep];
        
        // Skip rect calculation for welcome step (it's always centered)
        if (step.id === 'welcome') {
            setTargetRect(null);
            return;
        }

        const targetId = window.innerWidth < 768 ? step.mobileTargetId : step.targetId;
        const element = document.getElementById(targetId);

        if (element) {
            const rect = element.getBoundingClientRect();
            // Add some padding
            setTargetRect({
                x: rect.left - 5,
                y: rect.top - 5,
                width: rect.width + 10,
                height: rect.height + 10
            });
            // Scroll to view if needed (smoothly)
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // Fallback to center if element not found
            setTargetRect(null);
        }
    };

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const step = STEPS[currentStep];
    const Icon = step.icon;

    // Calculate Tooltip Position
    const getTooltipStyle = (): React.CSSProperties => {
        // Welcome step or no target: Center screen
        if (!targetRect) {
            return {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: '400px',
                width: 'calc(100vw - 40px)',
                zIndex: 1002
            };
        }

        // MOBILE STRATEGY: Fixed bottom or top (safer for overflow)
        if (isMobile) {
            const isTargetInTopHalf = targetRect.y < window.innerHeight / 2;
            return {
                position: 'fixed',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'calc(100vw - 32px)', // Full width minus margin
                maxWidth: '400px',
                // If target is top, show tooltip at bottom. If target is bottom, show at top.
                [isTargetInTopHalf ? 'bottom' : 'top']: '24px', 
                zIndex: 1002
            };
        }

        // DESKTOP STRATEGY: Float near element
        const spaceBelow = window.innerHeight - (targetRect.y + targetRect.height);
        const showAbove = spaceBelow < 280; // If less than 280px space below

        // Clamp horizontal position to keep it inside screen
        const tooltipWidth = 350;
        const margin = 20;
        // Ideal left pos
        let leftPos = targetRect.x + targetRect.width / 2;
        
        return {
            position: 'absolute', // Absolute relative to document for scrolling support on desktop
            top: showAbove ? (targetRect.y - 20) + 'px' : (targetRect.y + targetRect.height + 20) + 'px',
            // Simple clamping logic for desktop
            left: Math.min(Math.max(tooltipWidth / 2 + margin, leftPos), window.innerWidth - tooltipWidth / 2 - margin) + 'px',
            transform: showAbove ? 'translate(-50%, -100%)' : 'translate(-50%, 0)', 
            maxWidth: '350px',
            width: '350px',
            zIndex: 1002
        };
    };

    const tooltipStyle = getTooltipStyle();

    return (
        <div className="fixed inset-0 z-[1000] overflow-hidden">
            {/* SVG MASK LAYER (Spotlight Effect) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-500 ease-in-out">
                <defs>
                    <mask id="tour-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        {targetRect && (
                            <rect 
                                x={targetRect.x} 
                                y={targetRect.y} 
                                width={targetRect.width} 
                                height={targetRect.height} 
                                fill="black" 
                                rx="12"
                            />
                        )}
                    </mask>
                </defs>
                <rect 
                    x="0" y="0" width="100%" height="100%" 
                    fill="rgba(0,0,0,0.85)" 
                    mask="url(#tour-mask)" 
                />
            </svg>

            {/* Target Highlight Ring (Pulse) */}
            {targetRect && (
                <motion.div 
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute border-2 border-moto-accent rounded-xl shadow-[0_0_20px_#ff1f1f] pointer-events-none"
                    style={{
                        left: targetRect.x,
                        top: targetRect.y,
                        width: targetRect.width,
                        height: targetRect.height
                    }}
                >
                    <div className="absolute inset-0 rounded-xl animate-ping border border-moto-accent opacity-50"></div>
                </motion.div>
            )}

            {/* Skip Button */}
            <button 
                onClick={onComplete}
                className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors z-[1001] bg-black/20 backdrop-blur rounded-full hover:bg-white/10"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Info Card (Tooltip) */}
            <motion.div 
                key={currentStep} // Re-animate on step change
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-[#0f0f0f] border border-white/20 rounded-3xl overflow-hidden shadow-2xl shadow-moto-accent/10"
                style={tooltipStyle}
            >
                {/* Decorative Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-moto-accent to-transparent"></div>
                
                <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                        <div className={`w-12 h-12 bg-[#1a1a1a] border border-white/10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                            <Icon className={`w-6 h-6 ${step.color}`} />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-xl font-display font-bold text-white tracking-wide leading-none mb-2 break-words">
                                {step.title}
                            </h2>
                            <div className="flex gap-1">
                                {STEPS.map((_, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`h-1 rounded-full transition-all duration-300 ${idx === currentStep ? `w-6 bg-moto-accent` : `w-2 bg-white/20`}`} 
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed mb-6 break-words">
                        {step.desc}
                    </p>

                    <Button 
                        variant="primary" 
                        onClick={handleNext}
                        className="w-full py-3 shadow-lg shadow-moto-accent/20 group text-sm"
                    >
                        {currentStep === STEPS.length - 1 ? (
                            <span className="flex items-center justify-center gap-2">BAŞLA <Check className="w-4 h-4" /></span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">İLERİ <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                        )}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};
