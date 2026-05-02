import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { invoiceService } from "../services/api";
import { useInvoiceForm } from "../hooks/useInvoiceForm";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2 } from "lucide-react";
import InvoiceForm from "../components/invoices/InvoiceForm";

const InvoiceEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatCurrency, user } = useAuthStore();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);

  const invoiceState = useInvoiceForm(invoice);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const { data: inv } = await invoiceService.getById(id);
        if (inv.status !== "Draft") {
          toast.error("Only Draft invoices can be edited");
          navigate(`/invoices/${id}`);
          return;
        }
        setInvoice(inv);
        const { data: logs } = await invoiceService.getAuditLogs(id);
        setAuditLogs(logs);
      } catch {
        toast.error("Failed to fetch invoice");
        navigate("/invoices");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id, navigate]);

  const handleUpdate = async () => {
    const validationError = invoiceState.validate();
    if (validationError) return invoiceState.setError(validationError);

    setSaving(true);
    try {
      const payload = invoiceState.getPayload();
      await invoiceService.update(id, payload);
      toast.success("Invoice updated successfully!");
      navigate(`/invoices/${id}`);
    } catch (err) {
      invoiceState.setError(
        err.response?.data?.error || "Failed to update invoice",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleFinalise = async () => {
    try {
      await invoiceService.updateStatus(id, "Finalised");
      toast.success("Invoice Finalised");
      navigate(`/invoices/${id}`);
    } catch {
      toast.error("Failed to finalise invoice");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2
            className="animate-spin text-emerald-700 mx-auto mb-4"
            size={40}
          />
          <p className="text-sm font-semibold text-gray-600">
            Loading invoice...
          </p>
        </div>
      </div>
    );
  }

  return (
    <InvoiceForm
      {...invoiceState}
      title={`Edit ${invoice?.invoiceNumber}`}
      subtitle="Updating existing draft"
      isSaved={true}
      isFinalised={false}
      savedInvoice={invoice}
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
      onSave={handleUpdate}
      onFinalise={handleFinalise}
      onBack={() => navigate("/invoices")}
    />
  );
};

export default InvoiceEdit;
