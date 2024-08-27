const { v4: uuidv4 } = require('uuid');
const Payment = require('../models/paymentModel');
const { getChannel } = require('../config/rabbitmq');
const _enum = require('../utils/enum');

const processPayment = async (order) => {
    const paymentId = uuidv4();
    const isSuccess = mockPaymentProcessing();
    const paymentStatus = isSuccess ? _enum.SUCCESS : _enum.FAILURE;

    try {
        const payment = new Payment({
            paymentId,
            orderId: order.orderId,
            userId: order.userId,
            amount: order.totalPrice,
            status: paymentStatus
        });
        await payment.save();

        const channel = getChannel();
        if (channel) {
            channel.sendToQueue(_enum.PAYMENT_STATUS,
                Buffer.from(JSON.stringify({
                    paymentId,
                    orderId: order.orderId,
                    status: paymentStatus
                })));
        } else {
            console.error('RabbitMQ channel not initialized');
        }
    } catch (err) {
        console.error('Error processing payment:', err);
    }
};

const mockPaymentProcessing = () => {
    return Math.random() < 0.8; 
};

const handleOrder = async (msg) => {
    const order = JSON.parse(msg.content.toString());
    console.log('Received order:', order);

    try {
        await processPayment(order);
        const channel = getChannel();
        if (channel) {
            channel.ack(msg);
        }
    } catch (err) {
        console.error('Payment processing error:', err);
    }
};

const start = async () => {
    const channel = getChannel();
    channel.consume(_enum.ORDER_CREATED, handleOrder, { noAck: false });
    console.log('Payment service started and waiting for messages...');
};

module.exports = { start };
