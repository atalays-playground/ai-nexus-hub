# 🚀 AI Nexus Studio

A modern AI development workspace powered by **Google Gemini** and built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**.

---

## ✨ Features

- 🧠 **4 Specialized AI Workspaces**:
  - **Code & System Architect**: Production-grade system designs, DB schemas (PostgreSQL / Supabase), and backend API contracts.
  - **Prompt Engineer**: Crafting structured few-shot system instructions for autonomous AI agents.
  - **Executive Summarizer**: Condensing technical documents, PRs, and meeting notes into bulleted action items.
  - **Gemini Intelligence**: Real-time conversational AI and problem solving.
- ⚡ **Google Gemini Flash Powered**: High-speed, high-accuracy reasoning with automatic fallback.
- 🔒 **Secure Server-Side Execution**: API keys stay strictly on the server (`/api/ai`), never exposed to the client.
- 🎨 **Modern Dark UI**: Glassmorphic styling, Lucide icons, responsive layout, and code formatting.

---

## 🛠️ Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/atalays-playground/ai-nexus-hub.git
cd ai-nexus-hub
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_google_gemini_api_key
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deploying to Vercel

1. Push to your GitHub repository.
2. Go to [Vercel](https://vercel.com) $\rightarrow$ **Add New Project** $\rightarrow$ Select `ai-nexus-hub`.
3. In **Environment Variables**, add:
   - `GEMINI_API_KEY`: *(Your Gemini API Key)*
4. Click **Deploy**!
