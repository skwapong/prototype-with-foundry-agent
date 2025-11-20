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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    return res.status(200).end();
  }

  // Allow GET and POST
  if (req.method !== 'GET' && req.method !== 'POST') {
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

  // For GET requests, include query parameters
  const queryString = req.url?.split('?')[1] || '';
  const targetUrl = queryString
    ? `${baseUrl}/api/chats?${queryString}`
    : `${baseUrl}/api/chats`;

  // For POST, manually parse the body since we disabled bodyParser
  let requestBody = null;
  if (req.method === 'POST') {
    try {
      const rawBody = await getRawBody(req);
      const bodyText = rawBody.toString('utf8');
      requestBody = JSON.parse(bodyText);
      console.log('✅ Successfully parsed request body:', {
        contentType: req.headers['content-type'],
        bodyLength: bodyText.length,
        bodyKeys: Object.keys(requestBody)
      });
    } catch (error) {
      console.error('❌ Failed to parse request body:', error);
      return res.status(400).json({
        error: 'Invalid request body',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  console.log('🔍 Request Debug:', {
    method: req.method,
    targetUrl,
    contentType: req.headers['content-type'],
    hasBody: !!requestBody,
    bodyType: typeof requestBody,
    bodySample: requestBody ? JSON.stringify(requestBody).substring(0, 200) : 'null'
  });

  // For POST requests, ensure we have a body
  if (req.method === 'POST') {
    if (!requestBody || typeof requestBody !== 'object') {
      console.error('❌ Missing or invalid request body:', {
        requestBody,
        bodyType: typeof requestBody
      });
      return res.status(400).json({
        error: 'Request body is required',
        receivedBodyType: typeof requestBody,
        hint: 'Ensure Content-Type is application/json or application/vnd.api+json'
      });
    }
  }

  try {
    console.log('📤 Forwarding to TD API:', {
      method: req.method,
      targetUrl,
      bodyKeys: requestBody ? Object.keys(requestBody) : []
    });

    // Build fetch options based on method
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: {
        'Authorization': `TD1 ${apiKey}`,
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
      },
    };

    // Only add body for POST requests
    if (req.method === 'POST' && requestBody) {
      fetchOptions.body = JSON.stringify(requestBody);
    }

    // Forward the request to the target API
    const response = await fetch(targetUrl, fetchOptions);

    console.log('📡 TD API Response:', response.status);

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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
      console.error('❌ TD API Error:', {
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

    // Handle JSON response
    const data = await response.json();
    if (req.method === 'POST') {
      console.log('✅ Chat session created:', data.data?.id);
    } else {
      console.log('✅ Chat list retrieved:', data.data?.length, 'chats');
    }
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('💥 Proxy error:', error);
    return res.status(500).json({
      error: 'Proxy request failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
