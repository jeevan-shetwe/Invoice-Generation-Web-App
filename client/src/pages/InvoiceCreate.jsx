import { useState } from "react";
import { invoiceService } from "../services/api";
import { useInvoiceForm } from "../hooks/useInvoiceForm";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import InvoiceForm from "../components/invoices/InvoiceForm";

const InvoiceCreate = () => {
  const { formatCurrency, user } = useAuthStore();
  const invoiceState = useInvoiceForm();

  const [savedInvoice, setSavedInvoice] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchAuditLogs = async (id) => {
    try {
      const { data } = await invoiceService.getAuditLogs(id);
      setAuditLogs(data);
    } catch (err) {
      console.error("Error fetching audit logs:", err);
    }
  };

  const isSaved = !!savedInvoice;
  const isFinalised = savedInvoice?.status === "Finalised";

  const handleCreateInvoice = async () => {
    const validationError = invoiceState.validate();
    if (validationError) return invoiceState.setError(validationError);

    setSaving(true);
    try {
      const payload = invoiceState.getPayload();
      const { data } = await invoiceService.create(payload);
      setSavedInvoice(data);
      fetchAuditLogs(data.id);
      toast.success("Invoice Draft Saved");
    } catch (err) {
      invoiceState.setError(
        err.response?.data?.error || "Failed to save the invoice.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleFinalise = async () => {
    if (!savedInvoice) return;
    try {
      const { data } = await invoiceService.updateStatus(
        savedInvoice.id,
        "Finalised",
      );
      setSavedInvoice(data);
      fetchAuditLogs(data.id);
      toast.success("Invoice Finalised");
    } catch {
      toast.error("Failed to finalise invoice");
    }
  };

  const handleSendEmail = async () => {
    if (!savedInvoice) return;
    if (
      !window.confirm(
        `Send invoice ${savedInvoice.invoiceNumber} to ${savedInvoice.client?.email}?`,
      )
    )
      return;
    try {
      toast.loading("Sending Email...", { id: "email-toast" });
      const formData = new FormData();
      const asPdf = (await import("@react-pdf/renderer")).pdf;
      const InvoicePDF = (await import("../pdf/InvoicePDF")).default;
      const doc = (
        <InvoicePDF
          invoice={savedInvoice}
          client={savedInvoice.client}
          company={user}
        />
      );
      const blob = await asPdf(doc).toBlob();
      formData.append("invoicePdf", blob, `${savedInvoice.invoiceNumber}.pdf`);
      await invoiceService.sendEmail(savedInvoice.id, formData);
      toast.success("Email sent successfully!", { id: "email-toast" });
      if (savedInvoice.status === "Draft") {
        setSavedInvoice({ ...savedInvoice, status: "Finalised" });
        fetchAuditLogs(savedInvoice.id);
      }
    } catch {
      toast.error("Failed to send email.", { id: "email-toast" });
    }
  };

  return (
    <InvoiceForm
      {...invoiceState}
      title={
        savedInvoice ? `Invoice ${savedInvoice.invoiceNumber}` : "New Invoice"
      }
      subtitle={isFinalised ? "Finalised record" : "Drafting new invoice"}
      isSaved={isSaved}
      isFinalised={isFinalised}
      savedInvoice={savedInvoice}
      auditLogs={auditLogs}
      showPreview={showPreview}
      setShowPreview={setShowPreview}
      productSearch={productSearch}
      setProductSearch={setProductSearch}
      showDropdown={showProductDropdown}
      setShowDropdown={setShowProductDropdown}
      saving={saving}
      user={user}
      formatCurrency={formatCurrency}
      onSave={handleCreateInvoice}
      onFinalise={handleFinalise}
      onSendEmail={handleSendEmail}
    />
  );
};

export default InvoiceCreate;
