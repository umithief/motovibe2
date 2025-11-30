
import React from 'react';
import { Zap, ShieldCheck, Globe, ArrowRight, Cpu, Activity } from 'lucide-react';
import { Button } from './Button';
import { ViewState } from '../types';

interface AboutProps {
  onNavigate: (view: ViewState) => void;
}

export const About: React.FC<AboutProps> = ({ onNavigate }) => {
  const features = [
    {
      id: '01',
      title: 'AI Neural Match',
      desc: 'Sıradan önerileri unutun. Gelişmiş algoritmalarımız, sürüş tarzınızı ve vücut ölçülerinizi analiz ederek milimetrik ekipman eşleşmesi sağlar.',
      icon: Cpu
    },
    {
      id: '02',
      title: 'Certified Protection',
      desc: 'Kataloğumuzdaki her parça, uluslararası güvenlik standartlarını (ECE 22.06, Snell, DOT) aşan, pist testlerinden geçmiş ürünlerdir.',
      icon: ShieldCheck
    },
    {
      id: '03',
      title: 'Global Rider Network',
      desc: 'Sadece bir mağaza değil, sınırları aşan bir motosiklet kültürü. Rotaları paylaşın, etkinliklere katılın ve kabilenin bir parçası olun.',
      icon: Globe
    }
  ];

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500 min-h-screen">
      
      {/* Hero Text */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-moto-accent/30 bg-moto-accent/10 text-moto-accent text-xs font-bold uppercase tracking-[0.2em] mb-8 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(242,166,25,0.3)]">
            <Activity className="w-3 h-3" /> 
            <span className="drop-shadow-md">MotoVibe Corp. v2.0</span>
        </div>
        {/* Added strong drop-shadow to prevent text disappearing on white background */}
        <h1 className="text-5xl md:text-8xl font-display font-bold text-white mb-8 tracking-tighter leading-[0.9] drop-shadow-[0_4px_4px_rgba(0,0,0,0.9)]">
          GELECEĞİN <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-600 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">SÜRÜŞ DENEYİMİ</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed border-l-2 border-moto-accent/50 pl-6 text-left md:text-center md:border-l-0 md:pl-0 font-medium">
          Sadece aksesuar satmıyoruz; motosiklet kültürünü yapay zeka, veri analitiği ve modern teknolojiyle yeniden tanımlıyoruz.
        </p>
      </div>

      {/* Visual Section */}
      <div className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-[#0a0a0a] mb-24 group shadow-2xl">
        <div className="aspect-video md:aspect-[21/9] relative">
          <img 
            src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2000&auto=format&fit=crop" 
            alt="MotoVibe Workshop" 
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          
          {/* Overlay UI */}
          <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
            <div className="flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-4 mb-3">
                        <div className="h-[2px] w-16 bg-moto-accent"></div>
                        <span className="text-white/80 font-mono text-xs uppercase tracking-widest drop-shadow-md">Est. 2024 // Tokyo - Istanbul</span>
                    </div>
                    <h3 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight drop-shadow-lg">TUTKU VE TEKNOLOJİ</h3>
                </div>
                <div className="hidden md:block">
                    <Zap className="w-12 h-12 text-white/20" />
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Redesigned Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {features.map((feature, idx) => (
            <div 
                key={idx} 
                className="group relative p-8 md:p-10 rounded-3xl bg-[#0a0a0a] border border-white/10 overflow-hidden hover:border-moto-accent/50 hover:shadow-[0_0_50px_-10px_rgba(255,31,31,0.15)] transition-all duration-500 hover:-translate-y-2"
            >
                {/* Background Noise & Glow */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-moto-accent/20 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* Large Number */}
                <span className="absolute top-6 right-8 text-6xl font-display font-bold text-white/5 group-hover:text-moto-accent/10 transition-colors select-none">
                    {feature.id}
                </span>

                {/* Icon Box */}
                <div className="relative w-16 h-16 mb-8 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-black border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-moto-accent/50 transition-all duration-500 shadow-lg group-hover:shadow-moto-accent/20">
                    <feature.icon className="w-7 h-7 text-gray-400 group-hover:text-moto-accent transition-colors duration-300" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-4 font-display tracking-wide group-hover:text-moto-accent transition-colors duration-300">
                        {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                        {feature.desc}
                    </p>
                </div>

                {/* Bottom Decoration */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-moto-accent/0 via-moto-accent/50 to-moto-accent/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
            </div>
        ))}
      </div>

      {/* Stats Bar */}
      <div className="border-y border-white/10 bg-[#1A1A17] dark:bg-white/5 py-12 mb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          {[
              { val: '15K+', label: 'Mutlu Sürücü' },
              { val: '1.2K', label: 'Premium Ürün' },
              { val: '24/7', label: 'AI Desteği' },
              { val: '%100', label: 'Güvenli' }
          ].map((stat, i) => (
              <div key={i} className="group cursor-default">
                <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2 group-hover:text-moto-accent transition-colors duration-300 drop-shadow-sm">{stat.val}</div>
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] group-hover:text-white transition-colors">{stat.label}</div>
              </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pb-12">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-8 tracking-tight drop-shadow-sm">
            YOLCULUĞA KATILMAYA HAZIR MISIN?
        </h2>
        <div className="flex justify-center">
            <Button variant="primary" size="lg" onClick={() => onNavigate('shop')} className="px-12 py-5 text-lg shadow-[0_0_30px_rgba(255,31,31,0.4)] hover:shadow-[0_0_50px_rgba(255,31,31,0.6)]">
            EKİPMANLARI KEŞFET <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
        </div>
      </div>
    </div>
  );
};
