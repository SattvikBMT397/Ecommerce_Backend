const amqp = require('amqplib');
const Order = require('../models/orderModel');
const redisClient = require('../config/redis');
const serverConfig = require('../config/server-config');
const _enum = require('../utils/enum');
const message = require('../utils/message');

let connection;
let channel;

const connectRabbitMQ = async () => {
    try {
        connection = await amqp.connect(serverConfig.RABBITMQ_URI);
        console.log(message.RABBITMQ_CONNECTED);

        channel = await connection.createChannel();
        await channel.assertQueue(_enum.PAYMENT_STATUS);
        await channel.assertQueue(_enum.FULFILMENT_STATUS);

        console.log(message.WAITING_FOR_MESSAGES);

        channel.consume(_enum.PAYMENT_STATUS, async (msg) => {
            if (msg !== null) {
                const paymentStatus = JSON.parse(msg.content.toString());
                console.log(message.PAYMENT_STATUS_RECEIVED, paymentStatus);

                try {
                    await handleFulfillment(paymentStatus);
                    channel.ack(msg);
                } catch (err) {
                    console.error(message.FULFILLMENT_ERROR, err);
                }
            }
        });
    } catch (error) {
        console.error(message.RABBITMQ_CONNECTION_FAILED, error);
    }
};

const handleFulfillment = async (paymentStatus) => {
    const { paymentId, orderId, status } = paymentStatus;
    const fulfillmentStatus = status === _enum.SUCCESS ? _enum.FULFILLED : _enum.FAILED;

    try {
        const cachedOrder = await redisClient.get(`order:${orderId}`);
        let order;

        if (cachedOrder) {
            order = JSON.parse(cachedOrder);
            console.log(message.ORDER_STATUS_UPDATED, orderId);
        } else {

            order = await Order.findOne({ orderId });
            if (!order) {
                console.error(message.ORDER_NOT_FOUND, orderId);
                return;
            }

            await redisClient.set(`order:${orderId}`, JSON.stringify(order));
            console.log(message.REDIS_CACHE_UPDATED, orderId);
        }

      
        order.status = fulfillmentStatus;
        await order.save();
        await redisClient.set(`order:${orderId}`, JSON.stringify(order));

        if (channel) {
            channel.sendToQueue(_enum.FULFILMENT_STATUS,
                Buffer.from(JSON.stringify({
                    paymentId,
                    orderId,
                    status: fulfillmentStatus
                })));
        } else {
            console.error('RabbitMQ channel not initialized');
        }

        console.log(message.FULFILLMENT_COMPLETED, orderId);
    } catch (err) {
        console.error(message.FULFILLMENT_FAILED, err);
    }
};

module.exports = { connectRabbitMQ };
