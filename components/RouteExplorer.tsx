import React, { useState, useEffect, useRef } from 'react';
import { Map as MapIcon, List, Calendar, Plus, User, Play, RotateCcw, Satellite, Sparkles, X, MousePointer2, LocateFixed, MapPin, Navigation, ArrowRight, Flag, CircleDot, ExternalLink } from 'lucide-react';
import { Route, User as UserType } from '../types';
import { Button } from './Button';
import { sendMessageToGemini } from '../services/geminiService';
import { routeService } from '../services/routeService';

declare const L: any;

interface RouteExplorerProps {
  user?: UserType | null;
  onOpenAuth?: () => void;
  onStartRide?: (route: Route | null) => void;
}

export const RouteExplorer: React.FC<RouteExplorerProps> = ({ user, onOpenAuth, onStartRide }) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [focusedRouteId, setFocusedRouteId] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  
  // Navigation Choice State
  const [navChoiceRoute, setNavChoiceRoute] = useState<Route | null>(null);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newRouteForm, setNewRouteForm] = useState<Partial<Route>>({
      title: '', description: '', difficulty: 'Orta', distance: '', duration: '', location: '', bestSeason: 'Yaz', image: '', tags: [], path: [], coordinates: { lat: 0, lng: 0 }
  });
  
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<any[]>([]);
  const createMapRef = useRef<any>(null);
  const createMapContainerRef = useRef<HTMLDivElement>(null);
  const waypointsRef = useRef<any[]>([]);
  const routingControlRef = useRef<any>(null);

  useEffect(() => {
    routeService.getRoutes().then(setRoutes);
  }, []);

  useEffect(() => {
    if (viewMode === 'map' && mapContainerRef.current && !mapRef.current && typeof L !== 'undefined') {
        const map = L.map(mapContainerRef.current, { zoomControl: false, attributionControl: false }).setView([39.9, 32.8], 6);
        // CartoDB Dark Matter for the Dark Theme
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);
        mapRef.current = map;
    }
  }, [viewMode]);

  // Harita Görselleştirme Mantığı
  useEffect(() => {
    if (viewMode === 'map' && mapRef.current) {
        // Temizlik
        layersRef.current.forEach(l => l.remove());
        layersRef.current = [];
        const map = mapRef.current;

        if (focusedRouteId) {
            // --- DETAY GÖRÜNÜMÜ (Tek Rota) ---
            const route = routes.find(r => r.id === focusedRouteId);
            if (route && route.path && route.path.length > 0) {
                const latlngs = route.path.map(p => [p.lat, p.lng]);
                
                // 1. Neon Glow Efekti (Alt Katman)
                const glowLine = L.polyline(latlngs, { 
                    color: '#F2A619', 
                    weight: 12, 
                    opacity: 0.3,
                    lineCap: 'round',
                    lineJoin: 'round'
                }).addTo(map);
                
                // 2. Ana Çizgi (Üst Katman)
                const mainLine = L.polyline(latlngs, { 
                    color: '#fff', 
                    weight: 4, 
                    opacity: 1,
                    lineCap: 'round'
                }).addTo(map);

                layersRef.current.push(glowLine, mainLine);

                // 3. Başlangıç Noktası
                const startIcon = L.divIcon({
                    className: 'map-marker-start',
                    html: `<div class="relative flex items-center justify-center w-8 h-8">
                             <div class="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-50"></div>
                             <div class="relative w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white font-bold text-[10px]">A</div>
                           </div>`,
                    iconSize: [32, 32],
                    iconAnchor: [16, 16]
                });
                layersRef.current.push(L.marker(latlngs[0], { icon: startIcon }).addTo(map).bindPopup('<b>Başlangıç</b>'));

                // 4. Bitiş Noktası
                const endIcon = L.divIcon({
                    className: 'map-marker-end',
                    html: `<div class="relative flex items-center justify-center w-8 h-8">
                             <div class="relative w-6 h-6 bg-red-600 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white font-bold text-[10px]">B</div>
                           </div>`,
                    iconSize: [32, 32],
                    iconAnchor: [16, 16]
                });
                layersRef.current.push(L.marker(latlngs[latlngs.length-1], { icon: endIcon }).addTo(map).bindPopup('<b>Bitiş</b>'));

                // Haritayı ortala
                map.fitBounds(glowLine.getBounds(), { padding: [100, 100], maxZoom: 14 });
            }
        } else {
            // --- GENEL GÖRÜNÜM (Tüm Rotalar) ---
            routes.forEach(route => {
                if (route.coordinates) {
                    // Özel Pin İkonu
                    const icon = L.divIcon({
                        className: 'custom-map-pin',
                        html: `
                            <div class="group relative flex flex-col items-center cursor-pointer transition-transform hover:scale-110 hover:-translate-y-2">
                                <div class="w-10 h-10 bg-[#1A1A17] rounded-xl border-2 border-[#F2A619] shadow-[0_0_15px_rgba(242,166,25,0.5)] flex items-center justify-center overflow-hidden">
                                    <img src="${route.image}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                                </div>
                                <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#F2A619] -mt-[1px]"></div>
                                <div class="w-8 h-2 bg-black/50 blur-sm rounded-full mt-1"></div>
                            </div>
                        `,
                        iconSize: [40, 50],
                        iconAnchor: [20, 50],
                        popupAnchor: [0, -50]
                    });

                    const marker = L.marker([route.coordinates.lat, route.coordinates.lng], { icon })
                        .addTo(map)
                        .bindPopup(`
                            <div class="font-sans text-center">
                                <h3 class="font-bold text-base mb-1">${route.title}</h3>
                                <div class="text-xs text-gray-500 mb-2">${route.location}</div>
                                <span class="inline-block px-2 py-1 bg-[#F2A619] text-black text-[10px] font-bold rounded uppercase">${route.difficulty}</span>
                                <div class="mt-2 text-xs font-mono">${route.distance}</div>
                            </div>
                        `, {
                            closeButton: false,
                            className: 'custom-popup-dark'
                        })
                        .on('click', () => {
                            setFocusedRouteId(route.id);
                        });
                        
                    layersRef.current.push(marker);
                }
            });
            
            // Tüm markerları görecek şekilde zoom yap (eğer rota varsa)
            if (routes.length > 0) {
                const group = new L.featureGroup(layersRef.current);
                map.fitBounds(group.getBounds().pad(0.2));
            }
        }
    }
  }, [viewMode, routes, focusedRouteId]);

  useEffect(() => {
      if (isCreating && createMapContainerRef.current && !createMapRef.current && typeof L !== 'undefined') {
          const map = L.map(createMapContainerRef.current, { zoomControl: false, attributionControl: false }).setView([39.92, 32.85], 10);
          L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { attribution: '&copy; CARTO', subdomains: 'abcd' }).addTo(map);
          
          map.on('click', (e: any) => {
              if (waypointsRef.current.length >= 2) {
                  waypointsRef.current = [e.latlng];
                  if (routingControlRef.current) { map.removeControl(routingControlRef.current); routingControlRef.current = null; }
              } else {
                  waypointsRef.current.push(e.latlng);
              }
              L.marker(e.latlng, { icon: L.divIcon({ className: 'c-marker', html: `<div class="w-4 h-4 bg-[#1A1A17] rounded-full border-2 border-[#F2A619]"></div>`}) }).addTo(map);

              if (waypointsRef.current.length === 2) {
                  const control = L.Routing.control({
                      waypoints: waypointsRef.current,
                      router: L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1', profile: 'driving' }),
                      lineOptions: { styles: [{ color: '#1A1A17', opacity: 0.8, weight: 6 }, { color: '#F2A619', opacity: 1, weight: 2, dashArray: '10,10' }] },
                      createMarker: () => null, addWaypoints: false, show: false
                  }).addTo(map);
                  control.on('routesfound', (e: any) => {
                      const r = e.routes[0];
                      setNewRouteForm(prev => ({
                          ...prev,
                          distance: `${(r.summary.totalDistance / 1000).toFixed(1)} km`,
                          duration: `${Math.round(r.summary.totalTime / 60)} dk`,
                          path: r.coordinates.map((c: any) => ({ lat: c.lat, lng: c.lng })),
                          coordinates: { lat: waypointsRef.current[0].lat, lng: waypointsRef.current[0].lng },
                          location: 'Seçilen Konum'
                      }));
                  });
                  routingControlRef.current = control;
              }
          });
          createMapRef.current = map;
      }
      if (!isCreating && createMapRef.current) { createMapRef.current.remove(); createMapRef.current = null; waypointsRef.current = []; routingControlRef.current = null; }
  }, [isCreating]);

  const handleAnalyzeRoute = async (route: Route) => {
    setSelectedRoute(route); setAiAnalysis(null); setIsLoadingAI(true);
    try {
        const prompt = `Analiz et: ${route.title} (${route.location}), Zorluk: ${route.difficulty}. Format: 1. Yol Durumu, 2. Sürüş Tavsiyesi, 3. Ekipman. Türkçe.`;
        const response = await sendMessageToGemini(prompt);
        setAiAnalysis(response);
    } catch { setAiAnalysis("Analiz yapılamadı."); } finally { setIsLoadingAI(false); }
  };

  const handleCreateRoute = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) return;
      try {
          const added = await routeService.addRoute({ ...newRouteForm, authorId: user.id, authorName: user.name, image: 'https://images.unsplash.com/photo-1605152276897-4f618f831968?q=80&w=1200' } as any);
          setRoutes([added, ...routes]); setIsCreating(false);
      } catch (e) { console.error(e); }
  };

  const handleRouteSelection = (route: Route) => {
      setNavChoiceRoute(route);
  };

  const handleNavigateGoogle = () => {
      if (!navChoiceRoute?.coordinates) return;
      const { lat, lng } = navChoiceRoute.coordinates;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(url, '_blank');
      setNavChoiceRoute(null);
  };

  const handleNavigateMotoVibe = () => {
      if (onStartRide) onStartRide(navChoiceRoute);
      setNavChoiceRoute(null);
      setSelectedRoute(null);
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 relative z-10">
            <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-4 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">ROTA <span className="text-[#F2A619]">PLANLAYICI</span></h1>
            <p className="text-gray-200 text-lg mb-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] font-medium">Yeni yollar keşfet, AI ile analiz et ve sürüşe başla.</p>
            <div className="flex justify-center gap-4 flex-wrap">
                <div className="inline-flex bg-[#242421] rounded-xl p-1 border border-white/5 shadow-lg">
                    <button onClick={() => setViewMode('grid')} className={`px-6 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${viewMode === 'grid' ? 'bg-[#F2A619] text-[#1A1A17]' : 'text-gray-400 hover:text-white'}`}><List className="w-4 h-4" /> LİSTE</button>
                    <button onClick={() => setViewMode('map')} className={`px-6 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${viewMode === 'map' ? 'bg-[#F2A619] text-[#1A1A17]' : 'text-gray-400 hover:text-white'}`}><MapIcon className="w-4 h-4" /> HARİTA</button>
                </div>
                
                <Button 
                    onClick={() => { if(onStartRide) onStartRide(null); }} 
                    className="bg-white text-black hover:bg-gray-200 shadow-lg font-bold"
                >
                    <Navigation className="w-4 h-4 mr-2" /> SERBEST SÜRÜŞ
                </Button>

                {user ? <Button onClick={() => setIsCreating(true)} className="bg-[#F2A619] text-[#1A1A17] hover:bg-white shadow-lg"><Plus className="w-4 h-4 mr-2" /> YENİ ROTA</Button> : <Button variant="outline" onClick={onOpenAuth} className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm shadow-md"><User className="w-4 h-4 mr-2" /> GİRİŞ YAP</Button>}
            </div>
        </div>

        {isCreating && (
            <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#1A1A17] border border-white/10 rounded-3xl w-full max-w-6xl h-[85vh] flex overflow-hidden shadow-2xl">
                    <div className="flex-1 relative bg-[#0f0f0f]">
                        <div ref={createMapContainerRef} className="w-full h-full" />
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#1A1A17]/90 px-4 py-2 rounded-full border border-white/10 text-xs text-[#F2A619] font-bold z-[400] flex items-center gap-2"><MousePointer2 className="w-3 h-3" /> {waypointsRef.current.length === 0 ? 'Başlangıç Seçin' : 'Bitiş Seçin'}</div>
                    </div>
                    <div className="w-[400px] bg-[#242421] p-6 border-l border-white/10 overflow-y-auto">
                        <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold text-white">Rota Detayları</h3><button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button></div>
                        <form onSubmit={handleCreateRoute} className="space-y-4">
                            <input type="text" placeholder="Rota Başlığı" className="w-full bg-[#1A1A17] border border-white/10 rounded-xl p-3 text-white focus:border-[#F2A619] outline-none" value={newRouteForm.title} onChange={e => setNewRouteForm({...newRouteForm, title: e.target.value})} required />
                            <div className="flex gap-2"><div className="bg-[#1A1A17] p-3 rounded-xl border border-white/10 flex-1"><div className="text-[10px] text-gray-500 uppercase font-bold">Mesafe</div><div className="text-[#F2A619] font-bold">{newRouteForm.distance || '--'}</div></div><div className="bg-[#1A1A17] p-3 rounded-xl border border-white/10 flex-1"><div className="text-[10px] text-gray-500 uppercase font-bold">Süre</div><div className="text-[#F2A619] font-bold">{newRouteForm.duration || '--'}</div></div></div>
                            <textarea placeholder="Açıklama" className="w-full bg-[#1A1A17] border border-white/10 rounded-xl p-3 text-white focus:border-[#F2A619] outline-none h-24" value={newRouteForm.description} onChange={e => setNewRouteForm({...newRouteForm, description: e.target.value})} />
                            <Button type="submit" variant="primary" className="w-full justify-center" disabled={!newRouteForm.path?.length}>KAYDET</Button>
                        </form>
                    </div>
                </div>
            </div>
        )}

        {/* --- NAVIGATION CHOICE MODAL --- */}
        {navChoiceRoute && (
            <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-[#1A1A17] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative text-center">
                    <button onClick={() => setNavChoiceRoute(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5"/></button>
                    <h3 className="text-2xl font-display font-bold text-white mb-2 leading-none">NAVİGASYON SEÇİMİ</h3>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed"><span className="text-[#F2A619] font-bold">{navChoiceRoute.title}</span> rotası için hangi sistemi kullanmak istersin?</p>
                    
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={handleNavigateGoogle}
                            className="bg-white text-black p-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors shadow-lg group"
                        >
                            <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span>Google Haritalar</span>
                            <ExternalLink className="w-3 h-3 text-gray-500 ml-auto" />
                        </button>
                        
                        <button 
                            onClick={handleNavigateMotoVibe}
                            className="bg-[#F2A619] text-[#1A1A17] p-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-white transition-colors shadow-lg shadow-[#F2A619]/20 group"
                        >
                            <Navigation className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span>MotoVibe Sürüş Modu</span>
                            <ArrowRight className="w-3 h-3 text-[#1A1A17]/60 ml-auto" />
                        </button>
                    </div>
                </div>
            </div>
        )}

        {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {routes.map(route => (
                    <div key={route.id} className="group bg-[#242421] border border-white/5 rounded-3xl overflow-hidden hover:border-[#F2A619]/30 transition-all hover:-translate-y-1">
                        <div className="h-56 relative cursor-pointer" onClick={() => handleAnalyzeRoute(route)}>
                            <img src={route.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#242421] to-transparent"></div>
                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-[#F2A619] text-[10px] font-bold uppercase border border-[#F2A619]/20">{route.difficulty}</div>
                            <div className="absolute bottom-4 left-6"><h3 className="text-xl font-bold text-white">{route.title}</h3><p className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {route.location}</p></div>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between border-b border-white/5 pb-4 mb-4">
                                <div className="text-center"><div className="text-[10px] text-gray-500 uppercase font-bold">Mesafe</div><div className="text-white font-mono">{route.distance}</div></div>
                                <div className="text-center"><div className="text-[10px] text-gray-500 uppercase font-bold">Süre</div><div className="text-white font-mono">{route.duration}</div></div>
                                <div className="text-center"><div className="text-[10px] text-gray-500 uppercase font-bold">Sezon</div><div className="text-white font-mono">{route.bestSeason}</div></div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleRouteSelection(route)} className="flex-1 bg-[#F2A619] text-[#1A1A17] py-2.5 rounded-xl text-xs font-bold uppercase hover:bg-white transition-colors flex items-center justify-center gap-2"><Play className="w-3 h-3 fill-current"/> Sürüş</button>
                                <button onClick={() => handleAnalyzeRoute(route)} className="flex-1 bg-white/5 text-white py-2.5 rounded-xl text-xs font-bold uppercase hover:bg-white/10 transition-colors flex items-center justify-center gap-2 border border-white/10">Analiz <ArrowRight className="w-3 h-3"/></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="bg-[#242421] border border-white/10 rounded-3xl h-[600px] relative overflow-hidden shadow-2xl">
                <div ref={mapContainerRef} className="w-full h-full z-0" />
                {focusedRouteId ? (
                    <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2">
                        <button onClick={() => setFocusedRouteId(null)} className="bg-[#1A1A17]/90 backdrop-blur text-[#F2A619] px-4 py-2 rounded-xl font-bold text-xs shadow-lg border border-[#F2A619]/20 flex items-center gap-2 hover:bg-black transition-colors">
                            <RotateCcw className="w-3 h-3" /> TÜM ROTALAR
                        </button>
                        <div className="bg-[#1A1A17]/90 backdrop-blur p-4 rounded-xl border border-white/10 w-64 animate-in slide-in-from-left">
                            {(() => {
                                const r = routes.find(ro => ro.id === focusedRouteId);
                                return r ? (
                                    <>
                                        <h3 className="font-bold text-white text-lg leading-tight mb-1">{r.title}</h3>
                                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3"><MapPin className="w-3 h-3" /> {r.location}</div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[#F2A619] font-mono font-bold">{r.distance}</span>
                                            <button onClick={() => handleAnalyzeRoute(r)} className="text-white hover:text-[#F2A619] text-xs font-bold uppercase">Detaylar &rarr;</button>
                                        </div>
                                    </>
                                ) : null;
                            })()}
                        </div>
                    </div>
                ) : (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur px-6 py-2 rounded-full border border-white/10 text-white text-xs font-bold pointer-events-none animate-bounce">
                        Detaylar için rotaya tıklayın
                    </div>
                )}
            </div>
        )}

        {selectedRoute && (
            <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur flex items-center justify-center p-4">
                <div className="bg-[#242421] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-8 relative shadow-2xl">
                    <button onClick={() => setSelectedRoute(null)} className="absolute top-6 right-6 text-gray-400 hover:text-white"><X className="w-6 h-6"/></button>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Sparkles className="w-5 h-5 text-[#F2A619]" /> AI Rota Analizi</h2>
                    {isLoadingAI ? (
                        <div className="py-20 text-center"><div className="w-12 h-12 border-4 border-[#F2A619] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p className="text-gray-400 text-sm">Gemini rotayı analiz ediyor...</p></div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-[#1A1A17] p-6 rounded-2xl border border-white/5 text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">{aiAnalysis}</div>
                            <Button variant="primary" className="w-full justify-center py-4" onClick={() => handleRouteSelection(selectedRoute)}>SÜRÜŞÜ BAŞLAT</Button>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};