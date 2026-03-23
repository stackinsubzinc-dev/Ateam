const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

// Configure OpenAI with the API key from Render environment variables
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

// Basic health check
app.get("/", (req, res) => res.send("FIILTHY API RUNNING"));

// AI-powered lead generation
app.post("/generate-leads", async (req, res) => {
  try {
    const { niche } = req.body;
    if (!niche) return res.status(400).json({ error: "Niche required" });

    const prompt = `
      Generate 5 business leads for the niche "${niche}".
      Include:
        - Name
        - Pain point
        - Lead score (1-10)
        - Urgency level
        - Suggested outreach message
      Return as a valid JSON array.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 400
    });

    // Parse AI output safely
    let leads = [];
    try {
      leads = JSON.parse(response.choices[0].message.content);
    } catch {
      leads = [{ name: "Error parsing AI response", pain: "", score: 0 }];
    }

    res.json({ success: true, leads });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
