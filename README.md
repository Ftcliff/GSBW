# ⚽ GSBW — Global Step Bug Writer
### FIFA Refactor | QA Bug Automation Platform

---

## 🚀 Quick Start (Local)

### 1. Install Node.js
Download from https://nodejs.org (LTS version)

### 2. Extract this ZIP and open the gsbw folder

### 3. Create a .env file inside the gsbw folder:
```
GROQ_API_KEY=gsk_your_key_here
PORT=3000
```

### 4. Open terminal in the gsbw folder and run:
```
npm install
npm start
```

### 5. Open browser → http://localhost:3000

---

## 🌐 Go Online FREE — Railway (No Terminal Needed at Office!)

Railway hosts your app online so your whole team can use it from any browser.

### Step 1 — Push to GitHub
1. Create a free account at https://github.com
2. Create a new repository called "gsbw"
3. Upload all files from the gsbw folder to that repo

### Step 2 — Deploy on Railway
1. Go to https://railway.app and sign up free
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your "gsbw" repo
4. Railway will auto-detect Node.js and deploy it

### Step 3 — Add your API key
1. In Railway dashboard, click your project
2. Click "Variables" tab
3. Add: GROQ_API_KEY = gsk_your_key_here
4. Railway restarts the app automatically

### Step 4 — Get your URL
Railway gives you a URL like: https://gsbw-production.up.railway.app
Share this URL with your whole team — works from any browser, anywhere!

---

## 📁 Structure
```
gsbw/
├── public/index.html    ← Football-themed frontend
├── server/server.js     ← Groq proxy server
├── package.json
├── .env                 ← Your API key (create this)
└── README.md
```
