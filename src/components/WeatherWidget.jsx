import { useEffect, useState } from "react";
import { CloudSun } from "lucide-react";
import { getWeatherData } from "../services/weatherService";

function WeatherWidget() {
  const [weather, setWeather] = useState({
    temperature: null,
    location: "Loading...",
  });

  useEffect(() => {
    const loadWeather = async () => {
      const data = await getWeatherData();
      setWeather(data);
    };

    loadWeather();
  }, []);

  return (
    <div className="weather-widget">
      <CloudSun size={20} />
      <div>
        <strong>
          {weather.temperature !== null ? `${weather.temperature}°C` : "--"}
        </strong>
        <span>{weather.location}</span>
      </div>
    </div>
  );
}

export default WeatherWidget;