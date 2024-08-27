const express = require('express');
const connectDB = require('./config/db');
const { connectRabbitMQ } = require('./config/rabbitmq');
const orderRoutes = require('./routes/orderRoutes');
const serverConfig = require('./config/server-config');

require('dotenv').config();
const app = express();
app.use(express.json());

connectDB();
connectRabbitMQ();

app.use('/api', orderRoutes);

app.listen(serverConfig.PORT, () => {
    console.log(`Server running on port ${serverConfig.PORT}`);
});
