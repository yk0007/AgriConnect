
import React from "react";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  
  // Only show on landing page
  if (location.pathname !== "/") {
    return null;
  }

  return (
    <footer className="bg-card border-t border-border py-4 px-6 text-center text-sm text-muted-foreground">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-2 sm:mb-0">
          &copy; {currentYear} AgriConnect | Team Pixel
        </div>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
