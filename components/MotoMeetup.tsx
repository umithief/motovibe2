
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Clock, Users, Navigation, Plus, Filter, Coffee, Moon, Flag, Mountain, Check, X, ChevronDown, ChevronUp, MessageSquare, Send, User as UserIcon } from 'lucide-react';
import { MeetupEvent, User, ViewState, MeetupMessage } from '../types';
import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';
import { UserAvatar } from './UserAvatar';

declare const L: any;

interface MotoMeetupProps {
  user: User | null;
  onOpenAuth: () => void;
  onNavigate: (view: ViewState) => void;
}

const MOCK_EVENTS: MeetupEvent[] = [
    {
        id: 'evt-1',
        title: 'Cuma Gecesi Sürüşü',
        type: 'night-ride',
        date: '15 Mayıs 2024',
        time: '22:00',
        location: 'Bağdat Caddesi, İstanbul',
        coordinates: { lat: 40.9600, lng: 29.0700 },
        organizer: 'MotoVibe Community',
        attendees: 45,
        attendeeList: [
            { id: 'u1', name: 'Ahmet Yılmaz' },
            { id: 'u2', name: 'Zeynep Kaya' },
            { id: 'u3', name: 'Mehmet Demir' },
            { id: 'u4', name: 'Ayşe Çelik' },
            { id: 'u5', name: 'Canberk Hız' }
        ],
        messages: [
            { id: 'm1', userId: 'u1', userName: 'Ahmet Yılmaz', text: 'Hava durumu nasıl olacak?', time: '20:30' },
            { id: 'm2', userId: 'u2', userName: 'Zeynep Kaya', text: 'Parçalı bulutlu, yağmur yok görünüyor.', time: '20:35' },
            { id: 'm3', userId: 'organizer', userName: 'MotoVibe Community', text: 'Rota Caddebostan\'dan başlayıp sahil yolundan devam edecek arkadaşlar.', time: '21:00' }
        ],
        image: 'https://images.unsplash.com/photo-1615172282427-9a5752d6486d?q=80&w=800&auto=format&fit=crop',
        description: 'Haftanın stresini atmak için gece sürüşü. Caddebostan Sahil\'de bitiş ve çay/kahve keyfi.'
    },
    {
        id: 'evt-2',
        title: 'Pazar Kahve Buluşması',
        type: 'coffee',
        date: '17 Mayıs 2024',
        time: '10:00',
        location: 'Kordon, İzmir',
        coordinates: { lat: 38.4237, lng: 27.1428 },
        organizer: 'Ege Riders',
        attendees: 28,
        attendeeList: [
            { id: 'u6', name: 'Burak Serdar' },
            { id: 'u7', name: 'Elif Nur' },
            { id: 'u8', name: 'Ozan Güven' }
        ],
        messages: [
            { id: 'm1', userId: 'u6', userName: 'Burak Serdar', text: 'Konum tam olarak neresi?', time: '09:00' },
            { id: 'm2', userId: 'organizer', userName: 'Ege Riders', text: 'Gündoğdu meydanına yakın, Starbucks önü.', time: '09:15' }
        ],
        image: 'https://images.unsplash.com/photo-1524350876685-274059332603?q=80&w=800&auto=format&fit=crop',
        description: 'Klasik pazar kahvaltısı ve motor sohbeti. Tüm marka ve modeller davetlidir.'
    },
    {
        id: 'evt-3',
        title: 'Kemerburgaz Offroad',
        type: 'offroad',
        date: '20 Mayıs 2024',
        time: '09:00',
        location: 'Kemerburgaz Ormanı',
        coordinates: { lat: 41.1600, lng: 28.9000 },
        organizer: 'Enduro Pro',
        attendees: 12,
        attendeeList: [
            { id: 'u9', name: 'Cem Dağlı' },
            { id: 'u10', name: 'Sinan Toprak' }
        ],
        messages: [],
        image: 'https://images.unsplash.com/photo-1532347922424-9654d01a7378?q=80&w=800&auto=format&fit=crop',
        description: 'Çamur, toz ve adrenalin. Adventure ve Cross motorlar için orta zorlukta parkur.'
    }
];

export const MotoMeetup: React.FC<MotoMeetupProps> = ({ user, onOpenAuth, onNavigate }) => {
    const [events, setEvents] = useState<MeetupEvent[]>(MOCK_EVENTS);
    const [selectedEvent, setSelectedEvent] = useState<MeetupEvent | null>(null);
    const [filter, setFilter] = useState<string>('all');
    const [userJoined, setUserJoined] = useState<string[]>([]);
    
    // UI states
    const [isCardOpen, setIsCardOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'attendees' | 'chat'>('attendees');
    const [chatInput, setChatInput] = useState('');
    
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Reset state only when event selection changes (by ID), not when event data updates (like messages)
        setIsCardOpen(false);
        setActiveTab('attendees');
        setChatInput('');
    }, [selectedEvent?.id]);

    // Scroll to bottom of chat when messages change or tab opens
    useEffect(() => {
        if (isCardOpen && activeTab === 'chat') {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedEvent?.messages, isCardOpen, activeTab]);

    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current && typeof L !== 'undefined') {
            const map = L.map(mapContainerRef.current, {
                zoomControl: false,
                attributionControl: false
            }).setView([39.9, 32.8], 6);

            // Satellite/Dark Hybrid Map Style
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri'
            }).addTo(map);
            
            // Dark overlay for style
            const overlay = L.rectangle(
                [[ -90, -180 ], [ 90, 180 ]],
                { color: '#000', fillOpacity: 0.4, stroke: false, weight: 0 }
            ).addTo(map);

            mapRef.current = map;

            setTimeout(() => {
                map.invalidateSize();
            }, 300);
        }
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;

        // Clear Markers
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];

        const filteredEvents = filter === 'all' ? events : events.filter(e => e.type === filter);

        filteredEvents.forEach(event => {
            let color = '#ff1f1f'; // Default moto-accent
            if (event.type === 'coffee') color = '#f59e0b'; // Amber
            if (event.type === 'offroad') color = '#84cc16'; // Lime
            if (event.type === 'track-day') color = '#3b82f6'; // Blue

            const iconHtml = `
                <div class="relative flex items-center justify-center w-8 h-8 group cursor-pointer">
                    <div class="absolute w-full h-full rounded-full animate-ping opacity-75" style="background-color: ${color}"></div>
                    <div class="relative w-4 h-4 rounded-full border-2 border-white shadow-lg transform group-hover:scale-125 transition-transform duration-300" style="background-color: ${color}"></div>
                </div>
            `;

            const icon = L.divIcon({
                className: 'custom-meetup-marker',
                html: iconHtml,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
            });

            const marker = L.marker([event.coordinates.lat, event.coordinates.lng], { icon })
                .addTo(mapRef.current)
                .on('click', () => {
                    setSelectedEvent(event);
                    mapRef.current.flyTo([event.coordinates.lat, event.coordinates.lng], 14, { duration: 1.5 });
                });
            
            markersRef.current.push(marker);
        });

    }, [events, filter]);

    const handleJoin = (e: React.MouseEvent, eventId: string) => {
        e.stopPropagation();
        if (!user) {
            onOpenAuth();
            return;
        }
        
        const isJoined = userJoined.includes(eventId);

        if (isJoined) {
            // Leave
            setUserJoined(prev => prev.filter(id => id !== eventId));
            setEvents(prev => prev.map(ev => {
                if (ev.id === eventId) {
                    return {
                        ...ev,
                        attendees: ev.attendees - 1,
                        attendeeList: ev.attendeeList?.filter(u => u.id !== user.id)
                    };
                }
                return ev;
            }));
            // Update selected event reference
            if (selectedEvent?.id === eventId) {
                setSelectedEvent(prev => prev ? ({
                    ...prev,
                    attendees: prev.attendees - 1,
                    attendeeList: prev.attendeeList?.filter(u => u.id !== user.id)
                }) : null);
            }
        } else {
            // Join
            setUserJoined(prev => [...prev, eventId]);
            const newUser = { id: user.id, name: user.name };
            
            setEvents(prev => prev.map(ev => {
                if (ev.id === eventId) {
                    return {
                        ...ev,
                        attendees: ev.attendees + 1,
                        attendeeList: ev.attendeeList ? [...ev.attendeeList, newUser] : [newUser]
                    };
                }
                return ev;
            }));
            // Update selected event reference
            if (selectedEvent?.id === eventId) {
                setSelectedEvent(prev => prev ? ({
                    ...prev,
                    attendees: prev.attendees + 1,
                    attendeeList: prev.attendeeList ? [...prev.attendeeList, newUser] : [newUser]
                }) : null);
            }
        }
    };

    const handleSendMessage = () => {
        if (!chatInput.trim() || !selectedEvent || !user) return;

        const newMessage: MeetupMessage = {
            id: `msg-${Date.now()}`,
            userId: user.id,
            userName: user.name,
            text: chatInput.trim(),
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        };

        const updatedEvent = {
            ...selectedEvent,
            messages: selectedEvent.messages ? [...selectedEvent.messages, newMessage] : [newMessage]
        };

        // Update local state and events array
        setSelectedEvent(updatedEvent);
        setEvents(prev => prev.map(ev => ev.id === selectedEvent.id ? updatedEvent : ev));
        setChatInput('');
    };

    return (
        <div className="h-[100dvh] w-full flex flex-col bg-[#050505] relative overflow-hidden">
            
            {/* Close Button */}
            <button 
                onClick={() => onNavigate('home')} 
                className="absolute top-8 right-6 z-50 w-10 h-10 bg-black/60 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors border border-white/10"
            >
                <X className="w-5 h-5" />
            </button>

            {/* Map Layer */}
            <div className="absolute inset-0 z-0">
                <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '100%' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30 pointer-events-none"></div>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 flex-1 flex flex-col pointer-events-none pt-8">
                
                {/* Header */}
                <div className="px-4 md:px-8 pointer-events-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-moto-accent mb-1 font-bold tracking-widest text-xs uppercase shadow-black drop-shadow-md">
                                <Users className="w-4 h-4" />
                                <span>Community Events</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight drop-shadow-lg">MOTO<span className="text-moto-accent">MEETUP</span></h1>
                        </div>
                        
                        <div className="flex gap-2 overflow-x-auto no-scrollbar">
                            {[
                                { id: 'all', label: 'Tümü', icon: Filter },
                                { id: 'night-ride', label: 'Gece Sürüşü', icon: Moon },
                                { id: 'coffee', label: 'Kahve', icon: Coffee },
                                { id: 'track-day', label: 'Pist', icon: Flag },
                                { id: 'offroad', label: 'Offroad', icon: Mountain },
                            ].map(cat => (
                                <button 
                                    key={cat.id}
                                    onClick={() => setFilter(cat.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap border ${
                                        filter === cat.id 
                                        ? 'bg-moto-accent border-moto-accent text-white shadow-lg' 
                                        : 'bg-black/60 border-white/10 text-gray-400 hover:text-white hover:border-white/30 backdrop-blur-md'
                                    }`}
                                >
                                    <cat.icon className="w-3 h-3" /> {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Event Detail Modal / Drawer */}
                <AnimatePresence>
                    {selectedEvent && (
                        <motion.div 
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="absolute bottom-0 left-0 right-0 md:left-auto md:right-8 md:bottom-8 md:w-96 bg-[#0f0f0f]/95 backdrop-blur-xl border-t md:border border-white/10 md:rounded-3xl shadow-2xl pointer-events-auto max-h-[85vh] overflow-y-auto z-50 flex flex-col"
                        >
                            <div className="h-48 relative flex-shrink-0">
                                <img src={selectedEvent.image} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent"></div>
                                <button 
                                    onClick={() => setSelectedEvent(null)}
                                    className="absolute top-4 right-4 bg-black/50 hover:bg-black p-2 rounded-full text-white transition-colors border border-white/10"
                                >
                                    <Filter className="w-4 h-4 rotate-45" />
                                </button>
                                <div className="absolute bottom-4 left-6">
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-moto-accent text-white shadow-lg`}>
                                        {selectedEvent.type}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-6 pt-2 overflow-y-auto">
                                <h2 className="text-2xl font-display font-bold text-white mb-2">{selectedEvent.title}</h2>
                                <div className="flex flex-col gap-3 mb-6">
                                    <div className="flex items-center gap-3 text-gray-400 text-sm">
                                        <Calendar className="w-4 h-4 text-moto-accent" /> {selectedEvent.date}
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-400 text-sm">
                                        <Clock className="w-4 h-4 text-moto-accent" /> {selectedEvent.time}
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-400 text-sm">
                                        <MapPin className="w-4 h-4 text-moto-accent" /> {selectedEvent.location}
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-400 text-sm">
                                        <Users className="w-4 h-4 text-moto-accent" /> {selectedEvent.attendees} Katılımcı
                                    </div>
                                </div>
                                
                                <p className="text-gray-400 text-sm leading-relaxed mb-6 border-l-2 border-white/10 pl-4">
                                    {selectedEvent.description}
                                </p>

                                {/* Community Hub: Attendees & Chat */}
                                <div className="mb-6 border border-white/10 rounded-xl overflow-hidden bg-white/5">
                                    <button 
                                        onClick={() => setIsCardOpen(!isCardOpen)}
                                        className="w-full flex items-center justify-between p-4 text-sm font-bold text-white hover:bg-white/5 transition-colors"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-moto-accent" />
                                            Topluluk & Sohbet
                                        </span>
                                        {isCardOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </button>
                                    
                                    <AnimatePresence>
                                        {isCardOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                {/* Tab Switcher */}
                                                <div className="flex border-b border-white/10">
                                                    <button 
                                                        onClick={() => setActiveTab('attendees')}
                                                        className={`flex-1 py-3 text-xs font-bold transition-colors ${activeTab === 'attendees' ? 'bg-moto-accent/10 text-moto-accent border-b-2 border-moto-accent' : 'text-gray-400 hover:text-white'}`}
                                                    >
                                                        Katılımcılar ({selectedEvent.attendeeList?.length || 0})
                                                    </button>
                                                    <button 
                                                        onClick={() => setActiveTab('chat')}
                                                        className={`flex-1 py-3 text-xs font-bold transition-colors ${activeTab === 'chat' ? 'bg-moto-accent/10 text-moto-accent border-b-2 border-moto-accent' : 'text-gray-400 hover:text-white'}`}
                                                    >
                                                        Sohbet
                                                    </button>
                                                </div>

                                                <div className="p-4 bg-black/20 h-[250px] flex flex-col">
                                                    {activeTab === 'attendees' ? (
                                                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                                                            {selectedEvent.attendeeList && selectedEvent.attendeeList.length > 0 ? (
                                                                selectedEvent.attendeeList.map((attendee, idx) => (
                                                                    <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                                                        <UserAvatar name={attendee.name} size={32} />
                                                                        <span className="text-sm text-gray-300 font-medium">{attendee.name}</span>
                                                                        {user && user.id === attendee.id && (
                                                                            <span className="text-[10px] bg-green-500/20 text-green-500 px-2 py-0.5 rounded ml-auto">Sen</span>
                                                                        )}
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p className="text-xs text-gray-500 text-center py-4">Henüz kimse katılmadı.</p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        // CHAT VIEW
                                                        <div className="flex flex-col h-full">
                                                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 mb-3">
                                                                {selectedEvent.messages && selectedEvent.messages.length > 0 ? (
                                                                    selectedEvent.messages.map((msg, idx) => {
                                                                        const isMe = user && msg.userId === user.id;
                                                                        return (
                                                                            <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                                                <div className={`max-w-[85%] p-2 rounded-lg text-xs ${isMe ? 'bg-moto-accent text-white rounded-br-none' : 'bg-white/10 text-gray-300 rounded-bl-none'}`}>
                                                                                    <div className="font-bold mb-0.5 text-[10px] opacity-75">{msg.userName}</div>
                                                                                    {msg.text}
                                                                                </div>
                                                                                <span className="text-[9px] text-gray-600 mt-1">{msg.time}</span>
                                                                            </div>
                                                                        )
                                                                    })
                                                                ) : (
                                                                    <p className="text-xs text-gray-500 text-center py-4">Sohbet henüz başlamadı.</p>
                                                                )}
                                                                <div ref={chatEndRef} />
                                                            </div>
                                                            
                                                            <div className="flex gap-2">
                                                                {user ? (
                                                                    <>
                                                                        <input 
                                                                            type="text" 
                                                                            value={chatInput}
                                                                            onChange={(e) => setChatInput(e.target.value)}
                                                                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                                                            placeholder="Mesaj yaz..."
                                                                            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-moto-accent outline-none"
                                                                        />
                                                                        <button 
                                                                            onClick={handleSendMessage}
                                                                            className="bg-moto-accent text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                                                                        >
                                                                            <Send className="w-4 h-4" />
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <button onClick={onOpenAuth} className="w-full py-2 bg-white/5 border border-white/10 text-gray-400 text-xs rounded-lg hover:bg-white/10 hover:text-white transition-colors">
                                                                        Sohbete katılmak için giriş yap
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="flex gap-3 mt-auto">
                                    <Button 
                                        variant="primary" 
                                        className={`flex-1 ${userJoined.includes(selectedEvent.id) ? 'bg-green-600 hover:bg-green-700' : ''}`}
                                        onClick={(e) => handleJoin(e, selectedEvent.id)}
                                    >
                                        {userJoined.includes(selectedEvent.id) ? (
                                            <><Check className="w-4 h-4 mr-2" /> KATILDIN</>
                                        ) : (
                                            <><Plus className="w-4 h-4 mr-2" /> KATIL</>
                                        )}
                                    </Button>
                                    <button className="px-4 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors border border-white/10">
                                        <Navigation className="w-5 h-5 text-white" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Quick Event List */}
                {!selectedEvent && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 pointer-events-auto">
                        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
                            {events.filter(e => filter === 'all' || e.type === filter).map(event => (
                                <div 
                                    key={event.id}
                                    onClick={() => { setSelectedEvent(event); mapRef.current?.flyTo([event.coordinates.lat, event.coordinates.lng], 14); }}
                                    className="min-w-[280px] bg-[#0f0f0f]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex gap-4 hover:border-moto-accent/50 transition-all cursor-pointer group"
                                >
                                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                        <img src={event.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <div className="text-[10px] text-moto-accent font-bold uppercase mb-1">{event.date}</div>
                                        <h3 className="font-bold text-white leading-tight mb-1 line-clamp-1">{event.title}</h3>
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <MapPin className="w-3 h-3" /> <span className="truncate max-w-[120px]">{event.location}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
