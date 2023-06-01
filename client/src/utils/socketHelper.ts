import { useEffect } from "react";
import socket from './socket';
import { useAppDispatch, useAppSelector } from '../slices/hooks';
import { addMessage, clearMessage } from '../slices/messages';
import { disconnectUser } from "../slices/user";

const connect = (username: string) => {
  socket.auth = { username: username };
  socket.connect();
};

const reconnect = () => {
  const sessionID = localStorage.getItem("sessionID");
  socket.auth = { sessionID: sessionID };
  socket.connect();
};

const disconnect = () => {
  socket.disconnect();
}

const useSocket = () => {
  const dispatch = useAppDispatch();
  const chatroom = useAppSelector(state => state.chatroom);

  useEffect(() => {
    function onDisconnect() {
      dispatch(disconnectUser());
      dispatch(clearMessage());
    }

    socket.on("connect", () => {
      if(!chatroom) {
        console.log("errror: No chatroom assigned");
        onDisconnect();
        return;
      }
      socket.emit("joinChatRoom", chatroom);
    })

    socket.on("session", (sessionID) => {
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);
    });

    socket.on("chatroomCachedMessages", (messages) => {
      messages.forEach(message => dispatch(addMessage(message)));
    });

    socket.on("chatroomMessage", (message) => {
      dispatch(addMessage(message));
    });

    socket.on("userJoined", (message) => {
      dispatch(addMessage(message));
    });

    socket.on("userLeft", (message) => {
      dispatch(addMessage(message));
    });

    socket.on("connect_error", (err) => {
      console.log("errror: " + err);
      onDisconnect();
    });

    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect');
      socket.off('userJoined');
      socket.off('userLeft');
      socket.off('chatroomCachedMessages');
      socket.off('chatroomMessage');
      socket.off("connect_error", onDisconnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [chatroom]);

};

export {
  connect,
  reconnect,
  useSocket,
  disconnect,
};