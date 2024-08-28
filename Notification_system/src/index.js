const { createRabbitMQConnection } = require('./config/rabbitmq');
const { processMessage } = require('./services/notificationService');
const enums = require('./utils/enum');

(async () => {
  const { channel } = await createRabbitMQConnection();

  const consumeQueue = (queue) => {
    channel.consume(queue, async (msg) => {
     
        const messageContent = JSON.parse(msg.content.toString());
        console.log(`Received ${queue} message:`, messageContent);

        try {
          await processMessage(messageContent, queue);
          channel.ack(msg);
        } catch (err) {
          console.error(`Error processing ${queue} message:`, err);
        }
    });
  };

  await consumeQueue(enums.USER_CREATED);
  await consumeQueue(enums.ORDER_CREATED);
  await consumeQueue(enums.PAYMENT_STATUS);
  await consumeQueue(enums.FULFILMENT_STATUS);
})();
