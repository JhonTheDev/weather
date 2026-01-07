import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, ExternalLink } from "lucide-react";

interface ApiKeyInputProps {
  onSubmit: (openWeatherKey: string, mapboxKey: string) => void;
}

const ApiKeyInput = ({ onSubmit }: ApiKeyInputProps) => {
  const [openWeatherKey, setOpenWeatherKey] = useState("");
  const [mapboxKey, setMapboxKey] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (openWeatherKey && mapboxKey) {
      onSubmit(openWeatherKey, mapboxKey);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md glass animate-slide-up">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full gradient-sky flex items-center justify-center mb-4">
            <Key className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Weather Dashboard</CardTitle>
          <CardDescription>
            Enter your API keys to get started with real-time weather data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                WeatherAPI Key
              </label>
              <Input
                type="password"
                placeholder="Enter your WeatherAPI key"
                value={openWeatherKey}
                onChange={(e) => setOpenWeatherKey(e.target.value)}
                className="bg-background"
              />
              <a
                href="https://www.weatherapi.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline inline-flex items-center gap-1"
              >
                Get your free API key <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Mapbox Public Token
              </label>
              <Input
                type="password"
                placeholder="Enter your Mapbox public token"
                value={mapboxKey}
                onChange={(e) => setMapboxKey(e.target.value)}
                className="bg-background"
              />
              <a
                href="https://mapbox.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline inline-flex items-center gap-1"
              >
                Get your Mapbox token <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <Button
              type="submit"
              className="w-full gradient-sky text-primary-foreground hover:opacity-90 transition-opacity"
              disabled={!openWeatherKey || !mapboxKey}
            >
              Start Dashboard
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeyInput;