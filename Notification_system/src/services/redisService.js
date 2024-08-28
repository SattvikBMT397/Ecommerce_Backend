const redisClient = require('../config/redis'); 
const messages = require('../utils/message');

async function getEmailFromRedis(userId) {
  try {
    const email = await redisClient.get(`user:${userId}`);
    return email;
  } catch (error) {
    console.error(`${messages.CACHE_ERROR}: Error retrieving email for user ID ${userId} from Redis`, error);
    throw error; 
  }
}

module.exports = { getEmailFromRedis };
