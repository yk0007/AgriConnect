import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Plus, Leaf, History, Image, Paperclip, Search, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ApiKeySettings from "@/components/layout/ApiKeySettings";
import { useLocation, useNavigate } from "react-router-dom";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ApiMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const Chatbot = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! I'm FarmAI, your personal farming assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const [conversationHistory, setConversationHistory] = useState<{id: string, date: Date, title: string}[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState<string>("general");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const newConversationId = uuidv4();
    setConversationId(newConversationId);
    fetchConversationsList();
    
    const query = new URLSearchParams(location.search).get('query');
    if (query) {
      navigate('/chatbot', { replace: true });
      setTimeout(() => {
        handleSendMessage(null, decodeURIComponent(query));
      }, 300);
    }
  }, []);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user || !conversationId) return;
      
      try {
        const { data, error } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("user_id", user.id)
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true });
          
        if (error) {
          console.error("Error fetching chat history:", error);
          return;
        }
        
        if (data && data.length > 0) {
          const historyMessages = data.map(msg => ({
            id: msg.id,
            content: msg.content,
            role: msg.role as "user" | "assistant",
            timestamp: new Date(msg.created_at)
          }));
          
          setMessages(prev => {
            if (prev.length === 1 && prev[0].id === "1") {
              return [...prev, ...historyMessages];
            }
            return historyMessages;
          });
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    };
    
    fetchChatHistory();
  }, [user, conversationId]);

  const fetchConversationsList = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("conversation_id, created_at, content")
        .eq("user_id", user.id)
        .eq("role", "user")
        .order("created_at", { ascending: false });
        
      if (error) {
        throw error;
      }
      
      if (data) {
        const uniqueConversations = data.reduce((acc: {id: string, date: Date, title: string}[], curr) => {
          if (!acc.some(conv => conv.id === curr.conversation_id)) {
            const title = curr.content.length > 20 
              ? curr.content.substring(0, 20) + "..." 
              : curr.content;
            
            acc.push({
              id: curr.conversation_id,
              date: new Date(curr.created_at),
              title: title
            });
          }
          return acc;
        }, []);
        
        setConversationHistory(uniqueConversations);
      }
    } catch (error) {
      console.error("Failed to fetch conversations list:", error);
    }
  };

  const loadConversation = async (id: string) => {
    setConversationId(id);
    setMessages([{
      id: "1",
      content: "Loading conversation...",
      role: "assistant",
      timestamp: new Date()
    }]);
    
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("user_id", user.id)
        .eq("conversation_id", id)
        .order("created_at", { ascending: true });
        
      if (error) {
        throw error;
      }
      
      if (data) {
        const historyMessages = data.map(msg => ({
          id: msg.id,
          content: msg.content,
          role: msg.role as "user" | "assistant",
          timestamp: new Date(msg.created_at)
        }));
        
        setMessages(historyMessages.length > 0 ? historyMessages : [{
          id: "1",
          content: "Hi! I'm FarmAI, your personal farming assistant. How can I help you today?",
          role: "assistant",
          timestamp: new Date()
        }]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Failed to load conversation:", error);
      toast({
        title: "Error",
        description: "Failed to load conversation history."
      });
    }
  };

  const startNewConversation = () => {
    const newId = uuidv4();
    setConversationId(newId);
    setMessages([
      {
        id: "1",
        content: "Hi! I'm FarmAI, your personal farming assistant. How can I help you today?",
        role: "assistant",
        timestamp: new Date()
      },
      {
        id: "2",
        content: `**Here are some things I can help you with about ${selectedCrop !== 'general' ? selectedCrop : 'crops'}:**\n\n• Identify crop diseases and pests\n• Recommend optimal planting schedules\n• Provide fertilizer guidance\n• Advise on irrigation best practices\n• Suggest crop rotation strategies`,
        role: "assistant",
        timestamp: new Date()
      }
    ]);
    setShowSuggestions(true);
  };

  const deleteConversation = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("chat_messages")
        .delete()
        .eq("user_id", user.id)
        .eq("conversation_id", id);
        
      if (error) throw error;
      
      setConversationHistory(prev => prev.filter(conv => conv.id !== id));
      
      if (id === conversationId) {
        startNewConversation();
      }
      
      toast({
        title: "Conversation deleted",
        description: "The conversation has been removed successfully"
      });
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the conversation"
      });
    }
  };

  const suggestedQuestions = [
    "How do I identify tomato blight?",
    "What's the best fertilizer for rice crops?",
    "How often should I water my wheat crop?",
    "How to control pests organically?",
    "When is the best time to plant maize in my region?"
  ];
  
  useEffect(() => {
    if (selectedCrop !== "general") {
      const cropSpecificMessage = {
        id: uuidv4(),
        content: `Would you like to know more about ${selectedCrop} farming? I can help with growing conditions, diseases, or best practices.`,
        role: "assistant" as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, cropSpecificMessage]);
      setShowSuggestions(true);
    }
  }, [selectedCrop]);
  
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement> | null, suggestedQuestion?: string) => {
    if (e) e.preventDefault();
    
    const messageText = suggestedQuestion || input;
    if (!messageText.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      role: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    if (!suggestedQuestion) setInput("");
    setLoading(true);
    setShowSuggestions(false);
    
    try {
      const apiMessages: ApiMessage[] = messages
        .filter(m => m.id !== "1" && m.id !== "2")
        .map(m => ({
          role: m.role,
          content: m.content
        }));
      
      if (selectedCrop !== "general") {
        apiMessages.push({
          role: "system",
          content: `The user is asking about ${selectedCrop} crops or farming. Focus your responses on this crop when relevant.`
        });
      }
      
      apiMessages.push({
        role: "user",
        content: messageText
      });
      
      const response = await supabase.functions.invoke("chat-with-groq", {
        body: { 
          messages: apiMessages,
          conversationId: conversationId,
          userId: user?.id
        }
      });
      
      console.log("AI response:", response);
      
      if (!response.data) {
        throw new Error("Invalid response from AI service");
      }
      
      const botResponse = response.data.choices[0].message.content;
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        role: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      fetchConversationsList();
    } catch (error) {
      console.error("Error calling AI service:", error);
      
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Failed to connect to the AI service. Please ensure the GROQ API key is set.",
      });
      
      let fallbackResponse = "**I'm having trouble connecting to my knowledge base**\n\nHere are some things I can help with when I'm back online:\n\n• Identify common crop diseases and pests\n• Suggest optimal planting schedules\n• Provide fertilizer recommendations\n• Advise on irrigation best practices\n\nPlease try again in a moment or check if the GROQ API key has been configured.";
      
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: fallbackResponse,
        role: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-500" />
            FarmAI Assistant
          </h1>
          <p className="text-muted-foreground">
            Your personal AI-powered farming companion for expert agricultural advice
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="general" onValueChange={(value) => setSelectedCrop(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select crop" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Farming</SelectItem>
              <SelectItem value="rice">Rice</SelectItem>
              <SelectItem value="wheat">Wheat</SelectItem>
              <SelectItem value="maize">Maize</SelectItem>
              <SelectItem value="cotton">Cotton</SelectItem>
              <SelectItem value="sugarcane">Sugarcane</SelectItem>
              <SelectItem value="potato">Potato</SelectItem>
              <SelectItem value="tomato">Tomato</SelectItem>
              <SelectItem value="coffee">Coffee</SelectItem>
            </SelectContent>
          </Select>
          {user && <ApiKeySettings />}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="hidden md:block md:col-span-3">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium">Conversations</h2>
              <Button variant="ghost" size="sm" onClick={startNewConversation} title="New Chat">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search chats..." className="pl-9 text-sm" />
            </div>
            
            <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
              {conversationHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2 px-3">
                  No previous conversations found
                </p>
              ) : (
                conversationHistory.map((conv) => (
                  <div key={conv.id} className="flex group">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`justify-start text-left w-full h-auto py-2 px-3 rounded-r-none ${
                        conv.id === conversationId ? "bg-muted" : ""
                      }`}
                      onClick={() => loadConversation(conv.id)}
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-xs text-muted-foreground">{formatDate(conv.date)}</span>
                        <span className="text-sm font-medium truncate w-full">{conv.title}</span>
                      </div>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`px-2 h-auto py-2 rounded-l-none opacity-0 group-hover:opacity-100 ${
                            conv.id === conversationId ? "bg-muted" : ""
                          }`}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this conversation? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deleteConversation(conv.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        <Card className="md:col-span-9 h-[600px] flex flex-col bg-white dark:bg-gray-900/60">
          <CardHeader className="border-b bg-muted/30 rounded-t-lg pt-3 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-9 w-9 bg-gradient-to-br from-green-400 to-green-600">
                  <AvatarFallback className="bg-transparent text-white">
                    <Leaf className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">FarmAI</CardTitle>
                  <CardDescription>Agricultural Knowledge Assistant</CardDescription>
                </div>
              </div>
              <div className="flex items-center">
                <Popover>
                  <PopoverTrigger asChild className="md:hidden">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <History className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-80">
                    <div className="space-y-2">
                      <h3 className="font-medium">Chat History</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-left mb-2"
                        onClick={startNewConversation}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Conversation
                      </Button>
                      
                      <div className="max-h-64 overflow-y-auto space-y-1">
                        {conversationHistory.length === 0 ? (
                          <p className="text-sm text-muted-foreground py-2">
                            No previous conversations found
                          </p>
                        ) : (
                          conversationHistory.map((conv) => (
                            <div key={conv.id} className="flex items-center group">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className={`flex-1 justify-start text-left h-auto py-2 ${
                                  conv.id === conversationId ? "bg-muted" : ""
                                }`}
                                onClick={() => loadConversation(conv.id)}
                              >
                                <div className="flex flex-col items-start">
                                  <span className="text-xs text-muted-foreground">{formatDate(conv.date)}</span>
                                  <span className="truncate w-full">{conv.title}</span>
                                </div>
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="p-1 h-auto"
                                  >
                                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this conversation? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => deleteConversation(conv.id)}
                                      className="bg-destructive hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" onClick={startNewConversation}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 mr-2 shrink-0 mt-1">
                      <AvatarFallback className="bg-green-500 text-white">
                        <Leaf className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div 
                    className={`max-w-[85%] p-3 rounded-lg shadow-sm ${
                      message.role === "user" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted dark:bg-gray-800/80"
                    }`}
                  >
                    <div className="prose prose-sm dark:prose-invert" 
                      dangerouslySetInnerHTML={{ 
                        __html: message.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n/g, '<br>')
                      }} 
                    />
                    <p 
                      className={`text-xs mt-1.5 ${
                        message.role === "user" 
                          ? "text-primary-foreground/70" 
                          : "text-muted-foreground"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>

                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 ml-2 shrink-0 mt-1">
                      <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {user?.user_metadata?.first_name?.[0] || user?.email?.[0].toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {showSuggestions && messages.length <= 2 && (
                <div className="flex justify-center mt-6">
                  <div className="grid grid-cols-1 gap-2 w-full">
                    {suggestedQuestions.map((question, i) => (
                      <Button 
                        key={i} 
                        variant="outline" 
                        size="sm" 
                        className="justify-start text-left h-auto py-2 px-3 font-normal bg-muted/50 hover:bg-muted transition-colors"
                        onClick={() => handleSendMessage(null, question)}
                        disabled={loading}
                      >
                        <Leaf className="h-4 w-4 mr-2 text-green-500 shrink-0" />
                        <span className="line-clamp-1 text-left">{question}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {loading && (
                <div className="flex justify-start">
                  <Avatar className="h-8 w-8 mr-2 shrink-0">
                    <AvatarFallback className="bg-green-500 text-white">
                      <Leaf className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="max-w-[80%] p-4 rounded-lg bg-muted dark:bg-gray-800/80">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter className="pt-2 pb-3 px-4 border-t">
            <form onSubmit={(e) => handleSendMessage(e)} className="flex w-full space-x-2">
              <Button 
                type="button" 
                size="icon" 
                variant="ghost"
                className="shrink-0"
                onClick={startNewConversation}
              >
                <Plus className="h-5 w-5" />
              </Button>
              <div className="relative flex-1">
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about farming, crops, diseases..."
                  className="pr-24"
                  disabled={loading}
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <Image className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button 
                type="submit" 
                size="icon"
                disabled={!input.trim() || loading}
                className="shrink-0 bg-green-600 hover:bg-green-700"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Chatbot;
