import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';
export const REDIS_QUEUE_NAME = 'mainQueue';

dotenv.config();
// Connect to Redis
const redisOptions = {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null, // Required by BullMQ
  };
const connection = new IORedis(redisOptions);

// Initialize the queue
const mainQueue = new Queue('mainQueue', { connection });
const redis = {
    connection,
   queue:mainQueue
}
export {redis} ;
