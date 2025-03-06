import { Server } from "socket.io";
import { sendMessage, startChat } from "./chatting/chatting.service.js";
import { socketAuth } from "./middlewares/socket.auth.middleware.js";

export const initializeSocket = (server, app) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  app.set("socket", io); // Store socket instance in app to use in Notifications

  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log("--- New user connected: ", socket.id);

    socket.on("startChat", startChat(socket, io));

    socket.on("sendMessage", sendMessage(socket, io));

    socket.on("disconnect", () => {
      console.log("--- User disconnected: ", socket.id);
    });
  });
};
