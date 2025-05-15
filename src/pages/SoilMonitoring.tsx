import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  AreaChart as LucideAreaChart, 
  Droplets, 
  Leaf, 
  Mountain, 
  RefreshCcw, 
  DollarSign, 
  AlertTriangle, 
  Plus, 
  Battery, 
  Wifi,
  LineChart as LucideLineChart 
} from "lucide-react";

// Import recharts components
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SoilMonitoring = () => {
  const [selectedField, setSelectedField] = useState("north");
  
  // Mock soil monitoring data for the last 7 days
  const soilData = {
    moisture: [
      { day: "Mon", value: 42 },
      { day: "Tue", value: 40 },
      { day: "Wed", value: 45 },
      { day: "Thu", value: 48 },
      { day: "Fri", value: 38 },
      { day: "Sat", value: 37 },
      { day: "Sun", value: 43 },
    ],
    nitrogen: [
      { day: "Mon", value: 35 },
      { day: "Tue", value: 34 },
      { day: "Wed", value: 32 },
      { day: "Thu", value: 30 },
      { day: "Fri", value: 31 },
      { day: "Sat", value: 29 },
      { day: "Sun", value: 28 },
    ],
    phosphorus: [
      { day: "Mon", value: 25 },
      { day: "Tue", value: 24 },
      { day: "Wed", value: 26 },
      { day: "Thu", value: 23 },
      { day: "Fri", value: 22 },
      { day: "Sat", value: 21 },
      { day: "Sun", value: 20 },
    ],
    potassium: [
      { day: "Mon", value: 40 },
      { day: "Tue", value: 38 },
      { day: "Wed", value: 39 },
      { day: "Fri", value: 41 },
      { day: "Thu", value: 37 },
      { day: "Sat", value: 36 },
      { day: "Sun", value: 35 },
    ],
    ph: [
      { day: "Mon", value: 6.5 },
      { day: "Tue", value: 6.4 },
      { day: "Wed", value: 6.5 },
      { day: "Thu", value: 6.6 },
      { day: "Fri", value: 6.5 },
      { day: "Sat", value: 6.4 },
      { day: "Sun", value: 6.5 },
    ],
  };
  
  // Mock sensor status data
  const sensorStatus = [
    { id: 1, name: "North Field Sensor 1", battery: 85, signal: 92, lastSync: "5 mins ago", status: "online" },
    { id: 2, name: "North Field Sensor 2", battery: 72, signal: 88, lastSync: "15 mins ago", status: "online" },
    { id: 3, name: "East Field Sensor", battery: 45, signal: 76, lastSync: "2 hours ago", status: "online" },
    { id: 4, name: "South Field Sensor", battery: 22, signal: 65, lastSync: "5 hours ago", status: "warning" },
    { id: 5, name: "West Field Sensor", battery: 0, signal: 0, lastSync: "3 days ago", status: "offline" },
  ];
  
  // Current soil metrics data
  const currentMetrics = {
    moisture: 43,
    nitrogen: 28,
    phosphorus: 20,
    potassium: 35,
    ph: 6.5,
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Soil Monitoring</h1>
          <p className="text-muted-foreground">
            Real-time soil health metrics from IoT sensors across your fields
          </p>
        </div>
        <div className="flex gap-2">
          <Select 
            value={selectedField}
            onValueChange={setSelectedField}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select field" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="north">North Field</SelectItem>
              <SelectItem value="east">East Field</SelectItem>
              <SelectItem value="south">South Field</SelectItem>
              <SelectItem value="west">West Field</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Sensor
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle>Current Soil Status - {selectedField === "north" ? "North Field" : selectedField === "east" ? "East Field" : selectedField === "south" ? "South Field" : "West Field"}</CardTitle>
            <CardDescription>
              Latest readings from soil sensors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    <h3 className="font-medium">Moisture</h3>
                  </div>
                  <Badge variant="outline" className={
                    currentMetrics.moisture > 50 ? "bg-blue-100 text-blue-800 border-blue-200" :
                    currentMetrics.moisture < 30 ? "bg-amber-100 text-amber-800 border-amber-200" :
                    "bg-green-100 text-green-800 border-green-200"
                  }>
                    {currentMetrics.moisture > 50 ? "High" : 
                     currentMetrics.moisture < 30 ? "Low" : "Optimal"}
                  </Badge>
                </div>
                <h4 className="text-3xl font-bold text-primary mb-2">{currentMetrics.moisture}%</h4>
                <Progress value={currentMetrics.moisture} className="h-2" />
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-500" />
                    <h3 className="font-medium">Nitrogen</h3>
                  </div>
                  <Badge variant="outline" className={
                    currentMetrics.nitrogen > 40 ? "bg-blue-100 text-blue-800 border-blue-200" :
                    currentMetrics.nitrogen < 20 ? "bg-red-100 text-red-800 border-red-200" :
                    "bg-green-100 text-green-800 border-green-200"
                  }>
                    {currentMetrics.nitrogen > 40 ? "High" : 
                     currentMetrics.nitrogen < 20 ? "Low" : "Optimal"}
                  </Badge>
                </div>
                <h4 className="text-3xl font-bold text-primary mb-2">{currentMetrics.nitrogen} mg/kg</h4>
                <Progress value={currentMetrics.nitrogen * 2} className="h-2" />
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Mountain className="h-5 w-5 text-amber-500" />
                    <h3 className="font-medium">Phosphorus</h3>
                  </div>
                  <Badge variant="outline" className={
                    currentMetrics.phosphorus > 30 ? "bg-blue-100 text-blue-800 border-blue-200" :
                    currentMetrics.phosphorus < 15 ? "bg-red-100 text-red-800 border-red-200" :
                    "bg-green-100 text-green-800 border-green-200"
                  }>
                    {currentMetrics.phosphorus > 30 ? "High" : 
                     currentMetrics.phosphorus < 15 ? "Low" : "Optimal"}
                  </Badge>
                </div>
                <h4 className="text-3xl font-bold text-primary mb-2">{currentMetrics.phosphorus} mg/kg</h4>
                <Progress value={currentMetrics.phosphorus * 3} className="h-2" />
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-violet-500" />
                    <h3 className="font-medium">Potassium</h3>
                  </div>
                  <Badge variant="outline" className={
                    currentMetrics.potassium > 45 ? "bg-blue-100 text-blue-800 border-blue-200" :
                    currentMetrics.potassium < 25 ? "bg-red-100 text-red-800 border-red-200" :
                    "bg-green-100 text-green-800 border-green-200"
                  }>
                    {currentMetrics.potassium > 45 ? "High" : 
                     currentMetrics.potassium < 25 ? "Low" : "Optimal"}
                  </Badge>
                </div>
                <h4 className="text-3xl font-bold text-primary mb-2">{currentMetrics.potassium} mg/kg</h4>
                <Progress value={currentMetrics.potassium * 2} className="h-2" />
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-teal-500" />
                    <h3 className="font-medium">pH Level</h3>
                  </div>
                  <Badge variant="outline" className={
                    currentMetrics.ph > 7.5 ? "bg-amber-100 text-amber-800 border-amber-200" :
                    currentMetrics.ph < 5.5 ? "bg-red-100 text-red-800 border-red-200" :
                    "bg-green-100 text-green-800 border-green-200"
                  }>
                    {currentMetrics.ph > 7.5 ? "Alkaline" : 
                     currentMetrics.ph < 5.5 ? "Acidic" : "Neutral"}
                  </Badge>
                </div>
                <h4 className="text-3xl font-bold text-primary mb-2">{currentMetrics.ph}</h4>
                <Progress value={(currentMetrics.ph / 14) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-flex">
          <TabsTrigger value="history">Historical Data</TabsTrigger>
          <TabsTrigger value="sensors">Sensor Status</TabsTrigger>
          <TabsTrigger value="alerts">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  Soil Moisture Trend
                </CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={soilData.moisture} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#93c5fd" name="Moisture %" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  NPK Levels
                </CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={soilData.moisture} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Nitrogen" fill="#22c55e" />
                    <Bar dataKey="value" name="Phosphorus" fill="#f59e0b" />
                    <Bar dataKey="value" name="Potassium" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-teal-500" />
                  pH Level History
                </CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={soilData.ph} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[6, 7]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={2} name="pH Level" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="sensors" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-primary" />
                  IoT Sensor Network
                </CardTitle>
                <Button variant="outline" size="sm">
                  Sync All Sensors
                </Button>
              </div>
              <CardDescription>
                Status and battery levels of your soil monitoring sensors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sensorStatus.map(sensor => (
                  <div 
                    key={sensor.id} 
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        sensor.status === "online" ? "bg-green-100 text-green-800" : 
                        sensor.status === "warning" ? "bg-amber-100 text-amber-800" : 
                        "bg-red-100 text-red-800"
                      }`}>
                        <Wifi className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">{sensor.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>Last sync: {sensor.lastSync}</span>
                          <span className="mx-2">•</span>
                          <Badge variant={
                            sensor.status === "online" ? "outline" : 
                            sensor.status === "warning" ? "secondary" : 
                            "destructive"
                          }>
                            {sensor.status === "online" ? "Online" : 
                             sensor.status === "warning" ? "Low Battery" : 
                             "Offline"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="w-32">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Battery</span>
                          <span className="text-xs font-medium">{sensor.battery}%</span>
                        </div>
                        <Progress value={sensor.battery} className="h-2" />
                      </div>
                      
                      <div className="w-32">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Signal</span>
                          <span className="text-xs font-medium">{sensor.signal}%</span>
                        </div>
                        <Progress value={sensor.signal} className="h-2" />
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="bg-amber-50 dark:bg-amber-900/10 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-500">
                  <AlertTriangle className="h-5 w-5" />
                  Soil Health Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-md border-l-4 border-amber-500">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Low Phosphorus Levels Detected</h3>
                    <p className="text-sm text-muted-foreground">
                      Phosphorus levels in the South Field have dropped below optimal range. This could affect flowering and fruiting of crops.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      View Recommendations
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-md border-l-4 border-red-500">
                  <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Critically Low Soil Moisture</h3>
                    <p className="text-sm text-muted-foreground">
                      West Field irrigation system may not be functioning properly. Soil moisture levels have reached critically low levels.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      View Recommendations
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="bg-green-50 dark:bg-green-900/10 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-500">
                  <Leaf className="h-5 w-5" />
                  Fertilizer Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">North Field</h3>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      Recommended
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Based on current soil analysis, we recommend applying a nitrogen-rich fertilizer to maintain optimal crop growth.
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span>Recommended Fertilizer: NPK 20-10-10</span>
                    <span>Quantity: 30kg/hectare</span>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">South Field</h3>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                      Action Needed
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Low phosphorus levels detected. Apply phosphorus-rich fertilizer to support root development and flowering.
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span>Recommended Fertilizer: NPK 10-30-10</span>
                    <span>Quantity: 25kg/hectare</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Resource Optimization
                  </CardTitle>
                </div>
                <CardDescription>
                  Recommendations for optimizing resource usage based on soil analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border rounded-lg p-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <Droplets className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold mb-2">Water Usage Optimization</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Based on soil moisture levels, you can reduce irrigation in the North Field by 20% without affecting crop health.
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-primary font-medium">Potential Savings</span>
                      <span>₹5,200/month</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <LucideAreaChart className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold mb-2">Fertilizer Management</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Precision application of fertilizers based on soil nutrient mapping can reduce fertilizer usage by 15%.
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-primary font-medium">Potential Savings</span>
                      <span>₹3,800/season</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <Battery className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold mb-2">Sensor Energy Optimization</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Reducing sensor polling frequency from 15 to 30 minutes can double battery life without significant data loss.
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-primary font-medium">Battery Extension</span>
                      <span>+4 months</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SoilMonitoring;
