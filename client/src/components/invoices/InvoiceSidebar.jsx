import { Download } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "../../pdf/InvoicePDF";

const InvoiceSidebar = ({
  subtotal,
  taxTotal,
  grandTotal,
  templates,
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
  isSaved,
  savedInvoice,
  formatCurrency,
  company,
}) => {
  const labelStyle = "block text-xs font-bold text-gray-600 mb-2";
  const inputStyle =
    "w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all text-sm text-gray-900 font-medium hover:border-gray-300";

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
          <h3 className="text-xs font-black uppercase tracking-widest opacity-90">
            Summary
          </h3>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex justify-between items-center text-sm text-gray-500 font-bold">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500 font-bold pb-3 border-b-2 border-gray-100">
            <span>Tax Total</span>
            <span>{formatCurrency(taxTotal)}</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-xs font-black uppercase text-gray-400 tracking-widest">
              Grand Total
            </span>
            <span className="text-xl font-black text-emerald-600">
              {formatCurrency(grandTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Settings Card */}
      <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-50/50 to-amber-50/50 border-b-2 border-gray-100">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
            Invoice Settings
          </h3>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className={labelStyle}>Template</label>
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className={inputStyle}
              disabled={isSaved}
            >
              <option value="">Default Minimal</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelStyle}>Issue Date</label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className={inputStyle}
              disabled={isSaved}
            />
          </div>
          <div>
            <label className={labelStyle}>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputStyle}
              disabled={isSaved}
            />
          </div>

          {/* Recurring Toggle */}
          <div className="pt-2 border-t-2 border-gray-100">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                className={`w-9 h-5 rounded-full transition-all relative flex-shrink-0 ${isRecurring ? "bg-emerald-600" : "bg-gray-200"}`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${isRecurring ? "left-4" : "left-0.5"}`}
                />
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                disabled={isSaved}
              />
              <span className="text-xs font-black text-gray-500 group-hover:text-emerald-600 transition-colors uppercase tracking-widest">
                Recurring Invoice
              </span>
            </label>

            {isRecurring && (
              <div className="mt-4 space-y-4 pt-4 border-t-2 border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <label className={labelStyle}>Interval</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={recurringIntervalValue}
                      onChange={(e) =>
                        setRecurringIntervalValue(e.target.value)
                      }
                      className={`${inputStyle} w-20`}
                      min="1"
                      disabled={isSaved}
                    />
                    <select
                      value={recurringInterval}
                      onChange={(e) => setRecurringInterval(e.target.value)}
                      className={inputStyle}
                      disabled={isSaved}
                    >
                      <option value="Daily">Days</option>
                      <option value="Weekly">Weeks</option>
                      <option value="Monthly">Months</option>
                      <option value="Yearly">Years</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>Ends</label>
                  <div className="space-y-2 mt-2">
                    {[
                      { value: "Never", label: "Never" },
                      { value: "Date", label: "End on Date" },
                      { value: "Count", label: "End after N invoices" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="recurringEnd"
                          checked={recurringEndType === opt.value}
                          onChange={() => setRecurringEndType(opt.value)}
                          className="accent-emerald-600"
                          disabled={isSaved}
                        />
                        <span className="text-xs text-gray-600 font-bold">
                          {opt.label}
                        </span>
                      </label>
                    ))}

                    {recurringEndType === "Date" && (
                      <input
                        type="date"
                        value={recurringEndDate}
                        onChange={(e) => setRecurringEndDate(e.target.value)}
                        className={inputStyle}
                        disabled={isSaved}
                      />
                    )}
                    {recurringEndType === "Count" && (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="number"
                          value={recurringEndCount}
                          onChange={(e) => setRecurringEndCount(e.target.value)}
                          className={`${inputStyle} w-24`}
                          min="1"
                          disabled={isSaved}
                        />
                        <span className="text-xs text-gray-400 font-black uppercase">
                          Invoices
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>Next Date</label>
                  <input
                    type="datetime-local"
                    value={nextRecurrenceDate}
                    onChange={(e) => setNextRecurrenceDate(e.target.value)}
                    className={inputStyle}
                    disabled={isSaved}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Download PDF */}
      {isSaved && (
        <PDFDownloadLink
          document={
            <InvoicePDF
              invoice={savedInvoice}
              client={savedInvoice.client}
              company={company}
            />
          }
          fileName={`${savedInvoice.invoiceNumber}.pdf`}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 rounded-2xl font-bold text-sm border-2 border-gray-200 hover:border-emerald-200 transition-all shadow-sm"
        >
          {({ loading }) =>
            loading ? (
              "Preparing PDF..."
            ) : (
              <>
                <Download size={16} /> Download PDF
              </>
            )
          }
        </PDFDownloadLink>
      )}
    </div>
  );
};

export default InvoiceSidebar;
