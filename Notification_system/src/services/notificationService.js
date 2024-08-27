const { getEmailFromRedis } = require('./redisService');
const { sendEmail } = require('../utils/sendNotification');
const enums = require('../utils/enum');
const messages = require('../utils/message');

async function processMessage(message, queue) {
  const subjectAndText = getSubjectAndText(message, queue);

  if (!subjectAndText) {
    console.error(`${messages.INTERNAL_SERVER_ERROR}: No subject and text defined for queue ${queue}`);
    return;
  }

  const { subject, text } = subjectAndText;
  const userId = message.userId;

  if (!userId) {
    console.error(messages.USER_ID_REQUIRED);
    return;
  }

  try {
    const email = await getEmailFromRedis(userId);
    if (email) {
      await sendEmail(email, subject, text);
    } else {
      console.warn(`${messages.ORDER_NOT_FOUND}: Email for user ID ${userId} not found in Redis.`);
    }
  } catch (error) {
    console.error(`${messages.INTERNAL_SERVER_ERROR}: Error processing message for ${queue}:`, error);
  }
}

function getSubjectAndText(message, queue) {
  switch (queue) {
    case enums.USER_CREATED:
      return {
        subject: enums.USERCREATED,
        text: `Hello ${message.userId}, your user ${message.userId} has been created.`,
      };
    case enums.ORDER_CREATED:
      return {
        subject: enums.ORDERCREATED,
        text: `Hello ${message.userId}, your order ${message.orderId} has been created.`,
      };
    case enums.PAYMENT_STATUS:
      return {
        subject: enums.PAYMENTSTATUS,
        text: `Hello, payment ${message.paymentId} for order ${message.orderId} is ${message.status}.`,
      };
    case enums.FULFILMENT_STATUS:
      return {
        subject: enums.FULFILMENTSTATUS,
        text: `Hello, your order ${message.orderId} has been ${message.status}.`,
      };
    default:
      console.error(`${messages.INTERNAL_SERVER_ERROR}: Unknown queue: ${queue}`);
      return null;
  }
}

module.exports = { processMessage };
