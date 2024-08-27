const redisClient = require('../config/redis');

async function getEmailFromRedis(userId) {
  return new Promise((resolve, reject) => {
    redisClient.get(`user:${userId}:email`, (err, email) => {
      if (err) {
        console.error('Error fetching email from Redis:', err);
        reject(err);
      } else {
        resolve(email);
      }
    });
  });
}

module.exports = { getEmailFromRedis };
