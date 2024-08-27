module.exports = {
    RABBITMQ_CONNECTED: 'Connected to RabbitMQ',
    RABBITMQ_CONNECTION_FAILED: 'Failed to connect to RabbitMQ',
    WAITING_FOR_MESSAGES: 'Waiting for messages in payment.status queue',
    PAYMENT_STATUS_RECEIVED: 'Received payment status:',
    FULFILLMENT_ERROR: 'Error during fulfillment process:',
    ORDER_NOT_FOUND: 'Order not found:',
    ORDER_STATUS_UPDATED: 'Order status updated in Redis and MongoDB:',
    REDIS_CACHE_UPDATED: 'Redis cache updated for order:',
    REDIS_ERROR: 'Error accessing Redis:',
    MONGODB_CONNECTION_ERROR: 'MongoDB connection error:',
    REDIS_CONNECTION_ERROR: 'Redis connection error:',
    FULFILLMENT_COMPLETED: 'Fulfillment completed for order:',
    FULFILLMENT_FAILED: 'Fulfillment failed for order:'
};
