

import { Product, ProductCategory, Slide, ViewState } from './types';

export const APP_NAME = "MotoVibe";

export const DEFAULT_SLIDES: Slide[] = [
  {
    id: 1,
    type: 'video', // New Video Type
    // High quality riding video
    videoUrl: 'https://www.pexels.com/download/video/5803208/',
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2000&auto=format&fit=crop",
    title: "HIZIN VE ÖZGÜRLÜĞÜN YENİ ADRESİ",
    subtitle: "MOTOVIBE İLE SÜRÜŞ DENEYİMİNİ ZİRVEYE TAŞI.",
    cta: "KOLEKSİYONU KEŞFET",
    action: 'shop' as ViewState
  },
  {
    id: 2,
    type: 'image',
    // Professional gear, clean look
    image: "https://images.unsplash.com/photo-1622185135505-2d795043ec63?q=80&w=2000&auto=format&fit=crop",
    title: "GÜVENLİĞİ ŞANSA BIRAKMA",
    subtitle: "DÜNYA STANDARTLARINDA EKİPMANLAR, SADECE BURADA.",
    cta: "KASKLARI İNCELE",
    action: 'shop' as ViewState
  },
  {
    id: 3,
    type: 'image',
    // Adventure/Route oriented
    image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?q=80&w=2000&auto=format&fit=crop",
    title: "MACERA DOLU ROTALAR",
    subtitle: "YENİ YOLLAR KEŞFETMEK İÇİN HAZIR MISIN?",
    cta: "ROTANI OLUŞTUR",
    action: 'routes' as ViewState
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "AeroSpeed Carbon Pro Kask",
    description: "Yüksek hız aerodinamiği için tasarlanmış ultra hafif karbon fiber kask. Maksimum görüş açısı ve gelişmiş havalandırma sistemi.",
    price: 8500,
    category: ProductCategory.HELMET,
    // Carbon helmet, studio dark
    image: "https://images.unsplash.com/photo-1558981408-db0ecd8a1ee4?q=80&w=800&auto=format&fit=crop",
    images: [
        "https://images.unsplash.com/photo-1558981408-db0ecd8a1ee4?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1596516109370-29001ec8ec36?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1626246473336-23b9c79f9068?q=80&w=800&auto=format&fit=crop"
    ],
    rating: 4.8,
    features: ["Karbon Fiber Kabuk", "Pinlock Dahil", "Acil Durum Ped Çıkarma", "ECE 22.06 Sertifikalı"],
    stock: 15,
    isNegotiable: true
  },
  {
    id: 2,
    name: "Urban Rider Deri Mont",
    description: "Şehir içi sürüşler için şık ve korumalı deri mont. D3O korumalar ile maksimum güvenlik, vintage görünüm.",
    price: 5200,
    category: ProductCategory.JACKET,
    // Leather jacket vibe
    image: "https://images.unsplash.com/photo-1551028919-ac7edd05b6ea?q=80&w=800&auto=format&fit=crop",
    images: [
        "https://images.unsplash.com/photo-1551028919-ac7edd05b6ea?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1520975661595-6453be3f7070?q=80&w=800&auto=format&fit=crop"
    ],
    rating: 4.6,
    features: ["%100 Gerçek Deri", "D3O Omuz ve Dirsek Koruma", "Termal İçlik", "Havalandırma Fermuarları"],
    stock: 8,
    isNegotiable: true
  },
  {
    id: 3,
    name: "StormChaser Su Geçirmez Eldiven",
    description: "Her türlü hava koşulunda ellerinizi kuru ve sıcak tutan Gore-Tex teknolojili touring eldiveni.",
    price: 1800,
    category: ProductCategory.GLOVES,
    // Gloves close up
    image: "https://images.unsplash.com/photo-1582650058723-41c60dc32700?q=80&w=800&auto=format&fit=crop",
    images: [
        "https://images.unsplash.com/photo-1582650058723-41c60dc32700?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1627483262268-9c96d8a31895?q=80&w=800&auto=format&fit=crop"
    ], 
    rating: 4.5,
    features: ["Gore-Tex Membran", "Dokunmatik Ekran Uyumlu", "Avuç İçi Slider", "Uzun Bilek Yapısı"],
    stock: 25,
    isNegotiable: false
  },
  {
    id: 4,
    name: "Enduro Tech Adventure Bot",
    description: "Zorlu arazi koşulları ve uzun yolculuklar için tasarlanmış, dayanıklı ve konforlu adventure botu.",
    price: 6750,
    category: ProductCategory.BOOTS,
    // Boots
    image: "https://images.unsplash.com/photo-1581321825690-919539c39733?q=80&w=800&auto=format&fit=crop",
    images: [
        "https://images.unsplash.com/photo-1581321825690-919539c39733?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop"
    ], 
    rating: 4.9,
    features: ["Su Geçirmez", "Kaymaz Taban", "TPU Kaval Kemiği Koruma", "Hızlı Bağlama Sistemi"],
    stock: 12,
    isNegotiable: true
  },
  {
    id: 5,
    name: "StreetFighter Tekstil Mont",
    description: "Sıcak havalar için file ağırlıklı, sürtünmeye dayanıklı tekstil mont. Sportif kesim.",
    price: 3400,
    category: ProductCategory.JACKET,
    // Textile/Sport Jacket
    image: "https://images.unsplash.com/photo-1593055363567-c6b77c427329?q=80&w=800&auto=format&fit=crop",
    images: [
        "https://images.unsplash.com/photo-1593055363567-c6b77c427329?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=800&auto=format&fit=crop"
    ],
    rating: 4.3,
    features: ["Mesh Paneller", "Reflektif Detaylar", "Sırt Koruma Cebi", "Ayarlanabilir Bel"],
    stock: 20,
    isNegotiable: false
  },
  {
    id: 6,
    name: "ProVision İnterkom Sistemi",
    description: "Grup sürüşleri için kristal netliğinde ses sağlayan, uzun menzilli Bluetooth interkom.",
    price: 2900,
    category: ProductCategory.INTERCOM,
    // Tech/Gadget on Helmet
    image: "https://images.unsplash.com/photo-1563820299-b8736e84d4ae?q=80&w=800&auto=format&fit=crop",
    images: [
        "https://images.unsplash.com/photo-1563820299-b8736e84d4ae?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1622185135505-2d795043ec63?q=80&w=800&auto=format&fit=crop"
    ],
    rating: 4.7,
    features: ["1.2km Menzil", "4 Kişilik Konferans", "Gürültü Önleme", "Suya Dayanıklı"],
    stock: 30,
    isNegotiable: true
  },
  {
    id: 7,
    name: "Titanium Dizlik Koruması",
    description: "Ekstra güvenlik isteyenler için mafsallı ve titanyum destekli diz koruması.",
    price: 1200,
    category: ProductCategory.PROTECTION,
    // Knee guard / protection
    image: "https://images.unsplash.com/photo-1558981000-f294a618282a?q=80&w=800&auto=format&fit=crop",
    images: [
        "https://images.unsplash.com/photo-1558981000-f294a618282a?q=80&w=800&auto=format&fit=crop"
    ],
    rating: 4.4,
    features: ["Mafsallı Yapı", "Titanyum Plaka", "Rahat İç Ped", "Ayarlanabilir Bantlar"],
    stock: 18,
    isNegotiable: false
  },
  {
    id: 8,
    name: "Viper Sport Kask",
    description: "Agresif tasarımı ve rüzgar tüneli testi ile geliştirilmiş aerodinamik yapısı ile pist günleri için ideal.",
    price: 7200,
    category: ProductCategory.HELMET,
    // Sport Helmet
    image: "https://images.unsplash.com/photo-1589408432328-9b5947a5079a?q=80&w=800&auto=format&fit=crop",
    images: [
        "https://images.unsplash.com/photo-1589408432328-9b5947a5079a?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop"
    ],
    rating: 4.7,
    features: ["Fiberglass Kompozit", "Double-D Bağlantı", "Geniş Görüş", "Anti-Bakteriyel İçlik"],
    stock: 5,
    isNegotiable: true
  },
  {
    id: 9,
    name: "ProMoto Seramik Zincir Yağı",
    description: "Yüksek hız ve zorlu hava koşullarına dayanıklı, sıçrama yapmayan özel formüllü seramik zincir yağı.",
    price: 450,
    category: ProductCategory.ACCESSORY,
    // Maintenance/Oil
    image: "https://images.unsplash.com/photo-1532649538666-93838aeef42e?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1532649538666-93838aeef42e?q=80&w=800&auto=format&fit=crop"],
    rating: 4.9,
    features: ["Seramik Kaplama", "Suya Dayanıklı", "O-Ring/X-Ring Uyumlu", "Uzun Ömürlü Koruma"],
    stock: 50,
    isNegotiable: false
  },
  {
    id: 10,
    name: "ThermoGrip Akıllı Elcik Isıtma",
    description: "Soğuk kış sürüşlerinde ellerinizi sıcak tutan, 5 kademeli ayarlanabilir, akü korumalı ısıtma sistemi.",
    price: 1650,
    category: ProductCategory.ACCESSORY,
    // Handlebar grip
    image: "https://images.unsplash.com/photo-1508357941501-0924cf312bbd?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1508357941501-0924cf312bbd?q=80&w=800&auto=format&fit=crop"],
    rating: 4.6,
    features: ["5 Isı Kademesi", "Hızlı Isınma Modu", "Su Geçirmez Kumanda", "Akü Voltaj Koruması"],
    stock: 10,
    isNegotiable: false
  },
  {
    id: 11,
    name: "MotoRescue Lastik Tamir Seti",
    description: "Yolda kalmamanız için tasarlanmış, CO2 tüplü ve fitilli kompakt tubeless lastik tamir kiti.",
    price: 780,
    category: ProductCategory.ACCESSORY,
    // Tools
    image: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=800&auto=format&fit=crop"],
    rating: 4.8,
    features: ["Tubeless Uyumlu", "3x CO2 Tüpü", "Kompakt Çanta", "Profesyonel Aletler"],
    stock: 40,
    isNegotiable: false
  }
];