(function () {
  const klantId = window.klantId || "standaard";

  const box = document.createElement("div");
  box.innerHTML = `
    <div id="chat-widget" style="position: fixed; bottom: 20px; right: 20px; width: 300px; background: white; border: 1px solid #ccc; padding: 10px; font-family: sans-serif; box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index:9999;">
      <h4>AI Klantenservice</h4>
      <div id="chat-log" style="height: 200px; overflow-y: auto; border: 1px solid #eee; padding: 5px; margin-bottom: 10px;"></div>
      <input id="chat-input" type="text" placeholder="Typ je vraag..." style="width: 100%;" />
      <button id="verstuur-button">Verstuur</button>
    </div>
  `;
  document.body.appendChild(box);

  document.getElementById("verstuur-button").onclick = async function () {
    const vraag = document.getElementById("chat-input").value;
    const log = document.getElementById("chat-log");

    log.innerHTML += `<div><strong>Jij:</strong> ${vraag}</div>`;

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: vraag, klantId: klantId }),
    });

    const data = await res.json();
    log.innerHTML += `<div><strong>Bot:</strong> ${data.reply || data.error}</div>`;
    log.scrollTop = log.scrollHeight;
  };
})();
