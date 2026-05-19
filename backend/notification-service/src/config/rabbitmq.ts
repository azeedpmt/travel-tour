import amqp from 'amqplib';
import { NotificationModel } from '../models/Notification';

let channel: any = null;
let connection: any = null;

export const setupRabbitMQ = async () => {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL!);
        channel = await connection.createChannel();
        
        await channel.assertQueue('NOTIFICATION_QUEUE', { durable: true });
        await channel.assertQueue('BOOKING_QUEUE', { durable: true });
        await channel.assertQueue('PAYMENT_QUEUE', { durable: true });
        
        console.log('RabbitMQ connected successfully for Notification Service');
        
        // Consume messages
        channel.consume('NOTIFICATION_QUEUE', async (msg: any) => {
            if (msg) {
                const data = JSON.parse(msg.content.toString());
                await handleNotification(data);
                channel.ack(msg);
            }
        });
        
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

// Handle different notification types
const handleNotification = async (data: any) => {
    console.log('Received notification:', data);
    
    switch (data.type) {
        case 'BOOKING_CONFIRMED':
            await sendEmailNotification(data);
            break;
        case 'PAYMENT_SUCCESS':
            await sendEmailNotification(data);
            await sendSMSNotification(data);
            break;
        case 'BOOKING_CANCELLED':
            await sendEmailNotification(data);
            break;
        case 'NEW_DEAL_AVAILABLE':
            await sendPushNotification(data);
            break;
        default:
            console.log('Unknown notification type:', data.type);
    }
};

// Email sending
export const sendEmailNotification = async (data: any) => {
    try {
        // For now, just log. Configure nodemailer with your SMTP settings
        console.log(`📧 Email sent to ${data.email || data.recipient}:`);
        console.log(`   Subject: ${data.title}`);
        console.log(`   Message: ${data.message}`);
        
        // Save to database
        await NotificationModel.create({
            userId: data.userId,
            type: 'email',
            title: data.title,
            message: data.message,
            recipient: data.email || data.recipient,
            status: 'sent',
            metadata: data,
            sentAt: new Date()
        });
        
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};

// SMS sending (using Twilio)
export const sendSMSNotification = async (data: any) => {
    try {
        // For now, just log. Configure Twilio with your credentials
        console.log(`📱 SMS sent to ${data.phone || data.recipient}:`);
        console.log(`   Message: ${data.message}`);
        
        // Save to database
        await NotificationModel.create({
            userId: data.userId,
            type: 'sms',
            title: data.title,
            message: data.message,
            recipient: data.phone || data.recipient,
            status: 'sent',
            metadata: data,
            sentAt: new Date()
        });
        
        return true;
    } catch (error) {
        console.error('SMS sending failed:', error);
        return false;
    }
};

// Push notification
export const sendPushNotification = async (data: any) => {
    try {
        console.log(`🔔 Push notification to user ${data.userId}:`);
        console.log(`   Title: ${data.title}`);
        console.log(`   Message: ${data.message}`);
        
        await NotificationModel.create({
            userId: data.userId,
            type: 'push',
            title: data.title,
            message: data.message,
            recipient: `user_${data.userId}`,
            status: 'sent',
            metadata: data,
            sentAt: new Date()
        });
        
        return true;
    } catch (error) {
        console.error('Push notification failed:', error);
        return false;
    }
};

export const getChannel = () => channel;
