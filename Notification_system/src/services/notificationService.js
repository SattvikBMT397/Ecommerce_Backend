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

  const { subject, text:htmlContent } = subjectAndText;
  const userId = message.userId;

  if (!userId) {
    console.error(messages.USER_ID_REQUIRED);
    return;
  }

  try {
    const email = await getEmailFromRedis(userId);
    if (email) {
      await sendEmail(email, subject, htmlContent);
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
        subject: enums.USER_CREATED,
        text: `
          <html>
            <body>
              <h2>Welcome to Our Service!</h2>
              <p>Hello ${message.userId},</p>
              <p>We are excited to inform you that your user account with ID <strong>${message.userId}</strong> has been successfully created.</p>
              <p>Thank you for joining us!</p>
              <p>Best regards,<br>Binmile Company Team</p>
            </body>
          </html>
        `,
      };
    case enums.ORDER_CREATED:
      return {
        subject: enums.ORDER_CREATED,
        text: `
          <html>
            <body>
              <h2>Order Confirmation</h2>
              <p>Hello ${message.userId},</p>
              <p>Your order with ID <strong>${message.orderId}</strong> has been successfully created.</p>
              <p>We will notify you once it has been processed and shipped.</p>
              <p>Thank you for shopping with us!</p>
              <p>Best regards,<br>Your Company Team</p>
            </body>
          </html>
        `,
      };
    case enums.PAYMENT_STATUS:
      return {
        subject: enums.PAYMENT_STATUS,
        text: `
          <html>
            <body>
              <h2>Payment Status Update</h2>
              <p>Dear Customer,</p>
              <p>We wanted to let you know that the payment with ID <strong>${message.paymentId}</strong> for your order <strong>${message.orderId}</strong> is now <strong>${message.status}</strong>.</p>
              <p>If you have any questions, feel free to contact our support team.</p>
              <p>Best regards,<br>Your Company Team</p>
            </body>
          </html>
        `,
      };
    case enums.FULFILMENT_STATUS:
      return {
        subject: enums.FULFILMENT_STATUS,
        text: `
          <html>
            <body>
              <h2>Order Fulfillment Status</h2>
              <p>Dear Customer,</p>
              <p>Your order with ID <strong>${message.orderId}</strong> has been <strong>${message.status}</strong>.</p>
              <p>Thank you for your patience!</p>
              <p>Best regards,<br>Your Company Team</p>
            </body>
          </html>
        `,
      };
    default:
      console.error(`${messages.INTERNAL_SERVER_ERROR}: Unknown queue: ${queue}`);
      return null;
  }
}


module.exports = { processMessage };
