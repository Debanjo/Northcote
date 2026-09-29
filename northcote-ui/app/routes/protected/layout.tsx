// northcote-ui/app/routes/protected/layout.tsx
import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router";
import { authClient } from "@/lib/auth-client";
import { AppSidebar } from "@/components/navigation/app-sidebar.js";
import Header from "@/components/navigation/Header.js";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { GlobalChatLauncher } from "@/components/chat/GlobalChatLauncher.js";
import Loader from "@/components/global/Loader";

export default function ProtectedLayout() {
  const { data: session, isPending, refetch } = authClient.useSession();
  const [confirmedInvalid, setConfirmedInvalid] = useState(false);

  // Right after a re-login, the session store can still hold the stale null
  // from the previous logout when this layout mounts, so a null session is
  // only trusted after a fresh network check confirms it.
  const storeInvalid = !isPending && (!session || !session.user || !session.user.id);

  useEffect(() => {
    if (!storeInvalid) {
      setConfirmedInvalid(false);
      return;
    }
    let active = true;
    authClient
      .getSession({ query: { disableCookieCache: true } })
      .then((fresh) => {
        if (!active) return;
        if (fresh?.data?.user?.id) {
          refetch(); // sync the stale store with the real session
        } else {
          setConfirmedInvalid(true);
        }
      })
      .catch(() => {
        if (active) setConfirmedInvalid(true);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeInvalid]);

  if (confirmedInvalid) {
    return <Navigate to="/login" replace />;
  }

  if (isPending || storeInvalid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader label="Checking authentication..." />
      </div>
    );
  }

  // Valid session – render the full layout
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </SidebarInset>
      <GlobalChatLauncher />
    </SidebarProvider>
  );
}