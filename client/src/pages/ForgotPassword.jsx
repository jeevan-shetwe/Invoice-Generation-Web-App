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
      toast.success('Magic link sent!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send magic link');
    }
  };

  const labelStyle = "block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2";
  const inputStyle = "w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-sm text-gray-900";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfdfe] p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white mb-4 shadow-lg shadow-indigo-100">
            <Mail size={24} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Forgot Password?</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Magic link to reset it</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          {!submitted ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className={labelStyle}>Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input {...register('email')} type="email" className={inputStyle} placeholder="name@company.com" />
                </div>
                {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.email.message}</p>}
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5 disabled:opacity-50">
                {isSubmitting ? <Loader2 className="mx-auto animate-spin" size={20} /> : 'Send Magic Link'}
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-500 mb-6">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
              <p className="text-gray-500 text-sm mb-8">Link sent to <strong className="text-gray-900">{submittedEmail}</strong></p>
              <button onClick={() => setSubmitted(false)} className="text-indigo-600 font-bold text-xs uppercase tracking-widest hover:text-indigo-700">Try another email</button>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-50 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold text-[10px] uppercase tracking-widest transition-colors">
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
