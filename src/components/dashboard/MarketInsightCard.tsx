
import { TrendingUp, TrendingDown, Percent } from "lucide-react";

const MarketInsightCard = () => {
  // Mock data - in a real app, this would come from API or database
  const marketData = [
    {
      id: 1,
      crop: "Wheat",
      price: "₹2,250",
      unit: "per quintal",
      change: "+4.2%",
      trend: "up"
    },
    {
      id: 2,
      crop: "Rice",
      price: "₹3,120",
      unit: "per quintal",
      change: "-1.5%",
      trend: "down"
    },
    {
      id: 3,
      crop: "Soybeans",
      price: "₹4,080",
      unit: "per quintal",
      change: "+2.3%",
      trend: "up"
    },
    {
      id: 4,
      crop: "Cotton",
      price: "₹6,750",
      unit: "per quintal",
      change: "+0.8%",
      trend: "up"
    }
  ];

  return (
    <div className="agri-dash-card">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg">Market Insights</h3>
        <button className="text-xs text-primary hover:underline">Marketplace</button>
      </div>
      
      <div className="flex-1">
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-2 text-left font-medium text-muted-foreground">Crop</th>
                <th className="px-4 py-2 text-right font-medium text-muted-foreground">Price</th>
                <th className="px-4 py-2 text-right font-medium text-muted-foreground">Change</th>
              </tr>
            </thead>
            <tbody>
              {marketData.map((item) => (
                <tr key={item.id} className="border-t border-border">
                  <td className="px-4 py-3 text-left">
                    <div className="font-medium">{item.crop}</div>
                    <div className="text-xs text-muted-foreground">{item.unit}</div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{item.price}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end">
                      {item.trend === "up" ? (
                        <TrendingUp className="h-3.5 w-3.5 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 text-red-500 mr-1" />
                      )}
                      <span className={item.trend === "up" ? "text-green-500" : "text-red-500"}>
                        {item.change}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Last updated: Today, 2:30 PM</span>
          <button className="flex items-center text-primary hover:underline">
            <Percent className="h-3 w-3 mr-1" />
            View trends
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketInsightCard;
