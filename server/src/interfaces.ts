export interface ServerToClientEvents {
  session: (sessionID: string, userID: string) => void;
  chatroomCachedMessages: (message: messageData[]) => void;
  userJoined: (message: messageData) => void;
  userLeft: (message: messageData) => void;
  chatroomMessage: (message: messageData) => void;
  error: (errorMessage: string) => void;
}

export interface ClientToServerEvents {
  joinChatRoom: (chatroom: string) => void;
  chatroomMessage: (message: string) => void;
}

export interface InterServerEvents {

}

export interface SocketData {
  sessionID?: string;
  userID?: string;
  username: string;
  chatroom: string;
}

export interface sessionData {
  userID: string;
  connected: boolean;
  chatroom?: string;
}

export interface messageData {
  message: string;
  from: string;
  to: string;
  timestamp: Date;
}
