require('dotenv').config();

module.exports = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    RABBITMQ_URI: process.env.RABBITMQ_URI,
    JWT_SECRET: process.env.JWT_SECRET
};
