import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { invoiceService } from "../services/api";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import InvoicePDF from "../pdf/InvoicePDF";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Download,
  Send,
  CheckCircle,
  Repeat,
  Pencil,
  AlertCircle,
  Receipt,
} from "lucide-react";
import InvoiceStatusBadge from "../components/invoices/InvoiceStatusBadge";
import InvoiceAuditLog from "../components/invoices/InvoiceAuditLog";

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, formatCurrency } = useAuthStore();
  const [invoice, setInvoice] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInvoice = useCallback(async () => {
    try {
      const [invRes, logsRes] = await Promise.all([
        invoiceService.getById(id),
        invoiceService.getAuditLogs(id),
      ]);
      setInvoice(invRes.data);
      setAuditLogs(logsRes.data || []);
    } catch {
      toast.error("Failed to load invoice");
      navigate("/");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    queueMicrotask(() => {
      loadInvoice();
    });
  }, [loadInvoice]);

  const handleStatusUpdate = async (status, successMsg) => {
    try {
      const { data } = await invoiceService.updateStatus(id, status);
      setInvoice(data);
      toast.success(successMsg);
      loadInvoice();
    } catch (err) {
      toast.error(err.response?.data?.error || "Update failed");
    }
  };

  const handleSendEmail = async () => {
    if (!invoice.client?.email) return toast.error("Client has no email");
    if (!window.confirm(`Send invoice to ${invoice.client.email}?`)) return;

    const toastId = "email-send";
    toast.loading("Sending Email...", { id: toastId });
    try {
      const doc = (
        <InvoicePDF invoice={invoice} client={invoice.client} company={user} />
      );
      const asPdf = pdf([]);
      asPdf.updateContainer(doc);
      const blob = await asPdf.toBlob();

      const formData = new FormData();
      formData.append("invoicePdf", blob, `${invoice.invoiceNumber}.pdf`);
      await invoiceService.sendEmail(id, formData);
      toast.success("Invoice sent successfully!", { id: toastId });
      loadInvoice();
    } catch {
      toast.error("Failed to send email", { id: toastId });
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-8">
        <div className="max-w-5xl mx-auto space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 bg-white rounded-3xl border-2 border-gray-100 animate-pulse shadow-sm"
            />
          ))}
        </div>
      </div>
    );

  if (!invoice) return null;

  const isFinalised = invoice.status === "Finalised";
  const isDraft = invoice.status === "Draft";
  const isPaid = invoice.status === "Paid";
  const isCancelled = invoice.status === "Cancelled";
  const isLocked = isPaid || isCancelled;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/invoices")}
                className="p-2.5 bg-white border-2 border-gray-200 text-gray-400 hover:text-gray-900 hover:border-gray-300 rounded-xl transition-all shadow-sm"
              >
                <ArrowLeft size={20} />
              </button>
              <InvoiceStatusBadge status={invoice.status} />
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-lg shadow-emerald-200">
                <Receipt size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                  {invoice.invoiceNumber}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-1 w-1 rounded-full bg-emerald-600"></div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {invoice.client?.name} · Issued {invoice.issueDate}
                    {invoice.isRecurring && (
                      <span className="inline-flex items-center gap-1 ml-2 text-emerald-600">
                        <Repeat size={11} /> Recurring
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isDraft && (
              <button
                onClick={() => navigate(`/invoices/${id}/edit`)}
                className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 text-gray-700 hover:border-emerald-400 hover:text-emerald-600 rounded-xl font-bold text-sm transition-all shadow-sm"
              >
                <Pencil size={16} /> Edit
              </button>
            )}

            {isDraft && (
              <button
                onClick={() =>
                  handleStatusUpdate("Finalised", "Invoice Finalised")
                }
                className="flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg shadow-gray-200"
              >
                <CheckCircle size={16} /> Finalise
              </button>
            )}

            {isFinalised && (
              <button
                onClick={() => handleStatusUpdate("Paid", "Marked as Paid")}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-200"
              >
                <CheckCircle size={16} /> Mark Paid
              </button>
            )}

            {!isLocked && (
              <button
                onClick={handleSendEmail}
                className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 text-gray-700 hover:border-emerald-400 hover:text-emerald-600 rounded-xl font-bold text-sm transition-all shadow-sm"
              >
                <Send size={16} /> Send Email
              </button>
            )}

            {!isLocked && (isDraft || isFinalised) && (
              <button
                onClick={() =>
                  window.confirm("Are you sure you want to cancel this invoice?") &&
                  handleStatusUpdate("Cancelled", "Invoice Cancelled")
                }
                className="flex items-center gap-2 px-5 py-3 bg-red-600 text-white hover:bg-red-700 rounded-xl font-bold text-sm transition-all shadow-lg shadow-red-200"
              >
                <AlertCircle size={16} /> Cancel Invoice
              </button>
            )}

            <PDFDownloadLink
              document={
                <InvoicePDF
                  invoice={invoice}
                  client={invoice.client}
                  company={user}
                />
              }
              fileName={`${invoice.invoiceNumber}.pdf`}
              className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 text-gray-700 hover:border-emerald-400 hover:text-emerald-600 rounded-xl font-bold text-sm transition-all shadow-sm"
            >
              {({ loading: pdfLoading }) =>
                pdfLoading ? (
                  "..."
                ) : (
                  <>
                    <Download size={16} /> Download
                  </>
                )
              }
            </PDFDownloadLink>
          </div>
        </div>

        {/* Lock Banner */}
        {isLocked && (
          <div
            className={`mb-8 p-4 rounded-2xl border-2 flex items-center gap-3 font-bold text-sm ${isPaid ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-red-50 border-red-100 text-red-700"}`}
          >
            <AlertCircle size={18} />
            {isPaid
              ? "This invoice is Paid & Locked"
              : "This invoice is Cancelled & Locked"}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client & Dates */}
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
              <div className="px-8 py-5 bg-gradient-to-r from-emerald-50/50 to-amber-50/50 border-b-2 border-gray-100">
                <h2 className="text-xs font-black text-gray-500 uppercase tracking-wider">
                  Client & Dates
                </h2>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                      Billed To
                    </p>
                    <p className="text-lg font-black text-gray-900">
                      {invoice.client?.name}
                    </p>
                    <p className="text-sm text-gray-500 font-medium">
                      {invoice.client?.email}
                    </p>
                    <p className="text-xs text-gray-400 whitespace-pre-wrap mt-2 leading-relaxed">
                      {invoice.client?.address}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                        Issue Date
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {invoice.issueDate}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                        Due Date
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {invoice.dueDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
              <div className="px-8 py-5 bg-gradient-to-r from-emerald-50/50 to-amber-50/50 border-b-2 border-gray-100 flex items-center justify-between">
                <h2 className="text-xs font-black text-gray-500 uppercase tracking-wider">
                  Line Items
                </h2>
                <span className="text-xs font-bold text-gray-400">
                  {invoice.items?.length} items
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-8 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                        Description
                      </th>
                      <th className="px-8 py-3 text-center text-xs font-black text-gray-400 uppercase tracking-widest">
                        Qty
                      </th>
                      <th className="px-8 py-3 text-right text-xs font-black text-gray-400 uppercase tracking-widest">
                        Price
                      </th>
                      <th className="px-8 py-3 text-right text-xs font-black text-gray-400 uppercase tracking-widest">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {invoice.items?.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-emerald-50/20 transition-colors"
                      >
                        <td className="px-8 py-4">
                          <p className="text-sm font-bold text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-xs font-bold text-gray-400 mt-0.5">
                            Tax {item.taxRate}%
                          </p>
                        </td>
                        <td className="px-8 py-4 text-center text-sm font-bold text-gray-600">
                          {item.quantity}
                        </td>
                        <td className="px-8 py-4 text-right text-sm font-bold text-gray-600">
                          {formatCurrency(item.unitPrice, invoice.currency)}
                        </td>
                        <td className="px-8 py-4 text-right text-sm font-black text-gray-900">
                          {formatCurrency(item.total, invoice.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="p-8 bg-gradient-to-r from-gray-50 to-gray-100/50 border-t-2 border-gray-100 flex justify-end">
                <div className="w-full max-w-xs space-y-3">
                  <div className="flex justify-between items-center text-sm text-gray-500 font-bold">
                    <span>Subtotal</span>
                    <span>
                      {formatCurrency(invoice.subtotal, invoice.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500 font-bold pb-3 border-b-2 border-gray-200">
                    <span>Tax Total</span>
                    <span>
                      {formatCurrency(invoice.taxTotal, invoice.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      Grand Total
                    </span>
                    <span className="text-2xl font-black text-emerald-600">
                      {formatCurrency(invoice.grandTotal, invoice.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <InvoiceAuditLog logs={auditLogs} />

            {invoice.notes && (
              <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-6">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                  Notes
                </h3>
                <p className="text-sm text-gray-600 font-medium leading-relaxed italic">
                  "{invoice.notes}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;