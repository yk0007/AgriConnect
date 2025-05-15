
import { useState } from "react";
import { Upload, X, Image, AlertCircle, Check, Leaf, SparkleIcon, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DiagnosisResult {
  crop: string;
  dateAnalyzed: string;
  disease?: {
    commonName: string;
    scientificName?: string;
    confidence: number;
  };
  severity?: 'Low' | 'Moderate' | 'High' | 'Severe' | 'Unknown' | 'None';
  description?: string;
  recommendations?: string[];
  error?: string;
  isHealthy?: boolean;
}

const DiagnosticsUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cropName, setCropName] = useState<string>("");
  const [savedImageUrl, setSavedImageUrl] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    
    setError(null);
    setResult(null);
    setSavedImageUrl(null);
    
    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      return;
    }
    
    if (!selectedFile.type.startsWith('image/')) {
      setError("Please upload an image file");
      return;
    }
    
    setFile(selectedFile);
    
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setCropName("");
    setSavedImageUrl(null);
  };

  const saveResultToHistory = async (result: DiagnosisResult, imageUrl: string) => {
    try {
      if (!user?.id) {
        throw new Error("User ID is required for saving diagnosis");
      }

      // Use user provided crop name if available, otherwise use the one from result
      const finalCropName = cropName.trim() || result.crop || "Unknown";
      const recommendations = result.recommendations || [];
      
      const confidence = result.disease?.confidence 
        ? Math.round(result.disease.confidence * 100) 
        : null;
      
      const { error: dbError } = await supabase.from('crop_diagnostics').insert({
        user_id: user.id,
        crop: finalCropName,
        disease_name: result.disease?.commonName || 'None',
        scientific_name: result.disease?.scientificName || null,
        severity: result.severity || 'Unknown',
        confidence: confidence,
        description: result.description || '',
        recommendations: recommendations,
        image_url: imageUrl,
        is_healthy: result.isHealthy || false,
      });

      if (dbError) {
        console.error("Database error when saving diagnosis:", dbError);
        throw dbError;
      }
      
      toast({
        title: "Diagnosis saved",
        description: "The diagnosis has been saved to your history."
      });

    } catch (err) {
      console.error("Error saving diagnosis:", err);
      toast({
        title: "Save failed",
        description: "There was an error saving your diagnosis to history.",
        variant: "destructive"
      });
    }
  };

  const analyzeImage = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Make sure user is logged in
      if (!user?.id) {
        throw new Error("You must be logged in to analyze images");
      }

      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      
      // Check if storage bucket exists first
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'plant_diagnosis');
      
      if (!bucketExists) {
        // Create bucket if it doesn't exist
        const { error: bucketError } = await supabase.storage.createBucket('plant_diagnosis', {
          public: true
        });
        
        if (bucketError) {
          console.error("Failed to create storage bucket:", bucketError);
        }
      }
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('plant_diagnosis')
        .upload(filePath, file);
      
      if (uploadError) {
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('plant_diagnosis')
        .getPublicUrl(filePath);
      
      setSavedImageUrl(publicUrl);
      
      const formData = new FormData();
      formData.append('image', file);
      // Add crop name if provided by user
      if (cropName.trim()) {
        formData.append('cropName', cropName.trim());
      }
      
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mrbjnkednllemtrafofj.supabase.co';
      const response = await fetch(`${supabaseUrl}/functions/v1/diagnose-crop`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Edge function error response:", errorText);
        throw new Error(`Diagnosis failed: ${response.status} ${response.statusText}`);
      }
      
      const diagnosisResult = await response.json();
      setResult(diagnosisResult);
      
      if (!diagnosisResult.error && publicUrl) {
        await saveResultToHistory(diagnosisResult, publicUrl);
      }
      
    } catch (err) {
      console.error("Error during diagnosis:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      
      toast({
        title: "Analysis failed",
        description: err instanceof Error ? err.message : "Failed to analyze image",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const chatWithFarmAI = () => {
    if (!result) return;
    
    let query = "";
    
    if (result.isHealthy) {
      query = `Tell me about best practices for maintaining healthy ${cropName || result.crop} plants.`;
    } else if (result.disease) {
      query = `Tell me about ${result.disease.commonName} in ${cropName || result.crop} plants. What are the causes, prevention measures, and treatment options?`;
    }
    
    const encodedQuery = encodeURIComponent(query);
    
    navigate(`/chatbot?query=${encodedQuery}`);
  };

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      {!file && (
        <div className="p-8 flex flex-col items-center justify-center">
          <div className="mb-6 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Leaf className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">Upload a crop image</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Take a clear photo of your crop to diagnose diseases, pests, or nutritional deficiencies using AI
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
              className="flex items-center"
            >
              <Upload className="h-4 w-4 mr-2" />
              Browse Files
            </Button>
            <Button 
              variant="outline"
              className="flex items-center"
            >
              <Image className="h-4 w-4 mr-2" />
              Take Photo
            </Button>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          
          <p className="text-xs text-muted-foreground mt-6">
            Supported formats: JPG, PNG, WEBP. Max size: 10MB
          </p>
        </div>
      )}
      
      {file && preview && (
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-1/2 p-6">
            <div className="aspect-square rounded-lg overflow-hidden border border-border">
              <img 
                src={preview} 
                alt="Crop preview" 
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-8 right-8 rounded-full h-8 w-8 p-0"
              onClick={clearFile}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove image</span>
            </Button>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
            </p>
            <div className="mt-4">
              <Label htmlFor="crop-name" className="mb-2 block">Crop Name (Optional)</Label>
              <Input
                id="crop-name"
                placeholder="Enter crop name if known"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
              />
            </div>
          </div>
          
          <div className="md:w-1/2 border-t md:border-t-0 md:border-l border-border p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <SparkleIcon className="h-5 w-5 text-primary mr-2" /> 
              AI-Powered Crop Analysis
            </h3>
            
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-destructive mr-2 mt-0.5 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            {!result && !error && (
              <div className="mb-4">
                <p className="text-muted-foreground mb-6">
                  {isAnalyzing 
                    ? "AI is analyzing your crop image..." 
                    : "Click analyze to detect diseases, pests, or deficiencies using AI"
                  }
                </p>
                
                <Button 
                  onClick={analyzeImage} 
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                      Analyzing...
                    </>
                  ) : (
                    "Analyze with Gemini AI"
                  )}
                </Button>
              </div>
            )}
            
            {result && (
              <div className="space-y-4">
                <div className="bg-muted p-3 rounded-md">
                  <div className="flex justify-between mb-1">
                    {result.isHealthy ? (
                      <span className="text-sm font-medium text-green-600">Plant appears healthy</span>
                    ) : (
                      <span className="text-sm font-medium">Disease Detected</span>
                    )}
                    {result.disease && !result.isHealthy && (
                      <span className="text-sm text-primary">{(result.disease.confidence * 100).toFixed(0)}% confidence</span>
                    )}
                  </div>
                  <h4 className="text-lg font-semibold">
                    {!result.isHealthy && result.disease 
                      ? result.disease.commonName 
                      : (cropName || result.crop)}
                  </h4>
                  {result.disease && !result.isHealthy && (
                    <p className="text-sm italic text-muted-foreground">
                      {result.disease.scientificName || (cropName || result.crop)}
                    </p>
                  )}
                </div>
                
                {!result.isHealthy && (
                  <div>
                    <h5 className="text-sm font-medium mb-1">Severity</h5>
                    <div className={`text-sm px-2 py-1 inline-block rounded ${
                      result.severity === "High" || result.severity === "Severe"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" 
                        : result.severity === "Moderate"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    }`}>
                      {result.severity}
                    </div>
                  </div>
                )}
                
                <div>
                  <h5 className="text-sm font-medium mb-1">Description</h5>
                  <p className="text-sm text-muted-foreground">{result.description}</p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium mb-1">Recommendations</h5>
                  <ul className="space-y-1">
                    {result.recommendations && result.recommendations.map((rec: string, i: number) => (
                      <li key={i} className="flex text-sm">
                        <Check className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <Button 
                    variant="default" 
                    onClick={() => {
                      if (savedImageUrl) {
                        saveResultToHistory(result, savedImageUrl);
                      } else {
                        toast({
                          variant: "destructive",
                          title: "Error",
                          description: "Failed to save image URL. Please try again."
                        });
                      }
                    }}
                  >
                    Save Results
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={chatWithFarmAI}
                    className="flex items-center"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat with FarmAI
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticsUploader;
