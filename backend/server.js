require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Health check
app.get("/", (req, res) => {
  res.send("FIILTHY API RUNNING");
});

// Lead generation endpoint
app.post("/generate-leads", async (req, res) => {
  try {
    const { niche } = req.body;

    if (!niche) {
      return res.status(400).json({
        success: false,
        error: "Niche is required",
      });
    }

    const prompt = `
Return ONLY a valid JSON array.

Generate 5 HIGH-QUALITY business leads for the niche "${niche}".

Each object must include:
- name (business name)
- pain (specific problem they have)
- score (1-10 based on buying intent)
- urgency (low, medium, high)
- outreach (short personalized message)

Example:
[
  {
    "name": "ABC Plumbing",
    "pain": "Not ranking on Google",
    "score": 9,
    "urgency": "high",
    "outreach": "Hey ABC Plumbing, I noticed you're not ranking locally. I can help you get more leads fast."
  }
]
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    let leads;

    try {
      leads = JSON.parse(response.choices[0].message.content);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);

      leads = [
        {
          name: "Fallback Lead",
          pain: "AI formatting issue",
          score: 5,
          urgency: "low",
          outreach: "Fallback message due to parsing error",
        },
      ];
    }

    res.json({
      success: true,
      leads,
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 FIILTHY server running on port ${PORT}`);
});
