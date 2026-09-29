// northcote-ui/app/routes/Register.tsx
import { useState, useEffect } from "react";
import { useNavigate, Navigate, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  HardHat,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { registerSchema, type RegisterFormValues } from "@/components/auth/register.schema";

export function meta() {
  return [
    { title: "Register | Yetosol" },
    { name: "description", content: "Create a new Yetosol account" },
  ];
}

export default function Register() {
  const [globalError, setGlobalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  // Silent session check – no loading indicator
  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session?.data?.user?.id) {
        setRedirectToDashboard(true);
      }
    });
  }, []);

  if (redirectToDashboard) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: RegisterFormValues) => {
    setGlobalError("");
    setIsLoading(true);

    try {
      await authClient.signUp.email(
        {
          name: data.name,
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: () => {
            toast.success("Account created successfully! Please sign in.");
            navigate("/login");
          },
          onError: (ctx: { error: { message: string } }) => {
            setGlobalError(ctx.error.message);
          },
        }
      );
    } catch (err) {
      setGlobalError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center bg-gradient-to-br from-sky-50/50 via-white to-yellow-50/50 overflow-hidden font-sans antialiased">
      {/* ── Soft background blobs ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-sky-100/30 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-yellow-100/30 blur-[120px]" />
        <HardHat className="absolute top-1/4 right-5% w-48 h-48 text-sky-600/10 -rotate-12" />
        <HardHat className="absolute bottom-1/4 left-5% w-32 h-32 text-yellow-600/10 rotate-45" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* ── Left: Branding & Value Proposition ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <Link to="/" className="inline-block mb-6">
              <img
                src="https://res.cloudinary.com/ami1jzfj/image/upload/v1784851531/logo__z7qp82.png"
                alt="Yetosol Associates"
                className="h-28 sm:h-30 w-auto"
              />
            </Link>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 uppercase tracking-tight leading-[1.05]">
              Create <span className="text-yellow-600">Your Account</span>
            </h1>
            <p className="text-gray-500 mt-4 text-lg max-w-md mx-auto lg:mx-0">
              Join Yetosol and gain access to project tracking, real-time collaboration, and dedicated support for your construction needs.
            </p>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              {[
                { icon: ShieldCheck, text: "ISO Certified" },
                { icon: Sparkles, text: "Secure Portal" },
                { icon: HardHat, text: "Trusted by 500+" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-gray-600 font-medium bg-white/60 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 shadow-sm"
                >
                  <item.icon className="h-4 w-4 text-yellow-600" />
                  {item.text}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Registration Form Card ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center"
          >
            <Card className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl relative overflow-hidden">
              {/* Decorative sparkle icon */}
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-sky-500 flex items-center justify-center shadow-lg transform rotate-12">
                <Sparkles className="h-6 w-6 text-white" />
              </div>

              <CardContent className="p-8 sm:p-10">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-black text-gray-900">Sign Up</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Create your account to get started
                  </p>
                </div>

                {globalError && (
                  <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center gap-3 border border-red-100">
                    <span className="font-medium">{globalError}</span>
                  </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                  {/* Full Name */}
                  <div>
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1 mb-1.5 block">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                        {...register("name")}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-xs text-red-500 ml-1 mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1 mb-1.5 block">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        placeholder="name@yetosol.com"
                        className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                        {...register("email")}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-500 ml-1 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1 mb-1.5 block">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3 rounded-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                        {...register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-500 ml-1 mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1 mb-1.5 block">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3 rounded-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                        {...register("confirmPassword")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-500 ml-1 mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  {/* Submit button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-yellow-500 text-black hover:bg-yellow-400 rounded-full py-6 font-bold text-base shadow-md transition-all active:scale-[0.98] group"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        Create Account
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </Button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                  Already have an account?{" "}
                  <Link to="/login" className="text-yellow-600 font-semibold hover:underline">
                    Sign in
                  </Link>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ── Bottom Tech‑Forward Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400 font-medium"
        >
          <span className="flex items-center gap-1.5 hover:text-sky-600 transition-colors cursor-default">
            <span className="text-lg">&lt;/&gt;</span> Secure Connection
          </span>
          <span className="flex items-center gap-1.5 hover:text-sky-600 transition-colors cursor-default">
            <ShieldCheck className="h-3.5 w-3.5" /> SSL Encrypted
          </span>
          <span className="flex items-center gap-1.5 hover:text-sky-600 transition-colors cursor-default">
            <Sparkles className="h-3.5 w-3.5" /> Trusted Platform
          </span>
        </motion.div>
      </div>
    </div>
  );
}