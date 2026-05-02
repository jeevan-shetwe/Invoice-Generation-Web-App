import { useState } from "react";
import { useCrud } from "../hooks/useCrud";
import { templateService } from "../services/api";
import {
  Plus,
  LayoutTemplate,
  ArrowLeft,
  Loader2,
  Sparkles,
  Grid3x3,
} from "lucide-react";
import TemplateCard from "../components/templates/TemplateCard";
import TemplateForm from "../components/templates/TemplateForm";
import EmptyState from "../components/ui/EmptyState";

const Templates = () => {
  const {
    data: templates,
    loading,
    error,
    setError,
    createItem,
    updateItem,
    deleteItem,
  } = useCrud(templateService);

  const [formData, setFormData] = useState({
    name: "",
    branding: {
      primaryColor: "#4f46e5",
      secondaryColor: "#f3f4f6",
      textColor: "#111827",
      logoUrl: "",
    },
    fields: {
      showTax: true,
      notesLabel: "Terms & Conditions",
      customFields: [],
    },
  });
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) return setError("Template name is required.");

    const result = editingId
      ? await updateItem(editingId, formData)
      : await createItem(formData);

    if (result.success) {
      setIsEditing(false);
      setEditingId(null);
      resetForm();
    } else {
      setError(result.error);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Delete this template? Existing invoices will not be affected.",
      )
    ) {
      const result = await deleteItem(id);
      if (!result.success) setError(result.error);
    }
  };

  const openEdit = (template) => {
    setFormData({
      name: template.name,
      branding: template.branding,
      fields: {
        ...template.fields,
        customFields: template.fields.customFields || [],
      },
    });
    setEditingId(template.id);
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      branding: {
        primaryColor: "#4f46e5",
        secondaryColor: "#f3f4f6",
        textColor: "#111827",
        logoUrl: "",
      },
      fields: {
        showTax: true,
        notesLabel: "Terms & Conditions",
        customFields: [],
      },
    });
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-emerald-50">
        <div className="text-center">
          <Loader2
            className="animate-spin text-emerald-700 mx-auto mb-4"
            size={40}
          />
          <p className="text-sm font-semibold text-gray-600">
            Loading templates...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header — matches Products/Clients exactly */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-lg shadow-emerald-200">
                <LayoutTemplate size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                  Invoice Templates
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-1 w-1 rounded-full bg-emerald-600"></div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {templates.length}{" "}
                    {templates.length === 1 ? "Template" : "Templates"} in
                    gallery
                  </p>
                </div>
              </div>
            </div>
          </div>

          {!isEditing ? (
            <button
              onClick={() => {
                resetForm();
                setIsEditing(true);
                setEditingId(null);
              }}
              className="group flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:-translate-y-0.5"
            >
              <Plus
                size={18}
                className="group-hover:scale-110 transition-transform"
              />
              New Template
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-md"
            >
              <ArrowLeft size={18} />
              Back to Gallery
            </button>
          )}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border-2 border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
            {error}
          </div>
        )}

        {/* Main Content */}
        {isEditing ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TemplateForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSave}
                onCancel={() => setIsEditing(false)}
                editingId={editingId}
                setError={setError}
              />
            </div>

            {/* Sidebar — matches Products/Clients sidebar */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl p-7 text-white shadow-xl shadow-emerald-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                <div className="relative">
                  <div className="p-3 bg-white/20 rounded-2xl w-fit mb-4 backdrop-blur-sm">
                    <Sparkles size={24} className="text-white" />
                  </div>
                  <h3 className="text-base font-black uppercase tracking-wide leading-tight mb-3">
                    Design Tips
                  </h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/60 mt-1.5 shrink-0"></div>
                      <p className="text-emerald-100 text-sm font-medium leading-relaxed">
                        Use your brand colors for a professional look
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/60 mt-1.5 shrink-0"></div>
                      <p className="text-emerald-100 text-sm font-medium leading-relaxed">
                        Add custom fields for VAT numbers or project codes
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/60 mt-1.5 shrink-0"></div>
                      <p className="text-emerald-100 text-sm font-medium leading-relaxed">
                        Upload a logo to strengthen your brand identity
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Grid3x3 size={18} className="text-emerald-600" />
                  <h4 className="text-sm font-bold text-gray-900">
                    Template Gallery
                  </h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Each template can be applied to individual invoices for
                  consistent branding across your business.
                </p>
              </div>
            </div>
          </div>
        ) : templates.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100">
            <EmptyState
              icon={LayoutTemplate}
              title="No Templates Yet"
              description="Design your first professional invoice template to get started."
              actionLabel="Create First Template"
              onAction={() => setIsEditing(true)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Templates;
