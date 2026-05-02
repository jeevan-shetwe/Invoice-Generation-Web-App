import { Link } from "react-router-dom";
import {
  Plus,
  Save,
  CheckCircle,
  Send,
  History,
  Eye,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import InvoicePreviewModal from "./InvoicePreviewModal";
import InvoiceItemsTable from "./InvoiceItemsTable";
import InvoiceSidebar from "./InvoiceSidebar";

const InvoiceForm = ({
  clients,
  templates,
  products,
  selectedClientId,
  setSelectedClientId,
  selectedTemplateId,
  setSelectedTemplateId,
  issueDate,
  setIssueDate,
  dueDate,
  setDueDate,
  isRecurring,
  setIsRecurring,
  recurringInterval,
  setRecurringInterval,
  recurringIntervalValue,
  setRecurringIntervalValue,
  recurringEndType,
  setRecurringEndType,
  recurringEndDate,
  setRecurringEndDate,
  recurringEndCount,
  setRecurringEndCount,
  nextRecurrenceDate,
  setNextRecurrenceDate,
  notes,
  setNotes,
  termsAndConditions,
  setTermsAndConditions,
  additionalInfo,
  setAdditionalInfo,
  contactEmail,
  setContactEmail,
  contactPhone,
  setContactPhone,
  signatureUrl,
  setSignatureUrl,
  items,
  error,
  subtotal,
  taxTotal,
  grandTotal,
  handleAddProduct,
  updateItemQuantity,
  removeItem,
  onSave,
  onFinalise,
  onSendEmail,
  title,
  subtitle,
  isSaved,
  isFinalised,
  savedInvoice,
  auditLogs = [],
  showPreview,
  setShowPreview,
  productSearch,
  setProductSearch,
  showDropdown,
  setShowDropdown,
  saving,
  user,
  formatCurrency,
  onBack,
}) => {
  const selectedClient = clients.find(
    (c) => c.id === parseInt(selectedClientId),
  );

  const previewInvoiceData = {
    invoiceNumber: savedInvoice?.invoiceNumber || "PREVIEW-001",
    issueDate,
    dueDate,
    subtotal,
    taxTotal,
    grandTotal,
    items,
    notes,
    termsAndConditions,
    additionalInfo,
    contactEmail,
    contactPhone,
    signatureUrl,
    isRecurring,
    recurringInterval,
    recurringIntervalValue,
    recurringEndType,
    recurringEndDate,
    recurringEndCount,
    currency: user?.currency || "USD",
    templateSnapshot: templates.find(
      (t) => t.id === parseInt(selectedTemplateId),
    )
      ? {
          branding: templates.find((t) => t.id === parseInt(selectedTemplateId))
            .branding,
          fields: templates.find((t) => t.id === parseInt(selectedTemplateId))
            .fields,
        }
      : null,
  };

  const labelStyle = "block text-xs font-bold text-gray-600 mb-2";
  const inputStyle =
    "w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all text-sm text-gray-900 font-medium hover:border-gray-300 placeholder:text-gray-400";

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-4 md:p-6 relative">
      <InvoicePreviewModal
        show={showPreview}
        onClose={() => setShowPreview(false)}
        invoiceData={previewInvoiceData}
        client={selectedClient}
        company={user}
        templateName={
          templates.find((t) => t.id === parseInt(selectedTemplateId))?.name
        }
      />

      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2.5 bg-white border-2 border-gray-200 text-gray-400 hover:text-gray-900 hover:border-gray-300 rounded-xl transition-all shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              {title}
            </h1>
            <p className="text-gray-400 text-xs mt-0.5 font-bold uppercase tracking-wider">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 text-gray-600 hover:border-emerald-400 hover:text-emerald-600 rounded-xl font-bold shadow-sm transition-all text-sm"
          >
            <Eye size={16} /> Preview
          </button>

          {savedInvoice && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-widest border-2 ${isFinalised ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${isFinalised ? "bg-emerald-500" : "bg-amber-500"}`}
              />
              {savedInvoice.status}
            </div>
          )}

          {!isFinalised && (
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm transition-all shadow-sm disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {isSaved ? "Update" : "Save Draft"}
            </button>
          )}

          {isSaved && !isFinalised && onFinalise && (
            <button
              onClick={onFinalise}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-200"
            >
              <CheckCircle size={16} /> Finalise
            </button>
          )}

          {isSaved && onSendEmail && (
            <button
              onClick={onSendEmail}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 hover:border-emerald-300 hover:text-emerald-600 text-gray-600 rounded-xl font-bold text-sm transition-all shadow-sm"
            >
              <Send size={16} /> Send Email
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Error */}
        {error && (
          <div className="bg-red-50 border-2 border-red-100 text-red-700 px-5 py-4 rounded-2xl mb-6 flex items-center gap-3">
            <Plus className="rotate-45 text-red-500 shrink-0" size={16} />
            <p className="font-bold text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            {/* Billed To */}
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
              <div className="px-8 py-5 bg-gradient-to-r from-emerald-50/50 to-amber-50/50 border-b-2 border-gray-100">
                <h2 className="text-xs font-black text-gray-500 uppercase tracking-wider">
                  Billed To
                </h2>
              </div>
              <div className="p-8 space-y-4">
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className={`${inputStyle} appearance-none cursor-pointer`}
                  disabled={isFinalised}
                >
                  <option value="">Select a Client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                {!selectedClientId && !isFinalised && (
                  <div className="py-10 border-2 border-dashed border-emerald-100 rounded-2xl flex flex-col items-center justify-center bg-emerald-50/20">
                    <p className="text-gray-500 font-bold text-sm mb-4">
                      Select a client from the list above
                    </p>
                    <Link
                      to="/clients"
                      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-black text-xs transition-all shadow-lg shadow-emerald-200"
                    >
                      <Plus size={16} /> Add New Client
                    </Link>
                  </div>
                )}

                {selectedClient && (
                  <div className="p-5 bg-emerald-50/30 rounded-2xl border-2 border-emerald-100/50 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-black text-gray-900 text-sm">
                          {selectedClient.name}
                        </p>
                        <p className="text-gray-500 text-xs mt-1 font-medium">
                          {selectedClient.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">
                          Active Recipient
                        </p>
                        <p className="text-gray-400 text-xs mt-1 max-w-[200px]">
                          {selectedClient.address}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Items Table */}
            <InvoiceItemsTable
              items={items}
              products={products}
              productSearch={productSearch}
              setProductSearch={setProductSearch}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              onAddItem={handleAddProduct}
              onUpdateQty={updateItemQuantity}
              onRemoveItem={removeItem}
              isSaved={isFinalised}
              formatCurrency={formatCurrency}
            />

            {/* Business Details & Additional */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-emerald-50/50 to-amber-50/50 border-b-2 border-gray-100">
                  <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
                    Business Details
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className={labelStyle}>Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className={`${inputStyle} h-20 resize-none`}
                      placeholder="Notes..."
                      disabled={isFinalised}
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Terms & Conditions</label>
                    <textarea
                      value={termsAndConditions}
                      onChange={(e) => setTermsAndConditions(e.target.value)}
                      className={`${inputStyle} h-20 resize-none`}
                      placeholder="Terms..."
                      disabled={isFinalised}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelStyle}>Email</label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className={inputStyle}
                        placeholder="Email"
                        disabled={isFinalised}
                      />
                    </div>
                    <div>
                      <label className={labelStyle}>Phone</label>
                      <input
                        type="text"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className={inputStyle}
                        placeholder="Phone"
                        disabled={isFinalised}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-emerald-50/50 to-amber-50/50 border-b-2 border-gray-100">
                  <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
                    Additional & Signature
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className={labelStyle}>Additional Info</label>
                    <textarea
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      className={`${inputStyle} h-20 resize-none`}
                      placeholder="Additional details..."
                      disabled={isFinalised}
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Signature URL</label>
                    <input
                      type="text"
                      value={signatureUrl}
                      onChange={(e) => setSignatureUrl(e.target.value)}
                      className={inputStyle}
                      placeholder="URL to signature"
                      disabled={isFinalised}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <InvoiceSidebar
            subtotal={subtotal}
            taxTotal={taxTotal}
            grandTotal={grandTotal}
            templates={templates}
            selectedTemplateId={selectedTemplateId}
            setSelectedTemplateId={setSelectedTemplateId}
            issueDate={issueDate}
            setIssueDate={setIssueDate}
            dueDate={dueDate}
            setDueDate={setDueDate}
            isRecurring={isRecurring}
            setIsRecurring={setIsRecurring}
            recurringInterval={recurringInterval}
            setRecurringInterval={setRecurringInterval}
            recurringIntervalValue={recurringIntervalValue}
            setRecurringIntervalValue={setRecurringIntervalValue}
            recurringEndType={recurringEndType}
            setRecurringEndType={setRecurringEndType}
            recurringEndDate={recurringEndDate}
            setRecurringEndDate={setRecurringEndDate}
            recurringEndCount={recurringEndCount}
            setRecurringEndCount={setRecurringEndCount}
            nextRecurrenceDate={nextRecurrenceDate}
            setNextRecurrenceDate={setNextRecurrenceDate}
            isSaved={isFinalised}
            savedInvoice={savedInvoice}
            formatCurrency={formatCurrency}
            company={user}
          />
        </div>
      </div>

      {/* Audit Log */}
      {isSaved && auditLogs.length > 0 && (
        <div className="max-w-6xl mx-auto mt-6 bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
          <div className="px-8 py-5 bg-gradient-to-r from-emerald-50/50 to-amber-50/50 border-b-2 border-gray-100">
            <h2 className="text-xs font-black text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <History size={14} className="text-emerald-600" /> Audit History
            </h2>
          </div>
          <div className="p-6 space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="flex justify-between items-center text-xs p-3 bg-gray-50 rounded-xl border-2 border-gray-100"
              >
                <div>
                  <span className="font-bold text-gray-900">
                    {log.user?.companyName || log.user?.email || "User"}
                  </span>
                  <span className="text-gray-400 mx-2">→</span>
                  <span className="font-bold text-emerald-600 uppercase tracking-tighter">
                    {log.newStatus}
                  </span>
                </div>
                <div className="text-gray-400 font-medium">
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceForm;
