// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { clientSchema } from "../../validations/client.schema";
// import {
//   CheckCircle,
//   Loader2,
//   Users,
//   Mail,
//   Phone,
//   MapPin,
//   AlertCircle,
//   Building2,
// } from "lucide-react";

// const ClientForm = ({ initialData, onSubmit, onCancel, saving }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(clientSchema),
//     defaultValues: {
//       name: initialData?.name || "",
//       email: initialData?.email || "",
//       phone: initialData?.phone || "",
//       address: initialData?.address || "",
//     },
//   });

//   const labelStyle =
//     "block text-xs font-bold text-gray-600 mb-2 flex items-center gap-2";
//   const inputStyle =
//     "w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all text-sm text-gray-900 font-medium hover:border-gray-300 placeholder:text-gray-400";
//   const errorInputStyle =
//     "w-full px-4 py-3 bg-red-50 border-2 border-red-300 rounded-xl outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all text-sm text-gray-900 font-medium";

//   return (
//     <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
//       {/* Header — matches ProductForm header */}
//       <div className="px-8 py-6 bg-gradient-to-r from-emerald-50 to-amber-50 border-b-2 border-gray-100">
//         <div className="flex items-center gap-3">
//           <div className="p-2.5 bg-white rounded-xl shadow-sm">
//             <Building2 size={22} className="text-emerald-600" />
//           </div>
//           <div>
//             <h2 className="text-lg font-black text-gray-900 tracking-tight">
//               {initialData?.id ? "Edit Client Details" : "New Client"}
//             </h2>
//             <p className="text-xs text-gray-500 font-medium mt-0.5">
//               {initialData?.id
//                 ? "Update client information"
//                 : "Add a new client to your database"}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Form Content */}
//       <form onSubmit={handleSubmit(onSubmit)} className="p-8">
//         <div className="space-y-6">
//           {/* Company / Client Name — full width */}
//           <div>
//             <label className={labelStyle}>
//               <Building2 size={16} className="text-emerald-600" />
//               Company / Client Name
//               <span className="text-red-500 ml-1">*</span>
//             </label>
//             <input
//               {...register("name")}
//               className={errors.name ? errorInputStyle : inputStyle}
//               placeholder="e.g. Acme Corporation, John Doe"
//             />
//             {errors.name && (
//               <div className="flex items-center gap-2 mt-2 text-red-600 text-xs font-semibold">
//                 <AlertCircle size={14} />
//                 {errors.name.message}
//               </div>
//             )}
//           </div>

//           {/* Email and Phone row */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className={labelStyle}>
//                 <Mail size={16} className="text-emerald-600" />
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 {...register("email")}
//                 className={errors.email ? errorInputStyle : inputStyle}
//                 placeholder="client@example.com"
//               />
//               {errors.email && (
//                 <div className="flex items-center gap-2 mt-2 text-red-600 text-xs font-semibold">
//                   <AlertCircle size={14} />
//                   {errors.email.message}
//                 </div>
//               )}
//             </div>

//             <div>
//               <label className={labelStyle}>
//                 <Phone size={16} className="text-emerald-600" />
//                 Phone Number
//               </label>
//               <input
//                 {...register("phone")}
//                 className={inputStyle}
//                 placeholder="+1 (555) 000-0000"
//               />
//             </div>
//           </div>

//           {/* Billing Address — full width */}
//           <div>
//             <label className={labelStyle}>
//               <MapPin size={16} className="text-emerald-600" />
//               Billing Address
//             </label>
//             <textarea
//               {...register("address")}
//               rows="4"
//               className={`${inputStyle} resize-none`}
//               placeholder="Street Address, City, State, ZIP Code..."
//             />
//             <p className="text-xs text-gray-400 mt-1.5 font-medium">
//               This address will appear on invoices
//             </p>
//           </div>
//         </div>

//         {/* Action Buttons — matches ProductForm buttons */}
//         <div className="flex flex-col sm:flex-row justify-end gap-3 pt-8 mt-8 border-t-2 border-gray-100">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-6 py-3 text-gray-600 font-bold text-sm hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={saving}
//             className="group flex items-center justify-center gap-2.5 px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 transition-all hover:shadow-xl hover:shadow-emerald-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
//           >
//             {saving ? (
//               <>
//                 <Loader2 size={18} className="animate-spin" />
//                 Saving...
//               </>
//             ) : (
//               <>
//                 <CheckCircle
//                   size={18}
//                   className="group-hover:scale-110 transition-transform"
//                 />
//                 {initialData?.id ? "Update Client" : "Create Client"}
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ClientForm;




import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema } from "../../validations/client.schema";
import {
  CheckCircle,
  Loader2,
  Users,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  Building2,
} from "lucide-react";

const ClientForm = ({ initialData, onSubmit, onCancel, saving }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(clientSchema),
    mode: 'onBlur', // Validate when user leaves field
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      address: initialData?.address || "",
    },
  });

  const labelStyle =
    "block text-xs font-bold text-gray-600 mb-2 flex items-center gap-2";
  const inputStyle =
    "w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all text-sm text-gray-900 font-medium hover:border-gray-300 placeholder:text-gray-400";
  const errorInputStyle =
    "w-full px-4 py-3 bg-red-50 border-2 border-red-300 rounded-xl outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all text-sm text-gray-900 font-medium";

  return (
    <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
      {/* Header — matches ProductForm header */}
      <div className="px-8 py-6 bg-gradient-to-r from-emerald-50 to-amber-50 border-b-2 border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white rounded-xl shadow-sm">
            <Building2 size={22} className="text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900 tracking-tight">
              {initialData?.id ? "Edit Client Details" : "New Client"}
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {initialData?.id
                ? "Update client information"
                : "Add a new client to your database"}
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-8">
        <div className="space-y-6">
          {/* Company / Client Name — full width */}
          <div>
            <label className={labelStyle}>
              <Building2 size={16} className="text-emerald-600" />
              Company / Client Name
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              {...register("name")}
              className={errors.name ? errorInputStyle : inputStyle}
              placeholder="e.g. Acme Corporation, John Doe"
            />
            {errors.name && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-xs font-semibold">
                <AlertCircle size={14} />
                {errors.name.message}
              </div>
            )}
          </div>

          {/* Email and Phone row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>
                <Mail size={16} className="text-emerald-600" />
                Email Address
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="email"
                {...register("email")}
                className={errors.email ? errorInputStyle : inputStyle}
                placeholder="client@example.com"
              />
              {errors.email && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-xs font-semibold">
                  <AlertCircle size={14} />
                  {errors.email.message}
                </div>
              )}
            </div>

            <div>
              <label className={labelStyle}>
                <Phone size={16} className="text-emerald-600" />
                Phone Number
                <span className="text-gray-400 text-xs font-normal">(Optional)</span>
              </label>
              <input
                {...register("phone")}
                className={errors.phone ? errorInputStyle : inputStyle}
                placeholder="+1 (555) 000-0000"
              />
              {errors.phone && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-xs font-semibold">
                  <AlertCircle size={14} />
                  {errors.phone.message}
                </div>
              )}
              {!errors.phone && (
                <p className="text-xs text-gray-400 mt-1.5 font-medium">
                  Formats: 1234567890, (123) 456-7890, +1-234-567-8900
                </p>
              )}
            </div>
          </div>

          {/* Billing Address — full width */}
          <div>
            <label className={labelStyle}>
              <MapPin size={16} className="text-emerald-600" />
              Billing Address
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              {...register("address")}
              rows="4"
              className={errors.address ? `${errorInputStyle} resize-none` : `${inputStyle} resize-none`}
              placeholder="Street Address, City, State, ZIP Code..."
            />
            {errors.address && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-xs font-semibold">
                <AlertCircle size={14} />
                {errors.address.message}
              </div>
            )}
            {!errors.address && (
              <p className="text-xs text-gray-400 mt-1.5 font-medium">
                This address will appear on invoices
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons — matches ProductForm buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-8 mt-8 border-t-2 border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting || saving}
            className="px-6 py-3 text-gray-600 font-bold text-sm hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || isSubmitting}
            className="group flex items-center justify-center gap-2.5 px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 transition-all hover:shadow-xl hover:shadow-emerald-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {saving || isSubmitting ? (
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
                {initialData?.id ? "Update Client" : "Create Client"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
