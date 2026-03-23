import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, ShoppingCart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useCart } from '../CartContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const { cart } = useCart();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Print', path: '/upload' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-black rounded-lg group-hover:rotate-12 transition-transform">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">SnapStack</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-black",
                  location.pathname === link.path ? "text-black" : "text-black/50"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/checkout"
              className="p-2 hover:bg-black/5 rounded-full transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-black/5 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-black/70 hover:text-black hover:bg-black/5 rounded-lg"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/checkout"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-base font-medium text-black/70 hover:text-black hover:bg-black/5 rounded-lg flex items-center justify-between"
              >
                <span>Cart</span>
                {cart.length > 0 && (
                  <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full">
                    {cart.length}
                  </span>
                )}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
