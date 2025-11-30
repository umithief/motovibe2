
import React, { useState, useEffect, useRef } from 'react';
import { Siren, Flashlight, Share2, CheckCircle, Circle, AlertTriangle, X, ShieldCheck, Wrench, Cloud, Thermometer, Droplets, Wind, Gauge, ArrowRightLeft, Activity, Zap, Navigation, Sun, Sliders, ArrowDown } from 'lucide-react';
import { ViewState } from '../types';

interface MotoToolProps {
  onNavigate: (view: ViewState) => void;
}

export const MotoTool: React.FC<MotoToolProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'tools' | 'system'>('tools');
  
  // Tool States
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [isFlashlightActive, setIsFlashlightActive] = useState(false);
  const [isSOSActive, setIsSOSActive] = useState(false); // Visual SOS (Screen Flash)
  const [locationLoading, setLocationLoading] = useState(false);
  
  // Utility States
  const [weather, setWeather] = useState({ temp: '--', cond: 'Scanning...', wind: '--', hum: '--' });
  const [pressureInput, setPressureInput] = useState<string>('32');
  const [pressureUnit, setPressureUnit] = useState<'PSI' | 'BAR'>('PSI');

  // Checklist State
  const [checks, setChecks] = useState({
      tires: false,
      oil: false,
      chain: false,
      brakes: false,
      electronics: false,
      gear: false
  });

  const allChecked = Object.values(checks).every(Boolean);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);

  // --- SOUND ENGINE (SIREN) ---
  useEffect(() => {
      if (isSirenActive) {
          if (!audioCtxRef.current) {
              audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          }
          
          const ctx = audioCtxRef.current;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(600, ctx.currentTime);
          
          // LFO for wailing siren effect
          const lfo = ctx.createOscillator();
          lfo.type = 'sine';
          lfo.frequency.value = 4; // Faster cycle for urgency
          const lfoGain = ctx.createGain();
          lfoGain.gain.value = 600;
          
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);
          lfo.start();

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          
          oscillatorRef.current = osc;
          lfoRef.current = lfo;
      } else {
          if (oscillatorRef.current) {
              oscillatorRef.current.stop();
              oscillatorRef.current.disconnect();
              oscillatorRef.current = null;
          }
          if (lfoRef.current) {
              lfoRef.current.stop();
              lfoRef.current = null;
          }
      }

      return () => {
          if (oscillatorRef.current) oscillatorRef.current.stop();
          if (lfoRef.current) lfoRef.current.stop();
      };
  }, [isSirenActive]);

  // --- WEATHER SIMULATION ---
  useEffect(() => {
      // Simulate data fetch
      const timer = setTimeout(() => {
          setWeather({ 
              temp: '24°C', 
              cond: 'Parçalı Bulutlu', 
              wind: '14 km/h KB',
              hum: '45%'
          });
      }, 2000);
      return () => clearTimeout(timer);
  }, []);

  // --- PRESSURE CONVERTER ---
  const convertedPressure = () => {
      const val = parseFloat(pressureInput);
      if (isNaN(val)) return '--';
      if (pressureUnit === 'PSI') return (val * 0.0689476).toFixed(2) + ' BAR';
      return (val * 14.5038).toFixed(1) + ' PSI';
  };

  // --- HANDLERS ---
  const handleShareLocation = () => {
      setLocationLoading(true);
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
              const { latitude, longitude } = position.coords;
              const url = `https://wa.me/?text=🚨 MOTOVIBE ALERT: Acil Durum! Konumum: https://www.google.com/maps?q=${latitude},${longitude}`;
              window.open(url, '_blank');
              setLocationLoading(false);
          }, () => {
              alert("GPS Sinyali Alınamadı.");
              setLocationLoading(false);
          });
      } else {
          setLocationLoading(false);
      }
  };

  const toggleCheck = (key: keyof typeof checks) => {
      setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] text-white flex flex-col overflow-hidden font-sans selection:bg-moto-accent selection:text-white">
      
      {/* --- FULL SCREEN VISUAL EFFECTS --- */}
      
      {/* Flashlight (White) */}
      {isFlashlightActive && (
          <div className="absolute inset-0 z-[200] bg-white flex items-center justify-center cursor-pointer" onClick={() => setIsFlashlightActive(false)}>
              <div className="text-black font-bold text-3xl opacity-20 animate-pulse font-display tracking-widest">FENER AKTİF</div>
          </div>
      )}

      {/* Siren Strobe (Red/Blue) */}
      {isSirenActive && (
          <div className="absolute inset-0 z-[190] pointer-events-none mix-blend-overlay animate-[pulse_0.5s_infinite] bg-gradient-to-r from-red-600 via-transparent to-blue-600 opacity-50"></div>
      )}

      {/* SOS Flash (Red) */}
      {isSOSActive && (
          <div className="absolute inset-0 z-[190] pointer-events-none bg-red-600 mix-blend-overlay animate-[ping_1s_infinite]"></div>
      )}

      {/* --- HEADER --- */}
      <div className="relative z-10 p-6 flex justify-between items-center border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl">
          <div className="flex items-center gap-4">
              <div className="relative">
                  <div className="absolute inset-0 bg-moto-accent blur-md opacity-40"></div>
                  <div className="relative w-12 h-12 bg-[#111] border border-moto-accent rounded-xl flex items-center justify-center shadow-lg">
                      <Wrench className="w-6 h-6 text-moto-accent" />
                  </div>
              </div>
              <div>
                  <h2 className="text-2xl font-display font-bold tracking-wide">MOTO<span className="text-moto-accent">TOOL</span></h2>
                  <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">v2.0.4 // ONLINE</p>
              </div>
          </div>
          <button onClick={() => onNavigate('home')} className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all group">
              <X className="w-6 h-6 text-gray-400 group-hover:text-white" />
          </button>
      </div>

      {/* --- TAB SWITCHER --- */}
      <div className="flex p-2 m-4 bg-[#111] rounded-2xl border border-white/5 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('tools')}
            className={`flex-1 min-w-[100px] py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'tools' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
              <Zap className="w-4 h-4" /> Araçlar
          </button>
          <button 
            onClick={() => setActiveTab('system')}
            className={`flex-1 min-w-[100px] py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'system' ? 'bg-moto-accent text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
              <Activity className="w-4 h-4" /> Sistem
          </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-6 custom-scrollbar">
          
          {/* --- TOOLS TAB --- */}
          {activeTab === 'tools' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  
                  {/* WEATHER WIDGET */}
                  <div className="bg-[#111] border border-white/10 rounded-3xl p-5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
                      <div className="flex justify-between items-start mb-4">
                          <div>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">
                                  <Navigation className="w-3 h-3" /> Yerel Veri
                              </div>
                              <h3 className="text-3xl font-mono font-bold text-white">{weather.temp}</h3>
                              <p className="text-xs text-gray-400">{weather.cond}</p>
                          </div>
                          <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                              {weather.cond.includes('Bulut') ? <Cloud className="w-5 h-5 text-gray-300" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                          <div className="bg-black/40 rounded-xl p-2 flex items-center gap-3 border border-white/5">
                              <Wind className="w-4 h-4 text-gray-500" />
                              <span className="text-xs font-mono text-gray-300">{weather.wind}</span>
                          </div>
                          <div className="bg-black/40 rounded-xl p-2 flex items-center gap-3 border border-white/5">
                              <Droplets className="w-4 h-4 text-gray-500" />
                              <span className="text-xs font-mono text-gray-300">{weather.hum}</span>
                          </div>
                      </div>
                  </div>

                  {/* ACTION GRID */}
                  <div className="grid grid-cols-2 gap-4">
                      {/* Siren Button */}
                      <button 
                        onClick={() => setIsSirenActive(!isSirenActive)}
                        className={`aspect-square rounded-3xl flex flex-col items-center justify-center gap-3 border transition-all duration-300 relative overflow-hidden group ${isSirenActive ? 'bg-red-600 border-red-500 shadow-[0_0_30px_rgba(220,38,38,0.6)]' : 'bg-[#111] border-white/10 hover:bg-[#161616]'}`}
                      >
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isSirenActive ? 'bg-white text-red-600 animate-ping' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
                              <Siren className="w-8 h-8" />
                          </div>
                          <span className={`font-bold text-sm uppercase tracking-widest ${isSirenActive ? 'text-white' : 'text-gray-400'}`}>
                              {isSirenActive ? 'SİREN AÇIK' : 'Polis Modu'}
                          </span>
                      </button>

                      {/* Flashlight Button */}
                      <button 
                        onClick={() => setIsFlashlightActive(true)}
                        className="aspect-square rounded-3xl flex flex-col items-center justify-center gap-3 border border-white/10 bg-[#111] hover:bg-[#161616] transition-all group"
                      >
                          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-yellow-400 group-hover:bg-yellow-400 group-hover:text-black transition-all shadow-[0_0_20px_rgba(250,204,21,0.1)] group-hover:shadow-[0_0_30px_rgba(250,204,21,0.6)]">
                              <Flashlight className="w-8 h-8" />
                          </div>
                          <span className="font-bold text-sm uppercase tracking-widest text-gray-400 group-hover:text-white">Fener</span>
                      </button>

                      {/* SOS Visual Button */}
                      <button 
                        onClick={() => setIsSOSActive(!isSOSActive)}
                        className={`col-span-1 py-4 rounded-2xl flex items-center justify-center gap-3 border transition-all ${isSOSActive ? 'bg-orange-600 border-orange-500 animate-pulse' : 'bg-[#111] border-white/10 hover:bg-white/5'}`}
                      >
                          <AlertTriangle className={`w-5 h-5 ${isSOSActive ? 'text-white' : 'text-orange-500'}`} />
                          <span className="font-bold text-xs uppercase">SOS Sinyali</span>
                      </button>

                      {/* Location Share */}
                      <button 
                        onClick={handleShareLocation}
                        className="col-span-1 py-4 rounded-2xl flex items-center justify-center gap-3 border border-white/10 bg-[#111] hover:bg-green-900/20 transition-all"
                      >
                          <Share2 className={`w-5 h-5 text-green-500 ${locationLoading ? 'animate-spin' : ''}`} />
                          <span className="font-bold text-xs uppercase">{locationLoading ? 'Konum...' : 'Konum At'}</span>
                      </button>
                  </div>

                  {/* PRESSURE CONVERTER */}
                  <div className="bg-[#111] border border-white/10 rounded-3xl p-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                          <Gauge className="w-4 h-4 text-moto-accent" /> Basınç Çevirici
                      </div>
                      <div className="flex items-center gap-4">
                          <div className="flex-1 relative">
                              <input 
                                  type="number" 
                                  value={pressureInput}
                                  onChange={(e) => setPressureInput(e.target.value)}
                                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xl font-mono text-white focus:border-moto-accent outline-none"
                              />
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">{pressureUnit}</span>
                          </div>
                          <button 
                              onClick={() => setPressureUnit(prev => prev === 'PSI' ? 'BAR' : 'PSI')}
                              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-moto-accent transition-colors"
                          >
                              <ArrowRightLeft className="w-4 h-4" />
                          </button>
                          <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between">
                              <span className="text-xl font-mono text-moto-accent">{convertedPressure().split(' ')[0]}</span>
                              <span className="text-xs font-bold text-gray-500">{pressureUnit === 'PSI' ? 'BAR' : 'PSI'}</span>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {/* --- SYSTEM DIAGNOSTICS TAB --- */}
          {activeTab === 'system' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className={`relative bg-[#111] border transition-all duration-500 rounded-3xl p-6 overflow-hidden ${allChecked ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.2)]' : 'border-white/10'}`}>
                      
                      {allChecked && (
                          <div className="absolute inset-0 bg-green-900/10 backdrop-blur-[2px] flex flex-col items-center justify-center z-20 animate-in zoom-in duration-300">
                              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_30px_#22c55e] mb-4">
                                  <ShieldCheck className="w-10 h-10 text-white" />
                              </div>
                              <h3 className="text-2xl font-display font-bold text-white tracking-widest">HAZIR</h3>
                              <p className="text-green-400 text-xs font-mono mt-2">TÜM SİSTEMLER NORMAL</p>
                              <button onClick={() => setChecks({tires:false, oil:false, chain:false, brakes:false, electronics:false, gear:false})} className="mt-8 px-6 py-2 border border-green-500/30 text-green-400 rounded-full text-[10px] font-bold hover:bg-green-500 hover:text-white transition-all uppercase tracking-widest">
                                  Sistemi Sıfırla
                              </button>
                          </div>
                      )}

                      <div className="flex justify-between items-end mb-8">
                          <div>
                              <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                                  SİSTEM <span className="text-moto-accent">TANI</span>
                              </h3>
                              <p className="text-xs text-gray-500 font-mono mt-1">Ön Sürüş Kontrol Protokolü</p>
                          </div>
                          <div className="text-right">
                              <div className="text-2xl font-mono font-bold text-white">
                                  {Object.values(checks).filter(Boolean).length}<span className="text-gray-600">/</span>{Object.keys(checks).length}
                              </div>
                          </div>
                      </div>
                      
                      <div className="space-y-3">
                          {[
                              { id: 'tires', label: 'Lastik Basıncı', sub: 'PSI/BAR Kontrolü' },
                              { id: 'brakes', label: 'Fren Sistemi', sub: 'Hidrolik & Balata' },
                              { id: 'chain', label: 'Güç Aktarımı', sub: 'Zincir & Dişli' },
                              { id: 'oil', label: 'Sıvı Seviyeleri', sub: 'Yağ & Soğutma' },
                              { id: 'electronics', label: 'Elektronik', sub: 'Akü & Işıklar' },
                              { id: 'gear', label: 'Sürücü Ekipmanı', sub: 'Kask & Korumalar' }
                          ].map((item) => {
                              const isChecked = checks[item.id as keyof typeof checks];
                              return (
                                  <div 
                                    key={item.id} 
                                    onClick={() => toggleCheck(item.id as keyof typeof checks)}
                                    className={`relative group flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-300 ${isChecked ? 'bg-green-900/20 border-green-900/50' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
                                  >
                                      {/* Progress Bar Background */}
                                      <div className={`absolute bottom-0 left-0 h-0.5 bg-green-500 transition-all duration-500 ${isChecked ? 'w-full' : 'w-0'}`}></div>
                                      
                                      <div className="flex items-center gap-4">
                                          <div className={`w-2 h-2 rounded-full ${isChecked ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-gray-700'}`}></div>
                                          <div>
                                              <span className={`block text-sm font-bold tracking-wide ${isChecked ? 'text-white' : 'text-gray-300'}`}>{item.label}</span>
                                              <span className="text-[9px] text-gray-600 font-mono uppercase">{item.sub}</span>
                                          </div>
                                      </div>
                                      <div className={`text-[10px] font-bold font-mono uppercase tracking-widest ${isChecked ? 'text-green-500' : 'text-gray-600'}`}>
                                          {isChecked ? 'OK' : 'PENDING'}
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                  </div>
              </div>
          )}

      </div>
    </div>
  );
};
