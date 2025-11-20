# 📦 TD Agent Starter Template

A complete, ready-to-use Next.js starter template for integrating Treasure Data LLM Agents into your application.

## 🚀 Quick Start

### Option 1: Clone from GitHub (Recommended)

```bash
# Clone the repository
git clone https://github.com/skwapong/paid-media-suite-demo.git td-agent-starter

# Navigate to the project
cd td-agent-starter

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env file with your credentials
nano .env

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see your app running!

### Option 2: Create from Scratch

Follow the step-by-step guide below to create the starter template manually.

---

## 📁 Project Structure

```
td-agent-starter/
├── pages/
│   ├── api/
│   │   ├── chats.ts                    # Create chat session endpoint
│   │   └── chats/
│   │       └── [id]/
│   │           ├── continue.ts         # Stream messages endpoint
│   │           └── history.ts          # Get chat history endpoint
│   ├── index.tsx                       # Home page with chat demo
│   └── _app.tsx                        # Next.js app wrapper
├── services/
│   └── tdLlmService.ts                 # TD Agent service client
├── components/
│   └── ChatDemo.tsx                    # Simple chat component
├── .env.example                        # Environment variables template
├── .env                                # Your actual credentials (git-ignored)
├── .gitignore                          # Git ignore file
├── package.json                        # Dependencies
├── tsconfig.json                       # TypeScript config
├── next.config.js                      # Next.js config
└── README.md                           # This file
```

---

## ⚙️ Setup Instructions

### Step 1: Create Next.js Project

```bash
npx create-next-app@latest td-agent-starter --typescript --tailwind --app=false --src-dir=false
cd td-agent-starter
```

### Step 2: Install Dependencies

```bash
npm install @emotion/react @emotion/styled
```

### Step 3: Configure Environment Variables

Create `.env` file:

```bash
# Treasure Data LLM API Configuration
TD_API_KEY=1/your-api-key-here
TD_LLM_BASE_URL=https://llm-api-development.us01.treasuredata.com

# Environment
NEXT_PUBLIC_ENV=production
NODE_ENV=development
```

Create `.env.example` template:

```bash
# Treasure Data LLM API Configuration
TD_API_KEY=1/your-api-key-here
TD_LLM_BASE_URL=https://llm-api-development.us01.treasuredata.com

# Environment
NEXT_PUBLIC_ENV=production
NODE_ENV=development
```

### Step 4: Update Agent ID

In `services/tdLlmService.ts`, replace with your agent ID:

```typescript
const AGENT_ID = 'your-agent-id-from-td-console'
```

### Step 5: Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your chat application.

---

## 📝 File Templates

### `package.json`

```json
{
  "name": "td-agent-starter",
  "version": "1.0.0",
  "description": "Treasure Data Agent Starter Template",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  }
}
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
```

### `.gitignore`

```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

### `pages/_app.tsx`

```typescript
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

### `pages/index.tsx`

```typescript
import { useState } from 'react'
import { css } from '@emotion/react'
import ChatDemo from '@/components/ChatDemo'

export default function Home() {
  return (
    <div css={css`
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
    `}>
      <div css={css`
        max-width: 800px;
        margin: 0 auto;
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        padding: 40px;
      `}>
        <h1 css={css`
          font-size: 2.5em;
          color: #6F2EFF;
          margin-bottom: 10px;
          text-align: center;
        `}>
          TD Agent Chat Demo
        </h1>
        <p css={css`
          text-align: center;
          color: #666;
          margin-bottom: 40px;
        `}>
          A simple chat interface powered by Treasure Data Agents
        </p>

        <ChatDemo />

        <div css={css`
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
          text-align: center;
          color: #666;
          font-size: 0.9em;
        `}>
          <p>Built with Next.js + Treasure Data LLM Agents</p>
          <p>For documentation, see <a href="/TREASURE_DATA_AGENT_CONNECTION_GUIDE.html" target="_blank" css={css`color: #6F2EFF;`}>the guide</a></p>
        </div>
      </div>
    </div>
  )
}
```

### `components/ChatDemo.tsx`

```typescript
import { useState, useEffect, useRef } from 'react'
import { css } from '@emotion/react'
import { tdLlmService } from '@/services/tdLlmService'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatDemo() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize chat session
    async function init() {
      try {
        await tdLlmService.createChatSession()
        setMessages([{
          role: 'assistant',
          content: 'Hello! I\'m your TD Agent assistant. How can I help you today?'
        }])
      } catch (error) {
        console.error('Failed to create chat:', error)
        setError('Failed to initialize chat. Please check your API credentials.')
      }
    }
    init()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input
    setInput('')
    setIsLoading(true)
    setError(null)

    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage
    }])

    try {
      let assistantMessage = ''
      const stream = tdLlmService.continueChatStream(userMessage)

      for await (const event of stream) {
        if (event.content) {
          assistantMessage += event.content

          // Update UI with streaming content
          setMessages(prev => {
            const newMessages = [...prev]
            const lastIndex = newMessages.length - 1

            if (newMessages[lastIndex]?.role === 'assistant') {
              newMessages[lastIndex] = {
                role: 'assistant',
                content: assistantMessage
              }
            } else {
              newMessages.push({
                role: 'assistant',
                content: assistantMessage
              })
            }
            return newMessages
          })
        } else if (event.error) {
          setError(event.error)
          console.error('Stream error:', event.error)
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setError(errorMessage)
      console.error('Send error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <div css={css`
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 20px;
        `}>
          {error}
        </div>
      )}

      <div css={css`
        height: 400px;
        overflow-y: auto;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
        background: #f8f9fa;
      `}>
        {messages.map((msg, i) => (
          <div
            key={i}
            css={css`
              margin-bottom: 16px;
              display: flex;
              justify-content: ${msg.role === 'user' ? 'flex-end' : 'flex-start'};
            `}
          >
            <div css={css`
              max-width: 70%;
              padding: 12px 16px;
              border-radius: 8px;
              background: ${msg.role === 'user' ? '#6F2EFF' : '#fff'};
              color: ${msg.role === 'user' ? '#fff' : '#333'};
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            `}>
              <div css={css`
                font-size: 0.75em;
                opacity: 0.8;
                margin-bottom: 4px;
              `}>
                {msg.role === 'user' ? 'You' : 'Assistant'}
              </div>
              <div css={css`white-space: pre-wrap;`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div css={css`
        display: flex;
        gap: 12px;
      `}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          disabled={isLoading}
          placeholder="Type your message..."
          css={css`
            flex: 1;
            padding: 12px 16px;
            border: 2px solid #dee2e6;
            border-radius: 8px;
            font-size: 16px;
            font-family: inherit;

            &:focus {
              outline: none;
              border-color: #6F2EFF;
            }

            &:disabled {
              background: #f8f9fa;
              cursor: not-allowed;
            }
          `}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          css={css`
            padding: 12px 32px;
            background: linear-gradient(135deg, #6F2EFF 0%, #1957DB 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, opacity 0.2s;

            &:hover:not(:disabled) {
              transform: translateY(-2px);
            }

            &:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }
          `}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  )
}
```

---

## 🎯 What's Included

✅ **Complete API Routes** - All proxy endpoints configured
✅ **TD Agent Service** - Ready-to-use client service
✅ **Chat Demo Component** - Working example with UI
✅ **TypeScript Support** - Full type safety
✅ **Emotion CSS** - Styled components
✅ **Environment Config** - Easy credential management
✅ **Error Handling** - Graceful error messages
✅ **Streaming Support** - Real-time message updates

---

## 🔑 Required Configuration

Before running, you **must** configure:

1. **TD API Key** - Get from Treasure Data Console
2. **TD LLM Base URL** - Development or production endpoint
3. **Agent ID** - Your agent ID from TD Agent Builder

Update these in:
- `.env` file (API key and base URL)
- `services/tdLlmService.ts` (Agent ID)

---

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# TD_API_KEY, TD_LLM_BASE_URL
```

### Deploy to Other Platforms

The starter works on any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render
- Your own server with Node.js

---

## 📚 Documentation

- **Full Guide**: See `TREASURE_DATA_AGENT_CONNECTION_GUIDE.md`
- **HTML Guide**: Open `TREASURE_DATA_AGENT_CONNECTION_GUIDE.html` in browser
- **Confluence**: Use `TREASURE_DATA_AGENT_CONNECTION_GUIDE_CONFLUENCE.txt`

---

## 🛠️ Customization

### Add More Pages

Create new pages in `pages/` directory:

```typescript
// pages/about.tsx
export default function About() {
  return <div>About Page</div>
}
```

### Customize Chat UI

Edit `components/ChatDemo.tsx` to change:
- Colors and styling
- Message bubble design
- Layout and positioning
- Add file upload support
- Add typing indicators

### Add More API Routes

Follow the same pattern in `pages/api/`:

```typescript
// pages/api/custom-endpoint.ts
export default async function handler(req, res) {
  // Your custom logic
}
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: "API key not configured"
- **Solution**: Check `.env` file exists and contains valid `TD_API_KEY`

**Issue**: "Failed to create chat session"
- **Solution**: Verify `TD_LLM_BASE_URL` is correct and reachable

**Issue**: "404 Agent Not Found"
- **Solution**: Update `AGENT_ID` in `services/tdLlmService.ts`

**Issue**: CORS errors
- **Solution**: All API routes include CORS headers, check browser console

### Debug Mode

Enable debug logging:

```typescript
// In services/tdLlmService.ts
console.log('Debug:', { /* your debug info */ })
```

---

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Treasure Data Docs](https://docs.treasuredata.com)
- [Emotion CSS](https://emotion.sh/docs/introduction)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🤝 Contributing

Found an issue or want to improve the starter template?

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - Free to use for any purpose

---

## 🎉 You're Ready!

You now have everything you need to build AI-powered chat applications with Treasure Data Agents.

**Next Steps:**
1. Set up your credentials
2. Run `npm run dev`
3. Start chatting with your agent!
4. Customize the UI to match your brand
5. Deploy to production

Happy coding! 🚀

---

## 📞 Support

- **Documentation**: Check the included guides
- **Issues**: [GitHub Issues](https://github.com/skwapong/paid-media-suite-demo/issues)
- **TD Support**: Contact Treasure Data support team

---

_Last Updated: January 20, 2025_
_Version: 1.0.0_