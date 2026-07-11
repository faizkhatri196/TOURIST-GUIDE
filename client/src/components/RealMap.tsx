"use client";

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Fix Leaflet default icon URL issues in Next.js builds
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

interface RealMapProps {
  origin: string;
  destination: string;
  mode: 'driving' | 'train' | 'flight' | 'bike' | 'walking';
  layerMode: 'vector' | 'satellite' | 'traffic';
  routingTrigger: boolean;
  onDistanceDurationUpdate: (distance: number, duration: string) => void;
  onHotelSelect: (hotelName: string) => void;
}

export default function RealMap({
  origin,
  destination,
  mode,
  layerMode,
  routingTrigger,
  onDistanceDurationUpdate,
  onHotelSelect
}: RealMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  
  // Map markers
  const originMarkerRef = useRef<L.Marker | null>(null);
  const destMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);
  const hotelMarkersGroupRef = useRef<L.LayerGroup | null>(null);

  // Keep track of animation timer
  const animIntervalRef = useRef<any>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create Leaflet Map centered in India by default
    const map = L.map(mapContainerRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: false
    });
    mapRef.current = map;

    // Add Zoom Control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Create LayerGroup for hotel markers
    const hotelGroup = L.layerGroup().addTo(map);
    hotelMarkersGroupRef.current = hotelGroup;

    return () => {
      if (animIntervalRef.current) clearInterval(animIntervalRef.current);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Map Layer based on layerMode
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'; // Vector (Dark)
    let attribution = '&copy; CartoDB';

    if (layerMode === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri &mdash; Source: Esri';
    } else if (layerMode === 'traffic') {
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'; // Traffic standard OpenStreetMap
      attribution = '&copy; OpenStreetMap contributors';
    }

    const tileLayer = L.tileLayer(url, { attribution }).addTo(map);
    tileLayerRef.current = tileLayer;
  }, [layerMode]);

  // Geocode Nominatim Helper
  const geocodeLocation = async (query: string): Promise<[number, number] | null> => {
    try {
      const cleanQuery = query.split(',')[0];
      const res = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: cleanQuery,
          format: 'json',
          limit: 1
        }
      });
      if (res.data && res.data.length > 0) {
        return [parseFloat(res.data[0].lat), parseFloat(res.data[0].lon)];
      }
      return null;
    } catch (err) {
      console.error("Geocoding failed:", err);
      return null;
    }
  };

  // Fetch OSRM Route Helper
  const fetchOSRMRoute = async (start: [number, number], end: [number, number]): Promise<any> => {
    try {
      const res = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
      );
      if (res.data && res.data.routes && res.data.routes.length > 0) {
        return res.data.routes[0];
      }
      return null;
    } catch (err) {
      console.error("OSRM Routing failed:", err);
      return null;
    }
  };

  // Query Overpass API for Real Hotels near destination
  const fetchLocalHotels = async (lat: number, lon: number) => {
    const map = mapRef.current;
    const hotelGroup = hotelMarkersGroupRef.current;
    if (!map || !hotelGroup) return;

    hotelGroup.clearLayers();

    try {
      // Query 6km around the destination coordinate for tourism=hotel nodes
      const query = `[out:json];node(around:6000, ${lat}, ${lon})[tourism=hotel];out 25;`;
      const res = await axios.post('https://overpass-api.de/api/interpreter', query, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      if (res.data && res.data.elements) {
        res.data.elements.forEach((hotel: any) => {
          if (!hotel.lat || !hotel.lon) return;

          const hotelName = hotel.tags.name || "Local Stays / Hotel";
          
          // Custom gold-hologram marker icon matching Airbnb/Apple style
          const hotelIcon = L.divIcon({
            html: `<div class="w-6 h-6 bg-amber-500/20 border border-amber-500 rounded-full flex items-center justify-center text-[10px] shadow-lg animate-pulse" title="${hotelName}">🏨</div>`,
            className: 'custom-hotel-icon',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          const popupContent = document.createElement('div');
          popupContent.className = 'p-2 text-zinc-900 bg-white rounded-xl text-xs font-sans min-w-[150px]';
          popupContent.innerHTML = `
            <div class="font-bold border-b pb-1 mb-1">${hotelName}</div>
            <div class="text-[10px] text-zinc-500 mb-2">Category: Hotel Stays</div>
            <button id="btn-dossier-${hotel.id}" class="w-full mb-1 py-1 bg-blue-600 text-white rounded text-[10px] font-bold uppercase">⚡ Query AI Dossier</button>
            <button id="btn-book-${hotel.id}" class="w-full py-1 bg-emerald-600 text-white rounded text-[10px] font-bold uppercase">🏨 Book Stay</button>
          `;

          const marker = L.marker([hotel.lat, hotel.lon], { icon: hotelIcon })
            .bindPopup(popupContent)
            .addTo(hotelGroup);

          marker.on('popupopen', () => {
            document.getElementById(`btn-dossier-${hotel.id}`)?.addEventListener('click', () => {
              onHotelSelect(hotelName);
              map.closePopup();
            });
            document.getElementById(`btn-book-${hotel.id}`)?.addEventListener('click', () => {
              window.location.href = `/hotels?search=${encodeURIComponent(hotelName)}`;
            });
          });
        });
      }
    } catch (err) {
      console.error("Overpass hotels fetch failed:", err);
    }
  };

  // Run routing trigger
  useEffect(() => {
    if (!origin.trim() || !destination.trim()) return;

    const plotRouteAndLoadSights = async () => {
      const map = mapRef.current;
      if (!map) return;

      const startCoords = await geocodeLocation(origin);
      const endCoords = await geocodeLocation(destination);

      if (!startCoords || !endCoords) {
        alert("Failed to geocode one of the route coordinates. Verify spellings.");
        return;
      }

      if (animIntervalRef.current) clearInterval(animIntervalRef.current);
      if (routePolylineRef.current) map.removeLayer(routePolylineRef.current);
      if (originMarkerRef.current) map.removeLayer(originMarkerRef.current);
      if (destMarkerRef.current) map.removeLayer(destMarkerRef.current);
      if (vehicleMarkerRef.current) map.removeLayer(vehicleMarkerRef.current);

      // Plot markers
      const startIcon = L.divIcon({
        html: `<div class="w-8 h-8 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center text-xs shadow-lg animate-bounce">🟢</div>`,
        className: 'start-marker-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const endIcon = L.divIcon({
        html: `<div class="w-8 h-8 bg-red-500/20 border-2 border-red-500 rounded-full flex items-center justify-center text-xs shadow-lg animate-bounce">🚩</div>`,
        className: 'end-marker-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      originMarkerRef.current = L.marker(startCoords, { icon: startIcon }).addTo(map)
        .bindPopup(`<div class="text-zinc-900 text-xs font-bold">Origin: ${origin}</div>`);
      
      destMarkerRef.current = L.marker(endCoords, { icon: endIcon }).addTo(map)
        .bindPopup(`<div class="text-zinc-900 text-xs font-bold">Destination: ${destination}</div>`);

      const routeData = await fetchOSRMRoute(startCoords, endCoords);
      
      let routeCoords: [number, number][] = [];
      let finalDistance = 0;
      let finalDuration = "4.5 Hours";

      if (routeData) {
        routeCoords = routeData.geometry.coordinates.map((c: any) => [c[1], c[0]]);
        finalDistance = parseFloat((routeData.distance / 1000).toFixed(0)); // km
        
        const rawDur = routeData.duration / 3600; // hours
        finalDuration = rawDur < 1 ? `${(rawDur * 60).toFixed(0)} Mins` : `${rawDur.toFixed(1)} Hours`;
      } else {
        routeCoords = [startCoords, endCoords];
        const rad = Math.PI / 180;
        const R = 6371;
        const dLat = (endCoords[0] - startCoords[0]) * rad;
        const dLon = (endCoords[1] - startCoords[1]) * rad;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(startCoords[0]*rad) * Math.cos(endCoords[0]*rad) * 
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        finalDistance = parseFloat((R * c).toFixed(0));
      }

      const polylineColor = layerMode === 'satellite' ? '#10b981' : '#3b82f6';
      routePolylineRef.current = L.polyline(routeCoords, {
        color: polylineColor,
        weight: 4,
        opacity: 0.8,
        dashArray: '5, 8'
      }).addTo(map);

      map.fitBounds(routePolylineRef.current.getBounds(), { padding: [50, 50] });
      onDistanceDurationUpdate(finalDistance, finalDuration);

      let vehicleHtml = '🚗';
      if (mode === 'flight') vehicleHtml = '✈️';
      else if (mode === 'train') vehicleHtml = '🚇';
      else if (mode === 'bike') vehicleHtml = '🚲';
      else if (mode === 'walking') vehicleHtml = '🚶';

      const vehicleIcon = L.divIcon({
        html: `<div class="w-8 h-8 bg-black/85 border border-white/20 rounded-full flex items-center justify-center text-sm shadow-xl animate-pulse" style="z-index: 1000">${vehicleHtml}</div>`,
        className: 'vehicle-marker-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      vehicleMarkerRef.current = L.marker(routeCoords[0], { icon: vehicleIcon }).addTo(map);

      let step = 0;
      const speed = mode === 'flight' ? 3 : mode === 'train' ? 12 : mode === 'driving' ? 25 : mode === 'bike' ? 45 : 75;
      
      animIntervalRef.current = setInterval(() => {
        if (!vehicleMarkerRef.current || routeCoords.length === 0) return;
        step = (step + 1) % routeCoords.length;
        vehicleMarkerRef.current.setLatLng(routeCoords[step]);
      }, speed);

      // Download Real Hotels near Destination
      fetchLocalHotels(endCoords[0], endCoords[1]);
    };

    plotRouteAndLoadSights();

    return () => {
      if (animIntervalRef.current) clearInterval(animIntervalRef.current);
    };
  }, [routingTrigger, mode]);

  return (
    <div className="w-full h-full relative z-0 rounded-2xl overflow-hidden border border-white/10 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full" style={{ background: '#070913' }} />
    </div>
  );
}
