import React from "react";
import App from "./App";
import * as ReactDOM from "react-dom/client";
import "./index.css";
import Channels from "./components/Channels";
import Channel from "./components/Channel";
import Settings from "./components/Settings";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
