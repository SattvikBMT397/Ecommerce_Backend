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
(async () => {
  try {
    await redisClient.connect(); 
  } catch (error) {
    console.error('Error connecting to Redis:', error);
  }
})();

module.exports = redisClient;
