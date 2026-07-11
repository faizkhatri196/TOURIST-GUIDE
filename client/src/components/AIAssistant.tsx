"use client";

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, Sparkles, Mic, Volume2 } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  parts: string;
  time: string;
}

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      parts: "Namaste! 👋 I am your Let's Travel World AI assistant. Ask me anything about destination safety, packing, route guides, hidden gems, visa requirements, or local festivals!",
      time: 'Just now'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const msgsEndRef = useRef<HTMLDivElement>(null);

  // Voice recognition states
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        rec.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          setInput(text);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice Speech Recognition is not supported or accessible in this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  useEffect(() => {
    if (msgsEndRef.current) {
      msgsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    if (!textToSend) setInput('');

    const newMsg: ChatMessage = {
      role: 'user',
      parts: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setLoading(true);

    try {
      // Map history to server schema
      const history = messages.map(m => ({
        role: m.role,
        parts: m.parts
      }));

      const response = await axios.post('http://localhost:5000/api/ai/chat', {
        message: text,
        history
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          parts: response.data.response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          parts: "My communication link was briefly interrupted. Please check if the server is running or try again shortly.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "🌤 Weather & packing for Ladakh",
    "🕌 3-day itinerary for Agra",
    "🍃 Best food in Munnar",
    "✈️ Schengen visa checklist"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] h-[500px] mb-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col shadow-2xl overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-right">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-royal-blue/30 to-emerald-green/30 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-royal-blue to-emerald-green flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-white text-xs font-semibold tracking-wider font-sans uppercase">WanderAI Core</h4>
                <p className="text-[10px] text-emerald-green font-mono uppercase">ONLINE // HYPERTHREAD</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white hover:bg-white/5 p-1 rounded-full transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs scrollbar-thin">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed text-zinc-100 ${
                    msg.role === 'user'
                      ? 'bg-royal-blue/30 border border-royal-blue/30 rounded-tr-none'
                      : 'bg-white/5 border border-white/10 rounded-tl-none'
                  }`}
                >
                  {/* Basic markdown renderer fallback */}
                  <div className="whitespace-pre-line font-light">
                    {msg.parts}
                  </div>
                </div>
                <span className="text-[9px] text-zinc-500 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-start">
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-3 max-w-[85%] flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-green rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-green rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-green rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            <div ref={msgsEndRef} />
          </div>

          {/* Quick options */}
          <div className="px-4 py-2 flex flex-wrap gap-1.5 bg-black/10 border-t border-white/5">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q.replace(/[🌤🕌🍃✈️]/g, '').trim())}
                className="text-[10px] text-zinc-400 hover:text-white hover:bg-white/5 border border-white/10 px-2 py-1 rounded-full transition-all"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Panel */}
          <div className="p-3 bg-black/30 border-t border-white/5 flex items-center gap-2">
            <button
              onClick={toggleListening}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isListening 
                  ? 'bg-red-500/20 text-red-500 border-red-500/40 animate-pulse' 
                  : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
              }`}
              title={isListening ? "Listening..." : "Voice Search"}
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? "Listening..." : "Query travel intelligence..."}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-royal-blue/50"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 rounded-xl bg-gradient-to-r from-royal-blue to-emerald-green text-white hover:opacity-90 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating sphere toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-royal-blue to-emerald-green flex items-center justify-center text-white shadow-xl shadow-royal-blue/30 hover:scale-105 border border-white/15 transition-all duration-300"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Sparkles className="w-6 h-6 animate-pulse" />
        )}
      </button>
    </div>
  );
};

export default AIAssistant;
