import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import {config} from '../infra/config';
export const REDIS_QUEUE_NAME = 'mainQueue';

// Connect to Redis
const redisOptions = {
    host: config.redisHost,
    port: config.redisPort,
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
