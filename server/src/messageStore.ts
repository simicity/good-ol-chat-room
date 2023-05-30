import { messageData } from './interfaces';

const CACHE_SIZE = 1000;

/* abstract */ class MessageStore {
  saveMessage(message: messageData) {}
  findMessagesForChatRoom(chatroom: string) {}
}

class InMemoryMessageStore extends MessageStore {
  private messages: messageData[];

  constructor() {
    super();
    this.messages = [];
  }

  saveMessage(message: messageData) {
    if(this.messages && this.messages.length > CACHE_SIZE) {
      this.messages.shift()
    }
    this.messages.push(message);
  }

  findMessagesForChatRoom(chatroom: string) {
    return this.messages.filter(message => message.to === chatroom);
  }
}

module.exports = {
  InMemoryMessageStore,
};
