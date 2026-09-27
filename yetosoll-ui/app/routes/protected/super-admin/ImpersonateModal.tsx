import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";
import { UserCheck, Loader2 } from "lucide-react";

interface ImpersonateModalProps {
  userId: string;
  userName: string;
}

export default function ImpersonateModal({ userId, userName }: ImpersonateModalProps) {
  const [open, setOpen] = useState(false);

  const impersonateMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/super-admin/impersonate/${userId}`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to impersonate");
      return res.json();
    },
    onSuccess: (data) => {
      // Set the session token as a cookie and redirect
      document.cookie = `better-auth.session_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
      toast.success(`Logged in as ${userName}`);
      window.location.href = "/dashboard";
    },
    onError: () => toast.error("Failed to impersonate user"),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <UserCheck className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Impersonate {userName}</DialogTitle>
        </DialogHeader>
        <p className="text-gray-600">
          You will be logged in as this user. Your superadmin session will be preserved.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => impersonateMutation.mutate()}
            disabled={impersonateMutation.isPending}
            className="bg-yellow-500 text-black hover:bg-yellow-400"
          >
            {impersonateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Confirm Impersonation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}