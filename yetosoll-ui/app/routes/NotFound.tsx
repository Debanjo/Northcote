import { useLocation, Link } from "react-router";
import { Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const location = useLocation();

  // Silently ignore Chrome DevTools and other well‑known requests
  if (
    location.pathname.includes(".well-known") ||
    location.pathname.includes("apple-touch-icon") ||
    location.pathname.includes("favicon")
  ) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-md">
        <div className="bg-yellow-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-10 w-10 text-yellow-600" />
        </div>
        <h1 className="text-5xl font-black text-black mb-3">404</h1>
        <p className="text-xl text-gray-600 mb-2">Page not found</p>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="bg-yellow-500 text-black hover:bg-yellow-400 font-bold">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}