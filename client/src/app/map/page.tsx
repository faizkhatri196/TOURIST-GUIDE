"use client";

import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Navigation, Shield, Compass, Plane, Train, Car, Bike, Footprints, Info, Sparkles, X, AlertTriangle, Leaf, Star } from 'lucide-react';
import RealMapWrapper from '../../components/RealMapWrapper';

function MapContent() {
  const searchParams = useSearchParams();
  const [startPoint, setStartPoint] = useState('New Delhi, India');
  const [endPoint, setEndPoint] = useState('Jaipur, Rajasthan');
  const [mode, setMode] = useState<'driving' | 'train' | 'flight' | 'bike' | 'walking'>('driving');
  const [distance, setDistance] = useState(268); // km
  const [time, setTime] = useState('4.5 Hours');
  const [routing, setRouting] = useState(false);
  const [routingTrigger, setRoutingTrigger] = useState(false);

  // Layer mode for map views
  const [layerMode, setLayerMode] = useState<'vector' | 'satellite' | 'traffic'>('vector');

  // Places suggestions database
  const [places, setPlaces] = useState<any[]>([]);
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);

  // Dynamic Nominatim Search suggestions states
  const [startSuggestions, setStartSuggestions] = useState<any[]>([]);
  const [startLoading, setStartLoading] = useState(false);
  const [endSuggestions, setEndSuggestions] = useState<any[]>([]);
  const [endLoading, setEndLoading] = useState(false);

  // Debounced search for Origin suggestions
  useEffect(() => {
    if (!startPoint || startPoint.trim().length < 3) {
      setStartSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setStartLoading(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(startPoint)}&addressdetails=1&limit=6`;
        const res = await axios.get(url, {
          headers: { 'Accept-Language': 'en' }
        });
        const formatted = res.data.map((item: any) => ({
          id: item.place_id,
          display_name: item.display_name,
          name: item.name || item.address.city || item.address.state || item.display_name.split(',')[0],
          state: item.address.state || item.address.country || '',
          lat: item.lat,
          lon: item.lon
        }));
        setStartSuggestions(formatted);
      } catch (err) {
        console.error("Failed to fetch start suggestions:", err);
      } finally {
        setStartLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [startPoint]);

  // Debounced search for Destination suggestions
  useEffect(() => {
    if (!endPoint || endPoint.trim().length < 3) {
      setEndSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setEndLoading(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endPoint)}&addressdetails=1&limit=6`;
        const res = await axios.get(url, {
          headers: { 'Accept-Language': 'en' }
        });
        const formatted = res.data.map((item: any) => ({
          id: item.place_id,
          display_name: item.display_name,
          name: item.name || item.address.city || item.address.state || item.display_name.split(',')[0],
          state: item.address.state || item.address.country || '',
          lat: item.lat,
          lon: item.lon
        }));
        setEndSuggestions(formatted);
      } catch (err) {
        console.error("Failed to fetch end suggestions:", err);
      } finally {
        setEndLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [endPoint]);

  // AI Route Sights Intelligence
  const [routeIntel, setRouteIntel] = useState('');
  const [intelLoading, setIntelLoading] = useState(false);
  const [showIntelModal, setShowIntelModal] = useState(false);
  const [telemetryMessage, setTelemetryMessage] = useState('');

  // AI Hotels Dossier from map marker clicks
  const [aiHotelName, setAiHotelName] = useState('');
  const [aiDossier, setAiDossier] = useState('');
  const [dossierLoading, setDossierLoading] = useState(false);
  const [showDossierModal, setShowDossierModal] = useState(false);

  // Fetch places for suggestions
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/places');
        setPlaces(res.data);
      } catch (err) {
        console.error("Error fetching places for map suggestions:", err);
      }
    };
    fetchPlaces();
  }, []);

  // Sync with search URL queries
  useEffect(() => {
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const transitMode = searchParams.get('mode');

    let triggered = false;

    if (origin) {
      setStartPoint(decodeURIComponent(origin));
      triggered = true;
    }
    if (destination) {
      setEndPoint(decodeURIComponent(destination));
      triggered = true;
    }
    if (transitMode && ['driving', 'train', 'flight', 'bike', 'walking'].includes(transitMode)) {
      setMode(transitMode as any);
      triggered = true;
    }

    if (triggered) {
      setRoutingTrigger(prev => !prev);
    }
  }, [searchParams]);

  const handlePlotRoute = () => {
    setRouting(true);
    setRoutingTrigger(prev => !prev);
    setTimeout(() => {
      setRouting(false);
    }, 1000);
  };

  const handleRouteIntelQuery = async () => {
    setIntelLoading(true);
    setRouteIntel('');
    setShowIntelModal(true);

    const statuses = [
      "SYNCHRONIZING VECTOR TRANSIT PATH...",
      "SAMPLING LANDMARKS DATA GRID...",
      "COMPILING LOCAL RESTAURANTS DOSSIER...",
      "CALCULATING CO2 CARBON EMISSIONS INDEX...",
      "GROQ AI COMPILE ROUTE GUIDES...",
    ];

    let idx = 0;
    setTelemetryMessage(statuses[0]);
    const timer = setInterval(() => {
      idx = (idx + 1) % statuses.length;
      setTelemetryMessage(statuses[idx]);
    }, 1800);

    try {
      const res = await axios.post('http://localhost:5000/api/ai/route-details', {
        origin: startPoint,
        destination: endPoint,
        mode
      });
      setRouteIntel(res.data.routeIntel);
    } catch (err) {
      console.error(err);
      setRouteIntel("### Transit Telemetry Error\n\nFailed to compile route intelligence from the AI navigation core. Verify network settings.");
    } finally {
      clearInterval(timer);
      setIntelLoading(false);
    }
  };

  const handleHotelDossierQuery = async (hotelName: string) => {
    setDossierLoading(true);
    setAiDossier('');
    setShowDossierModal(true);
    setAiHotelName(hotelName);

    const statuses = [
      "ACQUIRING REGIONAL STAYS METADATA...",
      "RETRIEVING GUEST RATING METRIC...",
      "GROQ COMPILES AMENITIES MATRIX...",
    ];

    let idx = 0;
    setTelemetryMessage(statuses[0]);
    const timer = setInterval(() => {
      idx = (idx + 1) % statuses.length;
      setTelemetryMessage(statuses[idx]);
    }, 1800);

    try {
      const res = await axios.post('http://localhost:5000/api/ai/hotel-details', {
        hotelName
      });
      setAiDossier(res.data.hotelDetails);
    } catch (err) {
      console.error(err);
      setAiDossier("### Stays Intelligence Error\n\nFailed to compile lodging dossier from the stays directory. Please try again.");
    } finally {
      clearInterval(timer);
      setDossierLoading(false);
    }
  };

  const transportModes = [
    { id: 'driving', name: 'Drive', icon: Car },
    { id: 'train', name: 'Train', icon: Train },
    { id: 'flight', name: 'Flight', icon: Plane },
    { id: 'bike', name: 'Bike', icon: Bike },
    { id: 'walking', name: 'Walk', icon: Footprints }
  ] as const;

  // Simulated carbon footprint offset
  const co2Offset = (distance * (mode === 'flight' ? 0.25 : mode === 'driving' ? 0.12 : mode === 'train' ? 0.04 : 0)).toFixed(1);

  return (
    <div className="min-h-screen bg-[#030712] pt-24 pb-16 px-6 font-sans text-zinc-100 flex flex-col items-center">
      
      {/* Page Title */}
      <div className="w-full max-w-7xl mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <span className="font-mono text-xs tracking-[0.25em] text-royal-blue uppercase block mb-1">Interactive Telemetry HUD</span>
          <h1 className="text-3xl font-sans font-bold text-white tracking-tight font-sans">Interactive Live Map & Real Stays</h1>
        </div>
        <div className="flex gap-4 font-mono text-[10px] text-zinc-500 uppercase bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
          <div>GPS: ACTIVE</div>
          <div>LAYER: OPENSTREETMAP LIVE</div>
        </div>
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Control Panel (Left Pane) */}
        <div className="lg:col-span-1 glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[520px]">
          <div className="space-y-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white border-b border-white/5 pb-2.5 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-green" /> Route Settings
            </h2>

            {/* Inputs */}
            <div className="space-y-3">
              
              {/* Origin Field */}
              <div className="space-y-1.5 relative">
                <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-medium">Origin Point</label>
                <div className="relative">
                  <input
                    type="text"
                    value={startPoint}
                    onFocus={() => setShowStartSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowStartSuggestions(false), 200)}
                    onChange={(e) => setStartPoint(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-royal-blue/30"
                  />
                  {startPoint && (
                    <button 
                      onClick={() => setStartPoint('')} 
                      className="absolute right-2.5 top-2 text-zinc-500 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {showStartSuggestions && startSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 right-0 mt-1 bg-[#090d16]/95 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 max-h-60 overflow-y-auto"
                    >
                      {startLoading && (
                        <div className="p-3 text-[10px] font-mono text-zinc-500 text-center animate-pulse">
                          QUERYING LIVE GPS DIRECTORY...
                        </div>
                      )}
                      {startSuggestions.map(s => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setStartPoint(s.display_name);
                            setShowStartSuggestions(false);
                          }}
                          className="w-full text-left px-3 py-2 border-b border-white/5 hover:bg-white/5 text-[11px] text-zinc-300 flex items-center gap-2"
                        >
                          <span className="text-xs">📍</span>
                          <div className="truncate pr-2">
                            <div className="text-white font-medium truncate">{s.name}</div>
                            <div className="text-[9px] text-zinc-500 truncate">{s.display_name}</div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Destination Field */}
              <div className="space-y-1.5 relative">
                <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-medium">Destination Point</label>
                <div className="relative">
                  <input
                    type="text"
                    value={endPoint}
                    onFocus={() => setShowEndSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowEndSuggestions(false), 200)}
                    onChange={(e) => setEndPoint(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-royal-blue/30"
                  />
                  {endPoint && (
                    <button 
                      onClick={() => setEndPoint('')} 
                      className="absolute right-2.5 top-2 text-zinc-500 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {showEndSuggestions && endSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 right-0 mt-1 bg-[#090d16]/95 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 max-h-60 overflow-y-auto"
                    >
                      {endLoading && (
                        <div className="p-3 text-[10px] font-mono text-zinc-500 text-center animate-pulse">
                          QUERYING LIVE GPS DIRECTORY...
                        </div>
                      )}
                      {endSuggestions.map(s => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setEndPoint(s.display_name);
                            setShowEndSuggestions(false);
                          }}
                          className="w-full text-left px-3 py-2 border-b border-white/5 hover:bg-white/5 text-[11px] text-zinc-300 flex items-center gap-2"
                        >
                          <span className="text-xs">📍</span>
                          <div className="truncate pr-2">
                            <div className="text-white font-medium truncate">{s.name}</div>
                            <div className="text-[9px] text-zinc-500 truncate">{s.display_name}</div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Transport selector */}
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-medium block">Transport Mode</label>
              <div className="grid grid-cols-5 gap-1.5 bg-black/40 border border-white/10 p-1 rounded-xl">
                {transportModes.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setMode(t.id)}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                        mode === t.id ? 'bg-royal-blue text-white shadow-md' : 'text-zinc-500 hover:text-white'
                      }`}
                      title={t.name}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={handlePlotRoute}
              disabled={routing}
              className="w-full py-2.5 bg-white/5 border border-white/10 text-white font-semibold text-xs uppercase tracking-wider rounded-xl hover:bg-white hover:text-black transition-all cursor-pointer"
            >
              {routing ? "Plotting Path..." : "Plot Route"}
            </button>

            {/* AI Scout Button */}
            <button
              onClick={handleRouteIntelQuery}
              className="w-full py-2.5 bg-gradient-to-r from-royal-blue to-emerald-green text-black font-semibold text-xs uppercase tracking-wider rounded-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              Scout Route Sights
            </button>
          </div>

          {/* Telemetry Output HUD */}
          <div className="border-t border-white/5 pt-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[9px] text-zinc-500 uppercase tracking-widest">Est. Distance</div>
                <div className="text-lg font-bold font-mono text-white mt-0.5">{distance} KM</div>
              </div>
              <div>
                <div className="text-[9px] text-zinc-500 uppercase tracking-widest">Est. Duration</div>
                <div className="text-lg font-bold font-mono text-emerald-green mt-0.5">{time}</div>
              </div>
            </div>
            
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-[10px] flex items-center justify-between text-zinc-400">
              <span className="flex items-center gap-1.5"><Leaf className="w-3.5 h-3.5 text-emerald-green" /> Carbon Impact:</span>
              <span className="font-mono text-white font-semibold">{co2Offset} kg CO₂</span>
            </div>

            <div className="flex justify-between items-center text-[9px] text-zinc-500 border-t border-white/5 pt-3">
              <span>Telemetry Ping</span>
              <span className="font-mono text-emerald-green">Active (0.2s)</span>
            </div>
          </div>
        </div>

        {/* 3D Map Viewport (Right Panel) */}
        <div className="lg:col-span-3 h-[380px] sm:h-[520px] rounded-2xl overflow-hidden border border-white/10 relative w-full">
          
          <RealMapWrapper
            origin={startPoint}
            destination={endPoint}
            mode={mode}
            layerMode={layerMode}
            routingTrigger={routingTrigger}
            onDistanceDurationUpdate={(dist, dur) => {
              setDistance(dist);
              setTime(dur);
            }}
            onHotelSelect={(hotelName) => {
              handleHotelDossierQuery(hotelName);
            }}
          />

          {/* Map Header Status overlay */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex justify-between items-start pointer-events-none z-[999]">
            <div className="bg-black/85 border border-white/10 px-3 sm:px-4 py-2 rounded-xl backdrop-blur-md flex flex-col gap-0.5 font-mono text-[8px] sm:text-[9px] tracking-widest uppercase">
              <div className="text-white">ROUTE: {startPoint ? startPoint.split(',')[0] : 'EMPTY'} ➔ {endPoint ? endPoint.split(',')[0] : 'EMPTY'}</div>
              <div className="text-zinc-500">MODE: {mode.toUpperCase()} // SYS ACTIVE</div>
            </div>
            
            <div className="bg-black/85 border border-white/10 p-2 rounded-xl backdrop-blur-md flex-col gap-1 text-[9px] sm:text-[10px] text-zinc-400 hidden sm:flex">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-green" /> Live Geolocation Active
              </div>
            </div>
          </div>

          {/* Map footer layer-switching overlay HUD controls */}
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 z-[999]">
            <div className="bg-black/85 border border-white/10 px-4 py-2.5 rounded-xl backdrop-blur-md font-mono text-[9px] text-zinc-500 tracking-wider pointer-events-none hidden md:block">
              GPS SATELLITES: ONLINE // RADAR SCANNING REAL HOTEL MARKERS
            </div>
            
            <div className="flex gap-2 bg-black/90 p-1 border border-white/10 rounded-xl backdrop-blur-md pointer-events-auto">
              <button 
                onClick={() => setLayerMode('vector')}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-semibold font-mono tracking-wider transition-all uppercase cursor-pointer ${
                  layerMode === 'vector' ? 'bg-royal-blue text-white shadow-lg' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Vector Dark
              </button>
              <button 
                onClick={() => setLayerMode('satellite')}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-semibold font-mono tracking-wider transition-all uppercase cursor-pointer ${
                  layerMode === 'satellite' ? 'bg-royal-blue text-white shadow-lg' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Satellite
              </button>
              <button 
                onClick={() => setLayerMode('traffic')}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-semibold font-mono tracking-wider transition-all uppercase cursor-pointer ${
                  layerMode === 'traffic' ? 'bg-royal-blue text-white shadow-lg' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Traffic View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI HOTEL DETAILS OVERLAY MODAL */}
      {showDossierModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#090d16] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col justify-between shadow-2xl">
            
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-royal-blue/20 to-emerald-green/20 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-white">{aiHotelName}</h2>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">LODGING DOSSIER // GROQ COMPILATION</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDossierModal(false);
                  setAiDossier('');
                }}
                className="text-zinc-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
              {dossierLoading ? (
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

            {/* Footer */}
            <div className="p-4 border-t border-white/5 bg-black/30 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDossierModal(false);
                  setAiDossier('');
                }}
                className="px-5 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-all text-zinc-300"
              >
                Close Dossier
              </button>
              <button
                onClick={() => {
                  setShowDossierModal(false);
                  window.location.href = `/hotels?search=${encodeURIComponent(aiHotelName)}`;
                }}
                className="px-5 py-2 bg-gradient-to-r from-royal-blue to-emerald-green text-black font-semibold text-[10px] uppercase tracking-wider rounded-xl hover:opacity-90 transition-all"
              >
                Book This Stay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI ROUTE INTEL OVERLAY MODAL */}
      {showIntelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#090d16] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col justify-between shadow-2xl">
            
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-royal-blue/20 to-emerald-green/20 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-emerald-green animate-pulse" />
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-white">Route Intelligence Dossier</h2>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">TRANSIT // {startPoint ? startPoint.split(',')[0] : 'EMPTY'} ➔ {endPoint ? endPoint.split(',')[0] : 'EMPTY'}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowIntelModal(false);
                  setRouteIntel('');
                }}
                className="text-zinc-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
              {intelLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-12 h-12 border-4 border-royal-blue/30 border-t-emerald-green rounded-full animate-spin mb-4"></div>
                  <p className="font-mono text-xs text-[#3b82f6] tracking-widest uppercase animate-pulse">{telemetryMessage}</p>
                </div>
              ) : (
                <div className="prose prose-invert prose-xs max-w-none text-zinc-300 whitespace-pre-line font-light leading-relaxed">
                  {routeIntel}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 bg-black/30 flex justify-end">
              <button
                onClick={() => {
                  setShowIntelModal(false);
                  setRouteIntel('');
                }}
                className="px-5 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-all text-zinc-300"
              >
                Close Intel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InteractiveMapPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030712] pt-24 pb-16 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/10 border-t-royal-blue rounded-full animate-spin"></div>
      </div>
    }>
      <MapContent />
    </Suspense>
  );
}
