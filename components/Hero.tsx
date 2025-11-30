import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, ArrowRight, Volume2, VolumeX, Play } from 'lucide-react';
import { ViewState, Slide } from '../types';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { DEFAULT_SLIDES } from '../constants';
import { sliderService } from '../services/sliderService';

interface HeroProps {
  onNavigate: (view: ViewState) => void;
}

// Helper: Extract YouTube ID (Duplicated to avoid import issues from other components if not exported)
const getYouTubeID = (url: string) => {
    if (!url) return false;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7] && match[7].length === 11) ? match[7] : false;
};

// React-Video-Cover Equivalent Implementation
const VideoCover = ({ src, poster, isMuted }: { src: string, poster: string, isMuted: boolean }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.defaultMuted = true;
            videoRef.current.muted = isMuted;
            
            // Force load to help with buffering
            videoRef.current.load();

            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn("Auto-play was prevented. Interaction required.", error);
                });
            }
        }
    }, [src, isMuted]);

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
            <video
                ref={videoRef}
                className="w-full h-full object-cover opacity-90 will-change-transform"
                src={src}
                poster={poster}
                autoPlay
                loop
                muted // Explicit attribute
                playsInline
                preload="auto" // Aggressive buffering for smoother playback
                disablePictureInPicture
                onContextMenu={(e) => e.preventDefault()}
            />
            <div className="absolute inset-0 bg-black/20"></div>
        </div>
    );
};

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [slides, setSlides] = useState<Slide[]>(DEFAULT_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const slideLength = slides.length;
  // Increase duration for video slides to let users watch a bit
  const autoPlayTime = slides[currentSlide]?.type === 'video' ? 12000 : 6000; 

  useEffect(() => {
      const loadSlides = async () => {
          try {
              // Force refresh logic handles inside service
              const fetchedSlides = await sliderService.getSlides();
              if (fetchedSlides && fetchedSlides.length > 0) {
                  setSlides(fetchedSlides);
              }
          } catch (error) {
              console.error("Slider loading failed", error);
          }
      };
      loadSlides();
  }, []);

  const startAutoPlay = () => {
      stopAutoPlay();
      autoPlayRef.current = setInterval(() => {
          nextSlide();
      }, autoPlayTime);
  };

  const stopAutoPlay = () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [currentSlide, slideLength, autoPlayTime]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slideLength);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slideLength) % slideLength);
  };

  const toggleMute = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsMuted(!isMuted);
  };

  const slideVariants: Variants = {
      enter: (direction: number) => ({
          x: direction > 0 ? '100%' : '-100%',
          opacity: 0,
          scale: 1.1 // Parallax feel
      }),
      center: {
          x: 0,
          opacity: 1,
          scale: 1,
          transition: {
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 },
              scale: { duration: 6, ease: "linear" } // Ken Burns effect
          }
      },
      exit: (direction: number) => ({
          x: direction < 0 ? '100%' : '-100%',
          opacity: 0,
          transition: {
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 }
          }
      })
  };

  return (
    <section 
        className="relative w-full h-[600px] md:h-[750px] overflow-hidden bg-[#050505] group"
        onMouseEnter={stopAutoPlay}
        onMouseLeave={startAutoPlay}
    >
      <AnimatePresence initial={false} custom={direction} mode='popLayout'>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          {/* Background: Video Cover (YouTube/MP4) or Image */}
          <div className="absolute inset-0">
            {slides[currentSlide].type === 'video' && slides[currentSlide].videoUrl ? (
                getYouTubeID(slides[currentSlide].videoUrl!) ? (
                    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden pointer-events-none">
                        <iframe 
                            className="w-full h-full scale-[1.35] opacity-80"
                            src={`https://www.youtube.com/embed/${getYouTubeID(slides[currentSlide].videoUrl!)}?autoplay=1&mute=1&controls=0&loop=1&playlist=${getYouTubeID(slides[currentSlide].videoUrl!)}&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1`}
                            allow="autoplay; encrypted-media"
                            style={{ pointerEvents: 'none' }}
                        ></iframe>
                        <div className="absolute inset-0 bg-black/30"></div>
                    </div>
                ) : (
                    <VideoCover 
                        src={slides[currentSlide].videoUrl!} 
                        poster={slides[currentSlide].image} 
                        isMuted={isMuted} 
                    />
                )
            ) : (
                <motion.img 
                    src={slides[currentSlide].image} 
                    alt={slides[currentSlide].title} 
                    className="w-full h-full object-cover"
                />
            )}
            
            {/* Cinematic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
            <div className="max-w-2xl">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-4 flex items-center gap-2"
              >
                  {slides[currentSlide].type === 'video' ? (
                      <span className="px-3 py-1 bg-red-600/90 text-white text-[10px] font-bold uppercase rounded-full flex items-center gap-2 animate-pulse">
                          <Play className="w-3 h-3 fill-current" /> Live Action
                      </span>
                  ) : (
                      <span className="px-3 py-1 bg-moto-accent text-black text-[10px] font-bold uppercase rounded-full">
                          Yeni Sezon
                      </span>
                  )}
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-5xl md:text-7xl font-display font-black text-white mb-6 leading-[0.9] tracking-tight drop-shadow-2xl"
              >
                  {slides[currentSlide].title.split(' ').map((word, i) => (
                      <span key={i} className="block">{word}</span>
                  ))}
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }} 
                className="h-1 w-24 bg-moto-accent mb-6"
              ></motion.div>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-lg text-gray-300 mb-8 max-w-lg font-medium leading-relaxed"
              >
                  {slides[currentSlide].subtitle}
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-4"
              >
                  <button 
                      onClick={() => onNavigate(slides[currentSlide].action as ViewState)}
                      className="group relative px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm overflow-hidden"
                  >
                      <div className="absolute inset-0 w-full h-full bg-moto-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                      <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
                          {slides[currentSlide].cta} <ArrowRight className="w-4 h-4" />
                      </span>
                  </button>
                  
                  {slides[currentSlide].type === 'video' && !getYouTubeID(slides[currentSlide].videoUrl!) && (
                      <button 
                          onClick={toggleMute}
                          className="px-4 py-4 border border-white/20 text-white hover:bg-white/10 transition-colors"
                      >
                          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                  )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Modern Controls */}
      <div className="absolute bottom-10 right-10 z-20 flex gap-2">
          <button 
            onClick={prevSlide} 
            className="w-12 h-12 flex items-center justify-center border border-white/20 text-white hover:bg-white hover:text-black transition-all"
          >
              <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextSlide} 
            className="w-12 h-12 flex items-center justify-center bg-moto-accent text-white hover:bg-white hover:text-black transition-all shadow-lg shadow-moto-accent/20"
          >
              <ChevronRight className="w-6 h-6" />
          </button>
      </div>
      
      {/* Progress Bar Indicators */}
      <div className="absolute bottom-10 left-10 z-20 flex gap-4">
          {slides.map((_, idx) => (
              <div 
                key={idx} 
                onClick={() => setCurrentSlide(idx)}
                className="group cursor-pointer flex flex-col gap-2"
              >
                  <span className={`text-[10px] font-bold transition-colors ${currentSlide === idx ? 'text-white' : 'text-white/40'}`}>
                      0{idx + 1}
                  </span>
                  <div className="w-12 h-[2px] bg-white/20 overflow-hidden relative">
                      {currentSlide === idx && (
                          <motion.div 
                              className="absolute inset-0 bg-moto-accent"
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ duration: autoPlayTime / 1000, ease: 'linear' }}
                          />
                      )}
                  </div>
              </div>
          ))}
      </div>
    </section>
  );
};