import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { authService } from "../services/api";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validations/auth.schema";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      login(
        response.data.user,
        response.data.accessToken,
        response.data.refreshToken,
      );
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex font-sans">
      {/* Left Side - Brand / Image */}
      <div
        className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, #2d5a4e 0%, #3d6b5a 50%, #4a7a6a 100%)",
        }}
      >
        {/* Decorative Circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-500 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-400 rounded-full filter blur-3xl opacity-30"></div>

        <div className="relative z-10 text-center text-white px-12 max-w-lg">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-xl">
            <span className="text-3xl font-bold text-white">I</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">
            InvoiceGen
          </h1>
          <p className="text-lg text-indigo-200 leading-relaxed">
            Professional invoicing for modern businesses. Manage clients, track
            payments, and get paid faster with our automated platform.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
        <div className="w-full max-w-md">
          <div className="text-left mb-10">
            <h2
              style={{
                color: "#111827",
                fontSize: "2rem",
                fontWeight: "800",
                marginBottom: "8px",
                lineHeight: "1.2",
              }}
            >
              Welcome Back
            </h2>
            <p
              style={{ color: "#6b7280", fontSize: "1rem", fontWeight: "400" }}
            >
              Please sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  {...register("email")}
                  autoComplete="username"
                  className={`w-full pl-11 pr-4 py-3 bg-gray-50 border ${errors.email ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-indigo-500"} rounded-xl focus:ring-2 focus:bg-white outline-none transition-all`}
                  placeholder="you@company.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-2 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  style={{
                    color: "#5b8a6f",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                  className="hover:text-indigo-800 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  autoComplete="current-password"
                  className={`w-full pl-11 pr-11 py-3 bg-gray-50 border ${errors.password ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-indigo-500"} rounded-xl focus:ring-2 focus:bg-white outline-none transition-all`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-2 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-indigo-700 hover:shadow-lg focus:ring-4 focus:ring-indigo-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #5b8a6f, #7a9e7d)",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Signing In...
                </>
              ) : (
                <>
                  <ArrowRight size={20} /> Sign In
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600 font-medium">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors"
              style={{ color: "#5b8a6f" }}
            >
              Create a free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
