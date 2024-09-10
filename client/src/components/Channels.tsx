import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface ChannelProps {
  id: string;
  title: string;
  viewers?: number;
  avatarUrl: string;
  thumbnailUrl: string;
  username: string;
  isActive: boolean;
}

const ChannelCard: React.FC<ChannelProps> = React.memo(({ id, title, viewers, avatarUrl, thumbnailUrl, username, isActive }) => (
  <Link to={`${id}`} className="block group">
    <div className="bg-secondary/10 rounded-lg overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
      <div className="relative aspect-video">
        <img src={thumbnailUrl} alt={`${title}'s stream`} className="w-full h-full object-cover" loading="lazy" />
        {isActive && (
          <div className="absolute bottom-2 left-2 bg-red-600 text-white text-xs sm:text-sm px-2 py-1 rounded">LIVE</div>
        )}
        {viewers !== undefined && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs sm:text-sm px-2 py-1 rounded">
            {viewers} viewers
          </div>
        )}
      </div>
      <div className="p-2 sm:p-3 flex items-center">
        <img
          src={avatarUrl || "/api/placeholder/40/40"}
          alt={`${username}'s icon`}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3"
          loading="lazy"
        />
        <div className="overflow-hidden">
          <h3 className="font-bold text-white text-sm sm:text-base truncate">{title}</h3>
          <p className="text-xs sm:text-sm text-gray-300 truncate">{username}</p>
        </div>
      </div>
    </div>
  </Link>
));

const Channels: React.FC = () => {
  const [channels, setChannels] = useState<ChannelProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await axios.get<ChannelProps[]>("https://twitch-tv-0cde.onrender.com/api/channels");
        setChannels(response.data);
      } catch (err) {
        console.error("Error fetching channels:", err);
        setError("Failed to fetch channels. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading channels...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 p-2 sm:p-4">
      {channels.length === 0 ? (
        <p className="text-center col-span-full">No channels available.</p>
      ) : (
        channels.map((channel) => <ChannelCard key={channel.id} {...channel} />)
      )}
    </div>
  );
};

export default Channels;