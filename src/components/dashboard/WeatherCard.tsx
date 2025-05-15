
import { useState, useEffect } from "react";
import { CloudRain, Droplets, Sun, Wind, Loader2, Navigation, MapPin, ArrowRight, ThermometerSun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

// OpenWeatherMap API key (Using a free tier key for demo purposes)
const API_KEY = "1c62d5da5957d7e1e29c18b1c597bc7c";
const DEFAULT_LOCATION = "Visakhapatnam, India"; // Default to Visakhapatnam

interface WeatherData {
  location: string;
  condition: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  icon: string;
}

interface ForecastDay {
  day: string;
  temp: number;
  icon: any;
  iconCode: string;
}

const WeatherCard = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const getIconComponent = (iconCode: string) => {
    if (iconCode.includes('01') || iconCode.includes('02')) return Sun;
    if (iconCode.includes('03') || iconCode.includes('04')) return CloudRain;
    if (iconCode.includes('09') || iconCode.includes('10')) return CloudRain;
    return Sun; // default
  };
  
  const getWeatherIconUrl = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  useEffect(() => {
    fetchWeatherByLocation(DEFAULT_LOCATION);
  }, []);

  const fetchWeatherByLocation = async (locationName: string) => {
    try {
      setLoading(true);
      
      // Use local cache to avoid repeated API calls for the same location
      const cachedData = localStorage.getItem(`weather_cache_${locationName}`);
      const now = new Date();
      
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        // Check if cache is less than 30 minutes old
        if ((now.getTime() - timestamp) < 30 * 60 * 1000) {
          setWeather(data.currentWeather);
          setForecast(data.forecast);
          setLoading(false);
          return;
        }
      }
      
      // First get coordinates from location name
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${locationName}&limit=1&appid=${API_KEY}`
      );
      
      if (!geoResponse.ok) throw new Error('Failed to fetch location data');
      
      const geoData = await geoResponse.json();
      
      if (geoData.length === 0) {
        throw new Error('Location not found');
      }
      
      // Then fetch weather with those coordinates
      const { lat, lon } = geoData[0];
      
      // Fetch current weather
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      
      if (!weatherResponse.ok) throw new Error('Failed to fetch weather data');
      
      const weatherData = await weatherResponse.json();
      
      // Fetch forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      
      if (!forecastResponse.ok) throw new Error('Failed to fetch forecast data');
      
      const forecastData = await forecastResponse.json();
      
      // Process current weather
      const currentWeather = {
        location: `${weatherData.name}, ${weatherData.sys.country}`,
        condition: weatherData.weather[0].main,
        temperature: Math.round(weatherData.main.temp),
        humidity: weatherData.main.humidity,
        windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
        icon: weatherData.weather[0].icon
      };
      
      setWeather(currentWeather);
      
      // Process 5-day forecast
      const dailyData = new Map();
      const today = new Date().getDay();
      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      // Add today
      dailyData.set('Today', {
        day: 'Today',
        temp: Math.round(weatherData.main.temp),
        icon: getIconComponent(weatherData.weather[0].icon),
        iconCode: weatherData.weather[0].icon
      });
      
      // Process forecast
      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const weekday = weekdays[date.getDay()];
        
        // Only take one reading per day (noon)
        if (date.getHours() === 12 && !dailyData.has(weekday) && weekday !== weekdays[today]) {
          dailyData.set(weekday, {
            day: weekday,
            temp: Math.round(item.main.temp),
            icon: getIconComponent(item.weather[0].icon),
            iconCode: item.weather[0].icon
          });
        }
      });
      
      // Convert to array and limit to 5 days
      const forecastArray = Array.from(dailyData.values()).slice(0, 5);
      setForecast(forecastArray);
      
      // Save to cache
      localStorage.setItem(`weather_cache_${locationName}`, JSON.stringify({
        data: {
          currentWeather,
          forecast: forecastArray
        },
        timestamp: now.getTime()
      }));
      
    } catch (err) {
      console.error("Weather fetch error:", err);
      // Use fallback data
      useFallbackData();
    } finally {
      setLoading(false);
    }
  };
  
  const useFallbackData = () => {
    // Fallback weather data for Visakhapatnam
    setWeather({
      location: "Visakhapatnam, India",
      condition: "Partly Cloudy",
      temperature: 32,
      humidity: 78,
      windSpeed: 14,
      icon: "02d"
    });
    
    setForecast([
      { day: "Today", temp: 32, icon: Sun, iconCode: "01d" },
      { day: "Thu", temp: 31, icon: Sun, iconCode: "01d" },
      { day: "Fri", temp: 30, icon: CloudRain, iconCode: "10d" },
      { day: "Sat", temp: 29, icon: CloudRain, iconCode: "10d" },
      { day: "Sun", temp: 32, icon: Sun, iconCode: "01d" },
    ]);
  };

  if (loading) {
    return (
      <Card className="relative overflow-hidden">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  // Check if temperature is above threshold for high temperature alert
  const showHighTempAlert = weather && weather.temperature >= 30;

  return (
    <Card className="relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      {/* Blue Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 z-0"></div>
      
      <CardHeader className="relative z-10 pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center text-lg font-semibold">
              <CloudRain className="h-5 w-5 text-blue-500 mr-2" />
              Weather Insights
            </CardTitle>
            <CardDescription>
              <div className="flex items-center mt-1">
                <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                <span className="text-xs">{weather?.location}</span>
              </div>
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-xs font-medium">Today</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 pt-0 pb-3">
        {/* High Temperature Alert - Replacing Rain Alert */}
        {showHighTempAlert && (
          <Alert className="mb-3 bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-400">
            <ThermometerSun className="h-4 w-4 mr-2" />
            <AlertDescription className="text-xs">
              High temperature warning: {weather.temperature}°C. Stay hydrated and avoid prolonged sun exposure.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-4xl font-bold text-gray-800 dark:text-white flex items-baseline">
              {weather?.temperature}
              <span className="text-lg ml-0.5">°C</span>
            </p>
            <p className="text-sm text-muted-foreground font-medium mt-1">{weather?.condition}</p>
          </div>
          <div className="flex items-center">
            <img 
              src={getWeatherIconUrl(weather?.icon || '01d')} 
              alt={weather?.condition || "Weather"} 
              className="h-20 w-20 mt-[-20px]"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="flex items-center p-3 bg-white/60 dark:bg-white/10 rounded-lg shadow-sm backdrop-blur-sm">
            <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
              <Droplets className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="text-lg font-medium">{weather?.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-white/60 dark:bg-white/10 rounded-lg shadow-sm backdrop-blur-sm">
            <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
              <Wind className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Wind</p>
              <p className="text-lg font-medium">{weather?.windSpeed} km/h</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-3">
          <p className="text-xs text-muted-foreground font-medium mb-3">5-Day Forecast</p>
          <div className="flex justify-between">
            {forecast.map((day) => (
              <div key={day.day} className="flex flex-col items-center">
                <span className="text-xs font-medium">{day.day}</span>
                <img 
                  src={getWeatherIconUrl(day.iconCode)} 
                  alt="Weather" 
                  className="h-10 w-10 my-1"
                />
                <span className="text-sm font-bold">{day.temp}°</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="relative z-10 pt-0 pb-3">
        <Button variant="link" size="sm" asChild className="ml-auto text-blue-600 dark:text-blue-400 font-medium">
          <Link to="/weather" className="flex items-center">
            Full Forecast
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WeatherCard;
