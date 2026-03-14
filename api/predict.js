export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  try {
    const { name, age } = req.body;

    const prompt = `
Predict a funny future bike.

Name: ${name}
Age: ${age}

Choose bikes common in India like:
Royal Enfield, KTM Duke, Yamaha R15,
Pulsar, Apache, Splendor, Activa.

Format exactly like this:

🔮 Prediction Ready!

${name}, in some year you will buy

🏍 Bike Name

Reason:
- funny reason
- funny reason
- funny reason

Warning:
funny warning
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

    console.log("Gemini response:", JSON.stringify(data));

    const prediction =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Prediction failed. Try again.";

    res.status(200).json({
      prediction,
    });
  } catch (error) {
    console.error("API error:", error);

    res.status(500).json({
      error: "Server error",
    });
  }
}
