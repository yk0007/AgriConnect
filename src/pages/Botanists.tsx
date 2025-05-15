
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, Send, User, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Expert {
  id: number;
  name: string;
  avatar: string;
  specialty: string;
  experience: string;
  rating: number;
  availability: string;
  bio: string;
}

interface Message {
  id: number;
  senderId: number | string;
  text: string;
  timestamp: Date;
}

const Botanists = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [bookedExperts, setBookedExperts] = useState<number[]>([]);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Mock data for experts
  const experts: Expert[] = [
    {
      id: 1,
      name: "Dr. Anjali Sharma",
      avatar: "/placeholder.svg",
      specialty: "Rice & Wheat Specialist",
      experience: "15 years",
      rating: 4.9,
      availability: "Mon-Fri",
      bio: "Dr. Sharma is an expert in rice and wheat cultivation with 15 years of experience. She specializes in improving crop yields and disease resistance strategies for cereal crops."
    },
    {
      id: 2,
      name: "Dr. Rajesh Patel",
      avatar: "/placeholder.svg",
      specialty: "Soil Health Expert",
      experience: "12 years",
      rating: 4.7,
      availability: "Tue-Sat",
      bio: "Dr. Patel is a soil scientist with expertise in soil health management, nutrient optimization, and sustainable farming practices to improve soil fertility."
    },
    {
      id: 3,
      name: "Dr. Meena Singh",
      avatar: "/placeholder.svg",
      specialty: "Organic Farming",
      experience: "10 years",
      rating: 4.8,
      availability: "Mon-Wed, Fri",
      bio: "Dr. Singh is an organic farming expert who specializes in natural pest control, organic fertilizers, and sustainable agricultural practices."
    },
    {
      id: 4,
      name: "Prof. Vikas Kumar",
      avatar: "/placeholder.svg",
      specialty: "Crop Disease Expert",
      experience: "18 years",
      rating: 4.9,
      availability: "Wed-Sun",
      bio: "Prof. Kumar is a plant pathologist specializing in identifying and treating crop diseases across various agricultural crops common in India."
    }
  ];

  // Available time slots
  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];

  const handleBookConsultation = (expert: Expert) => {
    setSelectedExpert(expert);
    setShowBookingModal(true);
    setBookingConfirmed(false);
  };

  const handleStartChat = (expert: Expert) => {
    setSelectedExpert(expert);
    setShowChatModal(true);
    
    // Set initial messages for demo purposes
    const initialMessage = bookedExperts.includes(expert.id) 
      ? `Hello! I'm ${expert.name}, ${expert.specialty}. I see that we have a consultation scheduled. How can I assist you today?`
      : `Hello! I'm ${expert.name}, ${expert.specialty}. Please book a consultation before we can begin our chat.`;
    
    setMessages([
      {
        id: 1,
        senderId: expert.id,
        text: initialMessage,
        timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
      }
    ]);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedExpert) return;
    
    // Check if the expert is booked
    const isBooked = bookedExperts.includes(selectedExpert.id);
    
    if (!isBooked) {
      // Add system message that consultation needs to be booked
      const systemMessage = {
        id: Date.now(),
        senderId: 'system',
        text: "Please book a consultation with this expert before starting a chat.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, systemMessage]);
      setMessageInput("");
      return;
    }
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      senderId: user?.id || 'user',
      text: messageInput,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessageInput("");
    
    // Simulate expert response after a delay
    setTimeout(() => {
      const expertResponse = {
        id: Date.now() + 1,
        senderId: selectedExpert.id,
        text: `Thank you for your question. Based on my experience with ${selectedExpert.specialty.toLowerCase()}, I'd advise you to consider monitoring soil moisture levels and apply organic mulch to help retain moisture.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, expertResponse]);
    }, 2000);
  };

  const handleBookingSubmit = () => {
    if (!selectedDate || !selectedTime || !selectedExpert) return;
    
    // Add expert to booked experts
    setBookedExperts(prev => [...prev, selectedExpert.id]);
    setBookingConfirmed(true);
    
    toast({
      title: "Consultation Booked",
      description: `Your consultation with ${selectedExpert.name} has been scheduled for ${format(selectedDate, 'EEEE, MMMM d, yyyy')} at ${selectedTime}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Botanist Connect</h1>
        <p className="text-muted-foreground">Consult with agricultural experts for personalized advice</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experts.map((expert) => {
          const isBooked = bookedExperts.includes(expert.id);
          
          return (
            <Card key={expert.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-primary/10">
                      <AvatarImage src={expert.avatar} />
                      <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{expert.name}</CardTitle>
                      <CardDescription>{expert.specialty}</CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                      {expert.rating} ★
                    </Badge>
                    {isBooked && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        <Check className="h-3 w-3 mr-1" /> Booked
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Experience:</span>
                    <span>{expert.experience}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Availability:</span>
                    <span>{expert.availability}</span>
                  </div>
                  <p className="text-sm mt-2">{expert.bio}</p>
                  <div className="flex gap-3 mt-4">
                    {!isBooked ? (
                      <Button 
                        variant="default" 
                        className="flex-1"
                        onClick={() => handleBookConsultation(expert)}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Consultation
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleBookConsultation(expert)}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        View Booking
                      </Button>
                    )}
                    <Button 
                      variant={isBooked ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => handleStartChat(expert)}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Chat Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Booking Dialog */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {bookingConfirmed ? "Booking Confirmed" : "Book a Consultation"}
            </DialogTitle>
            <DialogDescription>
              {bookingConfirmed 
                ? `Your consultation with ${selectedExpert?.name} has been scheduled` 
                : `Schedule a consultation with ${selectedExpert?.name}`}
            </DialogDescription>
          </DialogHeader>
          
          {bookingConfirmed ? (
            <div className="py-6 space-y-6">
              <div className="bg-green-50 text-green-800 p-4 rounded-lg flex items-center">
                <div className="bg-green-100 rounded-full p-2 mr-4">
                  <Check className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h4 className="font-medium">Booking Confirmed</h4>
                  <p className="text-sm text-green-700">
                    {selectedDate && selectedTime 
                      ? `Scheduled for ${format(selectedDate, 'EEEE, MMMM d, yyyy')} at ${selectedTime}` 
                      : "Your consultation has been confirmed"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedExpert?.avatar || ""} />
                  <AvatarFallback>{selectedExpert?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedExpert?.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedExpert?.specialty}</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <Button variant="ghost" onClick={() => setShowBookingModal(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setShowBookingModal(false);
                  if (selectedExpert) handleStartChat(selectedExpert);
                }}>
                  <Send className="h-4 w-4 mr-2" />
                  Start Chat
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedExpert?.avatar || ""} />
                  <AvatarFallback>{selectedExpert?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedExpert?.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedExpert?.specialty}</p>
                </div>
              </div>
              
              <Tabs defaultValue="date" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="date">1. Select Date</TabsTrigger>
                  <TabsTrigger value="time" disabled={!selectedDate}>2. Select Time</TabsTrigger>
                </TabsList>
                <TabsContent value="date" className="p-4">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="mx-auto border rounded-md"
                    disabled={(date) => 
                      date < new Date() || 
                      date > new Date(new Date().setDate(new Date().getDate() + 30))
                    }
                  />
                </TabsContent>
                <TabsContent value="time" className="p-4">
                  <h3 className="text-sm font-medium mb-3">
                    Available time slots for {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : ''}
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map(time => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => setSelectedTime(time)}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {time}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="border-t pt-4 flex justify-between">
                <Button variant="ghost" onClick={() => setShowBookingModal(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleBookingSubmit} 
                  disabled={!selectedDate || !selectedTime}
                >
                  Confirm Booking
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Chat Dialog */}
      <Dialog open={showChatModal} onOpenChange={setShowChatModal}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={selectedExpert?.avatar || ""} />
                <AvatarFallback>{selectedExpert?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{selectedExpert?.name}</span>
              {selectedExpert && bookedExperts.includes(selectedExpert.id) && (
                <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-300">
                  <Check className="h-3 w-3 mr-1" /> Booked
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedExpert?.specialty}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto mb-4 max-h-[400px] min-h-[300px]">
            <div className="space-y-4 p-4">
              {messages.map((message) => {
                const isUserMessage = message.senderId === user?.id || message.senderId === 'user';
                const isSystemMessage = message.senderId === 'system';
                
                if (isSystemMessage) {
                  return (
                    <div key={message.id} className="flex justify-center">
                      <div className="bg-yellow-50 text-yellow-800 text-sm py-2 px-3 rounded-lg">
                        {message.text}
                      </div>
                    </div>
                  );
                }
                
                return (
                  <div 
                    key={message.id}
                    className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-2 max-w-[80%] ${isUserMessage ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage 
                          src={isUserMessage ? (user?.user_metadata?.avatar_url || "/placeholder.svg") : selectedExpert?.avatar || ""} 
                        />
                        <AvatarFallback>
                          {isUserMessage ? (user?.user_metadata?.first_name?.[0] || "U") : selectedExpert?.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className={`rounded-lg px-3 py-2 ${
                          isUserMessage 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm">{message.text}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(message.timestamp, 'p')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Typing indicator when no messages */}
              {messages.length === 0 && (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Start chatting with {selectedExpert?.name}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 mt-auto">
            <Input 
              placeholder="Type your message..." 
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
              disabled={selectedExpert ? !bookedExperts.includes(selectedExpert.id) : true}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={selectedExpert ? !bookedExperts.includes(selectedExpert.id) : true}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {selectedExpert && !bookedExperts.includes(selectedExpert.id) && (
            <div className="mt-2 text-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setShowChatModal(false);
                  handleBookConsultation(selectedExpert);
                }}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Book a consultation to chat
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Botanists;
