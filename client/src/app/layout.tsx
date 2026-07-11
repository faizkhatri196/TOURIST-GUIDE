import './globals.css';
import React from 'react';
import Providers from '../components/Providers';
import Navbar from '../components/Navbar';

export const metadata = {
  title: "Let's Travel World — Explore Every Corner of Earth",
  description: "World's most advanced AI-powered travel platform. Immersive 3D explorer and intelligent itinerary planner.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-black text-zinc-100 min-h-screen font-sans">
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
