
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();

  // Redirect to dashboard (this component won't actually be used since we're routing directly to Dashboard)
  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return null;
};

export default Index;
