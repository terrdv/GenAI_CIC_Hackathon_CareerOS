import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { invokeModel } from './lib/bedrock.js';

import interviewRouter from './routes/interview_route.js';
import usersRouter from './routes/users_route.js';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// healthcheck
app.get('/healthcheck', (req, res) => res.json({ message: 'OK!', code: 200 }));

// mount routers
app.use('/api/interview', interviewRouter);
app.use('/api', usersRouter); // /api/users, /api/analyzeResume, etc.

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

// Route to query Claude Sonnet via Bedrock
app.get('/api/bedrock/fruit', async (req, res) => {
    try {
        const response = await invokeModel("What is the best fruit?", null);
        // Parse and return the response
        res.json({ result: response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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

export default app; // handy for supertest later
