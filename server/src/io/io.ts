import { Server } from "socket.io";

export const registerSocketServer = (server : any) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("new server connected");
        console.log(socket.id);
    });
};
