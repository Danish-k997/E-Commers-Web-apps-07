import { deleteProduct, updateProduct } from "../Server/AdminServer";
import { toast } from "react-toastify";
import { useState,useContext } from "react";
import type { ProductType } from "../Types/ProductsType";
import { MdDeleteOutline, MdEditSquare, MdCloudUpload, MdClose } from "react-icons/md";
import { AdminContext } from "../Context/AdminContext";

const ProductsList = () => {
  const context = useContext(AdminContext)
  const products = context.products
  const setProducts = context.setProducts
  const productsloading = context.productsloading
  const error = context.error
  const setError = context.setError
  
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    bestseller: false,
    category: "",
    size: "",
    image: null as File | null,
  });

 

  const onDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      setDeletingId(id);
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch {
      setError("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (product: ProductType) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: String(product.price),
      description: product.description,
      category: product.category,
      size: product.sizes?.join(", ") || "",
      bestseller: product.bestseller || false,
      image: null,
    });
  };

  const handleUpdate = async () => {
    if (!editingProduct) return;
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'image') data.append(key, String(value));
    });
    if (formData.image) data.append("image", formData.image);

    try {
      const res = await updateProduct(editingProduct._id, data);
      setProducts(prev => prev.map(p => p._id === editingProduct._id ? res.data.product : p));
      toast.success("Product updated successfully");
      setEditingProduct(null);
    } catch {
      console.log(error);
      setError("Update failed");
      
    }
  };   
  

  if (productsloading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
          <p className="text-gray-500 text-sm">Manage your inventory and product details</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
          <span className="text-gray-600 font-medium">Total Products: </span>
          <span className="text-indigo-600 font-bold">{products.length}</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {products.map(product => (
          <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-start gap-3">
              <img
                src={product.images[0]}
                className="w-14 h-14 rounded-lg object-cover border border-gray-100 shrink-0"
                alt=""
              />
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-gray-900 truncate">{product.name}</div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full uppercase">
                {product.category}
              </span>
              <span className="font-semibold text-gray-700">${product.price}</span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              {product.bestseller ? (
                <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">Bestseller</span>
              ) : (
                <span className="text-gray-400 text-xs">Standard</span>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(product)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <MdEditSquare size={20} />
                </button>
                <button
                  onClick={() => onDeleteProduct(product._id)}
                  disabled={deletingId === product._id}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
                >
                  <MdDeleteOutline size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Container */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Product</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Price</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(product => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.images[0]} 
                        className="w-12 h-12 rounded-lg object-cover border border-gray-100" 
                        alt="" 
                      />
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500 truncate w-48">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full uppercase">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-700">${product.price}</td>
                  <td className="px-6 py-4">
                    {product.bestseller ? (
                      <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">Bestseller</span>
                    ) : (
                      <span className="text-gray-400 text-xs">Standard</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEditClick(product)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <MdEditSquare size={20} />
                      </button>
                      <button 
                        onClick={() => onDeleteProduct(product._id)}
                        disabled={deletingId === product._id}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
                      >
                        <MdDeleteOutline size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setEditingProduct(null)}></div>
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Edit Product</h2>
              <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600">
                <MdClose size={24} />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Upload</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <MdCloudUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                        <span>Upload a file</span>
                        <input type="file" className="sr-only" onChange={e => setFormData({ ...formData, image: e.target.files?.[0] || null })} />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">{formData.image ? formData.image.name : "PNG, JPG up to 10MB"}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="bestseller"
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  checked={formData.bestseller}
                  onChange={e => setFormData({ ...formData, bestseller: e.target.checked })}
                />
                <label htmlFor="bestseller" className="text-sm font-medium text-gray-700">Mark as Bestseller</label>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t bg-gray-50 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg transition-all shadow-md active:scale-[0.98]"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingProduct(null)}
                className="flex-1 bg-white border border-gray-300 text-gray-700 font-bold py-2.5 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsList