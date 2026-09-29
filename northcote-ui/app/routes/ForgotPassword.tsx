import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });
      if (error) {
        toast.error(error.message || "Failed to send reset link");
        return;
      }
      setIsSubmitted(true);
      toast.success("Reset link sent! Check your email.");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <Link to="/login" className="absolute top-6 left-6 text-gray-500 hover:text-black">
        <ArrowLeft className="h-5 w-5" />
      </Link>
      <Card className="rounded-2xl shadow-xl border border-gray-100 bg-white w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-black">Forgot Password</h1>
            <p className="text-gray-500 text-sm mt-1">
              Enter your email to receive a reset link
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow-500 text-black hover:bg-yellow-400"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
              <p className="text-gray-700">Reset link sent to {email}</p>
              <p className="text-sm text-gray-500">Check your inbox and follow the instructions.</p>
              <Button variant="outline" onClick={() => navigate("/login")} className="mt-4">
                Back to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}