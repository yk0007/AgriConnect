
import { useState, useEffect } from "react";
import { 
  Cloud, 
  CloudRain, 
  Droplets, 
  Eye, 
  Leaf,
  Loader2, 
  MapPin,
  Search, 
  Sun, 
  Thermometer, 
  Wind,
  CloudSnow,
  CloudLightning,
  CloudFog,
  AlertTriangle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Weather page component with fixed Visakhapatnam data
const Weather = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  // Static weather data for Visakhapatnam
  const currentWeather = {
    location: "Visakhapatnam, India",
    temperature: 32,
    condition: "Partly Cloudy",
    humidity: 78,
    windSpeed: 14,
    visibility: 10,
    pressure: 1012,
    feelsLike: 35,
    icon: "02d"
  };

  const hourlyForecast = [
    { time: "Now", temp: 32, iconCode: "01d", precipitation: 0 },
    { time: "13:00", temp: 31, iconCode: "02d", precipitation: 0 },
    { time: "14:00", temp: 31, iconCode: "02d", precipitation: 0 },
    { time: "15:00", temp: 30, iconCode: "02d", precipitation: 10 },
    { time: "16:00", temp: 30, iconCode: "10d", precipitation: 20 },
    { time: "17:00", temp: 29, iconCode: "10d", precipitation: 30 },
    { time: "18:00", temp: 28, iconCode: "10d", precipitation: 20 },
    { time: "19:00", temp: 27, iconCode: "04n", precipitation: 10 }
  ];

  const dailyForecast = [
    { day: "Today", high: 32, low: 26, condition: "Partly Cloudy", iconCode: "02d" },
    { day: "Thu", high: 31, low: 25, condition: "Sunny", iconCode: "01d" },
    { day: "Fri", high: 31, low: 26, condition: "Scattered Showers", iconCode: "10d" },
    { day: "Sat", high: 30, low: 25, condition: "Rain", iconCode: "10d" },
    { day: "Sun", high: 31, low: 26, condition: "Sunny", iconCode: "01d" }
  ];

  const weatherAlerts = [
    {
      id: 1,
      type: "High temperature warning",
      description: "32°C. Stay hydrated and avoid prolonged sun exposure.",
      impact: "High risk of heat-related illnesses and infrastructure strain."
    }
  ];

  // Simulate loading
  useEffect(() => {
    // Show loading state briefly for UI transition
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Location fixed",
      description: "Weather data is currently only available for Visakhapatnam.",
    });
  };

  const handleUseCurrentLocation = () => {
    toast({
      title: "Location fixed",
      description: "Weather data is currently only available for Visakhapatnam.",
    });
  };
  
  const getWeatherIconUrl = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CloudRain className="h-6 w-6 text-blue-500" />
          Weather Insights
        </h1>
        <p className="text-muted-foreground">Real-time weather data and forecasts for better planning</p>
      </div>
      
      {/* Location search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search location..."
              className="pl-10"
              disabled
              value="Visakhapatnam, India"
            />
          </div>
        </form>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleUseCurrentLocation}
          disabled={loading}
          className="whitespace-nowrap"
        >
          <MapPin className="mr-2 h-4 w-4" />
          Use Current Location
        </Button>
      </div>
      
      {/* Weather alerts */}
      {weatherAlerts.length > 0 && (
        <Card className="p-4 border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-amber-800 dark:text-amber-300 font-medium">
                Weather Alert{weatherAlerts.length > 1 ? `s (${weatherAlerts.length})` : ''}
              </h3>
              {weatherAlerts.map((alert) => (
                <div key={alert.id} className="mt-2">
                  <p className="font-medium">{alert.type}</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300/80 mt-1">{alert.description}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-300/60 mt-1">Impact: {alert.impact}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
      
      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        </div>
      ) : (
        <>
          {/* Current weather */}
          <Card className="overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <h2 className="text-xl font-semibold">{currentWeather.location}</h2>
                  </div>
                  <p className="text-muted-foreground mb-4">Updated just now</p>
                  
                  <div className="flex items-center mt-4">
                    <div className="text-6xl font-bold text-gray-900 dark:text-white mr-6">{currentWeather.temperature}°</div>
                    <div>
                      <div className="flex items-center">
                        <img 
                          src={getWeatherIconUrl(currentWeather.icon)} 
                          alt={currentWeather.condition}
                          className="w-16 h-16 mr-1"
                        />
                        <p className="text-lg font-medium">{currentWeather.condition}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Feels like {currentWeather.feelsLike}°</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 md:mt-0 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-4">
                  <Card className="bg-white/70 dark:bg-gray-800/50 shadow-sm backdrop-blur-sm">
                    <div className="p-3 flex items-center gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                        <Wind className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Wind</p>
                        <p className="font-medium">{currentWeather.windSpeed} km/h</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="bg-white/70 dark:bg-gray-800/50 shadow-sm backdrop-blur-sm">
                    <div className="p-3 flex items-center gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                        <Droplets className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Humidity</p>
                        <p className="font-medium">{currentWeather.humidity}%</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="bg-white/70 dark:bg-gray-800/50 shadow-sm backdrop-blur-sm">
                    <div className="p-3 flex items-center gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                        <Eye className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Visibility</p>
                        <p className="font-medium">{currentWeather.visibility} km</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="bg-white/70 dark:bg-gray-800/50 shadow-sm backdrop-blur-sm">
                    <div className="p-3 flex items-center gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                        <Thermometer className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Pressure</p>
                        <p className="font-medium">{currentWeather.pressure} hPa</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Hourly forecast */}
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              Hourly Forecast
            </h2>
            <Card className="overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <div className="flex p-4 min-w-max">
                  {hourlyForecast.map((hour, index) => (
                    <div 
                      key={index} 
                      className={`flex flex-col items-center px-6 py-3 ${
                        index === 0 ? 'bg-blue-50 dark:bg-blue-900/20 rounded-md' : ''
                      }`}
                    >
                      <span className="text-sm font-medium">{hour.time}</span>
                      <img 
                        src={getWeatherIconUrl(hour.iconCode)} 
                        alt="Weather icon"
                        className="h-12 w-12 my-1"
                      />
                      <span className="text-lg font-bold">{hour.temp}°</span>
                      {hour.precipitation > 0 && (
                        <div className="flex items-center mt-1 text-blue-500">
                          <Droplets className="h-3 w-3 mr-1" />
                          <span className="text-xs">{hour.precipitation}%</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          
          {/* Daily forecast */}
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              5-Day Forecast
            </h2>
            <Card className="shadow-md">
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {dailyForecast.map((day, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between px-4 py-3 ${
                      index === 0 ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    <div className="w-24">
                      <p className={`font-medium ${index === 0 ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                        {day.day}
                      </p>
                    </div>
                    <div className="flex items-center w-32">
                      <img 
                        src={getWeatherIconUrl(day.iconCode)} 
                        alt={day.condition}
                        className="h-10 w-10 mr-1" 
                      />
                      <span className="text-sm">{day.condition}</span>
                    </div>
                    <div className="flex space-x-6">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">High</p>
                        <p className="font-medium">{day.high}°</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Low</p>
                        <p className="font-medium">{day.low}°</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          
          {/* Weather impact on farming */}
          <Card className="mt-6 border-none shadow-md bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                Weather Impact on Farming
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/70 dark:bg-gray-800/50 p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-blue-700 dark:text-blue-400 mb-2">Recommendations</h3>
                  <ul className="space-y-2 text-sm">
                    {currentWeather.temperature > 30 && (
                      <li className="flex items-start gap-2">
                        <div className="bg-amber-100 p-1 rounded-full mt-0.5">
                          <Thermometer className="h-3.5 w-3.5 text-amber-600" />
                        </div>
                        <span>Consider providing shade for heat-sensitive crops</span>
                      </li>
                    )}
                    {currentWeather.humidity > 70 && (
                      <li className="flex items-start gap-2">
                        <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                          <Droplets className="h-3.5 w-3.5 text-blue-600" />
                        </div>
                        <span>High humidity may increase disease risk. Monitor plants closely.</span>
                      </li>
                    )}
                    {currentWeather.windSpeed > 15 && (
                      <li className="flex items-start gap-2">
                        <div className="bg-gray-100 p-1 rounded-full mt-0.5">
                          <Wind className="h-3.5 w-3.5 text-gray-600" />
                        </div>
                        <span>High winds may damage taller plants. Consider adding support.</span>
                      </li>
                    )}
                    <li className="flex items-start gap-2">
                      <div className="bg-green-100 p-1 rounded-full mt-0.5">
                        <Cloud className="h-3.5 w-3.5 text-green-600" />
                      </div>
                      <span>Current conditions are suitable for regular crop management.</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white/70 dark:bg-gray-800/50 p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-blue-700 dark:text-blue-400 mb-2">Irrigation Planning</h3>
                  <p className="text-sm mb-3">
                    Based on current weather conditions in {currentWeather.location.split(',')[0]}:
                  </p>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                    {currentWeather.temperature > 30 ? (
                      <p className="text-sm">
                        <span className="font-medium">High temperature alert:</span> Increase watering frequency to compensate for evaporation.
                      </p>
                    ) : currentWeather.condition.toLowerCase().includes('rain') ? (
                      <p className="text-sm">
                        <span className="font-medium">Rainy conditions:</span> Reduce irrigation to prevent waterlogging.
                      </p>
                    ) : (
                      <p className="text-sm">
                        <span className="font-medium">Normal conditions:</span> Maintain regular irrigation schedule based on crop needs.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

// Calendar icon component
const Calendar = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

// Clock icon component
const Clock = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export default Weather;
