"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, Check, MapPin, Eye, Star, Info, MessageSquare, AlertCircle, Award, X, Navigation, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

function parseMarkdownToJSX(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentTableRows: string[][] = [];
  let inTable = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('|')) {
      inTable = true;
      const cells = line.split('|').map(c => c.trim()).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
      if (cells.every(c => c.startsWith('-') || c.startsWith(':'))) {
        continue;
      }
      currentTableRows.push(cells);
      continue;
    } else {
      if (inTable) {
        if (currentTableRows.length > 0) {
          const header = currentTableRows[0];
          const body = currentTableRows.slice(1);
          elements.push(
            <div key={`table-${i}`} className="overflow-x-auto my-4 border border-white/10 rounded-xl bg-black/40">
              <table className="min-w-full text-[10px] font-sans text-left text-zinc-300">
                <thead className="bg-white/5 text-[9px] text-white uppercase tracking-wider font-mono border-b border-white/10">
                  <tr>
                    {header.map((cell, idx) => (
                      <th key={idx} className="px-4 py-2.5 font-semibold">{cell}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {body.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-white/5 transition-colors">
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="px-4 py-2 font-light">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        currentTableRows = [];
        inTable = false;
      }
    }

    if (line === '') {
      elements.push(<div key={`space-${i}`} className="h-1.5" />);
      continue;
    }

    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-white font-bold text-xs mt-5 mb-2.5 border-b border-white/10 pb-1 font-mono uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-green" />
          {line.replace('### ', '')}
        </h3>
      );
      continue;
    }

    if (line.startsWith('#### ')) {
      elements.push(<h4 key={i} className="text-emerald-green font-semibold text-[10px] mt-4 mb-2 uppercase font-mono tracking-wider">{line.replace('#### ', '')}</h4>);
      continue;
    }

    if (line.startsWith('* ') || line.startsWith('- ')) {
      const cleaned = line.replace(/^\* /, '').replace(/^- /, '');
      const parts = cleaned.split(':');
      if (parts.length > 1) {
        elements.push(
          <p key={i} className="pl-4 leading-relaxed text-[11px]">
            <strong className="text-white font-mono">{parts[0]}:</strong>{parts.slice(1).join(':')}
          </p>
        );
      } else {
        elements.push(<p key={i} className="pl-4 leading-relaxed text-[11px] font-light text-zinc-300">{cleaned}</p>);
      }
      continue;
    }

    elements.push(<p key={i} className="leading-relaxed font-light text-[11px] text-zinc-300">{line}</p>);
  }

  if (inTable && currentTableRows.length > 0) {
    const header = currentTableRows[0];
    const body = currentTableRows.slice(1);
    elements.push(
      <div key="table-end" className="overflow-x-auto my-4 border border-white/10 rounded-xl bg-black/40">
        <table className="min-w-full text-[10px] font-sans text-left text-zinc-300">
          <thead className="bg-white/5 text-[9px] text-white uppercase tracking-wider font-mono border-b border-white/10">
            <tr>
              {header.map((cell, idx) => (
                <th key={idx} className="px-4 py-2.5 font-semibold">{cell}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {body.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-white/5 transition-colors">
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} className="px-4 py-2 font-light">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return elements;
}

export default function ExplorePage() {
  const { user, token, toggleFavorite, toggleVisited } = useAuth();

  const [places, setPlaces] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'All' | 'Global' | 'India'>('All');
  const [activeStateTab, setActiveStateTab] = useState('All');
  const [detailTab, setDetailTab] = useState<string>('overview');
  const [superIntel, setSuperIntel] = useState<string>('');
  const [superIntelLoading, setSuperIntelLoading] = useState(false);

  // Reviews input state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Dynamic photos states
  const [placePhotos, setPlacePhotos] = useState<string[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);

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

  useEffect(() => {
    if (!selectedPlace) {
      setPlacePhotos([]);
      return;
    }

    const fetchPhotos = async () => {
      setPhotosLoading(true);
      try {
        const cityName = selectedPlace.name.split(',')[0];
        const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(cityName)}&prop=pageimages&format=json&pithumbsize=1000&origin=*`;
        const res = await axios.get(wikiUrl);
        const pages = res.data?.query?.pages;
        const urls: string[] = [];

        if (pages) {
          const pageId = Object.keys(pages)[0];
          if (pageId && pages[pageId].thumbnail?.source) {
            urls.push(pages[pageId].thumbnail.source);
          }
        }

        urls.push(`https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80`);
        urls.push(`https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80`);
        urls.push(`https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80`);

        setPlacePhotos(urls);
      } catch (err) {
        console.error("Failed to query Wikipedia photos:", err);
        setPlacePhotos([
          `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80`,
          `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80`,
          `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80`
        ]);
      } finally {
        setPhotosLoading(false);
      }
    };

    fetchPhotos();
  }, [selectedPlace]);

  // Fetch Super Intel dossier segments
  useEffect(() => {
    if (!selectedPlace) {
      setSuperIntel('');
      return;
    }

    const aiSegments = ['ai-intel', 'transport', 'food-shop', 'itinerary'];
    if (!aiSegments.includes(detailTab)) return;

    let segmentKey = "";
    if (detailTab === 'ai-intel') segmentKey = 'safety-accessibility';
    else if (detailTab === 'transport') segmentKey = 'transport';
    else if (detailTab === 'food-shop') segmentKey = 'food-shopping';
    else if (detailTab === 'itinerary') segmentKey = 'itinerary-timeline';

    const fetchSuperIntel = async () => {
      setSuperIntelLoading(true);
      setSuperIntel('');
      try {
        const res = await axios.post('http://localhost:5000/api/ai/super-intel', {
          destination: selectedPlace.name,
          segment: segmentKey
        });
        setSuperIntel(res.data.intel);
      } catch (err) {
        console.error(err);
        setSuperIntel(`### AI Intelligence Engine Offline\n\nFailed to sync live telemetry data for **${selectedPlace.name}**. Please ensure the backend server is running.`);
      } finally {
        setSuperIntelLoading(false);
      }
    };

    fetchSuperIntel();
  }, [detailTab, selectedPlace]);

  // Fetch places
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

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#10b981', '#ffffff']
    });
  };

  const handleFavoriteClick = async (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    if (!token) {
      alert("Please sign in to add favorites!");
      return;
    }
    try {
      await toggleFavorite(name);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVisitedClick = async (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    if (!token) {
      alert("Please sign in to record visited locations!");
      return;
    }
    try {
      const oldBadgesCount = user?.badges?.length || 0;
      await toggleVisited(name);
      
      // If a new badge was awarded, blast confetti!
      setTimeout(() => {
        // Trigger check
        triggerConfetti();
      }, 500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!token) {
      setReviewError("Authentication required to leave reviews.");
      return;
    }

    if (!reviewComment.trim()) {
      setReviewError("Please type a comment.");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/places/${selectedPlace._id}/reviews`,
        { comment: reviewComment, rating: reviewRating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update place in local state and inside selectedPlace
      const updatedPlace = res.data;
      setSelectedPlace(updatedPlace);
      setPlaces(prev => prev.map(p => p._id === updatedPlace._id ? updatedPlace : p));
      setReviewComment('');
      setReviewSuccess("Review submitted successfully!");
    } catch (err: any) {
      setReviewError(err.response?.data?.error || "Failed to submit review");
    }
  };

  // State filtering logic
  const statesList = ['All', 'Rajasthan', 'Kerala', 'Himachal Pradesh', 'Goa', 'Uttar Pradesh'];

  const filteredPlaces = places.filter(p => {
    // 1. Search Query
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.state.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. Main Tab (All vs Global vs India)
    let matchesTab = true;
    if (activeTab === 'Global') {
      matchesTab = p.state === 'Global';
    } else if (activeTab === 'India') {
      matchesTab = p.country.toLowerCase() === 'india';
    }

    // 3. Indian State Tab
    let matchesState = true;
    if (activeTab === 'India' && activeStateTab !== 'All') {
      matchesState = p.state.toLowerCase() === activeStateTab.toLowerCase();
    }

    return matchesSearch && matchesTab && matchesState;
  });

  return (
    <div className="min-h-screen bg-[#030712] pt-24 pb-28 md:pb-16 px-6 font-sans text-zinc-100">
      
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <span className="font-mono text-xs tracking-[0.25em] text-royal-blue uppercase block mb-2">Platform directory</span>
        <h1 className="text-3xl md:text-4xl font-sans font-bold text-white tracking-tight">
          Explore Every <span className="text-gradient bg-gradient-to-r from-white to-royal-blue">Corner of Earth</span>
        </h1>
        <p className="text-zinc-500 text-xs mt-1.5 font-light">
          Search, filter, and track countries, states, cities, and heritage villages. Stamp places you have visited to unlock travel levels and badges.
        </p>
      </div>

      {/* Main Filter Toolbar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center mb-8 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
        
        {/* Destination tabs */}
        <div className="flex items-center gap-1.5 bg-black/30 p-1 border border-white/5 rounded-xl w-full md:w-auto">
          {(['All', 'Global', 'India'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setActiveStateTab('All');
              }}
              className={`flex-1 md:flex-initial px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-royal-blue to-emerald-green text-white shadow-md' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input bar */}
        <div className="relative w-full md:max-w-sm">
          <div className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/10 rounded-xl w-full">
            <Search className="w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter destination name..."
              className="bg-transparent text-xs text-white placeholder-zinc-500 w-full focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-zinc-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <AnimatePresence>
            {searchQuery.trim().length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute left-0 right-0 mt-1.5 bg-[#090d16]/95 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 max-h-60 overflow-y-auto"
              >
                {places
                  .filter(p =>
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.state.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .slice(0, 6)
                  .map(p => (
                    <button
                      key={p._id}
                      onClick={() => {
                        setSelectedPlace(p);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 border-b border-white/5 hover:bg-white/5 text-left transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{p.emoji}</span>
                        <div>
                          <div className="text-xs text-white font-medium">{p.name}</div>
                          <div className="text-[9px] text-zinc-500">
                            {p.state ? `${p.state}, ` : ''}{p.country}
                          </div>
                        </div>
                      </div>
                      <span className="text-[8px] font-mono tracking-widest text-[#3b82f6] uppercase border border-royal-blue/20 rounded px-1.5 py-0.5">
                        {p.tags?.[0] || 'PLACE'}
                      </span>
                    </button>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* India-Specific State Sub-navigation */}
      {activeTab === 'India' && (
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {statesList.map(st => (
            <button
              key={st}
              onClick={() => setActiveStateTab(st)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[10px] font-medium tracking-wide uppercase border transition-all ${
                activeStateTab === st
                  ? 'bg-white text-black border-white'
                  : 'bg-white/5 text-zinc-400 border-white/5 hover:text-white hover:bg-white/10'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      )}

      {/* Destination Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredPlaces.map((place) => {
            const isFav = user?.favorites?.includes(place.name) || false;
            const isVisited = user?.visited?.includes(place.name) || false;
            return (
              <motion.div
                key={place._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="glass-panel hover-glow p-4 rounded-2xl cursor-pointer flex flex-col justify-between"
                onClick={() => {
                  setSelectedPlace(place);
                  setDetailTab('overview');
                }}
              >
                <div>
                  {/* Top Badge Indicators */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl">{place.emoji}</span>
                    <div className="flex items-center gap-1.5">
                      {/* Bookmark Icon */}
                      <button
                        onClick={(e) => handleFavoriteClick(e, place.name)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isFav 
                            ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                            : 'bg-white/5 text-zinc-400 border-white/5 hover:text-red-400 hover:bg-white/10'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      </button>

                      {/* Visited Check stamp */}
                      <button
                        onClick={(e) => handleVisitedClick(e, place.name)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isVisited 
                            ? 'bg-emerald-green/20 text-emerald-green border-emerald-green/30' 
                            : 'bg-white/5 text-zinc-400 border-white/5 hover:text-emerald-green hover:bg-white/10'
                        }`}
                        title={isVisited ? "Visited!" : "Stamp Visited"}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-white mb-1.5 flex items-center gap-1.5">
                    {place.name}
                    <span className="text-[9px] text-zinc-400 font-light">({place.country})</span>
                  </h3>
                  <p className="text-zinc-400 text-[11px] leading-relaxed line-clamp-3 mb-4 font-light">
                    {place.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4 text-[10px]">
                  <div className="flex items-center gap-1 text-zinc-500">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-zinc-300 font-medium">{place.rating || 4.5}</span>
                  </div>
                  <span className="text-royal-blue flex items-center gap-0.5 uppercase tracking-wider font-semibold hover:translate-x-1 transition-transform">
                    Inspect <Eye className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredPlaces.length === 0 && (
        <div className="max-w-md mx-auto text-center py-16">
          <AlertCircle className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-white">No locations found</h3>
          <p className="text-xs text-zinc-500 mt-1">Try modifying your search queries or active filters.</p>
        </div>
      )}

      {/* DETAILS SLIDEOVER MODAL */}
      <AnimatePresence>
        {selectedPlace && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#090d16] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col justify-between shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-royal-blue/20 to-emerald-green/20 border-b border-white/5 flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{selectedPlace.emoji}</span>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                      {selectedPlace.name}
                      <span className="text-[10px] bg-emerald-green/20 text-emerald-green border border-emerald-green/30 px-2 py-0.5 rounded-full font-mono uppercase font-semibold">
                        {selectedPlace.badge || 'EXPLORE'}
                      </span>
                    </h2>
                    <div className="flex items-center gap-2.5 mt-1">
                      <p className="text-xs text-zinc-400 font-light">
                        {selectedPlace.state ? `${selectedPlace.state}, ` : ''}{selectedPlace.country}
                      </p>
                      <a
                        href={`/map?destination=${encodeURIComponent(selectedPlace.name + ', ' + (selectedPlace.state || ''))}&origin=${encodeURIComponent('New Delhi, India')}&mode=driving`}
                        className="text-[9px] text-[#3b82f6] hover:text-[#10b981] font-mono uppercase font-semibold flex items-center gap-1 border border-royal-blue/20 hover:border-emerald-green/20 bg-white/5 px-2 py-0.5 rounded transition-all cursor-pointer pointer-events-auto"
                      >
                        <Navigation className="w-2.5 h-2.5" /> HUD Route
                      </a>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="text-zinc-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-all"
                >
                  ✕
                </button>
              </div>

              {/* Navigation Tabs inside modal */}
              <div className="px-6 pt-4 border-b border-white/5 flex gap-4 text-xs font-semibold tracking-wider uppercase overflow-x-auto whitespace-nowrap scrollbar-none">
                <button
                  onClick={() => setDetailTab('overview')}
                  className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
                    detailTab === 'overview' ? 'border-royal-blue text-white' : 'border-transparent text-zinc-500 hover:text-white'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setDetailTab('history')}
                  className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
                    detailTab === 'history' ? 'border-royal-blue text-white' : 'border-transparent text-zinc-500 hover:text-white'
                  }`}
                >
                  History
                </button>
                <button
                  onClick={() => setDetailTab('tips')}
                  className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
                    detailTab === 'tips' ? 'border-royal-blue text-white' : 'border-transparent text-zinc-500 hover:text-white'
                  }`}
                >
                  Guide
                </button>
                <button
                  onClick={() => setDetailTab('ai-intel')}
                  className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
                    detailTab === 'ai-intel' ? 'border-royal-blue text-white' : 'border-transparent text-zinc-500 hover:text-white'
                  }`}
                >
                  🛡️ AI Intel
                </button>
                <button
                  onClick={() => setDetailTab('transport')}
                  className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
                    detailTab === 'transport' ? 'border-royal-blue text-white' : 'border-transparent text-zinc-500 hover:text-white'
                  }`}
                >
                  🚄 Transport
                </button>
                <button
                  onClick={() => setDetailTab('food-shop')}
                  className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
                    detailTab === 'food-shop' ? 'border-royal-blue text-white' : 'border-transparent text-zinc-500 hover:text-white'
                  }`}
                >
                  🍽️ Food & Shop
                </button>
                <button
                  onClick={() => setDetailTab('itinerary')}
                  className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
                    detailTab === 'itinerary' ? 'border-royal-blue text-white' : 'border-transparent text-zinc-500 hover:text-white'
                  }`}
                >
                  📅 Itinerary
                </button>
              </div>

              {/* Scrollable Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {detailTab === 'overview' && (
                  <>
                    {/* Dynamic Image Gallery */}
                    <div className="space-y-2 mb-6">
                      <h4 className="text-[10px] font-mono text-royal-blue uppercase tracking-widest">Real Photo Gallery</h4>
                      {photosLoading ? (
                        <div className="h-32 sm:h-44 w-full bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center animate-pulse">
                          <span className="text-[10px] font-mono text-zinc-500">SYNCING REAL PHOTOS TELEMETRY...</span>
                        </div>
                      ) : placePhotos.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2 h-32 sm:h-44">
                          <div className="col-span-2 h-full overflow-hidden rounded-2xl border border-white/10 relative group">
                            <img
                              src={placePhotos[0]}
                              alt={selectedPlace.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[8px] font-mono text-zinc-400">
                              Wikimedia Licensed
                            </div>
                          </div>
                          <div className="col-span-1 flex flex-col gap-2 h-full">
                            <div className="h-[60px] sm:h-[84px] overflow-hidden rounded-xl border border-white/10 relative group">
                              <img
                                src={placePhotos[1] || placePhotos[0]}
                                alt="Gallery item"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <div className="h-[60px] sm:h-[84px] overflow-hidden rounded-xl border border-white/10 relative group">
                              <img
                                src={placePhotos[2] || placePhotos[0]}
                                alt="Gallery item"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div>
                      <h4 className="text-[10px] font-mono text-royal-blue uppercase tracking-widest mb-1.5 font-bold">Overview Description</h4>
                      <p className="text-xs text-zinc-300 font-light leading-relaxed">{selectedPlace.desc}</p>
                    </div>

                    {/* Tech Telemetry details */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 p-4 rounded-xl border border-white/5 text-[10.5px]">
                      <div>
                        <div className="text-zinc-500">Safety Index</div>
                        <div className="text-white font-mono font-semibold">{selectedPlace.safetyRating || 4.7}/5.0</div>
                      </div>
                      <div>
                        <div className="text-zinc-500">Solo Friendly</div>
                        <div className="text-white font-mono font-semibold">{selectedPlace.soloRating || 4.5}/5.0</div>
                      </div>
                      <div>
                        <div className="text-zinc-500">Couple Suitability</div>
                        <div className="text-white font-mono font-semibold">{selectedPlace.coupleRating || 4.8}/5.0</div>
                      </div>
                      <div>
                        <div className="text-zinc-500">Internet Quality</div>
                        <div className="text-emerald-green font-mono font-semibold">{selectedPlace.internetQuality || 'High'}</div>
                      </div>
                      <div className="mt-2">
                        <div className="text-zinc-500">Local Language</div>
                        <div className="text-white font-semibold">{selectedPlace.lang || 'English'}</div>
                      </div>
                      <div className="mt-2">
                        <div className="text-zinc-500">Currency</div>
                        <div className="text-white font-semibold">{selectedPlace.currency || 'USD ($)'}</div>
                      </div>
                      <div className="mt-2">
                        <div className="text-zinc-500">Sunrise / Sunset</div>
                        <div className="text-white font-semibold">{selectedPlace.sunrise || '06:00'} / {selectedPlace.sunset || '18:30'}</div>
                      </div>
                      <div className="mt-2">
                        <div className="text-zinc-500">Local Time Zone</div>
                        <div className="text-white font-semibold">{selectedPlace.timezone || 'UTC'}</div>
                      </div>
                    </div>
                  </>
                )}

                {detailTab === 'history' && (
                  <div>
                    <h4 className="text-[10px] font-mono text-royal-blue uppercase tracking-widest mb-1.5 font-bold">Historical Narrative</h4>
                    <p className="text-xs text-zinc-300 font-light leading-relaxed italic">{selectedPlace.history || 'Historical overview not available.'}</p>
                  </div>
                )}

                {detailTab === 'tips' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[10px] font-mono text-royal-blue uppercase tracking-widest mb-1.5 font-bold">Best Season to Visit</h4>
                      <p className="text-xs text-zinc-300 font-light">{selectedPlace.bestSeason}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-mono text-royal-blue uppercase tracking-widest mb-1.5 font-bold">Local Food Scene</h4>
                      <p className="text-xs text-zinc-300 font-light leading-relaxed">{selectedPlace.food || 'Excellent local culinary varieties.'}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-mono text-royal-blue uppercase tracking-widest mb-1.5 font-bold">Important Travel Tips</h4>
                      <p className="text-xs text-zinc-400 font-light leading-relaxed">{selectedPlace.travelTips || 'Respect local cultural traditions. Keep cash.'}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-mono text-royal-blue uppercase tracking-widest mb-1.5 font-bold">Emergency contacts</h4>
                      <p className="text-xs text-red-400 font-mono">{selectedPlace.emergencyContacts || 'Police: 112 / Medical: 112'}</p>
                    </div>
                  </div>
                )}

                {/* AI Dynamic Intel Dossiers */}
                {['ai-intel', 'transport', 'food-shop', 'itinerary'].includes(detailTab) && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-green animate-pulse" />
                      <h4 className="text-[10px] font-mono text-royal-blue uppercase tracking-widest font-bold">
                        {detailTab === 'ai-intel' && "Destination Safety & Accessibility Profile"}
                        {detailTab === 'transport' && "Transport Hub & Scenic Route Intelligence"}
                        {detailTab === 'food-shop' && "Food AI & Local Shopping Bazaar Directory"}
                        {detailTab === 'itinerary' && "AI 3-Day Neural Fast-Track Timeline"}
                      </h4>
                    </div>

                    {superIntelLoading ? (
                      <div className="py-16 flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-2 border-royal-blue/30 border-t-emerald-green rounded-full animate-spin" />
                        <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">SYNCING AI TELEMETRY CORE...</span>
                      </div>
                    ) : (
                      <div className="prose prose-invert max-w-none text-xs text-zinc-300 leading-relaxed font-light font-sans space-y-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                        {parseMarkdownToJSX(superIntel)}
                      </div>
                    )}
                  </div>
                )}

                {/* Reviews section inside modal */}
                <div className="border-t border-white/5 pt-6 mt-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Community Reviews</h3>
                  
                  {/* Reviews list */}
                  <div className="space-y-3 max-h-36 overflow-y-auto mb-4 scrollbar-thin">
                    {selectedPlace.reviews && selectedPlace.reviews.length > 0 ? (
                      selectedPlace.reviews.map((rev: any, idx: number) => (
                        <div key={idx} className="bg-white/5 border border-white/5 p-2.5 rounded-lg text-[10.5px]">
                          <div className="flex justify-between mb-1">
                            <span className="font-semibold text-zinc-200">{rev.username}</span>
                            <div className="flex items-center text-yellow-500">
                              <Star className="w-2.5 h-2.5 fill-current mr-0.5" />
                              <span className="font-mono font-bold">{rev.rating}</span>
                            </div>
                          </div>
                          <p className="text-zinc-400 font-light leading-relaxed">{rev.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-zinc-500 font-light">No reviews posted yet. Be the first to add one below!</p>
                    )}
                  </div>

                  {/* Add Review Form */}
                  <form onSubmit={handleReviewSubmit} className="space-y-3 bg-white/5 p-3 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400 font-medium">Leave a Review</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-zinc-500">Rating:</span>
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                          className="bg-black border border-white/10 text-white text-[11px] rounded px-1.5 py-0.5 focus:outline-none"
                        >
                          {[5, 4, 3, 2, 1].map(n => (
                            <option key={n} value={n}>{n} Stars</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your travel experiences..."
                      rows={2}
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-royal-blue/50"
                    />
                    {reviewError && <p className="text-[10px] text-red-400">{reviewError}</p>}
                    {reviewSuccess && <p className="text-[10px] text-emerald-green">{reviewSuccess}</p>}
                    <button
                      type="submit"
                      className="w-full py-1.5 bg-royal-blue text-xs uppercase font-bold tracking-wider rounded-lg text-white hover:bg-royal-blue/95 transition-all"
                    >
                      Post Review
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
