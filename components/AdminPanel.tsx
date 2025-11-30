
import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Package, ShoppingCart, Users, Plus, Trash2, Edit2, Search, Bell, Grid, Map, Music as MusicIcon, Settings, LogOut, Video, PlayCircle, Loader2, Image as ImageIcon, BarChart2, Globe, DollarSign, Clock, Eye, ShoppingBag, Layers, Circle, ArrowRight, RotateCcw, Handshake, Check, X, Truck, Link as LinkIcon, UploadCloud, Box } from 'lucide-react';
import { Order, Product, ProductCategory, User, Slide, ActivityLog, VisitorStats, AnalyticsDashboardData, CategoryItem, Route, MusicTrack, SessionRecording, ViewState, Story, NegotiationOffer, Model3DItem } from '../types';
import { Button } from './Button';
import { productService } from '../services/productService';
import { sliderService } from '../services/sliderService';
import { categoryService } from '../services/categoryService';
import { routeService } from '../services/routeService';
import { musicService } from '../services/musicService';
import { storyService } from '../services/storyService';
import { logService } from '../services/logService';
import { statsService } from '../services/statsService';
import { storageService } from '../services/storageService';
import { recordingService } from '../services/recordingService';
import { negotiationService } from '../services/negotiationService';
import { orderService } from '../services/orderService';
import { authService } from '../services/auth';
import { modelService } from '../services/modelService';
import { ToastType } from './Toast';
import { CONFIG } from '../services/config';

// FilePond
// @ts-ignore
import { FilePond, registerPlugin } from 'react-filepond';
// @ts-ignore
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
// @ts-ignore
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
// @ts-ignore
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
// @ts-ignore
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
// @ts-ignore
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';

// Register the plugins
registerPlugin(
    FilePondPluginImagePreview, 
    FilePondPluginFileValidateType,
    FilePondPluginImageCrop,
    FilePondPluginImageResize,
    FilePondPluginImageTransform
);

interface AdminPanelProps {
  onLogout: () => void;
  onShowToast: (type: ToastType, message: string) => void;
  onNavigate: (view: ViewState) => void;
}

type AdminTab = 'dashboard' | 'products' | 'orders' | 'users' | 'slider' | 'categories' | 'routes' | 'stories' | 'music' | 'recordings' | 'negotiations' | 'models';

// Helper to extract YouTube ID - using RegExp constructor to avoid parser issues
const getYouTubeID = (url: string) => {
    if (!url) return false;
    // Regex: ^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*
    const regExp = new RegExp("^.*((youtu.be\\/)|(v\\/)|(\\/u\\/\\w\\/)|(embed\\/)|(watch\\?))\\??v?=?([^#&?]*).*");
    const match = url.match(regExp);
    return (match && match[7] && match[7].length === 11) ? match[7] : false;
};

// Helper to extract Pexels ID - using RegExp constructor
const getPexelsID = (url: string) => {
    if (!url) return false;
    // Matches /video/12345/ or /video-files/12345/
    // Regex: (?:pexels\.com\/video\/|video-files\/).*?(\d{5,})
    const regExp = new RegExp("(?:pexels\\.com\\/video\\/|video-files\\/).*?(\\d{5,})");
    const match = url.match(regExp);
    return match ? match[1] : false;
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout, onShowToast, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  
  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [negotiations, setNegotiations] = useState<NegotiationOffer[]>([]);
  const [models, setModels] = useState<Model3DItem[]>([]);
  
  // Modal & Edit States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  
  // Image Source Toggle (Upload vs URL)
  const [imageSource, setImageSource] = useState<'upload' | 'url'>('upload');
  
  // Upload Type Toggle (Image vs Model for Products)
  const [productUploadType, setProductUploadType] = useState<'image' | 'model'>('image');
  
  // FilePond State
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
      loadAllData();
  }, []);

  const loadAllData = async () => {
      const [p, s, c, r, st, n, o, u, m] = await Promise.all([
          productService.getProducts(),
          sliderService.getSlides(),
          categoryService.getCategories(),
          routeService.getRoutes(),
          storyService.getStories(),
          negotiationService.getOffers(),
          orderService.getAllOrders(),
          authService.getAllUsers(),
          modelService.getModels()
      ]);
      setProducts(p);
      setSlides(s);
      setCategories(c);
      setRoutes(r);
      setStories(st);
      setNegotiations(n);
      setOrders(o);
      setUsers(u);
      setModels(m);
  };

  const handleEdit = (item: any) => {
      setEditingItem(item);
      // Ensure images array exists for products
      const itemWithImages = {
          ...item,
          images: item.images || (item.image ? [item.image] : [])
      };
      setFormData(itemWithImages);
      setFiles([]); // Reset FilePond for new uploads
      setImageSource(item.image && item.image.startsWith('http') && !item.image.includes('localhost') && !item.image.includes('minio') ? 'url' : 'upload');
      setProductUploadType('image'); // Reset upload type
      setIsModalOpen(true);
  };

  const handleAddNew = () => {
      setEditingItem(null);
      setFiles([]); // Reset FilePond
      setImageSource('upload');
      setProductUploadType('image');
      // Reset form based on tab
      if (activeTab === 'products') setFormData({ name: '', price: 0, category: 'Aksesuar', image: '', images: [], description: '', stock: 10, features: [], isNegotiable: false, model3d: '' });
      else if (activeTab === 'stories') setFormData({ label: '', image: '', color: 'border-orange-500' });
      else if (activeTab === 'categories') setFormData({ name: '', type: 'Aksesuar', image: '', desc: '', count: '0 Model', className: 'col-span-1 row-span-1' });
      else if (activeTab === 'slider') setFormData({ title: '', subtitle: '', image: '', cta: 'İNCELE', action: 'shop', type: 'image', videoUrl: '' });
      else if (activeTab === 'routes') setFormData({ title: '', location: '', difficulty: 'Orta', distance: '', duration: '', image: '', tags: [] });
      else if (activeTab === 'models') setFormData({ name: '', url: '', poster: '', category: 'Genel' });
      
      setIsModalOpen(true);
  };

  const handleDelete = async (id: any) => {
      if (!confirm('Silmek istediğine emin misin?')) return;
      
      try {
          if (activeTab === 'products') { await productService.deleteProduct(id); setProducts(products.filter(p => p.id !== id)); }
          else if (activeTab === 'stories') { await storyService.deleteStory(id); setStories(stories.filter(s => s.id !== id)); }
          else if (activeTab === 'categories') { await categoryService.deleteCategory(id); setCategories(categories.filter(c => c.id !== id)); }
          else if (activeTab === 'slider') { await sliderService.deleteSlide(id); setSlides(slides.filter(s => s.id !== id)); }
          else if (activeTab === 'routes') { await routeService.deleteRoute(id); setRoutes(routes.filter(r => r.id !== id)); }
          else if (activeTab === 'users') { await authService.deleteUser(id); setUsers(users.filter(u => u.id !== id)); }
          else if (activeTab === 'models') { await modelService.deleteModel(id); setModels(models.filter(m => m.id !== id)); }
          
          onShowToast('success', 'Silme işlemi başarılı');
      } catch (e) {
          onShowToast('error', 'Hata oluştu');
      }
  };

  const handleRemoveImage = (urlToRemove: string) => {
      setFormData((prev: any) => ({
          ...prev,
          images: prev.images.filter((url: string) => url !== urlToRemove),
          // If the main image was removed, update it to the next available one or empty
          image: prev.image === urlToRemove ? (prev.images.length > 1 ? prev.images[1] : '') : prev.image
      }));
  };

  const handleAddUrlImage = () => {
      const url = formData.tempUrlInput;
      if (!url) return;

      if (activeTab === 'products') {
          if (productUploadType === 'model') {
              setFormData({...formData, model3d: url, tempUrlInput: ''});
          } else {
              setFormData((prev: any) => ({ 
                  ...prev, 
                  images: [...(prev.images || []), url],
                  image: prev.image || url,
                  tempUrlInput: ''
              }));
          }
      }
  };

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const url = e.target.value;
      let updates: any = { videoUrl: url };
      
      // Auto-fetch YouTube thumbnail if image is empty or looks like a previous yt thumb
      const ytId = getYouTubeID(url);
      if (ytId) {
          const thumbUrl = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
          // If no image set, OR image is a youtube thumb, update it
          if (!formData.image || formData.image.includes('img.youtube.com')) {
              updates['image'] = thumbUrl;
              setImageSource('url');
          }
      }

      // Auto-fetch Pexels thumbnail
      const pexelsId = getPexelsID(url);
      if (pexelsId) {
          const thumbUrl = `https://images.pexels.com/videos/${pexelsId}/pictures/preview-0.jpg`;
          if (!formData.image || formData.image.includes('images.pexels.com') || formData.image.includes('img.youtube.com')) {
              updates['image'] = thumbUrl;
              setImageSource('url');
          }
      }
      
      setFormData({ ...formData, ...updates });
  };

  const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      try {
          // Sync main image for products if array is present
          let finalData = { ...formData };
          delete finalData.tempUrlInput; // Cleanup temp field

          if (activeTab === 'products') {
              if (finalData.images && finalData.images.length > 0) {
                  finalData.image = finalData.images[0];
              }
          }

          if (activeTab === 'products') {
              if (editingItem) await productService.updateProduct(finalData);
              else await productService.addProduct(finalData);
          } else if (activeTab === 'stories') {
              if (editingItem) await storyService.updateStory(finalData);
              else await storyService.addStory(finalData);
          } else if (activeTab === 'categories') {
              if (editingItem) await categoryService.updateCategory(finalData);
              else await categoryService.addCategory(finalData);
          } else if (activeTab === 'slider') {
              if (editingItem) await sliderService.updateSlide(finalData);
              else await sliderService.addSlide(finalData);
          } else if (activeTab === 'routes') {
              if (editingItem) await routeService.updateRoute(finalData);
              else await routeService.addRoute(finalData);
          } else if (activeTab === 'models') {
              if (editingItem) await modelService.updateModel(finalData);
              else await modelService.addModel(finalData);
          }
          
          await loadAllData();
          setIsModalOpen(false);
          onShowToast('success', 'Kaydedildi');
      } catch (e) {
          onShowToast('error', 'Kaydetme hatası');
      } finally {
          setIsSaving(false);
      }
  };

  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
      try {
          await orderService.updateOrderStatus(orderId, newStatus);
          setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
          onShowToast('success', 'Sipariş durumu güncellendi');
      } catch (e) {
          onShowToast('error', 'Hata oluştu');
      }
  };

  const handleToggleApiMode = () => {
      const targetMode = !CONFIG.USE_MOCK_API;
      const modeName = targetMode ? "MOCK (Yerel Veri)" : "LIVE (Sunucu)";
      if (confirm(`Veri kaynağını ${modeName} olarak değiştirmek istiyor musunuz? Sayfa yenilenecektir.`)) {
          CONFIG.toggleApiMode(targetMode);
      }
  };

  const handleNegotiationAction = async (id: string, status: 'accepted' | 'rejected') => {
      try {
          await negotiationService.updateOfferStatus(id, status);
          setNegotiations(prev => prev.map(n => n.id === id ? { ...n, status } : n));
          onShowToast('success', `Teklif ${status === 'accepted' ? 'onaylandı' : 'reddedildi'}`);
      } catch (e) {
          onShowToast('error', 'Hata oluştu');
      }
  };

  return (
    <div className="h-full bg-[#1A1A17] text-white font-sans flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-20 md:w-64 bg-[#050505] border-r border-white/5 flex flex-col flex-shrink-0 h-full overflow-y-auto no-scrollbar">
            <div className="p-6 flex items-center gap-3 border-b border-white/5 flex-shrink-0">
                <div className="w-8 h-8 bg-[#F2A619] rounded-lg flex items-center justify-center text-[#1A1A17] font-bold">M</div>
                <span className="font-display font-bold text-xl hidden md:block text-white">ADMIN</span>
            </div>
            
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {[ 
                    { id: 'dashboard', icon: LayoutDashboard, label: 'Panel' },
                    { id: 'products', icon: Package, label: 'Ürünler' },
                    { id: 'orders', icon: ShoppingCart, label: 'Siparişler' },
                    { id: 'users', icon: Users, label: 'Kullanıcılar' },
                    { id: 'negotiations', icon: Handshake, label: 'Pazarlıklar' },
                    { id: 'stories', icon: Circle, label: 'Hikayeler' },
                    { id: 'categories', icon: Grid, label: 'Kategoriler' },
                    { id: 'slider', icon: ImageIcon, label: 'Slider' },
                    { id: 'routes', icon: Map, label: 'Rotalar' },
                    { id: 'models', icon: Box, label: '3D Modeller' },
                ].map((item) => (
                    <button 
                        key={item.id} 
                        onClick={() => setActiveTab(item.id as AdminTab)} 
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${activeTab === item.id ? 'bg-[#F2A619] text-[#1A1A17]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="hidden md:block">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-white/5 space-y-2 flex-shrink-0">
                <button onClick={() => onNavigate('home')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white text-sm font-bold hover:bg-white/5"><Globe className="w-5 h-5"/> <span className="hidden md:block">Siteye Dön</span></button>
                <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 text-sm font-bold"><LogOut className="w-5 h-5"/> <span className="hidden md:block">Çıkış</span></button>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-[#1A1A17] flex flex-col h-full overflow-hidden">
            <header className="sticky top-0 z-30 bg-[#1A1A17]/90 backdrop-blur border-b border-white/5 px-8 py-4 flex justify-between items-center flex-shrink-0">
                <h1 className="text-2xl font-bold text-white capitalize">{activeTab.replace('-', ' ')}</h1>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleToggleApiMode}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 flex items-center gap-2 transition-colors cursor-pointer group"
                        title="Veri Kaynağını Değiştir"
                    >
                        <div className={`w-2 h-2 rounded-full ${CONFIG.USE_MOCK_API ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`}></div>
                        <span className="text-xs font-mono font-bold text-gray-400 group-hover:text-white transition-colors">{CONFIG.USE_MOCK_API ? 'MOCK DATA' : 'LIVE SERVER'}</span>
                        <RotateCcw className="w-3 h-3 text-gray-500 group-hover:text-white" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white"><Bell className="w-5 h-5"/></button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto">
                    {/* DASHBOARD */}
                    {activeTab === 'dashboard' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-[#242421] p-6 rounded-3xl border border-white/5 relative overflow-hidden">
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Toplam Ürün</p>
                                <h3 className="text-4xl font-mono font-bold text-white">{products.length}</h3>
                            </div>
                            <div className="bg-[#242421] p-6 rounded-3xl border border-white/5 relative overflow-hidden">
                                <p className="text-green-500 text-xs font-bold uppercase tracking-wider mb-2">Toplam Sipariş</p>
                                <h3 className="text-4xl font-mono font-bold text-white">{orders.length}</h3>
                            </div>
                            <div className="bg-[#242421] p-6 rounded-3xl border border-white/5 relative overflow-hidden">
                                <p className="text-blue-500 text-xs font-bold uppercase tracking-wider mb-2">Kullanıcılar</p>
                                <h3 className="text-4xl font-mono font-bold text-white">{users.length}</h3>
                            </div>
                            <div className="bg-[#242421] p-6 rounded-3xl border border-white/5 relative overflow-hidden">
                                <p className="text-purple-500 text-xs font-bold uppercase tracking-wider mb-2">Bekleyen Teklif</p>
                                <h3 className="text-4xl font-mono font-bold text-white">{negotiations.filter(n => n.status === 'pending').length}</h3>
                            </div>
                        </div>
                    )}

                    {/* USERS TAB */}
                    {activeTab === 'users' && (
                        <div className="space-y-4">
                            <div className="bg-[#242421] border border-white/5 rounded-2xl overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-black/20 text-xs text-gray-500 uppercase font-bold">
                                        <tr>
                                            <th className="p-4">Kullanıcı</th>
                                            <th className="p-4">E-posta</th>
                                            <th className="p-4">Rütbe / Puan</th>
                                            <th className="p-4">Kayıt Tarihi</th>
                                            <th className="p-4">İşlem</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {users.map(u => (
                                            <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                                <td className="p-4 font-bold text-white">{u.name} {u.isAdmin && <span className="bg-[#F2A619] text-black text-[9px] px-1.5 py-0.5 rounded ml-2">ADMIN</span>}</td>
                                                <td className="p-4 text-gray-400">{u.email}</td>
                                                <td className="p-4">
                                                    <div className="text-white text-sm">{u.rank || 'Scooter Çırağı'}</div>
                                                    <div className="text-[#F2A619] text-xs font-mono">{u.points || 0} Puan</div>
                                                </td>
                                                <td className="p-4 text-gray-500 text-sm font-mono">{u.joinDate}</td>
                                                <td className="p-4">
                                                    {!u.isAdmin && (
                                                        <button onClick={() => handleDelete(u.id)} className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {users.length === 0 && <div className="p-8 text-center text-gray-500">Kayıtlı kullanıcı bulunamadı.</div>}
                            </div>
                        </div>
                    )}

                    {/* ORDERS TAB */}
                    {activeTab === 'orders' && (
                        <div className="space-y-4">
                            {orders.map(order => (
                                <div key={order.id} className="bg-[#242421] p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-white font-mono font-bold text-lg">{order.id}</span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                                    order.status === 'Teslim Edildi' ? 'bg-green-500/20 text-green-500' : 
                                                    order.status === 'İptal' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="text-gray-500 text-xs mt-1">{order.date} • {order.items.length} Ürün</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="text-xs text-gray-500 uppercase font-bold">Toplam</div>
                                                <div className="text-[#F2A619] font-mono text-xl font-bold">₺{order.total.toLocaleString('tr-TR')}</div>
                                            </div>
                                            <select 
                                                value={order.status} 
                                                onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                                                className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 outline-none focus:border-[#F2A619]"
                                            >
                                                <option value="Hazırlanıyor">Hazırlanıyor</option>
                                                <option value="Kargoda">Kargoda</option>
                                                <option value="Teslim Edildi">Teslim Edildi</option>
                                                <option value="İptal">İptal</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-2 bg-black/20 rounded-lg">
                                                <img src={item.image} className="w-10 h-10 rounded object-cover" />
                                                <div className="flex-1">
                                                    <div className="text-white text-sm font-medium">{item.name}</div>
                                                    <div className="text-gray-500 text-xs">x{item.quantity}</div>
                                                </div>
                                                <div className="text-white font-mono text-sm">₺{item.price.toLocaleString()}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {orders.length === 0 && <div className="p-8 text-center text-gray-500 bg-[#242421] rounded-2xl border border-white/5">Henüz sipariş yok.</div>}
                        </div>
                    )}

                    {/* NEGOTIATIONS TAB */}
                    {activeTab === 'negotiations' && (
                        <div className="space-y-4">
                            {negotiations.length === 0 ? <div className="p-8 text-center text-gray-500 bg-[#242421] rounded-2xl border border-white/5">Henüz bir teklif yok.</div> : negotiations.map(offer => (
                                <div key={offer.id} className="bg-[#242421] p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center gap-6">
                                    <img src={offer.productImage} className="w-20 h-20 rounded-xl object-cover bg-white/5" />
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="font-bold text-white text-lg">{offer.productName}</h3>
                                        <p className="text-sm text-gray-400">Teklif Eden: {offer.userName}</p>
                                        <div className="flex justify-center md:justify-start gap-4 mt-2">
                                            <div className="text-center">
                                                <div className="text-[10px] text-gray-500 uppercase">Liste Fiyatı</div>
                                                <div className="text-white font-mono text-lg line-through decoration-red-500">₺{offer.originalPrice.toLocaleString('tr-TR')}</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-[10px] text-[#F2A619] uppercase font-bold">Teklif</div>
                                                <div className="text-[#F2A619] font-mono text-2xl font-bold">₺{offer.offerPrice.toLocaleString('tr-TR')}</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {offer.status === 'pending' ? (
                                        <div className="flex gap-2">
                                            <button onClick={() => handleNegotiationAction(offer.id, 'accepted')} className="p-3 bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white rounded-xl transition-all border border-green-500/50"><Check className="w-5 h-5" /></button>
                                            <button onClick={() => handleNegotiationAction(offer.id, 'rejected')} className="p-3 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-500/50"><X className="w-5 h-5" /></button>
                                        </div>
                                    ) : (
                                        <div className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider ${offer.status === 'accepted' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                            {offer.status === 'accepted' ? 'ONAYLANDI' : 'REDDEDİLDİ'}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* CONTENT MANAGEMENT TABS (Products, Stories, Models etc.) */}
                    {(activeTab === 'products' || activeTab === 'stories' || activeTab === 'categories' || activeTab === 'slider' || activeTab === 'routes' || activeTab === 'models') && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"/><input type="text" placeholder="Ara..." className="bg-[#242421] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:border-[#F2A619] outline-none"/></div>
                                <Button className="bg-[#F2A619] text-[#1A1A17] hover:bg-white" onClick={handleAddNew}><Plus className="w-4 h-4 mr-2"/> YENİ EKLE</Button>
                            </div>

                            {/* GRID VIEW FOR STORIES, CATEGORIES & MODELS */}
                            {(activeTab === 'stories' || activeTab === 'categories' || activeTab === 'models') && (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                    {(activeTab === 'stories' ? stories : activeTab === 'models' ? models : categories).map((item: any) => (
                                        <div key={item.id} className="bg-[#242421] border border-white/5 rounded-2xl overflow-hidden group relative p-4 flex flex-col items-center text-center">
                                            {activeTab === 'models' ? (
                                                // 3D Model Card Specific
                                                <div className="w-full aspect-[4/5] rounded-xl overflow-hidden border border-white/10 mb-3 relative bg-black/50">
                                                    <img src={item.poster} className="w-full h-full object-cover" alt="Poster" />
                                                    <div className="absolute top-2 left-2 bg-[#F2A619] text-black text-[10px] font-bold px-2 py-1 rounded">3D</div>
                                                </div>
                                            ) : (
                                                <div className={`w-24 h-24 rounded-full overflow-hidden border-2 mb-3 ${item.color || 'border-white/10'}`}>
                                                    <img src={item.image} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            
                                            <h3 className="font-bold text-white text-sm truncate w-full">{item.label || item.name}</h3>
                                            {item.desc && <p className="text-xs text-gray-500">{item.desc}</p>}
                                            {item.category && <p className="text-[10px] text-gray-500 uppercase">{item.category}</p>}
                                            
                                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEdit(item)} className="p-1.5 bg-white text-black rounded-lg"><Edit2 className="w-3 h-3"/></button>
                                                <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-red-500 text-white rounded-lg"><Trash2 className="w-3 h-3"/></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* LIST VIEW FOR PRODUCTS, ROUTES, SLIDER */}
                            {(activeTab === 'products' || activeTab === 'routes' || activeTab === 'slider') && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {(activeTab === 'products' ? products : activeTab === 'routes' ? routes : slides).map((item: any) => (
                                        <div key={item.id} className="bg-[#242421] border border-white/5 rounded-2xl overflow-hidden group relative">
                                            <div className="h-48 relative">
                                                {/* Video Thumbnail Logic for Slider */}
                                                {activeTab === 'slider' && item.type === 'video' ? (
                                                    <>
                                                        <img src={item.image} className="w-full h-full object-cover" alt="Poster" />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                                            <PlayCircle className="w-12 h-12 text-white opacity-80" />
                                                        </div>
                                                        <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-2 py-1 rounded">VIDEO</div>
                                                    </>
                                                ) : (
                                                    <img src={item.image} className="w-full h-full object-cover" alt="Content" />
                                                )}
                                                
                                                {/* 3D Badge for Products */}
                                                {activeTab === 'products' && item.model3d && (
                                                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-bold px-2 py-1 rounded flex items-center gap-1">
                                                        <Box className="w-3 h-3" /> 3D
                                                    </div>
                                                )}
                                                
                                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                    <button onClick={() => handleEdit(item)} className="p-2 bg-white text-black rounded-lg"><Edit2 className="w-4 h-4"/></button>
                                                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-500 text-white rounded-lg"><Trash2 className="w-4 h-4"/></button>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-white truncate">{item.name || item.title}</h3>
                                                <div className="flex justify-between mt-2">
                                                    {item.price && <span className="text-[#F2A619] font-bold">₺{item.price}</span>}
                                                    {item.location && <span className="text-gray-400 text-xs flex items-center gap-1"><Map className="w-3 h-3"/> {item.location}</span>}
                                                    {item.subtitle && <span className="text-gray-500 text-xs truncate max-w-[150px]">{item.subtitle}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* --- EDIT MODAL --- */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#242421] border border-white/10 rounded-3xl w-full max-w-lg p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
                    <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><Edit2 className="w-5 h-5 rotate-45"/></button>
                    <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">{editingItem ? 'Düzenle' : 'Yeni Ekle'}</h2>
                    
                    <form onSubmit={handleSave} className="space-y-4">
                        
                        {/* Current Image Preview & Management */}
                        {activeTab === 'products' && formData.images && formData.images.length > 0 ? (
                            <div className="grid grid-cols-4 gap-2 mb-4">
                                {formData.images.map((url: string, index: number) => (
                                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-white/10">
                                        <img src={url} className="w-full h-full object-cover" alt="Product" />
                                        <button 
                                            type="button"
                                            onClick={() => handleRemoveImage(url)}
                                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        {index === 0 && <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[9px] text-center py-0.5">Kapak</span>}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // Legacy single image preview or Model poster
                            (formData.image || formData.poster) && (
                                <div className="w-full h-40 rounded-xl overflow-hidden border border-white/10 relative mb-4 bg-black">
                                    <img src={formData.image || formData.poster} className="w-full h-full object-contain" alt="Preview" />
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, image: '', poster: ''})}
                                        className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    {activeTab === 'slider' && formData.type === 'video' && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <PlayCircle className="w-12 h-12 text-white/80" />
                                        </div>
                                    )}
                                </div>
                            )
                        )}

                        {/* --- MEDIA SOURCE TOGGLE --- */}
                        <div className="flex bg-[#111] p-1 rounded-lg mb-4 border border-white/5">
                            <button
                                type="button"
                                onClick={() => setImageSource('upload')}
                                className={`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-all ${imageSource === 'upload' ? 'bg-[#F2A619] text-[#1A1A17]' : 'text-gray-400 hover:text-white'}`}
                            >
                                <UploadCloud className="w-4 h-4" /> Dosya Yükle
                            </button>
                            <button
                                type="button"
                                onClick={() => setImageSource('url')}
                                className={`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-all ${imageSource === 'url' ? 'bg-[#F2A619] text-[#1A1A17]' : 'text-gray-400 hover:text-white'}`}
                            >
                                <LinkIcon className="w-4 h-4" /> URL Adresi
                            </button>
                        </div>

                        {/* --- PRODUCT UPLOAD TYPE TOGGLE (Only for Upload Mode + Products) --- */}
                        {activeTab === 'products' && imageSource === 'upload' && (
                            <div className="flex gap-2 mb-4">
                                <button
                                    type="button"
                                    onClick={() => setProductUploadType('image')}
                                    className={`px-3 py-1 text-[10px] font-bold rounded border transition-all ${productUploadType === 'image' ? 'bg-white text-black border-white' : 'text-gray-500 border-white/10 hover:text-white'}`}
                                >
                                    Resim Ekle
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setProductUploadType('model')}
                                    className={`px-3 py-1 text-[10px] font-bold rounded border transition-all ${productUploadType === 'model' ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-500 border-white/10 hover:text-white'}`}
                                >
                                    3D Model Ekle
                                </button>
                            </div>
                        )}

                        {/* --- MEDIA INPUT AREA --- */}
                        {imageSource === 'upload' ? (
                            <div className="w-full">
                                <FilePond
                                    files={files}
                                    onupdatefiles={setFiles}
                                    allowMultiple={activeTab === 'products' && productUploadType === 'image'}
                                    maxFiles={activeTab === 'products' && productUploadType === 'image' ? 5 : 1}
                                    // Dynamically set types for 3D models vs Images
                                    acceptedFileTypes={(activeTab === 'models' || productUploadType === 'model') ? ['.glb', '.gltf'] : ['image/*']}
                                    allowImageCrop={activeTab !== 'models' && productUploadType !== 'model'}
                                    imageCropAspectRatio={activeTab === 'slider' ? '16:9' : '1:1'}
                                    allowImageResize={activeTab !== 'models' && productUploadType !== 'model'}
                                    server={{
                                        process: (fieldName, file, metadata, load, error, progress, abort) => {
                                            storageService.uploadFile(file as File).then(url => {
                                                if (activeTab === 'products') {
                                                    if (productUploadType === 'model') {
                                                        setFormData((prev: any) => ({ ...prev, model3d: url }));
                                                    } else {
                                                        setFormData((prev: any) => ({ 
                                                            ...prev, 
                                                            images: [...(prev.images || []), url],
                                                            image: prev.image || url
                                                        }));
                                                    }
                                                } else if (activeTab === 'models') {
                                                    // For models, upload maps to 'url'
                                                    setFormData((prev: any) => ({ ...prev, url: url }));
                                                } else {
                                                    setFormData((prev: any) => ({ ...prev, image: url }));
                                                }
                                                load(url);
                                            }).catch(err => {
                                                onShowToast('error', 'Yükleme başarısız');
                                                error(err.message);
                                            })
                                        }
                                    }}
                                    name="file"
                                    labelIdle={(activeTab === 'models' || productUploadType === 'model') ? '3D Model (.glb) yükle' : 'Fotoğraf yüklemek için <span class="filepond--label-action">Gözat</span>'}
                                    credits={false}
                                    stylePanelLayout="compact"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder={
                                            activeTab === 'slider' && formData.type === 'video' ? "Video Kapak Resmi URL" : 
                                            (activeTab === 'models' || (activeTab === 'products' && productUploadType === 'model')) ? "3D Model URL (.glb)" : 
                                            "Görsel URL (https://...)"
                                        }
                                        className="flex-1 bg-[#1A1A17] p-3 rounded-xl text-white outline-none border border-white/10 focus:border-[#F2A619] text-sm"
                                        value={activeTab === 'products' ? (formData.tempUrlInput || '') : (activeTab === 'models' ? (formData.url || '') : (formData.image || ''))}
                                        onChange={e => {
                                            const val = e.target.value;
                                            if (activeTab === 'products') {
                                                setFormData({...formData, tempUrlInput: val});
                                            } else if (activeTab === 'models') {
                                                setFormData({...formData, url: val});
                                            } else {
                                                setFormData({...formData, image: val});
                                            }
                                        }}
                                    />
                                    {activeTab === 'products' && (
                                        <button 
                                            type="button"
                                            onClick={handleAddUrlImage}
                                            className="bg-moto-accent text-black px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" /> EKLE
                                        </button>
                                    )}
                                </div>
                                {/* Product URL Preview */}
                                {activeTab === 'products' && formData.tempUrlInput && productUploadType === 'image' && (
                                    <div className="w-20 h-20 rounded-lg border border-white/10 overflow-hidden relative">
                                        <img src={formData.tempUrlInput} className="w-full h-full object-cover opacity-50" onError={(e) => e.currentTarget.style.display = 'none'} />
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <span className="text-[9px] text-white bg-black/50 px-1 rounded">Önizleme</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* --- SLIDER SPECIFIC FIELDS --- */}
                        {activeTab === 'slider' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] text-gray-500 font-bold uppercase">Medya Tipi</label>
                                        <select 
                                            className="w-full bg-[#1A1A17] p-3 rounded-xl text-white outline-none border border-white/10"
                                            value={formData.type || 'image'}
                                            onChange={e => setFormData({...formData, type: e.target.value})}
                                        >
                                            <option value="image">Resim</option>
                                            <option value="video">Video</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] text-gray-500 font-bold uppercase">Aksiyon</label>
                                        <select 
                                            className="w-full bg-[#1A1A17] p-3 rounded-xl text-white outline-none border border-white/10"
                                            value={formData.action || 'shop'}
                                            onChange={e => setFormData({...formData, action: e.target.value})}
                                        >
                                            <option value="shop">Mağaza</option>
                                            <option value="routes">Rotalar</option>
                                            <option value="blog">Blog</option>
                                        </select>
                                    </div>
                                </div>

                                {formData.type === 'video' && (
                                    <div className="bg-[#111] p-4 rounded-xl border border-white/10">
                                        <label className="text-[10px] text-red-500 font-bold uppercase mb-2 flex items-center gap-1">
                                            <Video className="w-3 h-3" /> Video Kaynağı
                                        </label>
                                        <input 
                                            placeholder="Video URL (MP4 veya YouTube Linki)" 
                                            className="w-full bg-[#1A1A17] p-3 rounded-xl text-white outline-none border border-white/10 focus:border-[#F2A619] mb-2" 
                                            value={formData.videoUrl || ''} 
                                            onChange={handleVideoUrlChange} 
                                        />
                                        <p className="text-[10px] text-gray-500 leading-tight">
                                            Desteklenen: <strong className="text-white">MP4 (Direkt Video Linki)</strong>, YouTube.<br/>
                                            <span className="text-red-400">Pexels için:</span> Videonun "Free Download" linkini veya sağ tıklayıp "Video adresini kopyala" seçeneğini kullanın. Sayfa linki sadece kapak resmi çeker.
                                        </p>
                                    </div>
                                )}

                                <input placeholder="Başlık" className="w-full bg-[#1A1A17] p-3 rounded-xl text-white outline-none border border-white/10 focus:border-[#F2A619]" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} required />
                                <input placeholder="Alt Başlık" className="w-full bg-[#1A1A17] p-3 rounded-xl text-white outline-none border border-white/10 focus:border-[#F2A619]" value={formData.subtitle || ''} onChange={e => setFormData({...formData, subtitle: e.target.value})} />
                                <input placeholder="Buton Metni" className="w-full bg-[#1A1A17] p-3 rounded-xl text-white outline-none border border-white/10 focus:border-[#F2A619]" value={formData.cta || ''} onChange={e => setFormData({...formData, cta: e.target.value})} />
                            </>
                        )}

                        {/* --- PRODUCT FIELDS --- */}
                        {activeTab === 'products' && (
                            <>
                                <input placeholder="Ürün Adı" className="w-full bg-[#1A1A17] p-3 rounded-xl text-white outline-none border border-white/10 focus:border-[#F2A619]" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                <div className="flex gap-4">
                                    <input type="number" placeholder="Fiyat" className="flex-1 bg-[#1A1A17] p-3 rounded-xl text-white outline-none border border-white/10 focus:border-[#F2A619]" value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} required />
                                    <input type="number" placeholder="Stok" className="flex-1 bg-[#1A1A17] p-3 rounded-xl text-white outline-none border border-white/10 focus:border-[#F2A619]" value={formData.stock || ''} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} required />
                                </div>
                                <select className="w-full bg-[#1A1A17] p-3 rounded-xl text-white outline-none border border-white/10" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})}>
                                    {['Kask', 'Mont', 'Eldiven', 'Bot', 'Pantolon', 'Koruma', 'İnterkom', 'Aksesuar'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <textarea placeholder="Açıklama" className="w-full bg-[#1A1A17] p-3 rounded-xl text-white outline-none border border-white/10 h-24" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
                                
                                {formData.model3d && (
                                    <div className="p-3 bg-[#111] border border-white/10 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Box className="w-4 h-4 text-blue-500" />
                                            <span className="text-xs text-gray-300">3D Model Yüklendi</span>
                                        </div>
                                        <button type="button" onClick={() => setFormData({...formData, model3d: ''})} className="text-red-500 hover:text-white text-xs">Kaldır</button>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 mb-2">
                                    <input 
                                        type="checkbox" 
                                        id="isNegotiable"
                                        checked={formData.isNegotiable || false} 
                                        onChange={e => setFormData({...formData, isNegotiable: e.target.checked})} 
                                        className="w-5 h-5 rounded border-white/10 bg-[#1A1A17] text-[#F2A619] focus:ring-[#F2A619] accent-[#F2A619]"
                                    />
                                    <label htmlFor="isNegotiable" className="text-white text-sm font-bold cursor-pointer select-none">Pazarlığa Açık Ürün</label>
                                </div>
                            </>
                        )}

                        {/* --- 3D MODEL FIELDS --- */}
                        {activeTab === 'models' && (
                            <>
                                <input placeholder="Model Adı" className="w-full bg-[#1A1A17] p-3 rounded-xl text-white outline-none border border-white/10 focus:border-[#F2A619]" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                <input placeholder="Kategori" className="w-full bg-[#1A1A17] p-3 rounded-xl text-white outline-none border border-white/10 focus:border-[#F2A619]" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} />
                                <div className="space-y-2">
                                    <label className="text-[10px] text-gray-500 font-bold uppercase">Poster (Kapak Resmi) URL</label>
                                    <input placeholder="Poster URL (https://...)" className="w-full bg-[#1A1A17] p-3 rounded-xl text-white outline-none border border-white/10 focus:border-[#F2A619]" value={formData.poster || ''} onChange={e => setFormData({...formData, poster: e.target.value})} />
                                </div>
                                {imageSource === 'url' && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-gray-500 font-bold uppercase">Model URL (.glb)</label>
                                        <input placeholder="Model URL (https://...)" className="w-full bg-[#1A1A17] p-3 rounded-xl text-white outline-none border border-white/10 focus:border-[#F2A619]" value={formData.url || ''} onChange={e => setFormData({...formData, url: e.target.value})} />
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'stories' && (
                            <>
                                <input placeholder="Etiket (Örn: Çok Satanlar)" className="w-full bg-[#1A1A17] p-3 rounded-xl text-white outline-none border border-white/10 focus:border-[#F2A619]" value={formData.label || ''} onChange={e => setFormData({...formData, label: e.target.value})} required />
                                <select className="w-full bg-[#1A1A17] p-3 rounded-xl text-white outline-none border border-white/10" value={formData.color || ''} onChange={e => setFormData({...formData, color: e.target.value})}>
                                    <option value="border-orange-500">Turuncu</option>
                                    <option value="border-green-500">Yeşil</option>
                                    <option value="border-blue-500">Mavi</option>
                                    <option value="border-purple-500">Mor</option>
                                    <option value="border-red-500">Kırmızı</option>
                                    <option value="border-yellow-500">Sarı</option>
                                </select>
                            </>
                        )}

                        {activeTab === 'categories' && (
                            <>
                                <input placeholder="Kategori Adı" className="w-full bg-[#1A1A17] p-3 rounded-xl text-white outline-none border border-white/10 focus:border-[#F2A619]" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                <input placeholder="Alt Açıklama (Örn: Maksimum Güvenlik)" className="w-full bg-[#1A1A17] p-3 rounded-xl text-white outline-none border border-white/10 focus:border-[#F2A619]" value={formData.desc || ''} onChange={e => setFormData({...formData, desc: e.target.value})} />
                                <select className="w-full bg-[#1A1A17] p-3 rounded-xl text-white outline-none border border-white/10" value={formData.type || ''} onChange={e => setFormData({...formData, type: e.target.value})}>
                                    {['Kask', 'Mont', 'Eldiven', 'Bot', 'Pantolon', 'Koruma', 'İnterkom', 'Aksesuar'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </>
                        )}

                        {activeTab === 'routes' && (
                            <>
                                <input placeholder="Rota Başlığı" className="w-full bg-[#1A1A17] p-3 rounded-xl text-white outline-none border border-white/10 focus:border-[#F2A619]" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} required />
                                <input placeholder="Lokasyon (İl/İlçe)" className="w-full bg-[#1A1A17] p-3 rounded-xl text-white outline-none border border-white/10 focus:border-[#F2A619]" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} />
                                <div className="flex gap-4">
                                    <input placeholder="Mesafe (100 km)" className="flex-1 bg-[#1A1A17] p-3 rounded-xl text-white outline-none border border-white/10 focus:border-[#F2A619]" value={formData.distance || ''} onChange={e => setFormData({...formData, distance: e.target.value})} />
                                    <select className="flex-1 bg-[#1A1A17] p-3 rounded-xl text-white outline-none border border-white/10" value={formData.difficulty || 'Orta'} onChange={e => setFormData({...formData, difficulty: e.target.value})}>
                                        <option value="Kolay">Kolay</option>
                                        <option value="Orta">Orta</option>
                                        <option value="Zor">Zor</option>
                                        <option value="Extreme">Extreme</option>
                                    </select>
                                </div>
                            </>
                        )}

                        <Button type="submit" variant="primary" className="w-full justify-center mt-6" isLoading={isSaving}>KAYDET</Button>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};
