
import { AlertTriangle, BellRing, Lightbulb, X } from "lucide-react";
import { useState } from "react";

const AlertsCard = () => {
  // In a real app, these would come from the API/database
  const initialAlerts = [
    {
      id: 1,
      type: "weather",
      title: "Heavy rain expected",
      message: "60mm rainfall predicted in next 48 hours",
      timeAgo: "10 minutes ago",
      severity: "warning"
    },
    {
      id: 2,
      type: "disease",
      title: "Potential wheat rust detected",
      message: "Field 3 showing signs of early stage leaf rust",
      timeAgo: "2 hours ago",
      severity: "critical"
    },
    {
      id: 3,
      type: "tip",
      title: "Ideal time for winter crops",
      message: "Weather conditions optimal for sowing wheat",
      timeAgo: "1 day ago",
      severity: "info"
    }
  ];

  const [alerts, setAlerts] = useState(initialAlerts);

  const dismissAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <BellRing className="h-5 w-5 text-amber-500" />;
      case "info":
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
      default:
        return <BellRing className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-l-red-500 bg-red-50 dark:bg-red-950/20";
      case "warning":
        return "border-l-amber-500 bg-amber-50 dark:bg-amber-950/20";
      case "info":
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20";
      default:
        return "border-l-muted-foreground";
    }
  };

  return (
    <div className="agri-dash-card">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg">Alerts & Notifications</h3>
        <button className="text-xs text-primary hover:underline">Settings</button>
      </div>
      
      <div className="space-y-3 flex-1">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`relative p-3 border-l-4 rounded-md ${getSeverityClass(alert.severity)}`}
            >
              <div className="flex">
                <div className="mr-3">
                  {getSeverityIcon(alert.severity)}
                </div>
                <div className="flex-1 pr-6">
                  <h4 className="text-sm font-medium">{alert.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{alert.timeAgo}</p>
                </div>
                <button 
                  onClick={() => dismissAlert(alert.id)}
                  className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-6">
            <BellRing className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No new alerts</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsCard;
