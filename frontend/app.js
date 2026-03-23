async function generate() {
  const niche = document.getElementById("niche").value;

  const res = await fetch("https://YOUR-RENDER-URL.onrender.com/generate-leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ niche })
  });

  const data = await res.json();
  document.getElementById("output").innerText = JSON.stringify(data, null, 2);
}
