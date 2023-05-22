/** Types for client app */
export interface UserData {
  username?: string;
  chatroom?: string;
  isOnline: boolean;
}

export interface ChatRoomData {
  name?: string;
  members: UserData[];
}

/** Shared types with server: Types for socket processing */
export interface ServerToClientEvents {
  session: (sessionID: string, userID: string) => void;
  users: (users: sessionData[]) => void;
  userConnected: (username: string) => void;
  userDisconnected: (userID: string) => void;
  chatroomMessage: (message: messageData) => void;
  error: (errorMessage: string) => void;
}

export interface ClientToServerEvents {
  joinChatRoom: (chatroom: string) => void;
  chatroomMessage: (message: string) => void;
}

/** Server-side types for reference */
export interface sessionData {
  userID: string;
  connected: boolean;
  chatroom?: string;
  messages?: string[];
}

export interface messageData {
  message: string;
  from: string;
  to: string;
  timestamp: Date;
}