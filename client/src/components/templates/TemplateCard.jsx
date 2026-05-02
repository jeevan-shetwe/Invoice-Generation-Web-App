import { Edit2, Trash2, LayoutTemplate } from "lucide-react";

const TemplateCard = ({ template, onEdit, onDelete }) => {
  const logoUrl = template.branding.logoUrl
    ? template.branding.logoUrl.startsWith("http")
      ? template.branding.logoUrl
      : `http://localhost:5000${template.branding.logoUrl}`
    : null;

  return (
    <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-200">
      {/* Visual Preview Header */}
      <div
        className="h-36 p-6 flex flex-col justify-between relative overflow-hidden"
        style={{ backgroundColor: template.branding.primaryColor }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />

        <div className="flex justify-between items-start relative z-10">
          <span className="font-bold tracking-widest text-[10px] uppercase text-white/70">
            Invoice Preview
          </span>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              className="h-8 object-contain drop-shadow-sm"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <LayoutTemplate size={16} className="text-white/60" />
            </div>
          )}
        </div>

        <div className="space-y-2 relative z-10">
          <div className="w-2/3 h-2 rounded-full bg-white/30" />
          <div className="w-1/2 h-1.5 rounded-full bg-white/20" />
          <div className="w-1/3 h-1.5 rounded-full bg-white/15" />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <h3 className="font-black text-gray-900 text-lg tracking-tight mb-3 group-hover:text-emerald-700 transition-colors">
          {template.name}
        </h3>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-semibold">
            Tax: {template.fields.showTax ? "Visible" : "Hidden"}
          </span>
          <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-lg font-semibold truncate max-w-[150px]">
            {template.fields.notesLabel || "Terms"}
          </span>
          {(template.fields.customFields || []).length > 0 && (
            <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-lg font-semibold">
              {template.fields.customFields.length} custom{" "}
              {template.fields.customFields.length === 1 ? "field" : "fields"}
            </span>
          )}
        </div>

        {/* Actions — always visible, matches ClientTable/ProductTable */}
        <div className="flex items-center gap-2 pt-4 border-t-2 border-gray-100">
          <button
            onClick={() => onEdit(template)}
            className="group/btn flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-emerald-600 hover:text-white bg-emerald-50 hover:bg-emerald-600 rounded-xl transition-all font-semibold text-sm shadow-sm hover:shadow-md"
          >
            <Edit2
              size={15}
              className="group-hover/btn:scale-110 transition-transform"
            />
            Edit Design
          </button>
          <button
            onClick={() => onDelete(template.id)}
            className="group/btn flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-xl transition-all font-semibold text-sm shadow-sm hover:shadow-md"
          >
            <Trash2
              size={15}
              className="group-hover/btn:scale-110 transition-transform"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
