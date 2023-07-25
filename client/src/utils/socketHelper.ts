import { useEffect } from "react";
import socket from './socket';
import { useAppDispatch, useAppSelector } from '../slices/hooks';
import { addMessage, clearMessage } from '../slices/messages';
import { connectUser, disconnectUser } from "../slices/user";
import { updateUsers } from "../slices/users";

const joinChatRoom = (chatroom: string, username: string) => {
  socket.emit("joinChatRoom", chatroom, username);
};

const leaveChatRoom = (chatroom: string) => {
  const dispatch = useAppDispatch();
  dispatch(disconnectUser());
  dispatch(clearMessage());
  socket.emit("leaveChatRoom", chatroom);
}

const connect = () => {
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
    function onConnect() {
      dispatch(connectUser());
    }

    function onDisconnect() {
      dispatch(disconnectUser());
      dispatch(clearMessage());
    }

    socket.on("connect", () => {

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
      onConnect();
      dispatch(addMessage(message));
    });

    socket.on("userLeft", (message) => {
      onDisconnect();
      dispatch(addMessage(message));
    });

    socket.on("users", (serializedMap) => {
      dispatch(updateUsers(serializedMap));
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
      socket.off('users');
      socket.off('chatroomCachedMessages');
      socket.off('chatroomMessage');
      socket.off("connect_error", onDisconnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [chatroom]);

};

export {
  joinChatRoom,
  leaveChatRoom,
  connect,
  useSocket,
  disconnect,
};