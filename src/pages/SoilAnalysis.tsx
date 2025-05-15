import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Beaker, Upload, FileText, Share2, MessageCircle, Loader2, BrainCog } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import SoilAnalysisHistory from "@/components/soil/SoilAnalysisHistory";

const SoilAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<null | any>(null);
  const [savingReport, setSavingReport] = useState(false);
  const [loadingAiInsights, setLoadingAiInsights] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [soilType, setSoilType] = useState<string>("Black");
  const [cropType, setCropType] = useState<string>("Wheat");
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [fieldName, setFieldName] = useState<string>("Field 1");
  const [showHistory, setShowHistory] = useState(false);
  const [formData, setFormData] = useState({
    nitrogen: 37,
    phosphorous: 0,
    potassium: 0,
    temperature: 26,
    humidity: 52,
    moisture: 38
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: parseFloat(value) || 0
    }));
  };
  
  const getAIInsights = async (soilData: any) => {
    try {
      setLoadingAiInsights(true);
      
      // Call the Edge Function to get insights from Gemini AI
      const response = await supabase.functions.invoke("soil-analysis", {
        body: { 
          fieldName: fieldName,
          phLevel: soilData.ph,
          nitrogen: soilData.nitrogen,
          phosphorus: soilData.phosphorus,
          potassium: soilData.potassium,
          organicMatter: soilData.organicMatter,
          moisture: soilData.moisture,
          ecLevel: 0.5, // Default value
          notes: `Soil type: ${soilType}, Crop type: ${cropType}`
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      if (response.data && response.data.analysis) {
        setAiInsights(response.data.analysis);
      } else {
        throw new Error("No analysis data received from AI");
      }
    } catch (error) {
      console.error("Error getting AI insights:", error);
      setAiInsights("Unable to generate AI insights at this time. Please try again later.");
      toast({
        title: "AI Insights Error",
        description: "Failed to get AI insights. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoadingAiInsights(false);
    }
  };

  const handleSoilAnalysis = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setAiInsights(null);
    
    // Instead of using the Gradio client, we'll simulate the API response
    setTimeout(async () => {
      // Generate fertilizer recommendation based on inputs
      let fertilizerRecommendation = "NPK 14-35-14";
      let applicationMethod = "Broadcast application before sowing";
      let applicationRate = "250-300 kg/ha";
      
      // Simple logic to determine fertilizer based on soil and crop types
      if (soilType === "Black" && cropType === "Wheat") {
        if (formData.nitrogen < 30) {
          fertilizerRecommendation = "Urea (46-0-0)";
          applicationRate = "150-200 kg/ha";
        } else if (formData.phosphorous < 15) {
          fertilizerRecommendation = "Single Super Phosphate (0-16-0)";
          applicationRate = "200-250 kg/ha";
        }
      } else if (soilType === "Red" && cropType === "Rice") {
        fertilizerRecommendation = "NPK 17-17-17";
        applicationMethod = "Split application: 50% at planting, 50% during tillering";
        applicationRate = "300-350 kg/ha";
      } else if (formData.moisture > 45) {
        // For high moisture conditions
        fertilizerRecommendation = "Ammonium Sulphate (21-0-0)";
        applicationMethod = "Side dressing after rain";
      }

      const resultData = {
        nitrogen: formData.nitrogen,
        phosphorus: formData.phosphorous,
        potassium: formData.potassium,
        ph: 6.8, // Assumed value
        moisture: formData.moisture,
        organicMatter: 3.5, // Assumed value
        fertilizer: {
          recommendation: fertilizerRecommendation,
          applicationMethod: applicationMethod,
          applicationRate: applicationRate
        },
        recommendations: [
          `Based on your soil analysis, we recommend using ${fertilizerRecommendation}.`,
          `Application method: ${applicationMethod}.`,
          `Application rate: ${applicationRate}.`,
          `Your soil is suitable for ${cropType} cultivation with proper nutrient management.`,
          "Consider crop rotation to improve soil health over time."
        ]
      };
      
      setResults(resultData);
      
      // Get AI insights for the soil analysis results
      await getAIInsights(resultData);
      
      setLoading(false);
      toast({
        title: "Analysis Complete",
        description: "Soil analysis has been completed successfully.",
      });
    }, 2000);
  };
  
  const saveSoilAnalysis = async () => {
    if (!results || !user) return;
    
    setSavingReport(true);
    try {
      // Prepare data for saving
      const analysisData = {
        user_id: user.id,
        field_name: fieldName,
        nitrogen: results.nitrogen,
        phosphorus: results.phosphorus,
        potassium: results.potassium,
        ph_level: results.ph,
        moisture: results.moisture,
        organic_matter: results.organicMatter,
        ec_level: null,
        notes: `Soil type: ${soilType}, Crop: ${cropType}, Analysis date: ${new Date().toLocaleDateString()}`,
        analysis_date: new Date().toISOString().split('T')[0]
      };
      
      // Insert into Supabase
      const { error } = await supabase
        .from('soil_analysis')
        .insert(analysisData);
        
      if (error) throw error;
      
      toast({
        title: "Report Saved",
        description: "Soil analysis report has been saved to your history."
      });
      
      // Refresh history if it's being shown
      if (showHistory) {
        setShowHistory(false);
        setTimeout(() => setShowHistory(true), 100);
      }
      
    } catch (err) {
      console.error("Error saving soil analysis:", err);
      toast({
        title: "Save Failed",
        description: "There was an error saving your soil analysis report.",
        variant: "destructive"
      });
    } finally {
      setSavingReport(false);
    }
  };
  
  const chatWithFarmAI = () => {
    if (!results) return;
    
    let query = `Analyze this soil report: 
- Nitrogen: ${results.nitrogen} mg/kg
- Phosphorus: ${results.phosphorus} mg/kg
- Potassium: ${results.potassium} mg/kg
- pH: ${results.ph}
- Moisture: ${results.moisture}%
- Organic Matter: ${results.organicMatter}%

I'm growing ${cropType} in ${soilType} soil. What are your recommendations for improving soil health and maximizing yield?`;

    const encodedQuery = encodeURIComponent(query);
    navigate(`/chatbot?query=${encodedQuery}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">Soil Health Analysis</h1>
        <p className="text-muted-foreground">
          Analyze your soil composition to get fertilizer recommendations and crop suggestions
        </p>
      </div>

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Input</TabsTrigger>
          <TabsTrigger value="upload">Upload Report</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Enter Soil Parameters</CardTitle>
              <CardDescription>
                Input the values from your soil test or use a soil testing kit to measure these parameters
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSoilAnalysis}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="fieldName">Field Name</Label>
                    <Input 
                      id="fieldName" 
                      value={fieldName}
                      onChange={(e) => setFieldName(e.target.value)}
                      placeholder="Enter field name" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="soilType">Soil Type</Label>
                    <Select value={soilType} onValueChange={setSoilType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Black">Black</SelectItem>
                        <SelectItem value="Red">Red</SelectItem>
                        <SelectItem value="Clay">Clay</SelectItem>
                        <SelectItem value="Sandy">Sandy</SelectItem>
                        <SelectItem value="Loamy">Loamy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cropType">Crop Type</Label>
                    <Select value={cropType} onValueChange={setCropType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Wheat">Wheat</SelectItem>
                        <SelectItem value="Rice">Rice</SelectItem>
                        <SelectItem value="Maize">Maize</SelectItem>
                        <SelectItem value="Cotton">Cotton</SelectItem>
                        <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nitrogen">Nitrogen (N) mg/kg</Label>
                    <Input 
                      id="nitrogen" 
                      type="number" 
                      placeholder="e.g., 40" 
                      required 
                      value={formData.nitrogen}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phosphorous">Phosphorous (P) mg/kg</Label>
                    <Input 
                      id="phosphorous" 
                      type="number" 
                      placeholder="e.g., 30" 
                      required 
                      value={formData.phosphorous}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="potassium">Potassium (K) mg/kg</Label>
                    <Input 
                      id="potassium" 
                      type="number" 
                      placeholder="e.g., 25" 
                      required 
                      value={formData.potassium}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (°C)</Label>
                    <Input 
                      id="temperature" 
                      type="number" 
                      step="0.1"
                      placeholder="e.g., 26" 
                      required 
                      value={formData.temperature}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="humidity">Humidity (%)</Label>
                    <Input 
                      id="humidity" 
                      type="number" 
                      placeholder="e.g., 52" 
                      required 
                      value={formData.humidity}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="moisture">Moisture (%)</Label>
                    <Input 
                      id="moisture" 
                      type="number" 
                      placeholder="e.g., 38" 
                      required 
                      value={formData.moisture}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Analyzing..." : "Analyze Soil"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Soil Report</CardTitle>
              <CardDescription>
                Upload your laboratory soil test report for automated analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-10 text-center">
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Drop your file here or click to browse</p>
                <p className="text-sm text-muted-foreground mb-4">Supports PDF, JPG, or PNG (max 10MB)</p>
                <Button variant="outline">
                  Select File
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {results && (
        <Card className="animate-fade-in">
          <CardHeader className="bg-primary/5 rounded-t-lg">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Beaker className="h-5 w-5 mr-2" />
                Soil Analysis Results
              </CardTitle>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center"
                  onClick={saveSoilAnalysis}
                  disabled={savingReport}
                >
                  <FileText className="h-4 w-4 mr-2" /> 
                  {savingReport ? "Saving..." : "Save"}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  {showHistory ? "Hide History" : "View History"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-accent/20 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Nitrogen (N)</p>
                <p className="text-2xl font-bold">{results.nitrogen} mg/kg</p>
                <p className="text-sm text-primary">
                  {results.nitrogen > 40 ? "High" : results.nitrogen > 20 ? "Medium" : "Low"}
                </p>
              </div>
              <div className="bg-accent/20 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Phosphorus (P)</p>
                <p className="text-2xl font-bold">{results.phosphorus} mg/kg</p>
                <p className="text-sm text-primary">
                  {results.phosphorus > 30 ? "High" : results.phosphorus > 15 ? "Medium" : "Low"}
                </p>
              </div>
              <div className="bg-accent/20 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Potassium (K)</p>
                <p className="text-2xl font-bold">{results.potassium} mg/kg</p>
                <p className="text-sm text-primary">
                  {results.potassium > 30 ? "High" : results.potassium > 15 ? "Medium" : "Low"}
                </p>
              </div>
              <div className="bg-accent/20 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">pH Level</p>
                <p className="text-2xl font-bold">{results.ph}</p>
                <p className="text-sm text-primary">
                  {results.ph > 7.5 ? "Alkaline" : results.ph >= 6.5 && results.ph <= 7.5 ? "Neutral" : "Acidic"}
                </p>
              </div>
              <div className="bg-accent/20 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Moisture</p>
                <p className="text-2xl font-bold">{results.moisture}%</p>
                <p className="text-sm text-primary">
                  {results.moisture > 40 ? "High" : results.moisture > 20 ? "Optimal" : "Low"}
                </p>
              </div>
              <div className="bg-accent/20 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Organic Matter</p>
                <p className="text-2xl font-bold">{results.organicMatter}%</p>
                <p className="text-sm text-primary">
                  {results.organicMatter > 5 ? "Excellent" : results.organicMatter > 3 ? "Good" : "Low"}
                </p>
              </div>
            </div>
            
            {/* Fertilizer Recommendation Section */}
            <div className="mb-6 p-4 border border-primary/20 rounded-lg bg-primary/5">
              <h3 className="text-lg font-semibold mb-3 text-primary">Fertilizer Recommendation</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Recommended Fertilizer</p>
                  <p className="font-medium">{results.fertilizer.recommendation}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Application Method</p>
                  <p className="font-medium">{results.fertilizer.applicationMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Application Rate</p>
                  <p className="font-medium">{results.fertilizer.applicationRate}</p>
                </div>
              </div>
            </div>
            
            {/* AI Insights Section - Updated with loading animation */}
            <div className="mb-6 p-4 border border-green-500/20 rounded-lg bg-green-500/5">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <BrainCog className="h-5 w-5 text-green-500 mr-2" />
                FarmAI Insights
              </h3>
              
              {loadingAiInsights ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="relative">
                    <Loader2 className="h-8 w-8 animate-spin text-green-500 mb-2" />
                    <div className="absolute inset-0 animate-pulse rounded-full bg-green-200 opacity-20" style={{animationDelay: "300ms"}}></div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">AI is generating insights about your soil health...</p>
                </div>
              ) : aiInsights ? (
                <div>
                  <div className="prose prose-sm max-w-none" 
                    dangerouslySetInnerHTML={{ 
                      __html: aiInsights
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br>')
                    }} 
                  />
                  <div className="mt-4 pt-2 border-t border-green-500/20">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-500/30"
                      onClick={chatWithFarmAI}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat with FarmAI about your soil
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Complete the soil analysis to get AI-powered insights
                </p>
              )}
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
              <ul className="space-y-2">
                {results.recommendations.map((rec: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 mt-0.5">
                      {i + 1}
                    </div>
                    <p>{rec}</p>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* History Component */}
      {showHistory && (
        <div className="mt-8">
          <SoilAnalysisHistory />
        </div>
      )}
    </div>
  );
};

export default SoilAnalysis;
