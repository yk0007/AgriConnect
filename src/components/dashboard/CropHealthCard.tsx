import { AlertTriangle, Check, Leaf } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const CropHealthCard = () => {
  // Mock data - in a real app, this would come from the database
  const crops = [
    { 
      id: 1, 
      name: "Wheat", 
      health: 85, 
      status: "healthy",
      area: "5 acres",
      stage: "Flowering"
    },
    { 
      id: 2, 
      name: "Rice", 
      health: 65, 
      status: "attention",
      area: "3 acres",
      stage: "Vegetative"
    },
    { 
      id: 3, 
      name: "Corn", 
      health: 92, 
      status: "healthy",
      area: "2 acres",
      stage: "Ripening"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-500";
      case "attention":
        return "text-amber-500";
      case "critical":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <Check className="h-4 w-4 text-green-500" />;
      case "attention":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="agri-dash-card">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg">Crop Health</h3>
        <button className="text-xs text-primary hover:underline">View All</button>
      </div>
      
      <div className="space-y-4 flex-1">
        {crops.map((crop) => (
          <div key={crop.id} className="p-3 bg-card border border-border rounded-md">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Leaf className="h-4 w-4 mr-2 text-primary" />
                <h4 className="font-medium">{crop.name}</h4>
              </div>
              <div className="flex items-center">
                {getStatusIcon(crop.status)}
                <span className={`text-xs ml-1 ${getStatusColor(crop.status)}`}>
                  {crop.health}%
                </span>
              </div>
            </div>
            
            <Progress value={crop.health} className="h-1.5 mb-2" />
            
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{crop.area}</span>
              <span>{crop.stage}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-border">
        <button className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm">
          Run Diagnostics
        </button>
      </div>
    </div>
  );
};

export default CropHealthCard;
