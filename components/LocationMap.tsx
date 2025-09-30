"use client";
import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface LocationMapProps {
  latitude?: number;
  longitude?: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export default function LocationMap({ latitude = -7.2, longitude = 107.9, onLocationChange }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [inputLat, setInputLat] = useState(latitude.toString());
  const [inputLng, setInputLng] = useState(longitude.toString());

  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current && !map) {
      import('leaflet').then((L) => {
        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        const mapInstance = L.map(mapRef.current!).setView([latitude, longitude], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance);

        const markerInstance = L.marker([latitude, longitude], { draggable: true }).addTo(mapInstance);
        
        markerInstance.on('dragend', (e: any) => {
          const { lat, lng } = e.target.getLatLng();
          setInputLat(lat.toFixed(6));
          setInputLng(lng.toFixed(6));
          onLocationChange(lat, lng);
        });

        mapInstance.on('click', (e: any) => {
          const { lat, lng } = e.latlng;
          markerInstance.setLatLng([lat, lng]);
          setInputLat(lat.toFixed(6));
          setInputLng(lng.toFixed(6));
          onLocationChange(lat, lng);
        });

        setMap(mapInstance);
        setMarker(markerInstance);
      });
    }
  }, [latitude, longitude, map, onLocationChange]);

  const handleLatLngInput = () => {
    const lat = parseFloat(inputLat);
    const lng = parseFloat(inputLng);
    
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      if (map && marker) {
        map.setView([lat, lng], 13);
        marker.setLatLng([lat, lng]);
        onLocationChange(lat, lng);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            value={inputLat}
            onChange={(e) => setInputLat(e.target.value)}
            onBlur={handleLatLngInput}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="-7.200000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            value={inputLng}
            onChange={(e) => setInputLng(e.target.value)}
            onBlur={handleLatLngInput}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="107.900000"
          />
        </div>
      </div>
      
      <div className="relative">
        <div 
          ref={mapRef} 
          className="w-full h-64 rounded-lg border border-gray-300"
          style={{ minHeight: '256px' }}
        />
        <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded shadow-sm text-xs text-gray-600 flex items-center">
          <MapPin size={12} className="mr-1" />
          Klik atau drag marker untuk memilih lokasi
        </div>
      </div>
    </div>
  );
}