const redis = require('redis');

const redisClient = redis.createClient();

redisClient.on('connect', () => {
    console.log('Redis client connected.');
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error('Error connecting to Redis:', err);
    }
};

connectRedis();

module.exports = redisClient;
