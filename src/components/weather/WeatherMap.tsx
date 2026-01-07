import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card } from "@/components/ui/card";

interface WeatherMapProps {
  mapboxToken: string;
  onLocationSelect: (lat: number, lng: number) => void;
  currentLocation?: { lat: number; lng: number };
}

const WeatherMap = ({ mapboxToken, onLocationSelect, currentLocation }: WeatherMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      projection: "globe",
      zoom: 2,
      center: [0, 20],
      pitch: 30,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      "top-right"
    );

    map.current.on("style.load", () => {
      map.current?.setFog({
        color: "rgb(220, 230, 240)",
        "high-color": "rgb(180, 200, 220)",
        "horizon-blend": 0.1,
      });
      setIsLoaded(true);
    });

    map.current.on("click", (e) => {
      onLocationSelect(e.lngLat.lat, e.lngLat.lng);
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (!map.current || !currentLocation || !isLoaded) return;

    if (marker.current) {
      marker.current.remove();
    }

    const el = document.createElement("div");
    el.className = "custom-marker";
    el.innerHTML = `
      <div class="w-6 h-6 rounded-full bg-primary shadow-lg border-2 border-primary-foreground flex items-center justify-center">
        <div class="w-2 h-2 rounded-full bg-primary-foreground animate-pulse"></div>
      </div>
    `;

    marker.current = new mapboxgl.Marker(el)
      .setLngLat([currentLocation.lng, currentLocation.lat])
      .addTo(map.current);

    map.current.flyTo({
      center: [currentLocation.lng, currentLocation.lat],
      zoom: 8,
      duration: 2000,
    });
  }, [currentLocation, isLoaded]);

  return (
    <Card className="overflow-hidden glass h-full">
      <div ref={mapContainer} className="w-full h-full min-h-[300px]" />
    </Card>
  );
};

export default WeatherMap;