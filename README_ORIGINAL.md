# 🚀 Treasure Data Agent Integration - Complete Resource Package

> Everything you need to integrate Treasure Data LLM Agents into your Next.js application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

---

## 📦 What's Included

This repository contains a **complete working implementation** and comprehensive documentation for integrating Treasure Data LLM Agents into your application.

### 🎯 Quick Links

- **⚡ [Quick Start Guide](TD_AGENT_QUICK_START.md)** - Get running in 5 minutes
- **📚 [Full Documentation](TREASURE_DATA_AGENT_CONNECTION_GUIDE.md)** - Complete technical guide
- **🌐 [HTML Guide](TREASURE_DATA_AGENT_CONNECTION_GUIDE.html)** - Beautiful interactive guide
- **📋 [Confluence Format](TREASURE_DATA_AGENT_CONNECTION_GUIDE_CONFLUENCE.txt)** - Ready for wiki
- **🎁 [Starter Template](TD_AGENT_STARTER_TEMPLATE_README.md)** - Complete project template

---

## 🚀 Getting Started

### Option 1: Clone This Repository (Recommended)

```bash
# Clone the repository
git clone https://github.com/skwapong/paid-media-suite-demo.git
cd paid-media-suite-demo

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your TD credentials

# Run development server
npm run dev
```

### Option 2: Use as Reference

Browse the documentation and copy the files you need:
- API Routes: `pages/api/chats/`
- Client Service: `services/tdLlmService.ts`
- Components: `components/`

---

## 📁 Repository Structure

```
.
├── pages/
│   ├── api/
│   │   ├── chats.ts                    # Create chat session
│   │   └── chats/[id]/
│   │       ├── continue.ts             # Stream messages
│   │       └── history.ts              # Get chat history
│   ├── index.tsx                       # Demo home page
│   └── _app.tsx                        # Next.js app
├── services/
│   └── tdLlmService.ts                 # TD Agent client service
├── components/
│   └── ChatDemo.tsx                    # Example chat component
├── TREASURE_DATA_AGENT_CONNECTION_GUIDE.md      # Main guide (Markdown)
├── TREASURE_DATA_AGENT_CONNECTION_GUIDE.html    # Main guide (HTML)
├── TREASURE_DATA_AGENT_CONNECTION_GUIDE_CONFLUENCE.txt  # Confluence format
├── TD_AGENT_STARTER_TEMPLATE_README.md          # Complete starter template
├── TD_AGENT_QUICK_START.md                      # 5-minute quick start
├── .env.example                        # Environment template
├── package.json                        # Dependencies
├── tsconfig.json                       # TypeScript config
└── README.md                           # This file
```

---

## 📖 Documentation Overview

### 1. Quick Start Guide
**File**: `TD_AGENT_QUICK_START.md`

Perfect for developers who want to get up and running immediately:
- 5-minute setup instructions
- Essential configuration steps
- Basic usage examples
- Quick troubleshooting

### 2. Complete Connection Guide
**File**: `TREASURE_DATA_AGENT_CONNECTION_GUIDE.md`

Comprehensive technical documentation:
- Architecture overview and design patterns
- Step-by-step implementation guide
- Complete API route code
- Client service implementation
- Troubleshooting section (7+ common issues)
- Best practices for security and performance

### 3. Interactive HTML Guide
**File**: `TREASURE_DATA_AGENT_CONNECTION_GUIDE.html`

Beautiful, professional web guide:
- Intuitive navigation with sticky menu
- Color-coded information boxes
- Syntax-highlighted code blocks
- Collapsible sections
- Responsive design
- Print-friendly

**Open it**: Just double-click the HTML file or run:
```bash
open TREASURE_DATA_AGENT_CONNECTION_GUIDE.html
```

### 4. Confluence Wiki Format
**File**: `TREASURE_DATA_AGENT_CONNECTION_GUIDE_CONFLUENCE.txt`

Ready to paste into Confluence:
- Formatted panels and boxes
- Collapsible code sections
- Tables and structured content
- Copy-paste ready

### 5. Starter Template Guide
**File**: `TD_AGENT_STARTER_TEMPLATE_README.md`

Complete project template with:
- Full project structure
- All file templates (package.json, tsconfig, etc.)
- Working chat demo component
- Configuration instructions
- Deployment guides
- Customization examples

---

## ⚙️ Configuration

### Required Environment Variables

Create a `.env` file:

```bash
# Treasure Data LLM API
TD_API_KEY=1/your-api-key-here
TD_LLM_BASE_URL=https://llm-api-development.us01.treasuredata.com

# Environment
NEXT_PUBLIC_ENV=production
NODE_ENV=development
```

### Update Agent ID

In `services/tdLlmService.ts`:

```typescript
const AGENT_ID = 'your-agent-id-from-td-console'
```

---

## 🎯 Features

✅ **Complete API Implementation** - All proxy endpoints configured
✅ **Type-Safe Client Service** - Full TypeScript support
✅ **Streaming Support** - Real-time message updates
✅ **File Attachments** - Image and document upload
✅ **Error Handling** - Graceful error management
✅ **CORS Configured** - Ready for production
✅ **Security Best Practices** - API keys protected server-side
✅ **Demo Components** - Working chat interface examples
✅ **Comprehensive Docs** - Multiple format options
✅ **Production Ready** - Vercel deployment configured

---

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# TD_API_KEY, TD_LLM_BASE_URL
```

### Other Platforms

Works on any platform supporting Next.js:
- Netlify
- AWS Amplify
- Railway
- Render
- Custom Node.js server

---

## 📚 Usage Examples

### Basic Chat Implementation

```typescript
import { tdLlmService } from '@/services/tdLlmService'

async function startChat() {
  // 1. Create chat session
  const chatId = await tdLlmService.createChatSession()

  // 2. Send message and stream response
  const stream = tdLlmService.continueChatStream('Hello!')

  // 3. Process stream
  for await (const event of stream) {
    if (event.content) {
      console.log('Content:', event.content)
    } else if (event.error) {
      console.error('Error:', event.error)
    }
  }
}
```

### With File Attachments

```typescript
const attachments = [{
  binaryBase64: base64String,
  contentType: 'image/png',
  fileName: 'screenshot.png',
  attachmentType: 'image',
  inputFieldName: 'image_url'
}]

const stream = tdLlmService.continueChatStream(
  'What is in this image?',
  attachments
)
```

For more examples, see the full documentation.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript 5
- **Styling**: Emotion CSS-in-JS
- **API**: Treasure Data LLM API
- **Deployment**: Vercel

---

## 📖 Learn More

### Treasure Data Resources
- [TD Documentation](https://docs.treasuredata.com)
- TD Agent Builder (access via TD Console)
- TD LLM API Documentation

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Deployment](https://nextjs.org/docs/deployment)

---

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| "API key not configured" | Check `.env` file exists and contains `TD_API_KEY` |
| "404 Agent Not Found" | Update `AGENT_ID` in `services/tdLlmService.ts` |
| CORS errors | All API routes include CORS headers |
| Body parsing errors | Disabled body parser, uses manual parsing |
| Stream not working | Check `Accept: text/event-stream` header |
| 401 Unauthorized | Verify API key in TD console |

For detailed troubleshooting, see the [Full Documentation](TREASURE_DATA_AGENT_CONNECTION_GUIDE.md#common-issues--solutions).

---

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎉 You're Ready!

You have everything you need:

1. **✅ Working Code** - Complete implementation in this repo
2. **✅ Documentation** - Multiple formats for your preference
3. **✅ Examples** - Chat demo and usage examples
4. **✅ Templates** - Ready-to-use starter template
5. **✅ Support** - Comprehensive troubleshooting guide

### Next Steps:

1. Choose your approach (clone repo or use as reference)
2. Configure your credentials
3. Run the demo (`npm run dev`)
4. Customize for your use case
5. Deploy to production

Happy coding! 🚀

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/skwapong/paid-media-suite-demo/issues)
- **Documentation**: See guides in this repository
- **TD Support**: Contact Treasure Data support team

---

## ⭐ Star This Repository

If you found this helpful, please star the repository to help others find it!

---

_Last Updated: January 20, 2025 | Version: 1.0.0_

**Built with ❤️ for the Treasure Data community**