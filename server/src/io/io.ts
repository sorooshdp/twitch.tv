import Channel from "../models/Channel";
import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { IMessage } from "../types/models";

export const registerSocketServer = (server: HttpServer): void => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket: Socket) => {
        console.log("new server connected");
        console.log(socket.id);

        socket.on("chat-history", (channelId: string) => {
            emitChatHistory(socket, channelId);
        });
    });
};

const emitChatHistory = async (socket: Socket, channelId: string): Promise<void> => {
    try {
        const channel = await Channel.findById(channelId).populate("messages");
        if (channel) {
            socket.emit("chat-history", {
                channelId,
                messages: channel.messages.map((m: IMessage) => ({
                    author: m.author,
                    content: m.content,
                    date: m.date,
                })),
            });
        }

        socket.emit("chat-history", {
            errorOccurred: true,
        });
    } catch (e) {
        console.error("Error emitting chat history:", e);
        socket.emit("chat-history", {
            errorOccurred: true,
        });
    }
};
