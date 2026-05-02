import { Search, Plus, Trash2, Package } from "lucide-react";

const InvoiceItemsTable = ({
  items,
  products,
  productSearch,
  setProductSearch,
  showDropdown,
  setShowDropdown,
  onAddItem,
  onUpdateQty,
  onRemoveItem,
  isSaved,
  formatCurrency,
}) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-5 bg-gradient-to-r from-emerald-50/50 to-amber-50/50 border-b-2 border-gray-100 flex items-center justify-between">
        <h2 className="text-xs font-black text-gray-500 uppercase tracking-wider">
          Line Items
        </h2>
        <span className="bg-white border-2 border-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-black">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="p-8">
        {/* Product Search */}
        {!isSaved && (
          <div className="mb-6 relative">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search products to add..."
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full pl-11 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all text-sm font-medium hover:border-gray-300 placeholder:text-gray-400"
              />
            </div>

            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border-2 border-gray-100 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto divide-y divide-gray-50">
                  {products
                    .filter((p) =>
                      p.name
                        .toLowerCase()
                        .includes(productSearch.toLowerCase()),
                    )
                    .map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onAddItem(p.id);
                          setProductSearch("");
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center justify-between px-5 py-3 hover:bg-emerald-50/50 transition-all text-left"
                      >
                        <div>
                          <p className="font-bold text-gray-900 text-sm">
                            {p.name}
                          </p>
                          <p className="text-xs text-gray-400 font-bold mt-0.5">
                            {formatCurrency(p.unitPrice)} · {p.taxRate}% Tax
                          </p>
                        </div>
                        <div className="p-1.5 bg-emerald-50 rounded-lg">
                          <Plus size={14} className="text-emerald-600" />
                        </div>
                      </button>
                    ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="py-14 text-center bg-emerald-50/20 rounded-2xl border-2 border-dashed border-emerald-100">
            <Package className="mx-auto h-10 w-10 text-emerald-200 mb-3" />
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest">
              No items added yet
            </p>
            <p className="text-gray-300 text-xs font-medium mt-1">
              Search for products above to add them
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Column Headers */}
            <div className="grid grid-cols-12 px-4 text-xs font-black text-gray-400 uppercase tracking-widest pb-3 border-b-2 border-gray-100">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className="group grid grid-cols-12 gap-2 items-center p-4 hover:bg-emerald-50/30 rounded-2xl border-2 border-transparent hover:border-emerald-100 transition-all relative"
              >
                <div className="col-span-6">
                  <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                  <p className="text-xs font-bold text-gray-400 mt-0.5">
                    Tax {item.taxRate}%
                  </p>
                </div>
                <div className="col-span-2 flex justify-center">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      onUpdateQty(item.id, Number(e.target.value))
                    }
                    className="w-14 bg-gray-50 border-2 border-transparent focus:border-emerald-200 focus:bg-white rounded-xl text-center font-bold text-gray-900 text-sm py-1 outline-none transition-all"
                    min="1"
                    disabled={isSaved}
                  />
                </div>
                <div className="col-span-2 text-right text-sm font-semibold text-gray-500">
                  {formatCurrency(item.unitPrice)}
                </div>
                <div className="col-span-2 text-right font-black text-gray-900 text-sm">
                  {formatCurrency(item.quantity * item.unitPrice)}
                </div>

                {!isSaved && (
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="absolute -right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-red-50 hover:bg-red-100 text-red-500 p-1.5 rounded-xl transition-all border-2 border-red-100"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceItemsTable;
