

import { Route } from '../types';
import { DB, getStorage, setStorage, delay } from './db';
import { CONFIG } from './config';

const DEFAULT_ROUTES: Route[] = [
  {
    id: 'route-1',
    title: 'Trans Toros Geçişi',
    description: 'Akdeniz\'in zirvelerinde virajlı ve manzaralı bir sürüş. Sert virajlar ve yükseklik değişimi ile teknik bir rota.',
    image: 'https://images.unsplash.com/photo-1605152276897-4f618f831968?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Zor',
    distance: '320 km',
    duration: '6 Saat',
    location: 'Antalya - Isparta',
    bestSeason: 'İlkbahar - Sonbahar',
    tags: ['Virajlı', 'Dağ', 'Manzara'],
    coordinates: { lat: 36.8841, lng: 30.7056 },
    path: [
        { lat: 36.8841, lng: 30.7056 }, // Antalya
        { lat: 36.9500, lng: 30.6500 },
        { lat: 37.0500, lng: 30.5500 },
        { lat: 37.1500, lng: 30.6000 }, // Mountains
        { lat: 37.3000, lng: 30.7500 },
        { lat: 37.5000, lng: 30.8000 },
        { lat: 37.7648, lng: 30.5566 }  // Isparta
    ]
  },
  {
    id: 'route-2',
    title: 'Ege Sahil Yolu',
    description: 'Deniz kokusu eşliğinde, zeytin ağaçları arasından geçen sakin ve keyifli bir rota. Gün batımı sürüşleri için ideal.',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Kolay',
    distance: '180 km',
    duration: '3 Saat',
    location: 'İzmir - Çanakkale',
    bestSeason: 'Yaz',
    tags: ['Sahil', 'Kamp', 'Rahat'],
    coordinates: { lat: 38.4192, lng: 27.1287 },
    path: [
        { lat: 38.4192, lng: 27.1287 }, // İzmir
        { lat: 38.5500, lng: 27.0500 }, // Menemen
        { lat: 38.8000, lng: 26.9500 }, // Aliağa
        { lat: 39.1000, lng: 26.9000 }, // Dikili
        { lat: 39.3000, lng: 26.7000 }, // Ayvalık
        { lat: 39.5000, lng: 26.6000 }  // Edremit
    ]
  },
  {
    id: 'route-3',
    title: 'Karadeniz Yayla Yolu',
    description: 'Bulutların üzerinde, sisli ve yeşil bir macera. Yer yer bozuk zemin ve yağmur ihtimali ile adventure motorlar için birebir.',
    image: 'https://images.unsplash.com/photo-1504218290665-37a5f94688b0?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Extreme',
    distance: '450 km',
    duration: '8 Saat',
    location: 'Trabzon - Rize',
    bestSeason: 'Yaz Ortası',
    tags: ['Offroad', 'Yayla', 'Sis'],
    coordinates: { lat: 40.9833, lng: 39.7167 },
    path: [
        { lat: 40.9833, lng: 39.7167 },
        { lat: 40.8500, lng: 39.8000 }, // Maçka
        { lat: 40.7000, lng: 39.9500 }, // Sümela
        { lat: 40.6000, lng: 40.1000 }, // Yaylalar
        { lat: 40.8000, lng: 40.4000 }, 
        { lat: 41.0201, lng: 40.5234 }  // Rize
    ]
  },
  {
    id: 'route-4',
    title: 'Kapadokya Peri Rotaları',
    description: 'Tarihi dokunun içinde, balonların altında mistik bir sürüş deneyimi. Fotoğraf tutkunları için eşsiz duraklar.',
    image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Orta',
    distance: '120 km',
    duration: '2.5 Saat',
    location: 'Nevşehir',
    bestSeason: 'İlkbahar',
    tags: ['Tarih', 'Fotoğraf', 'Toz'],
    coordinates: { lat: 38.6250, lng: 34.7122 },
    path: [
        { lat: 38.6250, lng: 34.7122 },
        { lat: 38.6500, lng: 34.8000 }, // Ürgüp
        { lat: 38.6000, lng: 34.8500 }, // Göreme
        { lat: 38.5500, lng: 34.7500 }, // Uçhisar
        { lat: 38.6250, lng: 34.7122 }  // Loop back
    ]
  },
  {
    id: 'route-5',
    title: 'Uçmakdere Virajları',
    description: 'Marmara\'nın en keyifli virajlarına sahip, deniz ve dağ manzarasının birleştiği efsanevi rota. Yamaç paraşütü alanında mola verilebilir.',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Orta',
    distance: '85 km',
    duration: '2 Saat',
    location: 'Tekirdağ - Şarköy',
    bestSeason: 'İlkbahar - Yaz',
    tags: ['Viraj', 'Deniz', 'Haftasonu'],
    coordinates: { lat: 40.8037, lng: 27.3682 },
    path: [
        { lat: 40.9780, lng: 27.5117 }, // Tekirdağ
        { lat: 40.8800, lng: 27.4500 }, // Kumbağ
        { lat: 40.8037, lng: 27.3682 }, // Uçmakdere
        { lat: 40.7500, lng: 27.2500 }, // Mürefte
        { lat: 40.6150, lng: 27.1000 }  // Şarköy
    ]
  },
  {
    id: 'route-6',
    title: 'Karanlık Kanyon & Taş Yolu',
    description: 'Dünyanın en tehlikeli yollarından biri olarak bilinen, el emeği tüneller ve uçurum kenarı sürüşü içeren saf adrenalin rotası.',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Extreme',
    distance: '60 km',
    duration: '4 Saat',
    location: 'Erzincan - Kemaliye',
    bestSeason: 'Yaz - Sonbahar',
    tags: ['Adventure', 'Kanyon', 'Tünel'],
    coordinates: { lat: 39.2630, lng: 38.4962 },
    path: [
        { lat: 39.2630, lng: 38.4962 },
        { lat: 39.2800, lng: 38.5200 },
        { lat: 39.3000, lng: 38.5500 }, // Tunnels
        { lat: 39.3200, lng: 38.5800 },
        { lat: 39.3500, lng: 38.6000 }
    ]
  },
  {
    id: 'route-7',
    title: 'Datça Knidos Yolu',
    description: 'Badem ağaçları arasından geçerek antik kente ulaşan, Ege ve Akdeniz\'in birleştiği noktada huzurlu ve virajlı bir yolculuk.',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Orta',
    distance: '140 km',
    duration: '3 Saat',
    location: 'Muğla - Datça',
    bestSeason: 'İlkbahar - Sonbahar',
    tags: ['Tarih', 'Doğa', 'Viraj'],
    coordinates: { lat: 36.7237, lng: 27.6854 },
    path: [
        { lat: 36.9500, lng: 28.1000 }, // Marmaris Turnoff
        { lat: 36.8500, lng: 27.9000 },
        { lat: 36.7237, lng: 27.6854 }, // Datça Center
        { lat: 36.6800, lng: 27.3700 }  // Knidos
    ]
  },
  {
    id: 'route-8',
    title: 'Bolu Yedigöller Orman Yolu',
    description: 'Sonbaharda renk cümbüşü sunan, sık orman içi yolları ve göl manzaraları ile tam bir terapi rotası. Zemin yer yer kaygan olabilir.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Orta',
    distance: '90 km',
    duration: '2.5 Saat',
    location: 'Bolu',
    bestSeason: 'Sonbahar',
    tags: ['Orman', 'Kamp', 'Fotoğraf'],
    coordinates: { lat: 40.9427, lng: 31.7516 },
    path: [
        { lat: 40.7300, lng: 31.6000 }, // Bolu
        { lat: 40.8500, lng: 31.6800 },
        { lat: 40.9427, lng: 31.7516 }, // Yedigöller
        { lat: 41.0000, lng: 31.8500 }
    ]
  },
  {
    id: 'route-9',
    title: 'Tuz Gölü Sonsuzluk Sürüşü',
    description: 'Ufuk çizgisinin kaybolduğu, gün batımında eşsiz yansımalar sunan düz ama büyüleyici bir rota. Drone çekimi için ideal.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Kolay',
    distance: '200 km',
    duration: '2.5 Saat',
    location: 'Ankara - Aksaray',
    bestSeason: 'Yaz',
    tags: ['Manzara', 'Düz Yol', 'Fotoğraf'],
    coordinates: { lat: 38.8350, lng: 33.3323 },
    path: [
        { lat: 39.0000, lng: 33.0000 },
        { lat: 38.8350, lng: 33.3323 }, // Tuz Gölü Center Approx
        { lat: 38.7000, lng: 33.5000 }
    ]
  }
];

export const routeService = {
  async getRoutes(): Promise<Route[]> {
    if (CONFIG.USE_MOCK_API) {
        await delay(300);
        const stored = getStorage<Route[]>(DB.ROUTES, []);
        if (stored.length === 0) {
            setStorage(DB.ROUTES, DEFAULT_ROUTES);
            return DEFAULT_ROUTES;
        }
        return stored;
    } else {
        // REAL BACKEND
        try {
            const response = await fetch(`${CONFIG.API_URL}/routes`);
            if (!response.ok) return DEFAULT_ROUTES;
            return await response.json();
        } catch {
            return DEFAULT_ROUTES;
        }
    }
  },

  async addRoute(route: Omit<Route, 'id'>): Promise<Route> {
    if (CONFIG.USE_MOCK_API) {
        await delay(500);
        const routes = getStorage<Route[]>(DB.ROUTES, []);
        const newRoute: Route = {
            ...route,
            id: `route-${Date.now()}`,
        };
        routes.unshift(newRoute);
        setStorage(DB.ROUTES, routes);
        return newRoute;
    } else {
        // REAL BACKEND
        const response = await fetch(`${CONFIG.API_URL}/routes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(route)
        });
        return await response.json();
    }
  },

  async updateRoute(route: Route): Promise<void> {
    if (CONFIG.USE_MOCK_API) {
        await delay(300);
        const routes = getStorage<Route[]>(DB.ROUTES, []);
        const index = routes.findIndex(r => r.id === route.id);
        if (index !== -1) {
            routes[index] = route;
            setStorage(DB.ROUTES, routes);
        }
    } else {
        // REAL BACKEND
        await fetch(`${CONFIG.API_URL}/routes/${route.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(route)
        });
    }
  },

  async deleteRoute(id: string): Promise<void> {
    if (CONFIG.USE_MOCK_API) {
        await delay(300);
        const routes = getStorage<Route[]>(DB.ROUTES, []);
        const filtered = routes.filter(r => r.id !== id);
        setStorage(DB.ROUTES, filtered);
    } else {
        // REAL BACKEND
        await fetch(`${CONFIG.API_URL}/routes/${id}`, {
            method: 'DELETE'
        });
    }
  }
};