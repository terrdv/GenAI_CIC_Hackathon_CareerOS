import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { createClient } from '@supabase/supabase-js';
const app = express();
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Healthcheck
app.get('/healthcheck', async (req, res) => {
	res.json({ message: 'OK!', code: 200 });
});

app.get('/api/analyzeResume', async (req, res) => {
	const { data, error } = await supabase.from('users').select('*');
	if (error) {
		return res.status(500).json({ error: error.message });
	}
	res.json(data);
});

app.get('/api/users', async (req, res) => {
	const { data, error } = await supabase.from('profiles').select('*');
	if (error) {
		return res.status(500).json({ error: error.message });
	}
	res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});