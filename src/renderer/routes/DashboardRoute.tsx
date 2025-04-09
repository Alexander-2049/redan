import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashboardRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash === "#/") {
      navigate("/dashboard");
    }
  }, [navigate]);

  return <>Hello, World! I'm in a Dashboard!</>;
};

export default DashboardRoute;
