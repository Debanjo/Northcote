import { useEffect, useState, useCallback, useRef } from "react";
import { getSocket, connectSocket } from "@/lib/socket";
import type { Socket } from "socket.io-client";
import { API_URL } from "@/lib/api";

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export function useChat(currentUserId: string, currentUserName: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const initialized = useRef(false);
  // The other party in the currently-open thread; set by loadMessages.
  const activeOtherUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!currentUserId || initialized.current) return;

    const sock = connectSocket(currentUserId);
    setSocket(sock);
    initialized.current = true;

    const handleUsersOnline = (users: string[]) => setOnlineUsers(users);
    // Only append messages that belong to the open conversation, so a message
    // from a different sender doesn't leak into the thread on screen.
    const handleNewMessage = (msg: Message) => {
      if (msg.senderId !== activeOtherUserId.current) return;
      setMessages((prev) => [...prev, msg]);
    };
    const handleMessageSent = (msg: Message) => {
      if (msg.receiverId !== activeOtherUserId.current) return;
      setMessages((prev) => [...prev, msg]);
    };

    sock.on("users_online", handleUsersOnline);
    sock.on("new_message", handleNewMessage);
    sock.on("message_sent", handleMessageSent);

    return () => {
      sock.off("users_online", handleUsersOnline);
      sock.off("new_message", handleNewMessage);
      sock.off("message_sent", handleMessageSent);
    };
  }, [currentUserId]);

  const loadMessages = useCallback(async (otherUserId: string) => {
    activeOtherUserId.current = otherUserId;
    const res = await fetch(`${API_URL}/chat/messages/${currentUserId}/${otherUserId}`, {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setMessages(data);
    }
  }, [currentUserId]);

  const sendMessage = useCallback((receiverId: string, content: string): boolean => {
    const sock = getSocket();
    if (!sock) {
      console.error("Socket not initialized");
      return false;
    }
    if (!sock.connected) {
      console.warn("Socket not connected. Attempting to connect...");
      sock.connect();
      setTimeout(() => {
        if (sock.connected) {
          sock.emit("send_message", { 
            senderId: currentUserId, 
            receiverId, 
            content,
            senderName: currentUserName 
          });
        }
      }, 500);
      return false;
    }
    sock.emit("send_message", { 
      senderId: currentUserId, 
      receiverId, 
      content,
      senderName: currentUserName 
    });
    return true;
  }, [currentUserId, currentUserName]);

  const markAsRead = useCallback((senderId: string) => {
    const sock = getSocket();
    if (sock?.connected) {
      sock.emit("mark_read", { senderId, receiverId: currentUserId });
    }
  }, [currentUserId]);

  return {
    socket,
    messages,
    onlineUsers,
    loadMessages,
    sendMessage,
    markAsRead,
  };
}