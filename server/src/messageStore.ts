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

import Redis from "ioredis";
const CONVERSATION_TTL = 24 * 60 * 60;

class RedisMessageStore extends MessageStore {
  redisClient: Redis;

  constructor(redisClient: Redis) {
    super();
    this.redisClient = redisClient;
  }

  saveMessage(message: messageData) {
    const value = JSON.stringify(message);
    this.redisClient
      .multi()
      .rpush(`message:${message.to}`, value)
      .expire(`message:${message.to}`, CONVERSATION_TTL)
      .exec();
  }

  deleteMessagesForChatRoom(chatroom: string) {
    return this.redisClient.del(`message:${chatroom}`);
  }

  findMessagesForChatRoom(chatroom: string) {
    return this.redisClient
      .lrange(`message:${chatroom}`, 0, -1)
      .then((results) => {
        return results.map((result) => JSON.parse(result));
      });
  }
}

module.exports = {
  InMemoryMessageStore,
  RedisMessageStore,
};
