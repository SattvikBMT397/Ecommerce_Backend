const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const redisClient = require('../config/redis');
const message = require('../utils/message');
const _enum = require('../utils/enum');
const { channel } = require('../config/rabbitmq');
const httpStatus = require('http-status');
const serverConfig = require('../config/server-config');

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: message.ALL_FIELDS_REQUIRED });
        }
      console.log(username,email,password);
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: message.USER_ALREADY_EXISTS });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            userId: uuidv4(),
            username,
            email,
            password: hashedPassword
        });
        await user.save();
        if (channel) {
            const msg = JSON.stringify({ userId: user.userId, email: user.email });
            channel.sendToQueue(_enum.USER_CREATED, Buffer.from(msg));
            console.log('User created message sent to RabbitMQ');
        }
        res.status(httpStatus.CREATED).json({ message: message.USER_CREATED });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: message.INTERNAL_SERVER_ERROR, error });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: message.ALL_FIELDS_REQUIRED });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: message.INVALID_EMAIL_OR_PASSWORD });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: message.INVALID_EMAIL_OR_PASSWORD });
        }

        const token = jwt.sign({ userId: user._id }, serverConfig.JWT_SECRET, { expiresIn: '1h' });

        
        await redisClient.set(`user:${user.id}`, user.email);
        await redisClient.set(`auth_token_${user._id}`, token, { EX: 36000 });


        res.status(httpStatus.OK).json({ token });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: message.INTERNAL_SERVER_ERROR, error });
    }
};

exports.logoutUser = (req, res) => {
    try {
        res.status(httpStatus.OK).json({ message: message.LOGOUT_USER });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: message.INTERNAL_SERVER_ERROR, error });
    }
};

