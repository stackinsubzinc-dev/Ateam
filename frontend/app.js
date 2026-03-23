async function generateLeads() {
  const niche = document.getElementById("nicheInput").value.trim();
  if (!niche) {
    alert("Please enter a niche!");
    return;
  }

  const leadsContainer = document.getElementById("leadsContainer");
  leadsContainer.innerHTML = "<p>Generating leads...</p>";

  try {
    const res = await fetch("https://YOUR_RENDER_BACKEND_URL/generate-leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ niche })
    });

    const data = await res.json();

    if (!data.success || !data.leads) {
      leadsContainer.innerHTML = "<p>Error generating leads.</p>";
      return;
    }

    displayLeads(data.leads);
  } catch (err) {
    console.error(err);
    leadsContainer.innerHTML = "<p>Server error. Try again later.</p>";
  }
}

function displayLeads(leads) {
  const container = document.getElementById("leadsContainer");
  container.innerHTML = "";

  leads.forEach(lead => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${lead.name}</strong><br>
      Pain: ${lead.pain}<br>
      Score: ${lead.score}
    `;
    container.appendChild(div);
  });
}
