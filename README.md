# 🛡️ SCAMSHIELD AI

**Don't Just Detect Scams. Understand Them.**

Analyze suspicious messages, screenshots, and links with AI and understand what makes them risky.

> Built for a student hackathon — a production-ready, Vercel-deployable AI-powered scam detection platform.

---

## 🎯 Problem

Scam messages are becoming increasingly sophisticated. People receive suspicious messages daily but often can't tell what's dangerous about them. Existing tools simply say "scam" or "not scam" without explaining **why**.

## 💡 Solution

ScamShield AI doesn't just detect scams — it **explains them**. It breaks down every suspicious message with:

- **Risk Score** — AI-assisted numerical assessment (0–100)
- **Threat Factors** — Specific elements that make the content risky
- **Evidence** — Exact quotes and observations from the content
- **Explanations** — Why each factor is concerning
- **Safe Recommendations** — Practical steps to protect yourself

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📝 **Text Analyzer** | Paste suspicious messages for instant AI analysis |
| 📸 **Screenshot Scanner** | Upload screenshots → OCR text extraction → AI analysis |
| 🔗 **URL Analyzer** | Structural analysis of suspicious links |
| 📊 **Dashboard** | Real-time analytics of your scam analyses |
| 📜 **History** | View, review, and delete past analyses |
| 🎓 **Learning Center** | Educational modules on phishing, URLs, OTPs, and more |
| 🎮 **Scam Simulator** | Practice identifying red flags in fictional scenarios |
| ⚡ **Demo Mode** | Try the app instantly with pre-built examples — no account needed |
| 🔄 **AI Fallback** | Graceful degradation with local heuristics if AI is unavailable |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│                   Vercel                      │
│                                               │
│  ┌──────────────┐    ┌───────────────────┐   │
│  │  React/Vite  │    │  Serverless API   │   │
│  │  Static Site │───▶│  /api/*           │   │
│  │  (dist/)     │    │                   │   │
│  └──────────────┘    └───────┬───────────┘   │
│                              │               │
└──────────────────────────────┼───────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
              ┌─────▼─────┐       ┌──────▼──────┐
              │  MySQL DB  │       │ Gemini API  │
              │ (External) │       │  (Google)   │
              └────────────┘       └─────────────┘
```

- **Frontend**: React + Vite → built to static files in `dist/`
- **Backend**: Vercel Serverless Functions in `/api/` directory
- **Database**: External MySQL (e.g., PlanetScale, Aiven, Railway)
- **AI**: Google Gemini API (server-side only)
- **OCR**: Tesseract.js (runs in the browser — no server dependency)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, React Router 6, CSS |
| Backend | Vercel Serverless Functions (Node.js) |
| Database | MySQL via `mysql2` (connection pooling) |
| AI | Google Gemini 1.5 Flash via `@google/generative-ai` |
| OCR | Tesseract.js 5 (browser-side) |
| Deployment | Vercel |

---

## 📁 Project Structure

```
SCAMSHIELD/
├── api/                          # Vercel Serverless Functions
│   ├── lib/
│   │   ├── cors.js               # CORS utility
│   │   ├── db.js                 # MySQL connection pool
│   │   ├── fallback.js           # Heuristic fallback analyzer
│   │   └── gemini.js             # Gemini AI integration
│   ├── analyze.js                # POST /api/analyze
│   ├── scan.js                   # POST /api/scan
│   ├── url-check.js              # POST /api/url-check
│   ├── history.js                # GET/DELETE /api/history
│   ├── dashboard.js              # GET /api/dashboard
│   └── health.js                 # GET /api/health
├── src/                          # React Frontend
│   ├── components/
│   │   ├── AnalysisResult.jsx    # Full analysis display
│   │   ├── ErrorState.jsx        # Error UI
│   │   ├── LoadingState.jsx      # Loading spinner
│   │   ├── Navbar.jsx            # Navigation bar
│   │   ├── RiskScore.jsx         # Risk score circle
│   │   └── ThreatCard.jsx        # Threat factor card
│   ├── pages/
│   │   ├── Home.jsx              # Landing page + demo
│   │   ├── Analyze.jsx           # Text analyzer
│   │   ├── Scan.jsx              # Screenshot scanner
│   │   ├── UrlCheck.jsx          # URL analyzer
│   │   ├── Dashboard.jsx         # Analytics dashboard
│   │   ├── History.jsx           # Analysis history
│   │   ├── Learn.jsx             # Learning center
│   │   ├── Simulator.jsx         # Scam simulator
│   │   └── Privacy.jsx           # Privacy policy
│   ├── data/
│   │   └── demoData.js           # Demo messages, learning modules, simulator scenarios
│   ├── services/
│   │   └── api.js                # API client (all fetch calls)
│   ├── styles/
│   │   └── global.css            # Complete stylesheet
│   ├── App.jsx                   # Router setup
│   └── main.jsx                  # Entry point
├── .env.example                  # Environment variable template
├── .gitignore                    # Git ignore rules
├── index.html                    # HTML entry point
├── package.json                  # Dependencies and scripts
├── vercel.json                   # Vercel deployment config
└── vite.config.js                # Vite configuration
```

---

## 🗄️ Database Setup

### Option 1: Aiven MySQL (Free Tier)
1. Sign up at [aiven.io](https://aiven.io)
2. Create a free MySQL service
3. Note the host, port, user, password, and database name

### Option 2: PlanetScale
1. Sign up at [planetscale.com](https://planetscale.com)
2. Create a new database
3. Get connection credentials

### Option 3: Railway
1. Sign up at [railway.app](https://railway.app)
2. Add a MySQL plugin
3. Copy connection details

### Option 4: Local MySQL (Development Only)
```sql
CREATE DATABASE scamshield;
```

> **Note**: The `analyses` table is created automatically on the first API request. No manual table creation is needed.

---

## 🔑 Environment Variables

### `.env` file (local development)

Copy the template:
```bash
cp .env.example .env
```

Fill in your values:
```env
# Google Gemini API Key (server-side only, NEVER prefix with VITE_)
GEMINI_API_KEY=your_gemini_api_key_here

# MySQL Database Configuration
DB_HOST=your-db-host.example.com
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=scamshield

# JWT Secret (for future auth features)
JWT_SECRET=your_random_secret_here
```

> ⚠️ **NEVER** commit your `.env` file. It is already in `.gitignore`.

> ⚠️ **NEVER** prefix server secrets with `VITE_` — Vite exposes those to the browser.

---

## 🖥️ Local Development

### Prerequisites
- Node.js 18+
- npm 9+
- MySQL database (local or remote)
- Google Gemini API key

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/scamshield-ai.git
cd scamshield-ai

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env
# Edit .env with your credentials

# 4. Start development server
npm run dev
```

The app runs at `http://localhost:5173`. The Vite dev server proxies `/api/*` requests to Vercel's dev server.

For full-stack local development with API functions:
```bash
# Install Vercel CLI globally (one time)
npm i -g vercel

# Run with serverless functions
vercel dev
```

---

## 🚀 Production Deployment (Vercel)

### Step-by-Step

#### 1. Get a Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key

#### 2. Set Up MySQL Database
Use any MySQL provider (Aiven, PlanetScale, Railway, etc.) and note:
- Host, Port, User, Password, Database name

#### 3. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: ScamShield AI"
git remote add origin https://github.com/YOUR_USERNAME/scamshield-ai.git
git push -u origin main
```

> ⚠️ Verify `.env` is NOT committed: `git status` should not show `.env`.

#### 4. Import to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New → Project"**
3. Import your GitHub repository
4. Vercel should auto-detect the framework

#### 5. Configure Environment Variables in Vercel
In the Vercel project settings → **Environment Variables**, add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `GEMINI_API_KEY` | `your_gemini_api_key` | Production |
| `DB_HOST` | `your-db-host.example.com` | Production |
| `DB_PORT` | `3306` | Production |
| `DB_USER` | `your_db_user` | Production |
| `DB_PASSWORD` | `your_db_password` | Production |
| `DB_NAME` | `scamshield` | Production |
| `JWT_SECRET` | `your_random_secret` | Production |

#### 6. Deploy
Click **Deploy**. Vercel will:
1. Run `vite build` to build the React frontend
2. Bundle the `/api/*` files as serverless functions
3. Serve static files from `dist/`
4. Route API calls to serverless functions
5. Rewrite all other routes to `index.html` (SPA support)

#### 7. Test Production URLs
- `https://your-app.vercel.app/` — Homepage
- `https://your-app.vercel.app/analyze` — Text Analyzer
- `https://your-app.vercel.app/scan` — Screenshot Scanner
- `https://your-app.vercel.app/api/health` — API Health Check

### Troubleshooting Deployment

| Issue | Solution |
|-------|---------|
| 404 on page refresh | Verify `vercel.json` rewrites are correct |
| API returns 500 | Check Vercel Function Logs for errors |
| "GEMINI_API_KEY not configured" | Add the variable in Vercel project settings |
| Database connection fails | Verify DB credentials and that the DB allows external connections |
| Build fails | Run `npm run build` locally to identify errors |

---

## 🔒 Security

- ✅ Gemini API key is **server-side only** — never exposed to browser
- ✅ No secrets in `VITE_` prefixed variables
- ✅ `.env` files in `.gitignore`
- ✅ Parameterized SQL queries (SQL injection prevention)
- ✅ File upload validation (type + size)
- ✅ Input length limits
- ✅ No user-facing stack traces or credentials
- ✅ CORS configured for specific origins
- ✅ OCR runs client-side (images not uploaded to server)

---

## 🔐 Privacy

- Uploaded images are processed **client-side** via OCR — they are never sent to the server
- Only extracted text is sent for analysis
- Analysis history is linked to a random session ID (no account/identity required)
- Users can delete their analysis history
- Full details on the `/privacy` page

---

## 🎬 Hackathon Demo Flow (2–3 minutes)

1. **Homepage** → Show the landing page and features
2. **Try Demo** → Click a demo message (e.g., "Fake Banking Alert")
3. **Analysis Result** → Show the 92/100 HIGH RISK score, threat factors, evidence, and recommendations
4. **Text Analyzer** → Paste a custom message and analyze it
5. **Screenshot Scanner** → Upload a screenshot → OCR → AI analysis
6. **URL Analyzer** → Check a suspicious URL like `http://amaz0n-verify.xyz`
7. **Dashboard** → Show accumulated analysis statistics
8. **Learning Center** → Show educational modules and quizzes
9. **Simulator** → Demonstrate the interactive red flag identification

---

## ⚠️ Known Limitations

- Risk scores are AI-assisted assessments, not scientifically validated probabilities
- URL analysis is structural only — it does not visit or scan the actual website
- OCR accuracy depends on image quality
- Gemini API rate limits may apply under heavy usage
- Session-based history (not account-based)
- No real-time URL reputation checking (would require external threat intelligence APIs)

---

## 🔮 Future Improvements

- User authentication with JWT
- Email analysis (header parsing)
- Real-time URL reputation checking via threat intelligence APIs
- Browser extension
- Batch analysis
- Export reports as PDF
- Multi-language support
- Community-reported scam database
- Admin dashboard with aggregate analytics

---

## 📄 License

Built for educational purposes as a student hackathon project.

---

<p align="center">
  <strong>🛡️ ScamShield AI — Don't Just Detect Scams. Understand Them.</strong>
</p>
