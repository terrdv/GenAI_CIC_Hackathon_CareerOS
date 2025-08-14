import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import interviewRouter from './server/routes/interview_route.js';
import usersRouter from './server/routes/users_route.js';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// healthcheck
app.get('/healthcheck', (req, res) => res.json({ message: 'OK!', code: 200 }));

// mount routers
app.use('/api/interview', interviewRouter);
app.use('/api', usersRouter); // /api/users, /api/analyzeResume, etc.

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; // handy for supertest later
