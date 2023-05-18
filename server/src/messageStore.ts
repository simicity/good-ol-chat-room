import { messageData } from './interfaces';

/* abstract */ class MessageStore {
  saveMessage(message: messageData) {}
  findMessagesForUser(userID: string) {}
}

class InMemoryMessageStore extends MessageStore {
  private messages: messageData[];

  constructor() {
    super();
    this.messages = [];
  }

  saveMessage(message: messageData) {
    this.messages.push(message);
  }

  findMessagesForUser(userID: string) {
    return this.messages.filter(
      ({ from, to }: {from: string, to: string}) => from === userID || to === userID
    );
  }
}

module.exports = {
  InMemoryMessageStore,
};
