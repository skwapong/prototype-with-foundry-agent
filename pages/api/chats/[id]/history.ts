import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    return res.status(200).end();
  }

  // Only allow GET
  if (req.method !== 'GET') {
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

  // Build the target URL - directly maps to /api/chats/{id}/history
  const targetUrl = `${baseUrl}/api/chats/${id}/history`;

  console.log('🔍 Get chat history:', {
    method: req.method,
    chatId: id,
    targetUrl
  });

  try {
    // Forward the request to the target API
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Authorization': `TD1 ${apiKey}`,
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
      },
    });

    console.log('📡 API Response status:', response.status);

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
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

    // Handle JSON response
    const data = await response.json();
    console.log('✅ Chat history retrieved');
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('💥 Proxy error:', error);
    return res.status(500).json({
      error: 'Proxy request failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
