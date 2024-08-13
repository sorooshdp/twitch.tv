import React, { ReactNode, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import App from "./App";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import * as ReactDOM from "react-dom/client";
import "./index.css";
import Channels from "./components/Channels";
import Channel from "./components/Channel";
import Settings from "./components/Settings";

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("TOKEN");
            setIsAuthenticated(token !== null);
        };

        checkAuth();
        window.addEventListener("storage", checkAuth);

        return () => {
            window.removeEventListener("storage", checkAuth);
        };
    }, []);

    return isAuthenticated;
};

const PrivateRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
    const isAuthenticated = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export const Root = () => {
    const isAuthenticated = useAuth();

    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route
                    path="/login"
                    element={isAuthenticated ? <Navigate to="/dashboard/channels" replace /> : <Login />}
                />
                <Route
                    path="/signup"
                    element={isAuthenticated ? <Navigate to="/dashboard/channels" replace /> : <Signup />}
                />
                <Route
                    path="/dashboard/*"
                    element={
                        <PrivateRoute>
                            <Dashboard>
                                <Routes>
                                    <Route path="/settings" element={<Settings />} />
                                    <Route path="/channels" element={<Channels />} />
                                    <Route path="/channels/:id" element={<Channel sidebarOpen={false} />} />
                                </Routes>
                            </Dashboard>
                        </PrivateRoute>
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
