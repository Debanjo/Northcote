import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function MaintenancePage() {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const isAdmin = session?.user?.role === "admin";

  const handleGoBack = () => {
    if (isAdmin) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="text-center max-w-md">
        <div className="bg-yellow-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-10 w-10 text-yellow-600" />
        </div>
        <h1 className="text-3xl font-black text-black mb-3">Under Maintenance</h1>
        <p className="text-gray-600 mb-6">
          We're currently performing scheduled maintenance to improve your experience.
          Please check back shortly.
        </p>
        {isAdmin && (
          <p className="text-sm text-light-blue-600 mb-4">
            You're logged in as an admin. You can still access the dashboard.
          </p>
        )}
        <Button onClick={handleGoBack} className="bg-yellow-500 text-black hover:bg-yellow-400">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {isAdmin ? "Go to Dashboard" : "Back to Login"}
        </Button>
      </div>
    </div>
  );
}