import { Cloud, Wind, Droplets, Eye, Gauge, Sun } from 'lucide-react';
import { CurrentWeatherData } from '@/api/weatherApi';

interface CurrentWeatherProps {
  data: CurrentWeatherData | null;
  loading: boolean;
}

const CurrentWeather = ({ data, loading }: CurrentWeatherProps) => {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl animate-pulse">
        <div className="h-8 bg-blue-400 rounded mb-4 w-1/3"></div>
        <div className="h-4 bg-blue-400 rounded mb-2 w-1/4"></div>
        <div className="h-20 bg-blue-400 rounded mb-6 w-1/2"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
        <h2 className="text-2xl font-bold mb-4">No weather data available</h2>
        <p className="text-blue-100">Select a location to see current weather</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-1">{data.name}</h2>
          <p className="text-blue-100">
            {data.sys?.country}
          </p>
          <p className="text-sm text-blue-100 mt-1">
            {new Date(data.dt * 1000).toLocaleDateString('en-US', {
              weekday: 'long',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <img
          src={`https://openweathermap.org/img/wn/${data.weather?.[0]?.icon}@2x.png`}
          alt={data.weather?.[0]?.description || 'Weather icon'}
          className="w-20 h-20"
        />
      </div>

      <div className="flex items-end gap-2 mb-6">
        <span className="text-7xl font-bold">{Math.round(data.main?.temp || 0)}°</span>
        <span className="text-3xl text-blue-100 mb-2">C</span>
      </div>

      <p className="text-xl mb-8 capitalize">{data.weather?.[0]?.description}</p>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-blue-200" />
          <div>
            <p className="text-xs text-blue-200">Wind</p>
            <p className="font-semibold">{Math.round(data.wind?.speed || 0)} m/s</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-blue-200" />
          <div>
            <p className="text-xs text-blue-200">Humidity</p>
            <p className="font-semibold">{data.main?.humidity}%</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-200" />
          <div>
            <p className="text-xs text-blue-200">Visibility</p>
            <p className="font-semibold">{(data.visibility || 0) / 1000} km</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-blue-200" />
          <div>
            <p className="text-xs text-blue-200">Pressure</p>
            <p className="font-semibold">{data.main?.pressure} hPa</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Sun className="w-5 h-5 text-blue-200" />
          <div>
            <p className="text-xs text-blue-200">Feels Like</p>
            <p className="font-semibold">{Math.round(data.main?.feels_like || 0)}°C</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Cloud className="w-5 h-5 text-blue-200" />
          <div>
            <p className="text-xs text-blue-200">Clouds</p>
            <p className="font-semibold">{data.clouds?.all}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;