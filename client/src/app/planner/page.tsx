"use client";

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, DollarSign, Users, Plane, Settings, CheckCircle2, ChevronDown } from 'lucide-react';

export default function PlannerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030712] pt-24 text-center font-mono text-xs tracking-widest text-[#3b82f6] uppercase animate-pulse">
        CALIBRATING PLOTTING ENGINE...
      </div>
    }>
      <PlannerForm />
    </Suspense>
  );
}

function PlannerForm() {
  const searchParams = useSearchParams();
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [people, setPeople] = useState(1);
  const [theme, setTheme] = useState('Adventure');
  const [budgetLevel, setBudgetLevel] = useState('Moderate');

  const [itinerary, setItinerary] = useState('');
  const [budgetPlan, setBudgetPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Check URL params
  useEffect(() => {
    const destParam = searchParams.get('dest');
    if (destParam) {
      setDestination(destParam);
    }
  }, [searchParams]);

  const handleGenerate = async () => {
    if (!destination.trim()) {
      alert("Please enter a destination first.");
      return;
    }

    setLoading(true);
    setItinerary('');
    setBudgetPlan('');
    
    // Simulate telemetry loading messages
    const statuses = [
      "SYNCHRONIZING ORBIT SATELLITES...",
      "QUERYING REGIONAL METADATA DATABASE...",
      "INVOKING GEMINI TRAVEL REASONING GRAPH...",
      "PARSING DAY-BY-DAY SIGHTSEEING SCHEMAS...",
      "CALCULATING FUEL AND HOTEL BOOKING BUDGETS...",
      "OPTIMIZING ROUTES AND SAFETY MATRICES...",
    ];

    let statusIdx = 0;
    setStatusMessage(statuses[0]);
    const interval = setInterval(() => {
      statusIdx = (statusIdx + 1) % statuses.length;
      setStatusMessage(statuses[statusIdx]);
    }, 2500);

    try {
      // 1. Fetch Itinerary
      const itRes = await axios.post('http://localhost:5000/api/ai/itinerary', {
        destination,
        days,
        groupType: people > 1 ? `${people} People` : 'Solo',
        theme
      });
      setItinerary(itRes.data.itinerary);

      // 2. Fetch Budget
      const bgRes = await axios.post('http://localhost:5000/api/ai/budget', {
        destination,
        days,
        people,
        budgetLevel
      });
      setBudgetPlan(bgRes.data.budget);

    } catch (error) {
      console.error("AI Planner error:", error);
      alert("Failed to communicate with the AI Core. Please check if the server is running.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const themes = ['Adventure', 'Backpacking', 'Luxury', 'Family', 'Solo', 'Honeymoon', 'Road Trip', 'Business'];
  const budgets = ['Budget', 'Moderate', 'Luxury'];

  return (
    <div className="min-h-screen bg-[#030712] pt-24 pb-16 px-6 font-sans text-zinc-100">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <span className="font-mono text-xs tracking-[0.25em] text-emerald-green uppercase block mb-2">AI Neural Planner</span>
        <h1 className="text-3xl md:text-4xl font-sans font-bold text-white tracking-tight">
          Let's Travel <span className="text-gradient bg-gradient-to-r from-white via-royal-blue to-emerald-green">Intelligence</span>
        </h1>
        <p className="text-zinc-500 text-xs mt-1.5 max-w-xl mx-auto font-light leading-relaxed">
          Create hyper-personalized day-by-day itineraries and budget spreadsheets powered by Gemini 1.5 Flash. Enter details below to launch the generator.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Planner Inputs (Left Panel) */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-2xl h-fit space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/5 pb-3">Telemetry Inputs</h2>
          
          {/* Destination */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Munnar, Kerala / Paris, France"
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-royal-blue/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Duration */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">Duration (Days)</label>
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 7, 10, 14].map(n => (
                  <option key={n} value={n}>{n} Days</option>
                ))}
              </select>
            </div>

            {/* Travelers */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">Travelers</label>
              <select
                value={people}
                onChange={(e) => setPeople(Number(e.target.value))}
                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 8, 10].map(n => (
                  <option key={n} value={n}>{n} Person(s)</option>
                ))}
              </select>
            </div>
          </div>

          {/* Theme */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">Travel Style Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
            >
              {themes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Budget Tier */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">Budget Tier</label>
            <select
              value={budgetLevel}
              onChange={(e) => setBudgetLevel(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
            >
              {budgets.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-royal-blue to-emerald-green rounded-xl text-black font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            {loading ? "Generating..." : "Generate AI Plan"}
          </button>
        </div>

        {/* Output Panel (Right Panel) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {loading && (
            <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 border-4 border-royal-blue/30 border-t-emerald-green rounded-full animate-spin mb-4"></div>
              <p className="font-mono text-xs tracking-widest text-[#3b82f6] uppercase animate-pulse">
                {statusMessage}
              </p>
            </div>
          )}

          {!loading && !itinerary && !budgetPlan && (
            <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center min-h-[400px] border-dashed border-white/10">
              <Calendar className="w-12 h-12 text-zinc-700 mb-3" />
              <h3 className="text-sm font-semibold text-white">No active plan generated</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs leading-relaxed">
                Configure your destination and preferences on the left pane and press "Generate AI Plan" to launch the neural engine.
              </p>
            </div>
          )}

          {/* Generated Content Sheets */}
          {!loading && (itinerary || budgetPlan) && (
            <div className="space-y-6">
              
              {/* Quick Actions Panel */}
              <div className="glass-panel p-4 rounded-xl border border-royal-blue/20 bg-gradient-to-r from-royal-blue/10 via-emerald-green/5 to-transparent flex flex-wrap gap-3 items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">⚡ Connected Actions</h4>
                  <p className="text-[10px] text-zinc-500 font-light mt-0.5">Scout accommodations or navigate routes for this plan.</p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/hotels?search=${encodeURIComponent(destination)}`}
                    className="px-3.5 py-1.5 bg-white/5 hover:bg-white border border-white/10 hover:text-black rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer pointer-events-auto"
                  >
                    🏨 Scout Stays in {destination.split(',')[0]}
                  </a>
                  <a
                    href={`/map?destination=${encodeURIComponent(destination)}&origin=${encodeURIComponent('New Delhi, India')}&mode=driving`}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-royal-blue to-emerald-green text-black font-semibold text-[10px] uppercase tracking-wider rounded-lg hover:opacity-90 transition-all cursor-pointer pointer-events-auto"
                  >
                    🗺️ HUD Telemetry Route
                  </a>
                </div>
              </div>
              
              {/* Itinerary */}
              {itinerary && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel p-6 rounded-2xl text-xs"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-green border-b border-white/5 pb-3 mb-4 flex items-center gap-2">
                    <Plane className="w-4 h-4" /> Day-by-Day Travel Itinerary
                  </h3>
                  <div className="prose prose-invert prose-xs max-w-none text-zinc-300 whitespace-pre-line font-light leading-relaxed">
                    {itinerary}
                  </div>
                </motion.div>
              )}

              {/* Budget Plan */}
              {budgetPlan && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel p-6 rounded-2xl text-xs"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-royal-blue border-b border-white/5 pb-3 mb-4 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Budget Spreadsheet & Savings Tips
                  </h3>
                  <div className="prose prose-invert prose-xs max-w-none text-zinc-300 whitespace-pre-line font-light leading-relaxed">
                    {budgetPlan}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
