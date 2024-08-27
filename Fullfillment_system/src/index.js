const connectDB = require('./config/db');
const express = require('express');
const { connectRabbitMQ } = require('./service/fullfillmentService');
const app = express();
const serverConfig = require('./config/server-config');
app.use(express.json());
connectDB();
connectRabbitMQ();


const PORT = serverConfig.PORT
app.listen(PORT, () => {
    console.log(`Payment Service running on port ${PORT}`);
});