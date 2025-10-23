import React, { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase.js";
import API from "../../api.js";

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  try {
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken();
          localStorage.setItem("token", token);

          const res = await API.get("/auth/checkAuth", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.data;

          if (data.isNewUser) {
            setUser({ ...data, needsSetup: true });
            setIsAuthenticated(true);
          } else {
            setUser(data);
            setIsAuthenticated(true);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("token");

          if (
            location.pathname !== "/" &&
            location.pathname !== "/login" &&
            location.pathname !== "/signup"
          ) {
            navigate("/");
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }, [navigate, location.pathname]);
  } catch (err) {
    console.error("Error : ", err);
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, setIsAuthenticated, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
