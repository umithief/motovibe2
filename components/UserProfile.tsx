import React, { useState, useEffect, useRef } from 'react';
import { User, Package, Settings, Bike, LogOut, Edit2, ShoppingBag, Plus, X, Trash2, Award, Clock, CheckCircle, LayoutDashboard, Upload, Image as ImageIcon, Loader2, Palette, Trophy, Star } from 'lucide-react';
import { User as UserType, Order, ViewState, ColorTheme, UserBike as UserBikeType } from '../types';
import { Button } from './Button';
import { orderService } from '../services/orderService';
import { authService } from '../services/auth';
import { storageService } from '../services/storageService';
import { UserAvatar } from './UserAvatar';
import { RANKS } from '../services/gamificationService';

interface UserProfileProps {
  user: UserType;
  onLogout: () => void;
  onUpdateUser: (user: UserType) => void;
  onNavigate: (view: ViewState) => void;
  colorTheme?: ColorTheme;
  onColorChange?: (theme: ColorTheme) => void;
}

type Tab = 'profile' | 'orders' | 'garage' | 'settings';

const POPULAR_BRANDS = [
    { name: 'Yamaha', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop' },
    { name: 'Honda', image: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?q=80&w=800&auto=format&fit=crop' },
    { name: 'Ducati', image: 'https://images.unsplash.com/photo-1614163830626-54c262997154?q=80&w=800&auto=format&fit=crop' },
    { name: 'Kawasaki', image: 'https://images.unsplash.com/photo-1558980394-a3099ed53abb?q=80&w=800&auto=format&fit=crop' },
    { name: 'BMW', image: 'https://images.unsplash.com/photo-1625043484555-2b3015b6445d?q=80&w=800&auto=format&fit=crop' },
    { name: 'Harley-Davidson', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c3d?q=80&w=800&auto=format&fit=crop' },
    { name: 'Diğer', image: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?q=80&w=800&auto=format&fit=crop' }
];

export const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout, onUpdateUser, onNavigate, colorTheme, onColorChange }) => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ name: user.name, phone: user.phone || '', address: user.address || '' });
  
  // Initialize from user.garage or default if empty
  const [myBikes, setMyBikes] = useState<UserBikeType[]>(
      user.garage && user.garage.length > 0 
      ? user.garage 
      : [{ id: 1, brand: 'Yamaha', model: 'MT-07', year: '2023', km: '12.450', color: 'Gece Siyahı', image: POPULAR_BRANDS[0].image }]
  );

  const [isAddBikeModalOpen, setIsAddBikeModalOpen] = useState(false);
  const [newBike, setNewBike] = useState<Partial<UserBikeType>>({ brand: 'Yamaha', model: '', year: '', km: '', color: '', image: '' });
  const [isUploadingBike, setIsUploadingBike] = useState(false);
  const bikeFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (activeTab === 'orders') fetchOrders(); }, [activeTab]);
  useEffect(() => { setFormData({ name: user.name, phone: user.phone || '', address: user.address || '' }); }, [user]);

  // Sync garage changes to parent user object (simplified persistence)
  useEffect(() => {
      // Only update if there's a difference to avoid loop
      if (JSON.stringify(user.garage) !== JSON.stringify(myBikes)) {
          const updatedUser = { ...user, garage: myBikes };
          // We call authService to persist this in local storage
          authService.updateProfile({ garage: myBikes }).then(u => onUpdateUser(u));
      }
  }, [myBikes]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try { const userOrders = await orderService.getUserOrders(user.id); setOrders(userOrders); } 
    catch (error) { console.error("Siparişler alınamadı", error); } 
    finally { setLoadingOrders(false); }
  };

  const handleSaveProfile = async () => {
      setIsSaving(true);
      try {
          const updatedUser = await authService.updateProfile(formData);
          onUpdateUser(updatedUser);
          setIsEditing(false);
      } catch (error) { alert('Hata oluştu.'); } finally { setIsSaving(false); }
  };

  const handleBikeImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          setIsUploadingBike(true);
          try {
              const url = await storageService.uploadFile(file);
              setNewBike(prev => ({ ...prev, image: url }));
          } catch (error) {
              console.error("Resim yüklenemedi", error);
          } finally {
              setIsUploadingBike(false);
          }
      }
  };

  const handleAddBike = (e: React.FormEvent) => {
      e.preventDefault();
      const brandImage = newBike.image || POPULAR_BRANDS.find(b => b.name === newBike.brand)?.image || POPULAR_BRANDS[6].image;
      
      setMyBikes([...myBikes, { 
          id: Date.now(), 
          brand: newBike.brand!, 
          model: newBike.model!, 
          year: newBike.year!, 
          km: newBike.km!, 
          color: newBike.color!, 
          image: brandImage 
      }]);
      setIsAddBikeModalOpen(false);
      setNewBike({ brand: 'Yamaha', image: '' });
  };

  const handleRemoveBike = (id: number) => {
      if(confirm('Bu motoru garajdan çıkarmak istediğine emin misin?')) {
          setMyBikes(prev => prev.filter(b => b.id !== id));
      }
  };

  const colors: { id: ColorTheme; bg: string; label: string }[] = [
      { id: 'orange', bg: 'bg-[#F2A619]', label: 'KTM Orange' },
      { id: 'red', bg: 'bg-[#EF4444]', label: 'Ducati Red' },
      { id: 'blue', bg: 'bg-[#3B82F6]', label: 'Yamaha Blue' },
      { id: 'green', bg: 'bg-[#22C55E]', label: 'Kawa Green' },
      { id: 'cyan', bg: 'bg-[#06B6D4]', label: 'Neon Cyan' },
      { id: 'purple', bg: 'bg-[#A855F7]', label: 'Retro Purple' },
      { id: 'yellow', bg: 'bg-[#EAB308]', label: 'VR46 Yellow' },
  ];

  // Rank Calculation for Progress Bar
  const currentRank = user.rank || 'Scooter Çırağı';
  const currentPoints = user.points || 0;
  let nextRank = '';
  let minPoints = 0;
  let maxPoints = 200;

  if (currentRank === 'Scooter Çırağı') {
      nextRank = 'Viraj Ustası';
      minPoints = RANKS.BEGINNER.min;
      maxPoints = RANKS.BEGINNER.max;
  } else if (currentRank === 'Viraj Ustası') {
      nextRank = 'Yol Kaptanı';
      minPoints = RANKS.INTERMEDIATE.min;
      maxPoints = RANKS.INTERMEDIATE.max;
  } else {
      nextRank = 'Max Seviye';
      minPoints = RANKS.EXPERT.min;
      maxPoints = currentPoints + 1000; // Fake max
  }

  const progressPercent = Math.min(100, Math.max(0, ((currentPoints - minPoints) / (maxPoints - minPoints)) * 100));

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
            
            {/* Header Profile Card */}
            <div className="bg-surface rounded-3xl p-8 mb-8 border border-white/5 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-moto-accent/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
                
                <div className="w-32 h-32 rounded-full border-4 border-moto-accent p-1 relative z-10">
                    <UserAvatar name={user.name} size={120} />
                    <div className="absolute -bottom-2 -right-2 bg-surface p-1 rounded-full border border-white/10">
                        <div className="w-8 h-8 bg-moto-accent rounded-full flex items-center justify-center text-black font-bold">
                            {user.rank === 'Yol Kaptanı' ? 'K' : user.rank === 'Viraj Ustası' ? 'U' : 'Ç'}
                        </div>
                    </div>
                </div>
                
                <div className="text-center md:text-left flex-1 relative z-10">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                        <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white">{user.name}</h1>
                        {user.isAdmin && <span className="bg-moto-accent text-surface text-xs font-bold px-2 py-1 rounded">ADMIN</span>}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-mono text-sm mb-4">Üyelik Tarihi: {user.joinDate}</p>
                    
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                        <div className="bg-background/50 px-4 py-2 rounded-lg border border-white/5">
                            <span className="block text-moto-accent font-bold text-lg">{orders.length}</span>
                            <span className="text-xs text-gray-500 uppercase font-bold">Sipariş</span>
                        </div>
                        <div className="bg-background/50 px-4 py-2 rounded-lg border border-white/5">
                            <span className="block text-moto-accent font-bold text-lg">{myBikes.length}</span>
                            <span className="text-xs text-gray-500 uppercase font-bold">Motor</span>
                        </div>
                        <div className="bg-background/50 px-4 py-2 rounded-lg border border-white/5 min-w-[120px]">
                            <span className="block text-moto-accent font-bold text-lg">{user.points || 0}</span>
                            <span className="text-xs text-gray-500 uppercase font-bold">Sürücü Puanı</span>
                        </div>
                    </div>
                </div>

                {/* Gamification Status Card */}
                <div className="bg-background/60 backdrop-blur-sm p-6 rounded-2xl border border-white/10 w-full md:w-80 relative z-10">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mevcut Rütbe</span>
                        <Trophy className="w-4 h-4 text-moto-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{currentRank}</h3>
                    
                    <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                        <div className="absolute top-0 left-0 h-full bg-moto-accent transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-gray-500">
                        <span>{currentPoints} Puan</span>
                        <span>{nextRank === 'Max Seviye' ? 'MAX' : `${maxPoints} Puan`}</span>
                    </div>
                    {currentRank === 'Yol Kaptanı' && (
                        <div className="mt-4 flex items-center gap-2 text-green-500 text-xs font-bold bg-green-500/10 p-2 rounded-lg">
                            <Star className="w-3 h-3 fill-current" />
                            %5 Daimi İndirim Aktif
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full lg:w-72 flex-shrink-0 space-y-2">
                    {[
                        { id: 'profile', icon: User, label: 'Profil Bilgileri' },
                        { id: 'orders', icon: Package, label: 'Sipariş Geçmişi' },
                        { id: 'garage', icon: Bike, label: 'Sanal Garaj' },
                        { id: 'settings', icon: Settings, label: 'Hesap Ayarları' },
                    ].map(item => (
                        <button 
                            key={item.id}
                            onClick={() => setActiveTab(item.id as Tab)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all font-bold text-sm ${activeTab === item.id ? 'bg-moto-accent text-surface shadow-lg shadow-moto-accent/20' : 'bg-surface text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-surface-hover'}`}
                        >
                            <item.icon className="w-5 h-5" /> {item.label}
                        </button>
                    ))}

                    {user.isAdmin && (
                        <button 
                            onClick={() => onNavigate('admin')}
                            className="w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all font-bold text-sm bg-gradient-to-r from-surface to-background border border-moto-accent/30 text-moto-accent hover:text-white hover:border-moto-accent mt-6"
                        >
                            <LayoutDashboard className="w-5 h-5" /> Yönetici Paneli
                        </button>
                    )}

                    <button onClick={onLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors font-bold text-sm mt-8 border border-transparent hover:border-red-500/30">
                        <LogOut className="w-5 h-5" /> Oturumu Kapat
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 bg-surface rounded-3xl p-8 border border-white/5 min-h-[500px]">
                    {activeTab === 'profile' && (
                        <div className="animate-in fade-in space-y-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Profil Bilgileri</h3>
                                <button onClick={() => setIsEditing(!isEditing)} className="text-moto-accent hover:text-moto-accent-hover text-sm font-bold flex items-center gap-2 transition-colors">
                                    {isEditing ? <X className="w-4 h-4"/> : <Edit2 className="w-4 h-4"/>} {isEditing ? 'İptal' : 'Düzenle'}
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Ad Soyad</label>
                                    <input 
                                        type="text" 
                                        disabled={!isEditing}
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-moto-accent outline-none transition-colors disabled:opacity-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Telefon</label>
                                    <input 
                                        type="text" 
                                        disabled={!isEditing}
                                        value={formData.phone}
                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-moto-accent outline-none transition-colors disabled:opacity-50"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Adres</label>
                                    <textarea 
                                        disabled={!isEditing}
                                        value={formData.address}
                                        onChange={e => setFormData({...formData, address: e.target.value})}
                                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-moto-accent outline-none transition-colors disabled:opacity-50 h-32 resize-none"
                                    />
                                </div>
                            </div>
                            
                            {isEditing && (
                                <div className="flex justify-end pt-4 border-t border-white/5">
                                    <Button variant="primary" onClick={handleSaveProfile} isLoading={isSaving}>DEĞİŞİKLİKLERİ KAYDET</Button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'garage' && (
                        <div className="animate-in fade-in space-y-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Sanal Garaj</h3>
                                <Button size="sm" onClick={() => setIsAddBikeModalOpen(true)} className="bg-moto-accent text-surface hover:bg-white"><Plus className="w-4 h-4 mr-2"/> MOTOR EKLE</Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {myBikes.map(bike => (
                                    <div key={bike.id} className="group relative bg-background border border-white/10 rounded-2xl overflow-hidden hover:border-moto-accent transition-all">
                                        <div className="h-48 relative">
                                            <img src={bike.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                                            <button onClick={() => handleRemoveBike(bike.id)} className="absolute top-3 right-3 p-2 bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{bike.model}</h4>
                                            <p className="text-moto-accent text-xs font-bold uppercase tracking-wider mb-4">{bike.brand}</p>
                                            <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-3">
                                                <div className="text-center">
                                                    <span className="block text-[10px] text-gray-500 uppercase font-bold">Yıl</span>
                                                    <span className="text-gray-900 dark:text-white text-sm font-mono">{bike.year}</span>
                                                </div>
                                                <div className="text-center border-l border-white/5">
                                                    <span className="block text-[10px] text-gray-500 uppercase font-bold">KM</span>
                                                    <span className="text-gray-900 dark:text-white text-sm font-mono">{bike.km}</span>
                                                </div>
                                                <div className="text-center border-l border-white/5">
                                                    <span className="block text-[10px] text-gray-500 uppercase font-bold">Renk</span>
                                                    <span className="text-gray-900 dark:text-white text-sm truncate">{bike.color}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="animate-in fade-in space-y-4">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Sipariş Geçmişi</h3>
                            {loadingOrders ? (
                                <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-moto-accent" /></div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-20 bg-background rounded-2xl border border-white/5">
                                    <ShoppingBag className="w-16 h-16 text-moto-accent mx-auto mb-4 opacity-50" />
                                    <p className="text-gray-500 text-sm">Henüz siparişiniz bulunmuyor.</p>
                                </div>
                            ) : (
                                orders.map(order => (
                                    <div key={order.id} className="bg-background border border-white/10 rounded-xl p-6 hover:border-moto-accent/50 transition-all">
                                        <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
                                            <div>
                                                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Sipariş No</span>
                                                <span className="text-white font-mono font-bold">{order.id}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Tarih</span>
                                                <span className="text-white font-mono">{order.date}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 overflow-x-auto pb-2">
                                            {order.items.map((item, i) => (
                                                <div key={i} className="flex-shrink-0 w-16 h-16 bg-white/5 rounded-lg overflow-hidden border border-white/10" title={item.name}>
                                                    <img src={item.image} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                            <div className="flex-1"></div>
                                            <div className="text-right">
                                                <span className="block text-2xl font-bold text-moto-accent">₺{order.total.toLocaleString('tr-TR')}</span>
                                                <span className="inline-block px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full border border-green-500/20">{order.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="animate-in fade-in space-y-8">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Hesap Ayarları</h3>
                                <p className="text-gray-500 text-sm">Uygulama deneyiminizi kişiselleştirin.</p>
                            </div>

                            <div className="bg-background/50 border border-white/5 rounded-2xl p-6">
                                <h4 className="font-bold text-white mb-6 flex items-center gap-2">
                                    <Palette className="w-5 h-5 text-moto-accent" /> Tema Rengi
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                                    {colors.map(c => (
                                        <button
                                            key={c.id}
                                            onClick={() => onColorChange && onColorChange(c.id)}
                                            className={`group relative flex flex-col items-center gap-3 p-4 rounded-xl border transition-all ${colorTheme === c.id ? 'bg-white/10 border-moto-accent ring-1 ring-moto-accent/50' : 'bg-transparent border-white/10 hover:bg-white/5'}`}
                                        >
                                            <div className={`w-8 h-8 rounded-full ${c.bg} shadow-lg ${colorTheme === c.id ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#18181B]' : 'group-hover:scale-110 transition-transform'}`}></div>
                                            <span className={`text-xs font-bold ${colorTheme === c.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{c.label}</span>
                                            {colorTheme === c.id && (
                                                <div className="absolute top-2 right-2">
                                                    <CheckCircle className="w-3 h-3 text-moto-accent" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Add Bike Modal */}
        {isAddBikeModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-surface border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
                    <button onClick={() => setIsAddBikeModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2"><Bike className="w-5 h-5 text-moto-accent" /> Yeni Motor Ekle</h3>
                    
                    <div className="space-y-4">
                        <div 
                            className="w-full aspect-video border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-moto-accent hover:bg-white/5 transition-all relative overflow-hidden group"
                            onClick={() => bikeFileInputRef.current?.click()}
                        >
                            {newBike.image ? (
                                <img src={newBike.image} className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    {isUploadingBike ? <Loader2 className="w-8 h-8 text-moto-accent animate-spin" /> : <Upload className="w-8 h-8 text-gray-500 mb-2" />}
                                    <span className="text-xs text-gray-500 font-bold uppercase">Fotoğraf Yükle</span>
                                </>
                            )}
                            <input type="file" ref={bikeFileInputRef} className="hidden" accept="image/*" onChange={handleBikeImageUpload} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Marka (Yamaha)" className="col-span-2 bg-background border border-white/10 rounded-xl p-3 text-gray-900 dark:text-white focus:border-moto-accent outline-none" onChange={e => setNewBike({...newBike, brand: e.target.value})} />
                            <input type="text" placeholder="Model (MT-07)" className="col-span-2 bg-background border border-white/10 rounded-xl p-3 text-gray-900 dark:text-white focus:border-moto-accent outline-none" onChange={e => setNewBike({...newBike, model: e.target.value})} />
                            <input type="text" placeholder="Yıl (2023)" className="bg-background border border-white/10 rounded-xl p-3 text-gray-900 dark:text-white focus:border-moto-accent outline-none" onChange={e => setNewBike({...newBike, year: e.target.value})} />
                            <input type="text" placeholder="KM (12.000)" className="bg-background border border-white/10 rounded-xl p-3 text-gray-900 dark:text-white focus:border-moto-accent outline-none" onChange={e => setNewBike({...newBike, km: e.target.value})} />
                            <input type="text" placeholder="Renk" className="col-span-2 bg-background border border-white/10 rounded-xl p-3 text-gray-900 dark:text-white focus:border-moto-accent outline-none" onChange={e => setNewBike({...newBike, color: e.target.value})} />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" onClick={() => setIsAddBikeModalOpen(false)} className="border-white/10 text-gray-400 hover:text-white">İptal</Button>
                            <Button variant="primary" onClick={handleAddBike} disabled={isUploadingBike}>Ekle</Button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};