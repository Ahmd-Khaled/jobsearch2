import { decodedToken } from "../../../middlewares/auth.middleware.js";

export const socketAuth = async (socket, next) => {
  // If FE used
  const authorization = socket?.handshake?.authorization?.auth;
  // If Postman Socket.io Client used
  // const { authorization } = socket.headers;
  if (!authorization) {
    return next(new Error("Missing authorization header", { cause: 401 }));
  }

  const loggedUser = await decodedToken({ authorization, next });

  socket.user = loggedUser;
  socket.id = loggedUser.id;

  return next();
};
