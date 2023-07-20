import { sessionData } from './interfaces';

/* abstract */ class SessionStore {
  findSession(id: string) {}
  saveSession(id: string, session: sessionData) {}
  findAllSessions() {}
}

class InMemorySessionStore extends SessionStore {
  private sessions;

  constructor() {
    super();
    this.sessions = new Map<string, sessionData>();
  }

  findSession(id: string) {
    return this.sessions.get(id);
  }

  saveSession(id: string, session: sessionData) {
    this.sessions.set(id, session);
  }

  findAllSessions() {
    return [...this.sessions.values()];
  }
}

import Redis from "ioredis";
const SESSION_TTL = 24 * 60 * 60;
const mapSession = ([userID, username, connected]: any[]) =>
  userID ? { userID, username, connected: connected === "true" } : undefined;

class RedisSessionStore extends SessionStore {
  redisClient: Redis;

  constructor(redisClient: Redis) {
    super();
    this.redisClient = redisClient;
  }

  findSession(id: string) {
    return this.redisClient
      .hmget(`session:${id}`, "userID", "username", "connected")
      .then(mapSession);
  }

  saveSession(id: string, { userID, username, connected }: sessionData) {
    this.redisClient
      .multi()
      .hset(
        `session:${id}`,
        "userID",
        userID,
        "username",
        username,
        "connected",
        connected.toString()
      )
      .expire(`session:${id}`, SESSION_TTL)
      .exec();
  }

  async findAllSessions() {
    const keys = new Set();
    let nextIndex = 0;
    do {
      const [nextIndexAsStr, results] = await this.redisClient.scan(
        nextIndex,
        "MATCH",
        "session:*",
        "COUNT",
        "100"
      );
      nextIndex = parseInt(nextIndexAsStr, 10);
      results.forEach((s) => keys.add(s));
    } while (nextIndex !== 0);
    const commands: any[] = [];
    keys.forEach((key) => {
      commands.push(["hmget", key, "userID", "username", "connected"]);
    });
    return this.redisClient
      .multi(commands)
      .exec()
      .then((results) => {
        if(!results) {
          return null;
        }
        return results
          .map(([err, session]) => (err ? undefined : mapSession(session as any[])))
          .filter((v) => !!v);
      });
  }
}

module.exports = {
  InMemorySessionStore,
  RedisSessionStore,
};
