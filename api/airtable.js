export default async function handler(req, res) {
  const { table, id } = req.query;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { fields } = req.body;
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  const url = id
    ? `https://api.airtable.com/v0/${baseId}/${table}/${id}`
    : `https://api.airtable.com/v0/${baseId}/${table}`;

  const method = id ? 'PATCH' : 'POST';

  try {
    const airtableRes = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields })
    });

    const data = await airtableRes.json();
    res.status(airtableRes.status).json(data);
  } catch (err) {
    console.error('Airtable Proxy Error:', err);
    res.status(500).json({ error: 'Failed to contact Airtable' });
  }
}
