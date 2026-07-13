"use client";

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, AlertTriangle, CheckCircle, CreditCard, Bell, Download, Map, MessageSquare, PhoneCall } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PremiumPage() {
  const { user, token, upgradePremium } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Premium simulated states
  const [priceAlertDestination, setPriceAlertDestination] = useState('');
  const [activeAlerts, setActiveAlerts] = useState<string[]>(['Paris (Flights)', 'Kyoto (Hotels)']);
  const [downloadedMaps, setDownloadedMaps] = useState<string[]>(['London Offline Map']);
  const [mapInput, setMapInput] = useState('');

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#10b981', '#ffffff']
    });
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("Please sign in to upgrade your subscription!");
      return;
    }

    if (!cardNumber || cardNumber.length < 12) {
      alert("Please enter a valid credit card number.");
      return;
    }

    setIsProcessing(true);
    // Simulate secure Stripe network delay
    setTimeout(async () => {
      try {
        await upgradePremium();
        triggerConfetti();
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    }, 2500);
  };

  const handleAddPriceAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!priceAlertDestination.trim()) return;
    setActiveAlerts([...activeAlerts, `${priceAlertDestination} (Alert)`]);
    setPriceAlertDestination('');
  };

  const handleDownloadMap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapInput.trim()) return;
    setDownloadedMaps([...downloadedMaps, `${mapInput} Offline Map`]);
    setMapInput('');
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-28 md:pb-16 px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="text-center space-y-2">
          <span className="font-mono text-[10px] tracking-[0.3em] text-royal-blue uppercase font-bold">
            Travel Operating System v2 // Premium
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Premium <span className="text-gradient bg-gradient-to-r from-royal-blue to-emerald-green">Concierge Dashboard</span>
          </h1>
          <p className="text-zinc-500 text-xs font-light max-w-lg mx-auto">
            Unlock real-time price prediction models, unlimited AI planners, offline vector maps, and direct emergency concierge networks.
          </p>
        </div>

        {user?.isPremium ? (
          /* PREMIUM USER CONSOLE */
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Status Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900/80 to-zinc-900/20 border border-emerald-green/30 p-6 rounded-2xl backdrop-blur-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-green/5 rounded-full blur-3xl -z-10" />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-green animate-pulse" />
                    <span className="text-xs uppercase font-mono tracking-widest text-emerald-green font-semibold">Subscription Active</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">Travel OS Premium Member</h3>
                  <p className="text-[10px] text-zinc-500 font-mono">Renewal Date: July 2027 (Simulated billing via Stripe node gateway)</p>
                </div>
                <div className="px-4 py-1.5 rounded-xl bg-emerald-green/10 border border-emerald-green/30 text-emerald-green font-mono text-[11px] font-bold">
                  UNLOCKED ACCESS
                </div>
              </div>
            </div>

            {/* Premium Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Price Alerts Panel */}
              <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <Bell className="w-4 h-4 text-royal-blue" />
                  <h4 className="text-xs uppercase font-mono tracking-wider font-semibold text-white">Live Price drop Alerts</h4>
                </div>
                <form onSubmit={handleAddPriceAlert} className="flex gap-2">
                  <input
                    type="text"
                    value={priceAlertDestination}
                    onChange={(e) => setPriceAlertDestination(e.target.value)}
                    placeholder="Enter city (e.g. Rome)..."
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-royal-blue/50"
                  />
                  <button type="submit" className="px-4 py-2 bg-royal-blue text-xs font-bold uppercase rounded-xl hover:bg-royal-blue/90 transition-all cursor-pointer">
                    Track
                  </button>
                </form>
                <div className="space-y-2">
                  {activeAlerts.map((alertItem, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-xl border border-white/5 text-[11px]">
                      <span className="text-zinc-300 font-light">{alertItem}</span>
                      <span className="text-emerald-green font-mono font-semibold">Active Monitoring</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Offline Maps Panel */}
              <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <Map className="w-4 h-4 text-emerald-green" />
                  <h4 className="text-xs uppercase font-mono tracking-wider font-semibold text-white">Offline Maps Cache</h4>
                </div>
                <form onSubmit={handleDownloadMap} className="flex gap-2">
                  <input
                    type="text"
                    value={mapInput}
                    onChange={(e) => setMapInput(e.target.value)}
                    placeholder="Enter city / region..."
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-green/50"
                  />
                  <button type="submit" className="px-4 py-2 bg-emerald-green text-black text-xs font-bold uppercase rounded-xl hover:bg-emerald-green/90 transition-all cursor-pointer">
                    Download
                  </button>
                </form>
                <div className="space-y-2">
                  {downloadedMaps.map((mapItem, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-xl border border-white/5 text-[11px]">
                      <span className="text-zinc-300 font-light">{mapItem}</span>
                      <div className="flex items-center gap-1.5 text-emerald-green">
                        <Download className="w-3.5 h-3.5" />
                        <span className="font-mono text-[9px] uppercase tracking-wider font-bold">Offline Ready</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 24/7 AI Concierge Voice Line */}
              <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-4 md:col-span-2">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-royal-blue" />
                    <h4 className="text-xs uppercase font-mono tracking-wider font-semibold text-white">Emergency AI Concierge Line</h4>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Live satellite sync</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between h-28">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Medical SOS Line</span>
                    <h3 className="text-xs font-bold text-white">Direct Medical Link</h3>
                    <span className="text-[9.5px] font-mono text-emerald-green font-semibold">Operational // 112 Ready</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between h-28">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Global IATA Support</span>
                    <h3 className="text-xs font-bold text-white">Flight Rescheduling Concierge</h3>
                    <span className="text-[9.5px] font-mono text-emerald-green font-semibold">Operational // Auto re-book</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between h-28">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Legal Assistance</span>
                    <h3 className="text-xs font-bold text-white">Consulate Coordination</h3>
                    <span className="text-[9.5px] font-mono text-emerald-green font-semibold">Operational // Embassy Link</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        ) : (
          /* STRIPE UPGRADE CHECKOUT FLOW (MOCK CHECKOUT SIMULATOR) */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Value Proposition Cards */}
            <div className="md:col-span-7 space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-royal-blue flex-shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-white">Unlimited Itinerary Neural Generation</h3>
                    <p className="text-zinc-400 text-xs font-light leading-relaxed">
                      Plan infinite complex routes, Multi-city travels, and localized colonial tracking models powered by deep Llama-3 integrations.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-green flex-shrink-0">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-white">Automated Price Prediction Models</h3>
                    <p className="text-zinc-400 text-xs font-light leading-relaxed">
                      Compare flight tickets on the global GDS servers and receive price alerts automatically as soon as prices drop to local minimums.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 flex-shrink-0">
                    <Map className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-white">Offline Vector Maps Download</h3>
                    <p className="text-zinc-400 text-xs font-light leading-relaxed">
                      Download high-fidelity regional map tiles directly to local storage to maintain absolute offline GPS coordinates in deserts or forests.
                    </p>
                  </div>
                </div>
              </div>

              {/* Plans Selector */}
              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                <button
                  type="button"
                  onClick={() => setSelectedPlan('monthly')}
                  className={`p-4 rounded-xl border text-left space-y-1 transition-all cursor-pointer ${
                    selectedPlan === 'monthly' ? 'bg-white/5 border-royal-blue' : 'bg-transparent border-white/5 hover:border-white/15'
                  }`}
                >
                  <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Monthly Pro</span>
                  <h4 className="text-base font-bold text-white">$12<span className="text-zinc-500 text-xs font-light">/mo</span></h4>
                  <p className="text-[9px] text-zinc-500 font-light">Cancel subscription at any time.</p>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPlan('annual')}
                  className={`p-4 rounded-xl border text-left space-y-1 transition-all relative cursor-pointer ${
                    selectedPlan === 'annual' ? 'bg-white/5 border-emerald-green' : 'bg-transparent border-white/5 hover:border-white/15'
                  }`}
                >
                  <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-emerald-green text-black font-mono text-[8px] font-bold tracking-wider">Save 30%</span>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Annual Saver</span>
                  <h4 className="text-base font-bold text-white">$99<span className="text-zinc-500 text-xs font-light">/year</span></h4>
                  <p className="text-[9px] text-zinc-500 font-light">Billed annually. Most popular tier.</p>
                </button>
              </div>
            </div>

            {/* Stripe Checkout Simulator */}
            <div className="md:col-span-5 bg-gradient-to-br from-zinc-950 to-zinc-900 border border-white/10 p-5 rounded-3xl space-y-6 shadow-2xl relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-royal-blue/5 rounded-full blur-3xl -z-10" />
              
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-royal-blue" />
                  <span className="text-xs uppercase font-mono font-bold tracking-wider text-white">Stripe Checkout</span>
                </div>
                <span className="text-[10.5px] font-mono text-zinc-500">Test Simulator</span>
              </div>

              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                
                {/* Billing Summary */}
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-light">Total Due Today</span>
                  <span className="text-white font-mono font-bold">{selectedPlan === 'monthly' ? '$12.00' : '$99.00'}</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-royal-blue/50"
                    />
                    <CreditCard className="w-4 h-4 text-zinc-600 absolute right-3 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">Expiry</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-royal-blue/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">CVC</label>
                    <input
                      type="password"
                      required
                      placeholder="•••"
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-royal-blue/50"
                    />
                  </div>
                </div>

                {/* Info Note */}
                <div className="flex gap-2 bg-yellow-500/5 border border-yellow-500/10 p-3 rounded-xl text-[10px] text-yellow-500/80 leading-normal">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Sandbox test mode active. Enter any simulated card number (e.g. 4242...) to immediately upgrade and test premium dashboards.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-gradient-to-r from-royal-blue to-emerald-green text-xs font-bold uppercase tracking-widest rounded-xl text-white hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying via Stripe...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      <span>Pay & Activate Upgrade</span>
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
