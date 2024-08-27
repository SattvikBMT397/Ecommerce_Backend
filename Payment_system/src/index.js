const express = require('express');
const  connectDB  = require('./config/db');
const { connectRabbitMQ } = require('./config/rabbitmq');
const paymentRoutes = require('./routes/paymentRoutes');
const paymentService = require('./services/paymentService');

const app = express();
app.use(express.json());


connectDB();

connectRabbitMQ().then(() => {
    paymentService.start(); 
});

// Use routes
app.use('/api', paymentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
