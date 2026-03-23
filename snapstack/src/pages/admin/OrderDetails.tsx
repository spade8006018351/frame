import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../supabase';
import { ArrowLeft, Loader2, CheckCircle2, Clock, Truck, Printer, Package, Check, AlertCircle, Download, ExternalLink } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Order, OrderStatus } from '../../types';
import { motion } from 'motion/react';

const STATUS_STEPS: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Printed', 'Shipped', 'Delivered'];

export default function AdminOrderDetails() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrder() {
      if (!id) return;
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setOrder(data);
      } catch (err) {
        console.error('Failed to fetch order:', err);
        navigate('/admin/orders');
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrder();
  }, [id, navigate]);

  const updateStatus = async (newStatus: OrderStatus) => {
    if (!id || !order) return;
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setOrder({ ...order, order_status: newStatus });
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || !order) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-black/20" />
        </div>
      </AdminLayout>
    );
  }

  const currentStepIdx = STATUS_STEPS.indexOf(order.order_status);

  return (
    <AdminLayout>
      <div className="space-y-10">
        <div className="flex justify-between items-center">
          <Link 
            to="/admin/orders"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-black/5 rounded-full font-bold text-sm hover:bg-black/10 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Image
            </button>
            <button className="px-6 py-3 bg-black text-white rounded-full font-bold text-sm hover:scale-105 transition-all flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Print Order
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Order Info */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white p-10 rounded-[40px] border border-black/5 shadow-sm space-y-10">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Order #{order.id.slice(0, 8)}</h1>
                  <p className="text-black/40 font-medium">Placed on {new Date(order.created_at).toLocaleString()}</p>
                </div>
                <span className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${
                  order.order_status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {order.order_status}
                </span>
              </div>

              {/* Status Progress */}
              <div className="relative pt-10 pb-10">
                <div className="absolute top-[52px] left-0 right-0 h-1 bg-black/5 rounded-full"></div>
                <div 
                  className="absolute top-[52px] left-0 h-1 bg-black rounded-full transition-all duration-500"
                  style={{ width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
                ></div>
                <div className="relative flex justify-between">
                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    return (
                      <div key={step} className="flex flex-col items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                          isCompleted ? 'bg-black text-white' : 'bg-white border-2 border-black/5 text-black/20'
                        } ${isCurrent ? 'ring-4 ring-black/10 scale-110' : ''}`}>
                          {isCompleted ? <Check className="w-5 h-5" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isCompleted ? 'text-black' : 'text-black/20'}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Image Preview */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Print Preview</h2>
                <div className="aspect-[3/4] max-w-sm mx-auto bg-black/5 rounded-[32px] overflow-hidden relative group">
                  <img src={order.image_url} alt="Order" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a 
                      href={order.image_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-4 bg-white rounded-full text-black hover:scale-110 transition-transform"
                    >
                      <ExternalLink className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            {/* Customer Info */}
            <div className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm space-y-6">
              <h2 className="text-xl font-bold">Customer Info</h2>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-widest text-black/30">Name</span>
                  <span className="font-bold">{order.customer_name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-widest text-black/30">Phone</span>
                  <span className="font-bold">{order.customer_phone}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-widest text-black/30">Delivery Address</span>
                  <span className="text-sm font-medium text-black/60">{order.address}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm space-y-6">
              <h2 className="text-xl font-bold">Payment Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-black/30">Status</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    order.payment_status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.payment_status}
                  </span>
                </div>
                <div className="pt-4 border-t border-black/5 flex justify-between items-center">
                  <span className="text-lg font-bold">Total Amount</span>
                  <span className="text-2xl font-bold">₹{order.total_amount}</span>
                </div>
              </div>
            </div>

            {/* Status Actions */}
            <div className="bg-black p-8 rounded-[32px] text-white space-y-6">
              <h2 className="text-xl font-bold">Update Status</h2>
              <div className="grid grid-cols-1 gap-3">
                {STATUS_STEPS.map((step) => (
                  <button
                    key={step}
                    onClick={() => updateStatus(step)}
                    disabled={isUpdating || order.order_status === step}
                    className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                      order.order_status === step 
                        ? 'bg-white/20 text-white cursor-default' 
                        : 'bg-white text-black hover:scale-[1.02]'
                    }`}
                  >
                    {isUpdating && order.order_status !== step ? 'Updating...' : `Mark as ${step}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
