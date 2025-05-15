
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Layout from "./components/layout/Layout";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Diagnostics from "./pages/Diagnostics";
import Weather from "./pages/Weather";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SoilAnalysis from "./pages/SoilAnalysis";
import CropRecommender from "./pages/CropRecommender";
import Chatbot from "./pages/Chatbot";
import Botanists from "./pages/Botanists";
import Marketplace from "./pages/Marketplace";
import Forum from "./pages/Forum";
import Store from "./pages/Store";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import FarmingMethods from "./pages/FarmingMethods";
import DiseaseOutbreaks from "./pages/DiseaseOutbreaks";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/diagnostics" element={
              <ProtectedRoute>
                <Layout>
                  <Diagnostics />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/soil-analysis" element={
              <ProtectedRoute>
                <Layout>
                  <SoilAnalysis />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/crop-recommender" element={
              <ProtectedRoute>
                <Layout>
                  <CropRecommender />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/chatbot" element={
              <ProtectedRoute>
                <Layout>
                  <Chatbot />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/botanists" element={
              <ProtectedRoute>
                <Layout>
                  <Botanists />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/weather" element={
              <ProtectedRoute>
                <Layout>
                  <Weather />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/marketplace" element={
              <ProtectedRoute>
                <Layout>
                  <Marketplace />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/forum" element={
              <ProtectedRoute>
                <Layout>
                  <Forum />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/store" element={
              <ProtectedRoute>
                <Layout>
                  <Store />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/farming-methods" element={
              <ProtectedRoute>
                <Layout>
                  <FarmingMethods />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/disease-outbreaks" element={
              <ProtectedRoute>
                <Layout>
                  <DiseaseOutbreaks />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
