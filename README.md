# BudgetBoss

**AI-powered budget coaching that actually works.**

BudgetBoss is an intelligent financial assistant that helps you understand your spending, build better habits, and reach your money goals through conversational AI coaching.

---

## 🚀 Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Runtime**: Deno (Supabase Edge Functions)
- **AI**: Anthropic Claude (via Modal Python workers)
- **Deployment**: Vercel (frontend) + Supabase (backend)

---

## 🎨 Design System

- **Primary Brand**: Electric Blue (`#0ea5e9`)
- **Theme**: Dark mode always
- **UI**: Custom Tailwind components with Lucide icons
- **Charts**: Recharts for data visualization

---

## 📦 Setup Instructions

### Prerequisites

- Node.js 18+ (for Vite)
- Deno 1.37+ (for Supabase CLI)
- Supabase account
- Anthropic API key

### Installation

```bash
# Clone the repository
git clone https://github.com/heattechgy-glitch/level2-budgetboss.git
cd level2-budgetboss

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase URL, anon key, and Anthropic API key
```

### Environment Variables

Create a `.env` file in the root:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run Locally

```bash
# Start development server
npm run dev

# Open http://localhost:5173
```

### Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🗂️ Project Structure

```
level2-budgetboss/
├── src/
│   ├── components/        # React components
│   ├── lib/               # Supabase client, utilities
│   ├── pages/             # Route pages
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── supabase/
│   └── functions/         # Edge functions (Deno)
├── public/                # Static assets
└── index.html             # HTML entry
```

---

## 🔑 Key Features

- **AI Chat Coach**: Conversational interface powered by Claude
- **Spending Analysis**: Visual insights into your budget
- **Goal Tracking**: Set and monitor financial goals
- **Memory System**: AI remembers your context across sessions
- **Secure Auth**: Supabase authentication with magic links

---

## 🛠️ Development

### Code Style

- TypeScript strict mode enabled
- Tailwind for all styling (no inline styles)
- Dark theme enforced via `dark` class
- Electric blue (`#0ea5e9`) for primary actions

### Import Conventions

```typescript
// Supabase client
import { supabase } from "@/lib/supabaseClient";

// REST helpers
import { sbFetch, loadMemories, createMemory } from "@/lib/sbClient";

// React
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Icons
import { Zap, TrendingUp } from "lucide-react";
```

---

## 📊 Database Schema

Key tables in Supabase:

- `profiles` - User profiles and settings
- `transactions` - Financial transactions
- `goals` - User financial goals
- `memories` - AI conversation memory
- `chat_sessions` - Chat history

---

## 🤖 BOSS Architecture

This project is built and maintained by **BOSS** (autonomous AI developer).

- **Task Queue**: GitHub-backed queue system
- **Approval Flow**: Telegram integration for human oversight
- **Auto-deployment**: Vercel integration on push
- **Error Recovery**: Automatic retry with library matching

---

## 📝 License

MIT

---

## 👤 Author

Built by BOSS for Galen
Repository: `heattechgy-glitch/level2-budgetboss`