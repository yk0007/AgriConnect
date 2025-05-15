import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, MapPin, Circle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DiseaseOutbreak {
  id: number;
  disease_name: string;
  severity: "low" | "medium" | "high";
  affected_crops: string[];
  reported_date: string;
  status: "active" | "contained" | "resolved";
  location_name: string;
  latitude: number;
  longitude: number;
  details: string;
  recommendations: string[];
}

const severityColorMap = {
  low: "bg-green-500/20 text-green-700 border-green-500/50",
  medium: "bg-yellow-500/20 text-yellow-700 border-yellow-500/50",
  high: "bg-red-500/20 text-red-700 border-red-500/50"
};

const statusColorMap = {
  active: "bg-red-500/20 text-red-700 border-red-500/50",
  contained: "bg-yellow-500/20 text-yellow-700 border-yellow-500/50",
  resolved: "bg-green-500/20 text-green-700 border-green-500/50"
};

const fallbackData: DiseaseOutbreak[] = [{
  id: 1,
  disease_name: "Rice Blast",
  severity: "high",
  affected_crops: ["Rice", "Wheat"],
  reported_date: "2025-04-10",
  status: "active",
  location_name: "Visakhapatnam",
  latitude: 17.6868,
  longitude: 83.2185,
  details: "Severe outbreak affecting over 500 hectares of rice fields. Spreading rapidly due to favorable weather conditions.",
  recommendations: ["Apply fungicide treatment", "Remove infected plants", "Maintain field drainage"]
}, {
  id: 2,
  disease_name: "Powdery Mildew",
  severity: "medium",
  affected_crops: ["Grapes", "Strawberries"],
  reported_date: "2025-04-08",
  status: "contained",
  location_name: "Vijayawada",
  latitude: 16.5062,
  longitude: 80.6480,
  details: "Contained outbreak affecting vineyards. Initial spread has been stopped through treatment protocols.",
  recommendations: ["Apply sulfur-based fungicide", "Increase plant spacing", "Prune affected branches"]
}, {
  id: 3,
  disease_name: "Citrus Greening",
  severity: "high",
  affected_crops: ["Orange", "Lemon", "Lime"],
  reported_date: "2025-04-05",
  status: "active",
  location_name: "Kakinada",
  latitude: 16.9891,
  longitude: 82.2475,
  details: "Bacterial disease affecting citrus trees. Transmitted by Asian citrus psyllid. Causing significant yield reductions.",
  recommendations: ["Control psyllid populations", "Remove infected trees", "Implement quarantine measures"]
}, {
  id: 4,
  disease_name: "Late Blight",
  severity: "medium",
  affected_crops: ["Potato", "Tomato"],
  reported_date: "2025-04-02",
  status: "contained",
  location_name: "Rajahmundry",
  latitude: 17.0005,
  longitude: 81.8040,
  details: "Fungal disease affecting nightshade family crops. Current containment efforts showing positive results.",
  recommendations: ["Apply copper-based fungicide", "Improve air circulation", "Rotate crops next season"]
}, {
  id: 5,
  disease_name: "Soybean Rust",
  severity: "low",
  affected_crops: ["Soybean"],
  reported_date: "2025-03-28",
  status: "resolved",
  location_name: "Eluru",
  latitude: 16.7107,
  longitude: 81.1003,
  details: "Successfully treated outbreak of soybean rust. Minimal crop loss reported.",
  recommendations: ["Monitor for recurrence", "Preventative fungicide application", "Consider resistant varieties next season"]
}];

// Define coordinates for a simplified India map visualization
const indiaMapCoordinates = [{
  region: "Andhra Pradesh",
  x: 70,
  y: 70,
  radius: 15
}, {
  region: "Visakhapatnam",
  x: 75,
  y: 65,
  radius: 5
}, {
  region: "Vijayawada",
  x: 70,
  y: 75,
  radius: 5
}, {
  region: "Karnataka",
  x: 60,
  y: 80,
  radius: 12
}, {
  region: "Tamil Nadu",
  x: 65,
  y: 90,
  radius: 12
}, {
  region: "Kerala",
  x: 55,
  y: 95,
  radius: 10
}, {
  region: "Maharashtra",
  x: 50,
  y: 65,
  radius: 15
}, {
  region: "Gujarat",
  x: 30,
  y: 60,
  radius: 12
}, {
  region: "Rajasthan",
  x: 35,
  y: 45,
  radius: 15
}, {
  region: "Punjab",
  x: 40,
  y: 30,
  radius: 10
}, {
  region: "Haryana",
  x: 45,
  y: 35,
  radius: 8
}, {
  region: "Uttar Pradesh",
  x: 60,
  y: 40,
  radius: 15
}, {
  region: "Bihar",
  x: 75,
  y: 45,
  radius: 10
}, {
  region: "West Bengal",
  x: 85,
  y: 50,
  radius: 10
}, {
  region: "Odisha",
  x: 75,
  y: 60,
  radius: 10
}, {
  region: "Madhya Pradesh",
  x: 55,
  y: 55,
  radius: 15
}, {
  region: "Telangana",
  x: 60,
  y: 70,
  radius: 12
}];

const DiseaseOutbreaks: React.FC = () => {
  const [outbreaks, setOutbreaks] = useState<DiseaseOutbreak[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDiseaseOutbreaks = async () => {
      try {
        setLoading(true);
        const {
          data,
          error
        } = await supabase.from('disease_outbreaks').select('*');
        if (error) {
          console.error("Error fetching disease outbreaks:", error);
          setError("Failed to fetch disease outbreak data. Using fallback data.");
          setOutbreaks(fallbackData);
          return;
        }
        if (data && data.length > 0) {
          const transformedData: DiseaseOutbreak[] = data.map(item => ({
            id: typeof item.id === 'string' ? parseInt(item.id, 10) : Number(item.id),
            disease_name: item.disease_name,
            severity: item.severity as "low" | "medium" | "high" || "medium",
            affected_crops: ["Unknown"],
            reported_date: item.created_at || new Date().toISOString().split('T')[0],
            status: item.status as "active" | "contained" | "resolved" || "active",
            location_name: item.location || "Unknown",
            latitude: Number(item.latitude) || 0,
            longitude: Number(item.longitude) || 0,
            details: "No details available for this outbreak.",
            recommendations: ["Monitor for symptoms", "Report new cases", "Follow local guidelines"]
          }));
          setOutbreaks(transformedData);
        } else {
          console.warn("No disease outbreak data found, using fallback data");
          setOutbreaks(fallbackData);
        }
      } catch (err) {
        console.error("Error in disease outbreaks fetch:", err);
        setError("An unexpected error occurred. Using fallback data.");
        setOutbreaks(fallbackData);
      } finally {
        setLoading(false);
      }
    };
    fetchDiseaseOutbreaks();
  }, []);
  
  const filteredOutbreaks = activeTab === "all" ? outbreaks : outbreaks.filter(outbreak => outbreak.status === activeTab);
  
  if (loading) {
    return <LoadingSkeleton />;
  }
  
  // Get nearby locations from outbreaks data
  const getNearbyLocations = () => {
    // Only display active and contained outbreaks as nearby
    return outbreaks
      .filter(outbreak => outbreak.status === 'active' || outbreak.status === 'contained')
      .map(outbreak => ({
        locationName: outbreak.location_name,
        severity: outbreak.severity,
        diseaseName: outbreak.disease_name,
        status: outbreak.status
      }));
  };
  
  const nearbyLocations = getNearbyLocations();
  
  return <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Disease Outbreaks</h1>
        <p className="text-muted-foreground">
          Monitor active crop disease outbreaks and get recommendations
        </p>
      </div>

      {error && <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>}

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Outbreaks</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="contained">Contained</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Nearby Locations List - Replacing Map Visualization */}
            {nearbyLocations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Nearby Disease Outbreaks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {nearbyLocations.map((location, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${
                        location.severity === 'high' ? 'border-red-300 bg-red-50 dark:bg-red-900/10' : 
                        location.severity === 'medium' ? 'border-amber-300 bg-amber-50 dark:bg-amber-900/10' : 
                        'border-green-300 bg-green-50 dark:bg-green-900/10'
                      }`}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <MapPin className={`h-4 w-4 mr-2 ${
                              location.severity === 'high' ? 'text-red-600' : 
                              location.severity === 'medium' ? 'text-amber-600' : 
                              'text-green-600'
                            }`} />
                            <span className="font-medium">{location.locationName}</span>
                          </div>
                          <Badge variant="outline" className={statusColorMap[location.status]}>
                            {location.status.charAt(0).toUpperCase() + location.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm mt-1 ml-6">
                          {location.diseaseName} - 
                          <span className={`font-medium ${
                            location.severity === 'high' ? 'text-red-600' : 
                            location.severity === 'medium' ? 'text-amber-600' : 
                            'text-green-600'
                          }`}>
                            {location.severity.charAt(0).toUpperCase() + location.severity.slice(1)} Severity
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredOutbreaks.map(outbreak => <OutbreakCard key={outbreak.id} outbreak={outbreak} />)}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>;
};

const OutbreakCard: React.FC<{
  outbreak: DiseaseOutbreak;
}> = ({
  outbreak
}) => {
  return <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{outbreak.disease_name}</CardTitle>
          <Badge variant="outline" className={statusColorMap[outbreak.status]}>
            {outbreak.status.charAt(0).toUpperCase() + outbreak.status.slice(1)}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className={severityColorMap[outbreak.severity]}>
            Severity: {outbreak.severity.charAt(0).toUpperCase() + outbreak.severity.slice(1)}
          </Badge>
          <Badge variant="outline">
            {new Date(outbreak.reported_date).toLocaleDateString()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-3">
          <strong>Location:</strong> {outbreak.location_name}
        </div>
        <div className="text-sm text-muted-foreground mb-3">
          <strong>Affected Crops:</strong> {outbreak.affected_crops.join(", ")}
        </div>
        <Separator className="my-3" />
        <div className="text-sm mb-3">
          <p>{outbreak.details}</p>
        </div>
        <div className="text-sm">
          <strong>Recommendations:</strong>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            {outbreak.recommendations.map((rec, idx) => <li key={idx}>{rec}</li>)}
          </ul>
        </div>
      </CardContent>
    </Card>;
};

const LoadingSkeleton = () => <div className="space-y-6">
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold tracking-tight">Disease Outbreaks</h1>
      <p className="text-muted-foreground">
        Monitor active crop disease outbreaks and get recommendations
      </p>
    </div>
    
    <div className="w-full h-64 bg-muted/50 rounded-lg">
      <Skeleton className="h-full w-full" />
    </div>
    
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map(i => <Card key={i}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-24" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full my-2" />
            <Skeleton className="h-4 w-3/4 my-2" />
            <Skeleton className="h-4 w-full my-2" />
            <Skeleton className="h-4 w-5/6 my-2" />
            <Skeleton className="h-4 w-full my-2" />
          </CardContent>
        </Card>)}
    </div>
  </div>;

export default DiseaseOutbreaks;
