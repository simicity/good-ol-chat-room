/** Types for client app */
export interface UserData {
  userID: string | undefined;
  username: string | undefined;
  isConnected: boolean;
}

export interface ChatRoomData {
  name?: string;
  members: string[];
}

export interface UsersData {
  chatroom: string,
  users: string[],
}

/** Shared types with server: Types for socket processing */
export interface ServerToClientEvents {
  session: (sessionID: string, userID: string) => void;
  chatroomCachedMessages: (message: messageData[]) => void;
  userJoined: (message: messageData) => void;
  userLeft: (message: messageData) => void;
  users: (serializedMap: string) => void;
  chatroomMessage: (message: messageData) => void;
  error: (errorMessage: string) => void;
}

export interface ClientToServerEvents {
  joinChatRoom: (chatroom: string, username: string) => void;
  leaveChatRoom: (chatroom: string) => void;
  chatroomMessage: (message: string) => void;
}

export interface messageData {
  message: string;
  from: string;
  to: string;
  timestamp: Date;
}