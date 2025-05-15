
import DiagnosticsUploader from "../components/diagnostics/DiagnosticsUploader";
import DiagnosticsHistory from "../components/diagnostics/DiagnosticsHistory";

const Diagnostics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Crop Diagnostics</h1>
        <p className="text-muted-foreground">Upload crop photos for instant analysis and recommendations</p>
      </div>
      
      <DiagnosticsUploader />
      
      <div className="mt-8">
        <DiagnosticsHistory />
      </div>
    </div>
  );
};

export default Diagnostics;
