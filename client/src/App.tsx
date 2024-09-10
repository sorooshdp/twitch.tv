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

const CuteSpinner = () => {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-purple-200 rounded-full"></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-purple-500 rounded-full animate-spin" style={{ borderTopColor: 'transparent' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-purple-500 rounded-full animate-pulse"></div>
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>
    );
  };

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
        return <CuteSpinner />;
    }

    if (isAuthenticated === false) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

const PublicRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
    const isAuthenticated = useAuth();

    if (isAuthenticated === null) {
        return <CuteSpinner />;
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
            <Suspense fallback={<CuteSpinner />}>
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
