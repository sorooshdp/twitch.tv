import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ChannelProps {
  id: string;
  title: string;
  avatarUrl: string;
  username: string;
  isOnline: boolean;
  viewers?: number; // Make this optional as it's not provided by the backend
}

const ChannelCard: React.FC<ChannelProps> = ({ title, viewers, avatarUrl, username, isOnline }) => (
  <div className="bg-secondary/10 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
    <div className="relative aspect-video">
      <img src="/api/placeholder/400/225" alt={`${title}'s stream`} className="w-full h-full object-cover" />
      {isOnline && (
        <div className="absolute bottom-2 left-2 bg-red-600 text-white text-sm px-2 py-1 rounded">
          LIVE
        </div>
      )}
      {viewers !== undefined && (
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-sm px-2 py-1 rounded">
          {viewers} viewers
        </div>
      )}
    </div>
    <div className="p-3 flex items-center">
      <img src={avatarUrl || "/api/placeholder/40/40"} alt={`${username}'s icon`} className="w-10 h-10 rounded-full mr-3" />
      <div>
        <h3 className="font-bold text-white">{title}</h3>
        <p className="text-sm text-gray-300">{username}</p>
      </div>
    </div>
  </div>
);

const Channels: React.FC = () => {
  const [channels, setChannels] = useState<ChannelProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await axios.get<ChannelProps[]>('https://localhost:5514/api/channels');
        setChannels(response.data);
        console.log(response.data)
        setLoading(false);
      } catch (err) {
        console.error('Error fetching channels:', err);
        setError('Failed to fetch channels. Please try again later.');
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {channels.map(channel => (
        <ChannelCard key={channel.id} {...channel} />
      ))}
    </div>
  );
};

export default Channels;
