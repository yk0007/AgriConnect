
import { useState, useEffect } from "react";
import { Eye, Download, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const SoilAnalysisHistory = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchSoilAnalysisHistory();
  }, [user]);

  const fetchSoilAnalysisHistory = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('soil_analysis')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setHistory(data || []);
    } catch (err) {
      console.error("Error fetching soil analysis history:", err);
      toast({
        title: "Failed to load history",
        description: "There was an error loading your soil analysis history.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (ph_level: number) => {
    if (!ph_level) return <Badge variant="outline">Unknown</Badge>;
    
    if (ph_level < 6.0) {
      return <Badge variant="destructive">Acidic</Badge>;
    } else if (ph_level > 7.5) {
      return <Badge className="bg-amber-500">Alkaline</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Neutral</Badge>;
    }
  };

  const viewAnalysisDetail = (analysis: any) => {
    setSelectedAnalysis(analysis);
    setIsDialogOpen(true);
  };

  const downloadReport = (id: string) => {
    // In a real app, this would generate and download a PDF
    toast({
      title: "Report downloaded",
      description: `Soil analysis report has been downloaded.`,
    });
  };

  const deleteAnalysis = async (id: string) => {
    try {
      const { error } = await supabase
        .from('soil_analysis')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setHistory(history.filter(item => item.id !== id));
      
      toast({
        title: "Report deleted",
        description: "Soil analysis report has been removed.",
      });
      
      // Close dialog if the deleted analysis was the selected one
      if (selectedAnalysis && selectedAnalysis.id === id) {
        setIsDialogOpen(false);
      }
      
    } catch (err) {
      console.error("Error deleting soil analysis:", err);
      toast({
        title: "Delete failed",
        description: "There was an error deleting the analysis.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <div className="p-4 border-b border-border">
        <h3 className="font-medium">Recent Soil Analysis</h3>
      </div>
      
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Loading soil analysis history...</p>
          </div>
        ) : history.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Field Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">pH Level</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nitrogen</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Phosphorus</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Potassium</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} className="border-t border-border">
                  <td className="px-4 py-3 text-left">
                    <div>{formatDate(item.created_at)}</div>
                    <div className="text-xs text-muted-foreground">{formatTime(item.created_at)}</div>
                  </td>
                  <td className="px-4 py-3 text-left">{item.field_name}</td>
                  <td className="px-4 py-3 text-left">
                    {getStatusBadge(item.ph_level)}
                    <div className="text-xs text-muted-foreground mt-1">{item.ph_level || 'N/A'}</div>
                  </td>
                  <td className="px-4 py-3 text-left">{item.nitrogen || 'N/A'} mg/kg</td>
                  <td className="px-4 py-3 text-left">{item.phosphorus || 'N/A'} mg/kg</td>
                  <td className="px-4 py-3 text-left">{item.potassium || 'N/A'} mg/kg</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => viewAnalysisDetail(item)} title="View Details">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => downloadReport(item.id)} title="Download Report">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteAnalysis(item.id)} title="Delete" className="hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No soil analysis history yet</p>
          </div>
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Soil Analysis Details</DialogTitle>
            <DialogDescription>
              {selectedAnalysis && (
                <span>
                  {selectedAnalysis.field_name} - {formatDate(selectedAnalysis.created_at)} at {formatTime(selectedAnalysis.created_at)}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedAnalysis && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Field Name</h4>
                  <p className="text-lg font-semibold">{selectedAnalysis.field_name}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Analysis Date</h4>
                  <p>{formatDate(selectedAnalysis.created_at)} at {formatTime(selectedAnalysis.created_at)}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Nitrogen (N)</h4>
                    <p className="text-lg font-semibold">{selectedAnalysis.nitrogen || 'N/A'} mg/kg</p>
                    <p className="text-sm text-primary">
                      {selectedAnalysis.nitrogen > 40 ? "High" : selectedAnalysis.nitrogen > 20 ? "Medium" : "Low"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Phosphorus (P)</h4>
                    <p className="text-lg font-semibold">{selectedAnalysis.phosphorus || 'N/A'} mg/kg</p>
                    <p className="text-sm text-primary">
                      {selectedAnalysis.phosphorus > 30 ? "High" : selectedAnalysis.phosphorus > 15 ? "Medium" : "Low"}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Potassium (K)</h4>
                    <p className="text-lg font-semibold">{selectedAnalysis.potassium || 'N/A'} mg/kg</p>
                    <p className="text-sm text-primary">
                      {selectedAnalysis.potassium > 30 ? "High" : selectedAnalysis.potassium > 15 ? "Medium" : "Low"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">pH Level</h4>
                    <p className="text-lg font-semibold">{selectedAnalysis.ph_level || 'N/A'}</p>
                    <p className="text-sm text-primary">
                      {selectedAnalysis.ph_level > 7.5 ? "Alkaline" : selectedAnalysis.ph_level >= 6.5 && selectedAnalysis.ph_level <= 7.5 ? "Neutral" : "Acidic"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Organic Matter</h4>
                  <p className="text-lg font-semibold">{selectedAnalysis.organic_matter || 'N/A'}%</p>
                  <p className="text-sm text-primary">
                    {selectedAnalysis.organic_matter > 5 ? "Excellent" : selectedAnalysis.organic_matter > 3 ? "Good" : "Low"}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Moisture</h4>
                  <p className="text-lg font-semibold">{selectedAnalysis.moisture || 'N/A'}%</p>
                  <p className="text-sm text-primary">
                    {selectedAnalysis.moisture > 40 ? "High" : selectedAnalysis.moisture > 20 ? "Optimal" : "Low"}
                  </p>
                </div>
                
                {selectedAnalysis.ec_level && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">EC Level</h4>
                    <p className="text-lg font-semibold">{selectedAnalysis.ec_level} dS/m</p>
                  </div>
                )}
                
                {selectedAnalysis.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
                    <p className="text-sm text-muted-foreground">{selectedAnalysis.notes}</p>
                  </div>
                )}
                
                <div className="pt-4 border-t border-border">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Recommendations</h4>
                  <ul className="space-y-2 text-sm">
                    {selectedAnalysis.ph_level < 6.0 && (
                      <li>• Apply lime to increase soil pH and reduce acidity</li>
                    )}
                    {selectedAnalysis.ph_level > 7.5 && (
                      <li>• Apply sulfur or gypsum to lower soil pH</li>
                    )}
                    {selectedAnalysis.nitrogen < 20 && (
                      <li>• Increase nitrogen fertilization with urea or ammonium sulfate</li>
                    )}
                    {selectedAnalysis.phosphorus < 15 && (
                      <li>• Apply phosphate fertilizers like single superphosphate</li>
                    )}
                    {selectedAnalysis.potassium < 15 && (
                      <li>• Apply potassium fertilizers like potassium chloride</li>
                    )}
                    {selectedAnalysis.organic_matter < 3 && (
                      <li>• Add organic matter through compost or manure</li>
                    )}
                    {selectedAnalysis.moisture < 20 && (
                      <li>• Improve irrigation strategies and consider mulching</li>
                    )}
                    {/* Default recommendation */}
                    <li>• Schedule regular soil testing every 2-3 years</li>
                  </ul>
                </div>
                
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => downloadReport(selectedAnalysis.id)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                  <DialogClose asChild>
                    <Button variant="default">
                      Close
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SoilAnalysisHistory;
