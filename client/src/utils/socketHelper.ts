import { useEffect } from "react";
import socket from './socket';
import { useAppDispatch, useAppSelector } from '../slices/hooks';
import { disconnectUser } from '../slices/user';
import { addMessage } from '../slices/messages';

const onConnect = (username: string) => {
  socket.auth = { username: username };
  socket.connect();
};

const useSocket = () => {
  const dispatch = useAppDispatch();
  const chatroom = useAppSelector(state => state.chatroom.name);

  useEffect(() => {
    function onDisconnect() {
      dispatch(disconnectUser());
    }

    socket.on("connect", () => {
      if(chatroom) {
        socket.emit("joinChatRoom", chatroom);
      }
    })

    socket.on("chatroomMessage", (newMessage) => {
      console.log(newMessage.message);
      dispatch(addMessage(newMessage));
    });

    socket.on("userConnected", (username) => {
      console.log("joined: " + username);
    });

    socket.on("connect_error", (err) => {
      console.log("errror: " + err);
      onDisconnect();
    });

    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect');
      socket.off('userConnected');
      socket.off('chatroomMessage');
      socket.off("connect_error", onDisconnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [chatroom]);

};

export {
  onConnect,
  useSocket,
};