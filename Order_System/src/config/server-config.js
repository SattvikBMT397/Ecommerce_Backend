const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    PORT: process.env.PORT || 5001,
    MONGO_URI: process.env.MONGO_URI,
    RABBITMQ_URI: process.env.RABBITMQ_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    REDIS_PORT: process.env.REDIS_PORT || 6379
};
