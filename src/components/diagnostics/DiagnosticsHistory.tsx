import { useState, useEffect } from "react";
import { Eye, Download, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const DiagnosticsHistory = () => {
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDiagnosticHistory();
  }, [user]);

  const fetchDiagnosticHistory = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('crop_diagnostics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setHistory(data || []);
    } catch (err) {
      console.error("Error fetching diagnosis history:", err);
      toast({
        title: "Failed to load history",
        description: "There was an error loading your diagnostic history.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "High":
      case "Severe":
        return <Badge variant="destructive">{severity}</Badge>;
      case "Moderate":
        return <Badge className="bg-amber-500">{severity}</Badge>;
      case "Low":
        return <Badge className="bg-yellow-500">{severity}</Badge>;
      case "None":
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">None</Badge>;
      default:
        return <Badge variant="secondary">{severity}</Badge>;
    }
  };

  const viewDiagnosisDetail = (diagnosis: any) => {
    setSelectedDiagnosis(diagnosis);
    setIsDialogOpen(true);
  };

  const downloadReport = (id: string) => {
    // In a real app, this would generate and download a PDF
    toast({
      title: "Report downloaded",
      description: `Diagnosis report has been downloaded.`,
    });
  };

  const deleteDiagnosis = async (id: string) => {
    try {
      const { error } = await supabase
        .from('crop_diagnostics')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setHistory(history.filter(item => item.id !== id));
      
      toast({
        title: "Report deleted",
        description: "Diagnosis report has been removed.",
      });
      
      // Close dialog if the deleted diagnosis was the selected one
      if (selectedDiagnosis && selectedDiagnosis.id === id) {
        setIsDialogOpen(false);
      }
      
    } catch (err) {
      console.error("Error deleting diagnosis:", err);
      toast({
        title: "Delete failed",
        description: "There was an error deleting the diagnosis.",
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
        <h3 className="font-medium">Recent Diagnostics</h3>
      </div>
      
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Loading diagnosis history...</p>
          </div>
        ) : history.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Crop</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Diagnosis</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Severity</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Image</th>
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
                  <td className="px-4 py-3 text-left">{item.crop || "Unknown"}</td>
                  <td className="px-4 py-3 text-left">{item.disease_name || "None"}</td>
                  <td className="px-4 py-3 text-left">
                    {getSeverityBadge(item.severity)}
                  </td>
                  <td className="px-4 py-3 text-left">
                    <div className="h-10 w-10 rounded bg-muted overflow-hidden">
                      <img 
                        src={item.image_url || "/placeholder.svg"} 
                        alt={`${item.crop} diagnosis`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => viewDiagnosisDetail(item)} title="View Details">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => downloadReport(item.id)} title="Download Report">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteDiagnosis(item.id)} title="Delete" className="hover:text-destructive">
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
            <p className="text-muted-foreground">No diagnostic history yet</p>
          </div>
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Diagnosis Details</DialogTitle>
            <DialogDescription>
              {selectedDiagnosis && (
                <span>
                  {selectedDiagnosis.crop} - {formatDate(selectedDiagnosis.created_at)} at {formatTime(selectedDiagnosis.created_at)}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedDiagnosis && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <div className="rounded-lg overflow-hidden border mb-4">
                  <img 
                    src={selectedDiagnosis.image_url || "/placeholder.svg"} 
                    alt={`${selectedDiagnosis.crop} diagnosis`}
                    className="w-full aspect-square object-cover"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Crop</h4>
                    <p className="text-lg font-semibold">{selectedDiagnosis.crop}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Date Analyzed</h4>
                    <p>{formatDate(selectedDiagnosis.created_at)} at {formatTime(selectedDiagnosis.created_at)}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">
                      {selectedDiagnosis.is_healthy ? "Plant appears healthy" : "Disease Detected"}
                    </span>
                    {selectedDiagnosis.confidence && !selectedDiagnosis.is_healthy && (
                      <span className="text-sm text-primary">{(selectedDiagnosis.confidence * 100).toFixed(0)}% confidence</span>
                    )}
                  </div>
                  <h4 className="text-lg font-semibold">{selectedDiagnosis.disease_name}</h4>
                  {selectedDiagnosis.scientific_name && (
                    <p className="text-sm italic text-muted-foreground">{selectedDiagnosis.scientific_name}</p>
                  )}
                </div>
                
                <div>
                  <h5 className="text-sm font-medium mb-1">Severity</h5>
                  <div className={`text-sm px-2 py-1 inline-block rounded ${
                    selectedDiagnosis.severity === "High" || selectedDiagnosis.severity === "Severe"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" 
                      : selectedDiagnosis.severity === "Moderate"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                      : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  }`}>
                    {selectedDiagnosis.severity}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium mb-1">Description</h5>
                  <p className="text-sm text-muted-foreground">{selectedDiagnosis.description}</p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium mb-1">Recommendations</h5>
                  <ul className="space-y-1">
                    {selectedDiagnosis.recommendations && selectedDiagnosis.recommendations.map((rec: string, i: number) => (
                      <li key={i} className="flex text-sm">
                        <div className="mr-2 mt-0.5 h-4 w-4 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                          <span className="text-xs">•</span>
                        </div>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => downloadReport(selectedDiagnosis.id)}>
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

export default DiagnosticsHistory;
