"use client";

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';
import axios from 'axios';

// Dynamically route all hardcoded localhost API calls to the production Render URL
if (typeof window !== 'undefined') {
  axios.interceptors.request.use((config) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL;
    if (apiBase && config.url && config.url.startsWith('http://localhost:5000')) {
      // Normalize to prevent duplicating /api/ path suffix
      const rootUrl = apiBase.endsWith('/api') ? apiBase.slice(0, -4) : apiBase;
      config.url = config.url.replace('http://localhost:5000', rootUrl);
    }
    return config;
  });
}

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
};
export default Providers;
