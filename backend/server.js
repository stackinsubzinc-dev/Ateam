import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

app.post("/api/analyze", async (req, res) => {
  const { business_url } = req.body;
  
  if (!business_url) {
    return res.status(400).json({ error: "Missing URL" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Analyze the website URL. Return JSON: {niche, offer, weaknesses: [], outreach_message: ''}" },
        { role: "user", content: `Analyze: ${business_url}` }
      ],
      response_format: { type: "json_object" }
    });

    const aiResults = JSON.parse(response.choices[0].message.content);

    const { error } = await supabase.from('analyses').insert([{ 
      business_url: business_url, 
      results: aiResults 
    }]);

    if (error) throw error;

    res.json(aiResults);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("API Live");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```"Server running on port 10000".
