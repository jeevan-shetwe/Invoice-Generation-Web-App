import { Banknote, TrendingUp, AlertCircle, ArrowUpRight } from "lucide-react";

const InvoiceStats = ({
  totalRevenue,
  outstanding,
  draftCount,
  formatCurrency,
}) => {
  const stats = [
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      sub: "From paid invoices",
      color: "#16a34a",
      bg: "from-emerald-50 to-emerald-100/50",
      icon: Banknote,
    },
    {
      label: "Outstanding",
      value: formatCurrency(outstanding),
      sub: "Awaiting payment",
      color: "#0369a1",
      bg: "from-blue-50 to-blue-100/50",
      icon: TrendingUp,
    },
    {
      label: "Drafts",
      value: draftCount,
      sub: "Pending finalisation",
      color: "#d97706",
      bg: "from-amber-50 to-amber-100/50",
      icon: AlertCircle,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
      {stats.map(({ label, value, sub, color, bg, icon: Icon }) => (
        <div
          key={label}
          className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border-2 border-gray-100 shadow-lg md:shadow-xl hover:shadow-xl md:hover:shadow-2xl transition-all hover:-translate-y-1 group flex items-center gap-3 md:gap-5"
        >
          <div
            className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${bg} flex items-center justify-center flex-shrink-0`}
          >
            <Icon size={20} className="md:w-[26px] md:h-[26px]" style={{ color }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              {label}
            </p>
            <p className="text-lg md:text-2xl font-black text-gray-900 mt-0.5 md:mt-1 truncate">{value}</p>
            <p className="text-xs text-gray-400 font-bold mt-0 md:mt-0.5 hidden sm:block">{sub}</p>
          </div>
          <ArrowUpRight
            size={16}
            className="text-gray-300 group-hover:text-emerald-500 transition-colors flex-shrink-0 hidden sm:block"
          />
        </div>
      ))}
    </div>
  );
};

export default InvoiceStats;
