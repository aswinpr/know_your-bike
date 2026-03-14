export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  try {
    const { name, age } = req.body || {};

    if (!name) {
      return res.status(400).json({
        error: "Name is required",
      });
    }

    const prompt = `
You are a funny fortune teller that predicts future bikes.

Person:
Name: ${name}
Age: ${age}

Choose ONE bike commonly found in India such as:
Royal Enfield Classic 350
KTM Duke 390
Yamaha R15
Yamaha MT-15
Bajaj Pulsar
TVS Apache
Hero Splendor
Honda Activa
Suzuki Access

Return result EXACTLY in this format:

🔮 Prediction Ready!

{name}, in the year {random year between 2026-2045} you will buy

🏍 {bike name}

Reason:
- funny reason
- funny reason
- funny reason

Warning:
funny warning
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
