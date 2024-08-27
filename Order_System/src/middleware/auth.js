const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');
const messages = require('../utils/message');
const serverConfig = require('../config/server-config');
const httpStatus = require('http-status');

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(httpStatus.UNAUTHORIZED).json({ message: messages.TOKEN_NOT_FOUND });
        return;
    }

    try {
        const decoded = jwt.verify(token, serverConfig.JWT_SECRET);
        const redisToken = await redisClient.get(`auth_token_${decoded.userId}`);

        if (redisToken === token) {
            req.userId = decoded.userId;
            next();
        } else {
            res.status(httpStatus.UNAUTHORIZED).json({ message: messages.INVALID_TOKEN });
        }
    } catch (error) {
        res.status(httpStatus.UNAUTHORIZED).json({ message: messages.UNAUTHORIZED });
    }
};

module.exports = authMiddleware;
