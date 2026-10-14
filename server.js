import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API Routes
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    app: 'Pill Pal',
    timestamp: new Date().toISOString(),
  });
});

// Serve static assets from dist folder (Vite build output)
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

// SPA Fallback: return index.html for all other routes
app.get('*', (_req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

// Listen on process.env.PORT || 3000 on host 0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Pill Pal server running on http://0.0.0.0:${PORT}`);
});
