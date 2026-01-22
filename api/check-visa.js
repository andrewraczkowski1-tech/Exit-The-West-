export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { passport, destination } = req.body;

  if (!passport || !destination) {
    return res.status(400).json({ error: 'Passport and destination are required' });
  }

  const apiKey = process.env.TRAVEL_BUDDY_API_KEY;
  const apiUrl = `https://travel-visa-requirements.p.rapidapi.com/visa/v2/visa/check`;

  // For testing purposes locally without full Vercel env, we might need to handle the key differently if running just via python server.
  // But for Vercel deployment, this is correct.
  // Note: The user is running a Python HTTP server locally, which won't execute this Node.js function.
  // To make this work locally for the user right now, we might need a client-side proxy or just use the key client-side TEMPORARILY
  // with a warning, or explain that the "Check" button will only work on Vercel or with `vercel dev`.
  
  // However, I will implement this as a standard Vercel function.
  
  try {
    const response = await fetch(`${apiUrl}?passport=${passport}&destination=${destination}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'travel-visa-requirements.p.rapidapi.com'
      }
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(`API responded with ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Function error:", error);
    res.status(500).json({ error: 'Failed to fetch visa data', details: error.message });
  }
}