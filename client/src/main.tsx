import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
    return localStorage.getItem("TOKEN") !== null;
};

const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

export const Root = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/login" element={isAuthenticated() ? <Navigate to="/dashboard/channels" /> : <Login />} />
                <Route
                    path="/signup"
                    element={isAuthenticated() ? <Navigate to="/dashboard/channels" /> : <Signup />}
                />
                <Route
                    path="/dashboard/*"
                    element={
                        <PrivateRoute>
                            <Dashboard>
                                <Routes>
                                    <Route path="/settings" element={<Settings />} />
                                    <Route path="/channels" element={<Channels />} />
                                    <Route path="/channels/:id" element={<Channel />} />
                                </Routes>
                            </Dashboard>
                        </PrivateRoute>
                    }
                ></Route>
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
