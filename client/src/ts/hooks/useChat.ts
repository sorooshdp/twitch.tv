import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface ChatMessage {
  author: string;
  content: string;
  date: Date;
}

export const useChatSocket = (url: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [channelId, setChannelId] = useState<string | null>(null);

  useEffect(() => {
    const socketIo = io(url);

    socketIo.on("connect", () => {
      console.log("Connected to chat server");
    });

    socketIo.on("message", (message: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socketIo.on("chat-history", (data: { channelId: string; messages: ChatMessage[] }) => {
      if (data.channelId === channelId) {
        setMessages(data.messages);
      }
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [url]);

  const sendMessage = useCallback((message: string) => {
    if (socket && channelId) {
      socket.emit("message", { channelId, message });
    }
  }, [socket, channelId]);

  const getChatHistory = useCallback(() => {
    if (socket && channelId) {
      socket.emit("chat-history", channelId);
    }
  }, [socket, channelId]);

  const setChannel = useCallback((newChannelId: string) => {
    setChannelId(newChannelId);
    setMessages([]); // Clear messages when changing channels
    if (socket) {
      socket.emit("chat-history", newChannelId);
    }
  }, [socket]);

  return { messages, sendMessage, getChatHistory, setChannel };
};
