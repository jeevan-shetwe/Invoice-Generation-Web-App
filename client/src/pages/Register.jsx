import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/api";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validations/auth.schema";
import {
  Mail,
  Lock,
  Building2,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authService.register({
        email: data.email,
        password: data.password,
        companyName: data.companyName,
      });
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Registration failed. Try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full pl-11 pr-11 py-3 bg-gray-50 border ${hasError ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-indigo-500"} rounded-xl focus:ring-2 focus:bg-white outline-none transition-all`;

  return (
    <div className="fixed inset-0 flex font-sans">
      {/* Left Panel */}
      <div
        className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, #2d5a4e 0%, #3d6b5a 50%, #4a7a6a 100%)",
        }}
      >
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-500 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-indigo-400 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-30"></div>

        <div className="relative z-10 text-center text-white px-12 max-w-lg">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-xl">
            <span
              style={{ fontSize: "1.75rem", fontWeight: "800", color: "#fff" }}
            >
              I
            </span>
          </div>
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "800",
              color: "#fff",
              marginBottom: "1.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            InvoiceGen
          </h1>
          <p
            style={{ color: "#c7d2fe", fontSize: "1.1rem", lineHeight: "1.7" }}
          >
            Join thousands of freelancers and agencies who trust InvoiceGen to
            run their billing.
          </p>

          {/* Feature list */}
          <div className="mt-10 space-y-4 text-left">
            {[
              "Auto-generate monthly recurring invoices",
              "Send PDF invoices directly to clients",
              "Full audit trail on every status change",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-400/30 border border-indigo-400/50 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-3 h-3 text-indigo-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span style={{ color: "#e0e7ff", fontSize: "0.95rem" }}>
                  {feat}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="text-left mb-8">
            <h2
              style={{
                color: "#111827",
                fontSize: "2rem",
                fontWeight: "800",
                marginBottom: "8px",
                lineHeight: "1.2",
              }}
            >
              Create your account
            </h2>
            <p style={{ color: "#6b7280", fontSize: "1rem" }}>
              Start managing invoices in minutes. Free to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Company Name */}
            <div>
              <label
                style={{
                  color: "#374151",
                  fontWeight: "600",
                  fontSize: "0.875rem",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Company Name{" "}
                <span style={{ color: "#9ca3af", fontWeight: "400" }}>
                  (optional)
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Building2 size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  {...register("companyName")}
                  className={inputClass(false)}
                  placeholder="Acme Corp"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                style={{
                  color: "#374151",
                  fontWeight: "600",
                  fontSize: "0.875rem",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
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
                  className={inputClass(!!errors.email)}
                  placeholder="you@company.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-2 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                style={{
                  color: "#374151",
                  fontWeight: "600",
                  fontSize: "0.875rem",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  autoComplete="new-password"
                  className={inputClass(!!errors.password)}
                  placeholder="Min. 6 characters"
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

            {/* Confirm Password */}
            <div>
              <label
                style={{
                  color: "#374151",
                  fontWeight: "600",
                  fontSize: "0.875rem",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  autoComplete="new-password"
                  className={inputClass(!!errors.confirmPassword)}
                  placeholder="Repeat your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-2 font-medium">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-indigo-700 hover:shadow-lg focus:ring-4 focus:ring-indigo-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                marginTop: "8px",
                background: "linear-gradient(135deg, #5b8a6f, #7a9e7d)",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Creating
                  Account...
                </>
              ) : (
                <>
                  <ArrowRight size={20} /> Create Account
                </>
              )}
            </button>
          </form>

          <p
            className="mt-8 text-center font-medium"
            style={{ color: "#6b7280" }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold transition-colors"
              style={{ color: "#5b8a6f" }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
