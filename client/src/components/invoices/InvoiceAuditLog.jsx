import { History, CheckCircle, Clock, XCircle } from "lucide-react";

const statusConfig = {
  Finalised: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-100",
    icon: CheckCircle,
  },
  Paid: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-100",
    icon: CheckCircle,
  },
  Cancelled: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-100",
    icon: XCircle,
  },
  Draft: {
    bg: "bg-gray-50",
    text: "text-gray-600",
    border: "border-gray-100",
    icon: Clock,
  },
};

const InvoiceAuditLog = ({ logs }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
      <div className="px-6 py-5 bg-gradient-to-r from-emerald-50/50 to-amber-50/50 border-b-2 border-gray-100 flex items-center gap-2">
        <History size={16} className="text-emerald-600" />
        <h2 className="text-xs font-black text-gray-500 uppercase tracking-wider">
          Audit History
        </h2>
      </div>
      <div className="p-6 space-y-4">
        {logs.length === 0 ? (
          <p className="text-center py-8 text-gray-400 text-xs font-bold uppercase tracking-widest">
            No history yet
          </p>
        ) : (
          logs.map((log) => {
            const config = statusConfig[log.newStatus] || statusConfig.Draft;
            return (
              <div
                key={log.id}
                className="relative pl-6 pb-6 last:pb-0 border-l-2 border-gray-100 ml-1"
              >
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-emerald-500" />
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black text-gray-900">
                      {log.user?.companyName || log.user?.email || "System"}
                    </span>
                    <span className="text-xs text-gray-400 font-bold">→</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-black uppercase tracking-widest border ${config.bg} ${config.text} ${config.border}`}
                    >
                      {log.newStatus}
                    </span>
                  </div>
                  {log.oldStatus && (
                    <p className="text-xs text-gray-400 font-medium">
                      From <span className="font-bold">{log.oldStatus}</span>
                    </p>
                  )}
                  <p className="text-xs text-gray-300 font-medium">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default InvoiceAuditLog;
