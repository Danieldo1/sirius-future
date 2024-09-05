// import Redis from 'ioredis'

// const redis = new Redis(process.env.REDIS_URL)

// export async function getFromCache(key) {
//   const value = await redis.get(key)
//   return value ? JSON.parse(value) : null
// }

// export async function setCache(key, value, expirationInSeconds = 3600) {
//   await redis.set(key, JSON.stringify(value), 'EX', expirationInSeconds)
// }

// export default redis

import Redis from 'ioredis';

class RedisConnectionManager {
  constructor() {
    this.client = null;
    this.lastUsed = null;
    this.timeout = 60000; // 1 minute timeout
  }

  getClient() {
    const now = Date.now();
    if (!this.client || (this.lastUsed && now - this.lastUsed > this.timeout)) {
      if (this.client) {
        this.client.disconnect();
      }
      this.client = new Redis({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
        maxRetriesPerRequest: 1,
        enableReadyCheck: false,
      });

      this.client.on('error', (err) => {
        console.error('Redis error:', err);
      });
    }
    this.lastUsed = now;
    return this.client;
  }

  async closeConnection() {
    if (this.client) {
      await this.client.quit();
      this.client = null;
    }
  }
}

const manager = new RedisConnectionManager();

export async function getFromCache(key) {
  const client = manager.getClient();
  const value = await client.get(key);
  return value ? JSON.parse(value) : null;
}

export async function setCache(key, value, expirationInSeconds = 3600) {
  const client = manager.getClient();
  await client.set(key, JSON.stringify(value), 'EX', expirationInSeconds);
}

export default manager;