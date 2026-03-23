const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

// Use OpenAI class directly, no Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Health check route
app.get("/", (req, res) => {
  res.send("FIILTHY API RUNNING");
});

// Generate AI leads
app.post("/generate-leads", async (req, res) => {
  try {
    const { niche } = req.body;
    if (!niche) return res.status(400).json({ error: "Niche required" });

    const prompt = `
      Generate 5 business leads for the niche "${niche}".
      Include:
        - name
        - pain
        - score (1-10)
      Return as a valid JSON array.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 400
    });

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
