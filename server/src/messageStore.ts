import { messageData } from './interfaces';

const CACHE_SIZE = 1000;

/* abstract */ class MessageStore {
  saveMessage(message: messageData) {}
  findMessagesForChatRoom(chatroom: string) {}
}

class InMemoryMessageStore extends MessageStore {
  private messagesPerChatRoom;

  constructor() {
    super();
    this.messagesPerChatRoom = new Map<string, messageData[]>();
  }

  saveMessage(message: messageData) {
    if(this.messagesPerChatRoom.has(message.to)) {
      const chatRoomMessages = this.messagesPerChatRoom.get(message.to);
      if (chatRoomMessages) {
        if(chatRoomMessages.length > CACHE_SIZE) {
          chatRoomMessages.shift();
        } else {
          chatRoomMessages.push(message);
        }
      }
    } else {
      this.messagesPerChatRoom.set(message.to, []);
    }
  }

  findMessagesForChatRoom(chatroom: string) {
    return this.messagesPerChatRoom.has(chatroom) ? this.messagesPerChatRoom.get(chatroom) : [];
  }
}

module.exports = {
  InMemoryMessageStore,
};
