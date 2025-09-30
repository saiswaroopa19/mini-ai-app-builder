const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const promptsRoutes = require('./routes/prompts');
const dotenv = require('dotenv');
const userRouter = require('./routes/users');
const cookieParser = require('cookie-parser');
const { authenticateToken } = require('./middleware/session-authentication-middleware');

dotenv.config();

const app = express();
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
);
app.use(express.json());

// --- MongoDB (Atlas) ---
mongoose
    .connect(process.env.MONGO_URL, { dbName: 'mini_ai_app_builder' })
    .then(() => console.log('[server] Connected to MongoDB'))
    .catch((err) => console.error('[server] MongoDB connection failed:', err.message));

// --- OpenAI client ---

// --- Routes ---
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Main queries
app.use('/users', userRouter);
app.use('/prompts', authenticateToken, promptsRoutes);

app.listen(PORT, () => {
    console.log(`[server] listening on port ${PORT}`);
});
