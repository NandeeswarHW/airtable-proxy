export default async function handler(req, res) {
  const { AIRTABLE_PAT, AIRTABLE_BASE_ID } = process.env;
  const table = req.query.table;

  if (!table) {
    return res.status(400).json({ error: "Missing table name in query" });
  }

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${table}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_PAT}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  res.status(200).json(data);
}
