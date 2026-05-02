import { isValidElement } from "react";

const EmptyState = ({
  icon: Icon,
  title = "No data found",
  description = "Get started by creating your first entry.",
  actionLabel,
  onAction,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-dashed border-gray-200 ${className}`}
    >
      <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 text-gray-300">
        {Icon &&
          (isValidElement(Icon) ? Icon : <Icon size={40} strokeWidth={1.5} />)}
      </div>

      <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2 uppercase italic">
        {title}
      </h3>

      <p className="text-gray-400 text-sm font-medium max-w-xs mx-auto mb-8 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
