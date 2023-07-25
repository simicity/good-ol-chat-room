const express = require('express');
const cors = require("cors");
const app = express();
const http = require('http');
const server = http.createServer(app);
import { Server } from 'socket.io';

import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData, messageData, sessionData } from './interfaces';

import Redis from "ioredis";
const redisClient = new Redis();

const { setupWorker } = require("@socket.io/sticky");

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: {
    origin: "http://localhost:5173",
  },
  adapter: require("socket.io-redis")({
    pubClient: redisClient,
    subClient: redisClient.duplicate(),
  }),
});

app.use(cors());
app.use(express.json());

import { Response, Request } from 'express';

const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

const { RedisSessionStore } = require("./sessionStore");
const sessionStore = new RedisSessionStore(redisClient);

const { RedisMessageStore } = require("./messageStore");
const messageStore = new RedisMessageStore(redisClient);

const { RedisChatRoomStore } = require("./chatRoomStore");
const chatRoomStore = new RedisChatRoomStore(redisClient);

io.use(async (socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    const session = await sessionStore.findSession(sessionID);
    if (session) {
      socket.data.sessionID = sessionID;
      socket.data.userID = session.userID;
      return next();
    }
  }
  socket.data.sessionID = randomId();
  socket.data.userID = randomId();
  next();
});

io.on("connection", async (socket) => {
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

  // persist session
  sessionStore.saveSession(socket.data.sessionID, {
    userID: socket.data.userID,
    username: undefined,
    connected: true,
    chatroom: undefined,
  });

  const userMap = new Map<string, string[]>();
  const sessions = await sessionStore.findAllSessions();
  sessions.forEach((session: sessionData) => {
    if(session.connected && session.chatroom) {
      if(userMap.has(session.chatroom)) {
        userMap.get(session.chatroom)?.push(session.username);
      } else {
        userMap.set(session.chatroom, [session.username]);
      }
    }
  });
  const serializedMap: string = JSON.stringify(Array.from(userMap.entries()));
  io.emit("users", serializedMap);

  // join the chatroom
  socket.on("joinChatRoom", async (chatroom, username) => {
    if(!chatroom) {
      socket.emit("error", "invalid chatroom");
      return;
    }
    if(!username) {
      socket.emit("error", "invalid username");
      return;
    }

    socket.data.chatroom = chatroom;
    socket.data.username = username;
    socket.join(chatroom);

    // persist session
    sessionStore.saveSession(socket.data.sessionID, {
      userID: socket.data.userID,
      username: socket.data.username,
      connected: true,
      chatroom: socket.data.chatroom,
    });

    const userMap = new Map<string, string[]>();
    const sessions = await sessionStore.findAllSessions();
    sessions.forEach((session: sessionData) => {
      if(session.connected && session.chatroom) {
        if(userMap.has(chatroom)) {
          userMap.get(chatroom)?.push(username);
        } else {
          userMap.set(chatroom, [username]);
        }
      }
    });
    const serializedMap: string = JSON.stringify(Array.from(userMap.entries()));
    io.emit("users", serializedMap);

    // notify existing users
    if(socket.data.userID && socket.data.username) {
      const cachedMessages = await messageStore.findMessagesForChatRoom(socket.data.chatroom);
      socket.emit("chatroomCachedMessages", cachedMessages);

      const message: messageData = {
        message: socket.data.username + " joined.",
        from: "",
        to: socket.data.chatroom,
        timestamp: new Date(),
      };
      messageStore.saveMessage(message);
      io.to(socket.data.chatroom).emit("userJoined", message);
    }
  });

  // forward the private message to the right recipient (and to other tabs of the sender)
  socket.on("chatroomMessage", (content) => {
    if(!socket.data.userID) {
      socket.emit("error", "invalid user ID");
      return;
    }
    if(!socket.data.username) {
      socket.emit("error", "invalid username");
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

  socket.on("leaveChatRoom", async (chatroom: string) => {
    if(!socket.data.userID) {
      socket.emit("error", "Invalid user ID");
      return;
    }
    socket.leave(chatroom);

    // persist session
    sessionStore.saveSession(socket.data.sessionID, {
      userID: socket.data.userID,
      username: socket.data.username,
      connected: true,
      chatroom: undefined,
    });

    // notify existing users
    if(socket.data.chatroom && socket.data.username) {
      const message: messageData = {
        message: socket.data.username + " left.",
        from: "",
        to: socket.data.chatroom,
        timestamp: new Date(),
      };
      messageStore.saveMessage(message);
      io.to(socket.data.chatroom).emit("userLeft", message);

      const userMap = new Map<string, string[]>();
      const sessions = await sessionStore.findAllSessions();
      sessions.forEach((session: sessionData) => {
        if(session.connected && session.chatroom) {
          if(userMap.has(session.chatroom)) {
            const users = userMap.get(session.chatroom)?.filter(user => user !== socket.data.username);
            if(!users) {
              userMap.delete(session.chatroom);
            } else {
              userMap.set(session.chatroom, users);
            }
          }
        }
      });
      const serializedMap: string = JSON.stringify(Array.from(userMap.entries()));
      io.emit("users", serializedMap);
    }
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
      // notify existing users
      if(socket.data.chatroom && socket.data.username) {
        // update the connection status of the session
        sessionStore.saveSession(socket.data.sessionID, {
          userID: socket.data.userID,
          username: socket.data.username,
          connected: false,
          chatroom: undefined,
        });

        const userMap = new Map<string, string[]>();
        const sessions = await sessionStore.findAllSessions();
        sessions.forEach((session: sessionData) => {
          if(session.connected && session.chatroom) {
            if(userMap.has(session.chatroom)) {
              const users = userMap.get(session.chatroom)?.filter(user => user !== socket.data.username);
              if(!users) {
                userMap.delete(session.chatroom);
              } else {
                userMap.set(session.chatroom, users);
              }
            }
          }
        });
        const serializedMap: string = JSON.stringify(Array.from(userMap.entries()));
        io.emit("users", serializedMap);

        const message: messageData = {
          message: socket.data.username + " left.",
          from: "",
          to: socket.data.chatroom,
          timestamp: new Date(),
        };
        messageStore.saveMessage(message);
        io.to(socket.data.chatroom).emit("userLeft", message);
      }
    }
  });
});

app.get("/rooms", async (req: Request, res: Response) => {
  try {
    const rooms = await chatRoomStore.findAllRooms();
    res.status(200).json(rooms);  
  } catch (err) {
    res.status(400).json({"error": err});
  }
});

app.post("/room", (req: Request, res: Response) => {
  try {
    chatRoomStore.saveRoom({roomname: req.body.name, password: req.body.password});
    res.status(201).end();  
  } catch (err) {
    res.status(400).json({ "error": err });
  }
});

app.delete("/room/delete/:chatroom/:password", async (req: Request, res: Response) => {
  const roomname = req.params.chatroom;
  const password = req.params.password;

  if(!roomname || !password) {
    res.status(400).end();
    return;
  }

  chatRoomStore.deleteRoom({roomname, password})
  .then(() => {
    messageStore.deleteMessagesForChatRoom(roomname);
  })
  .then(() => {
    res.status(200).end();
  })
  .catch((err: Error) => {
    res.status(400).json({ "error": err });
  })
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
setupWorker(io);