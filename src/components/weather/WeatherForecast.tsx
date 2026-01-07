import { ForecastDay } from '../../types/weather';
import { CloudRain, Droplets } from 'lucide-react';

interface WeatherForecastProps {
  forecast: ForecastDay[];
}

const WeatherForecast = ({ forecast }: WeatherForecastProps) => {
  if (forecast.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No forecast data available. Select a location to view forecast.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
      {forecast.map((day) => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        return (
          <div
            key={day.date}
            className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-600"
          >
            <div className="text-center">
              <p className="font-semibold text-gray-900 dark:text-white">{dayName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{monthDay}</p>

              <img
                src={`https:${day.day.condition.icon}`}
                alt={day.day.condition.text}
                className="w-12 h-12 mx-auto mb-2"
              />

              <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 min-h-[2.5rem] line-clamp-2">
                {day.day.condition.text}
              </p>

              <div className="flex justify-center gap-2 mb-3">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {Math.round(day.day.maxtemp_c)}°
                </span>
                <span className="text-lg text-gray-400 dark:text-gray-300">
                  {Math.round(day.day.mintemp_c)}°
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400">
                  <CloudRain className="w-3 h-3" />
                  <span>{day.day.daily_chance_of_rain}%</span>
                </div>

                <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-300">
                  <Droplets className="w-3 h-3" />
                  <span>{day.day.avghumidity}%</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeatherForecast;