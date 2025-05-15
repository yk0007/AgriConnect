
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAuth } from "@/hooks/useAuth";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Default sidebar to open on desktop and closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if the current page is the landing page
  const isLandingPage = location.pathname === "/";

  // Handle window resize and ensure sidebar is open on certain pages
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    
    if (location.pathname === "/weather") {
      setSidebarOpen(true);
    }
    
    return () => window.removeEventListener("resize", handleResize);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogoClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div className="relative">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
      
      <div className="flex flex-col flex-1 w-full">
        <Navbar toggleSidebar={toggleSidebar} onLogoClick={handleLogoClick} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-16">
          {children}
        </main>
        {/* Only show footer on landing page */}
        {isLandingPage && <Footer />}
      </div>
    </div>
  );
};

export default Layout;
