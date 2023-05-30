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
  // persist session
  sessionStore.saveSession(socket.data.sessionID, {
    userID: socket.data.userID,
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
    if(socket.data.userID && socket.data.username) {
      const message: messageData = {
        message: socket.data.username + " joined.",
        from: "",
        to: socket.data.chatroom,
        timestamp: new Date(),
      };
      socket.to(socket.data.userID).emit("chatroomCachedMessages", messageStore.findMessagesForChatRoom(socket.data.chatroom));
      io.to(socket.data.chatroom).emit("userJoined", message);
    }
  });

  // fetch existing users
  // const users: string[] = [];
  // sessionStore.findAllSessions().forEach((session: sessionData) => {
  //   if(session.chatroom && session.chatroom === socket.data.chatroom && session.connected) {
  //     users.push(session.username);  
  //   }
  // });
  // socket.emit("users", users);

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
        io.to(socket.data.chatroom).emit("userLeft", message);
      }
      // update the connection status of the session
      sessionStore.saveSession(socket.data.sessionID, {
        userID: socket.data.userID,
        connected: false,
      });
    }
  });
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
  db.run(`INSERT INTO chatrooms (chatroom, email) VALUES (?,?)`,
    [req.body.name, req.body.email],
    (err) => {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      res.status(201).end();
    });
});

app.delete("/room/delete/:chatroom", (req: Request, res: Response) => {
  db.run(`DELETE FROM chatrooms WHERE chatroom = ?`, [req.params.chatroom],
    (err) => {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      res.status(200).end();
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);