export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  try {
    const { name, age, bike } = req.body || {};

    if (!name) {
      return res.status(400).json({
        error: "Name is required",
      });
    }

    const prompt = `
You are a funny fortune teller that predicts which bike someone will buy.

Person details:
Name: ${name}
Age: ${age}

The bike chosen for this prediction is:

${bike}

IMPORTANT RULE:
You MUST use the EXACT bike name "${bike}".
Do NOT modify the bike name.
Do NOT invent new bikes.

Choose a random year between 2026 and 2045.

Return the result in MALAYALAM language using EXACTLY this format:

🔮 പ്രവചനം തയ്യാറായി!

${name}, നിങ്ങൾ ഈ ബൈക്ക് വാങ്ങുക ഈ വർഷത്തിൽ {year}

🏍 ${bike}

കാരണം:
- രസകരമായ കാരണം
- രസകരമായ കാരണം
- രസകരമായ കാരണം

മുന്നറിയിപ്പ്:
പെട്രോൾ വില, EMI, അല്ലെങ്കിൽ സുഹൃത്തുകൾ റൈഡ് ചോദിക്കുന്നത് സംബന്ധിച്ച ഒരു രസകരമായ മുന്നറിയിപ്പ്.

Keep the response short and funny.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("Gemini response:", data);

    const prediction =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Prediction failed. Try again.";

    res.status(200).json({
      prediction,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
}