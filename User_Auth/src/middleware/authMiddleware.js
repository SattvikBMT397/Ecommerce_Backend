const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');
const httpStatus = require('http-status');
const serverConfig = require('../config/server-config');

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(httpStatus.UNAUTHORIZED).json({ message: 'No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, serverConfig.JWT_SECRET);
        const redisToken = await redisClient.get(`auth_token_${decoded.userId}`);

        if (redisToken === token) {
            req.userId = decoded.userId;
            next();
        } else {
            res.status(httpStatus.UNAUTHORIZED).json({ message: 'Invalid token.' });
        }
    } catch (error) {
        res.status(httpStatus.UNAUTHORIZED).json({ message: 'Unauthorized.' });
    }
};

module.exports = authMiddleware;
