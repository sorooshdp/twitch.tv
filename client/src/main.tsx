import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import LoginPage from "./components/Login";
import SignupPage from "./components/Signup";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
            </Routes>
        </Router>
    </React.StrictMode>
);
