"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const RealMap = dynamic(() => import('./RealMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#070913] flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-4 border-white/10 border-t-royal-blue rounded-full animate-spin"></div>
      <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">Initializing Vector Telemetry Map Layer...</div>
    </div>
  )
});

interface RealMapWrapperProps {
  origin: string;
  destination: string;
  mode: 'driving' | 'train' | 'flight' | 'bike' | 'walking';
  layerMode: 'vector' | 'satellite' | 'traffic';
  routingTrigger: boolean;
  onDistanceDurationUpdate: (distance: number, duration: string) => void;
  onHotelSelect: (hotelName: string) => void;
}

export default function RealMapWrapper(props: RealMapWrapperProps) {
  return <RealMap {...props} />;
}
