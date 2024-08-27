const mongoose = require('mongoose');
const serverConfig = require('./server-config');

const connectDB = async () => {
    try {
        await mongoose.connect(serverConfig.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
