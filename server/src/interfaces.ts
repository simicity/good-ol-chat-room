export interface ServerToClientEvents {
  session: (sessionID: string, userID: string) => void;
  users: (users: sessionData[]) => void;
  userConnected: (user: sessionData) => void;
  userDisconnected: (userID: string) => void;
  chatroomMessage: ({content, from, to}: {content: string, from: string, to: string}) => void;
}

export interface ClientToServerEvents {
  chatroomMessage: ({content, to}: {content: string, to: string}) => void;
  
}

export interface InterServerEvents {

}

export interface SocketData {
  sessionID: string;
  userID: string;
  username: string;
  chatroomID: string;
}

export interface sessionData {
  userID: string;
  username?: string;
  connected: boolean;
  chatroomID?: string;
  messages?: string[];
}

export interface messageData {
  message: string;
  from: string;
  to: string;
  timestamp?: Date;
}
