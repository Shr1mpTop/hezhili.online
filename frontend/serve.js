import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5173;

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Route for English CV
app.get('/hezhili_cv_english', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'HeZhili_CV__English.pdf'));
});

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
});