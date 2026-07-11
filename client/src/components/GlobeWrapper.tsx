"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const Globe3D = dynamic(() => import('./Globe3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black">
      <div className="w-20 h-20 border-4 border-royal-blue/30 border-t-emerald-green animate-spin rounded-full mb-4"></div>
      <p className="text-muted-foreground font-mono text-sm tracking-widest animate-pulse">
        CALIBRATING 3D GLOBAL TELEMETRY...
      </p>
    </div>
  )
});

export const GlobeWrapper: React.FC<{ onPinSelect?: (place: any) => void }> = (props) => {
  return <Globe3D {...props} />;
};

export default GlobeWrapper;
