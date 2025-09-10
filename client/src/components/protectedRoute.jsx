import { useLocation, Link } from "wouter";
import { useEffect } from "react";

// ProtectedRoute component to restrict access to authenticated users
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const [, setLocation] = useLocation();
  
  // Check if the hospital is authenticated by looking for the authToken in localStorage
  const isAuthenticated = !!localStorage.getItem("authToken") ;

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to signin if not authenticated
      setLocation("/signin");
    }
  }, [isAuthenticated, setLocation]);

  // If authenticated, render the component; otherwise, return null (redirect will handle navigation)
  return isAuthenticated ? <Component {...rest} /> : null;
};

export default ProtectedRoute;