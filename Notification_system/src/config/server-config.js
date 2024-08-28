const dotenv = require('dotenv');
dotenv.config();
module.exports= {
    PORT: process.env.PORT,
    RABBITMQ_URI: process.env.RABBITMQ_URI,
    MAIL: process.env.MAIL,
    PASS: process.env.PASS,
    REDIS_URL:process.env.REDIS_URL
}