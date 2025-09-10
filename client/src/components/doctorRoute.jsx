import { useLocation, Link } from "wouter";
import { useEffect } from "react";

const DoctorRoute = ({ component: Component, ...rest }) => {
  const [, setLocation] = useLocation();
  
  const isAuthenticated = !!localStorage.getItem("doctorAuthToken");

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/doctor-login");
    }
  }, [isAuthenticated, setLocation]);

  return isAuthenticated ? <Component {...rest} /> : null;
};

export default DoctorRoute;