import {
  Edit2,
  Trash2,
  Tag,
  Package,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import EmptyState from "../ui/EmptyState";

const ProductTable = ({ products, formatCurrency, onEdit, onDelete }) => {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100">
        <EmptyState
          icon={Package}
          title="No products found"
          description="Add your products or services to start building invoices faster."
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
      {/* Table Header */}
      <div className="px-8 py-5 bg-gradient-to-r from-emerald-50/50 to-amber-50/50 border-b-2 border-gray-100">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
              Product Information
            </h3>
          </div>
          <div className="col-span-3 text-right">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
              Pricing
            </h3>
          </div>
          <div className="col-span-2 text-right">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
              Tax Rate
            </h3>
          </div>
          <div className="col-span-3 text-right">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
              Actions
            </h3>
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-100">
        {products.map((product) => (
          <div
            key={product.id}
            className="group hover:bg-gradient-to-r hover:from-emerald-50/30 hover:to-amber-50/30 transition-all duration-200"
          >
            <div className="px-8 py-5 grid grid-cols-12 gap-4 items-center">
              {/* Product Name & Category */}
              <div className="col-span-4 flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all shrink-0">
                  <Package size={20} className="text-emerald-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-gray-900 text-base truncate group-hover:text-emerald-700 transition-colors">
                    {product.name}
                  </h4>
                  {product.category && (
                    <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg">
                      <Tag size={12} />
                      <span className="text-xs font-semibold">
                        {product.category}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Unit Price */}
              <div className="col-span-3 text-right">
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                  <DollarSign size={16} className="text-emerald-600" />
                  <span className="text-base font-bold text-gray-900">
                    {formatCurrency(product.unitPrice)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1.5 font-medium">
                  per unit
                </p>
              </div>

              {/* Tax Rate */}
              <div className="col-span-2 text-right">
                <div className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-xl">
                  <TrendingUp size={14} className="text-gray-500" />
                  <span className="text-sm font-bold">
                    {parseFloat(product.taxRate).toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1.5 font-medium">tax</p>
              </div>

              {/* Actions — always visible, matches ClientTable */}
              <div className="col-span-3 flex justify-end items-center gap-1.5">
                <button
                  onClick={() => onEdit(product)}
                  className="group/btn flex items-center gap-2 px-4 py-2.5 text-emerald-600 hover:text-white bg-emerald-50 hover:bg-emerald-600 rounded-xl transition-all font-semibold text-sm shadow-sm hover:shadow-md"
                  title="Edit product"
                >
                  <Edit2
                    size={16}
                    className="group-hover/btn:scale-110 transition-transform"
                  />
                  <span className="hidden lg:inline">Edit</span>
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="group/btn flex items-center gap-2 px-4 py-2.5 text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-xl transition-all font-semibold text-sm shadow-sm hover:shadow-md"
                  title="Delete product"
                >
                  <Trash2
                    size={16}
                    className="group-hover/btn:scale-110 transition-transform"
                  />
                  <span className="hidden lg:inline">Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-8 py-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-t-2 border-gray-100">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 font-medium">
            Showing{" "}
            <span className="font-bold text-gray-700">{products.length}</span>{" "}
            {products.length === 1 ? "product" : "products"}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-xs text-gray-500 font-medium">
              Active Inventory
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
