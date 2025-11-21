import React, { useState, useEffect } from 'react';
import { X, Navigation, CloudRain, Phone, Mic, MapPin, AlertTriangle, Music, Battery, Wifi, Gauge, Settings } from 'lucide-react';
import { Button } from './Button';

interface RideModeProps {
  onClose: () => void;
}

export const RideMode: React.FC<RideModeProps> = ({ onClose }) => {
  const [time, setTime] = useState(new Date());
  const [isEmergency, setIsEmergency] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleEmergency = () => {
    setIsEmergency(true);
    // Simüle edilmiş acil durum
    setTimeout(() => {
        alert("Acil durum sinyali ve konum bilginiz yetkililere iletildi.");
        setIsEmergency(false);
    }, 2000);
  };

  const toggleVoice = () => {
      setVoiceActive(true);
      setTimeout(() => setVoiceActive(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white overflow-hidden flex flex-col">
      {/* HUD Header */}
      <div className="flex justify-between items-center p-6 border-b border-white/10 bg-gray-900/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
            <div className="flex flex-col">
                <span className="text-4xl font-mono font-bold tracking-widest text-white">
                    {time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em]">
                    {time.toLocaleDateString('tr-TR', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
            </div>
        </div>
        
        {/* Status Icons */}
        <div className="flex items-center gap-6 text-moto-accent">
            <div className="flex items-center gap-1">
                <Wifi className="w-6 h-6" />
                <span className="text-xs font-bold">5G</span>
            </div>
            <div className="flex items-center gap-1">
                <Battery className="w-6 h-6" />
                <span className="text-xs font-bold">84%</span>
            </div>
            <Button variant="ghost" onClick={onClose} className="border border-white/20 rounded-full w-12 h-12 p-0 flex items-center justify-center hover:bg-white/10 text-white">
                <X className="w-6 h-6" />
            </Button>
        </div>
      </div>

      {/* Main HUD Area */}
      <div className="flex-1 p-6 grid grid-cols-2 md:grid-cols-3 gap-6 overflow-y-auto">
          
          {/* Weather Widget (Big) */}
          <div className="col-span-2 md:col-span-1 bg-gray-900/40 border border-white/10 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                  <CloudRain className="w-32 h-32 text-blue-400" />
              </div>
              <div>
                  <h3 className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-1">Hava Durumu</h3>
                  <div className="text-5xl font-bold text-white">18°C</div>
                  <p className="text-blue-400 font-bold mt-1">Hafif Yağmurlu</p>
              </div>
              <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-400 border-b border-white/5 pb-1">
                      <span>Rüzgar</span>
                      <span className="text-white">12 km/s K</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400 border-b border-white/5 pb-1">
                      <span>Görüş</span>
                      <span className="text-white">8 km</span>
                  </div>
              </div>
          </div>

          {/* Navigation (Big) */}
          <div className="col-span-2 bg-gray-900/40 border border-white/10 rounded-3xl p-6 relative overflow-hidden hover:border-moto-accent/50 transition-colors cursor-pointer group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                      <div className="bg-moto-accent text-white px-3 py-1 rounded font-bold text-xs uppercase">Navigasyon</div>
                      <Navigation className="w-8 h-8 text-white" />
                  </div>
                  <div>
                      <h2 className="text-3xl font-bold text-white mb-1">En Yakın Servis</h2>
                      <p className="text-gray-300 text-lg flex items-center gap-2"><MapPin className="w-5 h-5 text-moto-accent"/> MotoVibe Center - 4.2 km</p>
                  </div>
              </div>
          </div>

          {/* Actions Grid */}
          <div 
            onClick={toggleVoice}
            className={`col-span-1 aspect-square bg-gray-900/40 border border-white/10 rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all ${voiceActive ? 'border-moto-accent bg-moto-accent/10' : 'hover:bg-white/5'}`}
          >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${voiceActive ? 'bg-moto-accent animate-pulse' : 'bg-white/10'}`}>
                  <Mic className="w-8 h-8 text-white" />
              </div>
              <span className="font-bold text-lg">Sesli Komut</span>
              {voiceActive && <span className="text-xs text-moto-accent mt-1 animate-pulse">Dinleniyor...</span>}
          </div>

          <div className="col-span-1 aspect-square bg-gray-900/40 border border-white/10 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <Music className="w-8 h-8 text-white" />
              </div>
              <span className="font-bold text-lg">Müzik</span>
          </div>

          <div className="col-span-1 aspect-square bg-gray-900/40 border border-white/10 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <Settings className="w-8 h-8 text-white" />
              </div>
              <span className="font-bold text-lg">Ayarlar</span>
          </div>
      </div>

      {/* Emergency Footer */}
      <div className="p-6 bg-black border-t border-white/10">
          <button 
            onClick={handleEmergency}
            className={`w-full py-6 rounded-2xl font-display font-bold text-2xl tracking-widest uppercase transition-all flex items-center justify-center gap-4 ${
                isEmergency 
                ? 'bg-red-600 text-white animate-pulse' 
                : 'bg-red-900/20 border-2 border-red-600 text-red-500 hover:bg-red-600 hover:text-white'
            }`}
          >
              <AlertTriangle className="w-8 h-8" />
              {isEmergency ? 'YARDIM ÇAĞRILIYOR...' : 'SOS - ACİL YARDIM'}
          </button>
      </div>
    </div>
  );
};