import { CheckCircle, Clock, XCircle } from "lucide-react";

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

const InvoiceStatusBadge = ({ status, className = "" }) => {
  const cfg = statusConfig[status] || statusConfig.Draft;
  const Icon = cfg.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border-2 ${cfg.bg} ${cfg.text} ${cfg.border} ${className}`}
    >
      <Icon size={12} />
      {status}
    </span>
  );
};

export default InvoiceStatusBadge;
