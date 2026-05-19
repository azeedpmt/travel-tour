import amqp from 'amqplib';

let channel: any = null;
let connection: any = null;

export const setupRabbitMQ = async () => {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL!);
        channel = await connection.createChannel();
        
        await channel.assertQueue('HOTEL_QUEUE', { durable: true });
        await channel.assertQueue('DEAL_QUEUE', { durable: true });
        
        console.log('RabbitMQ connected successfully for Hotel Service');
        
        connection.on('close', () => {
            console.error('RabbitMQ connection closed. Reconnecting...');
            setTimeout(setupRabbitMQ, 5000);
        });
        
        return channel;
    } catch (error) {
        console.error('RabbitMQ connection failed:', error);
        setTimeout(setupRabbitMQ, 5000);
        return null;
    }
};

export const getChannel = () => channel;