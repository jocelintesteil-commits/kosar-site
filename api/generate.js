// Vercel serverless function — runs server-side only.
// Keeps the Anthropic API key secret (never sent to the browser).
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY manquante sur le serveur (à configurer dans les variables d\'environnement Vercel).' });
    return;
  }

  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ error: 'prompt manquant' });
    return;
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 8000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(502).json({ error: 'Erreur API Anthropic', details: errText });
      return;
    }

    const data = await response.json();
    const textBlock = (data.content || []).find((b) => b.type === 'text');
    const text = textBlock ? textBlock.text : '';
    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: String(err) });
  }
}
