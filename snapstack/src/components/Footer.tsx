import React from 'react';
import { MessageCircle, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-black/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">SnapStack</h3>
            <p className="text-black/60 max-w-sm leading-relaxed">
              We're a college-based printing brand dedicated to making your memories tangible. 
              Aesthetic, minimal, and made with love for students.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-black/60">
              <li><a href="/" className="hover:text-black transition-colors">Home</a></li>
              <li><a href="/upload" className="hover:text-black transition-colors">Print Photos</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="flex gap-4">
              <a 
                href="https://wa.me/919876543210" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-[#25D366] text-white rounded-full hover:scale-110 transition-transform"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-black text-white rounded-full hover:scale-110 transition-transform">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-black text-white rounded-full hover:scale-110 transition-transform">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-black/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-black/40">
          <p>© {new Date().getFullYear()} SnapStack. Built for the campus.</p>
        </div>
      </div>
    </footer>
  );
}
