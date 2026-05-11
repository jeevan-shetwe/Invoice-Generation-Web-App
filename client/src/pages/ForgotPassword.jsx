import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '../validations/auth.schema';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data) => {
    try {
      await authService.forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setSubmitted(true);
      toast.success('Reset link sent!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send reset link');
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
              Forgot Password?
            </h2>
            <p
              style={{ color: "#6b7280", fontSize: "1rem", fontWeight: "400" }}
            >
              Enter your email to receive a reset link
            </p>
          </div>

          {!submitted ? (
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
                    autoComplete="email"
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-indigo-700 hover:shadow-lg focus:ring-4 focus:ring-indigo-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #5b8a6f, #7a9e7d)",
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Mail size={20} /> Send Reset Link
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
                style={{
                  background: "rgba(91, 138, 111, 0.1)",
                  color: "#5b8a6f"
                }}>
                <CheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Check your email</h2>
              <p className="text-gray-600 text-sm mb-8">We've sent a password reset link to <strong className="text-gray-900">{submittedEmail}</strong></p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-sm font-semibold transition-colors"
                style={{
                  color: "#5b8a6f"
                }}
              >
                Try another email
              </button>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 font-semibold text-sm transition-colors"
              style={{
                color: "#5b8a6f"
              }}
            >
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;