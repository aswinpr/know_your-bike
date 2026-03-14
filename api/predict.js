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
You are a funny bike fortune teller.

Person details:
Name: ${name}
Age: ${age}

The selected bike is:

${bike}

STRICT RULES:
1. You MUST use the exact bike name: "${bike}"
2. Do NOT change or invent a new bike name.
3. Do NOT add extra words to the bike name.
4. The entire response must be in MALAYALAM language.

Choose a random year between 2026 and 2045.

Return EXACTLY in this format:

🔮 പ്രവചനം തയ്യാറായി!

${name}, നിങ്ങൾ ഈ ബൈക്ക് വാങ്ങുക ഈ വർഷത്തിൽ {year}

🏍 ${bike}

കാരണം:
- ഒരു രസകരമായ കാരണം
- ഒരു രസകരമായ കാരണം
- ഒരു രസകരമായ കാരണം

മുന്നറിയിപ്പ്:
ഒരു രസകരമായ മുന്നറിയിപ്പ്.

Do not change the format.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      },
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
