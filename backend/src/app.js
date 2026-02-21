import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import instituteAppRoutes from './routes/instituteAppRoutes.js';

dotenv.config();

const app = express();


app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/institute-apps', instituteAppRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: err.status || 500,
        },
    });
});

export default app;
