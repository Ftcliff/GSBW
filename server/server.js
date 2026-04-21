require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Persistent storage for custom parents/components
const DATA_FILE = path.join(__dirname, '../data.json');

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch(e) {}
  return { customParents: [], customComps: [] };
}

function saveData(d) {
  try { fs.writeFileSync(DATA_FILE, JSON.stringify(d, null, 2)); } catch(e) {}
}

app.get('/api/data', (req, res) => res.json(loadData()));
app.post('/api/data', (req, res) => { saveData(req.body); res.json({ ok: true }); });

// Groq proxy
app.post('/api/generate', async (req, res) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GROQ_API_KEY not set in .env file or Railway Variables' });

  try {
    const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));
    const userMessage = req.body.messages?.[0]?.content || '';

    const groqBody = {
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert Game QA Engineer and bug report writer for a FIFA football video game project called "FIFA Refactor". You have 10+ years of experience writing professional bug reports.

Your job is to take whatever the tester writes — even if it is messy, informal, broken English, or incomplete — and turn it into a clean, professional, well-written bug report.

KEY BEHAVIOURS:
- Read between the lines. Understand what the tester MEANS even if they write it poorly.
- If someone writes "keeper goes out and doesnt come bak" — you understand this is a goalkeeper positioning bug.
- If someone writes "button doesnt work sumtimes" — you understand this is an intermittent input/controls issue.
- Write everything in simple, clear, natural English — like you are explaining to a colleague, not writing a legal document.
- Never use complex words when simple ones work better.
- Make every bug report sound professional, accurate and complete.
- Always respond with valid JSON only — no markdown, no code fences, no extra text whatsoever before or after the JSON.`
        },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 1800,
      temperature: 0.3
    };

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
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
  console.log(`\n🎮 GSBW running at http://localhost:${PORT}`);
  console.log(`   Powered by Groq (FREE) — llama-3.3-70b-versatile`);
  console.log(`   GROQ_API_KEY: ${process.env.GROQ_API_KEY ? '✅ Loaded' : '❌ NOT FOUND — add it to Railway Variables'}\n`);
});
