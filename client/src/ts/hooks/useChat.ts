import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Message } from "../types/Channel";

export const useChatSocket = (channelId: string) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        // Initialize the socket connection
        const IO = io("https://twitch-tv-server.vercel.app/", {
            withCredentials: true,
            transports: ["websocket"],
        });

        // Set the socket instance in state
        setSocket(IO);

        // Join the channel
        IO.emit("join-channel", channelId);

        // Handle incoming chat history
        IO.on("chat-history", (data: { channelId: string; messages: Message[] }) => {
            setMessages(data.messages);
        });

        // Handle incoming new messages
        IO.on("new-message", (message: Message) => {
            console.log("message recieved on client: " + message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Cleanup on component unmount or channel change
        return () => {
            IO.emit("leave-channel", channelId);
            IO.disconnect();
        };
    }, [channelId]);

    // Function to send a new message
    const sendMessage = (content: string, author: string) => {
        if (socket) {
            const message: Message = {
                author,
                content,
                date: new Date().toISOString(),
            };
            socket.emit("chat-message", { channelId, message });
        }
    };

    return { messages, sendMessage };
};
