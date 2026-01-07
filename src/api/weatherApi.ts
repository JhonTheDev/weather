const WEATHERAPI_BASE = "https://api.weatherapi.com/v1";

export interface CurrentWeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  visibility: number;
  description: string;
  icon: string;
  city: string;
  country: string;
  pressure: number;
  uv: number;
  cloud: number;
  // Campos adicionais para compatibilidade com CurrentWeather.tsx
  name: string;
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  clouds: {
    all: number;
  };
  sys: {
    country: string;
  };
}

export interface ForecastItem {
  date: string;
  temp: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  description: string;
  precipitation: number;  // OBRIGATÓRIO agora
}

export interface HistoricalItem {
  month: string;
  avgTemp: number;
  precipitation: number;
}

export const fetchCurrentWeather = async (
  lat: number,
  lon: number,
  apiKey: string
): Promise<CurrentWeatherData> => {
  const response = await fetch(
    `${WEATHERAPI_BASE}/current.json?key=${apiKey}&q=${lat},${lon}`
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch current weather");
  }
  
  const data = await response.json();
  
  const windSpeed = data.current.wind_kph / 3.6;
  const temp = data.current.temp_c;
  const feelsLike = data.current.feelslike_c;
  const humidity = data.current.humidity;
  const pressure = data.current.pressure_mb;
  const cloud = data.current.cloud;
  
  return {
    temp,
    feels_like: feelsLike,
    humidity,
    wind_speed: windSpeed,
    visibility: data.current.vis_km * 1000,
    description: data.current.condition.text,
    icon: data.current.condition.icon,
    city: data.location.name,
    country: data.location.country,
    pressure,
    uv: data.current.uv,
    cloud,
    // Campos adicionais para compatibilidade
    name: data.location.name,
    dt: data.location.localtime_epoch || Math.floor(Date.now() / 1000),
    main: {
      temp,
      feels_like: feelsLike,
      humidity,
      pressure,
    },
    weather: [{
      description: data.current.condition.text,
      icon: data.current.condition.icon.split('/').pop()?.replace('.png', '') || '',
    }],
    wind: {
      speed: windSpeed,
    },
    clouds: {
      all: cloud,
    },
    sys: {
      country: data.location.country,
    },
  };
};

export const fetchWeatherByCity = async (
  city: string,
  apiKey: string
): Promise<{ weather: CurrentWeatherData; lat: number; lon: number }> => {
  const response = await fetch(
    `${WEATHERAPI_BASE}/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`
  );
  
  if (!response.ok) {
    throw new Error("City not found");
  }
  
  const data = await response.json();
  
  const windSpeed = data.current.wind_kph / 3.6;
  const temp = data.current.temp_c;
  const feelsLike = data.current.feelslike_c;
  const humidity = data.current.humidity;
  const pressure = data.current.pressure_mb;
  const cloud = data.current.cloud;
  
  return {
    weather: {
      temp,
      feels_like: feelsLike,
      humidity,
      wind_speed: windSpeed,
      visibility: data.current.vis_km * 1000,
      description: data.current.condition.text,
      icon: data.current.condition.icon,
      city: data.location.name,
      country: data.location.country,
      pressure,
      uv: data.current.uv,
      cloud,
      // Campos adicionais para compatibilidade
      name: data.location.name,
      dt: data.location.localtime_epoch || Math.floor(Date.now() / 1000),
      main: {
        temp,
        feels_like: feelsLike,
        humidity,
        pressure,
      },
      weather: [{
        description: data.current.condition.text,
        icon: data.current.condition.icon.split('/').pop()?.replace('.png', '') || '',
      }],
      wind: {
        speed: windSpeed,
      },
      clouds: {
        all: cloud,
      },
      sys: {
        country: data.location.country,
      },
    },
    lat: data.location.lat,
    lon: data.location.lon,
  };
};

export const fetchForecast = async (
  lat: number,
  lon: number,
  apiKey: string
): Promise<ForecastItem[]> => {
  const response = await fetch(
    `${WEATHERAPI_BASE}/forecast.json?key=${apiKey}&q=${lat},${lon}&days=7`
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch forecast");
  }
  
  const data = await response.json();
  
  return data.forecast.forecastday.map((day: any) => ({
    date: new Date(day.date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    temp: day.day.avgtemp_c,
    temp_min: day.day.mintemp_c,
    temp_max: day.day.maxtemp_c,
    humidity: day.day.avghumidity,
    description: day.day.condition.text,
    precipitation: day.day.totalprecip_mm || 0,
  }));
};

// Generate simulated historical data based on location
export const generateHistoricalData = (lat: number): HistoricalItem[] => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const isNorthernHemisphere = lat >= 0;
  
  // Base temperature curve for northern hemisphere
  const northernTemps = [-2, 0, 5, 12, 18, 23, 26, 25, 20, 13, 6, 1];
  const southernTemps = [25, 24, 21, 16, 11, 7, 6, 8, 12, 16, 20, 23];
  
  const baseTemps = isNorthernHemisphere ? northernTemps : southernTemps;
  
  // Adjust based on latitude (closer to equator = warmer)
  const latEffect = Math.abs(lat) / 90;
  const equatorBonus = (1 - latEffect) * 15;
  
  return months.map((month, index) => ({
    month,
    avgTemp: Math.round(baseTemps[index] + equatorBonus + (Math.random() * 4 - 2)),
    precipitation: Math.round(30 + Math.random() * 100),
  }));
};