"use client";

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Line } from '@react-three/drei';
import * as THREE from 'three';

// Convert Lat/Lon to 3D Cartesian coordinates
const convertLatLngToVector3 = (lat: number, lon: number, radius: number): [number, number, number] => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.sin(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.cos(theta);
  
  return [x, y, z];
};

const preconfiguredPins = [
  { name: "Paris", lat: 48.8566, lon: 2.3522, emoji: "🗼", country: "France" },
  { name: "Kyoto", lat: 35.0116, lon: 135.7681, emoji: "⛩️", country: "Japan" },
  { name: "Santorini", lat: 36.3932, lon: 25.4615, emoji: "🏛️", country: "Greece" },
  { name: "New York City", lat: 40.7128, lon: -74.0060, emoji: "🗽", country: "USA" },
  { name: "Bali", lat: -8.4095, lon: 115.1889, emoji: "🌺", country: "Indonesia" },
  { name: "Machu Picchu", lat: -13.1631, lon: -72.5450, emoji: "🏔️", country: "Peru" },
  { name: "Agra", lat: 27.1751, lon: 78.0421, emoji: "🕌", country: "India (UP)" },
  { name: "Munnar", lat: 10.0889, lon: 77.0595, emoji: "🍃", country: "India (Kerala)" },
  { name: "Shimla", lat: 31.1048, lon: 77.1734, emoji: "❄️", country: "India (HP)" },
  { name: "Panaji", lat: 15.4909, lon: 73.8278, emoji: "🏘️", country: "India (Goa)" },
  { name: "Varanasi", lat: 25.3176, lon: 82.9739, emoji: "🪔", country: "India (UP)" }
];

// Moving Airplane Component
const AirplaneOrbit: React.FC<{
  startPin: [number, number];
  endPin: [number, number];
  speed: number;
  color: string;
}> = ({ startPin, endPin, speed, color }) => {
  const planeRef = useRef<THREE.Group>(null);

  // Generate geodesic flight path curve points above Earth's surface
  const points: THREE.Vector3[] = [];
  const startVec = new THREE.Vector3(...convertLatLngToVector3(startPin[0], startPin[1], 2.0));
  const endVec = new THREE.Vector3(...convertLatLngToVector3(endPin[0], endPin[1], 2.0));

  for (let i = 0; i <= 32; i++) {
    const t = i / 32;
    const p = new THREE.Vector3().lerpVectors(startVec, endVec, t);
    p.normalize();
    const altitude = Math.sin(t * Math.PI) * 0.35; // Peak height at half-way
    p.multiplyScalar(2.0 + altitude);
    points.push(p);
  }

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const t = (elapsed * speed) % 1.0;
    if (planeRef.current && points.length > 0) {
      const idx = Math.floor(t * (points.length - 1));
      planeRef.current.position.copy(points[idx]);

      if (idx < points.length - 1) {
        const dir = new THREE.Vector3().subVectors(points[idx + 1], points[idx]).normalize();
        planeRef.current.lookAt(points[idx].clone().add(dir));
      }
    }
  });

  return (
    <group>
      {/* Flight Path Line */}
      <Line points={points} color={color} lineWidth={0.8} transparent opacity={0.25} />
      
      {/* Airplane Geometry */}
      <group ref={planeRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.02, 0.08, 4]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[0.08, 0.005, 0.015]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
};

// Inner Globe Component
const GlobeModel: React.FC<{ onPinSelect?: (place: any) => void }> = ({ onPinSelect }) => {
  const globeRef = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  // Slow constant rotation
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (globeRef.current) {
      globeRef.current.rotation.y = elapsed * 0.05;
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y = elapsed * 0.08;
    }
  });

  return (
    <group ref={globeRef}>
      {/* Stars Background */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1.5} />

      {/* Holographic Wireframe base globe */}
      <mesh>
        <sphereGeometry args={[2.0, 48, 48]} />
        <meshBasicMaterial 
          color="#1e3a8a" 
          wireframe 
          transparent 
          opacity={0.15} 
        />
      </mesh>

      {/* Solid Inner Core sphere representing Earth with grid lines */}
      <mesh>
        <sphereGeometry args={[1.98, 32, 32]} />
        <meshStandardMaterial 
          color="#030712" 
          roughness={0.8}
          metalness={0.9}
          emissive="#1e3a8a"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Moving Atmosphere/Cloud Layer */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[2.08, 32, 32]} />
        <meshBasicMaterial 
          color="#10b981" 
          wireframe
          transparent 
          opacity={0.06} 
        />
      </mesh>

      {/* Glowing Atmosphere Halo Rim */}
      <mesh>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Satellites Orbits and Satellites */}
      <SatelliteOrbit radius={3.2} speed={0.1} color="#3b82f6" tiltX={0.2} tiltZ={0.3} />
      <SatelliteOrbit radius={3.6} speed={0.08} color="#10b981" tiltX={-0.3} tiltZ={-0.2} />

      {/* Flight Paths and Airplanes */}
      <AirplaneOrbit startPin={[48.8566, 2.3522]} endPin={[35.0116, 135.7681]} speed={0.15} color="#3b82f6" />
      <AirplaneOrbit startPin={[40.7128, -74.0060]} endPin={[36.3932, 25.4615]} speed={0.12} color="#10b981" />
      <AirplaneOrbit startPin={[27.1751, 78.0421]} endPin={[40.7128, -74.0060]} speed={0.18} color="#ef4444" />

      {/* Pins */}
      {preconfiguredPins.map((pin, index) => {
        const position = convertLatLngToVector3(pin.lat, pin.lon, 2.0);
        return (
          <group key={index} position={position}>
            {/* Visual Cone Pin */}
            <mesh 
              rotation={[Math.PI / 2, 0, 0]}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredPin(pin.name);
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={(e) => {
                setHoveredPin(null);
                document.body.style.cursor = 'default';
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (onPinSelect) onPinSelect(pin);
              }}
            >
              <coneGeometry args={[0.06, 0.25, 6]} />
              <meshBasicMaterial 
                color={hoveredPin === pin.name ? "#10b981" : "#ef4444"} 
                toneMapped={false}
              />
            </mesh>

            {/* Glowing Ring around pin */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
              <ringGeometry args={[0.08, 0.12, 16]} />
              <meshBasicMaterial color="#3b82f6" transparent opacity={0.7} side={THREE.DoubleSide} />
            </mesh>

            {/* Hover Tooltip Render */}
            {hoveredPin === pin.name && (
              <HtmlTooltip name={pin.name} country={pin.country} emoji={pin.emoji} />
            )}
          </group>
        );
      })}
    </group>
  );
};

// Satellites orbiting components
const SatelliteOrbit: React.FC<{
  radius: number;
  speed: number;
  color: string;
  tiltX: number;
  tiltZ: number;
}> = ({ radius, speed, color, tiltX, tiltZ }) => {
  const satRef = useRef<THREE.Mesh>(null);
  
  // Create circular path points
  const points = [];
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const angle = elapsed * speed;
    if (satRef.current) {
      satRef.current.position.x = Math.cos(angle) * radius;
      satRef.current.position.z = Math.sin(angle) * radius;
    }
  });

  return (
    <group rotation={[tiltX, 0, tiltZ]}>
      {/* Orbit Ring Line */}
      <Line points={points} color={color} lineWidth={0.5} transparent opacity={0.15} />

      {/* Orbiting Satellite Object */}
      <mesh ref={satRef}>
        <boxGeometry args={[0.06, 0.06, 0.08]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
};

// Tooltip Render inside Canvas (using Billboard positioning)
const HtmlTooltip: React.FC<{ name: string; country: string; emoji: string }> = ({ name, country, emoji }) => {
  const tooltipRef = useRef<THREE.Group>(null);
  useFrame(({ camera }) => {
    if (tooltipRef.current) {
      // Billboard effect: Make tooltip always face the camera
      tooltipRef.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <group ref={tooltipRef} position={[0, 0.4, 0]}>
      <mesh>
        <planeGeometry args={[0.9, 0.45]} />
        <meshBasicMaterial color="#090d16" transparent opacity={0.85} depthTest={false} />
      </mesh>
      {/* Outer border */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(0.9, 0.45)]} />
        <lineBasicMaterial color="#3b82f6" depthTest={false} />
      </lineSegments>
    </group>
  );
};

// Main Export Component wrapper
export const Globe3D: React.FC<{ onPinSelect?: (place: any) => void }> = ({ onPinSelect }) => {
  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#1e3a8a" />
        
        <GlobeModel onPinSelect={onPinSelect} />
        
        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          rotateSpeed={0.5}
          zoomSpeed={0.6}
          autoRotate={false}
        />
      </Canvas>

      {/* Cinematic Info HUD overlay */}
      <div className="absolute top-6 left-6 pointer-events-none font-mono text-[10px] text-[#3b82f6]/80 flex flex-col gap-1 tracking-widest uppercase bg-black/40 backdrop-blur-md p-3 border border-royal-blue/15 rounded-md">
        <div>ORBIT TELEMETRY: 120 FPS</div>
        <div>SYS: LET'S TRAVEL WORLD</div>
        <div>COORDS: LAT/LON CONV [OK]</div>
        <div>RENDER: R3F GRID HUD</div>
      </div>

      <div className="absolute bottom-6 right-6 pointer-events-none font-mono text-[10px] text-emerald-green/80 flex flex-col gap-1 tracking-widest uppercase bg-black/40 backdrop-blur-md p-3 border border-emerald-green/15 rounded-md">
        <div>STATUS: CORE ACTIVE</div>
        <div>NAV MODE: MANUAL ORBIT</div>
        <div>AI LINK: ESTABLISHED</div>
      </div>
    </div>
  );
};

export default Globe3D;
