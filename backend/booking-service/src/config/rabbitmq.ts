import amqp from 'amqplib';

let channel: any = null;
let connection: any = null;

export const setupRabbitMQ = async () => {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL!);
        channel = await connection.createChannel();
        
        await channel.assertQueue('BOOKING_QUEUE', { durable: true });
        await channel.assertQueue('PAYMENT_QUEUE', { durable: true });
        await channel.assertQueue('NOTIFICATION_QUEUE', { durable: true });
        
        console.log('RabbitMQ connected successfully');
        
        // Handle connection closure
        connection.on('close', () => {
            console.error('RabbitMQ connection closed. Reconnecting...');
            setTimeout(setupRabbitMQ, 5000);
        });
        
        return channel;
    } catch (error) {
        console.error('RabbitMQ connection failed:', error);
        // Don't exit, just retry after 5 seconds
        setTimeout(setupRabbitMQ, 5000);
        return null;
    }
};

export const getChannel = () => channel;