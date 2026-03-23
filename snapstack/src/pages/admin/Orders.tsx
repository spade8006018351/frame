import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { Search, Filter, Eye, MoreHorizontal, Loader2, ChevronRight, ChevronLeft, Download } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Link } from 'react-router-dom';
import { Order, OrderStatus } from '../../types';

const STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    let isMounted = true;

    async function fetchOrders() {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (!isMounted) return;
        if (fetchError) throw fetchError;
        
        console.log('Fetched orders:', data);
        setOrders(data || []);
      } catch (err: any) {
        if (!isMounted) return;
        console.error('Fetch Orders Error:', err);
        setError(err.message || 'Failed to fetch orders.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchOrders();
    return () => { isMounted = false; };
  }, []);

  const updateStatus = async (orderId: string, field: 'order_status' | 'payment_status', value: string) => {
    try {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ [field]: value })
        .eq('id', orderId);

      if (updateError) throw updateError;
      
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, [field]: value } : o));
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const filteredOrders = orders.filter(order => 
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_phone.includes(searchTerm) ||
    order.id.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const seedMockData = async () => {
    setIsLoading(true);
    try {
      const mockOrders = [
        { customer_name: 'John Doe', customer_phone: '9876543210', address: 'Hostel 1, Room 101', image_url: 'https://picsum.photos/seed/1/400/600', frame_type: 'Classic Black', quantity: 1, total_amount: 299, payment_status: 'Paid', order_status: 'Delivered', created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
        { customer_name: 'Jane Smith', customer_phone: '9123456789', address: 'Hostel 4, Room 402', image_url: 'https://picsum.photos/seed/2/400/600', frame_type: 'Modern White', quantity: 2, total_amount: 598, payment_status: 'Pending', order_status: 'Pending', created_at: new Date(Date.now() - 86400000 * 4).toISOString() },
      ];

      const { error: seedError } = await supabase.from('orders').insert(mockOrders);
      if (seedError) throw seedError;
      
      window.location.reload();
    } catch (err: any) {
      console.error('Failed to seed data:', err);
      alert('Failed to seed data: ' + err.message);
      setIsLoading(false);
    }
  };

  const checkSchema = async () => {
    try {
      const { data, error } = await supabase.from('orders').select('*').limit(1);
      if (error) throw error;
      if (data && data.length > 0) {
        alert('Table columns: ' + Object.keys(data[0]).join(', '));
      } else {
        alert('Table is empty, cannot check columns. Try seeding data first.');
      }
    } catch (err: any) {
      alert('Schema check failed: ' + err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Orders</h1>
            <p className="text-black/40 font-medium">Manage and track all customer print orders.</p>
          </div>
          <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-[32px] border border-black/5 shadow-sm flex flex-col md:flex-row gap-6 items-center">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20" />
            <input 
              type="text" 
              placeholder="Search by name, phone or order ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter className="w-5 h-5 text-black/20" />
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-black/5 border-none rounded-2xl px-6 py-3 text-sm font-bold focus:ring-0 w-full md:w-48"
            >
              <option>All</option>
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Processing</option>
              <option>Printed</option>
              <option>Shipped</option>
              <option>Delivered</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-[40px] border border-black/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/5 border-b border-black/5">
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-black/40">Order ID</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-black/40">Customer Name</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-black/40">Phone Number</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-black/40">Image Preview</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-black/40">Frame Type</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-black/40 text-center">Quantity</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-black/40">Amount</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-black/40">Status</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-black/40 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-black/10 mx-auto" />
                        <button 
                          onClick={() => setIsLoading(false)}
                          className="text-[10px] font-bold uppercase tracking-widest text-black/20 hover:text-black transition-colors"
                        >
                          Force Stop Loading
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-8 py-20 text-center space-y-4">
                      <p className="text-black/30 font-medium">No orders found matching your criteria.</p>
                      {orders.length === 0 && (
                        <div className="flex flex-col items-center gap-4">
                          <button 
                            onClick={seedMockData}
                            className="px-6 py-2 bg-black text-white rounded-full text-sm font-bold hover:scale-105 transition-transform"
                          >
                            Seed Mock Data
                          </button>
                          <button 
                            onClick={checkSchema}
                            className="text-xs font-bold uppercase tracking-widest text-black/20 hover:text-black transition-colors"
                          >
                            Check Table Schema
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-black/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                        <span className="font-mono text-xs font-bold text-black/40">#{order.id.slice(0, 8)}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="font-bold">{order.customer_name}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-medium">{order.customer_phone}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="w-12 h-16 bg-black/5 rounded-lg overflow-hidden shadow-sm">
                          <img src={order.image_url} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold uppercase tracking-widest text-black/40">{order.frame_type}</span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="font-bold">{order.quantity}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="font-bold">₹{order.total_amount}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-2">
                          <select 
                            value={order.payment_status}
                            onChange={(e) => updateStatus(order.id, 'payment_status', e.target.value)}
                            className={`text-[10px] font-bold uppercase tracking-widest bg-transparent border-none p-0 focus:ring-0 cursor-pointer ${order.payment_status === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Failed">Failed</option>
                          </select>
                          <select 
                            value={order.order_status}
                            onChange={(e) => updateStatus(order.id, 'order_status', e.target.value)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border-none focus:ring-0 cursor-pointer ${STATUS_COLORS[order.order_status] || 'bg-gray-100 text-gray-700'}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link 
                          to={`/admin/orders/${order.id}`}
                          className="inline-flex items-center justify-center w-10 h-10 bg-black/5 rounded-full hover:bg-black hover:text-white transition-all"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-8 py-6 bg-black/5 border-t border-black/5 flex justify-between items-center">
            <p className="text-sm text-black/40 font-medium">
              Showing <span className="text-black font-bold">{(page - 1) * itemsPerPage + 1}</span> to <span className="text-black font-bold">{Math.min(page * itemsPerPage, filteredOrders.length)}</span> of <span className="text-black font-bold">{filteredOrders.length}</span> orders
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 hover:bg-white rounded-xl transition-all disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 hover:bg-white rounded-xl transition-all disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
