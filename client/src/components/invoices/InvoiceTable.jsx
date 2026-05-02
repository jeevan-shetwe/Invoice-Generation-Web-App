import { useNavigate } from "react-router-dom";
import { Repeat, ArrowUpRight } from "lucide-react";
import InvoiceStatusBadge from "./InvoiceStatusBadge";

const InvoiceTable = ({ invoices, loading, formatCurrency }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="hidden md:block bg-white rounded-3xl border-2 border-gray-100 overflow-hidden shadow-xl">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="p-5 border-b border-gray-50 flex justify-between animate-pulse"
          >
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-2xl" />
              <div className="space-y-2">
                <div className="h-3 w-32 bg-gray-100 rounded-lg" />
                <div className="h-2 w-20 bg-gray-50 rounded-lg" />
              </div>
            </div>
            <div className="h-4 w-16 bg-gray-100 rounded-lg mt-3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="hidden md:block bg-white rounded-3xl border-2 border-gray-100 overflow-hidden shadow-xl mb-4">
      {/* Header */}
      <div className="px-8 py-5 bg-gradient-to-r from-emerald-50/50 to-amber-50/50 border-b-2 border-gray-100">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-2">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
              Invoice #
            </h3>
          </div>
          <div className="col-span-4">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
              Client
            </h3>
          </div>
          <div className="col-span-2">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
              Date
            </h3>
          </div>
          <div className="col-span-2">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
              Status
            </h3>
          </div>
          <div className="col-span-2 text-right">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
              Amount
            </h3>
          </div>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-50">
        {invoices.map((inv) => (
          <div
            key={inv.id}
            onClick={() => navigate(`/invoices/${inv.id}`)}
            className="group px-8 py-5 grid grid-cols-12 gap-4 items-center hover:bg-gradient-to-r hover:from-emerald-50/30 hover:to-amber-50/30 cursor-pointer transition-all duration-200"
          >
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-gray-900 group-hover:text-emerald-700 transition-colors">
                  {inv.invoiceNumber}
                </span>
                {inv.isRecurring && (
                  <div className="p-1 bg-emerald-50 rounded-lg">
                    <Repeat size={11} className="text-emerald-600" />
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-emerald-700 text-xs font-black uppercase flex-shrink-0">
                {(inv.client?.name || "?").charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {inv.client?.name || "Unknown"}
                </p>
                <p className="text-xs text-gray-400 font-bold truncate">
                  {inv.client?.email}
                </p>
              </div>
            </div>

            <div className="col-span-2 text-sm font-bold text-gray-500">
              {inv.issueDate}
            </div>

            <div className="col-span-2">
              <InvoiceStatusBadge status={inv.status} />
            </div>

            <div className="col-span-2 flex items-center justify-end gap-2">
              <span className="text-sm font-black text-gray-900">
                {formatCurrency(inv.grandTotal, inv.currency)}
              </span>
              <ArrowUpRight
                size={16}
                className="text-gray-300 group-hover:text-emerald-500 transition-colors flex-shrink-0"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-8 py-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-t-2 border-gray-100">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 font-medium">
            Showing{" "}
            <span className="font-bold text-gray-700">{invoices.length}</span>{" "}
            {invoices.length === 1 ? "invoice" : "invoices"}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-xs text-gray-500 font-medium">
              Active Records
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTable;
