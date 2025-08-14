// Import necessary libraries
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Sample route
app.get('/api/hello', async (req, res) => {
	res.json({ message: 'Hello from Express and Supabase!' });
});

// Example: fetch data from Supabase
app.get('/api/users', async (req, res) => {
	const { data, error } = await supabase.from('users').select('*');
	if (error) {
		return res.status(500).json({ error: error.message });
	}
	res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
// ...existing code...
