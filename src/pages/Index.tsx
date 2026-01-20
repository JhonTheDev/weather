import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import WeatherMap from "@/components/weather/WeatherMap";
import CurrentWeather from "@/components/weather/CurrentWeather";
import HistoricalChart from "@/components/weather/HistoricalChart";
import LocationSearch from "@/components/weather/LocationSearch";
import WeatherForecast from "@/components/weather/WeatherForecast";
import { ForecastDay } from "@/types/weather";
import {
  fetchCurrentWeather,
  fetchForecast,
  fetchWeatherByCity,
  generateHistoricalData,
  CurrentWeatherData,
  ForecastItem,
  HistoricalItem,
} from "@/api/weatherApi";
import { Bookmark, Cloud, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const OPENWEATHER_KEY = import.meta.env.VITE_WEATHERAPI_KEY as string;
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string;

const Index = () => {
  const { toast } = useToast();
  const [apiKeys] = useState({ openWeather: OPENWEATHER_KEY, mapbox: MAPBOX_TOKEN });
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeatherData | null>(null);
  const [sevenDayForecast, setSevenDayForecast] = useState<ForecastDay[]>([]);
  const [historical, setHistorical] = useState<HistoricalItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Função para converter dados da OpenWeather para estrutura de 7 dias
  const convertToForecastDay = (forecastItems: ForecastItem[]): ForecastDay[] => {
    const dailyForecast: { [key: string]: ForecastItem[] } = {};
    
    forecastItems.forEach(item => {
      const date = new Date(item.date);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!dailyForecast[dateKey]) {
        dailyForecast[dateKey] = [];
      }
      dailyForecast[dateKey].push(item);
    });
    
    // Converter para ForecastDay[] e ordenar por data
    return Object.entries(dailyForecast)
      .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
      .map(([date, items]) => {
        const temps = items.map(item => item.temp);
        const maxTemp = Math.max(...temps);
        const minTemp = Math.min(...temps);
        const avgTemp = temps.reduce((a, b) => a + b) / temps.length;
        
        // Pegar a condição do meio do dia
        const middayCondition = items[Math.min(4, items.length - 1)];
        
        return {
          date,
          date_epoch: new Date(date).getTime() / 1000,
          day: {
            maxtemp_c: maxTemp,
            mintemp_c: minTemp,
            avgtemp_c: avgTemp,
            maxtemp_f: (maxTemp * 9/5) + 32,
            mintemp_f: (minTemp * 9/5) + 32,
            avgtemp_f: (avgTemp * 9/5) + 32,
            condition: {
              text: middayCondition?.description || "Clear",
              icon: getWeatherIcon(middayCondition?.description || "Clear"),
            },
            maxwind_kph: 0,
            totalprecip_mm: items.reduce((sum, item) => sum + (item.precipitation || 0), 0),
            avghumidity: Math.round(items.reduce((sum, item) => sum + item.humidity, 0) / items.length),
            daily_chance_of_rain: Math.round(Math.random() * 100),
            daily_chance_of_snow: 0,
            uv: 5,
          },
          hour: items.map(item => ({
            time: item.date.split(' ')[1] || '00:00',
            temp_c: item.temp,
            condition: {
              text: item.description,
              icon: getWeatherIcon(item.description),
            },
            wind_kph: 0,
            humidity: item.humidity,
            chance_of_rain: 0,
          }))
        };
      })
      .slice(0, 7);
  };

  // Função auxiliar para obter ícone baseado na descrição
  const getWeatherIcon = (description: string): string => {
    const desc = description.toLowerCase();
    if (desc.includes('snow')) return '//cdn.weatherapi.com/weather/64x64/day/338.png';
    if (desc.includes('rain') || desc.includes('drizzle')) return '//cdn.weatherapi.com/weather/64x64/day/266.png';
    if (desc.includes('cloud')) return '//cdn.weatherapi.com/weather/64x64/day/116.png';
    if (desc.includes('clear')) return '//cdn.weatherapi.com/weather/64x64/day/113.png';
    return '//cdn.weatherapi.com/weather/64x64/day/116.png';
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const fetchWeatherData = useCallback(
    async (lat: number, lng: number) => {
      if (!apiKeys.openWeather) return;

      setLoading(true);
      try {
        const [weather, forecastData] = await Promise.all([
          fetchCurrentWeather(lat, lng, apiKeys.openWeather),
          fetchForecast(lat, lng, apiKeys.openWeather),
        ]);

        setCurrentWeather(weather);
        setHistorical(generateHistoricalData(lat));
        setLocation({ lat, lng });
        
        const sevenDayData = convertToForecastDay(forecastData);
        setSevenDayForecast(sevenDayData);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao buscar dados do clima. Verifique sua chave de API.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [apiKeys, toast]
  );

  const handleLocationSelect = useCallback(
    (lat: number, lng: number) => {
      fetchWeatherData(lat, lng);
    },
    [fetchWeatherData]
  );

  const handleCitySearch = useCallback(
    async (city: string) => {
      if (!apiKeys.openWeather) return;

      setLoading(true);
      try {
        const { weather, lat, lon } = await fetchWeatherByCity(city, apiKeys.openWeather);
        setCurrentWeather(weather);
        setLocation({ lat, lng: lon });

        const forecastData = await fetchForecast(lat, lon, apiKeys.openWeather);
        setHistorical(generateHistoricalData(lat));
        
        const sevenDayData = convertToForecastDay(forecastData);
        setSevenDayForecast(sevenDayData);
      } catch (error) {
        toast({
          title: "Cidade não encontrada",
          description: "Tente um nome de cidade diferente.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [apiKeys, toast]
  );

  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast({
        title: "Erro",
        description: "Geolocalização não é suportada pelo seu navegador.",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherData(position.coords.latitude, position.coords.longitude);
      },
      () => {
        toast({
          title: "Erro",
          description: "Não foi possível obter sua localização. Permita o acesso à localização.",
          variant: "destructive",
        });
      }
    );
  }, [fetchWeatherData, toast]);

  useEffect(() => {
    handleUseCurrentLocation();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-sky flex items-center justify-center">
                <Cloud className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Weather Supreme</h1>
                <p className="text-xs text-muted-foreground">The-Best Real-time weather</p>
              </div>
            </div>

            <div className="flex-1 max-w-xl hidden md:block">
              <LocationSearch
                onSearch={handleCitySearch}
                onUseCurrentLocation={handleUseCurrentLocation}
                loading={loading}
              />
            </div>

            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile search */}
          <div className="mt-4 md:hidden">
            <LocationSearch
              onSearch={handleCitySearch}
              onUseCurrentLocation={handleUseCurrentLocation}
              loading={loading}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Map */}
          <div className="lg:col-span-1 h-[400px] lg:h-auto lg:min-h-[600px]">
            <WeatherMap
              mapboxToken={apiKeys.mapbox}
              onLocationSelect={handleLocationSelect}
              currentLocation={location || undefined}
            />
          </div>

          {/* Right Column - Weather Data */}
          <div className="lg:col-span-2 space-y-6">
            <CurrentWeather data={currentWeather} loading={loading} />
            
            {/* Weekly Forecast */}
            <div className="p-6 bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
              <div className="flex items-center gap-2 mb-6">
                <Bookmark className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Previsão Semanal</h3>
              </div>
              <WeatherForecast forecast={sevenDayForecast} /> 
            </div>
            
            <HistoricalChart data={historical} loading={loading} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by OpenWeather API & Mapbox
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;