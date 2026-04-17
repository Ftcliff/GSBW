require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.post('/api/generate', async (req, res) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY not set in .env file' });
  }
  try {
    const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));
    const userMessage = req.body.messages?.[0]?.content || '';
    const groqBody = {
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a professional Game QA bug writer for FIFA Refactor. Always respond with valid JSON only — no markdown, no code fences, no extra text before or after the JSON object. Use simple clear English. Long summaries must be at least 4 lines / 40 words.'
        },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 1600,
      temperature: 0.4
    };
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify(groqBody)
    });
    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message || JSON.stringify(data.error) });
    const text = data.choices?.[0]?.message?.content || '';
    res.json({ content: [{ type: 'text', text }] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n⚽ GSBW Server running at http://localhost:${PORT}`);
  console.log(`   Powered by Groq (FREE) — llama-3.3-70b-versatile`);
  console.log(`   GROQ_API_KEY: ${process.env.GROQ_API_KEY ? '✅ Loaded' : '❌ NOT FOUND — check your .env file'}\n`);
});
