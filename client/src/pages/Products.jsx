// import { useState, useEffect, useMemo } from 'react';
// import { useAppStore } from '../store/useAppStore';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useAuthStore } from '../store/useAuthStore';
// import { productSchema } from '../validations/product.schema';
// import { Package, Plus, Search, ArrowLeft, Loader2 } from 'lucide-react';
// import ProductTable from '../components/products/ProductTable';
// import ProductForm from '../components/products/ProductForm';

// const Products = () => {
//   const { formatCurrency, user } = useAuthStore();
//   const { products, loading, fetchProducts, createProduct, updateProduct, deleteProduct } = useAppStore();
  
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [saving, setSaving] = useState(false);

//   const currencySymbol = useMemo(() => formatCurrency(0).replace(/[0-9.,\s]/g, ''), [formatCurrency]);

//   const { register, handleSubmit, reset, formState: { errors } } = useForm({
//     resolver: zodResolver(productSchema),
//     defaultValues: { name: '', unitPrice: 0, taxRate: 0, category: '' }
//   });

//   useEffect(() => {
//     fetchProducts();
//   }, [fetchProducts]);

//   const onSubmit = async (data) => {
//     setSaving(true);
//     const success = editingId ? await updateProduct(editingId, data) : await createProduct(data);
//     setSaving(false);

//     if (success) {
//       setIsEditing(false);
//       setEditingId(null);
//       reset({ name: '', unitPrice: 0, taxRate: 0, category: '' });
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Delete this product? Past invoices will not be affected.')) {
//       await deleteProduct(id);
//     }
//   };

//   const openEdit = (product) => {
//     reset({
//       name: product.name,
//       unitPrice: product.unitPrice,
//       taxRate: product.taxRate,
//       category: product.category || ''
//     });
//     setEditingId(product.id);
//     setIsEditing(true);
//   };

//   const filteredProducts = useMemo(() => {
//     const q = searchTerm.toLowerCase();
//     return products.filter(p =>
//       p.name.toLowerCase().includes(q) ||
//       (p.category && p.category.toLowerCase().includes(q))
//     );
//   }, [products, searchTerm]);

//   if (loading && products.length === 0) return (
//     <div className="min-h-screen flex items-center justify-center bg-[#fcfdfe]">
//       <Loader2 className="animate-spin text-indigo-600" size={32} />
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#fcfdfe] p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
//       <div className="max-w-6xl mx-auto">
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
//           <div>
//             <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
//               <div className="p-2 bg-indigo-50 rounded-xl">
//                 <Package size={28} className="text-indigo-600" />
//               </div>
//               Inventory
//             </h1>
//             <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1.5 ml-14">
//               {products.length} Products & Services Managed
//             </p>
//           </div>

//           <div className="flex items-center gap-3">
//             {!isEditing && (
//               <div className="relative flex-1 md:w-64">
//                 <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//                 <input
//                   type="text"
//                   placeholder="Search inventory..."
//                   value={searchTerm}
//                   onChange={e => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-bold text-gray-900 shadow-sm"
//                 />
//               </div>
//             )}

//             {!isEditing ? (
//               <button
//                 onClick={() => { reset({ name: '', unitPrice: 0, taxRate: 0, category: '' }); setEditingId(null); setIsEditing(true); }}
//                 className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-gray-200 hover:-translate-y-1"
//               >
//                 <Plus size={18} /> Add Product
//               </button>
//             ) : (
//               <button
//                 onClick={() => setIsEditing(false)}
//                 className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-sm"
//               >
//                 <ArrowLeft size={18} /> Back to List
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Main Content */}
//         {isEditing ? (
//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//             <div className="lg:col-span-3">
//               <ProductForm 
//                 register={register}
//                 handleSubmit={handleSubmit}
//                 onSubmit={onSubmit}
//                 errors={errors}
//                 saving={saving}
//                 onCancel={() => setIsEditing(false)}
//                 editingId={editingId}
//                 currencySymbol={currencySymbol}
//                 currencyCode={user?.currency || 'USD'}
//               />
//             </div>

//             <div className="hidden lg:block space-y-6">
//               <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-100">
//                 <Package size={32} className="text-indigo-200 mb-4" />
//                 <h3 className="text-sm font-black uppercase tracking-widest leading-tight">Pro Inventory Tip</h3>
//                 <p className="text-indigo-100/80 text-xs font-bold mt-4 leading-relaxed">
//                   Consistent naming and categorization of your products makes searching through reports and generating invoices significantly faster.
//                 </p>
//                 <div className="mt-8 pt-8 border-t border-white/10">
//                   <p className="text-[10px] font-black uppercase tracking-tighter text-indigo-300">Need Help?</p>
//                   <p className="text-[11px] font-medium mt-1">Check our documentation for bulk import options.</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <ProductTable 
//             products={filteredProducts}
//             formatCurrency={formatCurrency}
//             onEdit={openEdit}
//             onDelete={handleDelete}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Products;


import { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../store/useAuthStore';
import { productSchema } from '../validations/product.schema';
import { Package, Plus, Search, ArrowLeft, Loader2, Sparkles, Grid3x3 } from 'lucide-react';
import ProductTable from '../components/products/ProductTable';
import ProductForm from '../components/products/ProductForm';

const Products = () => {
  const { formatCurrency, user } = useAuthStore();
  const { products, loading, fetchProducts, createProduct, updateProduct, deleteProduct } = useAppStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);

  const currencySymbol = useMemo(() => formatCurrency(0).replace(/[0-9.,\s]/g, ''), [formatCurrency]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { name: '', unitPrice: 0, taxRate: 0, category: '' }
  });

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const onSubmit = async (data) => {
    setSaving(true);
    const success = editingId ? await updateProduct(editingId, data) : await createProduct(data);
    setSaving(false);

    if (success) {
      setIsEditing(false);
      setEditingId(null);
      reset({ name: '', unitPrice: 0, taxRate: 0, category: '' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product? Past invoices will not be affected.')) {
      await deleteProduct(id);
    }
  };

  const openEdit = (product) => {
    reset({
      name: product.name,
      unitPrice: product.unitPrice,
      taxRate: product.taxRate,
      category: product.category || ''
    });
    setEditingId(product.id);
    setIsEditing(true);
  };

  const filteredProducts = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  }, [products, searchTerm]);

  if (loading && products.length === 0) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-emerald-50">
      <div className="text-center">
        <Loader2 className="animate-spin text-emerald-700 mx-auto mb-4" size={40} />
        <p className="text-sm font-semibold text-gray-600">Loading inventory...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-lg shadow-emerald-200">
                <Package size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                  Product Inventory
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-1 w-1 rounded-full bg-emerald-600"></div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {products.length} {products.length === 1 ? 'Item' : 'Items'} in catalog
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isEditing && (
              <div className="relative group">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-11 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all text-sm font-medium w-64 shadow-sm hover:shadow-md"
                />
              </div>
            )}

            {!isEditing ? (
              <button
                onClick={() => { reset({ name: '', unitPrice: 0, taxRate: 0, category: '' }); setEditingId(null); setIsEditing(true); }}
                className="group flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:-translate-y-0.5"
              >
                <Plus size={18} className="group-hover:scale-110 transition-transform" />
                Add Product
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-md"
              >
                <ArrowLeft size={18} />
                Back to List
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        {isEditing ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ProductForm 
                register={register}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                errors={errors}
                saving={saving}
                onCancel={() => setIsEditing(false)}
                editingId={editingId}
                currencySymbol={currencySymbol}
                currencyCode={user?.currency || 'USD'}
              />
            </div>

            {/* Enhanced Sidebar */}
            <div className="space-y-6">
              {/* Tips Card */}
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl p-7 text-white shadow-xl shadow-emerald-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                
                <div className="relative">
                  <div className="p-3 bg-white/20 rounded-2xl w-fit mb-4 backdrop-blur-sm">
                    <Sparkles size={24} className="text-white" />
                  </div>
                  <h3 className="text-base font-black uppercase tracking-wide leading-tight mb-3">
                    Pro Tips
                  </h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/60 mt-1.5 shrink-0"></div>
                      <p className="text-emerald-100 text-sm font-medium leading-relaxed">
                        Consistent naming makes invoice generation faster
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/60 mt-1.5 shrink-0"></div>
                      <p className="text-emerald-100 text-sm font-medium leading-relaxed">
                        Use categories to organize your catalog effectively
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/60 mt-1.5 shrink-0"></div>
                      <p className="text-emerald-100 text-sm font-medium leading-relaxed">
                        Tax rates are automatically applied to invoices
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Card */}
              <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Grid3x3 size={18} className="text-emerald-600" />
                  <h4 className="text-sm font-bold text-gray-900">Inventory Management</h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Keep your product catalog organized for seamless invoice creation and professional service delivery.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <ProductTable 
            products={filteredProducts}
            formatCurrency={formatCurrency}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Products;
