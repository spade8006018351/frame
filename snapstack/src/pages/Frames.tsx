import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FrameCategory } from '../types';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useFrames } from '../hooks/useFrames';

const CATEGORIES: FrameCategory[] = ['Cute', 'Minimal', 'Couple'];

export default function FramesPage() {
  const [activeCategory, setActiveCategory] = useState<FrameCategory | 'All'>('All');
  const { frames, loading } = useFrames();

  const filteredFrames = activeCategory === 'All' 
    ? frames 
    : frames.filter(f => f.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-black/20" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6">Explore Our Frames</h1>
        <p className="text-black/50 max-w-xl mx-auto">
          We've curated a collection of aesthetic frames to suit every mood and memory. 
          From soft pastels to minimal classics.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-8 py-3 rounded-full font-semibold transition-all ${
            activeCategory === 'All' ? 'bg-black text-white' : 'bg-black/5 hover:bg-black/10'
          }`}
        >
          All Styles
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-8 py-3 rounded-full font-semibold transition-all ${
              activeCategory === cat ? 'bg-black text-white' : 'bg-black/5 hover:bg-black/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Frames Grid */}
      {filteredFrames.length === 0 ? (
        <div className="text-center py-24 bg-black/5 rounded-[40px]">
          <p className="text-2xl font-bold text-black/20">No frames available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {filteredFrames.map((frame, index) => (
            <motion.div
              key={frame.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500">
                <div 
                  className="absolute inset-0" 
                  style={{ backgroundColor: frame.color }}
                ></div>
                <div className="absolute inset-4 bg-black/5 rounded-sm overflow-hidden">
                  <img 
                    src={frame.previewUrl} 
                    alt={frame.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Overlay info */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center">
                  <h3 className="text-white font-bold text-xl mb-1">{frame.name}</h3>
                  <p className="text-white/70 text-xs mb-2 uppercase tracking-widest">{frame.category}</p>
                  {frame.price && (
                    <p className="text-white font-bold mb-6">₹{frame.price}</p>
                  )}
                  <Link 
                    to="/upload" 
                    className="px-6 py-2 bg-white text-black rounded-full text-sm font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    Use this frame
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
