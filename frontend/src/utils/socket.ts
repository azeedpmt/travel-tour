import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (token: string) => {
  if (socket) {
    socket.disconnect();
  }
  
  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
  });
  
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Socket event listeners
export const onNewDeal = (callback: (data: any) => void) => {
  if (socket) {
    socket.on('new_deal_available', callback);
  }
};

export const onBookingUpdate = (callback: (data: any) => void) => {
  if (socket) {
    socket.on('booking_created', callback);
    socket.on('booking_cancelled', callback);
  }
};

export const onPaymentUpdate = (callback: (data: any) => void) => {
  if (socket) {
    socket.on('payment_success', callback);
    socket.on('payment_failed', callback);
  }
};

export const offSocketEvents = () => {
  if (socket) {
    socket.off('new_deal_available');
    socket.off('booking_created');
    socket.off('booking_cancelled');
    socket.off('payment_success');
    socket.off('payment_failed');
  }
};