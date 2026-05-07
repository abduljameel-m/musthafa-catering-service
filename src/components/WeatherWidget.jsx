import { useEffect, useState } from "react";
import { CloudSun, MapPin } from "lucide-react";
import { getWeatherData } from "../services/weatherService";
import { useApp } from "../context/AppContext";

function WeatherWidget() {
  const { t } = useApp();

  const [weather, setWeather] = useState({
    temperature: null,
    location: t("currentLocation"),
  });

  useEffect(() => {
    const loadWeather = async () => {
      const data = await getWeatherData();

      setWeather({
        temperature: data.temperature,
        location:
          data.temperature !== null
            ? t("currentLocation")
            : t("locationUnavailable"),
      });
    };

    loadWeather();
  }, [t]);

  return (
    <div className="weather-widget premium-weather-widget">
      <div className="weather-icon-wrap">
        <CloudSun size={20} />
      </div>

      <div>
        <strong>
          {weather.temperature !== null ? `${weather.temperature}°C` : "--"}
        </strong>

        <span>
          <MapPin size={11} />
          {weather.location}
        </span>
      </div>
    </div>
  );
}

export default WeatherWidget;