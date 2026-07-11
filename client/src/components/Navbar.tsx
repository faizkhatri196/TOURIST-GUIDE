"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Compass, Map, Calendar, Hotel, User, LogOut, Compass as LogoIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navLinks = [
    { name: 'Explore', href: '/explore', icon: Compass },
    { name: 'AI Planner', href: '/planner', icon: Calendar },
    { name: 'Interactive Map', href: '/map', icon: Map },
    { name: 'Hotels', href: '/hotels', icon: Hotel },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-black/20 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-royal-blue to-emerald-green flex items-center justify-center text-white shadow-lg shadow-royal-blue/20 group-hover:scale-105 transition-transform">
          <LogoIcon className="w-5 h-5 animate-pulse" />
        </div>
        <span className="font-sans font-bold tracking-wider text-white text-lg group-hover:text-emerald-green transition-colors">
          Let's Travel <span className="text-emerald-green group-hover:text-white">World</span>
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2 py-1 backdrop-blur-sm">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-royal-blue to-emerald-green text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {link.name}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 text-xs tracking-wider uppercase font-medium transition-all ${
                pathname === '/profile'
                  ? 'bg-white text-black'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{user.name.split(' ')[0]}</span>
              <span className="bg-emerald-green text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-1">
                Lvl {user.stats?.level || 1}
              </span>
            </Link>
            <button
              onClick={logout}
              className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-red-400 hover:bg-white/5 border border-white/5 transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/auth"
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-white text-black hover:bg-zinc-200 text-xs font-semibold uppercase tracking-wider transition-all duration-300"
          >
            Sign In
          </Link>
        )}
      </div>

      {/* Premium Bottom Floating Nav Bar (iOS/Android Native Style) for Mobile Devices */}
      <div className="fixed bottom-5 left-4 right-4 md:hidden z-[9999] bg-[#090d16]/80 border border-white/10 backdrop-blur-xl rounded-2xl px-2 py-2 flex justify-around items-center shadow-2xl shadow-black/80">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center gap-1.5 py-1 px-3.5 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'text-emerald-green scale-105 bg-white/5 font-semibold' 
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[8px] tracking-wider uppercase font-sans font-medium">{link.name.replace('AI ', '').replace('Interactive ', '')}</span>
            </Link>
          );
        })}
        
        {/* Profile / Account Tab */}
        <Link
          href={user ? "/profile" : "/auth"}
          className={`flex flex-col items-center gap-1.5 py-1 px-3.5 rounded-xl transition-all duration-300 ${
            pathname === '/profile' || pathname === '/auth'
              ? 'text-emerald-green scale-105 bg-white/5 font-semibold'
              : 'text-zinc-500 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span className="text-[8px] tracking-wider uppercase font-sans font-medium">{user ? 'Profile' : 'Account'}</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
