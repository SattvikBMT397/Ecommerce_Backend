const amqp = require('amqplib');
const messages = require('../utils/message');
const serverConfig  = require('./server-config');

const rabbitmqUrl = serverConfig.RABBITMQ_URI

async function createRabbitMQConnection() {
  try {
    const connection = await amqp.connect(rabbitmqUrl);
    const channel = await connection.createChannel();

    console.log('Connected to RabbitMQ and listening for messages');
    return { connection, channel };
  } catch (error) {
    console.error(messages.RABBITMQ_CONNECTION_ERROR, error);
    process.exit(1);
  }
}

module.exports = { createRabbitMQConnection };
