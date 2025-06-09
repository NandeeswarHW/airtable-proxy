export default async function handler(req, res) {
  // ✅ CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { AIRTABLE_PAT, AIRTABLE_BASE_ID } = process.env;
  const table = req.query.table || "Delt_Waiting_List";
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${table}`;

  try {
    if (req.method === "POST") {
      const airtableResponse = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_PAT}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: req.body.fields,
        }),
      });

      const result = await airtableResponse.json();
      res.status(200).json(result);
    } else {
      // GET (fetch all records)
      const airtableResponse = await fetch(url, {
        headers: {
          Authorization: `Bearer ${AIRTABLE_PAT}`,
          "Content-Type": "application/json",
        },
      });
      const data = await airtableResponse.json();
      res.status(200).json(data);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to connect to Airtable", details: err });
  }
}
