"use client";

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, AlertTriangle, CheckCircle, CreditCard, Bell, Download, Map, MessageSquare, PhoneCall, DollarSign, Activity, FileText, Smartphone } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PremiumPage() {
  const { user, token, upgradePremium } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showCreditForm, setShowCreditForm] = useState(false);
  const [showUpiForm, setShowUpiForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [upiId, setUpiId] = useState('');
  const [upiProcessing, setUpiProcessing] = useState(false);
  
  // Premium simulated states
  const [priceAlertDestination, setPriceAlertDestination] = useState('');
  const [activeAlerts, setActiveAlerts] = useState<string[]>([
    "Paris (Flight Alert - $480)",
    "Tokyo (Hotel Alert - $120/night)"
  ]);
  const [downloadedMaps, setDownloadedMaps] = useState<string[]>(['London Offline Map']);
  const [mapInput, setMapInput] = useState('');

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

    if (paymentMethod === 'card') {
      if (!cardNumber || cardNumber.length < 12) {
        alert("Please enter a valid credit card number.");
        return;
      }
    } else {
      if (!upiId || !upiId.includes('@')) {
        alert("Please enter a valid UPI ID (e.g. name@okaxis).");
        return;
      }
    }

    setIsProcessing(true);
    // Simulate secure Stripe/NPCI network delay
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
    <div className="min-h-screen bg-black text-white pt-24 pb-28 md:pb-16 px-6 font-sans relative">
      
      {/* Decorative Radial Backgrounds */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-royal-blue/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-emerald-green/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-green animate-pulse" />
            <span className="font-mono text-[9px] tracking-widest text-zinc-300 uppercase font-bold">
              Travel OS Super-App // Premium v2.8
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            The World's Most Advanced <br />
            <span className="text-gradient bg-gradient-to-r from-white via-royal-blue to-emerald-green">
              AI Travel Concierge
            </span>
          </h1>
          <p className="text-zinc-500 text-xs font-light max-w-xl mx-auto leading-relaxed">
            Manage live flight price predictions, offline vector map overlays, secure document wallets, and automated corporate Saas expenses.
          </p>
        </div>

        {user?.isPremium ? (
          /* ULTRA LEVEL PREMIUM USER CONSOLE */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Status Card & Hero Telemetry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Profile Card */}
              <div className="md:col-span-2 relative overflow-hidden bg-gradient-to-br from-zinc-950 to-zinc-900 border border-emerald-green/30 p-5 rounded-2xl backdrop-blur-xl flex flex-col justify-between h-40">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-green/5 rounded-full blur-2xl -z-10" />
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-emerald-green uppercase tracking-widest font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-green animate-pulse" />
                      Active Subscription
                    </span>
                    <h3 className="text-lg font-bold text-white">Travel OS Premium Member</h3>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-green/10 border border-emerald-green/20 flex items-center justify-center text-emerald-green">
                    <Shield className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">
                  Billed via Stripe Node Sandbox Gateway // Valid until 2027
                </div>
              </div>

              {/* Telemetry Meter 1: AI Planner Capacity */}
              <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex flex-col justify-between h-40">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">AI Neural Planning</span>
                  <Activity className="w-4 h-4 text-royal-blue" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-400">Usage Limit</span>
                    <span className="text-white font-bold">Unlimited</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-royal-blue h-1.5 rounded-full" style={{ width: '85%' }} />
                  </div>
                  <div className="text-[9px] text-zinc-500 font-light font-mono">1,248 queries processed this billing cycle.</div>
                </div>
              </div>

              {/* Telemetry Meter 2: Maps Cache Size */}
              <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex flex-col justify-between h-40">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Offline Vectors Cache</span>
                  <Map className="w-4 h-4 text-emerald-green" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-400">Space Used</span>
                    <span className="text-white font-bold">45.2 MB</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-green h-1.5 rounded-full" style={{ width: '45%' }} />
                  </div>
                  <div className="text-[9px] text-zinc-500 font-light font-mono">IndexedDB storage buffer operational.</div>
                </div>
              </div>

            </div>

            {/* Core Panels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Price Alerts Panel */}
              <div className="md:col-span-6 bg-white/5 border border-white/5 p-5 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <Bell className="w-4 h-4 text-royal-blue" />
                  <h4 className="text-xs uppercase font-mono tracking-wider font-semibold text-white">Live Price drop Alerts</h4>
                </div>
                <form onSubmit={handleAddPriceAlert} className="flex gap-2">
                  <input
                    type="text"
                    value={priceAlertDestination}
                    onChange={(e) => setPriceAlertDestination(e.target.value)}
                    placeholder="Enter destination (e.g. Rome)..."
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-royal-blue/50"
                  />
                  <button type="submit" className="px-4 py-2 bg-royal-blue text-xs font-bold uppercase rounded-xl hover:bg-royal-blue/90 transition-all cursor-pointer">
                    Track
                  </button>
                </form>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {activeAlerts.map((alertItem, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-black/40 px-3 py-2.5 rounded-xl border border-white/5 text-[11px]">
                      <span className="text-zinc-300 font-light">{alertItem}</span>
                      <span className="text-emerald-green font-mono font-semibold text-[10px] uppercase">Active Monitoring</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Offline Maps Panel */}
              <div className="md:col-span-6 bg-white/5 border border-white/5 p-5 rounded-2xl space-y-4">
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
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-emerald-green/50"
                  />
                  <button type="submit" className="px-4 py-2 bg-emerald-green text-black text-xs font-bold uppercase rounded-xl hover:bg-emerald-green/90 transition-all cursor-pointer">
                    Download
                  </button>
                </form>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {downloadedMaps.map((mapItem, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-black/40 px-3 py-2.5 rounded-xl border border-white/5 text-[11px]">
                      <span className="text-zinc-300 font-light">{mapItem}</span>
                      <div className="flex items-center gap-1.5 text-emerald-green">
                        <Download className="w-3.5 h-3.5 animate-bounce" />
                        <span className="font-mono text-[9px] uppercase tracking-wider font-bold">Offline Ready</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency AI Concierge Satellite line */}
              <div className="md:col-span-12 bg-white/5 border border-white/5 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-royal-blue" />
                    <h4 className="text-xs uppercase font-mono tracking-wider font-semibold text-white">Emergency AI Concierge Link</h4>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Satellite Link Operational</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col justify-between h-28 hover:border-royal-blue/30 transition-all duration-300">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Medical SOS</span>
                    <h3 className="text-xs font-bold text-white">Nearest Emergency Hospital</h3>
                    <span className="text-[9.5px] font-mono text-emerald-green font-semibold">112 Dispatch Ready</span>
                  </div>
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col justify-between h-28 hover:border-royal-blue/30 transition-all duration-300">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">GDS Global Sync</span>
                    <h3 className="text-xs font-bold text-white">IATA Auto Rescheduling</h3>
                    <span className="text-[9.5px] font-mono text-emerald-green font-semibold">Automatic re-book</span>
                  </div>
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col justify-between h-28 hover:border-royal-blue/30 transition-all duration-300">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Government Link</span>
                    <h3 className="text-xs font-bold text-white">Consulate Coordination</h3>
                    <span className="text-[9.5px] font-mono text-emerald-green font-semibold">Embassy routing active</span>
                  </div>
                </div>
              </div>

              {/* Travel Co-Pilot Chat Console Preview */}
              <div className="md:col-span-7 bg-white/5 border border-white/5 p-5 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <MessageSquare className="w-4 h-4 text-royal-blue" />
                  <h4 className="text-xs uppercase font-mono tracking-wider font-semibold text-white">Active Co-Pilot Chat Stream</h4>
                </div>
                <div className="space-y-3 text-[11px] font-sans">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-zinc-400">TR</div>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-2.5 max-w-[80%] text-zinc-300 font-light leading-relaxed">
                      "Is the weather fine in Paris for drone photography today?"
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <div className="bg-royal-blue/10 border border-royal-blue/20 rounded-2xl p-2.5 max-w-[80%] text-zinc-300 font-light leading-relaxed text-right">
                      "Checking live telemetry... Paris winds are 12km/h (Safe for drone takeoff). Note: No-fly zone active near Eiffel Tower."
                    </div>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-royal-blue to-emerald-green flex items-center justify-center text-[10px] text-white">AI</div>
                  </div>
                </div>
              </div>

              {/* Stripe Billing Portal simulator */}
              <div className="md:col-span-5 bg-white/5 border border-white/5 p-5 rounded-2xl space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <FileText className="w-4 h-4 text-emerald-green" />
                    <h4 className="text-xs uppercase font-mono tracking-wider font-semibold text-white">Stripe Billing Portal</h4>
                  </div>
                  
                  {/* Card Info */}
                  <div className="flex items-center justify-between bg-black/40 border border-white/5 p-3 rounded-xl text-xs font-mono">
                    <span className="text-zinc-500">Active Card</span>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-royal-blue" />
                      <span className="text-white">Visa ending in 4242</span>
                    </div>
                  </div>

                  {/* Billing Invoices */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-1">
                      <span className="text-zinc-500">INVOICE ID</span>
                      <span className="text-zinc-550">DATE</span>
                      <span className="text-zinc-500 text-right">AMOUNT</span>
                    </div>
                    <div className="flex justify-between items-center text-[10.5px] font-mono">
                      <span className="text-zinc-300">#INV-2026-0041</span>
                      <span className="text-zinc-500">TODAY</span>
                      <span className="text-emerald-green font-semibold text-right">PAID</span>
                    </div>
                  </div>
                </div>

                <div className="text-[9px] text-zinc-500 font-mono tracking-wide leading-relaxed border-t border-white/5 pt-4">
                  Managed safely inside the sandboxed mock stripe billing controller. No actual card charges are emitted.
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

            {/* Stripe & UPI Checkout Simulator */}
            <div className="md:col-span-5 bg-gradient-to-br from-zinc-950 to-zinc-900 border border-white/10 p-5 rounded-3xl space-y-5 shadow-2xl relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-royal-blue/5 rounded-full blur-3xl -z-10" />
              
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-royal-blue" />
                  <span className="text-xs uppercase font-mono font-bold tracking-wider text-white">Secure checkout</span>
                </div>
                <span className="text-[10.5px] font-mono text-zinc-500">Test Simulator</span>
              </div>

              {/* Payment Method Tabs */}
              <div className="flex gap-2 p-1 bg-black/40 border border-white/5 rounded-xl text-[10px]">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 py-1.5 rounded-lg font-mono uppercase transition-all cursor-pointer ${
                    paymentMethod === 'card' ? 'bg-white/10 text-white font-bold' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  💳 Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex-1 py-1.5 rounded-lg font-mono uppercase transition-all cursor-pointer ${
                    paymentMethod === 'upi' ? 'bg-white/10 text-white font-bold' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  📱 UPI (India)
                </button>
              </div>

              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                
                {/* Billing Summary */}
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-light">Total Due Today</span>
                  <span className="text-white font-mono font-bold">{selectedPlan === 'monthly' ? '$12.00' : '$99.00'}</span>
                </div>

                {paymentMethod === 'card' ? (
                  /* CARD FORM */
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="4242 4242 4242 4242"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                          className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-zinc-655 focus:outline-none focus:border-royal-blue/50"
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
                          className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-zinc-655 focus:outline-none focus:border-royal-blue/50"
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
                          className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-zinc-655 focus:outline-none focus:border-royal-blue/50"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* UPI FORM */
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">UPI ID</label>
                      <input
                        type="text"
                        required
                        placeholder="explorer@ybl"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white placeholder-zinc-655 focus:outline-none focus:border-royal-blue/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block text-center">Scan QR Code to pay</label>
                      <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-white/10 w-40 h-40 mx-auto">
                        <svg className="w-32 h-32 text-black" viewBox="0 0 100 100">
                          <rect x="5" y="5" width="25" height="25" fill="currentColor" />
                          <rect x="10" y="10" width="15" height="15" fill="white" />
                          <rect x="13" y="13" width="9" height="9" fill="currentColor" />
                          
                          <rect x="70" y="5" width="25" height="25" fill="currentColor" />
                          <rect x="75" y="10" width="15" height="15" fill="white" />
                          <rect x="78" y="13" width="9" height="9" fill="currentColor" />

                          <rect x="5" y="70" width="25" height="25" fill="currentColor" />
                          <rect x="10" y="75" width="15" height="15" fill="white" />
                          <rect x="13" y="78" width="9" height="9" fill="currentColor" />

                          <rect x="40" y="10" width="10" height="5" fill="currentColor" />
                          <rect x="45" y="20" width="5" height="15" fill="white" />
                          <rect x="5" y="40" width="15" height="5" fill="currentColor" />
                          <rect x="25" y="35" width="10" height="10" fill="currentColor" />
                          <rect x="40" y="40" width="25" height="5" fill="currentColor" />
                          <rect x="50" y="50" width="10" height="20" fill="currentColor" />
                          <rect x="75" y="45" width="15" height="15" fill="currentColor" />
                          <rect x="35" y="75" width="20" height="10" fill="currentColor" />
                          <rect x="70" y="70" width="10" height="10" fill="currentColor" />
                          <rect x="85" y="85" width="10" height="10" fill="currentColor" />
                        </svg>
                        <span className="text-[8px] font-sans font-semibold text-zinc-500 uppercase tracking-widest mt-2">BHIM UPI QR</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Info Note */}
                <div className="flex gap-2 bg-yellow-500/5 border border-yellow-500/10 p-3 rounded-xl text-[10px] text-yellow-500/80 leading-normal">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>
                    {paymentMethod === 'card' 
                      ? "Sandbox test mode active. Enter any simulated card number (e.g. 4242...) to immediately upgrade and test."
                      : "UPI sandbox active. Enter any mock ID (e.g. name@upi) and scan/verify to activate."
                    }
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
                      <span>{paymentMethod === 'card' ? "Verifying via Stripe..." : "Checking UPI NPCI gateway..."}</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      <span>{paymentMethod === 'card' ? "Pay & Activate Upgrade" : "Verify UPI & Activate"}</span>
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
