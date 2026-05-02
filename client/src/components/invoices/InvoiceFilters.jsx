import { Search } from "lucide-react";

const FILTERS = ["All", "Draft", "Finalised", "Paid", "Cancelled"];

const InvoiceFilters = ({
  search,
  setSearch,
  activeFilter,
  setActiveFilter,
  invoices,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
      <div className="relative flex-1 w-full group">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by invoice number or client name..."
          className="w-full pl-11 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all text-sm font-medium shadow-sm hover:shadow-md placeholder:text-gray-400"
        />
      </div>

      <div className="flex items-center gap-1 p-1.5 bg-white border-2 border-gray-100 rounded-2xl overflow-x-auto w-full md:w-auto shadow-sm">
        {FILTERS.map((f) => {
          const count =
            f === "All"
              ? invoices.length
              : invoices.filter((i) => i.status === f).length;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
                activeFilter === f
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-200"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {f}
              <span
                className={`px-1.5 py-0.5 rounded-full text-xs font-black ${
                  activeFilter === f
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InvoiceFilters;
