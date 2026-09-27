// yetosoll-ui/app/lib/socket.ts
import { io, type Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

let socketInstance: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"],
    });
  }
  return socketInstance;
};

export const connectSocket = (userId: string): Socket => {
  const sock = getSocket();
  if (!sock.connected) {
    sock.connect();
  }
  sock.emit("user_online", userId);
  return sock;
};

export const disconnectSocket = (): void => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};