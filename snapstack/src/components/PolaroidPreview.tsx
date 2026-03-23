import React from 'react';
import { motion } from 'motion/react';

interface PolaroidPreviewProps {
  image: string | null;
  caption: string;
  className?: string;
}

export default function PolaroidPreview({ image, caption, className }: PolaroidPreviewProps) {
  return (
    <motion.div 
      layout
      className={`relative bg-white p-4 shadow-md hover:shadow-xl transition rounded-sm ${className} overflow-hidden border border-black/5`}
    >
      {/* Photo Area */}
      <div className="aspect-square bg-black/5 overflow-hidden relative">
        {image ? (
          <img 
            src={image} 
            alt="Preview" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-black/20 italic text-sm">
            Upload a photo
          </div>
        )}
        
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-10 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
      </div>

      {/* Caption Area */}
      <div className="pt-6 pb-2 text-center">
        <p className="font-serif italic text-lg text-black/80 min-h-[1.5em] break-words px-2">
          {caption}
        </p>
      </div>
    </motion.div>
  );
}
