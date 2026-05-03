import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { invoiceService } from "../services/api";
import { Plus, Download, FileText, Search, Receipt } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import InvoiceStats from "../components/invoices/InvoiceStats";
import InvoiceFilters from "../components/invoices/InvoiceFilters";
import InvoiceTable from "../components/invoices/InvoiceTable";
import InvoiceMobileList from "../components/invoices/InvoiceMobileList";
import EmptyState from "../components/ui/EmptyState";

const InvoicesList = () => {
  const navigate = useNavigate();
  const { formatCurrency } = useAuthStore();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const fetchInvoices = useCallback(async () => {
    try {
      const { data } = await invoiceService.getAll();
      setInvoices(data || []);
    } catch {
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      fetchInvoices();
    });
  }, [fetchInvoices]);

  const exportToCSV = () => {
    if (invoices.length === 0) return toast.error("No invoices to export");
    const headers = [
      "Invoice #",
      "Client",
      "Issue Date",
      "Due Date",
      "Status",
      "Grand Total",
    ];
    const rows = invoices.map((inv) => [
      inv.invoiceNumber,
      `"${inv.client?.name || "Unknown"}"`,
      inv.issueDate || "",
      inv.dueDate || "",
      inv.status,
      inv.grandTotal,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    link.setAttribute(
      "download",
      `invoices_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV exported!");
  };

  const stats = useMemo(() => {
    const totalRevenue = invoices
      .filter((i) => i.status === "Paid")
      .reduce((s, i) => s + parseFloat(i.grandTotal || 0), 0);
    const outstanding = invoices
      .filter((i) => i.status === "Finalised")
      .reduce((s, i) => s + parseFloat(i.grandTotal || 0), 0);
    const draftCount = invoices.filter((i) => i.status === "Draft").length;
    return { totalRevenue, outstanding, draftCount };
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    let list = invoices;
    if (activeFilter !== "All")
      list = list.filter((i) => i.status === activeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.invoiceNumber?.toLowerCase().includes(q) ||
          i.client?.name?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [invoices, activeFilter, search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-3 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-10">
          <div className="space-y-1 md:space-y-2">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg md:rounded-2xl shadow-lg shadow-emerald-200">
                <Receipt size={24} className="md:w-[28px] md:h-[28px] text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                  Invoices
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="h-1 w-1 rounded-full bg-emerald-600"></div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {loading
                      ? "Fetching records..."
                      : `${invoices.length} ${invoices.length === 1 ? "Invoice" : "Invoices"} Found`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-3 md:px-5 py-2.5 md:py-3 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg md:rounded-xl font-bold text-xs md:text-sm transition-all shadow-sm hover:shadow-md"
            >
              <Download size={16} /> <span className="hidden sm:inline">Export</span>
            </button>
            <Link
              to="/create-invoice"
              className="group flex items-center gap-2 px-3 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg md:rounded-xl font-bold text-xs md:text-sm transition-all shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:-translate-y-0.5"
            >
              <Plus
                size={16}
                className="md:w-[18px] md:h-[18px] group-hover:scale-110 transition-transform"
              />{" "}
              <span className="hidden sm:inline">New Invoice</span>
              <span className="sm:hidden">New</span>
            </Link>
          </div>
        </div>

        {/* Stats */}
        {!loading && invoices.length > 0 && (
          <InvoiceStats {...stats} formatCurrency={formatCurrency} />
        )}

        {/* Filters */}
        {!loading && invoices.length > 0 && (
          <InvoiceFilters
            search={search}
            setSearch={setSearch}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            invoices={invoices}
          />
        )}

        {/* Empty State */}
        {!loading && invoices.length === 0 && (
          <EmptyState
            icon={FileText}
            title="No Invoices Yet"
            description="Start your billing journey by creating your very first professional invoice."
            actionLabel="Create First Invoice"
            onAction={() => navigate("/create-invoice")}
          />
        )}

        {/* List */}
        {loading || filteredInvoices.length > 0 ? (
          <>
            <InvoiceTable
              invoices={filteredInvoices}
              loading={loading}
              formatCurrency={formatCurrency}
            />
            <InvoiceMobileList
              invoices={filteredInvoices}
              loading={loading}
              formatCurrency={formatCurrency}
            />
          </>
        ) : (
          !loading &&
          invoices.length > 0 && (
            <EmptyState
              icon={Search}
              title="No matches found"
              description={`We couldn't find any invoices matching "${search}"`}
              actionLabel="Clear Search"
              onAction={() => setSearch("")}
            />
          )
        )}
      </div>
    </div>
  );
};

export default InvoicesList;
