export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Alleen POST-verzoeken zijn toegestaan" });
  }

  const { message, klantId } = req.body;

  const apiKey = process.env.OPENAI_API_KEY;
  const projectId = process.env.OPENAI_PROJECT_ID;

  if (!apiKey || !projectId) {
    return res.status(500).json({ error: "API key of Project ID ontbreekt." });
  }

  // 🧠 Bepaal welke prompt bij welke klant hoort
  let klantPrompt = "Je bent een vriendelijke klantenservicebot.";

  if (klantId === "autobedrijf123") {
    klantPrompt = "Je bent de klantenservice van Autobedrijf De Jong. Wees beleefd, professioneel en duidelijk over onderhoud en afspraken.";
  }

  if (klantId === "sportschool456") {
    klantPrompt = "Je bent een sportieve en energieke chatbot van een sportschool. Antwoord motiverend en leg kort uit wat de klant wil weten.";
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "OpenAI-Project": projectId,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: klantPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error.message || "Fout van OpenAI." });
    }

    res.status(200).json({ reply: data.choices?.[0]?.message?.content || "Geen antwoord ontvangen." });
  } catch (err) {
    res.status(500).json({ error: "Fout bij communicatie met OpenAI." });
  }
}
