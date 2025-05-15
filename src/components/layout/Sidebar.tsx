
import { Link, useLocation } from "react-router-dom";
import { 
  Leaf, 
  CloudRain, 
  Beaker, 
  Users, 
  ShoppingBag, 
  MessageSquare,
  ChevronsLeft,
  LogOut,
  Menu,
  Settings,
  Store,
  Heart,
  BookOpen,
  User,
  Tractor,
  AlertTriangle,
  Sprout,
  LayoutDashboard
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  const categories = [
    {
      name: "Main",
      items: [
        { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      ]
    },
    {
      name: "AI Services",
      items: [
        { name: "Crop Diagnostics", icon: Leaf, path: "/diagnostics" },
        { name: "Soil Health Analysis", icon: Beaker, path: "/soil-analysis" },
        { name: "Crop Recommender", icon: Leaf, path: "/crop-recommender" },
        { name: "FarmAI", icon: MessageSquare, path: "/chatbot" },
      ]
    },
    {
      name: "Monitor & Track",
      items: [
        { name: "Weather Insights", icon: CloudRain, path: "/weather" },
        { name: "Disease Outbreaks", icon: AlertTriangle, path: "/disease-outbreaks" },
      ]
    },
    {
      name: "Community",
      items: [
        { name: "Botanist Connect", icon: Users, path: "/botanists" },
        { name: "Community Forum", icon: Heart, path: "/forum" },
        { name: "Farming Methods", icon: BookOpen, path: "/farming-methods" },
      ]
    },
    {
      name: "Marketplace",
      items: [
        { name: "Buy Supplies", icon: ShoppingBag, path: "/marketplace" },
        { name: "Virtual Store", icon: Store, path: "/store" },
      ]
    }
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account"
      });
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: "There was a problem signing out. Please try again."
      });
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-30 h-screen bg-card shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-0 lg:w-20"
        } lg:relative lg:top-auto lg:left-auto overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link to="/dashboard" className="flex items-center">
              <div className="flex shrink-0 items-center justify-center h-10 w-10 rounded-full overflow-hidden bg-primary">
                <Sprout className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className={`ml-3 font-semibold text-foreground transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 lg:opacity-0"}`}>
                AgriConnect
              </span>
            </Link>
            <button
              onClick={toggleSidebar}
              className="text-foreground hover:text-primary p-1 rounded-md"
            >
              {isOpen ? <ChevronsLeft size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-6">
              {categories.map((category, idx) => (
                <div key={idx} className="space-y-1">
                  {isOpen && (
                    <h3 className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {category.name}
                    </h3>
                  )}
                  {category.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={cn(
                          "flex items-center px-3 py-2 rounded-md group transition-colors",
                          isActive 
                            ? "bg-primary/10 text-primary" 
                            : "text-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span className={`ml-3 transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 lg:opacity-0"}`}>
                          {item.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t border-border"></div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
