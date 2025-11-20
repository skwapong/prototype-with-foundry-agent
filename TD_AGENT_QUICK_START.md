# 🚀 TD Agent Quick Start Guide

Get up and running with Treasure Data Agents in 5 minutes!

## 📦 Download & Install

### Option 1: Clone the Repo (Fastest)

```bash
git clone https://github.com/skwapong/paid-media-suite-demo.git my-td-agent-app
cd my-td-agent-app
npm install
```

### Option 2: Start from Scratch

```bash
npx create-next-app@latest my-td-agent-app --typescript
cd my-td-agent-app
npm install @emotion/react @emotion/styled
```

## ⚙️ Configure

### 1. Create `.env` file

```bash
TD_API_KEY=1/your-api-key-here
TD_LLM_BASE_URL=https://llm-api-development.us01.treasuredata.com
```

### 2. Update Agent ID

In `services/tdLlmService.ts`:

```typescript
const AGENT_ID = 'your-agent-id-here'
```

## 🏃 Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Required Files

### API Routes

- `pages/api/chats.ts` - Create chat
- `pages/api/chats/[id]/continue.ts` - Stream messages
- `pages/api/chats/[id]/history.ts` - Get history

### Client

- `services/tdLlmService.ts` - Agent service
- `components/ChatDemo.tsx` - Chat UI

## 🎯 Basic Usage

```typescript
import { tdLlmService } from '@/services/tdLlmService'

// Create session
const chatId = await tdLlmService.createChatSession()

// Send message
const stream = tdLlmService.continueChatStream('Hello!')

// Process stream
for await (const event of stream) {
  if (event.content) {
    console.log(event.content)
  }
}
```

## 🚀 Deploy

```bash
npm i -g vercel
vercel
```

Set environment variables in Vercel dashboard:
- `TD_API_KEY`
- `TD_LLM_BASE_URL`

## 📚 Full Documentation

- **Complete Guide**: `TREASURE_DATA_AGENT_CONNECTION_GUIDE.md`
- **HTML Version**: `TREASURE_DATA_AGENT_CONNECTION_GUIDE.html`
- **Starter Template**: `TD_AGENT_STARTER_TEMPLATE_README.md`
- **Confluence**: `TREASURE_DATA_AGENT_CONNECTION_GUIDE_CONFLUENCE.txt`

## 🆘 Need Help?

**Common Issues:**

- "API key not configured" → Check `.env` file
- "404 Agent Not Found" → Update `AGENT_ID`
- CORS errors → API routes include CORS headers
- Stream not working → Check `Accept: text/event-stream` header

**Get Support:**
- GitHub: https://github.com/skwapong/paid-media-suite-demo
- Documentation: Full guides included in repo

## ✅ Checklist

- [ ] Clone/create project
- [ ] Install dependencies
- [ ] Create `.env` file
- [ ] Add API key
- [ ] Update agent ID
- [ ] Run `npm run dev`
- [ ] Test in browser
- [ ] Deploy to Vercel

---

**Ready in 5 minutes! 🎉**

For detailed information, see the full guides.
