# Prototype with Foundry Agent

> A production-ready starter template for building interactive prototypes with Treasure Data Foundry Agents

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![TD Stylekit](https://img.shields.io/badge/TD_Stylekit-30.17-purple)](https://www.npmjs.com/package/td-stylekit)

---

## Overview

This is a complete, production-ready starter template designed for building interactive prototypes powered by **Treasure Data Foundry Agents**. Clone this repository and start building your chat-based AI applications in minutes.

### What Makes This Special

- **Ready to Use** - Complete working implementation, not just documentation
- **Battle-Tested** - Production-ready code with error handling and best practices
- **Well-Documented** - Comprehensive guides in multiple formats included
- **Fully Type-Safe** - TypeScript throughout with proper type definitions
- **Beautiful UI** - TD Stylekit integration for consistent branding
- **Easy to Customize** - Clear structure and modular components

---

## Quick Start

Get up and running in **5 minutes**:

```bash
# 1. Clone this repository
git clone https://github.com/YOUR_USERNAME/prototype-with-foundry-agent.git
cd prototype-with-foundry-agent

# 2. Install dependencies
npm install

# 3. Configure your environment
cp .env.example .env
# Edit .env and add your TD_API_KEY and TD_LLM_BASE_URL

# 4. Update your Agent ID
# Open services/tdLlmService.ts and replace the AGENT_ID

# 5. Run the development server
npm run dev

# 6. Open http://localhost:3000
```

That's it! You should now have a working prototype.

---

## What's Included

This template comes with everything you need:

### Core Features
- ✅ **Complete API Routes** - Next.js proxy endpoints for TD Agent API
- ✅ **Type-Safe Client Service** - TypeScript service for all TD operations
- ✅ **Real-Time Streaming** - Server-Sent Events (SSE) for chat responses
- ✅ **File Upload Support** - Handle images and documents
- ✅ **Chat History** - Persistent conversation management
- ✅ **Error Handling** - Comprehensive error management
- ✅ **CORS Configuration** - Pre-configured for cross-origin requests
- ✅ **Security** - API keys protected server-side
- ✅ **Authentication** - Simple password protection middleware

### UI Components
- ✅ **Chat Interface** - Working chat window with streaming
- ✅ **Agent Selector** - Switch between multiple agents
- ✅ **File Upload UI** - Drag-and-drop file attachments
- ✅ **Export Functions** - Export chat history as PDF/TXT
- ✅ **TD Stylekit Integration** - Beautiful, consistent UI components
- ✅ **Responsive Design** - Works on desktop and mobile

### Documentation
- ✅ **Complete Integration Guide** - Step-by-step instructions
- ✅ **Quick Start Guide** - Get running in 5 minutes
- ✅ **API Documentation** - All endpoints documented
- ✅ **Troubleshooting Guide** - Common issues and solutions
- ✅ **Multiple Formats** - Markdown, HTML, and Confluence versions

---

## Configuration

### Prerequisites

| Requirement | Description | Where to Obtain |
|------------|-------------|-----------------|
| **Node.js** | Version 18 or higher | [nodejs.org](https://nodejs.org) |
| **TD API Key** | Format: `1/your-api-key` | Treasure Data Console |
| **TD LLM Base URL** | API endpoint URL | TD Documentation |
| **Agent ID** | Your Foundry Agent ID | TD Agent Builder Console |

### Step 1: Environment Variables

Create a `.env` file in the project root:

```bash
# Treasure Data LLM API
TD_API_KEY=1/your-api-key-here
TD_LLM_BASE_URL=https://llm-api-development.us01.treasuredata.com

# Environment
NEXT_PUBLIC_ENV=production
NODE_ENV=development
```

### Step 2: Agent Configuration

Update the Agent ID in `services/tdLlmService.ts`:

```typescript
const AGENT_ID = 'YOUR_AGENT_ID_HERE' // Replace with your actual agent ID from TD Console
```

---

## Project Structure

```
prototype-with-foundry-agent/
├── components/                 # React components
│   ├── campaign/              # Campaign-specific components
│   │   ├── CampaignHub.tsx   # Main campaign interface
│   │   ├── ChatWindow.tsx    # Chat interface component
│   │   └── FeatureCards.tsx  # Feature display cards
│   ├── chat/                  # Chat UI components
│   │   ├── AgentSelector.tsx # Agent switching
│   │   ├── FileUpload.tsx    # File upload handling
│   │   ├── ExportMenu.tsx    # Chat export functionality
│   │   └── ...
│   ├── layout/                # Layout components
│   └── ui/                    # Reusable UI components
├── pages/                     # Next.js pages
│   ├── api/                   # API routes
│   │   ├── chats.ts          # Create chat session
│   │   └── chats/[id]/
│   │       ├── continue.ts   # Send messages & stream
│   │       └── history.ts    # Get chat history
│   ├── index.tsx              # Home page
│   ├── campaign-hub.tsx       # Campaign hub page
│   ├── login.tsx              # Authentication page
│   └── _app.tsx               # Next.js app wrapper
├── services/                  # Service layer
│   ├── tdLlmService.ts       # TD Agent API client
│   └── chatHistory.ts        # Chat history management
├── types/                     # TypeScript definitions
│   ├── agent.ts              # Agent types
│   └── chat.ts               # Chat types
├── utils/                     # Utility functions
│   ├── chatExport.ts         # Export chat as PDF/TXT
│   └── fileUpload.ts         # File handling utilities
├── public/                    # Static assets
│   ├── assets/               # Images and icons
│   └── config/               # Public configuration
├── middleware.ts              # Next.js middleware (auth)
├── .env.example              # Environment template
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript config
```

---

## Usage Examples

### Basic Chat Implementation

```typescript
import { tdLlmService } from '@/services/tdLlmService'

async function startChat() {
  // 1. Create a chat session
  const chatId = await tdLlmService.createChatSession()
  
  // 2. Send a message and stream the response
  const stream = tdLlmService.continueChatStream('Hello, agent!')
  
  // 3. Process the stream
  for await (const event of stream) {
    if (event.content) {
      console.log('Assistant:', event.content)
    } else if (event.error) {
      console.error('Error:', event.error)
    }
  }
}
```

### With File Attachments

```typescript
// Upload an image or document
const file = event.target.files[0]
const stream = tdLlmService.continueChatStream(
  'Analyze this image',
  [file]
)

for await (const event of stream) {
  if (event.content) {
    updateUI(event.content)
  }
}
```

### Switch Between Agents

```typescript
// Change the active agent
tdLlmService.setAgentId('new-agent-id-here')

// Create a new session with the new agent
const chatId = await tdLlmService.createChatSession()
```

For more examples, see the complete documentation in `TREASURE_DATA_AGENT_CONNECTION_GUIDE.md`.

---

## API Routes

### `POST /api/chats`
Create a new chat session with the TD Agent.

**Request:**
```json
{
  "agentId": "your-agent-id"
}
```

**Response:**
```json
{
  "chatId": "generated-chat-session-id"
}
```

### `POST /api/chats/[id]/continue`
Send a message and stream the agent's response using Server-Sent Events.

**Request:**
```json
{
  "message": "Your message here",
  "attachments": []
}
```

**Response:** Server-Sent Events (SSE) stream with chat content

### `GET /api/chats/[id]/history`
Retrieve the conversation history for a chat session.

**Response:**
```json
{
  "messages": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi there!" }
  ]
}
```

---

## Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
vercel
```

3. **Configure Environment Variables:**
   - Go to your Vercel project dashboard
   - Navigate to **Settings** → **Environment Variables**
   - Add the following for all environments:
     - `TD_API_KEY` - Your TD API key
     - `TD_LLM_BASE_URL` - TD LLM API base URL

4. **Deploy to Production:**
```bash
vercel --prod
```

**Important:** After adding environment variables, you must redeploy for changes to take effect.

### Other Platforms

This template works on any platform that supports Next.js:
- **Netlify** - Full Next.js support
- **AWS Amplify** - Serverless deployment
- **Railway** - Simple deployment
- **Render** - Zero-config deployment
- **Custom Server** - Any Node.js environment

---

## Customization

### Styling with TD Stylekit

This template uses TD Stylekit for consistent branding:

```typescript
import { Button, TextField, Card } from 'td-stylekit'

<Button variant="primary" onClick={handleSend}>
  Send Message
</Button>
```

See [TD Stylekit docs](https://www.npmjs.com/package/td-stylekit) for all available components.

### Adding New Pages

1. Create a new file in `pages/`
2. Export a React component
3. The file path automatically becomes the route

Example:
```typescript
// pages/my-feature.tsx
export default function MyFeature() {
  return <div>My New Feature</div>
}
// Available at /my-feature
```

### Modifying the Chat Interface

The main chat interface is in `components/campaign/ChatWindow.tsx`. Customize:
- Message rendering
- Input handling
- File upload UI
- Streaming behavior

### Adding Authentication

The template includes basic password protection via `middleware.ts`. Customize for your needs:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Add your custom authentication logic here
  // Examples: JWT, OAuth, API keys, etc.
}
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **"API key not configured"** | Verify `.env` file exists and contains `TD_API_KEY=1/your-key` |
| **"404 Agent Not Found"** | Update `AGENT_ID` in `services/tdLlmService.ts` with your actual agent ID |
| **CORS errors** | All API routes include CORS headers; check browser console for details |
| **Stream not working** | Verify `Accept: text/event-stream` header is set; check network tab |
| **Body parsing errors** | Body parser is disabled for custom content types; check API route config |
| **401 Unauthorized** | Verify API key is correct in TD console |

### Debugging Checklist

✓ Check browser console for errors  
✓ Verify network tab shows requests being sent  
✓ Confirm environment variables are loaded (restart dev server)  
✓ Test TD API credentials directly with curl/Postman  
✓ Review Vercel function logs if deployed  
✓ Ensure all dependencies are installed (`npm install`)

For detailed troubleshooting, see `TREASURE_DATA_AGENT_CONNECTION_GUIDE.md`.

---

## Documentation

Comprehensive documentation is included in this repository:

| Document | Description | Format |
|----------|-------------|--------|
| **TREASURE_DATA_AGENT_CONNECTION_GUIDE.md** | Complete integration guide | Markdown |
| **TREASURE_DATA_AGENT_CONNECTION_GUIDE.html** | Interactive web guide | HTML |
| **TD_AGENT_QUICK_START.md** | 5-minute quick start | Markdown |
| **TD_AGENT_STARTER_TEMPLATE_README.md** | Complete template documentation | Markdown |
| **TREASURE_DATA_AGENT_CONNECTION_GUIDE_CONFLUENCE.txt** | Wiki-ready format | Text |

All documentation is also available in the `public/` directory for easy web access.

---

## Tech Stack

- **Framework:** Next.js 14 (Pages Router)
- **Language:** TypeScript 5
- **UI Library:** TD Stylekit 30.17
- **State Management:** Zustand
- **Data Fetching:** React Query
- **Styling:** Emotion CSS-in-JS
- **Charts:** Recharts
- **Icons:** Lucide React
- **PDF Export:** jsPDF

---

## Resources

### Treasure Data
- [TD Console](https://console.treasuredata.com)
- [TD Documentation](https://docs.treasuredata.com)
- TD Agent Builder (access via TD Console)
- [TD Stylekit](https://www.npmjs.com/package/td-stylekit)

### Next.js
- [Next.js Documentation](https://nextjs.org/docs)
- [API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Deployment Guide](https://nextjs.org/docs/deployment)

---

## Contributing

Contributions are welcome! This template is designed to be a starting point that you can customize.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Support

- **Issues:** Report bugs or request features via GitHub Issues
- **Documentation:** See the comprehensive guides included in this repo
- **TD Support:** Contact Treasure Data support team for API-related issues

---

## License

This project is provided as-is for use with Treasure Data services.

---

## Next Steps

You're all set! Here's what to do next:

1. **✅ Configure** - Add your TD credentials to `.env`
2. **✅ Customize** - Update Agent ID in `services/tdLlmService.ts`
3. **✅ Run** - Start the dev server with `npm run dev`
4. **✅ Test** - Try the chat interface at `http://localhost:3000`
5. **✅ Build** - Customize components and pages for your use case
6. **✅ Deploy** - Push to production with Vercel

---

**Happy prototyping! 🚀**

*Last Updated: January 20, 2025 | Version: 1.0.0*

**Built with ❤️ for the Treasure Data community**
