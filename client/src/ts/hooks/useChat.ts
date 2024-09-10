import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { Message } from "../types/Channel";

export const useChatSocket = (channelId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const initializeSocket = useCallback(() => {
    const IO = io("https://twitch-tv-0cde.onrender.com/", {
      withCredentials: true,
      transports: ["websocket"],
      timeout: 10000, 
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    IO.on("connect", () => {
      console.log("WebSocket connected successfully");
      setConnectionError(null);
    });

    IO.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setConnectionError(`Connection error: ${error.message}`);
    });

    IO.on("error", (error) => {
      console.error("Socket error:", error);
      setConnectionError(`Socket error: ${error.message}`);
    });

    IO.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
      if (reason === "io server disconnect") {
        IO.connect();
      }
    });

    setSocket(IO);

    return IO;
  }, []);

  useEffect(() => {
    const IO = initializeSocket();

    IO.emit("join-channel", channelId);

    IO.on("chat-history", (data: { channelId: string; messages: Message[] }) => {
      setMessages(data.messages);
    });

    IO.on("new-message", (message: Message) => {
      console.log("Message received on client:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      IO.emit("leave-channel", channelId);
      IO.disconnect();
    };
  }, [channelId, initializeSocket]);

  const sendMessage = useCallback((content: string, author: string) => {
    if (socket) {
      const message: Message = {
        author,
        content,
        date: new Date().toISOString(),
      };
      socket.emit("chat-message", { channelId, message });
    }
  }, [socket, channelId]);

  return { messages, sendMessage, connectionError };
};
