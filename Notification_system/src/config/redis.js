const redis = require('redis');
const messages = require('../utils/message');
const serverConfig = require('./server-config');

const redisUrl = serverConfig.REDIS_URL;
const redisClient = redis.createClient({ url: redisUrl });

redisClient.on('connect', () => {
  console.log('Connected to Redis...');
});

redisClient.on('error', (err) => {
  console.error(messages.CACHE_ERROR, err);
});

module.exports = redisClient;
