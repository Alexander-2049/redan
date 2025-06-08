import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Iridescence from "../components/backgrounds/iridescence/iridescence";

const DashboardRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash === "#/") {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <>
      <Iridescence mouseReact={false} speed={0.3} />
    </>
  );
};

export default DashboardRoute;
