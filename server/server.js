import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import weatherRoutes from './routes/weatherRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { supabase } from './config/supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

// Routes
app.use('/api/weather', weatherRoutes);
app.use('/api/news', newsRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        // Check Supabase connection by doing a simple query
        const { data, error } = await supabase.from('weather_records').select('id').limit(1);

        if (error) throw error;

        res.json({
            status: 'ok',
            service: 'Krishak Saarthi Weather API',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        res.status(503).json({
            status: 'error',
            service: 'Krishak Saarthi Weather API',
            database: 'disconnected',
            error: err.message
        });
    }
});

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`✅ Krishak Saarthi backend running at http://localhost:${PORT}`);
});
