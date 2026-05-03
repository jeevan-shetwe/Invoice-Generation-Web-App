import { useNavigate } from "react-router-dom";
import InvoiceStatusBadge from "./InvoiceStatusBadge";

const InvoiceMobileList = ({ invoices, loading, formatCurrency }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="md:hidden space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl border border-gray-100 animate-pulse space-y-2 shadow-xs"
          >
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-gray-100 rounded-lg" />
              <div className="h-4 w-16 bg-gray-100 rounded-lg" />
            </div>
            <div className="h-3 w-32 bg-gray-50 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="md:hidden space-y-2">
      {invoices.map((inv) => (
        <div
          key={inv.id}
          onClick={() => navigate(`/invoices/${inv.id}`)}
          className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs active:scale-[0.98] hover:border-emerald-200 hover:shadow-sm transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-sm font-bold text-gray-900">
                {inv.invoiceNumber}
              </p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">
                {inv.client?.name || "Unknown"}
              </p>
            </div>
            <p className="text-base font-bold text-emerald-600">
              {formatCurrency(inv.grandTotal, inv.currency)}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              {inv.issueDate}
            </p>
            <InvoiceStatusBadge status={inv.status} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvoiceMobileList;