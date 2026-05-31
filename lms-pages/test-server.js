// test-server.js
import express from 'express';

const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Test server is running!' });
});

app.post('/api/chat', (req, res) => {
  console.log('Test chat endpoint called:', req.body);
  res.json({ 
    reply: "This is a test response. Your server is working!",
    assessmentComplete: false
  });
});

app.listen(PORT, () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`);
  console.log(`📡 Test chat API: http://localhost:${PORT}/api/chat`);
});
// http://localhost:3001/api/health