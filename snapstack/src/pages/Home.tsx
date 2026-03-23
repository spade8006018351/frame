import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, Heart, Sparkles, Upload, Palette, Truck, Star } from 'lucide-react';

const SAMPLE_PHOTOS = [
  { id: 1, url: 'https://picsum.photos/seed/campus1/400/500', caption: 'Summer Vibes ☀️', color: '#FFFFFF' },
  { id: 2, url: 'https://picsum.photos/seed/campus2/400/500', caption: 'Besties Forever 💖', color: '#FFE4E1' },
  { id: 3, url: 'https://picsum.photos/seed/campus3/400/500', caption: 'Campus Life 🎓', color: '#E6E6FA' },
  { id: 4, url: 'https://picsum.photos/seed/campus4/400/500', caption: 'Sunset Magic ✨', color: '#FFDAB9' },
  { id: 5, url: 'https://picsum.photos/seed/campus5/400/500', caption: 'Coffee Dates ☕', color: '#B2AC88' },
  { id: 6, url: 'https://picsum.photos/seed/campus6/400/500', caption: 'Late Night Study 📚', color: '#FFFFFF' },
];

const STEPS = [
  {
    icon: <Upload className="w-6 h-6" />,
    title: "Upload",
    desc: "Pick your favorite campus memories from your gallery."
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: "Customize",
    desc: "Choose a frame that matches your aesthetic."
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Receive",
    desc: "Delivered to your hostel in 1-2 hours."
  }
];

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-12 lg:pt-32 lg:pb-24 bg-[#FDFCFB]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-24 -right-24 w-96 h-96 bg-pink-100 rounded-full blur-[100px] opacity-50" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, -5, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 -left-24 w-[500px] h-[500px] bg-purple-50 rounded-full blur-[120px] opacity-40" 
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-left space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 border border-black/5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/60">Live in Campus</span>
              </div>
              
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.85]">
                Memories <br />
                <span className="text-black/20">Made</span> <br />
                <span className="italic font-serif font-light">Tangible.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-black/50 max-w-md leading-relaxed">
                The aesthetic way to print your college life. Custom Polaroids delivered straight to your hostel room.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
                <Link
                  to="/upload"
                  className="group w-full sm:w-auto px-10 py-5 bg-black text-white rounded-full font-bold flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/20"
                >
                  Start Printing
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center gap-4 px-4 py-5">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-black/5 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                      </div>
                    ))}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">500+ Prints Today</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: -2 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 bg-white p-6 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] rounded-sm rotate-3 hover:rotate-0 transition-transform duration-700 cursor-pointer group">
                <div className="aspect-[4/5] bg-black/5 overflow-hidden mb-8">
                  <img 
                    src="https://picsum.photos/seed/hero-polaroid/800/1000" 
                    alt="Hero Polaroid" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-center font-serif italic text-3xl text-black/80">Campus Mornings ✨</p>
              </div>
              <div className="absolute -top-10 -left-10 w-64 h-80 bg-white p-4 shadow-2xl rounded-sm -rotate-12 opacity-40" />
              <div className="absolute -bottom-10 -right-10 w-64 h-80 bg-white p-4 shadow-2xl rounded-sm rotate-12 opacity-40" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            {STEPS.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative group flex flex-col items-center"
              >
                <div className="mb-8 w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 mx-auto">
                  {step.icon}
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/20">Step 0{i+1}</span>
                  <h3 className="text-2xl font-bold">{step.title}</h3>
                  <p className="text-black/50 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 -right-8 w-16 h-px bg-black/5" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Grid */}
      <section className="py-24 bg-[#FDFCFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center gap-8 mb-20">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">The Gallery.</h2>
              <p className="text-black/40 max-w-sm mx-auto">A glimpse into the memories we've helped preserve across campus.</p>
            </div>
            <Link to="/upload" className="text-sm font-bold uppercase tracking-widest underline underline-offset-8 hover:text-black/60 transition-colors">
              View All Prints
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {SAMPLE_PHOTOS.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div 
                  className="bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-sm transform transition-all duration-700 group-hover:-rotate-2 group-hover:scale-[1.02] group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)]"
                  style={{ backgroundColor: photo.color }}
                >
                  <div className="aspect-square bg-black/5 overflow-hidden mb-8">
                    <img 
                      src={photo.url} 
                      alt={photo.caption} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <p className="text-center font-serif italic text-xl text-black/70 pb-2">
                    {photo.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Bento Grid Style */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-12 bg-white/5 rounded-[40px] border border-white/10 space-y-6">
              <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-4xl font-bold tracking-tight">Aesthetic Frames for Every Mood.</h3>
              <p className="text-white/40 text-lg max-w-md">From minimal whites to vibrant patterns, our frames are designed to complement your photos perfectly.</p>
            </div>
            
            <div className="p-12 bg-white/5 rounded-[40px] border border-white/10 space-y-6">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Matte Finish.</h3>
              <p className="text-white/40">Premium quality that doesn't reflect glare and feels amazing to touch.</p>
            </div>

            <div className="p-12 bg-white/5 rounded-[40px] border border-white/10 space-y-6">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Made for Campus.</h3>
              <p className="text-white/40">We understand student life. Fast, affordable, and high-quality.</p>
            </div>

            <div className="lg:col-span-2 p-12 bg-white text-black rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4">
                <h3 className="text-4xl font-bold tracking-tight">Ready to print?</h3>
                <p className="text-black/50">Join 2000+ students who trust SnapStack.</p>
              </div>
              <Link to="/upload" className="px-12 py-5 bg-black text-white rounded-full font-bold hover:scale-105 transition-transform">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Micro-CTA */}
      <section className="py-12 border-t border-black/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/20">SnapStack © 2026 • Built for the Campus</p>
        </div>
      </section>
    </div>
  );
}
