const amqp = require('amqplib');
const serverConfig = require('./server-config');

let channel = null;

const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(serverConfig.RABBITMQ_URI);
        console.log('Connected to RabbitMQ');
        channel = await connection.createChannel();
        await channel.assertQueue('orderQueue');
        await channel.assertQueue('paymentStatusQueue');
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        process.exit(1);
    }
};

const getChannel = () => {
    if (!channel) {
        throw new Error('RabbitMQ channel not initialized');
    }
    return channel;
};

module.exports = { connectRabbitMQ, getChannel };
