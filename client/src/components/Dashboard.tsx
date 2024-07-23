import React, { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Channel {
  id: number;
  name: string;
  online: boolean;
}

interface DashboardProps {
  children?: ReactNode;
}

const channelsList = [
  { id: 1, name: "GameMaster", online: true },
  { id: 2, name: "StreamQueen", online: false },
  { id: 3, name: "TechWizard", online: true },
  { id: 4, name: "CasualGamer", online: false },
]

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  const [channels, setChannels] = useState<Channel[]>(channelsList);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const sortedChannels = [...channels].sort((a, b) => {
      if (a.online === b.online) return 0;
      return a.online ? -1 : 1;
    });
    setChannels(sortedChannels);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex flex-col h-screen bg-dark text-white">
      {/* Navbar */}
      <div className="bg-secondary/10 backdrop-blur-md py-2 px-2 flex justify-between items-center">
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
            onClick={ () => {navigate('/settings')}}
            className="w-30 bg-primary hover:bg-primary/80 text-white rounded py-2 px-4 flex items-center justify-center transition-colors mr-2"
          >
            <span className="mr-2">👤</span> My Account
          </button>
          <button className="w-30 bg-primary hover:bg-primary/80 text-white rounded py-2 px-4 flex items-center justify-center transition-colors">
            <span className="mr-2">⇥</span> Log Out
          </button>
        </div>
      </div>

      {/* Main content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-20' : 'w-64'} flex-shrink-0 bg-primary/80 text-dark overflow-y-auto overflow-x-hidden transition-all duration-300`}>
          <div className=" p-4">
            <button
              onClick={toggleSidebar}
              className="w-10 mb-4 bg-dark/20 hover:bg-dark/30 text-white rounded-full px-2 py-1 pr-3 transition-colors"
            >
              {sidebarCollapsed ? '▶' : '◀'}
            </button>
            {channels.map((channel) => (
              <div
                key={channel.id}
                className={`${sidebarCollapsed ? " w-[70px]" : ""} flex items-center mb-4 p-2 rounded-lg hover:bg-white/20 transition-all`}
              >
                <div className={`w-12 h-12 bg-gray-300 rounded-full overflow-hidden flex-shrink-0 ${channel.online ? '' : 'filter grayscale'}`}>
                  <img
                    src={`https://i1.sndcdn.com/artworks-JTqQfDWAELB8wFof-x4ZTqA-t500x500.jpg`}
                    alt={channel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {!sidebarCollapsed && (
                  <div className="ml-3 overflow-hidden">
                    <p className="font-semibold truncate">{channel.name}</p>
                    <p className={`text-sm ${channel.online ? "text-green-400" : "text-muted"}`}>
                      {channel.online ? "● Online" : "○ Offline"}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-dark/80 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;