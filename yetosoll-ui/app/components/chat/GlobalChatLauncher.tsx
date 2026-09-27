import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { ChatModal } from "./ChatModal.js";
import { useQuery } from "@tanstack/react-query";
import { getUsers, getUnreadMessageCount } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { getSocket } from "@/lib/socket";

interface ChatUser {
  _id: string;
  name: string;
  email?: string;
  image?: string;
  role?: string;
}

export function GlobalChatLauncher() {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const { data: session, isPending } = authClient.useSession();

  const currentUser = session?.user;
  const userRole = currentUser?.role;
  const canChat =
    !!currentUser &&
    ["admin", "project_manager", "supervisor", "superadmin"].includes(userRole || "");

  //  Join superadmin room if user is superadmin
  useEffect(() => {
    if (!session?.user) return;
    const socket = getSocket();
    if (!socket.connected) socket.connect();
    if (session.user.role === "superadmin") {
      socket.emit("join_superadmin_room");
    }
  }, [session]);

  // Hooks must run on every render — gate execution with `enabled`, not early returns.
  const { data: usersData } = useQuery({
    queryKey: ["all-users-chat"],
    queryFn: () => getUsers({ role: "all", limit: 100 }),
    enabled: open && canChat,
  });

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unread-messages", currentUser?.id],
    queryFn: () => getUnreadMessageCount(currentUser!.id),
    enabled: canChat,
    refetchInterval: 30000,
  });

  if (isPending || !canChat || !currentUser) return null;

  const users = (usersData?.res || []) as ChatUser[];

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50",
          "bg-yellow-500 text-black hover:bg-yellow-400"
        )}
      >
        <MessageCircle className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      <ChatModal
        open={open}
        onOpenChange={setOpen}
        currentUser={{ id: currentUser.id, name: currentUser.name!, image: currentUser.image ?? undefined }}
        recipient={selectedUser}
        recipients={selectedUser ? [selectedUser] : []}
      >
        {!selectedUser && (
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-medium text-gray-700 mb-2">Select a contact</p>
            <select
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white"
              value=""
              onChange={(e) => {
                const user = users.find(u => u._id === e.target.value);
                setSelectedUser(user || null);
              }}
            >
              <option value="">Choose a user...</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.role?.replace("_", " ")})
                </option>
              ))}
            </select>
          </div>
        )}
      </ChatModal>
    </>
  );
}