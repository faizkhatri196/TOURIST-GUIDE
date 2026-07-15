"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Award, Compass, MapPin, Shield, Star, BookOpen, AlertCircle, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, token } = useAuth();

  // Expense Tracker States
  const [expenses, setExpenses] = useState<{desc: string, amt: number}[]>([
    { desc: "Indira Gandhi Flight", amt: 145 },
    { desc: "Taj Rambagh Stay", amt: 320 }
  ]);
  const [expDesc, setExpDesc] = useState('');
  const [expAmt, setExpAmt] = useState('');

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

  const handleAddExpense = () => {
    if (!expDesc.trim() || !expAmt) return;
    setExpenses(prev => [...prev, { desc: expDesc, amt: parseFloat(expAmt) }]);
    setExpDesc('');
    setExpAmt('');
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amt, 0);

  // Timezone Converter States
  const [timeSource, setTimeSource] = useState('5.5');
  const [timeDest, setTimeDest] = useState('0');
  const [timeInput, setTimeInput] = useState('12:00');
  const [convertedTime, setConvertedTime] = useState('');

  useEffect(() => {
    if (!timeInput) return;
    const [hrs, mins] = timeInput.split(':').map(Number);
    const sourceOffset = parseFloat(timeSource);
    const destOffset = parseFloat(timeDest);
    
    // Convert to UTC
    let utcHrs = hrs - Math.floor(sourceOffset);
    let utcmins = mins - ((sourceOffset % 1) * 60);

    // Convert from UTC to Dest
    let finalHrs = utcHrs + Math.floor(destOffset);
    let finalMins = utcmins + ((destOffset % 1) * 60);

    // Normalize
    const totalMins = (finalHrs * 60 + finalMins + 1440) % 1440;
    const h = Math.floor(totalMins / 60);
    const m = Math.floor(totalMins % 60);

    setConvertedTime(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
  }, [timeSource, timeDest, timeInput]);

  // Currency Converter States
  const [currencyInput, setCurrencyInput] = useState('100');
  const [currencyTarget, setCurrencyTarget] = useState('INR');
  const [convertedCurrency, setConvertedCurrency] = useState('');

  useEffect(() => {
    const amt = parseFloat(currencyInput) || 0;
    const rates: Record<string, number> = {
      INR: 83.5,
      EUR: 0.92,
      GBP: 0.78,
      JPY: 158.0
    };
    const rate = rates[currencyTarget] || 1;
    const symbol = currencyTarget === 'INR' ? '₹' : currencyTarget === 'EUR' ? '€' : currencyTarget === 'GBP' ? '£' : '¥';
    setConvertedCurrency(`${symbol}${(amt * rate).toFixed(2)}`);
  }, [currencyInput, currencyTarget]);

  if (!token || !user) {
    return (
      <div className="min-h-screen bg-[#030712] pt-24 pb-28 md:pb-16 px-6 font-sans text-zinc-100 flex flex-col items-center justify-center">
        <div className="max-w-md text-center glass-panel p-8 rounded-2xl border-dashed border-white/10">
          <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-base font-bold text-white mb-2">Access Telemetry Restricted</h2>
          <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
            Authentication is required to view your personalized travel statistics, badges, achievements, and bookmarks.
          </p>
          <Link
            href="/auth"
            className="px-6 py-2.5 bg-gradient-to-r from-royal-blue to-emerald-green text-black font-semibold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all"
          >
            Authenticate Link
          </Link>
        </div>
      </div>
    );
  }

  // Calculate percentage to next level
  const points = user.stats?.points || 0;
  const currentLvl = user.stats?.level || 1;
  const pointsForNextLvl = currentLvl * 500;
  const prevLvlPoints = (currentLvl - 1) * 500;
  const progressPercent = Math.min(100, Math.floor(((points - prevLvlPoints) / 500) * 100));

  // Lockable badges definition
  const badgeDefinitions = [
    { name: "Explorer Born", icon: "🎒", desc: "Awarded upon visiting your first destination." },
    { name: "Wanderlust Specialist", icon: "✈️", desc: "Awarded upon tracking 3 unique travel destinations." },
    { name: "Global Nomad", icon: "🌍", desc: "Awarded upon tracking 5+ locations around Earth." },
    { name: "Historian", icon: "🏛️", desc: "Unlocked after visiting a historical or UNESCO monument." },
    { name: "Beach Bum", icon: "🏖️", desc: "Unlocked after visiting a coastal or beach destination." }
  ];

  return (
    <div className="min-h-screen bg-[#030712] pt-24 pb-28 md:pb-16 px-6 font-sans text-zinc-100">
      
      {/* Top Banner */}
      <div className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row items-center justify-between gap-6 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-royal-blue to-emerald-green flex items-center justify-center text-white text-3xl font-bold font-sans">
            {user.name[0]}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              {user.name}
              <span className="text-[10px] bg-royal-blue/20 text-[#3b82f6] border border-royal-blue/30 px-2 py-0.5 rounded-full font-mono uppercase">
                Rank: Explorer
              </span>
            </h1>
            <p className="text-xs text-zinc-500 mt-1 font-light">{user.email}</p>
          </div>
        </div>

        {/* Level telemetry */}
        <div className="w-full md:w-64 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span>LEVEL {currentLvl}</span>
            <span className="text-zinc-500">{points % 500}/500 PTS TO NEXT LEVEL</span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-royal-blue to-emerald-green rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Stats Grid (2 Columns equivalent) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Stat Telemetry cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-5 rounded-2xl">
              <span className="text-zinc-500 text-[10px] block uppercase tracking-wider">Distance Tracked</span>
              <span className="text-2xl font-bold font-mono text-white mt-1.5 block">
                {user.stats?.distanceTraveled?.toLocaleString() || 0} KM
              </span>
              <span className="text-[10px] text-zinc-500 block mt-1 font-light">Calculated via coordinates</span>
            </div>
            
            <div className="glass-panel p-5 rounded-2xl">
              <span className="text-zinc-500 text-[10px] block uppercase tracking-wider">Places Stamp</span>
              <span className="text-2xl font-bold font-mono text-emerald-green mt-1.5 block">
                {user.stats?.placesVisited || 0} Places
              </span>
              <span className="text-[10px] text-zinc-500 block mt-1 font-light">Villages, Cities & Monuments</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl">
              <span className="text-zinc-500 text-[10px] block uppercase tracking-wider">Achievements Count</span>
              <span className="text-2xl font-bold font-mono text-royal-blue mt-1.5 block">
                {user.badges?.length || 0} / {badgeDefinitions.length}
              </span>
              <span className="text-[10px] text-zinc-500 block mt-1 font-light">Gamified digital badge seals</span>
            </div>
          </div>

          {/* Bookmarks list */}
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white border-b border-white/5 pb-3 mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-royal-blue" /> Saved Destinations Bookmarks
            </h2>

            {user.favorites?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.favorites.map((favName, idx) => (
                  <Link 
                    key={idx}
                    href={`/explore?search=${favName}`}
                    className="p-3 bg-white/5 border border-white/5 hover:border-royal-blue/30 rounded-xl flex items-center justify-between text-xs hover:bg-white/10 transition-all"
                  >
                    <span className="font-semibold text-white flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-royal-blue" /> {favName}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">View details</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 leading-relaxed font-light">
                No bookmarked destinations saved. Start exploring and bookmarking locations to see them listed here.
              </p>
            )}
          </div>

          {/* Visited Places log */}
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white border-b border-white/5 pb-3 mb-4 flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-green" /> Visited Places Stamps
            </h2>

            {user.visited?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.visited.map((vName, idx) => (
                  <Link 
                    key={idx}
                    href={`/explore?search=${vName}`}
                    className="p-3 bg-white/5 border border-white/5 hover:border-emerald-green/30 rounded-xl flex items-center justify-between text-xs hover:bg-white/10 transition-all"
                  >
                    <span className="font-semibold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-green" /> {vName}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">View details</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 leading-relaxed font-light">
                No locations stamped as visited yet. Use the explorer directory to stamp places.
              </p>
            )}
          </div>
        </div>

        {/* Right Badge Achievements panel (1 Column equivalent) */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-2xl h-fit space-y-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-white border-b border-white/5 pb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-500" /> Digital Badges
          </h2>

          <div className="space-y-4">
            {badgeDefinitions.map((bd, idx) => {
              // Check if user earned this badge
              const earnedBadge = user.badges?.find(b => b.name === bd.name);
              return (
                <div 
                  key={idx} 
                  className={`flex items-center gap-3.5 p-3 rounded-xl border transition-all ${
                    earnedBadge
                      ? 'bg-emerald-green/5 border-emerald-green/20'
                      : 'bg-black/40 border-white/5 opacity-40'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center text-2xl border border-white/10">
                    {bd.icon}
                  </div>
                  <div>
                    <h3 className={`text-xs font-bold ${earnedBadge ? 'text-white' : 'text-zinc-500'}`}>
                      {bd.name}
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-light mt-0.5 leading-snug">
                      {bd.desc}
                    </p>
                    {earnedBadge && (
                      <span className="text-[8px] font-mono text-emerald-green uppercase mt-1 block tracking-wider">
                        UNLOCKED // {new Date(earnedBadge.dateEarned).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expense Tracker */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white border-b border-white/5 pb-2.5 flex items-center gap-2">
              💰 Expense Tracker
            </h2>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Expense item"
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  className="flex-1 bg-black border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-royal-blue/40"
                />
                <input
                  type="number"
                  placeholder="Amt ($)"
                  value={expAmt}
                  onChange={(e) => setExpAmt(e.target.value)}
                  className="w-16 bg-black border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-royal-blue/40"
                />
                <button
                  onClick={handleAddExpense}
                  className="px-3 py-1 bg-royal-blue hover:bg-royal-blue/90 text-white text-[10px] font-bold uppercase rounded-lg"
                >
                  Add
                </button>
              </div>
              <div className="max-h-28 overflow-y-auto space-y-1.5 scrollbar-thin text-[11px] text-zinc-400">
                {expenses.map((e, idx) => (
                  <div key={idx} className="flex justify-between bg-white/5 px-2.5 py-1.5 rounded border border-white/5">
                    <span>{e.desc}</span>
                    <span className="font-mono text-emerald-green font-semibold">${e.amt}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-white border-t border-white/5 pt-2">
                <span>Total Cost</span>
                <span className="font-mono text-emerald-green">${totalExpenses}</span>
              </div>
            </div>
          </div>

          {/* Timezone Converter */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white border-b border-white/5 pb-2.5 flex items-center gap-2">
              🕒 Timezone Converter
            </h2>
            <div className="space-y-2 text-[11px]">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-zinc-500 block mb-1 font-medium">From (IST)</label>
                  <select
                    value={timeSource}
                    onChange={(e) => setTimeSource(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded px-2 py-1 text-[11px] text-white focus:outline-none"
                  >
                    <option value="5.5">India (+5:30)</option>
                    <option value="0">London (+0:00)</option>
                    <option value="-5">New York (-5:00)</option>
                    <option value="9">Tokyo (+9:00)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 block mb-1 font-medium">To (Dest)</label>
                  <select
                    value={timeDest}
                    onChange={(e) => setTimeDest(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded px-2 py-1 text-[11px] text-white focus:outline-none"
                  >
                    <option value="0">London (+0:00)</option>
                    <option value="5.5">India (+5:30)</option>
                    <option value="-5">New York (-5:00)</option>
                    <option value="9">Tokyo (+9:00)</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="time"
                  value={timeInput}
                  onChange={(e) => setTimeInput(e.target.value)}
                  className="bg-black border border-white/10 rounded px-2 py-1 text-[11px] text-white flex-1 focus:outline-none"
                />
                <div className="flex-1 font-mono text-center text-white bg-white/5 border border-white/5 py-1 rounded">
                  {convertedTime || '--:--'}
                </div>
              </div>
            </div>
          </div>

          {/* Currency Converter */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white border-b border-white/5 pb-2.5 flex items-center gap-2">
              💱 Currency Converter
            </h2>
            <div className="space-y-2 text-[11px]">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={currencyInput}
                  onChange={(e) => setCurrencyInput(e.target.value)}
                  placeholder="Amt"
                  className="flex-1 bg-black border border-white/10 rounded-lg px-2.5 py-1 text-white focus:outline-none"
                />
                <select
                  value={currencyTarget}
                  onChange={(e) => setCurrencyTarget(e.target.value)}
                  className="bg-black border border-white/10 text-white rounded-lg px-2 py-1 focus:outline-none"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>
              <div className="bg-white/5 p-2 rounded border border-white/5 font-mono text-zinc-300 text-center">
                ${currencyInput || 1} USD ➔ <span className="text-emerald-green font-bold">{convertedCurrency}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock icon fallback helper
const CheckCircle2: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
