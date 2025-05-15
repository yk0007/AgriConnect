import { useState, useEffect } from "react";
import { 
  Menu, 
  Search, 
  Bell, 
  MessageSquare,
  X,
  AlertTriangle,
  Check,
  Info,
  Sprout,
  User,
  LogOut,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface NavbarProps {
  toggleSidebar: () => void;
  onLogoClick?: () => void;
}

interface SearchResult {
  title: string;
  path: string;
  category: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'alert' | 'warning' | 'info';
}

const Navbar = ({ toggleSidebar, onLogoClick }: NavbarProps) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  useEffect(() => {
    // Load notifications - in a real app, these would come from Supabase
    setNotifications([
      {
        id: 1,
        title: "Weather Alert",
        message: "Heavy rainfall expected in your area in the next 24 hours",
        time: "10 minutes ago",
        isRead: false,
        type: "alert"
      },
      {
        id: 2,
        title: "Crop Health",
        message: "Possible pest infestation detected in your north field",
        time: "2 hours ago",
        isRead: false,
        type: "warning"
      },
      {
        id: 3,
        title: "Market Update",
        message: "Wheat prices have increased by 5% since yesterday",
        time: "Yesterday",
        isRead: true,
        type: "info"
      }
    ]);
  }, []);

  const markNotificationRead = (id: number) => {
    setNotifications(
      notifications.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, isRead: true }))
    );
    
    toast({
      title: "All notifications marked as read",
      description: "Your notifications have been updated"
    });
  };
  
  const removeNotification = (id: number) => {
    setNotifications(
      notifications.filter(notification => notification.id !== id)
    );
  };

  // Pages for search results
  const searchResults: SearchResult[] = [
    { title: "Dashboard", path: "/dashboard", category: "Pages" },
    { title: "Crop Diagnostics", path: "/diagnostics", category: "AI Services" },
    { title: "Soil Analysis", path: "/soil-analysis", category: "AI Services" },
    { title: "Weather Insights", path: "/weather", category: "Monitor" },
    { title: "Community Forum", path: "/forum", category: "Community" },
    { title: "Marketplace", path: "/marketplace", category: "Shop" },
    { title: "Virtual Store", path: "/store", category: "Shop" },
    { title: "Farming Methods", path: "/farming-methods", category: "Knowledge" },
    { title: "Botanist Connect", path: "/botanists", category: "Experts" },
    { title: "AI Chatbot", path: "/chatbot", category: "AI Services" },
    { title: "Crop Recommender", path: "/crop-recommender", category: "AI Services" },
    { title: "Profile Settings", path: "/profile", category: "Account" }
  ];

  const filteredResults = searchQuery 
    ? searchResults.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getNotificationClass = (type: string) => {
    switch (type) {
      case 'alert':
        return "border-l-red-500 bg-red-50 dark:bg-red-950/20";
      case 'warning':
        return "border-l-amber-500 bg-amber-50 dark:bg-amber-950/20";
      case 'info':
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20";
      default:
        return "border-l-muted-foreground";
    }
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="mr-2 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center" onClick={onLogoClick} style={{cursor: 'pointer'}}>
            <div className="h-8 w-8 rounded-full overflow-hidden bg-primary flex items-center justify-center">
              <Sprout className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold font-heading ml-2">
              AgriConnect
            </h1>
          </div>
        </div>

        <div className={`flex-1 mx-4 transition-all duration-200 ${showSearch ? "opacity-100" : "opacity-0 hidden md:opacity-100 md:block"}`}>
          <div className="relative max-w-md mx-auto md:mx-0 md:ml-auto">
            <Command className="rounded-lg border shadow-md overflow-visible">
              <CommandInput 
                placeholder="Search features, pages..." 
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="sm:w-[300px] lg:w-[400px]"
              />
              {searchQuery && filteredResults.length > 0 && (
                <CommandList className="absolute top-full left-0 right-0 mt-1 bg-popover text-popover-foreground rounded-md shadow-md border z-50">
                  <CommandGroup>
                    {filteredResults.map((item, index) => (
                      <CommandItem
                        key={`${item.path}-${index}`}
                        onSelect={() => {
                          navigate(item.path);
                          setSearchQuery("");
                          setShowSearch(false);
                        }}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium">{item.title}</span>
                          <span className="ml-2 text-sm text-muted-foreground">
                            {item.category}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              )}
              {searchQuery && filteredResults.length === 0 && (
                <CommandList className="absolute top-full left-0 right-0 mt-1 bg-popover text-popover-foreground rounded-md shadow-md border z-50">
                  <CommandEmpty>No results found</CommandEmpty>
                </CommandList>
              )}
            </Command>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={toggleSearch}
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.some(n => !n.isRead) && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full"></span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-medium">Notifications</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto p-1"
                  onClick={markAllNotificationsRead}
                >
                  Mark all as read
                </Button>
              </div>
              <div className="max-h-80 overflow-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border-b border-border last:border-0 ${notification.isRead ? '' : 'bg-accent/10'}`}
                      onClick={() => markNotificationRead(notification.id)}
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          notification.type === 'alert' 
                            ? 'bg-destructive/10 text-destructive' 
                            : notification.type === 'warning'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-primary/10 text-primary'
                        }`}>
                          {notification.type === 'alert' ? 'Alert' : notification.type === 'warning' ? 'Warning' : 'Info'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-2 border-t border-border">
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/notifications')}>
                  View all notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/botanists')}
            aria-label="Chat"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
          
          {/* User profile dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <User className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-0" align="end">
              <div className="p-4 border-b border-border">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-accent overflow-hidden">
                    <img
                      src="/placeholder.svg"
                      alt="User avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">
                      {user?.email || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Farmer
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => navigate('/settings')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-destructive hover:bg-destructive/10" 
                  onClick={async () => {
                    try {
                      await supabase.auth.signOut();
                      navigate('/');
                      toast({
                        title: "Logged out successfully",
                        description: "You have been signed out of your account."
                      });
                    } catch (error) {
                      console.error("Error signing out:", error);
                    }
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
