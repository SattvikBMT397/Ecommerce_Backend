const Order = require('../models/orderModel');
const redisClient = require('../config/redis');
const { getChannel } = require('../config/rabbitmq');
const httpStatus = require('http-status');
const messages = require('../utils/message');
const enums = require('../utils/enum');

const createOrder = async (req, res) => {
    const { items } = req.body;
    const userId = req.userId;

    if (!items || !Array.isArray(items) || items.length === 0) {
        res.status(httpStatus.BAD_REQUEST).json({ message: messages.ITEMS_REQUIRED });
        return;
    }

    if (!userId) {
        res.status(httpStatus.BAD_REQUEST).json({ message: messages.USER_ID_REQUIRED });
        return;
    }
    const { nanoid } = await import('nanoid');

    const totalPrice = items.reduce((acc, item) => acc + (item.quantity * (item.price || 0)), 0);
    const orderId = nanoid();
    const order = new Order({ orderId, userId, items, totalPrice });

    try {
        
        await order.save();
        await redisClient.set(orderId, JSON.stringify(order), { EX: 3000 });
        const channel = getChannel();
        console.log("channel", channel);
        if (channel) {
            channel.sendToQueue(enums.ORDER_CREATED, Buffer.from(JSON.stringify(order)));
        } else {
            console.error(messages.RABBITMQ_CHANNEL_ERROR);
        }

        res.status(httpStatus.CREATED).json({ message: messages.ORDER_CREATED, orderId });
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: messages.INTERNAL_SERVER_ERROR, err });
    }
};

const getOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const data = await redisClient.get(id);
        if (data) {
            res.json(JSON.parse(data));
        } else {
            const order = await Order.findOne({ orderId: id });
            if (order) {
                await redisClient.setEx(id, 3600, JSON.stringify(order));
                res.json(order);
            } else {
                res.status(httpStatus.NOT_FOUND).json({ message: messages.ORDER_NOT_FOUND });
            }
        }
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: messages.INTERNAL_SERVER_ERROR, err });
    }
};

module.exports = { createOrder, getOrder };
