import { Server } from "socket.io";
import { sendRealTimeMessage } from "./chatting/chatting.service.js";
import { socketAuth } from "./middlewares/socket.auth.middleware.js";

export const runSocketio = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log("---------------- New user connected: ", socket.id);

    socket.on("sendMessage", sendRealTimeMessage(socket, io));

    socket.on("disconnect", () => {
      console.log("---------------- User disconnected: ", socket.id);
    });
  });
};
