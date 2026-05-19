// src/components/common/DestinationMap.tsx
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface DestinationMapProps {
  placeName: string;  
}

const DestinationMap = ({ placeName }: DestinationMapProps) => {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!placeName) return;
    
    const fetchCoordinates = async () => {
      setLoading(true);
      setError(false);
      try {
        // Nominatim free geocoding – no API key needed
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}&limit=1`
        );
        const data = await response.json();
        if (data && data[0]) {
          setCoordinates({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          });
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Geocoding error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCoordinates();
  }, [placeName]);

  if (loading) return <div className="h-[400px] bg-gray-200 animate-pulse rounded-lg"></div>;
  if (error || !coordinates) return <div className="h-[400px] bg-gray-100 flex items-center justify-center rounded-lg">Map unavailable</div>;

  return (
    <MapContainer
      center={[coordinates.lat, coordinates.lng]}
      zoom={6}
      style={{ height: '400px', width: '100%', borderRadius: '0.5rem' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[coordinates.lat, coordinates.lng]}>
        <Popup>{placeName}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default DestinationMap;