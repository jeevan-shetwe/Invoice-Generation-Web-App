import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { userService } from "../services/api";
import { useAuthStore } from "../store/useAuthStore";
import {
  Building2,
  Upload,
  CheckCircle,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Image as ImageIcon,
  AlertCircle,
  Settings as SettingsIcon,
  Sparkles,
} from "lucide-react";

const settingsSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  currency: z
    .enum(["USD", "EUR", "GBP", "INR", "CAD", "AUD", "JPY", "CNY"])
    .optional(),
});

const Settings = () => {
  const { updateUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(settingsSchema),
  });

  const fetchProfile = useCallback(async () => {
    try {
      const res = await userService.getProfile();
      const userData = res.data;
      console.log("Profile fetched:", userData);
      console.log("Logo URL:", userData.logoUrl);
      setProfile(userData);
      updateUser(userData);
      reset({
        companyName: userData.companyName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        website: userData.website || "",
        currency: userData.currency || "USD",
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [updateUser, reset]);

  useEffect(() => {
    queueMicrotask(() => {
      fetchProfile();
    });
  }, [fetchProfile]);

  const onSubmit = async (data) => {
    setSaving(true);
    setError("");
    try {
      await userService.updateProfile(data);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
      fetchProfile();
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/svg+xml"];
    const maxSize = 2 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Please use PNG, JPG, or SVG");
      return;
    }

    if (file.size > maxSize) {
      setError("File is too large. Maximum size is 2MB");
      return;
    }

    const formData = new FormData();
    formData.append("logo", file);

    setUploading(true);
    setError("");
    try {
      console.log("Uploading file:", file.name);
      const response = await userService.uploadLogo(formData);
      console.log("Upload response:", response);
      console.log("Upload response data:", response.data);

      setSuccess("Logo updated successfully!");
      setTimeout(() => setSuccess(""), 3000);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await fetchProfile();
    } catch (err) {
      console.error("Error uploading logo:", err);
      console.error("Error response:", err.response);
      setError(err.response?.data?.error || "Failed to upload logo");
    } finally {
      setUploading(false);
    }
  };

  const labelStyle =
    "block text-xs font-bold text-gray-600 mb-2 flex items-center gap-2";
  const inputStyle =
    "w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all text-sm text-gray-900 font-medium hover:border-gray-300 placeholder:text-gray-400";
  const errorInputStyle =
    "w-full px-4 py-3 bg-red-50 border-2 border-red-300 rounded-xl outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all text-sm text-gray-900 font-medium";

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-emerald-50">
        <div className="text-center">
          <Loader2
            className="animate-spin text-emerald-700 mx-auto mb-4"
            size={40}
          />
          <p className="text-sm font-semibold text-gray-600">
            Loading settings...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header — matches Clients/Products */}
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-lg shadow-emerald-200">
            <SettingsIcon size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Company Branding
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-1 w-1 rounded-full bg-emerald-600"></div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Configure your identity and invoice appearance
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Logo Section */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-7 text-center">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-5">
                Brand Logo
              </h3>

              <div className="relative group mx-auto w-36 h-36">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-emerald-50 to-amber-50 border-2 border-dashed border-emerald-200 flex items-center justify-center overflow-hidden">
                  {profile?.logoUrl ? (
                    <img
                      src={`http://localhost:5000${profile.logoUrl}?t=${Date.now()}`}
                      alt="Logo"
                      className="w-full h-full object-contain p-2"
                      onError={() =>
                        console.error("Image failed to load:", profile.logoUrl)
                      }
                    />
                  ) : (
                    <ImageIcon size={36} className="text-emerald-300" />
                  )}

                  <div className="absolute inset-0 bg-emerald-700/90 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white cursor-pointer rounded-2xl">
                    <Upload size={24} />
                    <span className="text-xs font-black uppercase mt-2">
                      Change Logo
                    </span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleLogoUpload}
                    accept=".png,.jpg,.jpeg,.svg"
                    disabled={uploading}
                  />
                </div>

                {uploading && (
                  <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center">
                    <Loader2
                      size={24}
                      className="animate-spin text-emerald-600"
                    />
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-400 font-medium mt-5 leading-relaxed">
                PNG, JPG, or SVG · Max 2MB
              </p>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl p-7 text-white shadow-xl shadow-emerald-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
              <div className="relative">
                <div className="p-3 bg-white/20 rounded-2xl w-fit mb-4 backdrop-blur-sm">
                  <Sparkles size={22} className="text-white" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-wide mb-3">
                  Quick Tips
                </h3>
                <div className="space-y-3">
                  {[
                    "Your logo appears on all generated invoices",
                    "Currency setting applies to all new invoices",
                    "Keep contact info current for client trust",
                  ].map((tip, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/60 mt-1.5 shrink-0"></div>
                      <p className="text-emerald-100 text-sm font-medium leading-relaxed">
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
              {/* Form Header */}
              <div className="px-8 py-6 bg-gradient-to-r from-emerald-50 to-amber-50 border-b-2 border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white rounded-xl shadow-sm">
                    <Building2 size={22} className="text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-gray-900 tracking-tight">
                      Business Details
                    </h2>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      Update your company information
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-8">
                {/* Success Banner */}
                {success && (
                  <div className="flex items-center gap-2.5 p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-semibold border-2 border-emerald-100 mb-6">
                    <CheckCircle size={18} /> {success}
                  </div>
                )}

                {/* Error Banner */}
                {error && (
                  <div className="flex items-center gap-2.5 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-semibold border-2 border-red-100 mb-6">
                    <AlertCircle size={18} /> {error}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Company Name */}
                  <div>
                    <label className={labelStyle}>
                      <Building2 size={16} className="text-emerald-600" />
                      Company Name
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      {...register("companyName")}
                      className={
                        errors.companyName ? errorInputStyle : inputStyle
                      }
                      placeholder="e.g. Acme Studio"
                    />
                    {errors.companyName && (
                      <div className="flex items-center gap-2 mt-2 text-red-600 text-xs font-semibold">
                        <AlertCircle size={14} /> {errors.companyName.message}
                      </div>
                    )}
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelStyle}>
                        <Mail size={16} className="text-emerald-600" />
                        Email Address
                      </label>
                      <input
                        {...register("email")}
                        className={errors.email ? errorInputStyle : inputStyle}
                        placeholder="billing@acme.com"
                      />
                      {errors.email && (
                        <div className="flex items-center gap-2 mt-2 text-red-600 text-xs font-semibold">
                          <AlertCircle size={14} /> {errors.email.message}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className={labelStyle}>
                        <Phone size={16} className="text-emerald-600" />
                        Phone Number
                      </label>
                      <input
                        {...register("phone")}
                        className={inputStyle}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  {/* Website */}
                  <div>
                    <label className={labelStyle}>
                      <Globe size={16} className="text-emerald-600" />
                      Website
                    </label>
                    <input
                      {...register("website")}
                      className={errors.website ? errorInputStyle : inputStyle}
                      placeholder="https://acme.com"
                    />
                    {errors.website && (
                      <div className="flex items-center gap-2 mt-2 text-red-600 text-xs font-semibold">
                        <AlertCircle size={14} /> {errors.website.message}
                      </div>
                    )}
                  </div>

                  {/* Currency */}
                  <div>
                    <label className={labelStyle}>
                      <Globe size={16} className="text-emerald-600" />
                      Default Currency
                    </label>
                    <select {...register("currency")} className={inputStyle}>
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                      <option value="GBP">GBP (£) - British Pound</option>
                      <option value="INR">INR (₹) - Indian Rupee</option>
                      <option value="CAD">CAD (C$) - Canadian Dollar</option>
                      <option value="AUD">AUD (A$) - Australian Dollar</option>
                      <option value="JPY">JPY (¥) - Japanese Yen</option>
                      <option value="CNY">CNY (¥) - Chinese Yuan</option>
                    </select>
                  </div>

                  {/* Address */}
                  <div>
                    <label className={labelStyle}>
                      <MapPin size={16} className="text-emerald-600" />
                      Business Address
                    </label>
                    <textarea
                      {...register("address")}
                      rows="3"
                      className={`${inputStyle} resize-none`}
                      placeholder="Street, City, State, ZIP..."
                    />
                    <p className="text-xs text-gray-400 mt-1.5 font-medium">
                      This address will appear on your invoices
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-8 mt-8 border-t-2 border-gray-100">
                  <button
                    type="submit"
                    disabled={saving}
                    className="group flex items-center justify-center gap-2.5 px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 transition-all hover:shadow-xl hover:shadow-emerald-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle
                          size={18}
                          className="group-hover:scale-110 transition-transform"
                        />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
