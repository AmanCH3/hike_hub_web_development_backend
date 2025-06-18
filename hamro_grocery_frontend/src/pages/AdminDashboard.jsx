// import React, { useState, useEffect } from 'react';
// import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
// import { Plus, Edit, Trash2, Search, Users, DollarSign, LogOut, Menu, X, Sun, Moon, AlertTriangle, ShoppingCart, Package, ClipboardList, Tag } from 'lucide-react';
// import { ToastContainer, toast } from 'react-toastify';
// import axios from 'axios';

// //-///////////////////////////////////////////////////////////////////////////
// // REACT QUERY CLIENT SETUP
// //-///////////////////////////////////////////////////////////////////////////

// const queryClient = new QueryClient();

// //-///////////////////////////////////////////////////////////////////////////
// // AXIOS API INSTANCE SETUP
// //-///////////////////////////////////////////////////////////////////////////

// // The base URL for your backend API
// const API_URL = "http://localhost:8081/api";

// const adminApi = axios.create({
//     baseURL: API_URL,
//     headers: {
//         'Content-Type': 'application/json',
//     }
// });

// // Axios interceptor to automatically add the JWT token to every request
// adminApi.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// //-///////////////////////////////////////////////////////////////////////////
// // API SERVICE FUNCTIONS
// //-///////////////////////////////////////////////////////////////////////////

// // --- Dashboard Stats Services ---
// const fetchDashboardStats = async () => {
//     const { data } = await adminApi.get('/dashboard/stats');
//     return data;
// };

// // --- Product Services ---
// const fetchProducts = async () => {
//     const { data } = await adminApi.get('/products');
//     return data;
// };
// const addProduct = (newProduct) => {
//     return adminApi.post('/products', newProduct);
// };
// const updateProduct = (updatedProduct) => {
//     const { id, ...payload } = updatedProduct;
//     return adminApi.put(`/products/${id}`, payload);
// };
// const deleteProduct = (productId) => {
//     return adminApi.delete(`/products/${productId}`);
// };

// // --- Category Services ---
// const fetchCategories = async () => {
//     const { data } = await adminApi.get('/categories');
//     return data;
// };
// const addCategory = (newCategory) => {
//     return adminApi.post('/categories', newCategory);
// };
// const updateCategory = (updatedCategory) => {
//     const { id, ...payload } = updatedCategory;
//     return adminApi.put(`/categories/${id}`, payload);
// };
// const deleteCategory = (categoryId) => {
//     return adminApi.delete(`/categories/${categoryId}`);
// };

// // --- Order Services ---
// const fetchOrders = async () => {
//     const { data } = await adminApi.get('/orders');
//     return data;
// };
// const updateOrderStatus = ({ orderId, status }) => {
//     return adminApi.put(`/orders/${orderId}`, { status });
// };

// // --- User Services ---
// const fetchUsers = async () => {
//     const { data } = await adminApi.get('/admin/users');
//     // CORRECTED: Return the nested 'data' array from the response object
//     return data.data;
// };


// const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

// //-///////////////////////////////////////////////////////////////////////////
// // REUSABLE UI COMPONENTS
// //-///////////////////////////////////////////////////////////////////////////

// const getStatusColor = (status) => {
//     switch (status) {
//         case 'Delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
//         case 'Shipped': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
//         case 'Pending': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
//         case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
//         default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
//     }
// };

// const Card = ({ children, className = '' }) => (
//     <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg ${className}`}>
//         {children}
//     </div>
// );

// const Modal = ({ isOpen, onClose, title, children }) => {
//     if (!isOpen) return null;
//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg max-h-screen overflow-y-auto">
//                 <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
//                     <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
//                     <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
//                         <X size={24} />
//                     </button>
//                 </div>
//                 <div className="p-6">
//                     {children}
//                 </div>
//             </div>
//         </div>
//     );
// };

// const Button = ({ children, onClick, className = '', variant = 'primary', disabled = false, ...props }) => {
//     const baseClasses = "px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900";
//     const variants = {
//         primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
//         secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500",
//         danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
//     };
//     return (
//         <button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`} disabled={disabled} {...props}>
//             {children}
//         </button>
//     );
// };

// const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
//     if (!isOpen) return null;
//     return (
//         <Modal isOpen={isOpen} onClose={onClose} title="">
//             <div className="text-center">
//                 <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50">
//                     <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
//                 </div>
//                 <h3 className="mt-5 text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
//                 <div className="mt-2 px-7 py-3">
//                     <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
//                 </div>
//                 <div className="flex justify-center gap-3 mt-4">
//                     <Button variant="secondary" onClick={onClose}>Cancel</Button>
//                     <Button variant="danger" onClick={onConfirm}>Delete</Button>
//                 </div>
//             </div>
//         </Modal>
//     );
// };

// const Input = ({ id, label, ...props }) => (
//     <div>
//         <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
//         <input id={id} {...props} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white" />
//     </div>
// );

// const StatusBadge = ({ status }) => (
//     <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
//         {status}
//     </span>
// );

// const LoadingSpinner = () => <div className="flex justify-center items-center p-8"><div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div></div>;
// const ErrorMessage = ({ message }) => <div className="text-center text-red-500 p-8 bg-red-100 dark:bg-red-900/20 rounded-lg">{`Error: ${message}`}</div>;

// //-///////////////////////////////////////////////////////////////////////////
// // PAGE COMPONENTS
// //-///////////////////////////////////////////////////////////////////////////

// const DashboardPage = () => {
//     const { data: stats, isLoading, isError, error } = useQuery({ queryKey: ['dashboardStats'], queryFn: fetchDashboardStats });

//     if (isLoading) return <LoadingSpinner />;
//     if (isError) return <ErrorMessage message={error.message} />;

//     const safeStats = {
//         totalRevenue: 0,
//         totalOrders: 0,
//         totalCustomers: 0,
//         salesData: [],
//         topProductsData: [],
//         recentOrders: [],
//         ...stats
//     };

//     return (
//         <div className="space-y-8">
//             <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <Card className="hover:border-blue-500 border-2 border-transparent">
//                     <div className="flex items-center gap-4">
//                         <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full"><DollarSign className="text-blue-600 dark:text-blue-300" size={28}/></div>
//                         <div>
//                             <p className="text-gray-500 dark:text-gray-400 text-sm">Total Revenue</p>
//                             <p className="text-2xl font-bold text-gray-800 dark:text-white">₹{safeStats.totalRevenue?.toLocaleString()}</p>
//                         </div>
//                     </div>
//                 </Card>
//                 <Card className="hover:border-green-500 border-2 border-transparent">
//                    <div className="flex items-center gap-4">
//                         <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full"><ClipboardList className="text-green-600 dark:text-green-300" size={28}/></div>
//                         <div>
//                             <p className="text-gray-500 dark:text-gray-400 text-sm">Total Orders</p>
//                             <p className="text-2xl font-bold text-gray-800 dark:text-white">{safeStats.totalOrders}</p>
//                         </div>
//                     </div>
//                 </Card>
//                 <Card className="hover:border-indigo-500 border-2 border-transparent">
//                    <div className="flex items-center gap-4">
//                         <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full"><Users className="text-indigo-600 dark:text-indigo-300" size={28}/></div>
//                         <div>
//                             <p className="text-gray-500 dark:text-gray-400 text-sm">Total Customers</p>
//                             <p className="text-2xl font-bold text-gray-800 dark:text-white">{safeStats.totalCustomers}</p>
//                         </div>
//                     </div>
//                 </Card>
//             </div>
//             <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
//                 <Card className="lg:col-span-3">
//                     <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Sales Overview</h2>
//                     <div style={{ width: '100%', height: 300 }}>
//                         <ResponsiveContainer>
//                             <LineChart data={safeStats.salesData}><CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} /><XAxis dataKey="name" stroke="rgb(107 114 128)" /><YAxis stroke="rgb(107 114 128)"/><Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none', borderRadius: '0.5rem', color: '#fff' }}/><Legend /><Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} /></LineChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </Card>
//                 <Card className="lg:col-span-2">
//                     <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Top Products</h2>
//                         <div style={{ width: '100%', height: 300 }}>
//                         <ResponsiveContainer>
//                             <PieChart>
//                                 <Pie data={safeStats.topProductsData} dataKey="sales" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
//                                     {safeStats.topProductsData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
//                                 </Pie>
//                                 <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none', borderRadius: '0.5rem', color: '#fff' }}/>
//                                 <Legend />
//                             </PieChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </Card>
//             </div>
//              <Card>
//                 <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Orders</h2>
//                    <div className="overflow-x-auto">
//                      <table className="w-full text-left">
//                          <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
//                              <tr>
//                                  <th className="p-3">Order ID</th><th className="p-3">Customer</th><th className="p-3">Date</th><th className="p-3">Status</th><th className="p-3 text-right">Total</th>
//                              </tr>
//                          </thead>
//                          <tbody>
//                              {safeStats.recentOrders?.slice(0, 5).map(order => (
//                                  <tr key={order._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
//                                      <td className="p-3 font-medium text-gray-900 dark:text-white">#{order._id.slice(-6)}</td>
//                                      <td className="p-3 text-gray-600 dark:text-gray-300">{order.address?.firstName} {order.address?.lastName}</td>
//                                      <td className="p-3 text-gray-600 dark:text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</td>
//                                      <td className="p-3"><StatusBadge status={order.status} /></td>
//                                      <td className="p-3 text-right font-medium text-gray-900 dark:text-white">₹{order.amount}</td>
//                                  </tr>
//                              ))}
//                          </tbody>
//                      </table>
//                     </div>
//             </Card>
//         </div>
//     );
// };

// const OrdersPage = () => {
//     const queryClient = useQueryClient();
//     const [searchTerm, setSearchTerm] = useState('');
//     const { data, isLoading, isError, error } = useQuery({ queryKey: ['orders'], queryFn: fetchOrders });

//     const mutation = useMutation({
//         mutationFn: updateOrderStatus,
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['orders'] });
//             toast.success("Order status updated successfully!");
//         },
//         onError: (err) => {
//             toast.error(err.response?.data?.message || "Failed to update order status.");
//         }
//     });

//     const handleStatusChange = (orderId, status) => {
//         mutation.mutate({ orderId, status });
//     };

//     if (isLoading) return <LoadingSpinner />;
//     if (isError) return <ErrorMessage message={error.message} />;

//     const orders = Array.isArray(data) ? data : data?.orders || [];
//     const filteredOrders = orders.filter(o =>
//         (o.address?.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
//         (o.address?.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
//         o._id.toString().includes(searchTerm)
//     );

//     return (
//         <div className="space-y-6">
//             <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Order Management</h1>
//             <Card>
//                 <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
//                     <div className="relative w-full md:w-auto">
//                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//                         <input type="text" placeholder="Search by Order ID or Customer..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:w-80 pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
//                     </div>
//                 </div>
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left">
//                         <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
//                             <tr>
//                                 <th className="p-3">Order ID</th><th className="p-3">Customer</th><th className="p-3">Date</th><th className="p-3">Items</th><th className="p-3 text-right">Total</th><th className="p-3 text-center">Status</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredOrders.length > 0 ? (
//                                 filteredOrders.map(order => (
//                                     <tr key={order._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
//                                         <td className="p-3 font-medium text-gray-900 dark:text-white">#{order._id.slice(-6)}</td>
//                                         <td className="p-3 text-gray-600 dark:text-gray-300">{`${order.address?.firstName || ''} ${order.address?.lastName || ''}`}</td>
//                                         <td className="p-3 text-gray-600 dark:text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</td>
//                                         <td className="p-3 text-gray-600 dark:text-gray-300">{order.items.length}</td>
//                                         <td className="p-3 text-right font-medium">₹{order.amount.toLocaleString()}</td>
//                                         <td className="p-3 text-center">
//                                              <select 
//                                                  value={order.status} 
//                                                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                                                  className={`w-full p-1.5 text-xs rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500`}
//                                                  >
//                                                  <option>Pending</option>
//                                                  <option>Shipped</option>
//                                                  <option>Delivered</option>
//                                                  <option>Cancelled</option>
//                                              </select>
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="6" className="text-center p-8 text-gray-500 dark:text-gray-400">
//                                         No orders found.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </Card>
//         </div>
//     );
// };

// const ProductsPage = () => {
//     const queryClient = useQueryClient();
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingProduct, setEditingProduct] = useState(null);
//     const [isConfirmOpen, setConfirmOpen] = useState(false);
//     const [itemToDelete, setItemToDelete] = useState(null);

//     const { data: productsData, isLoading: productsLoading, isError: productsIsError, error: productsError } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });
//     const { data: categoriesData, isLoading: categoriesLoading, isError: categoriesIsError, error: categoriesError } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });

//     const addMutation = useMutation({ mutationFn: addProduct, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }) });
//     const updateMutation = useMutation({ mutationFn: updateProduct, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }) });
//     const deleteMutation = useMutation({ mutationFn: deleteProduct, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }) });

//     const handleAddNew = () => {
//         setEditingProduct(null);
//         setIsModalOpen(true);
//     };
    
//     const handleEdit = (product) => {
//         setEditingProduct(product);
//         setIsModalOpen(true);
//     };

//     const handleDeleteClick = (id) => {
//         setItemToDelete(id);
//         setConfirmOpen(true);
//     };
    
//     const confirmDelete = () => {
//         deleteMutation.mutate(itemToDelete, {
//             onSuccess: () => toast.success("Product deleted successfully."),
//             onError: (err) => toast.error(err.response?.data?.message || "Failed to delete product."),
//             onSettled: () => {
//                 setConfirmOpen(false);
//                 setItemToDelete(null);
//             }
//         });
//     };

//     const handleSave = (productData) => {
//         // CORRECTED: Create a new object for the payload and fix field names
//         const dataToSend = {
//             ...productData,
//             category: productData.categoryId, // Rename categoryId to category
//         };
//         delete dataToSend.categoryId; // Remove the old key

//         // CORRECTED: Add validation for required imageUrl field
//         if (!dataToSend.imageUrl) {
//             toast.error("Product Image URL is required.");
//             return; // Stop the submission
//         }

//         if (editingProduct) {
//             updateMutation.mutate({ ...dataToSend, id: editingProduct._id }, {
//                 onSuccess: () => {
//                     toast.success(`Product updated successfully!`);
//                     closeModal();
//                 },
//                 onError: (err) => toast.error(err.response?.data?.message || "Failed to update product.")
//             });
//         } else {
//             addMutation.mutate(dataToSend, {
//                 onSuccess: () => {
//                     toast.success(`Product added successfully!`);
//                     closeModal();
//                 },
//                 onError: (err) => toast.error(err.response?.data?.message || "Failed to add product.")
//             });
//         }
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//         setEditingProduct(null);
//     };

//     if (productsLoading || categoriesLoading) return <LoadingSpinner />;
//     if (productsIsError) return <ErrorMessage message={productsError.message} />;
//     if (categoriesIsError) return <ErrorMessage message={categoriesError.message} />;
    
//     const products = Array.isArray(productsData) ? productsData : productsData?.products || [];
//     const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData?.categories || [];

//     return (
//         <div className="space-y-6">
//             <div className="flex justify-between items-center">
//                 <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Product Management</h1>
//                 <Button onClick={handleAddNew}><Plus size={20} />Add New Product</Button>
//             </div>
//             <Card>
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left">
//                         <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
//                             <tr>
//                                 <th className="p-3"></th>
//                                 <th className="p-3">Product Name</th>
//                                 <th className="p-3">Category</th>
//                                 <th className="p-3 text-right">Price</th>
//                                 <th className="p-3 text-right">Stock</th>
//                                 <th className="p-3 text-center">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {products.length > 0 ? (
//                                 products.map(product => {
//                                     const category = categories?.find(c => c._id === product.category); // Updated to check product.category
//                                     return (
//                                     <tr key={product._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
//                                         <td className="p-3">
//                                             <img src={product.imageUrl || 'https://placehold.co/100x100/CCCCCC/FFFFFF?text=No+Image'} alt={product.name} className="w-12 h-12 object-cover rounded-md"/>
//                                         </td>
//                                         <td className="p-3 font-medium text-gray-900 dark:text-white">{product.name}</td>
//                                         <td className="p-3 text-gray-600 dark:text-gray-300">{category ? category.name : 'Uncategorized'}</td>
//                                         <td className="p-3 text-right font-medium">₹{product.price.toLocaleString()}</td>
//                                         <td className="p-3 text-right font-medium">{product.stock}</td>
//                                         <td className="p-3 text-center">
//                                             <div className="flex justify-center items-center gap-2">
//                                                 <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1"><Edit size={18} /></button>
//                                                 <button onClick={() => handleDeleteClick(product._id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"><Trash2 size={18} /></button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 )})
//                             ) : (
//                                 <tr>
//                                     <td colSpan="6" className="text-center p-8 text-gray-500 dark:text-gray-400">
//                                         No products found. Click "Add New Product" to get started.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </Card>
//             <ProductFormModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} product={editingProduct} categories={categories} />
//             <ConfirmationModal isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={confirmDelete} title="Delete Product" message="Are you sure you want to delete this product? This action is permanent."/>
//         </div>
//     );
// };

// const CategoriesPage = () => {
//     const queryClient = useQueryClient();
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingCategory, setEditingCategory] = useState(null);
//     const [isConfirmOpen, setConfirmOpen] = useState(false);
//     const [itemToDelete, setItemToDelete] = useState(null);

//     const { data, isLoading, isError, error } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
//     const addMutation = useMutation({ mutationFn: addCategory, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }) });
//     const updateMutation = useMutation({ mutationFn: updateCategory, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }) });
//     const deleteMutation = useMutation({ mutationFn: deleteCategory, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }) });

//     const handleAddNew = () => {
//         setEditingCategory(null);
//         setIsModalOpen(true);
//     };

//     const handleEdit = (category) => {
//         setEditingCategory(category);
//         setIsModalOpen(true);
//     };

//     const handleDeleteClick = (id) => {
//         setItemToDelete(id);
//         setConfirmOpen(true);
//     };
    
//     const confirmDelete = () => {
//         deleteMutation.mutate(itemToDelete, {
//             onSuccess: () => toast.success("Category deleted."),
//             onError: (err) => toast.error(err.response?.data?.message || "Failed to delete category."),
//             onSettled: () => {
//                 setConfirmOpen(false);
//                 setItemToDelete(null);
//             }
//         });
//     };
    
//     const handleSave = (categoryData) => {
//         const mutation = editingCategory ? updateMutation : addMutation;
//         const dataToSave = editingCategory ? { ...categoryData, id: editingCategory._id } : categoryData;
        
//         mutation.mutate(dataToSave, {
//             onSuccess: () => {
//                 toast.success(`Category ${editingCategory ? 'updated' : 'added'} successfully!`);
//                 closeModal();
//             },
//             onError: (err) => toast.error(err.response?.data?.message || "An error occurred.")
//         });
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//         setEditingCategory(null);
//     }
    
//     if (isLoading) return <LoadingSpinner />;
//     if (isError) return <ErrorMessage message={error.message} />;

//     const categories = Array.isArray(data) ? data : data?.categories || [];

//     return (
//         <div className="space-y-6">
//             <div className="flex justify-between items-center">
//                 <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Category Management</h1>
//                 <Button onClick={handleAddNew}><Plus size={20} />Add New Category</Button>
//             </div>
//             <Card>
//                 <div className="space-y-4">
//                     {categories.length > 0 ? (
//                         categories.map(category => (
//                             <div key={category._id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700">
//                                 <span className="font-medium text-gray-800 dark:text-gray-200">{category.name}</span>
//                                  <div className="flex gap-2">
//                                      <button onClick={() => handleEdit(category)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"><Edit size={18} /></button>
//                                      <button onClick={() => handleDeleteClick(category._id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"><Trash2 size={18} /></button>
//                                  </div>
//                             </div>
//                         ))
//                     ) : (
//                          <div className="text-center p-8 text-gray-500 dark:text-gray-400">
//                              No categories found.
//                          </div>
//                     )}
//                 </div>
//             </Card>
//             <CategoryFormModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} category={editingCategory} />
//             <ConfirmationModal isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={confirmDelete} title="Delete Category" message="Are you sure? Deleting a category might affect products associated with it."/>
//         </div>
//     );
// };

// const UsersPage = () => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const { data, isLoading, isError, error } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });
    
//     if (isLoading) return <LoadingSpinner />;
//     if (isError) return <ErrorMessage message={error.message} />;

//     const users = Array.isArray(data) ? data : data?.users || [];

//     const filteredUsers = users.filter(user => 
//         (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) || 
//         (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
//     );

//     return (
//         <div className="space-y-6">
//             <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Customer Management</h1>
//             <Card>
//                 <div className="relative w-full md:w-1/3 mb-4">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//                     <input 
//                         type="text" 
//                         placeholder="Search by name or email..." 
//                         value={searchTerm} 
//                         onChange={(e) => setSearchTerm(e.target.value)} 
//                         className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                 </div>
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left">
//                         <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
//                             <tr>
//                                 <th className="p-3">Name</th>
//                                 <th className="p-3">Email</th>
//                                 <th className="p-3">Joined On</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredUsers.length > 0 ? (
//                                 filteredUsers.map(user => (
//                                     <tr key={user._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
//                                         <td className="p-3 font-medium text-gray-900 dark:text-white">{user.fullName}</td>
//                                         <td className="p-3 text-gray-600 dark:text-gray-300">{user.email}</td>
//                                         <td className="p-3 text-gray-600 dark:text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="3" className="text-center p-8 text-gray-500 dark:text-gray-400">
//                                         {searchTerm 
//                                             ? "No customers match your search." 
//                                             : "No customers found."
//                                         }
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </Card>
//         </div>
//     );
// };

// //-///////////////////////////////////////////////////////////////////////////
// // FORM MODAL COMPONENTS
// //-///////////////////////////////////////////////////////////////////////////

// const ProductFormModal = ({ isOpen, onClose, onSave, product, categories }) => {
//     const [formData, setFormData] = useState({ name: '', categoryId: '', price: '', stock: '', imageUrl: ''});

//     useEffect(() => {
//         if (product) { 
//             setFormData({ 
//                 name: product.name || '', 
//                 categoryId: product.categoryId || product.category || '', // Handles both cases
//                 price: product.price || '', 
//                 stock: product.stock || '', 
//                 imageUrl: product.imageUrl || '' 
//             });
//         } else { 
//             setFormData({ name: '', categoryId: '', price: '', stock: '', imageUrl: ''}); 
//         }
//     }, [product, isOpen]);

//     const handleChange = (e) => {
//         const {name, value} = e.target;
//         setFormData(prev => ({...prev, [name]: value}));
//     }

//     const handleSubmit = (e) => { e.preventDefault(); onSave(formData); }
    
//     return (
//         <Modal isOpen={isOpen} onClose={onClose} title={product ? 'Edit Product' : 'Add New Product'}>
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <Input id="name" name="name" label="Product Name" value={formData.name} onChange={handleChange} required />
//                 <div>
//                      <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
//                      <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleChange} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white">
//                          <option value="">Select a category</option>
//                          {(categories || []).map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
//                      </select>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                     <Input id="price" name="price" label="Price (₹)" type="number" value={formData.price} onChange={handleChange} required />
//                     <Input id="stock" name="stock" label="Stock Quantity" type="number" value={formData.stock} onChange={handleChange} required />
//                 </div>
//                 <Input id="imageUrl" name="imageUrl" label="Product Image URL" value={formData.imageUrl} onChange={handleChange} required />
//                 <div className="flex justify-end gap-3 pt-4">
//                     <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
//                     <Button type="submit" variant="primary">{product ? 'Save Changes' : 'Add Product'}</Button>
//                 </div>
//             </form>
//         </Modal>
//     );
// };

// const CategoryFormModal = ({ isOpen, onClose, onSave, category }) => {
//     const [name, setName] = useState('');

//     useEffect(() => {
//         if(category) { setName(category.name); } 
//         else { setName(''); }
//     }, [category, isOpen]);

//     const handleSubmit = (e) => { 
//         e.preventDefault();
//         onSave({ name });
//     };
    
//     return (
//         <Modal isOpen={isOpen} onClose={onClose} title={category ? 'Edit Category' : 'Add New Category'}>
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <Input id="name" name="name" label="Category Name" value={name} onChange={(e) => setName(e.target.value)} required />
//                 <div className="flex justify-end gap-3 pt-4">
//                     <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
//                     <Button type="submit" variant="primary">{category ? 'Save Changes' : 'Add Category'}</Button>
//                 </div>
//             </form>
//         </Modal>
//     );
// };

// //-///////////////////////////////////////////////////////////////////////////
// // MAIN APP COMPONENT & LAYOUT
// //-///////////////////////////////////////////////////////////////////////////

// const AdminDashboard = () => {
//     const [activePage, setActivePage] = useState('dashboard');
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const [isDarkMode, setIsDarkMode] = useState(false);
    
//     useEffect(() => {
//         // This effect adds the react-toastify CSS to the document's head
//         const styleId = 'react-toastify-css';
//         if (!document.getElementById(styleId)) {
//             const link = document.createElement('link');
//             link.id = styleId;
//             link.rel = 'stylesheet';
//             link.href = 'https://cdn.jsdelivr.net/npm/react-toastify@9.1.3/dist/ReactToastify.min.css';
//             document.head.appendChild(link);
//         }
//     }, []);

//     useEffect(() => {
//         const handleHashChange = () => {
//             const hash = window.location.hash.replace('#', '');
//             const validPages = ['dashboard', 'orders', 'products', 'categories', 'users', 'logout'];
//             if(validPages.includes(hash)) { setActivePage(hash); } 
//             else { setActivePage('dashboard'); }
//         };
//         window.addEventListener('hashchange', handleHashChange);
//         handleHashChange();
//         return () => window.removeEventListener('hashchange', handleHashChange);
//     }, []);
    
//     useEffect(() => {
//         if (isDarkMode) { document.documentElement.classList.add('dark'); } 
//         else { document.documentElement.classList.remove('dark'); }
//     }, [isDarkMode]);
    
//     const renderPage = () => {
//         switch (activePage) {
//             case 'dashboard': return <DashboardPage />;
//             case 'orders': return <OrdersPage />;
//             case 'products': return <ProductsPage />;
//             case 'categories': return <CategoriesPage />;
//             case 'users': return <UsersPage />;
//             case 'logout':
//                 localStorage.removeItem('token');
//                 window.location.href = '/'; 
//                 return <LoadingSpinner/>;
//             default: return <DashboardPage />;
//         }
//     };
    
//     const NavLink = ({ page, icon: Icon, children }) => (
//         <a href={`#${page}`} onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 ${ activePage === page ? 'bg-blue-600 text-white font-semibold shadow-lg' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
//             <Icon size={22} />
//             <span className="text-md">{children}</span>
//         </a>
//     );

//     const SidebarContent = () => (
//         <>
//             <div className="p-4 flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                     <div className="bg-blue-600 p-2 rounded-lg"><ShoppingCart className="text-white" size={24}/></div>
//                     <h1 className="text-2xl font-bold text-gray-800 dark:text-white">GrocerAdmin</h1>
//                 </div>
//                  <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500 dark:text-gray-400"><X size={24} /></button>
//             </div>
//             <nav className="flex-1 px-4 py-6 space-y-2">
//                 <NavLink page="dashboard" icon={BarChart}>Dashboard</NavLink>
//                 <NavLink page="orders" icon={ClipboardList}>Orders</NavLink>
//                 <NavLink page="products" icon={Package}>Products</NavLink>
//                 <NavLink page="categories" icon={Tag}>Categories</NavLink>
//                 <NavLink page="users" icon={Users}>Customers</NavLink>
//             </nav>
//             <div className="p-4 border-t border-gray-200 dark:border-gray-700">
//                  <a href="#logout" className="flex items-center gap-4 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
//                      <LogOut size={22} /><span className="text-md">Logout</span>
//                  </a>
//             </div>
//         </>
//     );
    
//     const handleImageError = (e) => {
//         e.target.onerror = null; 
//         e.target.src=`https://placehold.co/40x40/e2e8f0/4a5568?text=GA`;
//     }

//     return (
//         <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100`}>
//             {/* Mobile Sidebar */}
//             <div className={`fixed inset-0 z-40 flex lg:hidden transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
//                  <div className="w-72 bg-white dark:bg-gray-800 shadow-lg flex flex-col"><SidebarContent /></div>
//                  <div className="flex-1 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)}></div>
//             </div>
            
//             {/* Desktop Sidebar */}
//             <aside className="w-72 bg-white dark:bg-gray-800 shadow-md hidden lg:flex flex-col flex-shrink-0"><SidebarContent /></aside>
            
//             <div className="flex-1 flex flex-col overflow-hidden">
//                 <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center">
//                     <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-600 dark:text-gray-300"><Menu size={28} /></button>
//                     <div className="hidden lg:block"></div> {/* Spacer */}
//                     <div className="flex items-center gap-4">
//                         <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
//                            {isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}
//                         </button>
//                         <div className="flex items-center gap-3">
//                             <img 
//                                 src={`https://i.pravatar.cc/150?u=groceradmin`} 
//                                 alt="Admin" 
//                                 className="w-10 h-10 rounded-full object-cover"
//                                 onError={handleImageError} 
//                             />
//                             <div>
//                                 <p className="font-semibold text-sm">Admin</p>
//                                 <p className="text-xs text-gray-500 dark:text-gray-400">Store Manager</p>
//                             </div>
//                         </div>
//                     </div>
//                 </header>
//                 <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6 md:p-8">
//                     {renderPage()}
//                 </main>
//             </div>
//         </div>
//     );
// };

// //-///////////////////////////////////////////////////////////////////////////
// // ROOT APP COMPONENT
// //-///////////////////////////////////////////////////////////////////////////
// const App = () => {
//   return (
//     <QueryClientProvider client={queryClient}>
//         <AdminDashboard />
//         <ToastContainer
//             position="bottom-right"
//             autoClose={5000}
//             hideProgressBar={false}
//             newestOnTop={false}
//             closeOnClick
//             rtl={false}
//             pauseOnFocusLoss
//             draggable
//             pauseOnHover
//             theme="colored"
//         />
//     </QueryClientProvider>
//   );
// };

// export default App;





import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Plus, Edit, Trash2, Search, Users, DollarSign, LogOut, Menu, X, Sun, Moon, AlertTriangle, ShoppingCart, Package, ClipboardList, Tag } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

//-///////////////////////////////////////////////////////////////////////////
// REACT QUERY CLIENT SETUP
//-///////////////////////////////////////////////////////////////////////////

const queryClient = new QueryClient();

//-///////////////////////////////////////////////////////////////////////////
// AXIOS API INSTANCE SETUP
//-///////////////////////////////////////////////////////////////////////////

// The base URL for your backend API
const API_URL = "http://localhost:8081/api";

const adminApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Axios interceptor to automatically add the JWT token to every request
adminApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//-///////////////////////////////////////////////////////////////////////////
// API SERVICE FUNCTIONS
//-///////////////////////////////////////////////////////////////////////////

// --- Dashboard Stats Services ---
const fetchDashboardStats = async () => {
    const { data } = await adminApi.get('/dashboard/stats');
    return data;
};

// --- Product Services ---
const fetchProducts = async () => {
    const { data } = await adminApi.get('/products');
    return data;
};
const addProduct = (newProduct) => {
    return adminApi.post('/products', newProduct);
};
const updateProduct = (updatedProduct) => {
    const { id, ...payload } = updatedProduct;
    return adminApi.put(`/products/${id}`, payload);
};
const deleteProduct = (productId) => {
    return adminApi.delete(`/products/${productId}`);
};

// --- Category Services ---
const fetchCategories = async () => {
    const { data } = await adminApi.get('/categories');
    return data;
};
const addCategory = (newCategory) => {
    return adminApi.post('/categories', newCategory);
};
const updateCategory = (updatedCategory) => {
    const { id, ...payload } = updatedCategory;
    return adminApi.put(`/categories/${id}`, payload);
};
const deleteCategory = (categoryId) => {
    return adminApi.delete(`/categories/${categoryId}`);
};

// --- Order Services ---
const fetchOrders = async () => {
    const { data } = await adminApi.get('/orders');
    return data;
};
const updateOrderStatus = ({ orderId, status }) => {
    return adminApi.put(`/orders/${orderId}`, { status });
};

// --- User Services ---
const fetchUsers = async () => {
    const { data } = await adminApi.get('/admin/users');
    return data.data;
};


const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

//-///////////////////////////////////////////////////////////////////////////
// REUSABLE UI COMPONENTS
//-///////////////////////////////////////////////////////////////////////////

const getStatusColor = (status) => {
    switch (status) {
        case 'Delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'Shipped': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'Pending': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
};

const Card = ({ children, className = '' }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg ${className}`}>
        {children}
    </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg max-h-screen overflow-y-auto">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

const Button = ({ children, onClick, className = '', variant = 'primary', disabled = false, ...props }) => {
    const baseClasses = "px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900";
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };
    return (
        <button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`} disabled={disabled} {...props}>
            {children}
        </button>
    );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="">
            <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="mt-5 text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
                <div className="mt-2 px-7 py-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
                </div>
                <div className="flex justify-center gap-3 mt-4">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button variant="danger" onClick={onConfirm}>Delete</Button>
                </div>
            </div>
        </Modal>
    );
};

const Input = ({ id, label, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <input id={id} {...props} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white" />
    </div>
);

const StatusBadge = ({ status }) => (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
        {status}
    </span>
);

const LoadingSpinner = () => <div className="flex justify-center items-center p-8"><div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div></div>;
const ErrorMessage = ({ message }) => <div className="text-center text-red-500 p-8 bg-red-100 dark:bg-red-900/20 rounded-lg">{`Error: ${message}`}</div>;

//-///////////////////////////////////////////////////////////////////////////
// PAGE COMPONENTS
//-///////////////////////////////////////////////////////////////////////////

const DashboardPage = () => {
    const { data: stats, isLoading, isError, error } = useQuery({ queryKey: ['dashboardStats'], queryFn: fetchDashboardStats });

    if (isLoading) return <LoadingSpinner />;
    if (isError) return <ErrorMessage message={error.message} />;

    const safeStats = {
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        salesData: [],
        topProductsData: [],
        recentOrders: [],
        ...stats
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:border-blue-500 border-2 border-transparent">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full"><DollarSign className="text-blue-600 dark:text-blue-300" size={28}/></div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">₹{safeStats.totalRevenue?.toLocaleString()}</p>
                        </div>
                    </div>
                </Card>
                <Card className="hover:border-green-500 border-2 border-transparent">
                   <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full"><ClipboardList className="text-green-600 dark:text-green-300" size={28}/></div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{safeStats.totalOrders}</p>
                        </div>
                    </div>
                </Card>
                <Card className="hover:border-indigo-500 border-2 border-transparent">
                   <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full"><Users className="text-indigo-600 dark:text-indigo-300" size={28}/></div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Customers</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{safeStats.totalCustomers}</p>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <Card className="lg:col-span-3">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Sales Overview</h2>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={safeStats.salesData}><CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} /><XAxis dataKey="name" stroke="rgb(107 114 128)" /><YAxis stroke="rgb(107 114 128)"/><Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none', borderRadius: '0.5rem', color: '#fff' }}/><Legend /><Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} /></LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card className="lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Top Products</h2>
                        <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={safeStats.topProductsData} dataKey="sales" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {safeStats.topProductsData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none', borderRadius: '0.5rem', color: '#fff' }}/>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
             <Card>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Orders</h2>
                   <div className="overflow-x-auto">
                     <table className="w-full text-left">
                         <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                             <tr>
                                 <th className="p-3">Order ID</th><th className="p-3">Customer</th><th className="p-3">Date</th><th className="p-3">Status</th><th className="p-3 text-right">Total</th>
                             </tr>
                         </thead>
                         <tbody>
                             {safeStats.recentOrders?.slice(0, 5).map(order => (
                                 <tr key={order._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                     <td className="p-3 font-medium text-gray-900 dark:text-white">#{order._id.slice(-6)}</td>
                                     <td className="p-3 text-gray-600 dark:text-gray-300">{order.address?.firstName} {order.address?.lastName}</td>
                                     <td className="p-3 text-gray-600 dark:text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</td>
                                     <td className="p-3"><StatusBadge status={order.status} /></td>
                                     <td className="p-3 text-right font-medium text-gray-900 dark:text-white">₹{order.amount}</td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                    </div>
            </Card>
        </div>
    );
};

const OrdersPage = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const { data, isLoading, isError, error } = useQuery({ queryKey: ['orders'], queryFn: fetchOrders });

    const mutation = useMutation({
        mutationFn: updateOrderStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            toast.success("Order status updated successfully!");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to update order status.");
        }
    });

    const handleStatusChange = (orderId, status) => {
        mutation.mutate({ orderId, status });
    };

    if (isLoading) return <LoadingSpinner />;
    if (isError) return <ErrorMessage message={error.message} />;

    const orders = Array.isArray(data) ? data : data?.orders || [];
    const filteredOrders = orders.filter(o =>
        (o.address?.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (o.address?.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        o._id.toString().includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Order Management</h1>
            <Card>
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" placeholder="Search by Order ID or Customer..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:w-80 pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-3">Order ID</th><th className="p-3">Customer</th><th className="p-3">Date</th><th className="p-3">Items</th><th className="p-3 text-right">Total</th><th className="p-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map(order => (
                                    <tr key={order._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                        <td className="p-3 font-medium text-gray-900 dark:text-white">#{order._id.slice(-6)}</td>
                                        <td className="p-3 text-gray-600 dark:text-gray-300">{`${order.address?.firstName || ''} ${order.address?.lastName || ''}`}</td>
                                        <td className="p-3 text-gray-600 dark:text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="p-3 text-gray-600 dark:text-gray-300">{order.items.length}</td>
                                        <td className="p-3 text-right font-medium">₹{order.amount.toLocaleString()}</td>
                                        <td className="p-3 text-center">
                                             <select 
                                                 value={order.status} 
                                                 onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                 className={`w-full p-1.5 text-xs rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500`}
                                                 >
                                                 <option>Pending</option>
                                                 <option>Shipped</option>
                                                 <option>Delivered</option>
                                                 <option>Cancelled</option>
                                             </select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center p-8 text-gray-500 dark:text-gray-400">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

const ProductsPage = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const { data: productsData, isLoading: productsLoading, isError: productsIsError, error: productsError } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });
    const { data: categoriesData, isLoading: categoriesLoading, isError: categoriesIsError, error: categoriesError } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });

    const addMutation = useMutation({ mutationFn: addProduct, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }) });
    const updateMutation = useMutation({ mutationFn: updateProduct, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }) });
    const deleteMutation = useMutation({ mutationFn: deleteProduct, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }) });

    const handleAddNew = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };
    
    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id) => {
        setItemToDelete(id);
        setConfirmOpen(true);
    };
    
    const confirmDelete = () => {
        deleteMutation.mutate(itemToDelete, {
            onSuccess: () => toast.success("Product deleted successfully."),
            onError: (err) => toast.error(err.response?.data?.message || "Failed to delete product."),
            onSettled: () => {
                setConfirmOpen(false);
                setItemToDelete(null);
            }
        });
    };

    const handleSave = (productData) => {
        const dataToSend = {
            ...productData,
            category: productData.categoryId,
        };
        delete dataToSend.categoryId;

        if (!dataToSend.imageUrl) {
            toast.error("Product Image URL is required.");
            return;
        }

        if (editingProduct) {
            updateMutation.mutate({ ...dataToSend, id: editingProduct._id }, {
                onSuccess: () => {
                    toast.success(`Product updated successfully!`);
                    closeModal();
                },
                onError: (err) => toast.error(err.response?.data?.message || "Failed to update product.")
            });
        } else {
            addMutation.mutate(dataToSend, {
                onSuccess: () => {
                    toast.success(`Product added successfully!`);
                    closeModal();
                },
                onError: (err) => toast.error(err.response?.data?.message || "Failed to add product.")
            });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    if (productsLoading || categoriesLoading) return <LoadingSpinner />;
    if (productsIsError) return <ErrorMessage message={productsError.message} />;
    if (categoriesIsError) return <ErrorMessage message={categoriesError.message} />;
    
    const products = Array.isArray(productsData) ? productsData : productsData?.products || [];
    const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData?.categories || [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Product Management</h1>
                <Button onClick={handleAddNew}><Plus size={20} />Add New Product</Button>
            </div>
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-3"></th>
                                <th className="p-3">Product Name</th>
                                <th className="p-3">Category</th>
                                <th className="p-3 text-right">Price</th>
                                <th className="p-3 text-right">Stock</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map(product => (
                                    <tr key={product._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                        <td className="p-3">
                                            <img src={product.imageUrl || 'https://placehold.co/100x100/CCCCCC/FFFFFF?text=No+Image'} alt={product.name} className="w-12 h-12 object-cover rounded-md"/>
                                        </td>
                                        <td className="p-3 font-medium text-gray-900 dark:text-white">{product.name}</td>
                                        <td className="p-3 text-gray-600 dark:text-gray-300">{product.category ? product.category.name : 'Uncategorized'}</td>
                                        <td className="p-3 text-right font-medium">₹{product.price.toLocaleString()}</td>
                                        <td className="p-3 text-right font-medium">{product.stock}</td>
                                        <td className="p-3 text-center">
                                            <div className="flex justify-center items-center gap-2">
                                                <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1"><Edit size={18} /></button>
                                                <button onClick={() => handleDeleteClick(product._id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center p-8 text-gray-500 dark:text-gray-400">
                                        No products found. Click "Add New Product" to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
            <ProductFormModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} product={editingProduct} categories={categories} />
            <ConfirmationModal isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={confirmDelete} title="Delete Product" message="Are you sure you want to delete this product? This action is permanent."/>
        </div>
    );
};

const CategoriesPage = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const { data, isLoading, isError, error } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
    const addMutation = useMutation({ mutationFn: addCategory, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }) });
    const updateMutation = useMutation({ mutationFn: updateCategory, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }) });
    const deleteMutation = useMutation({ mutationFn: deleteCategory, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }) });

    const handleAddNew = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id) => {
        setItemToDelete(id);
        setConfirmOpen(true);
    };
    
    const confirmDelete = () => {
        deleteMutation.mutate(itemToDelete, {
            onSuccess: () => toast.success("Category deleted."),
            onError: (err) => toast.error(err.response?.data?.message || "Failed to delete category."),
            onSettled: () => {
                setConfirmOpen(false);
                setItemToDelete(null);
            }
        });
    };
    
    const handleSave = (categoryData) => {
        const mutation = editingCategory ? updateMutation : addMutation;
        const dataToSave = editingCategory ? { ...categoryData, id: editingCategory._id } : categoryData;
        
        mutation.mutate(dataToSave, {
            onSuccess: () => {
                toast.success(`Category ${editingCategory ? 'updated' : 'added'} successfully!`);
                closeModal();
            },
            onError: (err) => toast.error(err.response?.data?.message || "An error occurred.")
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    }
    
    if (isLoading) return <LoadingSpinner />;
    if (isError) return <ErrorMessage message={error.message} />;

    const categories = Array.isArray(data) ? data : data?.categories || [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Category Management</h1>
                <Button onClick={handleAddNew}><Plus size={20} />Add New Category</Button>
            </div>
            <Card>
                <div className="space-y-4">
                    {categories.length > 0 ? (
                        categories.map(category => (
                            <div key={category._id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <span className="font-medium text-gray-800 dark:text-gray-200">{category.name}</span>
                                 <div className="flex gap-2">
                                     <button onClick={() => handleEdit(category)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"><Edit size={18} /></button>
                                     <button onClick={() => handleDeleteClick(category._id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"><Trash2 size={18} /></button>
                                 </div>
                            </div>
                        ))
                    ) : (
                         <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                             No categories found.
                         </div>
                    )}
                </div>
            </Card>
            <CategoryFormModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} category={editingCategory} />
            <ConfirmationModal isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={confirmDelete} title="Delete Category" message="Are you sure? Deleting a category might affect products associated with it."/>
        </div>
    );
};

const UsersPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { data, isLoading, isError, error } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });
    
    if (isLoading) return <LoadingSpinner />;
    if (isError) return <ErrorMessage message={error.message} />;

    const users = Array.isArray(data) ? data : [];

    const filteredUsers = users.filter(user => 
        (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Customer Management</h1>
            <Card>
                <div className="relative w-full md:w-1/3 mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Joined On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <tr key={user._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                        <td className="p-3 font-medium text-gray-900 dark:text-white">{user.fullName}</td>
                                        <td className="p-3 text-gray-600 dark:text-gray-300">{user.email}</td>
                                        <td className="p-3 text-gray-600 dark:text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center p-8 text-gray-500 dark:text-gray-400">
                                        {searchTerm 
                                            ? "No customers match your search." 
                                            : "No customers found."
                                        }
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

//-///////////////////////////////////////////////////////////////////////////
// FORM MODAL COMPONENTS
//-///////////////////////////////////////////////////////////////////////////

const ProductFormModal = ({ isOpen, onClose, onSave, product, categories }) => {
    const [formData, setFormData] = useState({ name: '', categoryId: '', price: '', stock: '', imageUrl: ''});

    useEffect(() => {
        if (product) { 
            setFormData({ 
                name: product.name || '', 
                // CORRECTED: Correctly get the category ID when editing a product
                categoryId: product.category?._id || product.categoryId || '', 
                price: product.price || '', 
                stock: product.stock || '', 
                imageUrl: product.imageUrl || '' 
            });
        } else { 
            setFormData({ name: '', categoryId: '', price: '', stock: '', imageUrl: ''}); 
        }
    }, [product, isOpen]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    }

    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); }
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={product ? 'Edit Product' : 'Add New Product'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input id="name" name="name" label="Product Name" value={formData.name} onChange={handleChange} required />
                <div>
                     <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                     <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleChange} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white">
                         <option value="">Select a category</option>
                         {(categories || []).map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                     </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Input id="price" name="price" label="Price (₹)" type="number" value={formData.price} onChange={handleChange} required />
                    <Input id="stock" name="stock" label="Stock Quantity" type="number" value={formData.stock} onChange={handleChange} required />
                </div>
                <Input id="imageUrl" name="imageUrl" label="Product Image URL" value={formData.imageUrl} onChange={handleChange} required />
                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary">{product ? 'Save Changes' : 'Add Product'}</Button>
                </div>
            </form>
        </Modal>
    );
};

const CategoryFormModal = ({ isOpen, onClose, onSave, category }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if(category) { setName(category.name); } 
        else { setName(''); }
    }, [category, isOpen]);

    const handleSubmit = (e) => { 
        e.preventDefault();
        onSave({ name });
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={category ? 'Edit Category' : 'Add New Category'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input id="name" name="name" label="Category Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary">{category ? 'Save Changes' : 'Add Category'}</Button>
                </div>
            </form>
        </Modal>
    );
};

//-///////////////////////////////////////////////////////////////////////////
// MAIN APP COMPONENT & LAYOUT
//-///////////////////////////////////////////////////////////////////////////

const AdminDashboard = () => {
    const [activePage, setActivePage] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    
    useEffect(() => {
        // This effect adds the react-toastify CSS to the document's head
        const styleId = 'react-toastify-css';
        if (!document.getElementById(styleId)) {
            const link = document.createElement('link');
            link.id = styleId;
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/react-toastify@9.1.3/dist/ReactToastify.min.css';
            document.head.appendChild(link);
        }
    }, []);

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            const validPages = ['dashboard', 'orders', 'products', 'categories', 'users', 'logout'];
            if(validPages.includes(hash)) { setActivePage(hash); } 
            else { setActivePage('dashboard'); }
        };
        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    
    useEffect(() => {
        if (isDarkMode) { document.documentElement.classList.add('dark'); } 
        else { document.documentElement.classList.remove('dark'); }
    }, [isDarkMode]);
    
    const renderPage = () => {
        switch (activePage) {
            case 'dashboard': return <DashboardPage />;
            case 'orders': return <OrdersPage />;
            case 'products': return <ProductsPage />;
            case 'categories': return <CategoriesPage />;
            case 'users': return <UsersPage />;
            case 'logout':
                localStorage.removeItem('token');
                window.location.href = '/'; 
                return <LoadingSpinner/>;
            default: return <DashboardPage />;
        }
    };
    
    const NavLink = ({ page, icon: Icon, children }) => (
        <a href={`#${page}`} onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 ${ activePage === page ? 'bg-blue-600 text-white font-semibold shadow-lg' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            <Icon size={22} />
            <span className="text-md">{children}</span>
        </a>
    );

    const SidebarContent = () => (
        <>
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg"><ShoppingCart className="text-white" size={24}/></div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">GrocerAdmin</h1>
                </div>
                 <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500 dark:text-gray-400"><X size={24} /></button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                <NavLink page="dashboard" icon={BarChart}>Dashboard</NavLink>
                <NavLink page="orders" icon={ClipboardList}>Orders</NavLink>
                <NavLink page="products" icon={Package}>Products</NavLink>
                <NavLink page="categories" icon={Tag}>Categories</NavLink>
                <NavLink page="users" icon={Users}>Customers</NavLink>
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                 <a href="#logout" className="flex items-center gap-4 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                     <LogOut size={22} /><span className="text-md">Logout</span>
                 </a>
            </div>
        </>
    );
    
    const handleImageError = (e) => {
        e.target.onerror = null; 
        e.target.src=`https://placehold.co/40x40/e2e8f0/4a5568?text=GA`;
    }

    return (
        <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100`}>
            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-40 flex lg:hidden transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                 <div className="w-72 bg-white dark:bg-gray-800 shadow-lg flex flex-col"><SidebarContent /></div>
                 <div className="flex-1 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)}></div>
            </div>
            
            {/* Desktop Sidebar */}
            <aside className="w-72 bg-white dark:bg-gray-800 shadow-md hidden lg:flex flex-col flex-shrink-0"><SidebarContent /></aside>
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center">
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-600 dark:text-gray-300"><Menu size={28} /></button>
                    <div className="hidden lg:block"></div> {/* Spacer */}
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                           {isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}
                        </button>
                        <div className="flex items-center gap-3">
                            <img 
                                src={`https://i.pravatar.cc/150?u=groceradmin`} 
                                alt="Admin" 
                                className="w-10 h-10 rounded-full object-cover"
                                onError={handleImageError} 
                            />
                            <div>
                                <p className="font-semibold text-sm">Admin</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Store Manager</p>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6 md:p-8">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

//-///////////////////////////////////////////////////////////////////////////
// ROOT APP COMPONENT
//-///////////////////////////////////////////////////////////////////////////
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
        <AdminDashboard />
        <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
        />
    </QueryClientProvider>
  );
};

export default App;