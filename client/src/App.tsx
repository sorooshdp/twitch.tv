import React, { ReactNode, useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import axios from "axios";

const Main = lazy(() => import("./components/Main"));
const Login = lazy(() => import("./components/Login"));
const Signup = lazy(() => import("./components/Signup"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const Channels = lazy(() => import("./components/Channels"));
const Channel = lazy(() => import("./components/Channel"));
const Settings = lazy(() => import("./components/Settings"));

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = () => {
            const token = sessionStorage.getItem("TOKEN");
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

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    if (isAuthenticated === false) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

const PublicRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
    const isAuthenticated = useAuth();

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    if (isAuthenticated === true) {
        return <Navigate to="/dashboard/channels" replace />;
    }

    return <>{children}</>;
};

export const App = () => {
    const [liveChannels, setLiveChannels] = useState({});

    useEffect(() => {
        const fetchLiveChannels = async (currentLiveChannels: object) => {
            try {
                const streams = await axios.get("https://twitch-tv-rtmp.liara.run/api/streams");
                if (JSON.stringify(currentLiveChannels) !== JSON.stringify(streams.data.live)) {
                    setLiveChannels({...streams.data.live});
                    console.log(liveChannels);
                }
            } catch (error) {
                console.error("Error fetching live channels:", error);
            }
        };

        const interval = setInterval(() => fetchLiveChannels(liveChannels), 10000);

        return () => clearInterval(interval);
    }, [liveChannels]);

    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            <PublicRoute>
                                <Signup />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/dashboard/*"
                        element={
                            <PrivateRoute>
                                <Dashboard liveChannels={liveChannels}>
                                    <Routes>
                                        <Route path="/settings" element={<Settings />} />
                                        <Route path="/channels" element={<Channels />} />
                                        <Route
                                            path="/channels/:id"
                                            element={<Channel sidebarOpen={false} liveChannels={liveChannels} />}
                                        />
                                    </Routes>
                                </Dashboard>
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Suspense>
        </Router>
    );
};

export default App;
