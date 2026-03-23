import React, { useState } from 'react';
import { Plus, Trash2, Palette, Loader2, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../supabase';
import { FrameCategory } from '../../types';
import { useFrames } from '../../hooks/useFrames';

export default function AdminFrames() {
  const { frames, loading, refetch } = useFrames();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newFrame, setNewFrame] = useState({
    name: '',
    category: 'Minimal' as FrameCategory,
    color: '#FFFFFF',
    previewUrl: '',
    price: 49
  });

  const handleAddFrame = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('frames')
        .insert([{
          name: newFrame.name,
          category: newFrame.category,
          color: newFrame.color,
          image_url: newFrame.previewUrl,
          price: newFrame.price,
          id: Math.random().toString(36).substr(2, 9)
        }]);
      
      if (error) throw error;
      setShowAddModal(false);
      setNewFrame({
        name: '',
        category: 'Minimal',
        color: '#FFFFFF',
        previewUrl: '',
        price: 49
      });
      refetch();
    } catch (err) {
      console.error('Error adding frame:', err);
      alert('Failed to add frame');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFrame = async (id: string) => {
    if (!confirm('Are you sure you want to delete this frame?')) return;
    
    try {
      const { error } = await supabase
        .from('frames')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      refetch();
    } catch (err) {
      console.error('Error deleting frame:', err);
      alert('Failed to delete frame');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-10">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Frames</h1>
            <p className="text-black/40 font-medium">Manage your collection of frame styles and categories.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform"
          >
            <Plus className="w-5 h-5" />
            Add New Style
          </button>
        </div>

        {loading ? (
          <div className="py-24 flex justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-black/10" />
          </div>
        ) : frames.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-[40px] border border-dashed border-black/10">
            <p className="text-xl font-bold text-black/20">No frames available</p>
            <p className="text-sm text-black/40 mt-1">Click "Add New Style" to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {frames.map((frame) => (
              <div key={frame.id} className="bg-white rounded-[40px] border border-black/5 shadow-sm overflow-hidden group hover:shadow-2xl hover:shadow-black/5 transition-all">
                <div className="aspect-[3/4] relative p-8 bg-gray-50 flex items-center justify-center">
                  <div 
                    className="w-full h-full rounded-2xl shadow-xl transition-transform group-hover:scale-105"
                    style={{ backgroundColor: frame.color, border: frame.borderWidth ? `${frame.borderWidth} solid rgba(0,0,0,0.1)` : 'none' }}
                  >
                    <div className="w-full h-full bg-transparent rounded-sm overflow-hidden">
                      {frame.previewUrl && (
                        <img 
                          src={frame.previewUrl} 
                          alt={frame.name} 
                          className="w-full h-full object-cover brightness-100 contrast-100" 
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                      onClick={() => handleDeleteFrame(frame.id)}
                      className="p-4 bg-white rounded-full text-red-500 hover:scale-110 transition-transform"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{frame.name}</h3>
                      <p className="text-sm font-bold uppercase tracking-widest text-black/30">{frame.category}</p>
                    </div>
                    <div className="w-6 h-6 rounded-full border border-black/5" style={{ backgroundColor: frame.color }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs font-bold text-black/40">
                      <Palette className="w-4 h-4" />
                      Hex: {frame.color}
                    </div>
                    {frame.price && (
                      <p className="font-bold">₹{frame.price}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Frame Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-lg p-10 relative">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-8 right-8 p-2 hover:bg-black/5 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-3xl font-bold mb-8">Add New Frame</h2>
            
            <form onSubmit={handleAddFrame} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-black/40">Frame Name</label>
                <input 
                  required
                  type="text"
                  value={newFrame.name}
                  onChange={e => setNewFrame({...newFrame, name: e.target.value})}
                  className="w-full px-6 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5"
                  placeholder="e.g. Classic White"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-black/40">Category</label>
                  <select 
                    value={newFrame.category}
                    onChange={e => setNewFrame({...newFrame, category: e.target.value as FrameCategory})}
                    className="w-full px-6 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 appearance-none"
                  >
                    <option value="Minimal">Minimal</option>
                    <option value="Cute">Cute</option>
                    <option value="Couple">Couple</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-black/40">Color (Hex)</label>
                  <div className="flex gap-2">
                    <input 
                      type="color"
                      value={newFrame.color}
                      onChange={e => setNewFrame({...newFrame, color: e.target.value})}
                      className="w-14 h-14 bg-black/5 rounded-2xl p-1 cursor-pointer"
                    />
                    <input 
                      type="text"
                      value={newFrame.color}
                      onChange={e => setNewFrame({...newFrame, color: e.target.value})}
                      className="flex-grow px-6 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-black/40">Preview Image URL</label>
                <input 
                  required
                  type="url"
                  value={newFrame.previewUrl}
                  onChange={e => setNewFrame({...newFrame, previewUrl: e.target.value})}
                  className="w-full px-6 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5"
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-black/40">Price (₹)</label>
                <input 
                  required
                  type="number"
                  value={newFrame.price}
                  onChange={e => setNewFrame({...newFrame, price: parseInt(e.target.value)})}
                  className="w-full px-6 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5"
                />
              </div>

              <button 
                disabled={isSaving}
                className="w-full py-5 bg-black text-white rounded-full font-bold text-lg hover:scale-[1.02] transition-all disabled:bg-black/20 flex items-center justify-center gap-2"
              >
                {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Save Frame Style'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
