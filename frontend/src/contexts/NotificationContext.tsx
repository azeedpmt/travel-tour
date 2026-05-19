import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSocket } from './SocketContext';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  type: 'booking' | 'payment' | 'deal' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { socket, isConnected } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotifications(parsed.map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) })));
      } catch (e) {
        console.error('Failed to load notifications:', e);
      }
    }
  }, []);

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Socket event listeners
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Booking events
    socket.on('booking_created', (data: any) => {
      addNotification({
        type: 'booking',
        title: 'New Booking Created',
        message: `Your booking has been created successfully. Booking ID: ${data.bookingId}`,
        data,
      });
      toast.success('Booking created successfully!');
    });

    socket.on('booking_cancelled', (data: any) => {
      addNotification({
        type: 'booking',
        title: 'Booking Cancelled',
        message: `Your booking ${data.bookingId} has been cancelled.`,
        data,
      });
      toast.error('Booking cancelled');
    });

    // Payment events
    socket.on('payment_success', (data: any) => {
      addNotification({
        type: 'payment',
        title: 'Payment Successful',
        message: `Payment of ₹${data.amount} was successful.`,
        data,
      });
      toast.success('Payment successful!');
    });

    socket.on('payment_failed', (data: any) => {
      addNotification({
        type: 'payment',
        title: 'Payment Failed',
        message: `Payment failed. Please try again.`,
        data,
      });
      toast.error('Payment failed');
    });

    // Deal events
    socket.on('new_deal_available', (data: any) => {
      addNotification({
        type: 'deal',
        title: 'New Deal Available!',
        message: `${data.title} - ${data.discountPercent}% off!`,
        data,
      });
      toast.success(`New deal: ${data.title}`);
    });

    socket.on('deal_updated', (data: any) => {
      addNotification({
        type: 'deal',
        title: 'Deal Updated',
        message: `${data.title} has been updated.`,
        data,
      });
    });

    return () => {
      socket.off('booking_created');
      socket.off('booking_cancelled');
      socket.off('payment_success');
      socket.off('payment_failed');
      socket.off('new_deal_available');
      socket.off('deal_updated');
    };
  }, [socket, isConnected]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 6),
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep last 50
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};