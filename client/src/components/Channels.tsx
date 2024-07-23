import React from 'react';

interface ChannelProps {
  id: number;
  name: string;
  viewers: number;
  thumbnailUrl: string;
  iconUrl: string;
}

const ChannelCard: React.FC<ChannelProps> = ({ name, viewers, thumbnailUrl, iconUrl }) => (
  <div className="bg-secondary/10 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
    <div className="relative aspect-video">
      <img src={thumbnailUrl} alt={`${name}'s stream`} className="w-full h-full object-cover" />
      <div className="absolute bottom-2 left-2 bg-red-600 text-white text-sm px-2 py-1 rounded">
        LIVE
      </div>
      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-sm px-2 py-1 rounded">
        {viewers} viewers
      </div>
    </div>
    <div className="p-3 flex items-center">
      <img src={iconUrl} alt={`${name}'s icon`} className="w-10 h-10 rounded-full mr-3" />
      <div>
        <h3 className="font-bold text-white">{name}</h3>
        <p className="text-sm text-gray-300">Just Chatting</p>
      </div>
    </div>
  </div>
);

const Channels: React.FC = () => {
  const channels: ChannelProps[] = [
    { id: 1, name: "GameMaster", viewers: 1500, thumbnailUrl: "https://i.redd.it/9-japanese-cyberpunk-2912x1632-ai-v0-a949vywg5ekb1.jpg?width=2912&format=pjpg&auto=webp&s=28a702a25dfe81367ca6949069cbfb9e519c7553", iconUrl: "/api/placeholder/40/40" },
    { id: 2, name: "StreamQueen", viewers: 2200, thumbnailUrl: "https://i.redd.it/9-japanese-cyberpunk-2912x1632-ai-v0-a949vywg5ekb1.jpg?width=2912&format=pjpg&auto=webp&s=28a702a25dfe81367ca6949069cbfb9e519c7553", iconUrl: "/api/placeholder/40/40" },
    { id: 3, name: "TechWizard", viewers: 800, thumbnailUrl: "https://i.redd.it/9-japanese-cyberpunk-2912x1632-ai-v0-a949vywg5ekb1.jpg?width=2912&format=pjpg&auto=webp&s=28a702a25dfe81367ca6949069cbfb9e519c7553", iconUrl: "/api/placeholder/40/40" },
    { id: 4, name: "CasualGamer", viewers: 1200, thumbnailUrl: "https://i.redd.it/9-japanese-cyberpunk-2912x1632-ai-v0-a949vywg5ekb1.jpg?width=2912&format=pjpg&auto=webp&s=28a702a25dfe81367ca6949069cbfb9e519c7553", iconUrl: "/api/placeholder/40/40" },
    { id: 5, name: "SpeedRunner", viewers: 3000, thumbnailUrl: "https://i.redd.it/9-japanese-cyberpunk-2912x1632-ai-v0-a949vywg5ekb1.jpg?width=2912&format=pjpg&auto=webp&s=28a702a25dfe81367ca6949069cbfb9e519c7553", iconUrl: "/api/placeholder/40/40" },
    { id: 6, name: "eSportsChamp", viewers: 5000, thumbnailUrl: "https://i.redd.it/9-japanese-cyberpunk-2912x1632-ai-v0-a949vywg5ekb1.jpg?width=2912&format=pjpg&auto=webp&s=28a702a25dfe81367ca6949069cbfb9e519c7553", iconUrl: "/api/placeholder/40/40" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {channels.map(channel => (
        <ChannelCard key={channel.id} {...channel} />
      ))}
    </div>
  );
};

export default Channels;
