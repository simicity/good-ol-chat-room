import { Server } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData, sessionData, messageData } from './interfaces';

const httpServer = require("http").createServer();
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: "http://localhost:8080",
  },
});

const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

const { InMemorySessionStore } = require("./sessionStore");
const sessionStore = new InMemorySessionStore();

const { InMemoryMessageStore } = require("./messageStore");
const messageStore = new InMemoryMessageStore();

io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.data.sessionID = sessionID;
      socket.data.userID = session.userID;
      socket.data.username = session.username;
      return next();
    }
  }
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.data.sessionID = randomId();
  socket.data.userID = randomId();
  socket.data.username = username;
  next();
});

io.on("connection", (socket) => {
  // persist session
  sessionStore.saveSession(socket.data.sessionID, {
    userID: socket.data.userID,
    username: socket.data.username,
    connected: true,
  });

  // emit session details
  if(!socket.data.sessionID){
    return new Error("invalid session");
  }
  if(!socket.data.userID) {
    return new Error("invalid user id");
  }
  socket.emit("session",
    socket.data.sessionID,
    socket.data.userID,
  );

  // join the chatroom
  if(!socket.data.chatroomID) {
    return new Error("invalid chatroom");
  }
  socket.join(socket.data.chatroomID);

  // fetch existing users
  const users:sessionData[] = [];
  const messagesPerUser = new Map();
  messageStore.findMessagesForUser(socket.data.userID).forEach((message: {from: string, to: string}) => {
    const { from, to } = message;
    const otherUser = socket.data.userID === from ? to : from;
    if (messagesPerUser.has(otherUser)) {
      messagesPerUser.get(otherUser).push(message);
    } else {
      messagesPerUser.set(otherUser, [message]);
    }
  });
  sessionStore.findAllSessions().forEach((session: sessionData) => {
    if(session.chatroomID && session.chatroomID === socket.data.chatroomID) {
      users.push({
        userID: session.userID,
        username: session.username,
        connected: session.connected,
        messages: messagesPerUser.get(session.userID) || [],
      });  
    }
  });
  socket.to(socket.data.chatroomID).emit("users", users);

  // notify existing users
  socket.to(socket.data.chatroomID).emit("userConnected", {
    userID: socket.data.userID,
    username: socket.data.username,
    connected: true,
    messages: [],
  });

  // forward the private message to the right recipient (and to other tabs of the sender)
  socket.on("chatroomMessage", ({ content, to }) => {
    if(!socket.data.userID) {
      return new Error("invalid user id");
    }
    const message = {
      content,
      from: socket.data.userID,
      to,
    };
    if(!socket.data.userID) {
      return new Error("invalid user id");
    }
    socket.to(to).to(socket.data.userID).emit("chatroomMessage", message);
    messageStore.saveMessage(message);
  });

  // notify users upon disconnection
  socket.on("disconnect", async () => {
    if(!socket.data.userID) {
      return new Error("invalid user id");
    }
    const matchingSockets = await io.in(socket.data.userID).fetchSockets();
    const isDisconnected = matchingSockets.length === 0;
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit("userDisconnected", socket.data.userID);
      // update the connection status of the session
      sessionStore.saveSession(socket.data.sessionID, {
        userID: socket.data.userID,
        username: socket.data.username,
        connected: false,
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);