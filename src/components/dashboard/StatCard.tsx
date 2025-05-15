
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: ReactNode;
}

const StatCard = ({ title, value, change, trend = "neutral", icon }: StatCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-500";
      case "down":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="agri-stats-card">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {change && (
          <p className={`text-xs mt-1 ${getTrendColor()}`}>
            {change}
          </p>
        )}
      </div>
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
