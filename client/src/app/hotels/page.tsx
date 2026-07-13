"use client";

import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, MapPin, Coffee, Wifi, Car, Utensils, Heart, Sparkles, X, ChevronRight, Check, AlertCircle, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HotelItem {
  id: number;
  name: string;
  location: string;
  category: 'luxury' | 'budget' | 'hostel' | 'resort' | 'treehouse' | 'houseboat';
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  facilities: string[];
}

const mockHotels: HotelItem[] = [
  {
    id: 1,
    name: "Aman Tokyo Sanctuary",
    location: "Tokyo, Japan",
    category: "luxury",
    price: 950,
    rating: 4.9,
    reviewsCount: 124,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&auto=format&fit=crop",
    facilities: ["Pool", "WiFi", "Gym", "Restaurant", "Parking"]
  },
  {
    id: 2,
    name: "Ubud River Treehouse",
    location: "Ubud, Bali",
    category: "treehouse",
    price: 180,
    rating: 4.8,
    reviewsCount: 342,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop",
    facilities: ["WiFi", "Pool", "Restaurant"]
  },
  {
    id: 3,
    name: "Kerala Backwater Houseboat",
    location: "Alleppey, Kerala",
    category: "houseboat",
    price: 220,
    rating: 4.7,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600&auto=format&fit=crop",
    facilities: ["WiFi", "Restaurant", "Parking"]
  },
  {
    id: 4,
    name: "Baga Backpacker Hostel",
    location: "North Goa, India",
    category: "hostel",
    price: 25,
    rating: 4.5,
    reviewsCount: 512,
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=600&auto=format&fit=crop",
    facilities: ["WiFi", "Parking"]
  },
  {
    id: 5,
    name: "Taj Lake Palace Heritage",
    location: "Udaipur, Rajasthan",
    category: "luxury",
    price: 450,
    rating: 4.9,
    reviewsCount: 233,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop",
    facilities: ["Pool", "WiFi", "Gym", "Restaurant", "Parking"]
  },
  {
    id: 6,
    name: "Dharamshala Mountain Crest",
    location: "Dharamshala, Himachal",
    category: "budget",
    price: 45,
    rating: 4.6,
    reviewsCount: 104,
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=600&auto=format&fit=crop",
    facilities: ["WiFi", "Restaurant"]
  }
];

const famousHotelsList = [
  { name: "Burj Al Arab", location: "Dubai, UAE", emoji: "⛵" },
  { name: "Marina Bay Sands", location: "Singapore", emoji: "🏨" },
  { name: "The Ritz Paris", location: "Paris, France", emoji: "🇫🇷" },
  { name: "Taj Lake Palace", location: "Udaipur, India", emoji: "🏰" },
  { name: "The Plaza Hotel", location: "New York, USA", emoji: "🗽" },
  { name: "Bellagio Las Vegas", location: "Las Vegas, USA", emoji: "🎰" },
  { name: "Atlantis The Palm", location: "Dubai, UAE", emoji: "🌊" },
  { name: "Rambagh Palace", location: "Jaipur, India", emoji: "👑" },
  { name: "The Savoy", location: "London, UK", emoji: "🇬🇧" }
];

function HotelsContent() {
  const { user, token } = useAuth();
  const searchParams = useSearchParams();

  if (!user || !token) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center pt-24 px-6 relative">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-royal-blue/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-green/5 rounded-full blur-3xl -z-10" />
        <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-royal-blue mx-auto">
            <Shield className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Access Restrictions Active</h2>
          <p className="text-zinc-400 text-xs font-light leading-relaxed">
            Let's Travel World requires a secure registration/sign-in token to query live global travel metrics, neural itineraries, and GDS routing servers.
          </p>
          <a
            href="/auth"
            className="block w-full py-3 bg-gradient-to-r from-royal-blue to-emerald-green text-xs font-bold uppercase tracking-widest rounded-xl text-black hover:opacity-90 transition-all font-semibold"
          >
            Sign In / Register to Unlock
          </a>
        </div>
      </div>
    );
  }

  const [search, setSearch] = useState('');

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) {
      setSearch(decodeURIComponent(q).split(',')[0]);
    }
  }, [searchParams]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<number[]>([]);

  // AI stays dossier query
  const [aiHotelName, setAiHotelName] = useState('');
  const [aiDossier, setAiDossier] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiDossierModal, setShowAiDossierModal] = useState(false);
  const [telemetryMessage, setTelemetryMessage] = useState('');
  const [aiSearchFocused, setAiSearchFocused] = useState(false);

  const categories = [
    { id: 'all', name: 'All Stays' },
    { id: 'luxury', name: 'Luxury Hotels' },
    { id: 'budget', name: 'Budget' },
    { id: 'hostel', name: 'Hostels' },
    { id: 'treehouse', name: 'Tree Houses' },
    { id: 'houseboat', name: 'Houseboats' }
  ];

  const handleAiDossierQuery = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiHotelName.trim()) {
      alert("Please enter a hotel name.");
      return;
    }

    setAiLoading(true);
    setAiDossier('');
    setShowAiDossierModal(true);
    setAiSearchFocused(false);

    const statuses = [
      "ESTABLISHING SECURE STAYS LINK...",
      "RECONSTRUCTING REGIONAL SIGHTSEEING MATRIX...",
      "GENERATING PRICE TELEMETRY FORECASTS...",
      "COMPILING AMENITIES DOSSIER SHEET...",
      "GROQ COMPILE THREAD INITIATING...",
    ];

    let idx = 0;
    setTelemetryMessage(statuses[0]);
    const timer = setInterval(() => {
      idx = (idx + 1) % statuses.length;
      setTelemetryMessage(statuses[idx]);
    }, 2000);

    try {
      const res = await axios.post('http://localhost:5000/api/ai/hotel-details', {
        hotelName: aiHotelName
      });
      setAiDossier(res.data.dossier);
    } catch (err) {
      console.error(err);
      setAiDossier("### Connection Interrupted\n\nFailed to compile lodging dossier from the AI stays core. Please verify your connection.");
    } finally {
      clearInterval(timer);
      setAiLoading(false);
    }
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const filteredHotels = mockHotels.filter(hotel => {
    const matchesSearch = 
      hotel.name.toLowerCase().includes(search.toLowerCase()) ||
      hotel.location.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || hotel.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#030712] pt-24 pb-28 md:pb-16 px-6 font-sans text-zinc-100">
      
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <span className="font-mono text-xs tracking-[0.25em] text-royal-blue uppercase block mb-2">Immersive Stays Telemetry</span>
          <h1 className="text-3xl md:text-4xl font-sans font-bold text-white tracking-tight">Luxury & Local Accommodations</h1>
          <p className="text-zinc-500 text-xs mt-1.5 font-light">
            Search curated local hotels, or tap into the AI Global stays core to compile dossiers for any lodging option on Earth.
          </p>
        </div>

        {/* Local Search input */}
        <div className="relative w-full lg:max-w-xs">
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl w-full">
            <Search className="w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search curated hotel names..."
              className="bg-transparent text-xs text-white placeholder-zinc-600 focus:outline-none w-full"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-zinc-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <AnimatePresence>
            {search.trim().length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute left-0 right-0 mt-1.5 bg-[#090d16]/95 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 max-h-48 overflow-y-auto"
              >
                {mockHotels
                  .filter(h => 
                    h.name.toLowerCase().includes(search.toLowerCase()) ||
                    h.location.toLowerCase().includes(search.toLowerCase())
                  )
                  .slice(0, 5)
                  .map(h => (
                    <button
                      key={h.id}
                      onClick={() => {
                        setSearch(h.name);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 border-b border-white/5 hover:bg-white/5 text-left transition-colors text-xs text-zinc-300 animate-fade-in"
                    >
                      <div>
                        <div className="text-xs text-white font-medium">{h.name}</div>
                        <div className="text-[9px] text-zinc-500">{h.location}</div>
                      </div>
                      <span className="text-[8px] font-mono text-emerald-green border border-emerald-green/20 rounded px-1.5 py-0.5">
                        ${h.price}
                      </span>
                    </button>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* AI Unlimited Hotels Search Bar Panel */}
      <div className="max-w-7xl mx-auto mb-10 bg-gradient-to-r from-royal-blue/10 via-emerald-green/5 to-transparent border border-white/10 p-5 rounded-2xl backdrop-blur-md relative">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-emerald-green animate-pulse" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white">AI Global Lodging Search</h3>
        </div>
        <form onSubmit={handleAiDossierQuery} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={aiHotelName}
              onFocus={() => setAiSearchFocused(true)}
              onBlur={() => setTimeout(() => setAiSearchFocused(false), 200)}
              onChange={(e) => setAiHotelName(e.target.value)}
              placeholder="Enter ANY hotel in the world (e.g. Marina Bay Sands, Ritz Paris, Rambagh Palace)..."
              className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-royal-blue/50"
            />
            {aiHotelName && (
              <button
                type="button"
                onClick={() => setAiHotelName('')}
                className="absolute right-3 top-3 text-zinc-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <AnimatePresence>
              {aiSearchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-0 right-0 mt-1.5 bg-[#090d16]/95 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 max-h-56 overflow-y-auto"
                >
                  <div className="px-3 py-1.5 bg-white/5 text-[9px] text-zinc-500 uppercase tracking-widest border-b border-white/5">
                    Popular Global Selections
                  </div>
                  {famousHotelsList
                    .filter(h =>
                      !aiHotelName ||
                      h.name.toLowerCase().includes(aiHotelName.toLowerCase()) ||
                      h.location.toLowerCase().includes(aiHotelName.toLowerCase())
                    )
                    .slice(0, 6)
                    .map(h => (
                      <button
                        key={h.name}
                        type="button"
                        onClick={() => {
                          setAiHotelName(h.name);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2.5 border-b border-white/5 hover:bg-white/5 text-left transition-colors text-xs text-zinc-300"
                      >
                        <div className="flex items-center gap-2">
                          <span>{h.emoji}</span>
                          <div>
                            <div className="text-xs text-white font-medium">{h.name}</div>
                            <div className="text-[9px] text-zinc-500">{h.location}</div>
                          </div>
                        </div>
                        <span className="text-[8px] font-mono text-[#3b82f6] border border-royal-blue/20 rounded px-1.5 py-0.5">
                          DOSSIER
                        </span>
                      </button>
                    ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-royal-blue to-emerald-green text-black font-semibold text-xs uppercase tracking-wider rounded-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Query AI Dossier
          </button>
        </form>
      </div>

      {/* Category selector */}
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-white/5 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-wide uppercase border transition-all ${
              activeCategory === c.id
                ? 'bg-white text-black border-white shadow-md'
                : 'bg-white/5 text-zinc-400 border-white/5 hover:text-white hover:bg-white/10'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Hotel Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredHotels.map((hotel) => {
          const isFav = favorites.includes(hotel.id);
          return (
            <div 
              key={hotel.id} 
              className="glass-panel overflow-hidden rounded-2xl flex flex-col justify-between group"
            >
              {/* Hotel Image Panel */}
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={hotel.image} 
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Favorite Overlay */}
                <button
                  onClick={() => toggleFavorite(hotel.id)}
                  className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all ${
                    isFav 
                      ? 'bg-red-500 text-white' 
                      : 'bg-black/40 text-white hover:text-red-400'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                </button>

                {/* Category label */}
                <span className="absolute bottom-4 left-4 text-[9px] font-mono tracking-wider uppercase bg-black/60 px-2 py-0.5 rounded border border-white/10 text-white">
                  {hotel.category}
                </span>
              </div>

              {/* Card Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xs font-semibold text-white leading-snug">{hotel.name}</h3>
                    <div className="flex items-center text-yellow-500 text-[10px] gap-0.5">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="font-mono font-semibold">{hotel.rating}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-zinc-500 flex items-center justify-between mb-4">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-royal-blue" /> {hotel.location}
                    </span>
                    <a
                      href={`/map?destination=${encodeURIComponent(hotel.name + ', ' + hotel.location)}&origin=${encodeURIComponent('New Delhi, India')}&mode=driving`}
                      className="text-[9px] text-[#3b82f6] hover:text-[#10b981] font-mono uppercase font-semibold flex items-center gap-0.5 border border-royal-blue/15 px-2 py-0.5 rounded transition-all hover:bg-white/5 cursor-pointer pointer-events-auto"
                    >
                      HUD Route
                    </a>
                  </p>
                </div>

                {/* Facilities icons */}
                <div className="flex items-center gap-3 border-t border-white/5 pt-3 mb-4 text-zinc-400">
                  {hotel.facilities.includes("WiFi") && <span title="Free Highspeed Wifi"><Wifi className="w-3.5 h-3.5" /></span>}
                  {hotel.facilities.includes("Pool") && <span title="Complimentary Breakfast"><Coffee className="w-3.5 h-3.5" /></span>}
                  {hotel.facilities.includes("Parking") && <span title="Free Secure Parking"><Car className="w-3.5 h-3.5" /></span>}
                  {hotel.facilities.includes("Restaurant") && <span title="In-house Fine Dining"><Utensils className="w-3.5 h-3.5" /></span>}
                </div>

                {/* Pricing / Booking button */}
                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                  <div>
                    <span className="text-zinc-500 text-[9px] block uppercase tracking-wider">Price Index</span>
                    <span className="text-sm font-bold text-emerald-green font-mono">${hotel.price}</span>
                    <span className="text-[10px] text-zinc-500"> / night</span>
                  </div>
                  <button 
                    onClick={async () => {
                      setAiHotelName(hotel.name);
                      setAiLoading(true);
                      setAiDossier('');
                      setShowAiDossierModal(true);
                      try {
                        const res = await axios.post('http://localhost:5000/api/ai/hotel-details', { hotelName: hotel.name });
                        setAiDossier(res.data.dossier);
                      } catch (err) {
                        setAiDossier("Failed to query stays dossier.");
                      } finally {
                        setAiLoading(false);
                      }
                    }}
                    className="px-4 py-2 bg-white/5 hover:bg-white border border-white/10 hover:text-black rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-all"
                  >
                    View Dossier
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI HOTEL DOSSIER OVERLAY MODAL */}
      {showAiDossierModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#090d16] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col justify-between shadow-2xl">
            
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-royal-blue/20 to-emerald-green/20 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-emerald-green animate-pulse" />
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-white">Stays Intelligence Dossier</h2>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">TARGET // {aiHotelName}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAiDossierModal(false);
                  setAiDossier('');
                }}
                className="text-zinc-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable content pane */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-12 h-12 border-4 border-royal-blue/30 border-t-emerald-green rounded-full animate-spin mb-4"></div>
                  <p className="font-mono text-xs text-[#3b82f6] tracking-widest uppercase animate-pulse">{telemetryMessage}</p>
                </div>
              ) : (
                <div className="prose prose-invert prose-xs max-w-none text-zinc-300 whitespace-pre-line font-light leading-relaxed">
                  {aiDossier}
                </div>
              )}
            </div>

            {/* Footer options */}
            <div className="p-4 border-t border-white/5 bg-black/30 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAiDossierModal(false);
                  setAiDossier('');
                }}
                className="px-5 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-all text-zinc-300"
              >
                Close Dossier
              </button>
              <a
                href={`/map?destination=${encodeURIComponent(aiHotelName)}&origin=${encodeURIComponent('New Delhi, India')}&mode=driving`}
                className="px-5 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-all flex items-center justify-center cursor-pointer pointer-events-auto"
              >
                Plot Route
              </a>
              <button
                onClick={() => alert("Connecting secure reservation line to partner APIs...")}
                className="px-5 py-2 bg-gradient-to-r from-royal-blue to-emerald-green text-black font-semibold text-[10px] uppercase tracking-wider rounded-xl hover:opacity-90 transition-all"
              >
                Book This Stay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HotelsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030712] pt-24 pb-16 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/10 border-t-royal-blue rounded-full animate-spin"></div>
      </div>
    }>
      <HotelsContent />
    </Suspense>
  );
}
