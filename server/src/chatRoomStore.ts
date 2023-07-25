import { chatRoomData } from './interfaces';

/* abstract */ class ChatRoomStore {
  saveRoom(chatroom: chatRoomData) {}
  deleteRoom(chatroom: chatRoomData) {}
  findAllRooms() {}
}

import Redis from "ioredis";
const mapRoom = ([room]: any[]) => room ? room : undefined;

class RedisChatRoomStore extends ChatRoomStore {
  redisClient: Redis;

  constructor(redisClient: Redis) {
    super();
    this.redisClient = redisClient;
  }

  saveRoom({ roomname, password }: chatRoomData) {
    this.redisClient
      .multi()
      .hset(
        `chatroom:${roomname}`,
        "roomname",
        roomname,
        "password",
        password
      )
      .exec();
  }

  deleteRoom({ roomname, password }: chatRoomData): Promise<void> {
    return new Promise((resolve, reject) => {
      this.redisClient
        .multi()
        .hget(`chatroom:${roomname}`, 'password')
        .exec()
        .then((results) => {
          if(!results) {
            return null;
          }
          let [err, result] = results[0];
          if(err) {
            throw err;
          }
          return result;
        })
        .then((savedPassword) => {
          if (savedPassword && savedPassword === password) {
            return this.redisClient.del(`chatroom:${roomname}`);
          }
          return null;
        })
        .then((result) => {
          if (result === 1) {
            console.log(`Chatroom "${roomname}" deleted successfully.`);
            resolve();
          } else {
            console.log(`Invalid password. Chatroom "${roomname}" was not deleted.`);
            throw new Error("invalid password")
          }
        })
        .catch((err) => {
          reject(err);
        })
    });
  }

  async findAllRooms() {
    const keys = new Set();
    let nextIndex = 0;
    do {
      const [nextIndexAsStr, results] = await this.redisClient.scan(
        nextIndex,
        "MATCH",
        "chatroom:*",
        "COUNT",
        "100"
      );
      nextIndex = parseInt(nextIndexAsStr, 10);
      results.forEach((s) => keys.add(s));
    } while (nextIndex !== 0);
    const commands: any[] = [];
    keys.forEach((key) => {
      commands.push(["hmget", key, "roomname"]);
    });
    return this.redisClient
      .multi(commands)
      .exec()
      .then((results) => {
        if(!results) {
          return null;
        }
        return results
          .map(([err, room]) => (err ? undefined : mapRoom(room as any[])))
          .filter((v) => !!v);
      });
  }
}

module.exports = {
  RedisChatRoomStore,
};
