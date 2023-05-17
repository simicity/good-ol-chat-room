export interface UserData {
  username: string;
}

export interface MessageData {
  sender: string;
  message: string;
  timestamp?: Date;
}

export interface ChatRoomData {
  roomName: string;
}