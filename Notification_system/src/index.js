const { createRabbitMQConnection } = require('./config/rabbitmq');
const { processMessage } = require('./services/notificationService');
const enums = require('./utils/enum');

(async () => {
  const { channel } = await createRabbitMQConnection();

  const consumeQueue = (queue) => {
    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const messageContent = JSON.parse(msg.content.toString());
        console.log(`Received ${queue} message:`, messageContent);

        try {
          await processMessage(messageContent, queue);
          channel.ack(msg);
        } catch (err) {
          console.error(`Error processing ${queue} message:`, err);
        }
      }
    });
  };

  // Start consuming messages from multiple queues
  consumeQueue(enums.USER_CREATED);
  consumeQueue(enums.ORDER_CREATED);
  consumeQueue(enums.PAYMENT_STATUS);
  consumeQueue(enums.FULFILMENT_STATUS);
})();
