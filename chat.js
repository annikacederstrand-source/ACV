export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY environment variable not set' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });

    // Read as text first — prevents crash when Anthropic returns an HTML error page
    const rawBody = await response.text();
    let data;
    try {
      data = JSON.parse(rawBody);
    } catch {
      return res.status(502).json({
        error: 'Upstream returned non-JSON response',
        status: response.status,
        preview: rawBody.substring(0, 200),
      });
    }

    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Proxy failed', detail: err.message });
  }
}
