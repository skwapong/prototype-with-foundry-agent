# Treasure Data Agent Connection Guide

A comprehensive guide on how to successfully connect to a Treasure Data Agent in your application.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Architecture](#architecture)
4. [Step-by-Step Implementation](#step-by-step-implementation)
5. [Configuration](#configuration)
6. [API Endpoints](#api-endpoints)
7. [Client-Side Integration](#client-side-integration)
8. [Common Issues & Solutions](#common-issues--solutions)
9. [Best Practices](#best-practices)

---

## Overview

This guide explains how to integrate with Treasure Data's LLM Agent API to create interactive chat experiences. The implementation uses a **proxy pattern** where your Next.js application acts as a secure intermediary between the browser and Treasure Data's API.

**Why use a proxy?**
- Keeps API keys secure on the server
- Enables CORS handling
- Provides request/response transformation
- Simplifies client-side code

---

## Prerequisites

### Required Credentials

1. **TD API Key** - Your Treasure Data API authentication key
   - Format: `1/your-api-key-here`
   - Obtain from: Treasure Data console

2. **Agent ID** - The unique identifier for your TD Agent
   - Format: `019a555a-2d62-7d98-89d7-0ec6dfcb0fdf` (UUID)
   - Obtain from: Treasure Data Agent builder

3. **Base URL** - The Treasure Data LLM API endpoint
   - Development: `https://llm-api-development.us01.treasuredata.com`
   - Production: Varies by region (e.g., `us01`, `eu01`, `ap01`)

### Environment Variables

Create a `.env` file in your project root:

```bash
# Treasure Data LLM API Configuration
TD_API_KEY=1/your-api-key-here
TD_LLM_BASE_URL=https://llm-api-development.us01.treasuredata.com

# Client-side variables (optional - not recommended for security)
NEXT_PUBLIC_TD_LLM_BASE_URL=
NEXT_PUBLIC_ENV=production
```

**Security Note:** Never expose your `TD_API_KEY` to the client side. Use server-side API routes only.

---

## Architecture

### High-Level Flow

```
┌──────────┐          ┌──────────────┐          ┌─────────────┐
│  Browser │  ────>   │   Next.js    │  ────>   │  Treasure   │
│  Client  │          │  API Routes  │          │  Data API   │
└──────────┘          └──────────────┘          └─────────────┘
     │                      │                          │
     │  1. Create chat      │                          │
     │  ──────────────────> │  Forward with API key    │
     │                      │  ──────────────────────> │
     │                      │  <────────────────────── │
     │  <────────────────── │     Return chat ID       │
     │                      │                          │
     │  2. Send message     │                          │
     │  ──────────────────> │  Stream request          │
     │                      │  ──────────────────────> │
     │  <~~~~sse stream~~~~ │  <~~~~sse stream~~~~~~~ │
     │                      │                          │
```

### Components

1. **Client Service** (`services/tdLlmService.ts`)
   - Handles chat session creation
   - Manages message streaming
   - Processes file attachments
   - Manages abort controllers

2. **API Proxy Routes** (`pages/api/`)
   - `/api/chats` - Create new chat sessions
   - `/api/chats/[id]/continue` - Send messages and stream responses
   - `/api/chats/[id]/history` - Retrieve chat history

---

## Step-by-Step Implementation

### Step 1: Create API Proxy Routes

#### 1.1 Create Chat Session Endpoint

**File:** `pages/api/chats.ts`

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';

// Disable default body parser to handle application/vnd.api+json
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to read raw request body
async function getRawBody(readable: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get credentials from environment
  const apiKey = process.env.TD_API_KEY;
  const baseUrl = process.env.TD_LLM_BASE_URL || 'https://llm-api-development.us01.treasuredata.com';

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  // Parse request body manually
  let requestBody = null;
  try {
    const rawBody = await getRawBody(req);
    requestBody = JSON.parse(rawBody.toString('utf8'));
  } catch (error) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  try {
    // Forward to TD API
    const response = await fetch(`${baseUrl}/api/chats`, {
      method: 'POST',
      headers: {
        'Authorization': `TD1 ${apiKey}`,
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      return res.status(response.status).json({
        error: 'API request failed',
        details: errorDetails,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: 'Proxy request failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
```

#### 1.2 Create Continue Chat Endpoint

**File:** `pages/api/chats/[id]/continue.ts`

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(readable: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.TD_API_KEY;
  const baseUrl = process.env.TD_LLM_BASE_URL || 'https://llm-api-development.us01.treasuredata.com';
  const { id } = req.query;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Chat ID is required' });
  }

  // Parse request body
  let requestBody = null;
  try {
    const rawBody = await getRawBody(req);
    requestBody = JSON.parse(rawBody.toString('utf8'));
  } catch (error) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  try {
    // Forward streaming request to TD API
    const response = await fetch(`${baseUrl}/api/chats/${id}/continue`, {
      method: 'POST',
      headers: {
        'Authorization': `TD1 ${apiKey}`,
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      return res.status(response.status).json({
        error: 'API request failed',
        details: errorDetails,
      });
    }

    // Stream the response back to client
    if (response.body) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', '*');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          res.write(chunk);
        }
      } finally {
        reader.releaseLock();
      }

      return res.end();
    }

    return res.status(500).json({ error: 'No response body' });
  } catch (error) {
    return res.status(500).json({
      error: 'Proxy request failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
```

#### 1.3 Create History Endpoint

**File:** `pages/api/chats/[id]/history.ts`

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.TD_API_KEY;
  const baseUrl = process.env.TD_LLM_BASE_URL || 'https://llm-api-development.us01.treasuredata.com';
  const { id } = req.query;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Chat ID is required' });
  }

  try {
    const response = await fetch(`${baseUrl}/api/chats/${id}/history`, {
      method: 'GET',
      headers: {
        'Authorization': `TD1 ${apiKey}`,
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
      },
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      return res.status(response.status).json({
        error: 'API request failed',
        details: errorDetails,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: 'Proxy request failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
```

### Step 2: Create Client Service

**File:** `services/tdLlmService.ts`

```typescript
// Type definitions
interface FileAttachment {
  binaryBase64: string        // Base64 encoded file content
  contentType: string         // MIME type (e.g., 'image/png')
  fileName: string            // Original filename
  attachmentType: 'image' | 'document'
  inputFieldName?: string     // Optional field name for images
}

interface StreamEvent {
  content?: string
  tool_call?: {
    id: string
    functionName: string
    functionArguments: string
  }
  tool_response?: {
    id: string
    content: any
    metadata?: any
  }
  error?: string
  streamingError?: boolean
  status?: number
}

// Your agent ID - replace with your actual agent ID
const AGENT_ID = '019a555a-2d62-7d98-89d7-0ec6dfcb0fdf'

class TDLLMService {
  private baseUrl: string
  private currentChatId: string | null = null
  private currentAbortController: AbortController | null = null

  constructor() {
    // Use empty baseUrl to use same-origin /api routes
    this.baseUrl = ''
  }

  private buildHeaders(stream = false): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/vnd.api+json'
    }

    if (stream) {
      headers['Accept'] = 'text/event-stream'
    }

    return headers
  }

  // Create a new chat session
  async createChatSession(): Promise<string> {
    try {
      const payload = {
        data: {
          type: 'chats',
          attributes: {
            agentId: AGENT_ID
          }
        }
      }

      const response = await fetch(`${this.baseUrl}/api/chats`, {
        method: 'POST',
        headers: this.buildHeaders(false),
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorDetails = await response.json()
        throw new Error(`Failed to create chat session: ${response.status} - ${JSON.stringify(errorDetails)}`)
      }

      const result = await response.json()
      this.currentChatId = result.data.id
      console.log('Chat session created:', this.currentChatId)

      return this.currentChatId as string
    } catch (error) {
      console.error('Failed to create chat session:', error)
      throw error
    }
  }

  // Send a message and stream the response
  async *continueChatStream(
    userMessage: string,
    attachments?: FileAttachment[]
  ): AsyncGenerator<StreamEvent, void, unknown> {
    if (!this.currentChatId) {
      throw new Error('No active chat session')
    }

    this.currentAbortController = new AbortController()

    try {
      const payload: any = {
        input: userMessage
      }

      // Add attachments if provided
      if (attachments && attachments.length > 0) {
        payload.attachments = attachments
      }

      const response = await fetch(`${this.baseUrl}/api/chats/${this.currentChatId}/continue`, {
        method: 'POST',
        headers: this.buildHeaders(true),
        body: JSON.stringify(payload),
        signal: this.currentAbortController.signal
      })

      if (!response.ok) {
        throw new Error(`Stream request failed: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No stream reader available')

      const decoder = new TextDecoder()
      let buffer = ''

      // Process the SSE stream
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Process complete lines
        while (buffer.includes('\n')) {
          const line = buffer.slice(0, buffer.indexOf('\n')).trim()
          buffer = buffer.slice(buffer.indexOf('\n') + 1)

          if (line.startsWith('data:')) {
            const eventData = line.slice(5).trim()

            if (eventData && eventData !== '[DONE]') {
              try {
                const eventJson = JSON.parse(eventData)

                // Handle errors
                if (eventJson.error) {
                  yield {
                    error: eventJson.error,
                    streamingError: true
                  }
                  return
                }

                // Handle content chunks
                if (eventJson.content) {
                  yield { content: eventJson.content }
                }

                // Handle tool calls
                if (eventJson.tool_call) {
                  yield { tool_call: eventJson.tool_call }
                }

                // Handle tool responses
                if (eventJson.tool) {
                  yield { tool_response: eventJson.tool }
                }
              } catch (e) {
                console.warn('Failed to parse stream data:', eventData)
              }
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        yield { error: 'Request cancelled', streamingError: true }
      } else {
        yield {
          error: error instanceof Error ? error.message : 'Unknown error',
          streamingError: true
        }
      }
    }
  }

  // Get chat history
  async getChatHistory(chatId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chats/${chatId}/history`, {
        method: 'GET',
        headers: this.buildHeaders(false)
      })

      if (!response.ok) {
        throw new Error(`Failed to get chat history: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to get chat history:', error)
      throw error
    }
  }

  // Abort current streaming request
  abortCurrentRequest(): void {
    if (this.currentAbortController) {
      this.currentAbortController.abort()
      this.currentAbortController = null
    }
  }

  // Reset chat session
  resetChatSession(): void {
    this.currentChatId = null
    this.abortCurrentRequest()
  }

  // Getters/Setters
  setCurrentChatId(chatId: string): void {
    this.currentChatId = chatId
  }

  getCurrentChatId(): string | null {
    return this.currentChatId
  }
}

// Export singleton instance
export const tdLlmService = new TDLLMService()
export default TDLLMService
export type { StreamEvent, FileAttachment }
```

---

## Configuration

### Environment Variables Explained

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `TD_API_KEY` | Yes | Your Treasure Data API key | `1/ea89d2d2294a812e542b0f52db328da3248c0a5f` |
| `TD_LLM_BASE_URL` | Yes | TD LLM API endpoint | `https://llm-api-development.us01.treasuredata.com` |
| `NEXT_PUBLIC_ENV` | No | Environment identifier | `production` or `development` |

### Agent Configuration

In `services/tdLlmService.ts`, update the agent ID:

```typescript
// Replace with your actual agent ID from TD Agent Builder
const AGENT_ID = '019a555a-2d62-7d98-89d7-0ec6dfcb0fdf'
```

---

## API Endpoints

### TD API Endpoints (Proxied)

#### 1. Create Chat Session

**Endpoint:** `POST /api/chats`

**Request Body:**
```json
{
  "data": {
    "type": "chats",
    "attributes": {
      "agentId": "019a555a-2d62-7d98-89d7-0ec6dfcb0fdf"
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "id": "chat-uuid-here",
    "type": "chats",
    "attributes": {
      "agentId": "019a555a-2d62-7d98-89d7-0ec6dfcb0fdf",
      "createdAt": "2024-01-20T10:00:00Z"
    }
  }
}
```

#### 2. Continue Chat (Stream Message)

**Endpoint:** `POST /api/chats/{chatId}/continue`

**Request Body:**
```json
{
  "input": "What is the weather today?",
  "attachments": [
    {
      "binaryBase64": "iVBORw0KGgoAAAANS...",
      "contentType": "image/png",
      "fileName": "screenshot.png",
      "attachmentType": "image",
      "inputFieldName": "image_url"
    }
  ]
}
```

**Response:** Server-Sent Events (SSE) stream

```
data: {"content": "The"}
data: {"content": " weather"}
data: {"content": " today"}
data: {"tool_call": {"id": "1", "functionName": "get_weather", "functionArguments": "{}"}}
data: {"tool": {"id": "1", "content": {"temp": 72}}}
data: [DONE]
```

#### 3. Get Chat History

**Endpoint:** `GET /api/chats/{chatId}/history`

**Response:**
```json
{
  "data": [
    {
      "role": "user",
      "content": "Hello",
      "timestamp": "2024-01-20T10:00:00Z"
    },
    {
      "role": "assistant",
      "content": "Hi there!",
      "timestamp": "2024-01-20T10:00:01Z"
    }
  ]
}
```

---

## Client-Side Integration

### Basic Usage Example

```typescript
import { tdLlmService } from '@/services/tdLlmService'

async function startChat() {
  try {
    // 1. Create a chat session
    const chatId = await tdLlmService.createChatSession()
    console.log('Chat created:', chatId)

    // 2. Send a message and stream the response
    const messageStream = tdLlmService.continueChatStream('Hello, how are you?')

    // 3. Process the stream
    for await (const event of messageStream) {
      if (event.content) {
        // Handle content chunks
        console.log('Content:', event.content)
      } else if (event.tool_call) {
        // Handle tool calls
        console.log('Tool call:', event.tool_call)
      } else if (event.tool_response) {
        // Handle tool responses
        console.log('Tool response:', event.tool_response)
      } else if (event.error) {
        // Handle errors
        console.error('Error:', event.error)
      }
    }
  } catch (error) {
    console.error('Chat error:', error)
  }
}
```

### With File Attachments

```typescript
async function sendMessageWithImage(imageFile: File) {
  // Convert file to base64
  const base64 = await fileToBase64(imageFile)

  const attachments = [{
    binaryBase64: base64,
    contentType: imageFile.type,
    fileName: imageFile.name,
    attachmentType: 'image' as const,
    inputFieldName: 'image_url'
  }]

  const messageStream = tdLlmService.continueChatStream(
    'What is in this image?',
    attachments
  )

  for await (const event of messageStream) {
    if (event.content) {
      console.log(event.content)
    }
  }
}

// Helper function
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
  })
}
```

### React Component Example

```typescript
import { useState, useEffect } from 'react'
import { tdLlmService } from '@/services/tdLlmService'

export default function ChatComponent() {
  const [messages, setMessages] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Initialize chat session on mount
    async function init() {
      try {
        await tdLlmService.createChatSession()
      } catch (error) {
        console.error('Failed to create chat:', error)
      }
    }
    init()
  }, [])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input
    setInput('')
    setIsLoading(true)

    // Add user message to UI
    setMessages(prev => [...prev, `User: ${userMessage}`])

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
            if (newMessages[lastIndex]?.startsWith('Assistant:')) {
              newMessages[lastIndex] = `Assistant: ${assistantMessage}`
            } else {
              newMessages.push(`Assistant: ${assistantMessage}`)
            }
            return newMessages
          })
        } else if (event.error) {
          console.error('Stream error:', event.error)
          setMessages(prev => [...prev, `Error: ${event.error}`])
        }
      }
    } catch (error) {
      console.error('Send error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div style={{ height: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        disabled={isLoading}
        placeholder="Type a message..."
      />
      <button onClick={handleSend} disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </div>
  )
}
```

---

## Common Issues & Solutions

### Issue 1: "API key not configured" Error

**Cause:** Environment variables not loaded properly

**Solution:**
```bash
# Verify .env file exists
cat .env

# Restart Next.js dev server
npm run dev

# For production, ensure environment variables are set in Vercel/deployment platform
```

### Issue 2: CORS Errors

**Cause:** Missing CORS headers in API routes

**Solution:** Ensure all API routes include:
```typescript
res.setHeader('Access-Control-Allow-Origin', '*')
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
```

### Issue 3: Body Parsing Errors

**Cause:** Vercel/Next.js doesn't parse `application/vnd.api+json` by default

**Solution:** Disable body parser and parse manually:
```typescript
export const config = {
  api: {
    bodyParser: false,
  },
}

// Use getRawBody helper function (shown in Step 1)
```

### Issue 4: Stream Not Working

**Cause:** Response headers not set for SSE

**Solution:**
```typescript
res.setHeader('Content-Type', 'text/event-stream')
res.setHeader('Cache-Control', 'no-cache')
res.setHeader('Connection', 'keep-alive')
```

### Issue 5: Chat Session Not Persisting

**Cause:** Chat ID not being stored

**Solution:**
```typescript
// Store chat ID after creation
const chatId = await tdLlmService.createChatSession()
localStorage.setItem('currentChatId', chatId)

// Or use React state
const [chatId, setChatId] = useState<string | null>(null)
```

### Issue 6: 401 Unauthorized

**Cause:** Invalid or expired API key

**Solution:**
- Verify API key in Treasure Data console
- Check key format: `TD1 1/your-api-key-here`
- Ensure key has proper permissions

### Issue 7: 404 Agent Not Found

**Cause:** Invalid agent ID

**Solution:**
- Verify agent ID in TD Agent Builder
- Ensure agent is published and active
- Check agent ID format (UUID)

---

## Best Practices

### Security

1. **Never expose API keys client-side**
   - Always use server-side API routes
   - Store credentials in environment variables
   - Use `.env.local` for local development (git-ignored)

2. **Implement authentication**
   ```typescript
   // Add authentication middleware
   if (!req.session?.user) {
     return res.status(401).json({ error: 'Unauthorized' })
   }
   ```

3. **Rate limiting**
   ```typescript
   import rateLimit from 'express-rate-limit'

   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   })
   ```

### Performance

1. **Use streaming for better UX**
   - Stream responses instead of waiting for complete response
   - Update UI incrementally as content arrives

2. **Implement proper error handling**
   ```typescript
   try {
     for await (const event of stream) {
       // Handle event
     }
   } catch (error) {
     // Graceful error handling
     console.error(error)
     showErrorToUser(error.message)
   }
   ```

3. **Abort long-running requests**
   ```typescript
   const abortButton = document.getElementById('abort')
   abortButton.onclick = () => {
     tdLlmService.abortCurrentRequest()
   }
   ```

### Code Organization

1. **Separate concerns**
   - Service layer (`tdLlmService.ts`) - API communication
   - API routes (`pages/api/*`) - Proxy endpoints
   - Components - UI logic

2. **Type safety**
   ```typescript
   // Define clear interfaces
   interface ChatMessage {
     id: string
     role: 'user' | 'assistant'
     content: string
     timestamp: Date
   }
   ```

3. **Logging**
   ```typescript
   console.log('🔍 Creating chat session...')
   console.log('✅ Chat created:', chatId)
   console.error('❌ Error:', error)
   ```

### Testing

1. **Test API routes independently**
   ```bash
   curl -X POST http://localhost:3000/api/chats \
     -H "Content-Type: application/vnd.api+json" \
     -d '{"data":{"type":"chats","attributes":{"agentId":"your-agent-id"}}}'
   ```

2. **Mock responses for unit tests**
   ```typescript
   jest.mock('@/services/tdLlmService')
   ```

3. **Monitor production logs**
   ```bash
   vercel logs --follow
   ```

---

## Summary

### Quick Checklist

- [ ] Set up environment variables (`.env`)
- [ ] Create API proxy routes (`pages/api/chats*.ts`)
- [ ] Create client service (`services/tdLlmService.ts`)
- [ ] Update agent ID in service
- [ ] Test chat session creation
- [ ] Test message streaming
- [ ] Implement error handling
- [ ] Add file attachment support (if needed)
- [ ] Deploy to production
- [ ] Monitor logs and performance

### Key Takeaways

1. **Always use server-side proxy** - Never expose API keys to the browser
2. **Handle `application/vnd.api+json`** - Disable default body parser
3. **Stream responses** - Use SSE for better UX
4. **Proper error handling** - Gracefully handle all error cases
5. **Type safety** - Use TypeScript interfaces throughout

---

## Support & Resources

- **Treasure Data Documentation:** [https://docs.treasuredata.com](https://docs.treasuredata.com)
- **TD Agent Builder:** Access via Treasure Data console
- **API Reference:** Check TD LLM API documentation
- **Community:** TD Slack channels or support forums

---

## Changelog

- **v1.0.0** (2025-01-20) - Initial guide created
  - Basic setup and configuration
  - API proxy implementation
  - Client service integration
  - Common issues and solutions
