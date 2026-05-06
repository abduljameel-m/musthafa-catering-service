export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      () => reject("Location permission denied")
    );
  });
};

export const getWeatherData = async () => {
  try {
    const position = await getCurrentPosition();

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`
    );

    const data = await response.json();

    return {
      temperature: Math.round(data.current.temperature_2m),
      location: "Current Location",
    };
  } catch (error) {
    return {
      temperature: null,
      location: "Location unavailable",
    };
  }
};