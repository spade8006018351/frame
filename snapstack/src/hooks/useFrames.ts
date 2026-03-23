import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { FrameStyle } from '../types';

export function useFrames() {
  const [frames, setFrames] = useState<FrameStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFrames = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('frames')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedFrames: FrameStyle[] = (data || []).map((f) => ({
        id: f.id,
        name: f.name,
        previewUrl: f.image_url,
        category: f.category || 'Minimal',
        color: f.color || '#FFFFFF',
        borderWidth: f.border_width || '4px',
        pattern: f.pattern || '',
        price: f.price || 49,
      }));

      setFrames(formattedFrames);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching frames:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFrames();
  }, []);

  return { frames, loading, error, refetch: fetchFrames };
}
