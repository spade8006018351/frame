import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { ShoppingBag, TrendingUp, Users, DollarSign, Loader2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
    growth: 12.5,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchStats() {
      try {
        setIsLoading(true);
        setError(null);
        setDebugInfo(null);
        
        console.log('Attempting to fetch orders from Supabase...');
        const { data: orders, error: fetchError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (!isMounted) return;

        if (fetchError) {
          console.error('Fetch Orders Error:', fetchError);
          setDebugInfo(`Error Code: ${fetchError.code}\nMessage: ${fetchError.message}\nDetails: ${fetchError.details || 'None'}`);
          throw new Error(fetchError.message || 'Failed to connect to the database.');
        }

        console.log('Fetched orders:', orders);
        setRecentOrders(orders?.slice(0, 5) || []);

        if (!orders || orders.length === 0) {
          console.warn('No orders found in the "orders" table.');
          setChartData([]);
          setStats({
            totalOrders: 0,
            totalRevenue: 0,
            activeUsers: 0,
            growth: 0,
          });
          return;
        }

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((acc, order) => acc + (order.total_amount || 0), 0);
        
        // Group orders by date for chart
        const grouped = orders.reduce((acc: any, order) => {
          const date = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          if (!acc[date]) acc[date] = { date, orders: 0, revenue: 0 };
          acc[date].orders += 1;
          acc[date].revenue += (order.total_amount || 0);
          return acc;
        }, {});

        setChartData(Object.values(grouped));
        setStats({
          totalOrders,
          totalRevenue,
          activeUsers: Math.floor(totalOrders * 0.8) || 0,
          growth: 15.4,
        });
      } catch (err: any) {
        if (!isMounted) return;
        console.error('Failed to fetch stats:', err);
        setError(err.message || 'An unexpected error occurred while fetching dashboard data.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchStats();
    return () => { isMounted = false; };
  }, []);

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

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
          <Loader2 className="w-12 h-12 animate-spin text-black/20" />
          <div className="text-center space-y-2">
            <p className="text-sm font-bold uppercase tracking-widest text-black/30">Loading Insights...</p>
            <p className="text-[10px] text-black/20">Checking database connection...</p>
          </div>
          <button 
            onClick={() => setIsLoading(false)}
            className="mt-4 text-[10px] font-bold uppercase tracking-widest text-black/20 hover:text-black transition-colors"
          >
            Force Stop Loading
          </button>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-6 text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Connection Error</h2>
            <p className="text-black/50 font-medium">{error}</p>
            {debugInfo && (
              <pre className="mt-4 p-4 bg-black/5 rounded-xl text-left text-xs font-mono overflow-auto max-w-full">
                {debugInfo}
              </pre>
            )}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-black text-white rounded-full font-bold hover:scale-105 transition-transform"
          >
            Retry Connection
          </button>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    { name: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-blue-500', trend: '+12%' },
    { name: 'Total Revenue', value: `₹${stats.totalRevenue}`, icon: DollarSign, color: 'bg-green-500', trend: '+8.4%' },
    { name: 'Active Users', value: stats.activeUsers, icon: Users, color: 'bg-purple-500', trend: '+24%' },
    { name: 'Growth Rate', value: `${stats.growth}%`, icon: TrendingUp, color: 'bg-orange-500', trend: '+2.1%' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-10">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-black/40 font-medium">Welcome back, Admin. Here's what's happening today.</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="bg-white border border-black/5 rounded-2xl px-6 py-3 flex items-center gap-3 shadow-sm">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-bold uppercase tracking-widest">Live System Status</span>
            </div>
            <p className="text-[10px] font-mono text-black/20">
              DB: {import.meta.env.VITE_SUPABASE_URL ? 'Connected' : 'Missing URL'} | 
              Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing'}
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        {stats.totalOrders === 0 && !error && (
          <div className="bg-black/5 border-2 border-dashed border-black/10 rounded-[40px] p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
              <ShoppingBag className="w-10 h-10 text-black/20" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">No orders yet</h2>
              <p className="text-black/40 font-medium max-w-sm mx-auto">
                Your dashboard is empty because there are no orders in the database. 
                Would you like to seed some mock data for testing?
              </p>
            </div>
            <button 
              onClick={seedMockData}
              className="px-10 py-4 bg-black text-white rounded-full font-bold hover:scale-105 transition-transform inline-flex items-center gap-3"
            >
              <TrendingUp className="w-5 h-5" />
              Seed Mock Data
            </button>
            <button 
              onClick={checkSchema}
              className="block mx-auto text-xs font-bold uppercase tracking-widest text-black/20 hover:text-black transition-colors"
            >
              Check Table Schema
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${stat.color} text-white group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <ArrowUpRight className="w-3 h-3" />
                    {stat.trend}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-black/30 mb-1">{stat.name}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Revenue Overview</h2>
              <select className="bg-black/5 border-none rounded-xl px-4 py-2 text-sm font-bold focus:ring-0">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#000000" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Order Volume</h2>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-black rounded-full"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-black/40">Daily Orders</span>
              </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} />
                  <Tooltip 
                    cursor={{fill: '#f8f8f8'}}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="orders" fill="#000000" radius={[6, 6, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-[40px] border border-black/5 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-black/5 flex justify-between items-center">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors">
              View All Orders
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/5 border-b border-black/5">
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-black/40">Customer Name</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-black/40">Phone Number</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-black/40">Image Preview</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-black/40 text-center">Quantity</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-black/40">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-black/30 font-medium">
                      No recent orders found.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-black/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                        <span className="font-bold">{order.customer_name}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-medium">{order.customer_phone}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="w-10 h-14 bg-black/5 rounded-lg overflow-hidden shadow-sm">
                          <img src={order.image_url} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="font-bold">{order.quantity}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-black/5 text-black/60`}>
                          {order.order_status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
