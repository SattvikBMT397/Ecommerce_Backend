const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const serverConfig = require('./config/server-config');
// const { connectRedis } = require('./config/redis');
const { connectRabbitMQ } = require('./config/rabbitmq');

const app = express();

app.use(express.json());


connectDB();
connectRabbitMQ();
app.use('/api/auth', authRoutes);

const PORT = serverConfig.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
