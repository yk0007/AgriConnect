
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CloudRain, 
  Leaf, 
  ShoppingBag, 
  Calendar, 
  Droplets,
  MessageSquare,
  User,
  Home,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import WeatherCard from "../components/dashboard/WeatherCard";
import MarketInsightCard from "../components/dashboard/MarketInsightCard";
import { useState } from "react";
import { format } from "date-fns";

const Dashboard = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Get first name from user metadata or use "Farmer" as fallback
  const firstName = user?.user_metadata?.first_name || "Farmer";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">Welcome, {firstName}</h1>
          <p className="text-muted-foreground">Here's an overview of your farm's status</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex gap-2 items-center">
            <Calendar className="h-4 w-4" />
            <span>{selectedDate ? format(selectedDate, 'PPP') : 'Select Date'}</span>
          </Button>
        </div>
      </div>

      {/* Quick Actions with Modern Colors */}
      <Card className="hover-scale">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          <CardDescription>Frequently used tools and services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link to="/diagnostics">
              <div className="bg-gradient-to-r from-emerald-400 to-green-400 hover:from-emerald-500 hover:to-green-500 text-white rounded-lg p-4 text-center transition-all shadow-md">
                <Leaf className="h-8 w-8 mx-auto mb-2 text-white/90" />
                <span className="text-sm font-medium">Diagnose Crop</span>
              </div>
            </Link>
            <Link to="/soil-analysis">
              <div className="bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg p-4 text-center transition-all shadow-md">
                <Droplets className="h-8 w-8 mx-auto mb-2 text-white/90" />
                <span className="text-sm font-medium">Soil Analysis</span>
              </div>
            </Link>
            <Link to="/weather">
              <div className="bg-gradient-to-r from-sky-400 to-indigo-400 hover:from-sky-500 hover:to-indigo-500 text-white rounded-lg p-4 text-center transition-all shadow-md">
                <CloudRain className="h-8 w-8 mx-auto mb-2 text-white/90" />
                <span className="text-sm font-medium">Weather</span>
              </div>
            </Link>
            <Link to="/marketplace">
              <div className="bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white rounded-lg p-4 text-center transition-all shadow-md">
                <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-white/90" />
                <span className="text-sm font-medium">Marketplace</span>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Weather Widget */}
        <WeatherCard />

        {/* Market Insights */}
        <MarketInsightCard />
        
        {/* Communication Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Botanist Experts
            </CardTitle>
            <CardDescription>Connect with experts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Dr. Sharma</h4>
                    <p className="text-xs text-muted-foreground">Rice & Wheat Specialist</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/botanists">Consult</Link>
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Dr. Patel</h4>
                    <p className="text-xs text-muted-foreground">Soil Health Expert</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/botanists">Consult</Link>
                </Button>
              </div>
              
              <Button className="w-full mt-2" size="sm" asChild>
                <Link to="/botanists">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  View All Botanists
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
