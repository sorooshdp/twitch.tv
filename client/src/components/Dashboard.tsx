import React, { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Channel {
    _id: string;
    isActive: boolean;
    title: string;
    description: string;
    avatarUrl: string;
    streamKey: string;
}

const Logo = ({ size = 40 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 100 100">
        <rect x="10" y="20" width="80" height="60" rx="10" fill="#9146FF" />
        <path d="M30 40 L30 60 L50 60 L50 40 Z" fill="#F0F0FF" />
        <path d="M70 40 L70 60 L50 60 L50 40 Z" fill="#F0F0FF" />
        <circle cx="40" cy="50" r="5" fill="#9146FF" />
        <circle cx="60" cy="50" r="5" fill="#9146FF" />
    </svg>
);

const Dashboard: React.FC<{ children?: ReactNode }> = ({ children }) => {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const response = await axios.get<{ followingChannels: Channel[] }>(
                    "https://localhost:5514/api/channels/following",
                    {
                        headers: {
                            Authorization: `Bearer ${JSON.parse(localStorage.getItem("TOKEN")!)}`,
                        },
                    }
                );
                const sortedChannels = response.data.followingChannels.sort((a, b) => {
                    if (a.isActive === b.isActive) return 0;
                    return a.isActive ? -1 : 1;
                });
                setChannels(sortedChannels);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching channels:", err);
                setError("Failed to load channels. Please try again later.");
                setLoading(false);
            }
        };

        fetchChannels();
    }, []);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const handleLogout = () => {
        localStorage.removeItem("TOKEN");
        localStorage.removeItem("USERNAME");
        navigate("/");
    };

    return (
        <div className="flex flex-col h-screen bg-dark text-white">
            {/* Navbar */}
            <div className="bg-secondary/10 backdrop-blur-md py-2 px-2 flex justify-between items-center">
                <div className="flex items-center">
                    <button
                        onClick={() => navigate("/dashboard/channels")}
                        className="mr-4 hover:opacity-80 transition-opacity"
                    >
                        <Logo size={40} />
                    </button>
                </div>
                <div className="flex-1 flex justify-center">
                    <div className="w-96">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full bg-dark/50 text-white rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted">🔍</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <button
                        onClick={() => navigate("/dashboard/settings")}
                        className="w-30 bg-primary hover:bg-primary/80 text-white rounded py-2 px-4 flex items-center justify-center transition-colors mr-2"
                    >
                        <span className="mr-2">👤</span> My Account
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-30 bg-primary hover:bg-primary/80 text-white rounded py-2 px-4 flex items-center justify-center transition-colors"
                    >
                        <span className="mr-2">⇥</span> Log Out
                    </button>
                </div>
            </div>

            {/* Main content area with sidebar */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div
                    className={`${
                        sidebarCollapsed ? "w-20" : "w-64"
                    } flex-shrink-0 bg-primary/80 text-dark overflow-y-auto overflow-x-hidden transition-all duration-300`}
                >
                    <div className="p-4">
                        <button
                            onClick={toggleSidebar}
                            className="w-10 mb-4 bg-dark/20 hover:bg-dark/30 text-white rounded-full px-2 py-1 pr-3 transition-colors"
                        >
                            {sidebarCollapsed ? "▶" : "◀"}
                        </button>
                        {loading ? (
                            <p>Loading channels...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : channels.length === 0 ? ( // Check if the channels array is empty
                            <p>No channels followed</p>
                        ) : (
                            channels.map((channel) => (
                                <div
                                    key={channel._id}
                                    className={`${
                                        sidebarCollapsed ? "w-[70px]" : ""
                                    } flex items-center mb-4 p-2 rounded-lg hover:bg-white/20 transition-all`}
                                >
                                    <div
                                        className={`w-12 h-12 bg-gray-300 rounded-full overflow-hidden flex-shrink-0 ${
                                            channel.isActive ? "" : "filter grayscale"
                                        }`}
                                    >
                                        <img
                                            src={
                                                channel.avatarUrl ||
                                                `https://i1.sndcdn.com/artworks-JTqQfDWAELB8wFof-x4ZTqA-t500x500.jpg`
                                            }
                                            alt={channel.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {!sidebarCollapsed && (
                                        <div className="ml-3 overflow-hidden">
                                            <p className="font-semibold truncate">{channel.title}</p>
                                            <p
                                                className={`text-sm ${
                                                    channel.isActive ? "text-green-400" : "text-muted"
                                                }`}
                                            >
                                                {channel.isActive ? "● Online" : "○ Offline"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Main content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-dark/80">{children}</main>
            </div>
        </div>
    );
};

export default Dashboard;
