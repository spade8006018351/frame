import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Plus, Minus, ShoppingBag, Check, X, ArrowRight, Loader2, Palette } from 'lucide-react';
import { PRICE_PER_PRINT } from '../constants';
import PolaroidPreview from '../components/PolaroidPreview';
import { useCart } from '../CartContext';
import confetti from 'canvas-confetti';
import { Link, useNavigate } from 'react-router-dom';
import { useFrames } from '../hooks/useFrames';
import { FrameStyle } from '../types';

export default function UploadPage() {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [showCaption, setShowCaption] = useState(false);
  const { frames, loading } = useFrames();
  const [selectedFrame, setSelectedFrame] = useState<FrameStyle | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (frames.length > 0 && !selectedFrame) {
      setSelectedFrame(frames[0]);
    }
  }, [frames, selectedFrame]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = () => {
    if (!image || !selectedFrame) return;

    addToCart({
      id: Math.random().toString(36).substr(2, 9),
      image,
      caption: showCaption ? caption : '',
      frameId: selectedFrame.id,
      frameName: selectedFrame.name,
      quantity,
      price: selectedFrame.price || PRICE_PER_PRINT,
    });

    setShowModal(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#000000', '#FFD700', '#FFC0CB']
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-black/20" />
      </div>
    );
  }

  if (frames.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="bg-black/5 rounded-[40px] py-24">
          <p className="text-3xl font-bold text-black/20 mb-6">No frames available</p>
          <p className="text-black/40 mb-8">Please check back later or contact support.</p>
          <Link to="/" className="px-12 py-4 bg-black text-white rounded-full font-bold">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        
        {/* Preview Section */}
        <div className="lg:sticky lg:top-24 space-y-6 lg:space-y-8">
          <div className="bg-[#F8F8F8] rounded-3xl p-6 lg:p-12 flex items-center justify-center min-h-[350px] lg:min-h-[500px]">
            <PolaroidPreview 
              image={image} 
              caption={showCaption ? (caption || "Your memory here...") : ''} 
              className="w-full max-w-[280px] lg:max-w-[320px]"
            />
          </div>
          
          <div className="bg-white border border-black/5 rounded-2xl p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-black/40 uppercase tracking-wider font-semibold">Total Price</p>
              <p className="text-2xl font-bold">₹{(selectedFrame?.price || PRICE_PER_PRINT) * quantity}</p>
            </div>
            <div className="flex items-center gap-4 bg-black/5 rounded-full p-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-white rounded-full transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-white rounded-full transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="space-y-10">
          <div>
            <h1 className="text-4xl font-bold mb-4">Customize Your Print</h1>
            <p className="text-black/50">Upload your photo and pick a frame that matches your memory.</p>
          </div>

          {/* Upload */}
          <div className="space-y-4">
            <label className="text-sm font-bold uppercase tracking-widest">1. Upload Photo</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-black/10 rounded-2xl p-12 text-center hover:border-black/30 transition-colors cursor-pointer group"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />
              <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <p className="font-medium">Click to upload or drag and drop</p>
              <p className="text-sm text-black/40 mt-1">PNG, JPG up to 10MB</p>
            </div>
          </div>

          {/* Caption */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold uppercase tracking-widest">2. Caption (Optional)</label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={showCaption}
                    onChange={(e) => setShowCaption(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-10 h-6 rounded-full transition-colors ${showCaption ? 'bg-black' : 'bg-black/10'}`}></div>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${showCaption ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-black/40 group-hover:text-black transition-colors">
                  Add Caption
                </span>
              </label>
            </div>
            
            <AnimatePresence>
              {showCaption && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <input 
                    type="text" 
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a short memory..."
                    className="w-full px-6 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                    maxLength={30}
                    autoFocus
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Frames */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-sm font-bold uppercase tracking-widest">3. Pick a Frame</label>
              <Link to="/frames" className="text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors">View All Styles</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {frames.map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => setSelectedFrame(frame)}
                  className={`relative aspect-[3/4] p-2 rounded-sm border-2 transition-all overflow-hidden group shadow-md hover:shadow-xl ${
                    selectedFrame?.id === frame.id 
                      ? 'border-black scale-105' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="relative w-full h-full bg-transparent overflow-hidden">
                    {frame.previewUrl && (
                      <img 
                        src={frame.previewUrl} 
                        alt={frame.name} 
                        className="absolute inset-0 w-full h-full object-cover brightness-100 contrast-100"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                  
                  {/* Selected Indicator */}
                  {selectedFrame?.id === frame.id && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center shadow-lg z-10">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 bg-white/90 text-center py-1 text-xs font-semibold">
                    {frame.name} • ₹{frame.price}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action */}
          <button
            onClick={handleAddToCart}
            disabled={!image || !selectedFrame}
            className={`w-full py-5 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all ${
              !image || !selectedFrame
                ? 'bg-black/10 text-black/30 cursor-not-allowed' 
                : 'bg-black text-white hover:scale-[1.02] active:scale-95'
            }`}
          >
            <ShoppingBag className="w-6 h-6" />
            Add to Cart
          </button>
        </div>

      </div>

      {/* Added to Cart Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              className="fixed bottom-4 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[450px] bg-white rounded-[32px] p-6 lg:p-8 shadow-2xl z-[70] overflow-hidden"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <Check className="w-10 h-10" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-2">Added to Cart!</h2>
                  <p className="text-black/50">Your memory is ready for printing.</p>
                </div>

                <div className="w-full flex gap-4 p-4 bg-[#F8F8F8] rounded-2xl items-center">
                  <div className="w-16 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                    <img src={image!} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm">{(showCaption ? caption : '') || "Untitled Memory"}</p>
                    <p className="text-xs text-black/40">Frame: {selectedFrame?.name}</p>
                    <p className="text-xs font-bold mt-1">₹{(selectedFrame?.price || PRICE_PER_PRINT) * quantity}</p>
                  </div>
                </div>

                <div className="w-full grid grid-cols-1 gap-3">
                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full py-4 bg-black text-white rounded-full font-bold flex items-center justify-center gap-2"
                  >
                    Go to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full py-4 bg-black/5 text-black rounded-full font-bold"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
