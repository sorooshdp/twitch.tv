import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CustomFlvPlayer from "./CustomFlvPlayer";
import { useChatSocket } from "../ts/hooks/useChat";

interface ChannelDetails {
    id: string;
    title: string;
    description: string;
    username: string;
    isOnline: boolean;
    avatarUrl: string;
    streamUrl: string;
    isActive: boolean;
}

// interface Message {
//     id: string;
//     author: string;
//     content: string;
//     date: string;
//   }

// interface ChatPanelProps {
//     messages: Message[];
//     onSendMessage: (content: string, author: string) => void;
// }

const VideoPlayer: React.FC<{
    streamUrl: string;
    isOnline: boolean;
    channelName?: string;
}> = ({ streamUrl, isOnline, channelName = "This channel" }) => (
    <div className="w-full h-full bg-black aspect-video flex items-center justify-center">
        {isOnline ? (
            <CustomFlvPlayer streamUrl={streamUrl} />
        ) : (
            <div className="text-white text-center">
                <p className="text-2xl mb-2">{channelName} is currently offline.</p>
                <p className="text-lg">Please check back later!</p>
            </div>
        )}
    </div>
);

const ChannelInfo: React.FC<{
    channelDetails: ChannelDetails;
    isFollowing: boolean;
    onFollowToggle: () => void;
}> = ({ channelDetails, isFollowing, onFollowToggle }) => (
    <div className="p-4 bg-secondary/10">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <img src={channelDetails.avatarUrl} alt="Channel Icon" className="w-16 h-16 rounded-full mr-4" />
                <div>
                    <h1 className="text-2xl font-bold">{channelDetails.title}</h1>
                    <p className="text-muted">{channelDetails.username}</p>
                </div>
            </div>
            <button
                onClick={onFollowToggle}
                className={`px-4 py-2 rounded-full ${
                    isFollowing ? "bg-secondary text-primary" : "bg-primary text-white"
                }`}
            >
                {isFollowing ? "Unfollow" : "Follow"}
            </button>
        </div>
        <p className="mt-4">{channelDetails.description}</p>
    </div>
);

interface ChatPanelProps {
    channelId: string;
    currentUser: string;
  }
  
  export const ChatPanel: React.FC<ChatPanelProps> = ({ channelId, currentUser }) => {
    const { messages, sendMessage } = useChatSocket(channelId);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
  
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
  
    useEffect(scrollToBottom, [messages]);
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (newMessage.trim()) {
        sendMessage(newMessage, currentUser);
        setNewMessage('');
      }
    };
  
    return (
      <div className="w-80 bg-secondary/10 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((msg) => (
            <div key={Math.random()} className="mb-2">
              <span className="font-bold">{msg.author}: </span>
              <span>{msg.content}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Send a message"
            className="flex-grow bg-dark/50 text-white rounded-l-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="bg-primary text-white rounded-r-full px-4 py-2 ml-1 hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Send
          </button>
        </form>
      </div>
    );
  };
  
  export const SingleChannelPage: React.FC<{sidebarOpen: boolean}> = ({ sidebarOpen }) => {
    const { id } = useParams<{ id: string }>();
    const [channelDetails, setChannelDetails] = useState<ChannelDetails | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [currentUser, setCurrentUser] = useState<string>(localStorage.getItem("USERNAME")!); // Add this line
  
    useEffect(() => {
      const fetchChannelDetails = async () => {
        try {
          if (!id) {
            console.error('Channel ID is undefined');
            return;
          }
          const response = await axios.get<ChannelDetails>(`https://localhost:5514/api/channels/${id}`);
          setChannelDetails(response.data);
        } catch (error) {
          console.error('Error fetching channel details:', error);
        }
      };
  
      const fetchCurrentUser = async () => {
        try {
          const response = await axios.get('https://localhost:5514/api/auth/current-user', {
            withCredentials: true,
          });
          setCurrentUser(response.data.username || response.data.email);
        } catch (error) {
          console.error('Error fetching current user:', error);
        }
      };
  
      fetchChannelDetails();
      fetchCurrentUser();
    }, [id]);
  
    const handleFollowToggle = async () => {
      try {
        if (isFollowing) {
          await axios.post(
            `https://localhost:5514/api/channels/unfollow`,
            { channelId: id },
            {
              withCredentials: true,
            }
          );
        } else {
          await axios.post(
            `https://localhost:5514/api/channels/follow`,
            { channelId: id },
            {
              withCredentials: true,
            }
          );
        }
        setIsFollowing(!isFollowing);
      } catch (error) {
        console.error('Error toggling follow status:', error);
      }
    };
  
    if (!channelDetails) {
      return <div className="text-center p-4">Loading channel details...</div>;
    }
  
    return (
      <div className="flex h-full bg-dark text-white">
        <div
          className={`flex-1 flex flex-col overflow-y-scroll transition-all duration-300 ${
            sidebarOpen ? 'mr-4' : ''
          }`}
        >
          <div className={`flex-1 ${sidebarOpen ? 'w-[calc(100%-320px)]' : 'w-full'}`}>
            <VideoPlayer
              streamUrl={channelDetails.streamUrl}
              isOnline={channelDetails.isActive}
              channelName={channelDetails.title}
            />
            <ChannelInfo
              channelDetails={channelDetails}
              isFollowing={isFollowing}
              onFollowToggle={handleFollowToggle}
            />
          </div>
        </div>
        {id && currentUser && <ChatPanel channelId={id} currentUser={currentUser} />}
      </div>
    );
  };
export default SingleChannelPage;
