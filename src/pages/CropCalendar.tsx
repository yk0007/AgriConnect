
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, Droplets, Leaf, AlertTriangle, Sun, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format, addDays } from "date-fns";
import { toast } from "@/hooks/use-toast";

const CropCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [addEventDialogOpen, setAddEventDialogOpen] = useState(false);
  const [eventDetailsDialogOpen, setEventDetailsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  
  // Mock crop calendar events
  const [events, setEvents] = useState([
    {
      id: 1,
      date: new Date(2025, 3, 18),
      title: "Rice Sowing",
      type: "planting",
      crop: "Rice",
      description: "Start sowing rice seeds",
      tips: "Ensure proper seed spacing and adequate water"
    },
    {
      id: 2,
      date: new Date(2025, 3, 20),
      title: "Wheat Fertilization",
      type: "fertilizing",
      crop: "Wheat",
      description: "Apply second round of fertilizer",
      tips: "Use NPK balanced fertilizer during this phase"
    },
    {
      id: 3,
      date: new Date(2025, 3, 25),
      title: "Tomato Irrigation",
      type: "irrigation",
      crop: "Tomatoes",
      description: "Scheduled irrigation for tomato plants",
      tips: "Water deeply but infrequently to encourage deep root growth"
    },
    {
      id: 4,
      date: new Date(2025, 4, 5),
      title: "Pest Control - Rice",
      type: "maintenance",
      crop: "Rice",
      description: "Apply organic pesticide spray",
      tips: "Mix neem oil with water and apply during early morning"
    },
    {
      id: 5,
      date: new Date(2025, 5, 10),
      title: "Wheat Harvesting",
      type: "harvesting",
      crop: "Wheat",
      description: "Begin wheat harvesting",
      tips: "Check grain moisture content before harvesting"
    }
  ]);
  
  // Helper to get events for the selected date
  const getEventsForDate = (date?: Date) => {
    if (!date) return [];
    
    return events.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };
  
  // Get upcoming events (next 7 days)
  const getUpcomingEvents = () => {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    
    return events.filter(event => 
      event.date >= now && event.date <= nextWeek
    ).sort((a, b) => a.date.getTime() - b.date.getTime());
  };
  
  // Helper to get badge color by event type
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "planting": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "harvesting": return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "fertilizing": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "irrigation": return "bg-cyan-100 text-cyan-800 hover:bg-cyan-200";
      case "maintenance": return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };
  
  // Helper to get icon by event type
  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "planting": return <Leaf className="h-4 w-4" />;
      case "harvesting": return <Leaf className="h-4 w-4" />;
      case "fertilizing": return <Sun className="h-4 w-4" />;
      case "irrigation": return <Droplets className="h-4 w-4" />;
      case "maintenance": return <AlertTriangle className="h-4 w-4" />;
      default: return <CalendarIcon className="h-4 w-4" />;
    }
  };
  
  const handleAddEvent = () => {
    // Simulate adding an event
    const newEvent = {
      id: events.length + 1,
      date: selectedDate || new Date(),
      title: "New Event",
      type: "planting",
      crop: "Corn",
      description: "New event added by user",
      tips: "This is a custom event"
    };
    
    setEvents([...events, newEvent]);
    setAddEventDialogOpen(false);
    
    toast({
      title: "Event added",
      description: `New event has been added to your calendar.`,
    });
  };
  
  const viewEventDetails = (event: any) => {
    setSelectedEvent(event);
    setEventDetailsDialogOpen(true);
  };
  
  const selectedDateEvents = getEventsForDate(selectedDate);
  const upcomingEvents = getUpcomingEvents();
  
  // Function to check if a date has events
  const hasEvents = (date: Date) => {
    return events.some(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };
  
  // Custom modifiers for the calendar
  const modifiers = {
    hasEvent: events.map(event => new Date(event.date)),
  };
  
  // Custom modifiers styles
  const modifiersStyles = {
    hasEvent: {
      color: 'white',
      backgroundColor: 'var(--primary)',
    },
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Crop Calendar</h1>
          <p className="text-muted-foreground">
            Track planting, irrigation, and harvesting schedules for your crops
          </p>
        </div>
        <Button onClick={() => setAddEventDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Calendar Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Crop Schedule</CardTitle>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      const prev = new Date(currentMonth);
                      prev.setMonth(prev.getMonth() - 1);
                      setCurrentMonth(prev);
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      const next = new Date(currentMonth);
                      next.setMonth(next.getMonth() + 1);
                      setCurrentMonth(next);
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className="rounded-md border"
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
              />
              
              <div className="mt-6">
                <h3 className="font-semibold mb-4">
                  Events for {selectedDate ? format(selectedDate, "PPPP") : "Today"}
                </h3>
                
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateEvents.map(event => (
                      <div 
                        key={event.id} 
                        className="border rounded-lg p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                        onClick={() => viewEventDetails(event)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">{event.crop}</p>
                          </div>
                          <Badge className={getEventTypeColor(event.type)}>
                            {event.type}
                          </Badge>
                        </div>
                        <p className="text-sm mt-2">{event.description}</p>
                        <div className="flex items-center gap-1 text-sm text-primary mt-2">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Tip: {event.tips}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No events scheduled for this date
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="crops">My Crops</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    Next 7 Days
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingEvents.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingEvents.map(event => (
                        <div 
                          key={event.id} 
                          className="flex items-start space-x-3 border-b border-border pb-3 last:border-0 last:pb-0 hover:bg-accent/50 cursor-pointer transition-colors rounded-md p-2"
                          onClick={() => viewEventDetails(event)}
                        >
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            event.type === 'planting' ? 'bg-green-100 text-green-800' : 
                            event.type === 'harvesting' ? 'bg-amber-100 text-amber-800' :
                            event.type === 'fertilizing' ? 'bg-blue-100 text-blue-800' :
                            event.type === 'irrigation' ? 'bg-cyan-100 text-cyan-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {getEventTypeIcon(event.type)}
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-medium">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">{event.crop}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CalendarIcon className="h-3.5 w-3.5" />
                              <span>{format(event.date, "dd MMM")}</span>
                              <Clock className="h-3.5 w-3.5 ml-1" />
                              <span>All day</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No upcoming events in the next 7 days
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="crops" className="mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-primary" />
                    Crop Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">Rice</h3>
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          Growing
                        </Badge>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Planted</p>
                          <p>March 15, 2025</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Harvest In</p>
                          <p>~90 days</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">Wheat</h3>
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                          Ready for Harvest
                        </Badge>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Planted</p>
                          <p>Nov 10, 2024</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Ready for</p>
                          <p>Harvesting</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">Tomatoes</h3>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                          Seedling
                        </Badge>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Planted</p>
                          <p>April 5, 2025</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Harvest In</p>
                          <p>~75 days</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Droplets className="h-5 w-5 text-primary" />
                Irrigation Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center">
                      <Droplets className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Rice Field Irrigation</h4>
                      <p className="text-sm text-muted-foreground">Tomorrow, 6:00 AM</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast({
                    title: "Reminder set",
                    description: "You'll be notified before the irrigation schedule.",
                  })}>
                    Set Reminder
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center">
                      <Droplets className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Tomato Garden Irrigation</h4>
                      <p className="text-sm text-muted-foreground">April 20, 7:00 AM</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast({
                    title: "Reminder set",
                    description: "You'll be notified before the irrigation schedule.",
                  })}>
                    Set Reminder
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Add Event Dialog */}
      <Dialog open={addEventDialogOpen} onOpenChange={setAddEventDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Calendar Event</DialogTitle>
            <DialogDescription>
              Create a new event for your crop calendar
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="event-title" className="text-right">Title</label>
              <Input id="event-title" placeholder="Event Title" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="event-date" className="text-right">Date</label>
              <div className="col-span-3">
                <p className="text-sm text-muted-foreground">
                  {selectedDate ? format(selectedDate, "PPPP") : "Select a date on the calendar"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="event-type" className="text-right">Type</label>
              <Select defaultValue="planting">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planting">Planting</SelectItem>
                  <SelectItem value="harvesting">Harvesting</SelectItem>
                  <SelectItem value="fertilizing">Fertilizing</SelectItem>
                  <SelectItem value="irrigation">Irrigation</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="event-crop" className="text-right">Crop</label>
              <Select defaultValue="rice">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select crop" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rice">Rice</SelectItem>
                  <SelectItem value="wheat">Wheat</SelectItem>
                  <SelectItem value="corn">Corn</SelectItem>
                  <SelectItem value="tomatoes">Tomatoes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="event-desc" className="text-right">Description</label>
              <Textarea id="event-desc" placeholder="Event description" className="col-span-3" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddEventDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddEvent}>Save Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Event Details Dialog */}
      <Dialog open={eventDetailsDialogOpen} onOpenChange={setEventDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              {selectedEvent && format(selectedEvent.date, "PPPP")}
            </DialogDescription>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2">
                <Badge className={getEventTypeColor(selectedEvent.type)}>
                  {selectedEvent.type}
                </Badge>
                <span className="text-sm text-muted-foreground">{selectedEvent.crop}</span>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Description</h4>
                <p className="text-sm">{selectedEvent.description}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Tips</h4>
                <p className="text-sm bg-accent/50 p-3 rounded-md flex gap-2 items-start">
                  <AlertTriangle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{selectedEvent.tips}</span>
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEventDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CropCalendar;
