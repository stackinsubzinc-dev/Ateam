const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("FIILTHY API RUNNING");
});

// Lead generation route (currently fake)
app.post("/generate-leads", async (req, res) => {
  try {
    const { niche } = req.body;

    if (!niche) {
      return res.status(400).json({ error: "Niche required" });
    }

    // Fake AI output (replace later)
    const leads = [
      { name: "Business 1", pain: "No website", score: 9 },
      { name: "Business 2", pain: "Low reviews", score: 8 }
    ];

    res.json({ success: true, leads });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
