import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Iridescence from "../components/backgrounds/iridescence/iridescence";
import BlurText from "../components/text-animations/blur-text/blur-text";

const DashboardRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash === "#/") {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-0 right-0 bottom-0 left-0 h-full w-full">
        <Iridescence mouseReact={false} speed={0.3} />
      </div>

      <div className="absolute top-0 right-0 bottom-0 left-0 flex h-full w-full items-center justify-center">
        <BlurText
          text="Sim Racing Universe"
          delay={150}
          animateBy="words"
          direction="top"
          className="mb-8 text-center text-8xl font-bold"
        />
      </div>
    </div>
  );
};

export default DashboardRoute;
