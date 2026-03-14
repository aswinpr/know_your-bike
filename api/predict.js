export default async function handler(req, res) {
  const { name, age } = req.body;

  const prompt = `
Predict a funny future bike.

Name: ${name}
Age: ${age}

Choose bikes common in India like:
Royal Enfield, KTM Duke, Yamaha R15,
Pulsar, Apache, Splendor, Activa.

Format:

🔮 Prediction Ready!

${name}, in some year you will buy

🏍 Bike name

Reason:
- funny reason
- funny reason
- funny reason

Warning:
funny warning
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

  res.status(200).json(data);
}
