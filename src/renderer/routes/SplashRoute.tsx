import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/layouts');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="drag bg-muted flex h-screen w-full items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
    </div>
  );
};

export default SplashRoute;
