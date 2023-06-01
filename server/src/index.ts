const express = require('express');
const cors = require("cors");
const app = express();
const http = require('http');
const server = http.createServer(app);
import { Server } from 'socket.io';
import db from './db/db';

import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData, messageData, sessionData } from './interfaces';

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

app.use(cors());
app.use(express.json());

import { Response, Request } from 'express';

const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

const { InMemorySessionStore } = require("./sessionStore");
const sessionStore = new InMemorySessionStore();

const { InMemoryMessageStore } = require("./messageStore");
const messageStore = new InMemoryMessageStore();

io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.data.sessionID = sessionID;
      socket.data.userID = session.userID;
      socket.data.username = username;
      return next();
    }
  }
  socket.data.sessionID = randomId();
  socket.data.userID = randomId();
  socket.data.username = username;
  next();
});

io.on("connection", (socket) => {
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

    // persist session
    sessionStore.saveSession(socket.data.sessionID, {
      userID: socket.data.userID,
      username: socket.data.username,
      connected: true,
      chatroom: socket.data.chatroom,
    });

    // notify existing users
    if(socket.data.userID && socket.data.username) {
      const message: messageData = {
        message: socket.data.username + " joined.",
        from: "",
        to: socket.data.chatroom,
        timestamp: new Date(),
      };
      messageStore.saveMessage(message);
      socket.emit("chatroomCachedMessages", messageStore.findMessagesForChatRoom(socket.data.chatroom));
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
        const message: messageData = {
          message: socket.data.username + " left.",
          from: "",
          to: socket.data.chatroom,
          timestamp: new Date(),
        };
        messageStore.saveMessage(message);
        io.to(socket.data.chatroom).emit("userLeft", message);
      }
      // update the connection status of the session
      sessionStore.saveSession(socket.data.sessionID, {
        userID: socket.data.userID,
        username: socket.data.username,
        connected: false,
        chatroom: undefined,
      });
    }
  });
});

app.get("/users", (req: Request, res: Response) => {
  // fetch existing users
  const usersPerRoom = new Map<string, string[]>;
  sessionStore.findAllSessions().forEach((session: sessionData) => {
    if(session.connected && session.chatroom) {
      if(usersPerRoom.has(session.chatroom)) {
        usersPerRoom.get(session.chatroom)?.push(session.username);
      } else {
        usersPerRoom.set(session.chatroom, [session.username]); 
      }
    }
  });
  const arr = Array.from(usersPerRoom, ([key, value]) => ({
    chatroom: key,
    users: value,
  }));
  res.status(200).json(arr);
});

app.get("/rooms", (req: Request, res: Response) => {
  db.all(`SELECT chatroom FROM chatrooms`, [], (err, rows) => {
    if (err) {
      res.status(400).json({"error": err.message});
      return;
    }
    res.status(200).json(rows);
  });
});

app.post("/room", (req: Request, res: Response) => {
  db.run(`INSERT INTO chatrooms (chatroom, password) VALUES (?,?)`,
    [req.body.name, req.body.password],
    (err) => {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      res.status(201).end();
    });
});

app.delete("/room/delete/:chatroom/:password", (req: Request, res: Response) => {
  const chatroom = req.params.chatroom;
  const password = req.params.password;
  db.get(`SELECT password FROM chatrooms WHERE chatroom = ? AND password = ?`, [chatroom, password], (err, row) => {
    if (err) {
      res.status(400).json({"error": err.message});
      return;
    }
    if (row == undefined) {
      res.status(406).json({"error": "Password did not match!"});
      return;
    }
    db.run(`DELETE FROM chatrooms WHERE chatroom = (?)`, [chatroom],
    (err) => {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      res.status(200).end();
    });
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);