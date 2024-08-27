const redis = require('redis');

const redisClient = redis.createClient();

redisClient.on('connect', () => {
    console.log('Redis client connected.');
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});


(async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis.');
    } catch (err) {
        console.error('Error connecting to Redis:', err);
    }
})();

module.exports = redisClient;
