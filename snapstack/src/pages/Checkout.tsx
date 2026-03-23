import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../CartContext';
import { Trash2, ShoppingBag, CreditCard, Truck, CheckCircle2, Loader2, AlertCircle, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { supabase } from '../supabase';

export default function CheckoutPage() {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const [step, setStep] = useState<'cart' | 'details' | 'success'>('cart');
  const [isOrdering, setIsOrdering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'UPI' as 'UPI' | 'COD'
  });
  const [lastOrder, setLastOrder] = useState<any[]>([]);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsOrdering(true);
    setError(null);

    try {
      // Prepare orders for Supabase based on the requested schema
      const ordersToInsert = cart.map(item => ({
        customer_name: formData.name,
        customer_phone: formData.phone,
        address: formData.address,
        image_url: item.image,
        frame_type: item.frameName,
        quantity: item.quantity,
        total_amount: item.price * item.quantity,
        payment_status: "Pending",
        order_status: "Pending"
      }));

      const { error: supabaseError } = await supabase
        .from('orders')
        .insert(ordersToInsert);

      if (supabaseError) throw supabaseError;

      setLastOrder([...cart]);
      setStep('success');
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#000000', '#FFD700', '#FFC0CB', '#E6E6FA']
      });
      clearCart();
    } catch (err: any) {
      console.error('Order failed:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsOrdering(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 lg:py-24 space-y-12">
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto"
          >
            <CheckCircle2 className="w-12 h-12" />
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Order placed successfully!</h1>
            <p className="text-black/50 text-lg">
              Your print will be delivered within 1–2 hours.
            </p>
          </div>
        </div>

        <div className="bg-[#F8F8F8] rounded-[32px] p-8 space-y-6">
          <h2 className="text-xl font-bold">Order Summary</h2>
          <div className="space-y-4">
            {lastOrder.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <div className="w-12 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                  <img src={item.image} alt="Order item" className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-sm">{item.caption || "Untitled Memory"}</p>
                  <p className="text-xs text-black/40">Qty: {item.quantity} • {item.frameName}</p>
                </div>
                <p className="font-bold text-sm">₹{item.price * item.quantity}</p>
              </div>
            ))}
            <div className="pt-4 border-t border-black/5 flex justify-between items-center">
              <span className="font-bold">Total Paid</span>
              <span className="text-2xl font-bold">₹{lastOrder.reduce((acc, item) => acc + (item.price * item.quantity), 0)}</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/" className="inline-block px-12 py-4 bg-black text-white rounded-full font-bold hover:scale-105 transition-transform">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
        
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl lg:text-3xl font-bold">Your Print Bag</h1>
            <span className="text-black/40 font-medium">{cart.length} items</span>
          </div>

          <AnimatePresence mode="popLayout">
            {cart.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 lg:py-24 text-center border-2 border-dashed border-black/5 rounded-3xl"
              >
                <ShoppingBag className="w-10 h-10 mx-auto mb-4 text-black/10" />
                <p className="text-black/40 font-medium mb-6">Your bag is empty</p>
                <Link to="/upload" className="px-8 py-3 bg-black text-white rounded-full font-bold">
                  Start Printing
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-4 lg:space-y-6">
                {cart.map((item) => {
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex gap-4 lg:gap-6 p-3 lg:p-4 bg-white border border-black/5 rounded-2xl group"
                    >
                      <div className="w-20 h-28 lg:w-24 lg:h-32 bg-black/5 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt="Print" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow py-1 lg:py-2 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-base lg:text-lg line-clamp-1">{item.caption || "Untitled Memory"}</h3>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="p-1.5 text-black/20 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 lg:w-5 lg:h-5" />
                            </button>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-xs lg:text-sm text-black/40">Frame: {item.frameName}</p>
                            <Link to="/upload" className="text-[10px] font-bold uppercase tracking-widest underline text-black/30 hover:text-black">Edit</Link>
                          </div>
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="flex items-center gap-3 bg-black/5 rounded-full px-2 py-1">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-white rounded-full transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-white rounded-full transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="font-bold text-sm lg:text-base">₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Summary & Checkout Form */}
        <div className="space-y-6 lg:space-y-8">
          <div className="bg-[#F8F8F8] rounded-[32px] p-6 lg:p-8 space-y-6">
            <h2 className="text-xl font-bold">Order Summary</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-black/50">Subtotal</span>
                <span className="font-bold">₹{total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50">Delivery</span>
                <span className="text-green-600 font-bold uppercase tracking-widest text-xs">Free</span>
              </div>
              <div className="pt-4 border-t border-black/5 flex justify-between text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold">₹{total}</span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                onClick={() => setStep('details')}
                disabled={cart.length === 0}
                className="w-full py-4 bg-black text-white rounded-full font-bold disabled:bg-black/10 disabled:text-black/30 transition-all hover:scale-[1.02]"
              >
                Proceed to Checkout
              </button>
            ) : (
              <form onSubmit={handleOrder} className="space-y-6 pt-6 border-t border-black/5">
                <div className="space-y-4">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm font-medium"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      {error}
                    </motion.div>
                  )}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Your name"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest">Phone Number</label>
                    <input 
                      required
                      type="tel" 
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest">Delivery Location</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Hostel name, room number, or class building..."
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest">Payment Method</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, paymentMethod: 'UPI'})}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                        formData.paymentMethod === 'UPI' ? 'border-black bg-white' : 'border-transparent bg-black/5'
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      <span className="text-xs font-bold">UPI</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, paymentMethod: 'COD'})}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                        formData.paymentMethod === 'COD' ? 'border-black bg-white' : 'border-transparent bg-black/5'
                      }`}
                    >
                      <Truck className="w-5 h-5" />
                      <span className="text-xs font-bold">COD</span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isOrdering}
                  className="w-full py-4 bg-black text-white rounded-full font-bold hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isOrdering ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="w-full py-2 text-sm text-black/40 font-medium"
                >
                  Back to Bag
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
