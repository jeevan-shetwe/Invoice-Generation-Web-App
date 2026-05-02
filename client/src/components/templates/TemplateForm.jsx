import {
  Palette,
  FileText,
  Plus,
  Trash2,
  CheckCircle,
  LayoutTemplate,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { templateService } from "../../services/api";

const TemplateForm = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  editingId,
  setError,
}) => {
  const labelStyle =
    "block text-xs font-bold text-gray-600 mb-2 flex items-center gap-2";
  const inputStyle =
    "w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all text-sm text-gray-900 font-medium hover:border-gray-300 placeholder:text-gray-400";

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("logo", file);

    try {
      const res = await templateService.uploadLogo(uploadData);
      setFormData({
        ...formData,
        branding: { ...formData.branding, logoUrl: res.data.logoUrl },
      });
    } catch {
      setError("Failed to upload logo");
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
      {/* Header — matches ProductForm / ClientForm */}
      <div className="px-8 py-6 bg-gradient-to-r from-emerald-50 to-amber-50 border-b-2 border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white rounded-xl shadow-sm">
              <Palette size={22} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight">
                {editingId ? "Edit Template Design" : "Design New Template"}
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                {editingId
                  ? "Update your template branding and layout"
                  : "Create a new professional invoice template"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-2.5 hover:bg-white rounded-xl transition-colors text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <form onSubmit={onSubmit} className="p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Branding */}
          <div className="space-y-6">
            {/* Template Name */}
            <div>
              <label className={labelStyle}>
                <LayoutTemplate size={16} className="text-emerald-600" />
                Template Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={inputStyle}
                placeholder="e.g. Modern Professional"
              />
            </div>

            {/* Visual Branding Card */}
            <div className="p-6 bg-gray-50/50 rounded-2xl border-2 border-gray-100 space-y-6">
              <h3 className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-2 pb-3 border-b-2 border-gray-100">
                <Palette size={14} className="text-emerald-600" />
                Visual Branding
              </h3>

              {/* Color Pickers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Primary Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.branding.primaryColor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branding: {
                            ...formData.branding,
                            primaryColor: e.target.value,
                          },
                        })
                      }
                      className="w-11 h-11 rounded-xl cursor-pointer border-2 border-white shadow-sm shrink-0"
                    />
                    <input
                      type="text"
                      value={formData.branding.primaryColor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branding: {
                            ...formData.branding,
                            primaryColor: e.target.value,
                          },
                        })
                      }
                      className="flex-1 px-3 py-2.5 border-2 border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest bg-white focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelStyle}>Accent Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.branding.secondaryColor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branding: {
                            ...formData.branding,
                            secondaryColor: e.target.value,
                          },
                        })
                      }
                      className="w-11 h-11 rounded-xl cursor-pointer border-2 border-white shadow-sm shrink-0"
                    />
                    <input
                      type="text"
                      value={formData.branding.secondaryColor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branding: {
                            ...formData.branding,
                            secondaryColor: e.target.value,
                          },
                        })
                      }
                      className="flex-1 px-3 py-2.5 border-2 border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest bg-white focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Logo Upload */}
              <div>
                <label className={labelStyle}>Company Logo</label>
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-white border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                    {formData.branding.logoUrl ? (
                      <img
                        src={
                          formData.branding.logoUrl.startsWith("http")
                            ? formData.branding.logoUrl
                            : `http://localhost:5000${formData.branding.logoUrl}`
                        }
                        alt="Logo"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <LayoutTemplate className="text-gray-300" size={28} />
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <input
                      type="text"
                      value={formData.branding.logoUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branding: {
                            ...formData.branding,
                            logoUrl: e.target.value,
                          },
                        })
                      }
                      className={inputStyle}
                      placeholder="Logo URL..."
                    />
                    <input
                      type="file"
                      accept="image/*"
                      id="template-logo-upload"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("template-logo-upload").click()
                      }
                      className="px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors border-2 border-emerald-100"
                    >
                      Upload Image
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Layout & Fields */}
          <div>
            <div className="p-6 bg-gray-50/50 rounded-2xl border-2 border-gray-100 space-y-6 h-full">
              <h3 className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-2 pb-3 border-b-2 border-gray-100">
                <FileText size={14} className="text-emerald-600" />
                Content Configuration
              </h3>

              {/* Show Tax Toggle */}
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-100">
                <span className="text-sm font-bold text-gray-700">
                  Show Tax Column
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.fields.showTax}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        fields: {
                          ...formData.fields,
                          showTax: !formData.fields.showTax,
                        },
                      })
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Notes Label */}
              <div>
                <label className={labelStyle}>
                  <FileText size={16} className="text-emerald-600" />
                  Terms & Conditions Label
                </label>
                <input
                  type="text"
                  value={formData.fields.notesLabel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fields: {
                        ...formData.fields,
                        notesLabel: e.target.value,
                      },
                    })
                  }
                  className={inputStyle}
                  placeholder="e.g. Important Notes"
                />
              </div>

              {/* Custom Fields */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Custom Fields
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        fields: {
                          ...formData.fields,
                          customFields: [
                            ...(formData.fields.customFields || []),
                            { label: "", value: "" },
                          ],
                        },
                      })
                    }
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all border-2 border-emerald-100"
                  >
                    <Plus size={13} /> Add Field
                  </button>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {(formData.fields.customFields || []).map((field, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 p-4 bg-white border-2 border-gray-100 rounded-2xl relative"
                    >
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          placeholder="Label (e.g. VAT No)"
                          value={field.label}
                          onChange={(e) => {
                            const newFields = [...formData.fields.customFields];
                            newFields[idx].label = e.target.value;
                            setFormData({
                              ...formData,
                              fields: {
                                ...formData.fields,
                                customFields: newFields,
                              },
                            });
                          }}
                          className="w-full bg-transparent text-xs font-bold text-gray-900 border-none p-0 focus:ring-0 placeholder:text-gray-300 uppercase tracking-widest outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Value"
                          value={field.value}
                          onChange={(e) => {
                            const newFields = [...formData.fields.customFields];
                            newFields[idx].value = e.target.value;
                            setFormData({
                              ...formData,
                              fields: {
                                ...formData.fields,
                                customFields: newFields,
                              },
                            });
                          }}
                          className="w-full bg-transparent text-xs font-medium text-gray-500 border-none p-0 focus:ring-0 placeholder:text-gray-300 outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newFields = formData.fields.customFields.filter(
                            (_, i) => i !== idx,
                          );
                          setFormData({
                            ...formData,
                            fields: {
                              ...formData.fields,
                              customFields: newFields,
                            },
                          });
                        }}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}

                  {(formData.fields.customFields || []).length === 0 && (
                    <div className="text-center py-8 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                      <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                        No custom fields yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons — matches ProductForm / ClientForm */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-8 border-t-2 border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-gray-600 font-bold text-sm hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="group flex items-center justify-center gap-2.5 px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 transition-all hover:shadow-xl hover:shadow-emerald-300 hover:-translate-y-0.5"
          >
            <CheckCircle
              size={18}
              className="group-hover:scale-110 transition-transform"
            />
            {editingId ? "Update Template" : "Save Template"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TemplateForm;
