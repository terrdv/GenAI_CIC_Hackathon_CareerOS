import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

router.get('/analyzeResume', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get('/users', async (req, res) => {
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
