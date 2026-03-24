// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Test route
app.get("/", (req, res) => {
  res.send("Fiilthy backend is running 🚀");
});

// Example API route
app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ result: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ error: "Failed to generate text" });
  }
});

// Example Supabase route
app.get("/users", async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    res.json({ users: data });
  } catch (error) {
    console.error("Supabase Error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
