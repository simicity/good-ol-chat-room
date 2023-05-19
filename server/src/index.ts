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
    origin: "http://localhost:5173",
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
    socket.emit("error", "Iinvalid session ID");
    return;
  }
  if(!socket.data.userID) {
    socket.emit("error", "invalid user ID");
    return;
  }
  socket.emit("session",
    socket.data.sessionID,
    socket.data.userID,
  );

  // join the chatroom
  socket.on("joinChatRoom", (chatroom) => {
    if(!chatroom) {
      socket.emit("error", "invalid chatroom");
      return;
    }
    socket.data.chatroom = chatroom;
    socket.join(chatroom);

    // notify existing users
    if(socket.data.username) {
      io.to(socket.data.chatroom).emit("userConnected", socket.data.username);
    }
  });

  /*
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
    if(session.chatroom && session.chatroom === socket.data.chatroom) {
      users.push({
        userID: session.userID,
        connected: session.connected,
        messages: messagesPerUser.get(session.userID) || [],
      });  
    }
  });
  socket.to(socket.data.chatroom).emit("users", users);
*/

  // forward the private message to the right recipient (and to other tabs of the sender)
  socket.on("chatroomMessage", (content) => {
    if(!socket.data.username) {
      socket.emit("error", "invalid user ID");
      return;
    }
    if(!socket.data.chatroom) {
      socket.emit("error", "chatroom not assigned");
      return;
    }
    const message: messageData = {
      message: content,
      from: socket.data.username,
      to: socket.data.chatroom,
      timestamp: new Date(),
    };
    io.to(socket.data.chatroom).emit("chatroomMessage", message);
    messageStore.saveMessage(message);
  });

  // notify users upon disconnection
  socket.on("disconnect", async () => {
    if(!socket.data.userID) {
      socket.emit("error", "Invalid user ID");
      return;
    }
    const matchingSockets = await io.in(socket.data.userID).fetchSockets();
    const isDisconnected = matchingSockets.length === 0;
    if (isDisconnected) {
      // notify other users
      if(socket.data.chatroom) {
        io.to(socket.data.chatroom).emit("userDisconnected", socket.data.userID);
      }
      // update the connection status of the session
      sessionStore.saveSession(socket.data.sessionID, {
        userID: socket.data.userID,
        connected: false,
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);