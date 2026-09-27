import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/hooks/useChat";
import { Send, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ChatUser {
  _id: string;
  name: string;
  email?: string;
  image?: string;
  role?: string;
}

interface ChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: { id: string; name: string; image?: string };
  recipient: ChatUser | null;
  recipients?: ChatUser[];
  children?: React.ReactNode;
}

export function ChatModal({ open, onOpenChange, currentUser, recipient, recipients, children }: ChatModalProps) {
  const [selectedRecipient, setSelectedRecipient] = useState<ChatUser | null>(recipient || (recipients?.[0] || null));
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket, messages, loadMessages, sendMessage, markAsRead, onlineUsers } = useChat(currentUser.id, currentUser.name);

  useEffect(() => {
    if (recipient) {
      setSelectedRecipient(recipient);
    } else if (recipients?.length) {
      setSelectedRecipient(recipients[0]);
    }
  }, [recipient, recipients]);

  useEffect(() => {
    if (selectedRecipient) {
      loadMessages(selectedRecipient._id);
    }
  }, [selectedRecipient, loadMessages]);

  useEffect(() => {
    if (selectedRecipient && messages.length > 0) {
      markAsRead(selectedRecipient._id);
    }
  }, [selectedRecipient, messages, markAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !selectedRecipient) return;
    const sent = sendMessage(selectedRecipient._id, input);
    if (sent) {
      setInput("");
    }
  };

  const isOnline = selectedRecipient ? onlineUsers.includes(selectedRecipient._id) : false;
  const isConnected = socket?.connected;

  if (!currentUser?.id) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl h-[600px] p-0 bg-white flex flex-col">
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle className="text-lg font-bold text-black flex items-center justify-between">
            <span>Messages</span>
            {recipients && recipients.length > 1 && (
              <select
                className="text-sm border rounded-md px-2 py-1"
                value={selectedRecipient?._id || ""}
                onChange={(e) => {
                  const user = recipients.find(r => r._id === e.target.value);
                  setSelectedRecipient(user || null);
                }}
              >
                {recipients.map((r) => (
                  <option key={r._id} value={r._id}>{r.name}</option>
                ))}
              </select>
            )}
          </DialogTitle>
        </DialogHeader>

        {children}

        {selectedRecipient ? (
          <>
            <div className="px-4 py-2 border-b flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={selectedRecipient.image} />
                <AvatarFallback>{selectedRecipient.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-black">{selectedRecipient.name}</p>
                <p className="text-xs text-gray-500">
                  {isOnline ? "🟢 Online" : "Offline"} • {selectedRecipient.role}
                </p>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No messages yet. Say hello!</p>
                ) : (
                  messages.map((msg) => {
                    const isOwn = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg._id}
                        className={cn("flex", isOwn ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] rounded-2xl px-4 py-2",
                            isOwn
                              ? "bg-yellow-500 text-black"
                              : "bg-gray-100 text-black"
                          )}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-[10px] opacity-70 text-right mt-1">
                            {format(new Date(msg.createdAt), "h:mm a")}
                            {isOwn && (msg.read ? " ✓✓" : " ✓")}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1"
                disabled={!isConnected}
              />
              <Button 
                onClick={handleSend} 
                className="bg-yellow-500 text-black hover:bg-yellow-400"
                disabled={!isConnected || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a contact to start chatting</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}