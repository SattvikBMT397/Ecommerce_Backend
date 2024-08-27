const amqp = require('amqplib');
const _enum = require('../utils/enum');
const message = require('../utils/message');
const serverConfig = require('./server-config');

let connection;
let channel;

const connectRabbitMQ = async () => {
    try {
        connection = await amqp.connect(serverConfig.RABBITMQ_URI);
        channel = await connection.createChannel();
        await channel.assertQueue(_enum.USER_CREATED);
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error(message.CONNECTION_ERROR, error);
    }
};

module.exports = { connectRabbitMQ, channel };
