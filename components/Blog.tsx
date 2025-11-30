
import React, { useState, useEffect } from 'react';
import { BlogPost, ViewState } from '../types';
import { blogService } from '../services/blogService';
import { Heart, MessageSquare, Clock, ExternalLink, Compass, Wrench, Zap, BookOpen, Search } from 'lucide-react';
import { Button } from './Button';
import { UserAvatar } from './UserAvatar';

interface BlogProps {
  onNavigate: (view: ViewState) => void;
}

export const Blog: React.FC<BlogProps> = ({ onNavigate }) => {
    const [articles, setArticles] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');

    const categories = [
        { id: 'all', label: 'Tümü', icon: BookOpen },
        { id: 'inceleme', label: 'İnceleme', icon: Zap },
        { id: 'teknik', label: 'Teknik & Bakım', icon: Wrench },
        { id: 'gezi', label: 'Gezi Rotaları', icon: Compass },
        { id: 'yasam', label: 'Moto Yaşam', icon: Heart }
    ];

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            const data = await blogService.getPosts(activeCategory);
            setArticles(data);
            setLoading(false);
        };
        fetchArticles();
    }, [activeCategory]);

    return (
        <div className="pt-24 pb-20 max-w-7xl mx-auto px-6 min-h-screen">
            <div className="text-center mb-12 relative z-10">
                <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-4 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">MOTO<span className="text-[#F2A619]">BLOG</span></h1>
                <p className="text-gray-200 text-lg drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] font-medium">İncelemeler, teknik rehberler ve ilham veren yol hikayeleri.</p>
            </div>

            <div className="flex justify-center gap-3 mb-12 flex-wrap">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                            activeCategory === cat.id 
                            ? 'bg-[#F2A619] text-[#1A1A17] border-[#F2A619]' 
                            : 'bg-[#1A1A17] text-gray-400 border-white/10 hover:border-[#F2A619]/50 hover:text-white'
                        }`}
                    >
                        <cat.icon className="w-4 h-4" />
                        {cat.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1,2,3].map(i => <div key={i} className="bg-[#242421] h-[400px] rounded-3xl animate-pulse"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <div key={article.id} className="group bg-[#242421] border border-white/5 rounded-3xl overflow-hidden hover:border-[#F2A619]/30 transition-all hover:-translate-y-1">
                            <div className="relative h-56 overflow-hidden">
                                <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#242421] to-transparent"></div>
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded text-[#F2A619] text-[10px] font-bold uppercase border border-[#F2A619]/20">{article.category}</div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-[#F2A619] transition-colors">{article.title}</h3>
                                <p className="text-sm text-gray-400 line-clamp-3 mb-6">{article.excerpt}</p>
                                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <UserAvatar name={article.author.name} size={32} />
                                        <div><span className="block text-[10px] font-bold text-white uppercase">{article.author.name}</span><span className="text-[9px] text-gray-500">{article.date}</span></div>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-400"><Clock className="w-3 h-3 text-[#F2A619]"/> {article.readTime}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
