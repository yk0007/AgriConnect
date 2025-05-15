
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, BellRing, Globe, Moon, Sun, Languages, CreditCard } from "lucide-react";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">Settings</h1>
        <p className="text-muted-foreground">
          Customize your app experience and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-flex">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5 text-primary" />
                General Settings
              </CardTitle>
              <CardDescription>
                Manage your app appearance and behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark theme
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4 text-muted-foreground" />
                  <Switch id="dark-mode" />
                  <Moon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div>
                  <h3 className="font-medium">Language</h3>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred language
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <Select defaultValue="english">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                      <SelectItem value="tamil">Tamil</SelectItem>
                      <SelectItem value="telugu">Telugu</SelectItem>
                      <SelectItem value="marathi">Marathi</SelectItem>
                      <SelectItem value="punjabi">Punjabi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div>
                  <h3 className="font-medium">Units of Measurement</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose between metric and imperial
                  </p>
                </div>
                <Select defaultValue="metric">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select unit system" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Metric (kg, km, °C)</SelectItem>
                    <SelectItem value="imperial">Imperial (lb, mi, °F)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div>
                  <h3 className="font-medium">Data Saver Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Reduce data usage on mobile connections
                  </p>
                </div>
                <Switch id="data-saver" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BellRing className="h-5 w-5 text-primary" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Manage how and when you receive alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Weather Alerts</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for extreme weather
                  </p>
                </div>
                <Switch id="weather-alerts" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div>
                  <h3 className="font-medium">Market Price Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    Get notified about significant price changes
                  </p>
                </div>
                <Switch id="market-alerts" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div>
                  <h3 className="font-medium">Crop Calendar Reminders</h3>
                  <p className="text-sm text-muted-foreground">
                    Reminders for planting and harvesting dates
                  </p>
                </div>
                <Switch id="calendar-alerts" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive important updates via email
                  </p>
                </div>
                <Switch id="email-alerts" />
              </div>
              
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div>
                  <h3 className="font-medium">Disease Outbreak Alerts</h3>
                  <p className="text-sm text-muted-foreground">
                    Get notified about crop disease outbreaks in your area
                  </p>
                </div>
                <Switch id="disease-alerts" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Subscription & Billing
              </CardTitle>
              <CardDescription>
                Manage your subscription and payment details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Current Plan</h3>
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    Free
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  You're currently on the Free plan. Upgrade to Premium for additional features.
                </p>
                <Button>Upgrade to Premium</Button>
              </div>
              
              <div className="border-t border-border pt-4">
                <h3 className="font-medium mb-4">Premium Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Ad-free experience</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Priority access to AI diagnostics</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Unlimited soil analysis reports</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Direct consultations with botanists</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Advanced crop monitoring tools</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default Settings;
