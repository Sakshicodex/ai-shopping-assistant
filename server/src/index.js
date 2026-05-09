import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import config from './config/env.js';
import chatRoutes from './routes/chat.routes.js';
import callbackRoutes from './routes/callback.routes.js';
import orderRoutes from './routes/order.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/chat', chatRoutes);
app.use('/api/callback', callbackRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve React build
const clientBuild = resolve(__dirname, '../../client/build');
app.use(express.static(clientBuild));
app.get('*', (req, res) => {
  res.sendFile(resolve(clientBuild, 'index.html'));
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
