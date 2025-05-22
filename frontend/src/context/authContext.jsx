import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          if (
            location.pathname !== "/" &&
            location.pathname !== "/signup" &&
            location.pathname !== "/login"
          ) {
            navigate("/");
          }
          setLoading(false);
          return;
        }
        const response = await axios.get(
          "http://localhost:5000/auth/checkAuth",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error(err);
        setIsAuthenticated(false);
        setUser(null);
        if (
          location.pathname !== "/" &&
          location.pathname !== "/signup" &&
          location.pathname !== "/login"
        ) {
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate, location.pathname]);
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
