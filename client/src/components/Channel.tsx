import React, { useState } from 'react';

interface ChatMessage {
  id: number;
  user: string;
  message: string;
}

const SingleChannelPage: React.FC = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, user: "User1", message: "Hello everyone!" },
    { id: 2, user: "User2", message: "Great stream!" },
    { id: 3, user: "User3", message: "Wow, nice play!" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setChatMessages([...chatMessages, { id: Date.now(), user: "You", message: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-screen bg-dark text-white">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Video Player */}
        <div className="bg-black aspect-video">
          <div className="flex items-center justify-center h-full text-2xl">
            Video Player Placeholder
          </div>
        </div>

        {/* Channel Info */}
        <div className="p-4 bg-secondary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src="/api/placeholder/64/64" alt="Channel Icon" className="w-16 h-16 rounded-full mr-4" />
              <div>
                <h1 className="text-2xl font-bold">Channel Name</h1>
                <p className="text-muted">Game Name</p>
              </div>
            </div>
            <button
              onClick={handleFollow}
              className={`px-4 py-2 rounded-full ${
                isFollowing ? 'bg-secondary text-primary' : 'bg-primary text-white'
              }`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          </div>
          <p className="mt-4">Channel description goes here. This streamer is known for their exciting gameplay and engaging commentary.</p>
        </div>
      </div>

      {/* Chat Panel */}
      <div className="w-80 bg-secondary/10 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {chatMessages.map((msg) => (
            <div key={msg.id} className="mb-2">
              <span className="font-bold">{msg.user}: </span>
              <span>{msg.message}</span>
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Send a message"
            className="w-full bg-dark/50 text-white rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </form>
      </div>
    </div>
  );
};

export default SingleChannelPage;