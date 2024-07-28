import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import App from "./App";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import * as ReactDOM from "react-dom/client";
import "./index.css";
import Channels from "./components/Channels";
import Channel from "./components/Channel";
import Settings from "./components/Settings";

const isAuthenticated = () => {
  const token = localStorage.getItem("TOKEN");
  return token !== null;
};

const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated();
      setIsAuth(auth);
      if (!auth) {
        navigate('/login');
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, [navigate]);

  return isAuth ? <>{children}</> : null;
};

export const Root = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route 
          path="/login" 
          element={isAuthenticated() ? <Navigate to="/dashboard/channels" replace /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated() ? <Navigate to="/dashboard/channels" replace /> : <Signup />} 
        />
        <Route
          path="/dashboard/*"
          element={
            <AuthenticatedRoute>
              <Dashboard>
                <Routes>
                  <Route path="settings" element={<Settings />} />
                  <Route path="channels" element={<Channels />} />
                  <Route path="channels/:id" element={<Channel />} />
                </Routes>
              </Dashboard>
            </AuthenticatedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);