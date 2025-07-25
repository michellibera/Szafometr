import { fetchWeatherApi } from 'openmeteo';

export interface CurrentWeather {
  temp: number;
  description: string;
  feelsLike: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  cloudCover: number;
  isDay: boolean;
  weatherCode: number;
}

export interface HourlyWeather {
  time: Date;
  temp: number;
  feelsLike: number;
  precipitationProbability: number;
  cloudCover: number;
  windSpeed: number;
  weatherCode: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyWeather[];
  location: {
    latitude: number;
    longitude: number;
  };
}

// WMO Weather Interpretation Codes to Polish descriptions
const getWeatherDescription = (weatherCode: number): string => {
  const weatherCodeMap: { [key: number]: string } = {
    0: 'Bezchmurnie',
    1: 'Głównie bezchmurnie',
    2: 'Częściowo pochmurnie',
    3: 'Pochmurnie',
    45: 'Mgliście',
    48: 'Mgła z szronem',
    51: 'Lekka mżawka',
    53: 'Umiarkowana mżawka',
    55: 'Gęsta mżawka',
    56: 'Lekka marznąca mżawka',
    57: 'Gęsta marznąca mżawka',
    61: 'Lekki deszcz',
    63: 'Umiarkowany deszcz',
    65: 'Silny deszcz',
    66: 'Lekki marznący deszcz',
    67: 'Silny marznący deszcz',
    71: 'Lekki śnieg',
    73: 'Umiarkowany śnieg',
    75: 'Silny śnieg',
    77: 'Ziarna śniegu',
    80: 'Lekkie opady deszczu',
    81: 'Umiarkowane opady deszczu',
    82: 'Gwałtowne opady deszczu',
    85: 'Lekkie opady śniegu',
    86: 'Silne opady śniegu',
    95: 'Burza',
    96: 'Burza z lekkim gradem',
    99: 'Burza z silnym gradem'
  };

  return weatherCodeMap[weatherCode] || 'Nieznane warunki';
};

// Get user's geolocation
export const getUserLocation = (): Promise<{ latitude: number; longitude: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        let errorMessage = 'Unable to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

// Fetch weather data from Open-Meteo API
export const fetchWeatherData = async (
  latitude: number,
  longitude: number
): Promise<WeatherData> => {
  try {
    const params = {
      latitude,
      longitude,
      hourly: ["temperature_2m", "apparent_temperature", "precipitation_probability", "cloud_cover", "wind_speed_10m", "weather_code"],
      current: ["weather_code", "cloud_cover", "temperature_2m", "relative_humidity_2m", "apparent_temperature", "is_day", "precipitation", "wind_speed_10m"],
      forecast_days: 1
    };

    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];

    const utcOffsetSeconds = response.utcOffsetSeconds();
    const current = response.current()!;
    const hourly = response.hourly()!;

    // Process current weather data
    const weatherCode = Math.round(current.variables(0)!.value());
    const currentWeather: CurrentWeather = {
      weatherCode,
      temp: Math.round(current.variables(2)!.value()),
      feelsLike: Math.round(current.variables(4)!.value()),
      humidity: Math.round(current.variables(3)!.value()),
      precipitation: current.variables(6)!.value(),
      windSpeed: Math.round(current.variables(7)!.value()),
      cloudCover: Math.round(current.variables(1)!.value()),
      isDay: current.variables(5)!.value() === 1,
      description: getWeatherDescription(weatherCode)
    };

    // Process hourly data
    const hourlyData: HourlyWeather[] = [];
    const timeLength = Math.floor((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval());
    
    for (let i = 0; i < Math.min(timeLength, 24); i++) {
      hourlyData.push({
        time: new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000),
        temp: Math.round(hourly.variables(0)!.valuesArray()![i]),
        feelsLike: Math.round(hourly.variables(1)!.valuesArray()![i]),
        precipitationProbability: Math.round(hourly.variables(2)!.valuesArray()![i]),
        cloudCover: Math.round(hourly.variables(3)!.valuesArray()![i]),
        windSpeed: Math.round(hourly.variables(4)!.valuesArray()![i]),
        weatherCode: Math.round(hourly.variables(5)!.valuesArray()![i])
      });
    }

    return {
      current: currentWeather,
      hourly: hourlyData,
      location: {
        latitude: response.latitude(),
        longitude: response.longitude()
      }
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data');
  }
};

// Fetch weather with automatic geolocation
export const fetchCurrentWeather = async (): Promise<WeatherData> => {
  try {
    const location = await getUserLocation();
    return await fetchWeatherData(location.latitude, location.longitude);
  } catch (error) {
    console.error('Error getting weather:', error);
    // Fallback to Warsaw coordinates if geolocation fails
    return await fetchWeatherData(52.2297, 21.0122);
  }
};