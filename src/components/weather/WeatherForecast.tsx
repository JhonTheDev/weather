import { ForecastDay } from '../../types/weather';
import { CloudRain, Droplets } from 'lucide-react';

interface WeatherForecastProps {
  forecast: ForecastDay[];
}

const WeatherForecast = ({ forecast }: WeatherForecastProps) => {
  if (!forecast.length) return null;

  const weekDays = [
    { label: 'Dom', index: 0 },
    { label: 'Seg', index: 1 },
    { label: 'Ter', index: 2 },
    { label: 'Qua', index: 3 },
    { label: 'Qui', index: 4 },
    { label: 'Sex', index: 5 },
    { label: 'Sáb', index: 6 }
  ];

  const normalizeDate = (dateStr: string) =>
    new Date(`${dateStr}T12:00:00`);

  const todayMonthDay = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short'
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
      {weekDays.map(({ label, index }) => {
        const forecastDay = forecast.find(day => {
          const date = normalizeDate(day.date);
          return date.getDay() === index;
        });

        if (!forecastDay) return null;

        const date = normalizeDate(forecastDay.date);

        const monthDay = date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short'
        });

        const isToday = monthDay === todayMonthDay;

        return (
          <div
            key={forecastDay.date}
            className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm border"
          >
            <div className="text-center">
              <p className="font-semibold">
                {isToday ? 'Hoje' : label}
              </p>

              <p className="text-xs text-gray-500 mb-3">
                {monthDay}
              </p>

              <img
                src={`https:${forecastDay.day.condition.icon}`}
                alt={forecastDay.day.condition.text}
                className="w-12 h-12 mx-auto mb-2"
              />

              <p className="text-xs mb-3 line-clamp-2">
                {forecastDay.day.condition.text}
              </p>

              <div className="flex justify-center gap-2 mb-3">
                <span className="font-bold">
                  {Math.round(forecastDay.day.maxtemp_c)}°
                </span>
                <span className="text-gray-400">
                  {Math.round(forecastDay.day.mintemp_c)}°
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-center gap-1 text-blue-600">
                  <CloudRain className="w-3 h-3" />
                  <span>{forecastDay.day.daily_chance_of_rain}%</span>
                </div>

                <div className="flex justify-center gap-1">
                  <Droplets className="w-3 h-3" />
                  <span>{forecastDay.day.avghumidity}%</span>
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
