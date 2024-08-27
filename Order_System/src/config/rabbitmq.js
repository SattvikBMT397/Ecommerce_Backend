const amqp = require('amqplib');
const serverConfig = require('./server-config');
const message = require('../utils/message');
const enums = require('../utils/enum');

let channel;

const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(serverConfig.RABBITMQ_URI);
        channel = await connection.createChannel();
        await channel.assertQueue(enums.ORDER_CREATED);
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error(message.RABBITMQ_CONNECTION_ERROR, error);
    }
};

const getChannel = () => channel; 

module.exports = { connectRabbitMQ, getChannel };
