import {
  CheckCircle,
  Tag,
  Percent,
  Loader2,
  DollarSign,
  Package,
  AlertCircle,
  Sparkles,
} from "lucide-react";

const ProductForm = ({
  register,
  handleSubmit,
  onSubmit,
  errors,
  saving,
  onCancel,
  editingId,
  currencySymbol,
  currencyCode,
}) => {
  const labelStyle =
    "block text-xs font-bold text-gray-600 mb-2 flex items-center gap-2";
  const inputStyle =
    "w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all text-sm text-gray-900 font-medium hover:border-gray-300 placeholder:text-gray-400";
  const errorInputStyle =
    "w-full px-4 py-3 bg-red-50 border-2 border-red-300 rounded-xl outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all text-sm text-gray-900 font-medium";

  return (
    <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 bg-gradient-to-r from-emerald-50 to-amber-50 border-b-2 border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white rounded-xl shadow-sm">
            <Package size={22} className="text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900 tracking-tight">
              {editingId ? "Edit Product Details" : "New Product / Service"}
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {editingId
                ? "Update product information"
                : "Add a new item to your inventory"}
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-8">
        <div className="space-y-6">
          {/* Product Name and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <label className={labelStyle}>
                <Package size={16} className="text-emerald-600" />
                Product / Service Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                {...register("name")}
                className={errors.name ? errorInputStyle : inputStyle}
                placeholder="e.g. Premium Web Design Package, Consulting Hour"
              />
              {errors.name && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-xs font-semibold">
                  <AlertCircle size={14} />
                  {errors.name.message}
                </div>
              )}
            </div>

            <div>
              <label className={labelStyle}>
                <Tag size={16} className="text-emerald-600" />
                Category
              </label>
              <input
                {...register("category")}
                className={inputStyle}
                placeholder="e.g. Services"
              />
              <p className="text-xs text-gray-400 mt-1.5 font-medium">
                Optional
              </p>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>
                <DollarSign size={16} className="text-emerald-600" />
                Unit Price ({currencyCode})
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm pointer-events-none">
                  {currencySymbol}
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  {...register("unitPrice")}
                  className={`${errors.unitPrice ? errorInputStyle : inputStyle} pl-10`}
                  placeholder="0.00"
                />
              </div>
              {errors.unitPrice && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-xs font-semibold">
                  <AlertCircle size={14} />
                  {errors.unitPrice.message}
                </div>
              )}
              <p className="text-xs text-gray-400 mt-1.5 font-medium">
                Base price per unit
              </p>
            </div>

            <div>
              <label className={labelStyle}>
                <Percent size={16} className="text-emerald-600" />
                Tax Rate (%)
              </label>
              <div className="relative">
                <Percent
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="number"
                  step="0.01"
                  {...register("taxRate")}
                  className={`${inputStyle} pl-11`}
                  placeholder="0.0"
                />
              </div>
              {errors.taxRate && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-xs font-semibold">
                  <AlertCircle size={14} />
                  {errors.taxRate.message}
                </div>
              )}
              <p className="text-xs text-gray-400 mt-1.5 font-medium">
                Applied automatically on invoices
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-8 mt-8 border-t-2 border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-gray-600 font-bold text-sm hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
          >
            Cancel
          </button>
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
                {editingId ? "Update Product" : "Save Product"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
