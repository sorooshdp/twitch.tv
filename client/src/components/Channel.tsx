import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface ChannelDetails {
    id: string;
    title: string;
    description: string;
    username: string;
    isOnline: boolean;
    avatarUrl: string;
    streamUrl: string;
}

interface ChatMessage {
    id: number;
    user: string;
    message: string;
}

const VideoPlayer: React.FC<{ streamUrl: string }> = ({ streamUrl }) => (
    <div className="bg-black aspect-video">
        <div className="flex items-center justify-center h-full text-2xl">Video Player Placeholder</div>
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

const ChatPanel: React.FC<{
    messages: ChatMessage[];
    onSendMessage: (message: string) => void;
}> = ({ messages, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(newMessage);
            setNewMessage("");
        }
    };

    return (
        <div className="w-80 bg-secondary/10 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg) => (
                    <div key={msg.id} className="mb-2">
                        <span className="font-bold">{msg.user}: </span>
                        <span>{msg.message}</span>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Send a message"
                    className="w-full bg-dark/50 text-white rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </form>
        </div>
    );
};

const SingleChannelPage: React.FC<{ sidebarOpen: boolean }> = ({ sidebarOpen }) => {
    const { id } = useParams<{ id: string }>();
    const [channelDetails, setChannelDetails] = useState<ChannelDetails | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { id: 1, user: "User1", message: "Hello everyone!" },
        { id: 2, user: "User2", message: "Great stream!" },
        { id: 3, user: "User3", message: "Wow, nice play!" },
    ]);

    useEffect(() => {
        const fetchChannelDetails = async () => {
            try {
                const response = await axios.get<ChannelDetails>(`https://localhost:5514/api/channels/${id}`);
                setChannelDetails(response.data);
            } catch (error) {
                console.error("Error fetching channel details:", error);
            }
        };
        fetchChannelDetails();
    }, [id]);

    const handleFollowToggle = async () => {
        try {
            if (isFollowing) {
                await axios.post(
                    `https://localhost:5514/api/channels/unfollow`,
                    { channelId: id },
                    {
                        withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${JSON.parse(localStorage.getItem("TOKEN")!)}`,
                        },
                    }
                );
            } else {
                await axios.post(
                    `https://localhost:5514/api/channels/follow`,
                    { channelId: id },
                    {
                        withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${JSON.parse(localStorage.getItem("TOKEN")!)}`,
                        },
                    }
                );
            }
            setIsFollowing(!isFollowing);
        } catch (error) {
            console.error("Error toggling follow status:", error);
        }
    };

    const handleSendMessage = (message: string) => {
        setChatMessages([...chatMessages, { id: Date.now(), user: "You", message }]);
    };

    if (!channelDetails) {
        return <div className="text-center p-4">Loading channel details...</div>;
    }

    return (
        <div className="flex h-full bg-dark text-white">
            <div
                className={`flex-1 flex flex-col overflo-y-scroll transition-all duration-300 ${
                    sidebarOpen ? "mr-4" : ""
                }`}
            >
                <div className={`flex-1 ${sidebarOpen ? "w-[calc(100%-320px)]" : "w-full"}`}>
                    <VideoPlayer streamUrl={channelDetails.streamUrl} />
                    <ChannelInfo
                        channelDetails={channelDetails}
                        isFollowing={isFollowing}
                        onFollowToggle={handleFollowToggle}
                    />
                </div>
            </div>
            <ChatPanel messages={chatMessages} onSendMessage={handleSendMessage} />
        </div>
    );
};

export default SingleChannelPage;
