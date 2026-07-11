"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Compass, Sparkles, MapPin, Navigation, Award, ChevronRight, X } from 'lucide-react';
import GlobeWrapper from '../components/GlobeWrapper';
import AIAssistant from '../components/AIAssistant';
import Link from 'next/link';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState<any[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<any[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  // Fetch all places on start
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/places');
        setPlaces(res.data);
      } catch (err) {
        console.error("Error fetching places:", err);
      }
    };
    fetchPlaces();
  }, []);

  // Handle Search Filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPlaces([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = places.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.country.toLowerCase().includes(query) ||
        p.state.toLowerCase().includes(query)
    );
    setFilteredPlaces(filtered.slice(0, 8));
  }, [searchQuery, places]);

  // Categories
  const categories = [
    { name: 'All', icon: Compass },
    { name: 'Heritage', icon: MapPin },
    { name: 'Nature', icon: Navigation },
    { name: 'Spiritual', icon: Award },
    { name: 'Beach', icon: Compass },
    { name: 'Hill', icon: Navigation }
  ];

  const handleGlobePinSelect = (pin: any) => {
    // Find place details from fetched list
    const foundPlace = places.find(p => p.name.toLowerCase() === pin.name.toLowerCase());
    if (foundPlace) {
      setSelectedPlace(foundPlace);
    } else {
      // Create a mock view if not seeded
      setSelectedPlace({
        name: pin.name,
        country: pin.country,
        emoji: pin.emoji,
        desc: "An incredible global destination waiting to be explored.",
        bestSeason: "Oct - Apr",
        safetyRating: 4.8,
        soloRating: 4.7,
        coupleRating: 4.8,
        familyRating: 4.6,
        weather: "22°C Sunny",
        timezone: "Local Timezone"
      });
    }
  };

  const filteredCurated = activeCategory === 'All' 
    ? places.filter(p => p.state === 'Global').slice(0, 4)
    : places.filter(p => p.tags.map((t: string) => t.toLowerCase()).includes(activeCategory.toLowerCase())).slice(0, 4);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col justify-between">
      
      {/* 3D GLOBE BACKGROUND CONTAINER */}
      <div className="absolute inset-0 z-0 h-screen w-screen">
        <GlobeWrapper onPinSelect={handleGlobePinSelect} />
        {/* Subtle radial shading overlay */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/30 to-black pointer-events-none" />
      </div>

      {/* FOREGROUND SYSTEM INTERFACE */}
      <div className="relative z-10 w-full flex flex-col justify-between min-h-screen px-6 pt-24 pb-12 pointer-events-none">
        
        {/* Hero Headline & Interactive search panel */}
        <div className="max-w-xl self-start flex flex-col pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-mono text-xs tracking-[0.3em] text-royal-blue uppercase font-semibold mb-3 block">
              Global Platform v2.4 // AI Assisted
            </span>
            <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight text-white mb-4 leading-tight">
              Explore Every <br />
              <span className="text-gradient font-extrabold bg-gradient-to-r from-white via-royal-blue to-emerald-green">
                Corner of Earth
              </span>
            </h1>
            <p className="text-zinc-400 text-xs font-light tracking-wide leading-relaxed mb-6">
              AI Powered Travel Planning for every Village, Town, City, and Country. Pinpoint telemetry maps and custom itineraries in seconds.
            </p>
          </motion.div>

          {/* Smart Search Bar */}
          <div className="relative mb-6">
            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md focus-within:border-royal-blue/40 focus-within:ring-2 focus-within:ring-royal-blue/10 transition-all duration-300">
              <Search className="w-5 h-5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search country, state, city, or village..."
                className="flex-1 bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-zinc-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Suggestions Overlay */}
            <AnimatePresence>
              {filteredPlaces.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 right-0 mt-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 max-h-60 overflow-y-auto"
                >
                  {filteredPlaces.map((p) => (
                    <button
                      key={p._id}
                      onClick={() => {
                        setSelectedPlace(p);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 border-b border-white/5 hover:bg-white/5 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{p.emoji}</span>
                        <div>
                          <div className="text-xs text-white font-medium">{p.name}</div>
                          <div className="text-[10px] text-zinc-500">
                            {p.state ? `${p.state}, ` : ''}{p.country}
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono tracking-widest text-royal-blue uppercase border border-royal-blue/20 rounded px-1.5 py-0.5">
                        {p.badge || 'PLACE'}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Categories filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium tracking-wide uppercase border transition-all duration-300 ${
                    activeCategory === cat.name
                      ? 'bg-white text-black border-white'
                      : 'bg-white/5 text-zinc-400 border-white/5 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Curated featured destination cards (Bottom Row) */}
        <div className="w-full mt-auto flex flex-col md:flex-row gap-4 overflow-x-auto pb-4 pt-8 pointer-events-auto scrollbar-none">
          {filteredCurated.map((place) => (
            <motion.div
              key={place._id}
              whileHover={{ y: -6 }}
              className="flex-shrink-0 w-64 glass-panel hover-glow p-4 rounded-2xl cursor-pointer flex flex-col justify-between"
              onClick={() => setSelectedPlace(place)}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{place.emoji}</span>
                  <span className="text-[9px] font-mono text-emerald-green border border-emerald-green/20 rounded-full px-2 py-0.5 uppercase">
                    {place.badge || 'Featured'}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">{place.name}</h3>
                <p className="text-zinc-400 text-[11px] leading-relaxed line-clamp-2 mb-4 font-light">
                  {place.desc}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <div className="text-[10px] text-zinc-500">
                  Rating: <span className="text-white font-medium">{place.rating || 4.5}</span>
                </div>
                <span className="text-xs text-royal-blue flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                  Explore <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FLOATING DRAWERS / PLACE DETAILS PANEL */}
      <AnimatePresence>
        {selectedPlace && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed top-0 right-0 h-screen w-full md:w-[450px] bg-black/65 backdrop-blur-2xl border-l border-white/10 z-50 p-6 overflow-y-auto flex flex-col justify-between"
          >
            <div>
              {/* Close Button */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedPlace.emoji}</span>
                  <div>
                    <h2 className="text-xl font-semibold text-white">{selectedPlace.name}</h2>
                    <p className="text-xs text-zinc-400">{selectedPlace.state ? `${selectedPlace.state}, ` : ''}{selectedPlace.country}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="text-zinc-500 hover:text-white p-1 rounded-full hover:bg-white/5 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-[10px] font-mono text-royal-blue uppercase tracking-widest mb-2">Overview</h4>
                <p className="text-xs text-zinc-300 font-light leading-relaxed">
                  {selectedPlace.desc}
                </p>
              </div>

              {/* Stats / Ratings telemetry */}
              <div className="grid grid-cols-2 gap-3 mb-6 bg-white/5 p-4 rounded-xl border border-white/5">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Safety Rating</div>
                  <div className="text-sm font-semibold text-white font-mono">{selectedPlace.safetyRating || 4.7}/5.0</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Best Season</div>
                  <div className="text-sm font-semibold text-emerald-green font-mono">{selectedPlace.bestSeason || 'Oct - Apr'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Solo Traveller</div>
                  <div className="text-sm font-semibold text-white font-mono">{selectedPlace.soloRating || 4.5}/5.0</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Couple Rating</div>
                  <div className="text-sm font-semibold text-white font-mono">{selectedPlace.coupleRating || 4.8}/5.0</div>
                </div>
              </div>

              {/* History */}
              {selectedPlace.history && (
                <div className="mb-6">
                  <h4 className="text-[10px] font-mono text-royal-blue uppercase tracking-widest mb-2">History & Cultural roots</h4>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed italic">
                    {selectedPlace.history}
                  </p>
                </div>
              )}

              {/* Details List */}
              <div className="space-y-2 border-t border-white/5 pt-4">
                <div className="flex justify-between text-xs py-1">
                  <span className="text-zinc-500">Local Language</span>
                  <span className="text-white">{selectedPlace.lang || 'English'}</span>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span className="text-zinc-500">Currency</span>
                  <span className="text-white">{selectedPlace.currency || 'USD ($)'}</span>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span className="text-zinc-500">Time Zone</span>
                  <span className="text-white">{selectedPlace.timezone || 'UTC'}</span>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span className="text-zinc-500">Avg Weather</span>
                  <span className="text-white">{selectedPlace.weather || '22°C Sunny'}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Plan button */}
            <div className="mt-8 pt-4 border-t border-white/5 flex gap-3">
              <Link
                href={`/planner?dest=${selectedPlace.name}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-royal-blue to-emerald-green text-black font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-all text-center"
              >
                <Sparkles className="w-4 h-4" />
                AI Generate Plan
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING AI ASSISTANT SPEHERE */}
      <AIAssistant />

    </div>
  );
}
