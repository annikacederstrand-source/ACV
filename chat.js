module.exports = async function handler(req, res) {
  // Handle CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const usesWebSearch = Array.isArray(body.tools) &&
      body.tools.some(t => typeof t.type === 'string' && t.type.includes('web_search'));

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    };

    if (usesWebSearch) {
      headers['anthropic-beta'] = 'web-search-2025-03-05';
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const rawBody = await response.text();

    let data;
    try {
      data = JSON.parse(rawBody);
    } catch {
      return res.status(502).json({
        error: 'Upstream returned non-JSON response',
        httpStatus: response.status,
        preview: rawBody.substring(0, 300),
      });
    }

    return res.status(response.status).json(data);

  } catch (err) {
    return res.status(500).json({ error: 'Proxy error', detail: err.message });
  }
};
