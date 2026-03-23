import { useState } from "react";

export default function App() {
  const [niche, setNiche] = useState("");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = "https://YOUR-RENDER-URL.onrender.com/generate-leads";

  const generateLeads = async () => {
    if (!niche) return alert("Enter a niche");

    setLoading(true);
    setLeads([]);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ niche }),
      });

      const data = await res.json();

      if (data.success) {
        setLeads(data.leads);
      } else {
        alert("Error generating leads");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 p-6">
      <h1 className="text-4xl font-bold mb-6">FIILTHY Lead Generator</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter niche (e.g. real estate)"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          className="p-2 text-black rounded w-full"
        />
        <button
          onClick={generateLeads}
          className="bg-green-500 text-black px-4 py-2 rounded"
        >
          {loading ? "Loading..." : "Generate"}
        </button>
      </div>

      <div className="grid gap-4">
        {leads.map((lead, index) => (
          <div
            key={index}
            className="border border-green-500 p-4 rounded"
          >
            <h2 className="text-xl font-bold">{lead.name}</h2>
            <p><strong>Pain:</strong> {lead.pain}</p>
            <p><strong>Score:</strong> {lead.score}</p>
            <p><strong>Urgency:</strong> {lead.urgency}</p>
            <p><strong>Outreach:</strong> {lead.outreach}</p>
          </div>
        ))}
      </div>
    </div>
  );
            }
