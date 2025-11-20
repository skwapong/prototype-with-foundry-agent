import type { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';

// Disable body parser - we'll handle it manually to support application/vnd.api+json
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to read raw body from request
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
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get the API key from environment variables
  const apiKey = process.env.TD_API_KEY;

  if (!apiKey) {
    console.error('TD_API_KEY environment variable not configured');
    return res.status(500).json({ error: 'API key not configured' });
  }

  // Get base URL from environment or use default
  const baseUrl = process.env.TD_LLM_BASE_URL || 'https://llm-api-development.us01.treasuredata.com';

  // Get the chat ID from the route parameter
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Chat ID is required' });
  }

  // Build the target URL - directly maps to /api/chats/{id}/continue
  const targetUrl = `${baseUrl}/api/chats/${id}/continue`;

  // Manually parse the body since we disabled bodyParser
  let requestBody = null;
  try {
    const rawBody = await getRawBody(req);
    const bodyText = rawBody.toString('utf8');
    requestBody = JSON.parse(bodyText);
    console.log('✅ Successfully parsed request body for continue:', {
      contentType: req.headers['content-type'],
      bodyLength: bodyText.length,
      hasInput: !!requestBody.input,
      hasAttachments: !!requestBody.attachments
    });
  } catch (error) {
    console.error('❌ Failed to parse request body:', error);
    return res.status(400).json({
      error: 'Invalid request body',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  console.log('🔍 Continue chat stream:', {
    method: req.method,
    chatId: id,
    targetUrl,
    hasBody: !!requestBody
  });

  try {
    // Forward the request to the target API
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Authorization': `TD1 ${apiKey}`,
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📡 API Response status:', response.status);

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');

    // If API returned an error, get the error details
    if (!response.ok) {
      const responseText = await response.text();
      let errorDetails;
      try {
        errorDetails = JSON.parse(responseText);
      } catch (e) {
        errorDetails = responseText;
      }
      console.error('❌ API Error:', {
        status: response.status,
        statusText: response.statusText,
        details: errorDetails
      });
      return res.status(response.status).json({
        error: 'API request failed',
        status: response.status,
        statusText: response.statusText,
        details: errorDetails,
      });
    }

    // Handle streaming responses (SSE)
    if (response.body) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

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

    // Fallback to regular JSON response if no stream
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('💥 Proxy error:', error);
    return res.status(500).json({
      error: 'Proxy request failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
