import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../supabase';
import { motion } from 'motion/react';

export default function AdminLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    // Direct bypass as requested
    navigate('/admin', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-black/10" />
    </div>
  );
}
