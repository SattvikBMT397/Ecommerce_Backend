const  { createClient } = require('redis');
const  serverConfig = require( './server-config');

const redisClient = createClient({
    socket: {
        host: 'localhost',
        port: serverConfig.REDIS_PORT,
    },
});

redisClient.on('connect', () => {
    console.log('Redis client connected.');
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error('Error connecting to Redis:', err);
    }
})();

module.exports= redisClient;
